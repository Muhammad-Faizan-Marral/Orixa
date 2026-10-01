import { getStation } from "../../data";
import { frameProps, resolveModel, type SectionProps } from "../shared/model";
import { StationFrame } from "../shared/StationFrame";
import { Timeline } from "../shared/Timeline";
import { Heading, Kicker, Panel } from "../shared/ui";

/** Education / academy peak. Variants: "default" (right), "alt" (left). */
export function Education(props: SectionProps) {
  const model = resolveModel(props);
  const s = getStation(model, "education");
  if (!s) return null;
  const { items, total } = s.data;
  return (
    <StationFrame
      id="education"
      label="Education"
      {...frameProps(s, model)}
      align={props.variant === "alt" ? "left" : "right"}
    >
      <Panel>
        <Kicker n={s.index + 1} total={model.journey.stationCount}>Academy peak</Kicker>
        <Heading>Education</Heading>
        <Timeline items={items} accent="#f07aa0" />
        {total > items.length && <p className="cin-num mt-5">+{total - items.length} more</p>}
      </Panel>
    </StationFrame>
  );
}
