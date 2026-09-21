import { Sparkles, Zap, Car, ShieldCheck, ArrowUpRight } from "lucide-react";
import { SERVICES_DATA, ServiceItem } from "../data/servicesData";

interface ServicesSectionProps {
  onSelectServiceForBooking?: (serviceName: string) => void;
}

export default function ServicesSection({ onSelectServiceForBooking }: ServicesSectionProps) {
  const getIcon = (type: ServiceItem["iconType"]) => {
    switch (type) {
      case "sparkle":
        return <Sparkles className="w-5 h-5 text-[#D4AF37]" />;
      case "lightning":
        return <Zap className="w-5 h-5 text-[#D4AF37]" />;
      case "carwash":
        return <Car className="w-5 h-5 text-[#D4AF37]" />;
      case "shield":
        return <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  return (
    <section
      id="layanan"
      className="py-12 sm:py-16 md:py-24 lg:py-32 bg-[#0F0F11] border-t border-[#1F1F23] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Tag */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          <span className="text-xs font-mono tracking-widest text-[#D4AF37]">02</span>
          <span className="w-6 sm:w-8 h-[1px] bg-[#D4AF37]"></span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-[#D4AF37] uppercase">
            WHAT WE DO
          </span>
        </div>

        {/* Section Title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-end mb-10 sm:mb-16">
          <div className="lg:col-span-7">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-[1.2]">
              Keahlian untuk{" "}
              <span className="font-serif-accent text-[#D4AF37] italic font-normal">
                Karakter Berkendara.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5 text-neutral-400 font-light text-xs sm:text-sm md:text-base leading-relaxed">
            <p>
              Solusi otomotif dengan sentuhan premium, dikerjakan oleh teknisi berpengalaman yang memahami setiap karakter kendaraan Anda.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {SERVICES_DATA.map((service) => {
            return (
              <div
                key={service.number}
                className="group relative bg-[#17181C] hover:bg-[#1C1E23] border border-[#23262D] hover:border-[#D4AF37]/50 p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-lg hover:-translate-y-1"
              >
                {/* Top Row: Number & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <span className="text-xs font-mono text-neutral-400 group-hover:text-[#D4AF37] transition-colors">
                      {service.number}
                    </span>
                    <div className="p-2 rounded-none bg-white/[0.03] group-hover:bg-[#D4AF37]/10 transition-colors">
                      {getIcon(service.iconType)}
                    </div>
                  </div>

                  {/* Tag */}
                  <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#D4AF37] block mb-2">
                    {service.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-base sm:text-xl font-medium text-white group-hover:text-white mb-2 sm:mb-3">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed mb-5 sm:mb-6">
                    {service.description}
                  </p>

                  {/* Key Features List */}
                  <ul className="space-y-1.5 sm:space-y-2 pt-4 border-t border-white/5">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2 font-light">
                        <span className="text-[#D4AF37] mt-0.5">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {onSelectServiceForBooking && (
                  <button
                    type="button"
                    onClick={() => onSelectServiceForBooking(service.title)}
                    className="mt-6 pt-3 min-h-[44px] border-t border-white/10 flex items-center justify-between text-xs text-[#D4AF37] hover:text-white uppercase tracking-wider font-semibold cursor-pointer transition-colors w-full text-left active:opacity-80"
                  >
                    <span>Booking Layanan Ini</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
