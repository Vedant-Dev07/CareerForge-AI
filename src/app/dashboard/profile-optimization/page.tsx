"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Sparkles } from "lucide-react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import ScoreBar from "@/components/ui/score-bar";

type Optimization = {
  score: number;
  profile: { targetRole: string; headline: string; summary: string; skills: string[] };
  sources: Record<string, boolean>;
  consistencyGaps: { id: string; severity: string; title: string; detail: string; href: string }[];
  recommendations: { id: string; title: string; detail: string; href: string }[];
};

const sourceLabels: Record<string, string> = {
  profile: "Profile",
  resume: "Resume",
  github: "GitHub",
  linkedin: "LinkedIn",
  evidence: "Evidence",
};

export default function ProfileOptimization() {
  const [data, setData] = useState<Optimization | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profile/optimization", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as Optimization & { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Unable to load profile optimization.");
        setData(payload);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  return (
    <>
      <DashboardHeader title="Profile optimization" subtitle="Align your resume, professional profiles, and evidence around the career you want next." />
      {error ? <Panel className="rounded-2xl p-6 text-sm text-rose-700">{error}</Panel> : data ? (
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <Panel className="rounded-2xl p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs tracking-widest text-muted font-mono">CAREER PROFILE</div>
                  <h2 className="mt-2 text-2xl font-black text-ink">{data.profile.targetRole}</h2>
                </div>
                <Sparkles className="text-cyan" size={22} />
              </div>
              <div className="space-y-4">
                <div><div className="text-xs font-semibold uppercase tracking-wider text-muted">Headline</div><p className="mt-1 text-sm font-semibold text-ink">{data.profile.headline}</p></div>
                <div><div className="text-xs font-semibold uppercase tracking-wider text-muted">Summary</div><p className="mt-1 text-sm leading-relaxed text-muted">{data.profile.summary}</p></div>
                <div><div className="text-xs font-semibold uppercase tracking-wider text-muted">Visible skills</div><div className="mt-2 flex flex-wrap gap-2">{data.profile.skills.length ? data.profile.skills.map((skill) => <span key={skill} className="rounded-full border border-cyan/20 bg-cyan/5 px-3 py-1 text-xs font-semibold text-cyan">{skill}</span>) : <span className="text-sm text-muted">Add skills to your profile.</span>}</div></div>
              </div>
            </Panel>
            <Panel className="rounded-2xl p-6">
              <div className="text-xs tracking-widest text-muted font-mono">ALIGNMENT SCORE</div>
              <div className="mt-3 text-4xl font-black text-cyan">{data.score}%</div>
              <ScoreBar label="Profile consistency" value={data.score} accent="#2563EB" />
              <div className="mt-6 space-y-3">{Object.entries(data.sources).map(([source, available]) => <div key={source} className="flex items-center justify-between text-sm"><span className="text-ink">{sourceLabels[source] ?? source}</span>{available ? <CheckCircle2 size={17} className="text-success" /> : <CircleAlert size={17} className="text-warning" />}</div>)}</div>
            </Panel>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Panel className="rounded-2xl p-6">
              <div className="mb-4 text-xs tracking-widest text-muted font-mono">CONSISTENCY GAPS</div>
              <div className="space-y-3">{data.consistencyGaps.length ? data.consistencyGaps.map((gap) => <Link key={gap.id} href={gap.href} className="block rounded-xl border border-line p-4 transition hover:border-cyan/40"><div className="flex items-center justify-between gap-3"><span className="font-semibold text-ink">{gap.title}</span><span className={`text-xs font-bold ${gap.severity === "HIGH" ? "text-rose-600" : gap.severity === "MEDIUM" ? "text-warning" : "text-muted"}`}>{gap.severity}</span></div><p className="mt-1 text-sm leading-relaxed text-muted">{gap.detail}</p></Link>) : <p className="text-sm text-muted">No consistency gaps detected across the connected sources.</p>}</div>
            </Panel>
            <Panel className="rounded-2xl p-6">
              <div className="mb-4 text-xs tracking-widest text-muted font-mono">RECOMMENDED ACTIONS</div>
              <div className="space-y-3">{data.recommendations.length ? data.recommendations.map((recommendation) => <Link key={recommendation.id} href={recommendation.href} className="flex items-start justify-between gap-3 rounded-xl border border-line p-4 transition hover:border-cyan/40"><span><span className="block font-semibold text-ink">{recommendation.title}</span><span className="mt-1 block text-sm leading-relaxed text-muted">{recommendation.detail}</span></span><ArrowRight size={17} className="mt-1 shrink-0 text-cyan" /></Link>) : <p className="text-sm text-muted">Your profile is ready for the next review.</p>}</div>
            </Panel>
          </div>
        </div>
      ) : <Panel className="rounded-2xl p-6 text-sm text-muted">Loading profile optimization...</Panel>}
    </>
  );
}
