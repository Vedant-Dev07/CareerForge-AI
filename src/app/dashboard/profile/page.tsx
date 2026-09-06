import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";
import { BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react";

const cards = [
  { title: "Education", body: "Complete onboarding to add your college, degree, year, and academic details.", icon: GraduationCap },
  { title: "Skills", body: "Add your skills to see your strengths and gaps reflected here.", icon: Sparkles },
  { title: "Career goal", body: "Set a target role and career interests to personalize recommendations.", icon: BriefcaseBusiness },
];

export default function Profile() {
  return (
    <>
      <DashboardHeader title="Profile" subtitle="Personal information, education, skills and career interests." />

      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Panel key={card.title} className="rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-cyan/35">
                <Icon size={21} className="mb-4 text-cyan" />
                <div className="text-xs tracking-widest text-muted font-mono mb-3">{card.title.toUpperCase()}</div>
                <p className="text-sm text-muted leading-relaxed">{card.body}</p>
              </Panel>
            );
          })}
        </div>

        <Button icon={false}>Edit profile</Button>
      </div>
    </>
  );
}
