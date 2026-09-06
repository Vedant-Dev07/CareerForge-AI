import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";
import { CheckCircle2, Globe } from "lucide-react";

const sections = [
  "Profile", "About", "Education", "Skills", "Projects",
  "Certifications", "Achievements", "Experience", "Resume", "GitHub", "LinkedIn",
];

export default function Portfolio() {
  return (
    <>
      <DashboardHeader title="Digital career portfolio" subtitle="A shareable summary of your work, built from your profile." />

      <div className="flex flex-wrap gap-3 mb-6">
        <Button icon={false} variant="secondary">Preview portfolio</Button>
        <Button icon={false} variant="secondary">Edit portfolio</Button>
        <Button icon={false}>Share portfolio</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Panel key={s} className="rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-cyan/35">
            <div className="mb-4 flex items-center justify-between">
              <Globe size={17} className="text-cyan" />
              <CheckCircle2 size={15} className="text-success" />
            </div>
            <span className="text-sm font-bold text-ink">{s}</span>
          </Panel>
        ))}
      </div>
    </>
  );
}
