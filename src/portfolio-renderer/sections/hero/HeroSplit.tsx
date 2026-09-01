import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

export function HeroSplit({
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
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="order-2 space-y-6 md:order-1">
          <p
            className="text-sm font-medium uppercase tracking-[0.2em]"
            style={{
              color: "var(--pr-accent, #6c5cff)",
            }}
          >
            Hello, I&apos;m
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {name}
          </h1>

          {config.headline && (
            <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {config.headline}
            </p>
          )}

          {config.about && (
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              {config.about}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
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
                Download Resume
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
          </div>
        </div>

        <div className="order-1 flex justify-center md:order-2 md:justify-end">
          {avatar ? (
            <div
              className="relative overflow-hidden border border-border"
              style={{
                width: "min(100%, 420px)",
                aspectRatio: "1 / 1",
                borderRadius: "var(--pr-radius, 24px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div
              className="flex aspect-square w-full max-w-[420px] items-center justify-center border border-border bg-muted"
              style={{
                borderRadius: "var(--pr-radius, 24px)",
              }}
            >
              <span className="text-6xl font-bold text-muted-foreground">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}