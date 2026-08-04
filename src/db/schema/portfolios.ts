import {
  pgTable,
  foreignKey,
  uniqueIndex,
  index,
  pgPolicy,
  check,
  uuid,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { profiles } from "./profiles";

export const portfolios = pgTable(
  "portfolios",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    profileId: uuid("profile_id").notNull(),

    title: text("title").notNull(),

    slug: text("slug").notNull(),

    status: text("status").default("draft").notNull(),

    currentVersion: integer("current_version")
      .default(1)
      .notNull(),

    publishedAt: timestamp("published_at", {
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
    uniqueIndex("portfolio_slug_unique").on(
      table.profileId,
      table.slug,
    ),

    index("portfolios_profile_idx").on(table.profileId),

    index("portfolios_status_idx").on(table.status),

    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "portfolios_profile_id_fkey",
    }).onDelete("cascade"),

    pgPolicy("Owner manages portfolios", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(
        EXISTS (
          SELECT 1
          FROM profiles
          WHERE profiles.id = portfolios.profile_id
          AND profiles.user_id = auth.uid()
        )
      )`,
      withCheck: sql`(
        EXISTS (
          SELECT 1
          FROM profiles
          WHERE profiles.id = portfolios.profile_id
          AND profiles.user_id = auth.uid()
        )
      )`,
    }),

    pgPolicy("Public can view published portfolios", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),

    check(
      "portfolio_status_check",
      sql`status = ANY (
        ARRAY[
          'draft'::text,
          'published'::text,
          'archived'::text
        ]
      )`,
    ),
  ],
);