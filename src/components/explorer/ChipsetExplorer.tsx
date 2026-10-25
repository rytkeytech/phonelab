"use client";

import { useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { SignalType } from "@/lib/types";
import { cx } from "@/lib/utils";
import {
  chipsetBlocks,
  chipsetConnections,
  connectionsDisclaimer,
  signalTypes,
} from "@/data/chipset-conceptual";
import { BlockDetailPanel } from "./BlockDetailPanel";
import { ChipsetDiagram } from "./ChipsetDiagram";
import { signalStyles } from "./styles";

const allTypes = Object.keys(signalTypes) as SignalType[];
const symptomSuggestions = ["dead", "boot loop", "not charging", "black", "no service"];

const blocksById = new Map(chipsetBlocks.map((b) => [b.id, b]));

/** Returns ids of blocks whose text contains every word of the query. */
function searchBlocks(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return null;
  const ids = new Set<string>();
  for (const b of chipsetBlocks) {
    const haystack = [b.name, b.summary, ...b.functions, ...b.symptoms].join(" ").toLowerCase();
    if (terms.every((t) => haystack.includes(t))) ids.add(b.id);
  }
  return ids;
}

export function ChipsetExplorer({ initialBlockId = "soc" }: { initialBlockId?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(initialBlockId);
  const [visibleTypes, setVisibleTypes] = useState<Set<SignalType>>(() => new Set(allTypes));
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const matchIds = useMemo(() => searchBlocks(query), [query]);
  const selected = selectedId ? (blocksById.get(selectedId) ?? null) : null;

  function select(id: string) {
    setSelectedId(id);
    // On narrow screens the panel sits below the diagram, so bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function toggleType(type: SignalType) {
    setVisibleTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex min-w-0 flex-col gap-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-3 sm:p-4">
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find blocks by symptom, e.g. “boot loop”"
              aria-label="Search blocks by name or symptom"
              className="h-10 w-full rounded-lg border border-line bg-canvas pr-10 pl-9 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-faint hover:text-ink"
              >
                <X aria-hidden className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-faint">Try:</span>
            {symptomSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className={cx(
                  "rounded-full border px-2.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-accent",
                  query === s
                    ? "border-accent/50 bg-accent-soft text-accent"
                    : "border-line text-muted hover:border-line-strong hover:text-ink",
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {matchIds && (
            <p className="text-xs text-muted" aria-live="polite">
              {matchIds.size === 0
                ? "No blocks mention that. Try a shorter word."
                : `${matchIds.size} block${matchIds.size === 1 ? "" : "s"} related to “${query.trim()}”. Others are dimmed.`}
            </p>
          )}

          <fieldset className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
            <legend className="sr-only">Show signal types</legend>
            <span aria-hidden className="mr-1 text-xs text-faint">Signals:</span>
            {allTypes.map((type) => {
              const on = visibleTypes.has(type);
              return (
                <label
                  key={type}
                  className={cx(
                    "inline-flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1 text-xs transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent",
                    on ? "border-line-strong bg-raised text-ink" : "border-line text-faint",
                  )}
                >
                  <input type="checkbox" checked={on} onChange={() => toggleType(type)} className="sr-only" />
                  <span
                    aria-hidden
                    className={cx("h-0.5 w-4 rounded-full", on ? signalStyles[type].dot : "bg-line-strong")}
                  />
                  {signalTypes[type].label}
                </label>
              );
            })}
          </fieldset>
        </div>

        {/* Diagram (scrolls sideways on small phones so labels stay readable) */}
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <ChipsetDiagram
            blocks={chipsetBlocks}
            connections={chipsetConnections}
            selectedId={selectedId}
            visibleTypes={visibleTypes}
            matchIds={matchIds}
            onSelect={select}
          />
        </div>
        <p className="-mt-2 text-xs leading-relaxed text-faint">
          {connectionsDisclaimer}
          <span className="sm:hidden"> Swipe the diagram sideways to see all blocks.</span>
        </p>

        {/* Block list: an easy alternative to tapping small SVG shapes */}
        <div className="flex flex-wrap gap-2" aria-label="All blocks">
          {chipsetBlocks.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => select(b.id)}
              aria-pressed={b.id === selectedId}
              className={cx(
                "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent",
                b.id === selectedId
                  ? "border-accent/60 bg-accent-soft text-accent"
                  : "border-line bg-surface text-muted hover:text-ink",
                matchIds && !matchIds.has(b.id) && "opacity-40",
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={panelRef}
        className="scroll-mt-20 self-start rounded-xl border border-line bg-surface lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto"
      >
        <BlockDetailPanel
          block={selected}
          blocksById={blocksById}
          connections={chipsetConnections.filter((c) => visibleTypes.has(c.type))}
          onSelect={select}
        />
      </div>
    </div>
  );
}
