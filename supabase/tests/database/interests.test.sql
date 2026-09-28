-- Interests: owner-only access, set_interest, follower_count and get_feed.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(13);

truncate public.user_interests, public.post_tags, public.post_authors, public.posts, public.tags, public.series, public.categories cascade;
delete from auth.users;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-000000000001', 'a@example.com', '{"user_name":"alice"}'),
  ('00000000-0000-0000-0000-000000000002', 'b@example.com', '{"user_name":"bob"}');
update profiles set role = 'author' where id = '00000000-0000-0000-0000-000000000001';

insert into categories (id, slug, name) overriding system value values (301, 'frontend', 'Frontend'), (302, 'backend', 'Backend');
insert into categories (id, parent_id, slug, name) overriding system value values (303, 301, 'react', 'React');
insert into tags (id, slug, name, status) overriding system value values
  (301, 'nextjs', 'nextjs', 'approved'), (302, 'queue', 'queue', 'approved'), (303, 'wip', 'wip', 'pending');

insert into posts (id, slug, title, category_id, status, created_by, published_at) values
  ('30000000-0000-0000-0000-000000000001', 'react-post', 'React', 303, 'published', '00000000-0000-0000-0000-000000000001', now() - interval '2 days'),
  ('30000000-0000-0000-0000-000000000002', 'queue-post', 'Queue', 302, 'published', '00000000-0000-0000-0000-000000000001', now() - interval '1 day'),
  ('30000000-0000-0000-0000-000000000003', 'plain-post', 'Plain', 302, 'published', '00000000-0000-0000-0000-000000000001', now());
insert into post_tags (post_id, tag_id) values ('30000000-0000-0000-0000-000000000002', 302);

-- bob follows Frontend and mutes the queue tag.
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}';

select lives_ok($$ select set_interest('category', 'frontend', 1::smallint) $$, 'a reader can follow a topic');
select lives_ok($$ select set_interest('tag', 'queue', -1::smallint) $$, 'a reader can mute a tag');
select lives_ok($$ select set_interest('category', 'frontend', 1::smallint) $$, 'following twice is harmless');
select is((select count(*) from user_interests), 2::bigint, 'the reader sees their own interests');
select throws_ok($$ select set_interest('tag', 'wip', 1::smallint) $$, 'P0002', null, 'pending tags cannot be followed');

select is((select id from get_feed() limit 1), '30000000-0000-0000-0000-000000000001'::uuid, 'a followed parent topic ranks its child topic first');
select is(
  (select reason_label from get_feed() where id = '30000000-0000-0000-0000-000000000001'),
  'Frontend',
  'the reason names the followed topic'
);
select is(
  (select id from get_feed() offset 2 limit 1),
  '30000000-0000-0000-0000-000000000002'::uuid,
  'a muted tag sinks to the bottom'
);

-- alice cannot see bob's interests.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}';
select is((select count(*) from user_interests), 0::bigint, 'other readers cannot see your interests');
select throws_ok(
  $$ insert into user_interests (user_id, category_id, weight) values ('00000000-0000-0000-0000-000000000002', 302, 1) $$,
  '42501', null, 'nobody can write interests for someone else'
);
select throws_ok($$ select set_interest('author', 'alice', 1::smallint) $$, '23514', null, 'authors cannot follow themselves');

set local role anon;
select is(follower_count('category', 'frontend'), 1::bigint, 'anyone can read follower counts');
select is(
  (select id from get_feed('{"tags":["queue"]}'::jsonb) limit 1),
  '30000000-0000-0000-0000-000000000002'::uuid,
  'visitors pass interests explicitly'
);

select * from finish();
rollback;
