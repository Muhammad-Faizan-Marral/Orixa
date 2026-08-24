import { z } from "zod";

export const uploadTypeSchema = z.enum(["avatar", "project-image", "resume"]);

export type UploadType = z.infer<typeof uploadTypeSchema>;
