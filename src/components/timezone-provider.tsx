"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_TIMEZONE,
  formatDateOnly,
  formatDateTime,
  formatMonthYear,
  getDeviceTimeZone,
  isValidTimeZone,
  normalizeTimeZone,
} from "@/lib/timezone";

type TimezoneContextValue = {
  timeZone: string;
  deviceTimeZone: string;
  setTimeZone: (tz: string) => void;
  formatDateTime: (value: string | number | Date) => string;
  formatDate: (value: string | number | Date) => string;
  formatMonthYear: (value: string | number | Date) => string;
};

const TimezoneContext = createContext<TimezoneContextValue | null>(null);
const STORAGE_KEY = "orixa-timezone";

export function TimezoneProvider({
  children,
  initialTimeZone,
  locale = "en-US",
}: {
  children: ReactNode;
  initialTimeZone?: string | null;
  locale?: string;
}) {
  const [deviceTimeZone, setDeviceTimeZone] = useState(DEFAULT_TIMEZONE);
  const [timeZone, setTimeZoneState] = useState(() =>
    normalizeTimeZone(initialTimeZone),
  );

  useEffect(() => {
    const device = getDeviceTimeZone();
    setDeviceTimeZone(device);

    const fromDb =
      initialTimeZone && isValidTimeZone(initialTimeZone)
        ? initialTimeZone
        : null;

    let fromStorage: string | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && isValidTimeZone(raw)) fromStorage = raw;
    } catch {}

    const resolved =
      fromDb && fromDb !== DEFAULT_TIMEZONE
        ? fromDb
        : fromStorage && fromStorage !== DEFAULT_TIMEZONE
          ? fromStorage
          : fromDb === DEFAULT_TIMEZONE && !fromStorage
            ? device
            : (fromDb ?? fromStorage ?? device);

    setTimeZoneState(normalizeTimeZone(resolved));
    try {
      localStorage.setItem(STORAGE_KEY, normalizeTimeZone(resolved));
    } catch {}
  }, [initialTimeZone]);

  const setTimeZone = useCallback((tz: string) => {
    const next = normalizeTimeZone(tz);
    setTimeZoneState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      timeZone,
      deviceTimeZone,
      setTimeZone,
      formatDateTime: (v: string | number | Date) =>
        formatDateTime(v, timeZone, locale),
      formatDate: (v: string | number | Date) =>
        formatDateOnly(v, timeZone, locale),
      formatMonthYear: (v: string | number | Date) =>
        formatMonthYear(v, timeZone, locale),
    }),
    [timeZone, deviceTimeZone, setTimeZone, locale],
  );

  return (
    <TimezoneContext.Provider value={value}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone() {
  const ctx = useContext(TimezoneContext);
  if (!ctx) throw new Error("useTimezone must be used within TimezoneProvider");
  return ctx;
}

export function useTimezoneOptional() {
  return useContext(TimezoneContext);
}
