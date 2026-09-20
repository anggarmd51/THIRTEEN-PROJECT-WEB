export interface PortfolioItem {
  id: string;
  category: "Semua" | "Detailing" | "Pemasangan Biled" | "Cuci Mobil Premium" | "Interior & Mesin";
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  carModel: string;
  treatmentList: string[];
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "portfolio-1",
    category: "Detailing",
    badge: "DETAILING / 01",
    title: "Kilap Sempurna Coating Ceramic",
    subtitle: "Paintwork, perfected.",
    imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
    description: "Koreksi cat 3-stage (compounding, polishing, ultra-finish) untuk menghilangkan swirl mark dan goresan mikro, disempurnakan dengan lapisan 9H Nano Ceramic Coating 3 lapis untuk efek daun talas (hydrophobic) dan kilau basah (deep wet look) tahan lama.",
    carModel: "Mercedes-AMG GT Coupe",
    treatmentList: [
      "Multi-Stage Paint Correction (Hilangkan 95% Swirl Mark)",
      "Lapisan 9H Nano Ceramic Coating 3-Layer",
      "Perlindungan UV & Ketahanan Goresan Ringan",
      "Efek Hidrofobik Ekstrem (Self-Cleaning Property)"
    ]
  },
  {
    id: "portfolio-2",
    category: "Pemasangan Biled",
    badge: "BILED / 02",
    title: "Hasil Cut-Off Cahaya Biled Malam Hari",
    subtitle: "See the difference at night.",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    description: "Instalasi lampu projector Biled 3-inch Turbo Matrix dengan garis potong (cut-off line) horizontal super tajam dan fokus. Output cahaya 5500K putih bersih natural menembus hujan lebat dan kabut tanpa menyilaukan pandangan pengemudi dari lawan arah.",
    carModel: "Porsche 911 Carrera S",
    treatmentList: [
      "Biled Projector Matrix Dual Core 3.0 Inch",
      "Laser High Beam Penetrasi Kabut & Hujan",
      "Presisi Cut-Off Flat RHD (Right-Hand Drive)",
      "Kabel Relay Set Tebal & Modul Canbus Error-Free"
    ]
  },
  {
    id: "portfolio-3",
    category: "Cuci Mobil Premium",
    badge: "CARWASH / 03",
    title: "Cuci Busa Salju Mendalam",
    subtitle: "The ritual of clean.",
    imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=1200&auto=format&fit=crop",
    description: "Perawatan pencucian komprehensif menggunakan shampoo snow foam berformula pH-netral impor, metode Two-Bucket Wash dengan microfiber plush lembut, kuas detailer bulu kuda liar untuk celah emblem, serta pengeringan aman menggunakan warm air blower bertekanan.",
    carModel: "Bentley Continental GT",
    treatmentList: [
      "Thick Snow Foam pH-Balanced Decontamination",
      "Metode 2-Bucket Hand Wash dengan Grit Guard",
      "Detailing Celah Emblem, Grill, & Lis Karet",
      "Non-Touch Warm Air Blower Drying (Anti Baret)"
    ]
  },
  {
    id: "portfolio-4",
    category: "Detailing",
    badge: "DETAILING / 04",
    title: "Poles Kaca & Glass Shield Rain Repellent",
    subtitle: "Clarity in every downpour.",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop",
    description: "Pembersihan kerak jamur air asam (waterspot) pada seluruh kaca depan, samping, dan belakang secara kimiawi dan mekanis, dilanjutkan dengan pengaplikasian pelapis fluoropolymer agar air hujan meluncur otomatis saat mobil melaju.",
    carModel: "BMW M4 Competition",
    treatmentList: [
      "Glass Polishing Kerak Jamur & Oksidasi Silikat",
      "Ultra Glass Hydrophobic Sealant",
      "Wiper Chattter-Free Smooth Glide",
      "Visibilitas Malam Hari Bebas Silau Bias Air"
    ]
  },
  {
    id: "portfolio-5",
    category: "Pemasangan Biled",
    badge: "BILED / 05",
    title: "Custom DRL Matrix & Demon Eyes",
    subtitle: "Aggressive front-end persona.",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
    description: "Kustomisasi rumah lampu headlamp dengan shroud bergaya modern, retrofit Biled projector ganda, running sequential turn signal (sein berjalan), dan aksen Demon Eyes yang dapat dikontrol sesuai selera karakter pemilik.",
    carModel: "Honda Civic Turbo Sedan",
    treatmentList: [
      "Retrofit Dual Projector Biled 65 Watt",
      "Custom Black Chrome Housing Smoked Paint",
      "Dynamic Welcome Light Animation Sequence",
      "Garansi Kebocoran Embun & Mika 1 Tahun Penuh"
    ]
  },
  {
    id: "portfolio-6",
    category: "Interior & Mesin",
    badge: "INTERIOR / 06",
    title: "Deep Interior Detailing & Sanitasi Kabin",
    subtitle: "Purified luxury atmosphere.",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
    description: "Pembersihan total interior hingga ke serat karpet terdalam dan kisi-kisi AC, ekstraksi kotoran pada jok kain/kulit, kondisioner khusus kulit Nappa beraroma mewah, serta sterilisasi kabin memakai teknologi ozon & kabut antibakteri.",
    carModel: "Toyota Alphard Executive Lounge",
    treatmentList: [
      "Hot Steam Extraction Karpet Dasar & Plafon",
      "Leather Cleaner & Conditioner Ph-Seimbang",
      "Sterilisasi Ozon Kabin & Fogging Anti-Bakteri",
      "Dressing Dashboard Matte Alami Bebas Lengket"
    ]
  }
];
