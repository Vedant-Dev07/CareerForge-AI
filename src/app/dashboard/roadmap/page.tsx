"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";
import { CheckCircle2, Circle, Loader2, Route } from "lucide-react";

type Task = { id: string; title: string; description: string | null; category: string; status: string };
type Roadmap = { id: string; title: string; description: string | null; progress: number; status: string; careerRole: { title: string }; tasks: Task[] };

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadRoadmap = () => {
    setLoading(true);
    fetch("/api/roadmap", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load roadmap.");
        setRoadmap(data.roadmap);
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  };
  useEffect(loadRoadmap, []);

  const groupedTasks = useMemo(
    () => roadmap?.tasks.reduce<Record<string, Task[]>>((groups, task) => {
      (groups[task.category] ??= []).push(task);
      return groups;
    }, {}) ?? {},
    [roadmap],
  );

  const generate = async () => {
    setBusy(true);
    setError("");
    const response = await fetch("/api/roadmap", { method: "POST" });
    const data = await response.json();
    if (!response.ok) setError(data.error || "Unable to generate roadmap.");
    else setRoadmap(data.roadmap);
    setBusy(false);
  };

  const updateTask = async (task: Task) => {
    const status = task.status === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED";
    const response = await fetch(`/api/roadmap/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to update task.");
      return;
    }
    setRoadmap((current) => current ? {
      ...current,
      progress: data.progress,
      status: data.status,
      tasks: current.tasks.map((item) => item.id === task.id ? { ...item, status } : item),
    } : current);
  };

  return (
    <>
      <DashboardHeader title="Personalized learning roadmap" subtitle="A clear path from your current state to placement readiness." />

      <Panel className="rounded-2xl p-6 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs tracking-widest text-muted font-mono mb-2">PERSONALIZED PLAN</div>
            <h2 className="text-2xl font-black text-ink">{roadmap?.title ?? "Turn your skill gaps into a plan"}</h2>
            <p className="mt-2 text-sm text-muted">{roadmap?.description ?? "Run a career analysis to generate a roadmap from your missing skills."}</p>
            {roadmap && <p className="mt-2 text-sm font-semibold text-cyan">Target career: {roadmap.careerRole.title} · {roadmap.progress}% complete</p>}
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan">
            <Route size={26} />
          </div>
        </div>
      </Panel>

      {loading ? (
        <Panel className="rounded-2xl p-8 text-center text-muted"><Loader2 className="mx-auto animate-spin" /></Panel>
      ) : roadmap ? (
        <div className="space-y-4">
          {Object.entries(groupedTasks).map(([category, tasks]) => (
            <Panel key={category} className="rounded-2xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-black text-ink">{category}</h3>
                <span className="text-xs font-mono text-muted">{tasks.filter((task) => task.status === "COMPLETED").length}/{tasks.length} complete</span>
              </div>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <button key={task.id} type="button" onClick={() => updateTask(task)} className="flex w-full items-start gap-3 rounded-xl border border-line bg-slate-50/70 p-4 text-left transition hover:border-cyan/40 hover:bg-white">
                    {task.status === "COMPLETED" ? <CheckCircle2 size={19} className="mt-0.5 text-success" /> : <Circle size={19} className="mt-0.5 text-muted" />}
                    <span>
                      <span className={`block text-sm font-semibold ${task.status === "COMPLETED" ? "text-muted line-through" : "text-ink"}`}>{task.title}</span>
                      {task.description && <span className="mt-1 block text-xs text-muted">{task.description}</span>}
                    </span>
                  </button>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <Panel className="rounded-2xl p-8 text-center">
          <Route className="mx-auto mb-4 text-cyan" size={28} />
          <h3 className="font-bold text-ink">No personalized roadmap yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">Complete your profile and run career analysis first.</p>
          <Button icon={false} className="mt-5" onClick={generate} disabled={busy}>{busy ? "Generating..." : "Generate my roadmap"}</Button>
        </Panel>
      )}
      {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}
    </>
  );
}
