import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { FilePlus2, FileText } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import type { CaseStatus } from "@/lib/repair-cases";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/case-editor/StatusBadge";
import { FormSkeleton } from "@/components/case-editor/guards";

export const metadata: Metadata = {
  title: "My submissions",
};

export default function MySubmissionsPage() {
  return (
    <>
      <PageHeader eyebrow="Repair Repository" title="My submissions" description="Repair cases you've written, and where each one is in review.">
        <Link
          href="/repairs/submit"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-canvas hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <FilePlus2 aria-hidden className="size-4" />
          Submit a case
        </Link>
      </PageHeader>
      <Suspense fallback={<FormSkeleton />}>
        <SubmissionList />
      </Suspense>
    </>
  );
}

type Row = { id: string; title: string; status: CaseStatus; updated_at: string; review_notes: string | null };

async function SubmissionList() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/repairs/mine");

  const supabase = await createClient();
  const { data } = await supabase
    .from("repair_cases")
    .select("id, title, status, updated_at, review_notes")
    .eq("submitted_by", user.id)
    .order("updated_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No submissions yet"
        description="Share a repair you've done: symptoms, measurements, diagnosis and the fix. A reviewer checks it before it's published."
        action={{ href: "/repairs/submit", label: "Submit your first case" }}
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((r) => (
        <li key={r.id}>
          <Link
            href={`/repairs/mine/${r.id}`}
            className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 hover:border-line-strong focus-visible:outline-2 focus-visible:outline-accent sm:flex-row sm:items-center"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink">{r.title}</p>
              <p className="mt-0.5 text-xs text-faint">Updated {r.updated_at.slice(0, 10)}</p>
              {r.status === "changes_requested" && r.review_notes && (
                <p className="mt-1.5 line-clamp-2 text-sm text-hypothesis">Reviewer: {r.review_notes}</p>
              )}
            </div>
            <StatusBadge status={r.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
