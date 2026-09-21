import { useState, useEffect, useCallback } from "react";
import {
  Car,
  Layers,
  Plus,
  LogOut,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  X,
  Database,
  Download,
  Loader2,
} from "lucide-react";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  fetchCarsFromSupabase,
  insertCarToSupabase,
  updateCarInSupabase,
  deleteCarFromSupabase,
  fetchPortfoliosFromSupabase,
  insertPortfolioToSupabase,
  updatePortfolioInSupabase,
  deletePortfolioFromSupabase,
} from "../lib/supabaseDb";
import { CARS_DATA } from "../data/carsData";
import { PORTFOLIO_ITEMS } from "../data/portfolioData";
import { uploadCarImage, uploadMultipleCarImages, uploadPortfolioImage } from "../lib/storage";
import { CarFormData, PortfolioFormData, GalleryPhotoItem, CarUnit, PortfolioItem } from "../types";
import Logo from "./Logo";
import AdminCarTable from "./admin/AdminCarTable";
import AdminPortfolioGrid from "./admin/AdminPortfolioGrid";
import AdminCarModal from "./admin/AdminCarModal";
import AdminPortfolioModal from "./admin/AdminPortfolioModal";

interface AdminDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export default function AdminDashboard({ userEmail, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"cars" | "portfolios">("cars");

  // Cars State
  const [cars, setCars] = useState<CarUnit[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [carModalOpen, setCarModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);

  // Car Form Data
  const [carFormData, setCarFormData] = useState<CarFormData>({
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
      "Bukan Bekas Tabrakan & Bebas Banjir 100%",
    ],
    gallery: [],
  });

  const [newHighlightInput, setNewHighlightInput] = useState("");
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Portfolio State
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [isUploadingPortfolioImg, setIsUploadingPortfolioImg] = useState(false);

  const [portfolioFormData, setPortfolioFormData] = useState<PortfolioFormData>({
    title: "",
    category: "Detailing",
    badge: "WORK / 01",
    subtitle: "Crafted to perfection.",
    image_url:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
    description:
      "Hasil pengerjaan berstandar tinggi dengan material berkualitas dan ketelitian maksimal.",
    car_model: "Honda Civic / Toyota Fortuner",
    treatment_list: [
      "Perawatan Komprehensif",
      "Material Premium Teruji",
      "Garansi Resmi Hasil Pengerjaan",
    ],
  });

  // Feedback notifications & status
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Auto clear alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Fetch cars strictly from Supabase
  const loadCars = useCallback(async () => {
    setLoadingCars(true);
    const { data, error } = await fetchCarsFromSupabase();
    if (error) {
      setAlert({
        type: "error",
        text: `Gagal memuat mobil dari Supabase: ${error.message}. Pastikan tabel "cars" telah dibuat via Supabase SQL Editor.`,
      });
      setCars([]);
    } else {
      setCars(data);
    }
    setLoadingCars(false);
  }, []);

  // Fetch portfolios strictly from Supabase
  const loadPortfolios = useCallback(async () => {
    setLoadingPortfolios(true);
    const { data, error } = await fetchPortfoliosFromSupabase();
    if (error) {
      setAlert({
        type: "error",
        text: `Gagal memuat portofolio dari Supabase: ${error.message}. Pastikan tabel "portfolio" telah dibuat via Supabase SQL Editor.`,
      });
      setPortfolios([]);
    } else {
      setPortfolios(data);
    }
    setLoadingPortfolios(false);
  }, []);

  useEffect(() => {
    loadCars();
    loadPortfolios();
  }, [loadCars, loadPortfolios]);

  // Handle Main Image File Upload to Supabase Storage
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMain(true);
    try {
      const result = await uploadCarImage(file, "cars/main");
      setCarFormData((prev) => ({
        ...prev,
        main_image: result.url,
        gallery:
          prev.gallery.length === 0
            ? [{ title: prev.name || "Foto Depan", url: result.url, tag: "Depan" }]
            : prev.gallery,
      }));

      setAlert({
        type: "success",
        text: "Foto utama berhasil diunggah ke Supabase Storage!",
      });
    } catch (err: any) {
      setAlert({
        type: "error",
        text: `Gagal mengunggah foto: ${err.message}`,
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
          tag: chosenTag,
        };
      });

      setCarFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newPhotos],
      }));

      setAlert({
        type: "success",
        text: `${results.length} foto galeri tambahan berhasil diunggah!`,
      });
    } catch (err: any) {
      setAlert({
        type: "error",
        text: `Gagal mengunggah galeri: ${err.message}`,
      });
    } finally {
      setIsUploadingGallery(false);
    }
  };

  // Handle Portfolio Single Image Upload to Supabase Storage
  const handlePortfolioImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPortfolioImg(true);
    try {
      const result = await uploadPortfolioImage(file, "portfolio");
      setPortfolioFormData((prev) => ({
        ...prev,
        image_url: result.url,
      }));
      setAlert({
        type: "success",
        text: "Foto portofolio berhasil diunggah ke Supabase Storage!",
      });
    } catch (err: any) {
      setAlert({
        type: "error",
        text: `Gagal mengunggah foto portofolio: ${err.message}`,
      });
    } finally {
      setIsUploadingPortfolioImg(false);
    }
  };

  // Remove photo from gallery
  const handleRemoveGalleryPhoto = (index: number) => {
    setCarFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== index),
    }));
  };

  // Add a highlight bullet point
  const handleAddHighlight = () => {
    const trimmed = newHighlightInput.trim();
    if (!trimmed) return;
    setCarFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, trimmed],
    }));
    setNewHighlightInput("");
  };

  // Remove a highlight bullet point
  const handleRemoveHighlight = (index: number) => {
    setCarFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== index),
    }));
  };

  // Save / Update Car in Supabase
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carFormData.main_image) {
      setAlert({
        type: "error",
        text: "Silakan unggah atau isi minimal 1 Foto Utama kendaraan terlebih dahulu.",
      });
      return;
    }

    setSubmitting(true);
    setAlert(null);

    try {
      if (editingCarId) {
        const { error } = await updateCarInSupabase(editingCarId, carFormData);
        if (error) {
          setAlert({
            type: "error",
            text: `Gagal memperbarui unit di Supabase: ${error.message}`,
          });
        } else {
          setAlert({
            type: "success",
            text: `Unit mobil "${carFormData.name}" berhasil diperbarui di Supabase!`,
          });
          setCarModalOpen(false);
          setEditingCarId(null);
          await loadCars();
        }
      } else {
        const { error } = await insertCarToSupabase(carFormData);
        if (error) {
          setAlert({
            type: "error",
            text: `Gagal menambahkan unit ke Supabase: ${error.message}`,
          });
        } else {
          setAlert({
            type: "success",
            text: `Unit mobil baru "${carFormData.name}" berhasil disimpan ke Supabase!`,
          });
          setCarModalOpen(false);
          setEditingCarId(null);
          await loadCars();
        }
      }
    } catch (err: any) {
      setAlert({ type: "error", text: `Terjadi kendala: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Car from Supabase
  const handleDeleteCar = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus unit "${name}" dari Supabase secara permanen?`)) {
      return;
    }

    setAlert(null);
    try {
      const { error } = await deleteCarFromSupabase(id);
      if (error) {
        setAlert({
          type: "error",
          text: `Gagal menghapus unit: ${error.message}`,
        });
      } else {
        setAlert({
          type: "success",
          text: `Unit "${name}" berhasil dihapus dari database Supabase.`,
        });
        await loadCars();
      }
    } catch (err: any) {
      setAlert({ type: "error", text: `Gagal menghapus: ${err.message}` });
    }
  };

  // Open Edit Car Modal
  const openEditCar = (car: CarUnit) => {
    setEditingCarId(car.id);
    setCarFormData({
      name: car.name,
      model: car.model,
      brand: car.brand,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      transmission: car.transmission,
      fuel_type: car.fuelType,
      color: car.color,
      engine: car.engine,
      tax_status: car.taxStatus,
      plate: car.plate,
      location: car.location,
      badge: car.badge,
      description: car.description,
      main_image: car.mainImage,
      highlights: car.highlights,
      gallery: car.gallery,
    });
    setCarModalOpen(true);
  };

  // Open Add Car Modal
  const openAddCar = () => {
    setEditingCarId(null);
    setCarFormData({
      name: "",
      model: "",
      brand: "",
      year: new Date().getFullYear(),
      price: 350000000,
      mileage: 20000,
      transmission: "Automatic",
      fuel_type: "Bensin",
      color: "Hitam Metalik",
      engine: "1.5L Turbo",
      tax_status: "Pajak Hidup",
      plate: "BK (Sumatera Utara)",
      location: "Langkat / Medan",
      badge: "AVAILABLE",
      description:
        "Unit terawat istimewa dengan service record resmi, telah lolos inspeksi 150+ titik dan siap pakai.",
      main_image:
        "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1400&auto=format&fit=crop",
      highlights: [
        "Lolos Inspeksi 150+ Titik Ketat",
        "Odometer Asli (Garansi Bukan Putaran)",
        "Bukan Bekas Tabrakan & Bebas Banjir 100%",
      ],
      gallery: [],
    });
    setCarModalOpen(true);
  };

  // Save / Update Portfolio in Supabase
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert(null);

    try {
      if (editingPortfolioId) {
        const { error } = await updatePortfolioInSupabase(editingPortfolioId, portfolioFormData);
        if (error) {
          setAlert({
            type: "error",
            text: `Gagal memperbarui portofolio di Supabase: ${error.message}`,
          });
        } else {
          setAlert({
            type: "success",
            text: `Portofolio "${portfolioFormData.title}" berhasil diperbarui di Supabase!`,
          });
          setPortfolioModalOpen(false);
          setEditingPortfolioId(null);
          await loadPortfolios();
        }
      } else {
        const { error } = await insertPortfolioToSupabase(portfolioFormData);
        if (error) {
          setAlert({
            type: "error",
            text: `Gagal menambahkan portofolio ke Supabase: ${error.message}`,
          });
        } else {
          setAlert({
            type: "success",
            text: `Portofolio "${portfolioFormData.title}" berhasil disimpan ke Supabase!`,
          });
          setPortfolioModalOpen(false);
          setEditingPortfolioId(null);
          await loadPortfolios();
        }
      }
    } catch (err: any) {
      setAlert({ type: "error", text: `Gagal menyimpan: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Portfolio from Supabase
  const handleDeletePortfolio = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus portofolio "${title}" secara permanen?`)) {
      return;
    }

    setAlert(null);
    try {
      const { error } = await deletePortfolioFromSupabase(id);
      if (error) {
        setAlert({
          type: "error",
          text: `Gagal menghapus portofolio: ${error.message}`,
        });
      } else {
        setAlert({
          type: "success",
          text: `Portofolio "${title}" berhasil dihapus dari Supabase.`,
        });
        await loadPortfolios();
      }
    } catch (err: any) {
      setAlert({ type: "error", text: `Gagal menghapus: ${err.message}` });
    }
  };

  // Open Edit Portfolio Modal
  const openEditPortfolio = (item: PortfolioItem) => {
    setEditingPortfolioId(item.id);
    setPortfolioFormData({
      title: item.title,
      category: item.category,
      badge: item.badge,
      subtitle: item.subtitle,
      image_url: item.imageUrl,
      description: item.description,
      car_model: item.carModel,
      treatment_list: item.treatmentList,
    });
    setPortfolioModalOpen(true);
  };

  // Open Add Portfolio Modal
  const openAddPortfolio = () => {
    setEditingPortfolioId(null);
    setPortfolioFormData({
      title: "",
      category: "Detailing",
      badge: `WORK / 0${portfolios.length + 1}`,
      subtitle: "High precision automotive perfection.",
      image_url:
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
      description:
        "Hasil pengerjaan berstandar tinggi dengan material impor berkualitas dan garansi resmi.",
      car_model: "Honda Civic Sedan",
      treatment_list: [
        "Perawatan Komprehensif",
        "Material Premium Teruji",
        "Garansi Resmi Hasil Pengerjaan",
      ],
    });
    setPortfolioModalOpen(true);
  };

  // Migration / Seed Data Helper: Seeds initial data into Supabase if desired
  const handleSeedInitialData = async () => {
    if (!window.confirm("Migrasi data awal dari katalog ke Supabase sekarang?")) return;

    setIsSeeding(true);
    setAlert(null);
    try {
      let insertedCars = 0;
      let insertedPortfolios = 0;

      // Seed cars if currently empty
      for (const car of CARS_DATA) {
        const formData: CarFormData = {
          name: car.name,
          model: car.model,
          brand: car.brand,
          year: car.year,
          price: car.price,
          mileage: car.mileage,
          transmission: car.transmission,
          fuel_type: car.fuelType,
          color: car.color,
          engine: car.engine,
          tax_status: car.taxStatus,
          plate: car.plate,
          location: car.location,
          badge: car.badge,
          description: car.description,
          main_image: car.mainImage,
          highlights: car.highlights,
          gallery: car.gallery,
        };
        const res = await insertCarToSupabase(formData);
        if (!res.error) insertedCars++;
      }

      // Seed portfolios if currently empty
      for (const p of PORTFOLIO_ITEMS) {
        const pData: PortfolioFormData = {
          title: p.title,
          category: p.category,
          badge: p.badge,
          subtitle: p.subtitle,
          image_url: p.imageUrl,
          description: p.description,
          car_model: p.carModel,
          treatment_list: p.treatmentList,
        };
        const res = await insertPortfolioToSupabase(pData);
        if (!res.error) insertedPortfolios++;
      }

      setAlert({
        type: "success",
        text: `Migrasi selesai! Berhasil menyimpan ${insertedCars} unit mobil dan ${insertedPortfolios} portofolio ke Supabase.`,
      });
      await loadCars();
      await loadPortfolios();
    } catch (err: any) {
      setAlert({ type: "error", text: `Gagal migrasi: ${err.message}` });
    } finally {
      setIsSeeding(false);
    }
  };

  const configured = isSupabaseConfigured();

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
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
            <Database className="w-3 h-3" />
            <span>SUPABASE CONNECTED</span>
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
        {/* Environment Alert if not configured */}
        {!configured && (
          <div className="p-4 bg-amber-950/30 border border-amber-600/40 text-amber-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Catatan Supabase:</strong> Pastikan Anda telah mengatur variable <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> pada file <code>.env</code> Anda, serta menjalankan skrip SQL dari <code>supabase/schema.sql</code>.
              </span>
            </div>
          </div>
        )}

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
            <div className="flex-1 leading-relaxed">{alert.text}</div>
            <button
              onClick={() => setAlert(null)}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Dashboard Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#22242B]">
          <div>
            <h1 className="text-xl sm:text-2xl font-light tracking-tight text-white">
              Pusat Manajemen Database Supabase
            </h1>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Kelola katalog mobil bekas (tabel <code>cars</code>) dan portofolio (tabel <code>portfolio</code>) dengan operasi CRUD real-time.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Quick Seed Button if table is empty */}
            {(cars.length === 0 || portfolios.length === 0) && (
              <button
                onClick={handleSeedInitialData}
                disabled={isSeeding}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#D4AF37]/50 hover:border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                title="Migrasi data awal ke Supabase"
              >
                {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{isSeeding ? "Memigrasikan..." : "Migrasi Data Awal ke DB"}</span>
              </button>
            )}

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
                loadCars();
                loadPortfolios();
              }}
              title="Refresh Data dari Supabase"
              className="p-2 border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loadingCars || loadingPortfolios ? "animate-spin" : ""}`} />
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
            <span>Katalog Mobil Bekas ({loadingCars ? "..." : cars.length})</span>
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
            <span>Portofolio Hasil Kerja ({loadingPortfolios ? "..." : portfolios.length})</span>
          </button>
        </div>

        {/* TAB 1: CARS CONTENT */}
        {activeTab === "cars" && (
          <div>
            {loadingCars && cars.length === 0 ? (
              <div className="p-12 text-center text-neutral-400 text-xs">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#D4AF37]" />
                <span>Memuat data mobil dari Supabase...</span>
              </div>
            ) : (
              <AdminCarTable cars={cars} onEdit={openEditCar} onDelete={handleDeleteCar} />
            )}
          </div>
        )}

        {/* TAB 2: PORTFOLIO CONTENT */}
        {activeTab === "portfolios" && (
          <div>
            {loadingPortfolios && portfolios.length === 0 ? (
              <div className="p-12 text-center text-neutral-400 text-xs">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#D4AF37]" />
                <span>Memuat portofolio dari Supabase...</span>
              </div>
            ) : (
              <AdminPortfolioGrid
                portfolios={portfolios}
                onEdit={openEditPortfolio}
                onDelete={handleDeletePortfolio}
              />
            )}
          </div>
        )}
      </main>

      {/* MODAL FORM: CAR UNIT */}
      <AdminCarModal
        isOpen={carModalOpen}
        editingCarId={editingCarId}
        carFormData={carFormData}
        setCarFormData={setCarFormData}
        newHighlightInput={newHighlightInput}
        setNewHighlightInput={setNewHighlightInput}
        isUploadingMain={isUploadingMain}
        isUploadingGallery={isUploadingGallery}
        submitting={submitting}
        onClose={() => setCarModalOpen(false)}
        onSubmit={handleSaveCar}
        onMainImageUpload={handleMainImageUpload}
        onGalleryUpload={handleGalleryUpload}
        onRemoveGalleryPhoto={handleRemoveGalleryPhoto}
        onAddHighlight={handleAddHighlight}
        onRemoveHighlight={handleRemoveHighlight}
      />

      {/* MODAL FORM: PORTFOLIO */}
      <AdminPortfolioModal
        isOpen={portfolioModalOpen}
        editingPortfolioId={editingPortfolioId}
        formData={portfolioFormData}
        setFormData={setPortfolioFormData}
        submitting={submitting}
        isUploadingImage={isUploadingPortfolioImg}
        onImageUpload={handlePortfolioImageUpload}
        onClose={() => setPortfolioModalOpen(false)}
        onSubmit={handleSavePortfolio}
      />
    </div>
  );
}
