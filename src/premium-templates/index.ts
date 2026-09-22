/**
 * Premium portfolio template pack.
 * Free users: preview in Design Lab only.
 * Premium users: can apply / save.
 *
 * Add full designs yourself under each id folder later.
 */

export type PremiumTemplateMeta = {
  id: string;
  name: string;
  description: string;
  designDna: string;
  previewAccent: string;
  isPremium: true;
};

export const PREMIUM_TEMPLATES: PremiumTemplateMeta[] = [
  {
    id: "aurora-glass",
    name: "Aurora Glass",
    description: "Soft glassmorphism, cool accents, cinematic hero.",
    designDna: "neo-glass",
    previewAccent: "#22d3ee",
    isPremium: true,
  },
  {
    id: "ink-editorial",
    name: "Ink Editorial",
    description: "Magazine layout, serif headlines, light luxury.",
    designDna: "soft-luxury",
    previewAccent: "#a78bfa",
    isPremium: true,
  },
  {
    id: "terminal-brutal",
    name: "Terminal Brutal",
    description: "Dense tech grid, mono type, high contrast.",
    designDna: "brutalist",
    previewAccent: "#34d399",
    isPremium: true,
  },
  {
    id: "cinema-dark",
    name: "Cinema Dark",
    description: "Full-bleed media, dark mood, strong motion.",
    designDna: "cinematic",
    previewAccent: "#fb7185",
    isPremium: true,
  },
];

/** Sample content for previews — replace with real designs later */
export const PREMIUM_TEMPLATE_SAMPLE = {
  name: "Alex Rivera",
  headline: "Full-stack engineer · Product-minded",
  about:
    "I build clean interfaces and reliable APIs. This is sample content for premium template preview.",
  skills: [
    { name: "TypeScript", level: "Expert" },
    { name: "Next.js", level: "Expert" },
    { name: "PostgreSQL", level: "Advanced" },
  ],
  projects: [
    {
      title: "Orbit Dashboard",
      description: "Realtime analytics for SaaS teams.",
      technologies: ["Next.js", "Supabase"],
    },
    {
      title: "Plain Notes",
      description: "Minimal note app with offline sync.",
      technologies: ["React", "IndexedDB"],
    },
  ],
  experience: [
    {
      company: "Northwind Labs",
      role: "Software Engineer",
      startDate: "2022",
      current: true,
      description: "Shipped design system and billing flows.",
    },
  ],
};
