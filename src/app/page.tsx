import {
  ArrowDown,
  BarChart3,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Code2,
  Compass,
  FileSearch,
  Layers3,
  LineChart,
  MessagesSquare,
  Rocket,
  Route,
  Sparkles,
  Target,
} from "lucide-react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";
import ScoreBar from "@/components/ui/score-bar";
import SectionLabel from "@/components/ui/section-label";
import JourneyMap from "@/components/dashboard/journey-map";

const valueStrip = [
  { title: "Personalized Preparation", icon: Target },
  { title: "AI-Powered Guidance", icon: BrainCircuit },
  { title: "Role-Based Learning", icon: BriefcaseBusiness },
  { title: "Continuous Progress Tracking", icon: LineChart },
  { title: "One Unified Platform", icon: Layers3 },
];

const beforeFlow = [
  "Multiple Platforms",
  "Scattered Resources",
  "Unclear Skill Gaps",
  "Unstructured Preparation",
  "Difficult Progress Tracking",
];

const afterFlow = [
  "One Intelligent Platform",
  "Personalized Analysis",
  "Skill Gap Identification",
  "Adaptive Preparation",
  "Placement Readiness Tracking",
];

const workflow = [
  {
    title: "Create Your Profile",
    body: "Add education, skills, interests, projects, certifications, experience, and career goals.",
  },
  {
    title: "Understand Your Career",
    body: "Review suitable career and role recommendations based on your student profile.",
  },
  {
    title: "Identify Skill Gaps",
    body: "Compare your current skills with the expectations of your selected target role.",
  },
  {
    title: "Build Your Preparation Plan",
    body: "Follow a roadmap with skills, resources, projects, aptitude, resume, and interview prep.",
  },
  {
    title: "Track Placement Readiness",
    body: "Monitor progress and preparation performance with recommendations for improvement.",
  },
];

const modules = [
  {
    title: "Career Recommendation",
    body: "Discover suitable career roles based on your skills, interests, academic profile, and career goals.",
    icon: Compass,
  },
  {
    title: "Skill Gap Analyzer",
    body: "Identify missing and weak skills by comparing your current profile with target-role requirements.",
    icon: BarChart3,
  },
  {
    title: "Personalized Roadmap",
    body: "Follow a structured role-based learning roadmap designed around your individual skill gaps.",
    icon: Route,
  },
  {
    title: "Resume Analyzer",
    body: "Analyze your resume and receive AI-powered suggestions to improve structure, content, and relevance.",
    icon: FileSearch,
  },
  {
    title: "ATS Optimization",
    body: "Improve resume compatibility by identifying missing keywords and content improvements.",
    icon: ClipboardCheck,
  },
  {
    title: "Project Recommendations",
    body: "Discover relevant project ideas that strengthen your portfolio and support your target career role.",
    icon: Code2,
  },
  {
    title: "Aptitude Practice",
    body: "Practice placement-oriented quantitative, logical, and verbal reasoning questions.",
    icon: Calculator,
  },
  {
    title: "Interview Preparation",
    body: "Prepare for technical, behavioral, and HR interviews with role-focused questions and practice.",
    icon: MessagesSquare,
  },
  {
    title: "Placement Readiness Analytics",
    body: "Track your preparation progress and understand your overall placement readiness.",
    icon: BarChart3,
  },
  {
    title: "AI Career Mentor",
    body: "Receive personalized guidance for skills, projects, resume improvement, and interview preparation.",
    icon: Bot,
  },
];

const personalizationInputs = ["Student Profile", "Skills", "Career Goal", "Resume", "Performance"];

const roles = [
  "Data Analyst",
  "Data Scientist",
  "Software Developer",
  "Full Stack Developer",
  "Data Engineer",
  "AI/ML Engineer",
  "Cloud Engineer",
];

const resumeJourney = [
  "Resume Upload",
  "Resume Analysis",
  "ATS Optimization",
  "Skill Gap Detection",
  "Project Recommendations",
  "Aptitude Practice",
  "Interview Preparation",
  "Placement Readiness",
];

const readinessMetrics = [
  { label: "Technical Skills", value: 76, accent: "#4F46E5" },
  { label: "Aptitude", value: 72, accent: "#2563EB" },
  { label: "Resume Quality", value: 84, accent: "#16A34A" },
  { label: "Interview Prep", value: 68, accent: "#F59E0B" },
  { label: "Projects", value: 79, accent: "#4F46E5" },
  { label: "Communication", value: 74, accent: "#2563EB" },
];

const studentJourney = [
  { title: "Discover", body: "Explore career options and platform modules." },
  { title: "Analyze", body: "Understand your strengths, resume, and skill gaps." },
  { title: "Learn", body: "Follow the roadmap for your target role." },
  { title: "Practice", body: "Work on aptitude and interview preparation." },
  { title: "Improve", body: "Apply recommendations to resume, projects, and skills." },
  { title: "Track", body: "Measure readiness across preparation areas." },
  { title: "Prepare", body: "Move toward interviews with a clearer plan." },
];

const traditional = [
  "Multiple platforms",
  "Scattered resources",
  "Generic preparation",
  "Manual tracking",
  "Limited personalization",
];

const careerForge = [
  "Unified ecosystem",
  "Personalized preparation",
  "AI-driven recommendations",
  "Continuous progress tracking",
  "Role-based preparation",
  "Placement-readiness analytics",
];

const futureEnhancements = [
  "Company-specific preparation hubs",
  "Placement and company prediction",
  "Expanded AI Career Mentor",
  "Digital Career Portfolio",
];

const heroStats = [
  { label: "Readiness signals", value: "6+" },
  { label: "Career modules", value: "10" },
  { label: "Journey view", value: "360" },
];

function FlowColumn({ label, items, accent }: { label: string; items: string[]; accent: string }) {
  return (
    <div>
      <div className="mb-5 text-xs font-mono tracking-[0.2em] text-muted">{label}</div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item}>
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <span className={`h-2 w-2 rounded-full ${accent}`} />
              <span className="text-sm font-semibold text-ink">{item}</span>
            </div>
            {index < items.length - 1 ? (
              <div className="flex h-5 items-center justify-center text-muted">
                <ArrowDown size={14} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="landing-page">
      <SiteNav />

      <section className="landing-hero max-w-6xl mx-auto px-6 pt-14 pb-16 grid lg:grid-cols-[1.02fr_0.98fr] gap-12 items-center">
        <div className="landing-reveal landing-delay-1">
          <div className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-cyan/20 bg-white/75 px-3 py-1.5 text-xs tracking-[0.2em] text-cyan font-mono shadow-sm">
            <span>CAREERFORGE AI</span>
            <span className="text-line">/</span>
            <span>THE PLACEMENT TUTOR</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[0.98] tracking-tight mb-6 text-ink">
            Your Complete AI-Powered Placement Preparation Platform
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-8 max-w-2xl text-muted">
            Prepare for placements with personalized career guidance, skill-gap analysis, resume optimization,
            aptitude practice, interview preparation, and continuous placement-readiness tracking in one intelligent platform.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button href="/register">Start Your Placement Journey</Button>
            <Button href="#features" variant="secondary" icon={false}>
              Explore Platform <ChevronRight size={15} />
            </Button>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 overflow-hidden rounded-2xl border border-line bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            {heroStats.map((stat) => (
              <div key={stat.label} className="border-r border-line px-4 py-4 last:border-r-0">
                <div className="text-2xl font-black font-mono text-ink">{stat.value}</div>
                <div className="mt-1 text-xs font-semibold leading-snug text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <Panel className="landing-dashboard-preview rounded-[28px] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <div className="text-xs tracking-[0.2em] text-muted font-mono">DASHBOARD PREVIEW</div>
              <h2 className="mt-2 text-xl font-black text-ink">Placement command center</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan">
              <BrainCircuit size={24} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Career", "Skills", "Resume"].map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-slate-50/80 p-3 text-center transition-colors hover:border-cyan/30 hover:bg-white">
                <div className="mx-auto mb-2 h-8 w-8 rounded-xl bg-cyan/10 text-cyan flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <div className="text-[11px] font-semibold text-muted">{item}</div>
              </div>
            ))}
          </div>
          <div className="my-6 rounded-2xl border border-line bg-slate-50/80 p-4">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <div className="text-xs font-mono tracking-[0.18em] text-muted">PRODUCT VISUALIZATION</div>
                <div className="mt-1 text-4xl font-black font-mono text-cyan">78%</div>
              </div>
              <Sparkles size={22} className="text-forge" />
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-forge" style={{ width: "78%" }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ScoreBar label="Career match" value={92} accent="#4F46E5" />
            <ScoreBar label="Resume score" value={84} accent="#16A34A" />
            <ScoreBar label="Skills" value={76} accent="#2563EB" />
            <ScoreBar label="Interview" value={71} accent="#F59E0B" />
          </div>
        </Panel>
      </section>

      <section className="landing-section border-y border-line bg-white/70">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-black text-ink">Everything You Need for Placement Preparation</div>
            <div className="text-xs font-mono tracking-[0.18em] text-muted">CONNECTED WORKFLOW</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {valueStrip.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="landing-float flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan/30 hover:shadow-[0_12px_26px_rgba(15,23,42,0.07)]">
                  <Icon size={17} className="text-cyan" />
                  <span className="text-sm font-semibold text-muted">{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="landing-section max-w-6xl mx-auto px-6 py-20">
        <SectionLabel>THE PROBLEM</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-5 text-ink">
              Placement Preparation Should not Be Fragmented
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              Students often jump between separate tools for career guidance, resume building, ATS checking, aptitude
              practice, interview preparation, skill development, and learning resources. That makes preparation harder to
              organize and hides the weaknesses that should guide the next step.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <FlowColumn label="BEFORE CAREERFORGE AI" items={beforeFlow} accent="bg-warning" />
            <FlowColumn label="AFTER CAREERFORGE AI" items={afterFlow} accent="bg-success" />
          </div>
        </div>
      </section>

      <section id="how" className="landing-section border-t border-line bg-white/60">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionLabel>HOW CAREERFORGE AI WORKS</SectionLabel>
          <h2 className="text-3xl font-black tracking-tight mb-12 max-w-2xl text-ink">
            A connected preparation workflow from profile to readiness.
          </h2>
          <div className="grid gap-5 md:grid-cols-5">
            {workflow.map((step, index) => (
              <div key={step.title} className="landing-card relative rounded-2xl border border-line bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan/10 text-sm font-black text-cyan">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-sm font-bold text-ink">{step.title}</h3>
                <p className="text-xs leading-relaxed text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="landing-section max-w-6xl mx-auto px-6 py-20 border-t border-line">
        <SectionLabel>EVERYTHING IN ONE PLATFORM</SectionLabel>
        <h2 className="text-3xl font-black tracking-tight mb-4 max-w-2xl text-ink">
          Core modules built around the placement journey.
        </h2>
        <p className="mb-12 max-w-2xl text-sm leading-relaxed text-muted">
          CareerForge AI brings the major preparation activities into a single student workspace so each module can support the next.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Panel
                key={module.title}
                className={`landing-card group rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(15,23,42,0.09)] ${
                  index === 0 || index === 3 ? "bg-slate-50" : ""
                }`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan transition-colors group-hover:bg-cyan group-hover:text-white">
                    <Icon size={19} />
                  </div>
                  <span className="text-xs font-mono text-forge">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mb-2 text-base font-bold text-ink">{module.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{module.body}</p>
              </Panel>
            );
          })}
        </div>
      </section>

      <section className="landing-section border-t border-line bg-white/60">
        <div className="max-w-6xl mx-auto px-6 py-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div>
            <SectionLabel>PERSONALIZATION</SectionLabel>
            <h2 className="text-3xl font-black tracking-tight mb-5 text-ink">Built Around You</h2>
            <p className="text-sm leading-relaxed text-muted">
              CareerForge AI does not provide the same preparation plan to every student. It uses each student profile,
              skills, interests, target role, resume, performance, and progress to create a more personalized preparation experience.
            </p>
          </div>
          <div className="rounded-[28px] border border-line bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="grid gap-3 sm:grid-cols-5">
              {personalizationInputs.map((item) => (
                <div key={item} className="rounded-2xl border border-line bg-slate-50 p-3 text-center text-xs font-semibold text-muted">
                  {item}
                </div>
              ))}
            </div>
            <div className="flex h-12 items-center justify-center text-muted">
              <ArrowDown size={16} />
            </div>
            <div className="rounded-2xl border border-cyan/30 bg-cyan/10 p-5 text-center">
              <BrainCircuit className="mx-auto mb-2 text-cyan" size={24} />
              <div className="font-black text-ink">AI Analysis</div>
            </div>
            <div className="flex h-12 items-center justify-center text-muted">
              <ArrowDown size={16} />
            </div>
            <div className="rounded-2xl border border-forge/30 bg-forge/10 p-5 text-center font-black text-ink">
              Personalized Recommendations
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section max-w-6xl mx-auto px-6 py-20 border-t border-line">
        <SectionLabel>ROLE-BASED PREPARATION</SectionLabel>
        <h2 className="text-3xl font-black tracking-tight mb-4 text-ink">Prepare for the Role You Want</h2>
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-muted">
          Preparation can be aligned with a selected target role, connecting required skills, learning paths, projects,
          aptitude practice, and interview preparation.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <div key={role} className="landing-card rounded-2xl border border-line bg-white p-5 transition-all hover:border-cyan hover:shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
              <BriefcaseBusiness className="mb-4 text-cyan" size={20} />
              <h3 className="mb-3 text-base font-bold text-ink">{role}</h3>
              <div className="flex flex-wrap gap-2">
                {["Required Skills", "Learning Path", "Projects", "Aptitude", "Interview Prep"].map((item) => (
                  <span key={item} className="rounded-full border border-line bg-slate-50 px-3 py-1 text-[11px] font-semibold text-muted">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section border-t border-line bg-white/60">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionLabel>CONNECTED JOURNEY</SectionLabel>
          <h2 className="text-3xl font-black tracking-tight mb-4 text-ink">
            From Resume to Interview, One Preparation Journey
          </h2>
          <p className="mb-10 max-w-2xl text-sm leading-relaxed text-muted">
            CareerForge AI connects preparation modules so resume insights, skill gaps, projects, practice, and interview
            readiness can inform one another instead of living as isolated tools.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resumeJourney.map((item, index) => (
              <div key={item} className="landing-card rounded-2xl border border-line bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-mono text-forge">{String(index + 1).padStart(2, "0")}</span>
                  {index < resumeJourney.length - 1 ? <ChevronRight size={16} className="text-muted" /> : <CheckCircle2 size={16} className="text-success" />}
                </div>
                <div className="text-sm font-bold text-ink">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section max-w-6xl mx-auto px-6 py-20 border-t border-line">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] items-center">
          <div>
            <SectionLabel>PLACEMENT READINESS</SectionLabel>
            <h2 className="text-3xl font-black tracking-tight mb-5 text-ink">Know Where You Stand</h2>
            <p className="text-sm leading-relaxed text-muted">
              The readiness view is shown here as a product visualization. It represents the kinds of preparation areas
              students can track as they build momentum across skills, resume, projects, aptitude, and interviews.
            </p>
          </div>
          <Panel className="rounded-[28px] p-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-mono tracking-[0.2em] text-muted">OVERALL READINESS</div>
                <div className="mt-2 text-5xl font-black font-mono text-cyan">78%</div>
              </div>
              <div className="rounded-full border border-line bg-slate-50 px-3 py-1 text-xs font-semibold text-muted">
                Product visualization
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {readinessMetrics.map((metric) => (
                <ScoreBar key={metric.label} label={metric.label} value={metric.value} accent={metric.accent} />
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <section className="landing-section border-t border-line bg-white/60">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <Panel className="p-6 rounded-2xl">
            <div className="mb-4">
              <div className="text-xs tracking-widest text-muted font-mono uppercase">Product Journey</div>
              <h2 className="mt-2 text-2xl md:text-3xl font-black text-ink">Your preparation map</h2>
            </div>
            <JourneyMap />
          </Panel>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-line">
        <SectionLabel>WHY CAREERFORGE AI</SectionLabel>
        <h2 className="text-3xl font-black tracking-tight mb-12 text-ink">A cleaner way to prepare for placements.</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="landing-card rounded-[28px] border border-line bg-white p-6">
            <h3 className="mb-5 text-lg font-black text-ink">Traditional Preparation</h3>
            <div className="space-y-3">
              {traditional.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-muted">
                  <span className="h-2 w-2 rounded-full bg-warning" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="landing-card rounded-[28px] border border-cyan/30 bg-cyan/10 p-6">
            <h3 className="mb-5 text-lg font-black text-ink">CareerForge AI</h3>
            <div className="space-y-3">
              {careerForge.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-ink">
                  <CheckCircle2 size={16} className="text-success" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white/60">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionLabel>FUTURE ENHANCEMENTS</SectionLabel>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] items-start">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-5 text-ink">The Future of Placement Preparation</h2>
              <p className="text-sm leading-relaxed text-muted">
                These items represent future direction from the project scope and are not presented as currently available features.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {futureEnhancements.map((item) => (
                <div key={item} className="landing-card rounded-2xl border border-line bg-white p-5">
                  <Rocket className="mb-4 text-forge" size={19} />
                  <h3 className="text-sm font-bold text-ink">{item}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section max-w-6xl mx-auto px-6 py-24 border-t border-line">
        <Panel className="landing-cta rounded-[32px] p-8 text-center sm:p-12">
          <div className="inline-flex mb-4 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-xs tracking-[0.2em] text-cyan font-mono">
            <Sparkles size={14} className="mr-2" />
            START TODAY
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-ink">
            Start Building Your Placement Readiness Today
          </h2>
          <p className="mb-8 max-w-2xl mx-auto text-sm leading-relaxed text-muted">
            Understand your strengths, identify your skill gaps, build the right preparation roadmap, and prepare for your target role with CareerForge AI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/register">Start Your Journey</Button>
            <Button href="#features" variant="secondary" icon={false}>
              Explore Features <ChevronRight size={15} />
            </Button>
          </div>
        </Panel>
      </section>

      <SiteFooter />
    </div>
  );
}
