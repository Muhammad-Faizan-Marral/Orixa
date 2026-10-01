import { getStation } from "../../data";
import { frameProps, resolveModel, type SectionProps } from "../shared/model";
import { StationFrame } from "../shared/StationFrame";
import { Heading, Kicker, Panel } from "../shared/ui";

/** About / control tower. Variants: "default" (left), "alt" (right). */
export function About(props: SectionProps) {
  const model = resolveModel(props);
  const s = getStation(model, "about");
  if (!s) return null;
  const { paragraphs, stats } = s.data;
  return (
    <StationFrame
      id="about"
      label="About"
      {...frameProps(s, model)}
      align={props.variant === "alt" ? "right" : "left"}
    >
      <Panel>
        <Kicker n={s.index + 1} total={model.journey.stationCount}>Control tower</Kicker>
        <Heading>About me</Heading>
        <div className="cin-body mt-5 space-y-3">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {stats.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
            {stats.map((st) => (
              <div key={st.key} className="cin-stat">
                <dt>{st.label}</dt>
                <dd>{st.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Panel>
    </StationFrame>
  );
}
