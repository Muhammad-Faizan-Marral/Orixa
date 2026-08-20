import {
  foreignKey,
  index,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

import { portfolios } from "./portfolios";

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

    visitedAt: timestamp("visited_at", {
      withTimezone: true,
      mode: "string",
    })
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