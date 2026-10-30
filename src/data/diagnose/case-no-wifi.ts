import type { GameScenario } from "@/lib/types";

/*
 * SIMULATED guided case: Wi-Fi and Bluetooth dead after a drop.
 *
 * Teaches software-first checks, the power / clock / reset needs of an IC,
 * why a multimeter can't confirm a clock, and following a missing signal back
 * to its source. In this imaginary design the Wi-Fi/Bluetooth IC has its own
 * crystal; real designs vary.
 */

export const noWifi: GameScenario = {
  id: "no-wifi",
  title: "Wi-Fi won't switch on",
  symptom: "Wi-Fi toggle greyed out",
  difficulty: "advanced",
  kind: "simulated",
  brief: "“It fell out of my pocket on the bus. Everything works except Wi-Fi: the switch is greyed out. Bluetooth won't turn on either.”",
  device: "Simulated Android phone. In this simulation the Wi-Fi/Bluetooth IC has its own crystal. Real designs vary.",
  observations: [
    "The Wi-Fi switch is greyed out and can't be turned on.",
    "Bluetooth won't switch on either.",
    "Calls and mobile data work normally.",
  ],
  steps: [
    {
      id: "intake",
      phase: "case",
      prompt: "Where do you start?",
      hint: "Two features failed at the same moment. What do they have in common?",
      choices: [
        {
          id: "history",
          label: "Get the history: when it started, the drop, any liquid, updates or app installs around the same time",
          quality: "best",
          feedback: "Wi-Fi and Bluetooth often share one IC on phones, so both failing together after a drop is a strong clue. History also tells you whether a software change could explain it.",
          finding: "Both stopped right after the drop two days ago. No liquid, no updates or new apps since.",
        },
        {
          id: "sim",
          label: "Replace the SIM card",
          quality: "poor",
          feedback: "The SIM is for mobile service, which works. It has nothing to do with Wi-Fi or Bluetooth.",
        },
        {
          id: "antenna",
          label: "Replace the Wi-Fi antenna",
          quality: "poor",
          feedback: "A bad antenna usually gives weak signal, not a greyed-out switch. And it wouldn't explain Bluetooth.",
        },
      ],
    },
    {
      id: "software",
      phase: "inspection",
      prompt: "Before opening the phone, what do you check?",
      hint: "Rule out software without risking the customer's data.",
      choices: [
        {
          id: "soft-checks",
          label: "Restart, try safe mode, and reset network settings (it forgets saved Wi-Fi networks, so tell the customer). Then check for a software update",
          quality: "best",
          feedback: "These rule out simple software causes without touching the customer's photos or apps.",
          finding: "No change. Wi-Fi is still greyed out and Bluetooth still won't start.",
        },
        {
          id: "mac",
          label: "Check whether the Wi-Fi MAC address shows in the phone's status information",
          quality: "ok",
          feedback: "A useful clue that the Wi-Fi hardware isn't being detected, but do the simple software checks first.",
          finding: "The Wi-Fi MAC address shows as unavailable.",
        },
        {
          id: "factory-reset",
          label: "Factory reset the phone",
          quality: "poor",
          feedback: "That erases the customer's data. Save it for later, if at all, and only with a backup and their agreement. Less drastic checks come first.",
        },
      ],
    },
    {
      id: "first-test",
      phase: "first-test",
      context: "The phone is open on the bench.",
      prompt: "What's your first check on the board?",
      hint: "Every IC needs one thing before anything else.",
      choices: [
        {
          id: "supply",
          label: "Inspect the Wi-Fi/Bluetooth area under magnification, then, with the phone on, check the IC's supply against the schematic",
          quality: "best",
          feedback: "Look first, then confirm power. Checking against the schematic means you compare with the right expected value for this design.",
          finding: "No obvious damage at first glance. The Wi-Fi/Bluetooth IC's supply is present and matches the known-good board.",
          reading: {
            label: "Wi-Fi/Bluetooth IC supply, phone on",
            value: "Present",
            reference: "Known-good board: present and comparable",
          },
        },
        {
          id: "remove-ic",
          label: "Remove the Wi-Fi IC to inspect underneath",
          quality: "poor",
          feedback: "Too early and risky. You haven't checked whether the IC is getting what it needs to start.",
        },
      ],
    },
    {
      id: "interpret",
      phase: "interpret",
      context: "The IC's supply is present.",
      prompt: "What does that tell you?",
      hint: "Power is one of three things an IC needs to start.",
      choices: [
        {
          id: "power-only",
          label: "Power is fine, but the IC also needs a running clock and a released reset. It isn't proven faulty yet",
          quality: "best",
          feedback: "Exactly. With power confirmed, the clock and reset are the next things to check before the IC itself.",
          interpretation: {
            supports: "The IC is powered.",
            doesNotProve: "That the IC is faulty. It may be missing its clock or be held in reset.",
            remaining: ["No clock reaching the IC", "Reset line stuck", "A damaged connection between the IC and the SoC", "The IC itself", "Less likely now: firmware or calibration data"],
          },
        },
        {
          id: "ic-dead",
          label: "The supply's fine, so the IC must be dead",
          quality: "poor",
          feedback: "A powered IC can still fail to start without its clock or with its reset stuck. Check those before condemning it.",
        },
      ],
    },
    {
      id: "circuit",
      phase: "circuit",
      context: "In this simulated design, the Wi-Fi/Bluetooth IC has its own crystal.",
      prompt: "If the IC's clock were missing, what could cause it?",
      hint: "Where is the oscillator circuit for a passive crystal?",
      circuit: {
        mode: "conceptual",
        diagram: "crystal-oscillator",
        caption: "Conceptual crystal and oscillator arrangement. In this simulation the Wi-Fi IC drives its own crystal.",
      },
      choices: [
        {
          id: "crystal-caps-ic",
          label: "The crystal, its load capacitors, or the oscillator circuit inside the Wi-Fi IC",
          quality: "best",
          feedback: "Right. A passive crystal needs the chip's oscillator circuit to run, so all three are suspects.",
        },
        {
          id: "pmic-display",
          label: "The display supply from the PMIC",
          quality: "poor",
          feedback: "The display supply has nothing to do with the Wi-Fi IC's clock. Stay on the circuit around the IC.",
        },
      ],
    },
    {
      id: "clock",
      phase: "next-decision",
      prompt: "How do you check the clock?",
      hint: "Which instrument can actually show a signal oscillating?",
      choices: [
        {
          id: "scope",
          label: "Use an oscilloscope at a buffered clock point if the schematic shows one, or a low-capacitance active probe at the crystal",
          quality: "best",
          feedback: "Only an oscilloscope shows whether the clock is running. A standard passive probe adds enough capacitance to stop a crystal, so it can make a working clock look dead.",
          finding: "There is no clock signal at the Wi-Fi IC.",
          reading: {
            label: "Oscilloscope, Wi-Fi IC clock input",
            value: "No oscillation: flat line",
            reference: "Known-good board: steady clock signal",
          },
        },
        {
          id: "multimeter",
          label: "Measure the clock line with a multimeter on DC voltage",
          quality: "poor",
          feedback: "A multimeter shows an average voltage. It can't tell you whether a clock is oscillating, or at what frequency.",
        },
      ],
    },
    {
      id: "source",
      phase: "next-decision",
      context: "No clock at the Wi-Fi IC.",
      prompt: "What now?",
      hint: "Follow the missing signal back towards where it comes from.",
      choices: [
        {
          id: "inspect-crystal",
          label: "Inspect the crystal and its load capacitors closely under higher magnification. Drops can crack crystals",
          quality: "best",
          feedback: "Follow the missing signal back to its source.",
          finding: "A hairline crack is visible on the crystal's casing.",
        },
        {
          id: "replace-ic",
          label: "Replace the Wi-Fi IC",
          quality: "poor",
          feedback: "Without a clock, even a new IC won't start. Find out why the clock is missing first.",
        },
      ],
    },
    {
      id: "confirm",
      phase: "confirmation",
      context: "Power present, no clock, and a cracked crystal.",
      prompt: "Before you replace anything, is there anything else to check?",
      hint: "Three things: power, clock and…?",
      choices: [
        {
          id: "reset",
          label: "Check the IC's reset line against the schematic, so power, clock and reset are all accounted for",
          quality: "best",
          feedback: "The crack explains the missing clock, but a drop can cause more than one fault. Checking reset now means you won't be surprised after the repair.",
          finding: "The reset line is in the state the schematic expects.",
        },
        {
          id: "straight-to-crystal",
          label: "No, the crack explains it. Replace the crystal",
          quality: "ok",
          feedback: "Reasonable, and probably right. But checking reset costs a minute and avoids a second trip if the drop did more damage.",
        },
      ],
    },
    {
      id: "repair",
      phase: "repair",
      prompt: "How do you repair it?",
      choices: [
        {
          id: "exact-crystal",
          label: "Fit a crystal of the exact frequency and specification from the parts list, with careful heat control, then check with the scope that the clock is now present",
          quality: "best",
          feedback: "The right part, fitted carefully, and the clock checked straight away. Seeing it return confirms the crystal was the cause.",
          finding: "A clock is now present at the Wi-Fi IC.",
        },
        {
          id: "any-crystal",
          label: "Fit any crystal with the same footprint",
          quality: "poor",
          feedback: "Same size doesn't mean same part. A different frequency or load capacitance may not run, or may run off-frequency and cause unreliable Wi-Fi.",
        },
        {
          id: "both",
          label: "Replace the crystal and the Wi-Fi IC together, to be safe",
          quality: "poor",
          feedback: "Nothing points at the IC. Replacing parts without evidence adds risk and cost, and hides what actually fixed it.",
        },
      ],
    },
    {
      id: "verify",
      phase: "verification",
      prompt: "What do you check before returning the phone?",
      hint: "Test both features that failed, and the things that were working.",
      choices: [
        {
          id: "full-check",
          label: "Wi-Fi switches on, connects and transfers data; Bluetooth pairs; the MAC address shows; retest once the phone is warm; and calls and mobile data still work",
          quality: "best",
          feedback: "That confirms both failed features work, the IC is detected, it stays stable when warm, and nothing else was disturbed.",
          finding: "Wi-Fi and Bluetooth work, the MAC address shows, and everything stays stable when warm.",
          next: "end",
        },
        {
          id: "switch-on",
          label: "The Wi-Fi switch turns on, so it's fixed",
          quality: "poor",
          feedback: "A switch that turns on isn't the same as working Wi-Fi. Test a real connection, Bluetooth, and stability when warm.",
        },
      ],
    },
  ],
  debrief: {
    rootCause: "In this simulation, the drop cracked the crystal feeding the Wi-Fi/Bluetooth IC, so the IC had power but no clock. The clock returning after the crystal was replaced confirmed it.",
    alternatives: [
      "A software or firmware fault: can grey out the switch. Ruled out first by the software checks.",
      "A damaged antenna or antenna cable: usually gives weak signal, not a greyed-out switch.",
      "A stuck reset line: same symptom with power and clock present. Checked and found as expected.",
      "A failed Wi-Fi IC: possible, but it can't start without a clock anyway. The clock returning and Wi-Fi working ruled it out.",
    ],
    commonMistakes: [
      "Replacing the antenna for a greyed-out switch.",
      "Factory resetting before trying less drastic checks.",
      "Trying to confirm a clock with a multimeter.",
      "Replacing the Wi-Fi IC before checking its clock and reset.",
      "Fitting a crystal that only matches the footprint.",
    ],
    lessons: [
      "Two features failing together often point at a shared part.",
      "Rule out software first, without touching the customer's data.",
      "An IC needs power, clock and reset. Check each one; finding a fault in one doesn't clear the others.",
      "A multimeter can't confirm a clock. Use an oscilloscope.",
      "Follow a missing signal back to its source before replacing the IC that needs it.",
      "Confirm the cause after the repair: the clock should be present again before you test Wi-Fi.",
    ],
  },
  relatedLessonIds: ["clocks/crystals-and-oscillators", "clocks/crystals-on-the-board", "clocks/diagnosing-clock-faults", "clocks/reset-signals"],
  relatedBlocks: ["connectivity", "clock"],
};
