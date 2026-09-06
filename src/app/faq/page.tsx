import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";

const faqs = [
  { q: "Is CareerForge AI free for students?", a: "Yes. The platform is built for students end to end, with no paid tiers gating core modules." },
  { q: "Is there an admin panel?", a: "No. CareerForge AI is intentionally student-only. There is no admin role or admin panel in the product." },
  { q: "How does the career recommendation work?", a: "It reads your profile, skills, education, interests, projects, and certifications, then ranks career paths by fit." },
  { q: "What happens after I pick a career?", a: "CareerForge AI runs a skill-gap analysis against that role and builds a phased roadmap prioritized by impact." },
  { q: "Can I practice interviews for a specific role?", a: "Yes. The AI mock interview module generates technical, HR, and role-specific questions and scores your answers." },
  { q: "How is my placement readiness score calculated?", a: "It is a composite of career match, resume score, skills, aptitude, interview performance, and learning progress." },
];

export default function FAQ() {
  return (
    <>
      <SiteNav />
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24">
        <SectionLabel>FAQ</SectionLabel>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-ink">
          Common questions.
        </h1>
        <p className="mb-12 max-w-2xl text-muted">
          Quick answers about the platform, student workflow, and readiness tracking.
        </p>
        <div className="grid gap-4">
          {faqs.map((f) => (
            <Panel key={f.q} className="rounded-2xl p-6 transition-all hover:border-cyan/35">
              <h3 className="font-bold text-base mb-2 text-ink">{f.q}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.a}</p>
            </Panel>
          ))}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
