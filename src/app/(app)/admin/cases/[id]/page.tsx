import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { getCaseMedia, getCaseRow, toDraft } from "@/lib/repair-cases";
import { createClient } from "@/lib/supabase/server";
import { reviewCase } from "@/app/admin/actions";
import { chipsetBlocks } from "@/data/chipset-conceptual";
import type { ConfidenceLevel } from "@/lib/types";
import { CaseForm } from "@/components/case-editor/CaseForm";
import { MediaManager } from "@/components/case-editor/MediaManager";
import { StatusBadge } from "@/components/case-editor/StatusBadge";
import { FormSkeleton, NoAccess } from "@/components/case-editor/guards";

export const metadata: Metadata = {
  title: "Review case",
};

const blocks = chipsetBlocks.map((b) => ({ id: b.id, label: b.label }));
const allConfidence: ConfidenceLevel[] = ["verified", "corroborated", "hypothesis", "unverified"];

export default function ReviewCasePage({ params, searchParams }: PageProps<"/admin/cases/[id]">) {
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 rounded-md text-sm text-muted hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" />
        Review queue
      </Link>
      <Suspense fallback={<FormSkeleton />}>
        <Review params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Review({ params, searchParams }: Pick<PageProps<"/admin/cases/[id]">, "params" | "searchParams">) {
  const { id } = await params;
  const saved = (await searchParams).saved;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/admin/cases/${id}`);
  if (!isStaff(user)) return <NoAccess message="Reviewing cases is for reviewers and admins." />;

  const supabase = await createClient();
  const row = await getCaseRow(supabase, id);
  if (!row) return <NoAccess message="This case doesn't exist." />;

  const [media, submitter] = await Promise.all([
    getCaseMedia(supabase, row.id),
    row.submitted_by
      ? supabase.from("profiles").select("display_name").eq("id", row.submitted_by).maybeSingle().then((r) => r.data?.display_name as string | null)
      : Promise.resolve(null),
  ]);

  return (
    <>
      <header className="mb-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={row.status} />
          <span className="text-xs text-muted">
            Submitted by {submitter ?? "an unnamed member"} · created {row.created_at.slice(0, 10)} · updated {row.updated_at.slice(0, 10)}
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{row.title}</h1>
        {row.status === "published" && (
          <Link href={`/repairs/${row.slug}`} className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
            View public page
            <ExternalLink aria-hidden className="size-3.5" />
          </Link>
        )}
      </header>

      {saved && (
        <p role="status" className="mb-4 rounded-lg border border-verified/30 bg-verified/10 p-3 text-sm text-ink">
          Changes saved.
        </p>
      )}

      <section aria-labelledby="photos" className="mb-4 rounded-xl border border-line bg-surface p-4 sm:p-5">
        <h2 id="photos" className="mb-1 text-base font-semibold text-ink">Photos and evidence</h2>
        <p className="mb-3 text-sm text-muted">Approved photos appear on the public page once the case is published.</p>
        <MediaManager media={media} viewer="reviewer" />
      </section>

      <CaseForm
        initial={toDraft(row)}
        action={reviewCase}
        mode="reviewer"
        allowedConfidence={allConfidence}
        blocks={blocks}
        status={row.status}
        reviewNotes={row.review_notes}
      />
    </>
  );
}
