"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import { CheckCircle2, ExternalLink, Globe, Lightbulb } from "lucide-react";

type Evidence = {
  id: string;
  status: string;
  repositoryUrl: string | null;
  demoUrl: string | null;
  summary: string | null;
  skillsDemonstrated: string[];
  completedAt: string | null;
  project: { title: string };
};

export default function Portfolio() {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects/recommendations/history", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return [];
        const data = await response.json();
        return data.history.filter((item: Evidence) => item.status === "COMPLETED");
      })
      .then(setEvidence)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <DashboardHeader title="Digital career portfolio" subtitle="Completed recommended projects become evidence of your placement preparation." />
      {loading ? <Panel className="rounded-xl p-6 text-sm text-muted">Loading portfolio evidence.</Panel> : evidence.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {evidence.map((item) => <Panel key={item.id} className="rounded-xl p-5">
            <div className="mb-4 flex items-start justify-between gap-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg border border-success/20 bg-success/10 text-success"><Lightbulb size={18} /></div><div><div className="text-xs font-mono tracking-widest text-muted">PROJECT EVIDENCE</div><h2 className="mt-1 font-bold text-ink">{item.project.title}</h2></div></div><CheckCircle2 className="text-success" size={18} /></div>
            <p className="text-sm leading-relaxed text-muted">{item.summary || "Completed as part of a targeted placement preparation plan."}</p>
            <div className="mt-4"><div className="text-xs font-semibold text-muted">SKILLS DEMONSTRATED</div><p className="mt-1 text-sm capitalize text-ink">{item.skillsDemonstrated.join(", ") || "Project skills"}</p></div>
            {(item.repositoryUrl || item.demoUrl) && <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-cyan">{item.repositoryUrl && <a className="inline-flex items-center gap-1" href={item.repositoryUrl} target="_blank" rel="noreferrer">Repository <ExternalLink size={14} /></a>}{item.demoUrl && <a className="inline-flex items-center gap-1" href={item.demoUrl} target="_blank" rel="noreferrer">Live demo <ExternalLink size={14} /></a>}</div>}
          </Panel>)}
        </div>
      ) : <Panel className="rounded-xl p-6"><Globe className="mb-3 text-cyan" size={21} /><h2 className="font-bold text-ink">No completed project evidence yet</h2><p className="mt-2 text-sm text-muted">Complete a recommended project from the Projects page to add its demonstrated skills here.</p></Panel>}
    </>
  );
}
