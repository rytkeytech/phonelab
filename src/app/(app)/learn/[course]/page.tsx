import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { courses, getCourse, getCourseLessons } from "@/data/learning";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { LessonRow } from "@/components/learn/LessonRow";
import { LessonSetProgress } from "@/components/learn/ProgressIndicators";

export function generateStaticParams() {
  return courses.map((c) => ({ course: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[course]">): Promise<Metadata> {
  const course = getCourse((await params).course);
  return { title: course?.title ?? "Course not found" };
}

export default async function CoursePage({ params }: PageProps<"/learn/[course]">) {
  const course = getCourse((await params).course);
  if (!course) notFound();

  const lessons = getCourseLessons(course.id);
  const published = lessons.filter((l) => l.status === "published");

  return (
    <>
      <Link
        href="/learn"
        className="mb-4 inline-flex items-center gap-1.5 rounded-md text-sm text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All courses
      </Link>
      <PageHeader eyebrow={`Course ${course.order}`} title={course.title} description={course.description} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Panel title="Lessons" description={`${lessons.length} planned · ${published.length} available now`}>
          <ol className="-mx-3 -my-1 divide-y divide-line">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <LessonRow lesson={lesson} />
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Your progress" className="self-start">
          <LessonSetProgress lessonIds={published.map((l) => l.id)} label={`${course.title} progress`} />
          <p className="mt-4 text-xs leading-relaxed text-faint">
            Lessons marked &ldquo;Coming soon&rdquo; are in the outline but not written yet. They are
            published only after their content has been checked.
          </p>
        </Panel>
      </div>
    </>
  );
}
