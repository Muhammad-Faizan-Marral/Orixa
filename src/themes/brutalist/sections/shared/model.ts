import type { ThemeSectionProps } from "@/themes/types";
import type { CinematicModel } from "../../schema";
import { buildCinematicModel } from "../../data";

/** Har section ka props: ThemePage `model` pass kare to dobara build nahi hota. */
export type SectionProps = ThemeSectionProps & {
  variant?: string;
  model?: CinematicModel;
};

export function resolveModel(props: SectionProps): CinematicModel {
  return props.model ?? buildCinematicModel({ config: props.config, profile: props.profile });
}

/** StationFrame ke liye common props. Pehla station (takeoff) aur aakhri (landing) apne kinare par bhi visible rehte hain. */
export function frameProps(
  s: { index: number; range: { center: number; start: number; end: number } },
  model: CinematicModel,
) {
  return {
    center: s.range.center,
    halfWidth: (s.range.end - s.range.start) / 2,
    edge: (s.index === 0 ? "first" : s.index === model.stations.length - 1 ? "last" : undefined) as
      | "first"
      | "last"
      | undefined,
  };
}
