import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";

const projects = [
  { title: "Sales analytics dashboard", difficulty: "Intermediate", skills: "Python, Pandas, Power BI" },
  { title: "Customer churn prediction", difficulty: "Advanced", skills: "Python, ML, SQL" },
  { title: "E-commerce analysis", difficulty: "Intermediate", skills: "SQL, Python, Power BI" },
];

export default function Projects() {
  return (
    <>
      <DashboardHeader title="Recommended projects" subtitle="Chosen to close your current skill gaps." />
      <div className="grid md:grid-cols-3 gap-5">
        {projects.map((p) => (
          <Panel key={p.title} className="p-6 flex flex-col">
            <h3 className="font-bold text-sm mb-2">{p.title}</h3>
            <div className="text-xs text-forge font-mono mb-3">{p.difficulty.toUpperCase()}</div>
            <p className="text-xs text-muted mb-5">{p.skills}</p>
            <button className="mt-auto text-xs font-semibold px-4 py-2 border border-line hover:border-white/40 transition-colors self-start">
              View details
            </button>
          </Panel>
        ))}
      </div>
    </>
  );
}
