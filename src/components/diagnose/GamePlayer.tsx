"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Cpu, MessageSquareQuote, RotateCcw } from "lucide-react";
import type { GameChoice, GameScenario } from "@/lib/types";
import { cx } from "@/lib/utils";
import { choiceScoring, maxScore } from "@/data/diagnose";
import { recordGameResult } from "@/lib/progress";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QualityBadge } from "./QualityBadge";
import { SimulatedReadingCard } from "./SimulatedReadingCard";

type Attempt = { stepIndex: number; choice: GameChoice };

export type RelatedLink = { href: string; label: string };

export function GamePlayer({
  scenario,
  relatedLessons,
  relatedBlocks,
}: {
  scenario: GameScenario;
  relatedLessons: RelatedLink[];
  relatedBlocks: RelatedLink[];
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [finished, setFinished] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLHeadingElement>(null);
  const debriefRef = useRef<HTMLHeadingElement>(null);

  const steps = scenario.steps;
  const step = steps[stepIndex];
  const max = maxScore(steps.length);
  const score = Math.max(0, attempts.reduce((sum, a) => sum + choiceScoring[a.choice.quality].points, 0));
  const stepAttempts = attempts.filter((a) => a.stepIndex === stepIndex);
  const last = stepAttempts.at(-1);
  // After a choice that moves the case on, wait for "Continue" so the feedback can be read.
  const awaitingContinue = Boolean(last && choiceScoring[last.choice.quality].advances);
  const findings = attempts.filter((a) => a.choice.finding || a.choice.reading);

  // Move keyboard and screen-reader focus to whatever just appeared.
  useEffect(() => {
    if (finished) debriefRef.current?.focus();
    else if (attempts.length > 0) feedbackRef.current?.focus();
  }, [attempts.length, finished]);
  useEffect(() => {
    if (stepIndex > 0) stepRef.current?.focus();
  }, [stepIndex]);

  function choose(choice: GameChoice) {
    setAttempts((prev) => [...prev, { stepIndex, choice }]);
  }

  function continueOn() {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setFinished(true);
      recordGameResult(scenario.id, { score, max });
    }
  }

  function restart() {
    setStepIndex(0);
    setAttempts([]);
    setFinished(false);
    requestAnimationFrame(() => stepRef.current?.focus());
  }

  const notes = (
    <aside aria-labelledby="case-notes" className="rounded-xl border border-line bg-surface p-4 lg:sticky lg:top-6 lg:self-start">
      <h2 id="case-notes" className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        <ClipboardList aria-hidden className="size-4 text-accent" />
        Case notes
      </h2>
      {findings.length === 0 ? (
        <p className="text-xs text-faint">Findings from your tests will be recorded here.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {findings.map((a) => (
            <li key={`${a.stepIndex}-${a.choice.id}`} className="text-sm">
              <p className="mb-0.5 font-mono text-[11px] text-faint">Step {a.stepIndex + 1}</p>
              {a.choice.finding && <p className="text-ink/90">{a.choice.finding}</p>}
            </li>
          ))}
        </ol>
      )}
      <div className="mt-4 border-t border-line pt-3">
        <p className="mb-1.5 flex justify-between text-xs text-muted">
          <span>Score</span>
          <span className="font-mono text-ink">{score}/{max}</span>
        </p>
        <ProgressBar value={score} max={max} label="Score so far" />
      </div>
    </aside>
  );

  if (finished) {
    const percent = Math.round((score / max) * 100);
    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-labelledby="debrief" className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-5 sm:p-6">
          <header>
            <p className="font-mono text-xs tracking-wider text-accent uppercase">Debrief</p>
            <h2 id="debrief" ref={debriefRef} tabIndex={-1} className="mt-1 text-2xl font-semibold text-ink outline-none">
              You scored {score}/{max} ({percent}%)
            </h2>
            <p className="mt-1 text-sm text-muted">
              {percent === 100
                ? "A perfect, systematic diagnosis."
                : percent >= 70
                  ? "Solid work. Review the steps where a better option existed."
                  : "Review the feedback below, then try again for a cleaner path."}
            </p>
          </header>

          <div>
            <h3 className="mb-1.5 text-sm font-semibold text-ink">Root cause (simulated)</h3>
            <p className="text-sm text-ink/90">{scenario.debrief.rootCause}</p>
          </div>

          <div>
            <h3 className="mb-1.5 text-sm font-semibold text-ink">Key lessons</h3>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink/90 marker:text-faint">
              {scenario.debrief.lessons.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink">Your path</h3>
            <ol className="flex flex-col gap-2">
              {steps.map((s, i) => (
                <li key={s.id} className="rounded-lg border border-line bg-canvas p-3 text-sm">
                  <p className="mb-2 text-ink/90">
                    <span className="mr-2 font-mono text-xs text-faint">{i + 1}.</span>
                    {s.prompt}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {attempts
                      .filter((a) => a.stepIndex === i)
                      .map((a) => (
                        <li key={a.choice.id} className="flex flex-wrap items-start gap-2 text-xs text-muted">
                          <QualityBadge quality={a.choice.quality} showPoints />
                          <span className="min-w-0 flex-1">{a.choice.label}</span>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          {(relatedLessons.length > 0 || relatedBlocks.length > 0) && (
            <div className="flex flex-wrap gap-2">
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

          <div className="flex flex-wrap gap-3 border-t border-line pt-5">
            <button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-canvas hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <RotateCcw aria-hidden className="size-4" />
              Play again
            </button>
            <Link href="/diagnose" className="inline-flex items-center rounded-lg border border-line-strong px-4 py-2 text-sm text-ink hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent">
              All scenarios
            </Link>
          </div>
        </section>
        {notes}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-w-0 flex-col gap-4">
        <section aria-label="Customer report" className="rounded-xl border border-line bg-surface p-4 sm:p-5">
          <p className="mb-2 flex items-center gap-2 text-xs font-medium text-muted">
            <MessageSquareQuote aria-hidden className="size-4 text-accent" />
            Customer report
          </p>
          <p className="text-[15px] text-ink/90 italic">{scenario.brief}</p>
          <p className="mt-2 text-xs text-faint">{scenario.device}</p>
        </section>

        <section aria-labelledby="current-step" className="rounded-xl border border-line bg-surface p-4 sm:p-5">
          <p className="mb-1 font-mono text-xs tracking-wider text-accent uppercase">
            Step {stepIndex + 1} of {steps.length}
          </p>
          <h2 id="current-step" ref={stepRef} tabIndex={-1} className="text-lg font-semibold text-ink outline-none">
            {step.prompt}
          </h2>

          <ul className="mt-4 flex flex-col gap-2">
            {step.choices.map((choice) => {
              const used = stepAttempts.some((a) => a.choice.id === choice.id);
              return (
                <li key={choice.id}>
                  <button
                    type="button"
                    onClick={() => choose(choice)}
                    disabled={used || awaitingContinue}
                    className={cx(
                      "flex w-full flex-col gap-2 rounded-lg border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent sm:flex-row sm:items-center",
                      used ? "border-line bg-canvas text-muted" : "border-line-strong text-ink enabled:hover:border-accent/50 enabled:hover:bg-raised",
                      awaitingContinue && !used && "opacity-50",
                    )}
                  >
                    <span className="flex-1">{choice.label}</span>
                    {used && <QualityBadge quality={choice.quality} showPoints />}
                  </button>
                </li>
              );
            })}
          </ul>

          {last && (
            <div ref={feedbackRef} tabIndex={-1} aria-live="polite" className="mt-4 flex flex-col gap-3 rounded-lg border border-line bg-raised/50 p-4 outline-none">
              <QualityBadge quality={last.choice.quality} showPoints />
              <p className="text-sm text-ink/90">{last.choice.feedback}</p>
              {last.choice.finding && (
                <p className="text-sm text-ink">
                  <span className="font-semibold">Finding: </span>
                  {last.choice.finding}
                </p>
              )}
              {last.choice.reading && <SimulatedReadingCard reading={last.choice.reading} />}
              {awaitingContinue ? (
                <button type="button" onClick={continueOn} className="inline-flex items-center gap-2 self-start rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-canvas hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  {stepIndex < steps.length - 1 ? "Continue" : "See debrief"}
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
  );
}
