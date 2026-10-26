/*
 * Educational illustration: the two basic probe setups. Same probe points,
 * different board state. No real board, test point or value.
 */

function Setup({ x, title, powered }: { x: number; title: string; powered: boolean }) {
  return (
    <g>
      <text x={x + 100} y={24} textAnchor="middle" className="fill-ink font-semibold" fontSize={14}>
        {title}
      </text>
      <text x={x + 100} y={44} textAnchor="middle" className={powered ? "fill-power" : "fill-data"} fontSize={12}>
        {powered ? "Board powered" : "Battery and charger disconnected"}
      </text>

      {/* Board */}
      <rect x={x + 10} y={70} width={180} height={120} rx={10} className="fill-surface stroke-line-strong" strokeWidth={1.5} />
      <text x={x + 24} y={90} className="fill-faint font-mono" fontSize={10}>
        BOARD
      </text>
      {/* Test point and ground */}
      <circle cx={x + 70} cy={130} r={7} className="fill-accent" />
      <text x={x + 70} y={156} textAnchor="middle" className="fill-ink" fontSize={11.5}>
        test point
      </text>
      <rect x={x + 120} y={118} width={44} height={24} rx={4} className="fill-raised stroke-line-strong" />
      <text x={x + 142} y={134} textAnchor="middle" className="fill-muted" fontSize={10.5}>
        GND
      </text>

      {/* Power source */}
      <rect x={x + 60} y={220} width={80} height={34} rx={6} className="fill-raised stroke-line-strong" />
      <text x={x + 100} y={242} textAnchor="middle" className="fill-muted" fontSize={11.5}>
        battery
      </text>
      {powered ? (
        <line x1={x + 100} y1={220} x2={x + 100} y2={190} className="stroke-power" strokeWidth={3} />
      ) : (
        <g className="stroke-red-400" strokeWidth={2.5} strokeLinecap="round">
          <line x1={x + 100} y1={220} x2={x + 100} y2={212} />
          <line x1={x + 100} y1={198} x2={x + 100} y2={190} />
          <line x1={x + 93} y1={198} x2={x + 107} y2={212} />
          <line x1={x + 107} y1={198} x2={x + 93} y2={212} />
        </g>
      )}

      {/* Probes */}
      <path d={`M${x + 70} 123 L${x + 54} 66`} className="stroke-red-400" strokeWidth={3} strokeLinecap="round" />
      <path d={`M${x + 142} 118 L${x + 160} 66`} className="stroke-ink" strokeWidth={3} strokeLinecap="round" />
      <text x={x + 46} y={62} textAnchor="middle" className="fill-red-400" fontSize={11}>
        red
      </text>
      <text x={x + 166} y={62} textAnchor="middle" className="fill-ink" fontSize={11}>
        black
      </text>

      <text x={x + 100} y={282} textAnchor="middle" className="fill-muted" fontSize={11.5}>
        {powered ? "Mode: DC voltage" : "Mode: Ω, continuity or diode"}
      </text>
    </g>
  );
}

export function MeasurementSetupDiagram() {
  return (
    <svg viewBox="0 0 440 300" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="ms-title">
      <title id="ms-title">
        Educational illustration of two probe setups. Left: DC voltage, board powered, red probe on the test point and
        black probe on ground. Right: resistance, continuity or diode mode, with the battery and charger disconnected,
        probes on the same points.
      </title>
      <Setup x={10} title="Voltage" powered />
      <line x1={220} y1={14} x2={220} y2={290} className="stroke-line" />
      <Setup x={230} title="Ω · continuity · diode" powered={false} />
    </svg>
  );
}
