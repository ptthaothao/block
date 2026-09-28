-- Reactions: toggling, counters, published-only, ownership and rate limit.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(13);

truncate public.reactions, public.post_stats, public.post_tags, public.post_authors, public.posts, public.tags, public.series, public.categories cascade;
delete from auth.users;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-000000000001', 'a@example.com', '{"user_name":"alice"}'),
  ('00000000-0000-0000-0000-000000000002', 'b@example.com', '{"user_name":"bob"}');
update profiles set role = 'author' where id = '00000000-0000-0000-0000-000000000001';

insert into categories (id, slug, name) overriding system value values (401, 'backend', 'Backend');
insert into posts (id, slug, title, category_id, status, created_by) values
  ('40000000-0000-0000-0000-000000000001', 'live-post', 'Live', 401, 'published', '00000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000002', 'draft-post', 'Draft', 401, 'draft', '00000000-0000-0000-0000-000000000001');

set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}';

select is(
  (select counts from toggle_reaction('post', '40000000-0000-0000-0000-000000000001', 'helpful')),
  '{"helpful": 1}'::jsonb,
  'toggling on adds the reaction'
);
select is(
  (select mine from toggle_reaction('post', '40000000-0000-0000-0000-000000000001', 'love')),
  array['helpful', 'love']::reaction_kind[],
  'a reader can leave several different emoji'
);
select throws_ok(
  $$ insert into reactions (target_type, target_id, emoji) values ('post', '40000000-0000-0000-0000-000000000001', 'helpful') $$,
  '23505', null, 'the same emoji cannot be added twice'
);
select is(
  (select reaction_counts from post_stats where post_id = '40000000-0000-0000-0000-000000000001'),
  '{"helpful": 1, "love": 1}'::jsonb,
  'the counters follow inserts'
);
select is(
  (select counts from toggle_reaction('post', '40000000-0000-0000-0000-000000000001', 'love')),
  '{"helpful": 1}'::jsonb,
  'toggling again removes it'
);
select is(
  (select reaction_counts from post_stats where post_id = '40000000-0000-0000-0000-000000000001'),
  '{"helpful": 1}'::jsonb,
  'the counters follow deletes and drop empty emoji'
);
select is(
  (select array_agg(emoji order by emoji) from my_reactions('post', array['40000000-0000-0000-0000-000000000001'::uuid])),
  array['helpful']::reaction_kind[],
  'my_reactions lists only the reader''s own picks'
);
select throws_ok(
  $$ select toggle_reaction('post', '40000000-0000-0000-0000-000000000002', 'helpful') $$,
  'P0002', null, 'drafts cannot be reacted to'
);
select throws_ok(
  $$ insert into reactions (user_id, target_type, target_id, emoji) values ('00000000-0000-0000-0000-000000000001', 'post', '40000000-0000-0000-0000-000000000001', 'love') $$,
  '42501', null, 'nobody can react on behalf of someone else'
);

-- alice reacts too; bob cannot remove her reaction.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}';
select toggle_reaction('post', '40000000-0000-0000-0000-000000000001', 'helpful');
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}';
delete from reactions where user_id = '00000000-0000-0000-0000-000000000001';
select is(
  (select count(*) from reactions where user_id = '00000000-0000-0000-0000-000000000001'),
  1::bigint,
  'a reader cannot delete someone else''s reaction'
);
select is(post_popularity('40000000-0000-0000-0000-000000000001'), ln(3)::double precision, 'popularity counts every reaction');

-- Visitors see counts but cannot react.
set local role anon;
select is(
  (select reaction_counts from post_stats where post_id = '40000000-0000-0000-0000-000000000001'),
  '{"helpful": 2}'::jsonb,
  'visitors can read the counters'
);

-- Rate limit: fill the window with reactions on many posts.
reset role;
insert into posts (slug, title, category_id, status, created_by)
select 'bulk-' || g, 'Bulk', 401, 'published', '00000000-0000-0000-0000-000000000001' from generate_series(1, 40) g;
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}';
select throws_ok(
  $$ select t.* from posts p cross join lateral toggle_reaction('post', p.id, 'helpful') t where p.slug like 'bulk-%' $$,
  'P0429', null, 'reacting too fast is rate limited'
);

select * from finish();
rollback;
