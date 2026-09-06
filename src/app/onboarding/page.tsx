"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import Button from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react";

const fieldClass =
  "w-full border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/10";

const onboardingHighlights = [
  { label: "Profile", icon: GraduationCap },
  { label: "Target role", icon: BriefcaseBusiness },
  { label: "AI plan", icon: Sparkles },
];

export default function Onboarding() {
  const router = useRouter();
  const [form, setForm] = useState({
    college: "",
    degree: "",
    year: "",
    skills: "",
    targetRole: "",
    interests: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.replace("/login");
      }
    });
  }, [router]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.college.trim() || !form.degree.trim() || !form.year.trim() || !form.skills.trim() || !form.targetRole.trim()) {
      setError("Please fill in your college, degree, year, skills, and target role.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <>
      <SiteNav />
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionLabel>ONBOARDING</SectionLabel>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-ink">
              Tell us about your path.
            </h1>
            <p className="text-muted leading-relaxed">
              These details help CareerForge AI recommend roles, skill gaps, projects, and interview practice.
            </p>
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs tracking-widest text-muted font-mono block mb-2">COLLEGE</label>
                <input value={form.college} onChange={(e) => handleChange("college", e.target.value)} className={fieldClass} placeholder="Enter your college" />
              </div>
              <div>
                <label className="text-xs tracking-widest text-muted font-mono block mb-2">DEGREE</label>
                <input value={form.degree} onChange={(e) => handleChange("degree", e.target.value)} className={fieldClass} placeholder="Enter your degree" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs tracking-widest text-muted font-mono block mb-2">YEAR</label>
                <input value={form.year} onChange={(e) => handleChange("year", e.target.value)} className={fieldClass} placeholder="Enter your year" />
              </div>
              <div>
                <label className="text-xs tracking-widest text-muted font-mono block mb-2">TARGET ROLE</label>
                <input value={form.targetRole} onChange={(e) => handleChange("targetRole", e.target.value)} className={fieldClass} placeholder="Enter your target role" />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">SKILLS</label>
              <input value={form.skills} onChange={(e) => handleChange("skills", e.target.value)} className={fieldClass} placeholder="List your skills" />
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">CAREER INTERESTS</label>
              <textarea value={form.interests} onChange={(e) => handleChange("interests", e.target.value)} rows={4} className={`${fieldClass} resize-none`} placeholder="Describe your career interests" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" className="justify-center" icon={false}>Save profile</Button>
              <Link href="/dashboard" className="text-sm font-semibold text-muted hover:text-ink">Skip for now</Link>
            </div>
          </form>
        </Panel>
        </div>
      </section>
    </>
  );
}
