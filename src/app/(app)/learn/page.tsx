import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { courses, getCourseLessons } from "@/data/learning";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { LessonSetProgress, ResetProgressButton } from "@/components/learn/ProgressIndicators";

export const metadata: Metadata = {
  title: "Learning Centre",
};

export default function LearnPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning Centre"
        title="Courses and lessons"
        description="Eight courses from electronics fundamentals to practical fault diagnosis. New lessons are published as they are written and checked."
      >
        <Badge>Progress saved in this browser</Badge>
      </PageHeader>

      <ol className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => {
          const lessons = getCourseLessons(course.id);
          const published = lessons.filter((l) => l.status === "published");
          return (
            <li key={course.id}>
              <Link
                href={`/learn/${course.id}`}
                className="group flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition-colors hover:border-line-strong hover:bg-raised/40 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-canvas font-mono text-sm text-accent">
                    {course.order}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-ink">{course.title}</h2>
                    <p className="mt-1 text-sm text-muted">{course.description}</p>
                  </div>
                  <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <p className="mt-4 mb-3 text-xs text-faint">
                  {lessons.length} lessons planned · {published.length} available now
                </p>
                <div className="mt-auto">
                  <LessonSetProgress
                    lessonIds={published.map((l) => l.id)}
                    label={`${course.title} progress`}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex justify-end">
        <ResetProgressButton />
      </div>
    </>
  );
}
