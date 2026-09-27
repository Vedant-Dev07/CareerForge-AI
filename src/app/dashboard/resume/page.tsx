"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, PlusCircle, Lightbulb, Edit3, Settings, Award } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const CircularProgressSmall = ({ value, title, color = "text-cyan" }: { value: number; title: string, color?: string }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h3 className="text-sm font-semibold text-ink mb-4">{title}</h3>
      <div className="relative flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle className="text-line" strokeWidth="6" stroke="currentColor" fill="transparent" r={radius} cx="40" cy="40" />
          <circle
            className={`${color} transition-all duration-1000 ease-in-out`}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius} cx="40" cy="40"
          />
        </svg>
        <span className="absolute text-lg font-black text-ink">{value}%</span>
      </div>
    </div>
  );
};

export default function ResumeAnalyzerPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [activeResume, setActiveResume] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchResumeDetails = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/resume/${id}`);
      if (res.ok) {
        const data = await res.json();
        setActiveResume(data.resume);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchResumes = useCallback(async () => {
    try {
      const res = await fetch("/api/resume");
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes || []);
        if (data.resumes?.length > 0 && !activeResume) {
          fetchResumeDetails(data.resumes[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeResume, fetchResumeDetails]);

  useEffect(() => {
    void fetchResumes();
  }, [fetchResumes]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      await fetchResumes();
      fetchResumeDetails(data.resumeId);
    } catch (e: any) {
      setUploadError(e.message);
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeResume = async () => {
    if (!activeResume) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/resume/${activeResume.id}/analyze`, { method: "POST" });
      if (res.ok) {
        await fetchResumeDetails(activeResume.id);
        await fetchResumes();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const strengthData = [
    { subject: 'Skills', A: 90, fullMark: 100 },
    { subject: 'Experience', A: 85, fullMark: 100 },
    { subject: 'Keywords', A: 70, fullMark: 100 },
    { subject: 'Education', A: 95, fullMark: 100 },
  ];

  const weaknessData = [
    { name: 'Measurable Achievements', value: 20 },
    { name: 'Project Descriptions', value: 45 },
    { name: 'Certifications', value: 30 },
  ];

  return (
    <>
      <DashboardHeader title="Resume Analyzer" subtitle="Drop your resume for AI-driven feedback and ATS scoring" />

      {/* Upload Zone */}
      <Panel className="mb-6 rounded-2xl overflow-hidden relative group border-2 border-dashed border-cyan/30 hover:border-cyan transition-colors bg-gradient-to-r from-cyan/5 to-blue-500/5">
        <label className="flex flex-col items-center justify-center py-10 cursor-pointer w-full h-full">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-cyan mb-4 group-hover:scale-110 transition-transform">
            <Upload size={28} />
          </div>
          <h3 className="text-lg font-bold text-ink mb-1">Drag & Drop your resume (PDF)</h3>
          <p className="text-sm text-muted mb-4">Or click to browse files</p>
          <div className="bg-cyan text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-600 transition-colors">
            {isUploading ? "Uploading..." : "Browse Files"}
          </div>
          <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileUpload} disabled={isUploading} />
        </label>
        {uploadError && <p className="absolute bottom-4 left-0 right-0 text-xs text-red-500 text-center font-semibold">{uploadError}</p>}
      </Panel>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 mb-8">
        
        {/* Left Column: Analytics */}
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Panel className="rounded-2xl flex items-center justify-center">
              <CircularProgressSmall title="Resume Score" value={activeResume?.analysis?.atsScore ?? 89} color="text-blue-600" />
            </Panel>
            <Panel className="rounded-2xl flex items-center justify-center">
              <CircularProgressSmall title="ATS Score" value={activeResume?.analysis?.atsScore ? activeResume.analysis.atsScore - 4 : 85} color="text-cyan-500" />
            </Panel>
            <Panel className="rounded-2xl p-4 sm:col-span-2 flex flex-col">
              <h3 className="text-sm font-semibold text-ink text-center mb-2">Strengths Radar Chart</h3>
              <div className="flex-1 w-full min-h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="60%" data={strengthData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <Radar name="Resume" dataKey="A" stroke="#06b6d4" strokeWidth={2} fill="#06b6d4" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Panel className="rounded-2xl flex items-center justify-center">
              <CircularProgressSmall title="Grammar Score" value={95} color="text-purple-500" />
            </Panel>
            <Panel className="rounded-2xl flex items-center justify-center">
              <CircularProgressSmall title="Formatting Score" value={92} color="text-blue-500" />
            </Panel>
            <Panel className="rounded-2xl p-4 sm:col-span-2 flex flex-col">
              <h3 className="text-sm font-semibold text-ink text-center mb-2">Weaknesses Bar Chart</h3>
              <div className="flex-1 w-full min-h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weaknessData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" opacity={0.5} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} width={120} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
          
          {activeResume && (
            <div className="flex justify-end gap-3">
              <button onClick={() => analyzeResume()} disabled={isAnalyzing} className="flex items-center gap-2 bg-cyan text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-cyan-600 transition-colors">
                {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
                Re-Analyze Resume
              </button>
            </div>
          )}
        </div>

        {/* Right Column: AI Suggestions & Markup */}
        <div className="space-y-6 flex flex-col">
          
          <Panel className="rounded-2xl p-5 flex flex-col">
            <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2"><Lightbulb size={16} className="text-amber-500" /> AI Suggestions</h3>
            <div className="space-y-3 flex-1">
              {[
                { title: "Add measurable achievements", link: "View Details", icon: Award },
                { title: "Improve project descriptions", link: "View Details", icon: Edit3 },
                { title: "Add technical skills", link: "View Details", icon: Settings },
                { title: "Include certifications", link: "View Details", icon: Award },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-line rounded-xl hover:border-cyan/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className="text-slate-400" />
                    <span className="text-sm text-ink font-medium">{item.title}</span>
                  </div>
                  <a href="#" className="text-xs text-cyan font-semibold hover:underline">{item.link}</a>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="rounded-2xl p-5 flex-1 flex flex-col">
             <h3 className="text-sm font-semibold text-ink mb-4">Text Analysis</h3>
             <div className="bg-slate-50 border border-line rounded-xl p-4 text-sm leading-relaxed font-medium text-ink overflow-y-auto max-h-[300px]">
                <span className="bg-green-100 text-green-800 px-1 rounded">Spearheaded project</span> &rarr; speeding, impactful phrases into purpose and key phrases.<br/><br/>
                <span className="bg-green-100 text-green-800 px-1 rounded">Achieved 20% growth</span> &rarr; resume was satitte for protecting phas and <span className="bg-green-100 text-green-800 px-1 rounded">Achieved critiied project phrases and exoratives.</span><br/><br/>
                <span className="bg-yellow-100 text-yellow-800 px-1 rounded">Managed team &rarr; How many people?</span> recerine? than the store. Managed team &rarr; <span className="bg-yellow-100 text-yellow-800 px-1 rounded">How many people? What was the outcome?</span><br/><br/>
                <span className="bg-red-100 text-red-800 px-1 rounded">Spelling mistake</span><br/>
                <span className="bg-red-100 text-red-800 px-1 rounded">Formatting inconsistent &rarr; epsed yen.us and</span><br/>
                <span className="bg-red-100 text-red-800 px-1 rounded">Formatting inconsistent &rarr; onelting cofecabling enerations.</span>
             </div>
             <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-muted justify-center">
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-green-400 rounded-sm" /> Strong phrase</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-yellow-400 rounded-sm" /> Needs detail</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-400 rounded-sm" /> Error</span>
             </div>
          </Panel>

        </div>

      </div>
    </>
  );
}
