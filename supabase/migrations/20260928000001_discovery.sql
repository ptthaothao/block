-- Discovery: post counts for categories, tags and authors, and one function
-- that filters published posts for /posts, /topics/[slug] and /tags/[slug].
-- All SECURITY INVOKER: anonymous visitors only count what RLS lets them see,
-- and every query below also pins status = 'published' explicitly.

-- Published posts per category. A parent category includes its children.
create or replace function public.category_post_counts()
returns table (category_id bigint, post_count bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  with direct as (
    select p.category_id, count(*) as n
    from public.posts p
    where p.status = 'published'
    group by p.category_id
  )
  select
    c.id,
    coalesce(d.n, 0) + coalesce((
      select sum(dc.n)
      from public.categories child
      join direct dc on dc.category_id = child.id
      where child.parent_id = c.id
    ), 0)::bigint
  from public.categories c
  left join direct d on d.category_id = c.id
$$;

-- Published posts per approved tag. Tags without posts are included (count 0).
create or replace function public.tag_post_counts()
returns table (tag_id bigint, post_count bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select t.id, count(p.id)
  from public.tags t
  left join public.post_tags pt on pt.tag_id = t.id
  left join public.posts p on p.id = pt.post_id and p.status = 'published'
  where t.status = 'approved'
  group by t.id
$$;

-- Authors with at least one published post, most prolific first.
create or replace function public.author_post_counts()
returns table (username text, display_name text, avatar_url text, post_count bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select pr.username::text, pr.display_name, pr.avatar_url, count(*)
  from public.post_authors pa
  join public.posts p on p.id = pa.post_id and p.status = 'published'
  join public.profiles pr on pr.id = pa.profile_id
  group by pr.id
  order by count(*) desc, pr.display_name
$$;

-- One page of published post ids matching the filters, newest first, with the
-- total number of matches on every row. Null arguments mean "any".
--   p_category: a category slug; a parent includes its children.
--   p_tags:     any of these tag slugs.
--   p_levels:   any of these levels.
--   p_author:   a profile username.
create or replace function public.filter_posts(
  p_category text default null,
  p_tags text[] default null,
  p_levels public.post_level[] default null,
  p_author text default null,
  p_limit int default 30,
  p_offset int default 0
)
returns table (id uuid, total_count bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select p.id, count(*) over ()
  from public.posts p
  where p.status = 'published'
    and (p_category is null or p.category_id in (
      select c.id from public.categories c
      where c.slug = p_category
         or c.parent_id = (select c2.id from public.categories c2 where c2.slug = p_category)
    ))
    and (p_levels is null or p.level = any (p_levels))
    and (p_tags is null or exists (
      select 1 from public.post_tags pt
      join public.tags t on t.id = pt.tag_id
      where pt.post_id = p.id and t.slug = any (p_tags)
    ))
    and (p_author is null or exists (
      select 1 from public.post_authors pa
      join public.profiles pr on pr.id = pa.profile_id
      where pa.post_id = p.id and pr.username = p_author::extensions.citext
    ))
  order by p.published_at desc, p.id
  limit least(greatest(p_limit, 1), 100)
  offset greatest(p_offset, 0)
$$;

grant execute on function public.category_post_counts() to anon, authenticated;
grant execute on function public.tag_post_counts() to anon, authenticated;
grant execute on function public.author_post_counts() to anon, authenticated;
grant execute on function public.filter_posts(text, text[], public.post_level[], text, int, int) to anon, authenticated;
