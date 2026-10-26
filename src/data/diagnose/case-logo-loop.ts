import type { GameScenario } from "@/lib/types";

/*
 * SIMULATED guided case: boot loop after a drop.
 *
 * Teaches separating firmware, battery, supply and memory causes, protecting
 * the customer's data, and keeping a likely cause labelled as a hypothesis
 * until the repair confirms it. Imaginary device; readings in words only.
 */

export const logoLoop: GameScenario = {
  id: "logo-loop",
  title: "Stuck at the logo",
  symptom: "Boot loop after a drop",
  difficulty: "intermediate",
  kind: "simulated",
  brief: "“I dropped it on the floor yesterday. Now it shows the logo, goes black, shows the logo again, over and over. Please don't lose my photos.”",
  device: "Simulated Android phone with stacked memory. Not a real model.",
  observations: [
    "The logo appears, the screen goes black after a few seconds, and the cycle repeats.",
    "The screen shows the logo clearly, with no lines or damage in the image.",
    "The customer has no recent backup.",
  ],
  steps: [
    {
      id: "intake",
      phase: "case",
      prompt: "Before you start, what do you do?",
      hint: "This customer has said something important about their data.",
      choices: [
        {
          id: "history-and-data",
          label: "Get the history (drop, liquid, updates, earlier faults) and agree with the customer which steps could erase their data before doing any of them",
          quality: "best",
          feedback: "History points you at the fault area, and agreeing on data risk up front means you won't wipe photos the customer asked you to keep.",
          finding: "Dropped on a tiled floor yesterday. No liquid, no recent updates, worked fine before. The customer agrees to data-risking steps only if nothing else works.",
        },
        {
          id: "screen",
          label: "Replace the screen",
          quality: "poor",
          feedback: "The logo displays correctly, so the screen works. The problem is that boot never finishes.",
        },
        {
          id: "hot-air",
          label: "Heat the SoC and memory with hot air to reflow them",
          quality: "unsafe",
          feedback: "Unprepared heating can damage the SoC, memory and nearby parts, and makes a proper repair harder. Reflow and reballing are planned, advanced procedures, and you have no evidence yet.",
        },
      ],
    },
    {
      id: "inspect",
      phase: "inspection",
      context: "A drop the day before the fault started.",
      prompt: "What do you inspect first?",
      hint: "Look for where the impact landed.",
      choices: [
        {
          id: "impact",
          label: "Inspect the frame for the impact point, then open it and check connectors, battery and the board near the impact under magnification",
          quality: "best",
          feedback: "Finding where the force went tells you which parts of the board took the shock. Unseated connectors and a damaged battery are quick to rule out.",
          finding: "A dent on one corner of the frame, near the SoC and memory area. Connectors are seated, the battery isn't swollen, and nothing is visibly cracked.",
        },
        {
          id: "battery-swap",
          label: "Replace the battery straight away",
          quality: "poor",
          feedback: "Not yet. A worn battery can cause restarts under load, but you can test that without buying a part. Inspect first.",
        },
      ],
    },
    {
      id: "first-test",
      phase: "first-test",
      prompt: "What's your first electrical test?",
      hint: "One test rules the battery in or out and shows the boot pattern at the same time.",
      choices: [
        {
          id: "bench",
          label: "Power it from a bench supply instead of the battery and watch the current through a few boot attempts",
          quality: "best",
          feedback: "This replaces the battery, so if it still loops the battery isn't the cause, and the current pattern shows how far each attempt gets.",
          finding: "On the bench supply the phone still loops. Current rises and varies as if booting, then drops back, and the cycle repeats.",
          reading: {
            label: "Bench supply current during boot attempts",
            value: "Rises and varies, drops back, repeats",
          },
          next: "interpret",
        },
        {
          id: "known-good-battery",
          label: "Fit a known-good battery and try again",
          quality: "ok",
          feedback: "It tests the battery, but the bench supply would have done that and shown the current pattern too.",
          finding: "Still loops with a known-good battery.",
          next: "battery-result",
        },
        {
          id: "flash-now",
          label: "Flash the full firmware straight away",
          quality: "poor",
          feedback: "A full flash usually erases the user's data, and the customer asked you to keep their photos. Gather non-destructive evidence first.",
        },
      ],
    },
    {
      id: "battery-result",
      phase: "interpret",
      unscored: true,
      context: "It still loops with a known-good battery.",
      prompt: "What does that tell you?",
      choices: [
        {
          id: "battery-out",
          label: "The battery is unlikely to be the cause, but I still don't know where in the boot it fails",
          quality: "best",
          feedback: "Right. The battery is mostly ruled out. To narrow it further you need to know how far boot gets.",
          interpretation: {
            supports: "The original battery isn't causing the loop.",
            doesNotProve: "Anything about where boot fails, or which part is at fault.",
            remaining: ["Corrupted firmware", "Storage or RAM fault", "A missing or unstable supply rail", "Damaged solder joints from the drop"],
          },
          next: "circuit",
        },
        {
          id: "must-be-software",
          label: "Then it must be software",
          quality: "poor",
          feedback: "Ruling out the battery doesn't make it software. A drop can damage hardware in ways that look exactly like a software loop.",
        },
      ],
    },
    {
      id: "interpret",
      phase: "interpret",
      context: "On the bench supply, current rises and varies as if booting, drops back, and repeats.",
      prompt: "What does this pattern support, and what doesn't it prove?",
      hint: "A boot loop has many possible causes. What has this test ruled out?",
      choices: [
        {
          id: "loop-many-causes",
          label: "It's a boot loop that starts each time and fails part-way. The battery is ruled out, but firmware, storage, RAM or power could all cause it",
          quality: "best",
          feedback: "Exactly. The board powers up and starts booting every time, so the early stages work. The pattern alone can't name the cause.",
          interpretation: {
            supports: "Power-on, clocks and reset work well enough to start booting. The battery isn't the cause.",
            doesNotProve: "Whether the cause is firmware or hardware, or which part.",
            remaining: ["Corrupted firmware", "Storage fault", "RAM or its solder joints", "A supply rail that drops out under load"],
          },
        },
        {
          id: "ram-dead",
          label: "The RAM is dead",
          quality: "poor",
          feedback: "Too early. Nothing so far points at the RAM specifically. Firmware, storage and power produce the same pattern.",
        },
        {
          id: "no-power",
          label: "The board isn't getting power",
          quality: "poor",
          feedback: "The current rises and the logo appears every cycle, so power is arriving. The fault is later in the boot.",
        },
      ],
    },
    {
      id: "circuit",
      phase: "circuit",
      context: "Use the conceptual boot sequence to place the fault.",
      prompt: "The logo appears, then it restarts. Roughly where in the sequence is it failing?",
      hint: "Which stages must have worked for the logo to appear?",
      circuit: {
        mode: "conceptual",
        diagram: "boot-sequence",
        caption: "Conceptual boot sequence. Which stage shows the logo varies; on many phones it appears during the bootloaders.",
      },
      choices: [
        {
          id: "late",
          label: "Late: power-on, clocks, reset and the boot ROM have worked. It fails during the bootloaders or as the OS starts, where storage and RAM are needed",
          quality: "best",
          feedback: "Right. That places the fault where storage, RAM and firmware are all in play, and it's why the next step is to get evidence from that stage.",
        },
        {
          id: "power-key",
          label: "At the power key stage",
          quality: "poor",
          feedback: "If it failed at the power key, nothing would happen at all. Here the phone starts booting every cycle.",
        },
        {
          id: "boot-rom",
          label: "In the boot ROM, before anything else runs",
          quality: "poor",
          feedback: "A logo on screen means code beyond the boot ROM is already running. The fault comes later.",
        },
      ],
    },
    {
      id: "evidence",
      phase: "next-decision",
      prompt: "How do you find out what fails, without risking the photos?",
      hint: "Some tools can report errors without writing anything to the phone.",
      choices: [
        {
          id: "read-log",
          label: "Connect the phone to the correct flashing tool for this exact model and use its read-only identify function, then read the log",
          quality: "best",
          feedback: "Reading doesn't write anything, so the data is safe, and tool logs often show which stage fails.",
          finding: "The tool log reports a memory initialisation error during early boot.",
          reading: {
            label: "Flashing tool log (read-only)",
            value: "Memory initialisation error",
          },
        },
        {
          id: "flash-anyway",
          label: "Flash the full firmware: it fixes most boot loops",
          quality: "poor",
          feedback: "It may well be firmware, but a full flash usually erases the photos you agreed to protect. Get the non-destructive evidence first.",
        },
        {
          id: "microscope-again",
          label: "Look under the microscope again",
          quality: "poor",
          feedback: "You've already inspected and found nothing visible. Damage under a stacked package can't be seen from above. You need electrical evidence now.",
        },
      ],
    },
    {
      id: "memory-error",
      phase: "next-decision",
      context: "The tool reports a memory initialisation error.",
      prompt: "What do you check before blaming the RAM?",
      hint: "What else can produce a memory error?",
      choices: [
        {
          id: "loader-and-rails",
          label: "Confirm the tool's loader matches the exact model, then check the RAM supply rails against the schematic or a known-good board",
          quality: "best",
          feedback: "A wrong loader and a missing supply are both common causes of this error, and both are quick to rule out.",
          finding: "The loader is correct for this model. The RAM supply rails are present and comparable to the known-good board.",
          reading: {
            label: "RAM supply rails during a boot attempt",
            value: "Present",
            reference: "Known-good board: present and comparable",
          },
        },
        {
          id: "replace-ram",
          label: "Replace the RAM: the tool says it's a memory error",
          quality: "poor",
          feedback: "A memory error doesn't prove the RAM is faulty. Wrong loaders, missing supplies and solder faults cause the same message.",
        },
      ],
    },
    {
      id: "confirm",
      phase: "confirmation",
      context: "Loader correct, RAM supplies present, impact near the memory.",
      prompt: "Is firmware ruled out yet?",
      hint: "You haven't actually tested the firmware.",
      choices: [
        {
          id: "flash-with-consent",
          label: "Not yet. Explain that this is now the last step before an invasive repair, get the customer's agreement to lose data, then flash the correct firmware",
          quality: "best",
          feedback: "Flashing is the test that separates firmware from hardware. Now the customer understands why it's needed and has agreed to the data loss.",
          finding: "The flash completes, but the phone still loops with the same memory error. Firmware is ruled out.",
        },
        {
          id: "skip-flash",
          label: "Yes, it must be hardware after a drop. Go straight to memory rework",
          quality: "poor",
          feedback: "The drop makes hardware likely, but likely isn't proven. Rework is risky and expensive; rule out firmware first.",
        },
      ],
    },
    {
      id: "repair",
      phase: "repair",
      context: "Firmware, battery, loader and supplies are ruled out. The drop landed near the stacked memory.",
      prompt: "What do you tell the customer, and what do you offer?",
      choices: [
        {
          id: "hypothesis",
          label: "Explain that cracked solder joints under the stacked memory are the likely cause, not yet proven. Offer an advanced memory rework, with its risks and that it may not succeed, and proceed only if they agree",
          quality: "best",
          feedback: "Honest and accurate: the evidence fits, but only a successful rework confirms it. The customer can make an informed choice.",
          finding: "The customer agrees. Memory rework carried out.",
        },
        {
          id: "promise",
          label: "Tell them it's definitely the RAM and the repair is guaranteed",
          quality: "poor",
          feedback: "You can't promise that. The evidence points at the memory joints, but it's still a hypothesis, and rework can fail.",
        },
        {
          id: "blast",
          label: "Reflow the memory with hot air, without preparation, to save time",
          quality: "unsafe",
          feedback: "Unprepared heating can damage the SoC, memory and neighbouring parts, and can make the board unrepairable. Rework needs proper preparation and heat control.",
        },
      ],
    },
    {
      id: "verify",
      phase: "verification",
      prompt: "How do you confirm the repair before returning the phone?",
      hint: "The fault was a loop. One good boot doesn't prove it's gone.",
      choices: [
        {
          id: "stress",
          label: "Several full boots and restarts, a period of normal use with demanding apps until it's warm, and the tool log no longer showing the memory error",
          quality: "best",
          feedback: "Repeated boots and warm running are where a marginal joint would show itself. A clean log confirms the original error is gone.",
          finding: "It boots fully every time, stays stable when warm, and the tool no longer reports a memory error. The rework confirmed the cause.",
          next: "end",
        },
        {
          id: "one-boot",
          label: "It booted once, so it's fixed",
          quality: "poor",
          feedback: "A loop can be intermittent, especially with solder faults. Test repeated boots and warm running before you call it fixed.",
        },
      ],
    },
  ],
  debrief: {
    rootCause: "In this simulation, the drop cracked solder joints under the stacked memory. It stayed a hypothesis until the rework produced stable boots and a clean tool log, which confirmed it.",
    alternatives: [
      "Corrupted firmware: same loop. Ruled out when the correct firmware was flashed and the loop continued.",
      "A worn battery sagging under load: ruled out by looping on the bench supply.",
      "A wrong loader in the flashing tool: can report a memory error on a healthy phone. Ruled out by confirming the loader.",
      "A missing RAM supply rail: ruled out by comparing the rails with a known-good board.",
      "An SoC fault: can't be fully excluded by these tests, but the successful rework points away from it.",
    ],
    commonMistakes: [
      "Flashing first and wiping data the customer wanted to keep.",
      "Treating a memory error message as proof the RAM is faulty.",
      "Heating the SoC or memory without preparation.",
      "Promising a guaranteed repair while the cause is still a hypothesis.",
      "Calling it fixed after one good boot.",
    ],
    lessons: [
      "Agree on data risk with the customer before any step that could erase it.",
      "A bench supply rules out the battery and shows the boot pattern in one test.",
      "Read-only tool logs can show where boot fails without touching user data.",
      "A memory initialisation error is not proof that the RAM is faulty.",
      "Label conclusions honestly: a likely cause is a hypothesis until the repair confirms it.",
      "Verify intermittent faults with repeated boots and warm running.",
    ],
  },
  relatedLessonIds: ["boot/what-happens-when-you-press-power", "power/dc-power-supply-current-draw"],
  relatedBlocks: ["ram", "storage", "soc"],
};
