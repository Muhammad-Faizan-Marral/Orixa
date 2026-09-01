import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

export function HeroCentered({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  const name = config.name || profile.fullName || profile.username;
  const avatar = config.avatarUrl || profile.avatarUrl;

  return (
    <section className="w-full">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        {avatar && (
          <div
            className="mb-6 h-24 w-24 overflow-hidden border border-border sm:h-28 sm:w-28"
            style={{
              borderRadius: "var(--pr-radius, 16px)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <p
          className="mb-3 text-sm font-medium uppercase tracking-[0.2em]"
          style={{
            color: "var(--pr-accent, #6c5cff)",
          }}
        >
          Portfolio
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {name}
        </h1>

        {config.headline && (
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {config.headline}
          </p>
        )}

        {config.about && (
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
            {config.about}
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {config.resumeUrl && (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--pr-accent, #6c5cff)",
                borderRadius: "var(--pr-radius, 12px)",
              }}
            >
              View Resume
            </a>
          )}

          {config.linkedinUrl && (
            <a
              href={config.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-border px-5 py-2.5 text-sm transition-colors hover:bg-muted"
              style={{
                borderRadius: "var(--pr-radius, 12px)",
              }}
            >
              LinkedIn
            </a>
          )}

          {config.githubUrl && (
            <a
              href={config.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-border px-5 py-2.5 text-sm transition-colors hover:bg-muted"
              style={{
                borderRadius: "var(--pr-radius, 12px)",
              }}
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </section>
  );
}