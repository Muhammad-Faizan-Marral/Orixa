import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { profileService } from "@/services/profile/profile.service";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { socialLinkService } from "@/services/profile/social-link.service";

import { SocialLinksRow } from "@/features/public-profile/components/social-links-row";

type PublicProfilePageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await profileService.getProfileByUsername(username);

  if (!profile) return { title: "Profile not found" };

  const name = profile.fullName || profile.username;

  return {
    title: `${name} · Orixa AI`,
    description:
      profile.headline || profile.bio || `${name}'s portfolio on Orixa AI.`,
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } = await params;

  const profile = await profileService.getProfileByUsername(username);
  if (!profile) notFound();

  const [portfolios, socialLinks] = await Promise.all([
    portfolioService.getUserPortfolios(profile.id),
    socialLinkService.getSocialLinks(profile.id),
  ]);

  const publishedPortfolios = portfolios.filter((p) => p.status === "published");
  const initials = (profile.fullName ?? profile.username).slice(0, 1).toUpperCase();

  return (
    <main className="bg-aurora relative min-h-screen overflow-hidden px-4 py-20">
      <div
        className="bg-grain pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl">
        <div className="text-center">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.fullName ?? profile.username}
              className="border-gradient-ion mx-auto h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <span className="bg-gradient-ion mx-auto flex h-24 w-24 items-center justify-center rounded-full text-3xl font-semibold text-white">
              {initials}
            </span>
          )}

          <h1 className="text-h1 mt-6">
            {profile.fullName || profile.username}
          </h1>
          {profile.headline && (
            <p className="text-body-lg text-gradient-ion mt-2 inline-block">
              {profile.headline}
            </p>
          )}
          {profile.location && (
            <p className="text-small mt-1">{profile.location}</p>
          )}

          {profile.bio && (
            <p className="text-body mx-auto mt-5 max-w-lg text-balance text-muted-foreground">
              {profile.bio}
            </p>
          )}

          <div className="mt-6">
            <SocialLinksRow links={socialLinks} />
          </div>
        </div>

        <div className="mt-14">
          {publishedPortfolios.length === 0 ? (
            <p className="text-small text-center">
              No published portfolios yet.
            </p>
          ) : (
            <>
              <p className="text-caption mb-4 text-center">Portfolios</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {publishedPortfolios.map((portfolio) => (
                  <Link
                    key={portfolio.id}
                    href={`/${profile.username}/${portfolio.slug}`}
                    className="surface-card group p-5 transition-colors hover:border-border-strong"
                  >
                    <h2 className="text-h3 !text-base">{portfolio.title}</h2>
                    <p className="text-small mt-1 text-primary/80">
                      orixa.ai/{profile.username}/{portfolio.slug}
                    </p>
                    <span className="text-small mt-4 inline-flex items-center gap-1 transition-transform group-hover:translate-x-0.5">
                      View portfolio →
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <p className="text-caption mt-16 text-center">Built with Orixa AI</p>
      </div>
    </main>
  );
}
