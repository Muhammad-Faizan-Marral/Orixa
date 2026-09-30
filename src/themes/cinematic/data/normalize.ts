import type { ThemeSectionProps } from "@/themes/types";
import type {
  BuildModelOptions,
  CinematicModel,
  CinematicStation,
  ProgressRange,
  StationId,
} from "../schema";
import {
  SCROLL_PAGES_PER_WEIGHT,
  STATION_META,
  STATION_ORDER,
} from "./stations.config";
import {
  buildAbout,
  buildCertificates,
  buildContact,
  buildEducation,
  buildExperience,
  buildHero,
  buildLinks,
  buildProjects,
  buildSkills,
  buildStats,
  resolveName,
} from "./derive";
import { clean, cleanList } from "./format";

type Draft = { id: StationId; data: unknown; count: number };

/** Journey ko weights ke hisaab se 0..1 ranges me taqseem karo. */
function layoutJourney(drafts: Draft[]): {
  ranges: Record<string, ProgressRange>;
  totalWeight: number;
} {
  const weights = drafts.map((d) => {
    const m = STATION_META[d.id];
    return m.baseWeight + m.perItemWeight * d.count;
  });
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
  const ranges: Record<string, ProgressRange> = {};
  let cursor = 0;
  drafts.forEach((d, i) => {
    const start = cursor / totalWeight;
    cursor += weights[i];
    const end = cursor / totalWeight;
    ranges[d.id] = { start, end, center: (start + end) / 2 };
  });
  return { ranges, totalWeight };
}

/**
 * Entry point: raw renderer config + profile -> CinematicModel.
 * Pure function (Math.random nahi), server aur client dono par same output.
 */
export function buildCinematicModel(
  { config, profile }: ThemeSectionProps,
  opts: BuildModelOptions = {},
): CinematicModel {
  const now = opts.now ?? new Date();
  const order = opts.timelineOrder ?? "asc";
  const timeline = { now, order } as const;

  const links = buildLinks(config);
  const stats = buildStats(config, now);
  const name = resolveName(config, profile);

  const isEnabled = (id: StationId) =>
    config.componentSelection?.[STATION_META[id].selectionKey]?.enabled !==
    false;

  const hero = buildHero(config, profile, links);

  // id -> [data, itemCount]; null = data nahi, station skip
  const candidates: Array<[StationId, unknown, number]> = [
    ["hero", hero, 1],
    ["about", buildAbout(config, stats), 1],
    ["skills", buildSkills(config), 0],
    ["projects", buildProjects(config), 0],
    ["experience", buildExperience(config, timeline), 0],
    ["education", buildEducation(config, timeline), 0],
    ["certificates", buildCertificates(config), 0],
    ["contact", buildContact(config, links), 0],
  ];

  const drafts: Draft[] = STATION_ORDER.flatMap((id) => {
    const found = candidates.find(([cid]) => cid === id);
    if (!found) return [];
    const [, data, base] = found;
    if (!data) return [];
    if (id !== "hero" && !isEnabled(id)) return []; // hero hamesha rahega
    const items = data as {
      items?: unknown[];
      nodes?: unknown[];
      links?: unknown[];
    };
    const count =
      id === "contact" ? 0 : ((items.items ?? items.nodes)?.length ?? base);
    return [{ id, data, count }];
  });

  const { ranges, totalWeight } = layoutJourney(drafts);

  const stations = drafts.map((d, index) => {
    const meta = STATION_META[d.id];
    return {
      id: d.id,
      index,
      label: meta.label,
      landmark: meta.landmark,
      mood: meta.mood,
      range: ranges[d.id],
      data: d.data,
    } as CinematicStation;
  });

  const animationsOff = config.animations === false;
  const reducedMotion = opts.reducedMotion ?? animationsOff;

  return {
    identity: {
      name,
      firstName: hero.firstName,
      initials: hero.initials,
      username: profile.username,
      avatarUrl: hero.avatarUrl,
      headline: hero.headline,
      location: hero.location,
    },
    stations,
    hud: stations.map((s) => ({
      id: s.id,
      label: s.label,
      center: s.range.center,
    })),
    footer: { name, showWatermark: !profile.isPremium },
    stats,
    links,
    journey: {
      stationCount: stations.length,
      scrollPages: Math.max(
        4,
        Math.round(totalWeight * SCROLL_PAGES_PER_WEIGHT * 10) / 10,
      ),
    },
    world: {
      quality: "high", // client par device ke hisaab se downgrade hoga
      reducedMotion,
      controls: ["mouse", "touch", "scroll"],
      planeSpeed: 1,
    },
    seo: {
      title:
        clean(config.seo?.title) ??
        `${name}${hero.headline ? ` — ${hero.headline}` : ""}`,
      description:
        clean(config.seo?.description) ??
        clean(config.about)?.slice(0, 160) ??
        `${name}'s portfolio`,
      keywords: cleanList(config.seo?.keywords),
      noIndex: Boolean(config.seo?.noIndex),
    },
    isPremium: Boolean(profile.isPremium),
  };
}

/** Type-safe station getter: getStation(model, "projects")?.data.items */
export function getStation<Id extends StationId>(
  model: CinematicModel,
  id: Id,
): Extract<CinematicStation, { id: Id }> | undefined {
  return model.stations.find((s) => s.id === id) as
    | Extract<CinematicStation, { id: Id }>
    | undefined;
}
