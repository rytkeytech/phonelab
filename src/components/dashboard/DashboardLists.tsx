import Link from "next/link";
import { Footprints } from "lucide-react";
import type { GameScenario, RepairCase } from "@/lib/types";
import { platformNames } from "@/data/repairs";
import { Badge } from "@/components/ui/Badge";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { difficultyLabel } from "@/components/learn/LessonRow";

const rowClass =
  "block rounded-lg px-2 py-2.5 hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent";

export function ChallengeList({ scenarios }: { scenarios: GameScenario[] }) {
  return (
    <ul className="-mx-2 divide-y divide-line">
      {scenarios.map((c) => (
        <li key={c.id}>
          <Link href={`/diagnose/${c.id}`} className={rowClass}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-ink">{c.title}</p>
              <Badge>{difficultyLabel[c.difficulty]}</Badge>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span>{c.symptom}</span>
              <span className="inline-flex items-center gap-1">
                <Footprints aria-hidden className="size-3" />
                {c.steps.length} steps
              </span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function RepairCaseList({ cases }: { cases: RepairCase[] }) {
  return (
    <ul className="-mx-2 divide-y divide-line">
      {cases.map((c) => (
        <li key={c.id}>
          <Link href={`/repairs/${c.id}`} className={rowClass}>
            <p className="text-sm text-ink">{c.title}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
              <ConfidenceBadge level={c.confidence} />
              <span>{c.model}</span>
              <span className="text-faint">·</span>
              <span>{platformNames[c.platform]}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
