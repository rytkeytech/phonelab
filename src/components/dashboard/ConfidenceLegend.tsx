import type { ConfidenceLevel } from "@/lib/types";
import { ConfidenceBadge, confidenceInfo } from "@/components/ui/ConfidenceBadge";

export function ConfidenceLegend() {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {(Object.keys(confidenceInfo) as ConfidenceLevel[]).map((level) => (
        <div key={level}>
          <dt>
            <ConfidenceBadge level={level} />
          </dt>
          <dd className="mt-1.5 text-xs leading-relaxed text-muted">
            {confidenceInfo[level].description}
          </dd>
        </div>
      ))}
    </dl>
  );
}
