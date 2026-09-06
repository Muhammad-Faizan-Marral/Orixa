import {
  SECTION_VARIANTS,
  DEFAULT_COMPONENT_SELECTION,
  DEFAULT_DESIGN_PREFERENCES,
  variantsPromptBlock,
  type ComponentSelection,
} from "@/features/portfolio/component-variants";
import { generateGeminiText, parseGeminiJson } from "@/lib/ai/gemini";

const dnas = [
  "editorial",
  "soft-luxury",
  "tech-dense",
  "minimal-airy",
  "neo-glass",
  "brutalist",
  "cinematic",
] as const;

export type DesignDecision = {
  componentSelection: ComponentSelection;
  designPreferences: typeof DEFAULT_DESIGN_PREFERENCES;
};

const FALLBACK: DesignDecision = {
  componentSelection: DEFAULT_COMPONENT_SELECTION,
  designPreferences: DEFAULT_DESIGN_PREFERENCES,
};

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function randomDesignDecision(): DesignDecision {
  const componentSelection = {
    navbar: { enabled: true, variant: randomFrom(SECTION_VARIANTS.navbar) },
    hero: { enabled: true, variant: randomFrom(SECTION_VARIANTS.hero) },
    about: { enabled: true, variant: randomFrom(SECTION_VARIANTS.about) },
    skills: { enabled: true, variant: randomFrom(SECTION_VARIANTS.skills) },
    projects: { enabled: true, variant: randomFrom(SECTION_VARIANTS.projects) },
    experience: {
      enabled: true,
      variant: randomFrom(SECTION_VARIANTS.experience),
    },
    education: {
      enabled: true,
      variant: randomFrom(SECTION_VARIANTS.education),
    },
    certificates: {
      enabled: true,
      variant: randomFrom(SECTION_VARIANTS.certificates),
    },
    contact: { enabled: true, variant: randomFrom(SECTION_VARIANTS.contact) },
    footer: { enabled: true, variant: randomFrom(SECTION_VARIANTS.footer) },
  } satisfies ComponentSelection;

  const accents = ["#6c5cff", "#22d3ee", "#34d399", "#fbbf24", "#fb7185"];
  const fonts = ["Inter", "Geist", "Poppins", "Roboto"];

  return {
    componentSelection,
    designPreferences: {
      themeMode: Math.random() > 0.5 ? "dark" : "light",
      layout: randomFrom(["standard", "wide", "centered"] as const),
      accentColor: randomFrom(accents),
      fontFamily: randomFrom(fonts),
      borderRadius: randomFrom(["none", "small", "medium", "large"] as const),
      cardStyle: randomFrom(["flat", "bordered", "elevated"] as const),
      designDna: randomFrom(dnas),
      density: randomFrom(["compact", "comfortable", "spacious"] as const),
      sectionSpacing: randomFrom(["tight", "normal", "loose"] as const),
    },
  };
}

function sanitizeDecision(raw: Partial<DesignDecision>): DesignDecision {
  const cs = { ...DEFAULT_COMPONENT_SELECTION };

  if (raw.componentSelection) {
    (
      Object.keys(SECTION_VARIANTS) as (keyof typeof SECTION_VARIANTS)[]
    ).forEach((key) => {
      const sel = (raw.componentSelection as any)?.[key];
      const allowed = SECTION_VARIANTS[key] as readonly string[];
      if (
        sel &&
        typeof sel.variant === "string" &&
        allowed.includes(sel.variant)
      ) {
        cs[key] = {
          enabled: sel.enabled !== false,
          variant: sel.variant,
        };
      }
    });
  }

  const dp = {
    ...DEFAULT_DESIGN_PREFERENCES,
    ...(raw.designPreferences ?? {}),
  };

  // Validate standard preferences
  if (dp.themeMode !== "light" && dp.themeMode !== "dark") {
    dp.themeMode = DEFAULT_DESIGN_PREFERENCES.themeMode ?? "dark";
  }
  if (!["standard", "wide", "centered"].includes(dp.layout)) {
    dp.layout = DEFAULT_DESIGN_PREFERENCES.layout ?? "standard";
  }
  if (!["none", "small", "medium", "large"].includes(dp.borderRadius)) {
    dp.borderRadius = DEFAULT_DESIGN_PREFERENCES.borderRadius ?? "medium";
  }
  if (!["flat", "bordered", "elevated"].includes(dp.cardStyle)) {
    dp.cardStyle = DEFAULT_DESIGN_PREFERENCES.cardStyle ?? "bordered";
  }

  // Validate Extended preferences (designDna, density, sectionSpacing, etc.)
  if (!dnas.includes(dp.designDna as (typeof dnas)[number])) {
    dp.designDna = DEFAULT_DESIGN_PREFERENCES.designDna ?? "soft-luxury";
  }
  if (!["compact", "comfortable", "spacious"].includes(dp.density)) {
    dp.density = DEFAULT_DESIGN_PREFERENCES.density ?? "comfortable";
  }
  if (!["tight", "normal", "loose"].includes(dp.sectionSpacing)) {
    dp.sectionSpacing = DEFAULT_DESIGN_PREFERENCES.sectionSpacing ?? "normal";
  }

  // Fallbacks for string-based fields
  if (typeof dp.accentColor !== "string" || !dp.accentColor) {
    dp.accentColor = DEFAULT_DESIGN_PREFERENCES.accentColor ?? "#6c5cff";
  }
  if (typeof dp.fontFamily !== "string" || !dp.fontFamily) {
    dp.fontFamily = DEFAULT_DESIGN_PREFERENCES.fontFamily ?? "Inter";
  }

  return { componentSelection: cs, designPreferences: dp };
}

export async function decideDesignWithGemini(params: {
  prompt: string;
  headline?: string;
  about?: string;
}): Promise<{
  decision: DesignDecision;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  usedAi: boolean;
  errorMessage?: string;
}> {
  const userPrompt = (params.prompt ?? "").trim();

  // Prompt blank → random ONLY (intentional, no API cost)
  if (!userPrompt) {
    return {
      decision: randomDesignDecision(),
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      usedAi: false,
      errorMessage: "No design prompt !",
    };
  }

  const system = `You are Orixa design engine. Pick portfolio section variants and design tokens.
Rules:
- Return ONLY valid JSON matching the schema.
- Every variant MUST be from the allowed lists exactly.
- Match the user's design prompt (dark/light, modern, minimal, accent color hints, layout).
- Never invent variant names.
- Always include navbar, hero, about, skills, projects, experience, education, certificates, contact, footer.`;

  const prompt = `User design prompt:
"""${userPrompt.slice(0, 800)}"""

Headline: ${(params.headline ?? "").slice(0, 120)}
About snippet: ${(params.about ?? "").slice(0, 200)}

Allowed variants:
${variantsPromptBlock()}

Return JSON exactly in this shape:
{
  "componentSelection": {
    "navbar": { "enabled": true, "variant": "floating" },
    "hero": { "enabled": true, "variant": "modern" },
    "about": { "enabled": true, "variant": "default" },
    "skills": { "enabled": true, "variant": "grid" },
    "projects": { "enabled": true, "variant": "featured" },
    "experience": { "enabled": true, "variant": "timeline" },
    "education": { "enabled": true, "variant": "simple" },
    "certificates": { "enabled": true, "variant": "simple" },
    "contact": { "enabled": true, "variant": "split" },
    "footer": { "enabled": true, "variant": "detailed" }
  },
  "designPreferences": {
    "themeMode": "dark",
    "layout": "standard",
    "accentColor": "#6c5cff",
    "fontFamily": "Inter",
    "borderRadius": "medium",
    "cardStyle": "bordered",
    "designDna": "soft-luxury",
    "density": "comfortable",
    "sectionSpacing": "normal"
  }
}`;

  try {
    const result = await generateGeminiText({
      system,
      prompt,
      temperature: 0.4,
      maxOutputTokens: 1200,
      jsonMode: true,
    });

    const parsed = parseGeminiJson<Partial<DesignDecision>>(result.text);
    const decision = sanitizeDecision(parsed);

    return {
      decision,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      latencyMs: result.latencyMs,
      usedAi: true,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Design AI failed unexpectedly.";
    console.error("[decideDesignWithGemini]", message);

    // Still save portfolio, but report that AI failed
    return {
      decision: randomDesignDecision(),
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      usedAi: false,
      errorMessage: message,
    };
  }
}
