import {
  pgTable,
  foreignKey,
  index,
  pgPolicy,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { portfolios } from "./portfolios";

export const portfolioViews = pgTable(
  "portfolio_views",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    portfolioId: uuid("portfolio_id").notNull(),

    country: text("country"),

    city: text("city"),

    browser: text("browser"),

    device: text("device"),

    os: text("os"),

    referrer: text("referrer"),

    ipHash: text("ip_hash"),

    visitedAt: timestamp("visited_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    index("portfolio_views_date_idx").on(
      table.visitedAt,
    ),

    index("portfolio_views_portfolio_idx").on(
      table.portfolioId,
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