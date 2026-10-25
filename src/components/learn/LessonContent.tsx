import Link from "next/link";
import { ArrowRight, Cpu, KeyRound, Lightbulb, TriangleAlert } from "lucide-react";
import type { LessonBlock } from "@/lib/types";
import { cx } from "@/lib/utils";
import { lessonDiagrams } from "./diagrams";

const calloutStyles = {
  key: { icon: KeyRound, className: "border-accent/30 bg-accent-soft/50", iconClass: "text-accent" },
  tip: { icon: Lightbulb, className: "border-verified/25 bg-verified/5", iconClass: "text-verified" },
  caution: { icon: TriangleAlert, className: "border-caution/25 bg-caution-soft", iconClass: "text-caution" },
};

/** Renders a lesson's content blocks in order. */
export function LessonContent({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="flex flex-col gap-5 text-[15px] leading-relaxed text-ink/90">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="mt-3 text-lg font-semibold text-ink">{block.text}</h2>;

    case "text":
      return <p>{block.text}</p>;

    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          className={cx(
            "space-y-2 pl-5 marker:text-faint",
            block.ordered ? "list-decimal marker:font-mono marker:text-sm" : "list-disc",
          )}
        >
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </List>
      );
    }

    case "callout": {
      const { icon: Icon, className, iconClass } = calloutStyles[block.tone];
      return (
        <aside className={cx("flex gap-3 rounded-lg border p-4", className)}>
          <Icon aria-hidden className={cx("mt-0.5 size-5 shrink-0", iconClass)} />
          <div>
            <p className="font-semibold text-ink">{block.title}</p>
            <p className="mt-1 text-sm text-ink/85">{block.text}</p>
          </div>
        </aside>
      );
    }

    case "example":
      return (
        <figure className="rounded-lg border border-line bg-surface p-4 sm:p-5">
          <figcaption className="mb-3 font-mono text-xs tracking-wider text-accent uppercase">
            {block.title}
          </figcaption>
          <ol className="space-y-2.5 text-sm">
            {block.steps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-raised font-mono text-[11px] text-muted">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {block.note && (
            <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-muted">{block.note}</p>
          )}
        </figure>
      );

    case "diagram": {
      const Diagram = lessonDiagrams[block.diagram];
      return (
        <figure className="rounded-xl border border-line bg-surface p-4 sm:p-6">
          <Diagram />
          <figcaption className="mt-4 flex gap-2 text-xs leading-relaxed text-muted">
            <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0 text-caution" />
            {block.caption}
          </figcaption>
        </figure>
      );
    }

    case "explorer":
      return (
        <Link
          href={`/explorer?block=${block.blockId}`}
          className="group flex items-center gap-3 rounded-lg border border-accent/25 bg-accent-soft/40 p-4 text-sm hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-accent"
        >
          <Cpu aria-hidden className="size-5 shrink-0 text-accent" />
          <span className="flex-1 text-ink/90">{block.text}</span>
          <ArrowRight aria-hidden className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
        </Link>
      );
  }
}
