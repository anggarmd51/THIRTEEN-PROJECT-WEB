import { ArrowUpRight, MessageSquare, ChevronDown } from "lucide-react";
import { generateServiceWhatsAppLink } from "../data/carsData";

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const serviceWhatsAppUrl = generateServiceWhatsAppLink("Perawatan Otomotif & Detailing");

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-[#0F0F11]"
    >
      {/* Background Car Imagery with Dark Dramatic Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2000&auto=format&fit=crop"
          alt="THIRTEEN PROJECT Luxury Automotive Care"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transform duration-1000 ease-out"
        />
        {/* Layered Gradient Overlays for Stealth Luxury Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-[#0F0F11]/80 to-[#0F0F11]/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0F0F11]/60 to-[#0F0F11]"></div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center my-auto">
        <div className="max-w-4xl space-y-6">
          {/* Small Tagline */}
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#D4AF37]"></span>
            <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              EST. 2024 • LANGKAT, SUMATERA UTARA
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.08]">
            Perawatan Otomotif{" "}
            <span className="font-serif-accent text-[#D4AF37] font-normal italic inline-block">
              Terbaik
            </span>
            <br />
            <span className="font-medium text-white/95">
              &amp; Mobil Bekas Berkualitas.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-neutral-400 font-light leading-relaxed">
            Layanan profesional auto detailing, upgrade lampu Biled, cuci mobil premium, dan jual-beli mobil pilihan terverifikasi.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-5">
            {/* Primary Solid Gold Button */}
            <a
              href="#katalog-mobil"
              id="hero-btn-stok-mobil"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-lg shadow-[#D4AF37]/10"
            >
              <span>LIHAT STOK MOBIL</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            {/* Secondary Outline WhatsApp Button */}
            <a
              href={serviceWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-btn-booking-wa"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] bg-white/[0.02] hover:bg-white/[0.05] font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
              <span>BOOKING SERVIS (WA)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Exploration Status Line */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8">
        <div className="flex items-center justify-between text-xs tracking-[0.25em] text-neutral-500 uppercase border-t border-white/10 pt-4">
          <a
            href="#standar"
            className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors"
          >
            <span>SCROLL TO EXPLORE</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#D4AF37]" />
          </a>
          <div className="hidden sm:flex items-center gap-4 flex-1 max-w-xs mx-8">
            <div className="h-[1px] w-full bg-neutral-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/5 bg-[#D4AF37]"></div>
            </div>
          </div>
          <span className="font-mono text-neutral-400">01 / 05</span>
        </div>
      </div>
    </section>
  );
}
