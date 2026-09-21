import { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  X,
  MessageSquare,
  Database,
  RefreshCw,
  AlertCircle,
  Layers,
} from "lucide-react";
import { PortfolioItem } from "../types";
import { generateServiceWhatsAppLink } from "../data/carsData";
import { useSupabasePortfolios } from "../lib/useSupabaseData";

interface PortfolioSliderProps {
  onOpenBookingWithService?: (serviceName: string) => void;
}

export default function PortfolioSlider({ onOpenBookingWithService }: PortfolioSliderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { portfolios, loading, error, isUsingSupabase, refetch } = useSupabasePortfolios();

  const categories = [
    "Semua",
    "Detailing",
    "Pemasangan Biled",
    "Cuci Mobil Premium",
    "Interior & Mesin",
  ];

  const filteredItems =
    selectedCategory === "Semua"
      ? portfolios
      : portfolios.filter((item) => item.category === selectedCategory);

  // Scroll to slide
  const scrollToSlide = (index: number) => {
    if (!sliderRef.current || filteredItems.length === 0) return;
    const clampedIndex = Math.max(0, Math.min(index, filteredItems.length - 1));
    setCurrentIndex(clampedIndex);

    const container = sliderRef.current;
    const cardWidth = container.offsetWidth > 768 ? 380 : 300;
    container.scrollTo({
      left: clampedIndex * (cardWidth + 24),
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    scrollToSlide(currentIndex + 1);
  };

  const handlePrev = () => {
    scrollToSlide(currentIndex - 1);
  };

  // Sync scroll position with current index indicator
  const handleScroll = () => {
    if (!sliderRef.current || filteredItems.length === 0) return;
    const container = sliderRef.current;
    const cardWidth = container.offsetWidth > 768 ? 380 : 300;
    const index = Math.round(container.scrollLeft / (cardWidth + 24));
    setCurrentIndex(Math.min(index, filteredItems.length - 1));
  };

  return (
    <section
      id="portofolio"
      className="py-12 sm:py-16 md:py-24 lg:py-32 bg-[#0F0F11] border-t border-[#1F1F23] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Tag */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-xs font-mono tracking-widest text-[#D4AF37]">03</span>
            <span className="w-6 sm:w-8 h-[1px] bg-[#D4AF37]"></span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-[#D4AF37] uppercase">
              THE WORK
            </span>
            {isUsingSupabase && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 border border-[#D4AF37]/30 text-[10px] font-mono">
                <Database className="w-3 h-3" />
                <span>SUPABASE LIVE</span>
              </span>
            )}
          </div>

          <a
            href={`https://wa.me/6282272777421?text=${encodeURIComponent(
              "Halo THIRTEEN PROJECT, saya ingin melihat portofolio hasil pengerjaan terbaru lainnya."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-neutral-400 hover:text-[#D4AF37] uppercase transition-colors"
          >
            <span>LIHAT PORTOFOLIO WA</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Headline & Slider Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-[1.2]">
              Bukti Nyata{" "}
              <span className="font-serif-accent text-[#D4AF37] italic font-normal">
                Hasil Pengerjaan Kami.
              </span>
            </h2>
            <p className="text-neutral-400 font-light text-xs sm:text-sm md:text-base mt-2 sm:mt-3 max-w-2xl">
              Geser ke kanan untuk melihat galeri portofolio pengerjaan detailing, upgrade lampu Biled, dan cuci mobil premium kami.
            </p>
          </div>

          {/* Navigation Controls */}
          {filteredItems.length > 0 && (
            <div className="flex items-center gap-4 self-start lg:self-end">
              <div className="text-xs font-mono text-neutral-400 tracking-widest">
                <span className="text-[#D4AF37]">0{currentIndex + 1}</span> / 0{filteredItems.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  aria-label="Slide sebelumnya"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] border border-white/20 hover:border-[#D4AF37] disabled:opacity-30 disabled:hover:border-white/20 flex items-center justify-center text-white hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= filteredItems.length - 1}
                  aria-label="Slide berikutnya"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] border border-white/20 hover:border-[#D4AF37] disabled:opacity-30 disabled:hover:border-white/20 flex items-center justify-center text-white hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 sm:mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                if (sliderRef.current) sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
              }}
              className={`text-xs min-h-[44px] px-4 py-2.5 uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center ${
                selectedCategory === cat
                  ? "bg-[#D4AF37] text-black font-semibold"
                  : "bg-[#181A1E] text-neutral-400 hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="flex gap-6 overflow-hidden pb-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="shrink-0 w-[280px] sm:w-[360px] h-[460px] bg-[#17181C] border border-[#23262D] animate-pulse p-6 flex flex-col justify-end space-y-3"
              >
                <div className="h-4 bg-white/10 w-1/3"></div>
                <div className="h-6 bg-white/10 w-3/4"></div>
                <div className="h-4 bg-white/5 w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="p-8 border border-red-900/40 bg-red-950/20 text-center my-6 max-w-xl mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-1">
              Gagal Memuat Galeri Portofolio
            </h4>
            <p className="text-xs text-neutral-400 mb-4">{error}</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black font-semibold text-xs tracking-wider uppercase cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="p-12 border border-white/5 bg-[#141518] text-center my-6 max-w-xl mx-auto space-y-3">
            <Layers className="w-10 h-10 text-neutral-500 mx-auto" />
            <h4 className="text-base font-light text-white">Belum Ada Portofolio Tersedia</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Portofolio pada kategori &quot;{selectedCategory}&quot; belum terisi di database Supabase.
            </p>
          </div>
        )}

        {/* Horizontal Slider / Carousel Container */}
        {!loading && !error && filteredItems.length > 0 && (
          <>
            <div
              ref={sliderRef}
              onScroll={handleScroll}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-6 pt-2 cursor-grab active:cursor-grabbing"
            >
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className="snap-start shrink-0 w-[280px] sm:w-[360px] lg:w-[380px] group relative bg-[#17181C] border border-[#23262D] hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-end overflow-hidden cursor-pointer"
                  style={{ height: "460px" }}
                >
                  {/* Background Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Scrim Overlay for Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-[#0F0F11]/60 to-transparent"></div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>

                  {/* Card Foreground Content */}
                  <div className="relative z-10 p-6 sm:p-7 space-y-2">
                    <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-semibold text-[#D4AF37] block">
                      {item.badge}
                    </span>

                    <h3 className="text-xl sm:text-2xl font-light text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                      {item.title}
                    </h3>

                    <p className="text-xs text-neutral-400 font-serif-accent italic">
                      {item.subtitle}
                    </p>

                    <div className="pt-2 flex items-center gap-1 text-[11px] text-[#D4AF37] font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>LIHAT DETAIL PENGERJAAN</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Slide Progress Track */}
            <div className="mt-4 flex items-center justify-between">
              <div className="w-full max-w-xs h-[2px] bg-neutral-800 relative">
                <div
                  className="h-full bg-[#D4AF37] transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / filteredItems.length) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs text-neutral-500 font-light">
                Sentuh / geser layar untuk navigasi foto
              </span>
            </div>
          </>
        )}
      </div>

      {/* Portfolio Item Detail Lightbox Modal */}
      {activeItem && (
        <div
          id="portfolio-detail-modal"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-md"
          onClick={() => setActiveItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#17181C] border border-[#2D313A] max-w-3xl w-full overflow-hidden relative max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl rounded-t-2xl sm:rounded-none"
          >
            {/* Mobile Drag Indicator */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto my-2 sm:hidden shrink-0"></div>

            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/70 hover:bg-black text-white hover:text-[#D4AF37] transition-colors"
              aria-label="Tutup modal galeri"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="relative h-56 sm:h-72 md:h-80 w-full overflow-hidden shrink-0">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17181C] via-transparent to-black/30"></div>
              <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6">
                <span className="text-[11px] sm:text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold block mb-1">
                  {activeItem.badge} • {activeItem.category}
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-white">
                  {activeItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-serif-accent italic">
                  {activeItem.subtitle} (Model: {activeItem.carModel})
                </p>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 overflow-y-auto pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
              <div>
                <h4 className="text-[11px] sm:text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-1.5 sm:mb-2">
                  DESKRIPSI PENGERJAAN
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] sm:text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2 sm:mb-3">
                  TAHAPAN &amp; KEUNGGULAN PERLAKUAN
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {activeItem.treatmentList.map((treatment, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-neutral-300 flex items-start gap-2 bg-[#121215] p-2 sm:p-2.5 border border-white/5"
                    >
                      <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{treatment}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                  <a
                    href={generateServiceWhatsAppLink(activeItem.title, activeItem.carModel)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[46px] px-5 py-3 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>KONSULTASI HASIL SERUPA (WA)</span>
                  </a>

                  {onOpenBookingWithService && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenBookingWithService(activeItem.title);
                        setActiveItem(null);
                      }}
                      className="min-h-[46px] px-4 py-3 border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Form Reservasi</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="min-h-[44px] px-4 py-2.5 border border-neutral-700 text-neutral-400 hover:text-white text-xs uppercase tracking-wider cursor-pointer"
                >
                  Tutup Galeri
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
