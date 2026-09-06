import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import { ArrowRight, Lightbulb, Star } from "lucide-react";

const projects = [
  { title: "Placement Readiness Tracker", level: "Intermediate", stack: "Next.js, Prisma, Recharts" },
  { title: "Resume Keyword Optimizer", level: "Beginner", stack: "React, NLP basics, Tailwind" },
  { title: "Interview Practice Console", level: "Advanced", stack: "Node.js, AI API, PostgreSQL" },
];

export default function Projects() {
  return (
    <>
      <DashboardHeader title="Recommended projects" subtitle="Project suggestions that strengthen your target-role profile." />
      <div className="grid gap-5 md:grid-cols-3">
        {projects.map((project) => (
          <Panel key={project.title} className="rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-cyan/35">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan">
                <Lightbulb size={18} />
              </div>
              <Star size={16} className="text-warning" />
            </div>
            <div className="text-xs tracking-widest text-muted font-mono mb-2">{project.level.toUpperCase()}</div>
            <h2 className="font-bold text-ink">{project.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{project.stack}</p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-cyan">
              View brief <ArrowRight size={14} />
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
