import { BookOpenCheck, Bookmark, Stethoscope, Target } from "lucide-react";
import {
  challenges,
  courses,
  recentRepairCases,
  recommendedLessons,
  sampleProgress,
  sampleStats,
} from "@/data/sample";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatTile } from "@/components/dashboard/StatTile";
import { CourseProgressList } from "@/components/dashboard/CourseProgressList";
import { ExplorerPreview } from "@/components/dashboard/ExplorerPreview";
import {
  ChallengeList,
  LessonList,
  RepairCaseList,
} from "@/components/dashboard/DashboardLists";
import { ConfidenceLegend } from "@/components/dashboard/ConfidenceLegend";

export default function DashboardPage() {
  const totalLessons = courses.reduce((sum, c) => sum + c.lessonCount, 0);
  const completedLessons = Object.values(sampleProgress).reduce((a, b) => a + b, 0);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Welcome back"
        description="Pick up where you left off, or try a diagnostic challenge."
      >
        <Badge tone="caution">Sample data</Badge>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          icon={BookOpenCheck}
          label="Lessons completed"
          value={`${completedLessons}/${totalLessons}`}
          detail={`${Math.round((completedLessons / totalLessons) * 100)}% of the curriculum`}
        />
        <StatTile icon={Stethoscope} label="Challenges solved" value={String(sampleStats.challengesSolved)} />
        <StatTile icon={Target} label="Average score" value={`${sampleStats.averageScore}%`} detail="Diagnostic game" />
        <StatTile icon={Bookmark} label="Saved cases" value={String(sampleStats.savedCases)} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel
          title="Learning path"
          description="Eight courses, from fundamentals to practical diagnosis"
          action={{ href: "/learn", label: "All courses" }}
          className="lg:col-span-2"
        >
          <CourseProgressList courses={courses} progress={sampleProgress} />
        </Panel>
        <ExplorerPreview />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Panel title="Recommended lessons" action={{ href: "/learn", label: "Learn" }}>
          <LessonList lessons={recommendedLessons} courses={courses} />
        </Panel>
        <Panel title="Diagnostic challenges" description="Simulated faults, not real readings" action={{ href: "/diagnose", label: "Play" }}>
          <ChallengeList challenges={challenges} />
        </Panel>
        <Panel
          title="Recently viewed repair cases"
          description="Fictional demo devices"
          action={{ href: "/repairs", label: "Repository" }}
          className="md:col-span-2 xl:col-span-1"
        >
          <RepairCaseList cases={recentRepairCases} />
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
