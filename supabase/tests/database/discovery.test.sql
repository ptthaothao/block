-- Discovery functions: counts and filters only see published posts.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(9);

truncate public.reactions, public.post_tags, public.post_authors, public.posts, public.tags, public.series, public.categories cascade;
delete from auth.users;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-000000000001', 'a@example.com', '{"user_name":"alice"}');
update profiles set role = 'author' where id = '00000000-0000-0000-0000-000000000001';

insert into categories (id, slug, name) overriding system value values (201, 'frontend', 'Frontend'), (202, 'backend', 'Backend');
insert into categories (id, parent_id, slug, name) overriding system value values (203, 201, 'react', 'React');
insert into tags (id, slug, name, status) overriding system value values
  (201, 'nextjs', 'nextjs', 'approved'), (202, 'hidden', 'hidden', 'pending');

insert into posts (id, slug, title, category_id, status, level, created_by) values
  ('20000000-0000-0000-0000-000000000001', 'p1', 'P1', 203, 'published', 'beginner', '00000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002', 'p2', 'P2', 201, 'published', 'advanced', '00000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000003', 'p3', 'P3', 203, 'draft', 'beginner', '00000000-0000-0000-0000-000000000001');
insert into post_tags (post_id, tag_id) values
  ('20000000-0000-0000-0000-000000000001', 201),
  ('20000000-0000-0000-0000-000000000003', 201);

set local role anon;

select is((select post_count from category_post_counts() where category_id = 201), 2::bigint, 'a parent counts its children');
select is((select post_count from category_post_counts() where category_id = 203), 1::bigint, 'drafts are not counted');
select is((select post_count from tag_post_counts() where tag_id = 201), 1::bigint, 'tag counts skip drafts');
select is((select count(*) from tag_post_counts() where tag_id = 202), 0::bigint, 'pending tags are not listed');
select is((select post_count from author_post_counts() where username = 'alice'), 2::bigint, 'author counts only published posts');

select is((select count(*) from filter_posts('frontend')), 2::bigint, 'filtering by a parent includes children');
select is((select count(*) from filter_posts(p_tags => array['nextjs'])), 1::bigint, 'filtering by tag skips drafts');
select is(
  (select count(*) from filter_posts(p_levels => array['advanced']::post_level[], p_author => 'alice')),
  1::bigint,
  'level and author filters combine'
);
select is((select total_count from filter_posts(p_limit => 1) limit 1), 2::bigint, 'total_count is the full match count');

select * from finish();
rollback;
