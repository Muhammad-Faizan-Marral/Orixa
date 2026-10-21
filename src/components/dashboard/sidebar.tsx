"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLocale } from "@/components/locale-provider";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { useDashboardStore } from "@/stores/dashboard.store";
import { cn } from "@/lib/utils";

type Profile = {
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
};

const DISPLAY = "font-[family-name:var(--font-display,var(--font-dm))]";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-inset";

function NavIcon({ name }: { name: string }) {
  const svg = (children: React.ReactNode) => (
    <svg
      className="size-[18px]"
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, closeSidebar]);

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-background transition-transform duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 pb-4 pt-5">
          <Link
            href="/dashboard"
            onClick={closeSidebar}
            className={cn("flex items-center gap-2.5 rounded-lg", FOCUS)}
          >
            <span
              className={cn(
                DISPLAY,
                "flex size-8 items-center justify-center rounded-[10px] bg-violet-600 text-sm font-bold text-white",
              )}
              aria-hidden="true"
            >
              O
            </span>
            <span
              className={cn(
                DISPLAY,
                "text-[1.1rem] font-semibold tracking-[-0.02em] text-foreground",
              )}
            >
              Orixa
              <span className="text-violet-600 dark:text-violet-300">AI</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground lg:hidden",
              FOCUS,
            )}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav aria-label="Dashboard" className="flex-1 space-y-0.5 px-3 pt-2">
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
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  FOCUS,
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl bg-violet-500/[0.1] dark:bg-violet-400/[0.12]"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="absolute inset-y-2.5 left-0 w-[3px] rounded-r-full bg-violet-600 dark:bg-violet-300" />
                  </motion.span>
                )}

                <span
                  className={cn(
                    "relative transition-colors",
                    active && "text-violet-700 dark:text-violet-300",
                  )}
                >
                  <NavIcon name={item.icon} />
                </span>

                <span
                  className={cn("relative", active ? "font-semibold" : "font-medium")}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Account */}
        <div className="space-y-1 border-t border-border p-3">
          <Link
            href="/dashboard/profile"
            onClick={closeSidebar}
            className={cn(
              "flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-foreground/[0.04]",
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
                  "flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-sm font-semibold text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
                )}
              >
                {initials}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight text-foreground">
                {displayName}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                @{profile.username}
              </p>
            </div>
          </Link>

          <LogoutButton />
        </div>
      </aside>
    </>
  );
}