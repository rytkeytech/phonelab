import { CapacitorV, Ground, Node, ResistorH, Wire } from "./CircuitSymbols";

/*
 * Educational illustration of parallel paths on a board: capacitors sharing a
 * rail, and a meter that can't separate a resistor from what's beside it.
 * Textbook numbers; not a phone circuit.
 */

const CAPS = [64, 142, 220, 298, 376];
const SHORTED = 220;

export function ParallelOnBoardDiagram() {
  return (
    <svg viewBox="0 0 440 372" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="pb-title">
      <title id="pb-title">
        Top: five capacitors connect between one rail and ground. The middle one is shorted, so the whole rail is pulled
        down and every capacitor reads the same. Bottom: a meter probes a 10 kilohm resistor that has another 10 kilohm path
        in parallel with it, so the meter reads 5 kilohms.
      </title>

      {/* ---- One short pulls down the rail ---- */}
      <text x={16} y={22} className="fill-ink font-semibold" fontSize={13.5}>
        One short pulls down the whole rail
      </text>
      <Wire points={[[30, 52], [410, 52]]} className="stroke-power" width={3} />
      <text x={410} y={44} textAnchor="end" className="fill-power" fontSize={11.5}>
        rail
      </text>
      <Wire points={[[30, 112], [410, 112]]} className="stroke-muted" />
      {CAPS.map((x) =>
        x === SHORTED ? (
          <g key={x}>
            <Wire points={[[x, 52], [x, 112]]} className="stroke-red-400" width={3.5} />
            <Node x={x} y={52} className="fill-red-400" />
            <Node x={x} y={112} className="fill-red-400" />
            <text x={x + 9} y={86} className="fill-red-400" fontSize={11.5}>
              short
            </text>
          </g>
        ) : (
          <g key={x}>
            <Wire points={[[x, 52], [x, 67]]} />
            <CapacitorV x={x} y={67} />
            <Wire points={[[x, 97], [x, 112]]} />
            <Node x={x} y={52} />
            <Node x={x} y={112} />
          </g>
        ),
      )}
      <Wire points={[[220, 112], [220, 122]]} className="stroke-muted" />
      <Ground x={220} y={122} />
      <text x={220} y={156} textAnchor="middle" className="fill-muted" fontSize={11.5}>
        Every capacitor on the rail now reads near zero, not just the bad one.
      </text>

      <line x1={10} y1={174} x2={430} y2={174} className="stroke-line" />

      {/* ---- A meter reads every path ---- */}
      <text x={16} y={200} className="fill-ink font-semibold" fontSize={13.5}>
        A meter reads every path in parallel
      </text>
      <circle cx={220} cy={232} r={20} className="fill-surface stroke-accent" strokeWidth={2} />
      <text x={220} y={237} textAnchor="middle" className="fill-accent font-semibold" fontSize={13}>
        5 kΩ
      </text>
      <Wire points={[[200, 232], [96, 232], [96, 268]]} className="stroke-accent" />
      <Wire points={[[240, 232], [344, 232], [344, 268]]} className="stroke-accent" />
      <Wire points={[[96, 268], [96, 322]]} />
      <Wire points={[[344, 268], [344, 322]]} />
      <Node x={96} y={268} />
      <Node x={344} y={268} />
      <Wire points={[[96, 280], [196, 280]]} />
      <ResistorH x={196} y={280} />
      <Wire points={[[244, 280], [344, 280]]} />
      <Wire points={[[96, 322], [196, 322]]} />
      <ResistorH x={196} y={322} className="stroke-muted" />
      <Wire points={[[244, 322], [344, 322]]} />
      <text x={220} y={302} textAnchor="middle" className="fill-ink" fontSize={11.5}>
        10 kΩ: the resistor under test
      </text>
      <text x={220} y={347} textAnchor="middle" className="fill-muted" fontSize={11.5}>
        10 kΩ: the rest of the circuit
      </text>
    </svg>
  );
}
