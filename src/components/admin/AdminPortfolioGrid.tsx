import { Edit3, Trash2, Layers } from "lucide-react";

interface AdminPortfolioGridProps {
  portfolios: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string, title: string) => void;
}

export default function AdminPortfolioGrid({
  portfolios,
  onEdit,
  onDelete,
}: AdminPortfolioGridProps) {
  return (
    <div className="bg-[#121316] border border-[#22242B] overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-wider uppercase text-white">
            Galeri Hasil Pengerjaan (Portofolio)
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Portofolio aktif yang tersimpan akan ditampilkan pada carousel slider beranda.
          </p>
        </div>
        <span className="text-xs font-mono text-[#D4AF37]">
          Total: {portfolios.length} Item
        </span>
      </div>

      {portfolios.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-neutral-600 mx-auto" />
          <h4 className="text-sm font-light text-white">Database Portofolio Masih Kosong</h4>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Belum ada dokumentasi pengerjaan di database. Klik tombol &quot;+ TAMBAH PORTOFOLIO&quot; untuk menambahkan hasil pengerjaan baru.
          </p>
        </div>
      ) : (
        /* Grid of Portfolios */
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((item) => {
            const img = item.image_url || item.imageUrl;
            return (
              <div
                key={item.id}
                className="bg-[#17181C] border border-[#23262D] overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-48 bg-black overflow-hidden">
                  <img
                    src={img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 px-2 py-1 text-[10px] font-mono tracking-wider text-[#D4AF37] border border-[#D4AF37]/30 uppercase">
                    {item.category}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-medium text-white text-sm mb-1 leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-xs text-neutral-400 font-mono block mb-2">
                      {item.car_model || item.carModel || "Semua Tipe Mobil"}
                    </span>
                    <p className="text-xs text-neutral-500 font-light line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                    <span className="text-[11px] font-mono text-neutral-500">
                      {item.badge}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 border border-white/10 hover:border-[#D4AF37] text-neutral-400 hover:text-[#D4AF37] cursor-pointer"
                        title="Edit Portofolio"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id, item.title)}
                        className="p-1 border border-white/10 hover:border-red-500 text-neutral-400 hover:text-red-400 cursor-pointer"
                        title="Hapus Portofolio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
