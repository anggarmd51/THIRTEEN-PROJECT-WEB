import { supabase } from "./supabase";

export const CAR_STORAGE_BUCKET = "car-photos";
export const PORTFOLIO_STORAGE_BUCKET = "portfolio-photos";

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
  return uploadToBucket(file, CAR_STORAGE_BUCKET, folder);
}

/**
 * Uploads a portfolio image file to Supabase Storage bucket.
 */
export async function uploadPortfolioImage(
  file: File,
  folder = "portfolio"
): Promise<UploadResult> {
  return uploadToBucket(file, PORTFOLIO_STORAGE_BUCKET, folder);
}

async function uploadToBucket(
  file: File,
  bucketName: string,
  folder: string
): Promise<UploadResult> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error(`[Storage Upload Error] Gagal upload ke bucket "${bucketName}":`, error);
      const base64Url = await fileToBase64(file);
      return {
        url: base64Url,
        path: fileName,
        error: `Supabase Storage (${bucketName}): ${error.message}`,
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(data.path);

    console.info(`[Storage Upload Success] File berhasil diupload ke "${bucketName}/${data.path}"`);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (err: any) {
    console.error(`[Storage Upload Exception] Terjadi exception saat upload ke "${bucketName}":`, err);
    const base64Url = await fileToBase64(file);
    return {
      url: base64Url,
      path: fileName,
      error: err?.message || "Terjadi error saat upload ke storage",
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

