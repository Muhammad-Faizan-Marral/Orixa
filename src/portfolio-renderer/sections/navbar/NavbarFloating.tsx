import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

const LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export function NavbarFloating({config,profile,}: {config: PortfolioRenderConfig;profile: PublicProfileMeta;}) {
  
  const name = config.name || profile.fullName || profile.username;

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        className="flex w-full max-w-3xl items-center justify-between gap-3 rounded-2xl border border-border/70 bg-surface/90 px-4 py-2.5 shadow-lg shadow-black/20 backdrop-blur-xl"
        style={{ borderRadius: "var(--pr-radius, 14px)" }}
      >
        <a href="#hero" className="text-sm font-semibold">
          {name}
        </a>

        <nav className="hidden items-center gap-1 sm:flex">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="rounded-lg px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {config.resumeUrl ? (
          <a
            href={config.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-white"
            style={{ background: "var(--pr-accent, #6c5cff)" }}
          >
            Resume
          </a>
        ) : (
          <a
            href="#contact"
            className="rounded-lg border border-border px-3 py-1.5 text-xs"
          >
            Contact
          </a>
        )}
      </div>
    </header>
  );
}
