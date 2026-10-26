import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { MEMBER_CONFIDENCE, emptyDraft } from "@/lib/case-form";
import { saveOwnCase } from "@/app/repairs/actions";
import { chipsetBlocks } from "@/data/chipset-conceptual";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { CaseForm } from "@/components/case-editor/CaseForm";
import { FormSkeleton } from "@/components/case-editor/guards";

export const metadata: Metadata = {
  title: "Submit a repair case",
};

const blocks = chipsetBlocks.map((b) => ({ id: b.id, label: b.label }));

export default function SubmitCasePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/repairs" className="mb-4 inline-flex items-center gap-1.5 rounded-md text-sm text-muted hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" />
        Repair Repository
      </Link>
      <PageHeader
        eyebrow="Repair Repository"
        title="Submit a repair case"
        description="Document a real repair so other technicians can learn from it. A reviewer checks every case before it's published."
      />
      <Notice variant="conceptual" title="Accuracy first" className="mb-4">
        Only record what you actually observed on this board. Note the measurement conditions, say when
        something is a guess, and never copy values from a different model. You can add photos after saving.
      </Notice>
      <Suspense fallback={<FormSkeleton />}>
        <SubmitForm />
      </Suspense>
    </div>
  );
}

async function SubmitForm() {
  // proxy.ts already sends signed-out visitors to sign in; this is a second check.
  if (!(await getCurrentUser())) redirect("/login?next=/repairs/submit");
  return <CaseForm initial={emptyDraft} action={saveOwnCase} mode="member" allowedConfidence={MEMBER_CONFIDENCE} blocks={blocks} />;
}
