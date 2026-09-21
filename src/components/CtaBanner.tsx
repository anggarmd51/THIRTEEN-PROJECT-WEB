import { ArrowUpRight } from "lucide-react";
import { WHATSAPP_PHONE } from "../data/carsData";

export default function CtaBanner() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    "Halo THIRTEEN PROJECT, saya ingin konsultasi mengenai layanan perawatan mobil dan stok unit pilihan."
  )}`;

  return (
    <section className="relative overflow-hidden bg-[#D4AF37] text-black py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sub-tag Marker */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4">
          <span className="text-xs font-mono tracking-widest text-black/80 font-bold">05</span>
          <span className="w-6 sm:w-8 h-[1px] bg-black/40"></span>
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] text-black/80 uppercase">
            START A CONVERSATION
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-light text-black tracking-tight leading-[1.12]">
              Siap Mewujudkan{" "}
              <span className="font-serif-accent italic font-normal block sm:inline">
                Mobil Impian Anda?
              </span>
            </h2>

            <p className="max-w-xl text-black/80 text-sm sm:text-base lg:text-lg font-normal leading-relaxed">
              Diskusikan kebutuhan auto detailing, upgrade pencahayaan Biled, atau dapatkan unit mobil berkualitas impian Anda dengan layanan berstandar tinggi.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end w-full">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-banner-btn-wa"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 bg-black hover:bg-neutral-900 active:bg-neutral-800 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-2xl hover:scale-[1.02]"
            >
              <span>HUBUNGI KAMI VIA WHATSAPP</span>
              <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
