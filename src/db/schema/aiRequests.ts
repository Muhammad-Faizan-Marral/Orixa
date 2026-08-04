import {
  pgTable,
  foreignKey,
  index,
  pgPolicy,
  check,
  uuid,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { portfolios } from "./portfolios";

export const aiRequests = pgTable(
  "ai_requests",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    portfolioId: uuid("portfolio_id"),

    requestType: text("request_type").notNull(),

    model: text("model").notNull(),

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

    status: text("status").default("success"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    index("ai_requests_created_idx").on(
      table.createdAt,
    ),

    index("ai_requests_portfolio_idx").on(
      table.portfolioId,
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
      using: sql`(
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE p.id = ai_requests.portfolio_id
          AND pr.user_id = auth.uid()
        )
      )`,
      withCheck: sql`(
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE p.id = ai_requests.portfolio_id
          AND pr.user_id = auth.uid()
        )
      )`,
    }),

    check(
      "ai_status_check",
      sql`status = ANY (
        ARRAY[
          'success'::text,
          'failed'::text,
          'cancelled'::text
        ]
      )`,
    ),
  ],
);