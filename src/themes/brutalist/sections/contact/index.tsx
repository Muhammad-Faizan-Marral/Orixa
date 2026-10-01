import { getStation } from "../../data";
import { frameProps, resolveModel, type SectionProps } from "../shared/model";
import { StationFrame } from "../shared/StationFrame";
import { ExtLink, Heading, Kicker, Panel } from "../shared/ui";

/** Contact / landing strip. Variants: "default" (center), "alt" (right). */
export function Contact(props: SectionProps) {
  const model = resolveModel(props);
  const s = getStation(model, "contact");
  if (!s) return null;
  const { links, location, resumeUrl } = s.data;
  const alt = props.variant === "alt";
  return (
    <StationFrame
      id="contact"
      label="Landing"
      {...frameProps(s, model)}
      align={alt ? "right" : "center"}
    >
      <Panel>
        <div className={alt ? "" : "flex flex-col items-center text-center"}>
          <Kicker n={s.index + 1} total={model.journey.stationCount}>Cleared to land</Kicker>
          <Heading>Let&apos;s build something</Heading>
          <p className="cin-body mt-4 max-w-md">
            Thanks for flying along. If something here caught your eye, {model.identity.firstName} is one message away.
          </p>
          {location && <p className="cin-chip mt-4">📍 {location}</p>}
          <div className={`mt-7 flex flex-wrap gap-3 ${alt ? "" : "justify-center"}`}>
            {links.map((l, i) => (
              <ExtLink key={`${l.kind}-${l.href}`} href={l.href} external={l.external} solid={i === 0}>
                {l.label}
              </ExtLink>
            ))}
            {resumeUrl && !links.some((l) => l.kind === "resume") && <ExtLink href={resumeUrl} external>Resume</ExtLink>}
          </div>
        </div>
      </Panel>
    </StationFrame>
  );
}
