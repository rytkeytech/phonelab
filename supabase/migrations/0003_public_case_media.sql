-- =====================================================================
-- 0003: Storage access for the review workflow.
--
-- The repair-media bucket stays private. Files become readable by
-- everyone only when a reviewer has approved the photo AND its case is
-- published; the app then serves them through short-lived signed URLs.
-- Staff may also delete files (e.g. a rejected photo).
-- =====================================================================

create policy "Anyone can read approved media of published cases" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'repair-media'
    and exists (
      select 1
      from public.repair_media m
      join public.repair_cases c on c.id = m.repair_case_id
      where m.storage_path = storage.objects.name
        and m.approved
        and c.status = 'published'
    )
  );

create policy "Staff delete any file" on storage.objects
  for delete to authenticated
  using (bucket_id = 'repair-media' and (select public.is_staff()));
