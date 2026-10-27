"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);

  // Scroll progress + scrolled state
  useEffect(() => {
    const el = bar.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 12);

      if (window.scrollY < 100) setActive(null);

      if (el && !reduced) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        el.style.transform = `scaleX(${p})`;
      }
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

  // Active section highlighting (home only)
  useEffect(() => {
    if (pathname !== "/") {
      setActive(null);
      return;
    }

    const els = LINKS.filter((l) => l.href.startsWith("/#"))
      .map((l) => document.getElementById(l.href.slice(2)))
      .filter((el): el is HTMLElement => !!el);

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href.startsWith("/#")
      ? active === href.slice(2)
      : pathname.startsWith(href);

  return (
    <header className="pointer-events-none sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="pointer-events-auto fixed inset-0 -z-10 cursor-default bg-background/40 backdrop-blur-[2px] md:hidden"
        />
      )}

      <div
        data-scrolled={scrolled}
        className="pointer-events-auto relative mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-border/80 bg-background/70 pl-5 pr-2 shadow-sm backdrop-blur-xl transition-all duration-300 data-[scrolled=true]:border-border data-[scrolled=true]:bg-background/85 data-[scrolled=true]:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="OrixaAI home"
          className="flex shrink-0 items-center"
        >
          <Logo variant="auto" height={100} priority />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-0.5 text-[13.5px] font-medium md:flex"
        >
          {LINKS.map((l) => {
            const on = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={on ? "true" : undefined}
                className={`rounded-full px-3.5 py-2 transition-all duration-200 ${
                  on
                    ? "bg-foreground/[0.08] text-foreground"
                    : "text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-1.5 md:flex">
          <Link
            href="/auth/login"
            className="rounded-full px-4 py-2 text-[13.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="btn btn-ion !min-h-[38px] !rounded-full !px-5 !text-[13.5px]"
          >
            Start free
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-foreground/[0.06] md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>

        {/* Scroll Progress Line */}
        <div
          ref={bar}
          aria-hidden="true"
          style={{ transform: "scaleX(0)" }}
          className="absolute inset-x-6 -bottom-px h-[1.5px] origin-left rounded-full bg-primary will-change-transform motion-reduce:hidden"
        />

        {/* Mobile Menu */}
        {open && (
          <div
            id="mobile-menu"
            className="nav-pop absolute inset-x-0 top-full mt-2.5 overflow-hidden rounded-3xl border border-border bg-background/95 p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile" className="grid gap-0.5">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-12 items-center rounded-2xl px-4 text-[15px] font-medium transition-colors ${
                    isActive(l.href)
                      ? "bg-foreground/[0.07] text-foreground"
                      : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="mt-2 grid gap-2 border-t border-border/70 pt-3">
              <Link
                href="/auth/login"
                className="btn btn-ghost w-full !rounded-full !text-[15px]"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="btn btn-ion w-full !rounded-full !text-[15px]"
              >
                Start free
              </Link>
            </div>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes nav-pop {
            from { opacity: 0; transform: translateY(-8px) scale(0.98); }
            to { opacity: 1; transform: none; }
          }
          .nav-pop {
            animation: nav-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
          @media (prefers-reduced-motion: reduce) {
            .nav-pop { animation: none; }
          }
        `,
        }}
      />
    </header>
  );
}