import {
  pgTable,
  foreignKey,
  unique,
  pgPolicy,
  check,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { authUsers } from "./auth";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    userId: uuid("user_id").notNull(),

    username: text("username").notNull(),

    fullName: text("full_name"),

    headline: text("headline"),

    bio: text("bio"),

    location: text("location"),

    avatarUrl: text("avatar_url"),

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
      columns: [table.userId],
      foreignColumns: [authUsers.id],
      name: "profiles_user_id_fkey",
    }).onDelete("cascade"),

    unique("profiles_user_id_key").on(table.userId),

    unique("profiles_username_key").on(table.username),

    pgPolicy("Users can view own profile", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`(auth.uid() = user_id)`,
    }),

    pgPolicy("Users can insert own profile", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),

    pgPolicy("Users can update own profile", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),

    check(
      "username_format",
      sql`username ~ '^[a-z0-9_]+$'::text`,
    ),

    check(
      "username_length",
      sql`
        (char_length(username) >= 3)
        AND
        (char_length(username) <= 30)
      `,
    ),
  ],
);