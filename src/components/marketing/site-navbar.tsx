"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/UI/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#product", label: "Product" },
  { href: "#ai", label: "AI" },
  { href: "#showcase", label: "Showcase" },
  { href: "#faq", label: "FAQ" },
];

export function SiteNavbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);
  });

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 md:mt-4 md:px-5",
          scrolled
            ? "border-border bg-surface/80 shadow-elevated backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-ion text-[0.8rem] font-bold text-white">
            O
          </span>
          <span className="font-display text-[1.05rem] font-semibold tracking-tight text-foreground">
            Orixa<span className="text-gradient-ion">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="gradient" size="sm">
              Start building
            </Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <div className="flex flex-col gap-[5px]">
            <span
              className={cn(
                "h-[1.5px] w-4.5 bg-current transition-transform",
                mobileOpen && "translate-y-[3.5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-[1.5px] w-4.5 bg-current transition-transform",
                mobileOpen && "-translate-y-[3.5px] -rotate-45"
              )}
            />
          </div>
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-3 mt-2 rounded-2xl border border-border bg-surface/95 p-3 shadow-elevated backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
            <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
              <Button variant="secondary" className="w-full">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
              <Button variant="gradient" className="w-full">
                Start building
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
