import type { GameScenario } from "@/lib/types";
import { deadAfterCharge } from "./case-dead-after-charge";

/*
 * SIMULATED diagnostic scenarios.
 *
 * The devices are imaginary and every reading is simulated for training.
 * Readings are described in words rather than invented values, so nothing
 * here can be mistaken for a measurement from a real phone.
 */

export const scenarios: GameScenario[] = [
  deadAfterCharge,
  {
    id: "logo-loop",
    title: "Stuck at the logo",
    symptom: "Boot loop after a drop",
    difficulty: "intermediate",
    brief: "“I dropped it on the floor yesterday. Now it shows the logo, goes black, shows the logo again, over and over.”",
    device: "Simulated Android phone with stacked memory. Not a real model.",
    steps: [
      {
        id: "start",
        prompt: "The phone loops at the logo. Where do you start?",
        choices: [
          {
            id: "screen",
            label: "Replace the screen",
            quality: "poor",
            feedback: "The logo displays correctly, so the screen works. The problem is that boot never finishes.",
          },
          {
            id: "current",
            label: "Watch the current on a bench supply during the boot attempts",
            quality: "ok",
            feedback: "It confirms a boot loop, but you already knew that. Ruling out firmware first is quicker.",
            finding: "Current rises and varies as if booting, then drops, and the cycle repeats.",
            reading: {
              label: "Bench supply current",
              value: "Rises and varies, drops back, repeats",
            },
          },
          {
            id: "firmware",
            label: "Confirm the exact model, explain that flashing usually erases user data and get the customer's agreement, then flash the correct firmware",
            quality: "best",
            feedback: "Firmware is the cheapest cause to rule out, and it doesn't require opening the phone. Flashing usually wipes photos and other data, so the customer must agree first.",
            finding: "Flashing completes, but the phone still loops at the logo.",
          },
        ],
      },
      {
        id: "evidence",
        prompt: "Correct firmware didn't help. What next?",
        choices: [
          {
            id: "log",
            label: "Read the flashing tool's log from the boot and flash attempts",
            quality: "best",
            feedback: "Tool logs often show exactly which stage fails.",
            finding: "The log reports a memory initialisation error.",
            reading: {
              label: "Flashing tool log",
              value: "Memory initialisation error",
            },
          },
          {
            id: "battery",
            label: "Replace the battery",
            quality: "poor",
            feedback: "Not yet. A worn battery can sag under boot load and cause restarts, so it isn't ruled out. But running the phone from a bench supply tests that more cheaply than swapping the battery, and the tool log would tell you more.",
          },
          {
            id: "microscope",
            label: "Inspect the board under a microscope for drop damage",
            quality: "ok",
            feedback: "Worth doing after a drop, but the tool log would have told you more.",
            finding: "No visible damage around the SoC or memory.",
          },
        ],
      },
      {
        id: "memory-error",
        prompt: "The tool reports a memory initialisation error. What do you check before blaming the RAM?",
        choices: [
          {
            id: "replace-ram",
            label: "Replace the RAM immediately",
            quality: "poor",
            feedback: "A memory error doesn't prove the RAM is faulty. Wrong loaders, missing supplies and solder faults can cause the same error.",
          },
          {
            id: "loader-and-rails",
            label: "Confirm the loader matches the exact model, then check the RAM supply rails against the schematic or a known-good board",
            quality: "best",
            feedback: "This rules out the common non-RAM causes first.",
            finding: "Loader confirmed correct. RAM supply rails are present and comparable to the known-good board.",
            reading: {
              label: "RAM supply rails during boot attempt",
              value: "Present",
              reference: "Known-good board: present and comparable",
            },
          },
          {
            id: "blast-heat",
            label: "Heat the SoC and memory with hot air to 'reflow' them, without preparation",
            quality: "unsafe",
            feedback: "Unprepared heating can damage the SoC, memory and nearby parts, and makes later repair harder. Reflow and reballing are advanced, planned procedures.",
          },
        ],
      },
      {
        id: "conclude",
        prompt: "Firmware, loader and supplies are ruled out. What's your conclusion?",
        choices: [
          {
            id: "software",
            label: "It's software corruption",
            quality: "poor",
            feedback: "You already flashed the correct firmware with the correct loader.",
          },
          {
            id: "solder-hypothesis",
            label: "Suspected cracked solder joints under the stacked memory from the drop. Record it as a hypothesis and offer an advanced memory rework, explaining the risk",
            quality: "best",
            feedback: "Exactly right: the evidence fits, but it isn't confirmed until the rework is done and the phone boots. Be honest with the customer about risk.",
          },
          {
            id: "pmic",
            label: "The PMIC is faulty",
            quality: "poor",
            feedback: "The RAM supplies were present and the phone starts booting every cycle. Nothing points at the PMIC.",
          },
        ],
      },
    ],
    debrief: {
      rootCause: "In this simulation, the drop most likely cracked solder joints under the stacked memory. It stays a hypothesis until the rework confirms it.",
      lessons: [
        "Rule out firmware first. It's cheap and doesn't need the phone opened.",
        "Tool logs show where boot fails.",
        "A memory initialisation error is not proof that the RAM is faulty.",
        "Label conclusions honestly: a likely cause is a hypothesis until it's confirmed.",
      ],
    },
    relatedLessonIds: ["boot/what-happens-when-you-press-power", "power/dc-power-supply-current-draw"],
    relatedBlocks: ["ram", "storage", "soc"],
  },
  {
    id: "no-wifi",
    title: "Wi-Fi won't switch on",
    symptom: "Wi-Fi toggle greyed out",
    difficulty: "advanced",
    brief: "“It fell out of my pocket on the bus. Everything works except Wi-Fi: the switch is greyed out. Bluetooth won't turn on either.”",
    device: "Simulated Android phone. In this simulation the Wi-Fi/Bluetooth IC has its own crystal. Real designs vary.",
    steps: [
      {
        id: "start",
        prompt: "Wi-Fi and Bluetooth won't turn on. Where do you start?",
        choices: [
          {
            id: "software",
            label: "Restart, reset network settings and update the software",
            quality: "best",
            feedback: "Rule out software before opening the phone.",
            finding: "No change. Wi-Fi is still greyed out.",
          },
          {
            id: "sim",
            label: "Replace the SIM card",
            quality: "poor",
            feedback: "The SIM is for cellular service. It has nothing to do with Wi-Fi or Bluetooth.",
          },
          {
            id: "mac",
            label: "Check whether the Wi-Fi MAC address shows in the phone's status information",
            quality: "ok",
            feedback: "A useful clue, but do the simple software resets first.",
            finding: "The Wi-Fi MAC address shows as unavailable.",
          },
        ],
      },
      {
        id: "supply",
        prompt: "Software checks didn't help. What next?",
        choices: [
          {
            id: "antenna",
            label: "Replace the Wi-Fi antenna",
            quality: "poor",
            feedback: "A bad antenna usually gives weak signal, not a greyed-out switch. A greyed switch suggests the Wi-Fi IC, or the software that starts it, isn't starting. You've ruled out the simple software causes, so check what the IC needs.",
          },
          {
            id: "supply",
            label: "With the phone on, check the Wi-Fi/Bluetooth IC's supply against the schematic",
            quality: "best",
            feedback: "An IC needs power before anything else. Checking against the schematic means you compare with the right expected value.",
            finding: "The supply is present and matches the known-good board.",
            reading: {
              label: "Wi-Fi/Bluetooth IC supply",
              value: "Present",
              reference: "Known-good board: present and comparable",
            },
          },
          {
            id: "inspect",
            label: "Inspect the Wi-Fi area under a microscope",
            quality: "ok",
            feedback: "Reasonable after a drop, but electrical checks are more conclusive here.",
            finding: "Nothing obviously damaged at first glance.",
          },
        ],
      },
      {
        id: "clock",
        prompt: "The supply is present. What do you check next?",
        choices: [
          {
            id: "multimeter-clock",
            label: "Measure the clock line with a multimeter on DC voltage",
            quality: "poor",
            feedback: "A multimeter can't confirm that a clock is oscillating correctly. Use an oscilloscope.",
          },
          {
            id: "remove-ic",
            label: "Remove the Wi-Fi IC to inspect underneath",
            quality: "poor",
            feedback: "Too early and risky. You haven't checked whether the IC is getting everything it needs.",
          },
          {
            id: "scope-clock",
            label: "Check the Wi-Fi IC's clock with an oscilloscope",
            quality: "best",
            feedback: "Power, clock and reset are what an IC needs to start. Power is confirmed; the clock and the reset line are both still open. Here you start with the clock.",
            finding: "There is no clock signal at the Wi-Fi IC.",
            reading: {
              label: "Oscilloscope, Wi-Fi IC clock input",
              value: "No oscillation: flat line",
              reference: "Known-good board: steady clock signal",
            },
          },
        ],
      },
      {
        id: "source",
        prompt: "No clock at the Wi-Fi IC. What now?",
        choices: [
          {
            id: "crystal",
            label: "Inspect and test the crystal that feeds it. Drops can crack crystals",
            quality: "best",
            feedback: "Follow the missing signal back to its source.",
            finding: "A hairline crack is visible on the crystal under the microscope.",
          },
          {
            id: "replace-ic",
            label: "Replace the Wi-Fi IC",
            quality: "poor",
            feedback: "Without a clock, even a new IC won't start. Check where the clock comes from first.",
          },
        ],
      },
      {
        id: "conclude",
        prompt: "What's your conclusion and repair plan?",
        choices: [
          {
            id: "ic-failed",
            label: "The Wi-Fi IC has failed",
            quality: "poor",
            feedback: "The IC has power but no clock, and you found a cracked crystal. The evidence points at the crystal.",
          },
          {
            id: "crystal-repair",
            label: "The cracked crystal is the likely cause. Replace it with the correct part, confirm the clock is now present at the IC, then verify Wi-Fi and Bluetooth",
            quality: "best",
            feedback: "Power present, no clock, and a visibly cracked crystal: the evidence points strongly at the crystal. Seeing the clock return after the replacement confirms it. If the clock returns but Wi-Fi still won't start, check the reset line next. Verifying both Wi-Fi and Bluetooth confirms the shared IC is working again.",
          },
          {
            id: "software-again",
            label: "It's a software fault; reflash the phone",
            quality: "poor",
            feedback: "Software was ruled out at the start, and you found a physical fault.",
          },
        ],
      },
    ],
    debrief: {
      rootCause: "In this simulation, the drop cracked the crystal feeding the Wi-Fi/Bluetooth IC, so the IC had power but no clock. The clock returning after the crystal was replaced confirmed it.",
      lessons: [
        "A greyed-out Wi-Fi switch suggests the Wi-Fi IC or its software isn't starting, not a weak antenna. Rule out software first.",
        "An IC needs power, clock and reset. Check each one; finding a fault in one doesn't clear the others.",
        "A multimeter can't confirm a clock. Use an oscilloscope.",
        "Follow a missing signal back to its source before replacing the IC that needs it.",
        "Confirm the cause after the repair: the clock should be present again before you test Wi-Fi.",
      ],
    },
    relatedLessonIds: ["clocks/crystals-and-oscillators", "clocks/diagnosing-clock-faults"],
    relatedBlocks: ["connectivity", "clock"],
  },
];
