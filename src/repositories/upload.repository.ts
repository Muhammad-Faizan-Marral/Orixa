import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { uploads } from "@/db/schema";

export class UploadRepository {
  async findById(id: string, profileId: string) {
    const [result] = await db
      .select()
      .from(uploads)
      .where(and(eq(uploads.id, id), eq(uploads.profileId, profileId)))
      .limit(1);

    return result ?? null;
  }

  async findByProfileId(profileId: string) {
    return db
      .select()
      .from(uploads)
      .where(
        and(eq(uploads.profileId, profileId), eq(uploads.status, "active")),
      )
      .orderBy(desc(uploads.createdAt));
  }

  async create(data: {
    profileId: string;
    type: string;
    url: string;
    mimeType?: string | null;
    size?: number | null;
  }) {
    const [result] = await db
      .insert(uploads)
      .values({
        profileId: data.profileId,
        type: data.type,
        url: data.url,
        mimeType: data.mimeType ?? null,
        size: data.size ?? null,
        status: "active",
      })
      .returning();

    return result;
  }

  async markDeleted(id: string, profileId: string) {
    const [result] = await db
      .update(uploads)
      .set({
        status: "deleted",
      })
      .where(and(eq(uploads.id, id), eq(uploads.profileId, profileId)))
      .returning();

    return result ?? null;
  }
}

export const uploadRepository = new UploadRepository();
