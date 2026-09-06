import DashboardHeader from "@/components/dashboard/header";
import StatCard from "@/components/dashboard/stat-card";
import Panel from "@/components/ui/panel";
import ScoreBar from "@/components/ui/score-bar";
import { Activity, BarChart3, LineChart, Target } from "lucide-react";

const metrics = [
  { label: "Readiness", value: "78%", detail: "Up 12 points this month", icon: Target, accent: "cyan" as const },
  { label: "Consistency", value: "5d", detail: "Weekly active streak", icon: Activity, accent: "success" as const },
  { label: "Growth", value: "+18%", detail: "Practice improvement", icon: LineChart, accent: "forge" as const },
];

const breakdown = [
  { label: "Skills", value: 76 },
  { label: "Resume", value: 84 },
  { label: "Aptitude", value: 72 },
  { label: "Interview", value: 71 },
];

export default function Analytics() {
  return (
    <>
      <DashboardHeader title="Readiness analytics" subtitle="Progress insights across your placement preparation." />

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>

      <Panel className="rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs tracking-widest text-muted font-mono">TREND SUMMARY</div>
            <h2 className="mt-2 text-xl font-black text-ink">Readiness by component</h2>
          </div>
          <BarChart3 className="text-cyan" size={22} />
        </div>
        <div className="space-y-4">
          {breakdown.map((item) => (
            <ScoreBar key={item.label} label={item.label} value={item.value} accent="#2563EB" />
          ))}
        </div>
      </Panel>
    </>
  );
}
