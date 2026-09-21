import { useState, useEffect } from "react";
import { X, MessageCircle, ArrowUpRight } from "lucide-react";
import { WHATSAPP_PHONE } from "../data/carsData";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export default function BookingModal({ isOpen, onClose, initialService }: BookingModalProps) {
  const [selectedService, setSelectedService] = useState<string>("Auto Detailing & Nano Ceramic Coating");
  const [vehicleModel, setVehicleModel] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

  if (!isOpen) return null;

  const serviceOptions = [
    "Auto Detailing & Nano Ceramic Coating",
    "Upgrade Lampu Biled Projector",
    "Cuci Mobil Busa Salju Premium",
    "Jual Beli & Tukar Tambah Mobil Bekas",
    "Poles Kaca & Glass Coating",
    "Konsultasi Umum / Custom Request"
  ];

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    let text = `Halo THIRTEEN PROJECT, saya ingin konsultasi / reservasi layanan:\n\n`;
    text += `• Layanan: ${selectedService}\n`;
    if (customerName) text += `• Nama: ${customerName}\n`;
    if (vehicleModel) text += `• Kendaraan: ${vehicleModel}\n`;
    if (preferredDate) text += `• Rencana Tanggal: ${preferredDate}\n`;
    if (notes) text += `• Catatan: ${notes}\n`;
    text += `\nMohon informasi ketersediaan jadwal & estimasi biayanya. Terima kasih.`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div
      id="booking-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#15161A] border border-[#2B2E37] max-w-lg w-full max-h-[90dvh] sm:max-h-[85vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative text-white rounded-t-2xl sm:rounded-none animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 duration-300"
      >
        {/* Mobile Pull Bar Indicator */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          aria-label="Tutup form booking"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5 sm:mb-6">
          <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase block mb-1">
            THIRTEEN PROJECT RESERVATION
          </span>
          <h3 className="text-xl sm:text-2xl font-light text-white">
            Konsultasi &amp; <span className="font-serif-accent text-[#D4AF37] italic">Booking Servis</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Isi formulir singkat di bawah ini dan kami akan segera mengonfirmasi jadwal pengerjaan melalui WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSendWhatsApp} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
              Pilihan Layanan
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-[#1A1C22] border border-white/10 px-3.5 py-3 text-base sm:text-xs text-white focus:border-[#D4AF37] focus:outline-none rounded-none"
            >
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-[#15161A] text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
              Nama Anda (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Pak Budi"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-[#1A1C22] border border-white/10 px-3.5 py-3 text-base sm:text-xs text-white focus:border-[#D4AF37] focus:outline-none placeholder:text-neutral-600 rounded-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                Tipe / Merek Mobil
              </label>
              <input
                type="text"
                placeholder="Contoh: Civic Turbo / Fortuner"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="w-full bg-[#1A1C22] border border-white/10 px-3.5 py-3 text-base sm:text-xs text-white focus:border-[#D4AF37] focus:outline-none placeholder:text-neutral-600 rounded-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                Rencana Tanggal
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-[#1A1C22] border border-white/10 px-3.5 py-3 text-base sm:text-xs text-white focus:border-[#D4AF37] focus:outline-none rounded-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
              Kebutuhan Khusus / Pertanyaan
            </label>
            <textarea
              rows={2}
              placeholder="Jelaskan kondisi cat mobil, keluhan lampu redup, atau tipe mobil yang ingin dicari..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#1A1C22] border border-white/10 px-3.5 py-3 text-base sm:text-xs text-white focus:border-[#D4AF37] focus:outline-none placeholder:text-neutral-600 rounded-none"
            ></textarea>
          </div>

          <div className="pt-2 pb-2 sm:pb-0">
            <button
              type="submit"
              className="w-full min-h-[48px] py-3.5 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-[#D4AF37]/15"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>LANJUTKAN VIA WHATSAPP</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
