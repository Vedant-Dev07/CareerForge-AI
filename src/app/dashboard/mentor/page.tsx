"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import { Bot, Send, Sparkles } from "lucide-react";

const suggested = [
  "What should I learn next?",
  "How can I improve my resume?",
  "Which skills should I focus on?",
];

type Message = {
  from: "mentor" | "student";
  text: string;
};

export default function Mentor() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "mentor", text: "Complete onboarding so your mentor receives your profile and progress details." },
  ]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { from: "student", text },
      { from: "mentor", text: "Good question. Start with your highest-priority gap, then connect it to a small project and one interview story." },
    ]);
    setInput("");
  };

  return (
    <>
      <DashboardHeader title="AI career mentor" subtitle="Your guidance assistant is ready when your profile is complete." />

      <Panel className="rounded-2xl p-0 flex flex-col h-[560px]">
        <div className="border-b border-line p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan">
              <Bot size={22} />
            </div>
            <div>
              <div className="text-sm font-black text-ink">CareerForge Mentor</div>
              <div className="text-xs text-muted">Progress-aware placement guidance</div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-slate-50/70 p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.from}-${index}`}
              className={`max-w-[82%] rounded-2xl border p-4 text-sm leading-relaxed shadow-sm ${
                message.from === "mentor"
                  ? "border-line bg-white text-muted"
                  : "ml-auto border-cyan/25 bg-cyan text-white"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="border-t border-line bg-white p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggested.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setInput(suggestion)}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-slate-50 px-3 py-1.5 text-xs text-muted transition-colors hover:border-cyan/35 hover:text-ink"
              >
                <Sparkles size={13} />
                {suggestion}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              className="flex-1 border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm focus:outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/10"
              placeholder="Enter your question"
            />
            <button
              type="button"
              onClick={sendMessage}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan text-white shadow-[0_12px_26px_rgba(37,99,235,0.22)] transition-all hover:-translate-y-0.5 hover:bg-blue-700"
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      </Panel>
    </>
  );
}
