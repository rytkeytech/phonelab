"use client";

import type { ChipsetBlock, ChipsetConnection, SignalType } from "@/lib/types";
import { cx } from "@/lib/utils";
import { categoryStyles, signalStyles } from "./styles";

const VIEW_W = 1000;
const VIEW_H = 620;

// Decorative sub-units drawn inside the SoC box. "Modem" is integrated on many, not all, platforms.
const socUnits = ["CPU", "GPU", "ISP", "Mem ctrl", "Modem*", "Boot ROM"];

type Props = {
  blocks: ChipsetBlock[];
  connections: ChipsetConnection[];
  selectedId: string | null;
  visibleTypes: Set<SignalType>;
  /** Blocks matching the current search, or null when not searching */
  matchIds: Set<string> | null;
  onSelect: (id: string) => void;
};

export function ChipsetDiagram({
  blocks,
  connections,
  selectedId,
  visibleTypes,
  matchIds,
  onSelect,
}: Props) {
  const visible = connections.filter((c) => visibleTypes.has(c.type));
  const isLinked = (c: ChipsetConnection) =>
    selectedId !== null && (c.from === selectedId || c.to === selectedId);

  // Blocks directly connected to the selection stay bright; the rest fade.
  const neighbours = new Set<string>();
  for (const c of visible) {
    if (isLinked(c)) {
      neighbours.add(c.from);
      neighbours.add(c.to);
    }
  }

  const blockOpacity = (id: string) => {
    if (matchIds) return matchIds.has(id) ? 1 : 0.25;
    if (!selectedId || id === selectedId) return 1;
    return neighbours.has(id) ? 1 : 0.45;
  };

  // Draw linked connections last so they sit on top of shared bus lines.
  const ordered = [...visible].sort((a, b) => Number(isLinked(a)) - Number(isLinked(b)));

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-auto w-full min-w-[720px] select-none"
      role="group"
      aria-label="Conceptual smartphone block diagram. Select a block to see details."
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" className="fill-line" />
        </pattern>
      </defs>
      <rect width={VIEW_W} height={VIEW_H} fill="url(#grid)" opacity="0.6" />

      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
        {ordered.map((c) => {
          const linked = isLinked(c);
          const faded = selectedId !== null && !linked;
          return (
            <polyline
              key={c.id}
              points={c.points.map((p) => p.join(",")).join(" ")}
              className={cx(
                signalStyles[c.type].stroke,
                "transition-opacity duration-300",
                linked && "signal-flow",
              )}
              strokeWidth={linked ? 3 : 2}
              opacity={faded || matchIds ? 0.18 : 0.75}
            />
          );
        })}
      </g>

      {blocks.map((block) => {
        const { x, y, w, h } = block.box;
        const selected = block.id === selectedId;
        const style = categoryStyles[block.category];
        const isSoc = block.id === "soc";
        return (
          <g
            key={block.id}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            aria-label={block.name}
            onClick={() => onSelect(block.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(block.id);
              }
            }}
            opacity={blockOpacity(block.id)}
            className="group cursor-pointer outline-none transition-opacity duration-300"
          >
            <title>{block.name}</title>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={10}
              className={cx(
                "transition-colors",
                selected
                  ? "fill-accent-soft stroke-accent"
                  : cx("fill-surface group-hover:fill-raised", style.stroke),
                "group-focus-visible:stroke-ink",
              )}
              strokeWidth={selected ? 2.5 : 1.5}
            />
            <text
              x={x + 14}
              y={y + 22}
              className={cx("font-mono", style.text)}
              fontSize={10.5}
              letterSpacing="0.08em"
            >
              {style.label.toUpperCase()}
            </text>
            <text
              x={x + 14}
              y={isSoc ? y + 48 : y + 46}
              className="fill-ink font-semibold"
              fontSize={isSoc ? 22 : 16}
            >
              {block.label}
            </text>

            {isSoc &&
              socUnits.map((unit, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const ux = x + 14 + col * 109;
                const uy = y + 70 + row * 46;
                return (
                  <g key={unit} aria-hidden>
                    <rect
                      x={ux}
                      y={uy}
                      width={103}
                      height={38}
                      rx={6}
                      className="fill-raised stroke-line"
                    />
                    <text
                      x={ux + 51.5}
                      y={uy + 24}
                      textAnchor="middle"
                      className="fill-muted font-mono"
                      fontSize={12}
                    >
                      {unit}
                    </text>
                  </g>
                );
              })}
          </g>
        );
      })}

      <text x={14} y={VIEW_H - 12} className="fill-faint font-mono" fontSize={11}>
        *Modem: integrated on many, not all, platforms
      </text>
      <text x={VIEW_W - 14} y={VIEW_H - 12} textAnchor="end" className="fill-faint font-mono" fontSize={11}>
        CONCEPTUAL · NOT A DEVICE SCHEMATIC
      </text>
    </svg>
  );
}
