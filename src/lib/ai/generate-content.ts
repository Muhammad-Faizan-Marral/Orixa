// Server-only module: only import this from server actions/services.
// (Not using the `server-only` package since it isn't in this project's dependencies.)

const AI_MODEL = "claude-sonnet-4-6";

export type AiAssistField =
  | "headline"
  | "about"
  | "project_description"
  | "experience_description";

const FIELD_INSTRUCTIONS: Record<AiAssistField, string> = {
  headline:
    "Write a short, confident professional headline (max 12 words). No quotes, no emojis, no trailing period.",
  about:
    "Rewrite this into a warm, confident 3-5 sentence 'About' section for a portfolio site, first person.",
  project_description:
    "Rewrite this project description into 2-3 punchy sentences a recruiter would find impressive. First person or neutral, no marketing fluff.",
  experience_description:
    "Rewrite these job responsibilities into 2-4 concise, achievement-oriented bullet-style sentences.",
};

export interface AiGenerateResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
}

/**
 * Calls the configured AI provider to assist with a single portfolio field.
 * Requires ANTHROPIC_API_KEY to be set in the server environment.
 */
export async function generateAssistedText(params: {
  field: AiAssistField;
  currentText: string;
  context?: string;
}): Promise<AiGenerateResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured on the server. AI features are disabled."
    );
  }

  const instruction = FIELD_INSTRUCTIONS[params.field];
  const contextLine = params.context ? `\nContext: ${params.context}` : "";

  const prompt =
    `${instruction}${contextLine}\n\n` +
    `Current text:\n"""${params.currentText || "(empty)"}"""\n\n` +
    "Return only the rewritten text, nothing else.";

  const startedAt = Date.now();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const latencyMs = Date.now() - startedAt;

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI provider error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  const text = (data.content ?? [])
    .filter((block: { type: string }) => block.type === "text")
    .map((block: { text: string }) => block.text)
    .join("\n")
    .trim();

  return {
    text,
    inputTokens: data.usage?.input_tokens ?? 0,
    outputTokens: data.usage?.output_tokens ?? 0,
    latencyMs,
  };
}
