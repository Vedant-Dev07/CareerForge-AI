"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import Button from "@/components/ui/button";
import { getSession } from "@/lib/auth";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace(session.onboardingComplete ? "/dashboard" : "/onboarding");
      }
    });
  }, [router]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password || form.password !== form.confirmPassword) {
      setError("Please complete all fields and confirm your password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Unable to create account.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteNav />
      <section className="max-w-sm mx-auto px-6 pt-20 pb-24 bg-grid bg-grid">
        <SectionLabel>REGISTER</SectionLabel>
        <h1 className="text-3xl font-black tracking-tight uppercase mb-8">
          Create your profile.
        </h1>
        <Panel className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">FULL NAME</label>
              <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} type="text" className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan" placeholder="Full name" />
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">EMAIL</label>
              <input value={form.email} onChange={(e) => handleChange("email", e.target.value)} type="email" className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">PASSWORD</label>
              <input value={form.password} onChange={(e) => handleChange("password", e.target.value)} type="password" className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan" placeholder="Create password" />
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">CONFIRM PASSWORD</label>
              <input value={form.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} type="password" className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan" placeholder="Confirm password" />
            </div>
            <Button type="submit" className="w-full justify-center" icon={false} disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Panel>
        <p className="text-sm text-muted text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan hover:underline">Log in</Link>
        </p>
      </section>
    </>
  );
}
