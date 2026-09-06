import Link from "next/link";
import { GraduationCap } from "lucide-react";

const cols = [
  {
    title: "Platform",
    links: [
      { href: "/dashboard/career", label: "Career Recommendation" },
      { href: "/dashboard/skills", label: "Skill Gap Analysis" },
      { href: "/dashboard/resume", label: "Resume Analyzer" },
      { href: "/dashboard/aptitude", label: "Aptitude Practice" },
      { href: "/dashboard/interview", label: "Interview Preparation" },
      { href: "/dashboard/roadmap", label: "Roadmap" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/dashboard/roadmap", label: "Learning Roadmap" },
      { href: "/dashboard/projects", label: "Projects" },
      { href: "/dashboard/career", label: "Career Guidance" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Login" },
      { href: "/register", label: "Register" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white/85 py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
                <GraduationCap size={17} />
              </div>
              <span className="font-black tracking-tight text-sm">
                CAREERFORGE <span className="text-forge">AI</span>
              </span>
            </div>
            <p className="text-sm text-muted mt-3 max-w-[240px]">
              The Placement Tutor for personalized career guidance, preparation planning, and placement-readiness tracking.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs tracking-widest text-muted font-mono mb-3">
                {c.title.toUpperCase()}
              </div>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted hover:text-ink transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted font-mono">
          <span>Copyright 2026 CareerForge AI</span>
          <span>Built for ambitious students</span>
        </div>
      </div>
    </footer>
  );
}
