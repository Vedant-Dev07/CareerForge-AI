import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import { BarChart3, Bot, BriefcaseBusiness, CheckCircle2 } from "lucide-react";

const modules = [
  { n: "01", title: "AI career recommendation", body: "Find suitable career roles based on your profile, skills, interests, education, and goals." },
  { n: "02", title: "Skill gap analyzer", body: "Compare current competencies with the skills required for the selected career." },
  { n: "03", title: "Personalized learning roadmap", body: "Generate a structured learning path based on identified skill gaps." },
  { n: "04", title: "Resume analyzer", body: "Analyze resume content, structure, keywords, and ATS compatibility." },
  { n: "05", title: "Aptitude preparation", body: "Practice quantitative aptitude, logical reasoning, and verbal ability." },
  { n: "06", title: "Project recommendation", body: "Get projects aligned with your target role and skill-development needs." },
  { n: "07", title: "AI mock interview", body: "Practice technical, HR, and role-specific interviews with AI-generated feedback." },
  { n: "08", title: "Placement readiness analytics", body: "Track overall preparation using measurable performance indicators." },
  { n: "09", title: "AI career mentor", body: "Get personalized guidance based on your profile and progress." },
  { n: "10", title: "Digital portfolio", body: "Create and maintain a professional career portfolio." },
  { n: "11", title: "Continuous AI suggestions", body: "Receive recommendations based on changing performance and learning progress." },
];

const featureHighlights = [
  { label: "Career", icon: BriefcaseBusiness },
  { label: "Analytics", icon: BarChart3 },
  { label: "Mentor", icon: Bot },
];

export default function Features() {
  return (
    <>
      <SiteNav />
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <SectionLabel>FEATURES</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-ink">
              Eleven modules. One journey.
            </h1>
            <p className="text-muted max-w-xl">
              Every module below shares data with the others. Nothing here is a standalone tool.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {featureHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-line bg-white p-4 text-center shadow-sm">
                  <Icon className="mx-auto mb-2 text-cyan" size={20} />
                  <div className="text-xs font-bold text-muted">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {modules.map((m) => (
            <Panel key={m.n} className="group rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-cyan/35">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xs text-forge font-mono">{m.n}</div>
                <CheckCircle2 size={16} className="text-success opacity-70" />
              </div>
              <h3 className="font-bold text-base mb-2 text-ink">{m.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{m.body}</p>
            </Panel>
          ))}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
