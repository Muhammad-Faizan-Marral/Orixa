"use client";

import React, { useEffect, useState } from "react";
import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";
import { buildNavLinks } from "./navLinks";

export function NavbarMinimal({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  const name = config.name || profile.fullName || profile.username;
  const links = buildNavLinks(config);

  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [links]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        {/* Wordmark */}
        <a
          href="#hero"
          className="shrink-0 truncate text-sm font-semibold tracking-tight text-foreground"
          aria-label="Back to top"
        >
          {name}
        </a>

        {/* Nav links — hidden below md */}
        <nav
          className="hidden items-center gap-0.5 md:flex"
          aria-label="Site navigation"
        >
          {links.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={isActive ? "location" : undefined}
                className="relative rounded-md px-2.5 py-1.5 text-xs transition-colors hover:bg-surface-2 hover:text-foreground"
                style={{
                  color: isActive ? "var(--pr-accent)" : undefined,
                }}
              >
                {link.label}
                {/* Active underline indicator */}
                {isActive && (
                  <span
                    className="absolute inset-x-2 -bottom-[1px] h-px"
                    style={{ background: "var(--pr-accent)" }}
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="flex shrink-0 items-center gap-2">
          {config.resumeUrl && (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-85"
              style={{ background: "var(--pr-accent, #6c5cff)" }}
            >
              Resume
            </a>
          )}
        </div>
      </div>
    </header>
  );
}