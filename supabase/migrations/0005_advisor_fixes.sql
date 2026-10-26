-- =====================================================================
-- 0005: Fixes from the Supabase security and performance advisors.
--
-- 1. is_staff() could be called by signed-out visitors through the API
--    (/rest/v1/rpc/is_staff). Four public-read policies called it, so
--    revoking it alone would have broken reading for signed-out
--    visitors. Those policies no longer call it: their "or is_staff()"
--    part was redundant, because each table's "Staff manage ..." policy
--    (FOR ALL, which includes SELECT) already lets staff read every row.
-- 2. rls_auto_enable() is not created by any PhoneLab migration (it was
--    present on the live project). It is locked down only if it exists.
-- 3. Indexes for four foreign keys that had none.
-- =====================================================================

-- ---------- 1. Read policies without is_staff() ----------------------
-- Same rows visible as before for every role.

drop policy "Anyone can read published scenarios" on public.game_scenarios;
create policy "Anyone can read published scenarios" on public.game_scenarios
  for select to anon, authenticated
  using (published);

drop policy "Anyone can read steps of published scenarios" on public.game_steps;
create policy "Anyone can read steps of published scenarios" on public.game_steps
  for select to anon, authenticated
  using (exists (select 1 from public.game_scenarios s where s.id = scenario_id and s.published));

drop policy "Read published cases, own cases, or all as staff" on public.repair_cases;
create policy "Read published cases or own cases" on public.repair_cases
  for select to anon, authenticated
  using (status = 'published' or submitted_by = (select auth.uid()));

drop policy "Read approved media of published cases, own uploads, or all as staff" on public.repair_media;
create policy "Read approved media of published cases, or own uploads" on public.repair_media
  for select to anon, authenticated
  using (
    (approved and exists (select 1 from public.repair_cases c where c.id = repair_case_id and c.status = 'published'))
    or uploaded_by = (select auth.uid())
  );

-- Functions are executable by PUBLIC by default, so revoke from PUBLIC too.
-- Signed-in users keep it: the staff policies call it on their behalf.
revoke execute on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated;

-- ---------- 2. rls_auto_enable() --------------------------------------
-- Revoking EXECUTE does not stop a trigger or event trigger from running
-- the function; it only stops API callers invoking it directly.

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$$;

-- ---------- 3. Foreign-key indexes ------------------------------------
-- Each of these columns is the second column of its table's primary key
-- (or not indexed at all), so lookups by it alone couldn't use an index.

create index if not exists game_results_scenario_idx on public.game_results (scenario_id);
create index if not exists repair_cases_reviewed_by_idx on public.repair_cases (reviewed_by);
create index if not exists repair_media_uploaded_by_idx on public.repair_media (uploaded_by);
create index if not exists user_progress_lesson_idx on public.user_progress (lesson_id);
