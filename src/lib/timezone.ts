export const DEFAULT_TIMEZONE = "UTC";

export function getDeviceTimeZone(): string {
  if (typeof Intl === "undefined") return DEFAULT_TIMEZONE;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && isValidTimeZone(tz)) return tz;
  } catch {}
  return DEFAULT_TIMEZONE;
}

export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone) return false;
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function normalizeTimeZone(timeZone: string | null | undefined): string {
  if (timeZone && isValidTimeZone(timeZone)) return timeZone;
  return DEFAULT_TIMEZONE;
}

export function formatInTimeZone(
  value: string | number | Date,
  timeZone: string,
  options: Intl.DateTimeFormatOptions & { locale?: string } = {},
): string {
  const { locale = "en-US", ...fmt } = options;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const tz = normalizeTimeZone(timeZone);
  try {
    return new Intl.DateTimeFormat(locale, { timeZone: tz, ...fmt }).format(
      date,
    );
  } catch {
    return new Intl.DateTimeFormat(locale, fmt).format(date);
  }
}

export function formatDateTime(
  value: string | number | Date,
  timeZone: string,
  locale = "en-US",
): string {
  return formatInTimeZone(value, timeZone, {
    locale,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateOnly(
  value: string | number | Date,
  timeZone: string,
  locale = "en-US",
): string {
  return formatInTimeZone(value, timeZone, {
    locale,
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatMonthYear(
  value: string | number | Date,
  timeZone: string,
  locale = "en-US",
): string {
  return formatInTimeZone(value, timeZone, {
    locale,
    year: "numeric",
    month: "long",
  });
}

export function getTimeZoneOffsetLabel(
  timeZone: string,
  at: Date = new Date(),
): string {
  const tz = normalizeTimeZone(timeZone);
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(at);
    const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    return offset ? `${tz} (${offset})` : tz;
  } catch {
    return tz;
  }
}
