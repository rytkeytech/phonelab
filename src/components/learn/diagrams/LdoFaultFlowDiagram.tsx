import { ProcessFlow } from "./ProcessFlow";

/*
 * Process flow for a missing or low LDO rail, matching the order in the
 * lesson: the LDO itself is the last thing suspected.
 */

const steps = [
  { title: "Should it be on?", detail: "Same state on a known-good board", side: "Off there too → normal" },
  { title: "Input present?", detail: "Measure the LDO's supply", side: "No → work backwards" },
  { title: "Enabled?", detail: "Enable pin, or software on a PMIC", side: "No → find out why" },
  { title: "Rail shorted?", detail: "Power off, diode mode on its capacitor", side: "Yes → find the short" },
  { title: "Load the cause?", detail: "Disconnect the module and retest", side: "Rail back → load fault" },
  { title: "Suspect the LDO", detail: "On a PMIC, that means the whole chip", side: null },
];

export function LdoFaultFlowDiagram() {
  return <ProcessFlow id="lf" label="Process flow for a missing or low LDO rail" steps={steps} boxClass="stroke-power" numberClass="fill-power" />;
}
