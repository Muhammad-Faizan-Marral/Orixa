"use client";

import { useEffect } from "react";
import { useTimezone } from "@/components/timezone-provider";
import { isValidTimeZone } from "@/lib/timezone";

export function TimezoneSync({ timezone }: { timezone: string | null }) {
  const { setTimeZone, timeZone } = useTimezone();

  useEffect(() => {
    if (!timezone || !isValidTimeZone(timezone)) return;
    if (timezone === timeZone) return;
    setTimeZone(timezone);
  }, [timezone, timeZone, setTimeZone]);

  return null;
}