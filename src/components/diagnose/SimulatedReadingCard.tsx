import { FlaskConical } from "lucide-react";
import type { SimulatedReading } from "@/lib/types";

/** A simulated reading, styled like an instrument display and always labelled as simulated. */
export function SimulatedReadingCard({ reading }: { reading: SimulatedReading }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line-strong bg-canvas">
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-1.5">
        <span className="font-mono text-[11px] tracking-wider text-muted uppercase">{reading.label}</span>
        <span className="inline-flex items-center gap-1 rounded bg-caution-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-caution">
          <FlaskConical aria-hidden className="size-3" />
          SIMULATED
        </span>
      </div>
      <p className="px-3 py-2.5 font-mono text-sm text-accent">{reading.value}</p>
      {reading.reference && (
        <p className="border-t border-line px-3 py-2 text-xs text-muted">
          <span className="text-faint">Comparison (simulated): </span>
          {reading.reference}
        </p>
      )}
    </div>
  );
}
