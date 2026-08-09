import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";

const skills = [
  { skill: "Python", required: 80, current: 75, gap: "Low" },
  { skill: "SQL", required: 85, current: 45, gap: "High" },
  { skill: "Excel", required: 75, current: 80, gap: "None" },
  { skill: "Statistics", required: 80, current: 60, gap: "Medium" },
  { skill: "Power BI", required: 80, current: 35, gap: "High" },
];

const gapColor: Record<string, string> = {
  None: "text-muted",
  Low: "text-cyan",
  Medium: "text-forge",
  High: "text-forge",
};

export default function Skills() {
  return (
    <>
      <DashboardHeader title="Skill gap analyzer" subtitle="Target role: Data Analyst" />
      <Panel className="p-6 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted font-mono border-b border-line">
              <th className="pb-3 font-normal">SKILL</th>
              <th className="pb-3 font-normal">REQUIRED</th>
              <th className="pb-3 font-normal">CURRENT</th>
              <th className="pb-3 font-normal">GAP</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((s) => (
              <tr key={s.skill} className="border-b border-line last:border-0">
                <td className="py-3 font-bold">{s.skill}</td>
                <td className="py-3 font-mono">{s.required}</td>
                <td className="py-3 font-mono">{s.current}</td>
                <td className={`py-3 font-mono ${gapColor[s.gap]}`}>{s.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <Panel className="p-6">
        <div className="text-xs tracking-widest text-muted font-mono mb-2">PRIORITY</div>
        <div className="font-bold">SQL → Power BI → Statistics</div>
      </Panel>
    </>
  );
}
