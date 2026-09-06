"use client";

import { useEffect, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { clearSession, getSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DashboardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState("ST");

  useEffect(() => {
    let active = true;

    getSession().then((session) => {
      if (!active) return;

      if (!session) {
        router.replace("/login");
        return;
      }

      const initials = session.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      setUserName(initials || "ST");
    });

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await clearSession();
    router.push("/");
  };

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-line bg-white/80 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.06)] sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold text-muted shadow-sm hover:text-ink">
          <LogOut size={14} />
          Logout
        </button>
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white text-muted shadow-sm" aria-label="Notifications">
          <Bell size={17} />
        </button>
        <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/20 text-cyan flex items-center justify-center text-xs font-mono font-bold">
          {userName}
        </div>
      </div>
    </div>
  );
}
