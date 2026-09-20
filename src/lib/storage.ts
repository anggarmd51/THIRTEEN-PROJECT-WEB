import { supabase } from "./supabase";

export const CAR_STORAGE_BUCKET = "car-photos";

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Uploads a car image file to Supabase Storage bucket.
 * Falls back to Base64 Data URL if the bucket is not yet provisioned,
 * ensuring zero broken image links in the preview and instant UI responsiveness.
 */
export async function uploadCarImage(
  file: File,
  folder = "cars"
): Promise<UploadResult> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  try {
    const { data, error } = await supabase.storage
      .from(CAR_STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.warn("Supabase Storage upload warning (fallback to local base64):", error.message);
      // Fallback: convert to base64 so user can immediately preview and save without hard blockers
      const base64Url = await fileToBase64(file);
      return {
        url: base64Url,
        path: fileName,
        error: error.message,
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(CAR_STORAGE_BUCKET).getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (err: any) {
    console.warn("Storage exception, using fallback data URL:", err.message);
    const base64Url = await fileToBase64(file);
    return {
      url: base64Url,
      path: fileName,
      error: err.message,
    };
  }
}

/**
 * Upload multiple car images at once
 */
export async function uploadMultipleCarImages(
  files: File[],
  folder = "cars"
): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map((file) => uploadCarImage(file, folder))
  );
  return results;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
