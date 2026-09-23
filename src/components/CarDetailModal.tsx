import { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Gauge,
  Cog,
  Fuel,
  MapPin,
  FileCheck,
  Calculator,
  Share2
} from "lucide-react";
import { CarUnit, generateCarWhatsAppLink } from "../data/carsData";

interface CarDetailModalProps {
  car: CarUnit | null;
  onClose: () => void;
}

export default function CarDetailModal({ car, onClose }: CarDetailModalProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [dpPercentage, setDpPercentage] = useState(20);
  const [tenorMonths, setTenorMonths] = useState(36);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset photo index when car changes
  useEffect(() => {
    setActivePhotoIndex(0);
    setCopiedLink(false);
  }, [car]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!car) return null;

  // Credit calculation estimate:
  // DP = Price * DP%
  // Loan principal = Price - DP
  // Flat interest approx 6.5% / year
  const dpAmount = Math.round((car.price * dpPercentage) / 100);
  const loanPrincipal = car.price - dpAmount;
  const years = tenorMonths / 12;
  const totalInterest = loanPrincipal * 0.065 * years;
  const monthlyInstallment = Math.round((loanPrincipal + totalInterest) / tenorMonths);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : car.gallery.length - 1));
  };

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev < car.gallery.length - 1 ? prev + 1 : 0));
  };

  const handleCopyShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const whatsappUrl = generateCarWhatsAppLink(car.name, car.formattedPrice);

  return (
    <div
      id="car-detail-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6 bg-black/90 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="car-detail-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#15161A] border border-[#2D313A] max-w-5xl w-full max-h-[92dvh] sm:max-h-[90vh] overflow-hidden relative shadow-2xl my-auto text-white rounded-t-2xl sm:rounded-none flex flex-col animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 duration-300"
      >
        {/* Mobile Drag Pill */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-2.5 sm:hidden shrink-0"></div>

        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-[#121215] shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-black bg-[#D4AF37] px-2.5 py-1">
              {car.badge}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              UNIT ID: {car.id.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleCopyShare}
              title="Bagikan Unit Mobil"
              className="min-w-[44px] min-h-[44px] p-2 text-neutral-400 hover:text-[#D4AF37] transition-colors text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? "Tersalin!" : "Share"}</span>
            </button>
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Tutup modal unit"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="max-h-[82vh] overflow-y-auto no-scrollbar">
          {/* PHOTO CAROUSEL SECTION */}
          <div className="relative bg-black select-none">
            {/* Main Active Photo */}
            <div className="relative h-[280px] sm:h-[420px] lg:h-[480px] w-full overflow-hidden flex items-center justify-center">
              <img
                src={car.gallery[activePhotoIndex].url}
                alt={`${car.name} - ${car.gallery[activePhotoIndex].title}`}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Photo Overlay Badges */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#15161A] via-transparent to-black/30 pointer-events-none"></div>

              <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs text-neutral-300">
                <span>{car.gallery[activePhotoIndex].tag}</span>: {car.gallery[activePhotoIndex].title}
              </div>

              <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs font-mono text-[#D4AF37]">
                {activePhotoIndex + 1} / {car.gallery.length} FOTO
              </div>

              {/* Nav Arrows */}
              <button
                onClick={handlePrevPhoto}
                aria-label="Foto sebelumnya"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black transition-colors flex items-center justify-center cursor-pointer border border-white/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextPhoto}
                aria-label="Foto berikutnya"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black transition-colors flex items-center justify-center cursor-pointer border border-white/10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 p-3 bg-[#0F0F11] border-t border-[#23262D] overflow-x-auto no-scrollbar">
              {car.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative shrink-0 w-20 sm:w-24 h-14 sm:h-16 overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhotoIndex === idx
                      ? "border-[#D4AF37] opacity-100 scale-105"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-[9px] text-center text-neutral-300 py-0.5 truncate px-1">
                    {img.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* DETAIL INFORMATION BODY */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Title & Price Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase block mb-1">
                  {car.brand} • {car.year} • {car.transmission}
                </span>
                <h3 className="text-2xl sm:text-4xl font-light text-white tracking-tight">
                  {car.name}
                </h3>
                <p className="text-sm text-neutral-400 mt-1">
                  {car.model}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                  Harga Tunai / Cash
                </span>
                <span className="text-2xl sm:text-4xl font-semibold text-[#D4AF37] tracking-tight">
                  {car.formattedPrice}
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  (Nego Sopan di Lokasi / Terima Tukar Tambah)
                </span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div>
              <h4 className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase mb-4">
                SPESIFIKASI LENGKAP UNIT
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#1A1D22] border border-white/5 p-3.5">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Tahun Pembuatan</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{car.year}</span>
                </div>

                <div className="bg-[#1A1D22] border border-white/5 p-3.5">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
                    <Gauge className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Odometer / KM</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{car.formattedMileage}</span>
                </div>

                <div className="bg-[#1A1D22] border border-white/5 p-3.5">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
                    <Cog className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Transmisi</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{car.transmission}</span>
                </div>

                <div className="bg-[#1A1D22] border border-white/5 p-3.5">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
                    <Fuel className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Bahan Bakar</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{car.fuelType}</span>
                </div>

                <div className="bg-[#1A1D22] border border-white/5 p-3.5">
                  <div className="text-neutral-400 text-xs mb-1">Kapasitas Mesin</div>
                  <span className="text-sm font-semibold text-white">{car.engine}</span>
                </div>

                <div className="bg-[#1A1D22] border border-white/5 p-3.5">
                  <div className="text-neutral-400 text-xs mb-1">Warna Eksterior</div>
                  <span className="text-sm font-semibold text-white">{car.color}</span>
                </div>

                <div className="bg-[#1A1D22] border border-white/5 p-3.5">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
                    <FileCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Status Pajak</span>
                  </div>
                  <span className="text-sm font-semibold text-[#D4AF37]">{car.taxStatus}</span>
                </div>

                <div className="bg-[#1A1D22] border border-white/5 p-3.5">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Lokasi Unit</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{car.location}</span>
                </div>
              </div>
            </div>

            {/* Description & Guarantee Guarantee */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
                  DESKRIPSI KONDISI MOBIL
                </h4>
                <p className="text-sm text-neutral-300 font-light leading-relaxed">
                  {car.description}
                </p>

                {/* 100% Quality Seal */}
                <div className="p-4 bg-[#111215] border border-[#D4AF37]/30 flex items-center gap-3 mt-4">
                  <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white block">
                      GARANSI STANDAR THIRTEEN PROJECT
                    </span>
                  </div>
                </div>
              </div>

              {/* Checklist Keunggulan */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
                  POIN KEUNGGULAN UNIT
                </h4>
                <div className="space-y-2.5">
                  {car.highlights.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-neutral-300 bg-[#181A1E] p-2.5 border border-white/5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SIMULASI ESTIMASI KREDIT */}
            <div className="p-5 sm:p-6 bg-[#181A1F] border border-[#262A32] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
                    SIMULASI ESTIMASI KREDIT
                  </h4>
                </div>
                <span className="text-[11px] text-neutral-400">
                  *Estimasi bunga flat 6.5%/tahun, DP fleksibel
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">
                    Uang Muka (DP): {dpPercentage}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    step="5"
                    value={dpPercentage}
                    onChange={(e) => setDpPercentage(Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                  <span className="text-xs font-mono text-white mt-1 block">
                    {formatRupiah(dpAmount)}
                  </span>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">
                    Tenor Pembiayaan:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[12, 24, 36, 48].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTenorMonths(t)}
                        className={`text-xs min-h-[42px] py-2 border transition-colors flex items-center justify-center cursor-pointer ${
                          tenorMonths === t
                            ? "bg-[#D4AF37] text-black border-[#D4AF37] font-semibold"
                            : "border-white/10 text-neutral-300 hover:border-white/30"
                        }`}
                      >
                        {t / 12} Thn
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#121316] p-3 border border-white/5 flex flex-col justify-center">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                    Estimasi Cicilan:
                  </span>
                  <span className="text-lg font-bold text-[#D4AF37]">
                    {formatRupiah(monthlyInstallment)}
                    <span className="text-xs font-normal text-neutral-400"> /bln</span>
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION CTA ROW */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pb-[env(safe-area-inset-bottom,0px)]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-modal-wa-avail"
                className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10 transition-all duration-200 active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>TANYA AVAILABILITY VIA WA</span>
              </a>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end">
                <a
                  href={`https://wa.me/6282272777421?text=${encodeURIComponent(
                    `Halo THIRTEEN PROJECT, saya ingin booking jadwal inspeksi langsung / test drive untuk unit ${car.name} (${car.formattedPrice}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[46px] px-5 py-3 sm:py-4 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] font-medium text-xs tracking-wider uppercase flex items-center justify-center text-center transition-colors active:bg-white/5"
                >
                  Jadwalkan Test Drive
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-4 py-3 sm:py-4 text-xs text-neutral-400 hover:text-white uppercase tracking-wider cursor-pointer border border-white/10 sm:border-transparent text-center"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
