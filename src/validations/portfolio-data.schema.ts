import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));

const urlOptional = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (val) => !val || /^https?:\/\/.+/i.test(val),
    "The URL must start with http:// or https://. Example: https://github.com/you"
  );

const phoneOptional = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (val) => !val || /^[+]?[\d\s\-()]{7,20}$/.test(val),
    "Invalid phone. Example: +92 300 1234567",
  );

export const portfolioProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(2, "Project title min 2 chars").max(120),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  url: urlOptional,
  technologies: z
    .array(z.string().trim().min(1).max(60))
    .max(30)
    .default([]),
  imageUrl: optionalString,
});

export const portfolioExperienceSchema = z.object({
  id: z.string().min(1),
  company: z.string().trim().min(1, "Company required").max(120),
  role: z.string().trim().min(1, "Role required").max(120),
  location: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  current: z.boolean().default(false),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
});

export const portfolioSkillSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .trim()
    .min(2, "Skill min 2 chars. Example: React")
    .max(40, "Skill max 40 chars")
    .refine(
      (val) => /^[a-zA-Z0-9+#.\-_/ ]+$/.test(val),
     "There are invalid characters in the skill field."
    ),
  level: optionalString,
});

export const portfolioEducationSchema = z.object({
  id: z.string().min(1),
  institution: z.string().trim().min(1, "Institution required").max(150),
  degree: optionalString,
  field: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  description: optionalString,
});

export const portfolioCertificateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Certificate name required").max(150),
  issuer: optionalString,
  issueDate: optionalString,
  credentialUrl: urlOptional,
});

const sectionSelectionSchema = z.object({
  enabled: z.boolean(),
  variant: z.string().min(1),
});

const componentSelectionSchema = z
  .object({
    navbar: sectionSelectionSchema.optional(),
    hero: sectionSelectionSchema.optional(),
    about: sectionSelectionSchema.optional(),
    skills: sectionSelectionSchema.optional(),
    projects: sectionSelectionSchema.optional(),
    experience: sectionSelectionSchema.optional(),
    education: sectionSelectionSchema.optional(),
    certificates: sectionSelectionSchema.optional(),
    contact: sectionSelectionSchema.optional(),
    footer: sectionSelectionSchema.optional(),
  })
  .passthrough()
  .default({});

const designPreferencesSchema = z
  .object({
    themeMode: z.enum(["light", "dark"]).default("dark"),
    layout: z.enum(["standard", "wide", "centered"]).default("standard"),
    accentColor: z.string().trim().min(1).max(30).default("#6c5cff"),
    fontFamily: z.string().trim().min(1).max(50).default("Inter"),
    borderRadius: z
      .enum(["none", "small", "medium", "large"])
      .default("medium"),
    cardStyle: z.enum(["flat", "bordered", "elevated"]).default("bordered"),
  })
  .passthrough()
  .default({});

const seoSchema = z.object({
  title: z.string().trim().max(70, "SEO title max 70 chars").default(""),
  description: z
    .string()
    .trim()
    .max(160, "SEO description max 160 chars")
    .default(""),
  keywords: z.array(z.string().trim().max(40)).default([]),
  noIndex: z.boolean().default(false),
});

export const updatePortfolioDataSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio id"),

  name: z.string().trim().max(100).default(""),
  prompt: z.string().trim().max(2000).default(""),
  avatarUrl: z.string().trim().default(""),
  phone: phoneOptional,
  linkedinUrl: urlOptional,
  githubUrl: urlOptional,

  headline: z.string().trim().max(200).default(""),
  about: z.string().trim().max(5000, "About max 5000 characters").default(""),

  projects: z.array(portfolioProjectSchema).default([]),
  experience: z.array(portfolioExperienceSchema).default([]),
  skills: z.array(portfolioSkillSchema).default([]),
  education: z.array(portfolioEducationSchema).default([]),
  certificates: z.array(portfolioCertificateSchema).default([]),

  resumeUrl: z.string().trim().default(""),

  theme: z.string().trim().min(1).max(50).default("minimal"),
  animations: z.boolean().default(true),

  componentSelection: componentSelectionSchema,
  designPreferences: designPreferencesSchema,
  seo: seoSchema.default({}),
});

export type UpdatePortfolioDataInput = z.infer<
  typeof updatePortfolioDataSchema
>;