"use client";

import Link from "next/link";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { useDashboardStore } from "@/stores/dashboard.store";

export function Sidebar() {
  const sidebarOpen = useDashboardStore(
    (state) => state.sidebarOpen,
  );

  const closeSidebar = useDashboardStore(
    (state) => state.closeSidebar,
  );

  return (
    <aside
      aria-hidden={!sidebarOpen}
      style={{
        display: sidebarOpen ? "block" : "none",
      }}
    >
      <div>
        <header>
          <Link href="/dashboard">
            Orixa
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </header>

        <nav>
          <ul>
            <li>
              <Link href="/dashboard">
                Dashboard
              </Link>
            </li>

            <li>
              <Link href="/dashboard/portfolios">
                Portfolios
              </Link>
            </li>

            <li>
              <Link href="/dashboard/profile">
                Profile
              </Link>
            </li>

            <li>
              <Link href="/dashboard/settings">
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        <footer>
          <LogoutButton />
        </footer>
      </div>
    </aside>
  );
}