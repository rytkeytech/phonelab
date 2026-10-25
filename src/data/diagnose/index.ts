import type { ChoiceQuality } from "@/lib/types";
import { scenarios } from "./scenarios";

/*
 * Diagnostic game content. Lives in code for now; moves to the Supabase
 * game_scenarios and game_steps tables once the database is connected.
 */

export { scenarios };

export function getScenario(id: string) {
  return scenarios.find((s) => s.id === id);
}

export const choiceScoring: Record<ChoiceQuality, { points: number; label: string; advances: boolean }> = {
  best: { points: 10, label: "Best next step", advances: true },
  ok: { points: 5, label: "Reasonable, not ideal", advances: true },
  poor: { points: 0, label: "Not useful yet", advances: false },
  unsafe: { points: -5, label: "Unsafe", advances: false },
};

/** A perfect run picks the best choice at every step. */
export function maxScore(stepCount: number) {
  return stepCount * choiceScoring.best.points;
}
