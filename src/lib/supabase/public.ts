import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabasePublishableKey, supabaseUrl } from "./config";

/**
 * Supabase client with no user session, for reading public data.
 * Because it never touches cookies, its results can be cached and shared
 * between visitors ('use cache'). It sees only what RLS allows anyone to see.
 */
export function createPublicClient() {
  return createSupabaseClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
