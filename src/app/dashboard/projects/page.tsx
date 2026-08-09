import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";

export default function Projects() {
  return (
    <>
      <DashboardHeader title="Recommended projects" subtitle="Project suggestions will appear once your profile is complete." />
      <Panel className="p-6">
        <p className="text-sm text-muted leading-relaxed">
          Build profile and skill details to receive tailored project recommendations.
        </p>
      </Panel>
    </>
  );
}
