import Link from "next/link";
import { ClipboardCheck, FolderOpen, UserRound } from "lucide-react";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Badge } from "@/components/ui/Badge";
import { SignOutButton } from "./SignOutButton";

const roleLabel = { member: "Member", reviewer: "Reviewer", admin: "Admin" } as const;

/** Sidebar account box. Reads the session, so render it inside <Suspense>. */
export async function AccountPanel() {
  if (!isSupabaseConfigured) return null;
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-line bg-raised p-3">
        <p className="text-xs leading-relaxed text-muted">Sign in to save your progress to your account.</p>
        <div className="flex gap-2">
          <Link
            href="/login"
            className="flex-1 rounded-md bg-accent px-3 py-1.5 text-center text-xs font-semibold text-canvas hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex-1 rounded-md border border-line-strong px-3 py-1.5 text-center text-xs font-medium text-ink hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-raised p-3">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
          <UserRound aria-hidden className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{user.displayName ?? user.email}</p>
          {user.displayName && <p className="truncate text-xs text-faint">{user.email}</p>}
        </div>
      </div>
      <nav aria-label="Account" className="mt-2.5 flex flex-col gap-0.5 border-t border-line pt-2">
        <Link href="/repairs/mine" className="flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-muted hover:bg-surface hover:text-ink">
          <FolderOpen aria-hidden className="size-3.5" />
          My submissions
        </Link>
        {isStaff(user) && (
          <Link href="/admin" className="flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-muted hover:bg-surface hover:text-ink">
            <ClipboardCheck aria-hidden className="size-3.5" />
            Review queue
          </Link>
        )}
      </nav>
      <div className="mt-2 flex items-center justify-between">
        <Badge tone={user.role === "member" ? "neutral" : "accent"}>{roleLabel[user.role]}</Badge>
        <SignOutButton />
      </div>
    </div>
  );
}

export function AccountPanelSkeleton() {
  return <div aria-hidden className="h-[84px] animate-pulse rounded-lg border border-line bg-raised" />;
}
