import { supabase } from "./supabase";
import {
  CarUnit,
  PortfolioItem,
  SupabaseCarRow,
  SupabasePortfolioRow,
  CarFormData,
  PortfolioFormData,
  GalleryPhotoItem,
} from "../types";

/**
 * Normalizes Supabase car row into typed CarUnit for frontend presentation
 */
export function buildCarPayload(formData: CarFormData): Record<string, any> {
  const currentGallery: GalleryPhotoItem[] =
    Array.isArray(formData.gallery) && formData.gallery.length > 0
      ? formData.gallery
      : [{ title: formData.name || "Foto Utama", url: formData.main_image, tag: "Depan" }];

  const currentHighlights: string[] =
    Array.isArray(formData.highlights)
      ? formData.highlights.filter(Boolean)
      : [];

  const metadata = {
    name: formData.name,
    brand: formData.brand || "Umum",
    model: formData.model || formData.name,
    badge: formData.badge || "AVAILABLE",
    engine: formData.engine || "",
    plate: formData.plate || "",
    highlights: currentHighlights,
    gallery: currentGallery,
  };

  const rawDesc = (formData.description || "").replace(/<!--JSON_METADATA:[\s\S]*?-->/g, "").trim();
  const descWithMeta = `${rawDesc}\n\n<!--JSON_METADATA:${JSON.stringify(metadata)}-->`;

  return {
    title: String(formData.name || formData.model || "Unit Mobil").trim(),
    category: String(formData.badge || formData.model || "AVAILABLE").trim(),
    price: Number(formData.price) || 0,
    year: Number(formData.year) || new Date().getFullYear(),
    transmission: String(formData.transmission || "Automatic (CVT)").trim(),
    mileage: String(formData.mileage ?? 0),
    fuel: String(formData.fuel_type || "Bensin").trim(),
    color: String(formData.color || "Hitam Metalik").trim(),
    tax_status: String(formData.tax_status || "Pajak Hidup").trim(),
    location: String(formData.location || "Langkat / Medan").trim(),
    description: descWithMeta,
    image_url: String(formData.main_image || "").trim(),
  };
}

export function mapRowToCarUnit(row: Partial<SupabaseCarRow>): CarUnit {
  let rawDesc = row.description || "";
  let meta: Record<string, any> = {};
  const metaMatch = rawDesc.match(/<!--JSON_METADATA:([\s\S]*?)-->/);
  if (metaMatch) {
    try {
      meta = JSON.parse(metaMatch[1]);
      rawDesc = rawDesc.replace(/<!--JSON_METADATA:[\s\S]*?-->/g, "").trim();
    } catch {
      // ignore parse failure
    }
  }

  const priceVal = Number(row.price) || 0;
  const mileageVal = Number(row.mileage) || 0;

  let galleryArr: GalleryPhotoItem[] = [];
  if (Array.isArray(row.gallery)) {
    galleryArr = row.gallery as GalleryPhotoItem[];
  } else if (typeof row.gallery === "string") {
    try {
      galleryArr = JSON.parse(row.gallery);
    } catch {
      galleryArr = [];
    }
  } else if (Array.isArray(meta.gallery)) {
    galleryArr = meta.gallery;
  }

  const mainImg =
    row.main_image ||
    row.mainImage ||
    row.image_url ||
    row.imageUrl ||
    meta.main_image ||
    "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1400&auto=format&fit=crop";

  const carName = row.name || row.title || meta.name || "Unit Mobil";
  const carBrand = row.brand || meta.brand || "Umum";
  const carModel = row.model || meta.model || row.title || row.name || "Sedan / SUV";
  const carBadge = row.badge || meta.badge || row.category || "AVAILABLE";
  const carEngine = row.engine || meta.engine || "Standar Mesin";
  const carPlate = row.plate || meta.plate || "BK (Sumatera Utara)";

  if (galleryArr.length === 0) {
    galleryArr = [{ title: carName, url: mainImg, tag: "Utama" }];
  }

  let highlightsArr: string[] = [];
  if (Array.isArray(row.highlights)) {
    highlightsArr = row.highlights;
  } else if (typeof row.highlights === "string") {
    try {
      highlightsArr = JSON.parse(row.highlights);
    } catch {
      highlightsArr = row.highlights.split("\n").filter(Boolean);
    }
  } else if (Array.isArray(meta.highlights)) {
    highlightsArr = meta.highlights;
  }

  const fuel = row.fuel || row.fuel_type || row.fuelType || meta.fuel_type || "Bensin";
  const tax = row.tax_status || row.taxStatus || "Pajak Hidup Panjang";

  return {
    id: String(row.id || `car-${Date.now()}`),
    name: carName,
    brand: carBrand,
    model: carModel,
    year: Number(row.year) || new Date().getFullYear(),
    price: priceVal,
    formattedPrice: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(priceVal),
    badge: carBadge,
    transmission: row.transmission || "Automatic",
    mileage: mileageVal,
    formattedMileage: `${new Intl.NumberFormat("id-ID").format(mileageVal)} KM`,
    engine: carEngine,
    fuelType: fuel,
    color: row.color || "Hitam / Silver",
    taxStatus: tax,
    plate: carPlate,
    location: row.location || "Langkat / Medan",
    mainImage: mainImg,
    gallery: galleryArr,
    description:
      rawDesc ||
      "Unit pilihan dengan inspeksi komprehensif, siap pakai tanpa kendala.",
    highlights:
      highlightsArr.length > 0
        ? highlightsArr
        : [
            "150+ Titik Inspeksi Lolos",
            "Bukan Bekas Tabrakan & Bebas Banjir",
            "Surat-Surat Lengkap & Terverifikasi",
          ],
    specs: [
      { label: "Tahun Perakitan", value: String(row.year || 2021) },
      { label: "Jarak Tempuh", value: `${new Intl.NumberFormat("id-ID").format(mileageVal)} KM` },
      { label: "Transmisi", value: row.transmission || "Automatic" },
      { label: "Bahan Bakar", value: fuel },
      { label: "Kapasitas Mesin", value: carEngine },
      { label: "Warna Eksterior", value: row.color || "Standar" },
    ],
  };
}

/**
 * Normalizes Supabase portfolio row into typed PortfolioItem
 */
export function mapRowToPortfolioItem(row: Partial<SupabasePortfolioRow>): PortfolioItem {
  let treatments: string[] = [];
  const rawTreatments = row.treatment_list || row.treatmentList;
  if (Array.isArray(rawTreatments)) {
    treatments = rawTreatments;
  } else if (typeof rawTreatments === "string") {
    try {
      treatments = JSON.parse(rawTreatments);
    } catch {
      treatments = rawTreatments.split("\n").filter(Boolean);
    }
  }

  const validCategory = (row.category || "Detailing") as PortfolioItem["category"];

  return {
    id: String(row.id || `portfolio-${Date.now()}`),
    category: validCategory,
    badge: row.badge || `${row.category?.toUpperCase() || "WORK"} / 01`,
    title: row.title || "Hasil Pengerjaan",
    subtitle: row.subtitle || "Crafted to perfection.",
    imageUrl:
      row.image_url ||
      row.imageUrl ||
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
    description:
      row.description ||
      "Hasil pengerjaan berstandar tinggi dengan material premium dan ketelitian maksimal.",
    carModel: row.car_model || row.carModel || "Kendaraan Pelanggan",
    treatmentList:
      treatments.length > 0
        ? treatments
        : ["Perawatan Komprehensif", "Material Premium Teruji", "Proteksi Maksimal"],
  };
}

// ==========================================
// CARS CRUD OPERATIONS
// ==========================================

export async function fetchCarsFromSupabase(): Promise<{ data: CarUnit[]; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: new Error(error.message) };
    }

    const mapped = (data || []).map(mapRowToCarUnit);
    return { data: mapped, error: null };
  } catch (err: any) {
    return { data: [], error: new Error(err.message || "Failed to fetch cars") };
  }
}

export async function insertCarToSupabase(formData: CarFormData): Promise<{ data: any; error: Error | null }> {
  const payload = buildCarPayload(formData);

  try {
    const { data, error } = await supabase.from("cars").insert([payload]).select().single();
    if (error) {
      return { data: null, error: new Error(error.message) };
    }
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || "Gagal menyimpan mobil ke Supabase") };
  }
}

export async function updateCarInSupabase(
  id: string,
  formData: CarFormData
): Promise<{ data: any; error: Error | null }> {
  const payload = buildCarPayload(formData);

  try {
    const { data, error } = await supabase.from("cars").update(payload).eq("id", id).select().single();
    if (error) {
      return { data: null, error: new Error(error.message) };
    }
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || "Gagal memperbarui unit di Supabase") };
  }
}

export async function deleteCarFromSupabase(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) {
      return { error: new Error(error.message) };
    }
    return { error: null };
  } catch (err: any) {
    return { error: new Error(err.message || "Gagal menghapus unit dari Supabase") };
  }
}

// ==========================================
// PORTFOLIO CRUD OPERATIONS (Supports 'portfolio' or 'portfolios')
// ==========================================

export async function fetchPortfoliosFromSupabase(): Promise<{ data: PortfolioItem[]; error: Error | null }> {
  try {
    // Try primary 'portfolio' table first
    let res = await supabase.from("portfolio").select("*").order("created_at", { ascending: false });

    // If 'portfolio' table doesn't exist or errored, try 'portfolios'
    if (res.error) {
      const fallbackRes = await supabase
        .from("portfolios")
        .select("*")
        .order("created_at", { ascending: false });
      if (!fallbackRes.error) {
        res = fallbackRes;
      }
    }

    if (res.error) {
      return { data: [], error: new Error(res.error.message) };
    }

    const mapped = (res.data || []).map(mapRowToPortfolioItem);
    return { data: mapped, error: null };
  } catch (err: any) {
    return { data: [], error: new Error(err.message || "Failed to fetch portfolio") };
  }
}

export async function insertPortfolioToSupabase(
  formData: PortfolioFormData
): Promise<{ data: any; error: Error | null }> {
  const payload = {
    title: formData.title,
    category: formData.category,
    badge: formData.badge,
    subtitle: formData.subtitle,
    image_url: formData.image_url,
    description: formData.description,
    car_model: formData.car_model,
    treatment_list: formData.treatment_list || [
      "Perawatan Komprehensif",
      "Material Premium Teruji",
      "Garansi Resmi Hasil Pengerjaan",
    ],
  };

  try {
    // Try 'portfolio' table first
    let { data, error } = await supabase.from("portfolio").insert([payload]).select().single();
    if (error) {
      // Fallback try 'portfolios'
      const fallback = await supabase.from("portfolios").insert([payload]).select().single();
      if (!fallback.error) {
        return { data: fallback.data, error: null };
      }
      return { data: null, error: new Error(error.message) };
    }
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || "Gagal menyimpan portofolio") };
  }
}

export async function updatePortfolioInSupabase(
  id: string,
  formData: PortfolioFormData
): Promise<{ data: any; error: Error | null }> {
  const payload = {
    title: formData.title,
    category: formData.category,
    badge: formData.badge,
    subtitle: formData.subtitle,
    image_url: formData.image_url,
    description: formData.description,
    car_model: formData.car_model,
    updated_at: new Date().toISOString(),
  };

  try {
    let { data, error } = await supabase.from("portfolio").update(payload).eq("id", id).select().single();
    if (error) {
      const fallback = await supabase.from("portfolios").update(payload).eq("id", id).select().single();
      if (!fallback.error) {
        return { data: fallback.data, error: null };
      }
      return { data: null, error: new Error(error.message) };
    }
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || "Gagal memperbarui portofolio") };
  }
}

export async function deletePortfolioFromSupabase(id: string): Promise<{ error: Error | null }> {
  try {
    let { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) {
      const fallback = await supabase.from("portfolios").delete().eq("id", id);
      if (!fallback.error) {
        return { error: null };
      }
      return { error: new Error(error.message) };
    }
    return { error: null };
  } catch (err: any) {
    return { error: new Error(err.message || "Gagal menghapus portofolio") };
  }
}
