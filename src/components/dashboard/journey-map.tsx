import Link from "next/link";

const stages = [
  {
    title: "Landing page",
    body: "Discover the platform, its promise, and the value of personalized placement prep.",
    href: "/",
  },
  {
    title: "Login / register",
    body: "Create your account and step into a guided student experience.",
    href: "/register",
  },
  {
    title: "Student onboarding",
    body: "Share your college, skills, interests, and role goals to personalize the journey.",
    href: "/onboarding",
  },
  {
    title: "AI dashboard",
    body: "Open your command center for career guidance, readiness, and progress.",
    href: "/dashboard",
  },
  {
    title: "Career + skill gap",
    body: "Review role recommendations and identify the gaps that matter most.",
    href: "/dashboard/career",
  },
  {
    title: "Learning roadmap",
    body: "Follow a structured plan that turns your gaps into measurable actions.",
    href: "/dashboard/roadmap",
  },
  {
    title: "Placement prep",
    body: "Improve your resume, aptitude, and projects for the role you want.",
    href: "/dashboard/resume",
  },
  {
    title: "AI interview",
    body: "Practice tailored technical and HR questions with instant preparation support.",
    href: "/dashboard/interview",
  },
  {
    title: "Readiness + mentor",
    body: "Track progress, get guidance, and keep improving with AI support.",
    href: "/dashboard/mentor",
  },
  {
    title: "Analytics / progress",
    body: "See your momentum, readiness score, and next-best actions over time.",
    href: "/dashboard/analytics",
  },
];

export default function JourneyMap() {
  return (
    <div className="rounded-[28px] border border-line bg-slate-950 p-5 md:p-7">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stages.map((stage, index) => (
          <div key={stage.title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 text-[11px] font-black text-cyan">
                {index + 1}
              </div>
              {index < stages.length - 1 ? <div className="mt-2 h-full w-px bg-slate-700" /> : null}
            </div>
            <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{stage.title}</h3>
                <Link href={stage.href} className="text-[11px] uppercase tracking-[0.2em] text-cyan hover:underline">
                  Open
                </Link>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{stage.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
