"use client";

import { useDashboardStore } from "@/stores/dashboard.store";
import { LogoutButton } from "@/components/dashboard/logout-button";
export function SidebarToggle() {
  const sidebarOpen = useDashboardStore((state) => state.sidebarOpen);

  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar);

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
    >
      {sidebarOpen ? "Close Menu" : "Open Menu"}
    </button>
  );
}
