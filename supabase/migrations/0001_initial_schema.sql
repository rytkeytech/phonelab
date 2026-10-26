-- =====================================================================
-- PhoneLab initial schema
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Safe defaults: Row Level Security (RLS) is on for every table.
-- =====================================================================

-- ---------- Types ----------------------------------------------------

create type public.user_role as enum ('member', 'reviewer', 'admin');
create type public.chipset_platform as enum ('mediatek', 'qualcomm', 'exynos', 'unisoc', 'apple');
create type public.confidence_level as enum ('verified', 'corroborated', 'hypothesis', 'unverified');
create type public.difficulty as enum ('beginner', 'intermediate', 'advanced');
create type public.lesson_status as enum ('published', 'planned');
create type public.case_status as enum ('draft', 'submitted', 'changes_requested', 'published', 'rejected');
create type public.media_kind as enum ('photo', 'thermal', 'diagram', 'other');

-- ---------- Shared helpers -------------------------------------------

-- Keeps updated_at current on every UPDATE.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- Profiles -------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) between 1 and 80),
  role public.user_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Every new sign-up gets a profile with the 'member' role.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 80), ''));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- True when the current user is a reviewer or admin.
-- security definer so it can read profiles without tripping profiles' own RLS.
create function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('reviewer', 'admin')
  );
$$;

-- ---------- Devices and categories -----------------------------------

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 60),
  created_at timestamptz not null default now()
);

create table public.phone_models (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands (id) on delete restrict,
  name text not null check (char_length(name) between 1 and 100),
  platform public.chipset_platform not null,
  chipset text check (char_length(chipset) <= 80),
  created_at timestamptz not null default now(),
  unique (brand_id, name)
);
create index phone_models_brand_idx on public.phone_models (brand_id);

create table public.fault_categories (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  label text not null,
  sort_order int not null default 0
);

-- ---------- Repair cases ---------------------------------------------

create table public.repair_cases (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 5 and 160),
  summary text not null check (char_length(summary) <= 500),
  phone_model_id uuid not null references public.phone_models (id) on delete restrict,
  board_revision text check (char_length(board_revision) <= 60),
  fault_category_id text not null references public.fault_categories (id),
  symptoms text[] not null default '{}',
  initial_checks text[] not null default '{}',
  -- [{ point, mode, condition, observed, reference }]
  measurements jsonb not null default '[]' check (jsonb_typeof(measurements) = 'array'),
  diagnostic_steps text[] not null default '{}',
  root_cause text,
  repair_procedure text[] not null default '{}',
  verification text[] not null default '{}',
  -- [{ title, url?, kind, note? }]
  sources jsonb not null default '[]' check (jsonb_typeof(sources) = 'array'),
  confidence public.confidence_level not null default 'unverified',
  confidence_note text not null default '',
  related_blocks text[] not null default '{}',
  status public.case_status not null default 'draft',
  submitted_by uuid references public.profiles (id) on delete set null,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Accuracy rules from the project brief, enforced by the database:
  -- Verified or Corroborated claims must cite at least one source.
  constraint sourced_confidence check (
    confidence in ('hypothesis', 'unverified') or jsonb_array_length(sources) > 0
  ),
  -- A published case must have been reviewed.
  constraint published_is_reviewed check (
    status <> 'published' or (reviewed_by is not null and published_at is not null)
  )
);

create index repair_cases_status_idx on public.repair_cases (status);
create index repair_cases_model_idx on public.repair_cases (phone_model_id);
create index repair_cases_category_idx on public.repair_cases (fault_category_id);
create index repair_cases_submitted_by_idx on public.repair_cases (submitted_by);
create index repair_cases_updated_idx on public.repair_cases (updated_at desc);

create trigger repair_cases_updated_at before update on public.repair_cases
  for each row execute function public.set_updated_at();

create table public.repair_media (
  id uuid primary key default gen_random_uuid(),
  repair_case_id uuid not null references public.repair_cases (id) on delete cascade,
  -- Path inside the 'repair-media' storage bucket: <uploader id>/<file>
  storage_path text not null unique,
  caption text not null default '' check (char_length(caption) <= 300),
  kind public.media_kind not null default 'photo',
  uploaded_by uuid references public.profiles (id) on delete set null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
create index repair_media_case_idx on public.repair_media (repair_case_id);

-- ---------- Learning content -----------------------------------------
-- Authored in the codebase (src/data/learning) and loaded with seed.sql.

create table public.courses (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  sort_order int not null,
  title text not null,
  description text not null
);

create table public.lessons (
  id text primary key, -- "<course id>/<slug>"
  course_id text not null references public.courses (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9-]+$'),
  sort_order int not null,
  title text not null,
  summary text not null,
  minutes int not null check (minutes > 0),
  difficulty public.difficulty not null,
  status public.lesson_status not null default 'planned',
  objectives text[] not null default '{}',
  blocks jsonb not null default '[]' check (jsonb_typeof(blocks) = 'array'),
  unique (course_id, slug)
);
create index lessons_course_idx on public.lessons (course_id);

create table public.quizzes (
  lesson_id text primary key references public.lessons (id) on delete cascade,
  -- [{ id, prompt, options[], correctIndex, explanation }]
  questions jsonb not null check (jsonb_typeof(questions) = 'array')
);

-- ---------- Diagnostic game ------------------------------------------

create table public.game_scenarios (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  title text not null,
  symptom text not null,
  difficulty public.difficulty not null,
  brief text not null,
  device text not null,
  debrief jsonb not null,
  related_lesson_ids text[] not null default '{}',
  related_blocks text[] not null default '{}',
  published boolean not null default true
);

create table public.game_steps (
  id uuid primary key default gen_random_uuid(),
  scenario_id text not null references public.game_scenarios (id) on delete cascade,
  position int not null check (position >= 0),
  step_key text not null,
  prompt text not null,
  -- [{ id, label, quality, feedback, finding?, reading? }]
  choices jsonb not null check (jsonb_typeof(choices) = 'array'),
  unique (scenario_id, position),
  unique (scenario_id, step_key)
);

-- ---------- Per-user data --------------------------------------------

create table public.user_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null references public.lessons (id) on delete cascade,
  completed_at timestamptz,
  quiz_score int check (quiz_score >= 0),
  quiz_total int check (quiz_total > 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id),
  check (quiz_score is null or quiz_score <= quiz_total)
);

create trigger user_progress_updated_at before update on public.user_progress
  for each row execute function public.set_updated_at();

create table public.game_results (
  user_id uuid not null references public.profiles (id) on delete cascade,
  scenario_id text not null references public.game_scenarios (id) on delete cascade,
  best_score int not null check (best_score >= 0),
  max_score int not null check (max_score > 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, scenario_id),
  check (best_score <= max_score)
);

create trigger game_results_updated_at before update on public.game_results
  for each row execute function public.set_updated_at();

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  repair_case_id uuid references public.repair_cases (id) on delete cascade,
  lesson_id text references public.lessons (id) on delete cascade,
  created_at timestamptz not null default now(),
  -- Exactly one target per bookmark
  check (num_nonnulls(repair_case_id, lesson_id) = 1),
  unique (user_id, repair_case_id),
  unique (user_id, lesson_id)
);
create index bookmarks_user_idx on public.bookmarks (user_id);

-- =====================================================================
-- Row Level Security
-- (select auth.uid()) is wrapped in a sub-select so Postgres evaluates it
-- once per query instead of once per row.
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.phone_models enable row level security;
alter table public.fault_categories enable row level security;
alter table public.repair_cases enable row level security;
alter table public.repair_media enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.quizzes enable row level security;
alter table public.game_scenarios enable row level security;
alter table public.game_steps enable row level security;
alter table public.user_progress enable row level security;
alter table public.game_results enable row level security;
alter table public.bookmarks enable row level security;

-- Table privileges. RLS policies below decide which rows each role sees.
grant usage on schema public to anon, authenticated;
grant select on public.brands, public.phone_models, public.fault_categories,
  public.repair_cases, public.repair_media, public.courses, public.lessons,
  public.quizzes, public.game_scenarios, public.game_steps to anon, authenticated;
grant select, insert, update, delete on public.brands, public.phone_models,
  public.fault_categories, public.repair_cases, public.repair_media, public.courses,
  public.lessons, public.quizzes, public.game_scenarios, public.game_steps,
  public.user_progress, public.game_results, public.bookmarks to authenticated;
grant select on public.profiles to authenticated;
-- Users may only ever change their display name; role changes need the SQL editor.
grant update (display_name) on public.profiles to authenticated;
grant execute on function public.is_staff() to anon, authenticated;

-- ---------- profiles: private to their owner (staff can see all) ------

create policy "Read own profile, staff read all" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_staff()));

create policy "Update own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---------- Public reference and learning content --------------------
-- Everyone can read; only staff can change.

create policy "Anyone can read brands" on public.brands for select to anon, authenticated using (true);
create policy "Anyone can read phone models" on public.phone_models for select to anon, authenticated using (true);
create policy "Anyone can read fault categories" on public.fault_categories for select to anon, authenticated using (true);
create policy "Anyone can read courses" on public.courses for select to anon, authenticated using (true);
create policy "Anyone can read lessons" on public.lessons for select to anon, authenticated using (true);
create policy "Anyone can read quizzes of published lessons" on public.quizzes for select to anon, authenticated
  using (exists (select 1 from public.lessons l where l.id = lesson_id and l.status = 'published'));
create policy "Anyone can read published scenarios" on public.game_scenarios for select to anon, authenticated
  using (published or (select public.is_staff()));
create policy "Anyone can read steps of published scenarios" on public.game_steps for select to anon, authenticated
  using (exists (select 1 from public.game_scenarios s where s.id = scenario_id and (s.published or (select public.is_staff()))));

-- Members may add brands and models when submitting a case; only staff edit or remove them.
create policy "Members add brands" on public.brands for insert to authenticated with check (true);
create policy "Members add phone models" on public.phone_models for insert to authenticated with check (true);

create policy "Staff manage brands" on public.brands for update to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "Staff delete brands" on public.brands for delete to authenticated using ((select public.is_staff()));
create policy "Staff manage phone models" on public.phone_models for update to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "Staff delete phone models" on public.phone_models for delete to authenticated using ((select public.is_staff()));

create policy "Staff manage fault categories" on public.fault_categories for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "Staff manage courses" on public.courses for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "Staff manage lessons" on public.lessons for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "Staff manage quizzes" on public.quizzes for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "Staff manage scenarios" on public.game_scenarios for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "Staff manage game steps" on public.game_steps for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

-- ---------- repair_cases: publish only through review ----------------

create policy "Read published cases, own cases, or all as staff" on public.repair_cases
  for select to anon, authenticated
  using (
    status = 'published'
    or submitted_by = (select auth.uid())
    or (select public.is_staff())
  );

-- Members submit drafts. They can't publish, can't fill review fields,
-- and can't claim Verified/Corroborated: that's a reviewer's decision.
create policy "Members create unpublished cases" on public.repair_cases
  for insert to authenticated
  with check (
    submitted_by = (select auth.uid())
    and status in ('draft', 'submitted')
    and confidence in ('hypothesis', 'unverified')
    and reviewed_by is null and reviewed_at is null and published_at is null
  );

create policy "Members edit own cases before review" on public.repair_cases
  for update to authenticated
  using (
    submitted_by = (select auth.uid())
    and status in ('draft', 'submitted', 'changes_requested')
  )
  with check (
    submitted_by = (select auth.uid())
    and status in ('draft', 'submitted')
    and confidence in ('hypothesis', 'unverified')
    and reviewed_by is null and reviewed_at is null and published_at is null
  );

create policy "Members delete own drafts" on public.repair_cases
  for delete to authenticated
  using (submitted_by = (select auth.uid()) and status = 'draft');

create policy "Staff manage all cases" on public.repair_cases
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

-- ---------- repair_media: hidden until approved ----------------------

create policy "Read approved media of published cases, own uploads, or all as staff" on public.repair_media
  for select to anon, authenticated
  using (
    (approved and exists (select 1 from public.repair_cases c where c.id = repair_case_id and c.status = 'published'))
    or uploaded_by = (select auth.uid())
    or (select public.is_staff())
  );

create policy "Members upload unapproved media to own cases" on public.repair_media
  for insert to authenticated
  with check (
    uploaded_by = (select auth.uid())
    and not approved
    and exists (select 1 from public.repair_cases c where c.id = repair_case_id and c.submitted_by = (select auth.uid()))
  );

create policy "Members delete own unapproved media" on public.repair_media
  for delete to authenticated
  using (uploaded_by = (select auth.uid()) and not approved);

create policy "Staff manage media" on public.repair_media
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

-- ---------- Per-user data: owner only --------------------------------

create policy "Own progress" on public.user_progress
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Own game results" on public.game_results
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Own bookmarks" on public.bookmarks
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- =====================================================================
-- Storage: private bucket for repair evidence
-- Files live under "<user id>/..." so each user can only touch their own.
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('repair-media', 'repair-media', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Upload to own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'repair-media' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Read own files, staff read all" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'repair-media'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_staff()))
  );

create policy "Delete own files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'repair-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
