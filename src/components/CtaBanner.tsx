import { ArrowUpRight, MessageCircle } from "lucide-react";
import { WHATSAPP_PHONE } from "../data/carsData";

export default function CtaBanner() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    "Halo THIRTEEN PROJECT, saya ingin konsultasi mengenai layanan perawatan mobil dan stok unit pilihan."
  )}`;

  return (
    <section className="relative overflow-hidden bg-[#D4AF37] text-black py-20 sm:py-28">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sub-tag Marker */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono tracking-widest text-black/80 font-bold">05</span>
          <span className="w-8 h-[1px] bg-black/40"></span>
          <span className="text-xs font-bold tracking-[0.25em] text-black/80 uppercase">
            START A CONVERSATION
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-light text-black tracking-tight leading-[1.08]">
              Siap Mewujudkan{" "}
              <span className="font-serif-accent italic font-normal block sm:inline">
                Mobil Impian Anda?
              </span>
            </h2>

            <p className="max-w-xl text-black/80 text-base sm:text-lg font-normal leading-relaxed">
              Diskusikan kebutuhan auto detailing, upgrade pencahayaan Biled, atau dapatkan unit mobil berkualitas impian Anda dengan layanan berstandar tinggi.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-banner-btn-wa"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-black hover:bg-neutral-900 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-2xl hover:scale-[1.02]"
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
