# 🎓 KuliahVault (v1.2 Soft Pastel Edition)
> **Personal Academic Vault & Assignment Management Web App**  
> Dirancang sesuai spesifikasi PRD KuliahVault (24 Oktober 2026).

---

## 🌸 Identitas Visual: Soft Pastel Design System

KuliahVault menggunakan palet **Soft Pastel** yang tenang dan nyaman di mata untuk sesi belajar berjam-jam, dipadukan dengan teks kontras tinggi (*deep muted text on soft pastel surfaces*) berstandar WCAG AA/AAA:

### 1. Warna Brand & Permukaan
- 🪻 **Primary Pastel (Soft Lavender-Indigo):** Latar `#E0E7FF` / Teks `#3730A3`
- 🌸 **Secondary Pastel (Sakura Blush):** Latar `#FCE7F3` / Teks `#9D174D`
- 🌱 **Accent Pastel (Mint Sage):** Latar `#D1FAE5` / Teks `#065F46`
- 🍦 **Background & Surface (Warm Cream):** Latar `#FDFBF7` / Kartu `#FFFFFF` (Dark Mode: `#0F172A` / `#1E293B`)
- ⚫ **Typography (Deep Slate):** `#1E293B` (Slate 800) / `#F8FAFC`

### 2. Token Pastel Semantik Urgensi & Status Tugas
- 🌷 **Darurat (<24 jam / Overdue):** `#FFE4E6` / `#9F1239` / Border `#FECDD3`
- 🍑 **Perlu Perhatian Segera (1-3 hari):** `#FEF3C7` / `#92400E` / Border `#FDE68A`
- ☁️ **Sedang Dikerjakan (In Progress):** `#E0F2FE` / `#075985` / Border `#BAE6FD`
- 🪻 **Siap Dikumpulkan (Ready):** `#F3E8FF` / `#6B21A8` / Border `#E9D5FF`
- 🌱 **Sudah Dikumpulkan / Selesai:** `#D1FAE5` / `#065F46` / Border `#A7F3D0`
- 🕊️ **Belum Dimulai (Todo):** `#F1F5F9` / `#475569` / Border `#E2E8F0`

### 3. Palet 6 Tema Pastel Mata Kuliah
1. ☁️ **Baby Blue Pastel:** `#DBEAFE` &rarr; `#E0E7FF` / `#1E3A8A`
2. 🌱 **Mint Sage Pastel:** `#D1FAE5` &rarr; `#CCFBF1` / `#065F46`
3. 🪻 **Soft Lavender Pastel:** `#EDE9FE` &rarr; `#F3E8FF` / `#5B21B6`
4. 🌸 **Sakura Blush Pastel:** `#FCE7F3` &rarr; `#FFE4E6` / `#9D174D`
5. 🍑 **Soft Peach Pastel:** `#FFEDD5` &rarr; `#FEF3C7` / `#9A3412`
6. 🍋 **Buttercream Yellow:** `#FEF9C3` &rarr; `#FEF3C7` / `#854D0E`

---

## 🚀 Fitur yang Telah Diimplementasikan (FR-01 s/d FR-18)

- ✅ **FR-01 (Manajemen Semester):** Buat, edit, hapus, dan pilih semester aktif.
- ✅ **FR-02 (Manajemen Mata Kuliah & Tema Pastel):** Kode MK, nama, SKS, dosen, jadwal, ruangan/link, dan pemilih 6 tema soft pastel.
- ✅ **FR-03 (Silabus & Pertemuan Minggu 1-16):** Accordion pertemuan 1-16 dengan penanda khusus UTS (W8) dan UAS (W16).
- ✅ **FR-04 (Multi-File Drag & Drop Upload):** Dropzone upload interaktif dengan animasi bilah progres pastel.
- ✅ **FR-05 (Kategorisasi & Tagging Pastel):** Slide/PDF, E-Book, Rekaman, Tautan, serta tag `#bahan-uts`, `#penting`, `#praktikum`.
- ✅ **FR-06 (Penyimpanan Tautan Eksternal):** Simpan link YouTube, Google Docs, atau repo GitHub.
- ✅ **FR-07 (In-App File Previewer):** Pratinjau dokumen, audio/video player, dan link referensi langsung di peramban.
- ✅ **FR-08 (Command Palette `Ctrl+K` / `Cmd+K`):** Pencarian instan global materi, tugas, mata kuliah, dan tag.
- ✅ **FR-09 (Pembuatan & Detail Tugas):** Form lengkap judul, instruksi, tenggat waktu, prioritas, bobot %, dan jenis asesmen.
- ✅ **FR-10 (Pelacakan Status Kanban & Tabel):** 4 kolom interaktif (*Belum Dimulai*, *Sedang Dikerjakan*, *Siap Dikumpulkan*, *Sudah Dikumpulkan*).
- ✅ **FR-11 (Arsip Submission & Versioning):** Pelacakan versi pengumpulan (`v1 Draft`, `v2 Revisi`, `v3 Final`), tautan LMS, dan bukti screenshot kumpul.
- ✅ **FR-12 (Sistem Pengingat Deadline Telegram & Browser):** Konfigurasi bot Telegram pribadi dan simulasi pengingat H-3, H-1, H-6 jam.
- ✅ **FR-13 (Input Nilai & Bobot Tugas):** Skala 0-100 dan konversi huruf (A, AB, B, BC, C, D, E) berlatar pastel.
- ✅ **FR-14 (Dokumentasi Feedback Dosen):** Pencatatan evaluasi dan komentar dosen per tugas.
- ✅ **FR-15 (Kalkulator & Estimasi Nilai Akhir / IPK):** Simulasi target skor UAS yang dibutuhkan untuk meraih indeks A/AB/B.
- ✅ **FR-16 (Catatan Terintegrasi Markdown Editor):** Editor Markdown dengan tombol cepat callout box pastel `[!NOTE]`, `[!TIP]`, `[!WARNING]`, dan live preview.
- ✅ **FR-17 (Thread Komentar & Log Diskusi):** Kolom komentar berurutan waktu untuk tugas dan materi.
- ✅ **FR-18 (Tautan Bagikan Cepat / Read-Only Share):** Token bagikan baca-saja `/shared/[token]`.
- ✅ **Backup & Export:** Unduh cadangan JSON lengkap dan ekspor tugas ke format CSV / Excel.
- ✅ **Mode Gelap / Terang (Light & Dark Mode):** Toggle tema dengan token warna yang disesuaikan secara harmonis.

---

## 💻 Cara Menjalankan Proyek

1. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Buka peramban di [http://localhost:3000](http://localhost:3000).

2. **Build untuk Produksi:**
   ```bash
   npm run build
   npm run start
   ```

---

*Dibuat dengan ❤️ untuk kemudahan studi mandiri mahasiswa.*
