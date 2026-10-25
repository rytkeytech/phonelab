"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";
import { recordQuizResult, useProgress } from "@/lib/progress";
import { cx } from "@/lib/utils";

export function KnowledgeCheck({ lessonId, questions }: { lessonId: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const best = useProgress().quiz[lessonId];

  const answeredAll = questions.every((q) => answers[q.id] !== undefined);
  const score = questions.filter((q) => answers[q.id] === q.correctIndex).length;

  function submit() {
    setSubmitted(true);
    recordQuizResult(lessonId, { score, total: questions.length });
  }

  function retry() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <section aria-labelledby="knowledge-check" className="rounded-xl border border-line bg-surface p-4 sm:p-6">
      <header className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="knowledge-check" className="text-lg font-semibold text-ink">
          Knowledge check
        </h2>
        {best && (
          <p className="text-xs text-muted">
            Best score: <span className="font-mono text-ink">{best.score}/{best.total}</span>
          </p>
        )}
      </header>

      <div className="flex flex-col gap-6">
        {questions.map((q, qi) => {
          const chosen = answers[q.id];
          return (
            <fieldset key={q.id} disabled={submitted}>
              <legend className="mb-3 text-[15px] font-medium text-ink">
                <span className="mr-2 font-mono text-sm text-faint">{qi + 1}.</span>
                {q.prompt}
              </legend>
              <div className="flex flex-col gap-2">
                {q.options.map((option, oi) => {
                  const selected = chosen === oi;
                  const isCorrect = oi === q.correctIndex;
                  return (
                    <label
                      key={option}
                      className={cx(
                        "flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent",
                        !submitted && (selected ? "border-accent/60 bg-accent-soft text-ink" : "border-line hover:border-line-strong hover:bg-raised"),
                        submitted && isCorrect && "border-verified/50 bg-verified/10 text-ink",
                        submitted && selected && !isCorrect && "border-red-400/50 bg-red-400/10 text-ink",
                        submitted && !selected && !isCorrect && "border-line text-muted",
                        submitted && "cursor-default",
                      )}
                    >
                      <input
                        type="radio"
                        name={`${lessonId}-${q.id}`}
                        checked={selected}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                        className="mt-0.5 accent-[var(--color-accent)]"
                      />
                      <span className="flex-1">{option}</span>
                      {submitted && isCorrect && <CheckCircle2 aria-label="Correct answer" className="size-4 shrink-0 text-verified" />}
                      {submitted && selected && !isCorrect && <XCircle aria-label="Your answer, incorrect" className="size-4 shrink-0 text-red-400" />}
                    </label>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-2.5 rounded-md bg-raised px-3 py-2 text-sm text-ink/85">
                  <span className={cx("font-semibold", chosen === q.correctIndex ? "text-verified" : "text-red-400")}>
                    {chosen === q.correctIndex ? "Correct. " : "Not quite. "}
                  </span>
                  {q.explanation}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>

      <footer className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
        {!submitted ? (
          <>
            <button
              type="button"
              onClick={submit}
              disabled={!answeredAll}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-canvas hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check answers
            </button>
            {!answeredAll && (
              <span className="text-xs text-faint">
                Answer all {questions.length} questions to check.
              </span>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-ink" aria-live="polite">
              You scored <span className="font-mono font-semibold">{score}/{questions.length}</span>
              {score === questions.length ? ". Well done!" : ". Review the explanations and try again."}
            </p>
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-sm text-ink hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent"
            >
              <RotateCcw aria-hidden className="size-3.5" />
              Try again
            </button>
          </>
        )}
      </footer>
    </section>
  );
}
