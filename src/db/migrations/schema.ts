import {
  pgTable,
  foreignKey,
  unique,
  pgPolicy,
  check,
  uuid,
  text,
  timestamp,
  uniqueIndex,
  index,
  integer,
  jsonb,
  boolean,
  numeric,
  bigint,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    username: text().notNull(),
    fullName: text("full_name"),
    headline: text(),
    bio: text(),
    location: text(),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "profiles_user_id_fkey",
    }).onDelete("cascade"),
    unique("profiles_user_id_key").on(table.userId),
    unique("profiles_username_key").on(table.username),
    pgPolicy("Users can view own profile", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`(auth.uid() = user_id)`,
    }),
    pgPolicy("Users can insert own profile", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy("Users can update own profile", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
    check("username_format", sql`username ~ '^[a-z0-9_]+$'::text`),
    check(
      "username_length",
      sql`(char_length(username) >= 3) AND (char_length(username) <= 30)`,
    ),
  ],
);

export const portfolios = pgTable(
  "portfolios",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    profileId: uuid("profile_id").notNull(),
    title: text().notNull(),
    slug: text().notNull(),
    status: text().default("draft").notNull(),
    currentVersion: integer("current_version").default(1).notNull(),
    publishedAt: timestamp("published_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("portfolio_slug_unique").using(
      "btree",
      table.profileId.asc().nullsLast().op("uuid_ops"),
      table.slug.asc().nullsLast().op("text_ops"),
    ),
    index("portfolios_profile_idx").using(
      "btree",
      table.profileId.asc().nullsLast().op("uuid_ops"),
    ),
    index("portfolios_status_idx").using(
      "btree",
      table.status.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "portfolios_profile_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("Owner manages portfolios", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = portfolios.profile_id) AND (profiles.user_id = auth.uid()))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = portfolios.profile_id) AND (profiles.user_id = auth.uid()))))`,
    }),
    pgPolicy("Public can view published portfolios", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
    check(
      "portfolio_status_check",
      sql`status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])`,
    ),
  ],
);

export const portfolioData = pgTable(
  "portfolio_data",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    portfolioId: uuid("portfolio_id").notNull(),
    headline: text(),
    about: text(),
    projects: jsonb().default([]).notNull(),
    experience: jsonb().default([]).notNull(),
    skills: jsonb().default([]).notNull(),
    education: jsonb().default([]).notNull(),
    certificates: jsonb().default([]).notNull(),
    resumeUrl: text("resume_url"),
    theme: text().default("minimal"),
    animations: boolean().default(true).notNull(),
    componentSelection: jsonb("component_selection").default({}).notNull(),
    designPreferences: jsonb("design_preferences").default({}).notNull(),
    seo: jsonb().default({}).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("portfolio_data_portfolio_idx").using(
      "btree",
      table.portfolioId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.portfolioId],
      foreignColumns: [portfolios.id],
      name: "portfolio_data_portfolio_id_fkey",
    }).onDelete("cascade"),
    unique("portfolio_data_portfolio_id_key").on(table.portfolioId),
    pgPolicy("Owner manages portfolio data", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM (portfolios p
     JOIN profiles pr ON ((p.profile_id = pr.id)))
  WHERE ((p.id = portfolio_data.portfolio_id) AND (pr.user_id = auth.uid()))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM (portfolios p
     JOIN profiles pr ON ((p.profile_id = pr.id)))
  WHERE ((p.id = portfolio_data.portfolio_id) AND (pr.user_id = auth.uid()))))`,
    }),
  ],
);

export const portfolioViews = pgTable(
  "portfolio_views",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    portfolioId: uuid("portfolio_id").notNull(),
    country: text(),
    city: text(),
    browser: text(),
    device: text(),
    os: text(),
    referrer: text(),
    ipHash: text("ip_hash"),
    visitedAt: timestamp("visited_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("portfolio_views_date_idx").using(
      "btree",
      table.visitedAt.asc().nullsLast().op("timestamptz_ops"),
    ),
    index("portfolio_views_portfolio_idx").using(
      "btree",
      table.portfolioId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.portfolioId],
      foreignColumns: [portfolios.id],
      name: "portfolio_views_portfolio_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("Anyone can insert portfolio views", {
      as: "permissive",
      for: "insert",
      to: ["public"],
      withCheck: sql`true`,
    }),
    pgPolicy("Owner can read analytics", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ],
);

export const portfolioVersions = pgTable(
  "portfolio_versions",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    portfolioId: uuid("portfolio_id").notNull(),
    version: integer().notNull(),
    configJson: jsonb("config_json").notNull(),
    published: boolean().default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("portfolio_version_unique").using(
      "btree",
      table.portfolioId.asc().nullsLast().op("int4_ops"),
      table.version.asc().nullsLast().op("int4_ops"),
    ),
    index("portfolio_versions_portfolio_idx").using(
      "btree",
      table.portfolioId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.portfolioId],
      foreignColumns: [portfolios.id],
      name: "portfolio_versions_portfolio_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("Owner manages portfolio_versions", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM (portfolios p
     JOIN profiles pr ON ((p.profile_id = pr.id)))
  WHERE ((p.id = portfolio_versions.portfolio_id) AND (pr.user_id = auth.uid()))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM (portfolios p
     JOIN profiles pr ON ((p.profile_id = pr.id)))
  WHERE ((p.id = portfolio_versions.portfolio_id) AND (pr.user_id = auth.uid()))))`,
    }),
  ],
);

export const socialLinks = pgTable(
  "social_links",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    profileId: uuid("profile_id").notNull(),
    platform: text().notNull(),
    url: text().notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("social_links_profile_idx").using(
      "btree",
      table.profileId.asc().nullsLast().op("uuid_ops"),
    ),
    uniqueIndex("social_links_unique").using(
      "btree",
      table.profileId.asc().nullsLast().op("text_ops"),
      table.platform.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "social_links_profile_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("Owner manages social_links", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM profiles pr
  WHERE ((pr.id = social_links.profile_id) AND (pr.user_id = auth.uid()))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM profiles pr
  WHERE ((pr.id = social_links.profile_id) AND (pr.user_id = auth.uid()))))`,
    }),
  ],
);

export const settings = pgTable(
  "settings",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    profileId: uuid("profile_id").notNull(),
    language: text().default("en").notNull(),
    timezone: text().default("UTC"),
    publicProfile: boolean("public_profile").default(true).notNull(),
    emailNotifications: boolean("email_notifications").default(true).notNull(),
    themeMode: text("theme_mode").default("system"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "settings_profile_id_fkey",
    }).onDelete("cascade"),
    unique("settings_profile_id_key").on(table.profileId),
    pgPolicy("Owner manages settings", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM profiles pr
  WHERE ((pr.id = settings.profile_id) AND (pr.user_id = auth.uid()))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM profiles pr
  WHERE ((pr.id = settings.profile_id) AND (pr.user_id = auth.uid()))))`,
    }),
    check(
      "settings_theme_check",
      sql`theme_mode = ANY (ARRAY['light'::text, 'dark'::text, 'system'::text])`,
    ),
  ],
);

export const aiRequests = pgTable(
  "ai_requests",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    portfolioId: uuid("portfolio_id"),
    requestType: text("request_type").notNull(),
    model: text().notNull(),
    inputTokens: integer("input_tokens").default(0),
    outputTokens: integer("output_tokens").default(0),
    totalTokens: integer("total_tokens").generatedAlwaysAs(
      sql`(input_tokens + output_tokens)`,
    ),
    estimatedCost: numeric("estimated_cost", {
      precision: 10,
      scale: 6,
    }).default("0"),
    latencyMs: integer("latency_ms"),
    status: text().default("success"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("ai_requests_created_idx").using(
      "btree",
      table.createdAt.asc().nullsLast().op("timestamptz_ops"),
    ),
    index("ai_requests_portfolio_idx").using(
      "btree",
      table.portfolioId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.portfolioId],
      foreignColumns: [portfolios.id],
      name: "ai_requests_portfolio_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("Owner manages ai_requests", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM (portfolios p
     JOIN profiles pr ON ((p.profile_id = pr.id)))
  WHERE ((p.id = ai_requests.portfolio_id) AND (pr.user_id = auth.uid()))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM (portfolios p
     JOIN profiles pr ON ((p.profile_id = pr.id)))
  WHERE ((p.id = ai_requests.portfolio_id) AND (pr.user_id = auth.uid()))))`,
    }),
    check(
      "ai_status_check",
      sql`status = ANY (ARRAY['success'::text, 'failed'::text, 'cancelled'::text])`,
    ),
  ],
);

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    portfolioId: uuid("portfolio_id").notNull(),
    visitorName: text("visitor_name").notNull(),
    visitorEmail: text("visitor_email").notNull(),
    subject: text(),
    message: text().notNull(),
    status: text().default("unread").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("contact_messages_portfolio_idx").using(
      "btree",
      table.portfolioId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.portfolioId],
      foreignColumns: [portfolios.id],
      name: "contact_messages_portfolio_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("Owner manages contact_messages", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM (portfolios p
     JOIN profiles pr ON ((p.profile_id = pr.id)))
  WHERE ((p.id = contact_messages.portfolio_id) AND (pr.user_id = auth.uid()))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM (portfolios p
     JOIN profiles pr ON ((p.profile_id = pr.id)))
  WHERE ((p.id = contact_messages.portfolio_id) AND (pr.user_id = auth.uid()))))`,
    }),
    check(
      "contact_status_check",
      sql`status = ANY (ARRAY['unread'::text, 'read'::text, 'replied'::text, 'archived'::text])`,
    ),
  ],
);

export const uploads = pgTable(
  "uploads",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    profileId: uuid("profile_id").notNull(),
    type: text().notNull(),
    url: text(),
    mimeType: text("mime_type"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    size: bigint({ mode: "number" }).notNull(),
    status: text().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    bucket: text().notNull(),
    storagePath: text("storage_path").notNull(),
  },
  (table) => [
    uniqueIndex("uploads_bucket_path_unique").using(
      "btree",
      table.bucket.asc().nullsLast().op("text_ops"),
      table.storagePath.asc().nullsLast().op("text_ops"),
    ),
    index("uploads_profile_idx").using(
      "btree",
      table.profileId.asc().nullsLast().op("uuid_ops"),
    ),
    index("uploads_profile_status_idx").using(
      "btree",
      table.profileId.asc().nullsLast().op("text_ops"),
      table.status.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "uploads_profile_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("Owner manages uploads", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM profiles pr
  WHERE ((pr.id = uploads.profile_id) AND (pr.user_id = auth.uid()))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM profiles pr
  WHERE ((pr.id = uploads.profile_id) AND (pr.user_id = auth.uid()))))`,
    }),
    check(
      "upload_status_check",
      sql`status = ANY (ARRAY['reserved'::text, 'active'::text, 'deleting'::text, 'deleted'::text])`,
    ),
    check(
      "upload_type_check",
      sql`type = ANY (ARRAY['avatar'::text, 'project-image'::text, 'resume'::text])`,
    ),
  ],
);
