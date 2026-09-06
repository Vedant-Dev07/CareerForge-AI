import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import ScoreBar from "@/components/ui/score-bar";
import { FileUp, CheckCircle2, AlertTriangle } from "lucide-react";

const scores = [
  { label: "ATS compatibility", value: 87 },
  { label: "Skills", value: 82 },
  { label: "Projects", value: 79 },
  { label: "Experience", value: 75 },
  { label: "Keywords", value: 88 },
  { label: "Formatting", value: 90 },
];

export default function Resume() {
  return (
    <>
      <DashboardHeader title="Resume analyzer" subtitle="Upload a resume to get an ATS and content score." />

      <Panel className="rounded-2xl p-10 flex flex-col items-center text-center mb-6 border-dashed border-cyan/35 bg-cyan/5">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan/20 bg-white text-cyan shadow-sm">
          <FileUp size={28} />
        </div>
        <p className="font-bold text-sm mb-1">Upload your resume</p>
        <p className="text-xs text-muted mb-5">PDF or DOCX</p>
        <button className="rounded-xl bg-cyan px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.22)] transition-all hover:-translate-y-0.5 hover:bg-blue-700">
          Upload resume
        </button>
      </Panel>

      <div className="grid md:grid-cols-2 gap-6">
        <Panel className="rounded-2xl p-6">
          <div className="text-xs tracking-widest text-muted font-mono mb-1">RESUME SCORE</div>
          <div className="text-5xl font-black font-mono text-cyan mb-5">84/100</div>
          <div className="space-y-4">
            {scores.map((s) => (
              <ScoreBar key={s.label} label={s.label} value={s.value} accent="#2563EB" />
            ))}
          </div>
        </Panel>
        <Panel className="rounded-2xl p-6">
          <div className="text-xs tracking-widest text-muted font-mono mb-4">AI RECOMMENDATIONS</div>
          <ul className="space-y-3 text-sm text-ink">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
              Strong technical skills section
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
              Add measurable outcomes to projects
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
              Improve role-specific keywords
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
              Education section is well structured
            </li>
          </ul>
        </Panel>
      </div>
    </>
  );
}
