import { ProcessFlow } from "./ProcessFlow";

/*
 * Process flow for a suspected clock or reset fault, matching the order in
 * the lesson: rule out supplies before blaming clocks and reset.
 */

const steps = [
  { title: "Confirm the symptom", detail: "Bench supply current pattern", side: null },
  { title: "Supplies present?", detail: "Rails the clock / reset circuits need", side: "No → fix the supply first" },
  { title: "Inspect clock parts", detail: "Cracks, corrosion, load capacitors", side: "Damage → strong suspect" },
  { title: "Reset line state", detail: "Held or released, vs the schematic", side: "Stuck → find its driver" },
  { title: "Check the clock itself", detail: "Oscilloscope at a buffered output", side: "A meter can't prove it" },
  { title: "Replace, then retest", detail: "Correct part; full power-on", side: null },
];

export function ClockFaultFlowDiagram() {
  return <ProcessFlow id="cf" label="Process flow for a suspected clock or reset fault" steps={steps} boxClass="stroke-clock" numberClass="fill-clock" />;
}
