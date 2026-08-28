"use client";

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



function NavIcon({ name }: { name: string }) {
  const common = "h-[18px] w-[18px]";
  switch (name) {
    case "home":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path
            d="M4 11.5 12 4l8 7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "layers":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="M12 3l9 5-9 5-9-5 9-5Z" strokeLinejoin="round" />
          <path d="M3 13l9 5 9-5" strokeLinejoin="round" />
        </svg>
      );
    case "user":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path
            d="M4.5 20c1.6-3.5 4.5-5.3 7.5-5.3s5.9 1.8 7.5 5.3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "settings":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
  const initials = (profile.fullName ?? profile.username)
    .slice(0, 1)
    .toUpperCase();
const NAV_ITEMS = [
  { href: "/dashboard", label: t.nav.overview, icon: "home", exact: true },
  { href: "/dashboard/portfolios", label: t.nav.portfolios, icon: "layers" },
  { href: "/dashboard/profile", label: t.nav.profile, icon: "user" },
  { href: "/dashboard/settings", label: t.nav.settings, icon: "settings" },
];
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
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-ion text-[0.8rem] font-bold text-white">
              O
            </span>
            <span className="font-display text-[1.05rem] font-semibold tracking-tight text-foreground">
              Orixa<span className="text-gradient-ion">AI</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 lg:hidden"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg border border-primary/20 bg-gradient-ion-soft"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <span className={cn("relative", active && "text-primary")}>
                  <NavIcon name={item.icon} />
                </span>
                <span className="relative font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface-2"
          >
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.fullName ?? profile.username}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-ion text-xs font-semibold text-white">
                {initials}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {profile.fullName || profile.username}
              </p>
              <p className="truncate text-xs text-subtle-foreground">
                @{profile.username}
              </p>
            </div>
          </Link>
          <div className="mt-1">
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
