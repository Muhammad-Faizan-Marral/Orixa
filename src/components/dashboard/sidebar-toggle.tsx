"use client";

import { useDashboardStore } from "@/stores/dashboard.store";

export function SidebarToggle() {
  const sidebarOpen = useDashboardStore((state) => state.sidebarOpen);
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar);

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      aria-expanded={sidebarOpen}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-surface-2 lg:hidden"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        {sidebarOpen ? (
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        ) : (
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
