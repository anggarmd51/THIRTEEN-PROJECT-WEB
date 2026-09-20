import { ShieldCheck, Award, Clock } from "lucide-react";

export default function AboutStandard() {
  return (
    <section
      id="standar"
      className="py-24 sm:py-32 bg-[#0F0F11] border-t border-[#1F1F23] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Index Marker */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono tracking-widest text-[#D4AF37]">01</span>
          <span className="w-8 h-[1px] bg-[#D4AF37]"></span>
          <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
            THE THIRTEEN STANDARD
          </span>
        </div>

        {/* Headline and Narrative Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.15]">
              Lebih dari Sekadar Servis.{" "}
              <span className="font-serif-accent text-[#D4AF37] italic font-normal block sm:inline">
                Sebuah Standar Kualitas.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 text-neutral-400 font-light text-base sm:text-lg leading-relaxed pt-2">
            <p>
              Di <strong className="text-white font-medium">THIRTEEN PROJECT</strong>, setiap kendaraan diperlakukan dengan presisi tinggi. Dari detail mikroskopis pada paintwork hingga seleksi unit mobil bekas pilihan, semuanya wajib melewati standar ketat kami — bukan sekadar standar pasar biasa.
            </p>
          </div>
        </div>

        {/* 3 Metric Stats */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          {/* Stat 1 */}
          <div className="space-y-2 group">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight group-hover:text-[#D4AF37] transition-colors">
                13
              </span>
              <span className="text-2xl sm:text-3xl font-light text-[#D4AF37]">+</span>
            </div>
            <p className="text-xs tracking-[0.2em] uppercase font-semibold text-neutral-400">
              Layanan &amp; Paket Pengerjaan
            </p>
            <p className="text-xs text-neutral-500 font-light">
              Protokol detailing, nano coating, lighting biled, dan uji kelayakan menyeluruh.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="space-y-2 group">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight group-hover:text-[#D4AF37] transition-colors">
                100
              </span>
              <span className="text-2xl sm:text-3xl font-light text-[#D4AF37]">%</span>
            </div>
            <p className="text-xs tracking-[0.2em] uppercase font-semibold text-neutral-400">
              Ketelitian &amp; Presisi
            </p>
            <p className="text-xs text-neutral-500 font-light">
              Pemeriksaan ketebalan cat, cut-off cahaya lux meter, dan 150+ titik inspeksi fisik.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="space-y-2 group">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight group-hover:text-[#D4AF37] transition-colors">
                24
              </span>
              <span className="text-2xl sm:text-3xl font-light text-[#D4AF37]">/7</span>
            </div>
            <p className="text-xs tracking-[0.2em] uppercase font-semibold text-neutral-400">
              Konsultasi via WhatsApp
            </p>
            <p className="text-xs text-neutral-500 font-light">
              Dukungan responsif untuk pertanyaan teknis, konsultasi perawatan, &amp; stok unit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
