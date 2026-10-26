"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { resetProgress } from "@/lib/progress";

/** Signs out and clears this browser's copy of the progress (the account keeps it). */
export function SignOutButton() {
  return (
    <form action={signOut} onSubmit={() => resetProgress()}>
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-md text-xs text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
      >
        <LogOut aria-hidden className="size-3.5" />
        Sign out
      </button>
    </form>
  );
}
