"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import { Send } from "lucide-react";

const suggested = [
  "What should I learn next?",
  "How can I improve my resume?",
  "Which skills should I focus on?",
];

export default function Mentor() {
  const [messages] = useState([{ from: "mentor", text: "Complete onboarding so your mentor receives your profile and progress details." }]);

  return (
    <>
      <DashboardHeader title="AI career mentor" subtitle="Your guidance assistant is ready when your profile is complete." />

      <Panel className="p-0 flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[75%] text-sm p-3 ${
                m.from === "mentor"
                  ? "bg-navy border border-line"
                  : "bg-forge/10 border border-forge/30 ml-auto text-right"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className="border-t border-line p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggested.map((s) => (
              <button
                key={s}
                className="text-xs px-3 py-1.5 border border-line text-muted hover:text-ink hover:border-white/40 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 bg-navy border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-cyan"
              placeholder="Enter your question"
            />
            <button className="p-2.5 bg-forge text-[#1A0A00]">
              <Send size={16} />
            </button>
          </div>
        </div>
      </Panel>
    </>
  );
}
