function CornerMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="14" height="14">
      <path d="M1 8V1H8" stroke="#2563EB" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  );
}

export default function Panel({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div className={`relative overflow-hidden border border-line bg-white shadow-[0_12px_34px_rgba(15,23,42,0.07)] ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/35 to-transparent" />
      <div className="absolute -top-px -left-px">
        <CornerMark />
      </div>
      <div className="absolute -top-px -right-px rotate-90">
        <CornerMark />
      </div>
      <div className="absolute -bottom-px -left-px -rotate-90">
        <CornerMark />
      </div>
      <div className="absolute -bottom-px -right-px rotate-180">
        <CornerMark />
      </div>
      {title && (
        <h2 className="border-b border-line px-5 py-4 text-base font-semibold text-ink">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
