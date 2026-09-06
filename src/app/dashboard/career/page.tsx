import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import ScoreBar from "@/components/ui/score-bar";
import { BriefcaseBusiness, CheckCircle2, Target } from "lucide-react";

const recommendations = [
  { role: "Software Engineer", fit: 92, proof: "Strong match with your coding and problem-solving profile." },
  { role: "Frontend Developer", fit: 87, proof: "Aligned with your UI, product, and design interests." },
  { role: "Data Analyst", fit: 81, proof: "Great fit if you strengthen SQL and visualization skills." },
];

export default function Career() {
  return (
    <>
      <DashboardHeader title="Career recommendations" subtitle="Your profile is shaping a tailored placement path." />

      <Panel className="rounded-2xl p-6 mb-6">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="text-xs tracking-widest text-muted font-mono mb-2">AI MATCHING</div>
            <h2 className="text-2xl font-black text-ink">Best-fit roles for your current profile</h2>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              CareerForge AI compares your signals with role expectations and highlights where you are already strong.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Skills", "Projects", "Goals"].map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-slate-50 px-4 py-4 text-center">
                <Target className="mx-auto mb-2 text-cyan" size={18} />
                <div className="text-xs font-bold text-muted">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        {recommendations.map((item) => (
          <Panel key={item.role} className="rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-cyan/35">
            <div className="mb-5 flex items-center justify-between">
              <BriefcaseBusiness size={20} className="text-cyan" />
              <CheckCircle2 size={17} className="text-success" />
            </div>
            <div className="text-xs tracking-widest text-cyan font-mono mb-2">{item.fit}% FIT</div>
            <div className="font-bold text-ink mb-3">{item.role}</div>
            <ScoreBar label="Match strength" value={item.fit} accent="#2563EB" />
            <p className="mt-4 text-sm text-muted leading-relaxed">{item.proof}</p>
          </Panel>
        ))}
      </div>
    </>
  );
}
