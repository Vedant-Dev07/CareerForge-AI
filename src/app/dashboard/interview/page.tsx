"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";
import { Mic, Loader2, Play, CheckCircle2, AlertCircle, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

type Session = {
  id: string;
  interviewType: string;
  difficulty: string;
  score: number | null;
  status: string;
  createdAt: string;
};

export default function InterviewDashboard() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const [interviewType, setInterviewType] = useState("TECHNICAL");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [numQuestions, setNumQuestions] = useState(5);

  useEffect(() => {
    fetch("/api/interview/sessions")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSessions(data.sessions);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const startInterview = async () => {
    setStarting(true);
    setError("");
    try {
      const res = await fetch("/api/interview/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewType, difficulty, numQuestions })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start interview");
      
      router.push(`/dashboard/interview/${data.session.id}`);
    } catch (e: any) {
      setError(e.message);
      setStarting(false);
    }
  };

  return (
    <>
      <DashboardHeader 
        title="Interview Preparation" 
        subtitle="Practice with personalized, AI-driven technical and behavioral questions." 
      />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Panel className="p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
              <Mic size={20} />
            </div>
            <h2 className="text-xl font-black text-ink">New Interview</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-muted tracking-widest mb-2 block">INTERVIEW TYPE</label>
              <select 
                className="w-full rounded-xl border-line bg-slate-50 p-3 text-sm"
                value={interviewType}
                onChange={e => setInterviewType(e.target.value)}
              >
                <option value="TECHNICAL">Technical</option>
                <option value="HR">HR & Behavioral</option>
                <option value="MIXED">Mixed</option>
                <option value="RESUME_BASED">Resume Based</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted tracking-widest mb-2 block">DIFFICULTY</label>
              <select 
                className="w-full rounded-xl border-line bg-slate-50 p-3 text-sm"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted tracking-widest mb-2 block">NUMBER OF QUESTIONS</label>
              <select 
                className="w-full rounded-xl border-line bg-slate-50 p-3 text-sm"
                value={numQuestions}
                onChange={e => setNumQuestions(parseInt(e.target.value))}
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <Button className="w-full mt-2" onClick={startInterview} disabled={starting}>
              {starting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Play className="mr-2" size={18} />}
              Start Interview
            </Button>
          </div>
        </Panel>

        <Panel className="p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BarChart3 size={20} />
            </div>
            <h2 className="text-xl font-black text-ink">Interview History</h2>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center text-muted">
              <Loader2 className="animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted">
              No interview sessions yet. Start one to see your progress!
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map(s => (
                <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-line hover:border-cyan/30 transition-colors">
                  <div>
                    <div className="font-semibold text-ink flex items-center gap-2">
                      {s.interviewType.replace("_", " ")}
                      {s.status === "COMPLETED" && <CheckCircle2 size={14} className="text-green-500" />}
                    </div>
                    <div className="text-xs text-muted mt-1">
                      {new Date(s.createdAt).toLocaleDateString()} · {s.difficulty}
                    </div>
                  </div>
                  <div>
                    {s.status === "COMPLETED" ? (
                      <div className="text-lg font-black text-ink">{s.score?.toFixed(1)}%</div>
                    ) : (
                      <Button variant="secondary" onClick={() => router.push(`/dashboard/interview/${s.id}`)}>
                        Resume
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
