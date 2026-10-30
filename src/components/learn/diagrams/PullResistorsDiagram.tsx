import { Ground, KeyV, Node, ResistorV, Supply, Wire } from "./CircuitSymbols";

/*
 * Educational illustration: a pull-up and a pull-down, each with a key that
 * overrides it. Textbook symbols only; no phone circuit or values.
 */

function ToChip({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Wire points={[[x, y], [x + 62, y]]} className="stroke-control" />
      <rect x={x + 62} y={y - 15} width={52} height={30} rx={5} className="fill-surface stroke-control" strokeWidth={1.5} />
      <text x={x + 88} y={y + 4} textAnchor="middle" className="fill-ink" fontSize={11.5}>
        chip
      </text>
      <text x={x + 30} y={y - 8} textAnchor="middle" className="fill-control" fontSize={11}>
        line
      </text>
    </g>
  );
}

export function PullResistorsDiagram() {
  return (
    <svg viewBox="0 0 440 306" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="pr-title">
      <title id="pr-title">
        Left, a pull-up: a resistor connects the line to the supply, and a key connects the line to ground. The line is high
        until the key is pressed, then low. Right, a pull-down: a resistor connects the line to ground, and a key connects
        the line to the supply. The line is low until the key is pressed, then high.
      </title>

      {/* ---- Pull-up ---- */}
      <text x={106} y={22} textAnchor="middle" className="fill-ink font-semibold" fontSize={14}>
        Pull-up
      </text>
      <Supply x={52} y={58} label="supply" />
      <ResistorV x={52} y={58} />
      <Wire points={[[52, 106], [52, 164]]} />
      <Node x={52} y={132} />
      <ToChip x={52} y={132} />
      <KeyV x={52} y={164} />
      <Wire points={[[52, 194], [52, 206]]} />
      <Ground x={52} y={206} />
      <text x={106} y={246} textAnchor="middle" className="fill-ink" fontSize={12}>
        Key open: line <tspan className="fill-clock font-semibold">high</tspan>
      </text>
      <text x={106} y={266} textAnchor="middle" className="fill-ink" fontSize={12}>
        Key pressed: line <tspan className="fill-data font-semibold">low</tspan>
      </text>

      <line x1={218} y1={10} x2={218} y2={296} className="stroke-line" />

      {/* ---- Pull-down ---- */}
      <text x={330} y={22} textAnchor="middle" className="fill-ink font-semibold" fontSize={14}>
        Pull-down
      </text>
      <Supply x={272} y={58} label="supply" />
      <KeyV x={272} y={58} />
      <Wire points={[[272, 88], [272, 150]]} />
      <Node x={272} y={120} />
      <ToChip x={272} y={120} />
      <ResistorV x={272} y={150} />
      <Wire points={[[272, 198], [272, 206]]} />
      <Ground x={272} y={206} />
      <text x={330} y={246} textAnchor="middle" className="fill-ink" fontSize={12}>
        Key open: line <tspan className="fill-data font-semibold">low</tspan>
      </text>
      <text x={330} y={266} textAnchor="middle" className="fill-ink" fontSize={12}>
        Key pressed: line <tspan className="fill-clock font-semibold">high</tspan>
      </text>
    </svg>
  );
}
