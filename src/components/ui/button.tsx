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
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  icon = true,
  type = "button",
  disabled = false,
}: Props) {
  const base =
    "text-sm font-semibold px-6 py-3 inline-flex items-center gap-2 transition-all duration-200 rounded-xl";
  const styles =
    variant === "primary"
      ? "bg-cyan text-white shadow-[0_10px_25px_rgba(37,99,235,0.22)] hover:bg-blue-700"
      : "border border-line bg-white text-ink hover:border-cyan hover:text-cyan";
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
    <button type={type} className={cls} disabled={disabled}>
      {children}
      {icon && <ArrowRight size={15} />}
    </button>
  );
}
