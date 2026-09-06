import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

export function HeroEditorial({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  const name = config.name || profile.fullName || profile.username;
  const avatar = config.avatarUrl || profile.avatarUrl;
  const headline = config.headline;
  const about = config.about;

  return (
    <section className="relative w-full">
      <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Left — Massive typography */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <p
              className="text-[11px] font-medium uppercase tracking-[0.35em]"
              style={{ color: "var(--pr-accent)" }}
            >
              Portfolio
            </p>

            <h1
              className="text-[clamp(2.8rem,7vw,5.5rem)] font-semibold leading-[0.95]"
              style={{
                letterSpacing: "var(--pr-heading-tracking, -0.03em)",
              }}
            >
              {name}
            </h1>
          </div>

          {headline && (
            <p className="max-w-lg text-xl leading-snug text-muted-foreground sm:text-2xl">
              {headline}
            </p>
          )}

          {about && (
            <p
              className="max-w-md text-[15px] text-muted-foreground"
              style={{ lineHeight: "var(--pr-body-leading, 1.75)" }}
            >
              {about}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {config.resumeUrl && (
              <a
                href={config.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-medium transition-opacity hover:opacity-70"
              >
                Download Resume
                <span aria-hidden>→</span>
              </a>
            )}

            {config.githubUrl && (
              <a
                href={config.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            )}

            {config.linkedinUrl && (
              <a
                href={config.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Right — Portrait + meta */}
        <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-6">
          {avatar ? (
            <div
              className="relative w-full max-w-[320px] overflow-hidden aspect-[4/5]"
              style={{
                borderRadius: "var(--pr-radius)",
                boxShadow: "var(--pr-card-shadow)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar}
                alt={name}
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in srgb, var(--pr-accent) 18%, transparent), transparent 45%)",
                }}
              />
            </div>
          ) : (
            <div
              className="flex aspect-[4/5] w-full max-w-[320px] items-center justify-center border border-border bg-surface text-4xl font-semibold text-muted-foreground"
              style={{ borderRadius: "var(--pr-radius)" }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="text-left lg:text-right space-y-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Available for work
            </p>
            <div
              className="h-px w-16 lg:ml-auto"
              style={{ backgroundColor: "var(--pr-accent)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
