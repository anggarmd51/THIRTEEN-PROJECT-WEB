export interface ServiceItem {
  number: string;
  tag: string;
  title: string;
  description: string;
  iconType: "sparkle" | "lightning" | "carwash" | "shield";
  features: string[];
  duration: string;
  popularFor: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    number: "01",
    tag: "NANO CERAMIC COATING",
    title: "Auto Detailing & Nano Ceramic Coating",
    description: "Restorasi kilau dan perlindungan paintwork berlapis untuk hasil mirror finish yang memukau dan tahan cuaca ekstrem.",
    iconType: "sparkle",
    features: [
      "Multi-stage machine paint correction",
      "Hilangkan swirl marks, baret halus & oksidasi cat",
      "Lapisan 9H Nano Ceramic Coating 3-layer bergaransi",
      "Efek hidrofobik daun talas & proteksi sinar UV matahari"
    ],
    duration: "1 - 3 Hari Pengerjaan",
    popularFor: "Mobil Baru & Restorasi Mobil Kesayangan"
  },
  {
    number: "02",
    tag: "CUSTOM LIGHTING",
    title: "Upgrade Lampu Biled Projector",
    description: "Beam pattern presisi, cut-off line tajam, dan projector setup yang aman di jalan tanpa menyilaukan kendaraan lain.",
    iconType: "lightning",
    features: [
      "Projector Biled Laser 3.0 Inch kualitas premium",
      "Cahaya super terang & fokus menembus hujan/kabut lebat",
      "Cut-off horizontal RHD presisi standar keselamatan",
      "Garansi pengerjaan anti-embun & kebocoran 1 tahun"
    ],
    duration: "3 - 6 Jam Pengerjaan",
    popularFor: "Semua Mobil untuk Keamanan Berkendara Malam"
  },
  {
    number: "03",
    tag: "DEEP CLEAN",
    title: "Cuci Mobil Busa Salju Premium",
    description: "Perawatan eksterior menyeluruh dengan snow foam pH-balanced dan teknik two-bucket hand wash premium bebas goresan.",
    iconType: "carwash",
    features: [
      "Snow foam shampoo pH netral impor aman untuk coating",
      "Teknik 2-bucket wash dengan microfiber plush 800 GSM",
      "Detailing celah emblem, velg, ban, dan kolong fender",
      "Pengeringan warm air blower non-contact anti baret halus"
    ],
    duration: "45 - 60 Menit",
    popularFor: "Perawatan Rutin Mingguan & Bulanan"
  },
  {
    number: "04",
    tag: "TRADE-IN WELCOME",
    title: "Jual Beli & Tukar Tambah Mobil Bekas",
    description: "Temukan unit mobil pilihan yang sudah melalui inspeksi ketat 150+ titik, atau tukar tambah kendaraan Anda dengan taksiran harga terbaik.",
    iconType: "shield",
    features: [
      "Jaminan 100% bebas banjir dan bukan bekas tabrakan fatal",
      "Dokumen legalitas BPKB & STNK dijamin keasliannya",
      "Kondisi mesin, transmisi, dan kaki-kaki prima siap pakai",
      "Proses cepat, transparan, dan dibantu pengurusan balik nama"
    ],
    duration: "Inspeksi & Transaksi Cepat 1 Hari",
    popularFor: "Pembelian Unit Terpercaya & Tukar Tambah"
  }
];
