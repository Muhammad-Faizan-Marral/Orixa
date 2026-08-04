import {
  pgTable,
  foreignKey,
  unique,
  index,
  pgPolicy,
  uuid,
  text,
  jsonb,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { portfolios } from "./portfolios";

export const portfolioData = pgTable(
  "portfolio_data",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    portfolioId: uuid("portfolio_id").notNull(),

    headline: text("headline"),

    about: text("about"),

    projects: jsonb("projects").default([]).notNull(),

    experience: jsonb("experience").default([]).notNull(),

    skills: jsonb("skills").default([]).notNull(),

    education: jsonb("education").default([]).notNull(),

    certificates: jsonb("certificates").default([]).notNull(),

    resumeUrl: text("resume_url"),

    theme: text("theme").default("minimal"),

    animations: boolean("animations").default(true).notNull(),

    componentSelection: jsonb("component_selection")
      .default({})
      .notNull(),

    designPreferences: jsonb("design_preferences")
      .default({})
      .notNull(),

    seo: jsonb("seo").default({}).notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    index("portfolio_data_portfolio_idx").on(
      table.portfolioId,
    ),

    foreignKey({
      columns: [table.portfolioId],
      foreignColumns: [portfolios.id],
      name: "portfolio_data_portfolio_id_fkey",
    }).onDelete("cascade"),

    unique("portfolio_data_portfolio_id_key").on(
      table.portfolioId,
    ),

    pgPolicy("Owner manages portfolio data", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE p.id = portfolio_data.portfolio_id
          AND pr.user_id = auth.uid()
        )
      )`,
      withCheck: sql`(
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE p.id = portfolio_data.portfolio_id
          AND pr.user_id = auth.uid()
        )
      )`,
    }),
  ],
);