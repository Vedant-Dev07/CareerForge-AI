import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import ScoreBar from "@/components/ui/score-bar";
import { AlertTriangle, CheckCircle2, Code2 } from "lucide-react";

const gaps = [
  { skill: "System design", priority: "High", value: 42, note: "Build confidence with scalable architecture patterns." },
  { skill: "SQL", priority: "High", value: 55, note: "Practice joins, window functions, and optimization basics." },
  { skill: "Communication", priority: "Medium", value: 68, note: "Improve structured storytelling for interviews and standups." },
];

const strengths = ["JavaScript", "React", "Problem solving", "UI fundamentals"];

export default function Skills() {
  return (
    <>
      <DashboardHeader title="Skill gap analyzer" subtitle="Your next steps are visible and prioritized." />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] mb-6">
        <Panel className="rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs tracking-widest text-muted font-mono">SKILL INSIGHTS</div>
              <h2 className="mt-2 text-xl font-black text-ink">Priority gaps</h2>
            </div>
            <AlertTriangle className="text-warning" size={22} />
          </div>
          <div className="space-y-5">
            {gaps.map((gap) => (
              <div key={gap.skill} className="rounded-2xl border border-line bg-slate-50/80 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-ink">{gap.skill}</div>
                    <div className="text-xs text-muted">{gap.priority} priority</div>
                  </div>
                  <span className="rounded-full border border-warning/20 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                    Improve
                  </span>
                </div>
                <ScoreBar label="Current confidence" value={gap.value} accent="#F59E0B" />
                <p className="mt-3 text-sm leading-relaxed text-muted">{gap.note}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="rounded-2xl p-6">
          <div className="text-xs tracking-widest text-muted font-mono mb-4">STRENGTHS</div>
          <div className="grid gap-3">
            {strengths.map((skill) => (
              <div key={skill} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                <CheckCircle2 className="text-success" size={17} />
                <span className="text-sm font-semibold text-ink">{skill}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-cyan/20 bg-cyan/10 p-4">
            <Code2 className="mb-3 text-cyan" size={21} />
            <p className="text-sm leading-relaxed text-muted">
              Keep strengths visible while you close gaps. This helps balance confidence with focus.
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
}
