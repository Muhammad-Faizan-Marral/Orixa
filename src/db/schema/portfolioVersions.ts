import {
  pgTable,
  foreignKey,
  uniqueIndex,
  index,
  pgPolicy,
  uuid,
  integer,
  jsonb,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { portfolios } from "./portfolios";

export const portfolioVersions = pgTable(
  "portfolio_versions",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    portfolioId: uuid("portfolio_id").notNull(),

    version: integer("version").notNull(),

    configJson: jsonb("config_json").notNull(),

    published: boolean("published").default(true).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    uniqueIndex("portfolio_version_unique").on(
      table.portfolioId,
      table.version,
    ),

    index("portfolio_versions_portfolio_idx").on(
      table.portfolioId,
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
      using: sql`(
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE p.id = portfolio_versions.portfolio_id
          AND pr.user_id = auth.uid()
        )
      )`,
      withCheck: sql`(
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE p.id = portfolio_versions.portfolio_id
          AND pr.user_id = auth.uid()
        )
      )`,
    }),
  ],
);