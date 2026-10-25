import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Course } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function CourseProgressList({
  courses,
  progress,
}: {
  courses: Course[];
  progress: Record<string, number>;
}) {
  return (
    <ol className="grid gap-x-6 sm:grid-cols-2">
      {courses.map((course) => {
        const done = progress[course.id] ?? 0;
        const complete = done >= course.lessonCount;
        return (
          <li key={course.id}>
            <Link
              href="/learn"
              className="group flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-raised focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-md border border-line bg-canvas font-mono text-xs text-muted group-hover:text-accent">
                {complete ? (
                  <CheckCircle2 aria-label="Complete" className="size-4 text-verified" />
                ) : (
                  course.order
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm text-ink">{course.title}</span>
                  <span className="shrink-0 font-mono text-[11px] text-faint tabular-nums">
                    {done}/{course.lessonCount}
                  </span>
                </span>
                <ProgressBar
                  value={done}
                  max={course.lessonCount}
                  label={`${course.title} progress`}
                  className="mt-1.5"
                />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
