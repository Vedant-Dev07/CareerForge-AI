"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";
import ScoreBar from "@/components/ui/score-bar";
import { MessageSquareText, Mic, Sparkles } from "lucide-react";

export default function Interview() {
  const prompts = [
    "Explain how you would improve the performance of a slow React dashboard with many charts and filters.",
    "How would you design a reusable data-fetching hook for a React application?",
    "Tell us about a project where you had to debug a difficult frontend issue.",
  ];
  const [promptIndex, setPromptIndex] = useState(0);
  const [started, setStarted] = useState(false);

  return (
    <>
      <DashboardHeader title="AI mock interview" subtitle="Practice role-focused questions with structured feedback." />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel className="rounded-2xl p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-xs tracking-widest text-muted font-mono mb-2">MOCK INTERVIEW</div>
              <h2 className="text-2xl font-black text-ink">Frontend developer round</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan">
              <Mic size={23} />
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-slate-50/80 p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-mono tracking-[0.16em] text-cyan">
              <Sparkles size={14} />
              SAMPLE PROMPT
            </div>
            <p className="text-sm leading-relaxed text-muted">
              {prompts[promptIndex]}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button icon={false} onClick={() => setStarted(true)}>
              {started ? "Interview in progress" : "Start interview"}
            </Button>
            <Button
              icon={false}
              variant="secondary"
              onClick={() => {
                setStarted(true);
                setPromptIndex((index) => (index + 1) % prompts.length);
              }}
            >
              Practice question
            </Button>
          </div>
        </Panel>

        <Panel className="rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="text-xs tracking-widest text-muted font-mono">EVALUATION</div>
            <MessageSquareText className="text-cyan" size={20} />
          </div>
          <div className="space-y-4">
            <ScoreBar label="Clarity" value={74} accent="#2563EB" />
            <ScoreBar label="Technical depth" value={68} accent="#4F46E5" />
            <ScoreBar label="Structure" value={71} accent="#16A34A" />
            <ScoreBar label="Confidence" value={64} accent="#F59E0B" />
          </div>
        </Panel>
      </div>
    </>
  );
}
