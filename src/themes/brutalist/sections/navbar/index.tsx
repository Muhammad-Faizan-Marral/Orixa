import { resolveModel, type SectionProps } from "../shared/model";
import { HudNav } from "./HudNav";

/** Navbar = HUD. Variants: "default" (side rail / mobile bottom), "alt" (top pill). */
export function Navbar(props: SectionProps) {
  const model = resolveModel(props);
  return (
    <HudNav
      items={model.hud}
      name={model.identity.name}
      initials={model.identity.initials}
      variant={props.variant}
      avatarUrl={model.identity.avatarUrl}
      reducedMotion={model.world.reducedMotion}
    />
  );
}
