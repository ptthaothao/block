-- Interests: readers follow topics (categories), tags and authors, or ask for
-- "less like this" (weight -1). get_feed ranks published posts against them.

create type public.interest_target as enum ('category', 'tag', 'author');

create table public.user_interests (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  category_id bigint references public.categories (id) on delete cascade,
  tag_id bigint references public.tags (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete cascade,
  -- +1 follow, -1 "ít nội dung như thế này hơn".
  weight smallint not null check (weight in (-1, 1)),
  created_at timestamptz not null default now(),
  constraint user_interests_one_target check (num_nonnulls(category_id, tag_id, author_id) = 1),
  constraint user_interests_no_self_follow check (author_id is distinct from user_id),
  constraint user_interests_category_unique unique (user_id, category_id),
  constraint user_interests_tag_unique unique (user_id, tag_id),
  constraint user_interests_author_unique unique (user_id, author_id)
);

create index user_interests_category_id_idx on public.user_interests (category_id) where category_id is not null;
create index user_interests_tag_id_idx on public.user_interests (tag_id) where tag_id is not null;
create index user_interests_author_id_idx on public.user_interests (author_id) where author_id is not null;

alter table public.user_interests enable row level security;

-- Only the owner ever sees or changes their interests.
create policy "users read own interests" on public.user_interests
  for select to authenticated using (user_id = (select auth.uid()));
create policy "users add own interests" on public.user_interests
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "users change own interests" on public.user_interests
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "users remove own interests" on public.user_interests
  for delete to authenticated using (user_id = (select auth.uid()));

-- Set, change or clear (p_weight = 0) one interest by slug/username.
-- SECURITY INVOKER: RLS decides; only approved tags can be followed.
create or replace function public.set_interest(p_type public.interest_target, p_slug text, p_weight smallint)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  target_category bigint;
  target_tag bigint;
  target_author uuid;
begin
  if uid is null then
    raise exception 'sign in to follow' using errcode = '42501';
  end if;
  if p_weight not in (-1, 0, 1) then
    raise exception 'weight must be -1, 0 or 1' using errcode = '22023';
  end if;

  if p_type = 'category' then
    select c.id into target_category from public.categories c where c.slug = p_slug;
  elsif p_type = 'tag' then
    select t.id into target_tag from public.tags t where t.slug = p_slug and t.status = 'approved';
  else
    select p.id into target_author from public.profiles p where p.username = p_slug::extensions.citext;
  end if;
  if coalesce(target_category::text, target_tag::text, target_author::text) is null then
    raise exception 'unknown %: %', p_type, p_slug using errcode = 'P0002';
  end if;

  delete from public.user_interests ui
  where ui.user_id = uid
    and ui.category_id is not distinct from target_category
    and ui.tag_id is not distinct from target_tag
    and ui.author_id is not distinct from target_author;

  if p_weight <> 0 then
    insert into public.user_interests (user_id, category_id, tag_id, author_id, weight)
    values (uid, target_category, target_tag, target_author, p_weight);
  end if;
end;
$$;

revoke execute on function public.set_interest(public.interest_target, text, smallint) from public, anon;
grant execute on function public.set_interest(public.interest_target, text, smallint) to authenticated;

-- How many readers follow a topic, tag or author. Only a count leaves the
-- function, so it may read past RLS (SECURITY DEFINER) to count everyone.
create or replace function public.follower_count(p_type public.interest_target, p_slug text)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)
  from public.user_interests ui
  where ui.weight = 1
    and case p_type
      when 'category' then ui.category_id = (select c.id from public.categories c where c.slug = p_slug)
      when 'tag' then ui.tag_id = (select t.id from public.tags t where t.slug = p_slug)
      else ui.author_id = (select p.id from public.profiles p where p.username = p_slug::extensions.citext)
    end
$$;

grant execute on function public.follower_count(public.interest_target, text) to anon, authenticated;

-- Engagement signal for ranking. Reactions and comments redefine it later;
-- until then every post is equally popular.
create or replace function public.post_popularity(p_post_id uuid)
returns double precision
language sql
stable
security invoker
set search_path = ''
as $$
  select 0::double precision
$$;

grant execute on function public.post_popularity(uuid) to anon, authenticated;

-- Ranked "Dành cho bạn" feed (architecture.md 8d).
--
-- p_interests: interests of a visitor who is not signed in, as
--   {"categories": [...slugs], "tags": [...], "authors": [...usernames],
--    "mutedCategories": [...], "mutedTags": [...]}.
-- When null, the signed-in user's saved interests are used.
--
-- score = (3 x topic match (a parent topic covers its children)
--        + 2 x matching tags (at most p_max_tag_matches)
--        + 2 x followed author
--        + 1 x post_popularity
--        - 5 x muted topic or tag)
--        x freshness (halves every p_half_life_days)
--
-- Matching posts and the rest are interleaved so about p_match_share of each
-- page matches, keeping readers from being locked into one corner.
create or replace function public.get_feed(
  p_interests jsonb default null,
  p_limit int default 12,
  p_offset int default 0,
  p_match_share double precision default 0.7,
  p_half_life_days double precision default 7,
  p_max_tag_matches int default 3
)
returns table (id uuid, matched boolean, reason_type public.interest_target, reason_label text, total_count bigint)
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  want_categories text[];
  want_tags text[];
  want_authors text[];
  muted_categories text[];
  muted_tags text[];
begin
  if p_interests is not null then
    want_categories := array(select jsonb_array_elements_text(coalesce(p_interests -> 'categories', '[]')));
    want_tags := array(select jsonb_array_elements_text(coalesce(p_interests -> 'tags', '[]')));
    want_authors := array(select jsonb_array_elements_text(coalesce(p_interests -> 'authors', '[]')));
    muted_categories := array(select jsonb_array_elements_text(coalesce(p_interests -> 'mutedCategories', '[]')));
    muted_tags := array(select jsonb_array_elements_text(coalesce(p_interests -> 'mutedTags', '[]')));
  elsif uid is not null then
    select
      coalesce(array_agg(c.slug) filter (where ui.weight = 1 and c.slug is not null), '{}'),
      coalesce(array_agg(t.slug) filter (where ui.weight = 1 and t.slug is not null), '{}'),
      coalesce(array_agg(pr.username::text) filter (where ui.weight = 1 and pr.username is not null), '{}'),
      coalesce(array_agg(c.slug) filter (where ui.weight = -1 and c.slug is not null), '{}'),
      coalesce(array_agg(t.slug) filter (where ui.weight = -1 and t.slug is not null), '{}')
    into want_categories, want_tags, want_authors, muted_categories, muted_tags
    from public.user_interests ui
    left join public.categories c on c.id = ui.category_id
    left join public.tags t on t.id = ui.tag_id
    left join public.profiles pr on pr.id = ui.author_id
    where ui.user_id = uid;
  end if;

  return query
  with post_facts as (
    select
      p.id,
      p.published_at,
      c.name as category_name,
      parent.name as parent_name,
      (c.slug = any (want_categories)) as child_match,
      (parent.slug = any (want_categories)) as parent_match,
      (c.slug = any (muted_categories) or parent.slug = any (muted_categories)) as category_muted,
      (
        select count(*) from public.post_tags pt join public.tags t on t.id = pt.tag_id
        where pt.post_id = p.id and t.slug = any (want_tags)
      ) as tag_hits,
      (
        select min(t.name) from public.post_tags pt join public.tags t on t.id = pt.tag_id
        where pt.post_id = p.id and t.slug = any (want_tags)
      ) as tag_name,
      exists (
        select 1 from public.post_tags pt join public.tags t on t.id = pt.tag_id
        where pt.post_id = p.id and t.slug = any (muted_tags)
      ) as tag_muted,
      (
        select min(pr.display_name) from public.post_authors pa join public.profiles pr on pr.id = pa.profile_id
        where pa.post_id = p.id and pr.username::text = any (want_authors)
      ) as author_name,
      public.post_popularity(p.id) as popularity,
      power(0.5, extract(epoch from (now() - p.published_at)) / 86400.0 / p_half_life_days) as freshness
    from public.posts p
    join public.categories c on c.id = p.category_id
    left join public.categories parent on parent.id = c.parent_id
    where p.status = 'published'
  ),
  scored as (
    select
      f.*,
      (coalesce(f.child_match, false) or coalesce(f.parent_match, false)) as topic_match,
      (coalesce(f.category_muted, false) or f.tag_muted) as muted
    from post_facts f
  ),
  ranked as (
    select
      s.id,
      s.published_at,
      (not s.muted and (s.topic_match or s.tag_hits > 0 or s.author_name is not null)) as is_match,
      (
        3 * s.topic_match::int
        + 2 * least(s.tag_hits, p_max_tag_matches)
        + 2 * (s.author_name is not null)::int
        + s.popularity
        - 5 * s.muted::int
      ) * s.freshness as score,
      case
        when s.topic_match then 'category'::public.interest_target
        when s.tag_hits > 0 then 'tag'::public.interest_target
        when s.author_name is not null then 'author'::public.interest_target
      end as why,
      case
        when coalesce(s.parent_match, false) and not coalesce(s.child_match, false) then s.parent_name
        when s.topic_match then s.category_name
        when s.tag_hits > 0 then s.tag_name
        else s.author_name
      end as why_label
    from scored s
  ),
  ordered as (
    select
      r.*,
      row_number() over (partition by r.is_match order by r.score desc, r.published_at desc, r.id) as group_rank
    from ranked r
  )
  select
    o.id,
    o.is_match,
    case when o.is_match then o.why end,
    case when o.is_match then o.why_label end,
    count(*) over ()
  from ordered o
  order by
    -- Interleave: the n-th match lands at n / share, the n-th other post at n / (1 - share).
    o.group_rank / case when o.is_match then greatest(p_match_share, 0.01) else greatest(1 - p_match_share, 0.01) end,
    o.is_match desc,
    o.published_at desc
  limit least(greatest(p_limit, 1), 50)
  offset greatest(p_offset, 0);
end;
$$;

grant execute on function public.get_feed(jsonb, int, int, double precision, double precision, int) to anon, authenticated;
