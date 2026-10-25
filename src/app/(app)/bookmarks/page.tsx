import type { Metadata } from "next";
import { Bookmark } from "lucide-react";
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
        title="Saved cases and lessons"
        description="Repair cases and lessons you save will appear here."
      />
      <EmptyState
        icon={Bookmark}
        title="No bookmarks yet"
        description="Saving needs an account, which arrives with Supabase sign-in in Stage 3."
        action={{ href: "/", label: "Back to dashboard" }}
      />
    </>
  );
}
