"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu } from "lucide-react";
import Button from "@/components/ui/button";

const links = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-white/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl border border-cyan/25 bg-cyan/10 text-cyan flex items-center justify-center shadow-sm">
            <GraduationCap size={17} />
          </div>
          <span className="font-black tracking-tight text-sm text-ink">
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
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white text-ink shadow-sm"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <Menu size={17} />
          </button>
        </div>
      </div>
      {open ? (
        <nav className="md:hidden border-t border-line bg-white px-6 py-4 shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-muted">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2 hover:bg-slate-50 hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="rounded-xl px-3 py-2 hover:bg-slate-50 hover:text-ink"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
