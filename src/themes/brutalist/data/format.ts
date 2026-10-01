/** Chhote, pure helpers. Koi Math.random / locale-dependent cheez nahi (SSR hydration safe). */

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function clean(v: string | null | undefined): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

export function cleanList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => (typeof x === "string" ? x.trim() : "")).filter(Boolean);
}

export function initialsOf(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

/** "https://x.com", "x.com/abc" -> valid https url. Junk -> undefined. */
export function safeUrl(url: string | null | undefined): string | undefined {
  const t = clean(url);
  if (!t) return undefined;
  if (/^(https?:|mailto:|tel:)/i.test(t)) return t;
  if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(t)) return `https://${t}`;
  return undefined;
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export function splitRoleWords(headline: string | undefined): string[] {
  if (!headline) return [];
  return headline
    .split(/\s*[|·•/]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Deterministic hash -> 0..1. Scene me "random" positions ke liye. */
export function seedOf(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/* --------------------------------- Dates ---------------------------------- */

/** Accepts: "2022", "2022-03", "2022-03-15", "March 2022", "Mar 2022", ISO strings. */
export function parseDate(v: string | null | undefined): Date | null {
  const t = clean(v);
  if (!t) return null;
  const m = t.match(/^(\d{4})(?:-(\d{1,2}))?/);
  if (m) {
    const y = Number(m[1]);
    const mo = m[2] ? Math.min(Math.max(Number(m[2]), 1), 12) - 1 : 0;
    return new Date(Date.UTC(y, mo, 1));
  }
  const ts = Date.parse(t);
  return Number.isNaN(ts) ? null : new Date(ts);
}

export function formatMonthYear(d: Date): string {
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function monthsBetween(a: Date, b: Date): number {
  return Math.max(
    0,
    (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()),
  );
}

export function formatDuration(months: number): string | undefined {
  if (months <= 0) return undefined;
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
  if (m) parts.push(`${m} mo`);
  return parts.join(" ");
}