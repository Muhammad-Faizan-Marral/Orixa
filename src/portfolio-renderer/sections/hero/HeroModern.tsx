import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

export function HeroModern({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  const name = config.name || profile.fullName || profile.username;
  const avatar = config.avatarUrl || profile.avatarUrl;

  return (
    <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5">
        <p
          className="text-sm font-medium"
          style={{ color: "var(--pr-accent, #6c5cff)" }}
        >
          Portfolio
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {name}
        </h1>
        {config.headline && (
          <p className="text-lg text-muted-foreground">{config.headline}</p>
        )}
        {config.about && (
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground line-clamp-4">
            {config.about}
          </p>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          {config.resumeUrl && (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ background: "var(--pr-accent, #6c5cff)" }}
            >
              Download Resume
            </a>
          )}
          {config.githubUrl && (
            <a
              href={config.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm"
            >
              GitHub
            </a>
          )}
          {config.linkedinUrl && (
            <a
              href={config.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
      {avatar && (
        <div className="flex justify-center md:justify-end">
          <img
            src={avatar}
            alt={name}
            className="h-48 w-48 rounded-2xl object-cover border border-border sm:h-56 sm:w-56"
            style={{ borderRadius: "var(--pr-radius, 12px)" }}
          />
        </div>
      )}
    </div>
  );
}