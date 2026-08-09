import { ChevronRight, Compass, Route, Gauge as GaugeIcon, FileSearch, Calculator, MessagesSquare, Bot, Sparkles, BrainCircuit } from "lucide-react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";
import ScoreBar from "@/components/ui/score-bar";
import SectionLabel from "@/components/ui/section-label";

const problems = [
  { title: "Fragmented resources", body: "Students use different platforms for every part of prep." },
  { title: "Lack of personalization", body: "Generic prep ignores individual strengths and weaknesses." },
  { title: "Hidden skill gaps", body: "Students often don't know which skills they're missing." },
  { title: "Resume challenges", body: "ATS compatibility and presentation are hard to get right alone." },
  { title: "Interview uncertainty", body: "Few chances for real, personalized interview practice." },
  { title: "No unified progress view", body: "No single place to see overall placement readiness." },
];

const modules = [
  { n: "01", title: "AI career recommendation", body: "Find roles that fit your profile, skills, interests and goals." },
  { n: "02", title: "Skill gap analyzer", body: "See current competencies against what the role actually needs." },
  { n: "03", title: "Personalized roadmap", body: "A structured learning path built from your specific gaps." },
  { n: "04", title: "Resume analyzer", body: "Content, structure, keywords and ATS compatibility, scored." },
  { n: "05", title: "Aptitude preparation", body: "Quantitative, logical reasoning and verbal ability practice." },
  { n: "06", title: "Project recommendation", body: "Projects aligned to your target role and skill gaps." },
  { n: "07", title: "AI mock interview", body: "Technical, HR and role-specific rounds with real feedback." },
  { n: "08", title: "Placement readiness analytics", body: "Track preparation with measurable indicators." },
  { n: "09", title: "AI career mentor", body: "Guidance grounded in your own profile and progress." },
  { n: "10", title: "Digital portfolio", body: "A professional, shareable portfolio built from your work." },
  { n: "11", title: "Continuous AI suggestions", body: "Recommendations that adapt as your performance changes." },
];

const steps = [
  { n: "01", title: "Create profile", body: "Set up your student profile." },
  { n: "02", title: "Analyze skills", body: "CareerForge AI reads your skills and background." },
  { n: "03", title: "Choose career", body: "Select or receive a recommended career path." },
  { n: "04", title: "Follow roadmap", body: "Work through your personalized preparation plan." },
  { n: "05", title: "Track readiness", body: "Continuously evaluate and improve your score." },
];

export default function Home() {
  return (
    <>
      <SiteNav />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        <div>
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] mb-6 text-cyan font-mono">
            <span>CFA — 001</span>
            <span className="text-line">/</span>
            <span>THE INTELLIGENT PLACEMENT TUTOR</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tight mb-6 text-ink">
            Build your career.
            <br />
            <span className="text-cyan">Prepare with intelligence.</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-8 max-w-xl text-muted">
            CareerForge AI creates a personalized placement journey based on your skills, goals, performance, and career interests — all in one trusted platform.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button href="/register">Get started</Button>
            <Button href="/features" variant="secondary" icon={false}>
              Explore platform <ChevronRight size={15} />
            </Button>
          </div>
        </div>

        <Panel className="p-6 rounded-[28px]">
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-muted font-mono mb-4">
            <BrainCircuit size={14} className="text-cyan" />
            <span>PLACEMENT READINESS</span>
          </div>
          <div className="text-5xl font-black font-mono text-cyan mb-4">78%</div>
          <div className="h-1.5 w-full bg-line overflow-hidden mb-6">
            <div className="h-full bg-forge" style={{ width: "78%" }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ScoreBar label="Career match" value={92} accent="#4FD1C5" />
            <ScoreBar label="Resume score" value={84} />
            <ScoreBar label="Skills" value={76} accent="#4FD1C5" />
            <ScoreBar label="Interview" value={71} />
          </div>
        </Panel>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-line">
        <SectionLabel>WHY CAREERFORGE AI?</SectionLabel>
        <h2 className="text-3xl font-black tracking-tight mb-12 max-w-xl text-ink">
          A professional platform for career clarity and placement readiness.
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {problems.map((p) => (
            <Panel key={p.title} className="p-6 rounded-2xl">
              <h3 className="font-bold text-base mb-2">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{p.body}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-line">
        <SectionLabel>EVERYTHING IN ONE PLACE</SectionLabel>
        <h2 className="text-3xl font-black tracking-tight mb-12 max-w-xl text-ink">
          Career guidance, skill gap analysis, interview prep, and roadmap planning in one intelligent workspace.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => (
            <Panel key={m.n} className="p-6 rounded-2xl">
              <div className="text-xs text-forge font-mono mb-3">{m.n}</div>
              <h3 className="font-bold text-sm mb-1.5">{m.title}</h3>
              <p className="text-xs leading-relaxed text-muted">{m.body}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section id="how" className="max-w-6xl mx-auto px-6 py-20 border-t border-line">
        <SectionLabel>HOW IT WORKS</SectionLabel>
        <h2 className="text-3xl font-black tracking-tight mb-12 max-w-xl text-ink">
          Profile → Analyze → Prepare → Practice → Improve.
        </h2>
        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-line bg-panel/70 p-5">
              <div className="text-xs text-forge font-mono mb-3">{s.n}</div>
              <h3 className="font-bold text-sm mb-2">{s.title}</h3>
              <p className="text-xs leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-line">
        <Panel className="p-12 text-center rounded-[32px]">
          <div className="inline-flex mb-4 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-xs tracking-[0.2em] text-cyan font-mono">
            <Sparkles size={14} className="mr-2" />
            READY TO BEGIN
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-ink">
            Start your placement journey
          </h2>
          <p className="mb-8 max-w-md mx-auto text-muted">
            Free for students. No admin, no gatekeeping — just your profile and a plan.
          </p>
          <Button href="/register" className="mx-auto">Get started</Button>
        </Panel>
      </section>

      <SiteFooter />
    </>
  );
}
