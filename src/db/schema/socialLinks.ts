import {
  foreignKey,
  index,
  integer,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

import { profiles } from "./profiles";

export const socialLinks = pgTable(
  "social_links",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),

    profileId: uuid("profile_id").notNull(),

    platform: text().notNull(),

    url: text().notNull(),

    displayOrder: integer("display_order")
      .default(0)
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
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
      table.profileId.asc().nullsLast().op("uuid_ops"),
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

      using: sql`(
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE (
            pr.id = social_links.profile_id
            AND pr.user_id = auth.uid()
          )
        )
      )`,

      withCheck: sql`(
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE (
            pr.id = social_links.profile_id
            AND pr.user_id = auth.uid()
          )
        )
      )`,
    }),
  ],
);