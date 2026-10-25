import type { Metadata } from "next";
import { Stethoscope } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Diagnostic Game",
};

export default function DiagnosePage() {
  return (
    <>
      <PageHeader
        eyebrow="Diagnostic Game"
        title="Diagnose a simulated fault"
        description="Choose tests, read simulated measurements, and decide the next step. All readings in this game are simulated."
      />
      <EmptyState
        icon={Stethoscope}
        title="Scenarios are being built"
        description="The diagnostic simulator arrives in Stage 3. Until then, use the Chipset Explorer's symptom search to practise linking symptoms to blocks."
        action={{ href: "/explorer", label: "Open Chipset Explorer" }}
      />
    </>
  );
}
