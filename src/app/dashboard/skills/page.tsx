"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import { CheckCircle2, Code2 } from "lucide-react";

type Summary = {
  skills: string[];
  skillCount: number;
  analysis?: { career: string; matchedSkills: string[]; missingSkills: string[] } | null;
};

export default function Skills() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("/api/profile", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { summary?: Summary }) => setSummary(data.summary ?? { skills: [], skillCount: 0 }));
  }, []);

  const skills = summary?.skills ?? [];

  return (
    <>
      <DashboardHeader title="Skills" subtitle="Your saved skills are shared with career recommendations and your dashboard." />
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel className="rounded-2xl p-6">
          <div className="mb-5">
            <div className="text-xs tracking-widest text-muted font-mono">SAVED SKILLS</div>
            <h2 className="mt-2 text-xl font-black text-ink">{summary ? `${summary.skillCount} skill${summary.skillCount === 1 ? "" : "s"} connected` : "Loading skills..."}</h2>
          </div>
          {skills.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {skills.map((skill) => (
                <div key={skill} className="flex items-center gap-3 rounded-2xl border border-line bg-slate-50/80 px-4 py-3">
                  <CheckCircle2 className="text-success" size={17} />
                  <span className="text-sm font-semibold capitalize text-ink">{skill}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-muted">No skills saved yet. Add comma-separated skills from your profile to use them across the application.</p>
          )}
        </Panel>
        <Panel className="rounded-2xl p-6">
          <div className="mb-5">
            <div className="text-xs tracking-widest text-muted font-mono">CAREER GAP ANALYSIS</div>
            <h2 className="mt-2 text-xl font-black text-ink">{summary?.analysis ? summary.analysis.career : "No analysis yet"}</h2>
          </div>
          {summary?.analysis ? (
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-xs font-semibold text-success">MATCHED ({summary.analysis.matchedSkills.length})</div>
                <p className="text-sm text-muted">{summary.analysis.matchedSkills.join(", ") || "None"}</p>
              </div>
              <div>
                <div className="mb-2 text-xs font-semibold text-warning">MISSING ({summary.analysis.missingSkills.length})</div>
                <p className="text-sm text-muted">{summary.analysis.missingSkills.join(", ") || "None"}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-muted">Choose a target role and run the career analysis to generate transparent skill gaps.</p>
          )}
        </Panel>
        <Panel className="rounded-2xl p-6">
          <Code2 className="mb-4 text-cyan" size={22} />
          <h2 className="text-lg font-black text-ink">Keep your profile current</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">Update skills from the Profile page. The same saved list powers this page, the dashboard profile, and career recommendations.</p>
        </Panel>
      </div>
    </>
  );
}
