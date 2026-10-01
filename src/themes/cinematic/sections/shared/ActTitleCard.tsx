import type { SectionProps } from "./types";

/**
 * Generic chapter title card. Used as the default render for any act that
 * doesn't have its own section yet, so the whole film is already navigable.
 */
export function ActTitleCard({ act }: SectionProps) {
  return (
    <div className="cin-card">
      <p className="cin-eyebrow">{act.label}</p>
      <h2 className="cin-card-title">{act.title}</h2>
      {act.caption && <p className="cin-caption">{act.caption}</p>}
      <span className="cin-rule" />
    </div>
  );
}
