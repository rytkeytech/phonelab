import { ArrowMarker } from "./DiagramNode";
import { ResistorV, Wire } from "./CircuitSymbols";

/*
 * Educational illustration: the same battery feeding two resistors in series
 * and in parallel. Textbook symbols only; no values.
 */

const TOP = 62;
const BOTTOM = 224;

function Battery({ x }: { x: number }) {
  const plus = (TOP + BOTTOM) / 2 - 7;
  return (
    <g>
      <Wire points={[[x, TOP], [x, plus]]} />
      <Wire points={[[x, plus + 14], [x, BOTTOM]]} />
      <line x1={x - 14} y1={plus} x2={x + 14} y2={plus} className="stroke-power" strokeWidth={3} />
      <line x1={x - 7} y1={plus + 14} x2={x + 7} y2={plus + 14} className="stroke-power" strokeWidth={3} />
      <text x={x - 24} y={plus + 4} className="fill-power" fontSize={13}>
        +
      </text>
    </g>
  );
}

export function SeriesParallelDiagram() {
  return (
    <svg viewBox="0 0 440 300" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="sp-title">
      <title id="sp-title">
        Left, series: a battery and two resistors in one loop. The same current flows through both, the two voltage drops
        add up to the battery voltage, and the total resistance is the sum. Right, parallel: two resistors connected across
        the same two points. Each has the same voltage, the current splits between them, and the total resistance is lower
        than the smallest resistor.
      </title>
      <defs>
        <ArrowMarker id="sp-arrow" className="fill-data" />
      </defs>

      {/* ---- Series ---- */}
      <text x={105} y={24} textAnchor="middle" className="fill-ink font-semibold" fontSize={14}>
        Series: one path
      </text>
      <Battery x={36} />
      <Wire points={[[36, TOP], [140, TOP], [140, 76]]} />
      <ResistorV x={140} y={76} />
      <Wire points={[[140, 124], [140, 146]]} />
      <ResistorV x={140} y={146} />
      <Wire points={[[140, 194], [140, BOTTOM], [36, BOTTOM]]} />
      <line x1={64} y1={TOP} x2={112} y2={TOP} className="stroke-data" strokeWidth={2} markerEnd="url(#sp-arrow)" />
      <text x={88} y={TOP - 10} textAnchor="middle" className="fill-data" fontSize={11}>
        current
      </text>
      <text x={154} y={104} className="fill-muted" fontSize={11}>
        drop 1
      </text>
      <text x={154} y={174} className="fill-muted" fontSize={11}>
        drop 2
      </text>
      <text x={105} y={258} textAnchor="middle" className="fill-ink" fontSize={12}>
        Same current everywhere
      </text>
      <text x={105} y={276} textAnchor="middle" className="fill-muted" fontSize={11.5}>
        Voltages and resistances add
      </text>

      <line x1={218} y1={10} x2={218} y2={290} className="stroke-line" />

      {/* ---- Parallel ---- */}
      <text x={330} y={24} textAnchor="middle" className="fill-ink font-semibold" fontSize={14}>
        Parallel: two paths
      </text>
      <Battery x={258} />
      <Wire points={[[258, TOP], [414, TOP]]} />
      <Wire points={[[258, BOTTOM], [414, BOTTOM]]} />
      {[334, 414].map((x) => (
        <g key={x}>
          <Wire points={[[x, TOP], [x, 106]]} />
          <ResistorV x={x} y={106} />
          <Wire points={[[x, 154], [x, BOTTOM]]} />
          <circle cx={x} cy={TOP} r={3.5} className="fill-ink" />
          <circle cx={x} cy={BOTTOM} r={3.5} className="fill-ink" />
          <line x1={x - 16} y1={74} x2={x - 16} y2={100} className="stroke-data" strokeWidth={2} markerEnd="url(#sp-arrow)" />
        </g>
      ))}
      <line x1={272} y1={TOP} x2={318} y2={TOP} className="stroke-data" strokeWidth={2} markerEnd="url(#sp-arrow)" />
      <text x={296} y={TOP - 10} textAnchor="middle" className="fill-data" fontSize={11}>
        current
      </text>
      <text x={330} y={258} textAnchor="middle" className="fill-ink" fontSize={12}>
        Same voltage on every branch
      </text>
      <text x={330} y={276} textAnchor="middle" className="fill-muted" fontSize={11.5}>
        Currents add; total R goes down
      </text>
    </svg>
  );
}
