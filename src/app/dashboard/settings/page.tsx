import Link from "next/link";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { settingsService } from "@/services/profile/settings.service";

import { SettingsForm } from "@/features/profile/components/settings-form";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { CopyUrlButton } from "@/features/profile/components/copy-url-button";
import { FormatDate } from "@/components/format-date";

const DISPLAY = "font-[family-name:var(--font-display)]";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default async function SettingsPage() {
  const user = await requireUser();
  const profile = await requireProfile();

  const settings = await settingsService.getSettings(profile.id);

  const initial = (profile.fullName ?? profile.username)
    .slice(0, 1)
    .toUpperCase();

  return (
    <div
      className="mx-auto w-full max-w-6xl space-y-10 pb-20"
      style={{ ["--font-display" as string]: "var(--font-dm), sans-serif" }}
    >
      <header className="space-y-3">
        <h1
          className={`${DISPLAY} text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl`}
        >
          Settings
        </h1>
        <p className="max-w-[56ch] text-base leading-7 text-muted-foreground">
          Manage how Orixa looks, what visitors can see, and how you get
          notified.
        </p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <SettingsForm
          initialSettings={{
            language: settings.language,
            timezone: settings.timezone,
            publicProfile: settings.publicProfile,
            emailNotifications: settings.emailNotifications,
            themeMode: settings.themeMode,
          }}
        />

        <aside className="space-y-5 lg:sticky lg:top-24">
          <section
            aria-label="Account"
            className="overflow-hidden rounded-2xl border border-border bg-background"
          >
            <div className="flex items-center gap-3.5 bg-violet-500/[0.08] p-5 dark:bg-violet-400/[0.1]">
              <span
                aria-hidden="true"
                className={`${DISPLAY} flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-base font-semibold text-white`}
              >
                {initial}
              </span>
              <div className="min-w-0">
                <p
                  className={`${DISPLAY} truncate text-lg font-semibold leading-tight tracking-tight text-foreground`}
                >
                  Account
                </p>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  @{profile.username}
                </p>
              </div>
            </div>

            <dl className="divide-y divide-border">
              <div className="px-5 py-3.5">
                <dt className="text-small text-muted-foreground">Email</dt>
                <dd className="mt-0.5 truncate text-sm font-medium text-foreground">
                  {user.email}
                </dd>
              </div>

              <div className="px-5 py-3.5">
                <dt className="text-small text-muted-foreground">Username</dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground">
                  @{profile.username}
                </dd>
              </div>

              <div className="px-5 py-3.5">
                <dt className="text-small text-muted-foreground">
                  Member since
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground">
                  <FormatDate value={profile.createdAt} variant="monthYear" />
                </dd>
              </div>
            </dl>
          </section>

          <section
            aria-label="Public URL"
            className="space-y-3 rounded-2xl border border-border bg-background p-5"
          >
            <p className="text-small font-medium text-foreground">
              Public URL
            </p>

            <CopyUrlButton url={`orixa.ai/${profile.username}`} />

            <Link
              href={`/${profile.username}`}
              target="_blank"
              className={`group flex items-center justify-center gap-2 rounded-xl border border-violet-500/35 bg-violet-500/[0.08] px-4 py-2.5 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-500/15 dark:text-violet-300 ${FOCUS}`}
            >
              View public profile
              <svg
                viewBox="0 0 24 24"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </section>

          <section className="rounded-2xl border border-border bg-background p-2.5">
            <LogoutButton className="flex w-full items-center justify-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 dark:hover:text-red-400" />
          </section>
        </aside>
      </div>
    </div>
  );
}