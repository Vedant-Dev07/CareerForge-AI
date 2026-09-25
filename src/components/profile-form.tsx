"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { getSession } from "@/lib/auth";

type ProfileFormValues = {
  phone: string;
  location: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  cgpa: string;
  skills: string;
  targetRole: string;
  targetCareerId: string;
  interests: string;
  preferredDomain: string;
  preferredJobType: string;
  programmingLanguages: string;
  frameworks: string;
  databases: string;
  tools: string;
  certifications: string;
  projects: string;
  experience: string;
  github: string;
  linkedin: string;
  portfolio: string;
};

const emptyProfile: ProfileFormValues = {
  phone: "",
  location: "",
  college: "",
  degree: "",
  branch: "",
  year: "",
  cgpa: "",
  skills: "",
  targetRole: "",
  targetCareerId: "",
  interests: "",
  preferredDomain: "",
  preferredJobType: "",
  programmingLanguages: "",
  frameworks: "",
  databases: "",
  tools: "",
  certifications: "",
  projects: "",
  experience: "",
  github: "",
  linkedin: "",
  portfolio: "",
};

const fieldClass =
  "w-full border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/10";

export default function ProfileForm({ redirectAfterSave = false }: { redirectAfterSave?: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyProfile);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<{ id: string; title: string; domain: string }[]>([]);
  const [identity, setIdentity] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    getSession().then((session) => setIdentity(session ? { name: session.name, email: session.email } : null));
    fetch("/api/profile", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) throw new Error("Unable to load your profile.");
        const data = (await response.json()) as { profile: ProfileFormValues };
        setForm({ ...emptyProfile, ...data.profile });
      })
      .catch((loadError: Error) => setError(loadError.message))
      .finally(() => setLoading(false));
    fetch("/api/career/roles", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { roles?: typeof roles }) => setRoles(data.roles ?? []));
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Unable to save your profile.");
        return;
      }
      if (redirectAfterSave) router.push("/dashboard");
      else router.refresh();
    } catch {
      setError("Unable to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-muted">Loading your profile...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      <div className="text-xs tracking-widest text-cyan font-mono">PERSONAL INFORMATION</div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="FULL NAME" value={identity?.name ?? ""} onChange={() => undefined} placeholder="Your account name" disabled />
        <Field label="EMAIL" value={identity?.email ?? ""} onChange={() => undefined} placeholder="Your account email" disabled />
        <Field label="PHONE" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} placeholder="+91 9876543210" />
        <Field label="LOCATION" value={form.location} onChange={(value) => setForm({ ...form, location: value })} placeholder="City, Country" />
        <Field label="COLLEGE" value={form.college} onChange={(value) => setForm({ ...form, college: value })} placeholder="Enter your college" />
        <Field label="DEGREE" value={form.degree} onChange={(value) => setForm({ ...form, degree: value })} placeholder="Enter your degree" />
        <Field label="BRANCH / DEPARTMENT" value={form.branch} onChange={(value) => setForm({ ...form, branch: value })} placeholder="Computer Science" />
        <Field label="GRADUATION YEAR" value={form.year} onChange={(value) => setForm({ ...form, year: value })} placeholder="e.g. 2027" />
        <Field label="CGPA" value={form.cgpa} onChange={(value) => setForm({ ...form, cgpa: value })} placeholder="0 to 10" />
      </div>
      <div className="text-xs tracking-widest text-cyan font-mono">CAREER INFORMATION</div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs tracking-widest text-muted font-mono">TARGET JOB ROLE</label>
          <select value={form.targetCareerId} onChange={(event) => {
            const role = roles.find((item) => item.id === event.target.value);
            setForm({ ...form, targetCareerId: event.target.value, targetRole: role?.title ?? "" });
          }} className={fieldClass}>
            <option value="">Select a target role</option>
            {roles.map((role) => <option key={role.id} value={role.id}>{role.title} · {role.domain}</option>)}
          </select>
        </div>
        <Field label="PREFERRED DOMAIN" value={form.preferredDomain} onChange={(value) => setForm({ ...form, preferredDomain: value })} placeholder="Data, Software, Cloud..." />
        <Field label="PREFERRED JOB TYPE" value={form.preferredJobType} onChange={(value) => setForm({ ...form, preferredJobType: value })} placeholder="Full-time, Internship..." />
      </div>
      <Field label="SKILLS" value={form.skills} onChange={(value) => setForm({ ...form, skills: value })} placeholder="JavaScript, SQL, Python" />
      <div className="text-xs tracking-widest text-cyan font-mono">TECHNICAL SKILLS</div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="PROGRAMMING LANGUAGES" value={form.programmingLanguages} onChange={(value) => setForm({ ...form, programmingLanguages: value })} placeholder="Python, JavaScript" />
        <Field label="FRAMEWORKS" value={form.frameworks} onChange={(value) => setForm({ ...form, frameworks: value })} placeholder="React, Next.js" />
        <Field label="DATABASES" value={form.databases} onChange={(value) => setForm({ ...form, databases: value })} placeholder="PostgreSQL, MongoDB" />
        <Field label="TOOLS & TECHNOLOGIES" value={form.tools} onChange={(value) => setForm({ ...form, tools: value })} placeholder="Docker, Git, AWS" />
      </div>
      <div className="text-xs tracking-widest text-cyan font-mono">PROFESSIONAL INFORMATION</div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="CERTIFICATIONS" value={form.certifications} onChange={(value) => setForm({ ...form, certifications: value })} placeholder="Certification names" />
        <Field label="INTERNSHIP / EXPERIENCE" value={form.experience} onChange={(value) => setForm({ ...form, experience: value })} placeholder="Role, company, duration" />
        <Field label="GITHUB" value={form.github} onChange={(value) => setForm({ ...form, github: value })} placeholder="https://github.com/..." />
        <Field label="LINKEDIN" value={form.linkedin} onChange={(value) => setForm({ ...form, linkedin: value })} placeholder="https://linkedin.com/in/..." />
        <Field label="PORTFOLIO" value={form.portfolio} onChange={(value) => setForm({ ...form, portfolio: value })} placeholder="https://..." />
      </div>
      <Field label="PROJECTS" value={form.projects} onChange={(value) => setForm({ ...form, projects: value })} placeholder="Project names and short descriptions" />
      <div>
        <label className="mb-2 block text-xs tracking-widest text-muted font-mono">CAREER INTERESTS</label>
        <textarea value={form.interests} onChange={(event) => setForm({ ...form, interests: event.target.value })} rows={4} className={`${fieldClass} resize-none`} placeholder="Describe your career interests" />
      </div>
      <Button type="submit" className="justify-center" icon={false} disabled={saving}>
        {saving ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}

function Field({ label, value, onChange, placeholder, disabled = false }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; disabled?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-xs tracking-widest text-muted font-mono">{label}</label>
      <input value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-slate-50`} placeholder={placeholder} />
    </div>
  );
}
