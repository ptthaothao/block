-- RLS tests for the core schema. Run with `supabase test db`.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(27);

-- Fixtures -------------------------------------------------------------------
-- Start from empty tables so counts don't depend on seed.sql. Rolled back at the end.
truncate public.reactions, public.post_tags, public.post_authors, public.posts, public.tags, public.series, public.categories cascade;
delete from auth.users;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'admin@example.com', '{"full_name":"Admin"}'),
  ('00000000-0000-0000-0000-00000000000e', 'editor@example.com', '{}'),
  ('00000000-0000-0000-0000-000000000001', 'an.nguyen@example.com', '{"user_name":"annguyen"}'),
  ('00000000-0000-0000-0000-000000000002', 'binh@example.com', '{}'),
  ('00000000-0000-0000-0000-000000000003', 'reader@example.com', '{}');

select is(
  (select username::text from profiles where id = '00000000-0000-0000-0000-000000000001'),
  'annguyen',
  'signup trigger creates a profile using the OAuth username'
);
select is(
  (select role from profiles where id = '00000000-0000-0000-0000-000000000003'),
  'reader'::user_role,
  'new users start as readers'
);

update profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000a';
update profiles set role = 'editor' where id = '00000000-0000-0000-0000-00000000000e';
update profiles set role = 'author' where id in ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002');

insert into categories (id, slug, name) overriding system value values (101, 'frontend', 'Frontend'), (102, 'backend', 'Backend');
insert into categories (id, parent_id, slug, name) overriding system value values (103, 101, 'react', 'React');
insert into tags (id, slug, name, status) overriding system value values (101, 'nextjs', 'nextjs', 'approved'), (102, 'secret-tag', 'secret', 'pending');

insert into posts (id, slug, title, category_id, status, created_by) values
  ('10000000-0000-0000-0000-000000000001', 'published-post', 'Published', 103, 'published', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002', 'draft-post', 'Draft', 103, 'draft', '00000000-0000-0000-0000-000000000001');
insert into post_tags (post_id, tag_id) values
  ('10000000-0000-0000-0000-000000000001', 101),
  ('10000000-0000-0000-0000-000000000002', 101);

select throws_ok(
  $$ insert into categories (parent_id, slug, name) values (103, 'hooks', 'Hooks') $$,
  'P0001', 'categories can only be nested two levels deep',
  'categories cannot nest deeper than two levels'
);
select isnt(
  (select published_at from posts where id = '10000000-0000-0000-0000-000000000001'),
  null,
  'publishing sets published_at'
);
select is(
  (select count(*)::int from post_authors where post_id = '10000000-0000-0000-0000-000000000002'),
  1,
  'post creator is added as an author'
);

-- Anonymous visitor ----------------------------------------------------------
set local role anon;
select is((select count(*)::int from posts), 1, 'anon sees only published posts');
select is((select count(*)::int from tags), 1, 'anon sees only approved tags');
select is((select count(*)::int from post_tags), 1, 'anon sees tags of published posts only');
select throws_ok(
  $$ insert into categories (slug, name) values ('x', 'X') $$,
  '42501', null, 'anon cannot create categories'
);
reset role;

-- Reader ---------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000003';
select is((select count(*)::int from posts), 1, 'reader sees only published posts');
select throws_ok(
  $$ insert into posts (slug, title, category_id) values ('r', 'R', 101) $$,
  '42501', null, 'reader cannot create posts'
);
select throws_ok(
  $$ update profiles set role = 'admin' where id = auth.uid() $$,
  '42501', null, 'reader cannot change own role'
);
select lives_ok(
  $$ update profiles set bio = 'Xin chào' where id = auth.uid() $$,
  'reader can edit own bio'
);
update profiles set bio = 'hacked' where id = '00000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select bio from profiles where id = '00000000-0000-0000-0000-000000000001'),
  null,
  'reader cannot edit another profile'
);

-- Author ---------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';
select is((select count(*)::int from posts), 1, 'author does not see drafts of other authors');
select lives_ok(
  $$ insert into posts (id, slug, title, category_id) values ('10000000-0000-0000-0000-000000000003', 'binh-draft', 'Binh draft', 102) $$,
  'author can create a draft'
);
select lives_ok(
  $$ update posts set status = 'review' where id = '10000000-0000-0000-0000-000000000003' $$,
  'author can submit own draft for review'
);
select throws_ok(
  $$ update posts set status = 'published' where id = '10000000-0000-0000-0000-000000000003' $$,
  '42501', null, 'author cannot publish'
);
select throws_ok(
  $$ insert into posts (slug, title, category_id, status) values ('sneaky', 'Sneaky', 102, 'published') $$,
  '42501', null, 'author cannot create a published post'
);
update posts set title = 'hijacked' where id = '10000000-0000-0000-0000-000000000002';
select lives_ok(
  $$ insert into tags (slug, name, created_by) values ('new-tag', 'new', auth.uid()) $$,
  'author can propose a pending tag'
);
select throws_ok(
  $$ insert into tags (slug, name, status, created_by) values ('approved-tag', 'x', 'approved', auth.uid()) $$,
  '42501', null, 'author cannot create an approved tag'
);
reset role;
select is(
  (select title from posts where id = '10000000-0000-0000-0000-000000000002'),
  'Draft',
  'author cannot edit a post they do not author'
);
select throws_ok(
  $$ select merge_tags(101, 102) $$,
  '42501', 'only editors can merge tags',
  'author cannot merge tags'
);

-- Editor ---------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000e';
select lives_ok(
  $$ update posts set status = 'published' where id = '10000000-0000-0000-0000-000000000003' $$,
  'editor can publish'
);
insert into tags (id, slug, name, status, created_by) overriding system value values (103, 'next-js', 'next-js', 'approved', '00000000-0000-0000-0000-00000000000e');
insert into post_tags (post_id, tag_id) values ('10000000-0000-0000-0000-000000000002', 103);
select lives_ok(
  $$ select merge_tags(103, 101) $$,
  'editor can merge a duplicate tag'
);
select is(
  (select count(*)::int from post_tags where tag_id = 101 and post_id = '10000000-0000-0000-0000-000000000002'),
  1,
  'merging keeps one tag per post'
);
reset role;

-- Admin ----------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
select lives_ok(
  $$ select set_user_role('00000000-0000-0000-0000-000000000003', 'author') $$,
  'admin can change roles via set_user_role'
);
reset role;

select * from finish();
rollback;
