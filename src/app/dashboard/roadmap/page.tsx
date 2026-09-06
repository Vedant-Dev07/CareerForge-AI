import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import ScoreBar from "@/components/ui/score-bar";
import { CalendarDays, CheckCircle2, Route } from "lucide-react";

const roadmap = [
  { week: "Week 1", focus: "Strengthen core fundamentals", progress: 80 },
  { week: "Week 2", focus: "Practice SQL and data handling", progress: 55 },
  { week: "Week 3", focus: "Complete one role-based project", progress: 30 },
  { week: "Week 4", focus: "Prepare for interviews and resume refinement", progress: 15 },
];

export default function Roadmap() {
  return (
    <>
      <DashboardHeader title="Learning roadmap" subtitle="A clear path from your current state to placement readiness." />

      <Panel className="rounded-2xl p-6 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs tracking-widest text-muted font-mono mb-2">PERSONALIZED PLAN</div>
            <h2 className="text-2xl font-black text-ink">4-week placement sprint</h2>
            <p className="mt-2 text-sm text-muted">Your career target and skill gaps are translated into weekly milestones.</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan">
            <Route size={26} />
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        {roadmap.map((step, index) => (
          <Panel key={step.week} className="rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-cyan/35">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-forge/20 bg-forge/10 text-sm font-black text-forge">
                  {index + 1}
                </div>
                <div>
                  <div className="text-xs tracking-widest text-cyan font-mono">{step.week}</div>
                  <div className="font-bold text-ink">{step.focus}</div>
                </div>
              </div>
              {step.progress >= 75 ? <CheckCircle2 size={18} className="text-success" /> : <CalendarDays size={18} className="text-muted" />}
            </div>
            <ScoreBar label="Milestone progress" value={step.progress} accent={step.progress >= 75 ? "#16A34A" : "#2563EB"} />
          </Panel>
        ))}
      </div>
    </>
  );
}
