-- Storage: `media` (images) and `resumes` (PDF). Both public for reading
-- through their public URL; only admins can upload, replace or delete.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']),
  ('resumes', 'resumes', true, 5242880, array['application/pdf']);

-- select + insert + update are all required for upsert (file replacement).
create policy "storage: admin read"
  on storage.objects for select to authenticated
  using (bucket_id in ('media', 'resumes') and (select private.is_admin()));

create policy "storage: admin insert"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('media', 'resumes') and (select private.is_admin()));

create policy "storage: admin update"
  on storage.objects for update to authenticated
  using (bucket_id in ('media', 'resumes') and (select private.is_admin()))
  with check (bucket_id in ('media', 'resumes') and (select private.is_admin()));

create policy "storage: admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id in ('media', 'resumes') and (select private.is_admin()));
