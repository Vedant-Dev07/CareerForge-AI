"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import Button from "@/components/ui/button";
import { getSession } from "@/lib/auth";

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
      <section className="max-w-sm mx-auto px-6 pt-20 pb-24 bg-grid bg-grid">
        <SectionLabel>LOGIN</SectionLabel>
        <h1 className="text-3xl font-black tracking-tight uppercase mb-8">
          Welcome back.
        </h1>
        <Panel className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">EMAIL</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">PASSWORD</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan" placeholder="Enter password" />
            </div>
            <Button type="submit" className="w-full justify-center" icon={false} disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </Panel>
        <p className="text-sm text-muted text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-cyan hover:underline">Create one</Link>
        </p>
      </section>
    </>
  );
}
