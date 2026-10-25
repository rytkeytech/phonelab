import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Footprints } from "lucide-react";
import { scenarios } from "@/data/diagnose";
import { Badge } from "@/components/ui/Badge";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { BestScore } from "@/components/diagnose/BestScore";
import { QualityBadge } from "@/components/diagnose/QualityBadge";
import { difficultyLabel } from "@/components/learn/LessonRow";

export const metadata: Metadata = {
  title: "Diagnostic Game",
};

export default function DiagnosePage() {
  return (
    <>
      <PageHeader
        eyebrow="Diagnostic Game"
        title="Diagnose a simulated fault"
        description="Read the customer's report, choose your tests, read the results and decide the next step. A safe, systematic path scores best."
      >
        <Badge>Scores saved in this browser</Badge>
      </PageHeader>

      <Notice variant="sample" title="Every scenario is simulated" className="mb-4">
        The phones are imaginary and every reading is simulated for training. Nothing here is a
        measurement from a real device.
      </Notice>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {scenarios.map((s) => (
          <li key={s.id}>
            <Link
              href={`/diagnose/${s.id}`}
              className="group flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition-colors hover:border-line-strong hover:bg-raised/40 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge>{difficultyLabel[s.difficulty]}</Badge>
                <Badge>
                  <Footprints aria-hidden className="size-3" />
                  {s.steps.length} steps
                </Badge>
              </div>
              <h2 className="font-semibold text-ink group-hover:text-accent">{s.title}</h2>
              <p className="mt-1 text-sm text-muted">{s.symptom}</p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                <BestScore scenarioId={s.id} />
                <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Start
                  <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="scoring" className="mt-6 rounded-xl border border-line bg-surface p-4 sm:p-5">
        <h2 id="scoring" className="mb-3 text-sm font-semibold text-ink">How scoring works</h2>
        <ul className="grid gap-3 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4">
          <li className="flex flex-col gap-1.5"><QualityBadge quality="best" showPoints /><span>The ideal next step. Moves the case on.</span></li>
          <li className="flex flex-col gap-1.5"><QualityBadge quality="ok" showPoints /><span>Useful, but a better option existed. Moves the case on.</span></li>
          <li className="flex flex-col gap-1.5"><QualityBadge quality="poor" showPoints /><span>Doesn&rsquo;t help yet. Try another option.</span></li>
          <li className="flex flex-col gap-1.5"><QualityBadge quality="unsafe" showPoints /><span>Could damage the phone. Loses points.</span></li>
        </ul>
      </section>
    </>
  );
}
