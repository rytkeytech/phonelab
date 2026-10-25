import type { Metadata } from "next";
import { ChipsetExplorer } from "@/components/explorer/ChipsetExplorer";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Chipset Explorer",
};

export default function ExplorerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Chipset Explorer"
        title="How a smartphone fits together"
        description="Select a block to see what it does, what it depends on, its common failure symptoms, and a diagnostic approach. Toggle signal types to simplify the view."
      />
      <Notice variant="conceptual" title="Conceptual diagram — not a device-specific circuit" className="mb-4">
        This shows typical relationships between blocks. Real phones differ in
        which chips exist and how they connect. MediaTek, Snapdragon, Exynos,
        UNISOC and Apple designs each vary. Always confirm with the schematic or
        boardview for the exact model.
      </Notice>
      <ChipsetExplorer />
    </>
  );
}
