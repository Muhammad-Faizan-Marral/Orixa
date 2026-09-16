import {
  DEFAULT_COMPONENT_SELECTION,
  DEFAULT_DESIGN_PREFERENCES,
  type ComponentSelection,
} from "@/features/portfolio/component-variants";
import { generateGeminiText, parseGeminiJson } from "@/lib/ai/gemini";
import {
  DESIGN_DNAS,
  type DesignDna,
  type DesignIntent,
  type ContentSignals,
  type DesignPreferences,
  defaultSignals,
  inferIntentFromContent,
  resolveDesignFromIntent,
} from "@/lib/ai/design-dna";

export type DesignDecision = {
  componentSelection: ComponentSelection;
  designPreferences: DesignPreferences;
};

function sanitizeIntent(
  raw: Partial<DesignIntent> | null | undefined,
): DesignIntent | null {
  if (!raw || typeof raw !== "object") return null;

  const dna = raw.designDna as string;
  if (!DESIGN_DNAS.includes(dna as DesignDna)) return null;

  const themeMode =
    raw.themeMode === "light" || raw.themeMode === "dark"
      ? raw.themeMode
      : "dark";

  const energy =
    raw.energy === "calm" || raw.energy === "balanced" || raw.energy === "bold"
      ? raw.energy
      : "balanced";

  const contentBias =
    raw.contentBias === "projects-first" ||
    raw.contentBias === "experience-first" ||
    raw.contentBias === "about-first" ||
    raw.contentBias === "balanced"
      ? raw.contentBias
      : "balanced";

  const accentFamily =
    raw.accentFamily === "cool" ||
    raw.accentFamily === "warm" ||
    raw.accentFamily === "neutral" ||
    raw.accentFamily === "vivid"
      ? raw.accentFamily
      : "cool";

  return {
    designDna: dna as DesignDna,
    themeMode,
    energy,
    contentBias,
    accentFamily,
  };
}

function makeSeed(params: {
  portfolioId?: string;
  prompt?: string;
  headline?: string;
}): string {
  return (
    [params.portfolioId, params.prompt, params.headline]
      .filter(Boolean)
      .join("|") || "orixa-default"
  );
}

/** Fallback: content inference + DNA packs (not random sections). */
export function randomDesignDecision(
  signals: ContentSignals = defaultSignals(),
  seed = `fallback-${Date.now()}`,
): DesignDecision {
  const intent = inferIntentFromContent(signals);
  return resolveDesignFromIntent(intent, signals, seed);
}

export async function decideDesignWithGemini(params: {
  prompt: string;
  headline?: string;
  about?: string;
  portfolioId?: string;
  projectCount?: number;
  skillCount?: number;
  experienceCount?: number;
  educationCount?: number;
  certificateCount?: number;
}): Promise<{
  decision: DesignDecision;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  usedAi: boolean;
  errorMessage?: string;
}> {
  const signals: ContentSignals = {
    projectCount: params.projectCount ?? 0,
    skillCount: params.skillCount ?? 0,
    experienceCount: params.experienceCount ?? 0,
    educationCount: params.educationCount ?? 0,
    certificateCount: params.certificateCount ?? 0,
    hasAbout: Boolean((params.about ?? "").trim()),
    headline: params.headline ?? "",
  };

  const seed = makeSeed({
    portfolioId: params.portfolioId,
    prompt: params.prompt,
    headline: params.headline,
  });

  const userPrompt = (params.prompt ?? "").trim();

  // No style direction → content-aware DNA (no LLM)
  if (!userPrompt) {
    const intent = inferIntentFromContent(signals);
    return {
      decision: resolveDesignFromIntent(intent, signals, seed),
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      usedAi: false,
    };
  }

const system = `You are the Orixa design intent engine.
Return ONLY a small JSON object. No markdown.
You do NOT pick section variants or hex colors — only high-level intent.
Rules:
- designDna MUST be one of: ${DESIGN_DNAS.join(", ")}
- themeMode: light | dark
- energy: calm | balanced | bold
- contentBias: projects-first | experience-first | balanced | about-first
- accentFamily: cool | warm | neutral | vivid
Match the user's style direction and the content hints.`;

  const prompt = `Style direction from user:
"""${userPrompt.slice(0, 600)}"""

Content hints:
- headline: ${(params.headline ?? "").slice(0, 120)}
- about snippet: ${(params.about ?? "").slice(0, 160)}
- projects: ${signals.projectCount}, skills: ${signals.skillCount}, experience: ${signals.experienceCount}
- education: ${signals.educationCount}, certificates: ${signals.certificateCount}

Return JSON:
{
  "designDna": "cinematic",
  "themeMode": "dark",
  "energy": "balanced",
  "contentBias": "projects-first",
  "accentFamily": "cool"
}`;

  try {
    const result = await generateGeminiText({
      system,
      prompt,
      temperature: 0.25,
      maxOutputTokens: 256,
      jsonMode: true,
    });
 
    const parsed = parseGeminiJson<Partial<DesignIntent>>(result.text);
    let intent = sanitizeIntent(parsed);

    if (!intent) {
      intent = inferIntentFromContent(signals);
    }

    const decision = resolveDesignFromIntent(intent, signals, seed);

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

    const intent = inferIntentFromContent(signals);
    return {
      decision: resolveDesignFromIntent(intent, signals, seed),
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      usedAi: false,
      errorMessage: message,
    };
  }
}
