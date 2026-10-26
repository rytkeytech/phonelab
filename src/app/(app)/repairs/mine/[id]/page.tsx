import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ArrowLeft, ExternalLink, MessageSquareWarning } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { MEMBER_CONFIDENCE } from "@/lib/case-form";
import { getCaseMedia, getCaseRow, toDraft } from "@/lib/repair-cases";
import { createClient } from "@/lib/supabase/server";
import { saveOwnCase } from "@/app/repairs/actions";
import { chipsetBlocks } from "@/data/chipset-conceptual";
import { Notice } from "@/components/ui/Notice";
import { CaseForm } from "@/components/case-editor/CaseForm";
import { MediaManager } from "@/components/case-editor/MediaManager";
import { PhotoUploader } from "@/components/case-editor/PhotoUploader";
import { StatusBadge, statusInfo } from "@/components/case-editor/StatusBadge";
import { FormSkeleton, NoAccess } from "@/components/case-editor/guards";

export const metadata: Metadata = {
  title: "My submission",
};

const blocks = chipsetBlocks.map((b) => ({ id: b.id, label: b.label }));
const EDITABLE = ["draft", "submitted", "changes_requested"];

export default function MySubmissionPage({ params, searchParams }: PageProps<"/repairs/mine/[id]">) {
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/repairs/mine" className="mb-4 inline-flex items-center gap-1.5 rounded-md text-sm text-muted hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" />
        My submissions
      </Link>
      <Suspense fallback={<FormSkeleton />}>
        <Submission params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Submission({ params, searchParams }: Pick<PageProps<"/repairs/mine/[id]">, "params" | "searchParams">) {
  const { id } = await params;
  const saved = (await searchParams).saved;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/repairs/mine/${id}`);

  const supabase = await createClient();
  const row = await getCaseRow(supabase, id);
  if (!row || row.submitted_by !== user.id) return <NoAccess message="This submission doesn't exist, or it isn't yours." />;

  const editable = EDITABLE.includes(row.status);
  const media = await getCaseMedia(supabase, row.id);

  return (
    <>
      <header className="mb-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={row.status} />
          <span className="text-xs text-muted">{statusInfo[row.status].description}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{row.title}</h1>
      </header>

      {saved === "submit" && (
        <Notice variant="sample" title="Submitted for review" className="mb-4">
          Thanks! A reviewer will check your case. You can keep editing it and adding photos until then.
        </Notice>
      )}
      {saved === "draft" && (
        <p role="status" className="mb-4 rounded-lg border border-verified/30 bg-verified/10 p-3 text-sm text-ink">
          Draft saved. Add photos below, then submit it when it&rsquo;s ready.
        </p>
      )}
      {row.review_notes && row.status !== "published" && (
        <div className="mb-4 flex gap-3 rounded-lg border border-hypothesis/30 bg-hypothesis/10 p-4 text-sm">
          <MessageSquareWarning aria-hidden className="mt-0.5 size-4 shrink-0 text-hypothesis" />
          <div>
            <p className="font-semibold text-ink">Reviewer&rsquo;s note</p>
            <p className="mt-1 whitespace-pre-line text-ink/85">{row.review_notes}</p>
          </div>
        </div>
      )}
      {row.status === "published" && (
        <Link href={`/repairs/${row.slug}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
          View the published case
          <ExternalLink aria-hidden className="size-3.5" />
        </Link>
      )}

      <section aria-labelledby="photos" className="mb-4 rounded-xl border border-line bg-surface p-4 sm:p-5">
        <h2 id="photos" className="mb-3 text-base font-semibold text-ink">Photos and evidence</h2>
        <MediaManager media={media} viewer="owner" />
        {editable && (
          <div className="mt-4">
            <PhotoUploader caseId={row.id} userId={user.id} />
          </div>
        )}
      </section>

      {editable ? (
        <CaseForm initial={toDraft(row)} action={saveOwnCase} mode="member" allowedConfidence={MEMBER_CONFIDENCE} blocks={blocks} />
      ) : (
        <p className="rounded-lg border border-line bg-surface p-4 text-sm text-muted">
          This case is {statusInfo[row.status].label.toLowerCase()} and can no longer be edited. Contact a reviewer if
          something needs correcting.
        </p>
      )}
    </>
  );
}
