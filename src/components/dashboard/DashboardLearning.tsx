"use client";

import Link from "next/link";
import { BookOpenCheck, CheckCircle2, Clock } from "lucide-react";
import { useProgress } from "@/lib/progress";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatTile } from "./StatTile";

/*
 * Dashboard panels driven by the learner's real progress (saved in this browser).
 * The server passes small summaries so lesson content isn't sent to the client.
 */

export type CourseSummary = {
  id: string;
  order: number;
  title: string;
  publishedIds: string[];
};

export type LessonLink = {
  id: string;
  href: string;
  title: string;
  courseTitle: string;
  minutes: number;
};

export function LessonsCompletedTile({ publishedIds }: { publishedIds: string[] }) {
  const { completed } = useProgress();
  const done = publishedIds.filter((id) => completed[id]).length;
  return (
    <StatTile
      icon={BookOpenCheck}
      label="Lessons completed"
      value={`${done}/${publishedIds.length}`}
      detail="Of the lessons available now"
    />
  );
}

export function LearningPathList({ courses }: { courses: CourseSummary[] }) {
  const { completed } = useProgress();
  return (
    <ol className="grid gap-x-6 sm:grid-cols-2">
      {courses.map((course) => {
        const available = course.publishedIds.length;
        const done = course.publishedIds.filter((id) => completed[id]).length;
        const finished = available > 0 && done === available;
        return (
          <li key={course.id}>
            <Link
              href={`/learn/${course.id}`}
              className="group flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-md border border-line bg-canvas font-mono text-xs text-muted group-hover:text-accent">
                {finished ? <CheckCircle2 aria-label="All available lessons complete" className="size-4 text-verified" /> : course.order}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm text-ink">{course.title}</span>
                  <span className="shrink-0 font-mono text-[11px] text-faint tabular-nums">
                    {available > 0 ? `${done}/${available}` : "soon"}
                  </span>
                </span>
                <ProgressBar value={done} max={Math.max(available, 1)} label={`${course.title} progress`} className="mt-1.5" />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** The next few published lessons the learner hasn't completed, in curriculum order. */
export function RecommendedLessons({ lessons, limit = 3 }: { lessons: LessonLink[]; limit?: number }) {
  const { completed } = useProgress();
  const next = lessons.filter((l) => !completed[l.id]).slice(0, limit);

  if (next.length === 0) {
    return (
      <p className="py-4 text-sm text-muted">
        You&rsquo;ve completed every lesson available so far. New lessons will appear here when they&rsquo;re published.
      </p>
    );
  }
  return (
    <ul className="-mx-2 divide-y divide-line">
      {next.map((lesson) => (
        <li key={lesson.id}>
          <Link href={lesson.href} className="block rounded-lg px-2 py-2.5 hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent">
            <p className="text-sm text-ink">{lesson.title}</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span>{lesson.courseTitle}</span>
              <span className="inline-flex items-center gap-1">
                <Clock aria-hidden className="size-3" />
                {lesson.minutes} min
              </span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
