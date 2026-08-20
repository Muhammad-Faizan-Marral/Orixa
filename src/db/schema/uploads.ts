import {
  bigint,
  foreignKey,
  index,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
  check,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

import { profiles } from "./profiles";

export const uploads = pgTable(
  "uploads",
  {
    id: uuid()
      .defaultRandom()
      .primaryKey()
      .notNull(),

    profileId: uuid("profile_id")
      .notNull(),

    type: text()
      .notNull(),

    url: text()
      .notNull(),

    mimeType: text("mime_type"),

    size: bigint({
      mode: "number",
    }),

    status: text()
      .default("active"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    index("uploads_profile_idx").using(
      "btree",
      table.profileId.asc().nullsLast().op("uuid_ops"),
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
          WHERE (
            pr.id = uploads.profile_id
            AND pr.user_id = auth.uid()
          )
        )
      )`,

      withCheck: sql`(
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE (
            pr.id = uploads.profile_id
            AND pr.user_id = auth.uid()
          )
        )
      )`,
    }),

    check(
      "upload_status_check",
      sql`
        status = ANY (
          ARRAY[
            'active'::text,
            'deleted'::text
          ]
        )
      `,
    ),
  ],
);