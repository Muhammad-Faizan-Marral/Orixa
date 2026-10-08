import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ThemeSync } from "@/components/theme-sync";
import { LocaleSync } from "@/components/locale-sync";
import { requireProfile } from "@/lib/auth/require-profile";
import { TimezoneSync } from "@/components/timezone-sync";
import { NetworkStatusBanner } from "@/components/network-status-banner";
import { ToastProvider } from "@/components/toast";
import { getSettingsCached } from "@/lib/cache/dashboard-data";
import { DashboardLegalNotice } from "@/components/legal/legal-notices";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await requireProfile();
  // cached — no extra round-trip on every child page when warm
  const settings = await getSettingsCached(profile.id);

  return (
    <>
      <DashboardLegalNotice />
      <ThemeSync themeMode={settings.themeMode} />
      <LocaleSync language={settings.language} />
      <TimezoneSync timezone={settings.timezone} />
      <DashboardShell
        profile={{
          username: profile.username,
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl,
        }}
      >
        <NetworkStatusBanner />
        <ToastProvider>{children}</ToastProvider>
      </DashboardShell>
    </>
  );
}