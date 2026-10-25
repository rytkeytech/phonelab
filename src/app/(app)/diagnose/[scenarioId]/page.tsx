import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getScenario, scenarios } from "@/data/diagnose";
import { lessonHref, publishedLessons } from "@/data/learning";
import { chipsetBlocks } from "@/data/chipset-conceptual";
import { Badge } from "@/components/ui/Badge";
import { Notice } from "@/components/ui/Notice";
import { GamePlayer } from "@/components/diagnose/GamePlayer";
import { difficultyLabel } from "@/components/learn/LessonRow";

type Props = PageProps<"/diagnose/[scenarioId]">;

export function generateStaticParams() {
  return scenarios.map((s) => ({ scenarioId: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = getScenario((await params).scenarioId);
  return { title: found?.title ?? "Scenario not found" };
}

export default async function ScenarioPage({ params }: Props) {
  const scenario = getScenario((await params).scenarioId);
  if (!scenario) notFound();

  // Only link lessons that are actually published.
  const relatedLessons = publishedLessons
    .filter((l) => scenario.relatedLessonIds.includes(l.id))
    .map((l) => ({ href: lessonHref(l), label: l.title }));
  const relatedBlocks = chipsetBlocks
    .filter((b) => scenario.relatedBlocks.includes(b.id))
    .map((b) => ({ href: `/explorer?block=${b.id}`, label: b.label }));

  return (
    <>
      <Link
        href="/diagnose"
        className="mb-4 inline-flex items-center gap-1.5 rounded-md text-sm text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All scenarios
      </Link>
      <header className="mb-4">
        <div className="mb-2 flex flex-wrap gap-2">
          <Badge>{difficultyLabel[scenario.difficulty]}</Badge>
          <Badge tone="caution">Simulated</Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{scenario.title}</h1>
      </header>
      <Notice variant="sample" title="Simulated scenario" className="mb-4">
        Every finding and reading here is simulated for training. It is not a measurement from a real phone.
      </Notice>
      <GamePlayer scenario={scenario} relatedLessons={relatedLessons} relatedBlocks={relatedBlocks} />
    </>
  );
}
