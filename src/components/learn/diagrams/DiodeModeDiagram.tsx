export function DiodeModeDiagram() {
  return (
    <svg viewBox="0 0 420 230" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="dm-title">
      <title id="dm-title">
        Conceptual diode-mode measurement: one meter probe on the test point, the other on ground. The meter
        measures the path through every component connected to that line.
      </title>

      {/* Meter */}
      <rect x={16} y={20} width={122} height={150} rx={12} className="fill-raised stroke-line-strong" strokeWidth={1.5} />
      <rect x={30} y={34} width={94} height={40} rx={6} className="fill-canvas stroke-line" />
      <text x={77} y={60} textAnchor="middle" className="fill-accent font-mono" fontSize={15}>— — —</text>
      <text x={77} y={98} textAnchor="middle" className="fill-muted font-mono" fontSize={11}>DIODE MODE</text>
      <circle cx={52} cy={146} r={8} className="fill-red-400" />
      <circle cx={102} cy={146} r={8} className="fill-ink" />

      {/* Line under test with connected parts */}
      <line x1={206} y1={70} x2={404} y2={70} className="stroke-accent" strokeWidth={2.5} />
      <circle cx={210} cy={70} r={6} className="fill-accent" />
      <text x={210} y={50} textAnchor="middle" className="fill-ink" fontSize={12}>Test point</text>
      <text x={330} y={58} textAnchor="middle" className="fill-muted" fontSize={11}>Line under test</text>

      {/* Capacitor to ground */}
      <g className="stroke-muted" strokeWidth={2}>
        <line x1={280} y1={70} x2={280} y2={112} />
        <line x1={266} y1={112} x2={294} y2={112} />
        <line x1={266} y1={121} x2={294} y2={121} />
        <line x1={280} y1={121} x2={280} y2={190} />
      </g>
      <text x={260} y={120} textAnchor="end" className="fill-muted" fontSize={11}>Capacitor</text>

      {/* IC pin */}
      <line x1={375} y1={70} x2={375} y2={98} className="stroke-muted" strokeWidth={2} />
      <rect x={348} y={98} width={54} height={36} rx={5} className="fill-surface stroke-line-strong" strokeWidth={1.5} />
      <text x={375} y={120} textAnchor="middle" className="fill-muted" fontSize={11}>IC pin</text>
      <line x1={375} y1={134} x2={375} y2={190} className="stroke-muted" strokeWidth={2} />

      {/* Ground */}
      <line x1={206} y1={190} x2={404} y2={190} className="stroke-line-strong" strokeWidth={2.5} />
      <text x={330} y={210} textAnchor="middle" className="fill-muted" fontSize={11}>Ground</text>

      {/* Probe leads */}
      <path d="M102 146 Q150 70 203 70" fill="none" className="stroke-ink" strokeWidth={2} />
      <path d="M52 146 Q80 214 206 190" fill="none" className="stroke-red-400" strokeWidth={2} />
      <text x={150} y={132} className="fill-ink" fontSize={10.5}>black</text>
      <text x={112} y={214} className="fill-red-400" fontSize={10.5}>red</text>
    </svg>
  );
}
