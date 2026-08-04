import {
  pgTable,
  foreignKey,
  unique,
  pgPolicy,
  check,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { profiles } from "./profiles";

export const settings = pgTable(
  "settings",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    profileId: uuid("profile_id").notNull(),

    language: text("language")
      .default("en")
      .notNull(),

    timezone: text("timezone").default("UTC"),

    publicProfile: boolean("public_profile")
      .default(true)
      .notNull(),

    emailNotifications: boolean("email_notifications")
      .default(true)
      .notNull(),

    themeMode: text("theme_mode").default("system"),

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
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "settings_profile_id_fkey",
    }).onDelete("cascade"),

    unique("settings_profile_id_key").on(
      table.profileId,
    ),

    pgPolicy("Owner manages settings", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE pr.id = settings.profile_id
          AND pr.user_id = auth.uid()
        )
      )`,
      withCheck: sql`(
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE pr.id = settings.profile_id
          AND pr.user_id = auth.uid()
        )
      )`,
    }),

    check(
      "settings_theme_check",
      sql`theme_mode = ANY (
        ARRAY[
          'light'::text,
          'dark'::text,
          'system'::text
        ]
      )`,
    ),
  ],
);