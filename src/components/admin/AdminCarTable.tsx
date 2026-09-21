import { Edit3, Trash2, Car } from "lucide-react";

interface AdminCarTableProps {
  cars: any[];
  onEdit: (car: any) => void;
  onDelete: (id: string, name: string) => void;
}

export default function AdminCarTable({ cars, onEdit, onDelete }: AdminCarTableProps) {
  return (
    <div className="bg-[#121316] border border-[#22242B] overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-wider uppercase text-white">
            Daftar Stok Unit Mobil
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Unit aktif yang tersimpan di Supabase dan tampil pada halaman katalog.
          </p>
        </div>
        <span className="text-xs font-mono text-[#D4AF37]">
          Total: {cars.length} Unit
        </span>
      </div>

      {cars.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <Car className="w-10 h-10 text-neutral-600 mx-auto" />
          <h4 className="text-sm font-light text-white">Database Mobil Masih Kosong</h4>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Belum ada unit mobil tersimpan di tabel &quot;cars&quot; Supabase. Klik tombol &quot;+ TAMBAH UNIT MOBIL&quot; di atas untuk memasukkan stok mobil pertama Anda.
          </p>
        </div>
      ) : (
        /* Table of Cars */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#16171B] border-b border-white/5 text-neutral-400 font-mono tracking-wider uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Foto &amp; Unit</th>
                <th className="py-3 px-4">Tahun / Transmisi</th>
                <th className="py-3 px-4">Harga Jual</th>
                <th className="py-3 px-4">Kilometer</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cars.map((car) => {
                const img = car.main_image || car.mainImage;
                const formattedPrice =
                  typeof car.price === "number"
                    ? new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(car.price)
                    : car.formattedPrice || String(car.price);

                return (
                  <tr key={car.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={img}
                          alt={car.name}
                          className="w-14 h-10 object-cover border border-white/10 bg-black shrink-0"
                        />
                        <div>
                          <span className="font-medium text-white block text-sm">
                            {car.name}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono block">
                            {car.model || car.brand} • {car.plate || "BK"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-300 font-mono">
                      {car.year} • {car.transmission}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-[#D4AF37]">
                      {formattedPrice}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-400">
                      {typeof car.mileage === "number"
                        ? `${new Intl.NumberFormat("id-ID").format(car.mileage)} KM`
                        : car.mileage}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase border border-white/10 bg-white/5 text-neutral-300">
                        {car.badge || "AVAILABLE"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onEdit(car)}
                          className="p-1.5 border border-white/10 hover:border-[#D4AF37] text-neutral-300 hover:text-[#D4AF37] transition-colors cursor-pointer"
                          title="Edit Unit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(car.id, car.name)}
                          className="p-1.5 border border-white/10 hover:border-red-500 text-neutral-300 hover:text-red-400 transition-colors cursor-pointer"
                          title="Hapus Unit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
