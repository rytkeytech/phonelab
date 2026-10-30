/*
 * Educational illustration of input logic levels, drawn to scale from the
 * SN74LVC1G04 datasheet limits at a 1.8 V and a 3.3 V supply. One example
 * gate only; other chips have their own limits.
 */

const BASE = 262; // y of 0 V
const SCALE = 66; // pixels per volt
const BAR_W = 92;
const y = (volts: number) => BASE - volts * SCALE;

const bars = [
  { x: 96, title: "1.8 V supply", top: 1.8, high: 1.17, low: 0.63, labels: ["1.8 V", "1.17 V", "0.63 V"] },
  { x: 300, title: "3.3 V supply", top: 3.3, high: 2, low: 0.8, labels: ["3.3 V", "2 V", "0.8 V"] },
];

export function LogicLevelsDiagram() {
  return (
    <svg viewBox="0 0 440 290" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="ll-title">
      <title id="ll-title">
        Input limits for one example logic gate, to scale. At a 1.8 volt supply, low is up to 0.63 volts, high is from 1.17
        volts, and the gap between is undefined. At a 3.3 volt supply, low is up to 0.8 volts, high is from 2 volts, and the
        gap between is undefined.
      </title>

      {bars.map((b) => {
        const [supply, highLabel, lowLabel] = b.labels;
        const cx = b.x + BAR_W / 2;
        return (
          <g key={b.title}>
            <text x={cx} y={y(b.top) - 10} textAnchor="middle" className="fill-ink font-semibold" fontSize={13}>
              {b.title}
            </text>

            <rect x={b.x} y={y(b.top)} width={BAR_W} height={(b.top - b.high) * SCALE} className="fill-clock/25 stroke-clock" strokeWidth={1.5} />
            <rect x={b.x} y={y(b.high)} width={BAR_W} height={(b.high - b.low) * SCALE} className="fill-caution/15 stroke-caution" strokeWidth={1.5} strokeDasharray="5 4" />
            <rect x={b.x} y={y(b.low)} width={BAR_W} height={b.low * SCALE} className="fill-data/20 stroke-data" strokeWidth={1.5} />

            <text x={cx} y={(y(b.top) + y(b.high)) / 2 + 4} textAnchor="middle" className="fill-clock font-semibold" fontSize={12}>
              HIGH
            </text>
            <text x={cx} y={(y(b.high) + y(b.low)) / 2 + 4} textAnchor="middle" className="fill-caution" fontSize={11.5}>
              undefined
            </text>
            <text x={cx} y={(y(b.low) + BASE) / 2 + 4} textAnchor="middle" className="fill-data font-semibold" fontSize={12}>
              LOW
            </text>

            <g className="fill-muted" fontSize={10.5} textAnchor="end">
              <text x={b.x - 6} y={y(b.top) + 4}>{supply}</text>
              <text x={b.x - 6} y={y(b.high) + 4}>{highLabel}</text>
              <text x={b.x - 6} y={y(b.low) + 4}>{lowLabel}</text>
              <text x={b.x - 6} y={BASE + 4}>0 V</text>
            </g>
          </g>
        );
      })}
      <text x={220} y={283} textAnchor="middle" className="fill-faint" fontSize={10.5}>
        Limits for one example gate. Other chips differ.
      </text>
    </svg>
  );
}
