import type { Course } from "@/lib/types";

export const courses: Course[] = [
  { id: "fundamentals", order: 1, title: "Electronics fundamentals", description: "Voltage, current, resistance, components and using a multimeter." },
  { id: "power", order: 2, title: "Smartphone power systems", description: "Battery, charging, PMIC, rails and current-draw diagnosis." },
  { id: "boot", order: 3, title: "Boot sequence and startup", description: "From power key press to the OS: what happens and in what order." },
  { id: "clocks", order: 4, title: "Clocks and reset", description: "Crystals, oscillators, reset lines and why they stop a board booting." },
  { id: "memory", order: 5, title: "RAM and storage", description: "LPDDR, eMMC, UFS, stacked packages and memory-related faults." },
  { id: "buses", order: 6, title: "SoC and peripheral communication", description: "I²C, SPI, MIPI and how the SoC talks to everything else." },
  { id: "platforms", order: 7, title: "Platform-specific architecture", description: "How MediaTek, Snapdragon, Exynos, UNISOC and Apple designs differ." },
  { id: "diagnosis", order: 8, title: "Practical fault diagnosis", description: "A systematic workflow from symptom to verified repair." },
];
