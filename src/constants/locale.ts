/**
 * Curated language / timezone options for the Settings screen.
 * Kept intentionally small and human-readable rather than a full
 * ISO/IANA dump — Orixa users pick from a short, sensible list.
 */

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ur", label: "Urdu" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "it", label: "Italian" },
  { value: "nl", label: "Dutch" },
  { value: "ru", label: "Russian" },
  { value: "tr", label: "Turkish" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
] as const;

export const TIMEZONE_OPTIONS: { group: string; zones: string[] }[] = [
  {
    group: "UTC",
    zones: ["UTC"],
  },
  {
    group: "Asia",
    zones: [
      "Asia/Karachi",
      "Asia/Kolkata",
      "Asia/Dhaka",
      "Asia/Dubai",
      "Asia/Riyadh",
      "Asia/Istanbul",
      "Asia/Shanghai",
      "Asia/Hong_Kong",
      "Asia/Singapore",
      "Asia/Tokyo",
      "Asia/Seoul",
      "Asia/Jakarta",
      "Asia/Bangkok",
    ],
  },
  {
    group: "Europe",
    zones: [
      "Europe/London",
      "Europe/Lisbon",
      "Europe/Madrid",
      "Europe/Paris",
      "Europe/Berlin",
      "Europe/Amsterdam",
      "Europe/Rome",
      "Europe/Warsaw",
      "Europe/Athens",
      "Europe/Moscow",
    ],
  },
  {
    group: "Americas",
    zones: [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Toronto",
      "America/Mexico_City",
      "America/Sao_Paulo",
      "America/Bogota",
      "America/Argentina/Buenos_Aires",
    ],
  },
  {
    group: "Africa",
    zones: [
      "Africa/Cairo",
      "Africa/Lagos",
      "Africa/Johannesburg",
      "Africa/Nairobi",
    ],
  },
  {
    group: "Pacific",
    zones: [
      "Australia/Sydney",
      "Australia/Melbourne",
      "Australia/Perth",
      "Pacific/Auckland",
    ],
  },
];