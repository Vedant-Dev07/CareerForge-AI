import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import Button from "@/components/ui/button";

const steps = [
  { n: "01", title: "Create your profile", body: "Education, skills, projects, certifications and your target role and timeline." },
  { n: "02", title: "AI profile analysis", body: "CareerForge AI reads your full profile and builds a baseline picture of where you stand." },
  { n: "03", title: "Choose a career path", body: "Pick from ranked recommendations, or explore roles you hadn't considered." },
  { n: "04", title: "Skill gap analysis", body: "See exactly which skills are missing for your target role, ranked by priority." },
  { n: "05", title: "Personalized roadmap", body: "A phased learning plan built from your specific gaps, not a generic syllabus." },
  { n: "06", title: "Practice: resume, aptitude, projects", body: "Work the roadmap across resume optimization, aptitude tests and recommended projects." },
  { n: "07", title: "AI mock interview", body: "Technical, HR and role-specific rounds with detailed, scored feedback." },
  { n: "08", title: "Placement readiness", body: "One score, built from every module, that tracks whether you're actually ready." },
  { n: "09", title: "AI mentor + portfolio", body: "Ongoing guidance from the mentor, and a shareable portfolio built from your work." },
];

export default function HowItWorks() {
  return (
    <>
      <SiteNav />
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24 bg-grid bg-grid">
        <SectionLabel>HOW IT WORKS</SectionLabel>
        <h1 className="text-4xl font-black tracking-tight uppercase mb-4">
          The full student journey.
        </h1>
        <p className="text-muted max-w-xl mb-12">
          Register → profile → career → skill gap → roadmap → practice →
          interview → readiness → mentor → portfolio. Nothing is skipped.
        </p>
        <div className="space-y-0">
          {steps.map((s, i) => (
            <div key={s.n} className="flex gap-6 py-6 border-t border-line first:border-t-0">
              <div className="text-2xl font-black font-mono text-forge w-14 shrink-0">
                {s.n}
              </div>
              <div>
                <h3 className="font-bold text-base mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <Panel className="p-10 text-center mt-12">
          <h2 className="text-xl font-black tracking-tight uppercase mb-3">
            Ready to start?
          </h2>
          <Button href="/register" className="mx-auto">Get started</Button>
        </Panel>
      </section>
      <SiteFooter />
    </>
  );
}
