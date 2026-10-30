import type { LessonDiagramId } from "@/lib/types";
import { BootSequenceDiagram } from "./BootSequenceDiagram";
import { CircuitStatesDiagram } from "./CircuitStatesDiagram";
import { ClockFaultFlowDiagram } from "./ClockFaultFlowDiagram";
import { CrystalCircuitDiagram } from "./CrystalCircuitDiagram";
import { CrystalOscillatorDiagram } from "./CrystalOscillatorDiagram";
import { CurrentPatternsDiagram } from "./CurrentPatternsDiagram";
import { DiodeModeDiagram } from "./DiodeModeDiagram";
import { KeyLadderDiagram } from "./KeyLadderDiagram";
import { LdoBlockDiagram } from "./LdoBlockDiagram";
import { LdoDropoutDiagram } from "./LdoDropoutDiagram";
import { LdoFaultFlowDiagram } from "./LdoFaultFlowDiagram";
import { LogicLevelsDiagram } from "./LogicLevelsDiagram";
import { MeasurementSetupDiagram } from "./MeasurementSetupDiagram";
import { MultimeterDiagram } from "./MultimeterDiagram";
import { OpenDrainBusDiagram } from "./OpenDrainBusDiagram";
import { ParallelOnBoardDiagram } from "./ParallelOnBoardDiagram";
import { PowerPathDiagram } from "./PowerPathDiagram";
import { PullResistorsDiagram } from "./PullResistorsDiagram";
import { ResetTimingDiagram } from "./ResetTimingDiagram";
import { ResistorJobsDiagram } from "./ResistorJobsDiagram";
import { ResistorMarkingDiagram } from "./ResistorMarkingDiagram";
import { RtcDividerDiagram } from "./RtcDividerDiagram";
import { SeriesParallelDiagram } from "./SeriesParallelDiagram";
import { VoltageDividerDiagram } from "./VoltageDividerDiagram";
import { WatchdogDiagram } from "./WatchdogDiagram";

/**
 * What kind of visual a diagram is. Shown on every figure, so an illustration
 * is never mistaken for a real schematic, and a redrawn schematic names its source.
 */
export type DiagramKind = "illustration" | "conceptual" | "flow" | "redrawn";

export const diagramKindLabel: Record<DiagramKind, string> = {
  illustration: "Educational illustration",
  conceptual: "Conceptual diagram",
  flow: "Process flow",
  redrawn: "Redrawn from a published schematic",
};

export const lessonDiagrams: Record<LessonDiagramId, { Diagram: () => React.ReactNode; kind: DiagramKind; source?: string }> = {
  "power-path": { Diagram: PowerPathDiagram, kind: "conceptual" },
  "boot-sequence": { Diagram: BootSequenceDiagram, kind: "flow" },
  "diode-mode": { Diagram: DiodeModeDiagram, kind: "illustration" },
  "circuit-states": { Diagram: CircuitStatesDiagram, kind: "illustration" },
  multimeter: { Diagram: MultimeterDiagram, kind: "illustration" },
  "measurement-setup": { Diagram: MeasurementSetupDiagram, kind: "illustration" },
  "current-patterns": { Diagram: CurrentPatternsDiagram, kind: "illustration" },
  "crystal-oscillator": { Diagram: CrystalOscillatorDiagram, kind: "conceptual" },
  "rtc-divider": { Diagram: RtcDividerDiagram, kind: "illustration" },
  "reset-timing": { Diagram: ResetTimingDiagram, kind: "conceptual" },
  watchdog: { Diagram: WatchdogDiagram, kind: "flow" },
  "clock-fault-flow": { Diagram: ClockFaultFlowDiagram, kind: "flow" },
  "resistor-jobs": { Diagram: ResistorJobsDiagram, kind: "illustration" },
  "resistor-marking": { Diagram: ResistorMarkingDiagram, kind: "illustration" },
  "series-parallel": { Diagram: SeriesParallelDiagram, kind: "illustration" },
  "parallel-on-board": { Diagram: ParallelOnBoardDiagram, kind: "illustration" },
  "voltage-divider": { Diagram: VoltageDividerDiagram, kind: "illustration" },
  "key-ladder": { Diagram: KeyLadderDiagram, kind: "redrawn", source: "PinePhone v1.2b, sheet 12" },
  "logic-levels": { Diagram: LogicLevelsDiagram, kind: "illustration" },
  "pull-resistors": { Diagram: PullResistorsDiagram, kind: "illustration" },
  "open-drain-bus": { Diagram: OpenDrainBusDiagram, kind: "illustration" },
  "ldo-block": { Diagram: LdoBlockDiagram, kind: "conceptual" },
  "ldo-dropout": { Diagram: LdoDropoutDiagram, kind: "illustration" },
  "ldo-fault-flow": { Diagram: LdoFaultFlowDiagram, kind: "flow" },
  "crystal-circuit": { Diagram: CrystalCircuitDiagram, kind: "redrawn", source: "PinePhone v1.2b, sheet 5" },
};
