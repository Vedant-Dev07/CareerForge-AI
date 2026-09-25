import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  icon?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  icon = true,
  type = "button",
  disabled = false,
  onClick,
}: Props) {
  const base =
    "text-sm font-semibold px-6 py-3 inline-flex items-center justify-center gap-2 transition-all duration-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan/15 disabled:pointer-events-none disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-cyan text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_16px_34px_rgba(37,99,235,0.28)]"
      : "border border-line bg-white text-ink shadow-sm hover:-translate-y-0.5 hover:border-cyan hover:text-cyan hover:shadow-[0_12px_26px_rgba(15,23,42,0.08)]";
  const cls = `${base} ${styles} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
        {icon && <ArrowRight size={15} />}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
      {icon && <ArrowRight size={15} />}
    </button>
  );
}
