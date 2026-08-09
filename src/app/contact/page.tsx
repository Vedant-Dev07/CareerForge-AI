import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import Button from "@/components/ui/button";

export default function Contact() {
  return (
    <>
      <SiteNav />
      <section className="max-w-xl mx-auto px-6 pt-16 pb-24 bg-grid bg-grid">
        <SectionLabel>CONTACT</SectionLabel>
        <h1 className="text-4xl font-black tracking-tight uppercase mb-4">
          Get in touch.
        </h1>
        <p className="text-muted mb-10">
          Questions, feedback or partnership inquiries — send a message.
        </p>
        <Panel className="p-8">
          <form className="space-y-5">
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">
                NAME
              </label>
              <input
                type="text"
                className="w-full bg-navy border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-cyan"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">
                EMAIL
              </label>
              <input
                type="email"
                className="w-full bg-navy border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-cyan"
                placeholder="you@college.edu"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">
                MESSAGE
              </label>
              <textarea
                rows={5}
                className="w-full bg-navy border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-cyan resize-none"
                placeholder="How can we help?"
              />
            </div>
            <Button type="submit" className="w-full justify-center">
              Send message
            </Button>
          </form>
        </Panel>
      </section>
      <SiteFooter />
    </>
  );
}
