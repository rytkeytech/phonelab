import type { ConfidenceLevel } from "@/lib/types";
import { cx } from "@/lib/utils";

export const confidenceInfo: Record<
  ConfidenceLevel,
  { label: string; description: string; className: string }
> = {
  verified: {
    label: "Verified",
    description:
      "Supported by reliable documentation or repeatable practical evidence.",
    className: "text-verified border-verified/30 bg-verified/10",
  },
  corroborated: {
    label: "Corroborated",
    description:
      "Supported by multiple credible sources but not independently confirmed.",
    className: "text-corroborated border-corroborated/30 bg-corroborated/10",
  },
  hypothesis: {
    label: "Hypothesis",
    description: "A possible explanation that still requires testing.",
    className: "text-hypothesis border-hypothesis/30 bg-hypothesis/10",
  },
  unverified: {
    label: "Unverified",
    description: "Evidence is insufficient.",
    className: "text-unverified border-unverified/30 bg-unverified/10",
  },
};

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const info = confidenceInfo[level];
  return (
    <span
      title={info.description}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        info.className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {info.label}
    </span>
  );
}
