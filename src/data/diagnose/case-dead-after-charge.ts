import type { GameScenario } from "@/lib/types";

/*
 * SIMULATED guided case: the template for every later case.
 *
 * Follows all ten stages (case → review), branches on the learner's
 * choices, and gives every wrong or premature choice its own explanation.
 * The device is imaginary; readings are described in words, never as
 * values from a real board.
 */

export const deadAfterCharge: GameScenario = {
  id: "dead-after-charge",
  title: "The phone that died on the charger",
  symptom: "No power, no response",
  difficulty: "beginner",
  kind: "simulated",
  brief: "“I left it charging overnight with a cheap fast charger I bought at the market. In the morning it was completely dead. Nothing happens when I press power or plug it in.”",
  device: "Simulated Android phone. Not a real model.",
  observations: [
    "Screen stays black when the power key is held.",
    "No vibration, no charging icon and no LED when a charger is connected.",
    "The back cover is intact and the phone isn't warm to the touch.",
  ],
  steps: [
    {
      id: "intake",
      phase: "case",
      prompt: "The phone is on your bench. Before touching it with tools, what do you do?",
      hint: "The cheapest information comes from the customer and your own eyes.",
      choices: [
        {
          id: "history",
          label: "Get the full history: the charger used, any liquid, drops, previous repairs, and whether it was fine before",
          quality: "best",
          feedback: "History costs nothing and often points straight at the fault area. Here it tells you power came in through the USB side just before it died.",
          finding: "Unbranded fast charger used overnight. No liquid, drops or previous repairs. It worked normally the evening before.",
        },
        {
          id: "flash",
          label: "Flash new firmware",
          quality: "poor",
          feedback: "A phone with no sign of life won't be detected by a computer, so it can't be flashed. Firmware comes later, once you know the board powers up.",
        },
        {
          id: "wake-up",
          label: "Apply a high current to the battery connector to 'wake it up'",
          quality: "unsafe",
          feedback: "If something is shorted, high current can burn the board and destroy the evidence you need. Always start with a low current limit.",
        },
      ],
    },
    {
      id: "inspect",
      phase: "inspection",
      context: "The history points at the charging side: the phone died while connected to an unbranded charger.",
      prompt: "Which inspection comes first?",
      hint: "Look before you measure. Some faults are visible.",
      choices: [
        {
          id: "visual",
          label: "Open it and inspect under magnification: battery condition, battery connector, USB port and the charging area for heat marks or damage",
          quality: "best",
          feedback: "A visual check can find burn marks, a swollen battery or a damaged port before any test. Nothing visible doesn't mean nothing wrong, but it's worth knowing.",
          finding: "Battery not swollen. Port and connector clean. No visible burn marks or corrosion.",
        },
        {
          id: "known-good",
          label: "Try a known-good battery and a known-good charger first",
          quality: "ok",
          feedback: "A sensible, cheap check that rules out the battery and charger. You skipped the visual inspection, which can catch a swollen battery or burn mark before you connect anything.",
          finding: "No change with a known-good battery and charger.",
        },
        {
          id: "swap-port",
          label: "Replace the charging port flex",
          quality: "poor",
          feedback: "That's a part swap with no evidence behind it. The phone doesn't respond to the power key either, so the port alone wouldn't explain everything.",
        },
      ],
    },
    {
      id: "first-test",
      phase: "first-test",
      context: "Nothing obvious under the microscope.",
      prompt: "What's your first electrical test?",
      hint: "One instrument can show whether the board draws current before you even press power.",
      choices: [
        {
          id: "bench",
          label: "Disconnect the battery. Connect a bench power supply with a low current limit and watch the current before pressing power",
          quality: "best",
          feedback: "The current pattern on a bench supply is one of the fastest ways to narrow down a dead phone, and the low limit protects the board.",
          finding: "Current flows the moment the supply is connected, before the power key is pressed, and sits at the limit you set.",
          reading: {
            label: "Bench supply current, battery removed",
            value: "Rises immediately on connection and sits at the current limit",
            reference: "A healthy phone draws almost no current before power is pressed",
          },
          next: "interpret",
        },
        {
          id: "battery-voltage",
          label: "Measure the battery voltage at the connector with a multimeter",
          quality: "ok",
          feedback: "A reasonable quick check, but a voltage reading can't show whether something is drawing current it shouldn't.",
          finding: "Battery voltage is present at the connector.",
          next: "battery-result",
        },
        {
          id: "hold-power",
          label: "Hold the power key for longer with the charger connected",
          quality: "poor",
          feedback: "You've already seen that it doesn't respond. Repeating the same action gives no new information.",
        },
      ],
    },
    {
      id: "battery-result",
      phase: "interpret",
      unscored: true,
      context: "Battery voltage is present at the connector.",
      prompt: "What does that reading tell you?",
      choices: [
        {
          id: "only-voltage",
          label: "Only that the battery holds charge and reaches the connector. It says nothing about whether the board is drawing current it shouldn't",
          quality: "best",
          feedback: "Right. Voltage being present is a starting point, not a diagnosis. A bench supply would show what the board does with that power.",
          interpretation: {
            supports: "The battery holds charge and the connector makes contact.",
            doesNotProve: "That the board is healthy, or that nothing is shorted. A short can sit behind a perfectly good battery voltage.",
            remaining: ["A short on a line that's always live", "No power-on signal reaching the power-management circuit", "A fault further along the start-up sequence"],
          },
        },
        {
          id: "battery-fine-board-fine",
          label: "The battery is fine, so the fault must be software",
          quality: "poor",
          feedback: "A good battery doesn't make the board good. A phone with no response at all isn't showing a software fault yet.",
        },
      ],
    },
    {
      id: "bench-after-battery",
      phase: "first-test",
      unscored: true,
      prompt: "You need to see what the board does with power. What next?",
      choices: [
        {
          id: "bench",
          label: "Disconnect the battery. Connect a bench power supply with a low current limit and watch the current before pressing power",
          quality: "best",
          feedback: "This is the test that shows whether current flows when it shouldn't.",
          finding: "Current flows the moment the supply is connected, before the power key is pressed, and sits at the limit you set.",
          reading: {
            label: "Bench supply current, battery removed",
            value: "Rises immediately on connection and sits at the current limit",
            reference: "A healthy phone draws almost no current before power is pressed",
          },
        },
        {
          id: "replace-battery",
          label: "Replace the battery anyway",
          quality: "poor",
          feedback: "The battery voltage was fine. Swapping it adds cost and teaches you nothing new.",
        },
      ],
    },
    {
      id: "interpret",
      phase: "interpret",
      context: "On the bench supply, current flows as soon as it's connected, before you press power, and sits at your limit.",
      prompt: "What does this result support, and what doesn't it prove?",
      hint: "A current pattern points at a kind of fault, not at a component.",
      choices: [
        {
          id: "always-live-short",
          label: "Something on a line that's always live is shorted, most likely the main supply line or a part on it. It doesn't tell me which part",
          quality: "best",
          feedback: "Exactly. Before power-on, only always-live lines should be connected to the supply, so current here points to a short on one of them.",
          interpretation: {
            supports: "A short, or near-short, on a line that's live before power-on. On most designs that's the main supply line and what's connected to it.",
            doesNotProve: "Which part is shorted. A current reading points at a line, never at one component.",
            remaining: [
              "A shorted capacitor on the main supply line",
              "A failed charging IC",
              "Another load fed directly from the main supply line",
              "Less likely: the input stage of the power-management IC",
            ],
          },
        },
        {
          id: "pmic-dead",
          label: "The PMIC has failed",
          quality: "poor",
          feedback: "Too early. A current pattern can't name a component. Many parts sit on the same line, and the PMIC is only one of them.",
        },
        {
          id: "bad-battery",
          label: "The battery is bad",
          quality: "poor",
          feedback: "The battery wasn't connected: the bench supply replaced it, and the current still flowed. The fault is on the board.",
        },
      ],
    },
    {
      id: "circuit",
      phase: "circuit",
      context: "Use the conceptual power path to decide where to look.",
      prompt: "Which line is live before the power key is pressed?",
      hint: "Follow the arrows from the battery. What's connected before the PMIC switches anything on?",
      circuit: {
        mode: "conceptual",
        diagram: "power-path",
        caption: "Conceptual power path. Real designs differ in which loads hang directly on the main supply line.",
      },
      choices: [
        {
          id: "main-line",
          label: "The main system supply line, and the parts connected straight to it, including the charging circuit",
          quality: "best",
          feedback: "Right. It's fed directly from the battery side, so it's live whenever power is connected. That makes it the first line to check.",
        },
        {
          id: "pmic-rails",
          label: "The PMIC's output rails",
          quality: "poor",
          feedback: "Most PMIC output rails stay off until the power key starts the sequence, so they're unlikely to draw current yet. Some designs have always-on outputs, and the schematic shows which, but the main supply line comes first.",
        },
        {
          id: "display-rails",
          label: "The display supplies",
          quality: "poor",
          feedback: "Display supplies come from the PMIC or dedicated ICs and switch on during start-up. They aren't live before power-on.",
        },
      ],
    },
    {
      id: "confirm-short",
      phase: "next-decision",
      prompt: "How do you confirm the short safely?",
      hint: "There's a test that works with no power applied at all.",
      choices: [
        {
          id: "diode",
          label: "Disconnect all power, then check the main supply line to ground in diode mode, and compare with a known-good board",
          quality: "best",
          feedback: "Diode mode works with the board unpowered, so it confirms the short without pushing more energy into it.",
          finding: "The main supply line reads as shorted to ground in diode mode.",
          reading: {
            label: "Diode mode, main supply line to ground",
            value: "Near zero: shorted",
            reference: "Known-good board: clearly not shorted",
          },
        },
        {
          id: "raise-limit",
          label: "Raise the current limit until the phone turns on",
          quality: "unsafe",
          feedback: "Current before power-on means a short. Raising the limit pushes more energy into it and can damage the board further, or burn away the evidence.",
        },
        {
          id: "every-rail",
          label: "Check every PMIC output rail in diode mode",
          quality: "poor",
          feedback: "That's a lot of work in the wrong place. The current flows before power-on, so start with the line that's live then.",
        },
      ],
    },
    {
      id: "locate",
      phase: "next-decision",
      context: "The main supply line is shorted to ground.",
      prompt: "Many parts sit on this line. How do you find the shorted one?",
      hint: "A shorted part turns current into heat.",
      choices: [
        {
          id: "thermal",
          label: "List the parts on the line from the boardview, inject a limited current at a voltage safe for that line, and look for the warm part with a thermal camera",
          quality: "best",
          feedback: "Limited current injection makes the shorted part warm up so you can see it. Keeping the limits low and right for that line protects everything else on it.",
          finding: "With limited current injected, the charging IC is the clear hot spot on the thermal camera.",
          reading: {
            label: "Thermal camera during limited current injection",
            value: "Charging IC is the clear hot spot",
          },
        },
        {
          id: "rosin",
          label: "No thermal camera: coat the area in rosin smoke (or use freeze spray), inject a limited current, and watch where it melts or clears first",
          quality: "best",
          feedback: "A good method without a thermal camera. It's slower and less precise, so look closely at parts packed tightly together.",
          finding: "With limited current injected, the rosin melts first on top of the charging IC.",
        },
        {
          id: "remove-caps",
          label: "Remove the capacitors on the line one at a time until the short clears",
          quality: "poor",
          feedback: "This can work, but it's slow, risks lifting pads, and the short may not be a capacitor at all. Locate it first.",
        },
        {
          id: "full-voltage",
          label: "Inject at full battery voltage with no current limit to find it faster",
          quality: "unsafe",
          feedback: "With no limit, the short can draw enough current to burn the part, lift pads or damage the board. Always inject with a limited current.",
        },
      ],
    },
    {
      id: "confirm-cause",
      phase: "confirmation",
      context: "The charging IC is the hot spot.",
      prompt: "Is that enough to be sure it's the cause?",
      hint: "What test would prove it, using a part you'll replace anyway?",
      choices: [
        {
          id: "isolate",
          label: "Remove the charging IC, then check the main supply line in diode mode again",
          quality: "best",
          feedback: "If the short clears with the part removed, the part was causing it. You'd be replacing it anyway, so removing it costs nothing extra.",
          finding: "With the charging IC removed, the main supply line is no longer shorted.",
          reading: {
            label: "Diode mode, main supply line to ground, charging IC removed",
            value: "No longer shorted; comparable to the known-good board",
            reference: "Known-good board: clearly not shorted",
          },
        },
        {
          id: "replace-now",
          label: "Yes: fit a new charging IC straight away",
          quality: "poor",
          feedback: "Not yet. A hot spot is strong evidence, but heat can also come from a part right next to the real short, or from the path the current takes. Confirm first.",
        },
        {
          id: "replace-both",
          label: "Replace the charging IC and the PMIC together, to be safe",
          quality: "poor",
          feedback: "Nothing points at the PMIC. Replacing parts without evidence costs money, adds risk and hides what the real fault was.",
        },
      ],
    },
    {
      id: "repair",
      phase: "repair",
      context: "The short cleared with the charging IC removed. The cause is confirmed.",
      prompt: "How do you fit the replacement?",
      choices: [
        {
          id: "correct-part",
          label: "Fit the exact part for this model and board revision (from the parts list or schematic) with proper flux and heat control, then recheck the line in diode mode before applying any power",
          quality: "best",
          feedback: "The right part, fitted carefully, then checked before power goes in. A new short from a solder bridge is caught before it can do damage.",
          finding: "New charging IC fitted. The main supply line is not shorted in diode mode.",
        },
        {
          id: "same-footprint",
          label: "Fit any charging IC that has the same footprint",
          quality: "poor",
          feedback: "Same size doesn't mean same part. A different IC can have different pin functions or settings, and may not work or may damage the board. Use the exact part.",
        },
        {
          id: "power-straight-away",
          label: "Fit it, then plug in the customer's charger to test it",
          quality: "unsafe",
          feedback: "Check for shorts before applying power. And the customer's unbranded charger is a suspect in this failure, so test with a known-good charger.",
        },
      ],
    },
    {
      id: "verify",
      phase: "verification",
      prompt: "What do you check before returning the phone?",
      hint: "Check the original fault is gone, and that nothing else broke.",
      choices: [
        {
          id: "full-check",
          label: "Normal current pattern on the bench supply, a full boot, charging with a known-good charger and cable, and a check that the battery percentage rises",
          quality: "best",
          feedback: "That confirms the original fault is gone and the repaired area works under load. Tell the customer the unbranded charger fits the history, so it's worth replacing.",
          finding: "Normal current pattern, full boot, and charging works with a known-good charger.",
          next: "end",
        },
        {
          id: "boots",
          label: "It boots, so it's fixed",
          quality: "poor",
          feedback: "Booting proves part of it. The fault was on the charging side, so you must also check that it charges, and that the current pattern is normal.",
        },
      ],
    },
  ],
  debrief: {
    rootCause: "In this simulation, the charging IC failed short and pulled the main supply line to ground. The short cleared when the IC was removed. The unbranded charger fits the history, but nothing here proves it caused the failure.",
    alternatives: [
      "A shorted capacitor on the main supply line: same current pattern. Locating the hot spot separates it from the charging IC.",
      "A shorted load fed directly from the main supply line: same pattern, a different hot spot.",
      "A flat or failed battery: ruled out because the board drew current from the bench supply with no battery fitted.",
      "No power-on signal reaching the power-management circuit: would show no current at all, not current before power-on.",
    ],
    commonMistakes: [
      "Replacing the PMIC because the phone is dead.",
      "Raising the current limit to 'push through' a short.",
      "Treating a hot spot as proof without confirming it.",
      "Fitting a part that only matches the footprint.",
      "Returning the phone after it boots, without testing charging.",
    ],
    lessons: [
      "Start with history and cheap checks before any test that could cause damage.",
      "Current before pressing power points to a short on a line that is always live.",
      "Confirm a short in diode mode with the board unpowered, then locate it before replacing anything.",
      "A hot spot is strong evidence, not proof. Confirm it, for example by checking whether the short clears with the part removed.",
      "Keep cause and correlation apart: the charger fits the story, but it isn't proven.",
      "Verify after the repair: no short, normal current pattern, charging and boot.",
    ],
  },
  relatedLessonIds: ["power/dc-power-supply-current-draw", "fundamentals/diode-mode", "power/power-path"],
  relatedBlocks: ["charging", "pmic"],
};
