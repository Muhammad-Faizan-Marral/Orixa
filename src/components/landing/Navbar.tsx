"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#samplework", label: "Sample work" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  // Scroll progress without framer-motion (keeps framer-motion out of the first
  // load). One passive listener, at most one transform write per frame, and no
  // React re-renders. Skipped entirely for reduced-motion visitors.
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="glass sticky top-0 z-50 border-b border-border">
      <div
        ref={bar}
        aria-hidden="true"
        style={{ transform: "scaleX(0)" }}
        className="bg-gradient-ion absolute inset-x-0 top-0 h-0.5 origin-left will-change-transform motion-reduce:hidden"
      />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="OrixaAI home">
          <Logo variant="wordmark" height={100} priority />
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-8 text-sm text-muted-foreground md:flex"
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/auth/login"
            className="btn !min-h-10 text-muted-foreground hover:text-foreground"
          >
            Log in
          </Link>
          <Link href="/auth/signup" className="btn btn-ion !min-h-10">
            Start free
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="btn btn-ghost !min-h-11 !px-3 md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="space-y-1 border-t border-border bg-background px-5 py-4 md:hidden"
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center text-muted-foreground"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3">
            <Link href="/auth/login" className="btn btn-ghost w-full">
              Log in
            </Link>
            <Link href="/auth/signup" className="btn btn-ion w-full">
              Start free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
