import React, { useRef, useState } from "react";
import { X, Upload, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { PortfolioFormData } from "../../types";

interface AdminPortfolioModalProps {
  isOpen: boolean;
  editingPortfolioId: string | null;
  formData: PortfolioFormData;
  setFormData: React.Dispatch<React.SetStateAction<PortfolioFormData>>;
  submitting: boolean;
  isUploadingImage?: boolean;
  hasDraft?: boolean;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminPortfolioModal({
  isOpen,
  editingPortfolioId,
  formData,
  setFormData,
  submitting,
  isUploadingImage = false,
  hasDraft = false,
  onImageUpload,
  onClose,
  onSubmit,
}: AdminPortfolioModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.title.trim()) {
      setValidationError("Judul Portofolio wajib diisi.");
      return;
    }
    if (!formData.badge.trim()) {
      setValidationError("Badge Portofolio wajib diisi.");
      return;
    }
    if (!formData.car_model.trim()) {
      setValidationError("Model Mobil Klien wajib diisi.");
      return;
    }
    if (!formData.image_url || !formData.image_url.trim()) {
      setValidationError("Foto hasil pengerjaan wajib diunggah atau diisi URL-nya.");
      return;
    }

    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141519] border border-[#272A33] max-w-xl w-full p-6 sm:p-8 my-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white cursor-pointer transition-colors"
          title="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2 py-0.5 border border-[#D4AF37]/30">
            PORTFOLIO MANAGEMENT
          </span>
          {!editingPortfolioId && hasDraft && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-800/40">
              <Sparkles className="w-3 h-3" />
              Auto-Save Aktif (Draft Tersimpan)
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold uppercase tracking-wider text-white mb-1">
          {editingPortfolioId ? "Edit Portofolio" : "Tambah Portofolio Baru"}
        </h3>
        <p className="text-xs text-neutral-400 font-light mb-6">
          Tambahkan dokumentasi hasil pengerjaan detailing, biled, atau cuci mobil ke database.
        </p>

        {validationError && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500 text-red-200 text-xs flex items-start gap-2.5">
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

        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Judul Portofolio *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Custom Retrofit Biled 3 Inch"
              value={formData.title}
              onChange={(e) => {
                setValidationError(null);
                setFormData({ ...formData, title: e.target.value });
              }}
              className="w-full bg-[#1B1D22] border border-white/10 px-3 py-2 text-white placeholder:text-neutral-600 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Kategori *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as PortfolioFormData["category"],
                  })
                }
                className="w-full bg-[#1B1D22] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none cursor-pointer"
              >
                <option value="Detailing">Detailing &amp; Coating</option>
                <option value="Pemasangan Biled">Pemasangan Biled</option>
                <option value="Cuci Mobil Premium">Cuci Mobil Premium</option>
                <option value="Interior & Mesin">Interior &amp; Mesin</option>
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
                value={formData.badge}
                onChange={(e) => {
                  setValidationError(null);
                  setFormData({ ...formData, badge: e.target.value });
                }}
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
              value={formData.car_model}
              onChange={(e) => {
                setValidationError(null);
                setFormData({ ...formData, car_model: e.target.value });
              }}
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
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full bg-[#1B1D22] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* FOTO & STORAGE UPLOAD SECTION */}
          <div className="p-3.5 bg-[#18191E] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#D4AF37]">
                Foto Hasil Pengerjaan *
              </label>
              {onImageUpload && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-[#D4AF37] cursor-pointer disabled:opacity-50"
                >
                  {isUploadingImage ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Upload className="w-3 h-3" />
                  )}
                  <span>{isUploadingImage ? "Mengunggah..." : "Upload File Foto"}</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageUpload}
            />

            <input
              type="text"
              required
              placeholder="https://images.unsplash.com/... atau URL Cloud Storage"
              value={formData.image_url}
              onChange={(e) => {
                setValidationError(null);
                setFormData({ ...formData, image_url: e.target.value });
              }}
              className="w-full bg-[#1B1D22] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
            />

            {formData.image_url && (
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-16 h-12 object-cover border border-white/10"
                />
                <span className="text-[10px] text-neutral-400 font-mono">
                  Preview Foto Terpilih
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Deskripsi Hasil Pengerjaan
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#1B1D22] border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/10 hover:bg-white/5 text-neutral-300 uppercase tracking-wider text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-semibold uppercase tracking-wider text-xs cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Menyimpan ke Database..." : editingPortfolioId ? "SIMPAN PERUBAHAN" : "TAMBAH PORTOFOLIO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
