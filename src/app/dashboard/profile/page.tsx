import Link from "next/link";

import { requireProfile } from "@/lib/auth/require-profile";
import { socialLinkService } from "@/services/profile/social-link.service";

import { ProfileEditForm } from "@/features/profile/components/profile-edit-form";
import { SocialLinksManager } from "@/features/profile/components/social-links-manager";
import { FileUpload } from "@/features/profile/components/file-upload";
import { CopyUrlButton } from "@/features/profile/components/copy-url-button";

const DISPLAY = "font-[family-name:var(--font-display)]";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default async function ProfilePage() {
  const profile = await requireProfile();
  const socialLinks = await socialLinkService.getSocialLinks(profile.id);

  const displayName = profile.fullName || profile.username;
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
          Your identity
        </h1>
        <p className="max-w-[54ch] text-base leading-7 text-muted-foreground">
          This information appears across all of your portfolios.
        </p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section
            aria-label="Basic information"
            className="rounded-2xl border border-border bg-background p-6 sm:p-8"
          >
            <ProfileEditForm profile={profile} />
          </section>

          <section
            aria-label="Social links"
            className="rounded-2xl border border-border bg-background p-6 sm:p-8"
          >
            <SocialLinksManager initialLinks={socialLinks} />
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <section
            aria-label="Profile picture"
            className="overflow-hidden rounded-2xl border border-border bg-background"
          >
            <div className="flex flex-col items-center bg-violet-500/[0.08] px-6 pb-6 pt-8 text-center dark:bg-violet-400/[0.1]">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={displayName}
                  className="size-24 rounded-full object-cover ring-4 ring-background"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className={`${DISPLAY} flex size-24 items-center justify-center rounded-full bg-violet-600 text-3xl font-semibold text-white ring-4 ring-background`}
                >
                  {initial}
                </span>
              )}

              <p
                className={`${DISPLAY} mt-4 text-xl font-semibold leading-tight tracking-tight text-foreground`}
              >
                {displayName}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                @{profile.username}
              </p>
              {profile.headline && (
                <p className="mt-2 max-w-[26ch] text-sm leading-5 text-foreground/70">
                  {profile.headline}
                </p>
              )}
            </div>

            <div className="border-t border-border p-5">
              <FileUpload
                type="avatar"
                accept="image/jpeg,image/png,image/webp,image/gif"
                label="Upload profile picture"
              />
            </div>
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
        </aside>
      </div>
    </div>
  );
}