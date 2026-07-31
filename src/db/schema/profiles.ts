import { pgTable, uuid, varchar, text, timestamp, uniqueIndex} from "drizzle-orm/pg-core";
import { authUsers } from "./auth";
import { relations } from "drizzle-orm";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),

    username: varchar("username", { length: 50 }).notNull(),

    fullName: varchar("full_name", { length: 150 }),

    headline: varchar("headline", { length: 255 }),

    bio: text("bio"),

    location: varchar("location", { length: 100 }),

    avatarUrl: text("avatar_url"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    usernameUnique: uniqueIndex("profiles_username_unique").on(table.username),
    userUnique: uniqueIndex("profiles_user_unique").on(table.userId),
  }),
);



export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(authUsers, {
    fields: [profiles.userId],
    references: [authUsers.id],
  }),
}));