import "server-only";
import { cache } from "react";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

export type Role = "member" | "reviewer" | "admin";

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: Role;
};

/**
 * The signed-in user, or null. Reads the request's cookies, so call it only
 * inside a <Suspense> boundary. Cached per request, so calling it from
 * several components costs one lookup.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  // getClaims verifies the session token; getSession alone would trust the cookie.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", claims.sub)
    .single();

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : "",
    displayName: profile?.display_name ?? null,
    role: (profile?.role as Role | undefined) ?? "member",
  };
});

export function isStaff(user: CurrentUser | null) {
  return user?.role === "reviewer" || user?.role === "admin";
}
