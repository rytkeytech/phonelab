import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Learning Centre",
};

export default function LearnPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning Centre"
        title="Courses and lessons"
        description="Eight courses from electronics fundamentals to practical fault diagnosis."
      />
      <EmptyState
        icon={BookOpen}
        title="Lessons are being built"
        description="Course pages, lessons, knowledge checks and progress tracking arrive in Stage 3. Meanwhile, the Chipset Explorer is ready to use."
        action={{ href: "/explorer", label: "Open Chipset Explorer" }}
      />
    </>
  );
}
