/*
 * Supabase settings from .env.local (see .env.example).
 * Both values are public by design: the publishable key only allows what
 * Row Level Security policies permit.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** False until .env.local is filled in; the app then runs without accounts. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);
