import Link from "next/link";

const cols = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/research", label: "Research" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Login" },
      { href: "/register", label: "Get started" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-14 bg-white/70">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-4 gap-10 mb-10">
          <div>
            <span className="font-black tracking-tight text-sm">
              CAREERFORGE <span className="text-forge">AI</span>
            </span>
            <p className="text-sm text-muted mt-3 max-w-[220px]">
              The intelligent placement tutor, built for students.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs tracking-widest text-muted font-mono mb-3">
                {c.title.toUpperCase()}
              </div>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted hover:text-ink transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted font-mono">
          <span>© 2026 CareerForge AI</span>
          <span>Built for ambitious students</span>
        </div>
      </div>
    </footer>
  );
}
