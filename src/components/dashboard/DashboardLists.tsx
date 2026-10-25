import Link from "next/link";
import { Clock, Footprints } from "lucide-react";
import type {
  ChallengeSummary,
  Course,
  Difficulty,
  LessonSummary,
  RepairCaseSummary,
} from "@/lib/types";
import { platformNames } from "@/data/sample";
import { Badge } from "@/components/ui/Badge";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";

const difficultyLabel: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const rowClass =
  "block rounded-lg px-2 py-2.5 hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent";

export function LessonList({ lessons, courses }: { lessons: LessonSummary[]; courses: Course[] }) {
  return (
    <ul className="-mx-2 divide-y divide-line">
      {lessons.map((lesson) => {
        const course = courses.find((c) => c.id === lesson.courseId);
        return (
          <li key={lesson.id}>
            <Link href="/learn" className={rowClass}>
              <p className="text-sm text-ink">{lesson.title}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span>{course?.title}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock aria-hidden className="size-3" />
                  {lesson.minutes} min
                </span>
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ChallengeList({ challenges }: { challenges: ChallengeSummary[] }) {
  return (
    <ul className="-mx-2 divide-y divide-line">
      {challenges.map((c) => (
        <li key={c.id}>
          <Link href="/diagnose" className={rowClass}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-ink">{c.title}</p>
              <Badge>{difficultyLabel[c.difficulty]}</Badge>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span>{c.symptom}</span>
              <span className="inline-flex items-center gap-1">
                <Footprints aria-hidden className="size-3" />
                {c.steps} steps
              </span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function RepairCaseList({ cases }: { cases: RepairCaseSummary[] }) {
  return (
    <ul className="-mx-2 divide-y divide-line">
      {cases.map((c) => (
        <li key={c.id}>
          <Link href="/repairs" className={rowClass}>
            <p className="text-sm text-ink">{c.title}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
              <ConfidenceBadge level={c.confidence} />
              <span>{c.model}</span>
              <span className="text-faint">·</span>
              <span>{platformNames[c.platform]}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
