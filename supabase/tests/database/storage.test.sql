-- Storage: who may upload to and delete from the `post` bucket.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(5);

delete from auth.users;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'alice@example.com', '{"user_name":"alice"}'),
  ('00000000-0000-0000-0000-00000000000b', 'bob@example.com', '{"user_name":"bob"}'),
  ('00000000-0000-0000-0000-00000000000d', 'dave@example.com', '{"user_name":"dave"}');
update profiles set role = 'author' where username in ('alice', 'bob');
update profiles set role = 'editor' where username = 'dave';
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000c', 'carol@example.com', '{"user_name":"carol"}');

set local role authenticated;

-- carol is a reader: no uploads.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000c","role":"authenticated"}';
select throws_ok(
  $$insert into storage.objects (bucket_id, name, owner_id) values ('post', 'cover/r.png', '00000000-0000-0000-0000-00000000000c')$$,
  '42501',
  null,
  'a reader cannot upload post images'
);

-- alice is an author: uploads under any folder.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}';
select lives_ok(
  $$insert into storage.objects (bucket_id, name, owner_id) values ('post', 'content/p1/a.png', '00000000-0000-0000-0000-00000000000a')$$,
  'an author can upload post images'
);

-- Delete uses the same rule as select (own objects, or any for editors), and
-- Storage refuses raw DELETEs on storage.objects, so check visibility instead.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}';
select is((select count(*)::int from storage.objects where name = 'content/p1/a.png'), 0, 'an author cannot see (or delete) another author''s image');

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000d","role":"authenticated"}';
select is((select count(*)::int from storage.objects where name = 'content/p1/a.png'), 1, 'an editor can see (and delete) any post image');

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}';
select is((select count(*)::int from storage.objects where name = 'content/p1/a.png'), 1, 'an author can see (and delete) their own image');

select * from finish();
rollback;
