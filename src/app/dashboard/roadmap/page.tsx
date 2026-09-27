"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";
import { AlertCircle, BrainCircuit, CheckCircle2, Circle, Loader2, RefreshCw, Route, Bot, Lock, ExternalLink } from "lucide-react";

type TaskSource = "CAREER_GAP" | "APTITUDE_WEAK" | "RESUME_GAP";
type TaskPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

type Task = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  source: TaskSource;
  priority: TaskPriority;
};

type Roadmap = {
  id: string;
  title: string;
  description: string | null;
  progress: number;
  status: string;
  careerRole: { title: string };
  tasks: Task[];
};

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRoadmap = () => {
    setLoading(true);
    fetch("/api/roadmap", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to load roadmap.");
        setRoadmap(data.roadmap);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadRoadmap, []);

  const generate = async () => {
    setBusy(true);
    setError("");
    const res = await fetch("/api/roadmap", { method: "POST" });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Unable to generate roadmap.");
    else setRoadmap(data.roadmap);
    setBusy(false);
  };

  const refresh = async () => {
    setRefreshing(true);
    setError("");
    const res = await fetch("/api/roadmap/refresh", { method: "POST" });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Unable to refresh roadmap.");
    else setRoadmap(data.roadmap);
    setRefreshing(false);
  };

  const updateTask = async (task: Task) => {
    const status = task.status === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED";
    const res = await fetch(`/api/roadmap/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unable to update task.");
      return;
    }
    setRoadmap((current) =>
      current
        ? {
            ...current,
            progress: data.progress,
            status: data.status,
            tasks: current.tasks.map((t) => (t.id === task.id ? { ...t, status } : t)),
          }
        : current,
    );
  };

  const CircularTaskProgress = ({ status }: { status: string }) => {
    const isCompleted = status === "COMPLETED";
    const isInProgress = status === "IN_PROGRESS";
    const value = isCompleted ? 100 : isInProgress ? 65 : 0;
    
    return (
      <div className="relative flex flex-col items-center justify-center mr-6">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle className="text-slate-100" strokeWidth="6" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32" />
          <circle
            className={`${isCompleted ? 'text-cyan' : isInProgress ? 'text-purple-500' : 'text-slate-200'} transition-all duration-1000 ease-in-out`}
            strokeWidth="6"
            strokeDasharray={2 * Math.PI * 28}
            strokeDashoffset={(2 * Math.PI * 28) - (value / 100) * (2 * Math.PI * 28)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="28" cx="32" cy="32"
          />
        </svg>
        <span className={`absolute text-sm font-black ${isCompleted ? 'text-cyan' : isInProgress ? 'text-purple-600' : 'text-slate-400'}`}>{value}%</span>
      </div>
    );
  };

  return (
    <>
      <DashboardHeader title="Personalised Learning Roadmap" subtitle="A unified plan built from your career analysis, aptitude performance, and resume gaps." />

      {roadmap && (
        <Panel className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden bg-gradient-to-r from-slate-50 to-white border-cyan/10">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-ink">Overall Progress</span>
              <span className="text-sm font-bold text-ink">{roadmap.progress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 relative"
                style={{ width: `${roadmap.progress}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 animate-pulse rounded-full" />
              </div>
            </div>
          </div>
          <button onClick={refresh} disabled={refreshing} className="shrink-0 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-cyan transition-colors">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
        </Panel>
      )}

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      {loading ? (
        <Panel className="rounded-2xl p-8 text-center text-muted"><Loader2 className="mx-auto animate-spin" /></Panel>
      ) : roadmap ? (
        <div className="relative max-w-5xl mx-auto py-8">
          {/* Central Timeline Line */}
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan/30 via-purple-300/30 to-slate-200 md:-translate-x-1/2 rounded-full" />

          <div className="space-y-8 relative">
            {roadmap.tasks.map((task, index) => {
              const isEven = index % 2 === 0;
              const isCompleted = task.status === "COMPLETED";
              const isInProgress = task.status === "IN_PROGRESS" || (index === 0 && !isCompleted); // mock some progress state if needed
              const isUpcoming = !isCompleted && !isInProgress;
              
              const statusColor = isCompleted ? 'bg-cyan' : isInProgress ? 'bg-purple-500' : 'bg-slate-300';
              const statusText = isCompleted ? 'text-cyan-700 bg-cyan-50' : isInProgress ? 'text-purple-700 bg-purple-50' : 'text-slate-500 bg-slate-100';

              return (
                <div key={task.id} className={`flex flex-col md:flex-row items-center w-full gap-4 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block md:w-1/2" />
                  
                  {/* Center Node */}
                  <div className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 flex items-center justify-center z-10 w-8 h-8 rounded-full bg-white border-4 border-slate-50 shadow-sm">
                    <div className={`w-3 h-3 rounded-full ${statusColor} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
                  </div>
                  
                  {/* Card Content */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-12 pl-16 md:pl-0' : 'md:pl-12 pl-16 md:pr-0'}`}>
                    <Panel className={`rounded-2xl p-5 md:p-6 transition-all border-2 hover:-translate-y-1 ${isCompleted ? 'border-cyan/30 hover:border-cyan/60' : isInProgress ? 'border-purple-200 hover:border-purple-400' : 'border-line hover:border-slate-300'}`}>
                      
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <Bot size={18} className={isCompleted ? "text-cyan" : "text-slate-400"} />
                          <h3 className="font-bold text-ink text-lg">{task.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ml-2 ${statusText}`}>
                            {isCompleted ? "Completed" : isInProgress ? "In Progress!" : "Upcoming"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start">
                        {/* Progress */}
                        <CircularTaskProgress status={isCompleted ? "COMPLETED" : isInProgress ? "IN_PROGRESS" : "UPCOMING"} />
                        
                        {/* Info Grid */}
                        <div className="flex-1 grid gap-4 w-full">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-muted mb-1 font-semibold">AI Suggestions</div>
                              <p className="text-sm text-ink leading-relaxed">
                                {task.description || "Focus on building a strong foundation. Practice related concepts consistently."}
                              </p>
                            </div>
                            
                            <div>
                              <div className="text-xs text-muted mb-1 font-semibold">Certificates</div>
                              {isCompleted ? (
                                <a href="#" className="flex items-center gap-1.5 text-sm text-cyan font-medium hover:underline">
                                  <ExternalLink size={14} /> Certificate Earned
                                </a>
                              ) : (
                                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                                  <Lock size={14} /> Locked
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="pt-3 border-t border-line flex justify-end">
                            <Button type="button" onClick={() => updateTask(task)} variant={isCompleted ? "secondary" : "primary"} className="px-4 py-1.5 text-sm h-8">
                              {isCompleted ? "Mark Incomplete" : "Mark Complete"}
                            </Button>
                          </div>
                        </div>
                      </div>

                    </Panel>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Panel className="rounded-2xl p-8 text-center">
          <BrainCircuit className="mx-auto mb-4 text-cyan" size={28} />
          <h3 className="font-bold text-ink">No personalised roadmap yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">Complete your profile and run career analysis first.</p>
          <Button icon={false} className="mt-5" onClick={generate} disabled={busy}>{busy ? "Generating…" : "Generate my roadmap"}</Button>
        </Panel>
      )}
    </>
  );
}
