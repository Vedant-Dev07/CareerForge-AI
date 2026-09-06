"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import Panel from "@/components/ui/panel";
import { CheckCircle2, Mail, UserRound } from "lucide-react";

export default function ProfileCard() {
  const [session, setSession] = useState<{ name: string; email: string; onboardingComplete: boolean } | null>(null);

  useEffect(() => {
    getSession().then(setSession);
  }, []);

  if (!session) return null;

  return (
    <Panel className="rounded-2xl p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.2em] text-cyan font-mono">STUDENT PROFILE</div>
          <h2 className="mt-2 text-xl font-black text-ink">{session.name}</h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan">
          <UserRound size={22} />
        </div>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-slate-50/80 px-4 py-3">
          <Mail size={16} className="text-muted" />
          <div className="min-w-0">
            <div className="text-xs text-muted">Email</div>
            <div className="truncate font-semibold text-ink">{session.email}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-slate-50/80 px-4 py-3">
          <CheckCircle2 size={16} className={session.onboardingComplete ? "text-success" : "text-warning"} />
          <div>
            <div className="text-xs text-muted">Status</div>
            <div className="font-semibold text-ink">
              {session.onboardingComplete ? "Profile complete" : "Onboarding pending"}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
