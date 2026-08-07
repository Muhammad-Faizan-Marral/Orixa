import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";

export class ProfileRepository {
  async findByUserId(userId: string) {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));

    return profile ?? null;
  }

  async findByUsername(username: string) {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.username, username));

    return profile ?? null;
  }

  async exists(userId: string) {
    const profile = await this.findByUserId(userId);

    return profile !== null;
  }

  async create(data: typeof profiles.$inferInsert) {
    const [profile] = await db
      .insert(profiles)
      .values(data)
      .returning();

    return profile;
  }

  async update(
    userId: string,
    data: Partial<typeof profiles.$inferInsert>,
  ) {
    const [profile] = await db
      .update(profiles)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(profiles.userId, userId))
      .returning();

    return profile;
  }
}

export const profileRepository = new ProfileRepository();