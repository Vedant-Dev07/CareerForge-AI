import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";

export default function Profile() {
  return (
    <>
      <DashboardHeader title="Profile" subtitle="Personal information, education, skills and career interests." />

      <div className="space-y-5">
        <Panel className="p-6">
          <div className="text-xs tracking-widest text-muted font-mono mb-4">EDUCATION</div>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted block mb-1">College</span>NIT Warangal</div>
            <div><span className="text-muted block mb-1">Degree / branch</span>B.Tech, CSE</div>
            <div><span className="text-muted block mb-1">Year / CGPA</span>3rd year · 8.4</div>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="text-xs tracking-widest text-muted font-mono mb-4">SKILLS</div>
          <div className="flex flex-wrap gap-2">
            {["Python", "SQL", "Excel", "React", "Pandas"].map((s) => (
              <span key={s} className="text-xs px-3 py-1.5 border border-line text-muted">
                {s}
              </span>
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="text-xs tracking-widest text-muted font-mono mb-4">CAREER GOAL</div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted block mb-1">Target role</span>Data Analyst</div>
            <div><span className="text-muted block mb-1">Preferred domain</span>Product analytics</div>
            <div><span className="text-muted block mb-1">Target companies</span>Mid-size product companies</div>
            <div><span className="text-muted block mb-1">Placement timeline</span>6 months</div>
          </div>
        </Panel>

        <Button icon={false}>Save changes</Button>
      </div>
    </>
  );
}
