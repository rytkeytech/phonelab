"use client";

import { useSearchParams } from "next/navigation";
import type { RepairCase } from "@/lib/types";
import { filtersFromSearchParams } from "@/data/repairs/search";
import { RepairSearch } from "./RepairSearch";

/** Starts the search from filters in the URL, e.g. a shared or bookmarked link. */
export function RepairSearchFromUrl({ cases }: { cases: RepairCase[] }) {
  // Read once on load: after that RepairSearch owns the filters and updates the URL itself.
  const params = useSearchParams();
  return <RepairSearch cases={cases} initialFilters={filtersFromSearchParams(new URLSearchParams(params.toString()))} />;
}
