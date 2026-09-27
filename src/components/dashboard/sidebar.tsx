"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  BarChart3,
  Map,
  FileText,
  Calculator,
  Lightbulb,
  Mic,
  LineChart,
  Bot,
  Globe,
  User,
  Settings,
  Sparkles,
  BriefcaseBusiness,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/career", label: "Career", icon: Target },
  { href: "/dashboard/skills", label: "Skill gap", icon: BarChart3 },
  { href: "/dashboard/roadmap", label: "Roadmap", icon: Map },
  { href: "/dashboard/resume", label: "Resume", icon: FileText },
  { href: "/dashboard/aptitude", label: "Aptitude", icon: Calculator },
  { href: "/dashboard/projects", label: "Projects", icon: Lightbulb },
  { href: "/dashboard/interview", label: "Interview", icon: Mic },
  { href: "/dashboard/analytics", label: "Analytics", icon: LineChart },
  { href: "/dashboard/mentor", label: "AI mentor", icon: Bot },
  { href: "/dashboard/profile-optimization", label: "Profile optimization", icon: Sparkles },
  { href: "/dashboard/jobs", label: "Job matching", icon: BriefcaseBusiness },
];

const bottomNav = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const item = (l: (typeof nav)[number]) => {
    const active = pathname === l.href;
    return (
      <Link
        key={l.href}
        href={l.href}
        className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-xl ${
          active
            ? "bg-cyan/10 text-white border border-cyan/25 shadow-[0_8px_22px_rgba(37,99,235,0.14)]"
            : "border border-transparent text-slate-300 hover:text-white hover:bg-slate-900"
        }`}
      >
        <l.icon size={16} />
        {l.label}
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-800 bg-slate-950 text-slate-100 py-6">
      <div className="px-4 mb-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan/15 flex items-center justify-center ring-1 ring-cyan/20">
            <div className="w-3 h-3 rounded-sm bg-cyan" />
          </div>
          <span className="font-black tracking-tight text-sm">
            CAREERFORGE <span className="text-cyan">AI</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 flex flex-col gap-1.5 px-3">{nav.map(item)}</nav>
      <div className="flex flex-col gap-1.5 border-t border-slate-800 pt-3 mt-3 px-3">
        {bottomNav.map(item)}
      </div>
    </aside>
  );
}
