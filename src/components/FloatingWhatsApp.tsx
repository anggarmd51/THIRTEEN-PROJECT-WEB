import { useState } from "react";
import { MessageCircle, X, Car, Sparkles } from "lucide-react";
import { WHATSAPP_PHONE, DISPLAY_PHONE } from "../data/carsData";

export default function FloatingWhatsApp() {
  const [showOptions, setShowOptions] = useState(false);

  const defaultWaUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    "Halo THIRTEEN PROJECT, saya ingin konsultasi mengenai layanan detailing / stok mobil bekas."
  )}`;

  const carWaUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    "Halo THIRTEEN PROJECT, saya ingin menanyakan ketersediaan stok mobil bekas pilihan."
  )}`;

  const serviceWaUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    "Halo THIRTEEN PROJECT, saya ingin booking layanan auto detailing / pasang biled / cuci mobil."
  )}`;

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-3 sm:right-6 z-40 flex flex-col items-end">
      {/* Quick Menu Popover */}
      {showOptions && (
        <div className="mb-3 w-72 bg-[#17181C] border border-[#2A2E38] p-4 shadow-2xl space-y-2 text-white animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <span className="text-xs font-semibold tracking-wider text-[#D4AF37] uppercase block">
                THIRTEEN PROJECT
              </span>
              <span className="text-[11px] text-neutral-400">Respon cepat via WhatsApp</span>
            </div>
            <button
              onClick={() => setShowOptions(false)}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <a
            href={carWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowOptions(false)}
            className="flex items-center gap-3 p-2.5 bg-[#1C1E23] hover:bg-[#23262D] border border-white/5 hover:border-[#D4AF37]/50 text-xs transition-colors"
          >
            <Car className="w-4 h-4 text-[#D4AF37]" />
            <div className="text-left">
              <span className="font-semibold block text-white">Tanya Stok Mobil</span>
              <span className="text-[10px] text-neutral-400">Cek unit ready &amp; simulasi kredit</span>
            </div>
          </a>

          <a
            href={serviceWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowOptions(false)}
            className="flex items-center gap-3 p-2.5 bg-[#1C1E23] hover:bg-[#23262D] border border-white/5 hover:border-[#D4AF37]/50 text-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <div className="text-left">
              <span className="font-semibold block text-white">Booking Detailing / Biled</span>
              <span className="text-[10px] text-neutral-400">Jadwalkan pengerjaan mobil Anda</span>
            </div>
          </a>

          <div className="pt-2 text-center text-[10px] text-neutral-400 font-mono">
            WhatsApp Hotline: {DISPLAY_PHONE}
          </div>
        </div>
      )}

      {/* Floating Gold Pill Button - Exactly matching Screenshot 1 & 2 */}
      <div className="flex items-center gap-2">
        <a
          href={defaultWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="btn-floating-whatsapp"
          className="flex items-center gap-2 min-h-[44px] px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#E5C05B] hover:bg-[#D4AF37] text-black font-semibold text-[11px] sm:text-xs tracking-wider uppercase shadow-[0_8px_25px_rgba(212,175,55,0.35)] transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 fill-black text-black shrink-0" />
          <span className="font-bold tracking-wider">BOOKING VIA WHATSAPP</span>
        </a>

        {/* Quick Menu Toggle */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          title="Opsi Kontak WhatsApp"
          className="hidden sm:flex w-10 h-10 rounded-full bg-[#18191E] hover:bg-[#23262D] border border-[#D4AF37]/40 text-[#D4AF37] items-center justify-center transition-colors shadow-lg cursor-pointer"
        >
          {showOptions ? <X className="w-4 h-4" /> : <span className="text-xs font-bold">⋮</span>}
        </button>
      </div>
    </div>
  );
}
