-- ==============================================================================
-- THIRTEEN PROJECT - SUPABASE DATABASE ARCHITECTURE SCHEMA
-- Tables: 'cars' & 'portfolio' (with 'portfolios' compatibility view)
-- Storage Buckets: 'car-photos' & 'portfolio-photos'
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLE: 'cars' (Katalog Mobil Bekas Pilihan)
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Umum',
  model TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT 2022,
  price BIGINT NOT NULL DEFAULT 0,
  badge TEXT DEFAULT 'AVAILABLE',
  transmission TEXT NOT NULL DEFAULT 'Automatic',
  mileage INTEGER NOT NULL DEFAULT 0,
  engine TEXT DEFAULT '',
  fuel_type TEXT DEFAULT 'Bensin',
  color TEXT DEFAULT '',
  tax_status TEXT DEFAULT 'Pajak Hidup Panjang',
  plate TEXT DEFAULT 'BK (Sumatera Utara)',
  location TEXT DEFAULT 'Langkat / Medan',
  main_image TEXT NOT NULL,
  description TEXT DEFAULT '',
  highlights JSONB DEFAULT '[]'::jsonb,
  gallery JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. CREATE TABLE: 'portfolio' (Galeri Portofolio Hasil Kerja)
CREATE TABLE IF NOT EXISTS public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Detailing',
  badge TEXT DEFAULT 'WORK / 01',
  subtitle TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  description TEXT DEFAULT '',
  car_model TEXT DEFAULT '',
  treatment_list JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibility view for pluralized 'portfolios' query
CREATE OR REPLACE VIEW public.portfolios AS
  SELECT * FROM public.portfolio;

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Cars Policies: Public read access, Anon/Authenticated CRUD access
DROP POLICY IF EXISTS "Allow public read cars" ON public.cars;
CREATE POLICY "Allow public read cars" ON public.cars
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert cars" ON public.cars;
CREATE POLICY "Allow anon insert cars" ON public.cars
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update cars" ON public.cars;
CREATE POLICY "Allow anon update cars" ON public.cars
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon delete cars" ON public.cars;
CREATE POLICY "Allow anon delete cars" ON public.cars
  FOR DELETE USING (true);

-- Portfolio Policies: Public read access, Anon/Authenticated CRUD access
DROP POLICY IF EXISTS "Allow public read portfolio" ON public.portfolio;
CREATE POLICY "Allow public read portfolio" ON public.portfolio
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert portfolio" ON public.portfolio;
CREATE POLICY "Allow anon insert portfolio" ON public.portfolio
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update portfolio" ON public.portfolio;
CREATE POLICY "Allow anon update portfolio" ON public.portfolio
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon delete portfolio" ON public.portfolio;
CREATE POLICY "Allow anon delete portfolio" ON public.portfolio
  FOR DELETE USING (true);

-- 5. STORAGE BUCKETS SETUP (Public storage for car & portfolio photos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-photos', 'car-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-photos', 'portfolio-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Objects Policies
DROP POLICY IF EXISTS "Public access to car-photos" ON storage.objects;
CREATE POLICY "Public access to car-photos" ON storage.objects
  FOR SELECT USING (bucket_id IN ('car-photos', 'portfolio-photos'));

DROP POLICY IF EXISTS "Public upload to car-photos" ON storage.objects;
CREATE POLICY "Public upload to car-photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('car-photos', 'portfolio-photos'));

DROP POLICY IF EXISTS "Public update in car-photos" ON storage.objects;
CREATE POLICY "Public update in car-photos" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('car-photos', 'portfolio-photos'));

DROP POLICY IF EXISTS "Public delete in car-photos" ON storage.objects;
CREATE POLICY "Public delete in car-photos" ON storage.objects
  FOR DELETE USING (bucket_id IN ('car-photos', 'portfolio-photos'));

-- ==============================================================================
-- 6. INITIAL SEED DATA (OPTIONAL: Jalankan jika ingin mengisi data awal langsung)
-- ==============================================================================

INSERT INTO public.cars (name, brand, model, year, price, badge, transmission, mileage, engine, fuel_type, color, tax_status, plate, location, main_image, description, highlights, gallery)
VALUES 
(
  'Honda Civic Turbo',
  'Honda',
  'Civic 1.5 VTEC Turbo Sedan',
  2021,
  478000000,
  'SPORTY DAILY',
  'Automatic (CVT)',
  28400,
  '1.5L DOHC VTEC Turbocharged (173 PS)',
  'Bensin (Pertamax / Shell)',
  'Sonic Gray Pearl (Lapis Coating Ceramic)',
  'Pajak Hidup Panjang (s/d November 2025)',
  'BK (Sumatera Utara) - Tangan Pertama',
  'Langkat / Medan',
  'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1400&auto=format&fit=crop',
  'Kondisi sangat istimewa, rawatan bengkel resmi Honda dengan service record tercatat rapi. Mobil milik perorangan tangan pertama dari baru. Cat eksterior original mulus telah diproteksi 3-layer Nano Ceramic Coating di THIRTEEN PROJECT.',
  '["Service Record Rutin Bengkel Resmi Honda", "Odometer Asli 28.400 KM (Garansi Bukan Putaran)", "Sudah Terpasang Nano Ceramic Coating 3-Layer", "Ban 4 Unit Masih Tebal 90% Siap Luar Kota", "Bukan Bekas Tabrakan Fatal & Bebas Banjir 100%"]'::jsonb,
  '[{"title": "Tampak Depan & Lampu Biled", "url": "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1400&auto=format&fit=crop", "tag": "Depan"}, {"title": "Sisi Samping & Velg Sporty", "url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1400&auto=format&fit=crop", "tag": "Samping"}]'::jsonb
),
(
  'Toyota Fortuner 2.8 VRZ GR Sport',
  'Toyota',
  'Fortuner 2.8 VRZ 4x2 GR Sport Diesel',
  2022,
  585000000,
  'TOUGH SUV',
  '6-Speed Automatic Sport Sequential',
  32000,
  '2.8L 1GD-FTV DOHC VN Turbo Intercooler (204 PS / 500 Nm)',
  'Diesel (Dexlite / Pertamina Dex)',
  'Super White II With Black Roof (Two-Tone)',
  'Pajak Hidup (s/d Maret 2026)',
  'BK (Sumatera Utara)',
  'Langkat / Medan',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1400&auto=format&fit=crop',
  'Varian tertinggi mesin monster 2.800 cc 1GD-FTV bertenaga buas 204 PS dengan torsi masif 500 Nm. Dilengkapi body kit original GR Sport, suspensi khusus GR, interior bernuansa dark sporty.',
  '["Mesin 2.800 cc 1GD-FTV Paling Bertenaga", "Full Bodykit & Emblem Original GR Sport", "Power Backdoor dengan Kick Sensor Berfungsi Sempurna", "Bukan Bekas Proyek Maupun Offroad Ekstrem"]'::jsonb,
  '[{"title": "Tampak Depan Gagah GR Sport", "url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1400&auto=format&fit=crop", "tag": "Depan"}, {"title": "Sisi Samping & Ground Clearance Tinggi", "url": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1400&auto=format&fit=crop", "tag": "Samping"}]'::jsonb
),
(
  'BMW 320i Sport G20 LCI',
  'BMW',
  '320i Sport G20 Facelift',
  2021,
  695000000,
  'EXECUTIVE',
  '8-Speed Steptronic Sport Transmission',
  19800,
  '2.0L BMW TwinPower Turbo 4-Cylinder (184 HP)',
  'Bensin (Ron 95/98)',
  'Mineral White Metallic',
  'Pajak Hidup (s/d Agustus 2025)',
  'BK (Pajak Pilihan)',
  'Langkat / Medan',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1400&auto=format&fit=crop',
  'BMW Seri 3 generasi G20 dengan handling legendaris 50:50 weight distribution. Dilengkapi BMW Live Cockpit Professional, iDrive 7.0, Wireless Apple CarPlay, dan ambient lighting.',
  '["Kilometer Sangat Rendah 19.800 KM On-Going", "BSI (BMW Service Inclusive) Masih Aktif", "Cat Original Bebas Cat Ulang / Spet", "Interior Leather Vernasca Mulus Tanpa Retak"]'::jsonb,
  '[{"title": "Tampak Depan Kidney Grille G20", "url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1400&auto=format&fit=crop", "tag": "Depan"}]'::jsonb
);

INSERT INTO public.portfolio (title, category, badge, subtitle, image_url, description, car_model, treatment_list)
VALUES
(
  'Kilap Sempurna Coating Ceramic',
  'Detailing',
  'DETAILING / 01',
  'Paintwork, perfected.',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
  'Koreksi cat 3-stage (compounding, polishing, ultra-finish) untuk menghilangkan swirl mark dan goresan mikro, disempurnakan dengan lapisan 9H Nano Ceramic Coating 3 lapis untuk efek daun talas (hydrophobic) dan kilau basah (deep wet look) tahan lama.',
  'Mercedes-AMG GT Coupe',
  '["Multi-Stage Paint Correction (Hilangkan 95% Swirl Mark)", "Lapisan 9H Nano Ceramic Coating 3-Layer", "Perlindungan UV & Ketahanan Goresan Ringan", "Efek Hidrofobik Ekstrem (Self-Cleaning Property)"]'::jsonb
),
(
  'Hasil Cut-Off Cahaya Biled Malam Hari',
  'Pemasangan Biled',
  'BILED / 02',
  'See the difference at night.',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
  'Instalasi lampu projector Biled 3-inch Turbo Matrix dengan garis potong (cut-off line) horizontal super tajam dan fokus. Output cahaya 5500K putih bersih natural menembus hujan lebat dan kabut tanpa menyilaukan pandangan pengemudi dari lawan arah.',
  'Porsche 911 Carrera S',
  '["Biled Projector Matrix Dual Core 3.0 Inch", "Laser High Beam Penetrasi Kabut & Hujan", "Presisi Cut-Off Flat RHD (Right-Hand Drive)", "Kabel Relay Set Tebal & Modul Canbus Error-Free"]'::jsonb
),
(
  'Cuci Busa Salju Mendalam',
  'Cuci Mobil Premium',
  'CARWASH / 03',
  'The ritual of clean.',
  'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=1200&auto=format&fit=crop',
  'Perawatan pencucian komprehensif menggunakan shampoo snow foam berformula pH-netral impor, metode Two-Bucket Wash dengan microfiber plush lembut, kuas detailer bulu kuda liar untuk celah emblem, serta pengeringan aman menggunakan warm air blower bertekanan.',
  'Bentley Continental GT',
  '["Thick Snow Foam pH-Balanced Decontamination", "Metode 2-Bucket Hand Wash dengan Grit Guard", "Detailing Celah Emblem, Grill, & Lis Karet", "Non-Touch Warm Air Blower Drying (Anti Baret)"]'::jsonb
);
