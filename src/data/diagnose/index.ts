import type { CasePhase, ChoiceQuality, GameChoice, GameScenario, GameStep } from "@/lib/types";
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

/** Revealing a step's hint costs this many points. */
export const HINT_COST = 2;

export const phaseLabels: Record<CasePhase, string> = {
  case: "Case",
  inspection: "Inspection",
  "first-test": "First test",
  interpret: "Interpret",
  circuit: "Circuit view",
  "next-decision": "Next decision",
  confirmation: "Confirmation",
  repair: "Repair",
  verification: "Verification",
  review: "Review",
};
export const phaseOrder = Object.keys(phaseLabels) as CasePhase[];

/** Where a choice that moves the case on leads: its `next`, else the following step, else the end. */
export function nextStepId(scenario: GameScenario, stepId: string, choice: GameChoice) {
  if (choice.next) return choice.next;
  const i = scenario.steps.findIndex((s) => s.id === stepId);
  return scenario.steps[i + 1]?.id ?? "end";
}

/** Points for one choice at a step. Detour steps can only lose points. */
export function choicePoints(step: GameStep | undefined, choice: GameChoice) {
  const points = choiceScoring[choice.quality].points;
  return step?.unscored ? Math.min(0, points) : points;
}

/** A perfect run picks the best choice at every step along the best path. */
export function maxScore(scenario: GameScenario) {
  let total = 0;
  let step = scenario.steps[0];
  const seen = new Set<string>();
  while (step && !seen.has(step.id)) {
    seen.add(step.id);
    const best = step.choices.find((c) => c.quality === "best");
    if (!best) break;
    total += choiceScoring.best.points;
    const nextId = nextStepId(scenario, step.id, best);
    step = scenario.steps.find((s) => s.id === nextId)!;
  }
  return total;
}
