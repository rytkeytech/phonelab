import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser, isStaff } from "@/lib/auth";
import type { CaseStatus } from "@/lib/repair-cases";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/case-editor/StatusBadge";
import { FormSkeleton, NoAccess } from "@/components/case-editor/guards";

export const metadata: Metadata = {
  title: "Review queue",
};

const doneText: Record<string, string> = {
  published: "Case published. It's now visible in the Repair Repository.",
  "changes-requested": "Changes requested. The submitter will see your note.",
  rejected: "Case rejected. The submitter will see your note.",
  unpublished: "Case unpublished and returned to the queue.",
};

const groups: { status: CaseStatus; title: string; empty: string }[] = [
  { status: "submitted", title: "Waiting for review", empty: "Nothing waiting. Nice work." },
  { status: "changes_requested", title: "Changes requested", empty: "No cases waiting on submitters." },
  { status: "published", title: "Published", empty: "Nothing published yet." },
  { status: "rejected", title: "Rejected", empty: "Nothing rejected." },
];

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Review queue"
        description="Check each submission's evidence, correct the content, set the confidence label, then publish, request changes or reject."
      />
      <Suspense fallback={<FormSkeleton />}>
        <Queue searchParams={searchParams} />
      </Suspense>
    </>
  );
}

type Row = { id: string; title: string; status: CaseStatus; updated_at: string; submitted_by: string | null };

async function Queue({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!isStaff(user)) return <NoAccess message="The review queue is for reviewers and admins." />;

  const done = (await searchParams).done;
  const supabase = await createClient();
  const { data } = await supabase
    .from("repair_cases")
    .select("id, title, status, updated_at, submitted_by")
    .neq("status", "draft")
    .order("updated_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  const submitterIds = [...new Set(rows.map((r) => r.submitted_by).filter(Boolean))] as string[];
  const { data: profiles } = submitterIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", submitterIds)
    : { data: [] };
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name as string | null]));

  return (
    <div className="flex flex-col gap-6">
      {typeof done === "string" && doneText[done] && (
        <p role="status" className="rounded-lg border border-verified/30 bg-verified/10 p-3 text-sm text-ink">
          {doneText[done]}
        </p>
      )}
      {groups.map((g) => {
        const items = rows.filter((r) => r.status === g.status);
        return (
          <section key={g.status} aria-labelledby={`group-${g.status}`}>
            <h2 id={`group-${g.status}`} className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
              {g.title}
              <span className="rounded-full bg-raised px-2 py-0.5 font-mono text-xs text-muted">{items.length}</span>
            </h2>
            {items.length === 0 ? (
              <p className="rounded-lg border border-dashed border-line px-4 py-3 text-sm text-faint">{g.empty}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {items.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/admin/cases/${r.id}`}
                      className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-3 hover:border-line-strong focus-visible:outline-2 focus-visible:outline-accent sm:flex-row sm:items-center sm:gap-3"
                    >
                      <span className="min-w-0 flex-1 font-medium text-ink">{r.title}</span>
                      <span className="text-xs text-faint">
                        {(r.submitted_by && nameById.get(r.submitted_by)) || "Unnamed member"} · {r.updated_at.slice(0, 10)}
                      </span>
                      <StatusBadge status={r.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
