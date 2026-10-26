import type { CaseStatus } from "@/lib/repair-cases";
import { cx } from "@/lib/utils";

export const statusInfo: Record<CaseStatus, { label: string; description: string; className: string }> = {
  draft: { label: "Draft", description: "Only you can see it. Submit it when it's ready.", className: "text-muted border-line-strong bg-raised" },
  submitted: { label: "Waiting for review", description: "A reviewer will check it. You can still edit it.", className: "text-corroborated border-corroborated/30 bg-corroborated/10" },
  changes_requested: { label: "Changes requested", description: "A reviewer asked for changes. Edit it and submit again.", className: "text-hypothesis border-hypothesis/30 bg-hypothesis/10" },
  published: { label: "Published", description: "Visible to everyone in the Repair Repository.", className: "text-verified border-verified/30 bg-verified/10" },
  rejected: { label: "Rejected", description: "Not published. See the reviewer's note.", className: "text-red-400 border-red-400/30 bg-red-400/10" },
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span className={cx("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap", statusInfo[status].className)}>
      {statusInfo[status].label}
    </span>
  );
}
