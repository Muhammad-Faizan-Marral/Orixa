import Link from "next/link";

import { requireProfile } from "@/lib/auth/require-profile";
import { socialLinkService } from "@/services/profile/social-link.service";

import { ProfileEditForm } from "@/features/profile/components/profile-edit-form";
import { SocialLinksManager } from "@/features/profile/components/social-links-manager";
import { FileUpload } from "@/features/profile/components/file-upload";
import { CopyUrlButton } from "@/features/profile/components/copy-url-button";

export default async function ProfilePage() {
  const profile = await requireProfile();
  const socialLinks = await socialLinkService.getSocialLinks(profile.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="animate-fade-in-up space-y-6">
        <header>
          <p className="text-caption text-accent">Profile studio</p>
          <h1 className="text-h1 mt-2">Your identity</h1>
          <p className="text-body mt-1 text-muted-foreground">
            This information appears across all of your portfolios.
          </p>
        </header>

        <section className="surface-card p-6">
          <ProfileEditForm profile={profile} />
        </section>

        <section className="surface-card p-6">
          <SocialLinksManager initialLinks={socialLinks} />
        </section>
      </div>

      <aside
        className="animate-fade-in-up space-y-6"
        style={{ animationDelay: "80ms" }}
      >
        <div className="surface-card bg-aurora p-6 text-center">
          <p className="text-label mb-4">Profile picture</p>
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.fullName ?? profile.username}
              className="border-border shadow-elevated mx-auto h-20 w-20 rounded-full border object-cover"
            />
          ) : (
            <span className="bg-gradient-ion shadow-glow-primary mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold text-white">
              {(profile.fullName ?? profile.username).slice(0, 1).toUpperCase()}
            </span>
          )}
          <p className="text-small mt-3">
            {profile.fullName || profile.username}
          </p>
          <div className="mt-5 text-left">
            <FileUpload
              type="avatar"
              accept="image/jpeg,image/png,image/webp,image/gif"
              label="Upload profile picture"
            />
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
      </aside>
    </div>
  );
}
