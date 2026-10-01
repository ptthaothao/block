-- Replies at any depth.
--
-- parent_id is now the comment a reply answers (it used to be flattened to the
-- thread's root). root_id points at the top-level comment of the thread, so a
-- whole thread loads with one query; the app builds the tree from parent_id.
-- A root's reply_count counts every visible, undeleted reply in its thread.

alter table public.comments add column root_id uuid references public.comments (id) on delete cascade;

-- Existing replies were all direct children of their root.
update public.comments set root_id = parent_id where parent_id is not null;

alter table public.comments add constraint comments_root_matches_parent check ((parent_id is null) = (root_id is null));

create index comments_root_created_idx on public.comments (root_id, created_at);

drop function private.refresh_comment_counts(uuid, uuid);
create or replace function private.refresh_comment_counts(p_post_id uuid, p_root_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_root_id is not null then
    update public.comments c
    set reply_count = (
      select count(*) from public.comments r
      where r.root_id = p_root_id and r.status = 'visible' and r.deleted_at is null
    )
    where c.id = p_root_id;
  end if;

  insert into public.post_stats as s (post_id, comment_count)
  values (
    p_post_id,
    (select count(*) from public.comments c where c.post_id = p_post_id and c.status = 'visible' and c.deleted_at is null)
  )
  on conflict (post_id) do update set comment_count = excluded.comment_count;
end;
$$;

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
    new.root_id := coalesce(parent.root_id, parent.id);
  else
    new.root_id := null;
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
     or new.parent_id is distinct from old.parent_id or new.root_id is distinct from old.root_id or new.created_at <> old.created_at then
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

create or replace function private.comments_after_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    perform private.refresh_comment_counts(old.post_id, old.root_id);
    return null;
  end if;
  if tg_op = 'INSERT' or new.status <> old.status or new.deleted_at is distinct from old.deleted_at then
    perform private.refresh_comment_counts(new.post_id, new.root_id);
  end if;
  return null;
end;
$$;

-- Write a comment or a reply. A reply is stored under the exact comment it answers.
create or replace function public.create_comment(p_post_id uuid, p_body_md text, p_parent_id uuid default null)
returns table (id uuid, status public.comment_status)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'sign in to comment' using errcode = '42501';
  end if;
  -- Turnstile or similar can be checked here later; off for now.
  if p_parent_id is not null then
    -- The reply is stored under the comment it answers, at any depth.
    perform 1 from public.comments c where c.id = p_parent_id;
    if not found then
      raise exception 'reply target not found' using errcode = 'P0002';
    end if;
  end if;

  return query
  insert into public.comments as c (post_id, parent_id, body_md)
  values (p_post_id, p_parent_id, p_body_md)
  returning c.id, c.status;
end;
$$;

revoke execute on function private.refresh_comment_counts(uuid, uuid) from public, anon, authenticated;
