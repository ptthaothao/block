-- Public `post` bucket for images uploaded from the CMS (covers, content
-- images, ...). Folders inside it are chosen by the caller; these policies only
-- care about the bucket. The app uploads as the signed-in user (BFF), so
-- Storage RLS is what decides who may write here.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post',
  'post',
  true,
  4194304, -- 4 MiB, same as IMAGE_MAX_BYTES in features/storage/constants.ts
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Public buckets serve objects by URL without a select policy; this one only
-- covers API reads, which delete needs alongside the delete policy.
create policy "post images: authors read their own, editors read all"
on storage.objects for select to authenticated
using (
  bucket_id = 'post'
  and (owner_id = (select auth.uid())::text or (select private.is_editor()))
);

create policy "post images: authors upload"
on storage.objects for insert to authenticated
with check (bucket_id = 'post' and (select private.is_author()));

create policy "post images: authors delete their own, editors delete any"
on storage.objects for delete to authenticated
using (
  bucket_id = 'post'
  and (owner_id = (select auth.uid())::text or (select private.is_editor()))
);
