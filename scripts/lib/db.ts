/*
 * Shared database connection for the scripts in scripts/.
 *
 * Needs, in .env.local, either SUPABASE_DB_PASSWORD + SUPABASE_DB_REGION
 * or a full SUPABASE_DB_URL (Supabase → Connect → Session pooler).
 * The password and connection string are never printed.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

export const projectPath = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url));

// Supabase signs database certificates with its own root CA (also downloadable
// from Project Settings → Database → SSL Configuration). Pinning it lets the
// connection be fully verified.
const supabaseRootCa = readFileSync(projectPath("supabase/certs/supabase-root-2021-ca.crt"), "utf8");

/**
 * Connection strings to try, in order. Either SUPABASE_DB_URL as copied from
 * the dashboard, or one built from the project's password and region using
 * Supabase's Session pooler (works on IPv4-only networks).
 */
function connectionCandidates(): string[] {
  if (process.env.SUPABASE_DB_URL) return [process.env.SUPABASE_DB_URL];

  const password = process.env.SUPABASE_DB_PASSWORD;
  const region = process.env.SUPABASE_DB_REGION?.trim();
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!password || !region || !projectUrl) {
    throw new Error("Set SUPABASE_DB_PASSWORD and SUPABASE_DB_REGION (or SUPABASE_DB_URL) in .env.local. See .env.example.");
  }
  const ref = new URL(projectUrl).hostname.split(".")[0];
  // encodeURIComponent keeps passwords with @, #, / etc. working.
  const credentials = `postgres.${ref}:${encodeURIComponent(password)}`;
  // Supabase runs poolers under two host prefixes; the right one depends on the project.
  return ["aws-0", "aws-1"].map(
    (prefix) => `postgresql://${credentials}@${prefix}-${region}.pooler.supabase.com:5432/postgres`,
  );
}

function newClient(connectionString: string) {
  return new Client({
    connectionString,
    // TLS with full verification of certificate chain and hostname.
    ssl: { ca: supabaseRootCa, rejectUnauthorized: true },
    connectionTimeoutMillis: 15000,
  });
}

/** Connects with the first candidate the pooler recognises. Call client.end() when done. */
export async function connect(): Promise<Client> {
  for (const candidate of connectionCandidates()) {
    const client = newClient(candidate);
    try {
      await client.connect();
      return client;
    } catch (error) {
      await client.end().catch(() => {});
      // "Tenant or user not found" / "tenant/user … not found": wrong pooler host
      // for this project; try the next one.
      if (!/tenant(\/| or )user.*not found/i.test((error as Error).message)) throw error;
    }
  }
  throw new Error("The pooler didn't recognise this project. Check SUPABASE_DB_REGION.");
}

/** Runs a script's main function with a connected client and readable errors. */
export function run(main: (client: Client) => Promise<void>) {
  let client: Client | undefined;
  connect()
    .then((c) => main((client = c)))
    .catch((error: Error) => {
      console.error(`✗ ${error.message}`);
      process.exitCode = 1;
    })
    .finally(() => client?.end());
}
