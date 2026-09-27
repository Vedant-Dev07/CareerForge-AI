"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import Button from "@/components/ui/button";
import { 
  AlertTriangle, 
  BriefcaseBusiness, 
  CheckCircle2, 
  Target,
  BrainCircuit,
  ExternalLink,
  Code2,
  Database,
  Layout
} from "lucide-react";
import ProfileCard from "@/components/dashboard/widgets/profile-card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart
} from 'recharts';

type Role = { id: string; title: string; domain: string; requiredSkills: string[] };
type Analysis = { career: string; matchPercentage: number; matchedSkills: string[]; missingSkills: string[]; recommendations: string[] };

const salaryData = [
  { name: 'Y1', salary: 90, growth: 95 },
  { name: 'Y2', salary: 105, growth: 110 },
  { name: 'Y3', salary: 120, growth: 130 },
  { name: 'Y4', salary: 140, growth: 155 },
  { name: 'Y5', salary: 160, growth: 180 },
];

const CircularProgressSmall = ({ value }: { value: number }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          className="text-line"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
        />
        <circle
          className="text-cyan transition-all duration-1000 ease-in-out drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
        />
      </svg>
      <span className="absolute text-2xl font-black text-ink">{value}%</span>
    </div>
  );
};

export default function Career() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/career/roles", { cache: "no-store" }).then((response) => response.json()),
      fetch("/api/profile", { cache: "no-store" }).then((response) => response.json()),
    ])
      .then(([roleData, profileData]: [any, any]) => {
        setRoles(roleData.roles ?? []);
        setSelectedRole(profileData.profile?.targetCareerId ?? "");
        setAnalysis(profileData.summary?.analysis ?? null);
      })
      .catch(() => setError("Unable to load career roles."))
      .finally(() => setLoading(false));
  }, []);

  const analyze = async () => {
    if (!selectedRole) {
      setError("Select a career role first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/career/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerRoleId: selectedRole }),
      });
      const data = await response.json();
      if (!response.ok || !data.analysis) {
        setError(data.error ?? "Unable to analyze this career.");
        return;
      }
      setAnalysis(data.analysis);
    } catch {
      setError("Unable to analyze this career.");
    } finally {
      setLoading(false);
    }
  };

  const matchPercentage = analysis?.matchPercentage ?? 94;
  const careerTitle = analysis?.career ?? "Software Engineer";
  const matchedSkills = analysis?.matchedSkills ?? ["Java", "React", "SQL", "Git"];
  const missingSkills = analysis?.missingSkills ?? ["Spring Boot", "Docker", "REST APIs"];

  return (
    <>
      <DashboardHeader title="Career Path" subtitle="Explore recommendations and growth opportunities" />

      {/* Role Selection (Kept functional part, simplified visually) */}
      <Panel className="mb-6 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
        <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} className="flex-1 min-w-[200px] border border-line bg-slate-50 px-4 py-2 text-sm text-ink rounded-lg focus:border-cyan focus:outline-none">
          <option value="">{loading ? "Loading roles..." : "Select a target role"}</option>
          {roles.map((role) => <option key={role.id} value={role.id}>{role.title} · {role.domain}</option>)}
        </select>
        <Button type="button" icon={false} onClick={analyze} disabled={loading || !roles.length}>Analyze skills</Button>
      </Panel>
      {error ? <p className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {/* Top Row: Profile & Recommendation */}
      <div className="grid lg:grid-cols-[1fr_2fr] gap-6 mb-6">
        <div className="flex">
          <div className="w-full h-full [&>div]:h-full">
            <ProfileCard />
          </div>
        </div>

        <Panel className="relative overflow-hidden rounded-2xl p-6 border-2 border-cyan/40 bg-gradient-to-br from-cyan/5 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.15)] flex flex-col justify-between">
          <div className="absolute top-4 left-4 flex items-center gap-2 text-cyan font-semibold text-sm">
            <BrainCircuit size={16} /> AI Recommendation
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-muted text-sm mb-1">Recommended Career</p>
              <h2 className="text-3xl lg:text-4xl font-black text-ink bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 drop-shadow-sm pb-1">
                {careerTitle}
              </h2>
            </div>
            
            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-cyan/20">
              <CircularProgressSmall value={matchPercentage} />
              <div className="font-bold text-ink text-lg">Compatibility<br/>Score</div>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">Top Skills</p>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-full border border-cyan/30 bg-cyan/10 text-cyan text-sm font-medium flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 size={14} /> {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-full border border-slate-300 bg-slate-100 text-slate-600 text-sm font-medium flex items-center gap-1.5 shadow-sm">
                    <AlertTriangle size={14} className="text-slate-400" /> {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Bottom Row: Charts & Info */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        
        {/* Career Growth Roadmap Timeline */}
        <Panel className="p-6 rounded-2xl flex flex-col">
          <h3 className="text-sm font-semibold text-ink mb-6">Career Growth Roadmap Timeline</h3>
          <div className="relative flex-1 flex flex-col justify-center px-4">
            <div className="absolute left-8 right-8 top-1/2 h-1 bg-cyan/20 -translate-y-1/2 rounded-full" />
            <div className="absolute left-8 right-1/2 top-1/2 h-1 bg-cyan -translate-y-1/2 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            
            <div className="relative flex justify-between w-full">
              <div className="flex flex-col items-center group">
                <span className="text-xs font-bold text-ink mb-3">Year 1</span>
                <div className="w-4 h-4 rounded-full bg-cyan border-4 border-white shadow-[0_0_10px_rgba(6,182,212,0.8)] z-10" />
                <div className="mt-3 text-center transition-all group-hover:-translate-y-1">
                  <span className="block text-xs font-bold text-ink bg-slate-100 px-3 py-1 rounded-lg">Junior Engineer</span>
                  <span className="block text-[10px] text-muted mt-1">Java/SQL Focus</span>
                </div>
              </div>

              <div className="flex flex-col items-center group">
                <span className="text-xs font-bold text-ink mb-3">Year 3</span>
                <div className="w-4 h-4 rounded-full bg-cyan border-4 border-white shadow-[0_0_10px_rgba(6,182,212,0.8)] z-10" />
                <div className="mt-3 text-center transition-all group-hover:-translate-y-1">
                  <span className="block text-xs font-bold text-ink bg-slate-100 px-3 py-1 rounded-lg">Mid-Level Engineer</span>
                  <span className="block text-[10px] text-muted mt-1">React/REST APIs</span>
                </div>
              </div>

              <div className="flex flex-col items-center group opacity-50">
                <span className="text-xs font-bold text-ink mb-3">Year 5</span>
                <div className="w-4 h-4 rounded-full bg-slate-300 border-4 border-white z-10" />
                <div className="mt-3 text-center">
                  <span className="block text-xs font-bold text-ink bg-slate-100 px-3 py-1 rounded-lg">Senior Engineer</span>
                  <span className="block text-[10px] text-muted mt-1">Architecture</span>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* Salary Range Chart */}
        <Panel className="p-6 rounded-2xl flex flex-col">
          <h3 className="text-sm font-semibold text-ink mb-6 flex justify-between">
            Salary Range Chart
            <span className="text-cyan font-normal text-xs flex items-center gap-1"><div className="w-2 h-2 bg-cyan rounded-full"/> 5 year growth</span>
          </h3>
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salaryData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => `$${val}k`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(val) => `$${val}k`} />
                <Bar dataKey="salary" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} fillOpacity={0.8} />
                <Line type="monotone" dataKey="growth" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Learning Resources */}
        <Panel className="p-6 rounded-2xl flex flex-col">
          <h3 className="text-sm font-semibold text-ink mb-4">Learning Resources</h3>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {[
              { title: "Java Masterclass", source: "Udemy", icon: Code2, color: "text-orange-500", bg: "bg-orange-100" },
              { title: "React Certification", source: "Coursera", icon: Layout, color: "text-blue-500", bg: "bg-blue-100" },
              { title: "Docker for Beginners", source: "Docker", icon: Database, color: "text-cyan-600", bg: "bg-cyan-100" },
              { title: "Spring Boot Path", source: "Pluralsight", icon: Code2, color: "text-emerald-500", bg: "bg-emerald-100" },
            ].map((resource, i) => (
              <a key={i} href="#" className="flex items-center justify-between p-3 rounded-xl border border-line bg-slate-50 hover:border-cyan/40 hover:bg-white transition-all group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${resource.bg} ${resource.color}`}>
                    <resource.icon size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-sm group-hover:text-cyan transition-colors">{resource.title}</div>
                    <div className="text-xs text-muted mt-0.5">{resource.source}</div>
                  </div>
                </div>
                <ExternalLink size={16} className="text-slate-300 group-hover:text-cyan transition-colors" />
              </a>
            ))}
          </div>
        </Panel>

      </div>
    </>
  );
}
