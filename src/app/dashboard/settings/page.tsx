import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { settingsService } from "@/services/profile/settings.service";

import { SettingsForm } from "@/features/profile/components/settings-form";

export default async function SettingsPage() {
  await requireUser();

  const profile = await requireProfile();

  const settings = await settingsService.getSettings(profile.id);

  return (
    <main>
      <SettingsForm initialSettings={settings} />
    </main>
  );
}
