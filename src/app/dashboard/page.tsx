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
import JourneyMap from "@/components/dashboard/journey-map";
import StatCard from "@/components/dashboard/stat-card";

const stats = [
  { label: "Readiness", value: "78%", detail: "Overall placement signal", icon: Target, accent: "cyan" as const },
  { label: "Career fit", value: "92%", detail: "Strong target-role match", icon: BriefcaseBusiness, accent: "success" as const },
  { label: "Resume", value: "84", detail: "ATS-ready content score", icon: FileText, accent: "forge" as const },
  { label: "Practice", value: "18", detail: "Aptitude tests completed", icon: BarChart3, accent: "warning" as const },
];

const actions = [
  { title: "Complete aptitude sprint", body: "Focus on probability, time and work, and logical puzzles.", href: "/dashboard/aptitude", icon: LineChart },
  { title: "Improve resume keywords", body: "Tune your profile for the role you want next.", href: "/dashboard/resume", icon: FileText },
  { title: "Start a mock interview", body: "Practice technical and HR prompts with AI feedback.", href: "/dashboard/interview", icon: Mic },
];

const quickLinks = [
  { href: "/dashboard/career", label: "CAREER MATCH", title: "Strong fit detected", icon: BriefcaseBusiness },
  { href: "/dashboard/skills", label: "TOP GAP", title: "System design and SQL", icon: Target },
  { href: "/dashboard/interview", label: "INTERVIEW PREP", title: "Start your first mock round", icon: Mic },
];

export default function Dashboard() {
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setUserName(session.name);
      }
    });
  }, []);

  return (
    <>
      <DashboardHeader title={`Welcome back, ${userName}`} subtitle="Here's where your placement prep stands." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5 mb-8">
        <ProfileCard />
        <ReadinessPanel />
      </div>

      <Panel className="p-6 mb-5 rounded-2xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs tracking-widest text-muted font-mono">COMPONENT SCORES</div>
            <h2 className="mt-2 text-lg font-black text-ink">Readiness breakdown</h2>
          </div>
          <BrainCircuit size={22} className="text-cyan" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ScoreBar label="Career match" value={92} accent="#2563EB" />
          <ScoreBar label="Resume score" value={84} accent="#4F46E5" />
          <ScoreBar label="Skills" value={76} accent="#16A34A" />
          <ScoreBar label="Interview" value={71} accent="#F59E0B" />
          <ScoreBar label="Aptitude" value={72} accent="#2563EB" />
          <ScoreBar label="Learning progress" value={64} accent="#4F46E5" />
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
          {actions.map((action) => {
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
                <div className="font-bold text-ink">{item.title}</div>
              </Panel>
            </Link>
          );
        })}
      </div>

      <Panel className="p-6 rounded-2xl">
        <div className="mb-4">
          <div className="text-xs tracking-widest text-muted font-mono">PRODUCT JOURNEY</div>
          <h2 className="mt-2 text-lg font-black text-ink">Your preparation map</h2>
        </div>
        <JourneyMap />
      </Panel>
    </>
  );
}
