export interface CarUnit {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  formattedPrice: string;
  badge: string;
  transmission: string;
  mileage: number;
  formattedMileage: string;
  engine: string;
  fuelType: string;
  color: string;
  taxStatus: string;
  plate: string;
  location: string;
  mainImage: string;
  gallery: {
    title: string;
    url: string;
    tag: string;
  }[];
  description: string;
  highlights: string[];
  specs: {
    label: string;
    value: string;
  }[];
}

export const CARS_DATA: CarUnit[] = [
  {
    id: "honda-civic-turbo-2021",
    name: "Honda Civic Turbo",
    brand: "Honda",
    model: "Civic 1.5 VTEC Turbo Sedan",
    year: 2021,
    price: 478000000,
    formattedPrice: "Rp 478.000.000",
    badge: "SPORTY DAILY",
    transmission: "Automatic (CVT)",
    mileage: 28400,
    formattedMileage: "28.400 KM",
    engine: "1.5L DOHC VTEC Turbocharged (173 PS)",
    fuelType: "Bensin (Pertamax / Shell)",
    color: "Sonic Gray Pearl (Lapis Coating Ceramic)",
    taxStatus: "Pajak Hidup Panjang (s/d November 2025)",
    plate: "BK (Sumatera Utara) - Tangan Pertama",
    location: "Langkat / Medan",
    mainImage: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      {
        title: "Tampak Depan & Lampu Biled",
        url: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1400&auto=format&fit=crop",
        tag: "Depan"
      },
      {
        title: "Sisi Samping & Velg Sporty",
        url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1400&auto=format&fit=crop",
        tag: "Samping"
      },
      {
        title: "Tampak Belakang & Dual Exhaust",
        url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1400&auto=format&fit=crop",
        tag: "Belakang"
      },
      {
        title: "Interior Dashboard & Layar Touchscreen",
        url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1400&auto=format&fit=crop",
        tag: "Dashboard"
      },
      {
        title: "Jok Kulit Original & Kabin Bersih",
        url: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1400&auto=format&fit=crop",
        tag: "Interior"
      },
      {
        title: "Ruang Mesin Terawat & Kering",
        url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1400&auto=format&fit=crop",
        tag: "Mesin"
      }
    ],
    description: "Honda Civic Turbo Sedan 2021 kondisi sangat istimewa, rawatan bengkel resmi Honda dengan service record tercatat rapi. Mobil milik perorangan tangan pertama dari baru. Cat eksterior original mulus telah diproteksi 3-layer Nano Ceramic Coating di THIRTEEN PROJECT. Tidak pernah terkena banjir ataupun insiden tabrakan, interior bersih higienis dan wangi segar.",
    highlights: [
      "Service Record Rutin Bengkel Resmi Honda",
      "Odometer Asli 28.400 KM (Garansi Bukan Putaran)",
      "Sudah Terpasang Nano Ceramic Coating 3-Layer",
      "Kunci Serep & Buku Servis/Manual Lengkap",
      "Ban 4 Unit Masih Tebal 90% Siap Luar Kota",
      "Bukan Bekas Tabrakan Fatal & Bebas Banjir 100%"
    ],
    specs: [
      { label: "Tahun Perakitan", value: "2021" },
      { label: "Jarak Tempuh", value: "28.400 KM" },
      { label: "Transmisi", value: "Automatic CVT with Paddle Shift" },
      { label: "Bahan Bakar", value: "Bensin (Ron 92+)" },
      { label: "Kapasitas Mesin", value: "1.498 cc 4-Cylinder Turbo" },
      { label: "Warna Eksterior", value: "Sonic Gray Pearl" },
      { label: "Status Pajak", value: "Hidup Panjang s/d 11-2025" },
      { label: "Kepemilikan", value: "Tangan Pertama (Perorangan)" }
    ]
  },
  {
    id: "toyota-fortuner-vrz-2020",
    name: "Toyota Fortuner VRZ",
    brand: "Toyota",
    model: "Fortuner 2.4 VRZ Diesel 4x2",
    year: 2020,
    price: 495000000,
    formattedPrice: "Rp 495.000.000",
    badge: "FAMILY SUV",
    transmission: "Automatic 6-Speed",
    mileage: 46200,
    formattedMileage: "46.200 KM",
    engine: "2.4L 2GD-FTV Turbo Diesel Intercooler (149.6 PS)",
    fuelType: "Diesel (Dexlite / Pertamina Dex)",
    color: "Attitude Black Mica",
    taxStatus: "Pajak Hidup Panjang (s/d Agustus 2025)",
    plate: "BK (Sumatera Utara) - Nopol Pilihan",
    location: "Langkat / Medan",
    mainImage: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      {
        title: "Tampak Depan Gagah & Headlamp LED",
        url: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1400&auto=format&fit=crop",
        tag: "Depan"
      },
      {
        title: "Profil Samping & Footstep Kokoh",
        url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1400&auto=format&fit=crop",
        tag: "Samping"
      },
      {
        title: "Tampak Belakang & Power Backdoor",
        url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1400&auto=format&fit=crop",
        tag: "Belakang"
      },
      {
        title: "Dashboard Mewah & Steering Control",
        url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1400&auto=format&fit=crop",
        tag: "Interior"
      },
      {
        title: "Kabin 3 Baris Luas & Bersih",
        url: "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1400&auto=format&fit=crop",
        tag: "Kabin"
      },
      {
        title: "Mesin 2GD Diesel Sehat & Bertenaga",
        url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1400&auto=format&fit=crop",
        tag: "Mesin"
      }
    ],
    description: "Toyota Fortuner VRZ Diesel 2020 warna hitam favorit. SUV tangguh dengan kenyamanan maksimal untuk keluarga, suspensi empuk dan mesin 2GD diesel yang terkenal sangat bandel serta irit bahan bakar. Interior kulit hitam terawat tanpa pecah-pecah, plafon bersih, AC triple blower dingin menggigil. Surat-surat legalitas sah 100%.",
    highlights: [
      "Mesin 2.4L Diesel 2GD Halus & Bertenaga",
      "Power Backdoor dengan Fitur Kick Sensor Aktif",
      "Interior Kulit Mewah Tanpa Cacat / Retak",
      "Cat Orisinil Mulus Deep Wet Look",
      "Kaki-kaki Senyap Tanpa Bunyi di Jalan Bergelombang",
      "Dokumen Lengkap: BPKB, STNK, Faktur Asli"
    ],
    specs: [
      { label: "Tahun Perakitan", value: "2020" },
      { label: "Jarak Tempuh", value: "46.200 KM" },
      { label: "Transmisi", value: "Automatic 6-Speed Sport Sequential" },
      { label: "Bahan Bakar", value: "Solar / Diesel (Euro 4)" },
      { label: "Kapasitas Mesin", value: "2.393 cc VN Turbo" },
      { label: "Warna Eksterior", value: "Attitude Black Metallic" },
      { label: "Status Pajak", value: "Hidup Panjang s/d 08-2025" },
      { label: "Kapasitas Penumpang", value: "7 Seater" }
    ]
  },
  {
    id: "bmw-320i-sport-2019",
    name: "BMW 320i Sport",
    brand: "BMW",
    model: "320i G20 Sport Line LCI",
    year: 2019,
    price: 528000000,
    formattedPrice: "Rp 528.000.000",
    badge: "EXECUTIVE",
    transmission: "Steptronic Sport 8-Speed",
    mileage: 35800,
    formattedMileage: "35.800 KM",
    engine: "2.0L BMW TwinPower Turbo 4-Cylinder (184 HP)",
    fuelType: "Bensin (Pertamax Turbo / Ron 98)",
    color: "Alpine White on Cognac Leather",
    taxStatus: "Pajak Hidup (s/d Mei 2025)",
    plate: "BK (Sumatera Utara) - Pajak On",
    location: "Langkat / Medan",
    mainImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      {
        title: "Tampak Depan BMW Iconic Kidney Grille",
        url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1400&auto=format&fit=crop",
        tag: "Depan"
      },
      {
        title: "Profil Samping Dinamis G20",
        url: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=1400&auto=format&fit=crop",
        tag: "Samping"
      },
      {
        title: "Tampak Belakang Lampu L-Shape Khas BMW",
        url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1400&auto=format&fit=crop",
        tag: "Belakang"
      },
      {
        title: "Cockpit Modern & BMW iDrive 7.0",
        url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1400&auto=format&fit=crop",
        tag: "Dashboard"
      },
      {
        title: "Jok Cognac Vernasca Leather Premium",
        url: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1400&auto=format&fit=crop",
        tag: "Interior"
      },
      {
        title: "Mesin B48 TwinPower Turbo Bersih",
        url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1400&auto=format&fit=crop",
        tag: "Mesin"
      }
    ],
    description: "Sedan premium eksekutif BMW Seri 3 G20 320i Sport 2019. Unit koleksi dengan kombinasi warna paling dicari: Alpine White eksterior dipadu interior kulit Cognac Leather yang sangat mewah. Fitur BMW Live Cockpit Professional, Apple CarPlay nirkabel, Ambient Lighting multi-warna, dan handling berkendara 50:50 weight distribution legendaris khas Bavarian.",
    highlights: [
      "BMW Live Cockpit Professional Digital Display",
      "Full Service Record Resmi BMW Astra",
      "Ambient Lighting 11 Pilihan Warna Elegan",
      "Handling Sporty & Suspensi Sangat Presisi",
      "Kondisi Interior 98% Like New Tanpa Bekas Rokok",
      "Garansi Keaslian Odometer & Lolos Inspeksi 150+ Titik"
    ],
    specs: [
      { label: "Tahun Perakitan", value: "2019" },
      { label: "Jarak Tempuh", value: "35.800 KM" },
      { label: "Transmisi", value: "8-Speed Steptronic Sport with Paddle Shift" },
      { label: "Bahan Bakar", value: "Bensin (Ron 95/98)" },
      { label: "Kapasitas Mesin", value: "1.998 cc TwinPower Turbo" },
      { label: "Warna Eksterior", value: "Alpine White" },
      { label: "Status Pajak", value: "Hidup s/d 05-2025" },
      { label: "Daya Maksimum", value: "184 HP / 300 Nm Torque" }
    ]
  },
  {
    id: "honda-hr-v-prestige-2022",
    name: "Honda HR-V Prestige",
    brand: "Honda",
    model: "HR-V 1.5 RS Turbo / Prestige",
    year: 2022,
    price: 415000000,
    formattedPrice: "Rp 415.000.000",
    badge: "LOW KM",
    transmission: "Automatic (CVT)",
    mileage: 19700,
    formattedMileage: "19.700 KM",
    engine: "1.5L VTEC Turbo with Honda Sensing (177 PS)",
    fuelType: "Bensin (Ron 92+)",
    color: "Meteoroid Gray Metallic",
    taxStatus: "Pajak Hidup (s/d Maret 2026)",
    plate: "BK (Sumatera Utara) - Low Odo",
    location: "Langkat / Medan",
    mainImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      {
        title: "Tampak Depan Grille Modern RS",
        url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1400&auto=format&fit=crop",
        tag: "Depan"
      },
      {
        title: "Profil Crossover Fastback Elegan",
        url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1400&auto=format&fit=crop",
        tag: "Samping"
      },
      {
        title: "Lampu Belakang Horizontal LED Bar",
        url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1400&auto=format&fit=crop",
        tag: "Belakang"
      },
      {
        title: "Kabin Modern dengan Panoramic Glass Roof",
        url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1400&auto=format&fit=crop",
        tag: "Interior"
      },
      {
        title: "Jok Semi-Leather RS Jahitan Merah",
        url: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1400&auto=format&fit=crop",
        tag: "Kabin"
      },
      {
        title: "Mesin VTEC Turbo Higienis & Bersih",
        url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1400&auto=format&fit=crop",
        tag: "Mesin"
      }
    ],
    description: "Honda HR-V 2022 varian tertinggi dengan paket fitur keselamatan Honda Sensing aktif (Adaptive Cruise Control, Lane Keeping Assist, CMBS). Odometer sangat rendah di 19.700 KM, mobil simpanan jarang pakai dalam kondisi nyaris seperti baru keluar dari dealer. Dilengkapi Panoramic Glass Roof dan Hands-Free Access Power Tailgate dengan Walk Away Close.",
    highlights: [
      "Fitur Keselamatan Lengkap Honda Sensing™",
      "Panoramic Glass Roof & Hands-Free Power Tailgate",
      "Kilometer Sangat Rendah: Baru 19.700 KM",
      "Kondisi Bodi Full Kaleng Bebas Baret",
      "Pajak Panjang & Dokumen Terjamin 100% Sah",
      "Sudah Lulus Uji Kelayakan & Siap Pakai"
    ],
    specs: [
      { label: "Tahun Perakitan", value: "2022" },
      { label: "Jarak Tempuh", value: "19.700 KM (Low KM)" },
      { label: "Transmisi", value: "Automatic CVT" },
      { label: "Bahan Bakar", value: "Bensin (Pertamax)" },
      { label: "Kapasitas Mesin", value: "1.498 cc VTEC Turbo" },
      { label: "Warna Eksterior", value: "Meteoroid Gray Metallic" },
      { label: "Status Pajak", value: "Hidup s/d 03-2026" },
      { label: "Fitur Keselamatan", value: "Honda Sensing Suite" }
    ]
  },
  {
    id: "mitsubishi-pajero-sport-dakar-2021",
    name: "Mitsubishi Pajero Sport Dakar",
    brand: "Mitsubishi",
    model: "Pajero Sport 2.4 Dakar 4x2 Sunroof",
    year: 2021,
    price: 512000000,
    formattedPrice: "Rp 512.000.000",
    badge: "KONDISI ISTIMEWA",
    transmission: "Automatic 8-Speed",
    mileage: 38200,
    formattedMileage: "38.200 KM",
    engine: "2.4L 4N15 MIVEC Turbo Diesel (181 PS)",
    fuelType: "Diesel (Dexlite / Pertamina Dex)",
    color: "Deep Bronze Metallic",
    taxStatus: "Pajak Hidup (s/d Juli 2025)",
    plate: "BK (Sumatera Utara)",
    location: "Langkat / Medan",
    mainImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      {
        title: "Tampak Muka Dynamic Shield Facelift",
        url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1400&auto=format&fit=crop",
        tag: "Depan"
      },
      {
        title: "Bodi Samping Kekar dengan Sunroof Aktif",
        url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1400&auto=format&fit=crop",
        tag: "Samping"
      },
      {
        title: "Lampu Belakang LED Vertikal Khas Pajero",
        url: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1400&auto=format&fit=crop",
        tag: "Belakang"
      },
      {
        title: "Speedometer Full TFT 8 Inch & Sunroof",
        url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1400&auto=format&fit=crop",
        tag: "Dashboard"
      },
      {
        title: "Kabin 7 Penumpang Nyaman & AC Dingin",
        url: "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1400&auto=format&fit=crop",
        tag: "Kabin"
      },
      {
        title: "Mesin 4N15 MIVEC Diesel Bertenaga",
        url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1400&auto=format&fit=crop",
        tag: "Mesin"
      }
    ],
    description: "Mitsubishi Pajero Sport Dakar Facelift 2021 dengan Electric Sunroof dan layar meter cluster 8-inch Color LCD. Unit terawat super mulus, suspensi nyaman, tarikan mesin diesel MIVEC 181 PS sangat responsif. Fitur Forward Collision Mitigation (FCM) dan Ultrasonic Misacceleration Mitigation System (UMS) siap menjaga perjalanan keluarga tetap aman.",
    highlights: [
      "Electric Sunroof Berfungsi Normal 100%",
      "8-Inch Color LCD Meter Cluster Digital",
      "Electronic Parking Brake & Brake Auto Hold",
      "Power Tailgate dengan Sensor Gerak Kaki",
      "Cat Orisinil Mulus Terlindungi Coating",
      "Lulus Verifikasi Keaslian Dokumen BPKB & STNK"
    ],
    specs: [
      { label: "Tahun Perakitan", value: "2021" },
      { label: "Jarak Tempuh", value: "38.200 KM" },
      { label: "Transmisi", value: "Automatic 8-Speed Sport Mode" },
      { label: "Bahan Bakar", value: "Solar / Diesel" },
      { label: "Kapasitas Mesin", value: "2.442 cc MIVEC Turbo" },
      { label: "Warna Eksterior", value: "Deep Bronze Metallic" },
      { label: "Status Pajak", value: "Hidup s/d 07-2025" },
      { label: "Tenaga Mesin", value: "181 PS / 430 Nm" }
    ]
  },
  {
    id: "mercedes-benz-c200-amg-2019",
    name: "Mercedes-Benz C200",
    brand: "Mercedes-Benz",
    model: "C200 AMG Line W205 Facelift",
    year: 2019,
    price: 565000000,
    formattedPrice: "Rp 565.000.000",
    badge: "LUXURY SEDAN",
    transmission: "9G-TRONIC Automatic",
    mileage: 31500,
    formattedMileage: "31.500 KM",
    engine: "1.5L Turbo with EQ Boost Mild Hybrid (184 HP)",
    fuelType: "Bensin (Pertamax Turbo / Ron 98)",
    color: "Obsidian Black Metallic",
    taxStatus: "Pajak Hidup Panjang (s/d September 2025)",
    plate: "BK (Sumatera Utara) - Record Garasindo",
    location: "Langkat / Medan",
    mainImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      {
        title: "Tampak Depan Diamond Grille AMG Line",
        url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1400&auto=format&fit=crop",
        tag: "Depan"
      },
      {
        title: "Profil Samping Aerodinamis AMG Velg 18 Inci",
        url: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=1400&auto=format&fit=crop",
        tag: "Samping"
      },
      {
        title: "Tampak Belakang Dual Exhaust Chrome",
        url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1400&auto=format&fit=crop",
        tag: "Belakang"
      },
      {
        title: "Cockpit Mewah Mercedes-Benz Digital Display",
        url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1400&auto=format&fit=crop",
        tag: "Dashboard"
      },
      {
        title: "Jok Artico Leather AMG & Open Pore Wood",
        url: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1400&auto=format&fit=crop",
        tag: "Interior"
      },
      {
        title: "Mesin EQ Boost Terawat Prima",
        url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1400&auto=format&fit=crop",
        tag: "Mesin"
      }
    ],
    description: "Mercedes-Benz C200 AMG Line W205 Facelift 2019 warna Obsidian Black. Model favorit dengan body kit sporty AMG Line, Diamond Grille, Flat-bottom steering wheel, dan suspensi Agility Control yang menghadirkan paduan kenyamanan ningrat dan kedinamisan berkendara khas Jerman.",
    highlights: [
      "Body Kit AMG Line Asli Pabrikan & Velg 18-Inch",
      "Transmisi Canggih 9-Speed 9G-TRONIC",
      "Headlamp High-Performance LED Mercedes-Benz",
      "Full Record Dealer Resmi Mercedes-Benz",
      "Interior Kayu Asli Anthracite Open-Pore Wood",
      "Garansi Keaslian Odometer & Kelaikan Mesin"
    ],
    specs: [
      { label: "Tahun Perakitan", value: "2019" },
      { label: "Jarak Tempuh", value: "31.500 KM" },
      { label: "Transmisi", value: "9G-TRONIC Automatic" },
      { label: "Bahan Bakar", value: "Bensin (Ron 95/98)" },
      { label: "Kapasitas Mesin", value: "1.497 cc Turbo EQ Boost" },
      { label: "Warna Eksterior", value: "Obsidian Black Metallic" },
      { label: "Status Pajak", value: "Hidup s/d 09-2025" },
      { label: "Fitur Desain", value: "AMG Styling Package" }
    ]
  }
];

export const WHATSAPP_PHONE = "6282272777421";
export const DISPLAY_PHONE = "0822 7277 7421";
export const STORE_ADDRESS = "Jl. Berdikari, Timbang Lawan, Kec. Bohorok, Kabupaten Langkat, Sumatera Utara 20774";
export const OPERATING_HOURS = "Senin – Sabtu: 09.00 – 18.00 WIB";

export function generateCarWhatsAppLink(carName: string, price: string): string {
  const message = `Halo THIRTEEN PROJECT, saya tertarik dengan unit ${carName} harga ${price}. Apakah masih ready?`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function generateServiceWhatsAppLink(serviceName: string, vehicleInfo?: string): string {
  const extra = vehicleInfo ? ` untuk kendaraan ${vehicleInfo}` : "";
  const message = `Halo THIRTEEN PROJECT, saya ingin konsultasi / booking layanan ${serviceName}${extra}. Mohon info estimasi jadwal & harganya. Terima kasih.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
