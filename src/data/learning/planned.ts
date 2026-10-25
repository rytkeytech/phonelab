import type { Difficulty, Lesson } from "@/lib/types";

/*
 * Lessons in the curriculum outline that have not been written yet.
 * They appear as "Coming soon" and have no page until they are published.
 */

type Outline = [order: number, slug: string, title: string, summary: string, minutes: number, difficulty: Difficulty];

function planned(courseId: string, outline: Outline[]): Lesson[] {
  return outline.map(([order, slug, title, summary, minutes, difficulty]) => ({
    id: `${courseId}/${slug}`,
    courseId,
    slug,
    order,
    title,
    summary,
    minutes,
    difficulty,
    status: "planned",
    objectives: [],
    blocks: [],
    quiz: [],
  }));
}

export const plannedLessons: Lesson[] = [
  ...planned("fundamentals", [
    [4, "capacitors", "Capacitors and why they short", "What capacitors do on a phone board and how they fail.", 10, "beginner"],
    [5, "inductors-and-coils", "Inductors and coils", "Where inductors appear in power circuits and how to check them.", 8, "beginner"],
    [6, "diodes-and-protection", "Diodes and protection parts", "Diodes, TVS and ESD protection: what they guard against.", 10, "beginner"],
    [7, "transistors-and-mosfets", "Transistors and MOSFETs as switches", "How switching components turn loads on and off.", 12, "intermediate"],
    [8, "reading-schematics-and-boardviews", "Reading schematics and boardviews", "Finding a line, its components and its test points.", 14, "intermediate"],
  ]),
  ...planned("power", [
    [3, "buck-converters-and-ldos", "Buck converters and LDOs", "How the PMIC makes each rail, and what failure looks like.", 12, "intermediate"],
    [4, "charging-circuits", "Charging circuits", "The USB input path, protection and the charging IC.", 12, "intermediate"],
    [5, "finding-shorts-on-rails", "Finding shorts on rails", "Locating a shorted component safely and efficiently.", 14, "intermediate"],
    [6, "power-key-and-power-on", "The power key and power-on trigger", "How a key press reaches the PMIC.", 8, "beginner"],
    [7, "battery-connector-and-protection", "Battery connector and protection", "Battery lines, temperature/ID and protection circuits.", 10, "intermediate"],
  ]),
  ...planned("boot", [
    [2, "boot-rom-and-download-modes", "Boot ROM and download modes", "What emergency USB modes tell you about the board.", 10, "intermediate"],
    [3, "bootloaders-and-secure-boot", "Bootloaders and secure boot", "The signed chain from boot ROM to OS.", 12, "intermediate"],
    [4, "reading-boot-logs", "Reading boot and flashing logs", "Using tool output to find where boot stops.", 12, "advanced"],
    [5, "boot-loop-diagnosis", "Diagnosing boot loops", "Separating firmware, power, storage and RAM causes.", 14, "advanced"],
    [6, "firmware-vs-hardware", "Firmware fault or hardware fault?", "Tests that separate software problems from board faults.", 10, "intermediate"],
  ]),
  ...planned("clocks", [
    [1, "crystals-and-oscillators", "Crystals and oscillators", "How phones generate timing signals.", 10, "intermediate"],
    [2, "rtc-and-sleep-clock", "The RTC and sleep clock", "Why the sleep clock matters for power-on.", 8, "intermediate"],
    [3, "reset-signals", "Reset signals", "Power-on reset, watchdogs and peripheral resets.", 10, "intermediate"],
    [4, "diagnosing-clock-faults", "Diagnosing clock and reset faults", "What you can and can't check without an oscilloscope.", 12, "advanced"],
  ]),
  ...planned("memory", [
    [1, "lpddr-basics", "LPDDR RAM basics", "What RAM does during boot and while running.", 10, "intermediate"],
    [2, "emmc-vs-ufs", "eMMC vs UFS storage", "Two storage types and how they differ for repair.", 10, "intermediate"],
    [3, "pop-and-mcp-packages", "Stacked and combined packages", "PoP, eMCP and uMCP explained.", 10, "intermediate"],
    [4, "memory-faults", "Memory-related faults", "Symptoms, causes and what to rule out first.", 12, "advanced"],
    [5, "storage-replacement-and-pairing", "Storage replacement and pairing", "Why storage swaps often need programming, or aren't possible.", 10, "advanced"],
  ]),
  ...planned("buses", [
    [1, "i2c-and-spi", "I²C and SPI", "Low-speed control buses and how faults show up.", 12, "intermediate"],
    [2, "mipi-dsi-and-csi", "MIPI display and camera interfaces", "High-speed links to the screen and cameras.", 10, "intermediate"],
    [3, "interrupts-and-gpio", "Interrupts and GPIO", "How peripherals get the SoC's attention.", 8, "intermediate"],
    [4, "usb-and-data", "USB data and charging lines", "Data, detection and charging over the USB port.", 10, "intermediate"],
    [5, "rf-front-end-basics", "RF front-end basics", "Transceiver, amplifiers, switches and antennas.", 14, "advanced"],
    [6, "audio-interfaces", "Audio interfaces", "How audio travels between SoC, codec and amplifiers.", 10, "intermediate"],
  ]),
  ...planned("platforms", [
    [1, "mediatek", "MediaTek platforms", "Common architecture patterns on MediaTek phones.", 14, "advanced"],
    [2, "snapdragon", "Qualcomm Snapdragon platforms", "Common architecture patterns on Snapdragon phones.", 14, "advanced"],
    [3, "exynos", "Samsung Exynos platforms", "Common architecture patterns on Exynos phones.", 14, "advanced"],
    [4, "unisoc", "UNISOC / SPD platforms", "Common architecture patterns on UNISOC phones.", 14, "advanced"],
    [5, "apple", "Apple A-series platforms", "Common architecture patterns on iPhones.", 14, "advanced"],
  ]),
  ...planned("diagnosis", [
    [1, "systematic-workflow", "A systematic diagnosis workflow", "From symptom to verified repair, step by step.", 12, "beginner"],
    [2, "interviewing-the-customer", "Getting the fault history", "Questions that save hours of bench time.", 8, "beginner"],
    [3, "visual-inspection", "Visual inspection", "What to look for under the microscope.", 10, "beginner"],
    [4, "liquid-damage", "Liquid damage", "Corrosion, cleaning and hidden damage.", 12, "intermediate"],
    [5, "thermal-imaging", "Thermal imaging and short finding", "Using heat to find faulty components.", 10, "intermediate"],
    [6, "documenting-a-repair", "Documenting a repair", "Recording evidence so others can trust your result.", 8, "beginner"],
    [7, "verifying-the-fix", "Verifying the fix", "Tests to run before returning a phone.", 8, "beginner"],
  ]),
];
