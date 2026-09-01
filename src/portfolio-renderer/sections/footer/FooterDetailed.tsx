// src/portfolio-renderer/sections/footer/FooterDetailed.tsx
import React from "react";

export type FooterDetailedProps = {
  name?: string;
  username: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
};

type QuickLink = {
  key: string;
  label: string;
  href: string;
};

const QUICK_LINKS: QuickLink[] = [
  { key: "projects", label: "Projects", href: "#projects" },
  { key: "experience", label: "Experience", href: "#experience" },
  { key: "contact", label: "Contact", href: "#contact" },
];

export const FooterDetailed: React.FC<FooterDetailedProps> = ({
  name,
  username,
  githubUrl,
  linkedinUrl,
}) => {
  const year = new Date().getFullYear();
  const displayName = name || username;

  const socialLinks: QuickLink[] = [];
  if (githubUrl) {
    socialLinks.push({ key: "github", label: "GitHub", href: githubUrl });
  }
  if (linkedinUrl) {
    socialLinks.push({ key: "linkedin", label: "LinkedIn", href: linkedinUrl });
  }

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-base font-semibold text-foreground sm:text-lg">
              {displayName}
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Thanks for stopping by. This portfolio highlights my work,
              experience, and how to get in touch.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
              Quick links
            </span>
            <nav className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {socialLinks.length > 0 ? (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                Elsewhere
              </span>
              <nav className="flex flex-col gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-border pt-6 sm:mt-12 sm:flex-row sm:justify-between sm:pt-8">
          <p className="text-xs text-muted-foreground/70 sm:text-sm">
            © {year} {displayName}. All rights reserved.
          </p>
          <a
            href="https://orixa.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/70 transition-colors duration-200 hover:text-foreground sm:text-sm"
          >
            Built with{" "}
            <span style={{ color: "var(--pr-accent)" }}>Orixa AI</span>
          </a>
        </div>
      </div>
    </footer>
  );
};