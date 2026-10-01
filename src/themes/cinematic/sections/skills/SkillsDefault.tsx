"use client";

import type { CSSProperties } from "react";
import type { CinematicSkill, SkillTier } from "../../schema";
import type { SectionProps } from "../shared/types";

const TIER_ORDER: SkillTier[] = ["core", "working", "familiar"];
const TIER_LABEL: Record<SkillTier, string> = {
  core: "Core",
  working: "Working",
  familiar: "Familiar",
};

const at = (t: number): CSSProperties => ({ ["--at" as string]: t });

function groupByTier(skills: CinematicSkill[]) {
  const map = new Map<SkillTier, CinematicSkill[]>();
  for (const t of TIER_ORDER) map.set(t, []);
  for (const s of skills) {
    const list = map.get(s.tier) ?? map.get("familiar")!;
    list.push(s);
  }
  return TIER_ORDER.map((tier) => ({ tier, items: map.get(tier)! })).filter((g) => g.items.length > 0);
}

export function SkillsDefault({ portfolio, act }: SectionProps) {
  const { skills, stats } = portfolio;
  if (!skills.length) return null;

  const groups = groupByTier(skills);
  let delay = 0.08;

  return (
    <div className="cin-skills">
      <header className="cin-skills-head">
        <p className="cin-eyebrow">{act.label}</p>
        <h2 className="cin-skills-title">{act.title}</h2>
        {act.caption && <p className="cin-caption">{act.caption}</p>}
      </header>

      <div className="cin-skills-body">
        {groups.map(({ tier, items }) => (
          <section key={tier} className="cin-skill-group" aria-label={TIER_LABEL[tier]}>
            <p className="cin-skill-tier cin-reveal" style={at(delay)}>
              {TIER_LABEL[tier]}
              <span>{items.length}</span>
            </p>

            <ul className="cin-skill-list">
              {items.map((s) => {
                const t = (delay += 0.035);
                return (
                  <li key={s.id} className="cin-skill cin-reveal" style={at(t)}>
                    <div className="cin-skill-row">
                      <span className="cin-skill-name">{s.name}</span>
                      {s.levelLabel && <span className="cin-skill-lvl">{s.levelLabel}</span>}
                    </div>
                    {s.levelKnown && (
                      <div className="cin-skill-bar" aria-hidden>
                        <i style={{ width: `${Math.round(s.level * 100)}%` }} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {stats.coreSkillCount > 0 && (
        <p className="cin-skills-foot cin-reveal" style={at(0.55)}>
          {stats.coreSkillCount} core · {stats.skillCount} total
        </p>
      )}
    </div>
  );
}