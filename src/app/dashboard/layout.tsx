import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ThemeSync } from "@/components/theme-sync";
import { requireProfile } from "@/lib/auth/require-profile";
import { settingsService } from "@/services/profile/settings.service";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await requireProfile();
  const settings = await settingsService.getSettings(profile.id);

  return (
    <>
      <ThemeSync themeMode={settings.themeMode} />
      <DashboardShell
        profile={{
          username: profile.username,
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl,
        }}
      >
        {children}
      </DashboardShell>
    </>
  );
}
