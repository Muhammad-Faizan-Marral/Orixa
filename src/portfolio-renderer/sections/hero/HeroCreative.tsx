import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

export function HeroCreative({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  const name = config.name || profile.fullName || profile.username;
  const avatar = config.avatarUrl || profile.avatarUrl;

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--pr-accent,#6c5cff)] opacity-10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[var(--pr-accent,#6c5cff)] opacity-10 blur-3xl" />

      <div className="relative flex min-h-[500px] flex-col justify-center">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium"
              style={{
                borderRadius: "999px",
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: "var(--pr-accent, #6c5cff)",
                }}
              />

              Available for opportunities
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {name}
              <span
                className="block"
                style={{
                  color: "var(--pr-accent, #6c5cff)",
                }}
              >
                {config.headline || "Creative Professional"}
              </span>
            </h1>

            {config.about && (
              <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {config.about}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {config.resumeUrl && (
                <a
                  href={config.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
                  style={{
                    backgroundColor: "var(--pr-accent, #6c5cff)",
                    borderRadius: "var(--pr-radius, 12px)",
                  }}
                >
                  Explore My Work
                </a>
              )}

              {config.githubUrl && (
                <a
                  href={config.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  GitHub →
                </a>
              )}

              {config.linkedinUrl && (
                <a
                  href={config.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  LinkedIn →
                </a>
              )}
            </div>
          </div>

          {avatar && (
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div
                  className="absolute -inset-3 rounded-[inherit] opacity-20 blur-xl"
                  style={{
                    backgroundColor: "var(--pr-accent, #6c5cff)",
                  }}
                />

                <div
                  className="relative h-52 w-52 overflow-hidden border border-border sm:h-64 sm:w-64 lg:h-72 lg:w-72"
                  style={{
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
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}