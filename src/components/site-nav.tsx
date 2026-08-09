import Link from "next/link";
import Button from "@/components/ui/button";

const links = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
];

export default function SiteNav() {
  return (
    <header className="border-b border-line sticky top-0 z-10 backdrop-blur bg-white/90">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 border border-forge flex items-center justify-center rotate-45">
            <div className="w-2 h-2 -rotate-45 bg-forge" />
          </div>
          <span className="font-black tracking-tight text-sm">
            CAREERFORGE <span className="text-forge">AI</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm text-muted hover:text-ink transition-colors">
            Login
          </Link>
          <Button href="/register" className="!px-4 !py-2 text-sm">
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}
