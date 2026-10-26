import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Cpu } from "lucide-react";
import { faultCategoryLabel, platformNames, sampleRepairCases } from "@/data/repairs";
import { getPublishedCases } from "@/lib/repair-cases";
import { findRepairCase } from "@/lib/repository";
import { PublicCaseMedia } from "@/components/repairs/PublicCaseMedia";
import { chipsetBlocks } from "@/data/chipset-conceptual";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { Badge } from "@/components/ui/Badge";
import { ConfidenceBadge, confidenceInfo } from "@/components/ui/ConfidenceBadge";
import { Notice } from "@/components/ui/Notice";
import {
  BulletList,
  CaseSection,
  MeasurementList,
  MediaGallery,
  Missing,
  SourceList,
} from "@/components/repairs/CaseSections";

type Props = PageProps<"/repairs/[caseId]">;

export async function generateStaticParams() {
  const cases = [...sampleRepairCases, ...(await getPublishedCases())];
  return cases.map((c) => ({ caseId: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await findRepairCase((await params).caseId);
  return found ? { title: found.repairCase.title, description: found.repairCase.summary } : { title: "Case not found" };
}

export default async function RepairCasePage({ params }: Props) {
  const found = await findRepairCase((await params).caseId);
  if (!found) notFound();
  const { repairCase: c, rowId } = found;

  const related = chipsetBlocks.filter((b) => c.relatedBlocks.includes(b.id));
  const device: [string, string][] = [
    ["Manufacturer", c.brand],
    ["Model", c.model],
    ["Board revision", c.boardRevision ?? "Not recorded"],
    ["Platform", platformNames[c.platform]],
    ["Chipset", c.chipset ?? "Not recorded"],
    ["Fault category", faultCategoryLabel(c.faultCategory)],
    ["Last updated", c.updatedAt],
  ];

  return (
    <article>
      <Link
        href="/repairs"
        className="mb-4 inline-flex items-center gap-1.5 rounded-md text-sm text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Repair Repository
      </Link>

      <header className="mb-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <ConfidenceBadge level={c.confidence} />
          <Badge>{faultCategoryLabel(c.faultCategory)}</Badge>
          {c.isSample && <Badge tone="caution">Sample</Badge>}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{c.title}</h1>
        <p className="mt-2 max-w-3xl text-muted">{c.summary}</p>
        <div className="mt-3">
          <BookmarkButton kind="case" itemId={c.id} returnTo={`/repairs/${c.id}`} />
        </div>
      </header>

      {c.isSample && (
        <Notice variant="sample" title="Sample case: fictional device" className="mb-5">
          Written to demonstrate the repair-case format. Measurements are described in words, not values,
          because there is no real board behind them. Do not use this as repair guidance.
        </Notice>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-4">
          <CaseSection step={1} title="Symptoms">
            <BulletList items={c.symptoms} />
          </CaseSection>

          <CaseSection step={2} title="Initial checks">
            {c.initialChecks.length ? <BulletList items={c.initialChecks} /> : <Missing>No initial checks recorded.</Missing>}
          </CaseSection>

          <CaseSection step={3} title="Measurements">
            {c.measurements.length ? (
              <MeasurementList measurements={c.measurements} />
            ) : (
              <Missing>No measurements recorded for this case.</Missing>
            )}
          </CaseSection>

          <CaseSection step={4} title="Diagnostic steps">
            {c.diagnosticSteps.length ? <BulletList items={c.diagnosticSteps} ordered /> : <Missing>No diagnostic steps recorded.</Missing>}
          </CaseSection>

          <CaseSection step={5} title="Root cause">
            {c.rootCause ? <p className="text-sm text-ink/90">{c.rootCause}</p> : <Missing>Root cause not yet determined.</Missing>}
          </CaseSection>

          <CaseSection step={6} title="Repair procedure">
            {c.repairProcedure.length ? <BulletList items={c.repairProcedure} ordered /> : <Missing>No repair carried out yet.</Missing>}
          </CaseSection>

          <CaseSection step={7} title="Final verification">
            {c.verification.length ? <BulletList items={c.verification} /> : <Missing>Not verified: no repair has been completed.</Missing>}
          </CaseSection>

          <CaseSection step={8} title="Images and evidence">
            {rowId ? (
              <Suspense fallback={<p className="text-sm text-faint">Loading photos…</p>}>
                <PublicCaseMedia caseRowId={rowId} />
              </Suspense>
            ) : (
              <MediaGallery media={c.media} />
            )}
          </CaseSection>

          <CaseSection step={9} title="Sources">
            <SourceList sources={c.sources} />
          </CaseSection>
        </div>

        {/* On small screens confidence and device details come first: they say how far to trust the case. */}
        <aside className="order-first flex flex-col gap-4 lg:sticky lg:top-6 lg:order-none lg:self-start">
          <section aria-labelledby="confidence" className="rounded-xl border border-line bg-surface p-4">
            <h2 id="confidence" className="mb-2 text-sm font-semibold text-ink">Confidence</h2>
            <ConfidenceBadge level={c.confidence} />
            <p className="mt-2 text-xs text-muted">{confidenceInfo[c.confidence].description}</p>
            <p className="mt-3 border-t border-line pt-3 text-xs leading-relaxed text-ink/80">{c.confidenceNote}</p>
          </section>

          <section aria-labelledby="device" className="rounded-xl border border-line bg-surface p-4">
            <h2 id="device" className="mb-3 text-sm font-semibold text-ink">Device</h2>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
              {device.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-faint">{label}</dt>
                  <dd className={value === "Not recorded" ? "text-faint italic" : "text-ink/90"}>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {related.length > 0 && (
            <section aria-labelledby="related" className="rounded-xl border border-line bg-surface p-4">
              <h2 id="related" className="mb-1 text-sm font-semibold text-ink">Related blocks</h2>
              <p className="mb-3 text-xs text-muted">Conceptual background in the Chipset Explorer.</p>
              <div className="flex flex-wrap gap-2">
                {related.map((b) => (
                  <Link
                    key={b.id}
                    href={`/explorer?block=${b.id}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-raised px-2.5 py-1 text-xs font-medium text-ink hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <Cpu aria-hidden className="size-3.5" />
                    {b.label}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}
