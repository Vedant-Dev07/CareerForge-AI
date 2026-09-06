export default function ScoreBar({
  label,
  value,
  accent = "#2563EB",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-semibold text-muted">{label}</span>
        <span className="font-mono font-bold text-ink">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: accent }} />
      </div>
    </div>
  );
}
