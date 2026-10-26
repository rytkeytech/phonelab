"use client";

import { FileQuestion } from "lucide-react";
import { cx } from "@/lib/utils";
import { diagramModes, platformFamilies, type DiagramMode } from "@/data/explorer-hierarchy";
import { Select } from "@/components/ui/Select";

type Props = {
  /** A platform family id, or "" for any phone */
  platformId: string;
  onPlatformChange: (id: string) => void;
  mode: DiagramMode;
  onModeChange: (mode: DiagramMode) => void;
};

/** Picks what the explorer shows: platform → chipset → model → revision, and the diagram mode. */
export function ExplorerScope({ platformId, onPlatformChange, mode, onModeChange }: Props) {
  const family = platformFamilies.find((p) => p.id === platformId);
  const none = "None verified yet";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-3 sm:p-4">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Select
          label="Platform"
          value={platformId}
          onChange={onPlatformChange}
          placeholder="Any phone (conceptual)"
          options={platformFamilies.map((p) => ({ value: p.id, label: p.name }))}
        />
        {/* Nothing below the platform has a verified source yet, so these stay disabled and say why. */}
        {(["Chipset", "Phone model", "Board revision"] as const).map((label) => (
          <Select
            key={label}
            label={label}
            value=""
            onChange={() => {}}
            placeholder={family && family.chipsets.length > 0 ? `Choose a ${label.toLowerCase()}` : none}
            options={[]}
            disabled
          />
        ))}
      </div>

      <div role="tablist" aria-label="Diagram mode" className="flex flex-wrap gap-1.5 border-t border-line pt-3">
        {diagramModes.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            title={m.description}
            onClick={() => onModeChange(m.id)}
            className={cx(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent",
              mode === m.id ? "border-accent/50 bg-accent-soft text-accent" : "border-line text-muted hover:text-ink",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Shown instead of a schematic or boardview until a legitimate source exists for an exact model and revision. */
export function NoVerifiedSource({ mode, platformName }: { mode: Exclude<DiagramMode, "conceptual">; platformName?: string }) {
  const what = mode === "schematic" ? "schematic" : "boardview";
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line-strong bg-surface/50 px-6 py-12 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-xl border border-line bg-raised text-accent">
        <FileQuestion aria-hidden className="size-6" />
      </div>
      <h2 className="text-base font-semibold text-ink">No verified {what} yet</h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
        A {what} only applies to one phone model and board revision{platformName ? ` (not to every ${platformName} phone)` : ""}, and
        must come from a legitimate source. PhoneLab doesn&apos;t have one yet, so nothing is drawn. A realistic-looking
        diagram without a source would be worse than none.
      </p>
      <p className="mt-3 max-w-lg text-xs leading-relaxed text-faint">
        Until then, use the Conceptual mode for how the subsystems relate, and the schematic or boardview for your exact model
        from your own licensed tools.
      </p>
    </div>
  );
}
