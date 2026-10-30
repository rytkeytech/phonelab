import { CapacitorV, Ground, Node, ResistorV, Wire } from "./CircuitSymbols";

/*
 * Conceptual block diagram of an LDO: pass transistor, reference, error
 * amplifier and sampling resistors. Generic; inside a PMIC these parts can't
 * be reached, and the output capacitor is the part seen on the board.
 */

const RAIL = 62;
const TAP = 300; // where the divider leaves the output
const SENSE = 196; // the divider's middle point

export function LdoBlockDiagram() {
  return (
    <svg viewBox="0 0 440 304" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="lb-title">
      <title id="lb-title">
        Block diagram of an LDO. The input connects through a pass transistor to the output, which has a capacitor to ground.
        A voltage divider feeds a fraction of the output back to an error amplifier. The amplifier compares it with a steady
        reference and adjusts the pass transistor to hold the output steady.
      </title>

      {/* Main power path */}
      <Wire points={[[46, RAIL], [120, RAIL]]} className="stroke-power" width={3} />
      <text x={16} y={RAIL + 4} className="fill-power font-semibold" fontSize={13}>
        IN
      </text>
      <rect x={120} y={36} width={128} height={52} rx={8} className="fill-surface stroke-power" strokeWidth={1.5} />
      <text x={184} y={59} textAnchor="middle" className="fill-ink font-semibold" fontSize={13}>
        Pass transistor
      </text>
      <text x={184} y={76} textAnchor="middle" className="fill-muted" fontSize={10.5}>
        drops the extra voltage
      </text>
      <Wire points={[[248, RAIL], [396, RAIL]]} className="stroke-power" width={3} />
      <text x={402} y={RAIL + 4} className="fill-power font-semibold" fontSize={13}>
        OUT
      </text>

      {/* Output capacitor */}
      <Node x={366} y={RAIL} className="fill-power" />
      <CapacitorV x={366} y={RAIL} />
      <Wire points={[[366, RAIL + 30], [366, 112]]} />
      <Ground x={366} y={112} />
      <text x={366} y={140} textAnchor="middle" className="fill-muted" fontSize={10.5}>
        output
      </text>
      <text x={366} y={153} textAnchor="middle" className="fill-muted" fontSize={10.5}>
        capacitor
      </text>

      {/* Sampling resistors */}
      <Node x={TAP} y={RAIL} className="fill-power" />
      <Wire points={[[TAP, RAIL], [TAP, 124]]} />
      <ResistorV x={TAP} y={124} />
      <Wire points={[[TAP, 172], [TAP, 208]]} />
      <Node x={TAP} y={SENSE} />
      <ResistorV x={TAP} y={208} />
      <Wire points={[[TAP, 256], [TAP, 264]]} />
      <Ground x={TAP} y={264} />
      <text x={TAP + 16} y={232} className="fill-muted" fontSize={10.5}>
        sampling
      </text>
      <text x={TAP + 16} y={245} className="fill-muted" fontSize={10.5}>
        resistors
      </text>

      {/* Error amplifier: compares the sample with the reference */}
      <path d="M144 176 L224 176 L184 122 Z" className="fill-surface stroke-control" strokeWidth={1.5} />
      <text x={184} y={166} textAnchor="middle" className="fill-ink" fontSize={10}>
        compare
      </text>
      <Wire points={[[184, 122], [184, 88]]} className="stroke-control" />
      <path d="M178 96 L184 88 L190 96" fill="none" className="stroke-control" strokeWidth={2} />
      <text x={194} y={108} className="fill-control" fontSize={10.5}>
        adjusts
      </text>
      <text x={152} y={150} textAnchor="end" className="fill-control font-semibold" fontSize={11.5}>
        Error amplifier
      </text>
      <Wire points={[[TAP, SENSE], [206, SENSE], [206, 176]]} className="stroke-data" />
      <text x={254} y={SENSE - 6} textAnchor="middle" className="fill-data" fontSize={10.5}>
        fraction of OUT
      </text>

      {/* Reference */}
      <rect x={72} y={214} width={108} height={38} rx={8} className="fill-surface stroke-line-strong" strokeWidth={1.5} />
      <text x={126} y={238} textAnchor="middle" className="fill-ink" fontSize={12}>
        Reference
      </text>
      <Wire points={[[162, 214], [162, 176]]} />
    </svg>
  );
}
