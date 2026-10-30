/*
 * Educational illustration of an LDO's output against its input, after the
 * shape in TI SLVA079 Figure 2. Deliberately carries no values, because the
 * turn-on point and dropout differ for every part and load.
 */

const X0 = 62;
const X1 = 416;
const BASE = 214;
const SET = 76; // y of the regulated output
const OFF = 138; // x where the LDO starts working
const KNEE = 244; // x where it starts regulating

export function LdoDropoutDiagram() {
  return (
    <svg viewBox="0 0 440 268" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="ld-title">
      <title id="ld-title">
        Graph of LDO output voltage against input voltage. At very low input the LDO is off and the output is zero. In the
        dropout region the output follows the input. Once the input is above the set output by the dropout voltage, the output
        stays flat at its set value.
      </title>

      {/* Region shading */}
      <rect x={OFF} y={28} width={KNEE - OFF} height={BASE - 28} className="fill-caution/10" />
      <rect x={KNEE} y={28} width={X1 - KNEE} height={BASE - 28} className="fill-clock/10" />

      {/* Axes */}
      <line x1={X0} y1={22} x2={X0} y2={BASE} className="stroke-muted" strokeWidth={2} />
      <line x1={X0} y1={BASE} x2={X1} y2={BASE} className="stroke-muted" strokeWidth={2} />
      <text x={(X0 + X1) / 2} y={250} textAnchor="middle" className="fill-muted" fontSize={12}>
        Input voltage
      </text>
      <text x={18} y={118} textAnchor="middle" className="fill-muted" fontSize={12} transform="rotate(-90 18 118)">
        Output voltage
      </text>

      {/* Set output and the input = output line */}
      <line x1={X0} y1={SET} x2={X1} y2={SET} className="stroke-line-strong" strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={X0 + 6} y={SET - 7} className="fill-muted" fontSize={11}>
        set output
      </text>

      {/* The response */}
      <path d={`M${X0} ${BASE} L${OFF} ${BASE} L${OFF} 156 L${KNEE} ${SET} L${X1} ${SET}`} fill="none" className="stroke-power" strokeWidth={3} strokeLinejoin="round" />

      {/* Region labels */}
      <text x={(X0 + OFF) / 2} y={190} textAnchor="middle" className="fill-muted" fontSize={12}>
        Off
      </text>
      <text x={(OFF + KNEE) / 2} y={44} textAnchor="middle" className="fill-caution font-semibold" fontSize={12}>
        Dropout
      </text>
      <text x={(OFF + KNEE) / 2 + 12} y={156} textAnchor="middle" className="fill-caution" fontSize={10.5}>
        output follows
      </text>
      <text x={(OFF + KNEE) / 2 + 12} y={170} textAnchor="middle" className="fill-caution" fontSize={10.5}>
        the input
      </text>
      <text x={(KNEE + X1) / 2} y={44} textAnchor="middle" className="fill-clock font-semibold" fontSize={12}>
        Regulating
      </text>
      <text x={(KNEE + X1) / 2} y={104} textAnchor="middle" className="fill-clock" fontSize={10.5}>
        output holds steady
      </text>
    </svg>
  );
}
