import type { Lesson } from "@/lib/types";
import { courses } from "./courses";
import { bootLessons } from "./lessons-boot";
import { clocksLessons } from "./lessons-clocks";
import { fundamentalsLessons } from "./lessons-fundamentals";
import { powerLessons } from "./lessons-power";
import { plannedLessons } from "./planned";

/*
 * Learning content. Lives in code for now; moves to Supabase (courses,
 * lessons, quizzes tables) once the database is connected.
 */

export { courses };

const courseOrder = new Map(courses.map((c) => [c.id, c.order]));

/** Every lesson in curriculum order: by course, then by lesson order. */
export const lessons: Lesson[] = [
  ...fundamentalsLessons,
  ...powerLessons,
  ...bootLessons,
  ...clocksLessons,
  ...plannedLessons,
].sort(
  (a, b) =>
    (courseOrder.get(a.courseId) ?? 0) - (courseOrder.get(b.courseId) ?? 0) ||
    a.order - b.order,
);

export const publishedLessons = lessons.filter((l) => l.status === "published");

export function getCourse(courseId: string) {
  return courses.find((c) => c.id === courseId);
}

export function getCourseLessons(courseId: string) {
  return lessons.filter((l) => l.courseId === courseId);
}

/** Returns a lesson only if it is published; planned lessons have no page. */
export function getPublishedLesson(courseId: string, slug: string) {
  return publishedLessons.find((l) => l.courseId === courseId && l.slug === slug);
}

export function lessonHref(lesson: Pick<Lesson, "courseId" | "slug">) {
  return `/learn/${lesson.courseId}/${lesson.slug}`;
}

/** Previous and next published lessons across the whole curriculum. */
export function getAdjacentLessons(lesson: Lesson) {
  const i = publishedLessons.findIndex((l) => l.id === lesson.id);
  return {
    previous: i > 0 ? publishedLessons[i - 1] : undefined,
    next: i >= 0 && i < publishedLessons.length - 1 ? publishedLessons[i + 1] : undefined,
  };
}
