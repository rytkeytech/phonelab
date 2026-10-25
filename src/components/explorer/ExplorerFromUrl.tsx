"use client";

import { useSearchParams } from "next/navigation";
import { chipsetBlocks } from "@/data/chipset-conceptual";
import { ChipsetExplorer } from "./ChipsetExplorer";

/** Opens the explorer on the block named in ?block=…, e.g. links from lessons. */
export function ExplorerFromUrl() {
  const requested = useSearchParams().get("block");
  const blockId = chipsetBlocks.some((b) => b.id === requested) ? requested! : "soc";
  // key resets the explorer's selection when the URL changes
  return <ChipsetExplorer key={blockId} initialBlockId={blockId} />;
}
