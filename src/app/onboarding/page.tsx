"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/site-nav";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import ProfileForm from "@/components/profile-form";
import { getSession } from "@/lib/auth";
import { BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react";

const onboardingHighlights = [
  { label: "Profile", icon: GraduationCap },
  { label: "Target role", icon: BriefcaseBusiness },
  { label: "AI plan", icon: Sparkles },
];

export default function Onboarding() {
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) router.replace("/login");
    });
  }, [router]);

  return (
    <>
      <SiteNav />
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionLabel>ONBOARDING</SectionLabel>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-ink md:text-5xl">Tell us about your path.</h1>
            <p className="leading-relaxed text-muted">These details help CareerForge AI recommend roles, skill gaps, projects, and interview practice.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {onboardingHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
                    <Icon size={17} className="text-cyan" />
                    <span className="text-sm font-semibold text-muted">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <Panel className="rounded-2xl p-8">
            <ProfileForm redirectAfterSave />
          </Panel>
        </div>
      </section>
    </>
  );
}
