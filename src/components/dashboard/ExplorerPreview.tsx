import Link from "next/link";
import { ArrowRight } from "lucide-react";

// A small static sketch of the Chipset Explorer layout.
const peripherals = [
  { x: 8, y: 8, label: "PMIC", stroke: "stroke-power", text: "fill-power" },
  { x: 8, y: 52, label: "Clock", stroke: "stroke-clock", text: "fill-clock" },
  { x: 172, y: 8, label: "Display", stroke: "stroke-line-strong", text: "fill-muted" },
  { x: 172, y: 52, label: "RF", stroke: "stroke-line-strong", text: "fill-muted" },
  { x: 62, y: 96, label: "RAM", stroke: "stroke-corroborated", text: "fill-corroborated" },
  { x: 118, y: 96, label: "UFS", stroke: "stroke-corroborated", text: "fill-corroborated" },
];

export function ExplorerPreview() {
  return (
    <Link
      href="/explorer"
      className="group flex h-full flex-col rounded-xl border border-accent/25 bg-linear-to-br from-accent-soft/60 to-surface p-4 transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-accent sm:p-5"
    >
      <p className="font-mono text-[11px] tracking-wider text-accent uppercase">Interactive</p>
      <h2 className="mt-1 text-base font-semibold text-ink">Chipset Explorer</h2>
      <p className="mt-1 text-sm text-muted">
        See how the SoC, PMIC, memory, clocks and peripherals depend on each
        other, and where faults usually show up.
      </p>

      <svg viewBox="0 0 230 130" aria-hidden className="mt-4 w-full">
        <g strokeWidth="1.5" fill="none" opacity="0.7">
          <path d="M58 22 H90 M58 66 H90 M140 22 H172 M140 66 H172 M100 96 V80 M128 96 V80" className="stroke-accent/60" />
        </g>
        <rect x="90" y="8" width="50" height="72" rx="6" className="fill-accent-soft stroke-accent" strokeWidth="1.5" />
        <text x="115" y="48" textAnchor="middle" fontSize="11" className="fill-accent font-mono">SoC</text>
        {peripherals.map((p) => (
          <g key={p.label}>
            <rect x={p.x} y={p.y} width="50" height="28" rx="5" strokeWidth="1" className={`fill-surface ${p.stroke}`} />
            <text x={p.x + 25} y={p.y + 18} textAnchor="middle" fontSize="9" className={`font-mono ${p.text}`}>
              {p.label}
            </text>
          </g>
        ))}
      </svg>

      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-accent">
        Open explorer
        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
