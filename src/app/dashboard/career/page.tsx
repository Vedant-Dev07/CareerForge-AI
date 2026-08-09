import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";

const careers = [
  { role: "Data Analyst", match: 92 },
  { role: "Data Engineer", match: 86 },
  { role: "ML Engineer", match: 79 },
  { role: "Software Developer", match: 75 },
];

export default function Career() {
  return (
    <>
      <DashboardHeader title="Discover your best career path" subtitle="Ranked by fit against your profile." />
      <div className="space-y-3 mb-10">
        {careers.map((c) => (
          <Panel key={c.role} className="p-5 flex items-center justify-between">
            <span className="font-bold text-sm">{c.role}</span>
            <div className="flex items-center gap-4 w-1/2">
              <div className="h-1.5 flex-1 bg-line overflow-hidden">
                <div className="h-full bg-cyan" style={{ width: `${c.match}%` }} />
              </div>
              <span className="text-sm font-mono w-10 text-right">{c.match}%</span>
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="p-6">
        <div className="text-xs tracking-widest text-muted font-mono mb-4">
          DATA ANALYST — CAREER OVERVIEW
        </div>
        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-muted mb-1">Required skills</div>
            <div>Python, SQL, Excel, Statistics, Power BI</div>
          </div>
          <div>
            <div className="text-muted mb-1">Your skills</div>
            <div>Python, Excel, basic SQL</div>
          </div>
          <div>
            <div className="text-muted mb-1">Skill gaps</div>
            <div>SQL, Power BI, Statistics</div>
          </div>
          <div>
            <div className="text-muted mb-1">Interview topics</div>
            <div>Joins, window functions, A/B testing basics</div>
          </div>
        </div>
      </Panel>
    </>
  );
}
