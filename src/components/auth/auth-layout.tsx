import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "../landing/Logo";

const POINTS = [
  "Multiple portfolios from one profile",
  "AI-assisted content, reviewed by you",
  "Versioned publishing — nothing breaks live",
];

/** Shared accent: landing blue in light mode, a softer tint in dark mode. */
export const AUTH_LINK =
  "font-medium text-[#1E6BFF] transition-colors hover:text-[#1557d6] dark:text-[#7FAAFF] dark:hover:text-[#A9C5FF]";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      className="grid min-h-screen bg-background text-foreground lg:grid-cols-[1.05fr_1fr]"
      style={{ ["--font-display" as string]: "var(--font-dm), sans-serif" }}
    >
      {/* ───────── Brand panel (desktop) ───────── */}
      <aside className="relative m-3 hidden overflow-hidden rounded-[28px] bg-[#0B1B3F] bg-[url('/lp/hero-bg.webp')] bg-cover bg-[position:72%_center] shadow-[0_16px_40px_rgba(11,27,63,0.18)] lg:flex">
        <div className="relative flex w-full flex-col justify-between gap-10 bg-gradient-to-b from-[#0B1B3F]/80 via-[#0B1B3F]/50 to-[#0B1B3F]/75 p-10 backdrop-blur-[3px]">
          {/* Logo sits on a light glass pill so it reads on the photo in both themes */}
          <Link
            href="/"
            aria-label="OrixaAI home"
            className="flex h-14 w-fit items-center rounded-full border border-white/60 bg-white/85 px-5 backdrop-blur-xl"
          >
            <Logo variant="darkwordmark" height={100} priority />
          </Link>

          <div className="max-w-md">
            <p className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white xl:text-5xl">
              Your work deserves a website, not a resume attachment.
            </p>

            <ul className="mt-8 space-y-3">
              {POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-[15px] text-white/85"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[#1E6BFF]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            {/* Floating glass cards, same language as the landing hero */}
            <div className="mt-10 flex flex-wrap gap-3" aria-hidden="true">
              <div className="-rotate-2 rounded-2xl border border-white/90 bg-white/90 px-4 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <p className="text-[13px] font-semibold text-[#0B1B3F]">
                  ayeshakhan.com
                </p>
                <p className="text-[13px] font-semibold text-emerald-500">
                  ● SSL Active
                </p>
              </div>
              <div className="rotate-1 rounded-2xl border border-white/90 bg-white/90 px-4 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <p className="text-[13px] font-semibold text-[#0B1B3F]">
                  Messages
                </p>
                <p className="text-[13px] text-[#7A86A1]">31 new inquiries</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/70">OrixaAi · Portfolios, Versioned</p>
        </div>
      </aside>

      {/* ───────── Form side ───────── */}
      <main className="flex min-w-0 flex-col px-6 py-5 sm:px-10">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="OrixaAI home"
            className="flex h-14 min-w-0 items-center lg:hidden"
          >
            <Logo variant="auto" height={100} priority />
          </Link>

          <Link
            href="/"
            className="ml-auto inline-flex min-h-10 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6BFF]"
          >
            <span aria-hidden="true" className="mr-1.5">
              ←
            </span>
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>
            )}

            <div className="mt-8">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** Friendly "check your inbox" card used after signup / forgot-password. */
export function AuthNotice({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-3 rounded-3xl border border-border bg-surface p-5 text-sm leading-6 text-muted-foreground shadow-[0_4px_20px_rgba(11,27,63,0.06)]">
      <span
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F0FF] text-[#1E6BFF] dark:bg-[#1E6BFF]/15 dark:text-[#7FAAFF]"
        aria-hidden="true"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </span>
      {children}
    </div>
  );
}
