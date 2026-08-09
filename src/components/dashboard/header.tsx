"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
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
    const session = getSession();
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
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  return (
    <div className="flex items-start justify-between mb-8 border-b border-line pb-5">
      <div>
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleLogout} className="text-xs text-muted hover:text-ink">Logout</button>
        <Bell size={18} className="text-muted" />
        <div className="w-8 h-8 rounded-full bg-cyan/10 border border-cyan/20 text-cyan flex items-center justify-center text-xs font-mono">
          {userName}
        </div>
      </div>
    </div>
  );
}
