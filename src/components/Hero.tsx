import { ArrowUpRight, MessageSquare, ChevronDown, Calendar } from "lucide-react";
import { generateServiceWhatsAppLink } from "../data/carsData";

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const serviceWhatsAppUrl = generateServiceWhatsAppLink("Perawatan Otomotif & Detailing");

  return (
    <section
      id="beranda"
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:pt-28 md:pt-32 pb-8 sm:pb-12 overflow-hidden bg-[#0F0F11]"
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center my-auto py-6 sm:py-10">
        <div className="max-w-4xl space-y-4 sm:space-y-6">
          {/* Small Tagline */}
          <div className="inline-flex items-center gap-2.5 sm:gap-3">
            <span className="w-6 sm:w-8 h-[1px] bg-[#D4AF37]"></span>
            <span className="text-[11px] sm:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-[#D4AF37] uppercase">
              EST. 2024 • LANGKAT, SUMATERA UTARA
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-light text-white tracking-tight leading-[1.12]">
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
          <p className="max-w-2xl text-sm sm:text-base lg:text-lg text-neutral-400 font-light leading-relaxed">
            Layanan profesional auto detailing, upgrade lampu Biled, cuci mobil premium, dan jual-beli mobil pilihan terverifikasi.
          </p>

          {/* CTA Buttons - Full-width stacked on mobile for comfortable tap targets */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Primary Solid Gold Button */}
            <a
              href="#katalog-mobil"
              id="hero-btn-stok-mobil"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 bg-[#D4AF37] hover:bg-[#E5C05B] active:bg-[#C9A430] text-black font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-lg shadow-[#D4AF37]/10"
            >
              <span>LIHAT STOK MOBIL</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            {/* Direct Booking Modal Button */}
            <button
              type="button"
              onClick={onOpenBooking}
              id="hero-btn-booking-modal"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 border border-[#D4AF37]/70 hover:border-[#D4AF37] active:bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>RESERVASI ONLINE</span>
            </button>

            {/* Secondary Outline WhatsApp Button */}
            <a
              href={serviceWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-btn-booking-wa"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 border border-white/20 hover:border-[#D4AF37] active:bg-white/10 text-white hover:text-[#D4AF37] bg-white/[0.02] hover:bg-white/[0.05] font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
              <span>WHATSAPP</span>
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
