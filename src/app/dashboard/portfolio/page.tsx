import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";

const sections = [
  "Profile", "About", "Education", "Skills", "Projects",
  "Certifications", "Achievements", "Experience", "Resume", "GitHub", "LinkedIn",
];

export default function Portfolio() {
  return (
    <>
      <DashboardHeader title="Digital career portfolio" subtitle="A shareable summary of your work, built from your profile." />

      <div className="flex gap-3 mb-6">
        <Button icon={false} variant="secondary">Preview portfolio</Button>
        <Button icon={false} variant="secondary">Edit portfolio</Button>
        <Button icon={false}>Share portfolio</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Panel key={s} className="p-5">
            <span className="text-sm font-bold">{s}</span>
          </Panel>
        ))}
      </div>
    </>
  );
}
