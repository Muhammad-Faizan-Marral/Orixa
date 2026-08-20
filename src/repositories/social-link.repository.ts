import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { socialLinks } from "@/db/schema";

export class SocialLinkRepository {
  async findByProfileId(profileId: string) {
    return db
      .select()
      .from(socialLinks)
      .where(eq(socialLinks.profileId, profileId))
      .orderBy(asc(socialLinks.displayOrder), asc(socialLinks.createdAt));
  }

  async findById(id: string, profileId: string) {
    const [link] = await db
      .select()
      .from(socialLinks)
      .where(and(eq(socialLinks.id, id), eq(socialLinks.profileId, profileId)))
      .limit(1);

    return link ?? null;
  }

  async create(
    profileId: string,
    data: {
      platform: string;
      url: string;
      displayOrder: number;
    },
  ) {
    const [link] = await db
      .insert(socialLinks)
      .values({
        profileId,
        platform: data.platform,
        url: data.url,
        displayOrder: data.displayOrder,
      })
      .returning();

    return link;
  }

  async update(
    id: string,
    profileId: string,
    data: {
      platform: string;
      url: string;
      displayOrder: number;
    },
  ) {
    const [link] = await db
      .update(socialLinks)
      .set({
        platform: data.platform,
        url: data.url,
        displayOrder: data.displayOrder,
      })
      .where(and(eq(socialLinks.id, id), eq(socialLinks.profileId, profileId)))
      .returning();

    return link ?? null;
  }

  async delete(id: string, profileId: string) {
    const [deleted] = await db
      .delete(socialLinks)
      .where(and(eq(socialLinks.id, id), eq(socialLinks.profileId, profileId)))
      .returning();

    return deleted ?? null;
  }
}

export const socialLinkRepository = new SocialLinkRepository();
