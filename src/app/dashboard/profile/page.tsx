"use client";

import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import ProfileForm from "@/components/profile-form";
import { BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react";

const cards = [
  { title: "Education", body: "Keep your college and degree details current for better recommendations.", icon: GraduationCap },
  { title: "Skills", body: "Add comma-separated skills so your strengths and gaps stay up to date.", icon: Sparkles },
  { title: "Career goal", body: "Update your target role and interests to personalize your placement plan.", icon: BriefcaseBusiness },
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
                <div className="mb-3 text-xs tracking-widest text-muted font-mono">{card.title.toUpperCase()}</div>
                <p className="text-sm leading-relaxed text-muted">{card.body}</p>
              </Panel>
            );
          })}
        </div>
        <Panel className="rounded-2xl p-8">
          <ProfileForm />
        </Panel>
      </div>
    </>
  );
}
