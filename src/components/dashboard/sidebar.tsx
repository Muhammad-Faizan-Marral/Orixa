"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { useLocale } from "@/components/locale-provider";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { useDashboardStore } from "@/stores/dashboard.store";
import { cn } from "@/lib/utils";
import Logo from "../landing/Logo";
import NewLogo from "../NewLogo";

type Profile = {
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
};

const DISPLAY = "font-[family-name:var(--font-display,var(--font-dm))]";
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function NavIcon({ name }: { name: string }) {
  const svg = (children: ReactNode) => (
    <svg
      className="size-[18px] shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );

  switch (name) {
    case "home":
      return svg(
        <>
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
        </>,
      );
    case "layers":
      return svg(
        <>
          <path d="M12 3l9 5-9 5-9-5 9-5Z" />
          <path d="M3 13l9 5 9-5" />
        </>,
      );
    case "user":
      return svg(
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20c1.6-3.5 4.5-5.3 7.5-5.3s5.9 1.8 7.5 5.3" />
        </>,
      );
    case "gift":
      return svg(
        <>
          <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
          <path d="M4 8h16v4H4z" />
          <path d="M12 22V8" />
          <path d="M12 8H8.5a2.5 2.5 0 1 1 0-5C11 3 12 8 12 8z" />
          <path d="M12 8h3.5a2.5 2.5 0 1 0 0-5C13 3 12 8 12 8z" />
        </>,
      );
    case "settings":
      return svg(
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </>,
      );
    default:
      return null;
  }
}

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const sidebarOpen = useDashboardStore((state) => state.sidebarOpen);
  const closeSidebar = useDashboardStore((state) => state.closeSidebar);
  const { t } = useLocale();

  const displayName = profile.fullName || profile.username;
  const initials = (profile.fullName ?? profile.username)
    .slice(0, 1)
    .toUpperCase();

  const NAV_ITEMS = [
    { href: "/dashboard", label: t.nav.overview, icon: "home", exact: true },
    { href: "/dashboard/portfolios", label: t.nav.portfolios, icon: "layers" },
    {
      href: "/dashboard/refer-and-earn",
      label: t.nav.referAndEarn,
      icon: "gift",
    },
    { href: "/dashboard/profile", label: t.nav.profile, icon: "user" },
    { href: "/dashboard/settings", label: t.nav.settings, icon: "settings" },
  ];

  useEffect(() => {
    if (!sidebarOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSidebar();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, closeSidebar]);

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 cursor-default bg-black/50 backdrop-blur-[2px] lg:hidden"
          aria-label="Close navigation menu"
        />
      )}

      <aside
        id="dashboard-sidebar"
        aria-label="Main navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[min(260px,calc(100vw-48px))] flex-col",
          "border-r border-border/80 bg-background",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "lg:translate-x-0",
          sidebarOpen
            ? "translate-x-0 shadow-2xl shadow-black/10"
            : "-translate-x-full",
        )}
      >
        {/* Brand header */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-border/70 px-5">
          <Link
            href="/"
            aria-label="OrixaAI dashboard"
            onClick={closeSidebar}
            className={cn("flex min-w-0 items-center", FOCUS)}
          >
            {/* Keep the logo compact; the auto variant should use its mark at narrow sizes. */}
            <NewLogo  height={38} priority />
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className={cn(
              "ml-3 flex size-9 shrink-0 items-center justify-center rounded-xl",
              "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              FOCUS,
              "lg:hidden",
            )}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-[17px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Dashboard"
          className="min-h-0 flex-1 overflow-y-auto px-3 py-6"
        >
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/65">
            Workspace
          </p>

          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex min-h-11 items-center gap-3 overflow-hidden rounded-xl px-3",
                    "text-[13px] transition-colors duration-200",
                    FOCUS,
                    active
                      ? "bg-violet-500/[0.09] font-semibold text-foreground dark:bg-violet-400/[0.11]"
                      : "font-medium text-muted-foreground hover:bg-foreground/[0.045] hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active-indicator"
                      aria-hidden="true"
                      className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-violet-600 dark:bg-violet-300"
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}

                  <span
                    className={cn(
                      "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                      active
                        ? "text-violet-700 dark:text-violet-300"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    <NavIcon name={item.icon} />
                  </span>

                  <span className="relative z-10 truncate">{item.label}</span>

                  {active && (
                    <span
                      aria-hidden="true"
                      className="ml-auto mr-1 size-1.5 shrink-0 rounded-full bg-violet-600 dark:bg-violet-300"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Account footer */}
        <div className="shrink-0 border-t border-border/70 p-3">
          <Link
            href="/dashboard/profile"
            onClick={closeSidebar}
            className={cn(
              "mb-2 flex min-w-0 items-center gap-3 rounded-xl px-2.5 py-2.5",
              "transition-colors hover:bg-foreground/[0.045]",
              FOCUS,
            )}
          >
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt=""
                className="size-9 shrink-0 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  DISPLAY,
                  "flex size-9 shrink-0 items-center justify-center rounded-full",
                  "bg-violet-500/10 text-sm font-semibold text-violet-700",
                  "dark:bg-violet-400/15 dark:text-violet-300",
                )}
              >
                {initials}
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold leading-5 text-foreground">
                {displayName}
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                @{profile.username}
              </span>
            </span>

            <svg
              viewBox="0 0 24 24"
              className="size-4 shrink-0 text-muted-foreground/60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>

          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
