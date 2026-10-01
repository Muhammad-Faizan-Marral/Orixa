import { getStation } from "../../data";
import { frameProps, resolveModel, type SectionProps } from "../shared/model";
import { StationFrame } from "../shared/StationFrame";
import { Chip, Heading, Kicker, Panel } from "../shared/ui";

/** Projects / ring gates. Variants: "default" (grid, center), "alt" (compact list, left). */
export function Projects(props: SectionProps) {
  const model = resolveModel(props);
  const s = getStation(model, "projects");
  if (!s) return null;
  const { items, total } = s.data;
  const alt = props.variant === "alt";

  return (
    <StationFrame
      id="projects"
      label="Projects"
      {...frameProps(s, model)}
      align={alt ? "left" : "center"}
      valign="top"
    >
      <Panel wide={!alt} short>
        <Kicker n={s.index + 1} total={model.journey.stationCount}>Ring gates</Kicker>
        <Heading>Projects</Heading>
        <ul className={`mt-4 grid gap-3 ${alt ? "" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
          {items.map((p) => {
            const title = (
              <>
                <span className="cin-num mr-2">{String(p.index + 1).padStart(2, "0")}</span>
                {p.title}
                {p.url && <span aria-hidden className="ml-1 opacity-60">↗</span>}
              </>
            );
            return (
              <li key={p.id} className="cin-card" style={{ ["--glow" as string]: `${p.accent}99` }}>
                <span
                  aria-hidden
                  className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full"
                  style={{ background: p.accent, boxShadow: `0 0 12px ${p.accent}` }}
                />
                <h3 className="cin-display pl-2 text-base font-semibold text-white">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {title}
                    </a>
                  ) : (
                    title
                  )}
                </h3>
                {p.description && <p className="cin-body mt-1.5 line-clamp-3 pl-2 text-sm">{p.description}</p>}
                {p.technologies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 pl-2">
                    {p.technologies.slice(0, alt ? 4 : 6).map((t) => (
                      <Chip key={t} color={`${p.accent}66`}>{t}</Chip>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {total > items.length && <p className="cin-num mt-5">+{total - items.length} more projects</p>}
      </Panel>
    </StationFrame>
  );
}
