import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FilePlus2, FolderOpen } from "lucide-react";
import { getAllRepairCases } from "@/lib/repository";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { RepairSearch } from "@/components/repairs/RepairSearch";
import { RepairSearchFromUrl } from "@/components/repairs/RepairSearchFromUrl";

export const metadata: Metadata = {
  title: "Repair Repository",
};

export default async function RepairsPage() {
  const repairCases = await getAllRepairCases();
  const sampleCount = repairCases.filter((c) => c.isSample).length;
  const realCount = repairCases.length - sampleCount;

  return (
    <>
      <PageHeader
        eyebrow="Repair Repository"
        title="Documented repair cases"
        description="Search by model, platform, fault category, symptom and diagnosis. Every case shows its evidence, measurement conditions and confidence level."
      >
        <Link
          href="/repairs/mine"
          className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-ink hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent"
        >
          <FolderOpen aria-hidden className="size-4" />
          My submissions
        </Link>
        <Link
          href="/repairs/submit"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-canvas hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <FilePlus2 aria-hidden className="size-4" />
          Submit a case
        </Link>
      </PageHeader>
      {sampleCount > 0 && (
        <Notice variant="sample" title={realCount ? `${realCount} reviewed case${realCount === 1 ? "" : "s"}, plus samples` : "Sample cases only"} className="mb-4">
          Cases marked <strong>Sample</strong> use fictional &ldquo;Demo Phone&rdquo; devices to demonstrate the
          format. They are not real repairs and have no evidence behind them.
          {realCount === 0 && " Real cases appear here once a reviewer publishes them."}
        </Notice>
      )}
      {/* Filters in the URL are only known in the browser; the unfiltered list renders until then. */}
      <Suspense fallback={<RepairSearch cases={repairCases} />}>
        <RepairSearchFromUrl cases={repairCases} />
      </Suspense>
    </>
  );
}
