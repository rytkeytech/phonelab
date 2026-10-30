import { Ground, Node, ResistorH, ResistorV, Supply, Wire } from "./CircuitSymbols";

/*
 * Educational illustration: four jobs a resistor does. Textbook symbols only;
 * no phone circuit or values.
 */

const COL = 220;
const ROW = 190;

function Panel({ x, y, title, note, children }: { x: number; y: number; title: string; note: string; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <text x={14} y={22} className="fill-ink font-semibold" fontSize={13.5}>
        {title}
      </text>
      {children}
      <text x={14} y={ROW - 12} className="fill-muted" fontSize={11}>
        {note}
      </text>
    </g>
  );
}

export function ResistorJobsDiagram() {
  return (
    <svg viewBox={`0 0 440 ${ROW * 2}`} className="mx-auto w-full max-w-lg" role="img" aria-labelledby="rj-title">
      <title id="rj-title">
        Four jobs of a resistor. Limiting current: a resistor in series between a supply and a load. Holding a level: a
        resistor from a supply to a line. Dividing a voltage: two resistors in series, with a smaller voltage taken from
        between them. Sensing current: a small resistor in a load&apos;s current path, with a chip reading the voltage across it.
      </title>

      <line x1={COL} y1={8} x2={COL} y2={ROW * 2 - 8} className="stroke-line" />
      <line x1={8} y1={ROW} x2={432} y2={ROW} className="stroke-line" />

      <Panel x={0} y={0} title="Limit current" note="In series with a load">
        <Supply x={34} y={62} label="supply" />
        <Wire points={[[34, 62], [34, 96], [66, 96]]} />
        <ResistorH x={66} y={96} />
        <Wire points={[[114, 96], [138, 96]]} />
        <rect x={138} y={78} width={56} height={36} rx={5} className="fill-surface stroke-line-strong" strokeWidth={1.5} />
        <text x={166} y={101} textAnchor="middle" className="fill-ink" fontSize={12}>
          load
        </text>
        <Wire points={[[166, 114], [166, 140]]} />
        <Ground x={166} y={140} />
      </Panel>

      <Panel x={COL} y={0} title="Hold a level" note="Pull-up or pull-down">
        <Supply x={64} y={52} label="supply" />
        <Wire points={[[64, 52], [64, 62]]} />
        <ResistorV x={64} y={62} />
        <Wire points={[[64, 110], [64, 128], [136, 128]]} />
        <Node x={64} y={128} />
        <path d="M130 122 L140 128 L130 134" fill="none" className="stroke-ink/70" strokeWidth={2} />
        <text x={146} y={132} className="fill-control" fontSize={12}>
          line
        </text>
      </Panel>

      <Panel x={0} y={ROW} title="Divide a voltage" note="Two in series, tapped in the middle">
        <Supply x={64} y={46} label="supply" />
        <ResistorV x={64} y={46} />
        <Wire points={[[64, 94], [64, 104]]} />
        <Node x={64} y={99} />
        <ResistorV x={64} y={104} />
        <Wire points={[[64, 152], [64, 156]]} />
        <Ground x={64} y={156} />
        <Wire points={[[64, 99], [112, 99]]} />
        <path d="M106 93 L116 99 L106 105" fill="none" className="stroke-ink/70" strokeWidth={2} />
        <text x={122} y={103} className="fill-data" fontSize={12}>
          smaller
        </text>
        <text x={122} y={118} className="fill-data" fontSize={12}>
          voltage
        </text>
      </Panel>

      <Panel x={COL} y={ROW} title="Sense current" note="Small resistor in the current path">
        <rect x={36} y={38} width={56} height={32} rx={5} className="fill-surface stroke-line-strong" strokeWidth={1.5} />
        <text x={64} y={59} textAnchor="middle" className="fill-ink" fontSize={12}>
          load
        </text>
        <Wire points={[[64, 70], [64, 96]]} />
        <Node x={64} y={84} />
        <ResistorV x={64} y={96} className="stroke-power" />
        <Wire points={[[64, 144], [64, 152]]} />
        <Ground x={64} y={152} />
        <Wire points={[[64, 84], [126, 84]]} />
        <path d="M120 78 L130 84 L120 90" fill="none" className="stroke-ink/70" strokeWidth={2} />
        <text x={136} y={81} className="fill-control" fontSize={12}>
          chip reads
        </text>
        <text x={136} y={96} className="fill-control" fontSize={12}>
          this voltage
        </text>
      </Panel>
    </svg>
  );
}
