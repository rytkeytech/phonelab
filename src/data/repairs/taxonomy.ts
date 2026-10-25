import type { ChipsetPlatform, FaultCategory, MeasurementMode } from "@/lib/types";

export const faultCategories: FaultCategory[] = [
  { id: "no-power", label: "No power" },
  { id: "charging", label: "Charging" },
  { id: "boot", label: "Boot / software" },
  { id: "display", label: "Display" },
  { id: "touch", label: "Touch" },
  { id: "audio", label: "Audio" },
  { id: "camera", label: "Camera" },
  { id: "network", label: "Network / RF" },
  { id: "wifi-bt", label: "Wi-Fi / Bluetooth" },
];

export const platformNames: Record<ChipsetPlatform, string> = {
  mediatek: "MediaTek",
  qualcomm: "Snapdragon",
  exynos: "Exynos",
  unisoc: "UNISOC",
  apple: "Apple A-series",
};

export const measurementModeLabels: Record<MeasurementMode, string> = {
  "dc-voltage": "DC voltage",
  diode: "Diode mode",
  resistance: "Resistance",
  continuity: "Continuity",
  current: "Current draw",
  other: "Other",
};

export function faultCategoryLabel(id: string) {
  return faultCategories.find((c) => c.id === id)?.label ?? id;
}
