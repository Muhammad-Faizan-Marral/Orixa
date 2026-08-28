"use client";

import { useTimezoneOptional } from "@/components/timezone-provider";
import {
  formatDateOnly,
  formatDateTime,
  formatMonthYear,
  DEFAULT_TIMEZONE,
} from "@/lib/timezone";

export function FormatDate({
  value,
  variant = "datetime",
  className,
  timeZone: tzProp,
}: {
  value: string | number | Date;
  variant?: "datetime" | "date" | "monthYear";
  className?: string;
  timeZone?: string;
}) {
  const ctx = useTimezoneOptional();
  const tz = tzProp ?? ctx?.timeZone ?? DEFAULT_TIMEZONE;

  let text: string;
  if (variant === "date") {
    text = ctx?.formatDate(value) ?? formatDateOnly(value, tz);
  } else if (variant === "monthYear") {
    text = ctx?.formatMonthYear(value) ?? formatMonthYear(value, tz);
  } else {
    text = ctx?.formatDateTime(value) ?? formatDateTime(value, tz);
  }

  const date = value instanceof Date ? value : new Date(value);
  return (
    <time dateTime={date.toISOString()} className={className}>
      {text}
    </time>
  );
}