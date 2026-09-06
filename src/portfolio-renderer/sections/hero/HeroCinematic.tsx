import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

export function HeroCinematic({
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
    <section className="relative w-full overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
          style={{ backgroundColor: "var(--pr-accent)" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />
      </div>

      <div className="flex flex-col items-center text-center pt-6 pb-4">
        {/* Small eyebrow */}
        <div className="mb-8 inline-flex items-center gap-3">
          <span
            className="h-px w-8"
            style={{ backgroundColor: "var(--pr-accent)" }}
          />
          <span
            className="text-[11px] font-medium uppercase tracking-[0.4em]"
            style={{ color: "var(--pr-accent)" }}
          >
            Portfolio
          </span>
          <span
            className="h-px w-8"
            style={{ backgroundColor: "var(--pr-accent)" }}
          />
        </div>

        {/* Avatar floating */}
        {avatar && (
          <div className="mb-10 relative">
            <div
              className="absolute -inset-3 rounded-full opacity-40 blur-xl"
              style={{ backgroundColor: "var(--pr-accent)" }}
            />
            <div
              className="relative h-28 w-28 overflow-hidden rounded-full border-2 sm:h-32 sm:w-32"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--pr-accent) 50%, transparent)",
                boxShadow:
                  "0 0 0 8px color-mix(in srgb, var(--pr-accent) 12%, transparent)",
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
        )}

        {/* Massive name */}
        <h1
          className="max-w-4xl text-[clamp(3rem,9vw,6.5rem)] font-bold leading-[0.92]"
          style={{
            letterSpacing: "var(--pr-heading-tracking, -0.035em)",
          }}
        >
          {name}
        </h1>

        {headline && (
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
            {headline}
          </p>
        )}

        {about && (
          <p
            className="mt-5 max-w-xl text-sm text-muted-foreground sm:text-base"
            style={{ lineHeight: "var(--pr-body-leading, 1.7)" }}
          >
            {about}
          </p>
        )}

        {/* CTA row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {config.resumeUrl && (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.03] hover:opacity-95"
              style={{
                backgroundColor: "var(--pr-accent)",
                borderRadius: "var(--pr-radius)",
                boxShadow: "0 12px 40px -12px var(--pr-accent)",
              }}
            >
              Download Resume
            </a>
          )}

          <div className="flex items-center gap-5 text-sm">
            {config.githubUrl && (
              <a
                href={config.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            )}
            {config.linkedinUrl && (
              <a
                href={config.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
