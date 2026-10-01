import { getStation } from "../../data";
import type { SkillTier } from "../../schema";
import { frameProps, resolveModel, type SectionProps } from "../shared/model";
import { StationFrame } from "../shared/StationFrame";
import { Heading, Kicker, Panel } from "../shared/ui";

const TIER_COLOR: Record<SkillTier, string> = { core: "#f25346", strong: "#68c3c0", familiar: "#9aa3c7" };
const TIER_LABEL: Record<SkillTier, string> = { core: "Core stack", strong: "Strong", familiar: "Familiar" };

/** Skills / sky islands. Variants: "default" (right, tier chips), "alt" (left, level bars). */
export function Skills(props: SectionProps) {
  const model = resolveModel(props);
  const s = getStation(model, "skills");
  if (!s) return null;
  const { nodes, total, hasLevels } = s.data;
  const alt = props.variant === "alt";
  const tiers: SkillTier[] = ["core", "strong", "familiar"];

  return (
    <StationFrame
      id="skills"
      label="Skills"
      {...frameProps(s, model)}
      align={alt ? "left" : "right"}
    >
      <Panel>
        <Kicker n={s.index + 1} total={model.journey.stationCount}>Sky islands</Kicker>
        <Heading>Skills</Heading>
        {alt && hasLevels ? (
          <ul className="mt-6 space-y-4">
            {nodes.map((n) => (
              <li key={n.id}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-white">{n.name}</span>
                  {n.level !== null && <span className="cin-num">{Math.round(n.level * 100)}%</span>}
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(n.level ?? 0.3) * 100}%`,
                      background: `linear-gradient(90deg, ${TIER_COLOR[n.tier]}, #ffffffaa)`,
                      boxShadow: `0 0 12px ${TIER_COLOR[n.tier]}99`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 space-y-5">
            {tiers.map((t) => {
              const list = nodes.filter((n) => n.tier === t);
              if (!list.length) return null;
              return (
                <div key={t}>
                  <p className="cin-num mb-2.5 flex items-center gap-2 uppercase">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: TIER_COLOR[t], boxShadow: `0 0 8px ${TIER_COLOR[t]}` }} />
                    {TIER_LABEL[t]}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {list.map((n) => (
                      <li
                        key={n.id}
                        className="cin-chip"
                        style={{ borderColor: `${TIER_COLOR[t]}66`, fontSize: t === "core" ? ".85rem" : ".76rem", padding: t === "core" ? ".4rem .9rem" : undefined }}
                      >
                        {n.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
        {total > nodes.length && <p className="cin-num mt-5">+{total - nodes.length} more skills</p>}
      </Panel>
    </StationFrame>
  );
}
