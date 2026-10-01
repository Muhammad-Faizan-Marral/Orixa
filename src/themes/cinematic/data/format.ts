import type { DateSpan, YearMonth } from "../schema";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function pluralize(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

export function toRoman(n: number): string {
  const map: [number, string][] = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let out = "";
  let rest = n;
  for (const [v, s] of map) while (rest >= v) { out += s; rest -= v; }
  return out;
}

/* ---------- dates ---------- */

function mk(year: number, month?: number): YearMonth | undefined {
  if (!Number.isFinite(year) || year < 1950 || year > 2100) return undefined;
  if (month !== undefined && (month < 1 || month > 12)) return { year };
  return month === undefined ? { year } : { year, month };
}

/** Accepts: 2021 | 2021-03 | 2021-03-15 | ISO | 03/2021 | "Mar 2021" | "March 2021". "Present"/"Current" -> undefined */
export function parseYearMonth(raw?: string | null): YearMonth | undefined {
  const s = raw?.trim().toLowerCase();
  if (!s || /^(present|current|now|ongoing|today)$/.test(s)) return undefined;
  let m = s.match(/^(\d{4})(?:-(\d{1,2}))?/);
  if (m) return mk(+m[1], m[2] ? +m[2] : undefined);
  m = s.match(/^(\d{1,2})[/.-](\d{4})$/);
  if (m) return mk(+m[2], +m[1]);
  m = s.match(/^([a-z]{3,9})\.?,?\s+(\d{4})$/);
  if (m) {
    const i = MONTHS.findIndex((x) => x.toLowerCase() === m![1].slice(0, 3));
    if (i >= 0) return mk(+m[2], i + 1);
  }
  return undefined;
}

export function formatYearMonth(ym?: YearMonth): string {
  if (!ym) return "";
  return ym.month ? `${MONTHS[ym.month - 1]} ${ym.year}` : `${ym.year}`;
}

const idx = (ym: YearMonth) => ym.year * 12 + ((ym.month ?? 1) - 1);
const nowYm = (now: Date): YearMonth => ({ year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 });

/** Inclusive month count. */
export function monthsBetween(a: YearMonth, b: YearMonth) {
  return Math.max(0, idx(b) - idx(a) + 1);
}

export function formatDuration(months: number): string {
  if (months < 1) return "";
  const y = Math.floor(months / 12);
  const mo = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} ${y === 1 ? "yr" : "yrs"}`);
  if (mo) parts.push(`${mo} ${mo === 1 ? "mo" : "mos"}`);
  return parts.join(" ");
}

export function buildSpan(
  startRaw: string | undefined,
  endRaw: string | undefined,
  currentFlag: boolean | undefined,
  now: Date,
): DateSpan {
  const start = parseYearMonth(startRaw);
  const parsedEnd = parseYearMonth(endRaw);
  const current = !!currentFlag || (!!start && !parsedEnd && /^(present|current|now|ongoing)$/i.test(endRaw?.trim() ?? ""));
  const end = current ? undefined : parsedEnd;

  const from = formatYearMonth(start);
  const to = current ? "Present" : formatYearMonth(end);
  const label = from && to ? `${from} — ${to}` : from || to;

  const months = start ? monthsBetween(start, end ?? (current ? nowYm(now) : start)) : undefined;
  return {
    start,
    end,
    current,
    label,
    months,
    durationLabel: months && months >= 1 && (end || current) ? formatDuration(months) : undefined,
  };
}

/** Union of spans (overlaps counted once). */
export function totalMonths(spans: DateSpan[], now: Date): number {
  const ranges = spans
    .filter((s) => s.start)
    .map((s) => [idx(s.start!), idx(s.current ? nowYm(now) : (s.end ?? s.start!))] as const)
    .sort((a, b) => a[0] - b[0]);
  let total = 0;
  let cur: [number, number] | null = null;
  for (const [s, e] of ranges) {
    if (!cur) cur = [s, e];
    else if (s <= cur[1] + 1) cur[1] = Math.max(cur[1], e);
    else { total += cur[1] - cur[0] + 1; cur = [s, e]; }
  }
  if (cur) total += cur[1] - cur[0] + 1;
  return total;
}

/** Newest first: current roles, then by end, then by start. */
export function compareSpansDesc(a: DateSpan, b: DateSpan) {
  if (a.current !== b.current) return a.current ? -1 : 1;
  const ea = a.end ? idx(a.end) : 0;
  const eb = b.end ? idx(b.end) : 0;
  if (ea !== eb) return eb - ea;
  return (b.start ? idx(b.start) : 0) - (a.start ? idx(a.start) : 0);
}

/* ---------- skill level ---------- */

const LEVEL_WORDS: Record<string, number> = {
  novice: 0.3, beginner: 0.35, basic: 0.35, learning: 0.35,
  intermediate: 0.6, proficient: 0.75, advanced: 0.8,
  expert: 0.95, master: 1,
};

/**
 * "expert" | "80" | "80%" | "4/5" | "4" (<=5 => out of 5, else out of 100) -> 0..1
 */
export function parseLevel(raw?: string | null): number | undefined {
  const s = raw?.trim().toLowerCase();
  if (!s) return undefined;
  if (s in LEVEL_WORDS) return LEVEL_WORDS[s];
  const m = s.match(/^(\d+(?:\.\d+)?)\s*(%|\/\s*(\d+(?:\.\d+)?))?$/);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  const max = m[3] ? parseFloat(m[3]) : m[2] === "%" ? 100 : n <= 5 ? 5 : 100;
  return max > 0 ? clamp01(n / max) : undefined;
}

/* ---------- text ---------- */

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return ((parts[0][0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function splitParagraphs(text: string): string[] {
  return text.split(/\n{2,}|\r\n\r\n/).map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);
}

/** Bullets / lines -> highlights. */
export function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.replace(/^\s*[-•*–]\s*/, "").trim())
    .filter(Boolean);
}

export function firstSentence(text: string): string {
  const m = text.match(/^(.+?[.!?])(\s|$)/);
  return (m ? m[1] : text).trim();
}

export function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}
