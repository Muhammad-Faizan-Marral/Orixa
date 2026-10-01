import { getStation } from "../../data";
import { frameProps, resolveModel, type SectionProps } from "../shared/model";
import { StationFrame } from "../shared/StationFrame";
import { Heading, Kicker, Panel } from "../shared/ui";

/** Certificates ("Badges") / balloon field. Variants: "default" (left), "alt" (center, 2 cols). */
export function Certificates(props: SectionProps) {
  const model = resolveModel(props);
  const s = getStation(model, "certificates");
  if (!s) return null;
  const { items, total } = s.data;
  const alt = props.variant === "alt";
  return (
    <StationFrame
      id="certificates"
      label="Badges"
      {...frameProps(s, model)}
      align={alt ? "center" : "left"}
    >
      <Panel wide={alt}>
        <Kicker n={s.index + 1} total={model.journey.stationCount}>Balloon field</Kicker>
        <Heading>Badges</Heading>
        <ul className={`mt-6 grid gap-3 ${alt ? "sm:grid-cols-2" : ""}`}>
          {items.map((c) => {
            const body = (
              <>
                <span
                  aria-hidden
                  className="mt-1 h-7 w-7 shrink-0 rounded-full"
                  style={{ background: `radial-gradient(circle at 30% 30%, #fff8, ${c.accent} 60%)`, boxShadow: `0 0 18px ${c.accent}88` }}
                />
                <span className="min-w-0">
                  <span className="cin-display block font-semibold text-white">{c.name}</span>
                  <span className="cin-num mt-0.5 block uppercase">{[c.issuer, c.dateLabel].filter(Boolean).join(" · ")}</span>
                </span>
              </>
            );
            return (
              <li key={c.id} className="cin-card" style={{ ["--glow" as string]: `${c.accent}88` }}>
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="flex gap-3.5">{body}</a>
                ) : (
                  <div className="flex gap-3.5">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
        {total > items.length && <p className="cin-num mt-5">+{total - items.length} more</p>}
      </Panel>
    </StationFrame>
  );
}
