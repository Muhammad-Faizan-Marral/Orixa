/**
 * Orixa Design DNA System
 * LLM only proposes a small *intent*.
 * Theme recipes + section packs are deterministic (coherent at scale).
 */

import {
  SECTION_VARIANTS,
  DEFAULT_COMPONENT_SELECTION,
  DEFAULT_DESIGN_PREFERENCES,
  type ComponentSelection,
} from "@/features/portfolio/component-variants";

export const DESIGN_DNAS = [
  "editorial",
  "soft-luxury",
  "tech-dense",
  "minimal-airy",
  "neo-glass",
  "brutalist",
  "cinematic",
] as const;

export type DesignDna = (typeof DESIGN_DNAS)[number];

export type DesignPreferences = typeof DEFAULT_DESIGN_PREFERENCES;

export type DesignIntent = {
  designDna: DesignDna;
  themeMode: "light" | "dark";
  energy: "calm" | "balanced" | "bold";
  contentBias:
    | "projects-first"
    | "experience-first"
    | "balanced"
    | "about-first";
  accentFamily: "cool" | "warm" | "neutral" | "vivid";
};

export type ContentSignals = {
  projectCount: number;
  skillCount: number;
  experienceCount: number;
  educationCount: number;
  certificateCount: number;
  hasAbout: boolean;
  headline?: string;
};

type ThemeRecipe = Omit<DesignPreferences, "designDna" | "themeMode"> & {
  accents: {
    cool: string[];
    warm: string[];
    neutral: string[];
    vivid: string[];
  };
  fonts: string[];
};

const THEME_RECIPES: Record<DesignDna, ThemeRecipe> = {
  cinematic: {
    layout: "wide",
    density: "spacious",
    cardStyle: "elevated",
    fontFamily: "Inter",
    borderRadius: "medium",
    sectionSpacing: "loose",
    accentColor: "#22d3ee",
    fonts: ["Inter", "Geist"],
    accents: {
      cool: ["#22d3ee", "#38bdf8", "#818cf8"],
      warm: ["#fb7185", "#f472b6"],
      neutral: ["#a1a1aa", "#e4e4e7"],
      vivid: ["#22d3ee", "#a78bfa", "#34d399"],
    },
  },
  editorial: {
    layout: "standard",
    density: "comfortable",
    cardStyle: "flat",
    fontFamily: "Geist",
    borderRadius: "small",
    sectionSpacing: "normal",
    accentColor: "#6c5cff",
    fonts: ["Geist", "Inter"],
    accents: {
      cool: ["#6c5cff", "#6366f1"],
      warm: ["#d97706", "#e11d48"],
      neutral: ["#3f3f46", "#71717a"],
      vivid: ["#7c3aed", "#db2777"],
    },
  },
  "soft-luxury": {
    layout: "centered",
    density: "comfortable",
    cardStyle: "elevated",
    fontFamily: "Poppins",
    borderRadius: "large",
    sectionSpacing: "normal",
    accentColor: "#c4b5fd",
    fonts: ["Poppins", "Inter"],
    accents: {
      cool: ["#c4b5fd", "#a78bfa", "#67e8f9"],
      warm: ["#f9a8d4", "#fdba74"],
      neutral: ["#d4d4d8", "#a8a29e"],
      vivid: ["#e879f9", "#f472b6"],
    },
  },
  "tech-dense": {
    layout: "wide",
    density: "compact",
    cardStyle: "bordered",
    fontFamily: "Geist",
    borderRadius: "small",
    sectionSpacing: "tight",
    accentColor: "#34d399",
    fonts: ["Geist", "Roboto", "Inter"],
    accents: {
      cool: ["#34d399", "#22d3ee", "#60a5fa"],
      warm: ["#fbbf24", "#fb923c"],
      neutral: ["#94a3b8", "#64748b"],
      vivid: ["#22c55e", "#06b6d4"],
    },
  },
  "minimal-airy": {
    layout: "centered",
    density: "spacious",
    cardStyle: "flat",
    fontFamily: "Inter",
    borderRadius: "medium",
    sectionSpacing: "loose",
    accentColor: "#6c5cff",
    fonts: ["Inter", "Geist"],
    accents: {
      cool: ["#6c5cff", "#93c5fd"],
      warm: ["#fda4af", "#fcd34d"],
      neutral: ["#78716c", "#a1a1aa"],
      vivid: ["#818cf8", "#2dd4bf"],
    },
  },
  "neo-glass": {
    layout: "standard",
    density: "comfortable",
    cardStyle: "elevated",
    fontFamily: "Poppins",
    borderRadius: "large",
    sectionSpacing: "normal",
    accentColor: "#22d3ee",
    fonts: ["Poppins", "Inter"],
    accents: {
      cool: ["#22d3ee", "#67e8f9", "#a5b4fc"],
      warm: ["#fb7185", "#f0abfc"],
      neutral: ["#cbd5e1", "#94a3b8"],
      vivid: ["#2dd4bf", "#c084fc"],
    },
  },
  brutalist: {
    layout: "standard",
    density: "compact",
    cardStyle: "flat",
    fontFamily: "Roboto",
    borderRadius: "none",
    sectionSpacing: "tight",
    accentColor: "#fbbf24",
    fonts: ["Roboto", "Inter"],
    accents: {
      cool: ["#3b82f6", "#0ea5e9"],
      warm: ["#fbbf24", "#ef4444"],
      neutral: ["#000000", "#525252"],
      vivid: ["#facc15", "#f97316"],
    },
  },
};

type PackVariants = {
  [K in keyof typeof SECTION_VARIANTS]: (typeof SECTION_VARIANTS)[K][number];
};

const DNA_PACKS: Record<DesignDna, [PackVariants, PackVariants]> = {
  cinematic: [
    {
      navbar: "glass",
      hero: "cinematic",
      about: "story",
      skills: "cards",
      projects: "cinema",
      experience: "rail",
      education: "editorial",
      certificates: "showcase",
      contact: "magnetic",
      footer: "editorial",
    },
    {
      navbar: "floating",
      hero: "cinematic",
      about: "portrait",
      skills: "progress",
      projects: "showcase",
      experience: "editorial",
      education: "rail",
      certificates: "wall",
      contact: "glass",
      footer: "detailed",
    },
  ],
  editorial: [
    {
      navbar: "minimal",
      hero: "editorial",
      about: "editorial",
      skills: "list",
      projects: "featured",
      experience: "editorial",
      education: "editorial",
      certificates: "wall",
      contact: "split",
      footer: "editorial",
    },
    {
      navbar: "minimal",
      hero: "editorial",
      about: "story",
      skills: "tags",
      projects: "list",
      experience: "timeline",
      education: "detailed",
      certificates: "simple",
      contact: "split-motion",
      footer: "detailed",
    },
  ],
  "soft-luxury": [
    {
      navbar: "floating",
      hero: "centered",
      about: "portrait",
      skills: "progress",
      projects: "cards",
      experience: "cards",
      education: "cards",
      certificates: "badges",
      contact: "glass",
      footer: "detailed",
    },
    {
      navbar: "glass",
      hero: "modern",
      about: "cards",
      skills: "cards",
      projects: "showcase",
      experience: "stack",
      education: "editorial",
      certificates: "showcase",
      contact: "magnetic",
      footer: "mega",
    },
  ],
  "tech-dense": [
    {
      navbar: "minimal",
      hero: "split",
      about: "split",
      skills: "grid",
      projects: "bento",
      experience: "compact",
      education: "detailed",
      certificates: "grid",
      contact: "form",
      footer: "mega",
    },
    {
      navbar: "minimal",
      hero: "modern",
      about: "cards",
      skills: "bars",
      projects: "masonry",
      experience: "timeline",
      education: "timeline",
      certificates: "minimal-grid",
      contact: "split",
      footer: "detailed",
    },
  ],
  "minimal-airy": [
    {
      navbar: "minimal",
      hero: "minimal",
      about: "default",
      skills: "tags",
      projects: "list",
      experience: "compact",
      education: "simple",
      certificates: "minimal-grid",
      contact: "simple",
      footer: "minimal",
    },
    {
      navbar: "minimal",
      hero: "centered",
      about: "default",
      skills: "grid",
      projects: "cards",
      experience: "timeline",
      education: "simple",
      certificates: "simple",
      contact: "form",
      footer: "minimal",
    },
  ],
  "neo-glass": [
    {
      navbar: "glass",
      hero: "creative",
      about: "split",
      skills: "cloud",
      projects: "showcase",
      experience: "stack",
      education: "rail",
      certificates: "showcase",
      contact: "glass",
      footer: "detailed",
    },
    {
      navbar: "floating",
      hero: "modern",
      about: "cards",
      skills: "cards",
      projects: "bento",
      experience: "cards",
      education: "cards",
      certificates: "badges",
      contact: "magnetic",
      footer: "mega",
    },
  ],
  brutalist: [
    {
      navbar: "minimal",
      hero: "brutalist",
      about: "cards",
      skills: "list",
      projects: "list",
      experience: "stack",
      education: "simple",
      certificates: "simple",
      contact: "simple",
      footer: "minimal",
    },
    {
      navbar: "minimal",
      hero: "brutalist",
      about: "default",
      skills: "grid",
      projects: "cards",
      experience: "compact",
      education: "timeline",
      certificates: "grid",
      contact: "form",
      footer: "detailed",
    },
  ],
};

function pickAccent( recipe: ThemeRecipe, family: DesignIntent["accentFamily"], salt: number): string {
  const list = recipe.accents[family] ?? recipe.accents.cool;
  return list[Math.abs(salt) % list.length] ?? recipe.accentColor;
}

function pickFont(recipe: ThemeRecipe, salt: number): string {
  return (
    recipe.fonts[Math.abs(salt) % recipe.fonts.length] ?? recipe.fontFamily
  );
}

function packToSelection(pack: PackVariants,enabled: Partial<Record<keyof PackVariants, boolean>>): ComponentSelection {
  const keys = Object.keys(SECTION_VARIANTS) as (keyof typeof SECTION_VARIANTS)[];
  const out = { ...DEFAULT_COMPONENT_SELECTION };

  for (const key of keys) {
    const variant = pack[key];
    const allowed = SECTION_VARIANTS[key] as readonly string[];
    out[key] = {
      enabled: enabled[key] !== false,
      variant: allowed.includes(variant) ? variant : allowed[0]!,
    };
  }
  return out;
}

export function stableIndex(seed: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % Math.max(1, modulo);
}

export function inferIntentFromContent(signals: ContentSignals): DesignIntent {
  const {
    projectCount,
    skillCount,
    experienceCount,
    certificateCount,
    hasAbout,
    headline = "",
  } = signals;

  const hl = headline.toLowerCase();

  let designDna: DesignDna = "minimal-airy";
  let contentBias: DesignIntent["contentBias"] = "balanced";
  let energy: DesignIntent["energy"] = "balanced";
  let themeMode: "light" | "dark" = "dark";
  let accentFamily: DesignIntent["accentFamily"] = "cool";

  if (/design|ui|ux|creative|brand|visual|art/i.test(hl) ||(projectCount >= 4 && skillCount <= 8)) {
    designDna = "editorial";
    contentBias = "projects-first";
    energy = "calm";
    themeMode = "light";
    accentFamily = "neutral";
  } else if (/ml|ai|data|backend|devops|engineer|full.?stack|software/i.test(hl)) {
    designDna = "tech-dense";
    contentBias = projectCount >= 3 ? "projects-first" : "experience-first";
    energy = "bold";
    themeMode = "dark";
    accentFamily = "cool";
  } else if (/film|photo|motion|cinemat|director|media/i.test(hl)) {
    designDna = "cinematic";
    contentBias = "projects-first";
    energy = "bold";
    themeMode = "dark";
    accentFamily = "vivid";
  } else if (projectCount >= 6) {
    designDna = "tech-dense";
    contentBias = "projects-first";
    energy = "balanced";
  } else if (experienceCount >= 4 && projectCount <= 2) {
    designDna = "soft-luxury";
    contentBias = "experience-first";
    energy = "calm";
    themeMode = "light";
    accentFamily = "warm";
  } else if (hasAbout && projectCount <= 1 && experienceCount <= 1) {
    designDna = "minimal-airy";
    contentBias = "about-first";
    energy = "calm";
  } else if (certificateCount >= 3 && projectCount <= 2) {
    designDna = "soft-luxury";
    contentBias = "balanced";
  }

  if (skillCount >= 12 && designDna === "minimal-airy") {
    designDna = "tech-dense";
  }

  return {
    designDna,
    themeMode,
    energy,
    contentBias,
    accentFamily,
  };
}

export function buildThemeFromIntent(intent: DesignIntent,seed: string): DesignPreferences {
  const recipe = THEME_RECIPES[intent.designDna] ?? THEME_RECIPES["minimal-airy"];
  const salt = stableIndex(seed + intent.designDna, 1000);

  let density = recipe.density;
  let sectionSpacing = recipe.sectionSpacing;
  let layout = recipe.layout;

  if (intent.energy === "bold") {
    if (density === "spacious") density = "comfortable";
    if (sectionSpacing === "loose") sectionSpacing = "normal";
  }
  if (intent.energy === "calm") {
    if (density === "compact") density = "comfortable";
    if (sectionSpacing === "tight") sectionSpacing = "normal";
  }

  if (intent.contentBias === "projects-first" && layout === "centered") {
    layout = "wide";
  }

  return {
    designDna: intent.designDna,
    themeMode: intent.themeMode,
    layout,
    density,
    cardStyle: recipe.cardStyle,
    borderRadius: recipe.borderRadius,
    sectionSpacing,
    fontFamily: pickFont(recipe, salt),
    accentColor: pickAccent(recipe, intent.accentFamily, salt),
  };
}

export function buildComponentsFromIntent(
  intent: DesignIntent,
  signals: ContentSignals,
  seed: string,
): ComponentSelection {
  const packs = DNA_PACKS[intent.designDna] ?? DNA_PACKS["minimal-airy"];
  let packIndex = stableIndex(seed + intent.designDna, packs.length);

  if (intent.energy === "bold" && packs.length > 1) packIndex = 1;
  if (intent.energy === "calm") packIndex = 0;

  const pack = packs[packIndex]!;

  const enabled: Partial<Record<keyof PackVariants, boolean>> = {
    navbar: true,
    hero: true,
    about: true,
    skills: signals.skillCount > 0,
    projects: signals.projectCount > 0,
    experience: signals.experienceCount > 0,
    education: signals.educationCount > 0,
    certificates: signals.certificateCount > 0,
    contact: true,
    footer: true,
  };

  if (signals.hasAbout) enabled.about = true;
  if (intent.contentBias === "projects-first" && signals.projectCount > 0) {
    enabled.projects = true;
  }
  if (
    intent.contentBias === "experience-first" &&
    signals.experienceCount > 0
  ) {
    enabled.experience = true;
  }

  const selection = packToSelection(pack, enabled);

  if (
    signals.skillCount >= 14 &&
    (intent.designDna === "tech-dense" || intent.designDna === "minimal-airy")
  ) {
    selection.skills = { enabled: true, variant: "tags" };
  }
  if (signals.projectCount >= 8 && intent.designDna === "tech-dense") {
    selection.projects = {
      enabled: true,
      variant: packIndex === 0 ? "bento" : "masonry",
    };
  }

  return selection;
}

export function resolveDesignFromIntent(intent: DesignIntent,signals: ContentSignals,seed: string): {
  componentSelection: ComponentSelection;
  designPreferences: DesignPreferences;
} {
  const safeIntent: DesignIntent = DESIGN_DNAS.includes(intent.designDna)? intent : { ...intent, designDna: "minimal-airy" };

  return {
    designPreferences: buildThemeFromIntent(safeIntent, seed),
    componentSelection: buildComponentsFromIntent(safeIntent, signals, seed),
  };
}

export function defaultSignals(): ContentSignals {
  return {
    projectCount: 0,
    skillCount: 0,
    experienceCount: 0,
    educationCount: 0,
    certificateCount: 0,
    hasAbout: false,
  };
}
