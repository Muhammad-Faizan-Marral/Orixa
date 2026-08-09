"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { SidebarToggle } from "@/components/dashboard/sidebar-toggle";
import { useDashboardStore } from "@/stores/dashboard.store";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const sidebarOpen = useDashboardStore((state) => state.sidebarOpen);

  return (
    <div>
      <Sidebar />

      <div>
        <SidebarToggle />

        <main>{children}</main>
      </div>
    </div>
  );
}
