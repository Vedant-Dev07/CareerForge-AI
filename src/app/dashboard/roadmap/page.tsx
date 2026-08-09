import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";

const roadmap = [
  { week: "Week 1", focus: "Strengthen core fundamentals" },
  { week: "Week 2", focus: "Practice SQL and data handling" },
  { week: "Week 3", focus: "Complete one role-based project" },
  { week: "Week 4", focus: "Prepare for interviews and resume refinement" },
];

export default function Roadmap() {
  return (
    <>
      <DashboardHeader title="Learning roadmap" subtitle="A clear path is now mapped from your current state to placement readiness." />
      <Panel className="p-6 mb-6">
        <div className="text-xs tracking-widest text-muted font-mono mb-3">PERSONALIZED PLAN</div>
        <p className="text-sm text-muted leading-relaxed">
          This roadmap turns your career target and skill gaps into a practical sequence of milestones.
        </p>
      </Panel>
      <div className="grid gap-4 md:grid-cols-2">
        {roadmap.map((step) => (
          <Panel key={step.week} className="p-5 rounded-2xl">
            <div className="text-xs tracking-widest text-cyan font-mono mb-2">{step.week}</div>
            <div className="font-bold">{step.focus}</div>
          </Panel>
        ))}
      </div>
    </>
  );
}
