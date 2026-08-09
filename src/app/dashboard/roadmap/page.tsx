import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import ScoreBar from "@/components/ui/score-bar";

const phases = [
  { title: "Phase 1 — Python & data handling", value: 80 },
  { title: "Phase 2 — SQL", value: 50 },
  { title: "Phase 3 — Statistics", value: 40 },
  { title: "Phase 4 — Power BI", value: 20 },
  { title: "Phase 5 — Real-world projects", value: 0 },
];

export default function Roadmap() {
  return (
    <>
      <DashboardHeader title="Data Analyst roadmap" subtitle="Sequenced from your skill-gap analysis." />
      <div className="space-y-4">
        {phases.map((p) => (
          <Panel key={p.title} className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">{p.title}</h3>
              <span className="text-xs font-mono text-muted">{p.value}%</span>
            </div>
            <ScoreBar label="" value={p.value} accent="#4FD1C5" />
            <div className="flex gap-4 mt-4 text-xs text-muted font-mono">
              <span>LEARN</span>
              <span>PRACTICE</span>
              <span>RESOURCE</span>
              <span>TASK</span>
              <span>PROJECT</span>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
