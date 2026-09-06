"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import Button from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { Lock, Mail } from "lucide-react";

const fieldClass =
  "w-full border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/10";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace(session.onboardingComplete ? "/dashboard" : "/onboarding");
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Unable to log in.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteNav />
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionLabel>LOGIN</SectionLabel>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-ink">
              Welcome back.
            </h1>
            <p className="text-muted leading-relaxed">
              Continue your placement preparation from your dashboard, roadmap, and readiness analytics.
            </p>
          </div>
        <Panel className="rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-muted" size={16} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={`${fieldClass} pl-10`} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-muted" size={16} />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className={`${fieldClass} pl-10`} placeholder="Enter password" />
              </div>
            </div>
            <Button type="submit" className="w-full justify-center" icon={false} disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </Panel>
        </div>
        <p className="text-sm text-muted text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-cyan font-semibold hover:underline">Create one</Link>
        </p>
      </section>
    </>
  );
}
