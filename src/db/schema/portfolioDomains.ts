import {
  pgTable,
  foreignKey,
  uniqueIndex,
  index,
  pgPolicy,
  check,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { portfolios } from "./portfolios";

export const portfolioDomains = pgTable(
  "portfolio_domains",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    portfolioId: uuid("portfolio_id").notNull(),

    /** Normalized apex/host only, e.g. faizan.co (no protocol/www) */
    domain: text("domain").notNull(),

    /** none | pending | verified | error | suspended */
    status: text("status").default("pending").notNull(),

    /** Optional message from Vercel / DNS checks */
    statusMessage: text("status_message"),

    verifiedAt: timestamp("verified_at", {
      withTimezone: true,
      mode: "string",
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // 1 portfolio = 1 domain
    uniqueIndex("portfolio_domains_portfolio_uidx").on(table.portfolioId),
    // Domain globally unique
    uniqueIndex("portfolio_domains_domain_uidx").on(table.domain),
    index("portfolio_domains_status_idx").on(table.status),

    foreignKey({
      columns: [table.portfolioId],
      foreignColumns: [portfolios.id],
      name: "portfolio_domains_portfolio_id_fkey",
    }).onDelete("cascade"),

    check(
      "portfolio_domains_status_check",
      sql`status = ANY (ARRAY[
        'pending'::text,
        'verified'::text,
        'error'::text,
        'suspended'::text
      ])`,
    ),

    pgPolicy("Owner can manage own portfolio domains", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(
        EXISTS (
          SELECT 1 FROM portfolios
          JOIN profiles ON profiles.id = portfolios.profile_id
          WHERE portfolios.id = portfolio_domains.portfolio_id
          AND profiles.user_id = auth.uid()
        )
      )`,
      withCheck: sql`(
        EXISTS (
          SELECT 1 FROM portfolios
          JOIN profiles ON profiles.id = portfolios.profile_id
          WHERE portfolios.id = portfolio_domains.portfolio_id
          AND profiles.user_id = auth.uid()
        )
      )`,
    }),

    pgPolicy("Public can read verified domains for routing", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`status = 'verified' OR status = 'suspended'`,
    }),
  ],
);
