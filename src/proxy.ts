import { type NextRequest, NextResponse } from "next/server";
import { courses, publishedLessons } from "@/data/learning";
import { scenarios } from "@/data/diagnose";
import { updateSession } from "@/lib/supabase/session";

/*
 * Runs before every page request:
 * 1. Returns a real 404 for content URLs that don't exist. Pages stream, so
 *    once rendering starts the status is already 200; checking here first
 *    lets missing lessons and scenarios answer with a proper 404.
 * 2. Forwards stray sign-in email links to /auth/callback.
 * 3. Refreshes the Supabase session cookie, and sends signed-out visitors
 *    of member-only pages to sign in first.
 */

const knownPaths = new Set([
  ...courses.map((c) => `/learn/${c.id}`),
  ...publishedLessons.map((l) => `/learn/${l.courseId}/${l.slug}`),
  ...scenarios.map((s) => `/diagnose/${s.id}`),
]);

function isUnknownContentPath(pathname: string) {
  const path = pathname.replace(/\/$/, "");
  const segments = path.split("/").filter(Boolean);
  const isContentDetail =
    (segments[0] === "learn" && segments.length >= 2) || (segments[0] === "diagnose" && segments.length >= 2);
  return isContentDetail && !knownPaths.has(path);
}

const membersOnly = ["/repairs/submit", "/repairs/mine", "/admin"];

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // If /auth/callback isn't in Supabase's allowed redirect URLs, email links
  // land on the Site URL with ?code=…; finish the sign-in at the callback.
  if (searchParams.has("code") && pathname !== "/auth/callback") {
    const callback = new URL("/auth/callback", request.url);
    callback.searchParams.set("code", searchParams.get("code")!);
    callback.searchParams.set("next", pathname);
    return NextResponse.redirect(callback);
  }

  if (isUnknownContentPath(pathname)) {
    // Rewriting to a path with no route renders the not-found page with a 404 status.
    return NextResponse.rewrite(new URL("/_page-not-found", request.url));
  }
  const { response, signedIn } = await updateSession(request);
  if (!signedIn && membersOnly.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = {
  matcher: [
    // Everything except Next.js internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
