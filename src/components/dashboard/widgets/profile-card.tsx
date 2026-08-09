"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import Panel from "@/components/ui/panel";

export default function ProfileCard() {
  const [session, setSession] = useState<{ name: string; email: string; onboardingComplete: boolean } | null>(null);

  useEffect(() => {
    getSession().then(setSession);
  }, []);

  if (!session) return null;

  return (
    <Panel className="p-6 rounded-2xl">
      <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-cyan font-mono mb-4">
        <span>STUDENT PROFILE</span>
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <div className="text-muted mb-1">Name</div>
          <div className="font-semibold">{session.name}</div>
        </div>
        <div>
          <div className="text-muted mb-1">Email</div>
          <div className="font-semibold">{session.email}</div>
        </div>
        <div>
          <div className="text-muted mb-1">Status</div>
          <div className="font-semibold text-cyan">{session.onboardingComplete ? "Profile complete" : "Onboarding pending"}</div>
        </div>
      </div>
    </Panel>
  );
}
