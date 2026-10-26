/*
 * Applies database migrations and the content seed to Supabase.
 *
 *   npm run db:apply
 *
 * - Each migration runs once, inside a transaction; applied names are recorded.
 * - seed.sql runs every time (it updates existing rows).
 * Connection settings: see scripts/lib/db.ts.
 */
import { readdirSync, readFileSync } from "node:fs";
import { projectPath, run } from "./lib/db";

const migrationsDir = projectPath("supabase/migrations/");
const seedFile = projectPath("supabase/seed.sql");

run(async (client) => {
  // Private schema: not exposed through Supabase's public API.
  await client.query(`
    create schema if not exists phonelab_private;
    create table if not exists phonelab_private.applied_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    );
  `);
  const applied = new Set(
    (await client.query<{ name: string }>("select name from phonelab_private.applied_migrations")).rows.map((r) => r.name),
  );

  const files = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`✓ ${file} (already applied)`);
      continue;
    }
    const sql = readFileSync(migrationsDir + file, "utf8");
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query("insert into phonelab_private.applied_migrations (name) values ($1)", [file]);
      await client.query("commit");
      console.log(`✓ ${file} applied`);
    } catch (error) {
      await client.query("rollback");
      throw new Error(`${file} failed and was rolled back: ${(error as Error).message}`);
    }
  }

  // seed.sql contains its own begin/commit.
  await client.query(readFileSync(seedFile, "utf8"));
  console.log("✓ seed.sql loaded");

  const { rows } = await client.query<{ courses: number; lessons: number; scenarios: number }>(`
    select (select count(*) from public.courses)::int as courses,
           (select count(*) from public.lessons)::int as lessons,
           (select count(*) from public.game_scenarios)::int as scenarios`);
  console.log(`Database now has ${rows[0].courses} courses, ${rows[0].lessons} lessons, ${rows[0].scenarios} scenarios.`);
});
