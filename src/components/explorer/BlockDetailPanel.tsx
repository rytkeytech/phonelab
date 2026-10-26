import { ArrowRight, MousePointerClick, TriangleAlert } from "lucide-react";
import type { ChipsetBlock, ChipsetConnection } from "@/lib/types";
import { connectionsDisclaimer, signalTypes } from "@/data/chipset-conceptual";
import { Badge } from "@/components/ui/Badge";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { SourceCitation } from "@/components/research/SourceCitation";
import { categoryStyles, signalStyles } from "./styles";

type Props = {
  block: ChipsetBlock | null;
  blocksById: Map<string, ChipsetBlock>;
  connections: ChipsetConnection[];
  onSelect: (id: string) => void;
};

export function BlockDetailPanel({ block, blocksById, connections, onSelect }: Props) {
  if (!block) {
    return (
      <div className="flex h-full min-h-60 flex-col items-center justify-center p-6 text-center">
        <MousePointerClick aria-hidden className="mb-3 size-8 text-faint" />
        <p className="text-sm font-medium text-ink">Select a block</p>
        <p className="mt-1 text-sm text-muted">
          Click any block in the diagram to see what it does, what it depends
          on, and how to diagnose it.
        </p>
      </div>
    );
  }

  const linked = connections.filter((c) => c.from === block.id || c.to === block.id);

  return (
    <article aria-live="polite" className="flex flex-col gap-5 p-5">
      <header>
        <Badge className="mb-2">{categoryStyles[block.category].label}</Badge>
        <h2 className="text-lg font-semibold text-ink">{block.name}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{block.summary}</p>
        <div className="mt-3">
          <BookmarkButton kind="block" itemId={block.id} returnTo={`/explorer?block=${block.id}`} />
        </div>
      </header>

      <Section title="What it does">
        <ul className="list-disc space-y-1.5 pl-4 text-sm text-ink/85 marker:text-faint">
          {block.functions.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </Section>

      {block.dependsOn.length > 0 && (
        <Section title="Depends on">
          <div className="flex flex-wrap gap-2">
            {block.dependsOn.map((id) => (
              <BlockLink key={id} id={id} blocksById={blocksById} onSelect={onSelect} />
            ))}
          </div>
        </Section>
      )}

      {linked.length > 0 && (
        <Section title="Conceptual connections">
          <p className="mb-2 text-xs leading-relaxed text-faint">{connectionsDisclaimer}</p>
          <ul className="space-y-1.5">
            {linked.map((c) => {
              const otherId = c.from === block.id ? c.to : c.from;
              const other = blocksById.get(otherId);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(otherId)}
                    className="flex w-full items-start gap-2.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <span
                      aria-hidden
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${signalStyles[c.type].dot}`}
                    />
                    <span className="min-w-0">
                      <span className="text-ink">{c.label}</span>
                      <span className="block text-xs text-muted">
                        <span className={signalStyles[c.type].text}>
                          {signalTypes[c.type].label}
                        </span>{" "}
                        · {c.from === block.id ? "to" : "from"} {other?.label}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <Section title="Common failure symptoms">
        <ul className="list-disc space-y-1.5 pl-4 text-sm text-ink/85 marker:text-faint">
          {block.symptoms.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Section>

      <Section title="Diagnostic approach">
        <ol className="space-y-2.5 text-sm text-ink/85">
          {block.diagnosis.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-[11px] text-accent">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      {block.caution && (
        <p className="flex gap-2.5 rounded-lg border border-caution/25 bg-caution-soft p-3 text-sm text-ink/85">
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-caution" />
          {block.caution}
        </p>
      )}

      <SourceCitation claimIds={block.claims} />

      <p className="border-t border-line pt-4 text-xs leading-relaxed text-faint">
        General guidance only. Exact rails, values, test points and signal names
        must come from the schematic or boardview for the specific model and
        board revision.
      </p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 font-mono text-[11px] tracking-wider text-faint uppercase">{title}</h3>
      {children}
    </section>
  );
}

function BlockLink({
  id,
  blocksById,
  onSelect,
}: {
  id: string;
  blocksById: Map<string, ChipsetBlock>;
  onSelect: (id: string) => void;
}) {
  const target = blocksById.get(id);
  if (!target) return null;
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="inline-flex items-center gap-1 rounded-md border border-line-strong bg-raised px-2.5 py-1 text-xs font-medium text-ink hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
    >
      {target.label}
      <ArrowRight aria-hidden className="size-3" />
    </button>
  );
}
