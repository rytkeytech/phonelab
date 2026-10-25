import Link from "next/link";
import { Clock } from "lucide-react";
import type { Difficulty, Lesson } from "@/lib/types";
import { lessonHref } from "@/data/learning";
import { Badge } from "@/components/ui/Badge";
import { LessonStatusIcon } from "./ProgressIndicators";

export const difficultyLabel: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** One lesson in a course outline. Planned lessons are shown but not clickable. */
export function LessonRow({ lesson }: { lesson: Lesson }) {
  const published = lesson.status === "published";

  const body = (
    <>
      <span className="grid size-8 shrink-0 place-items-center rounded-md border border-line bg-canvas font-mono text-xs text-muted">
        {lesson.order}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink">{lesson.title}</span>
        <span className="mt-0.5 block text-xs text-muted">{lesson.summary}</span>
        <span className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-faint">
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3" />
            {lesson.minutes} min
          </span>
          <span>·</span>
          <span>{difficultyLabel[lesson.difficulty]}</span>
        </span>
      </span>
      {published ? <LessonStatusIcon lessonId={lesson.id} /> : <Badge>Coming soon</Badge>}
    </>
  );

  return published ? (
    <Link
      href={lessonHref(lesson)}
      className="flex items-start gap-3 rounded-lg p-3 hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent"
    >
      {body}
    </Link>
  ) : (
    <div className="flex items-start gap-3 rounded-lg p-3 opacity-60">{body}</div>
  );
}
