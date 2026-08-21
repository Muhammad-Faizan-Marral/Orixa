"use client";

import { useState, useTransition } from "react";

import { updateSettings } from "@/actions/profile/update-settings";

type Settings = {
  language: string;
  timezone: string | null;
  publicProfile: boolean;
  emailNotifications: boolean;
  themeMode: string | null;
};

type Props = {
  initialSettings: Settings;
};

export function SettingsForm({ initialSettings }: Props) {
  const [language, setLanguage] = useState(initialSettings.language);

  const [timezone, setTimezone] = useState(initialSettings.timezone ?? "");

  const [publicProfile, setPublicProfile] = useState(
    initialSettings.publicProfile,
  );

  const [emailNotifications, setEmailNotifications] = useState(
    initialSettings.emailNotifications,
  );

  const [themeMode, setThemeMode] = useState(
    initialSettings.themeMode ?? "system",
  );

  const [message, setMessage] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const submit = () => {
    setMessage(null);

    startTransition(async () => {
      const result = await updateSettings({
        language,
        timezone: timezone.trim() || null,
        publicProfile,
        emailNotifications,
        themeMode: themeMode as "light" | "dark" | "system",
      });

      setMessage(result.message);
    });
  };

  return (
    <section>
      <h1>Settings</h1>

      <div>
        <label>
          Language
          <input
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          />
        </label>

        <label>
          Timezone
          <input
            value={timezone}
            onChange={(event) => setTimezone(event.target.value)}
            placeholder="UTC"
          />
        </label>

        <label>
          Theme
          <select
            value={themeMode}
            onChange={(event) => setThemeMode(event.target.value)}
          >
            <option value="system">System</option>

            <option value="light">Light</option>

            <option value="dark">Dark</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            checked={publicProfile}
            onChange={(event) => setPublicProfile(event.target.checked)}
          />
          Public Profile
        </label>

        <label>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(event) => setEmailNotifications(event.target.checked)}
          />
          Email Notifications
        </label>

        <button type="button" onClick={submit} disabled={isPending}>
          {isPending ? "Saving..." : "Save Settings"}
        </button>

        {message && <p>{message}</p>}
      </div>
    </section>
  );
}
