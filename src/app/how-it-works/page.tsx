import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import Button from "@/components/ui/button";

const steps = [
  { n: "01", title: "Create your profile", body: "Education, skills, projects, certifications, target role, and timeline." },
  { n: "02", title: "AI profile analysis", body: "CareerForge AI reads your profile and builds a baseline picture of where you stand." },
  { n: "03", title: "Choose a career path", body: "Pick from ranked recommendations, or explore roles you had not considered." },
  { n: "04", title: "Skill gap analysis", body: "See exactly which skills are missing for your target role, ranked by priority." },
  { n: "05", title: "Personalized roadmap", body: "Follow a phased learning plan built from your specific gaps." },
  { n: "06", title: "Practice across modules", body: "Improve your resume, aptitude, interview answers, and recommended projects." },
  { n: "07", title: "AI mock interview", body: "Practice technical, HR, and role-specific rounds with detailed feedback." },
  { n: "08", title: "Placement readiness", body: "Track one score built from every module in your preparation journey." },
  { n: "09", title: "AI mentor and portfolio", body: "Get ongoing guidance and keep your career portfolio current." },
];

export default function HowItWorks() {
  return (
    <>
      <SiteNav />
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        <SectionLabel>HOW IT WORKS</SectionLabel>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-ink">
          The full student journey.
        </h1>
        <p className="text-muted max-w-2xl mb-12">
          Register, complete your profile, choose a role, close skill gaps, practice, interview, and track readiness.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <Panel key={s.n} className="rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-cyan/35">
              <div className="mb-4 inline-flex rounded-full border border-forge/20 bg-forge/10 px-3 py-1 text-xs font-mono text-forge">
                {s.n}
              </div>
              <h3 className="font-bold text-base mb-2 text-ink">{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.body}</p>
            </Panel>
          ))}
        </div>
        <Panel className="rounded-2xl p-10 text-center mt-12">
          <h2 className="text-xl font-black tracking-tight mb-3 text-ink">
            Ready to start?
          </h2>
          <p className="mx-auto mb-6 max-w-md text-sm text-muted">
            Create your student profile and let the platform organize your preparation.
          </p>
          <Button href="/register" className="mx-auto">Get started</Button>
        </Panel>
      </section>
      <SiteFooter />
    </>
  );
}
