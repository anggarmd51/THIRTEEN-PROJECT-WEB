import React, { useRef, useState } from "react";
import { X, Upload, Camera, PlusCircle, Trash, Check, AlertCircle, Sparkles } from "lucide-react";
import { CarFormData } from "../../types";

interface AdminCarModalProps {
  isOpen: boolean;
  editingCarId: string | null;
  carFormData: CarFormData;
  setCarFormData: React.Dispatch<React.SetStateAction<CarFormData>>;
  newHighlightInput: string;
  setNewHighlightInput: (val: string) => void;
  isUploadingMain: boolean;
  isUploadingGallery: boolean;
  submitting: boolean;
  hasDraft?: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onMainImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveGalleryPhoto: (index: number) => void;
  onAddHighlight: () => void;
  onRemoveHighlight: (index: number) => void;
}

export default function AdminCarModal({
  isOpen,
  editingCarId,
  carFormData,
  setCarFormData,
  newHighlightInput,
  setNewHighlightInput,
  isUploadingMain,
  isUploadingGallery,
  submitting,
  hasDraft = false,
  onClose,
  onSubmit,
  onMainImageUpload,
  onGalleryUpload,
  onRemoveGalleryPhoto,
  onAddHighlight,
  onRemoveHighlight,
}: AdminCarModalProps) {
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Client-side validations with clear feedback
    if (!carFormData.name.trim()) {
      setValidationError("Nama Unit / Judul kendaraan wajib diisi.");
      return;
    }
    if (!carFormData.model.trim()) {
      setValidationError("Sub-judul / Tipe Detail kendaraan wajib diisi.");
      return;
    }
    if (!carFormData.brand.trim()) {
      setValidationError("Merek / Brand kendaraan wajib diisi.");
      return;
    }
    if (!carFormData.year || carFormData.year < 1990 || carFormData.year > 2035) {
      setValidationError("Tahun pembuatan harus berada di antara 1990 dan 2035.");
      return;
    }
    if (!carFormData.price || carFormData.price <= 0) {
      setValidationError("Harga Jual kendaraan wajib diisi dengan angka positif.");
      return;
    }
    if (carFormData.mileage === undefined || carFormData.mileage === null || carFormData.mileage < 0) {
      setValidationError("Kilometer / Odometer harus diisi dengan angka minimal 0.");
      return;
    }
    if (!carFormData.fuel_type.trim()) {
      setValidationError("Bahan Bakar kendaraan wajib diisi.");
      return;
    }
    if (!carFormData.color.trim()) {
      setValidationError("Warna Eksterior kendaraan wajib diisi.");
      return;
    }
    if (!carFormData.engine.trim()) {
      setValidationError("Kapasitas Mesin kendaraan wajib diisi.");
      return;
    }
    if (!carFormData.badge.trim()) {
      setValidationError("Badge / Tag kendaraan wajib diisi.");
      return;
    }
    if (!carFormData.tax_status.trim()) {
      setValidationError("Status Pajak kendaraan wajib diisi.");
      return;
    }
    if (!carFormData.location.trim()) {
      setValidationError("Lokasi Unit kendaraan wajib diisi.");
      return;
    }
    if (!carFormData.description.trim()) {
      setValidationError("Deskripsi Lengkap Kondisi Mobil wajib diisi.");
      return;
    }
    if (!carFormData.main_image || !carFormData.main_image.trim()) {
      setValidationError("Silakan unggah atau sediakan minimal 1 Foto Utama kendaraan terlebih dahulu.");
      return;
    }

    // Call external submit handler
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#141519] border border-[#272A33] max-w-4xl w-full p-6 sm:p-8 my-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 cursor-pointer transition-colors"
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
            <div className="flex-1 font-mono">{validationError}</div>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
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
                  Sub-judul / Tipe Detail *
                </label>
                <input
                  type="text"
                  required
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
                  Merek / Brand *
                </label>
                <input
                  type="text"
                  required
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
                  Kapasitas Mesin *
                </label>
                <input
                  type="text"
                  required
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
                      disabled={isUploadingMain}
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
                  onChange={onGalleryUpload}
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
                        onClick={() => onRemoveGalleryPhoto(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
              4. DESKRIPSI &amp; POIN KEUNGGULAN UNIT
            </span>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Deskripsi Lengkap Kondisi Mobil *
              </label>
              <textarea
                rows={4}
                required
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
              className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-neutral-300 uppercase tracking-wider text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-2.5 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-semibold uppercase tracking-wider text-xs cursor-pointer disabled:opacity-50 shadow-lg"
            >
              {submitting
                ? "Menyimpan ke Database..."
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
