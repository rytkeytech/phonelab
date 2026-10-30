/*
 * Educational illustration of chip resistor marking codes, following Yageo's
 * marking rules. Chips are enlarged and not to scale.
 */

const examples = [
  { code: "103", reads: "10 + three zeros", value: "10 kΩ" },
  { code: "4702", reads: "470 + two zeros", value: "47 kΩ" },
  { code: "6R8", reads: "R is the decimal point", value: "6.8 Ω" },
  { code: "0", reads: "jumper", value: "0 Ω link" },
];

const CHIP_W = 104;
const CHIP_H = 46;
const CAP = 15;

function Chip({ x, y, code }: { x: number; y: number; code?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={CHIP_W} height={CHIP_H} rx={3} className="fill-raised stroke-line-strong" strokeWidth={1.5} />
      <rect x={x} y={y} width={CAP} height={CHIP_H} rx={2} className="fill-muted/40" />
      <rect x={x + CHIP_W - CAP} y={y} width={CAP} height={CHIP_H} rx={2} className="fill-muted/40" />
      {code && (
        <text x={x + CHIP_W / 2} y={y + 30} textAnchor="middle" className="fill-ink font-mono" fontSize={18}>
          {code}
        </text>
      )}
    </g>
  );
}

export function ResistorMarkingDiagram() {
  return (
    <svg viewBox="0 0 440 310" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="rm-title">
      <title id="rm-title">
        Chip resistor codes. 103 means 10 followed by three zeros, which is 10 kilohms. 4702 means 470 followed by two
        zeros, which is 47 kilohms. 6R8 means 6.8 ohms, because R marks the decimal point. A single 0 is a 0 ohm jumper.
        Sizes 0402 and 0201 have no marking, so the value comes from the schematic.
      </title>

      {examples.map((e, i) => {
        const x = i % 2 === 0 ? 20 : 240;
        const y = i < 2 ? 12 : 112;
        return (
          <g key={e.code}>
            <Chip x={x} y={y} code={e.code} />
            <text x={x + CHIP_W + 12} y={y + 21} className="fill-ink font-semibold" fontSize={14}>
              {e.value}
            </text>
            <text x={x} y={y + CHIP_H + 19} className="fill-muted" fontSize={11.5}>
              {e.reads}
            </text>
          </g>
        );
      })}

      <line x1={10} y1={204} x2={430} y2={204} className="stroke-line" />
      <Chip x={20} y={222} />
      <text x={136} y={240} className="fill-ink font-semibold" fontSize={14}>
        No marking
      </text>
      <text x={136} y={259} className="fill-muted" fontSize={11.5}>
        0402 and smaller: too small to print on.
      </text>
      <text x={136} y={276} className="fill-muted" fontSize={11.5}>
        The value comes from the schematic or boardview.
      </text>
    </svg>
  );
}
