import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";

const modules = [
  { n: "01", title: "AI career recommendation", body: "Find suitable career roles based on your profile, skills, interests, education and goals." },
  { n: "02", title: "Skill gap analyzer", body: "Compare current competencies with the skills required for the selected career." },
  { n: "03", title: "Personalized learning roadmap", body: "Generate a structured learning path based on identified skill gaps." },
  { n: "04", title: "Resume analyzer", body: "Analyze resume content, structure, keywords and ATS compatibility." },
  { n: "05", title: "Aptitude preparation", body: "Practice quantitative aptitude, logical reasoning and verbal ability." },
  { n: "06", title: "Project recommendation", body: "Get projects aligned with your target role and skill-development needs." },
  { n: "07", title: "AI mock interview", body: "Practice technical, HR and role-specific interviews with AI-generated feedback." },
  { n: "08", title: "Placement readiness analytics", body: "Track overall preparation using measurable performance indicators." },
  { n: "09", title: "AI career mentor", body: "Get personalized guidance based on your profile and progress." },
  { n: "10", title: "Digital portfolio", body: "Create and maintain a professional career portfolio." },
  { n: "11", title: "Continuous AI suggestions", body: "Receive recommendations based on changing performance and learning progress." },
];

export default function Features() {
  return (
    <>
      <SiteNav />
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 bg-grid bg-grid">
        <SectionLabel>FEATURES</SectionLabel>
        <h1 className="text-4xl font-black tracking-tight uppercase mb-4">
          Eleven modules. One journey.
        </h1>
        <p className="text-muted max-w-xl mb-12">
          Every module below shares data with the others — nothing here is a
          standalone tool.
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {modules.map((m) => (
            <Panel key={m.n} className="p-6">
              <div className="text-xs text-forge font-mono mb-3">{m.n}</div>
              <h3 className="font-bold text-base mb-2">{m.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{m.body}</p>
            </Panel>
          ))}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
