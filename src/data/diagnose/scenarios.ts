import type { GameScenario } from "@/lib/types";

/*
 * SIMULATED diagnostic scenarios.
 *
 * The devices are imaginary and every reading is simulated for training.
 * Readings are described in words rather than invented values, so nothing
 * here can be mistaken for a measurement from a real phone.
 */

export const scenarios: GameScenario[] = [
  {
    id: "dead-after-charge",
    title: "The phone that died on the charger",
    symptom: "No power, no response",
    difficulty: "beginner",
    brief: "“I left it charging overnight with a cheap fast charger I bought at the market. In the morning it was completely dead. Nothing happens when I press power or plug it in.”",
    device: "Simulated Android phone. Not a real model.",
    steps: [
      {
        id: "start",
        prompt: "The phone is on your bench. Where do you start?",
        choices: [
          {
            id: "flash",
            label: "Flash new firmware",
            quality: "poor",
            feedback: "The phone shows no sign of life, so a computer won't detect it for flashing. Firmware comes later, once you know the board powers up.",
          },
          {
            id: "history",
            label: "Get the full history and inspect the phone: charger used, liquid, drops, port and battery condition",
            quality: "best",
            feedback: "History and a visual check cost nothing and often point straight at the fault area.",
            finding: "Customer confirms an unbranded fast charger. No liquid or drops reported. The port looks clean and the battery isn't swollen.",
          },
          {
            id: "known-good",
            label: "Try a known-good battery and charger",
            quality: "ok",
            feedback: "A sensible cheap check, but you skipped the history and inspection that could have guided you.",
            finding: "No change with a known-good battery and charger.",
          },
          {
            id: "high-current",
            label: "Apply a high current to the battery connector to 'wake it up'",
            quality: "unsafe",
            feedback: "If something is shorted, high current can burn the board and destroy evidence. Always start with a low current limit.",
          },
        ],
      },
      {
        id: "bench",
        prompt: "Basic checks didn't revive it. What's your next test?",
        choices: [
          {
            id: "press-repeatedly",
            label: "Hold the power key for longer with the charger connected",
            quality: "poor",
            feedback: "You've already confirmed it doesn't respond. Repeating the same action gives no new information.",
          },
          {
            id: "battery-voltage",
            label: "Measure the voltage at the battery connector with a multimeter",
            quality: "ok",
            feedback: "Useful to know power is arriving, but it doesn't show whether something downstream is shorted.",
            finding: "Battery voltage is present at the connector.",
          },
          {
            id: "dc-supply",
            label: "Connect a bench power supply with a low current limit and watch the current before pressing power",
            quality: "best",
            feedback: "The current pattern on a bench supply is one of the fastest ways to narrow down a dead phone.",
            finding: "Current flows the moment the supply is connected, before pressing power.",
            reading: {
              label: "Bench supply current",
              value: "Rises immediately on connection and sits at the current limit you set",
              reference: "A healthy phone draws no significant current before power is pressed",
            },
          },
        ],
      },
      {
        id: "short",
        prompt: "Current flows before the power key is pressed. What does that suggest, and what do you do?",
        choices: [
          {
            id: "raise-limit",
            label: "Raise the current limit until the phone turns on",
            quality: "unsafe",
            feedback: "Current before power-on usually means a short. Raising the limit pushes more energy into it and can damage the board further.",
          },
          {
            id: "pmic-rails",
            label: "Check every PMIC output rail in diode mode",
            quality: "poor",
            feedback: "PMIC rails aren't switched on before the power key is pressed, so they can't explain this current. Look at lines that are always live.",
          },
          {
            id: "main-line",
            label: "Disconnect power and check the main supply line in diode mode",
            quality: "best",
            feedback: "The main supply line is live whenever power is connected, so it's the prime suspect for current before power-on.",
            finding: "The main supply line is shorted to ground.",
            reading: {
              label: "Diode mode, main supply line to ground",
              value: "Near zero: shorted",
              reference: "Known-good board: clearly not shorted",
            },
          },
        ],
      },
      {
        id: "locate",
        prompt: "The main supply line is shorted. How do you find the faulty part?",
        choices: [
          {
            id: "replace-pmic",
            label: "Replace the PMIC",
            quality: "poor",
            feedback: "That's an expensive guess. Many components sit on the main supply line. Find the shorted one before replacing anything.",
          },
          {
            id: "thermal",
            label: "List parts on the line in the boardview, inject a limited current at a safe voltage for that line, and find the warm part with a thermal camera or rosin",
            quality: "best",
            feedback: "Current injection with low, line-appropriate limits makes the shorted part warm up so you can see it.",
            finding: "The charging IC warms up first.",
            reading: {
              label: "Thermal camera during limited current injection",
              value: "Charging IC is the clear hot spot",
            },
          },
          {
            id: "remove-caps",
            label: "Remove capacitors on the line one at a time until the short clears",
            quality: "poor",
            feedback: "This can work but it's slow, risks damaging pads, and the short may not be a capacitor at all. Locate it first.",
          },
        ],
      },
      {
        id: "conclude",
        prompt: "What is your conclusion and repair plan?",
        choices: [
          {
            id: "battery",
            label: "The battery is faulty: replace it",
            quality: "poor",
            feedback: "You already tried a known-good battery, and the short is on the board.",
          },
          {
            id: "pmic",
            label: "The PMIC failed: replace it",
            quality: "poor",
            feedback: "The hot spot was the charging IC, not the PMIC. Follow the evidence.",
          },
          {
            id: "charging-ic",
            label: "The charging IC failed short, likely from the charger. Replace it with the correct part, then verify the line, current pattern, charging and boot",
            quality: "best",
            feedback: "The evidence chain is complete: current before power-on, a shorted main supply line, and the charging IC as the hot spot. Verifying after the repair proves the fix.",
          },
        ],
      },
    ],
    debrief: {
      rootCause: "In this simulation, the charging IC failed short and pulled the main supply line to ground.",
      lessons: [
        "Start with history and cheap checks before any test that could cause damage.",
        "Current before pressing power points to a short on a line that is always live.",
        "Confirm a short in diode mode with the board unpowered, then locate it before replacing anything.",
        "Verify after the repair: no short, normal current pattern, charging and boot.",
      ],
    },
    relatedLessonIds: ["power/dc-power-supply-current-draw", "fundamentals/diode-mode", "power/power-path"],
    relatedBlocks: ["charging", "pmic"],
  },
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
            label: "Confirm the exact model, then flash the correct firmware before opening the phone",
            quality: "best",
            feedback: "Firmware is the cheapest cause to rule out, and it doesn't require opening the phone.",
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
            feedback: "The phone powers up and starts booting every cycle, so the battery is supplying power. Nothing points at it.",
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
            feedback: "A bad antenna usually gives weak signal, not a greyed-out switch. A greyed switch suggests the Wi-Fi IC isn't starting.",
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
            feedback: "Power, clock and reset are what an IC needs to start. The clock is next on the list.",
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
            label: "The drop cracked the crystal, so the Wi-Fi IC had no clock. Replace the crystal with the correct part, then verify Wi-Fi and Bluetooth",
            quality: "best",
            feedback: "Every step of the evidence supports this. Verifying both Wi-Fi and Bluetooth confirms the shared IC is working again.",
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
      rootCause: "In this simulation, the drop cracked the crystal feeding the Wi-Fi/Bluetooth IC, so the IC had power but no clock.",
      lessons: [
        "A greyed-out Wi-Fi switch usually means the Wi-Fi IC isn't starting, not a weak antenna.",
        "An IC needs power, clock and reset. Check them in order.",
        "A multimeter can't confirm a clock. Use an oscilloscope.",
        "Follow a missing signal back to its source before replacing the IC that needs it.",
      ],
    },
    relatedLessonIds: [],
    relatedBlocks: ["connectivity", "clock"],
  },
];
