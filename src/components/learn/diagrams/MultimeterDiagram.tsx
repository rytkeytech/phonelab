/*
 * Educational illustration of a generic digital multimeter: the modes used in
 * board repair, whether each needs the board powered, and which jack the red
 * lead goes in. Not any particular meter; dial layouts vary.
 */

const CX = 112;
const CY = 178;
const R = 58;

// Dial positions, clockwise from the top. Angles in degrees, 0 = up.
const positions = [
  { label: "OFF", angle: -70 },
  { label: "V⎓", angle: -25, selected: true },
  { label: "Ω", angle: 20 },
  { label: "•)))", angle: 65 },
  { label: "→|", angle: 110 },
  { label: "A", angle: 155 },
];

const modes = [
  { symbol: "V⎓", name: "DC voltage", when: "Board powered", tone: "fill-power" },
  { symbol: "Ω", name: "Resistance", when: "Board unpowered", tone: "fill-data" },
  { symbol: "•)))", name: "Continuity", when: "Board unpowered", tone: "fill-data" },
  { symbol: "→|", name: "Diode mode", when: "Board unpowered", tone: "fill-data" },
  { symbol: "A", name: "Current", when: "In series, red lead in A", tone: "fill-red-400" },
];

const polar = (angle: number, radius: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: CX + radius * Math.sin(rad), y: CY - radius * Math.cos(rad) };
};

export function MultimeterDiagram() {
  const pointer = polar(-25, R - 18);
  return (
    <svg viewBox="0 0 440 380" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="mm-title">
      <title id="mm-title">
        Educational illustration of a generic multimeter set to DC voltage. DC voltage is measured with the board powered.
        Resistance, continuity and diode mode need the board unpowered. Current is measured in series with the red lead
        moved to the A jack. The black lead always stays in COM.
      </title>

      {/* Meter body */}
      <rect x={20} y={14} width={184} height={350} rx={18} className="fill-raised stroke-line-strong" strokeWidth={1.5} />
      <rect x={38} y={32} width={148} height={56} rx={6} className="fill-canvas stroke-line" />
      <text x={112} y={68} textAnchor="middle" className="fill-accent font-mono" fontSize={22}>
        – –.– –
      </text>
      <text x={176} y={50} textAnchor="end" className="fill-muted font-mono" fontSize={10}>
        DC
      </text>

      {/* Rotary dial */}
      <circle cx={CX} cy={CY} r={R - 22} className="fill-surface stroke-line-strong" strokeWidth={2} />
      <line x1={CX} y1={CY} x2={pointer.x} y2={pointer.y} className="stroke-power" strokeWidth={4} strokeLinecap="round" />
      {positions.map((p) => {
        const pos = polar(p.angle, R + 6);
        return (
          <text
            key={p.label}
            x={pos.x}
            y={pos.y + 5}
            textAnchor="middle"
            className={p.selected ? "fill-power font-semibold" : "fill-muted"}
            fontSize={p.selected ? 15 : 13}
          >
            {p.label}
          </text>
        );
      })}

      {/* Jacks */}
      {[
        { label: "A", x: 52, ring: "stroke-red-400" },
        { label: "COM", x: 112, ring: "stroke-ink" },
        { label: "VΩ→|", x: 172, ring: "stroke-red-400" },
      ].map((j) => (
        <g key={j.label}>
          <circle cx={j.x} cy={300} r={13} className={`fill-canvas ${j.ring}`} strokeWidth={2.5} />
          <circle cx={j.x} cy={300} r={5} className="fill-line-strong" />
          <text x={j.x} y={334} textAnchor="middle" className="fill-muted font-mono" fontSize={11}>
            {j.label}
          </text>
        </g>
      ))}
      <text x={112} y={354} textAnchor="middle" className="fill-faint" fontSize={10.5}>
        black: COM · red: VΩ (or A for current)
      </text>

      {/* Mode guide */}
      <text x={226} y={40} className="fill-ink font-semibold" fontSize={14}>
        Mode · board state
      </text>
      {modes.map((m, i) => {
        const y = 74 + i * 56;
        return (
          <g key={m.name}>
            <rect x={222} y={y - 20} width={206} height={46} rx={8} className="fill-surface stroke-line" />
            <text x={238} y={y + 8} className={`${m.tone} font-semibold`} fontSize={15}>
              {m.symbol}
            </text>
            <text x={282} y={y} className="fill-ink" fontSize={13}>
              {m.name}
            </text>
            <text x={282} y={y + 17} className="fill-muted" fontSize={11.5}>
              {m.when}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
