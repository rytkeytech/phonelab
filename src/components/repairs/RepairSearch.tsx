"use client";

import { useMemo, useState } from "react";
import { SearchX, Search, SlidersHorizontal, X } from "lucide-react";
import type { RepairCase } from "@/lib/types";
import { cx } from "@/lib/utils";
import {
  activeFilterCount,
  emptyFilters,
  filterRepairCases,
  filtersToSearchParams,
  type RepairFilters,
} from "@/data/repairs/search";
import { FilterPanel } from "./FilterPanel";
import { RepairCaseCard } from "./RepairCaseCard";

const scopes: { value: RepairFilters["scope"]; label: string }[] = [
  { value: "all", label: "Everything" },
  { value: "symptoms", label: "Symptoms" },
  { value: "diagnosis", label: "Diagnosis" },
];

export function RepairSearch({
  cases,
  initialFilters = emptyFilters,
}: {
  cases: RepairCase[];
  initialFilters?: RepairFilters;
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => filterRepairCases(cases, filters), [cases, filters]);
  const active = activeFilterCount(filters);

  function update(patch: Partial<RepairFilters>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    // Keep the URL in step so a search can be bookmarked or shared.
    const qs = filtersToSearchParams(next).toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Filters: a sidebar on desktop, a toggle panel on phones */}
      <aside aria-label="Filters" className="lg:sticky lg:top-6 lg:self-start">
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          aria-expanded={showFilters}
          aria-controls="repair-filters"
          className="flex w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium text-ink lg:hidden"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal aria-hidden className="size-4 text-accent" />
            Filters{active > 0 && ` (${active})`}
          </span>
          <span className="text-xs text-muted">{showFilters ? "Hide" : "Show"}</span>
        </button>
        <div
          id="repair-filters"
          className={cx("mt-2 rounded-xl border border-line bg-surface p-4 lg:mt-0 lg:block", !showFilters && "hidden")}
        >
          <FilterPanel cases={cases} filters={filters} onChange={update} />
          {active > 0 && (
            <button
              type="button"
              onClick={() => update({ ...emptyFilters, sort: filters.sort })}
              className="mt-4 w-full rounded-lg border border-line-strong px-3 py-2 text-sm text-ink hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent"
            >
              Clear all filters
            </button>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="rounded-xl border border-line bg-surface p-3 sm:p-4">
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
            <input
              type="search"
              value={filters.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Search cases, e.g. “boot loop” or “backlight”"
              aria-label="Search repair cases"
              className="h-10 w-full rounded-lg border border-line bg-canvas pr-10 pl-9 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
            />
            {filters.q && (
              <button
                type="button"
                onClick={() => update({ q: "" })}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-faint hover:text-ink"
              >
                <X aria-hidden className="size-4" />
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div role="radiogroup" aria-label="Search in" className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="mr-1 text-faint">Search in:</span>
              {scopes.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={filters.scope === s.value}
                  onClick={() => update({ scope: s.value })}
                  className={cx(
                    "rounded-full border px-2.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-accent",
                    filters.scope === s.value
                      ? "border-accent/50 bg-accent-soft text-accent"
                      : "border-line text-muted hover:text-ink",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-muted">
              Sort
              <select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as RepairFilters["sort"] })}
                className="rounded-md border border-line bg-canvas px-2 py-1 text-xs text-ink focus:border-accent/60 focus:outline-none"
              >
                <option value="recent">Recently updated</option>
                <option value="title">Title A–Z</option>
              </select>
            </label>
          </div>
        </div>

        <p className="text-sm text-muted" aria-live="polite">
          {results.length} of {cases.length} case{cases.length === 1 ? "" : "s"}
        </p>

        {results.length > 0 ? (
          <ul className="grid gap-3 xl:grid-cols-2">
            {results.map((c) => (
              <li key={c.id}>
                <RepairCaseCard repairCase={c} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-12 text-center">
            <SearchX aria-hidden className="mb-3 size-8 text-faint" />
            <p className="font-medium text-ink">No cases match these filters</p>
            <p className="mt-1 max-w-sm text-sm text-muted">
              Try fewer words, a different &ldquo;Search in&rdquo; option, or clear some filters.
            </p>
            <button
              type="button"
              onClick={() => update(emptyFilters)}
              className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-canvas hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Clear search and filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
