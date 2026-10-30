import { Ground, Node, ResistorV, Supply, Wire } from "./CircuitSymbols";

/*
 * Educational illustration: a voltage divider healthy and with each resistor
 * open. Textbook numbers, with nothing loading the middle point.
 */

const panels = [
  { x: 54, title: "Healthy", reading: "1.5 V", tone: "fill-clock", open: null },
  { x: 200, title: "Top open", reading: "0 V", tone: "fill-red-400", open: "top" },
  { x: 346, title: "Bottom open", reading: "3 V", tone: "fill-red-400", open: "bottom" },
] as const;

const TOP = 62;
const MID = 142;

/** A resistor position, drawn broken when that resistor has failed open. */
function Part({ x, y, open }: { x: number; y: number; open: boolean }) {
  if (!open) return <ResistorV x={x} y={y} />;
  return (
    <g>
      <ResistorV x={x} y={y} className="stroke-muted" />
      <line x1={x - 12} y1={y + 18} x2={x + 12} y2={y + 30} className="stroke-red-400" strokeWidth={2.5} />
      <line x1={x + 12} y1={y + 18} x2={x - 12} y2={y + 30} className="stroke-red-400" strokeWidth={2.5} />
      <text x={x + 15} y={y + 28} className="fill-red-400" fontSize={11}>
        open
      </text>
    </g>
  );
}

export function VoltageDividerDiagram() {
  return (
    <svg viewBox="0 0 440 268" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="vd-title">
      <title id="vd-title">
        A 3 volt divider made of two 10 kilohm resistors. Healthy, the middle reads 1.5 volts. With the top resistor open,
        the middle falls to 0 volts. With the bottom resistor open, the middle rises to 3 volts.
      </title>
      {panels.map((p) => (
        <g key={p.title}>
          <text x={p.x + 18} y={18} textAnchor="middle" className="fill-ink font-semibold" fontSize={13}>
            {p.title}
          </text>
          <Supply x={p.x} y={50} label="3 V" />
          <Wire points={[[p.x, 50], [p.x, TOP]]} />
          <Part x={p.x} y={TOP} open={p.open === "top"} />
          <Wire points={[[p.x, TOP + 48], [p.x, MID + 12]]} />
          <Node x={p.x} y={MID - 12} />
          <Wire points={[[p.x, MID - 12], [p.x + 28, MID - 12]]} />
          <text x={p.x + 34} y={MID - 8} className={`${p.tone} font-semibold`} fontSize={14}>
            {p.reading}
          </text>
          <Part x={p.x} y={MID + 12} open={p.open === "bottom"} />
          <Wire points={[[p.x, MID + 60], [p.x, MID + 70]]} />
          <Ground x={p.x} y={MID + 70} />
          <text x={p.x - 19} y={TOP + 28} textAnchor="end" className="fill-muted" fontSize={10.5}>
            10k
          </text>
          <text x={p.x - 19} y={MID + 40} textAnchor="end" className="fill-muted" fontSize={10.5}>
            10k
          </text>
        </g>
      ))}
      <text x={220} y={254} textAnchor="middle" className="fill-muted" fontSize={11.5}>
        Middle voltage = supply × bottom ÷ (top + bottom)
      </text>
    </svg>
  );
}
