/*
 * Gives an existing account a role.
 *
 *   npm run db:set-role -- someone@example.com admin
 *   npm run db:set-role -- someone@example.com reviewer
 *   npm run db:set-role -- someone@example.com member
 *
 * Roles can't be changed from the app itself (see 0002_harden_privileges.sql),
 * only through this direct database connection.
 */
import { run } from "./lib/db";

const roles = ["member", "reviewer", "admin"];
const [email, role] = process.argv.slice(2);

if (!email || !roles.includes(role)) {
  console.error("Usage: npm run db:set-role -- <email> <member|reviewer|admin>");
  process.exit(1);
}

run(async (client) => {
  const { rows } = await client.query<{ email: string; role: string }>(
    `update public.profiles p set role = $2::public.user_role
     from auth.users u
     where u.id = p.id and lower(u.email) = lower($1)
     returning u.email, p.role`,
    [email, role],
  );
  if (rows.length === 0) {
    throw new Error(`No account found for ${email}. Sign up in the app first, and confirm the email.`);
  }
  console.log(`✓ ${rows[0].email} is now ${rows[0].role}. Refresh PhoneLab to see it.`);
});
