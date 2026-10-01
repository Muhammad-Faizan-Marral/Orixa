import type { TimelineItem } from "../../schema";
import { formatDuration } from "../../data/derive";

/** Experience aur Education dono ke liye: glowing vertical timeline. */
export function Timeline({ items, accent }: { items: TimelineItem[]; accent: string }) {
  return (
    <ol className="relative mt-6 space-y-3 pl-6">
      <span
        aria-hidden
        className="absolute bottom-2 left-[7px] top-2 w-px"
        style={{ background: `linear-gradient(${accent}, rgba(255,255,255,.08))` }}
      />
      {items.map((it) => {
        const dur = it.durationMonths ? formatDuration(it.durationMonths) : undefined;
        return (
          <li key={it.id} className="cin-card relative" style={{ ["--glow" as string]: `${accent}99` }}>
            <span
              aria-hidden
              className="absolute -left-[22px] top-5 h-[11px] w-[11px] rounded-full"
              style={{
                background: it.current ? accent : "#0b1030",
                border: `2px solid ${accent}`,
                boxShadow: it.current ? `0 0 0 4px ${accent}33, 0 0 14px ${accent}` : undefined,
              }}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="cin-display text-base font-semibold text-white">{it.title}</h3>
              {it.current && (
                <span className="cin-chip" style={{ borderColor: accent, color: accent }}>Current</span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-medium" style={{ color: accent }}>
              {it.organization}
              {it.subtitle ? <span className="cin-muted font-normal"> · {it.subtitle}</span> : null}
            </p>
            {it.rangeLabel && (
              <p className="cin-num mt-1 uppercase">
                {it.rangeLabel}
                {dur ? ` · ${dur}` : ""}
              </p>
            )}
            {it.description && <p className="cin-body mt-2 line-clamp-3 text-sm">{it.description}</p>}
          </li>
        );
      })}
    </ol>
  );
}
