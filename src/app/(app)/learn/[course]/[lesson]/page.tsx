import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Target } from "lucide-react";
import {
  getAdjacentLessons,
  getCourse,
  getPublishedLesson,
  lessonHref,
  publishedLessons,
} from "@/data/learning";
import { Badge } from "@/components/ui/Badge";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { CompleteLessonButton } from "@/components/learn/CompleteLessonButton";
import { KnowledgeCheck } from "@/components/learn/KnowledgeCheck";
import { LessonContent } from "@/components/learn/LessonContent";
import { difficultyLabel } from "@/components/learn/LessonRow";

type Props = PageProps<"/learn/[course]/[lesson]">;

export function generateStaticParams() {
  return publishedLessons.map((l) => ({ course: l.courseId, lesson: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course, lesson } = await params;
  const found = getPublishedLesson(course, lesson);
  return found ? { title: found.title, description: found.summary } : { title: "Lesson not found" };
}

export default async function LessonPage({ params }: Props) {
  const { course: courseId, lesson: slug } = await params;
  const lesson = getPublishedLesson(courseId, slug);
  const course = getCourse(courseId);
  if (!lesson || !course) notFound();

  const { previous, next } = getAdjacentLessons(lesson);

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href={`/learn/${course.id}`}
        className="mb-4 inline-flex items-center gap-1.5 rounded-md text-sm text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
      >
        <ArrowLeft aria-hidden className="size-4" />
        {course.title}
      </Link>

      <header className="mb-6">
        <p className="mb-1 font-mono text-xs tracking-wider text-accent uppercase">
          Course {course.order} · Lesson {lesson.order}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{lesson.title}</h1>
        <p className="mt-2 text-muted">{lesson.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>
            <Clock aria-hidden className="size-3" />
            {lesson.minutes} min
          </Badge>
          <Badge>{difficultyLabel[lesson.difficulty]}</Badge>
        </div>
        <div className="mt-4">
          <BookmarkButton kind="lesson" itemId={lesson.id} returnTo={lessonHref(lesson)} />
        </div>
      </header>

      <section aria-labelledby="objectives" className="mb-8 rounded-xl border border-line bg-surface p-4 sm:p-5">
        <h2 id="objectives" className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <Target aria-hidden className="size-4 text-accent" />
          By the end of this lesson you can
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink/85 marker:text-faint">
          {lesson.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      <LessonContent blocks={lesson.blocks} />

      {lesson.quiz.length > 0 && (
        <div className="mt-10">
          <KnowledgeCheck lessonId={lesson.id} questions={lesson.quiz} />
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4">
        <p className="text-sm text-muted">Finished reading and practising?</p>
        <CompleteLessonButton lessonId={lesson.id} />
      </div>

      <nav aria-label="Lesson navigation" className="mt-6 grid gap-3 sm:grid-cols-2">
        {previous ? (
          <AdjacentLink href={lessonHref(previous)} direction="Previous" title={previous.title} />
        ) : (
          <span />
        )}
        {next && <AdjacentLink href={lessonHref(next)} direction="Next" title={next.title} />}
      </nav>
    </article>
  );
}

function AdjacentLink({ href, direction, title }: { href: string; direction: "Previous" | "Next"; title: string }) {
  const isNext = direction === "Next";
  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-xl border border-line bg-surface p-4 hover:border-line-strong focus-visible:outline-2 focus-visible:outline-accent ${isNext ? "sm:items-end sm:text-right" : ""}`}
    >
      <span className="inline-flex items-center gap-1 text-xs text-faint">
        {!isNext && <ArrowLeft aria-hidden className="size-3" />}
        {direction} lesson
        {isNext && <ArrowRight aria-hidden className="size-3" />}
      </span>
      <span className="mt-1 text-sm font-medium text-ink group-hover:text-accent">{title}</span>
    </Link>
  );
}
