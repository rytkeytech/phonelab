import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-path";

/**
 * Landing point for links in Supabase emails (sign-up confirmation).
 * Exchanges the one-time code for a session cookie, then continues.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // Expired or already-used link, or opened in a different browser from sign-up.
  const reason = searchParams.get("error_description") ?? "That link is invalid or has expired.";
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(reason)}`);
}
