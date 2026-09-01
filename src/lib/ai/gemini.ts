const GEMINI_MODEL = "gemini-3.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export type GeminiUsage = {
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
};

export type GeminiTextResult = {
  text: string;
} & GeminiUsage;

function getApiKey() {
  const key = process.env.GEMINI_API_KEY?.trim();
  console.log(key);
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to .env to enable AI features.",
    );
  }
  return key;
}

export async function generateGeminiText(params: {
  system?: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
  /** set false when free-form text is needed (not JSON) */
  jsonMode?: boolean;
}): Promise<GeminiTextResult> {
  const apiKey = getApiKey();
  const startedAt = Date.now();

  const body: Record<string, unknown> = {
    contents: [
      {
        role: "user",
        parts: [{ text: params.prompt }],
      },
    ],
    generationConfig: {
      temperature: params.temperature ?? 0.4,
      maxOutputTokens: params.maxOutputTokens ?? 4096,
      ...(params.jsonMode !== false
        ? { responseMimeType: "application/json" }
        : {}),
    },
  };

  if (params.system) {
    body.systemInstruction = {
      parts: [{ text: params.system }],
    };
  }

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const latencyMs = Date.now() - startedAt;
  const rawBody = await response.text();

  if (!response.ok) {
    console.error("[gemini] API error", response.status, rawBody.slice(0, 500));
    throw new Error(
      `Gemini error (${response.status}): ${rawBody.slice(0, 300)}`,
    );
  }

  let data: any;
  try {
    data = JSON.parse(rawBody);
  } catch {
    throw new Error("Gemini returned non-JSON response.");
  }

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("")
      ?.trim() ?? "";

  if (!text) {
    const block = data?.candidates?.[0]?.finishReason;
    throw new Error(
      `Gemini returned empty text (finishReason: ${block ?? "unknown"}).`,
    );
  }

  const usage = data?.usageMetadata ?? {};

  return {
    text,
    inputTokens: usage.promptTokenCount ?? 0,
    outputTokens: usage.candidatesTokenCount ?? 0,
    latencyMs,
  };
}

export function parseGeminiJson<T>(raw: string): T {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (e) {
    console.error("[gemini] JSON parse failed. Raw:", cleaned.slice(0, 400));
    throw new Error("AI response was not valid JSON. Please try again.");
  }
}
