import { type NextRequest, NextResponse } from "next/server";
import { courses, publishedLessons } from "@/data/learning";
import { scenarios } from "@/data/diagnose";
import { updateSession } from "@/lib/supabase/session";

/*
 * Runs before every page request:
 * 1. Returns a real 404 for content URLs that don't exist. Pages stream, so
 *    once rendering starts the status is already 200; checking here first
 *    lets missing lessons and scenarios answer with a proper 404.
 * 2. Refreshes the Supabase session cookie.
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

export async function proxy(request: NextRequest) {
  if (isUnknownContentPath(request.nextUrl.pathname)) {
    // Rewriting to a path with no route renders the not-found page with a 404 status.
    return NextResponse.rewrite(new URL("/_page-not-found", request.url));
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    // Everything except Next.js internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
