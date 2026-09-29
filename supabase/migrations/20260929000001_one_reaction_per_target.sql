-- One reaction per reader per target. Picking another emoji replaces the
-- reader's current one; picking the same emoji again removes it.

-- Keep only each reader's latest pick. The after-delete trigger brings the
-- counters on post_stats and comments back in step.
delete from public.reactions r
using public.reactions newer
where newer.user_id = r.user_id
  and newer.target_type = r.target_type
  and newer.target_id = r.target_id
  and (newer.created_at, newer.emoji) > (r.created_at, r.emoji);

alter table public.reactions drop constraint reactions_pkey;
alter table public.reactions add primary key (user_id, target_type, target_id);

-- Toggle an emoji on a target for the signed-in reader: removes it when it is
-- their current pick, otherwise makes it their only pick. Returns the target's
-- counts afterwards and the emoji this reader now has on it (zero or one).
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
  previous public.reaction_kind;
begin
  if uid is null then
    raise exception 'sign in to react' using errcode = '42501';
  end if;

  delete from public.reactions r
  where r.user_id = uid and r.target_type = p_target_type and r.target_id = p_target_id
  returning r.emoji into previous;

  if previous is distinct from p_emoji then
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
      ),
      '{}'
    );
end;
$$;
