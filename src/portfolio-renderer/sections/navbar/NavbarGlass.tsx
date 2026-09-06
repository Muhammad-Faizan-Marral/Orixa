"use client";

import React, { useEffect, useRef, useState } from "react";
import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";
import { buildNavLinks } from "./navLinks";

export function NavbarGlass({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  const name = config.name || profile.fullName || profile.username;
  const links = buildNavLinks(config);

  const [activeId, setActiveId] = useState<string>("");
  const [scrollRatio, setScrollRatio] = useState(0); // 0–1 over first 80px
  const headerRef = useRef<HTMLElement>(null);

  // Scroll-spy
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
      { rootMargin: "-35% 0px -60% 0px", threshold: 0 }
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [links]);

  // Scroll depth for border/bg intensity
  useEffect(() => {
    const onScroll = () => {
      const ratio = Math.min(window.scrollY / 80, 1);
      setScrollRatio(ratio);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const borderAlpha = Math.round(20 + scrollRatio * 55); // hex 14–4b
  const bgAlpha = Math.round(55 + scrollRatio * 35); // % opacity

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50"
      style={{
        // Gradient border via box-shadow + border trick
        borderBottom: `1px solid rgba(128,128,128,${borderAlpha / 255})`,
        background: `color-mix(in srgb, var(--background, #fff) ${bgAlpha}%, transparent)`,
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        transition: "background 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* Subtle top gradient line — accent colour, very faint */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, var(--pr-accent) 50%, transparent 100%)`,
          opacity: 0.35 + scrollRatio * 0.25,
        }}
        aria-hidden="true"
      />

      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 sm:px-10">
        {/* Left: wordmark */}
        <a
          href="#hero"
          className="justify-self-start text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-70"
          aria-label="Back to top"
        >
          {name}
        </a>

        {/* Centre: nav links */}
        <nav
          className="hidden items-center gap-1 sm:flex"
          aria-label="Site navigation"
        >
          {links.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={isActive ? "location" : undefined}
                className="relative px-3 py-2 text-[0.8125rem] transition-colors"
                style={{
                  color: isActive
                    ? "var(--foreground)"
                    : "var(--muted-foreground, #888)",
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {link.label}
                {/* Underline rule — slides in from left */}
                <span
                  className="absolute inset-x-3 bottom-1 h-px origin-left transition-transform duration-300"
                  style={{
                    background: "var(--pr-accent)",
                    transform: isActive ? "scaleX(1)" : "scaleX(0)",
                  }}
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </nav>

        {/* Right: CTA */}
        <div className="flex justify-self-end items-center gap-3">
          {config.resumeUrl ? (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-85"
              style={{ background: "var(--pr-accent, #6c5cff)" }}
            >
              Resume
            </a>
          ) : (
            <a
              href="#contact"
              className="rounded-full border border-border px-4 py-1.5 text-xs transition-colors hover:bg-surface-2"
            >
              Contact
            </a>
          )}
        </div>
      </div>
    </header>
  );
}