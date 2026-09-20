import { useState, useEffect, useRef } from "react";
import {
  Car,
  Layers,
  Plus,
  Trash2,
  Edit3,
  LogOut,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  ArrowLeft,
  X,
  Upload,
  Camera,
  Check,
  PlusCircle,
  Trash,
  Tag
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { mapRowToCarUnit, mapRowToPortfolioItem } from "../lib/useSupabaseData";
import { CARS_DATA } from "../data/carsData";
import { PORTFOLIO_ITEMS } from "../data/portfolioData";
import { uploadCarImage, uploadMultipleCarImages } from "../lib/storage";
import Logo from "./Logo";

interface AdminDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

interface GalleryPhotoItem {
  title: string;
  url: string;
  tag: string;
}

export default function AdminDashboard({ userEmail, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"cars" | "portfolios">("cars");

  // Cars State
  const [cars, setCars] = useState<any[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [carModalOpen, setCarModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);

  // Car Form Data with full specs matching Honda Civic Turbo example
  const [carFormData, setCarFormData] = useState({
    name: "",
    model: "",
    brand: "",
    year: 2022,
    price: 450000000,
    mileage: 28000,
    transmission: "Automatic (CVT)",
    fuel_type: "Bensin",
    color: "",
    engine: "",
    tax_status: "Pajak Hidup Panjang",
    plate: "BK (Sumatera Utara)",
    location: "Langkat / Medan",
    badge: "SPORTY DAILY",
    description: "",
    main_image: "",
    highlights: [
      "Service Record Rutin Bengkel Resmi",
      "Odometer Asli (Garansi Bukan Putaran)",
      "Bukan Bekas Tabrakan & Bebas Banjir 100%"
    ] as string[],
    gallery: [] as GalleryPhotoItem[]
  });

  // State for dynamic highlight input
  const [newHighlightInput, setNewHighlightInput] = useState("");

  // Upload States
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Portfolio State
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [portfolioFormData, setPortfolioFormData] = useState({
    title: "",
    category: "Detailing",
    badge: "WORK / 01",
    subtitle: "Crafted to perfection.",
    image_url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
    description: "Hasil pengerjaan berstandar tinggi dengan material berkualitas dan ketelitian maksimal.",
    car_model: "Honda Civic / Toyota Fortuner"
  });

  // Feedback notifications
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto clear alert
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Fetch cars
  const fetchCars = async () => {
    setLoadingCars(true);
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase cars error:", error.message);
        // Show mock CARS_DATA as fallback preview
        setCars(CARS_DATA);
      } else if (data && data.length > 0) {
        setCars(data);
      } else {
        setCars(CARS_DATA);
      }
    } catch (err: any) {
      console.warn("Fetch error:", err.message);
      setCars(CARS_DATA);
    } finally {
      setLoadingCars(false);
    }
  };

  // Fetch portfolios
  const fetchPortfolios = async () => {
    setLoadingPortfolios(true);
    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase portfolios error:", error.message);
        setPortfolios(PORTFOLIO_ITEMS);
      } else if (data && data.length > 0) {
        setPortfolios(data);
      } else {
        setPortfolios(PORTFOLIO_ITEMS);
      }
    } catch (err: any) {
      console.warn("Fetch error:", err.message);
      setPortfolios(PORTFOLIO_ITEMS);
    } finally {
      setLoadingPortfolios(false);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchPortfolios();
  }, []);

  // Handle Main Image File Upload
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMain(true);
    try {
      const result = await uploadCarImage(file, "cars/main");
      setCarFormData((prev) => ({
        ...prev,
        main_image: result.url
      }));

      // Also ensure it is present in the gallery as first photo if gallery empty
      setCarFormData((prev) => {
        if (prev.gallery.length === 0) {
          return {
            ...prev,
            gallery: [{ title: prev.name || "Foto Depan", url: result.url, tag: "Depan" }]
          };
        }
        return prev;
      });

      setAlert({
        type: "success",
        text: "Foto utama berhasil diunggah!"
      });
    } catch (err: any) {
      setAlert({
        type: "error",
        text: `Gagal mengunggah foto: ${err.message}`
      });
    } finally {
      setIsUploadingMain(false);
    }
  };

  // Handle Additional Gallery Images Multi-Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    try {
      const fileList = Array.from(files);
      const results = await uploadMultipleCarImages(fileList, "cars/gallery");

      const newPhotos: GalleryPhotoItem[] = results.map((res, i) => {
        const tagOptions = ["Samping", "Belakang", "Interior", "Dashboard", "Mesin", "Detail"];
        const chosenTag = tagOptions[i % tagOptions.length];
        return {
          title: `Galeri ${chosenTag}`,
          url: res.url,
          tag: chosenTag
        };
      });

      setCarFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newPhotos]
      }));

      setAlert({
        type: "success",
        text: `${results.length} foto galeri tambahan berhasil diunggah!`
      });
    } catch (err: any) {
      setAlert({
        type: "error",
        text: `Gagal mengunggah galeri: ${err.message}`
      });
    } finally {
      setIsUploadingGallery(false);
    }
  };

  // Remove photo from gallery
  const handleRemoveGalleryPhoto = (index: number) => {
    setCarFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== index)
    }));
  };

  // Add a highlight bullet point
  const handleAddHighlight = () => {
    const trimmed = newHighlightInput.trim();
    if (!trimmed) return;
    setCarFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, trimmed]
    }));
    setNewHighlightInput("");
  };

  // Remove a highlight bullet point
  const handleRemoveHighlight = (index: number) => {
    setCarFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== index)
    }));
  };

  // Save / Update Car
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carFormData.main_image) {
      setAlert({
        type: "error",
        text: "Silakan unggah minimal 1 Foto Utama kendaraan terlebih dahulu."
      });
      return;
    }

    setSubmitting(true);
    setAlert(null);

    // Make sure gallery contains at least the main image
    let currentGallery = carFormData.gallery;
    if (currentGallery.length === 0 && carFormData.main_image) {
      currentGallery = [{ title: carFormData.name, url: carFormData.main_image, tag: "Depan" }];
    }

    const payload = {
      name: carFormData.name,
      model: carFormData.model || carFormData.name,
      brand: carFormData.brand || "Umum",
      year: Number(carFormData.year),
      price: Number(carFormData.price),
      mileage: Number(carFormData.mileage),
      transmission: carFormData.transmission,
      fuel_type: carFormData.fuel_type,
      color: carFormData.color,
      engine: carFormData.engine,
      tax_status: carFormData.tax_status,
      plate: carFormData.plate,
      location: carFormData.location,
      badge: carFormData.badge,
      description: carFormData.description,
      main_image: carFormData.main_image,
      highlights: carFormData.highlights,
      gallery: currentGallery
    };

    try {
      if (editingCarId) {
        // UPDATE
        const { error } = await supabase
          .from("cars")
          .update(payload)
          .eq("id", editingCarId);

        if (error) {
          // If table schema differs or offline fallback, update local state for instant responsive preview
          setCars((prev) =>
            prev.map((c) => (c.id === editingCarId ? { ...c, ...payload } : c))
          );
          setAlert({
            type: "success",
            text: `Unit berhasil diperbarui secara lokal. (Catatan: Sambungkan tabel 'cars' di Supabase untuk sinkronisasi cloud).`
          });
        } else {
          setAlert({ type: "success", text: "Unit mobil berhasil diperbarui di Supabase!" });
          fetchCars();
        }
      } else {
        // INSERT
        const { error } = await supabase.from("cars").insert([payload]);

        if (error) {
          // Local fallback insert
          const newCar = {
            id: `local-${Date.now()}`,
            ...payload
          };
          setCars([newCar, ...cars]);
          setAlert({
            type: "success",
            text: `Unit baru ditambahkan secara lokal. (Catatan: Sambungkan tabel 'cars' di Supabase untuk sinkronisasi cloud).`
          });
        } else {
          setAlert({ type: "success", text: "Unit mobil baru berhasil disimpan ke Supabase!" });
          fetchCars();
        }
      }

      setCarModalOpen(false);
      setEditingCarId(null);
    } catch (err: any) {
      setAlert({ type: "error", text: `Gagal menyimpan: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Car
  const handleDeleteCar = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus unit "${name}"?`)) return;

    try {
      const { error } = await supabase.from("cars").delete().eq("id", id);
      if (error) {
        setCars((prev) => prev.filter((c) => c.id !== id));
        setAlert({
          type: "success",
          text: `Unit "${name}" dihapus dari tampilan.`
        });
      } else {
        setAlert({ type: "success", text: `Unit "${name}" berhasil dihapus dari database.` });
        fetchCars();
      }
    } catch (err: any) {
      setCars((prev) => prev.filter((c) => c.id !== id));
      setAlert({ type: "success", text: `Unit "${name}" dihapus.` });
    }
  };

  // Open Edit Car Modal
  const openEditCar = (car: any) => {
    setEditingCarId(car.id);

    let parsedHighlights: string[] = [];
    if (Array.isArray(car.highlights)) {
      parsedHighlights = car.highlights;
    } else if (typeof car.highlights === "string") {
      try {
        parsedHighlights = JSON.parse(car.highlights);
      } catch {
        parsedHighlights = car.highlights.split("\n").filter(Boolean);
      }
    }

    let parsedGallery: GalleryPhotoItem[] = [];
    if (Array.isArray(car.gallery)) {
      parsedGallery = car.gallery;
    } else if (typeof car.gallery === "string") {
      try {
        parsedGallery = JSON.parse(car.gallery);
      } catch {
        parsedGallery = [];
      }
    }

    setCarFormData({
      name: car.name || "",
      model: car.model || car.name || "",
      brand: car.brand || "",
      year: car.year || 2021,
      price: car.price || 0,
      mileage: car.mileage || 0,
      transmission: car.transmission || "Automatic (CVT)",
      fuel_type: car.fuel_type || car.fuelType || "Bensin",
      color: car.color || "",
      engine: car.engine || "",
      tax_status: car.tax_status || car.taxStatus || "Pajak Hidup Panjang",
      plate: car.plate || "BK (Sumatera Utara)",
      location: car.location || "Langkat / Medan",
      badge: car.badge || "AVAILABLE",
      description: car.description || "",
      main_image: car.main_image || car.mainImage || "",
      highlights:
        parsedHighlights.length > 0
          ? parsedHighlights
          : [
              "Service Record Rutin Bengkel Resmi",
              "Odometer Asli (Garansi Bukan Putaran)",
              "Bukan Bekas Tabrakan & Bebas Banjir 100%"
            ],
      gallery: parsedGallery
    });
    setCarModalOpen(true);
  };

  // Open Add Car Modal with rich presets (matching Honda Civic Turbo caliber)
  const openAddCar = () => {
    setEditingCarId(null);
    setCarFormData({
      name: "Honda Civic Turbo",
      model: "Civic 1.5 VTEC Turbo Sedan",
      brand: "Honda",
      year: 2021,
      price: 478000000,
      mileage: 28400,
      transmission: "Automatic (CVT)",
      fuel_type: "Bensin (Pertamax / Shell)",
      color: "Sonic Gray Pearl (Lapis Coating Ceramic)",
      engine: "1.5L DOHC VTEC Turbocharged (173 PS)",
      tax_status: "Pajak Hidup Panjang (s/d November 2025)",
      plate: "BK (Sumatera Utara) - Tangan Pertama",
      location: "Langkat / Medan",
      badge: "SPORTY DAILY",
      description:
        "Kondisi sangat istimewa, rawatan bengkel resmi Honda dengan service record tercatat rapi. Mobil milik perorangan tangan pertama dari baru. Cat eksterior original mulus telah diproteksi 3-layer Nano Ceramic Coating di THIRTEEN PROJECT. Tidak pernah terkena banjir ataupun insiden tabrakan, interior bersih higienis dan wangi segar.",
      main_image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1400&auto=format&fit=crop",
      highlights: [
        "Service Record Rutin Bengkel Resmi Honda",
        "Odometer Asli 28.400 KM (Garansi Bukan Putaran)",
        "Sudah Terpasang Nano Ceramic Coating 3-Layer",
        "Kunci Serep & Buku Servis/Manual Lengkap",
        "Ban 4 Unit Masih Tebal 90% Siap Luar Kota",
        "Bukan Bekas Tabrakan Fatal & Bebas Banjir 100%"
      ],
      gallery: [
        {
          title: "Tampak Depan & Lampu Biled",
          url: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1400&auto=format&fit=crop",
          tag: "Depan"
        },
        {
          title: "Sisi Samping & Velg Sporty",
          url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1400&auto=format&fit=crop",
          tag: "Samping"
        }
      ]
    });
    setCarModalOpen(true);
  };

  // Save / Update Portfolio
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert(null);

    const payload = {
      title: portfolioFormData.title,
      category: portfolioFormData.category,
      badge: portfolioFormData.badge,
      subtitle: portfolioFormData.subtitle,
      image_url: portfolioFormData.image_url,
      description: portfolioFormData.description,
      car_model: portfolioFormData.car_model
    };

    try {
      if (editingPortfolioId) {
        // UPDATE
        const { error } = await supabase
          .from("portfolios")
          .update(payload)
          .eq("id", editingPortfolioId);

        if (error) {
          setPortfolios((prev) =>
            prev.map((p) => (p.id === editingPortfolioId ? { ...p, ...payload } : p))
          );
          setAlert({
            type: "success",
            text: "Portofolio diperbarui secara lokal. (Tabel Supabase belum terhubung)."
          });
        } else {
          setAlert({ type: "success", text: "Portofolio berhasil diperbarui di Supabase!" });
          fetchPortfolios();
        }
      } else {
        // INSERT
        const { error } = await supabase.from("portfolios").insert([payload]);

        if (error) {
          const newPortfolio = {
            id: `local-port-${Date.now()}`,
            ...payload
          };
          setPortfolios([newPortfolio, ...portfolios]);
          setAlert({
            type: "success",
            text: "Portofolio baru ditambahkan secara lokal."
          });
        } else {
          setAlert({ type: "success", text: "Portofolio baru berhasil disimpan ke Supabase!" });
          fetchPortfolios();
        }
      }

      setPortfolioModalOpen(false);
      setEditingPortfolioId(null);
    } catch (err: any) {
      setAlert({ type: "error", text: `Gagal menyimpan: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Portfolio
  const handleDeletePortfolio = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus portofolio "${title}"?`)) return;

    try {
      const { error } = await supabase.from("portfolios").delete().eq("id", id);
      if (error) {
        setPortfolios((prev) => prev.filter((p) => p.id !== id));
        setAlert({ type: "success", text: `Portofolio "${title}" dihapus.` });
      } else {
        setAlert({ type: "success", text: `Portofolio "${title}" berhasil dihapus dari database.` });
        fetchPortfolios();
      }
    } catch {
      setPortfolios((prev) => prev.filter((p) => p.id !== id));
      setAlert({ type: "success", text: `Portofolio "${title}" dihapus.` });
    }
  };

  // Open Edit Portfolio
  const openEditPortfolio = (p: any) => {
    setEditingPortfolioId(p.id);
    setPortfolioFormData({
      title: p.title || "",
      category: p.category || "Detailing",
      badge: p.badge || "WORK / 01",
      subtitle: p.subtitle || "",
      image_url: p.image_url || p.imageUrl || "",
      description: p.description || "",
      car_model: p.car_model || p.carModel || ""
    });
    setPortfolioModalOpen(true);
  };

  // Open Add Portfolio
  const openAddPortfolio = () => {
    setEditingPortfolioId(null);
    setPortfolioFormData({
      title: "Custom Biled Projector 3 Inch",
      category: "Biled",
      badge: "LIGHT / 08",
      subtitle: "Ultimate Night Visibility with Laser Highbeam.",
      image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
      description: "Upgrade retrofit lampu utama biled projector premium dengan cut-off cahaya sangat tajam, bebas silau bagi pengendara lain, dan garansi resmi.",
      car_model: "Honda Civic Sedan"
    });
    setPortfolioModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0C0D0F] text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#121316] border-b border-[#22242B] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href="/"
            title="Ke Halaman Utama"
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <a href="/" className="inline-block transition-opacity hover:opacity-90">
            <Logo className="h-7 sm:h-8" />
          </a>
          <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
            SUPABASE DASHBOARD
          </span>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs font-mono text-neutral-400">
            {userEmail}
          </span>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:underline font-mono"
          >
            <span>Lihat Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-900/60 hover:border-red-600 bg-red-950/20 hover:bg-red-900/40 text-red-300 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Alert Banner */}
        {alert && (
          <div
            className={`p-4 border text-xs flex items-start gap-2.5 transition-all ${
              alert.type === "success"
                ? "bg-emerald-950/50 border-emerald-600 text-emerald-200"
                : "bg-red-950/50 border-red-600 text-red-200"
            }`}
          >
            {alert.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">{alert.text}</div>
            <button onClick={() => setAlert(null)} className="text-neutral-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Dashboard Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#22242B]">
          <div>
            <h1 className="text-xl sm:text-2xl font-light tracking-tight text-white">
              Pusat Manajemen Konten & Unit
            </h1>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Kelola katalog mobil bekas pilihan dan galeri portofolio yang tersinkronisasi dengan Supabase.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "cars" ? (
              <button
                onClick={openAddCar}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-semibold text-xs tracking-wider uppercase transition-colors shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>TAMBAH UNIT MOBIL</span>
              </button>
            ) : (
              <button
                onClick={openAddPortfolio}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-semibold text-xs tracking-wider uppercase transition-colors shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>TAMBAH PORTOFOLIO</span>
              </button>
            )}

            <button
              onClick={() => {
                fetchCars();
                fetchPortfolios();
              }}
              title="Refresh Data"
              className="p-2 border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/5">
          <button
            onClick={() => setActiveTab("cars")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "cars"
                ? "border-[#D4AF37] text-[#D4AF37] font-semibold bg-[#D4AF37]/5"
                : "border-transparent text-neutral-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Katalog Mobil Bekas ({cars.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("portfolios")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "portfolios"
                ? "border-[#D4AF37] text-[#D4AF37] font-semibold bg-[#D4AF37]/5"
                : "border-transparent text-neutral-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Portofolio Hasil Kerja ({portfolios.length})</span>
          </button>
        </div>

        {/* TAB 1: CARS CONTENT */}
        {activeTab === "cars" && (
          <div>
            <div className="bg-[#121316] border border-[#22242B] overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-white">
                    Daftar Stok Unit Mobil
                  </h3>
                  <p className="text-xs text-neutral-400 font-light mt-0.5">
                    Unit aktif yang tampil pada halaman katalog mobil beranda & modal detail unit.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#D4AF37]">
                  Total: {cars.length} Unit
                </span>
              </div>

              {/* Table of Cars */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#16171B] border-b border-white/5 text-neutral-400 font-mono tracking-wider uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Foto & Unit</th>
                      <th className="py-3 px-4">Tahun / Transmisi</th>
                      <th className="py-3 px-4">Harga Jual</th>
                      <th className="py-3 px-4">Kilometer</th>
                      <th className="py-3 px-4">Badge</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {cars.map((car) => {
                      const img = car.main_image || car.mainImage;
                      const formattedPrice =
                        typeof car.price === "number"
                          ? new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              maximumFractionDigits: 0
                            }).format(car.price)
                          : car.formattedPrice || String(car.price);

                      return (
                        <tr key={car.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={img}
                                alt={car.name}
                                className="w-14 h-10 object-cover border border-white/10 bg-black shrink-0"
                              />
                              <div>
                                <span className="font-medium text-white block text-sm">
                                  {car.name}
                                </span>
                                <span className="text-[11px] text-neutral-400 font-mono block">
                                  {car.model || car.brand} • {car.plate || "BK"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-neutral-300 font-mono">
                            {car.year} • {car.transmission}
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-[#D4AF37]">
                            {formattedPrice}
                          </td>
                          <td className="py-3 px-4 font-mono text-neutral-400">
                            {typeof car.mileage === "number"
                              ? `${new Intl.NumberFormat("id-ID").format(car.mileage)} KM`
                              : car.mileage}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase border border-white/10 bg-white/5 text-neutral-300">
                              {car.badge || "AVAILABLE"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openEditCar(car)}
                                className="p-1.5 border border-white/10 hover:border-[#D4AF37] text-neutral-300 hover:text-[#D4AF37] transition-colors"
                                title="Edit Unit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCar(car.id, car.name)}
                                className="p-1.5 border border-white/10 hover:border-red-500 text-neutral-300 hover:text-red-400 transition-colors"
                                title="Hapus Unit"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PORTFOLIO CONTENT */}
        {activeTab === "portfolios" && (
          <div>
            <div className="bg-[#121316] border border-[#22242B] overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-white">
                    Galeri Hasil Pengerjaan (Portofolio)
                  </h3>
                  <p className="text-xs text-neutral-400 font-light mt-0.5">
                    Ditampilkan pada carousel slider portofolio di beranda.
                  </p>
                </div>
              </div>

              {/* Grid of Portfolios */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.map((item) => {
                  const img = item.image_url || item.imageUrl;
                  return (
                    <div
                      key={item.id}
                      className="bg-[#17181C] border border-[#23262D] overflow-hidden flex flex-col justify-between group"
                    >
                      <div className="relative h-48 bg-black overflow-hidden">
                        <img
                          src={img}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-black/80 px-2 py-1 text-[10px] font-mono tracking-wider text-[#D4AF37] border border-[#D4AF37]/30 uppercase">
                          {item.category}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-medium text-white text-sm mb-1 leading-snug">
                            {item.title}
                          </h4>
                          <span className="text-xs text-neutral-400 font-mono block mb-2">
                            {item.car_model || item.carModel || "Semua Tipe Mobil"}
                          </span>
                          <p className="text-xs text-neutral-500 font-light line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                          <span className="text-[11px] font-mono text-neutral-500">
                            {item.badge}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditPortfolio(item)}
                              className="p-1 border border-white/10 hover:border-[#D4AF37] text-neutral-400 hover:text-[#D4AF37]"
                              title="Edit Portofolio"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePortfolio(item.id, item.title)}
                              className="p-1 border border-white/10 hover:border-red-500 text-neutral-400 hover:text-red-400"
                              title="Hapus Portofolio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL FORM: CAR UNIT (Lengkap Sesuai Spesifikasi Honda Civic Turbo) */}
      {carModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#141519] border border-[#272A33] max-w-4xl w-full p-6 sm:p-8 my-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setCarModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2 py-0.5 border border-[#D4AF37]/30">
                INVENTORY MANAGEMENT
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold uppercase tracking-wider text-white">
              {editingCarId ? "Edit Spesifikasi Unit Mobil" : "Tambah Unit Mobil Baru"}
            </h3>
            <p className="text-xs text-neutral-400 font-light mb-6">
              Lengkapi data spesifikasi kendaraan secara presisi sesuai yang tampil pada katalog dan halaman detail unit.
            </p>

            <form onSubmit={handleSaveCar} className="space-y-6 text-xs">
              {/* SECTION A: INFORMASI UTAMA & HARGA */}
              <div className="p-4 bg-[#18191E] border border-white/5 space-y-4">
                <span className="text-[11px] font-mono font-semibold tracking-wider text-[#D4AF37] uppercase block">
                  1. INFORMASI UTAMA & HARGA
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Nama Unit / Judul *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Honda Civic Turbo"
                      value={carFormData.name}
                      onChange={(e) => setCarFormData({ ...carFormData, name: e.target.value })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Sub-judul / Tipe Detail *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Civic 1.5 VTEC Turbo Sedan"
                      value={carFormData.model}
                      onChange={(e) => setCarFormData({ ...carFormData, model: e.target.value })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Merek / Brand *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Honda / Toyota / BMW"
                      value={carFormData.brand}
                      onChange={(e) => setCarFormData({ ...carFormData, brand: e.target.value })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Tahun Pembuatan *
                    </label>
                    <input
                      type="number"
                      required
                      min={1990}
                      max={2030}
                      value={carFormData.year}
                      onChange={(e) => setCarFormData({ ...carFormData, year: Number(e.target.value) })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Harga Jual (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      step={1000000}
                      placeholder="Contoh: 478000000"
                      value={carFormData.price}
                      onChange={(e) => setCarFormData({ ...carFormData, price: Number(e.target.value) })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                    />
                    <span className="text-[10px] text-[#D4AF37] font-mono mt-0.5 block">
                      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(carFormData.price || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION B: SPESIFIKASI TEKNIS & KONDISI */}
              <div className="p-4 bg-[#18191E] border border-white/5 space-y-4">
                <span className="text-[11px] font-mono font-semibold tracking-wider text-[#D4AF37] uppercase block">
                  2. SPESIFIKASI TEKNIS & KELENGKAPAN
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Kilometer / Odometer (KM) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 28400"
                      value={carFormData.mileage}
                      onChange={(e) => setCarFormData({ ...carFormData, mileage: Number(e.target.value) })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Transmisi *
                    </label>
                    <select
                      value={carFormData.transmission}
                      onChange={(e) => setCarFormData({ ...carFormData, transmission: e.target.value })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none cursor-pointer"
                    >
                      <option value="Automatic (CVT)">Automatic (CVT)</option>
                      <option value="Automatic 6-Speed">Automatic 6-Speed</option>
                      <option value="Automatic 8-Speed">Automatic 8-Speed</option>
                      <option value="Manual (6-Speed)">Manual (6-Speed)</option>
                      <option value="Manual (5-Speed)">Manual (5-Speed)</option>
                      <option value="Dual Clutch (DCT)">Dual Clutch (DCT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Bahan Bakar *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bensin (Pertamax / Shell)"
                      value={carFormData.fuel_type}
                      onChange={(e) => setCarFormData({ ...carFormData, fuel_type: e.target.value })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Warna Eksterior *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Sonic Gray Pearl (Coating)"
                      value={carFormData.color}
                      onChange={(e) => setCarFormData({ ...carFormData, color: e.target.value })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Kapasitas Mesin *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 1.5L DOHC VTEC Turbocharged"
                      value={carFormData.engine}
                      onChange={(e) => setCarFormData({ ...carFormData, engine: e.target.value })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Badge / Tag *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="SPORTY DAILY / EXECUTIVE SUV"
                      value={carFormData.badge}
                      onChange={(e) => setCarFormData({ ...carFormData, badge: e.target.value })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Status Pajak *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pajak Hidup Panjang (s/d Nov 2025)"
                      value={carFormData.tax_status}
                      onChange={(e) => setCarFormData({ ...carFormData, tax_status: e.target.value })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Plat / Asal Daerah
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: BK (Sumatera Utara) - Tangan 1"
                      value={carFormData.plate}
                      onChange={(e) => setCarFormData({ ...carFormData, plate: e.target.value })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Lokasi Unit *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Langkat / Medan"
                      value={carFormData.location}
                      onChange={(e) => setCarFormData({ ...carFormData, location: e.target.value })}
                      className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: FILE UPLOAD FOTO KE SUPABASE STORAGE */}
              <div className="p-4 bg-[#18191E] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold tracking-wider text-[#D4AF37] uppercase block">
                    3. FOTO KENDARAAN (SUPABASE STORAGE UPLOAD)
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Bucket: <strong className="text-white">car-photos</strong>
                  </span>
                </div>

                {/* Main Photo Upload Area */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-2">
                    Foto Utama Kendaraan *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {carFormData.main_image ? (
                      <div className="relative w-40 h-28 border-2 border-[#D4AF37] bg-black shrink-0 overflow-hidden group">
                        <img
                          src={carFormData.main_image}
                          alt="Main Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setCarFormData({ ...carFormData, main_image: "" })}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          title="Ganti Foto"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-40 h-28 border border-dashed border-white/20 flex flex-col items-center justify-center bg-black/40 text-neutral-500 shrink-0">
                        <Camera className="w-6 h-6 mb-1 text-neutral-600" />
                        <span className="text-[10px] font-mono">Belum ada foto</span>
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        ref={mainImageInputRef}
                        onChange={handleMainImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploadingMain}
                        onClick={() => mainImageInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-semibold uppercase tracking-wider text-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{isUploadingMain ? "Mengunggah ke Supabase..." : "Unggah File Foto Utama"}</span>
                      </button>
                      <p className="text-[11px] text-neutral-400 font-light">
                        Mendukung format PNG, JPG, JPEG, atau WebP. Gambar otomatis disimpan ke storage Supabase dan menghasilkan tautan publik.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Gallery Multi-Upload */}
                <div className="pt-3 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300">
                        Galeri Foto Tambahan (Multi-Upload)
                      </label>
                      <p className="text-[11px] text-neutral-400 font-light">
                        Unggah foto sudut lain (interior, mesin, samping, belakang, speedometer).
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={galleryInputRef}
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploadingGallery}
                      onClick={() => galleryInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] uppercase text-[11px] font-mono transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{isUploadingGallery ? "Mengunggah..." : "+ Tambah Galeri"}</span>
                    </button>
                  </div>

                  {/* Gallery Thumbnails List */}
                  {carFormData.gallery.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
                      {carFormData.gallery.map((photo, idx) => (
                        <div key={idx} className="relative group border border-white/10 bg-black h-20 overflow-hidden">
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 left-0 right-0 bg-black/80 text-[9px] text-center text-neutral-300 py-0.5 truncate px-1">
                            {photo.tag}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryPhoto(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Hapus foto ini"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-black/20 border border-white/5 text-center text-neutral-500 text-xs">
                      Belum ada foto galeri tambahan. Klik tombol "+ Tambah Galeri" untuk mengunggah multi-foto.
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION D: DESKRIPSI & POIN KEUNGGULAN (DYNAMIC LIST) */}
              <div className="p-4 bg-[#18191E] border border-white/5 space-y-4">
                <span className="text-[11px] font-mono font-semibold tracking-wider text-[#D4AF37] uppercase block">
                  4. DESKRIPSI & POIN KEUNGGULAN UNIT
                </span>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Deskripsi Lengkap Kondisi Mobil *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={carFormData.description}
                    onChange={(e) => setCarFormData({ ...carFormData, description: e.target.value })}
                    placeholder="Jelaskan kondisi riil eksterior, interior, riwayat perawatan di bengkel resmi, kepemilikan tangan pertama, dan jaminan bebas tabrak/banjir..."
                    className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                  ></textarea>
                </div>

                {/* Dynamic Highlights List */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Poin Keunggulan Unit (Checklist Garansi & Fitur)
                  </label>
                  <div className="flex gap-2 mb-2.5">
                    <input
                      type="text"
                      placeholder="Ketik poin keunggulan (misal: Service Record Rutin Honda)..."
                      value={newHighlightInput}
                      onChange={(e) => setNewHighlightInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddHighlight();
                        }
                      }}
                      className="flex-1 bg-[#121316] border border-white/10 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono uppercase tracking-wider text-xs cursor-pointer"
                    >
                      + Tambah
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {carFormData.highlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-1.5 bg-[#121316] border border-white/5 text-xs text-neutral-300"
                      >
                        <span className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{item}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx)}
                          className="text-neutral-500 hover:text-red-400 p-1"
                          title="Hapus poin ini"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCarModalOpen(false)}
                  className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-neutral-300 uppercase tracking-wider text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-2.5 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-semibold uppercase tracking-wider text-xs cursor-pointer disabled:opacity-50 shadow-lg"
                >
                  {submitting
                    ? "Menyimpan ke Supabase..."
                    : editingCarId
                    ? "SIMPAN PERUBAHAN UNIT"
                    : "TAMBAH UNIT KE KATALOG"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM: PORTFOLIO */}
      {portfolioModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141519] border border-[#272A33] max-w-lg w-full p-6 sm:p-8 my-8 shadow-2xl relative">
            <button
              onClick={() => setPortfolioModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-semibold uppercase tracking-wider text-white mb-1">
              {editingPortfolioId ? "Edit Portofolio" : "Tambah Portofolio Baru"}
            </h3>
            <p className="text-xs text-neutral-400 font-light mb-6">
              Tambahkan dokumentasi hasil pengerjaan detailing, biled, atau cuci mobil.
            </p>

            <form onSubmit={handleSavePortfolio} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Judul Portofolio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Custom Retrofit Biled 3 Inch"
                  value={portfolioFormData.title}
                  onChange={(e) => setPortfolioFormData({ ...portfolioFormData, title: e.target.value })}
                  className="w-full bg-[#1B1D22] border border-white/10 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={portfolioFormData.category}
                    onChange={(e) => setPortfolioFormData({ ...portfolioFormData, category: e.target.value })}
                    className="w-full bg-[#1B1D22] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="Detailing">Detailing & Coating</option>
                    <option value="Biled">Lampu Biled Projector</option>
                    <option value="Carwash">Car Wash Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Badge *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="WORK / 01"
                    value={portfolioFormData.badge}
                    onChange={(e) => setPortfolioFormData({ ...portfolioFormData, badge: e.target.value })}
                    className="w-full bg-[#1B1D22] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Model Mobil Klien *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Honda Civic Turbo / Toyota Fortuner"
                  value={portfolioFormData.car_model}
                  onChange={(e) => setPortfolioFormData({ ...portfolioFormData, car_model: e.target.value })}
                  className="w-full bg-[#1B1D22] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Sub-judul / Tagline
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Perfect gloss finish with 3-year warranty."
                  value={portfolioFormData.subtitle}
                  onChange={(e) => setPortfolioFormData({ ...portfolioFormData, subtitle: e.target.value })}
                  className="w-full bg-[#1B1D22] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  URL Foto Pengerjaan *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={portfolioFormData.image_url}
                  onChange={(e) => setPortfolioFormData({ ...portfolioFormData, image_url: e.target.value })}
                  className="w-full bg-[#1B1D22] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Deskripsi Hasil Pengerjaan
                </label>
                <textarea
                  rows={3}
                  value={portfolioFormData.description}
                  onChange={(e) => setPortfolioFormData({ ...portfolioFormData, description: e.target.value })}
                  className="w-full bg-[#1B1D22] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPortfolioModalOpen(false)}
                  className="px-4 py-2 border border-white/10 hover:bg-white/5 text-neutral-300 uppercase tracking-wider text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-semibold uppercase tracking-wider text-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : editingPortfolioId ? "SIMPAN PORTOFOLIO" : "TAMBAH PORTOFOLIO"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
