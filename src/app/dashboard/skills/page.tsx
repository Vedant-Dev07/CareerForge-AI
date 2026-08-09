import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";

const gaps = [
  { skill: "System design", priority: "High", note: "Build confidence with scalable architecture patterns." },
  { skill: "SQL", priority: "High", note: "Practice joins, window functions, and optimization basics." },
  { skill: "Communication", priority: "Medium", note: "Improve structured storytelling for interviews and standups." },
];

export default function Skills() {
  return (
    <>
      <DashboardHeader title="Skill gap analyzer" subtitle="Your next steps are now visible and prioritized." />
      <Panel className="p-6 mb-6">
        <div className="text-xs tracking-widest text-muted font-mono mb-3">SKILL INSIGHTS</div>
        <p className="text-sm text-muted leading-relaxed">
          CareerForge AI highlights the skills you need most to improve your fit for the roles you want.
        </p>
      </Panel>
      <div className="grid gap-4 md:grid-cols-3">
        {gaps.map((gap) => (
          <Panel key={gap.skill} className="p-5 rounded-2xl">
            <div className="text-xs tracking-widest text-forge font-mono mb-2">{gap.priority} PRIORITY</div>
            <div className="font-bold mb-2">{gap.skill}</div>
            <p className="text-sm text-muted leading-relaxed">{gap.note}</p>
          </Panel>
        ))}
      </div>
    </>
  );
}
