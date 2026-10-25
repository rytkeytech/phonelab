"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { resetProgress, useProgress } from "@/lib/progress";
import { ProgressBar } from "@/components/ui/ProgressBar";

/** "x of y complete" plus a bar, for any set of published lesson ids. */
export function LessonSetProgress({ lessonIds, label }: { lessonIds: string[]; label: string }) {
  const { completed } = useProgress();
  const done = lessonIds.filter((id) => completed[id]).length;

  if (lessonIds.length === 0) {
    return <p className="text-xs text-faint">Lessons coming soon</p>;
  }
  return (
    <div>
      <p className="mb-1.5 flex justify-between text-xs text-muted">
        <span>
          {done} of {lessonIds.length} available lesson{lessonIds.length === 1 ? "" : "s"} complete
        </span>
        <span className="font-mono tabular-nums">{Math.round((done / lessonIds.length) * 100)}%</span>
      </p>
      <ProgressBar value={done} max={lessonIds.length} label={label} />
    </div>
  );
}

export function LessonStatusIcon({ lessonId }: { lessonId: string }) {
  const complete = Boolean(useProgress().completed[lessonId]);
  return complete ? (
    <CheckCircle2 aria-label="Completed" className="size-5 shrink-0 text-verified" />
  ) : (
    <Circle aria-label="Not completed" className="size-5 shrink-0 text-faint" />
  );
}

export function ResetProgressButton() {
  const { completed, quiz, games } = useProgress();
  const hasProgress = [completed, quiz, games].some((record) => Object.keys(record).length > 0);
  if (!hasProgress) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm("Clear all lesson progress, quiz scores and challenge scores saved in this browser?")) resetProgress();
      }}
      className="text-xs text-faint underline-offset-2 hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-accent"
    >
      Reset progress
    </button>
  );
}
