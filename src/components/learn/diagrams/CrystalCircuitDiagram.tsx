import { CapacitorH, CrystalV, Ground, Node, ResistorH, ResistorV, Wire } from "./CircuitSymbols";

/*
 * Redrawn from the PinePhone v1.2b schematic, sheet 5 (OSC-RTC and the 24 MHz
 * crystal). The net names, part numbers and values are from that sheet and
 * apply to that phone only.
 */

export function CrystalCircuitDiagram() {
  return (
    <svg viewBox="0 0 440 268" className="mx-auto w-full max-w-lg" role="img" aria-labelledby="cc-title">
      <title id="cc-title">
        Two crystals from the PinePhone schematic. Left: the 32.768 kilohertz crystal X500 between the X32KI and X32KO lines,
        with a 10 megohm resistor R500 across it and an 18 picofarad capacitor from each line to ground. Right: the 24 megahertz
        crystal X501 in a four-pad package with pads for XIN, XOUT and two grounds, an 18 picofarad capacitor from each signal
        to ground, and a 0 ohm resistor R502 in series with the X24MO line.
      </title>

      {/* ---- 32.768 kHz ---- */}
      <text x={106} y={22} textAnchor="middle" className="fill-ink font-semibold" fontSize={13.5}>
        32.768 kHz (X500)
      </text>
      <text x={12} y={58} className="fill-clock" fontSize={11}>
        X32KI
      </text>
      <text x={12} y={194} className="fill-clock" fontSize={11}>
        X32KO
      </text>
      <Wire points={[[48, 54], [136, 54]]} className="stroke-clock" />
      <Wire points={[[48, 190], [136, 190]]} className="stroke-clock" />

      <Wire points={[[78, 54], [78, 102]]} />
      <CrystalV x={78} y={102} />
      <Wire points={[[78, 142], [78, 190]]} />
      <Node x={78} y={54} />
      <Node x={78} y={190} />
      <text x={62} y={126} textAnchor="end" className="fill-ink" fontSize={10.5}>
        crystal
      </text>

      <Wire points={[[122, 54], [122, 98]]} />
      <ResistorV x={122} y={98} />
      <Wire points={[[122, 146], [122, 190]]} />
      <Node x={122} y={54} />
      <Node x={122} y={190} />
      <text x={134} y={116} className="fill-ink" fontSize={10.5}>
        R500
      </text>
      <text x={134} y={130} className="fill-ink" fontSize={10.5}>
        10 MΩ
      </text>

      <CapacitorH x={136} y={54} />
      <CapacitorH x={136} y={190} />
      <text x={151} y={36} textAnchor="middle" className="fill-muted" fontSize={10.5}>
        C507 18 pF
      </text>
      <text x={151} y={216} textAnchor="middle" className="fill-muted" fontSize={10.5}>
        C508 18 pF
      </text>
      <Wire points={[[166, 54], [190, 54], [190, 190], [166, 190]]} className="stroke-muted" />
      <Wire points={[[190, 190], [190, 226]]} className="stroke-muted" />
      <Ground x={190} y={226} />

      <line x1={218} y1={10} x2={218} y2={258} className="stroke-line" />

      {/* ---- 24 MHz ---- */}
      <text x={330} y={22} textAnchor="middle" className="fill-ink font-semibold" fontSize={13.5}>
        24 MHz (X501)
      </text>
      <text x={228} y={58} className="fill-clock" fontSize={11}>
        X24MI
      </text>
      <text x={228} y={194} className="fill-clock" fontSize={11}>
        X24MO
      </text>
      <Wire points={[[270, 54], [372, 54]]} className="stroke-clock" />
      <Wire points={[[270, 190], [284, 190]]} className="stroke-clock" />

      {/* Package */}
      <rect x={288} y={92} width={86} height={62} rx={4} className="fill-raised stroke-ink" strokeWidth={1.5} />
      <text x={331} y={86} textAnchor="middle" className="fill-faint" fontSize={10}>
        X3225, 4 pads
      </text>
      <text x={296} y={114} className="fill-ink" fontSize={10.5}>
        1 XIN
      </text>
      <text x={296} y={142} className="fill-muted" fontSize={10.5}>
        2 GND
      </text>
      <text x={366} y={114} textAnchor="end" className="fill-muted" fontSize={10.5}>
        GND 4
      </text>
      <text x={366} y={142} textAnchor="end" className="fill-ink" fontSize={10.5}>
        XOUT 3
      </text>
      <Wire points={[[278, 54], [278, 110], [288, 110]]} />
      <Node x={278} y={54} />
      {/* Pad 2 to ground */}
      <Wire points={[[288, 138], [278, 138], [278, 164]]} className="stroke-muted" />
      <Ground x={278} y={164} />
      {/* Pad 4 to ground */}
      <Wire points={[[374, 110], [418, 110]]} className="stroke-muted" />
      <Node x={418} y={110} className="fill-muted" />
      {/* Pad 3 back to the output side */}
      <Wire points={[[374, 138], [386, 138], [386, 190]]} />

      {/* X24MO runs through R502 to pad 3 */}
      <ResistorH x={284} y={190} />
      <Wire points={[[332, 190], [376, 190]]} />
      <Node x={386} y={190} />
      <Wire points={[[376, 190], [386, 190]]} />
      <text x={308} y={214} textAnchor="middle" className="fill-muted" fontSize={10.5}>
        R502 0 Ω
      </text>

      {/* Load capacitors to the shared ground */}
      <CapacitorH x={372} y={54} />
      <Wire points={[[386, 190], [388, 190]]} />
      <CapacitorH x={388} y={190} className="stroke-ink/70" />
      <text x={392} y={36} textAnchor="middle" className="fill-muted" fontSize={10.5}>
        C521 18 pF
      </text>
      <text x={410} y={216} textAnchor="end" className="fill-muted" fontSize={10.5}>
        C531 18 pF
      </text>
      <Wire points={[[402, 54], [418, 54], [418, 190]]} className="stroke-muted" />
      <Wire points={[[418, 190], [418, 226]]} className="stroke-muted" />
      <Ground x={418} y={226} />
    </svg>
  );
}
