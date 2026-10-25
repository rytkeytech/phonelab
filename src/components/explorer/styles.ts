import type { BlockCategory, SignalType } from "@/lib/types";

/** Tailwind classes per signal type, shared by the diagram, legend and detail panel. */
export const signalStyles: Record<SignalType, { stroke: string; dot: string; text: string }> = {
  power: { stroke: "stroke-power", dot: "bg-power", text: "text-power" },
  data: { stroke: "stroke-data", dot: "bg-data", text: "text-data" },
  control: { stroke: "stroke-control", dot: "bg-control", text: "text-control" },
  clock: { stroke: "stroke-clock", dot: "bg-clock", text: "text-clock" },
};

export const categoryStyles: Record<BlockCategory, { label: string; stroke: string; text: string; fill: string }> = {
  core: { label: "Processor", stroke: "stroke-accent/60", text: "fill-accent", fill: "fill-accent" },
  power: { label: "Power", stroke: "stroke-power/50", text: "fill-power", fill: "fill-power" },
  memory: { label: "Memory", stroke: "stroke-corroborated/50", text: "fill-corroborated", fill: "fill-corroborated" },
  timing: { label: "Timing", stroke: "stroke-clock/50", text: "fill-clock", fill: "fill-clock" },
  peripheral: { label: "Peripheral", stroke: "stroke-line-strong", text: "fill-muted", fill: "fill-muted" },
};
