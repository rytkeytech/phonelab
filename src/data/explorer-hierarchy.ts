/*
 * The Chipset Explorer's hierarchy: platform family → chipset → phone model →
 * board revision. Two phones that share a chipset do not share an electrical
 * design, so schematic and boardview content can only ever hang off a
 * specific model AND board revision, from a legitimate source.
 *
 * Nothing below the family level has been verified yet, so the lists are
 * empty and the explorer says so. Add entries only with a source recorded in
 * docs/research/SOURCES.md.
 */

export type DiagramMode = "conceptual" | "schematic" | "boardview";

export const diagramModes: { id: DiagramMode; label: string; description: string }[] = [
  { id: "conceptual", label: "Conceptual", description: "The general role of each subsystem and how they relate. Not any specific phone." },
  { id: "schematic", label: "Schematic", description: "Real part references, net names, pins and connections for one model and board revision." },
  { id: "boardview", label: "Boardview", description: "Physical layout and part positions for one model and board revision." },
];

export type BoardRevision = { id: string; name: string; sourceIds: string[] };
export type PhoneModel = { id: string; name: string; revisions: BoardRevision[] };
export type Chipset = { id: string; name: string; models: PhoneModel[] };
export type PlatformFamily = { id: string; name: string; chipsets: Chipset[] };

export const platformFamilies: PlatformFamily[] = [
  { id: "mediatek", name: "MediaTek", chipsets: [] },
  { id: "qualcomm", name: "Qualcomm Snapdragon", chipsets: [] },
  { id: "unisoc", name: "UNISOC / Spreadtrum", chipsets: [] },
  { id: "exynos", name: "Samsung Exynos", chipsets: [] },
  { id: "apple", name: "Apple A-series", chipsets: [] },
  { id: "kirin", name: "HiSilicon Kirin", chipsets: [] },
  { id: "tensor", name: "Google Tensor", chipsets: [] },
];
