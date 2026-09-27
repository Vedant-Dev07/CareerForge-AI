"use client";

import { useEffect, useState } from "react";

interface WeakSkill {
  skill: string;
  skillId: string;
  accuracy: number;
  classification: string;
  priority: string;
  correct: number;
  incorrect: number;
}

export function WeakSkillsPanel() {
  const [weakSkills, setWeakSkills] = useState<WeakSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeakSkills() {
      try {
        const res = await fetch("/api/aptitude/weak-skills");
        if (res.ok) {
          const data = await res.json();
          setWeakSkills(data.skills || []);
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
    return <div className="p-4 border rounded-lg animate-pulse bg-gray-50">Loading weak skills...</div>;
  }

  if (weakSkills.length === 0) {
    return (
      <div className="p-6 text-center border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No skill weaknesses detected yet.</h3>
        <p className="text-gray-500 mb-4">Complete an aptitude assessment to identify your weak skills.</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Start Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Weak Skills</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {weakSkills.map((ws) => (
          <div key={ws.skillId} className="border rounded p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg capitalize">{ws.skill}</span>
              <span className={`px-2 py-1 text-xs rounded-full font-medium
                ${ws.classification === 'CRITICAL' ? 'bg-red-100 text-red-800' : ''}
                ${ws.classification === 'WEAK' ? 'bg-orange-100 text-orange-800' : ''}
                ${ws.classification === 'DEVELOPING' ? 'bg-yellow-100 text-yellow-800' : ''}
              `}>
                {ws.classification.replace('_', ' ')}
              </span>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Accuracy: {ws.accuracy.toFixed(1)}%</span>
                <span>Priority: {ws.priority}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${ws.accuracy < 40 ? 'bg-red-500' : ws.accuracy < 60 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                  style={{ width: `${ws.accuracy}%` }}
                ></div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {ws.correct} Correct, {ws.incorrect} Incorrect
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
