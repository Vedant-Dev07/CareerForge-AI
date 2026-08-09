"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import ScoreBar from "@/components/ui/score-bar";
import { getSession } from "@/lib/auth";
import ProfileCard from "@/components/dashboard/widgets/profile-card";
import ReadinessPanel from "@/components/dashboard/widgets/readiness-panel";
import JourneyMap from "@/components/dashboard/journey-map";

const actions = [
  "Review your current progress",
  "Complete an aptitude module",
  "Update your resume keywords for your target role",
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

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5 mb-8">
        <ProfileCard />
        <ReadinessPanel />
      </div>

      <Panel className="p-6 mb-5 rounded-2xl">
        <div className="text-xs tracking-widest text-muted font-mono mb-5">
          COMPONENT SCORES
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ScoreBar label="Career match" value={0} accent="#4FD1C5" />
          <ScoreBar label="Resume score" value={0} />
          <ScoreBar label="Skills" value={0} accent="#4FD1C5" />
          <ScoreBar label="Interview" value={0} />
          <ScoreBar label="Aptitude" value={0} accent="#4FD1C5" />
          <ScoreBar label="Learning progress" value={0} />
        </div>
      </Panel>

      <Panel className="p-6 mb-5 rounded-2xl">
        <div className="text-xs tracking-widest text-muted font-mono mb-4">
          RECOMMENDED ACTIONS
        </div>
        <ul className="space-y-3">
          {actions.map((a) => (
            <li key={a} className="flex items-center gap-3 text-sm">
              <span className="w-1.5 h-1.5 bg-forge rotate-45 shrink-0" />
              {a}
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <Link href="/dashboard/career">
          <Panel className="p-5 hover:border-cyan/60 transition-colors rounded-2xl">
            <div className="text-xs text-muted font-mono mb-1">CAREER MATCH</div>
            <div className="font-bold">Strong fit detected</div>
          </Panel>
        </Link>
        <Link href="/dashboard/skills">
          <Panel className="p-5 hover:border-cyan/60 transition-colors rounded-2xl">
            <div className="text-xs text-muted font-mono mb-1">TOP GAP</div>
            <div className="font-bold">System design and SQL</div>
          </Panel>
        </Link>
        <Link href="/dashboard/interview">
          <Panel className="p-5 hover:border-cyan/60 transition-colors rounded-2xl">
            <div className="text-xs text-muted font-mono mb-1">INTERVIEW PREP</div>
            <div className="font-bold">Start your first mock round</div>
          </Panel>
        </Link>
      </div>

      <Panel className="p-6 rounded-2xl">
        <div className="text-xs tracking-widest text-muted font-mono mb-4">PRODUCT JOURNEY</div>
        <JourneyMap />
      </Panel>
    </>
  );
}
