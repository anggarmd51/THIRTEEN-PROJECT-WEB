import React, { useRef, useState, useEffect } from "react";
import {
  X,
  Upload,
  Camera,
  PlusCircle,
  Trash,
  Check,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Move,
} from "lucide-react";
import { CarFormData, GalleryPhotoItem } from "../../types";
import { insertCarToSupabase, updateCarInSupabase } from "../../lib/supabaseDb";
import { uploadCarImage } from "../../lib/storage";

export const GALLERY_SLOTS = [
  { id: 1, label: "Depan" },
  { id: 2, label: "Belakang" },
  { id: 3, label: "Samping Kanan" },
  { id: 4, label: "Samping Kiri" },
  { id: 5, label: "Dashboard" },
  { id: 6, label: "Interior 1" },
  { id: 7, label: "Interior 2" },
  { id: 8, label: "Mesin" },
  { id: 9, label: "Foto Tambahan 1" },
  { id: 10, label: "Foto Tambahan 2" },
] as const;

function build10SlotsFromGallery(gallery: GalleryPhotoItem[] | undefined): (GalleryPhotoItem | null)[] {
  const slots: (GalleryPhotoItem | null)[] = Array(10).fill(null);
  if (!gallery || !Array.isArray(gallery) || gallery.length === 0) {
    return slots;
  }

  const unplaced: GalleryPhotoItem[] = [];
  gallery.forEach((item) => {
    if (!item || !item.url) return;
    const tagLower = (item.tag || item.title || "").toLowerCase().trim();
    const slotIdx = GALLERY_SLOTS.findIndex(
      (s) => s.label.toLowerCase() === tagLower || `galeri ${s.label.toLowerCase()}` === tagLower
    );
    if (slotIdx !== -1 && slots[slotIdx] === null) {
      slots[slotIdx] = { ...item, tag: GALLERY_SLOTS[slotIdx].label };
    } else {
      unplaced.push(item);
    }
  });

  let unplacedIdx = 0;
  for (let i = 0; i < 10 && unplacedIdx < unplaced.length; i++) {
    if (slots[i] === null) {
      const item = unplaced[unplacedIdx++];
      slots[i] = {
        ...item,
        tag: GALLERY_SLOTS[i].label,
        title: item.title || `Foto ${GALLERY_SLOTS[i].label}`,
      };
    }
  }

  return slots;
}

interface AdminCarModalProps {
  isOpen: boolean;
  editingCarId: string | null;
  carFormData: CarFormData;
  setCarFormData: React.Dispatch<React.SetStateAction<CarFormData>>;
  newHighlightInput: string;
  setNewHighlightInput: (val: string) => void;
  isUploadingMain: boolean;
  isUploadingGallery: boolean;
  submitting?: boolean;
  hasDraft?: boolean;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  onSuccess?: () => void;
  onMainImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveGalleryPhoto: (index: number) => void;
  onAddHighlight: () => void;
  onRemoveHighlight: (index: number) => void;
}

const CAR_DRAFT_KEY = "admin_car_form_draft_v1";

const DEFAULT_RESET_DATA: CarFormData = {
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

export default function AdminCarModal({
  isOpen,
  editingCarId,
  carFormData,
  setCarFormData,
  newHighlightInput,
  setNewHighlightInput,
  isUploadingMain,
  isUploadingGallery,
  submitting: externalSubmitting = false,
  hasDraft = false,
  onClose,
  onSubmit: externalOnSubmit,
  onSuccess,
  onMainImageUpload,
  onGalleryUpload,
  onRemoveGalleryPhoto,
  onAddHighlight,
  onRemoveHighlight,
}: AdminCarModalProps) {
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);
  const singleSlotInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);

  // 10-Slot Gallery States
  const [gallerySlots, setGallerySlots] = useState<(GalleryPhotoItem | null)[]>(() =>
    build10SlotsFromGallery(carFormData.gallery)
  );
  const [uploadingSlotIndex, setUploadingSlotIndex] = useState<number | null>(null);
  const [isBatchUploading, setIsBatchUploading] = useState(false);
  const [draggedSlotIndex, setDraggedSlotIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Sync slots when modal opens or editingCarId changes
  useEffect(() => {
    if (isOpen) {
      setGallerySlots(build10SlotsFromGallery(carFormData.gallery));
    }
  }, [isOpen, editingCarId]);

  // Sync slots to parent carFormData.gallery
  const syncSlotsToFormData = (newSlots: (GalleryPhotoItem | null)[]) => {
    setGallerySlots(newSlots);
    const activePhotos: GalleryPhotoItem[] = [];
    newSlots.forEach((slot, idx) => {
      if (slot && slot.url && slot.url.trim()) {
        activePhotos.push({
          url: slot.url.trim(),
          title: slot.title || `${carFormData.name || "Unit"} - ${GALLERY_SLOTS[idx].label}`,
          tag: GALLERY_SLOTS[idx].label,
        });
      }
    });
    setCarFormData((prev) => ({
      ...prev,
      gallery: activePhotos,
    }));
  };

  // Remove photo from specific slot (triggered by Red 'X' Button)
  const handleRemoveSlotPhoto = (slotIndex: number) => {
    const updated = [...gallerySlots];
    updated[slotIndex] = null;
    syncSlotsToFormData(updated);
  };

  // Swap / reorder slots
  const handleSwapSlots = (indexA: number, indexB: number) => {
    if (indexA < 0 || indexA >= 10 || indexB < 0 || indexB >= 10 || indexA === indexB) return;
    const updated = [...gallerySlots];
    const temp = updated[indexA];
    updated[indexA] = updated[indexB];
    updated[indexB] = temp;

    if (updated[indexA]) {
      updated[indexA] = {
        ...updated[indexA]!,
        tag: GALLERY_SLOTS[indexA].label,
        title: `${carFormData.name || "Unit"} - ${GALLERY_SLOTS[indexA].label}`,
      };
    }
    if (updated[indexB]) {
      updated[indexB] = {
        ...updated[indexB]!,
        tag: GALLERY_SLOTS[indexB].label,
        title: `${carFormData.name || "Unit"} - ${GALLERY_SLOTS[indexB].label}`,
      };
    }

    syncSlotsToFormData(updated);
  };

  // Single Slot Upload Handler
  const handleSlotFileChange = async (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlotIndex(slotIndex);
    try {
      const result = await uploadCarImage(file, `cars/gallery`);
      if (result.error) {
        console.warn("[Upload Warning]", result.error);
      }
      const updated = [...gallerySlots];
      updated[slotIndex] = {
        url: result.url,
        tag: GALLERY_SLOTS[slotIndex].label,
        title: `${carFormData.name || "Unit"} - ${GALLERY_SLOTS[slotIndex].label}`,
      };
      syncSlotsToFormData(updated);
    } catch (err: any) {
      console.error("[Slot Upload Error]", err);
      alert(`Gagal mengunggah foto slot ${GALLERY_SLOTS[slotIndex].label}: ${err.message || "Kesalahan jaringan"}`);
    } finally {
      setUploadingSlotIndex(null);
      e.target.value = "";
    }
  };

  // Batch Multi-Upload Handler (Fills empty slots in 1..10 order)
  const handleBatchGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const emptyIndices: number[] = [];
    gallerySlots.forEach((slot, idx) => {
      if (slot === null || !slot.url) {
        emptyIndices.push(idx);
      }
    });

    if (emptyIndices.length === 0) {
      alert("Semua 10 slot galeri telah terisi. Silakan hapus foto pada slot yang ingin diganti terlebih dahulu.");
      e.target.value = "";
      return;
    }

    setIsBatchUploading(true);
    try {
      const updated = [...gallerySlots];
      const filesToProcess = files.slice(0, emptyIndices.length);

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        const targetSlotIndex = emptyIndices[i];
        const res = await uploadCarImage(file, "cars/gallery");
        updated[targetSlotIndex] = {
          url: res.url,
          tag: GALLERY_SLOTS[targetSlotIndex].label,
          title: `${carFormData.name || "Unit"} - ${GALLERY_SLOTS[targetSlotIndex].label}`,
        };
      }

      syncSlotsToFormData(updated);

      if (files.length > emptyIndices.length) {
        alert(
          `Berhasil mengisi ${emptyIndices.length} slot kosong. (${files.length - emptyIndices.length} foto berlebih diabaikan karena galeri dibatasi tepat 10 slot).`
        );
      }
    } catch (err: any) {
      console.error("[Batch Upload Error]", err);
      alert(`Gagal mengunggah galeri: ${err.message || "Kesalahan jaringan"}`);
    } finally {
      setIsBatchUploading(false);
      e.target.value = "";
    }
  };

  // Drag-and-Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSlotIndex(index);
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (index: number) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = draggedSlotIndex ?? parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
      handleSwapSlots(sourceIndex, targetIndex);
    }
    setDraggedSlotIndex(null);
    setDragOverIndex(null);
  };

  if (!isOpen) return null;

  const isSaving = internalLoading || externalSubmitting || isBatchUploading;
  const filledSlotsCount = gallerySlots.filter((s) => Boolean(s && s.url)).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Validasi Input di Sisi Klien
    if (!carFormData.name || !carFormData.name.trim()) {
      const msg = "Nama Unit / Judul kendaraan wajib diisi.";
      setValidationError(msg);
      alert("Peringatan: " + msg);
      return;
    }

    if (!carFormData.main_image || !carFormData.main_image.trim()) {
      const msg = "Silakan unggah atau isi minimal 1 Foto Utama kendaraan terlebih dahulu.";
      setValidationError(msg);
      alert("Peringatan: " + msg);
      return;
    }

    setInternalLoading(true);

    try {
      // Build active gallery sequence
      const activePhotos: GalleryPhotoItem[] = [];
      gallerySlots.forEach((slot, idx) => {
        if (slot && slot.url && slot.url.trim()) {
          activePhotos.push({
            url: slot.url.trim(),
            title: slot.title || `${carFormData.name || "Unit"} - ${GALLERY_SLOTS[idx].label}`,
            tag: GALLERY_SLOTS[idx].label,
          });
        }
      });

      const payloadFormData: CarFormData = {
        ...carFormData,
        gallery: activePhotos,
      };

      if (editingCarId) {
        // Mode EDIT: Update ke Supabase
        const { error: updateError } = await updateCarInSupabase(editingCarId, payloadFormData);
        if (updateError) {
          throw updateError;
        }

        alert("Unit berhasil diperbarui!");
      } else {
        // Mode TAMBAH: Insert baru ke Supabase
        const { error: insertError } = await insertCarToSupabase(payloadFormData);
        if (insertError) {
          throw insertError;
        }

        // Hapus draft di localStorage
        try {
          localStorage.removeItem(CAR_DRAFT_KEY);
        } catch (e) {
          console.warn("[AdminCarModal] Gagal menghapus draft localStorage:", e);
        }

        // Reset form data ke default
        setCarFormData(DEFAULT_RESET_DATA);
        setGallerySlots(Array(10).fill(null));

        // Notifikasi popup alert sesuai permintaan user
        alert("Unit berhasil ditambahkan!");
      }

      // Panggil callback untuk refresh data katalog
      if (onSuccess) {
        await onSuccess();
      } else if (externalOnSubmit) {
        externalOnSubmit(e);
      }

      // Tutup modal secara otomatis
      onClose();
    } catch (err: any) {
      console.error("[AdminCarModal] Gagal menyimpan ke Supabase:", err);
      const errMsg = err?.message || JSON.stringify(err) || "Terjadi kesalahan tidak terduga";
      setValidationError("Gagal menyimpan ke database: " + errMsg);
      alert("Gagal menyimpan: " + errMsg);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#141519] border border-[#272A33] max-w-4xl w-full p-6 sm:p-8 my-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 cursor-pointer transition-colors disabled:opacity-50"
          title="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2 py-0.5 border border-[#D4AF37]/30">
            INVENTORY MANAGEMENT
          </span>
          {!editingCarId && hasDraft && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-800/40">
              <Sparkles className="w-3 h-3" />
              Auto-Save Aktif (Draft Tersimpan)
            </span>
          )}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold uppercase tracking-wider text-white">
          {editingCarId ? "Edit Spesifikasi Unit Mobil" : "Tambah Unit Mobil Baru"}
        </h3>
        <p className="text-xs text-neutral-400 font-light mb-6">
          Lengkapi data spesifikasi kendaraan secara presisi sesuai yang tampil pada katalog dan halaman detail unit.
        </p>

        {/* Validation Warning Alert in Modal */}
        {validationError && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-500 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-mono break-all">{validationError}</div>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* SECTION A: INFORMASI UTAMA & HARGA */}
          <div className="p-4 bg-[#18191E] border border-white/5 space-y-4">
            <span className="text-[11px] font-mono font-semibold tracking-wider text-[#D4AF37] uppercase block">
              1. INFORMASI UTAMA &amp; HARGA
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
                  onChange={(e) => {
                    setValidationError(null);
                    setCarFormData({ ...carFormData, name: e.target.value });
                  }}
                  className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Sub-judul / Tipe Detail
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Civic 1.5 VTEC Turbo Sedan"
                  value={carFormData.model}
                  onChange={(e) => {
                    setValidationError(null);
                    setCarFormData({ ...carFormData, model: e.target.value });
                  }}
                  className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Merek / Brand
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Honda / Toyota / BMW"
                  value={carFormData.brand}
                  onChange={(e) => {
                    setValidationError(null);
                    setCarFormData({ ...carFormData, brand: e.target.value });
                  }}
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
                  max={2035}
                  value={carFormData.year || ""}
                  onChange={(e) => {
                    setValidationError(null);
                    setCarFormData({ ...carFormData, year: Number(e.target.value) });
                  }}
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
                  step="any"
                  placeholder="Contoh: 478000000"
                  value={carFormData.price || ""}
                  onChange={(e) => {
                    setValidationError(null);
                    setCarFormData({ ...carFormData, price: Number(e.target.value) });
                  }}
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
              2. SPESIFIKASI TEKNIS &amp; KELENGKAPAN
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Kilometer / Odometer (KM) *
                </label>
                <input
                  type="number"
                  required
                  step="any"
                  placeholder="Contoh: 28400"
                  value={carFormData.mileage !== undefined ? carFormData.mileage : ""}
                  onChange={(e) => {
                    setValidationError(null);
                    setCarFormData({ ...carFormData, mileage: Number(e.target.value) });
                  }}
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
                  onChange={(e) => {
                    setValidationError(null);
                    setCarFormData({ ...carFormData, fuel_type: e.target.value });
                  }}
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
                  onChange={(e) => {
                    setValidationError(null);
                    setCarFormData({ ...carFormData, color: e.target.value });
                  }}
                  className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Kapasitas Mesin
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 1.5L DOHC VTEC Turbocharged"
                  value={carFormData.engine}
                  onChange={(e) => {
                    setValidationError(null);
                    setCarFormData({ ...carFormData, engine: e.target.value });
                  }}
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
                  onChange={(e) => {
                    setValidationError(null);
                    setCarFormData({ ...carFormData, badge: e.target.value });
                  }}
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
                  onChange={(e) => {
                    setValidationError(null);
                    setCarFormData({ ...carFormData, tax_status: e.target.value });
                  }}
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
                  onChange={(e) => {
                    setValidationError(null);
                    setCarFormData({ ...carFormData, location: e.target.value });
                  }}
                  className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION C: FILE UPLOAD FOTO KE STORAGE */}
          <div className="p-4 bg-[#18191E] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#D4AF37] uppercase block">
                3. FOTO KENDARAAN (CLOUD STORAGE UPLOAD)
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Penyimpanan: <strong className="text-white">car-photos</strong>
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
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
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
                    onChange={onMainImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      disabled={isUploadingMain || isSaving}
                      onClick={() => mainImageInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-semibold uppercase tracking-wider text-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingMain ? "Mengunggah foto..." : "Unggah File Foto Utama"}</span>
                    </button>
                  </div>

                  {/* Optional direct URL input if user has online image link */}
                  <input
                    type="text"
                    placeholder="Atau tempel URL gambar eksternal (https://...)"
                    value={carFormData.main_image}
                    onChange={(e) => {
                      setValidationError(null);
                      setCarFormData({ ...carFormData, main_image: e.target.value });
                    }}
                    className="w-full bg-[#121316] border border-white/10 px-3 py-1.5 text-white placeholder:text-neutral-600 focus:border-[#D4AF37] focus:outline-none text-xs font-mono"
                  />

                  <p className="text-[11px] text-neutral-400 font-light">
                    Mendukung format PNG, JPG, JPEG, atau WebP. Gambar otomatis disimpan ke storage dan menghasilkan tautan publik.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Gallery - 10 Structured Slots */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-200 font-semibold">
                      Galeri Foto Unit (Tepat 10 Slot Sudut Pengambilan)
                    </label>
                    <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 border border-[#D4AF37]/30">
                      {filledSlotsCount} / 10 Slot Terisi
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light mt-1">
                    Susun foto sesuai 10 sudut standar. Setiap thumbnail memiliki tombol 'X' merah untuk hapus, dan dapat digeser posisinya (drag & drop atau tombol panah) agar pas dengan label.
                  </p>
                </div>

                {/* Batch multi-upload button */}
                <div className="shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={batchInputRef}
                    onChange={handleBatchGalleryUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isBatchUploading || isSaving}
                    onClick={() => batchInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black uppercase text-[11px] font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isBatchUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengunggah...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ Unggah Sekaligus (Multi)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 10 Slots Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
                {GALLERY_SLOTS.map((slotInfo, index) => {
                  const photo = gallerySlots[index];
                  const isUploadingThis = uploadingSlotIndex === index;
                  const isDragTarget = dragOverIndex === index;
                  const isDraggedSource = draggedSlotIndex === index;

                  return (
                    <div
                      key={slotInfo.id}
                      className={`flex flex-col rounded bg-[#101114] border transition-all ${
                        isDragTarget
                          ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50 bg-[#D4AF37]/5"
                          : photo
                          ? "border-white/20 hover:border-white/40"
                          : "border-white/10 hover:border-[#D4AF37]/40"
                      } ${isDraggedSource ? "opacity-40" : ""}`}
                    >
                      {/* Slot Header Label */}
                      <div className="px-2.5 py-1.5 bg-[#141519] border-b border-white/5 flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-semibold tracking-wider text-neutral-300 truncate">
                          {slotInfo.id}. {slotInfo.label}
                        </span>
                        {photo ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Foto Terisi" />
                        ) : (
                          <span className="text-[9px] font-mono text-neutral-500 shrink-0">Kosong</span>
                        )}
                      </div>

                      {/* Hidden File Input for this single slot */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => {
                          singleSlotInputRefs.current[index] = el;
                        }}
                        onChange={(e) => handleSlotFileChange(index, e)}
                        className="hidden"
                      />

                      {/* Slot Body Area */}
                      <div
                        className="relative h-28 sm:h-32 bg-black flex flex-col justify-center items-center overflow-hidden"
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={() => handleDragLeave(index)}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        {isUploadingThis ? (
                          <div className="flex flex-col items-center justify-center p-2 text-center text-[#D4AF37]">
                            <Loader2 className="w-5 h-5 animate-spin mb-1" />
                            <span className="text-[9px] font-mono">Mengunggah...</span>
                          </div>
                        ) : photo && photo.url ? (
                          <div
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, index)}
                            className="relative w-full h-full group cursor-grab active:cursor-grabbing"
                            title="Tarik/Drag untuk tukar posisi, atau gunakan tombol panah"
                          >
                            <img
                              src={photo.url}
                              alt={slotInfo.label}
                              className="w-full h-full object-cover select-none pointer-events-none"
                            />

                            {/* Tombol 'X' Merah di Sudut Kanan Atas thumbnail (Persis Foto Utama) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSlotPhoto(index);
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer z-20 shadow-md"
                              title={`Hapus foto ${slotInfo.label}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Drag Indicator Badge on Top Left */}
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-xs text-[9px] font-mono text-neutral-300 flex items-center gap-1 pointer-events-none">
                              <Move className="w-2.5 h-2.5 text-[#D4AF37]" />
                              <span>#{slotInfo.id}</span>
                            </div>

                            {/* Bottom Controls Bar (Panah Geser & Ganti Foto) */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-1.5 flex items-center justify-between gap-1 z-10">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSwapSlots(index, index - 1);
                                }}
                                className="p-1 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white rounded transition-colors disabled:opacity-20 disabled:hover:bg-white/10 disabled:hover:text-white cursor-pointer"
                                title="Geser ke kiri (tukar posisi)"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  singleSlotInputRefs.current[index]?.click();
                                }}
                                className="px-1.5 py-0.5 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-neutral-200 text-[9px] font-mono rounded transition-colors cursor-pointer flex items-center gap-1"
                                title="Ganti foto slot ini"
                              >
                                <Upload className="w-2.5 h-2.5" />
                                <span>Ganti</span>
                              </button>

                              <button
                                type="button"
                                disabled={index === GALLERY_SLOTS.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSwapSlots(index, index + 1);
                                }}
                                className="p-1 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white rounded transition-colors disabled:opacity-20 disabled:hover:bg-white/10 disabled:hover:text-white cursor-pointer"
                                title="Geser ke kanan (tukar posisi)"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Empty Slot Upload Card */
                          <div
                            onClick={() => singleSlotInputRefs.current[index]?.click()}
                            className="w-full h-full flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:bg-white/5 transition-colors group"
                            title={`Klik untuk unggah foto ${slotInfo.label}`}
                          >
                            <Camera className="w-5 h-5 mb-1 text-neutral-600 group-hover:text-[#D4AF37] transition-colors" />
                            <span className="text-[10px] font-mono text-neutral-400 group-hover:text-white transition-colors">
                              + Unggah Foto
                            </span>
                            <span className="text-[8px] font-mono text-neutral-500 mt-0.5">
                              {slotInfo.label}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION D: DESKRIPSI & POIN KEUNGGULAN (DYNAMIC LIST) */}
          <div className="p-4 bg-[#18191E] border border-white/5 space-y-4">
            <span className="text-[11px] font-mono font-semibold tracking-wider text-[#D4AF37] uppercase block">
              4. DESKRIPSI &amp; POIN KEUNGGULAN UNIT
            </span>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Deskripsi Lengkap Kondisi Mobil
              </label>
              <textarea
                rows={4}
                value={carFormData.description}
                onChange={(e) => {
                  setValidationError(null);
                  setCarFormData({ ...carFormData, description: e.target.value });
                }}
                placeholder="Jelaskan kondisi riil eksterior, interior, riwayat perawatan di bengkel resmi, kepemilikan tangan pertama, dan jaminan bebas tabrak/banjir..."
                className="w-full bg-[#121316] border border-white/10 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-[#D4AF37] focus:outline-none"
              ></textarea>
            </div>

            {/* Dynamic Highlights List */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Poin Keunggulan Unit (Checklist Garansi &amp; Fitur)
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
                      onAddHighlight();
                    }
                  }}
                  className="flex-1 bg-[#121316] border border-white/10 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-[#D4AF37] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={onAddHighlight}
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
                      onClick={() => onRemoveHighlight(idx)}
                      className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
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
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-neutral-300 uppercase tracking-wider text-xs cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-semibold uppercase tracking-wider text-xs cursor-pointer disabled:opacity-50 shadow-lg"
            >
              {isSaving
                ? "MENYIMPAN KE DATABASE..."
                : editingCarId
                ? "SIMPAN PERUBAHAN UNIT"
                : "TAMBAH UNIT KE KATALOG"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
