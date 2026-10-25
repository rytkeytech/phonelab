import { Bookmark, Stethoscope, Target } from "lucide-react";
import { challenges, sampleStats } from "@/data/sample";
import { getLatestRepairCases } from "@/data/repairs";
import { courses, getCourse, getCourseLessons, lessonHref, publishedLessons } from "@/data/learning";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatTile } from "@/components/dashboard/StatTile";
import { ExplorerPreview } from "@/components/dashboard/ExplorerPreview";
import { ChallengeList, RepairCaseList } from "@/components/dashboard/DashboardLists";
import { ConfidenceLegend } from "@/components/dashboard/ConfidenceLegend";
import {
  LearningPathList,
  LessonsCompletedTile,
  RecommendedLessons,
  type CourseSummary,
  type LessonLink,
} from "@/components/dashboard/DashboardLearning";

export default function DashboardPage() {
  const courseSummaries: CourseSummary[] = courses.map((course) => {
    const lessons = getCourseLessons(course.id);
    return {
      id: course.id,
      order: course.order,
      title: course.title,
      publishedIds: lessons.filter((l) => l.status === "published").map((l) => l.id),
    };
  });

  const lessonLinks: LessonLink[] = publishedLessons.map((l) => ({
    id: l.id,
    href: lessonHref(l),
    title: l.title,
    courseTitle: getCourse(l.courseId)?.title ?? "",
    minutes: l.minutes,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Welcome back"
        description="Pick up where you left off, or try a diagnostic challenge."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <LessonsCompletedTile publishedIds={publishedLessons.map((l) => l.id)} />
        <StatTile icon={Stethoscope} label="Challenges solved" value={String(sampleStats.challengesSolved)} detail="Sample data" />
        <StatTile icon={Target} label="Average score" value={`${sampleStats.averageScore}%`} detail="Sample data" />
        <StatTile icon={Bookmark} label="Saved cases" value={String(sampleStats.savedCases)} detail="Sample data" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel
          title="Learning path"
          description="Your progress across the eight courses"
          action={{ href: "/learn", label: "All courses" }}
          className="lg:col-span-2"
        >
          <LearningPathList courses={courseSummaries} />
        </Panel>
        <ExplorerPreview />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Panel title="Up next" description="Lessons you haven't completed yet" action={{ href: "/learn", label: "Learn" }}>
          <RecommendedLessons lessons={lessonLinks} />
        </Panel>
        <Panel title="Diagnostic challenges" description="Simulated faults, not real readings" action={{ href: "/diagnose", label: "Play" }}>
          <div className="mb-2">
            <Badge tone="caution">Sample data</Badge>
          </div>
          <ChallengeList challenges={challenges} />
        </Panel>
        <Panel
          title="Latest repair cases"
          description="Fictional demo devices"
          action={{ href: "/repairs", label: "Repository" }}
          className="md:col-span-2 xl:col-span-1"
        >
          <div className="mb-2">
            <Badge tone="caution">Sample data</Badge>
          </div>
          <RepairCaseList cases={getLatestRepairCases(3)} />
        </Panel>
      </div>

      <Panel
        title="How PhoneLab labels confidence"
        description="Every repair case carries one of these labels, so you always know how much to trust it."
        className="mt-4"
      >
        <ConfidenceLegend />
      </Panel>
    </>
  );
}
