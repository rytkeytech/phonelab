/*
 * Checks the research links in PhoneLab's content.
 *
 *   npm run content:check
 *
 * - Every claim id used by a lesson block or explorer block exists.
 * - Every claim's sources exist and were actually read.
 * - A claim rated above Hypothesis cites at least one source, unless it is
 *   a general principle (e.g. arithmetic) that needs none.
 * - Every scenario branch leads to a real step, and every step can be reached.
 * No network or database access.
 */
import { chipsetBlocks } from "../src/data/chipset-conceptual";
import { choiceScoring, nextStepId, scenarios } from "../src/data/diagnose";
import { lessons } from "../src/data/learning";
import { getClaim, researchClaims } from "../src/data/research/claims";
import { getSource } from "../src/data/research/sources";

const problems: string[] = [];

const uses = [
  ...lessons.flatMap((l) => l.blocks.flatMap((b, i) => (b.claims ?? []).map((id) => ({ id, where: `lesson ${l.id}, block ${i}` })))),
  ...chipsetBlocks.flatMap((b) => (b.claims ?? []).map((id) => ({ id, where: `explorer block ${b.id}` }))),
];
for (const { id, where } of uses) {
  if (!getClaim(id)) problems.push(`${where} cites unknown claim ${id}`);
}

for (const c of researchClaims) {
  for (const { sourceId } of c.sources) {
    const s = getSource(sourceId);
    if (!s) problems.push(`${c.id} cites unknown source ${sourceId}`);
    else if (s.access.status !== "read") problems.push(`${c.id} cites ${sourceId}, which was not read`);
  }
  const strong = c.confidence === "verified" || c.confidence === "corroborated";
  if (strong && c.sources.length === 0 && c.evidence !== "general-principle") {
    problems.push(`${c.id} is rated ${c.confidence} but cites no source`);
  }
}

// Scenarios: every branch leads somewhere real, every step can be reached, and each step has a best choice.
for (const s of scenarios) {
  const ids = new Set(s.steps.map((st) => st.id));
  const reached = new Set<string>();
  const queue = [s.steps[0].id];
  while (queue.length) {
    const id = queue.pop()!;
    if (id === "end" || reached.has(id)) continue;
    reached.add(id);
    const step = s.steps.find((st) => st.id === id)!;
    if (!step.choices.some((c) => c.quality === "best")) problems.push(`scenario ${s.id}, step ${id} has no best choice`);
    for (const c of step.choices) {
      if (!choiceScoring[c.quality].advances) continue;
      const next = nextStepId(s, id, c);
      if (next !== "end" && !ids.has(next)) problems.push(`scenario ${s.id}, choice ${id}/${c.id} leads to unknown step ${next}`);
      else queue.push(next);
    }
  }
  for (const id of ids) if (!reached.has(id)) problems.push(`scenario ${s.id}, step ${id} can't be reached`);
}

const used = new Set(uses.map((u) => u.id));
const unused = researchClaims.filter((c) => !used.has(c.id)).map((c) => c.id);

console.log(`${uses.length} citations, ${researchClaims.length} claims${unused.length ? ` (not yet cited anywhere: ${unused.join(", ")})` : ""}.`);
if (problems.length) {
  console.error(problems.map((p) => `FAIL  ${p}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("No problems found");
}
