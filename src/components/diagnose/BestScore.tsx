"use client";

import { Trophy } from "lucide-react";
import { useProgress } from "@/lib/progress";

/** The learner's best result for a scenario, or a prompt to play it. */
export function BestScore({ scenarioId }: { scenarioId: string }) {
  const best = useProgress().games[scenarioId];
  if (!best) return <span className="text-xs text-faint">Not played yet</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <Trophy aria-hidden className="size-3.5 text-hypothesis" />
      Best: <span className="font-mono text-ink">{best.score}/{best.max}</span>
    </span>
  );
}
