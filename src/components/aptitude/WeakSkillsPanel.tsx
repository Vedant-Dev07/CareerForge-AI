"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrainCircuit, AlertCircle } from "lucide-react";
import Panel from "@/components/ui/panel";

interface WeakSkill {
  skill: string;
  skillId: string;
  accuracy: number;
  classification: string;
  priority: string;
  correct: number;
  incorrect: number;
}

export default function WeakSkillsPanel() {
  const [weakSkills, setWeakSkills] = useState<WeakSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeakSkills() {
      try {
        const res = await fetch("/api/aptitude/weak-skills");
        if (res.ok) {
          const data = await res.json();
          // Sort by accuracy ascending, get top 3
          const sorted = (data.skills || []).sort((a: WeakSkill, b: WeakSkill) => a.accuracy - b.accuracy).slice(0, 3);
          setWeakSkills(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch weak skills", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWeakSkills();
  }, []);

  if (loading) {
    return (
      <Panel className="p-6 rounded-2xl animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
        <div className="h-20 w-full bg-gray-100 rounded"></div>
      </Panel>
    );
  }

  if (weakSkills.length === 0) {
    return null; // Don't show if there are no weak skills or if no assessment has been taken
  }

  return (
    <Panel className="p-6 rounded-2xl mb-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-xs tracking-widest text-muted font-mono">APTITUDE GAPS</div>
          <h2 className="mt-2 text-lg font-black text-ink">Weak Skills Detected</h2>
        </div>
        <AlertCircle size={21} className="text-warning" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {weakSkills.map((ws) => (
          <div key={ws.skillId} className="rounded-2xl border border-line bg-slate-50/80 p-4 transition-all hover:-translate-y-1 hover:border-cyan/35 hover:bg-white">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-ink capitalize truncate">{ws.skill}</span>
              <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold tracking-wider
                ${ws.classification === 'CRITICAL' ? 'bg-red-100 text-red-800' : ''}
                ${ws.classification === 'WEAK' ? 'bg-orange-100 text-orange-800' : ''}
                ${ws.classification === 'DEVELOPING' ? 'bg-yellow-100 text-yellow-800' : ''}
              `}>
                {ws.classification.replace('_', ' ')}
              </span>
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between text-xs font-semibold text-muted mb-1.5">
                <span>Accuracy</span>
                <span className={ws.accuracy < 40 ? 'text-red-600' : ws.accuracy < 60 ? 'text-orange-600' : 'text-yellow-600'}>
                  {ws.accuracy.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-line rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${ws.accuracy < 40 ? 'bg-red-500' : ws.accuracy < 60 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                  style={{ width: `${Math.max(ws.accuracy, 5)}%` }}
                ></div>
              </div>
            </div>
            <div className="text-[11px] text-muted font-medium mt-3 flex justify-between">
              <span>{ws.correct} Correct, {ws.incorrect} Incorrect</span>
              <span className="font-mono">{ws.priority} Priority</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 text-center">
        <Link href="/dashboard/aptitude" className="text-sm font-bold text-cyan hover:underline">
          View Detailed Skill Analysis →
        </Link>
      </div>
    </Panel>
  );
}
