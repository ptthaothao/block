-- Local development seed. Runs after migrations on `supabase db reset`.

-- Taxonomy -------------------------------------------------------------------
insert into public.categories (slug, name, icon, color, position, description) values
  ('frontend', 'Frontend', 'layout', '#38bdf8', 1, 'Giao diện, trình duyệt và mọi thứ người dùng nhìn thấy.'),
  ('backend', 'Backend', 'server', '#818cf8', 2, 'API, kiến trúc server và xử lý dữ liệu.'),
  ('mobile', 'Mobile', 'smartphone', '#f472b6', 3, 'Ứng dụng iOS, Android và đa nền tảng.'),
  ('devops', 'DevOps', 'container', '#34d399', 4, 'CI/CD, container, hạ tầng và vận hành.'),
  ('database', 'Database', 'database', '#fbbf24', 5, 'SQL, NoSQL, tối ưu truy vấn và mô hình dữ liệu.'),
  ('ai', 'AI', 'sparkles', '#a78bfa', 6, 'LLM, agent và ứng dụng AI vào sản phẩm.'),
  ('security', 'Security', 'shield', '#f87171', 7, 'Bảo mật ứng dụng và hạ tầng.'),
  ('career', 'Career', 'briefcase', '#94a3b8', 8, 'Nghề lập trình, phỏng vấn và phát triển bản thân.');

insert into public.categories (parent_id, slug, name, position)
select c.id, v.slug, v.name, v.position
from (values
  ('frontend', 'react', 'React', 1),
  ('frontend', 'vue', 'Vue', 2),
  ('frontend', 'nextjs', 'Next.js', 3),
  ('frontend', 'css', 'CSS', 4),
  ('backend', 'laravel', 'Laravel', 1),
  ('backend', 'nodejs', 'Node.js', 2),
  ('backend', 'go', 'Go', 3),
  ('devops', 'docker', 'Docker', 1),
  ('devops', 'ci-cd', 'CI/CD', 2),
  ('database', 'postgresql', 'PostgreSQL', 1),
  ('database', 'redis', 'Redis', 2),
  ('ai', 'llm', 'LLM', 1),
  ('ai', 'agents', 'Agents', 2)
) as v(parent_slug, slug, name, position)
join public.categories c on c.slug = v.parent_slug;

insert into public.tags (slug, name, status) values
  ('nextjs', 'nextjs', 'approved'),
  ('react', 'react', 'approved'),
  ('laravel', 'laravel', 'approved'),
  ('tailwind', 'tailwind', 'approved'),
  ('typescript', 'typescript', 'approved'),
  ('postgres', 'postgres', 'approved'),
  ('supabase', 'supabase', 'approved'),
  ('queue', 'queue', 'approved'),
  ('rls', 'rls', 'approved'),
  ('docker', 'docker', 'approved');

insert into public.series (slug, title, description) values
  ('laravel-tu-a-z', 'Laravel từ A-Z', 'Xây một ứng dụng Laravel hoàn chỉnh, từ routing tới queue và deploy.');

-- Demo users (local only) ----------------------------------------------------
insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at)
values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'hainam@example.com', '{"user_name":"hainam","full_name":"Nguyễn Hải Nam"}', now(), now()),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'minhanh@example.com', '{"user_name":"minhanh","full_name":"Trần Minh Anh"}', now(), now());

update public.profiles set role = 'editor', specialty = 'Backend · Laravel',
  bio = 'Backend engineer, thích queue, cache và những hệ thống chạy êm lúc 3 giờ sáng.'
where username = 'hainam';
update public.profiles set role = 'author', specialty = 'Frontend · React',
  bio = 'Frontend developer, mê design system và animation vừa đủ.'
where username = 'minhanh';

-- Demo posts -----------------------------------------------------------------
insert into public.posts (slug, title, excerpt, content_md, status, level, category_id, series_id, series_position, reading_minutes, created_by, published_at)
select v.slug, v.title, v.excerpt, v.content_md, 'published', v.level::public.post_level,
  (select id from public.categories where slug = v.category),
  (select id from public.series where slug = v.series),
  v.series_position, v.reading_minutes,
  (select id from public.profiles where username = v.author),
  now() - (v.days_ago || ' days')::interval
from (values
  ('queue-trong-laravel', 'Queue trong Laravel: xử lý việc nặng mà không bắt người dùng chờ',
   'Gửi email, resize ảnh, gọi API chậm… tất cả nên chạy nền. Bài này đi từ job đầu tiên tới retry và failed jobs.',
   E'## Vì sao cần queue\n\nMột request HTTP nên trả về trong vài trăm mili giây. Mọi việc lâu hơn thế nên được **đẩy vào hàng đợi**.\n\n## Tạo job đầu tiên\n\n```php\n// app/Jobs/SendWelcomeEmail.php\nclass SendWelcomeEmail implements ShouldQueue\n{\n    public function __construct(public User $user) {}\n\n    public function handle(): void\n    {\n        Mail::to($this->user)->send(new WelcomeMail($this->user));\n    }\n}\n```\n\n> Mẹo: luôn truyền model thay vì mảng dữ liệu, Laravel sẽ serialize ID và tải lại model khi job chạy.\n\n## Retry và failed jobs\n\nĐặt `$tries` và `$backoff` để job tự thử lại khi dịch vụ ngoài lỗi tạm thời.\n',
   'intermediate', 'laravel', 'laravel-tu-a-z', 3, 8, 'hainam', 2),
  ('rls-supabase-cho-nguoi-moi', 'Row Level Security trong Supabase cho người mới bắt đầu',
   'RLS biến Postgres thành lớp phân quyền cuối cùng. Hiểu policy, auth.uid() và các lỗi hay gặp.',
   E'## RLS là gì\n\nRow Level Security cho phép viết luật truy cập **cho từng dòng** dữ liệu ngay trong Postgres.\n\n```sql\ncreate policy "chỉ sửa bình luận của mình" on comments\n  for update using (author_id = auth.uid());\n```\n\n## Lỗi hay gặp\n\n- Quên `enable row level security` khiến bảng mở toang.\n- Viết policy gọi lại chính bảng đó gây đệ quy.\n',
   'beginner', 'postgresql', null, null, 6, 'hainam', 5),
  ('server-components-thuc-chien', 'Server Components thực chiến: khi nào cần "use client"?',
   'Mặc định là server, chỉ xuống client khi thật sự cần tương tác. Vài quy tắc đơn giản để không lạc lối.',
   E'## Mặc định là server\n\nTrong App Router, mọi component là **Server Component** cho tới khi bạn viết `"use client"`.\n\n## Khi nào cần client\n\n- Có state hoặc effect\n- Lắng nghe sự kiện như `onClick`\n- Dùng API của trình duyệt\n\n```tsx\n"use client"\n\nexport function LikeButton() {\n  const [liked, setLiked] = useState(false)\n  return <button onClick={() => setLiked(!liked)}>{liked ? "Đã thích" : "Thích"}</button>\n}\n```\n',
   'intermediate', 'nextjs', null, null, 7, 'minhanh', 1)
) as v(slug, title, excerpt, content_md, level, category, series, series_position, reading_minutes, author, days_ago);

insert into public.post_tags (post_id, tag_id)
select p.id, t.id
from (values
  ('queue-trong-laravel', 'laravel'),
  ('queue-trong-laravel', 'queue'),
  ('rls-supabase-cho-nguoi-moi', 'supabase'),
  ('rls-supabase-cho-nguoi-moi', 'rls'),
  ('rls-supabase-cho-nguoi-moi', 'postgres'),
  ('server-components-thuc-chien', 'nextjs'),
  ('server-components-thuc-chien', 'react')
) as v(post_slug, tag_slug)
join public.posts p on p.slug = v.post_slug
join public.tags t on t.slug = v.tag_slug;

-- More demo posts so lists, filters and feeds have something to show --------
insert into public.posts (slug, title, excerpt, content_md, status, level, category_id, reading_minutes, created_by, published_at)
select v.slug, v.title, v.excerpt, E'## Mở đầu\n\n' || v.excerpt || E'\n\n## Chi tiết\n\nNội dung demo cho môi trường local.\n',
  'published', v.level::public.post_level,
  (select id from public.categories where slug = v.category),
  v.reading_minutes,
  (select id from public.profiles where username = v.author),
  now() - (v.days_ago || ' days')::interval
from (values
  ('tailwind-v4-co-gi-moi', 'Tailwind v4 có gì mới: CSS-first config và @theme', 'Bỏ tailwind.config.js, khai báo token ngay trong CSS. Những thay đổi đáng giá khi nâng cấp.', 'beginner', 'css', 5, 'minhanh', 3),
  ('react-19-actions', 'React 19 Actions: form không cần useState', 'useActionState, useFormStatus và cách viết form gọn hơn hẳn.', 'intermediate', 'react', 9, 'minhanh', 4),
  ('docker-compose-cho-dev', 'Docker Compose cho môi trường dev: một lệnh là chạy', 'Postgres, Redis và app trong một file compose, kèm hot reload.', 'beginner', 'docker', 6, 'hainam', 6),
  ('index-postgres-thuc-chien', 'Index trong Postgres: khi nào B-tree, khi nào GIN?', 'Đọc EXPLAIN ANALYZE, chọn đúng loại index và tránh index thừa.', 'advanced', 'postgresql', 12, 'hainam', 7),
  ('llm-agent-tool-calling', 'Tool calling cho LLM agent: thiết kế tool sao cho dễ dùng', 'Tên tool, mô tả, schema tham số và cách trả lỗi để agent tự sửa.', 'intermediate', 'agents', 10, 'minhanh', 8),
  ('ci-github-actions-nhanh', 'Tăng tốc CI trên GitHub Actions với cache và matrix', 'Cache dependency, chia job song song và chỉ chạy test liên quan.', 'intermediate', 'ci-cd', 7, 'hainam', 9),
  ('redis-cache-aside', 'Cache-aside với Redis: đọc nhanh mà không sai dữ liệu', 'TTL, invalidation và tránh cache stampede khi traffic tăng.', 'advanced', 'redis', 11, 'hainam', 10),
  ('vue-composition-api', 'Composition API trong Vue 3 cho người đến từ React', 'ref, computed, watch và composable: so sánh với hooks.', 'beginner', 'vue', 8, 'minhanh', 12),
  ('go-goroutine-channel', 'Goroutine và channel: đồng thời mà không đau đầu', 'Worker pool, select và context để huỷ việc đúng lúc.', 'intermediate', 'go', 9, 'hainam', 14),
  ('phong-van-frontend', 'Chuẩn bị phỏng vấn frontend: những câu hay gặp', 'Event loop, rendering, accessibility và cách kể về dự án của bạn.', 'beginner', 'career', 6, 'minhanh', 15)
) as v(slug, title, excerpt, level, category, reading_minutes, author, days_ago);

insert into public.post_tags (post_id, tag_id)
select p.id, t.id
from (values
  ('tailwind-v4-co-gi-moi', 'tailwind'),
  ('react-19-actions', 'react'),
  ('react-19-actions', 'typescript'),
  ('docker-compose-cho-dev', 'docker'),
  ('docker-compose-cho-dev', 'postgres'),
  ('index-postgres-thuc-chien', 'postgres'),
  ('llm-agent-tool-calling', 'typescript'),
  ('ci-github-actions-nhanh', 'docker'),
  ('redis-cache-aside', 'queue'),
  ('vue-composition-api', 'typescript'),
  ('go-goroutine-channel', 'queue')
) as v(post_slug, tag_slug)
join public.posts p on p.slug = v.post_slug
join public.tags t on t.slug = v.tag_slug;
