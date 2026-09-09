import { PUBLIC_UPLOAD_BUCKET } from "@/features/profile/upload.constants";

export function getPublicAssetUrl(storagePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return "";

  return `${supabaseUrl}/storage/v1/object/public/${PUBLIC_UPLOAD_BUCKET}/${storagePath}`;
}
