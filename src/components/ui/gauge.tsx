export default function Gauge({ value }: { value: number }) {
  const cx = 160;
  const cy = 200;
  const r = 120;
  const pct = value / 100;
  const endAngle = 180 - pct * 180;
  const rad = (endAngle * Math.PI) / 180;
  const ex = cx + r * Math.cos(rad);
  const ey = cy - r * Math.sin(rad);

  return (
    <svg viewBox="0 0 320 260" className="w-full max-w-sm mx-auto">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${ex} ${ey}`} fill="none" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#4F46E5" strokeWidth="2" opacity="0.75" />
      <circle cx={cx} cy={cy} r="5" fill="#4F46E5" />
      <text x={cx} y={cy - 34} textAnchor="middle" fill="#0F172A" fontSize="42" fontWeight="800" fontFamily="ui-monospace, monospace">{value}</text>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#64748B" fontSize="11" letterSpacing="2" fontFamily="ui-monospace, monospace">PLACEMENT READY</text>
      <text x={cx - r} y={cy + 24} textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="ui-monospace, monospace">0</text>
      <text x={cx + r} y={cy + 24} textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="ui-monospace, monospace">100</text>
    </svg>
  );
}
