import type { SectionProps } from "../shared/types";

/** Name -> words (nowrap) -> chars, so letters can develop one by one like a film title. */
function AnimatedName({ name }: { name: string }) {
  let i = 0;
  const words = name.split(/\s+/).filter(Boolean);
  return (
    <h1 className="cin-name" aria-label={name}>
      {words.map((word, w) => (
        <span key={w} aria-hidden className="cin-word">
          {Array.from(word).map((ch) => (
            <span key={i} className="cin-char" style={{ ["--i" as string]: i++ }}>
              {ch}
            </span>
          ))}
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}

export function HeroDefault({ portfolio, act }: SectionProps) {
  const { person, stats } = portfolio;
  const meta = [person.location, stats.experienceYears >= 1 ? `${stats.experienceYears} yrs on the road` : null]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div className="cin-hero">
      <p className="cin-eyebrow">{act.label}</p>
      <AnimatedName name={person.name} />
      {person.headline && <p className="cin-headline">{person.headline}</p>}
      {meta && <p className="cin-meta">{meta}</p>}
      <div className="cin-hint" aria-hidden>
        <span className="cin-hint-line" />
        <span>Scroll</span>
      </div>
    </div>
  );
}
