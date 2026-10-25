"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { setLessonComplete, useProgress } from "@/lib/progress";

export function CompleteLessonButton({ lessonId }: { lessonId: string }) {
  const complete = Boolean(useProgress().completed[lessonId]);

  return (
    <button
      type="button"
      onClick={() => setLessonComplete(lessonId, !complete)}
      aria-pressed={complete}
      className={
        complete
          ? "inline-flex items-center gap-2 rounded-lg border border-verified/40 bg-verified/10 px-4 py-2 text-sm font-semibold text-verified hover:bg-verified/15 focus-visible:outline-2 focus-visible:outline-accent"
          : "inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-canvas hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      }
    >
      {complete ? <CheckCircle2 aria-hidden className="size-4" /> : <Circle aria-hidden className="size-4" />}
      {complete ? "Completed" : "Mark as complete"}
    </button>
  );
}
