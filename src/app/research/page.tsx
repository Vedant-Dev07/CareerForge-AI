import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";

const layers = [
  { title: "Career AI", items: ["Career matching", "Ranking against profile", "Role fit scoring"] },
  { title: "Resume AI", items: ["Parsing", "ATS scoring", "Keyword and formatting feedback"] },
  { title: "Interview AI", items: ["Adaptive questioning", "Answer evaluation", "Structured feedback"] },
  { title: "Mentor AI", items: ["Contextual guidance", "Progress-aware suggestions", "Open Q&A"] },
];

export default function Research() {
  return (
    <>
      <SiteNav />
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 bg-grid bg-grid">
        <SectionLabel>RESEARCH / TECHNOLOGY</SectionLabel>
        <h1 className="text-4xl font-black tracking-tight uppercase mb-4">
          AI that understands your career journey.
        </h1>
        <p className="text-muted max-w-2xl mb-12">
          Most existing tools address one slice of placement prep in
          isolation — resume analysis, or career guidance, or interview
          practice. CareerForge AI&apos;s contribution is the connected workflow:
          one profile, four specialized AI services, and a single readiness
          score that updates as every module reports back.
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {layers.map((l) => (
            <Panel key={l.title} className="p-6">
              <h3 className="font-bold text-base mb-3">{l.title}</h3>
              <ul className="space-y-1.5">
                {l.items.map((it) => (
                  <li key={it} className="text-sm text-muted flex items-center gap-2">
                    <span className="w-1 h-1 bg-cyan rotate-45 shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
        <SectionLabel>STACK</SectionLabel>
        <Panel className="p-6">
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted">Frontend</span><br />Next.js, React, TypeScript, Tailwind CSS</div>
            <div><span className="text-muted">Backend</span><br />Node.js / Express, PostgreSQL, Prisma</div>
            <div><span className="text-muted">AI / Data</span><br />Gemini API, NLP, Pandas, NumPy</div>
            <div><span className="text-muted">Visualization</span><br />Recharts</div>
            <div><span className="text-muted">Deployment</span><br />Vercel / Render</div>
          </div>
        </Panel>
      </section>
      <SiteFooter />
    </>
  );
}
