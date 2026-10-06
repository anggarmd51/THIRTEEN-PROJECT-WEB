# PROJECT STATE - THIRTEEN PROJECT AUTOMOTIVE SHOWROOM & WORKSHOP

## Status Terakhir (Fase 4 - Refactoring & Clean Up Bagian 1 & 2 Selesai)
Tanggal: 06 Oktober 2026

### 1. Pekerjaan yang Telah Selesai (Done)
- **Ketahanan & Data Fallback (Kategori 2)**:
  - `src/components/CarCatalog.tsx`: Jika pengambilan data Supabase gagal/error atau database kosong, katalog otomatis menggunakan fallback `CARS_DATA` dari `src/data/carsData.ts`. Mengganti layar error kosong yang memblokir dengan banner notifikasi halus (mode offline) sehingga pengguna tetap dapat melihat seluruh inventaris mobil.
  - `src/components/PortfolioSlider.tsx`: Jika pengambilan data Supabase gagal/error atau kosong, slider otomatis menggunakan fallback `PORTFOLIO_ITEMS` dari `src/data/portfolioData.ts`. Mengganti tampilan error masif dengan banner notifikasi halus sehingga galeri pengerjaan tetap tampil mulus.
  - Penanganan Gambar Rusak (`onError`): Menambahkan event handler `onError` pada seluruh tag `<img>` utama di `CarCatalog.tsx`, `PortfolioSlider.tsx` (kartu slider & modal lightbox), dan `CarDetailModal.tsx` (foto utama & baris thumbnail). Jika URL gambar gagal dimuat/rusak, otomatis berganti ke URL gambar placeholder berkualitas tinggi tanpa looping.
- **Kinerja & Best Practice React (Kategori 3)**:
  - Mengganti array index keys (`key={idx}`) dengan string unik stabil pada daftar dinamis:
    - `src/components/CarDetailModal.tsx`: thumbnail strip (`key={`${img.url || img.title}-${idx}`}`) dan poin keunggulan (`key={`${point}-${idx}`}`).
    - `src/components/admin/AdminCarModal.tsx`: daftar highlights unit (`key={`${item}-${idx}`}`).
    - `src/components/PortfolioSlider.tsx`: daftar tahapan treatment (`key={`${treatment}-${idx}`}`).
  - Optimasi Memoization (`useMemo`):
    - `src/components/CarCatalog.tsx`: Menyelimuti filtering katalog mobil (`filteredCars`) dan penentuan fallback (`displayCars`) dalam `useMemo` agar tidak dihitung ulang pada setiap re-render yang tidak relevan.
    - `src/components/PortfolioSlider.tsx`: Menyelimuti filtering portofolio (`filteredItems`) dan penentuan fallback (`displayPortfolios`) dalam `useMemo`.
  - Optimasi Callback (`useCallback`):
    - `src/App.tsx`: Menyelimuti handler tingkat atas (`handleSelectCar`, `handleCloseCarModal`, `handleOpenBooking`) menggunakan `useCallback` untuk menjaga stabilitas referensi fungsi saat di-pass ke komponen turunan.
- **Pembersihan Fase 4 Bagian 1 Sebelumnya**:
  - Penghapusan props dan fungsi tidak terpakai (`isUploadingGallery`, `onGalleryUpload`, `onRemoveGalleryPhoto`).
  - Pembersihan logging konsol (`console.warn`, `console.info`, `console.log`) hanya menyisakan `console.error` pada kegagalan kritis.
  - Pengetatan tipe data TypeScript tanpa `any` di `supabaseDb.ts`, `types.ts`, `AdminCarTable.tsx`, dan `AdminPortfolioGrid.tsx`.

### 2. Keputusan Teknis (Decisions Made)
- **Graceful Degradation / Offline Resilience**: Pengguna tidak akan pernah dihadapkan pada layar kosong jika Supabase mengalami gangguan koneksi; aplikasi beralih secara transparan ke data statis kurasi lokal dengan opsi sinkronisasi ulang.
- **Infinite Loop Prevention pada `onError`**: Memeriksa `target.src !== FALLBACK_IMAGE` sebelum menetapkan gambar fallback agar terhindar dari infinite loop jika koneksi jaringan offline total.

### 3. Batasan & Hal yang Belum Dapat Diverifikasi (Open Issues / Not Verified)
- **Verifikasi Build**: Lulus uji `compile_applet` dan `lint_applet` (`tsc --noEmit`) dengan 0 error/warning.
- **Runtime Supabase**: Koneksi ke bucket remote Supabase `car-360-videos` bergantung pada konfigurasi kredensial environment pengguna di production.
