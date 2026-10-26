import type { Metadata } from "next";
import { Suspense } from "react";
import { Bookmark } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import type { BookmarkKind } from "@/lib/bookmarks";
import { findRepairCase } from "@/lib/repository";
import { createClient } from "@/lib/supabase/server";
import { chipsetBlocks } from "@/data/chipset-conceptual";
import { getCourse, lessonHref, publishedLessons } from "@/data/learning";
import { BookmarkList, type SavedItem } from "@/components/bookmarks/BookmarkList";
import { FormSkeleton } from "@/components/case-editor/guards";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default function BookmarksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Bookmarks"
        title="Saved lessons, cases and blocks"
        description="Everything you bookmark is saved to your account, so it's here on any device you sign in from."
      />
      <Suspense fallback={<FormSkeleton />}>
        <SavedItems />
      </Suspense>
    </>
  );
}

async function SavedItems() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <EmptyState
        icon={Bookmark}
        title="Sign in to see your bookmarks"
        description="Bookmarks are saved to your account. Sign in, then use the Bookmark button on any lesson, repair case or Chipset Explorer block."
        action={{ href: "/login?next=/bookmarks", label: "Sign in" }}
      />
    );
  }

  const supabase = await createClient();
  const { data } = await supabase.from("bookmarks").select("kind, item_id").order("created_at", { ascending: false });
  const items = await Promise.all((data ?? []).map((r) => describe(r.kind as BookmarkKind, r.item_id)));

  return <BookmarkList items={items} />;
}

const gone = (kind: BookmarkKind, itemId: string, what: string): SavedItem => ({
  kind,
  itemId,
  href: null,
  title: "No longer available",
  detail: `This ${what} has been removed or unpublished.`,
});

/** Turns a saved id into a title and link. */
async function describe(kind: BookmarkKind, itemId: string): Promise<SavedItem> {
  if (kind === "lesson") {
    const lesson = publishedLessons.find((l) => l.id === itemId);
    if (!lesson) return gone(kind, itemId, "lesson");
    return { kind, itemId, href: lessonHref(lesson), title: lesson.title, detail: getCourse(lesson.courseId)?.title ?? "Lesson" };
  }
  if (kind === "case") {
    const found = await findRepairCase(itemId);
    if (!found) return gone(kind, itemId, "repair case");
    const c = found.repairCase;
    return { kind, itemId, href: `/repairs/${c.id}`, title: c.title, detail: `${c.brand} ${c.model}`, isSample: c.isSample };
  }
  const block = chipsetBlocks.find((b) => b.id === itemId);
  if (!block) return gone(kind, itemId, "block");
  return { kind, itemId, href: `/explorer?block=${block.id}`, title: block.name, detail: "Chipset Explorer" };
}
