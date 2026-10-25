import type { ChallengeSummary } from "@/lib/types";

/*
 * SAMPLE DATA for the UI preview.
 * Replaced by Supabase queries later in Stage 3.
 * Repair cases live in src/data/repairs; learning content in src/data/learning.
 */

export const challenges: ChallengeSummary[] = [
  { id: "dead-after-charge", title: "The phone that died on the charger", symptom: "No power, no current draw", difficulty: "beginner", steps: 5 },
  { id: "logo-loop", title: "Stuck at the logo", symptom: "Boot loop after a drop", difficulty: "intermediate", steps: 7 },
  { id: "no-wifi", title: "Wi-Fi won't switch on", symptom: "Wi-Fi toggle greyed out", difficulty: "advanced", steps: 8 },
];

export const sampleStats = {
  challengesSolved: 4,
  averageScore: 78,
  savedCases: 6,
};
