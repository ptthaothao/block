-- Comments: nesting, moderation rules, counters, rate limit, reports.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(24);

truncate public.reports, public.comments, public.reactions, public.post_stats, public.post_tags, public.post_authors, public.posts, public.tags, public.series, public.categories cascade;
delete from auth.users;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'alice@example.com', '{"user_name":"alice"}'),
  ('00000000-0000-0000-0000-00000000000b', 'bob@example.com', '{"user_name":"bob"}'),
  ('00000000-0000-0000-0000-00000000000c', 'carol@example.com', '{"user_name":"carol"}'),
  ('00000000-0000-0000-0000-00000000000d', 'dave@example.com', '{"user_name":"dave"}');
update profiles set role = 'author' where username = 'alice';
update profiles set role = 'editor' where username = 'dave';
-- Everyone but carol has been around for a while.
update profiles set created_at = now() - interval '30 days' where username <> 'carol';

insert into categories (id, slug, name) overriding system value values (501, 'backend', 'Backend');
insert into posts (id, slug, title, category_id, status, created_by) values
  ('50000000-0000-0000-0000-000000000001', 'live', 'Live', 501, 'published', '00000000-0000-0000-0000-00000000000a'),
  ('50000000-0000-0000-0000-000000000002', 'draft', 'Draft', 501, 'draft', '00000000-0000-0000-0000-00000000000a');

create temporary table ids (name text primary key, id uuid) on commit drop;
grant all on ids to authenticated, anon;

set local role authenticated;

-- bob writes a thread, a reply, and replies to his reply.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}';
insert into ids select 'root', id from create_comment('50000000-0000-0000-0000-000000000001', 'Câu hỏi về `queue`', null);
select is((select status from comments where id = (select id from ids where name = 'root')), 'visible', 'a comment from an established reader is visible');
insert into ids select 'reply', id from create_comment('50000000-0000-0000-0000-000000000001', 'Trả lời', (select id from ids where name = 'root'));
insert into ids select 'reply2', id from create_comment('50000000-0000-0000-0000-000000000001', '@bob trả lời tiếp', (select id from ids where name = 'reply'));
select is(
  (select parent_id from comments where id = (select id from ids where name = 'reply2')),
  (select id from ids where name = 'root'),
  'replying to a reply joins the same thread'
);
select throws_ok(
  $$ insert into comments (post_id, parent_id, body_md) values ('50000000-0000-0000-0000-000000000001', (select id from ids where name = 'reply'), 'deep') $$,
  '23514', null, 'replies cannot nest two levels'
);
select throws_ok(
  $$ select create_comment('50000000-0000-0000-0000-000000000002', 'hi', null) $$,
  'P0002', null, 'drafts take no comments'
);
select is((select reply_count from comments where id = (select id from ids where name = 'root')), 2, 'the thread counts its replies');
select is((select comment_count from post_stats where post_id = '50000000-0000-0000-0000-000000000001'), 3, 'the post counts its comments');

-- Editing within the window marks the comment edited.
update comments set body_md = 'Câu hỏi (đã sửa)' where id = (select id from ids where name = 'root');
select isnt((select edited_at from comments where id = (select id from ids where name = 'root')), null, 'editing sets edited_at');
select throws_ok(
  $$ update comments set is_pinned = true where id = (select id from ids where name = 'root') $$,
  '42501', null, 'writers cannot pin'
);
select throws_ok(
  $$ update comments set reply_count = 99 where id = (select id from ids where name = 'root') $$,
  '42501', null, 'counters cannot be written by readers'
);
select throws_ok(
  $$ delete from comments where id = (select id from ids where name = 'root') $$,
  '42501', null, 'comments cannot be hard-deleted'
);

-- carol is new and posts a link: held for review.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000c","role":"authenticated"}';
insert into ids select 'spam', id from create_comment('50000000-0000-0000-0000-000000000001', 'Xem https://example.com', null);
select is((select status from comments where id = (select id from ids where name = 'spam')), 'pending', 'links from new accounts wait for review');
select is((select count(*) from comments where id = (select id from ids where name = 'spam')), 1::bigint, 'the writer sees their pending comment');
update comments set body_md = 'sửa bậy' where id = (select id from ids where name = 'root');
select is((select body_md from comments where id = (select id from ids where name = 'root')), 'Câu hỏi (đã sửa)', 'others cannot edit a comment');

set local role anon;
select is((select count(*) from comments where id = (select id from ids where name = 'spam')), 0::bigint, 'visitors do not see pending comments');
set local role authenticated;

-- alice moderates her post: can hide, cannot approve pending.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}';
select lives_ok(
  $$ update comments set status = 'hidden' where id = (select id from ids where name = 'reply2') $$,
  'the post author can hide a comment'
);
select is((select reply_count from comments where id = (select id from ids where name = 'root')), 1, 'hidden replies leave the count');
select throws_ok(
  $$ update comments set status = 'visible' where id = (select id from ids where name = 'spam') $$,
  '42501', null, 'post authors cannot approve pending comments'
);

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000d","role":"authenticated"}';
select lives_ok(
  $$ update comments set status = 'visible' where id = (select id from ids where name = 'spam') $$,
  'editors approve pending comments'
);

-- bob reports carol's comment once.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}';
insert into reports (comment_id, reason) values ((select id from ids where name = 'spam'), 'spam');
select throws_ok(
  $$ insert into reports (comment_id, reason) values ((select id from ids where name = 'spam'), 'spam') $$,
  '23505', null, 'a reader reports a comment once'
);
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000d","role":"authenticated"}';
select is((select open_reports from moderation_queue where comment_id = (select id from ids where name = 'spam')), 1::bigint, 'editors see reports in the queue');

-- Reactions on comments count on the comment.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}';
select toggle_reaction('comment', (select id from ids where name = 'spam'), 'helpful');
select is((select reaction_counts from comments where id = (select id from ids where name = 'spam')), '{"helpful": 1}'::jsonb, 'comment reactions are counted');

-- Soft delete keeps the thread (it has a reply) but drops the text.
update comments set deleted_at = now() where id = (select id from ids where name = 'root');
select is((select body_md from comments where id = (select id from ids where name = 'root')), '', 'deleting blanks the text');
select is(
  (select count(*) from list_comment_threads('50000000-0000-0000-0000-000000000001') where id = (select id from ids where name = 'root')),
  1::bigint,
  'a deleted thread with replies stays listed'
);

-- Rate limit: bob already wrote 3 in the last minute.
select throws_ok(
  $$ select c.* from generate_series(1, 5) g cross join lateral create_comment('50000000-0000-0000-0000-000000000001', 'spam ' || g, null) c $$,
  'P0429', null, 'commenting too fast is rate limited'
);

select * from finish();
rollback;
