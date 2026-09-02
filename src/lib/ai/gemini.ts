const OPENROUTER_MODEL = "meta-llama/llama-3.1-8b-instruct";
const OPENROUTER_FALLBACK_MODEL = "meta-llama/llama-3.2-3b-instruct";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const REQUEST_TIMEOUT_MS = 20_000;
const MAX_RETRIES = 2;

export type GeminiUsage = {
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
};

export type GeminiTextResult = {
  text: string;
} & GeminiUsage;

function getApiKey() {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Add it to .env to enable AI features.",
    );
  }
  return key;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callOpenRouter(
  body: Record<string, unknown>,
  apiKey: string,
): Promise<{ rawBody: string; status: number; ok: boolean }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://orixa.ai",
        "X-OpenRouter-Title": process.env.OPENROUTER_SITE_NAME ?? "Orixa AI",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const rawBody = await response.text();
    return { rawBody, status: response.status, ok: response.ok };
  } finally {
    clearTimeout(timeout);
  }
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

  const messages: { role: string; content: string }[] = [];

  if (params.system) {
    messages.push({ role: "system", content: params.system });
  }

  messages.push({ role: "user", content: params.prompt });

  const body: Record<string, unknown> = {
    // OpenRouter tries these in order — if the first is down/rate-limited, it auto-falls back
    models: [OPENROUTER_MODEL, OPENROUTER_MODEL],
    messages,
    temperature: params.temperature ?? 0.4,
    max_tokens: params.maxOutputTokens ?? 4096,
    ...(params.jsonMode !== false
      ? { response_format: { type: "json_object" } }
      : {}),
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { rawBody, status, ok } = await callOpenRouter(body, apiKey);

      if (!ok) {
        console.error("[openrouter] API error", status, rawBody.slice(0, 500));
        // Don't retry client errors (bad request, invalid model, auth, etc.)
        if (status >= 400 && status < 500) {
          throw new Error(
            `OpenRouter error (${status}): ${rawBody.slice(0, 300)}`,
          );
        }
        // 5xx → retryable
        throw new Error(`OpenRouter server error (${status})`);
      }

      let data: any;
      try {
        data = JSON.parse(rawBody);
      } catch {
        throw new Error("OpenRouter returned non-JSON response.");
      }

      const text = data?.choices?.[0]?.message?.content?.trim() ?? "";

      if (!text) {
        const finishReason = data?.choices?.[0]?.finish_reason;
        throw new Error(
          `OpenRouter returned empty text (finishReason: ${finishReason ?? "unknown"}).`,
        );
      }

      const usage = data?.usage ?? {};
      const latencyMs = Date.now() - startedAt;

      return {
        text,
        inputTokens: usage.prompt_tokens ?? 0,
        outputTokens: usage.completion_tokens ?? 0,
        latencyMs,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      const isClientError = lastError.message.includes("OpenRouter error (4");
      const isLastAttempt = attempt === MAX_RETRIES;

      if (isClientError || isLastAttempt) {
        break;
      }

      const backoffMs = 500 * Math.pow(2, attempt); // 500ms, 1s, 2s...
      console.warn(
        `[openrouter] attempt ${attempt + 1} failed (${lastError.message}), retrying in ${backoffMs}ms`,
      );
      await sleep(backoffMs);
    }
  }

  throw lastError ?? new Error("OpenRouter request failed unexpectedly.");
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
    console.error(
      "[openrouter] JSON parse failed. Raw:",
      cleaned.slice(0, 400),
    );
    throw new Error("AI response was not valid JSON. Please try again.");
  }
}
