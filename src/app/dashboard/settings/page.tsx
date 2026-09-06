import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";
import { Settings as SettingsIcon, SlidersHorizontal } from "lucide-react";

const groups = [
  { title: "Account", items: ["Change email", "Change password"] },
  { title: "Notifications", items: ["Roadmap reminders", "Weekly readiness summary"] },
  { title: "AI preferences", items: ["Mentor tone", "Recommendation frequency"] },
  { title: "Privacy", items: ["Portfolio visibility", "Data export"] },
];

export default function Settings() {
  return (
    <>
      <DashboardHeader title="Settings" subtitle="Account, notifications, AI preferences and privacy." />
      <div className="grid md:grid-cols-2 gap-5">
        {groups.map((g) => (
          <Panel key={g.title} className="rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-cyan/35">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-sm text-ink">{g.title}</h3>
              <SlidersHorizontal size={17} className="text-cyan" />
            </div>
            <ul className="space-y-3">
              {g.items.map((it) => (
                <li key={it} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{it}</span>
                  <button className="text-xs text-cyan hover:underline">Manage</button>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
      <button className="mt-6 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-muted shadow-sm hover:text-ink">
        <SettingsIcon size={16} />
        Log out
      </button>
    </>
  );
}
