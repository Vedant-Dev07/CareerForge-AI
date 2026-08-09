import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import Gauge from "@/components/ui/gauge";
import ScoreBar from "@/components/ui/score-bar";

const components = [
  { label: "Career match", value: 92 },
  { label: "Skills", value: 76 },
  { label: "Resume", value: 84 },
  { label: "Aptitude", value: 72 },
  { label: "Interview", value: 71 },
  { label: "Projects", value: 85 },
  { label: "Learning", value: 64 },
];

export default function Analytics() {
  return (
    <>
      <DashboardHeader title="Placement readiness analytics" subtitle="One score, built from every module." />

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <Panel className="p-8 md:col-span-1 flex flex-col items-center justify-center">
          <Gauge value={78} />
        </Panel>
        <Panel className="p-6 md:col-span-2">
          <div className="text-xs tracking-widest text-muted font-mono mb-5">
            COMPONENT SCORES
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {components.map((c) => (
              <ScoreBar key={c.label} label={c.label} value={c.value} accent={c.value >= 80 ? "#4FD1C5" : "#FF7A33"} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="p-6">
        <div className="text-xs tracking-widest text-muted font-mono mb-4">
          READINESS TREND
        </div>
        <div className="flex items-end gap-2 h-32">
          {[54, 58, 61, 65, 70, 74, 78].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-line relative" style={{ height: "100%" }}>
                <div
                  className="absolute bottom-0 w-full bg-cyan"
                  style={{ height: `${v}%` }}
                />
              </div>
              <span className="text-[10px] text-muted font-mono">W{i + 1}</span>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
