"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";
import { buildNavLinks } from "./navLinks";

// ── Icons ────────────────────────────────────────────────────────────────────

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M3 5.5h14M3 10h14M3 14.5h14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M5 5l10 10M15 5L5 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────────

export function NavbarSidebarTrigger({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  const name = config.name || profile.fullName || profile.username;
  const links = buildNavLinks(config);

  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
      { rootMargin: "-35% 0px -60% 0px", threshold: 0 },
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [links]);

  // Body scroll lock when sidebar open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Move focus to close button
      requestAnimationFrame(() => closeRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on hash change (user tapped a link)
  useEffect(() => {
    const onHashChange = () => setOpen(false);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLinkClick = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      {/* ── Top bar ── */}
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border/50 px-5 sm:px-8 backdrop-blur-md"
        style={{
          background:
            "color-mix(in srgb, var(--background, #fff) 80%, transparent)",
        }}
      >
        {/* Wordmark */}
        <a
          href="#hero"
          className="text-sm font-semibold text-foreground transition-opacity hover:opacity-70"
          aria-label="Back to top"
        >
          {name}
        </a>

        <div className="flex items-center gap-3">
          {/* Resume — top bar, compact */}
          {config.resumeUrl && (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg px-3 py-1.5 text-xs font-medium text-white sm:inline-flex transition-opacity hover:opacity-85"
              style={{ background: "var(--pr-accent, #6c5cff)" }}
            >
              Resume
            </a>
          )}

          {/* Hamburger trigger */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="sidebar-nav"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: "var(--pr-accent)" }}
          >
            <MenuIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.45)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          backdropFilter: open ? "blur(2px)" : "none",
        }}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      {/* ── Sidebar drawer ── */}
      <aside
        id="sidebar-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-xs flex-col"
        style={{
          background: "var(--surface, var(--background, #fff))",
          borderLeft: "1px solid var(--border, rgba(128,128,128,0.2))",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
          boxShadow: open ? "-20px 0 60px rgba(0,0,0,0.15)" : "none",
        }}
      >
        {/* Sidebar header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 px-6">
          <span className="text-sm font-semibold text-foreground">{name}</span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: "var(--pr-accent)" }}
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links — large tap targets */}
        <nav
          className="flex flex-1 flex-col overflow-y-auto py-4"
          aria-label="Sidebar navigation"
        >
          {links.map((link, i) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={handleLinkClick}
                aria-current={isActive ? "location" : undefined}
                className="group relative flex items-center gap-3 px-6 py-4 text-base transition-colors"
                style={{
                  color: isActive
                    ? "var(--foreground)"
                    : "var(--muted-foreground, #888)",
                  fontWeight: isActive ? 600 : 400,
                  animationDelay: `${i * 35}ms`,
                }}
              >
                {/* Active bar */}
                <span
                  className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full transition-all duration-200"
                  style={{
                    background: "var(--pr-accent)",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scaleY(1)" : "scaleY(0.3)",
                  }}
                  aria-hidden="true"
                />
                {/* Hover background */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{
                    background:
                      "color-mix(in srgb, var(--pr-accent) 6%, transparent)",
                  }}
                  aria-hidden="true"
                />
                <span className="relative">{link.label}</span>
                {/* Arrow — fades in on hover */}
                <span
                  className="relative ml-auto text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-sm"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-border/50 p-6 flex flex-col gap-3">
          {config.resumeUrl && (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
              style={{ background: "var(--pr-accent, #6c5cff)" }}
            >
              Download Resume
            </a>
          )}
          {!config.resumeUrl && (
            <a
              href="#contact"
              onClick={handleLinkClick}
              className="flex w-full items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm transition-colors hover:bg-surface-2"
            >
              Get in touch
            </a>
          )}
        </div>
      </aside>
    </>
  );
}
