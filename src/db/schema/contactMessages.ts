import {
  check,
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

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
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

      using: sql`(
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE (
            p.id = contact_messages.portfolio_id
            AND pr.user_id = auth.uid()
          )
        )
      )`,

      withCheck: sql`(
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE (
            p.id = contact_messages.portfolio_id
            AND pr.user_id = auth.uid()
          )
        )
      )`,
    }),

    check(
      "contact_status_check",
      sql`
        status = ANY (
          ARRAY[
            'unread'::text,
            'read'::text,
            'replied'::text,
            'archived'::text
          ]
        )
      `,
    ),
  ],
);
