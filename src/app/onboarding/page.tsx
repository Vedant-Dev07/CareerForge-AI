"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import Button from "@/components/ui/button";
import { getSession, saveSession } from "@/lib/auth";

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
    const session = getSession();
    if (!session) {
      router.replace("/login");
    }
  }, [router]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const session = getSession();
    if (!session) return;

    if (!form.college.trim() || !form.degree.trim() || !form.year.trim() || !form.skills.trim() || !form.targetRole.trim()) {
      setError("Please fill in your college, degree, year, skills, and target role.");
      return;
    }

    saveSession({
      ...session,
      onboardingComplete: true,
    });
    router.push("/dashboard");
  };

  return (
    <>
      <SiteNav />
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-24 bg-grid bg-grid">
        <SectionLabel>ONBOARDING</SectionLabel>
        <h1 className="text-3xl font-black tracking-tight uppercase mb-8">
          Tell us about your path.
        </h1>
        <Panel className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs tracking-widest text-muted font-mono block mb-2">COLLEGE</label>
                <input value={form.college} onChange={(e) => handleChange("college", e.target.value)} className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan" placeholder="Your college" />
              </div>
              <div>
                <label className="text-xs tracking-widest text-muted font-mono block mb-2">DEGREE</label>
                <input value={form.degree} onChange={(e) => handleChange("degree", e.target.value)} className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan" placeholder="B.Tech, CSE" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs tracking-widest text-muted font-mono block mb-2">YEAR</label>
                <input value={form.year} onChange={(e) => handleChange("year", e.target.value)} className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan" placeholder="3rd year" />
              </div>
              <div>
                <label className="text-xs tracking-widest text-muted font-mono block mb-2">TARGET ROLE</label>
                <input value={form.targetRole} onChange={(e) => handleChange("targetRole", e.target.value)} className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan" placeholder="Data Analyst" />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">SKILLS</label>
              <input value={form.skills} onChange={(e) => handleChange("skills", e.target.value)} className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan" placeholder="Python, SQL, Excel" />
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">CAREER INTERESTS</label>
              <textarea value={form.interests} onChange={(e) => handleChange("interests", e.target.value)} rows={4} className="w-full bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-cyan resize-none" placeholder="Tell us what you want to build or pursue" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" className="justify-center" icon={false}>Save profile</Button>
              <Link href="/dashboard" className="text-sm text-muted hover:text-ink">Skip for now</Link>
            </div>
          </form>
        </Panel>
      </section>
    </>
  );
}
