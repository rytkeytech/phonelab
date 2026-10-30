import { Ground, KeyV, Node, ResistorH, Supply, Wire } from "./CircuitSymbols";

/*
 * Redrawn from the PinePhone v1.2b schematic, sheet 12 (KEY block). The keys
 * are on a flex that the schematic doesn't show, so they're drawn dashed off.
 * The voltages are calculated from the schematic values, not measured.
 */

const LINE = 104;
const ADC = 122;
const PLUS = 234;
const MINUS = 352;

export function KeyLadderDiagram() {
  return (
    <svg viewBox="0 0 440 278" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="kl-title">
      <title id="kl-title">
        Two volume keys on one wire. ALDO3 feeds a 100 kilohm resistor to the KEYADC node, which goes to the SoC. From
        there a 6.8 kilohm resistor leads to VOL plus, and an 8.2 kilohm resistor leads on to VOL minus. Each key connects
        its line to ground. Calculated KEYADC voltages: about 3.0 volts with no key, about 0.19 volts with VOL plus, and
        about 0.39 volts with VOL minus.
      </title>

      <Supply x={28} y={70} label="ALDO3" />
      <Wire points={[[28, 70], [28, LINE], [48, LINE]]} />
      <ResistorH x={48} y={LINE} />
      <text x={72} y={LINE + 25} textAnchor="middle" className="fill-muted" fontSize={10.5}>
        R1205 100 kΩ
      </text>
      <Wire points={[[96, LINE], [156, LINE]]} />
      <Node x={ADC} y={LINE} className="fill-data" />
      <Wire points={[[ADC, LINE], [ADC, 38]]} className="stroke-data" />
      <path d={`M${ADC - 6} 46 L${ADC} 36 L${ADC + 6} 46`} fill="none" className="stroke-data" strokeWidth={2} />
      <text x={ADC + 12} y={30} className="fill-data font-semibold" fontSize={12}>
        KEYADC
      </text>
      <text x={ADC + 12} y={46} className="fill-muted" fontSize={11}>
        analog input on the SoC
      </text>

      <ResistorH x={156} y={LINE} />
      <text x={180} y={LINE + 25} textAnchor="middle" className="fill-muted" fontSize={10.5}>
        R1206 6.8 kΩ
      </text>
      <Wire points={[[204, LINE], [272, LINE]]} />
      <Node x={PLUS} y={LINE} />
      <ResistorH x={272} y={LINE} />
      <text x={296} y={LINE + 25} textAnchor="middle" className="fill-muted" fontSize={10.5}>
        R1207 8.2 kΩ
      </text>
      <Wire points={[[320, LINE], [MINUS, LINE]]} />
      <Node x={MINUS} y={LINE} />

      <text x={PLUS} y={LINE - 12} textAnchor="middle" className="fill-ink" fontSize={11.5}>
        VOL+
      </text>
      <text x={MINUS} y={LINE - 12} textAnchor="middle" className="fill-ink" fontSize={11.5}>
        VOL−
      </text>

      {/* Key flex: not on the schematic */}
      <rect x={196} y={146} width={196} height={66} rx={6} fill="none" className="stroke-line-strong" strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={266} y={206} className="fill-faint" fontSize={10}>
        key flex
      </text>
      {[PLUS, MINUS].map((x) => (
        <g key={x}>
          <Wire points={[[x, LINE], [x, 154]]} />
          <KeyV x={x} y={154} />
          <Wire points={[[x, 184], [x, 224]]} />
          <Ground x={x} y={224} />
        </g>
      ))}

      <text x={20} y={252} className="fill-ink font-semibold" fontSize={11.5}>
        KEYADC:
      </text>
      <text x={78} y={252} className="fill-muted" fontSize={11.5}>
        no key about 3.0 V
      </text>
      <text x={196} y={252} className="fill-muted" fontSize={11.5}>
        VOL+ about 0.19 V
      </text>
      <text x={316} y={252} className="fill-muted" fontSize={11.5}>
        VOL− about 0.39 V
      </text>
      <text x={20} y={270} className="fill-faint" fontSize={10.5}>
        Calculated from the schematic values, not measured.
      </text>
    </svg>
  );
}
