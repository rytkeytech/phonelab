-- =====================================================================
-- 0002: Tighten table privileges for the browser roles.
--
-- Supabase grants ALL privileges on new public tables to anon and
-- authenticated by default. Combined with the "Update own profile" policy,
-- that let a signed-in user change their own `role` column, and it also
-- granted TRUNCATE (which ignores RLS). This migration removes every
-- automatic grant and re-grants exactly what PhoneLab needs.
-- =====================================================================

-- Start from nothing...
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

-- ...and stop future tables from receiving automatic grants. Every new
-- table must now grant its privileges explicitly in its migration.
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;

-- Public content: everyone can read (RLS decides which rows).
grant select on public.brands, public.phone_models, public.fault_categories,
  public.repair_cases, public.repair_media, public.courses, public.lessons,
  public.quizzes, public.game_scenarios, public.game_steps to anon, authenticated;

-- Signed-in users may write where an RLS policy allows it (members
-- submitting cases and media, staff managing content).
grant insert, update, delete on public.brands, public.phone_models,
  public.fault_categories, public.repair_cases, public.repair_media, public.courses,
  public.lessons, public.quizzes, public.game_scenarios, public.game_steps
  to authenticated;

-- Per-user data: owner-only policies.
grant select, insert, update, delete on public.user_progress, public.game_results,
  public.bookmarks to authenticated;

-- Profiles: read (own row, by policy) and change the display name only.
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

-- Internal functions are for triggers and policies, not for API calls.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- Second lock: even if a broad UPDATE grant ever returns, a role or id
-- change can only come from the SQL editor or a server-side admin task.
create function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user in ('anon', 'authenticated')
     and (new.role is distinct from old.role or new.id is distinct from old.id) then
    raise exception 'Profile role and id can only be changed by an administrator'
      using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke execute on function public.protect_profile_role() from public, anon, authenticated;

create trigger profiles_protect_role before update on public.profiles
  for each row execute function public.protect_profile_role();
