import { eq } from "drizzle-orm";

import { db } from "@/db";
import { settings } from "@/db/schema";

export class SettingsRepository {
  async findByProfileId(profileId: string) {
    const [result] = await db
      .select()
      .from(settings)
      .where(eq(settings.profileId, profileId))
      .limit(1);

    return result ?? null;
  }

  async create(profileId: string) {
    const [result] = await db
      .insert(settings)
      .values({
        profileId,
      })
      .returning();

    return result;
  }

  async createIfNotExists(profileId: string) {
    const existing = await this.findByProfileId(profileId);

    if (existing) {
      return existing;
    }

    return this.create(profileId);
  }

  async update(
    profileId: string,
    data: {
      language?: string;
      timezone?: string | null;
      publicProfile?: boolean;
      emailNotifications?: boolean;
      themeMode?: string | null;
    },
  ) {
    const [result] = await db
      .update(settings)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(settings.profileId, profileId))
      .returning();

    return result ?? null;
  }
}

export const settingsRepository = new SettingsRepository();
