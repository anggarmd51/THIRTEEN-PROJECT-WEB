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
import { uploadCarImage, uploadMultipleCarImages, uploadPortfolioImage } from "../lib/storage";
import { CarFormData, PortfolioFormData, GalleryPhotoItem, CarUnit, PortfolioItem } from "../types";
import Logo from "./Logo";
import AdminCarTable from "./admin/AdminCarTable";
import AdminPortfolioGrid from "./admin/AdminPortfolioGrid";
import AdminCarModal from "./admin/AdminCarModal";
import AdminPortfolioModal from "./admin/AdminPortfolioModal";

const CAR_DRAFT_KEY = "admin_car_form_draft_v1";
const PORTFOLIO_DRAFT_KEY = "admin_portfolio_form_draft_v1";

const DEFAULT_CAR_FORM_DATA: CarFormData = {
  name: "",
  model: "",
  brand: "",
  year: new Date().getFullYear(),
  price: 350000000,
  mileage: 20000,
  transmission: "Automatic (CVT)",
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
};

const DEFAULT_PORTFOLIO_FORM_DATA: PortfolioFormData = {
  title: "",
  category: "Detailing",
  badge: "WORK / 01",
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
};

function getInitialCarDraft(): CarFormData {
  try {
    const saved = localStorage.getItem(CAR_DRAFT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_CAR_FORM_DATA, ...parsed };
    }
  } catch (e) {
    console.warn("Gagal membaca draft mobil dari localStorage:", e);
  }
  return DEFAULT_CAR_FORM_DATA;
}

function getInitialPortfolioDraft(): PortfolioFormData {
  try {
    const saved = localStorage.getItem(PORTFOLIO_DRAFT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_PORTFOLIO_FORM_DATA, ...parsed };
    }
  } catch (e) {
    console.warn("Gagal membaca draft portofolio dari localStorage:", e);
  }
  return DEFAULT_PORTFOLIO_FORM_DATA;
}

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

  // Car Form Data with Draft persistence
  const [carFormData, setCarFormData] = useState<CarFormData>(getInitialCarDraft);
  const [hasCarDraft, setHasCarDraft] = useState<boolean>(() => Boolean(localStorage.getItem(CAR_DRAFT_KEY)));

  const [newHighlightInput, setNewHighlightInput] = useState("");
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Portfolio State
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [isUploadingPortfolioImg, setIsUploadingPortfolioImg] = useState(false);

  // Portfolio Form Data with Draft persistence
  const [portfolioFormData, setPortfolioFormData] = useState<PortfolioFormData>(getInitialPortfolioDraft);
  const [hasPortfolioDraft, setHasPortfolioDraft] = useState<boolean>(() => Boolean(localStorage.getItem(PORTFOLIO_DRAFT_KEY)));

  // Feedback notifications & status
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-Save Draft to LocalStorage whenever carFormData changes (ONLY when adding new car, not when editing)
  useEffect(() => {
    if (editingCarId) return; // Do not overwrite new car draft while editing existing unit
    try {
      localStorage.setItem(CAR_DRAFT_KEY, JSON.stringify(carFormData));
      setHasCarDraft(true);
    } catch (err) {
      console.warn("Gagal menyimpan auto-save mobil:", err);
    }
  }, [carFormData, editingCarId]);

  // Auto-Save Draft to LocalStorage whenever portfolioFormData changes (ONLY when adding new portfolio)
  useEffect(() => {
    if (editingPortfolioId) return; // Do not overwrite draft while editing existing item
    try {
      localStorage.setItem(PORTFOLIO_DRAFT_KEY, JSON.stringify(portfolioFormData));
      setHasPortfolioDraft(true);
    } catch (err) {
      console.warn("Gagal menyimpan auto-save portofolio:", err);
    }
  }, [portfolioFormData, editingPortfolioId]);

  // Auto clear alert after 6 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Fetch cars from database
  const loadCars = useCallback(async () => {
    setLoadingCars(true);
    const { data, error } = await fetchCarsFromSupabase();
    if (error) {
      console.error("[Database Error] Gagal memuat unit mobil:", error);
      setAlert({
        type: "error",
        text: `Gagal memuat data mobil dari database: ${error.message}`,
      });
      setCars([]);
    } else {
      setCars(data);
    }
    setLoadingCars(false);
  }, []);

  // Fetch portfolios from database
  const loadPortfolios = useCallback(async () => {
    setLoadingPortfolios(true);
    const { data, error } = await fetchPortfoliosFromSupabase();
    if (error) {
      console.error("[Database Error] Gagal memuat portofolio:", error);
      setAlert({
        type: "error",
        text: `Gagal memuat portofolio dari database: ${error.message}`,
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

  // Handle Main Image File Upload to Storage
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMain(true);
    try {
      console.info(`[Upload] Mengunggah foto utama "${file.name}"...`);
      const result = await uploadCarImage(file, "cars/main");

      if (result.error) {
        console.warn(`[Upload Warning] Upload storage mengembalikan peringatan: ${result.error}`);
        setAlert({
          type: "error",
          text: `Peringatan Upload Foto: ${result.error}. Gambar tetap dimuat menggunakan data URL lokal.`,
        });
      } else {
        setAlert({
          type: "success",
          text: "Foto utama berhasil diunggah ke storage!",
        });
      }

      setCarFormData((prev) => ({
        ...prev,
        main_image: result.url,
        gallery:
          prev.gallery.length === 0
            ? [{ title: prev.name || "Foto Depan", url: result.url, tag: "Depan" }]
            : prev.gallery,
      }));
    } catch (err: any) {
      console.error("[Upload Error] Gagal mengunggah foto utama:", err);
      setAlert({
        type: "error",
        text: `Gagal mengunggah foto utama: ${err?.message || "Kesalahan jaringan"}`,
      });
    } finally {
      setIsUploadingMain(false);
      // Reset input value so same file can be re-selected if needed
      e.target.value = "";
    }
  };

  // Handle Additional Gallery Images Multi-Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    try {
      const fileList = Array.from(files);
      console.info(`[Upload] Mengunggah ${fileList.length} foto galeri tambahan...`);
      const results = await uploadMultipleCarImages(fileList, "cars/gallery");

      const hasErrors = results.some((r) => r.error);
      if (hasErrors) {
        console.warn("[Upload Warning] Sebagian foto galeri mengalami kendala upload.");
        setAlert({
          type: "error",
          text: "Sebagian foto galeri diunggah dengan fallback lokal karena kendala storage.",
        });
      } else {
        setAlert({
          type: "success",
          text: `${results.length} foto galeri tambahan berhasil diunggah!`,
        });
      }

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
    } catch (err: any) {
      console.error("[Upload Error] Gagal mengunggah galeri tambahan:", err);
      setAlert({
        type: "error",
        text: `Gagal mengunggah galeri: ${err?.message || "Kesalahan jaringan"}`,
      });
    } finally {
      setIsUploadingGallery(false);
      e.target.value = "";
    }
  };

  // Handle Portfolio Single Image Upload to Storage
  const handlePortfolioImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPortfolioImg(true);
    try {
      console.info(`[Upload] Mengunggah foto portofolio "${file.name}"...`);
      const result = await uploadPortfolioImage(file, "portfolio");

      if (result.error) {
        console.warn(`[Upload Warning] Upload portofolio mengembalikan peringatan: ${result.error}`);
        setAlert({
          type: "error",
          text: `Peringatan Upload Foto: ${result.error}`,
        });
      } else {
        setAlert({
          type: "success",
          text: "Foto portofolio berhasil diunggah ke storage!",
        });
      }

      setPortfolioFormData((prev) => ({
        ...prev,
        image_url: result.url,
      }));
    } catch (err: any) {
      console.error("[Upload Error] Gagal mengunggah foto portofolio:", err);
      setAlert({
        type: "error",
        text: `Gagal mengunggah foto portofolio: ${err?.message || "Kesalahan jaringan"}`,
      });
    } finally {
      setIsUploadingPortfolioImg(false);
      e.target.value = "";
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

  // Save / Update Car in Database
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    console.info("[Submit Car] Memulai proses simpan unit mobil...", carFormData);

    if (!carFormData.main_image || !carFormData.main_image.trim()) {
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
        console.info(`[Update Car] Memperbarui unit ID "${editingCarId}"...`);
        const { error } = await updateCarInSupabase(editingCarId, carFormData);
        if (error) {
          console.error("[Update Car Error]", error);
          setAlert({
            type: "error",
            text: `Gagal memperbarui unit di database: ${error.message}`,
          });
        } else {
          setAlert({
            type: "success",
            text: `Unit mobil "${carFormData.name}" berhasil diperbarui!`,
          });
          setCarModalOpen(false);
          setEditingCarId(null);
          await loadCars();
        }
      } else {
        console.info("[Insert Car] Menyimpan unit baru ke database...", carFormData);
        const { error } = await insertCarToSupabase(carFormData);
        if (error) {
          console.error("[Insert Car Error]", error);
          setAlert({
            type: "error",
            text: `Gagal menambahkan unit ke database: ${error.message}`,
          });
        } else {
          // Success: Clear localStorage draft ONLY when successfully submitted
          try {
            localStorage.removeItem(CAR_DRAFT_KEY);
            setHasCarDraft(false);
            console.info("[Draft Cleared] Draft mobil berhasil dihapus dari localStorage setelah sukses submit.");
          } catch (storageErr) {
            console.warn("Gagal membersihkan draft localStorage:", storageErr);
          }

          setAlert({
            type: "success",
            text: `Unit mobil baru "${carFormData.name}" berhasil disimpan ke katalog!`,
          });
          setCarModalOpen(false);
          setEditingCarId(null);
          // Reset form data to default template
          setCarFormData(DEFAULT_CAR_FORM_DATA);
          await loadCars();
        }
      }
    } catch (err: any) {
      console.error("[Save Car Exception]", err);
      setAlert({
        type: "error",
        text: `Terjadi kendala saat menyimpan unit: ${err?.message || "Kesalahan tidak terduga"}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Car
  const handleDeleteCar = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus unit "${name}" secara permanen?`)) {
      return;
    }

    setAlert(null);
    try {
      const { error } = await deleteCarFromSupabase(id);
      if (error) {
        console.error("[Delete Car Error]", error);
        setAlert({
          type: "error",
          text: `Gagal menghapus unit: ${error.message}`,
        });
      } else {
        setAlert({
          type: "success",
          text: `Unit "${name}" berhasil dihapus dari database.`,
        });
        await loadCars();
      }
    } catch (err: any) {
      console.error("[Delete Car Exception]", err);
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

  // Open Add Car Modal (reloads draft if present, else defaults)
  const openAddCar = () => {
    setEditingCarId(null);
    const draft = getInitialCarDraft();
    setCarFormData(draft);
    setCarModalOpen(true);
  };

  // Cancel / Close Car Modal - DOES NOT CLEAR DRAFT so user doesn't lose work
  const handleCloseCarModal = () => {
    setCarModalOpen(false);
    setEditingCarId(null);
  };

  // Save / Update Portfolio in Database
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    console.info("[Submit Portfolio] Memulai proses simpan portofolio...", portfolioFormData);

    setSubmitting(true);
    setAlert(null);

    try {
      if (editingPortfolioId) {
        console.info(`[Update Portfolio] Memperbarui portofolio ID "${editingPortfolioId}"...`);
        const { error } = await updatePortfolioInSupabase(editingPortfolioId, portfolioFormData);
        if (error) {
          console.error("[Update Portfolio Error]", error);
          setAlert({
            type: "error",
            text: `Gagal memperbarui portofolio di database: ${error.message}`,
          });
        } else {
          setAlert({
            type: "success",
            text: `Portofolio "${portfolioFormData.title}" berhasil diperbarui!`,
          });
          setPortfolioModalOpen(false);
          setEditingPortfolioId(null);
          await loadPortfolios();
        }
      } else {
        console.info("[Insert Portfolio] Menyimpan portofolio baru ke database...", portfolioFormData);
        const { error } = await insertPortfolioToSupabase(portfolioFormData);
        if (error) {
          console.error("[Insert Portfolio Error]", error);
          setAlert({
            type: "error",
            text: `Gagal menambahkan portofolio ke database: ${error.message}`,
          });
        } else {
          // Success: Clear localStorage draft ONLY when successfully submitted
          try {
            localStorage.removeItem(PORTFOLIO_DRAFT_KEY);
            setHasPortfolioDraft(false);
            console.info("[Draft Cleared] Draft portofolio berhasil dihapus setelah submit.");
          } catch (storageErr) {
            console.warn("Gagal membersihkan draft portofolio:", storageErr);
          }

          setAlert({
            type: "success",
            text: `Portofolio "${portfolioFormData.title}" berhasil disimpan!`,
          });
          setPortfolioModalOpen(false);
          setEditingPortfolioId(null);
          // Reset portfolio form to default template
          setPortfolioFormData(DEFAULT_PORTFOLIO_FORM_DATA);
          await loadPortfolios();
        }
      }
    } catch (err: any) {
      console.error("[Save Portfolio Exception]", err);
      setAlert({
        type: "error",
        text: `Gagal menyimpan portofolio: ${err?.message || "Kesalahan jaringan"}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Portfolio
  const handleDeletePortfolio = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus portofolio "${title}" secara permanen?`)) {
      return;
    }

    setAlert(null);
    try {
      const { error } = await deletePortfolioFromSupabase(id);
      if (error) {
        console.error("[Delete Portfolio Error]", error);
        setAlert({
          type: "error",
          text: `Gagal menghapus portofolio: ${error.message}`,
        });
      } else {
        setAlert({
          type: "success",
          text: `Portofolio "${title}" berhasil dihapus dari database.`,
        });
        await loadPortfolios();
      }
    } catch (err: any) {
      console.error("[Delete Portfolio Exception]", err);
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

  // Open Add Portfolio Modal (reloads draft if present)
  const openAddPortfolio = () => {
    setEditingPortfolioId(null);
    const draft = getInitialPortfolioDraft();
    setPortfolioFormData({
      ...draft,
      badge: draft.badge || `WORK / 0${portfolios.length + 1}`,
    });
    setPortfolioModalOpen(true);
  };

  // Cancel / Close Portfolio Modal
  const handleClosePortfolioModal = () => {
    setPortfolioModalOpen(false);
    setEditingPortfolioId(null);
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
            <span>DATABASE CONNECTED</span>
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
                <strong>Catatan Konfigurasi:</strong> Pastikan Anda telah mengatur variabel koneksi database pada file <code>.env</code> Anda.
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
              DASHBOARD ADMIN
            </h1>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              KELOLA KATALOG MOBIL &amp; PORTOFOLIO
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
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
              title="Muat Ulang Data"
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
                <span>Memuat data mobil...</span>
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
                <span>Memuat data portofolio...</span>
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
        hasDraft={hasCarDraft}
        onClose={handleCloseCarModal}
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
        hasDraft={hasPortfolioDraft}
        isUploadingImage={isUploadingPortfolioImg}
        onImageUpload={handlePortfolioImageUpload}
        onClose={handleClosePortfolioModal}
        onSubmit={handleSavePortfolio}
      />
    </div>
  );
}
