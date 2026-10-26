import { CheckCircle2, CircleAlert, CircleMinus, OctagonX } from "lucide-react";
import type { ChoiceQuality } from "@/lib/types";
import { cx } from "@/lib/utils";
import { choiceScoring } from "@/data/diagnose";

const styles: Record<ChoiceQuality, { icon: typeof CheckCircle2; className: string }> = {
  best: { icon: CheckCircle2, className: "text-verified border-verified/30 bg-verified/10" },
  ok: { icon: CircleMinus, className: "text-corroborated border-corroborated/30 bg-corroborated/10" },
  poor: { icon: CircleAlert, className: "text-hypothesis border-hypothesis/30 bg-hypothesis/10" },
  unsafe: { icon: OctagonX, className: "text-red-400 border-red-400/30 bg-red-400/10" },
};

export function QualityBadge({
  quality,
  showPoints = false,
  points: awarded,
}: {
  quality: ChoiceQuality;
  showPoints?: boolean;
  /** Points actually awarded, when they differ from the usual for this quality */
  points?: number;
}) {
  const { icon: Icon, className } = styles[quality];
  const { label } = choiceScoring[quality];
  const points = awarded ?? choiceScoring[quality].points;
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap", className)}>
      <Icon aria-hidden className="size-3.5" />
      {label}
      {showPoints && <span className="font-mono">{points > 0 ? `+${points}` : points}</span>}
    </span>
  );
}
