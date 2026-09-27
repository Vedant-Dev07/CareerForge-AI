"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import { getSession } from "@/lib/auth";
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CircularProgress = ({ value, title }: { value: number; title: string }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <Panel className="flex flex-col items-center justify-center p-5 rounded-2xl transition-all hover:-translate-y-1 hover:border-cyan/40">
      <h3 className="text-xs tracking-wide text-muted font-semibold text-center h-10 flex items-center justify-center mb-2">{title}</h3>
      <div className="relative flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            className="text-line"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
          <circle
            className="text-cyan transition-all duration-1000 ease-in-out"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
        </svg>
        <span className="absolute text-lg font-black text-ink">{value}%</span>
      </div>
    </Panel>
  );
};

const weeklyData = [
  { name: 'Mon', score: 20 },
  { name: 'Tue', score: 40 },
  { name: 'Wed', score: 35 },
  { name: 'Thu', score: 50 },
  { name: 'Fri', score: 45 },
  { name: 'Sat', score: 70 },
  { name: 'Sun', score: 90 },
];

const trendData = [
  { name: 'Week 1', score: 30 },
  { name: 'Week 2', score: 45 },
  { name: 'Week 3', score: 40 },
  { name: 'Week 4', score: 60 },
  { name: 'Week 5', score: 75 },
  { name: 'Week 6', score: 92 },
];

const radarData = [
  { subject: 'Technical', A: 90, fullMark: 100 },
  { subject: 'Aptitude', A: 85, fullMark: 100 },
  { subject: 'Leadership', A: 60, fullMark: 100 },
  { subject: 'Communication', A: 80, fullMark: 100 },
];

export default function Dashboard() {
  const [userName, setUserName] = useState("Student");
  const [summary, setSummary] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setUserName(session.name);
      }
    });
    fetch("/api/profile", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setSummary(data.summary ?? null));
    fetch("/api/roadmap", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setRoadmap(data.roadmap ?? null));
  }, []);

  const careerFit = summary?.careerFit ?? 92;
  const resumeScore = summary?.resumeScore ?? 87;
  const atsScore = summary?.resumeScore ? summary.resumeScore + 3 : 90;
  const interviewReadiness = 84;
  const skillGap = 18;
  const learningProgress = roadmap?.progress ?? 72;

  return (
    <>
      <DashboardHeader title={`Dashboard`} subtitle="Overview of your placement preparation" />

      {/* Top Row: Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <CircularProgress title="Placement Readiness Score" value={careerFit} />
        <CircularProgress title="Resume Score" value={resumeScore} />
        <CircularProgress title="ATS Score" value={atsScore} />
        <CircularProgress title="Interview Readiness" value={interviewReadiness} />
        <CircularProgress title="Skill Gap" value={skillGap} />
        <CircularProgress title="Learning Progress" value={learningProgress} />
      </div>

      {/* Middle Row: Charts */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        {/* Weekly Progress Graph */}
        <Panel className="p-5 rounded-2xl h-80 flex flex-col">
          <h3 className="text-sm font-semibold text-ink mb-4">Weekly Progress Graph</h3>
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Placement Readiness Trend */}
        <Panel className="p-5 rounded-2xl h-80 flex flex-col">
          <h3 className="text-sm font-semibold text-ink mb-4">Placement Readiness Trend</h3>
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Skills Radar Chart */}
        <Panel className="p-5 rounded-2xl h-80 flex flex-col">
          <h3 className="text-sm font-semibold text-ink mb-4">Skills Radar Chart</h3>
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Student" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Bottom Row: Tasks and Suggestions */}
      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        {/* Today's Tasks */}
        <Panel className="p-6 rounded-2xl flex flex-col">
          <h3 className="text-sm font-semibold text-ink mb-5">Today's Tasks</h3>
          <div className="space-y-4 flex-1">
            {[
              "Solve SQL Quiz",
              "Practice Aptitude",
              "Update Resume",
              "Mock Interview"
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50/50 rounded-lg transition-colors">
                <CheckCircle2 className="text-cyan w-5 h-5 flex-shrink-0" />
                <span className="text-ink font-medium">{task}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Recent AI Suggestions */}
        <Panel className="p-6 rounded-2xl relative overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-white">
          <h3 className="text-sm font-semibold text-ink mb-5">Recent AI Suggestions</h3>
          <div className="space-y-4 z-10 flex-1">
            <div className="flex items-start gap-3">
              <span className="text-ink text-sm leading-relaxed">
                <span className="font-semibold text-cyan">AI Suggestion 1:</span> Strengthen Java skills for top-tier roles
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-ink text-sm leading-relaxed">
                <span className="font-semibold text-cyan">AI Suggestion 2:</span> Refine resume formatting for better ATS compatibility
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-ink text-sm leading-relaxed">
                <span className="font-semibold text-cyan">AI Suggestion 3:</span> Schedule a mock interview for behavioural questions
              </span>
            </div>
          </div>
          <Sparkles className="absolute bottom-4 right-4 text-cyan/10 w-24 h-24 rotate-12" />
        </Panel>
      </div>
    </>
  );
}
