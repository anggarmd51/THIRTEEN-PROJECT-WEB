import { useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { PortfolioFormData } from "../../types";

interface AdminPortfolioModalProps {
  isOpen: boolean;
  editingPortfolioId: string | null;
  formData: PortfolioFormData;
  setFormData: React.Dispatch<React.SetStateAction<PortfolioFormData>>;
  submitting: boolean;
  isUploadingImage?: boolean;
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
  onImageUpload,
  onClose,
  onSubmit,
}: AdminPortfolioModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141519] border border-[#272A33] max-w-xl w-full p-6 sm:p-8 my-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-semibold uppercase tracking-wider text-white mb-1">
          {editingPortfolioId ? "Edit Portofolio" : "Tambah Portofolio Baru"}
        </h3>
        <p className="text-xs text-neutral-400 font-light mb-6">
          Tambahkan dokumentasi hasil pengerjaan detailing, biled, atau cuci mobil ke Supabase.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Judul Portofolio *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Custom Retrofit Biled 3 Inch"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, car_model: e.target.value })}
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
              type="url"
              required
              placeholder="https://images.unsplash.com/... atau URL Supabase Storage"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
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
              {submitting ? "Menyimpan ke Supabase..." : editingPortfolioId ? "SIMPAN PERUBAHAN" : "TAMBAH PORTOFOLIO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
