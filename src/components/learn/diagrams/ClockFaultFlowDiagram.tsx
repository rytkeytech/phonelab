import { ArrowMarker } from "./DiagramNode";

/*
 * Process flow for a suspected clock or reset fault, matching the order in
 * the lesson: rule out supplies before blaming clocks and reset.
 */

const steps = [
  { title: "Confirm the symptom", detail: "Bench supply current pattern", side: null },
  { title: "Supplies present?", detail: "Rails the clock / reset circuits need", side: "No → fix the supply first" },
  { title: "Inspect clock parts", detail: "Cracks, corrosion, load capacitors", side: "Damage → strong suspect" },
  { title: "Reset line state", detail: "Held or released, vs the schematic", side: "Stuck → find its driver" },
  { title: "Check the clock itself", detail: "Oscilloscope, 10× probe, buffered output", side: "A meter can't prove it" },
  { title: "Replace, then retest", detail: "Correct part; full power-on", side: null },
];

const ROW = 70;
const BOX_X = 16;
const BOX_W = 236;
const BOX_H = 50;

export function ClockFaultFlowDiagram() {
  const height = steps.length * ROW + 10;
  return (
    <svg viewBox={`0 0 440 ${height}`} className="mx-auto w-full max-w-lg" role="img" aria-labelledby="cf-title">
      <title id="cf-title">
        {`Process flow for a suspected clock or reset fault: ${steps
          .map((s, i) => `${i + 1}, ${s.title}: ${s.detail}${s.side ? ` (${s.side})` : ""}`)
          .join("; ")}.`}
      </title>
      <defs>
        <ArrowMarker id="cf-arrow" className="fill-muted" />
        <ArrowMarker id="cf-arrow-side" className="fill-caution" />
      </defs>
      {steps.map((s, i) => {
        const y = 10 + i * ROW;
        const mid = y + BOX_H / 2;
        return (
          <g key={s.title}>
            {i > 0 && (
              <line x1={BOX_X + BOX_W / 2} y1={y - (ROW - BOX_H) + 2} x2={BOX_X + BOX_W / 2} y2={y - 2} className="stroke-muted" strokeWidth={2} markerEnd="url(#cf-arrow)" />
            )}
            <rect x={BOX_X} y={y} width={BOX_W} height={BOX_H} rx={8} className="fill-surface stroke-clock" strokeWidth={1.5} />
            <text x={BOX_X + 14} y={y + 21} className="fill-ink font-semibold" fontSize={13.5}>
              <tspan className="fill-clock font-mono">{i + 1}</tspan> {s.title}
            </text>
            <text x={BOX_X + 14} y={y + 39} className="fill-muted" fontSize={11}>
              {s.detail}
            </text>
            {s.side && (
              <>
                <line x1={BOX_X + BOX_W} y1={mid} x2={BOX_X + BOX_W + 22} y2={mid} className="stroke-caution" strokeWidth={1.5} markerEnd="url(#cf-arrow-side)" />
                <text x={BOX_X + BOX_W + 28} y={mid + 4} className="fill-caution" fontSize={11}>
                  {s.side}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
