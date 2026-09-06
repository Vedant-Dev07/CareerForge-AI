import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import { BrainCircuit, CheckCircle2 } from "lucide-react";

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
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <SectionLabel>RESEARCH / TECHNOLOGY</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-ink">
              AI that understands your career journey.
            </h1>
            <p className="text-muted max-w-2xl">
              Most existing tools address one slice of placement prep in isolation. CareerForge AI connects one profile,
              specialized AI services, and a single readiness score that updates as each module reports back.
            </p>
          </div>
          <Panel className="rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan">
                <BrainCircuit size={24} />
              </div>
              <div>
                <div className="text-xs font-mono tracking-[0.18em] text-muted">SYSTEM MODEL</div>
                <div className="mt-1 text-lg font-black text-ink">One profile, many signals</div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="grid md:grid-cols-2 gap-5 my-16">
          {layers.map((l) => (
            <Panel key={l.title} className="rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-cyan/35">
              <h3 className="font-bold text-base mb-3 text-ink">{l.title}</h3>
              <ul className="space-y-2">
                {l.items.map((it) => (
                  <li key={it} className="text-sm text-muted flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-success shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>

        <SectionLabel>STACK</SectionLabel>
        <Panel className="rounded-2xl p-6">
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted">Frontend</span><br />Next.js, React, TypeScript, Tailwind CSS</div>
            <div><span className="text-muted">Backend</span><br />Node.js, PostgreSQL, Prisma</div>
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
