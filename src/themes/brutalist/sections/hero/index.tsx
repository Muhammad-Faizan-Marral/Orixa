import { getStation } from "../../data";
import { frameProps, resolveModel, type SectionProps } from "../shared/model";
import { StationFrame } from "../shared/StationFrame";
import { TrackedExtLink } from "../shared/tracked-links";

/** Takeoff / runway. Variants: "default" (left), "alt" (centered). */
export function Hero(props: SectionProps) {
  const model = resolveModel(props);
  const s = getStation(model, "hero");
  if (!s) return null;
  const { name, headline, roleWords, location, primaryCta, avatarUrl, initials } = s.data;
  const alt = props.variant === "alt";
  const portfolioId = props.config?.portfolioId;
  const center = alt ? "items-center text-center" : "items-start";

  return (
    <StationFrame
      id="hero"
      label="Takeoff"
      {...frameProps(s, model)}
      align={alt ? "center" : "left"}
      valign="top"
    >
      <div className={`relative flex w-full max-w-3xl flex-col gap-5 ${center}`}>
        <div aria-hidden className="cin-hero-scrim" />
        <div className="relative z-10 flex flex-col gap-5" style={{ alignItems: "inherit" }}>
          <span className="cin-live">Ready for takeoff</span>

          <div className="flex items-center gap-4">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
                style={{ boxShadow: "0 0 0 2px #fff, 0 0 0 5px rgba(242,83,70,.6), 0 12px 30px rgba(0,0,0,.4)" }}
              />
            ) : (
              <div
                aria-hidden
                className="cin-display flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
                style={{
                  background: "linear-gradient(135deg,#ff6a5c,#d93a30)",
                  boxShadow: "0 0 0 2px rgba(255,255,255,.85), 0 12px 30px rgba(0,0,0,.4)",
                }}
              >
                {initials}
              </div>
            )}
            {location && (
              <span className="cin-chip" style={{ background: "rgba(5,8,28,.55)" }}>📍 {location}</span>
            )}
          </div>

          <h1 className="cin-hero-name">{name}</h1>

          {roleWords.length > 0 ? (
            <ul className={`flex flex-wrap gap-2 ${alt ? "justify-center" : ""}`}>
              {roleWords.map((w) => (
                <li key={w} className="cin-chip" style={{ background: "rgba(5,8,28,.55)", fontSize: ".8rem", padding: ".4rem .95rem" }}>
                  {w}
                </li>
              ))}
            </ul>
          ) : headline ? (
            <p className="text-lg text-white/85">{headline}</p>
          ) : null}

          <div className={`mt-2 flex flex-wrap items-center gap-5 ${alt ? "justify-center" : ""}`}>
            {primaryCta && (
              <TrackedExtLink
                portfolioId={portfolioId}
                href={primaryCta.href}
                external={primaryCta.external}
                solid
              >
                {primaryCta.label}
              </TrackedExtLink>
            )}
            <span className="cin-scroll-cue"><span aria-hidden />Scroll to fly</span>
          </div>
        </div>
      </div>
    </StationFrame>
  );
}