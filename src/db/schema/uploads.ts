import {
  bigint,
  check,
  foreignKey,
  index,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

import { profiles } from "./profiles";

export const uploads = pgTable(
  "uploads",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),

    profileId: uuid("profile_id").notNull(),

    type: text().notNull(),

    bucket: text().notNull(),

    storagePath: text("storage_path").notNull(),

    url: text(),

    mimeType: text("mime_type"),

    size: bigint({ mode: "number" }).notNull(),

    status: text().default("active").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    index("uploads_profile_idx").on(table.profileId),

    uniqueIndex("uploads_bucket_path_unique").on(
      table.bucket,
      table.storagePath,
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
          'reserved'::text,
          'active'::text,
          'deleting'::text,
          'deleted'::text
        ]
      )`,
    ),

    check(
      "upload_type_check",
      sql`type = ANY (
        ARRAY[
          'avatar'::text,
          'project-image'::text,
          'resume'::text
        ]
      )`,
    ),
  ],
);
