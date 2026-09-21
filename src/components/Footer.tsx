import { MapPin, Clock, MessageCircle, Instagram, ArrowUpRight } from "lucide-react";
import { STORE_ADDRESS, OPERATING_HOURS, DISPLAY_PHONE, WHATSAPP_PHONE } from "../data/carsData";
import Logo from "./Logo";

export default function Footer() {
  const googleMapsUrl = "https://maps.app.goo.gl/FiNCUMjYxHHfMWK78";

  return (
    <footer id="kontak" className="bg-[#0A0A0C] text-neutral-400 border-t border-[#1C1E23] pt-12 sm:pt-16 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 sm:pb-10 border-b border-white/10">
          {/* Logo */}
          <a href="#" className="flex items-center shrink-0 transition-opacity hover:opacity-90">
            <Logo className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto max-w-[340px] sm:max-w-[380px] md:max-w-[420px]" />
          </a>

          {/* Social Links */}
          <div className="flex items-center gap-6 text-xs uppercase tracking-wider">
            <a
              href="https://www.instagram.com/rinaldiagustiraaa_?stkn=YnVvcmRsOHFzazJ4"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-2 hover:text-[#D4AF37] transition-colors py-2"
            >
              <Instagram className="w-4 h-4 text-[#D4AF37]" />
              <span>Instagram</span>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-2 hover:text-[#D4AF37] transition-colors py-2"
            >
              <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 3 Detail Columns (matching Screenshot 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pt-2">
          {/* Column 1: VISIT US */}
          <div className="space-y-3">
            <span className="text-xs tracking-[0.2em] uppercase font-semibold text-white block">
              VISIT US / LOKASI KAMI
            </span>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {STORE_ADDRESS}
              </p>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-[11px] text-[#D4AF37] hover:underline uppercase tracking-wider font-medium pt-1"
            >
              <span>Buka Petunjuk Arah Google Maps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Column 2: OPENING HOURS */}
          <div className="space-y-3">
            <span className="text-xs tracking-[0.2em] uppercase font-semibold text-white block">
              OPENING HOURS / JAM OPERASIONAL
            </span>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-neutral-400 font-light">
                <p>
                  <strong className="text-white font-medium">{OPERATING_HOURS}</strong>
                </p>
                <p className="text-neutral-500">
                  <strong className="text-neutral-400">Minggu:</strong> Khusus Reservasi &amp; Janji Temu
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: GET IN TOUCH */}
          <div className="space-y-3">
            <span className="text-xs tracking-[0.2em] uppercase font-semibold text-white block">
              GET IN TOUCH / HUBUNGI KAMI
            </span>
            <div className="space-y-1">
              <a
                href={`tel:${WHATSAPP_PHONE}`}
                className="text-base sm:text-lg font-mono font-medium text-white hover:text-[#D4AF37] transition-colors block"
              >
                {DISPLAY_PHONE}
              </a>
              <span className="text-xs text-neutral-400 block font-light">
                Available via WhatsApp &amp; Direct Call
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <span>© 2024 THIRTEEN PROJECT. Hak Cipta Dilindungi.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Langkat, Sumatera Utara</span>
            <span>•</span>
            <span className="text-[#D4AF37]">Stealth Luxury Automotive</span>
            <span>•</span>
            <a href="/admin" className="hover:text-[#D4AF37] transition-colors underline-offset-4 hover:underline">
              Portal Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
