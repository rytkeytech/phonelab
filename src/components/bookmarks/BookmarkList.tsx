"use client";

import Link from "next/link";
import { Bookmark, BookOpen, Cpu, Wrench, X } from "lucide-react";
import { bookmarkKey, setBookmarked, useBookmarks, type BookmarkKind } from "@/lib/bookmarks";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export type SavedItem = {
  kind: BookmarkKind;
  itemId: string;
  /** Null when the item no longer exists (e.g. a case was unpublished). */
  href: string | null;
  title: string;
  detail: string;
  isSample?: boolean;
};

const groups: { kind: BookmarkKind; title: string; icon: typeof BookOpen }[] = [
  { kind: "lesson", title: "Lessons", icon: BookOpen },
  { kind: "case", title: "Repair cases", icon: Wrench },
  { kind: "block", title: "Chipset blocks", icon: Cpu },
];

/** The saved items, loaded on the server. Removed items disappear at once. */
export function BookmarkList({ items }: { items: SavedItem[] }) {
  const { status, saved } = useBookmarks();
  // Before the account copy has loaded, show what the server found.
  const visible = status === "ready" ? items.filter((i) => saved.has(bookmarkKey(i.kind, i.itemId))) : items;

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="No bookmarks yet"
        description="Use the Bookmark button on a lesson, a repair case or a Chipset Explorer block to save it here."
        action={{ href: "/learn", label: "Browse lessons" }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map(({ kind, title, icon: Icon }) => {
        const inGroup = visible.filter((i) => i.kind === kind);
        if (inGroup.length === 0) return null;
        return (
          <section key={kind} aria-labelledby={`saved-${kind}`}>
            <h2 id={`saved-${kind}`} className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
              <Icon aria-hidden className="size-4 text-accent" />
              {title}
              <span className="font-normal text-faint">({inGroup.length})</span>
            </h2>
            <ul className="flex flex-col gap-2">
              {inGroup.map((item) => (
                <SavedRow key={bookmarkKey(item.kind, item.itemId)} item={item} canRemove={status === "ready"} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function SavedRow({ item, canRemove }: { item: SavedItem; canRemove: boolean }) {
  const text = (
    <>
      <span className="flex flex-wrap items-center gap-2">
        <span className={item.href ? "font-medium text-ink" : "font-medium text-faint italic"}>{item.title}</span>
        {item.isSample && <Badge tone="caution">Sample</Badge>}
      </span>
      <span className="mt-0.5 block text-xs text-faint">{item.detail}</span>
    </>
  );

  return (
    <li className="flex items-center gap-2 rounded-xl border border-line bg-surface hover:border-line-strong">
      {item.href ? (
        <Link
          href={item.href}
          className="min-w-0 flex-1 rounded-xl p-3.5 focus-visible:outline-2 focus-visible:outline-accent"
        >
          {text}
        </Link>
      ) : (
        <div className="min-w-0 flex-1 p-3.5">{text}</div>
      )}
      <button
        type="button"
        disabled={!canRemove}
        onClick={() => void setBookmarked(item.kind, item.itemId, false)}
        aria-label={`Remove bookmark: ${item.title}`}
        title="Remove bookmark"
        className="mr-2 grid size-8 shrink-0 place-items-center rounded-md text-faint hover:bg-raised hover:text-ink focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-40"
      >
        <X aria-hidden className="size-4" />
      </button>
    </li>
  );
}
