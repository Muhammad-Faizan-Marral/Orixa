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
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
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
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href.startsWith("/#")
      ? active === href.slice(2)
      : pathname.startsWith(href);

  return (
    <>
      <header className="lp-header">
        <div className="lp-container ">
          <div className="lp-header-bar" data-scrolled={scrolled}>
            <Link href="/" aria-label="OrixaAI home" className="lp-brand">
              <Logo variant="darkwordmark" height={100} priority />
            </Link>

            <nav aria-label="Main" className="lp-nav">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? "true" : undefined}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="lp-header-actions">
              <Link href="/auth/login" className="lp-login">
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="lp-btn lp-btn-primary lp-btn-sm"
              >
                Start free
              </Link>
              <button
                type="button"
                className="lp-menu-btn"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {open ? (
                    <path d="M6 6l12 12M18 6L6 18" />
                  ) : (
                    <path d="M4 8h16M4 16h16" />
                  )}
                </svg>
              </button>
            </div>

            <div
              ref={bar}
              aria-hidden="true"
              style={{ transform: "scaleX(0)" }}
              className="lp-progress-bar motion-reduce:hidden"
            />
          </div>
        </div>
      </header>

      {/* Fullscreen mobile menu */}
      <div
        id="mobile-menu"
        className={`lp-menu ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      >
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} tabIndex={open ? 0 : -1}>
            {l.label}
          </Link>
        ))}
        <Link href="/auth/login" tabIndex={open ? 0 : -1}>
          Log in
        </Link>
        <Link
          href="/auth/signup"
          className="lp-btn lp-btn-primary"
          tabIndex={open ? 0 : -1}
          style={{ marginTop: 16 }}
        >
          Create my portfolio — free
        </Link>
      </div>
    </>
  );
}
