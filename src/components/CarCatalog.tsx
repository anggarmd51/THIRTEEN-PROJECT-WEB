import { useState } from "react";
import { ArrowUpRight, MessageCircle, Eye, Database } from "lucide-react";
import { CarUnit, generateCarWhatsAppLink } from "../data/carsData";
import { useSupabaseCars } from "../lib/useSupabaseData";

interface CarCatalogProps {
  onSelectCar: (car: CarUnit) => void;
}

export default function CarCatalog({ onSelectCar }: CarCatalogProps) {
  const [filter, setFilter] = useState<string>("Semua");
  const { cars, loading, isUsingSupabase } = useSupabaseCars();

  const filterOptions = ["Semua", "Sedan", "SUV", "Low KM", "Executive"];

  const filteredCars = cars.filter((car) => {
    if (filter === "Semua") return true;
    if (filter === "Sedan") return car.model.toLowerCase().includes("sedan") || car.name.toLowerCase().includes("civic") || car.name.toLowerCase().includes("bmw") || car.name.toLowerCase().includes("mercedes");
    if (filter === "SUV") return car.name.toLowerCase().includes("fortuner") || car.name.toLowerCase().includes("pajero") || car.name.toLowerCase().includes("hr-v");
    if (filter === "Low KM") return car.mileage < 30000;
    if (filter === "Executive") return car.badge === "EXECUTIVE" || car.badge === "LUXURY SEDAN";
    return true;
  });

  return (
    <section
      id="katalog-mobil"
      className="py-24 sm:py-32 bg-[#0F0F11] border-t border-[#1F1F23] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Tag */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono tracking-widest text-[#D4AF37]">04</span>
          <span className="w-8 h-[1px] bg-[#D4AF37]"></span>
          <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
            SELECTED INVENTORY
          </span>
        </div>

        {/* Section Title & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-12">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.15]">
              Temukan{" "}
              <span className="font-serif-accent text-[#D4AF37] italic font-normal">
                Mobil Pilihan Anda.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5 text-neutral-400 font-light text-sm sm:text-base leading-relaxed">
            <p>
              Unit pilihan, kondisi terverifikasi, inspeksi 150+ titik, dan siap menemani perjalanan berikutnya dengan rasa aman tanpa kompromi.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-white/5 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`text-xs px-4 py-2 uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  filter === opt
                    ? "bg-[#D4AF37] text-black font-semibold"
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
            <span>MENAMPILKAN {filteredCars.length} UNIT TERSEDIA</span>
          </div>
        </div>

        {/* Grid of Cars - Exactly matching Screenshot 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredCars.map((car) => {
            const waUrl = generateCarWhatsAppLink(car.name, car.formattedPrice);

            return (
              <div
                key={car.id}
                className="group bg-[#17181C] border border-[#23262D] hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Photo Area with Badges */}
                <div
                  className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden bg-black cursor-pointer"
                  onClick={() => onSelectCar(car)}
                >
                  <img
                    src={car.mainImage}
                    alt={car.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17181C] via-transparent to-black/30 pointer-events-none"></div>

                  {/* Top Left Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase font-bold text-neutral-200 bg-black/70 backdrop-blur-sm border border-white/10 px-3 py-1.5">
                      {car.badge}
                    </span>
                  </div>

                  {/* Top Right Diagonal Arrow Badge (matching Screenshot 2) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCar(car);
                    }}
                    title="Lihat Foto & Detail Unit"
                    aria-label={`Lihat detail ${car.name}`}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#D4AF37] text-black flex items-center justify-center transition-transform group-hover:scale-110 shadow-md cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {/* Quick Photo Count Badge */}
                  <div className="absolute bottom-3 right-4 z-10 text-[10px] font-mono text-neutral-400 bg-black/60 px-2.5 py-1 backdrop-blur-sm">
                    {car.gallery.length} FOTO
                  </div>
                </div>

                {/* Card Content Information */}
                <div className="p-6 sm:p-7 space-y-4">
                  {/* Car Name */}
                  <div>
                    <h3
                      onClick={() => onSelectCar(car)}
                      className="text-2xl sm:text-3xl font-light text-white group-hover:text-[#D4AF37] transition-colors cursor-pointer tracking-tight"
                    >
                      {car.name}
                    </h3>

                    {/* Metadata line: Year | Transmission | Mileage (matching Screenshot 2) */}
                    <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase mt-1">
                      {car.year} &nbsp;•&nbsp; {car.transmission.toUpperCase()} &nbsp;•&nbsp; {car.formattedMileage}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-neutral-400 font-mono block">
                        HARGA UNIT
                      </span>
                      <span className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                        {car.formattedPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectCar(car)}
                        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-white/20 hover:border-[#D4AF37] text-neutral-300 hover:text-[#D4AF37] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">DETAIL UNIT</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#1F2127] hover:bg-[#D4AF37] text-neutral-300 hover:text-black text-xs font-semibold uppercase tracking-wider transition-all duration-200 border border-white/10"
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

        {/* Bottom Assurance Bar */}
        <div className="mt-14 p-6 bg-[#141518] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
            <span>Semua unit telah lolos inspeksi 150+ titik, bebas banjir &amp; bukan bekas tabrakan.</span>
          </div>
          <a
            href={`https://wa.me/6282272777421?text=${encodeURIComponent(
              "Halo THIRTEEN PROJECT, saya ingin titip jual atau mencari mobil jenis tertentu yang belum ada di katalog."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D4AF37] hover:underline uppercase tracking-wider font-semibold"
          >
            Mencari Mobil Tertentu? Hubungi Kami ↗
          </a>
        </div>
      </div>
    </section>
  );
}
