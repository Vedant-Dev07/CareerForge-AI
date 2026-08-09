import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";

export default function About() {
  return (
    <>
      <SiteNav />
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-24 bg-grid bg-grid">
        <SectionLabel>ABOUT</SectionLabel>
        <h1 className="text-4xl font-black tracking-tight uppercase mb-6">
          Built for one job: <span className="text-forge">placement readiness.</span>
        </h1>
        <p className="text-muted leading-relaxed mb-6">
          CareerForge AI exists because placement preparation is scattered
          across a dozen disconnected tools — one for aptitude, one for
          resumes, one for interview practice — none of which know anything
          about each other. A student ends up doing the integration work
          themselves.
        </p>
        <p className="text-muted leading-relaxed mb-6">
          CareerForge AI is a single, connected system. Your profile feeds
          career recommendations. Career recommendations feed the skill-gap
          analysis. The skill gap drives your roadmap, your aptitude focus
          areas, your project suggestions, and your interview questions. Every
          module updates one number: your placement readiness score.
        </p>
        <p className="text-muted leading-relaxed mb-10">
          There is no admin panel and no gatekeeping — the platform is built
          for students, end to end.
        </p>
        <Panel className="p-8">
          <h2 className="font-bold text-lg mb-4">The core idea</h2>
          <p className="text-sm text-muted leading-relaxed">
            A student selects <span className="text-ink">Data Analyst</span> →
            CareerForge AI identifies <span className="text-ink">SQL</span> as a
            major gap → the roadmap prioritizes SQL → aptitude questions adapt
            to performance → projects are recommended to strengthen the
            profile → the resume is optimized for Data Analyst roles →
            interview questions are generated for the role → performance
            contributes to the readiness score → the AI mentor recommends the
            next action.
          </p>
        </Panel>
      </section>
      <SiteFooter />
    </>
  );
}
