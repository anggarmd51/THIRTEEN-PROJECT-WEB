export interface GalleryPhotoItem {
  title: string;
  url: string;
  tag: string;
}

export interface CarSpecItem {
  label: string;
  value: string;
}

/**
 * Raw Row representation in Supabase `cars` table
 */
export interface SupabaseCarRow {
  id: string;
  name?: string;
  title?: string;
  brand?: string;
  model?: string;
  category?: string;
  year: number;
  price: number;
  badge?: string;
  transmission: string;
  mileage: number | string;
  engine?: string;
  fuel?: string;
  fuel_type?: string;
  fuelType?: string;
  color?: string;
  tax_status?: string;
  taxStatus?: string;
  plate?: string;
  location?: string;
  main_image?: string;
  mainImage?: string;
  image_url?: string;
  imageUrl?: string;
  description?: string;
  highlights?: string[] | string;
  gallery?: GalleryPhotoItem[] | string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Normalized Car Unit used across the frontend interface
 */
export interface CarUnit {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  formattedPrice: string;
  badge: string;
  transmission: string;
  mileage: number;
  formattedMileage: string;
  engine: string;
  fuelType: string;
  color: string;
  taxStatus: string;
  plate: string;
  location: string;
  mainImage: string;
  gallery: GalleryPhotoItem[];
  description: string;
  highlights: string[];
  specs: CarSpecItem[];
}

/**
 * Raw Row representation in Supabase `portfolio` table
 */
export interface SupabasePortfolioRow {
  id: string;
  title: string;
  category: "Detailing" | "Biled" | "Carwash" | "Semua" | "Pemasangan Biled" | "Cuci Mobil Premium" | "Interior & Mesin";
  badge?: string;
  subtitle?: string;
  image_url: string;
  imageUrl?: string;
  description?: string;
  car_model?: string;
  carModel?: string;
  treatment_list?: string[] | string;
  treatmentList?: string[] | string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Normalized Portfolio Item used across the frontend interface
 */
export interface PortfolioItem {
  id: string;
  category: "Semua" | "Detailing" | "Pemasangan Biled" | "Cuci Mobil Premium" | "Interior & Mesin";
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  carModel: string;
  treatmentList: string[];
}

export interface CarFormData {
  name: string;
  model: string;
  brand: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel_type: string;
  color: string;
  engine: string;
  tax_status: string;
  plate: string;
  location: string;
  badge: string;
  description: string;
  main_image: string;
  highlights: string[];
  gallery: GalleryPhotoItem[];
}

export interface PortfolioFormData {
  title: string;
  category: "Detailing" | "Biled" | "Carwash" | "Semua" | "Pemasangan Biled" | "Cuci Mobil Premium" | "Interior & Mesin";
  badge: string;
  subtitle: string;
  image_url: string;
  description: string;
  car_model: string;
  treatment_list?: string[];
}

