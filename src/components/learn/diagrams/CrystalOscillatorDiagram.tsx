/*
 * Conceptual diagram: a passive crystal driven by a chip's oscillator
 * circuit, next to an active oscillator module. Generic symbols and labels;
 * pin names and part values vary and come from the schematic.
 */

function Ground({ x, y }: { x: number; y: number }) {
  return (
    <g className="stroke-muted" strokeWidth={2}>
      <line x1={x - 10} y1={y} x2={x + 10} y2={y} />
      <line x1={x - 6} y1={y + 5} x2={x + 6} y2={y + 5} />
      <line x1={x - 2} y1={y + 10} x2={x + 2} y2={y + 10} />
    </g>
  );
}

/** Capacitor from a node at (x, y) down to ground. */
function CapToGround({ x, y }: { x: number; y: number }) {
  return (
    <g className="stroke-muted" strokeWidth={2}>
      <line x1={x} y1={y} x2={x} y2={y + 24} />
      <line x1={x - 11} y1={y + 24} x2={x + 11} y2={y + 24} />
      <line x1={x - 11} y1={y + 31} x2={x + 11} y2={y + 31} />
      <line x1={x} y1={y + 31} x2={x} y2={y + 48} />
      <Ground x={x} y={y + 48} />
    </g>
  );
}

export function CrystalOscillatorDiagram() {
  return (
    <svg viewBox="0 0 440 290" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="xo-title">
      <title id="xo-title">
        Conceptual diagram. Left: a passive crystal connected between two clock pins of a chip, with a load capacitor
        from each side to ground; the oscillator circuit that drives it is inside the chip. Right: an oscillator module
        that has its own supply and ground and outputs a finished clock signal to the chip.
      </title>

      {/* ---- Left: passive crystal ---- */}
      <text x={110} y={22} textAnchor="middle" className="fill-ink font-semibold" fontSize={14}>
        Crystal (passive)
      </text>
      <rect x={30} y={40} width={160} height={62} rx={8} className="fill-surface stroke-line-strong" strokeWidth={1.5} />
      <text x={110} y={64} textAnchor="middle" className="fill-ink" fontSize={12.5}>
        Chip (e.g. PMIC or SoC)
      </text>
      <text x={110} y={84} textAnchor="middle" className="fill-clock" fontSize={11}>
        oscillator circuit inside
      </text>
      {/* Clock pins down to the crystal */}
      <g className="stroke-clock" strokeWidth={2}>
        <line x1={70} y1={102} x2={70} y2={150} />
        <line x1={150} y1={102} x2={150} y2={150} />
        <line x1={70} y1={150} x2={94} y2={150} />
        <line x1={126} y1={150} x2={150} y2={150} />
      </g>
      {/* Crystal symbol: plates either side of a quartz block */}
      <g className="stroke-ink" strokeWidth={2}>
        <line x1={94} y1={136} x2={94} y2={164} />
        <line x1={126} y1={136} x2={126} y2={164} />
      </g>
      <rect x={100} y={138} width={20} height={24} className="fill-raised stroke-ink" strokeWidth={1.5} />
      <text x={110} y={186} textAnchor="middle" className="fill-ink" fontSize={11.5}>
        crystal
      </text>
      <CapToGround x={70} y={150} />
      <CapToGround x={150} y={150} />
      <text x={110} y={226} textAnchor="middle" className="fill-muted" fontSize={11}>
        load capacitors
      </text>
      <text x={110} y={270} textAnchor="middle" className="fill-muted" fontSize={11.5}>
        No clock? Crystal, caps or chip
      </text>

      <line x1={220} y1={10} x2={220} y2={280} className="stroke-line" />

      {/* ---- Right: oscillator module ---- */}
      <text x={330} y={22} textAnchor="middle" className="fill-ink font-semibold" fontSize={14}>
        Oscillator module (active)
      </text>
      <rect x={270} y={112} width={120} height={64} rx={8} className="fill-surface stroke-clock" strokeWidth={1.5} />
      <text x={330} y={140} textAnchor="middle" className="fill-ink" fontSize={12.5}>
        Oscillator
      </text>
      <text x={330} y={158} textAnchor="middle" className="fill-muted" fontSize={10.5}>
        crystal + driver inside
      </text>
      {/* Supply in, output out, ground */}
      <line x1={300} y1={112} x2={300} y2={70} className="stroke-power" strokeWidth={2} />
      <text x={300} y={62} textAnchor="middle" className="fill-power" fontSize={11}>
        supply
      </text>
      <line x1={360} y1={112} x2={360} y2={70} className="stroke-muted" strokeWidth={2} strokeDasharray="4 3" />
      <text x={360} y={62} textAnchor="middle" className="fill-muted" fontSize={11}>
        enable*
      </text>
      <line x1={330} y1={176} x2={330} y2={202} className="stroke-muted" strokeWidth={2} />
      <Ground x={330} y={202} />
      <line x1={390} y1={144} x2={428} y2={144} className="stroke-clock" strokeWidth={2.5} />
      <path d="M418 138 L428 144 L418 150" fill="none" className="stroke-clock" strokeWidth={2} />
      <text x={410} y={134} textAnchor="middle" className="fill-clock" fontSize={11}>
        clock
      </text>
      <text x={330} y={252} textAnchor="middle" className="fill-muted" fontSize={11.5}>
        No clock? Check its supply first
      </text>
      <text x={330} y={270} textAnchor="middle" className="fill-faint" fontSize={10.5}>
        *Not every module has an enable pin
      </text>
    </svg>
  );
}
