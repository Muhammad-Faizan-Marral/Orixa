import {
  pgTable,
  foreignKey,
  uniqueIndex,
  index,
  pgPolicy,
  uuid,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { profiles } from "./profiles";

export const socialLinks = pgTable(
  "social_links",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    profileId: uuid("profile_id").notNull(),

    platform: text("platform").notNull(),

    url: text("url").notNull(),

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
    index("social_links_profile_idx").on(
      table.profileId,
    ),

    uniqueIndex("social_links_unique").on(
      table.profileId,
      table.platform,
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
          WHERE pr.id = social_links.profile_id
          AND pr.user_id = auth.uid()
        )
      )`,
      withCheck: sql`(
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE pr.id = social_links.profile_id
          AND pr.user_id = auth.uid()
        )
      )`,
    }),
  ],
);