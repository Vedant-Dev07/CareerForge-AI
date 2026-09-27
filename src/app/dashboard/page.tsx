"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  LineChart,
  Mic,
  Target,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import ScoreBar from "@/components/ui/score-bar";
import { getSession } from "@/lib/auth";
import ProfileCard from "@/components/dashboard/widgets/profile-card";
import ReadinessPanel from "@/components/dashboard/widgets/readiness-panel";
import StatCard from "@/components/dashboard/stat-card";
import WeakSkillsPanel from "@/components/aptitude/WeakSkillsPanel";

const actions = [
  { title: "Complete aptitude sprint", body: "Focus on probability, time and work, and logical puzzles.", href: "/dashboard/aptitude", icon: LineChart },
  { title: "Improve resume keywords", body: "Tune your profile for the role you want next.", href: "/dashboard/resume", icon: FileText },
  { title: "Start a mock interview", body: "Practice technical and HR prompts with AI feedback.", href: "/dashboard/interview", icon: Mic },
];

const quickLinks = [
  { href: "/dashboard/career", label: "CAREER MATCH", title: "Strong fit detected", icon: BriefcaseBusiness },
{ href: "/dashboard/skills", label: "TOP GAP", title: "Review your saved skills", icon: Target },
  { href: "/dashboard/interview", label: "INTERVIEW PREP", title: "Start your first mock round", icon: Mic },
];

export default function Dashboard() {
  const [userName, setUserName] = useState("Student");
  const [summary, setSummary] = useState<{
    careerFit: number;
    skillCount: number;
    skills: string[];
    resumeScore?: number | null;
    analysis?: { career: string; matchedSkills: string[]; missingSkills: string[]; recommendations: string[] } | null;
  } | null>(null);
  const [roadmap, setRoadmap] = useState<{ progress: number; title: string; tasks: { title: string; status: string }[] } | null>(null);
  const [aptitudeSummary, setAptitudeSummary] = useState<{
    latestScore: number | null;
    averageScore: number | null;
    testsCompleted: number;
    accuracy: number | null;
  } | null>(null);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setUserName(session.name);
      }
    });
    fetch("/api/profile", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { summary?: typeof summary }) => setSummary(data.summary ?? null));
    fetch("/api/roadmap", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { roadmap?: typeof roadmap | null }) => setRoadmap(data.roadmap ?? null));
    fetch("/api/aptitude/summary", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return;
        const data = (await response.json()) as NonNullable<typeof aptitudeSummary>;
        setAptitudeSummary(data);
      });
  }, []);

  const careerFit = summary?.careerFit ?? 0;
  const skillsScore = summary?.analysis
    ? Math.round((summary.analysis.matchedSkills.length / Math.max(1, summary.analysis.matchedSkills.length + summary.analysis.missingSkills.length)) * 100)
    : Math.min(95, summary ? summary.skillCount * 10 : 0);
  const stats = [
    { label: "Readiness", value: summary ? `${Math.round((careerFit + skillsScore) / 2)}%` : "—", detail: "Based on your saved profile", icon: Target, accent: "cyan" as const },
    { label: "Career fit", value: summary ? `${careerFit}%` : "—", detail: "Based on target role and skills", icon: BriefcaseBusiness, accent: "success" as const },
    { label: "Resume", value: summary?.resumeScore != null ? `${summary.resumeScore}%` : "—", detail: summary?.resumeScore != null ? "ATS Match Score" : "Add a resume to calculate", icon: FileText, accent: "forge" as const },
    { label: "Learning", value: roadmap ? `${roadmap.progress}%` : "—", detail: roadmap ? "Roadmap task progress" : "Generate your roadmap", icon: BarChart3, accent: "warning" as const },
  ];
  const dashboardActions = summary?.analysis?.recommendations.length
    ? summary.analysis.recommendations.slice(0, 3).map((recommendation) => ({
        title: recommendation,
        body: `Close this gap for ${summary.analysis?.career ?? "your target role"}.`,
        href: "/dashboard/career",
        icon: Target,
      }))
    : actions;

  return (
    <>
      <DashboardHeader title={`Welcome back, ${userName}`} subtitle="Here's where your placement prep stands." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Panel className="mb-6 rounded-2xl p-5">
        <div className="mb-4">
          <div className="text-xs tracking-widest text-muted font-mono">APTITUDE PERFORMANCE</div>
          <h2 className="mt-2 text-lg font-black text-ink">Assessment progress</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Latest score",
              value: aptitudeSummary?.latestScore == null ? "—" : `${aptitudeSummary.latestScore}%`,
            },
            {
              label: "Average score",
              value: aptitudeSummary?.averageScore == null ? "—" : `${aptitudeSummary.averageScore}%`,
            },
            {
              label: "Tests completed",
              value: String(aptitudeSummary?.testsCompleted ?? 0),
            },
            {
              label: "Accuracy",
              value: aptitudeSummary?.accuracy == null ? "—" : `${aptitudeSummary.accuracy}%`,
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xs text-muted">{item.label}</div>
              <div className="mt-1 text-xl font-black font-mono text-ink">{item.value}</div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5 mb-8">
        <ProfileCard />
        <ReadinessPanel />
      </div>

      <WeakSkillsPanel />

      <Panel className="p-6 mb-5 rounded-2xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs tracking-widest text-muted font-mono">COMPONENT SCORES</div>
            <h2 className="mt-2 text-lg font-black text-ink">Readiness breakdown</h2>
          </div>
          <BrainCircuit size={22} className="text-cyan" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ScoreBar label="Career match" value={careerFit} accent="#2563EB" />
          <ScoreBar label="Resume score" value={0} accent="#4F46E5" />
          <ScoreBar label="Skills" value={skillsScore} accent="#16A34A" />
          <ScoreBar label="Interview" value={71} accent="#F59E0B" />
          <ScoreBar label="Aptitude" value={aptitudeSummary?.latestScore ?? 0} accent="#2563EB" />
          <ScoreBar label="Learning progress" value={roadmap?.progress ?? 0} accent="#4F46E5" />
        </div>
      </Panel>

      <Panel className="p-6 mb-5 rounded-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs tracking-widest text-muted font-mono">RECOMMENDED ACTIONS</div>
            <h2 className="mt-2 text-lg font-black text-ink">Next best moves</h2>
          </div>
          <CheckCircle2 size={21} className="text-success" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {dashboardActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href} className="group rounded-2xl border border-line bg-slate-50/80 p-4 transition-all hover:-translate-y-1 hover:border-cyan/35 hover:bg-white">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan">
                    <Icon size={18} />
                  </div>
                  <ArrowRight size={16} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-cyan" />
                </div>
                <h3 className="font-bold text-ink">{action.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{action.body}</p>
              </Link>
            );
          })}
        </div>
      </Panel>

      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Panel className="rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-cyan/40">
                <Icon size={18} className="mb-4 text-cyan" />
                <div className="text-xs text-muted font-mono mb-1">{item.label}</div>
                <div className="font-bold text-ink">
                  {item.label === "CAREER MATCH" && summary ? `${careerFit}% fit for ${summary.analysis?.career ?? "your profile"}` : item.label === "TOP GAP" && summary ? summary.analysis?.missingSkills[0] ?? `${summary.skillCount} saved skills` : item.title}
                </div>
              </Panel>
            </Link>
          );
        })}
      </div>
    </>
  );
}
