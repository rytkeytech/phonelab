"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { bookmarkKey, setBookmarked, useBookmarks, type BookmarkKind } from "@/lib/bookmarks";

const base =
  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-accent";
const idle = `${base} border-line-strong bg-raised text-ink hover:border-accent/50 hover:text-accent`;

type Props = {
  kind: BookmarkKind;
  itemId: string;
  /** Where to come back to after signing in. */
  returnTo: string;
};

export function BookmarkButton({ kind, itemId, returnTo }: Props) {
  const { status, saved } = useBookmarks();
  const isSaved = saved.has(bookmarkKey(kind, itemId));

  if (status === "signed-out") {
    return (
      <Link href={`/login?next=${encodeURIComponent(returnTo)}`} className={idle}>
        <Bookmark aria-hidden className="size-4" />
        Sign in to bookmark
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={status === "loading"}
      onClick={() => void setBookmarked(kind, itemId, !isSaved)}
      aria-pressed={isSaved}
      className={
        isSaved
          ? `${base} border-accent/40 bg-accent-soft text-accent hover:bg-accent-soft/70`
          : `${idle} disabled:cursor-wait disabled:opacity-60`
      }
    >
      {isSaved ? <BookmarkCheck aria-hidden className="size-4" /> : <Bookmark aria-hidden className="size-4" />}
      {isSaved ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
