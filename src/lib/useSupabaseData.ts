import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { CARS_DATA, CarUnit } from "../data/carsData";
import { PORTFOLIO_ITEMS, PortfolioItem } from "../data/portfolioData";

export interface SupabaseCarRow {
  id?: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  badge?: string;
  transmission: string;
  mileage: number;
  engine?: string;
  fuel_type?: string;
  fuelType?: string;
  color?: string;
  tax_status?: string;
  taxStatus?: string;
  plate?: string;
  location?: string;
  main_image?: string;
  mainImage?: string;
  description?: string;
  highlights?: string[] | string;
  gallery?: { title: string; url: string; tag: string }[] | string;
  created_at?: string;
}

export interface SupabasePortfolioRow {
  id?: string;
  category: string;
  badge?: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  imageUrl?: string;
  description?: string;
  car_model?: string;
  carModel?: string;
  treatment_list?: string[] | string;
  treatmentList?: string[] | string;
  created_at?: string;
}

// Helper to normalize Supabase car row into frontend CarUnit
export function mapRowToCarUnit(row: any): CarUnit {
  const priceVal = Number(row.price) || 0;
  const mileageVal = Number(row.mileage) || 0;

  let galleryArr: { title: string; url: string; tag: string }[] = [];
  if (Array.isArray(row.gallery)) {
    galleryArr = row.gallery;
  } else if (typeof row.gallery === "string") {
    try {
      galleryArr = JSON.parse(row.gallery);
    } catch {
      galleryArr = [];
    }
  }

  const mainImg =
    row.main_image ||
    row.mainImage ||
    "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1400&auto=format&fit=crop";

  if (galleryArr.length === 0) {
    galleryArr = [{ title: "Tampak Utama", url: mainImg, tag: "Utama" }];
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
  }

  const fuel = row.fuel_type || row.fuelType || "Bensin";
  const tax = row.tax_status || row.taxStatus || "Pajak Hidup Panjang";

  return {
    id: String(row.id || Math.random()),
    name: row.name || "Unit Mobil",
    brand: row.brand || "Umum",
    model: row.model || row.name || "Sedan / SUV",
    year: Number(row.year) || new Date().getFullYear(),
    price: priceVal,
    formattedPrice: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(priceVal),
    badge: row.badge || "AVAILABLE",
    transmission: row.transmission || "Automatic",
    mileage: mileageVal,
    formattedMileage: `${new Intl.NumberFormat("id-ID").format(mileageVal)} KM`,
    engine: row.engine || "Standar Mesin",
    fuelType: fuel,
    color: row.color || "Hitam / Silver",
    taxStatus: tax,
    plate: row.plate || "BK (Sumatera Utara)",
    location: row.location || "Langkat / Medan",
    mainImage: mainImg,
    gallery: galleryArr,
    description:
      row.description ||
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
      { label: "Kapasitas Mesin", value: row.engine || "Standar Mesin" },
      { label: "Warna Eksterior", value: row.color || "Standar" },
    ],
  };
}

// Helper to normalize Supabase portfolio row
export function mapRowToPortfolioItem(row: any): PortfolioItem {
  let treatments: string[] = [];
  if (Array.isArray(row.treatment_list || row.treatmentList)) {
    treatments = row.treatment_list || row.treatmentList;
  } else if (typeof (row.treatment_list || row.treatmentList) === "string") {
    try {
      treatments = JSON.parse(row.treatment_list || row.treatmentList);
    } catch {
      treatments = (row.treatment_list || row.treatmentList).split("\n").filter(Boolean);
    }
  }

  const validCategory = (row.category || "Detailing") as PortfolioItem["category"];

  return {
    id: String(row.id || Math.random()),
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

// Custom hook to fetch cars with real-time updates and fallback
export function useSupabaseCars() {
  const [cars, setCars] = useState<CarUnit[]>(CARS_DATA);
  const [loading, setLoading] = useState(true);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setCars(data.map(mapRowToCarUnit));
        setIsUsingSupabase(true);
      } else {
        // Fallback to CARS_DATA if table is empty or error
        setCars(CARS_DATA);
        setIsUsingSupabase(false);
      }
    } catch {
      setCars(CARS_DATA);
      setIsUsingSupabase(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();

    // Listen to real-time changes on 'cars' table
    try {
      const channel = supabase
        .channel("public:cars")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "cars" },
          () => {
            fetchCars();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // ignore subscription errors if keys are not ready
    }
  }, []);

  return { cars, loading, isUsingSupabase, refetch: fetchCars };
}

// Custom hook to fetch portfolios with real-time updates and fallback
export function useSupabasePortfolios() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>(PORTFOLIO_ITEMS);
  const [loading, setLoading] = useState(true);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  const fetchPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setPortfolios(data.map(mapRowToPortfolioItem));
        setIsUsingSupabase(true);
      } else {
        setPortfolios(PORTFOLIO_ITEMS);
        setIsUsingSupabase(false);
      }
    } catch {
      setPortfolios(PORTFOLIO_ITEMS);
      setIsUsingSupabase(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();

    // Listen to real-time changes on 'portfolios' table
    try {
      const channel = supabase
        .channel("public:portfolios")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "portfolios" },
          () => {
            fetchPortfolios();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // ignore
    }
  }, []);

  return { portfolios, loading, isUsingSupabase, refetch: fetchPortfolios };
}
