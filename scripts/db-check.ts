/*
 * Read-only security audit of the Supabase database.
 *
 *   npm run db:check
 *
 * Reports tables without Row Level Security, and table/column privileges
 * that would let browser roles (anon, authenticated) change data that
 * policies or column grants are meant to protect.
 */
import { run } from "./lib/db";

run(async (client) => {
  let problems = 0;
  const report = (ok: boolean, message: string) => {
    console.log(`${ok ? "PASS" : "FAIL"}  ${message}`);
    if (!ok) problems++;
  };

  const noRls = await client.query<{ table_name: string }>(`
    select c.relname as table_name from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity`);
  report(noRls.rows.length === 0, `Every public table has RLS enabled${noRls.rows.length ? `: missing on ${noRls.rows.map((r) => r.table_name).join(", ")}` : ""}`);

  // Users may change only their display name. A table-wide UPDATE grant would let
  // the "update own profile" policy accept changes to the role column too.
  const profileUpdate = await client.query<{ grantee: string; columns: string }>(`
    select grantee, string_agg(column_name, ', ' order by column_name) as columns
    from information_schema.column_privileges
    where table_schema = 'public' and table_name = 'profiles' and privilege_type = 'UPDATE'
      and grantee in ('anon', 'authenticated')
    group by grantee`);
  for (const role of ["anon", "authenticated"]) {
    const cols = profileUpdate.rows.find((r) => r.grantee === role)?.columns ?? "";
    const expected = role === "authenticated" ? "display_name" : "";
    report(cols === expected, `${role} can update profiles columns: ${cols || "none"} (expected ${expected || "none"})`);
  }

  const profileOther = await client.query<{ grantee: string; privilege_type: string }>(`
    select grantee, privilege_type from information_schema.role_table_grants
    where table_schema = 'public' and table_name = 'profiles'
      and grantee in ('anon', 'authenticated') and privilege_type in ('INSERT', 'DELETE', 'TRUNCATE')`);
  report(profileOther.rows.length === 0, `No browser role can insert, delete or truncate profiles${profileOther.rows.length ? `: ${profileOther.rows.map((r) => `${r.grantee} ${r.privilege_type}`).join(", ")}` : ""}`);

  const roleGuard = await client.query(`
    select 1 from pg_trigger where tgrelid = 'public.profiles'::regclass and tgname = 'profiles_protect_role'`);
  report(roleGuard.rows.length === 1, "Role-change guard trigger is installed on profiles");

  const truncate = await client.query<{ grantee: string; table_name: string }>(`
    select grantee, table_name from information_schema.role_table_grants
    where table_schema = 'public' and privilege_type = 'TRUNCATE' and grantee in ('anon', 'authenticated')`);
  report(truncate.rows.length === 0, `No browser role can TRUNCATE (TRUNCATE bypasses RLS)${truncate.rows.length ? `: ${truncate.rows.length} grants` : ""}`);

  console.log(problems ? `\n${problems} problem(s) found` : "\nNo problems found");
  if (problems) process.exitCode = 1;
});
