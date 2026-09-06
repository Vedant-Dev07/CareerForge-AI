"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import Panel from "@/components/ui/panel";
import SectionLabel from "@/components/ui/section-label";
import Button from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { Lock, Mail, User } from "lucide-react";

const fieldClass =
  "w-full border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/10";

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
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionLabel>REGISTER</SectionLabel>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-ink">
              Create your profile.
            </h1>
            <p className="text-muted leading-relaxed">
              Start with your account, then complete onboarding so CareerForge AI can personalize your preparation path.
            </p>
          </div>
        <Panel className="rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">FULL NAME</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-muted" size={16} />
                <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} type="text" className={`${fieldClass} pl-10`} placeholder="Full name" />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-muted" size={16} />
                <input value={form.email} onChange={(e) => handleChange("email", e.target.value)} type="email" className={`${fieldClass} pl-10`} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-muted" size={16} />
                <input value={form.password} onChange={(e) => handleChange("password", e.target.value)} type="password" className={`${fieldClass} pl-10`} placeholder="Create password" />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-widest text-muted font-mono block mb-2">CONFIRM PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-muted" size={16} />
                <input value={form.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} type="password" className={`${fieldClass} pl-10`} placeholder="Confirm password" />
              </div>
            </div>
            <Button type="submit" className="w-full justify-center" icon={false} disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Panel>
        </div>
        <p className="text-sm text-muted text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan font-semibold hover:underline">Log in</Link>
        </p>
      </section>
    </>
  );
}
