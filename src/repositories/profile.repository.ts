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

  async findById(id: string) {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id));

    return profile ?? null;
  }

  async findByReferralCode(code: string) {
    const normalized = code.toLowerCase().trim();
    const { sql } = await import("drizzle-orm");
    const [profile] = await db
      .select()
      .from(profiles)
      .where(sql`lower(${profiles.referralCode}) = ${normalized}`);

    return profile ?? null;
  }

  async updateById(id: string, data: Partial<typeof profiles.$inferInsert>) {
    const [profile] = await db
      .update(profiles)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(profiles.id, id))
      .returning();

    return profile;
  }



  async exists(userId: string) {
    const profile = await this.findByUserId(userId);
    return profile !== null;
  }

  async create(data: typeof profiles.$inferInsert) {
    const [profile] = await db.insert(profiles).values(data).returning();
    return profile;
  }

  async update(userId: string, data: Partial<typeof profiles.$inferInsert>) {
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
