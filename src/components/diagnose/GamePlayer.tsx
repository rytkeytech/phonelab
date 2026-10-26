"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Cpu,
  Lightbulb,
  MessageSquareQuote,
  Printer,
  RotateCcw,
  Scale,
} from "lucide-react";
import type { GameChoice, GameScenario, GameStep } from "@/lib/types";
import { cx } from "@/lib/utils";
import { HINT_COST, choicePoints, choiceScoring, maxScore, nextStepId, phaseLabels, phaseOrder } from "@/data/diagnose";
import { recordGameResult } from "@/lib/progress";
import { lessonDiagrams } from "@/components/learn/diagrams";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QualityBadge } from "./QualityBadge";
import { SimulatedReadingCard } from "./SimulatedReadingCard";

type Attempt = { stepId: string; choice: GameChoice };

export type RelatedLink = { href: string; label: string };

const primaryButton =
  "inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-canvas hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const secondaryButton =
  "inline-flex items-center gap-2 rounded-lg border border-line-strong px-3 py-1.5 text-sm text-ink hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent";

export function GamePlayer({
  scenario,
  relatedLessons,
  relatedBlocks,
}: {
  scenario: GameScenario;
  relatedLessons: RelatedLink[];
  relatedBlocks: RelatedLink[];
}) {
  const first = scenario.steps[0].id;
  const [currentId, setCurrentId] = useState(first);
  /** Steps reached, in order */
  const [path, setPath] = useState<string[]>([first]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [hintsUsed, setHintsUsed] = useState<string[]>([]);
  /** A past step being reviewed, or null for the current one */
  const [viewingId, setViewingId] = useState<string | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLHeadingElement>(null);
  const reportRef = useRef<HTMLHeadingElement>(null);

  const finished = currentId === "end";
  const stepById = (id: string) => scenario.steps.find((s) => s.id === id);
  const max = maxScore(scenario);
  const points = attempts.reduce((sum, a) => sum + choicePoints(stepById(a.stepId), a.choice), 0);
  const score = Math.min(max, Math.max(0, points - hintsUsed.length * HINT_COST));
  const usesPhases = scenario.steps.some((s) => s.phase);
  const findings = attempts.filter((a) => a.choice.finding || a.choice.reading);

  const attemptsAt = (stepId: string) => attempts.filter((a) => a.stepId === stepId);
  const current = finished ? undefined : stepById(currentId);
  const last = current ? attemptsAt(current.id).at(-1) : undefined;
  // After a choice that moves the case on, wait for "Continue" so the feedback can be read.
  const awaitingContinue = Boolean(last && choiceScoring[last.choice.quality].advances);

  // Move keyboard and screen-reader focus to whatever just appeared.
  useEffect(() => {
    if (finished) reportRef.current?.focus();
    else if (attempts.length > 0) feedbackRef.current?.focus();
  }, [attempts.length, finished]);
  useEffect(() => {
    if (path.length > 1 || viewingId) stepRef.current?.focus();
  }, [path.length, viewingId]);

  function choose(choice: GameChoice) {
    setAttempts((prev) => [...prev, { stepId: currentId, choice }]);
  }

  function continueOn() {
    if (!last) return;
    const next = nextStepId(scenario, currentId, last.choice);
    setCurrentId(next);
    if (next === "end") recordGameResult(scenario.id, { score, max });
    else setPath((p) => [...p, next]);
  }

  function restart() {
    setCurrentId(first);
    setPath([first]);
    setAttempts([]);
    setHintsUsed([]);
    setViewingId(null);
    requestAnimationFrame(() => stepRef.current?.focus());
  }

  const phaseOfStep = (id: string) => stepById(id)?.phase;
  const reachedPhases = new Set(path.map(phaseOfStep));
  const currentPhase = finished ? "review" : current?.phase;

  const progress = usesPhases ? (
    <nav aria-label="Case stages" className="print:hidden">
      <ol className="flex flex-wrap gap-1.5">
        {phaseOrder.map((phase, i) => {
          const isCurrent = phase === currentPhase;
          const done = !isCurrent && (finished || reachedPhases.has(phase));
          return (
            <li
              key={phase}
              aria-current={isCurrent ? "step" : undefined}
              className={cx(
                "rounded-md border px-2 py-1 font-mono text-[11px]",
                isCurrent
                  ? "border-accent/50 bg-accent-soft text-accent"
                  : done
                    ? "border-line bg-raised text-muted"
                    : "border-line text-faint",
              )}
            >
              {i + 1}. {phaseLabels[phase]}
            </li>
          );
        })}
      </ol>
    </nav>
  ) : null;

  const notes = (
    <aside aria-labelledby="case-notes" className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 lg:sticky lg:top-6 lg:self-start print:hidden">
      <section>
        <h2 id="case-notes" className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <ClipboardList aria-hidden className="size-4 text-accent" />
          Evidence so far
        </h2>
        {findings.length === 0 ? (
          <p className="text-xs text-faint">Findings from your tests will be recorded here.</p>
        ) : (
          <ol className="flex flex-col gap-2.5">
            {findings.map((a) => (
              <li key={`${a.stepId}-${a.choice.id}`} className="text-sm text-ink/90">
                {a.choice.finding ?? a.choice.reading?.value}
              </li>
            ))}
          </ol>
        )}
      </section>

      {!finished && path.length > 1 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-ink">Look back</h2>
          <p className="mb-2 text-xs text-faint">Review an earlier step and what you found there.</p>
          <ol className="flex flex-col gap-1">
            {path.slice(0, -1).map((id, i) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setViewingId(id)}
                  aria-pressed={viewingId === id}
                  className={cx(
                    "w-full rounded-md px-2 py-1 text-left text-xs hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent",
                    viewingId === id ? "bg-raised text-ink" : "text-muted",
                  )}
                >
                  <span className="mr-1.5 font-mono text-faint">{i + 1}.</span>
                  {stepById(id)?.phase ? phaseLabels[stepById(id)!.phase!] : stepById(id)?.prompt}
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="border-t border-line pt-3">
        <p className="mb-1.5 flex justify-between text-xs text-muted">
          <span>Score</span>
          <span className="font-mono text-ink">
            {score}/{max}
          </span>
        </p>
        <ProgressBar value={score} max={max} label="Score so far" />
        {hintsUsed.length > 0 && (
          <p className="mt-1.5 text-xs text-faint">
            Hints used: {hintsUsed.length} (−{hintsUsed.length * HINT_COST})
          </p>
        )}
        {!finished && (
          <button type="button" onClick={restart} className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent">
            <RotateCcw aria-hidden className="size-3.5" />
            Restart case
          </button>
        )}
      </section>
    </aside>
  );

  const caseCard = (
    <section aria-label="Case" className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <p className="mb-2 flex items-center gap-2 text-xs font-medium text-muted">
        <MessageSquareQuote aria-hidden className="size-4 text-accent" />
        Customer report
      </p>
      <p className="text-[15px] text-ink/90 italic">{scenario.brief}</p>
      <p className="mt-2 text-xs text-faint">{scenario.device}</p>
      {scenario.observations && scenario.observations.length > 0 && (
        <div className="mt-3 border-t border-line pt-3">
          <p className="mb-1.5 text-xs font-medium text-muted">First look</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-ink/85 marker:text-faint">
            {scenario.observations.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );

  if (finished) {
    return (
      <div className="flex flex-col gap-4">
        {progress}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <CaseReport
            scenario={scenario}
            path={path}
            attempts={attempts}
            score={score}
            max={max}
            hintsUsed={hintsUsed.length}
            headingRef={reportRef}
            relatedLessons={relatedLessons}
            relatedBlocks={relatedBlocks}
            onRestart={restart}
          />
          {notes}
        </div>
      </div>
    );
  }

  const viewing = viewingId ? stepById(viewingId) : undefined;
  const shown = viewing ?? current!;
  const shownIndex = path.indexOf(shown.id);
  const shownAttempts = attemptsAt(shown.id);
  const hintShown = hintsUsed.includes(shown.id);

  return (
    <div className="flex flex-col gap-4">
      {progress}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-4">
          {caseCard}

          <section aria-labelledby="current-step" className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 sm:p-5">
            {viewing && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-accent/30 bg-accent-soft/50 px-3 py-2 text-sm">
                <span className="text-ink">Reviewing an earlier step. Your choices there are locked in.</span>
                <button type="button" onClick={() => setViewingId(null)} className={secondaryButton}>
                  <ArrowLeft aria-hidden className="size-4" />
                  Back to current step
                </button>
              </div>
            )}

            <div>
              <p className="mb-1 font-mono text-xs tracking-wider text-accent uppercase">
                {shown.phase ? phaseLabels[shown.phase] : `Step ${shownIndex + 1} of ${scenario.steps.length}`}
              </p>
              {shown.context && <p className="mb-2 text-sm text-ink/85">{shown.context}</p>}
              <h2 id="current-step" ref={stepRef} tabIndex={-1} className="text-lg font-semibold text-ink outline-none">
                {shown.prompt}
              </h2>
            </div>

            {shown.circuit && <CircuitView circuit={shown.circuit} />}

            <ul className="flex flex-col gap-2">
              {shown.choices.map((choice) => {
                const used = shownAttempts.some((a) => a.choice.id === choice.id);
                const locked = Boolean(viewing) || awaitingContinue;
                return (
                  <li key={choice.id}>
                    <button
                      type="button"
                      onClick={() => choose(choice)}
                      disabled={used || locked}
                      className={cx(
                        "flex w-full flex-col gap-2 rounded-lg border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent sm:flex-row sm:items-center",
                        used ? "border-line bg-canvas text-muted" : "border-line-strong text-ink enabled:hover:border-accent/50 enabled:hover:bg-raised",
                        locked && !used && "opacity-50",
                      )}
                    >
                      <span className="flex-1">{choice.label}</span>
                      {used && <QualityBadge quality={choice.quality} showPoints points={choicePoints(shown, choice)} />}
                    </button>
                  </li>
                );
              })}
            </ul>

            {shown.hint && !viewing && (
              hintShown ? (
                <p className="flex gap-2 rounded-lg border border-verified/25 bg-verified/5 p-3 text-sm text-ink/90">
                  <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-verified" />
                  {shown.hint}
                </p>
              ) : (
                !awaitingContinue && (
                  <button type="button" onClick={() => setHintsUsed((h) => [...h, shown.id])} className="inline-flex items-center gap-1.5 self-start text-xs text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent">
                    <Lightbulb aria-hidden className="size-3.5" />
                    Show a hint (−{HINT_COST} points)
                  </button>
                )
              )
            )}

            {viewing
              ? shownAttempts.map((a) => <Feedback key={a.choice.id} step={shown} choice={a.choice} />)
              : last && (
                  <div ref={feedbackRef} tabIndex={-1} aria-live="polite" className="flex flex-col gap-3 outline-none">
                    <Feedback step={shown} choice={last.choice} />
                    {awaitingContinue ? (
                      <button type="button" onClick={continueOn} className={cx(primaryButton, "self-start")}>
                        {nextStepId(scenario, currentId, last.choice) === "end" ? "See case report" : "Continue"}
                        <ArrowRight aria-hidden className="size-4" />
                      </button>
                    ) : (
                      <p className="text-xs text-muted">Choose another option.</p>
                    )}
                  </div>
                )}
          </section>
        </div>
        {notes}
      </div>
    </div>
  );
}

function Feedback({ step, choice }: { step: GameStep; choice: GameChoice }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-raised/50 p-4">
      <QualityBadge quality={choice.quality} showPoints points={choicePoints(step, choice)} />
      {step.unscored && choice.quality !== "unsafe" && (
        <p className="text-xs text-faint">This step is a detour from the most direct route, so it doesn&apos;t add points.</p>
      )}
      <p className="text-sm text-ink/90">{choice.feedback}</p>
      {choice.finding && (
        <p className="text-sm text-ink">
          <span className="font-semibold">Finding: </span>
          {choice.finding}
        </p>
      )}
      {choice.reading && <SimulatedReadingCard reading={choice.reading} />}
      {choice.interpretation && <Interpretation interpretation={choice.interpretation} />}
    </div>
  );
}

function Interpretation({ interpretation: i }: { interpretation: NonNullable<GameChoice["interpretation"]> }) {
  return (
    <div className="rounded-lg border border-line bg-canvas p-3 text-sm">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-ink">
        <Scale aria-hidden className="size-4 text-accent" />
        Weighing the evidence
      </p>
      <dl className="flex flex-col gap-2">
        <div>
          <dt className="text-xs text-verified">What it supports</dt>
          <dd className="text-ink/90">{i.supports}</dd>
        </div>
        <div>
          <dt className="text-xs text-caution">What it does not prove</dt>
          <dd className="text-ink/90">{i.doesNotProve}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Still possible</dt>
          <dd>
            <ul className="list-disc space-y-0.5 pl-5 text-ink/90 marker:text-faint">
              {i.remaining.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  );
}

function CircuitView({ circuit }: { circuit: NonNullable<GameStep["circuit"]> }) {
  const { Diagram } = lessonDiagrams[circuit.diagram];
  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-canvas">
      <p className="border-b border-caution/25 bg-caution-soft px-3 py-1.5 text-xs font-medium text-caution">
        Conceptual, not a schematic of any specific phone
      </p>
      <div className="p-3">
        <Diagram />
      </div>
      <figcaption className="border-t border-line px-3 py-2 text-xs text-muted">
        {circuit.caption} No verified schematic or boardview is available for this simulated device.
      </figcaption>
    </figure>
  );
}

function CaseReport({
  scenario,
  path,
  attempts,
  score,
  max,
  hintsUsed,
  headingRef,
  relatedLessons,
  relatedBlocks,
  onRestart,
}: {
  scenario: GameScenario;
  path: string[];
  attempts: Attempt[];
  score: number;
  max: number;
  hintsUsed: number;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  relatedLessons: RelatedLink[];
  relatedBlocks: RelatedLink[];
  onRestart: () => void;
}) {
  const percent = max ? Math.round((score / max) * 100) : 0;
  const wrongTurns = attempts.filter((a) => !choiceScoring[a.choice.quality].advances);
  const unsafe = wrongTurns.filter((a) => a.choice.quality === "unsafe").length;
  const evidence = attempts.filter((a) => a.choice.finding);
  const simulated = (scenario.kind ?? "simulated") === "simulated";

  return (
    <section aria-labelledby="case-report" className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-5 sm:p-6 print:border-0 print:p-0">
      <header>
        <p className="font-mono text-xs tracking-wider text-accent uppercase">
          Case report{simulated ? " · simulated scenario" : " · documented repair"}
        </p>
        <h2 id="case-report" ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-semibold text-ink outline-none">
          {scenario.title}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Score {score}/{max} ({percent}%) · {wrongTurns.length} wrong or early {wrongTurns.length === 1 ? "choice" : "choices"}
          {unsafe ? `, ${unsafe} unsafe` : ""} · {hintsUsed} {hintsUsed === 1 ? "hint" : "hints"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {percent === 100
            ? "A clean, systematic diagnosis."
            : percent >= 70
              ? "Solid work. Look at the steps where a better option existed."
              : "Read the feedback below, then run the case again for a cleaner path."}
        </p>
      </header>

      <ReportSection title="Symptom and device">
        <p>{scenario.symptom}. {scenario.device}</p>
      </ReportSection>

      <ReportSection title="Key evidence, in the order you found it">
        {evidence.length ? (
          <ol className="list-decimal space-y-1 pl-5 marker:text-faint">
            {evidence.map((a) => (
              <li key={`${a.stepId}-${a.choice.id}`}>{a.choice.finding}</li>
            ))}
          </ol>
        ) : (
          <p className="text-faint italic">No findings recorded.</p>
        )}
      </ReportSection>

      <ReportSection title={simulated ? "Root cause (simulated)" : "Root cause"}>
        <p>{scenario.debrief.rootCause}</p>
      </ReportSection>

      {scenario.debrief.alternatives && (
        <ReportSection title="Other causes with the same symptom">
          <BulletList items={scenario.debrief.alternatives} />
        </ReportSection>
      )}

      <ReportSection title="Your path">
        <ol className="flex flex-col gap-2">
          {path.map((id, i) => {
            const step = scenario.steps.find((s) => s.id === id)!;
            return (
              <li key={id} className="rounded-lg border border-line bg-canvas p-3 print:break-inside-avoid">
                <p className="mb-2 text-ink/90">
                  <span className="mr-2 font-mono text-xs text-faint">{i + 1}.</span>
                  {step.phase && <span className="mr-2 font-mono text-xs text-accent">{phaseLabels[step.phase]}</span>}
                  {step.prompt}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {attempts
                    .filter((a) => a.stepId === id)
                    .map((a) => (
                      <li key={a.choice.id} className="flex flex-col gap-1 text-xs text-muted">
                        <span className="flex flex-wrap items-start gap-2">
                          <QualityBadge quality={a.choice.quality} showPoints points={choicePoints(step, a.choice)} />
                          <span className="min-w-0 flex-1 text-ink/85">{a.choice.label}</span>
                        </span>
                        {!choiceScoring[a.choice.quality].advances && <span className="pl-1">{a.choice.feedback}</span>}
                      </li>
                    ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </ReportSection>

      {scenario.debrief.commonMistakes && (
        <ReportSection title="Common mistakes on this kind of fault">
          <BulletList items={scenario.debrief.commonMistakes} />
        </ReportSection>
      )}

      <ReportSection title="Key lessons">
        <BulletList items={scenario.debrief.lessons} />
      </ReportSection>

      {(relatedLessons.length > 0 || relatedBlocks.length > 0) && (
        <div className="flex flex-wrap gap-2 print:hidden">
          {relatedLessons.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-raised px-2.5 py-1.5 text-xs font-medium text-ink hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
              <BookOpen aria-hidden className="size-3.5" />
              {l.label}
            </Link>
          ))}
          {relatedBlocks.map((b) => (
            <Link key={b.href} href={b.href} className="inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-raised px-2.5 py-1.5 text-xs font-medium text-ink hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
              <Cpu aria-hidden className="size-3.5" />
              {b.label}
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 border-t border-line pt-5 print:hidden">
        <button type="button" onClick={onRestart} className={primaryButton}>
          <RotateCcw aria-hidden className="size-4" />
          Run the case again
        </button>
        <button type="button" onClick={() => window.print()} className={secondaryButton}>
          <Printer aria-hidden className="size-4" />
          Print or save report
        </button>
        <Link href="/diagnose" className={secondaryButton}>
          All scenarios
        </Link>
      </div>
    </section>
  );
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="text-sm text-ink/90">
      <h3 className="mb-1.5 text-sm font-semibold text-ink">{title}</h3>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-faint">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
