import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";

export default function Analytics() {
  return (
    <>
      <DashboardHeader title="Readiness analytics" subtitle="Your progress insights will appear once you complete your profile." />

      <Panel className="p-6">
        <p className="text-sm text-muted leading-relaxed">
          Connect your profile, assessments, and activity to see a comprehensive readiness score and trend chart.
        </p>
      </Panel>
    </>
  );
}
