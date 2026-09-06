import type { LucideIcon } from "lucide-react";
import Panel from "@/components/ui/panel";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accent?: "cyan" | "forge" | "success" | "warning";
};

const accentStyles = {
  cyan: "bg-cyan/10 text-cyan border-cyan/20",
  forge: "bg-forge/10 text-forge border-forge/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
};

export default function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  accent = "cyan",
}: StatCardProps) {
  return (
    <Panel className="rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-cyan/35">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="text-xs font-mono tracking-[0.16em] text-muted">{label.toUpperCase()}</div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accentStyles[accent]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-3xl font-black font-mono text-ink">{value}</div>
      <div className="mt-2 text-sm leading-relaxed text-muted">{detail}</div>
    </Panel>
  );
}
