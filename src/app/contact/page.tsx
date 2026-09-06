"use client";

import { useState } from "react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import Button from "@/components/ui/button";
import { Mail, MessageSquare, User } from "lucide-react";

const fieldClass =
  "w-full border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/10";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <SiteNav />
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionLabel>CONTACT</SectionLabel>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-ink">
              Get in touch.
            </h1>
            <p className="text-muted leading-relaxed">
              Questions, feedback, or partnership inquiries are welcome. Send a message and keep the conversation moving.
            </p>
          </div>
          <Panel className="rounded-2xl p-8">
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              {sent ? (
                <p className="rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
                  Message prepared. Thanks for reaching out.
                </p>
              ) : null}
              <div>
                <label className="text-xs tracking-widest text-muted font-mono block mb-2">NAME</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-muted" size={16} />
                  <input type="text" className={`${fieldClass} pl-10`} placeholder="Enter your name" />
                </div>
              </div>
              <div>
                <label className="text-xs tracking-widest text-muted font-mono block mb-2">EMAIL</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-muted" size={16} />
                  <input type="email" className={`${fieldClass} pl-10`} placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="text-xs tracking-widest text-muted font-mono block mb-2">MESSAGE</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 text-muted" size={16} />
                  <textarea rows={5} className={`${fieldClass} resize-none pl-10`} placeholder="Write your message" />
                </div>
              </div>
              <Button type="submit" className="w-full justify-center">
                Send message
              </Button>
            </form>
          </Panel>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
