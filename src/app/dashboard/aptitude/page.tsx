import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import ScoreBar from "@/components/ui/score-bar";
import StatCard from "@/components/dashboard/stat-card";
import { Brain, CheckCircle2, Clock3, Trophy } from "lucide-react";

const categories = [
  { title: "Quantitative", topics: ["Percentage", "Ratio", "Average", "Profit & loss", "Time & work", "Probability", "Permutation & combination", "Speed / distance"] },
  { title: "Logical reasoning", topics: ["Number series", "Coding-decoding", "Blood relations", "Directions", "Syllogisms", "Puzzles"] },
  { title: "Verbal", topics: ["Grammar", "Vocabulary", "Sentence correction", "Reading comprehension"] },
];

const weakAreas = [
  { label: "Probability", value: 40 },
  { label: "Time & work", value: 55 },
  { label: "Logical puzzles", value: 35 },
];

export default function Aptitude() {
  return (
    <>
      <DashboardHeader title="Aptitude preparation" subtitle="Quantitative, logical reasoning and verbal ability." />

      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Overall score", value: "72%", detail: "Current aptitude level", icon: Trophy, accent: "cyan" as const },
          { label: "Accuracy", value: "78%", detail: "Average correct rate", icon: CheckCircle2, accent: "success" as const },
          { label: "Questions", value: "240", detail: "Problems solved", icon: Brain, accent: "forge" as const },
          { label: "Tests", value: "18", detail: "Mocks completed", icon: Clock3, accent: "warning" as const },
        ].map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Panel className="rounded-2xl p-6 mb-6">
        <div className="text-xs tracking-widest text-muted font-mono mb-4">WEAK AREAS</div>
        <div className="space-y-4">
          {weakAreas.map((w) => (
            <ScoreBar key={w.label} label={w.label} value={w.value} accent="#F59E0B" />
          ))}
        </div>
      </Panel>

      <div className="grid md:grid-cols-3 gap-5">
        {categories.map((c) => (
          <Panel key={c.title} className="rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-cyan/35">
            <h3 className="font-bold text-sm mb-3 text-ink">{c.title}</h3>
            <ul className="space-y-1.5">
              {c.topics.map((t) => (
                <li key={t} className="text-xs text-muted flex items-center gap-2">
                  <span className="w-1 h-1 bg-cyan rotate-45 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </>
  );
}
