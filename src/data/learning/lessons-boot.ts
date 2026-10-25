import type { Lesson } from "@/lib/types";

export const bootLessons: Lesson[] = [
  {
    id: "boot/what-happens-when-you-press-power",
    courseId: "boot",
    slug: "what-happens-when-you-press-power",
    order: 1,
    title: "What happens when you press power",
    summary: "The stages a phone goes through from the power key to the operating system, and how to use them to narrow down a fault.",
    minutes: 12,
    difficulty: "beginner",
    status: "published",
    objectives: [
      "List the main boot stages in order",
      "Link each stage to the blocks involved",
      "Use the stage where boot stops to narrow down a fault",
    ],
    blocks: [
      { type: "text", text: "Booting is a relay race. Each stage must finish before the next can start. If you can tell which stage the phone reaches, you have already ruled out a large part of the board." },
      { type: "diagram", diagram: "boot-sequence", caption: "Conceptual boot sequence. The exact order, and which chip handles each step, varies by platform." },
      { type: "heading", text: "Stage by stage" },
      {
        type: "list",
        ordered: true,
        items: [
          "Power key: pressing it signals the power-management circuit. On many designs the key line goes to the PMIC; check the schematic.",
          "Power-on sequence: supply rails are switched on in a defined order.",
          "Clocks start: reference clocks begin running.",
          "Reset released: once rails and clocks are ready, the SoC is released from reset.",
          "Boot ROM: code built permanently into the SoC runs first and looks for the first bootloader in storage. If it can't load one, many SoCs offer an emergency USB download mode.",
          "Bootloaders: load from storage, initialise RAM, and check the software that follows. On most phones this chain is protected by digital signatures.",
          "Operating system: the kernel and OS start, and drivers bring up the display, touch, cameras, radios and the rest.",
        ],
      },
      {
        type: "callout",
        tone: "key",
        title: "Use the stage to narrow the fault",
        text: "If boot stops very early (no rails, no clock), suspect power and timing. If the boot ROM runs but no bootloader loads, suspect storage, its supply, or firmware. If the logo appears but the OS never finishes starting, firmware, storage and RAM are common suspects. Peripheral faults usually show only once the OS is running.",
      },
      { type: "heading", text: "Signs you can observe" },
      {
        type: "list",
        items: [
          "The current pattern on a bench power supply (see the power systems course).",
          "Whether a computer detects the phone, and in which mode.",
          "Whether the logo appears, and how far the boot animation gets.",
          "A vibration at power-on, on phones that do this.",
        ],
      },
      { type: "explorer", blockId: "soc", text: "See how the SoC depends on the PMIC, clocks, RAM and storage in the Chipset Explorer." },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "What runs first on the SoC after it is released from reset?",
        options: ["The operating system", "The boot ROM", "The display driver", "The bootloader from storage"],
        correctIndex: 1,
        explanation: "The boot ROM is built into the SoC and always runs first. It then loads the first bootloader from storage.",
      },
      {
        id: "q2",
        prompt: "A phone is only detected by a computer in an emergency download mode. Which areas are the most likely suspects?",
        options: ["Display and touch", "Storage, its supply, or firmware", "Speaker and microphone", "The SIM reader"],
        correctIndex: 1,
        explanation: "The boot ROM is running (that is what provides the download mode), but it can't load a bootloader. That points to storage, its power or interface, or the firmware.",
      },
      {
        id: "q3",
        prompt: "Which order is correct?",
        options: [
          "Boot ROM → power key → rails → OS",
          "Power key → rails → clocks and reset release → boot ROM → bootloaders → OS",
          "Rails → OS → boot ROM → bootloaders",
          "Bootloaders → boot ROM → rails → OS",
        ],
        correctIndex: 1,
        explanation: "Power must be up and stable, with clocks running and reset released, before the SoC can run its boot ROM, which then loads the bootloaders and finally the OS.",
      },
    ],
  },
];
