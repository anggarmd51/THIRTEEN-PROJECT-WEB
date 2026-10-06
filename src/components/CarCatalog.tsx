import { useState, useMemo } from "react";
import { ArrowUpRight, MessageCircle, Eye, Database, RefreshCw, AlertCircle, Car as CarIcon } from "lucide-react";
import { CarUnit } from "../types";
import { CARS_DATA, generateCarWhatsAppLink } from "../data/carsData";
import { useSupabaseCars } from "../lib/useSupabaseData";

const FALLBACK_CAR_IMAGE = "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1400&auto=format&fit=crop";

interface CarCatalogProps {
  onSelectCar: (car: CarUnit) => void;
}

export default function CarCatalog({ onSelectCar }: CarCatalogProps) {
  const [filter, setFilter] = useState<string>("Semua");
  const { cars, loading, error, isUsingSupabase, refetch } = useSupabaseCars();

  const filterOptions = ["Semua", "Sedan", "SUV", "Low KM", "Executive"];

  // Gracefully fallback to CARS_DATA if Supabase fetch failed or returned empty
  const displayCars = useMemo(() => {
    if (!loading && (error || cars.length === 0)) {
      return CARS_DATA;
    }
    return cars.length > 0 ? cars : CARS_DATA;
  }, [cars, loading, error]);

  const filteredCars = useMemo(() => {
    return displayCars.filter((car) => {
      if (filter === "Semua") return true;
      if (filter === "Sedan") {
        return (
          car.model.toLowerCase().includes("sedan") ||
          car.name.toLowerCase().includes("civic") ||
          car.name.toLowerCase().includes("bmw") ||
          car.name.toLowerCase().includes("mercedes")
        );
      }
      if (filter === "SUV") {
        return (
          car.name.toLowerCase().includes("fortuner") ||
          car.name.toLowerCase().includes("pajero") ||
          car.name.toLowerCase().includes("hr-v")
        );
      }
      if (filter === "Low KM") return car.mileage < 30000;
      if (filter === "Executive") return car.badge === "EXECUTIVE" || car.badge === "LUXURY SEDAN";
      return true;
    });
  }, [displayCars, filter]);

  return (
    <section
      id="katalog-mobil"
      className="py-12 sm:py-16 md:py-24 lg:py-32 bg-[#0F0F11] border-t border-[#1F1F23] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Tag */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          <span className="text-xs font-mono tracking-widest text-[#D4AF37]">04</span>
          <span className="w-6 sm:w-8 h-[1px] bg-[#D4AF37]"></span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-[#D4AF37] uppercase">
            SELECTED INVENTORY
          </span>
        </div>

        {/* Section Title & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-end mb-8 sm:mb-12">
          <div className="lg:col-span-7">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-[1.2]">
              Temukan{" "}
              <span className="font-serif-accent text-[#D4AF37] italic font-normal">
                Mobil Pilihan Anda.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5 text-neutral-400 font-light text-xs sm:text-sm md:text-base leading-relaxed">
            <p>
              Unit pilihan, kondisi terverifikasi, inspeksi 150+ titik, dan siap menemani perjalanan berikutnya dengan rasa aman tanpa kompromi.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4 pb-4 sm:pb-8 border-b border-white/5 mb-6 sm:mb-10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`text-xs min-h-[44px] px-4 py-2.5 uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center shrink-0 ${
                  filter === opt
                    ? "bg-[#D4AF37] text-black font-semibold shadow-md"
                    : "bg-[#181A1E] text-neutral-400 hover:text-white border border-white/5"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
            {isUsingSupabase && (
              <span className="flex items-center gap-1.5 text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 border border-[#D4AF37]/30 text-[10px]">
                <Database className="w-3 h-3" />
                <span>SUPABASE LIVE</span>
              </span>
            )}
            <span className="text-[11px] sm:text-xs">
              MENAMPILKAN {loading ? "..." : filteredCars.length} UNIT TERSEDIA
            </span>
          </div>
        </div>

        {/* LOADING SKELETON STATE */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="bg-[#17181C] border border-[#23262D] overflow-hidden animate-pulse flex flex-col justify-between"
              >
                <div className="h-64 sm:h-72 bg-white/5"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-white/10 w-2/3"></div>
                  <div className="h-4 bg-white/5 w-1/2"></div>
                  <div className="pt-4 border-t border-white/5 flex justify-between">
                    <div className="h-6 bg-white/10 w-1/3"></div>
                    <div className="h-8 bg-white/10 w-28"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUBTLE FALLBACK BANNER IF SUPABASE ERROR */}
        {!loading && error && (
          <div className="mb-6 p-3.5 bg-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-wrap gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Menampilkan inventaris terverifikasi lokal (mode offline).</span>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono uppercase cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Coba Hubungkan Lagi</span>
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredCars.length === 0 && (
          <div className="p-12 border border-white/5 bg-[#141518] text-center my-6 max-w-xl mx-auto space-y-3">
            <CarIcon className="w-10 h-10 text-neutral-500 mx-auto" />
            <h4 className="text-base font-light text-white">Belum Ada Unit Mobil Tersedia</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Saat ini belum ada unit pada kategori &quot;{filter}&quot;.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/6282272777421?text=${encodeURIComponent(
                  "Halo THIRTEEN PROJECT, saya mencari unit mobil bekas tertentu. Bisakah bantu dicarikan?"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors text-xs font-semibold uppercase tracking-wider"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Konsultasi Request Mobil via WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* Grid of Cars */}
        {!loading && filteredCars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {filteredCars.map((car) => {
              const waUrl = generateCarWhatsAppLink(car.name, car.formattedPrice);

              return (
                <div
                  key={car.id}
                  className="group bg-[#17181C] border border-[#23262D] hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
                >
                  {/* Photo Area with Badges */}
                  <div
                    className="relative h-56 sm:h-72 lg:h-80 w-full overflow-hidden bg-black cursor-pointer"
                    onClick={() => onSelectCar(car)}
                  >
                    <img
                      src={car.mainImage || FALLBACK_CAR_IMAGE}
                      alt={car.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== FALLBACK_CAR_IMAGE) {
                          target.src = FALLBACK_CAR_IMAGE;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17181C] via-transparent to-black/30 pointer-events-none"></div>

                    {/* Top Left Badge */}
                    <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10">
                      <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase font-bold text-neutral-200 bg-black/70 backdrop-blur-sm border border-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5">
                        {car.badge}
                      </span>
                    </div>

                    {/* Top Right Diagonal Arrow Badge with 44x44px target */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCar(car);
                      }}
                      title="Lihat Foto & Detail Unit"
                      aria-label={`Lihat detail ${car.name}`}
                      className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#D4AF37] text-black flex items-center justify-center transition-transform group-hover:scale-110 shadow-md cursor-pointer active:scale-95"
                    >
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    {/* Quick Photo Count Badge */}
                    <div className="absolute bottom-3 right-3 sm:right-4 z-10 text-[10px] font-mono text-neutral-400 bg-black/60 px-2.5 py-1 backdrop-blur-sm">
                      {car.gallery.length} FOTO
                    </div>
                  </div>

                  {/* Card Content Information */}
                  <div className="p-5 sm:p-7 space-y-3.5 sm:space-y-4">
                    {/* Car Name */}
                    <div>
                      <h3
                        onClick={() => onSelectCar(car)}
                        className="text-xl sm:text-2xl md:text-3xl font-light text-white group-hover:text-[#D4AF37] transition-colors cursor-pointer tracking-tight"
                      >
                        {car.name}
                      </h3>

                      {/* Metadata line: Year | Transmission | Mileage */}
                      <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase mt-1">
                        {car.year} &nbsp;•&nbsp; {car.transmission.toUpperCase()} &nbsp;•&nbsp; {car.formattedMileage}
                      </p>
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-3.5 sm:pt-4 border-t border-white/10 flex items-center justify-between gap-3 sm:gap-4">
                      <div>
                        <span className="text-[11px] sm:text-xs text-neutral-400 font-mono block">
                          HARGA UNIT
                        </span>
                        <span className="text-lg sm:text-2xl font-medium text-white tracking-tight">
                          {car.formattedPrice}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectCar(car)}
                          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 py-2.5 border border-white/20 hover:border-[#D4AF37] text-neutral-300 hover:text-[#D4AF37] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer active:bg-white/5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">DETAIL UNIT</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 py-2.5 bg-[#1F2127] hover:bg-[#D4AF37] text-neutral-300 hover:text-black text-xs font-semibold uppercase tracking-wider transition-all duration-200 border border-white/10 active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37] group-hover:text-black" />
                          <span>TANYA WA</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Assurance Bar */}
        <div className="mt-10 sm:mt-14 p-4 sm:p-6 bg-[#141518] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2.5 sm:gap-3 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0"></span>
            <span>Semua unit telah lolos inspeksi 150+ titik, bebas banjir &amp; bukan bekas tabrakan.</span>
          </div>
          <a
            href={`https://wa.me/6282272777421?text=${encodeURIComponent(
              "Halo THIRTEEN PROJECT, saya ingin titip jual atau mencari mobil jenis tertentu yang belum ada di katalog."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D4AF37] hover:underline uppercase tracking-wider font-semibold whitespace-nowrap min-h-[40px] flex items-center"
          >
            Mencari Mobil Tertentu? Hubungi Kami ↗
          </a>
        </div>
      </div>
    </section>
  );
}
