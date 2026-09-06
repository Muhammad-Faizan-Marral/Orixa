import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

export function HeroBrutalist({
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
      <div className="border-2 border-foreground">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-3 sm:px-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
            Portfolio / 2025
          </span>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--pr-accent)" }}
          >
            Available
          </span>
        </div>

        <div className="grid lg:grid-cols-12">
          {/* Left content */}
          <div className="lg:col-span-8 space-y-8 border-b-2 border-foreground p-6 sm:p-8 lg:border-b-0 lg:border-r-2 lg:border-foreground">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Hello, I am
              </p>
              <h1
                className="text-[clamp(2.6rem,6.5vw,5rem)] font-black uppercase leading-[0.9]"
                style={{ letterSpacing: "-0.02em" }}
              >
                {name}
              </h1>
            </div>

            {headline && (
              <p className="max-w-xl text-lg font-medium leading-snug sm:text-xl">
                {headline}
              </p>
            )}

            {about && (
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                {about}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {config.resumeUrl && (
                <a
                  href={config.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border-2 border-foreground bg-foreground px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-background transition-colors hover:bg-transparent hover:text-foreground"
                >
                  Resume
                </a>
              )}

              {config.githubUrl && (
                <a
                  href={config.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border-2 border-foreground px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background"
                >
                  GitHub
                </a>
              )}

              {config.linkedinUrl && (
                <a
                  href={config.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border-2 border-foreground px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Right — Avatar block */}
          <div className="lg:col-span-4 flex flex-col">
            {avatar ? (
              <div className="relative flex-1 min-h-[280px] overflow-hidden bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatar}
                  alt={name}
                  className="absolute inset-0 h-full w-full object-cover grayscale contrast-125"
                />
                <div
                  className="absolute inset-0 mix-blend-multiply opacity-40"
                  style={{ backgroundColor: "var(--pr-accent)" }}
                />
              </div>
            ) : (
              <div className="flex flex-1 min-h-[280px] items-center justify-center bg-surface text-6xl font-black">
                {name.charAt(0).toUpperCase()}
              </div>
            )}

            <div
              className="border-t-2 border-foreground px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.2em]"
              style={{ backgroundColor: "var(--pr-accent)", color: "#000" }}
            >
              {headline ? headline.slice(0, 28) : "Creative Professional"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
