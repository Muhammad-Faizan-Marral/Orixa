import {
  pgTable,
  foreignKey,
  index,
  pgPolicy,
  check,
  uuid,
  text,
  bigint,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { profiles } from "./profiles";

export const uploads = pgTable(
  "uploads",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    profileId: uuid("profile_id").notNull(),

    type: text("type").notNull(),

    url: text("url").notNull(),

    mimeType: text("mime_type"),

    size: bigint("size", {
      mode: "number",
    }),

    status: text("status").default("active"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    index("uploads_profile_idx").on(
      table.profileId,
    ),

    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "uploads_profile_id_fkey",
    }).onDelete("cascade"),

    pgPolicy("Owner manages uploads", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE pr.id = uploads.profile_id
          AND pr.user_id = auth.uid()
        )
      )`,
      withCheck: sql`(
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE pr.id = uploads.profile_id
          AND pr.user_id = auth.uid()
        )
      )`,
    }),

    check(
      "upload_status_check",
      sql`status = ANY (
        ARRAY[
          'active'::text,
          'deleted'::text
        ]
      )`,
    ),
  ],
);