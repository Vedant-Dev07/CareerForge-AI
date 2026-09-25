"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import ScoreBar from "@/components/ui/score-bar";
import Button from "@/components/ui/button";
import { AlertTriangle, BriefcaseBusiness, CheckCircle2, Target } from "lucide-react";

type Role = { id: string; title: string; domain: string; requiredSkills: string[] };
type Analysis = { career: string; matchPercentage: number; matchedSkills: string[]; missingSkills: string[]; recommendations: string[] };

export default function Career() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/career/roles", { cache: "no-store" }).then((response) => response.json()),
      fetch("/api/profile", { cache: "no-store" }).then((response) => response.json()),
    ])
      .then(([roleData, profileData]: [{ roles?: Role[] }, { profile?: { targetCareerId?: string }; summary?: { analysis?: Analysis | null } }]) => {
        setRoles(roleData.roles ?? []);
        setSelectedRole(profileData.profile?.targetCareerId ?? "");
        setAnalysis(profileData.summary?.analysis ?? null);
      })
      .catch(() => setError("Unable to load career roles."))
      .finally(() => setLoading(false));
  }, []);

  const analyze = async () => {
    if (!selectedRole) {
      setError("Select a career role first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/career/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerRoleId: selectedRole }),
      });
      const data = (await response.json()) as { error?: string; analysis?: Analysis };
      if (!response.ok || !data.analysis) {
        setError(data.error ?? "Unable to analyze this career.");
        return;
      }
      setAnalysis(data.analysis);
    } catch {
      setError("Unable to analyze this career.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardHeader title="Career intelligence" subtitle="Choose a target role and compare it with the skills saved in your profile." />
      <Panel className="mb-6 rounded-2xl p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-2 text-xs tracking-widest text-muted font-mono">CAREER ROLE SELECTION</div>
            <h2 className="text-2xl font-black text-ink">Run a transparent skill match</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">The engine compares your saved skills with the role&apos;s required skills. It does not use AI or invent a prediction.</p>
            <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} className="mt-5 w-full max-w-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-cyan focus:outline-none">
              <option value="">{loading ? "Loading roles..." : roles.length ? "Select a target role" : "No roles found - run the database seed"}</option>
              {roles.map((role) => <option key={role.id} value={role.id}>{role.title} · {role.domain}</option>)}
            </select>
          </div>
          <Button type="button" icon={false} onClick={analyze} disabled={loading || !roles.length}>Analyze skills</Button>
        </div>
        {error ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      </Panel>

      {analysis ? (
        <>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Panel className="rounded-2xl p-5"><div className="text-xs text-muted font-mono">CAREER</div><div className="mt-2 text-xl font-black text-ink">{analysis.career}</div></Panel>
            <Panel className="rounded-2xl p-5"><div className="text-xs text-muted font-mono">MATCH</div><div className="mt-2 text-xl font-black text-cyan">{analysis.matchPercentage}%</div><ScoreBar label="Required skills matched" value={analysis.matchPercentage} accent="#2563EB" /></Panel>
            <Panel className="rounded-2xl p-5"><div className="text-xs text-muted font-mono">SKILL GAPS</div><div className="mt-2 text-xl font-black text-warning">{analysis.missingSkills.length}</div></Panel>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Panel className="rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-2 text-xs tracking-widest text-muted font-mono"><CheckCircle2 size={17} className="text-success" /> MATCHED SKILLS</div>
              <div className="flex flex-wrap gap-2">{analysis.matchedSkills.map((skill) => <span key={skill} className="rounded-full border border-success/20 bg-success/10 px-3 py-1.5 text-sm text-success">{skill}</span>)}</div>
            </Panel>
            <Panel className="rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-2 text-xs tracking-widest text-muted font-mono"><AlertTriangle size={17} className="text-warning" /> MISSING SKILLS</div>
              <div className="flex flex-wrap gap-2">{analysis.missingSkills.length ? analysis.missingSkills.map((skill) => <span key={skill} className="rounded-full border border-warning/20 bg-warning/10 px-3 py-1.5 text-sm text-warning">{skill}</span>) : <span className="text-sm text-muted">No gaps found for this role.</span>}</div>
            </Panel>
          </div>
          <Panel className="mt-5 rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2 text-xs tracking-widest text-muted font-mono"><Target size={17} className="text-cyan" /> RECOMMENDED NEXT STEPS</div>
            {analysis.recommendations.length ? <ul className="grid gap-3 md:grid-cols-2">{analysis.recommendations.map((item) => <li key={item} className="flex items-center gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3 text-sm font-semibold text-ink"><BriefcaseBusiness size={16} className="text-cyan" />{item}</li>)}</ul> : <p className="text-sm text-muted">Your saved skills cover every required skill for this role.</p>}
          </Panel>
        </>
      ) : (
        <Panel className="rounded-2xl p-6 text-sm text-muted">Select a role and run the analysis to see matched skills, missing skills, and actionable recommendations.</Panel>
      )}
    </>
  );
}
