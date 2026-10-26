"use client";

import { useRef, useState } from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import type { ChipsetBlock, ChipsetConnection, SignalType } from "@/lib/types";
import { cx } from "@/lib/utils";
import { categoryStyles, signalStyles } from "./styles";

const VIEW_W = 1000;
const VIEW_H = 630;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

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

type View = { zoom: number; cx: number; cy: number };
const FIT: View = { zoom: 1, cx: VIEW_W / 2, cy: VIEW_H / 2 };

/** Keeps the visible window inside the drawing. */
function clampView({ zoom, cx, cy }: View): View {
  const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
  const halfW = VIEW_W / z / 2;
  const halfH = VIEW_H / z / 2;
  return {
    zoom: z,
    cx: Math.min(VIEW_W - halfW, Math.max(halfW, cx)),
    cy: Math.min(VIEW_H - halfH, Math.max(halfH, cy)),
  };
}

export function ChipsetDiagram({ blocks, connections, selectedId, visibleTypes, matchIds, onSelect }: Props) {
  const [view, setView] = useState<View>(FIT);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; view: View; moved: boolean } | null>(null);

  const visible = connections.filter((c) => visibleTypes.has(c.type));
  const isLinked = (c: ChipsetConnection) => selectedId !== null && (c.from === selectedId || c.to === selectedId);

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
    return neighbours.has(id) ? 1 : 0.4;
  };

  // Draw linked connections last so they sit on top of the shared trunks.
  const ordered = [...visible].sort((a, b) => Number(isLinked(a)) - Number(isLinked(b)));

  const w = VIEW_W / view.zoom;
  const h = VIEW_H / view.zoom;
  const viewBox = `${view.cx - w / 2} ${view.cy - h / 2} ${w} ${h}`;
  const zoomBy = (factor: number) => setView((v) => clampView({ ...v, zoom: v.zoom * factor }));

  // Drag to pan once zoomed in. A drag never counts as a click on a block.
  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (view.zoom === 1) return;
    drag.current = { x: e.clientX, y: e.clientY, view, moved: false };
  }
  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const d = drag.current;
    const svg = svgRef.current;
    if (!d || !svg) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    if (!d.moved) svg.setPointerCapture(e.pointerId);
    d.moved = true;
    const scale = w / svg.clientWidth;
    setView(clampView({ ...d.view, cx: d.view.cx - dx * scale, cy: d.view.cy - dy * scale }));
  }
  function onPointerUp() {
    // Cleared after the click event, so the click handler can still see the drag.
    setTimeout(() => (drag.current = null));
  }
  const select = (id: string) => {
    if (drag.current?.moved) return;
    onSelect(id);
  };

  const controlButton =
    "grid size-8 place-items-center rounded-md border border-line-strong bg-surface/90 text-muted backdrop-blur hover:text-ink disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-accent";

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex gap-1.5" role="group" aria-label="Zoom">
        <button type="button" onClick={() => zoomBy(1.4)} disabled={view.zoom >= MAX_ZOOM} aria-label="Zoom in" className={controlButton}>
          <Plus aria-hidden className="size-4" />
        </button>
        <button type="button" onClick={() => zoomBy(1 / 1.4)} disabled={view.zoom <= MIN_ZOOM} aria-label="Zoom out" className={controlButton}>
          <Minus aria-hidden className="size-4" />
        </button>
        <button type="button" onClick={() => setView(FIT)} disabled={view.zoom === 1} aria-label="Fit diagram" className={controlButton}>
          <Maximize2 aria-hidden className="size-4" />
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox={viewBox}
        className={cx("h-auto w-full select-none", view.zoom > 1 && "cursor-grab active:cursor-grabbing")}
        style={{ touchAction: view.zoom > 1 ? "none" : "pan-y" }}
        role="group"
        aria-label="Conceptual smartphone block diagram. Select a block to see details."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" className="fill-line" />
          </pattern>
        </defs>
        <rect width={VIEW_W} height={VIEW_H} fill="url(#grid)" opacity="0.5" />

        <g fill="none" strokeLinejoin="round" strokeLinecap="round">
          {ordered.map((c) => {
            const linked = isLinked(c);
            const faded = (selectedId !== null && !linked) || Boolean(matchIds);
            return (
              <polyline
                key={c.id}
                points={c.points.map((p) => p.join(",")).join(" ")}
                className={cx(signalStyles[c.type].stroke, "transition-opacity duration-300", linked && "signal-flow")}
                strokeWidth={linked ? 3.5 : 2}
                // Solid opacity so lines sharing a trunk don't darken where they overlap.
                opacity={faded ? 0.15 : 0.85}
              >
                <title>{c.label}</title>
              </polyline>
            );
          })}
        </g>

        {blocks.map((block) => {
          const { x, y, w: bw, h: bh } = block.box;
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
              onClick={() => select(block.id)}
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
                width={bw}
                height={bh}
                rx={10}
                className={cx(
                  "transition-colors",
                  selected ? "fill-accent-soft stroke-accent" : cx("fill-surface group-hover:fill-raised", style.stroke),
                  "group-focus-visible:stroke-ink",
                )}
                strokeWidth={selected ? 2.5 : 1.5}
              />
              <text x={x + 14} y={y + 24} className={cx("font-mono", style.text)} fontSize={11} letterSpacing="0.08em">
                {style.label.toUpperCase()}
              </text>
              <text x={x + 14} y={isSoc ? y + 54 : y + 52} className="fill-ink font-semibold" fontSize={isSoc ? 26 : 18}>
                {block.label}
              </text>

              {isSoc &&
                socUnits.map((unit, i) => {
                  const gap = 8;
                  const uw = (bw - 28 - gap * 2) / 3;
                  const ux = x + 14 + (i % 3) * (uw + gap);
                  const uy = y + 90 + Math.floor(i / 3) * 58;
                  return (
                    <g key={unit} aria-hidden>
                      <rect x={ux} y={uy} width={uw} height={46} rx={6} className="fill-raised stroke-line" />
                      <text x={ux + uw / 2} y={uy + 28} textAnchor="middle" className="fill-muted font-mono" fontSize={13}>
                        {unit}
                      </text>
                    </g>
                  );
                })}
            </g>
          );
        })}

        <text x={14} y={VIEW_H - 10} className="fill-faint font-mono" fontSize={12}>
          *Modem: integrated on many, not all, platforms
        </text>
        <text x={VIEW_W - 14} y={VIEW_H - 10} textAnchor="end" className="fill-faint font-mono" fontSize={12}>
          CONCEPTUAL · NOT A DEVICE SCHEMATIC
        </text>
      </svg>
    </div>
  );
}
