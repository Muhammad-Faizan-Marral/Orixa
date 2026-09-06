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

export const portfolioEvents = pgTable(
  "portfolio_events",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),

    portfolioId: uuid("portfolio_id").notNull(),

    /** project_click | contact_click | section_view */
    eventType: text("event_type").notNull(),

    /** e.g. project title / id */
    label: text(),

    referrer: text(),

    country: text(),

    ipHash: text("ip_hash"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("portfolio_events_portfolio_idx").on(table.portfolioId),
    index("portfolio_events_type_idx").on(table.eventType),
    index("portfolio_events_created_idx").on(table.createdAt),

    foreignKey({
      columns: [table.portfolioId],
      foreignColumns: [portfolios.id],
      name: "portfolio_events_portfolio_id_fkey",
    }).onDelete("cascade"),

    pgPolicy("Anyone can insert portfolio events", {
      as: "permissive",
      for: "insert",
      to: ["public"],
      withCheck: sql`true`,
    }),

    pgPolicy("Owner can read portfolio events", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ],
);
