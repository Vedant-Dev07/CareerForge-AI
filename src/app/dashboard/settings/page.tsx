import DashboardHeader from "@/components/dashboard/header";
import Panel from "@/components/ui/panel";

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
          <Panel key={g.title} className="p-6">
            <h3 className="font-bold text-sm mb-4">{g.title}</h3>
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
      <button className="mt-6 text-sm text-forge hover:underline">Log out</button>
    </>
  );
}
