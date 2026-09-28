-- Reactions on posts (and, from the comments migration, on comments).
--
-- The emoji set is fixed and matches features/reactions/constants.ts:
--   helpful 👍 Hữu ích · love ❤️ Thích · mindblown 🤯 Mở mang · confused 🤔 Chưa hiểu

create type public.reaction_kind as enum ('helpful', 'love', 'mindblown', 'confused');
create type public.reaction_target as enum ('post', 'comment');

create table public.reactions (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  target_type public.reaction_target not null,
  target_id uuid not null,
  emoji public.reaction_kind not null,
  created_at timestamptz not null default now(),
  primary key (user_id, target_type, target_id, emoji)
);

create index reactions_target_idx on public.reactions (target_type, target_id, emoji, created_at desc);
create index reactions_user_recent_idx on public.reactions (user_id, created_at desc);

-- Counters live in their own table instead of on posts: a reaction must not
-- rewrite the post row (its search vector, updated_at and the CMS's
-- conflict check all hang off that row).
create table public.post_stats (
  post_id uuid primary key references public.posts (id) on delete cascade,
  -- {"helpful": 3, "love": 1}; emoji with no reactions are left out.
  reaction_counts jsonb not null default '{}'::jsonb,
  comment_count int not null default 0 check (comment_count >= 0)
);

-- ---------------------------------------------------------------------------
-- Guards and counters
-- ---------------------------------------------------------------------------

-- Is this target open for reactions? Posts: published. Comments are added by
-- the comments migration.
create or replace function private.reaction_target_open(p_type public.reaction_target, p_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case p_type
    when 'post' then private.post_is_published(p_id)
    else false
  end
$$;

-- Before insert: the target must be open, and one reader cannot add more
-- than max_per_window reactions per window.
create or replace function private.reactions_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  max_per_window constant int := 30;
  rate_window constant interval := interval '1 minute';
  recent int;
begin
  if not private.reaction_target_open(new.target_type, new.target_id) then
    raise exception 'cannot react to this %', new.target_type using errcode = 'P0002';
  end if;

  select count(*) into recent
  from public.reactions r
  where r.user_id = new.user_id and r.created_at > now() - rate_window;
  if recent >= max_per_window then
    raise exception 'too many reactions, slow down' using errcode = 'P0429';
  end if;

  return new;
end;
$$;

create trigger reactions_before_insert
  before insert on public.reactions
  for each row execute function private.reactions_before_insert();

-- Adds delta to one emoji's count, dropping the key when it reaches zero.
create or replace function private.bump_reaction_count(p_counts jsonb, p_emoji public.reaction_kind, p_delta int)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select case
    when coalesce((p_counts ->> p_emoji::text)::int, 0) + p_delta <= 0 then p_counts - p_emoji::text
    else p_counts || jsonb_build_object(p_emoji::text, coalesce((p_counts ->> p_emoji::text)::int, 0) + p_delta)
  end
$$;

-- After insert/delete: keep the counters in step. Runs as definer because
-- readers cannot write post_stats themselves.
create or replace function private.reactions_after_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed public.reactions%rowtype;
  delta int;
begin
  if tg_op = 'INSERT' then
    changed := new;
    delta := 1;
  else
    changed := old;
    delta := -1;
  end if;

  if changed.target_type = 'post' then
    insert into public.post_stats as s (post_id, reaction_counts)
    values (changed.target_id, private.bump_reaction_count('{}'::jsonb, changed.emoji, greatest(delta, 0)))
    on conflict (post_id) do update
      set reaction_counts = private.bump_reaction_count(s.reaction_counts, changed.emoji, delta);
  end if;

  return null;
end;
$$;

create trigger reactions_after_change
  after insert or delete on public.reactions
  for each row execute function private.reactions_after_change();

revoke execute on function private.reactions_before_insert() from public, anon, authenticated;
revoke execute on function private.reactions_after_change() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.reactions enable row level security;
alter table public.post_stats enable row level security;

-- Who reacted is public (shown in the "Grace, Minh và 10 người khác" tooltip).
create policy "reactions are public" on public.reactions
  for select to anon, authenticated using (true);
create policy "readers add own reactions" on public.reactions
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "readers remove own reactions" on public.reactions
  for delete to authenticated using (user_id = (select auth.uid()));

revoke update on public.reactions from anon, authenticated;

create policy "stats of published posts are public" on public.post_stats
  for select to anon, authenticated using (private.post_is_published(post_id));

revoke insert, update, delete on public.post_stats from anon, authenticated;

-- ---------------------------------------------------------------------------
-- API
-- ---------------------------------------------------------------------------

-- Toggle one emoji on a target for the signed-in reader. Returns the target's
-- counts afterwards and the emoji this reader now has on it.
create or replace function public.toggle_reaction(
  p_target_type public.reaction_target,
  p_target_id uuid,
  p_emoji public.reaction_kind
)
returns table (counts jsonb, mine public.reaction_kind[])
language plpgsql
security invoker
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then
    raise exception 'sign in to react' using errcode = '42501';
  end if;

  delete from public.reactions r
  where r.user_id = uid and r.target_type = p_target_type and r.target_id = p_target_id and r.emoji = p_emoji;

  if not found then
    insert into public.reactions (user_id, target_type, target_id, emoji)
    values (uid, p_target_type, p_target_id, p_emoji);
  end if;

  return query
  select
    coalesce(
      (select jsonb_object_agg(g.emoji, g.n) from (
        select r.emoji, count(*) as n from public.reactions r
        where r.target_type = p_target_type and r.target_id = p_target_id
        group by r.emoji
      ) g),
      '{}'::jsonb
    ),
    coalesce(
      array(
        select r.emoji from public.reactions r
        where r.user_id = uid and r.target_type = p_target_type and r.target_id = p_target_id
        order by r.emoji
      ),
      '{}'
    );
end;
$$;

revoke execute on function public.toggle_reaction(public.reaction_target, uuid, public.reaction_kind) from public, anon;
grant execute on function public.toggle_reaction(public.reaction_target, uuid, public.reaction_kind) to authenticated;

-- Ranking signal for the feed: log(1 + reactions + comments).
create or replace function public.post_popularity(p_post_id uuid)
returns double precision
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce((
    select ln(1 + s.comment_count + coalesce((
      select sum(value::int) from jsonb_each_text(s.reaction_counts)
    ), 0))
    from public.post_stats s
    where s.post_id = p_post_id
  ), 0)::double precision
$$;

-- The signed-in reader's own reactions on a set of targets (empty for visitors).
create or replace function public.my_reactions(p_target_type public.reaction_target, p_target_ids uuid[])
returns table (target_id uuid, emoji public.reaction_kind)
language sql
stable
security invoker
set search_path = ''
as $$
  select r.target_id, r.emoji
  from public.reactions r
  where r.user_id = (select auth.uid())
    and r.target_type = p_target_type
    and r.target_id = any (p_target_ids)
  order by r.target_id, r.emoji
$$;

grant execute on function public.my_reactions(public.reaction_target, uuid[]) to anon, authenticated;
