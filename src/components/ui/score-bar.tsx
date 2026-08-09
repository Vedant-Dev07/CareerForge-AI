export default function ScoreBar({
  label,
  value,
  accent = "#FF7A33",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-muted">{label}</span>
        <span className="font-mono text-ink">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-line overflow-hidden">
        <div className="h-full" style={{ width: `${value}%`, background: accent }} />
      </div>
    </div>
  );
}
