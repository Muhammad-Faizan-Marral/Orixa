"use client";

import React, { useEffect, useState } from "react";
import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";
import { buildNavLinks } from "./navLinks";

export function NavbarFloating({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  const name = config.name || profile.fullName || profile.username;
  const links = buildNavLinks(config);

  const [activeId, setActiveId] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  // Scroll-spy: track which section is in view
  useEffect(() => {
    const ids = links.map((l) => l.id);

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

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [links]);

  // Detect scroll to slightly increase pill opacity
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        className="flex w-full max-w-3xl items-center justify-between gap-3 border border-border/70 px-4 py-2.5 backdrop-blur-xl transition-shadow duration-300"
        style={{
          borderRadius: "var(--pr-radius, 14px)",
          background: "color-mix(in srgb, var(--surface, hsl(var(--background))) 90%, transparent)",
          boxShadow: scrolled
            ? "0 8px 32px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.06) inset"
            : "0 2px 12px rgba(0,0,0,0.10)",
        }}
      >
        {/* Wordmark */}
        <a
          href="#hero"
          className="shrink-0 text-sm font-semibold text-foreground"
          aria-label="Back to top"
        >
          {name}
        </a>

        {/* Nav links — hidden on mobile */}
        <nav
          className="hidden items-center gap-0.5 sm:flex"
          aria-label="Site navigation"
        >
          {links.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={isActive ? "location" : undefined}
                className="relative rounded-lg px-2.5 py-1 text-xs transition-colors"
                style={{
                  color: isActive
                    ? "var(--pr-accent)"
                    : "var(--muted-foreground, #888)",
                  background: isActive
                    ? "color-mix(in srgb, var(--pr-accent) 10%, transparent)"
                    : "transparent",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* CTA */}
        {config.resumeUrl ? (
          <a
            href={config.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-85"
            style={{ background: "var(--pr-accent, #6c5cff)" }}
          >
            Resume
          </a>
        ) : (
          <a
            href="#contact"
            className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs transition-colors hover:bg-surface-2"
          >
            Contact
          </a>
        )}
      </div>
    </header>
  );
}