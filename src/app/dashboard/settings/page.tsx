import Link from "next/link";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { settingsService } from "@/services/profile/settings.service";

import { SettingsForm } from "@/features/profile/components/settings-form";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { CopyUrlButton } from "@/features/profile/components/copy-url-button";
import { FormatDate } from "@/components/format-date";


export default async function SettingsPage() {
  const user = await requireUser();
  const profile = await requireProfile();

  const settings = await settingsService.getSettings(profile.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="animate-fade-in-up space-y-6">
        <header>
          <p className="text-caption text-accent">Account</p>
          <h1 className="text-h1 mt-2">Settings</h1>
          <p className="text-body mt-1 text-muted-foreground">
            Manage how Orixa looks, what visitors can see, and how you get
            notified.
          </p>
        </header>

        <SettingsForm
          initialSettings={{
            language: settings.language,
            timezone: settings.timezone,
            publicProfile: settings.publicProfile,
            emailNotifications: settings.emailNotifications,
            themeMode: settings.themeMode,
          }}
        />
      </div>

      <aside
        className="animate-fade-in-up space-y-6"
        style={{ animationDelay: "80ms" }}
      >
        <div className="surface-card p-6">
          <p className="text-label mb-4">Account</p>

          <div className="space-y-3">
            <div>
              <p className="text-caption text-subtle-foreground">Email</p>
              <p className="text-small mt-0.5 truncate text-foreground">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-caption text-subtle-foreground">Username</p>
              <p className="text-small mt-0.5 text-foreground">
                @{profile.username}
              </p>
            </div>

            <div>
              <p className="text-caption text-subtle-foreground">
                Member since
              </p>
              <p className="text-small mt-0.5 text-foreground">
               <FormatDate value={profile.createdAt} variant="monthYear" />
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-caption px-1 text-subtle-foreground">Public URL</p>
          <CopyUrlButton url={`orixa.ai/${profile.username}`} />
          <Link
            href={`/${profile.username}`}
            target="_blank"
            className="surface-card flex items-center justify-center gap-1.5 p-4 text-center text-sm text-primary transition-colors hover:bg-surface-2"
          >
            View public profile <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="surface-card p-3">
          <LogoutButton className="flex w-full items-center justify-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-error/10 hover:text-error" />
        </div>
      </aside>
    </div>
  );
}
