import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";

export default function About() {
  return (
    <>
      <SiteNav />
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24">
        <SectionLabel>ABOUT</SectionLabel>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-ink">
          Built for one job: <span className="text-forge">placement readiness.</span>
        </h1>
        <p className="text-muted leading-relaxed mb-6">
          CareerForge AI exists because placement preparation is scattered across a dozen disconnected tools: one for
          aptitude, one for resumes, one for interview practice, none of which know anything about each other.
        </p>
        <p className="text-muted leading-relaxed mb-6">
          CareerForge AI is a single, connected system. Your profile feeds career recommendations. Career
          recommendations feed the skill-gap analysis. The skill gap drives your roadmap, aptitude focus areas,
          project suggestions, and interview questions.
        </p>
        <p className="text-muted leading-relaxed mb-10">
          There is no admin panel and no gatekeeping. The platform is built for students, end to end.
        </p>
        <Panel className="rounded-2xl p-8">
          <h2 className="font-bold text-lg mb-4 text-ink">The core idea</h2>
          <p className="text-sm text-muted leading-relaxed">
            A student selects <span className="text-ink">Data Analyst</span>. CareerForge AI identifies{" "}
            <span className="text-ink">SQL</span> as a major gap. The roadmap prioritizes SQL, projects strengthen the
            profile, the resume is optimized for the role, interviews become role-specific, and every signal improves
            the readiness score.
          </p>
        </Panel>
      </section>
      <SiteFooter />
    </>
  );
}
