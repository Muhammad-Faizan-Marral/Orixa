import { getStation } from "../../data";
import { frameProps, resolveModel, type SectionProps } from "../shared/model";
import { StationFrame } from "../shared/StationFrame";
import { Timeline } from "../shared/Timeline";
import { Heading, Kicker, Panel } from "../shared/ui";

/** Experience ("Journey") / beacon trail. Variants: "default" (left), "alt" (right). */
export function Experience(props: SectionProps) {
  const model = resolveModel(props);
  const s = getStation(model, "experience");
  if (!s) return null;
  const { items, total } = s.data;
  return (
    <StationFrame
      id="experience"
      label="Journey"
      {...frameProps(s, model)}
      align={props.variant === "alt" ? "right" : "left"}
    >
      <Panel>
        <Kicker n={s.index + 1} total={model.journey.stationCount}>Beacon trail</Kicker>
        <Heading>Journey</Heading>
        <Timeline items={items} accent="#ffb347" />
        {total > items.length && <p className="cin-num mt-5">+{total - items.length} earlier roles</p>}
      </Panel>
    </StationFrame>
  );
}
