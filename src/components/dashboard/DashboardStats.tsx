"use client";

import { ListChecks, Stethoscope, Target } from "lucide-react";
import { useProgress } from "@/lib/progress";
import { StatTile } from "./StatTile";

/* Dashboard stat tiles driven by real activity saved in this browser. */

export function ChallengesSolvedTile({ scenarioIds }: { scenarioIds: string[] }) {
  const { games } = useProgress();
  const played = scenarioIds.filter((id) => games[id]).length;
  return <StatTile icon={Stethoscope} label="Challenges solved" value={`${played}/${scenarioIds.length}`} detail="Diagnostic game" />;
}

export function AverageScoreTile() {
  const results = Object.values(useProgress().games);
  const average = results.length
    ? Math.round((results.reduce((sum, r) => sum + r.score / r.max, 0) / results.length) * 100)
    : null;
  return (
    <StatTile
      icon={Target}
      label="Average score"
      value={average === null ? "—" : `${average}%`}
      detail={average === null ? "Play a challenge to see it" : "Best score per challenge"}
    />
  );
}

export function QuizzesPassedTile({ lessonIds }: { lessonIds: string[] }) {
  const { quiz } = useProgress();
  const perfect = lessonIds.filter((id) => quiz[id] && quiz[id].score === quiz[id].total).length;
  return <StatTile icon={ListChecks} label="Knowledge checks" value={`${perfect}/${lessonIds.length}`} detail="Answered fully correct" />;
}
