import { generateGeminiText, parseGeminiJson } from "@/lib/ai/gemini";

export type ParsedResumeData = {
  name: string;
  headline: string;
  about: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  skills: { name: string; level?: string }[];
  experience: {
    company: string;
    role: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }[];
  projects: {
    title: string;
    description?: string;
    url?: string;
    technologies?: string[];
  }[];
  education: {
    institution: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  certificates: {
    name: string;
    issuer?: string;
    issueDate?: string;
    credentialUrl?: string;
  }[];
};

const SYSTEM = `You are a strict resume data extractor for a portfolio builder.
Rules:
- Output ONLY JSON. No markdown. No questions. No advice.
- Rewrite text into clean professional English.
- If a field is missing, use "" or [].
- NEVER invent jobs, skills, or projects that are not in the resume.
- NEVER reply with templates or "tell me your profession" style text.
- about: 2–4 sentence professional bio from resume only. If no bio, "".
- skills: real skill names only (min 2 chars).
- Dates: prefer MM/YYYY. Ongoing → current: true.
- If file is not a resume, set isValidResume: false.`;

const SCHEMA_HINT = `{
  "name": "string",
  "headline": "string",
  "about": "string",
  "phone": "string",
  "linkedinUrl": "string",
  "githubUrl": "string",
  "skills": [{ "name": "string", "level": "string" }],
  "experience": [{
    "company": "string",
    "role": "string",
    "location": "string",
    "startDate": "string",
    "endDate": "string",
    "current": false,
    "description": "string"
  }],
  "projects": [{
    "title": "string",
    "description": "string",
    "url": "string",
    "technologies": ["string"]
  }],
  "education": [{
    "institution": "string",
    "degree": "string",
    "field": "string",
    "startDate": "string",
    "endDate": "string",
    "description": "string"
  }],
  "certificates": [{
    "name": "string",
    "issuer": "string",
    "issueDate": "string",
    "credentialUrl": "string"
  }],
  "isValidResume": true,
  "errorMessage": ""
}`;

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const { extractText } = await import("unpdf");

    const { text } = await extractText(new Uint8Array(buffer), {
      mergePages: true,
    });

    const joined = Array.isArray(text) ? text.join("\n") : String(text ?? "");
    const cleaned = joined.trim();

    if (!cleaned || cleaned.length < 20) {
      throw new Error(
        "PDF me readable text nahi mila (scanned/image-only PDF ho sakti hai). Text-based PDF try karein.",
      );
    }

    return cleaned;
  } catch (err) {
    console.error("[extractTextFromPdf]", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "PDF read nahi ho saki. Dusri text-based PDF try karein.",
    );
  }
}

export async function parseResumeWithGemini(rawText: string): Promise<{
  data: ParsedResumeData | null;
  isValid: boolean;
  errorMessage: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
}> {
  if (!rawText || rawText.length < 40) {
    return {
      data: null,
      isValid: false,
      errorMessage:
        "Resume text empty / too short. Text-based PDF upload karein.",
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
    };
  }

  const clipped = rawText.slice(0, 14000);

  const prompt = `Extract portfolio fields from this resume. JSON only.

Schema:
${SCHEMA_HINT}

Resume text:
"""
${clipped}
"""`;

  try {
    const result = await generateGeminiText({
      system: SYSTEM,
      prompt,
      temperature: 0.2,
      maxOutputTokens: 4096,
      jsonMode: true,
    });

    type GeminiResumeResponse = ParsedResumeData & {
      isValidResume?: boolean;
      errorMessage?: string;
    };

    let parsed: GeminiResumeResponse;
    try {
      parsed = parseGeminiJson<GeminiResumeResponse>(result.text);
    } catch {
      return {
        data: null,
        isValid: false,
        errorMessage: "AI could not parse this resume. Try another PDF or fill manually.",
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        latencyMs: result.latencyMs,
      };
    }

    if (parsed.isValidResume === false) {
      return {
        data: null,
        isValid: false,
        errorMessage:
          parsed.errorMessage || "Resume valid nahi lag raha. Manual fill karein.",
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        latencyMs: result.latencyMs,
      };
    }

    // Guard: reject "assistant-style" about pollution
    const about = (parsed.about ?? "").trim();
    if (
      about.toLowerCase().includes("could you tell me") ||
      about.toLowerCase().includes("tell me what your") ||
      about.toLowerCase().includes("tailored template")
    ) {
      parsed.about = "";
    }

    return {
      data: {
        name: parsed.name ?? "",
        headline: parsed.headline ?? "",
        about: parsed.about ?? "",
        phone: parsed.phone ?? "",
        linkedinUrl: parsed.linkedinUrl ?? "",
        githubUrl: parsed.githubUrl ?? "",
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        experience: Array.isArray(parsed.experience) ? parsed.experience : [],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        certificates: Array.isArray(parsed.certificates)
          ? parsed.certificates
          : [],
      },
      isValid: true,
      errorMessage: "",
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      latencyMs: result.latencyMs,
    };
  } catch (err) {
    console.error("[parseResumeWithGemini]", err);
    return {
      data: null,
      isValid: false,
      errorMessage:
        err instanceof Error && err.message.includes("GEMINI_API_KEY")
          ? "GEMINI_API_KEY configure nahi hai."
          : err instanceof Error
            ? err.message
            : "Resume AI parse fail. Dobara try karein.",
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
    };
  }
}