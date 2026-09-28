-- Comments (one level of replies), reports, and reactions on comments.
--
-- Only Markdown is stored. The app renders it through a strict, sanitizing
-- pipeline when reading, so nothing written straight to the API can become
-- HTML on the page.

create type public.comment_status as enum ('visible', 'pending', 'hidden');
create type public.report_reason as enum ('spam', 'offensive', 'off_topic', 'other');

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  body_md text not null,
  status public.comment_status not null default 'visible',
  is_pinned boolean not null default false,
  reaction_counts jsonb not null default '{}'::jsonb,
  reply_count int not null default 0 check (reply_count >= 0),
  edited_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  -- A deleted comment keeps its place (its replies stay) but loses its text.
  constraint comments_body_length check (
    (deleted_at is not null and body_md = '') or char_length(body_md) between 1 and 5000
  )
);

create index comments_post_created_idx on public.comments (post_id, created_at);
create index comments_parent_created_idx on public.comments (parent_id, created_at);
create index comments_author_created_idx on public.comments (author_id, created_at desc);
create index comments_pending_idx on public.comments (created_at) where status = 'pending';

create table public.reports (
  id bigint generated always as identity primary key,
  comment_id uuid not null references public.comments (id) on delete cascade,
  reporter_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  reason public.report_reason not null,
  note text check (char_length(note) <= 500),
  resolved_by uuid references public.profiles (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  constraint reports_once_per_reader unique (comment_id, reporter_id)
);

create index reports_open_idx on public.reports (created_at) where resolved_at is null;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- Can the signed-in user moderate comments on this post? Editors everywhere,
-- post authors on their own posts.
create or replace function private.can_moderate_post(p_post_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_editor() or private.is_post_author(p_post_id)
$$;

create or replace function private.comment_post_id(p_comment_id uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select c.post_id from public.comments c where c.id = p_comment_id
$$;

-- Keeps the root's reply_count and the post's comment_count in step with
-- what readers can see (visible and not deleted).
create or replace function private.refresh_comment_counts(p_post_id uuid, p_parent_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_parent_id is not null then
    update public.comments c
    set reply_count = (
      select count(*) from public.comments r
      where r.parent_id = p_parent_id and r.status = 'visible' and r.deleted_at is null
    )
    where c.id = p_parent_id;
  end if;

  insert into public.post_stats as s (post_id, comment_count)
  values (
    p_post_id,
    (select count(*) from public.comments c where c.post_id = p_post_id and c.status = 'visible' and c.deleted_at is null)
  )
  on conflict (post_id) do update set comment_count = excluded.comment_count;
end;
$$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

-- Before insert: published post, one level of nesting, rate limit, and hold
-- links from brand-new accounts for review.
create or replace function private.comments_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  max_per_minute constant int := 5;
  max_per_day constant int := 30;
  new_account_age constant interval := interval '1 day';
  link_pattern constant text := '(https?://|www\.|\]\()';
  parent public.comments%rowtype;
  per_minute int;
  per_day int;
  account_created timestamptz;
begin
  if not private.post_is_published(new.post_id) then
    raise exception 'comments are closed on this post' using errcode = 'P0002';
  end if;

  if new.parent_id is not null then
    select * into parent from public.comments c where c.id = new.parent_id;
    if not found or parent.post_id <> new.post_id then
      raise exception 'reply target not found' using errcode = 'P0002';
    end if;
    if parent.parent_id is not null then
      raise exception 'replies can only be one level deep' using errcode = '23514';
    end if;
  end if;

  select
    count(*) filter (where c.created_at > now() - interval '1 minute'),
    count(*)
  into per_minute, per_day
  from public.comments c
  where c.author_id = new.author_id and c.created_at > now() - interval '1 day';
  if per_minute >= max_per_minute or per_day >= max_per_day then
    raise exception 'too many comments, slow down' using errcode = 'P0429';
  end if;

  -- Readers never choose these themselves.
  new.is_pinned := false;
  new.reaction_counts := '{}'::jsonb;
  new.reply_count := 0;
  new.edited_at := null;
  new.deleted_at := null;
  new.created_at := now();

  select p.created_at into account_created from public.profiles p where p.id = new.author_id;
  if account_created > now() - new_account_age and new.body_md ~* link_pattern then
    new.status := 'pending';
  else
    new.status := 'visible';
  end if;

  return new;
end;
$$;

create trigger comments_before_insert
  before insert on public.comments
  for each row execute function private.comments_before_insert();

-- Before update: who may change what.
--   writer: edit the text within the edit window, or delete (blank + deleted_at)
--   post author / editor: hide, unhide and pin
--   editor: also approve pending comments
create or replace function private.comments_before_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  edit_window constant interval := interval '15 minutes';
  uid uuid := (select auth.uid());
  moderator boolean := private.can_moderate_post(old.post_id);
begin
  if new.post_id <> old.post_id or new.author_id <> old.author_id
     or new.parent_id is distinct from old.parent_id or new.created_at <> old.created_at then
    raise exception 'comments cannot be moved' using errcode = '42501';
  end if;

  if new.body_md <> old.body_md and new.deleted_at is null then
    if uid is distinct from old.author_id then
      raise exception 'only the writer can edit a comment' using errcode = '42501';
    end if;
    if old.deleted_at is not null or old.created_at < now() - edit_window then
      raise exception 'the edit window has passed' using errcode = '42501';
    end if;
    new.edited_at := now();
  end if;

  if new.deleted_at is distinct from old.deleted_at then
    if uid is distinct from old.author_id and not moderator then
      raise exception 'only the writer can delete a comment' using errcode = '42501';
    end if;
    if new.deleted_at is null then
      raise exception 'deleted comments cannot be restored' using errcode = '42501';
    end if;
    new.body_md := '';
    new.deleted_at := now();
    new.is_pinned := false;
  end if;

  if new.is_pinned <> old.is_pinned and not moderator then
    raise exception 'only the post author or an editor can pin' using errcode = '42501';
  end if;

  if new.status <> old.status then
    if not moderator then
      raise exception 'only the post author or an editor can moderate' using errcode = '42501';
    end if;
    if old.status = 'pending' and not private.is_editor() then
      raise exception 'only editors can approve pending comments' using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

create trigger comments_before_update
  before update on public.comments
  for each row execute function private.comments_before_update();

create or replace function private.comments_after_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    perform private.refresh_comment_counts(old.post_id, old.parent_id);
    return null;
  end if;
  if tg_op = 'INSERT' or new.status <> old.status or new.deleted_at is distinct from old.deleted_at then
    perform private.refresh_comment_counts(new.post_id, new.parent_id);
  end if;
  return null;
end;
$$;

create trigger comments_after_change
  after insert or update of status, deleted_at or delete on public.comments
  for each row execute function private.comments_after_change();

create trigger comments_delete_reactions
  after delete on public.comments
  for each row execute function private.delete_target_reactions('comment');

revoke execute on function private.comments_before_insert() from public, anon, authenticated;
revoke execute on function private.comments_before_update() from public, anon, authenticated;
revoke execute on function private.comments_after_change() from public, anon, authenticated;
revoke execute on function private.refresh_comment_counts(uuid, uuid) from public, anon, authenticated;

-- Reactions: comments that readers can see are open for reactions, and their
-- counters live on the comment row.
create or replace function private.reaction_target_open(p_type public.reaction_target, p_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case p_type
    when 'post' then private.post_is_published(p_id)
    else exists (
      select 1 from public.comments c
      where c.id = p_id and c.status = 'visible' and c.deleted_at is null and private.post_is_published(c.post_id)
    )
  end
$$;

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
    select changed.target_id, private.bump_reaction_count('{}'::jsonb, changed.emoji, greatest(delta, 0))
    where exists (select 1 from public.posts p where p.id = changed.target_id)
    on conflict (post_id) do update
      set reaction_counts = private.bump_reaction_count(s.reaction_counts, changed.emoji, delta);
  else
    update public.comments c
    set reaction_counts = private.bump_reaction_count(c.reaction_counts, changed.emoji, delta)
    where c.id = changed.target_id;
  end if;

  return null;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.comments enable row level security;
alter table public.reports enable row level security;

-- Visible comments on published posts are public; writers also see their own
-- pending or hidden ones; moderators see everything on their posts.
create policy "visible comments are public" on public.comments
  for select to anon, authenticated
  using (status = 'visible' and private.post_is_published(post_id));
create policy "writers see own comments" on public.comments
  for select to authenticated
  using (author_id = (select auth.uid()));
create policy "moderators see comments on their posts" on public.comments
  for select to authenticated
  using (private.can_moderate_post(post_id));

create policy "readers write own comments" on public.comments
  for insert to authenticated
  with check (author_id = (select auth.uid()));

-- The trigger decides which columns each role may change.
create policy "writers update own comments" on public.comments
  for update to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));
create policy "moderators update comments on their posts" on public.comments
  for update to authenticated
  using (private.can_moderate_post(post_id))
  with check (private.can_moderate_post(post_id));

-- Comments are never hard-deleted by people; deleting is a soft delete.
-- Counters (reaction_counts, reply_count) are not granted: only triggers write them.
revoke delete on public.comments from anon, authenticated;
revoke update on public.comments from authenticated;
grant update (body_md, status, is_pinned, deleted_at) on public.comments to authenticated;

create policy "readers report visible comments" on public.reports
  for insert to authenticated
  with check (
    reporter_id = (select auth.uid())
    and resolved_by is null
    and resolved_at is null
    and exists (select 1 from public.comments c where c.id = comment_id and c.status = 'visible' and c.deleted_at is null)
  );
create policy "reporters see own reports" on public.reports
  for select to authenticated
  using (reporter_id = (select auth.uid()));
create policy "editors see reports" on public.reports
  for select to authenticated
  using (private.is_editor());
create policy "editors resolve reports" on public.reports
  for update to authenticated
  using (private.is_editor())
  with check (private.is_editor());

revoke update on public.reports from authenticated;
grant update (resolved_by, resolved_at) on public.reports to authenticated;
revoke delete on public.reports from anon, authenticated;

-- ---------------------------------------------------------------------------
-- API
-- ---------------------------------------------------------------------------

-- Write a comment or a reply. Replying to a reply attaches to the same thread.
-- Returns the new comment's id and status ('pending' when held for review).
create or replace function public.create_comment(p_post_id uuid, p_parent_id uuid, p_body_md text)
returns table (id uuid, status public.comment_status)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  root uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'sign in to comment' using errcode = '42501';
  end if;
  -- Turnstile or similar can be checked here later; off for now.
  if p_parent_id is not null then
    select coalesce(c.parent_id, c.id) into root from public.comments c where c.id = p_parent_id;
    if root is null then
      raise exception 'reply target not found' using errcode = 'P0002';
    end if;
  end if;

  return query
  insert into public.comments as c (post_id, parent_id, body_md)
  values (p_post_id, root, p_body_md)
  returning c.id, c.status;
end;
$$;

revoke execute on function public.create_comment(uuid, uuid, text) from public, anon;
grant execute on function public.create_comment(uuid, uuid, text) to authenticated;

-- One page of top-level threads on a post, pinned first, then by p_sort:
-- 'best' (reactions + replies) or 'new'. RLS decides which rows each reader sees.
create or replace function public.list_comment_threads(p_post_id uuid, p_sort text default 'best', p_limit int default 20, p_offset int default 0)
returns table (id uuid, total_count bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select c.id, count(*) over ()
  from public.comments c
  where c.post_id = p_post_id
    and c.parent_id is null
    -- A deleted thread stays only while it still has replies.
    and (c.deleted_at is null or c.reply_count > 0)
  order by
    c.is_pinned desc,
    case when p_sort = 'best' then
      c.reply_count + coalesce((select sum(value::int) from jsonb_each_text(c.reaction_counts)), 0)
    end desc nulls last,
    case when p_sort = 'new' then c.created_at end desc,
    c.created_at asc
  limit least(greatest(p_limit, 1), 50)
  offset greatest(p_offset, 0)
$$;

grant execute on function public.list_comment_threads(uuid, text, int, int) to anon, authenticated;

-- Pending comments and open reports, for the moderation queue.
create or replace view public.moderation_queue
with (security_invoker = true)
as
select
  c.id as comment_id,
  c.post_id,
  c.status,
  c.body_md,
  c.created_at,
  c.author_id,
  count(r.id) filter (where r.resolved_at is null) as open_reports,
  array_agg(distinct r.reason) filter (where r.resolved_at is null) as reasons
from public.comments c
left join public.reports r on r.comment_id = c.id
where c.deleted_at is null
group by c.id
having c.status = 'pending' or count(r.id) filter (where r.resolved_at is null) > 0;

grant select on public.moderation_queue to authenticated;
