import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireProfile } from "@/lib/auth/require-profile";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await requireProfile();

  return (
    <DashboardShell
      profile={{
        username: profile.username,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
      }}
    >
      {children}
    </DashboardShell>
  );
}
