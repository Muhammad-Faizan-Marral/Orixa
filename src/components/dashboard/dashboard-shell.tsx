"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

type Profile = {
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
};

type DashboardShellProps = {
  children: React.ReactNode;
  profile: Profile;
};

export function DashboardShell({ children, profile }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar profile={profile} />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Topbar />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
