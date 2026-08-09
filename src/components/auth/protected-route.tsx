"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    getSession().then((session) => {
      if (!active) return;

      if (!session) {
        router.replace("/login");
        return;
      }

      setAuthorized(true);
    });

    return () => {
      active = false;
    };
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-6">
        <div className="border border-line bg-white px-6 py-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="text-xs tracking-[0.2em] text-muted font-mono mb-2">
            CAREERFORGE AI
          </div>
          <div className="font-semibold">Checking your session...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
