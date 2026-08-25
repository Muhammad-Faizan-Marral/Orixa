import Link from "next/link";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#product" },
      { label: "AI", href: "#ai" },
      { label: "Showcase", href: "#showcase" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/auth/login" },
      { label: "Sign up", href: "/auth/signup" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "#faq" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-ion text-[0.8rem] font-bold text-white">
                O
              </span>
              <span className="font-display text-[1.05rem] font-semibold tracking-tight text-foreground">
                Orixa<span className="text-gradient-ion">AI</span>
              </span>
            </Link>
            <p className="text-small mt-4">
              An AI-powered portfolio builder for developers, designers and
              students who want a professional site without the setup.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-caption">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-small transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-subtle-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Orixa AI. All rights reserved.</p>
          <p className="font-mono">Built for people who ship.</p>
        </div>
      </div>
    </footer>
  );
}
