import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RepairCase } from "@/lib/types";
import { faultCategoryLabel, platformNames } from "@/data/repairs";
import { Badge } from "@/components/ui/Badge";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";

export function RepairCaseCard({ repairCase: c }: { repairCase: RepairCase }) {
  return (
    <Link
      href={`/repairs/${c.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-raised/40 focus-visible:outline-2 focus-visible:outline-accent sm:p-5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <ConfidenceBadge level={c.confidence} />
        <Badge>{faultCategoryLabel(c.faultCategory)}</Badge>
        {c.isSample && <Badge tone="caution">Sample</Badge>}
      </div>
      <div>
        <h2 className="font-semibold text-ink group-hover:text-accent">{c.title}</h2>
        <p className="mt-1 text-sm text-muted">{c.summary}</p>
      </div>
      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <div className="flex gap-1">
          <dt className="text-faint">Model</dt>
          <dd className="text-ink/85">{c.model}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-faint">Platform</dt>
          <dd className="text-ink/85">{platformNames[c.platform]}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-faint">Board rev.</dt>
          <dd className="text-ink/85">{c.boardRevision ?? "Not recorded"}</dd>
        </div>
      </dl>
      <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
        {c.repairProcedure.length > 0 ? "View diagnosis and repair" : "View diagnosis so far"}
        <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
