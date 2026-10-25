import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Repair Repository",
};

export default function RepairsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Repair Repository"
        title="Documented repair cases"
        description="Search by model, platform, fault category and symptom. Every case shows its evidence and confidence level."
      />
      <EmptyState
        icon={Wrench}
        title="The repository is being built"
        description="Search, filters and full repair-case pages arrive in Stage 3. Cases will only be published after review."
        action={{ href: "/explorer", label: "Open Chipset Explorer" }}
      />
    </>
  );
}
