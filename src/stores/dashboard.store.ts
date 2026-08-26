"use client";

import { create } from "zustand";

type DashboardStore = {
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  sidebarOpen: false,
  openSidebar: () => {
    set({ sidebarOpen: true });
  },
  closeSidebar: () => {
    set({ sidebarOpen: false });
  },
  toggleSidebar: () => {
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    }));
  },
}));
