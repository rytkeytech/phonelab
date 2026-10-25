import type { Metadata } from "next";
import { Suspense } from "react";
import { repairCases } from "@/data/repairs";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { RepairSearch } from "@/components/repairs/RepairSearch";
import { RepairSearchFromUrl } from "@/components/repairs/RepairSearchFromUrl";

export const metadata: Metadata = {
  title: "Repair Repository",
};

export default function RepairsPage() {
  const hasSamples = repairCases.some((c) => c.isSample);

  return (
    <>
      <PageHeader
        eyebrow="Repair Repository"
        title="Documented repair cases"
        description="Search by model, platform, fault category, symptom and diagnosis. Every case shows its evidence, measurement conditions and confidence level."
      />
      {hasSamples && (
        <Notice variant="sample" title="Sample cases only" className="mb-4">
          These cases use fictional &ldquo;Demo Phone&rdquo; devices to demonstrate the format. They are not
          real repairs and have no evidence behind them. Real cases will appear here after review.
        </Notice>
      )}
      {/* Filters in the URL are only known in the browser; the unfiltered list renders until then. */}
      <Suspense fallback={<RepairSearch cases={repairCases} />}>
        <RepairSearchFromUrl cases={repairCases} />
      </Suspense>
    </>
  );
}
