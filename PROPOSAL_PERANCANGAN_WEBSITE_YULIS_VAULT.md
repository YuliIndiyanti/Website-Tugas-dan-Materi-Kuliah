# PROPOSAL PERANCANGAN DAN PENGEMBANGAN SISTEM INFORMASI AKADEMIK PRIBADI
# "YULI'S VAULT (YULI'S SECOND BRAIN)"
### *Personal Academic Vault & Task Management Web Application Berbasis Next.js dan SQLite*

---

**Diajukan untuk Memenuhi Tugas Proyek Mata Kuliah:**  
**Analisis dan Desain Perangkat Lunak (ADPL / APPL)**  
Program Studi Teknik Informatika — Semester Ganjil 2026/2027

---

## DATA PENGUSUL & IDENTITAS PROYEK

| Atribut Dokumen | Informasi Rinci |
| :--- | :--- |
| **Nama Pengusul** | **Yuli Indiyanti** |
| **Nomor Induk Mahasiswa (NIM)** | **240511130** |
| **Kelas / Rombel** | **TI24D** |
| **Program Studi** | Teknik Informatika |
| **Mata Kuliah** | Analisis dan Desain Perangkat Lunak (ADPL) |
| **Dosen Pengampu** | Dosen Pengampu Mata Kuliah ADPL |
| **Judul Produk Perangkat Lunak** | **Yuli's Vault (Yuli's Second Brain)** |
| **Tagline Produk** | *Streamline your study workflow. Track tasks and manage materials effortlessly.* |
| **Durasi Waktu Pengerjaan** | **1 Minggu (7 Hari Kalender / Rapid Agile Sprint)** |
| **Tautan Repositori GitHub** | [https://github.com/YuliIndiyanti/Website-Tugas-dan-Materi-Kuliah.git](https://github.com/YuliIndiyanti/Website-Tugas-dan-Materi-Kuliah.git) |
| **Status Implementasi** | **Selesai Diimplementasikan & Teruji (Production Ready - Build Exit Code 0)** |

---

## DAFTAR ISI

- [BAB I: PENDAHULUAN](#bab-i-pendahuluan)
  - [1.1 Latar Belakang Masalah](#11-latar-belakang-masalah)
  - [1.2 Rumusan Masalah](#12-rumusan-masalah)
  - [1.3 Tujuan Pengembangan Sistem](#13-tujuan-pengembangan-sistem)
  - [1.4 Manfaat Produk](#14-manfaat-produk)
  - [1.5 Ruang Lingkup dan Batasan Sistem](#15-ruang-lingkup-dan-batasan-sistem)
- [BAB II: ANALISIS KEBUTUHAN SISTEM (SYSTEM REQUIREMENTS)](#bab-ii-analisis-kebutuhan-sistem-system-requirements)
  - [2.1 Profil dan Karakteristik Pengguna](#21-profil-dan-karakteristik-pengguna)
  - [2.2 Kebutuhan Fungsional (Functional Requirements - MoSCoW Framework)](#22-kebutuhan-fungsional-functional-requirements---moscow-framework)
  - [2.3 Kebutuhan Non-Fungsional (Non-Functional Requirements)](#23-kebutuhan-non-fungsional-non-functional-requirements)
  - [2.4 Konsep Identitas Visual & Estetika (Warm Chocolate, Dark Brown & Glitter Sparkles)](#24-konsep-identitas-visual--estetika-warm-chocolate-dark-brown--glitter-sparkles)
- [BAB III: PERANCANGAN ARSITEKTUR & DESAIN PERANGKAT LUNAK](#bab-iii-perancangan-arsitektur--desain-perangkat-lunak)
  - [3.1 Arsitektur Sistem Fullstack Modern](#31-arsitektur-sistem-fullstack-modern)
  - [3.2 Diagram Alur Logika Pengguna & Portal Dosen (Core User Flows)](#32-diagram-alur-logika-pengguna--portal-dosen-core-user-flows)
  - [3.3 Perancangan Basis Data Relasional (Data Modeling & Prisma Schema)](#33-perancangan-basis-data-relasional-data-modeling--prisma-schema)
  - [3.4 Desain Antarmuka Pengguna & Fitur-Fitur Unggulan Sistem](#34-desain-antarmuka-pengguna--fitur-fitur-unggulan-sistem)
- [BAB IV: RENCANA KERJA & JADWAL IMPLEMENTASI (1-WEEK SPRINT TIMELINE)](#bab-iv-rencana-kerja--jadwal-implementasi-1-week-sprint-timeline)
  - [4.1 Metodologi Pengembangan (Agile Rapid Prototyping)](#41-metodologi-pengembangan-agile-rapid-prototyping)
  - [4.2 Rincian Jadwal Kerja 7 Hari (Hari 1 s.d. Hari 7)](#42-rincian-jadwal-kerja-7-hari-hari-1-sd-hari-7)
  - [4.3 Matriks Deliverables & Milestone Pencapaian](#43-matriks-deliverables--milestone-pencapaian)
- [BAB V: ANALISIS ANGGARAN BIAYA & KEBUTUHAN SUMBER DAYA](#bab-v-analisis-anggaran-biaya--kebutuhan-sumber-daya)
  - [5.1 Estimasi Biaya Infrastruktur (100% Free-Tier Architecture)](#51-estimasi-biaya-infrastruktur-100-free-tier-architecture)
  - [5.2 Sumber Daya Perangkat Keras dan Perangkat Lunak](#52-sumber-daya-perangkat-keras-dan-perangkat-lunak)
- [BAB VI: KESIMPULAN & PENUTUP](#bab-vi-kesimpulan--penutup)
  - [6.1 Kesimpulan](#61-kesimpulan)
  - [6.2 Saran dan Pengembangan Lanjutan](#62-saran-dan-pengembangan-lanjutan)

---

# BAB I: PENDAHULUAN

## 1.1 Latar Belakang Masalah
Dalam era perkuliahan modern, mahasiswa program studi Teknik Informatika menghadapi lonjakan volume informasi dan tuntutan akademik yang sangat dinamis. Setiap semester, mahasiswa mengambil berbagai mata kuliah teknis yang menuntut pengelolaan beragam artefak pembelajaran, antara lain:
1. **Materi Kuliah Multiformat**: Slide perkuliahan dosen (PDF/PPTX), modul praktikum laboratorium, buku teks elektronik (*e-book*), rekaman video asistensi, hingga tautan dokumentasi eksternal.
2. **Beragam Format Tugas Kuliah**: Penugasan yang mencakup Tugas Individu, Tugas Kelompok, Tugas Besar (*Final Project*), Tugas UTS, hingga Tugas UAS, dengan tenggat waktu (*deadline*) yang ketat.
3. **Keterlibatan Dosen dalam Evaluasi Nilai**: Dosen membutuhkan mekanisme penginputan skor penilaian dan evaluasi secara cepat dan praktis tanpa harus melalui birokrasi akun yang rumit.

Realitas di lapangan menunjukkan bahwa artefak perkuliahan tersebut sering kali terserak tanpa struktur yang rapi di berbagai kanal, seperti grup obrolan WhatsApp, Google Drive yang tidak terkelola, folder unduhan komputer lokal, dan portal LMS kampus. Masalah utama yang sering dialami mahasiswa adalah:
- **Disorganisasi Berkas & Penelusuran Lambat**: Mahasiswa menghabiskan waktu terlalu lama untuk menemukan kembali materi perkuliahan menjelang ujian.
- **Risiko Keterlambatan Pengumpulan (*Missed Deadlines*)**: Sulitnya memantau urgensi tugas mingguan menyebabkan penugasan terlewat atau dikerjakan secara terburu-buru.
- **Kekakuan Sistem Asesmen**: Banyak aplikasi manajemen tugas menggunakan kalkulator persentase bobot yang rumit dan pemilihan tingkat prioritas ganda, padahal dalam kenyataan perkuliahan **seluruh tugas wajib dikerjakan dan diprioritaskan tinggi** agar nilai akhir mahasiswa maksimal.
- **Kelelahan Visual (*Visual Fatigue*)**: Antarmuka perangkat lunak produktivitas yang beredar mayoritas bernuansa kaku, terlalu terang, atau monoton, sehingga mengurangi motivasi belajar berjam-jam.

Berdasarkan permasalahan di atas, diperlukan sebuah solusi sistem informasi akademik personal yang terpusat (*Single Source of Truth*), responsif, aman, intuitif, dan mengedepankan nilai estetika yang tinggi. Maka dikembangkanlah sistem **"Yuli's Vault (Yuli's Second Brain)"** dengan tema visual *Warm Chocolate & Elegant Dark Brown* serta dilengkapi portal penilaian khusus dosen tanpa login.

## 1.2 Rumusan Masalah
Rumusan masalah dalam perancangan dan pengembangan sistem ini adalah:
1. Bagaimana merancang arsitektur sistem informasi akademik pribadi yang mampu mengintegrasikan manajemen mata kuliah, repositori materi, pelacakan tugas, pencatatan nilai, dan catatan kuliah dalam satu platform terpadu?
2. Bagaimana membangun fitur pelacakan tugas (*Task & Deadline Tracker*) yang mengadopsi 5 kategori asesmen perkuliahan resmi (Tugas Individu, Kelompok, Tugas Besar, UTS, UAS) dengan eliminasi beban kalkulator bobot rumit dan eliminasi tingkat prioritas yang berlebihan?
3. Bagaimana merancang modul penilaian khusus bagi dosen (*Lecturer Grading Portal*) yang memungkinkan dosen memberikan nilai dan evaluasi secara instan melalui tautan unik tanpa memerlukan autentikasi login yang rumit?
4. Bagaimana mengimplementasikan sistem antarmuka berbasis *Warm Chocolate & Dark Brown Luxury Aesthetics* dengan animasi interaktif glitter dan maskot animasi agar memberikan kenyamanan visual serta pengalaman pengguna yang menyenangkan?
5. Bagaimana menyelesaikan seluruh siklus analisis, desain, implementasi, dan pengujian sistem dalam batas waktu kerja cepat (*rapid sprint*) selama 1 minggu (7 hari kalender)?

## 1.3 Tujuan Pengembangan Sistem
Tujuan yang dicapai dalam proyek perancangan website ini terbagi menjadi tiga dimensi:

### 1.3.1 Tujuan Teknis
- Membangun aplikasi web fullstack berperforma tinggi menggunakan **Next.js 15 (App Router)**, **React 19**, **TypeScript**, dan **Tailwind CSS**.
- Mengimplementasikan basis data relasional lokal yang andal dan mandiri menggunakan **SQLite** melalui abstraksi **Prisma ORM**, didukung oleh *Next.js Server Actions* untuk eksekusi mutasi data yang aman dan reaktif.
- Membangun mesin pengunggahan berkas lokal (*Local Upload Engine*) untuk mengarsipkan materi perkuliahan dan berkas soal tugas secara terstruktur.

### 1.3.2 Tujuan Fungsional
- Menyediakan gerbang masuk yang aman (*Vault Login Gate*) dengan fitur *Quick Access* personal ("Masuk cepat sebagai Yuli Indiyanti").
- Menyediakan modul **Mata Kuliah** dengan pemetaan silabus 16 pertemuan, jadwal kuliah mingguan, dan pemilih tema warna identitas mata kuliah.
- Menyediakan modul **Materi** dengan pratinjau dokumen langsung di peramban (*In-App Previewer*) dan tagging kategori.
- Menyediakan modul **Tugas & Status** dengan papan Kanban drag-and-drop, tampilan tabel terstruktur, detektor urgensi tenggat waktu, dan 5 kategori asesmen resmi.
- Menyediakan **Portal Penilaian Khusus Dosen (Tanpa Login)** melalui rute publik unik `/grade/[id]` untuk input skor nilai (skala 0–100) dan catatan evaluasi dosen yang tersinkronisasi otomatis ke dashboard mahasiswa.
- Menyediakan modul **Rekap Nilai & Analitika IPK** berbasis rata-rata nilai murni (*arithmetic average*) yang menampilkan status riil (*pending evaluation state*) secara dinamis.

### 1.3.3 Tujuan Pengguna
- Mewujudkan *Personal Second Brain* yang efisien bagi mahasiswa (Yuli Indiyanti / TI24D), memangkas waktu temu-kembali materi kuliah hingga di bawah 5 detik, dan memastikan tidak ada tugas yang terlewat (*zero missed deadlines*).

## 1.4 Manfaat Produk

### 1.4.1 Bagi Mahasiswa (Pemilik Vault)
- **Sentralisasi Informasi Akademik**: Semua jadwal, materi kuliah, tugas, nilai, dan catatan kuliah tersimpan rapi dalam satu pintu.
- **Bebas Distraksi & Menenangkan**: Desain bertema cokelat hangat dan kilau lembut *glitter* menciptakan suasana belajar yang nyaman dan tidak melelahkan mata.
- **Fokus Prioritas Jelas**: Tidak dipusingkan dengan pemilihan prioritas atau kalkulasi persentase bobot yang rumit, karena sistem secara otomatis menetapkan setiap tugas pada status prioritas utama.
- **Dokumentasi Belajar Jangka Panjang**: Seluruh materi semester tersimpan terstruktur untuk persiapan Ujian Akhir Semester, magang, dan penyusunan skripsi di masa mendatang.

### 1.4.2 Bagi Dosen Pengampu
- **Kemudahan Input Nilai**: Dosen tidak perlu mendaftar akun atau mengingat kredensial login; cukup membuka tautan penilaian khusus per tugas untuk memasukkan nilai dan ulasan evaluasi.
- **Transparansi Evaluasi**: Nilai dan catatan dosen langsung diterima oleh mahasiswa secara objektif dan instan.

### 1.4.3 Bagi Institusi & Pembelajaran Akademik
- Menjadi bukti nyata keberhasilan implementasi teori mata kuliah Analisis dan Desain Perangkat Lunak (ADPL) dalam menghasilkan produk perangkat lunak berskala produksi (*production-ready*) dalam sprint 1 minggu.

## 1.5 Ruang Lingkup dan Batasan Sistem
Untuk menjamin proyek selesai secara optimal dalam batas waktu 7 hari, ditetapkan batasan sistem sebagai berikut:
1. **Target Pengguna Utama**: Mahasiswa aktif Teknik Informatika atas nama Yuli Indiyanti (NIM: 240511130, Kelas TI24D).
2. **Akses Dosen Pengampu**: Akses dosen dibatasi pada lembar penilaian khusus tugas per tautan publik `/grade/[id]` tanpa kewenangan mengubah struktur mata kuliah atau menghapus data vault.
3. **Penyimpanan Berkas**: Menggunakan penyimpanan berkas lokal server (`public/uploads`) yang mendukung berkas PDF, dokumen Office (DOCX, PPTX, XLSX), arsip ZIP, dan gambar.
4. **Penyimpanan Basis Data**: Menggunakan SQLite lokal terintegrasi (`prisma/dev.db`) dengan mekanisme backup dan ekspor JSON.
5. **Lingkungan Eksekusi**: Aplikasi berbasis web responsif yang kompatibel dengan browser modern (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) pada perangkat desktop, tablet, maupun ponsel cerdas.

---

# BAB II: ANALISIS KEBUTUHAN SISTEM (SYSTEM REQUIREMENTS)

## 2.1 Profil dan Karakteristik Pengguna
Pengguna sistem terdiri dari dua kelompok pengguna dengan hak akses dan karakteristik sebagai berikut:

| Parameter Karakteristik | Pengguna Utama (Mahasiswa) | Pengguna Tamu (Dosen Pengampu) |
| :--- | :--- | :--- |
| **Identitas Pengguna** | Yuli Indiyanti (NIM: 240511130, TI24D) | Dosen Pengampu Mata Kuliah Bersangkutan |
| **Hak Akses (*Role*)** | *Full Owner / Administrator* | *Evaluator / Grader (Task-Scoped)* |
| **Mekanisme Akses** | Autentikasi Vault Login Gate & Quick Access PIN | Akses langsung tautan unik `/grade/[id]` (Tanpa Login) |
| **Tingkat Kemahiran Digital** | Tinggi (*Tech-Savvy*, pengembang perangkat lunak) | Menengah s.d. Tinggi |
| **Perangkat Utama** | Komputer Desktop / Laptop / Smartphone | Laptop / Tablet / Smartphone |
| **Kebutuhan Utama** | Manajemen semester, materi, jadwal, tugas, dan rekap IPK | Pengisian skor (0–100) dan evaluasi tugas mahasiswa |

## 2.2 Kebutuhan Fungsional (Functional Requirements - MoSCoW Framework)
Kebutuhan fungsional dianalisis menggunakan kerangka MoSCoW (*Must-Have, Should-Have, Could-Have, Won't-Have*):

| ID Kebutuhan | Nama Kebutuhan Fungsional | Deskripsi Spesifikasi Fungsional | Kategori MoSCoW |
| :---: | :--- | :--- | :---: |
| **FR-01** | **Vault Authentication & Login Gate** | Pengguna harus melewati gerbang login estetik dengan verifikasi nama pengguna & kata sandi, serta fitur *Quick Access* ("Masuk cepat sebagai Yuli Indiyanti"). | **Must-Have (P0)** |
| **FR-02** | **Manajemen Semester & Filter Global** | Pengguna dapat membuat data semester akademik, menentukan rentang waktu, dan memilih semester aktif untuk memfilter seluruh data tampilan. | **Must-Have (P0)** |
| **FR-03** | **Manajemen Mata Kuliah & Jadwal** | Pengguna dapat menambah, mengedit, dan menghapus mata kuliah (Kode, Nama, SKS, Dosen, Jadwal Mingguan, Ruang, dan Kode Warna). | **Must-Have (P0)** |
| **FR-04** | **Struktur Silabus 16 Pertemuan** | Sistem secara otomatis mengelompokkan materi perkuliahan ke dalam 16 pertemuan mingguan, UTS, dan UAS. | **Should-Have (P1)** |
| **FR-05** | **Multi-File Upload Berkas Materi** | Pengguna dapat mengunggah berkas materi (PDF, DOCX, PPTX, gambar) ke repositori penyimpanan server lokal. | **Must-Have (P0)** |
| **FR-06** | **In-App Document Previewer** | Pengguna dapat membaca langsung dokumen PDF dan materi slide di dalam jendela pratinjau browser tanpa perlu mengunduh file. | **Must-Have (P0)** |
| **FR-07** | **Task & Deadline Tracker (Kanban & Tabel)** | Pengguna dapat memantau penugasan melalui Papan Kanban (Belum Dimulai, Sedang Dikerjakan, Siap Dikumpulkan, Sudah Dikumpulkan) dan Tabel Interaktif. | **Must-Have (P0)** |
| **FR-08** | **5 Kategori Asesmen Perkuliahan Lengkap** | Penugasan diklasifikasikan ke dalam 5 format resmi: Tugas Individu, Tugas Kelompok, Tugas Besar, Tugas UTS, dan Tugas UAS. | **Must-Have (P0)** |
| **FR-09** | **Eliminasi Prioritas Manual & Bobot Rumit** | Sistem menetapkan seluruh tugas pada prioritas utama secara otomatis dan menghitung nilai berdasarkan rata-rata murni tanpa bobot persentase kalkulator yang rumit. | **Must-Have (P0)** |
| **FR-10** | **Detektor Urgensi Waktu Nyata** | Sistem menghitung sisa waktu menuju tenggat dan memberikan badge visual otomatis (< 24 jam / darurat, 1–3 hari, atau aman). | **Must-Have (P0)** |
| **FR-11** | **Portal Penilaian Khusus Dosen (Tanpa Login)** | Dosen pengampu dapat menilai tugas via URL `/grade/[id]`, melihat berkas soal tugas, mengisi skor nilai (0–100), dan menulis catatan evaluasi. | **Must-Have (P0)** |
| **FR-12** | **Sinkronisasi Nilai Real-Time & Confetti** | Nilai yang diisi dosen langsung tersinkronisasi ke database mahasiswa dengan efek selebrasi konfeti pada browser dosen. | **Must-Have (P0)** |
| **FR-13** | **Pelacakan Nilai Realistis (Pending State)** | Kartu metrik beranda dan analitika menampilkan tanda strip `-` (menunggu penilaian) dan persentase kepatuhan kumpul saat belum ada tugas yang dinilai. | **Must-Have (P0)** |
| **FR-14** | **Workspace Catatan Terintegrasi (Split-View)** | Layar terpisah antara dokumen materi kuliah di sisi kiri dan editor catatan Markdown interaktif di sisi kanan. | **Should-Have (P1)** |
| **FR-15** | **Pencarian Cepat & Filter Multi-Kriteria** | Pengguna dapat mencari tugas dan materi secara instan berdasarkan kata kunci, mata kuliah, maupun kategori asesmen. | **Must-Have (P0)** |
| **FR-16** | **Cadangan Data & Ekspor CSV/JSON** | Pengguna dapat mencadangkan seluruh data akademik ke format JSON atau mengekspor rekapitulasi nilai ke format CSV. | **Must-Have (P0)** |

## 2.3 Kebutuhan Non-Fungsional (Non-Functional Requirements)
1. **Performa Sistem (*Performance*)**:
   - Waktu muat awal (*Initial Page Load / First Contentful Paint*) di bawah 1,5 detik.
   - Respon pemfilteran data dan interaksi drag-and-drop Kanban instan di bawah 100 ms berkat arsitektur *client-side reactive state*.
2. **Keandalan & Integritas (*Reliability & Consistency*)**:
   - Setiap mutasi data tersimpan secara persisten ke SQLite melalui transaksi Prisma ORM.
   - Nilai skor yang dimasukkan oleh dosen langsung tersimpan aman ke database tanpa risiko duplikasi data.
3. **Aksesibilitas & Keterbacaan Visual (*Accessibility*)**:
   - Memenuhi standar **WCAG 2.1 Level AA/AAA** dengan rasio kontras teks minimal 7:1 antara warna teks cokelat gelap dan latar belakang krem/kopi lembut.
4. **Keamanan & Privasi (*Security & Privacy*)**:
   - Gerbang autentikasi lokal melindungi area personal mahasiswa dari akses pihak ketiga yang tidak berwenang pada perangkat bersama.
   - Endpoint portal dosen menggunakan URL berbasis ID acak tugas sehingga hanya pihak yang memiliki tautan yang dapat memberikan nilai.

## 2.4 Konsep Identitas Visual & Estetika (Warm Chocolate, Dark Brown & Glitter Sparkles)
Sistem meninggalkan pendekatan visual monoton dan mengadopsi bahasa desain **Luxury Warm Chocolate & Coffee Theme** yang mewah, menenangkan, dan estetik:

```
+-------------------------------------------------------------------------------------------------+
|                           WARM CHOCOLATE & LUXURY COFFEE DESIGN SYSTEM                          |
+---------------------+-------------------------------+-------------------------------------------+
| Nama Token Desain   | Nilai Hexadecimal (Hex)       | Penggunaan Antarmuka                      |
+---------------------+-------------------------------+-------------------------------------------+
| Espresso Dark       | #1E140E / #2A1810             | Latar belakang Dark Mode, Teks Utama      |
| Roasted Mocha       | #3D2517 / #4A2E1B             | Header Card, Sidebar Aktif, Tombol Primer |
| Caramel Bronze      | #8B5A2B / #A06836             | Border Fokus, Aksen Seleksi, Ikon Utama   |
| Warm Cream Coffee   | #F7F2EB / #FFFDFB             | Latar Belakang Halaman & Kartu Light Mode |
| Golden Hazelnut     | #D4A373 / #F3EADF             | Lencana Kategori, Badge, Highlight Teks   |
| Glitter Sparkles    | Animasi CSS Bintang & Partikel| Aksen kerlip lembut bintang interaktif    |
| Animated Avatar     | Ilustrasi Perempuan Berhijab  | Maskot personal hidup di Login & Profil   |
+---------------------+-------------------------------+-------------------------------------------+
```

---

# BAB III: PERANCANGAN ARSITEKTUR & DESAIN PERANGKAT LUNAK

## 3.1 Arsitektur Sistem Fullstack Modern
Sistem dibangun menggunakan pola arsitektur **Next.js Fullstack Monolith** modern yang mengombinasikan *React Server Components (RSC)*, *Client Components*, *Server Actions*, dan *Database Layer* secara efisien:

```
+---------------------------------------------------------------------------------------------+
|                                    LAPISAN KLIEN (CLIENT LAYER)                             |
|  - Next.js 15 App Router Pages: `/` (Home), `/courses`, `/assignments`, `/grade/[id]`       |
|  - UI Engine: Tailwind CSS, Lucide Icons, Canvas-Confetti, Glitter Field, Animated Avatar   |
|  - State Management: VaultContext (Global State & LocalStorage Synchronization)              |
+-----------------------------------------------+---------------------------------------------+
                                                |
                              HTTP / Server Action Invocation
                                                |
+-----------------------------------------------v---------------------------------------------+
|                                    LAPISAN SERVER (NEXT.JS RUNTIME)                         |
|  - Server Actions: `src/actions/vaultActions.ts` (CRUD Courses, Materials, Grades)          |
|  - File Handler: `src/app/api/upload/route.ts` (Local Multipart File Processing)            |
|  - Static Assets & Storage: `public/uploads/`                                               |
+-----------------------------------------------+---------------------------------------------+
                                                |
                                    Prisma ORM Client Query
                                                |
+-----------------------------------------------v---------------------------------------------+
|                                    LAPISAN DATA (DATABASE LAYER)                            |
|  - Database Engine: SQLite (`prisma/dev.db`)                                                |
|  - Tabel Relasional: Semester, Course, Material, Assignment, Submission, NoteComment        |
+---------------------------------------------------------------------------------------------+
```

## 3.2 Diagram Alur Logika Pengguna & Portal Dosen (Core User Flows)

### 3.2.1 Alur Masuk Pengguna (Authentication Gate)
Pengguna membuka website ➔ Sistem memeriksa status login di sesi peramban ➔ Jika belum login, tampilkan layar gerbang masuk (*Login Gate*) ➔ Pengguna memasukkan username & password atau mengklik **"Masuk cepat sebagai Yuli Indiyanti"** ➔ Verifikasi berhasil ➔ Pengguna diarahkan ke Dashboard Vault.

### 3.2.2 Alur Manajemen Tugas & 5 Kategori Asesmen
Pengguna membuka menu **Tugas & Status** ➔ Mengklik **+ Tugas Baru** ➔ Mengisi judul, mata kuliah, deadline, instruksi, mengunggah berkas soal (opsional), dan memilih **Kategori Asesmen** (*Tugas Individu / Tugas Kelompok / Tugas Besar / Tugas UTS / Tugas UAS*) ➔ Tugas tersimpan otomatis dengan prioritas tinggi dan muncul pada kolom *Belum Dimulai* di Papan Kanban.

### 3.2.3 Alur Penilaian Dosen Melalui Tautan Khusus (Tanpa Login)
Mahasiswa membuka modal rincian tugas ➔ Mengklik **"Salin Tautan Penilaian Dosen"** ➔ Mengirimkan tautan `/grade/[id]` kepada dosen pengampu via WhatsApp/Email ➔ Dosen membuka tautan di browser (tanpa perlu mendaftar/login) ➔ Dosen membaca rincian tugas & mengunduh berkas soal ➔ Dosen memasukkan skor angka (0–100) dan umpan balik evaluasi ➔ Dosen menekan tombol **"Simpan Nilai & Berikan Evaluasi"** ➔ Animasi konfeti meriah muncul di layar dosen ➔ Nilai langsung terakumulasi pada database mahasiswa dan memperbarui rekapitulasi IPK secara seketika.

## 3.3 Perancangan Basis Data Relasional (Data Modeling & Prisma Schema)
Struktur entitas basis data dirancang menggunakan Prisma ORM dengan skema berikut:

```prisma
// Entitas Semester Akademik
model Semester {
  id        String   @id @default(cuid())
  name      String
  startDate DateTime
  endDate   DateTime
  isActive  Boolean  @default(false)
  courses   Course[]
  createdAt DateTime @default(now())
}

// Entitas Mata Kuliah
model Course {
  id             String       @id @default(cuid())
  semesterId     String
  semester       Semester     @relation(fields: [semesterId], references: [id], onDelete: Cascade)
  code           String
  name           String
  credits        Int          @default(3)
  lecturerName   String
  scheduleDay    String
  scheduleTime   String
  roomOrLink     String
  pastelColorHex String       @default("#DBEAFE")
  pastelTextHex  String       @default("#1E3A8A")
  materials      Material[]
  assignments    Assignment[]
  createdAt      DateTime     @default(now())
}

// Entitas Berkas Materi Kuliah
model Material {
  id          String   @id @default(cuid())
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  weekNumber  Int      @default(1)
  title       String
  description String?
  category    String   @default("SLIDE") // SLIDE, BOOK, RECORDING, LINK
  fileUrl     String?
  fileName    String?
  fileSize    String?
  mimeType    String?
  externalUrl String?
  tagsJson    String?
  createdAt   DateTime @default(now())
}

// Entitas Penugasan Kuliah
model Assignment {
  id               String       @id @default(cuid())
  courseId         String
  course           Course       @relation(fields: [courseId], references: [id], onDelete: Cascade)
  weekNumber       Int          @default(1)
  title            String
  instructions     String?
  attachmentUrl    String?      // Berkas panduan/soal dari dosen
  attachmentName   String?
  dueDate          DateTime
  priority         String       @default("HIGH") // Seluruh tugas berkategori prioritas utama
  status           String       @default("TODO") // TODO, IN_PROGRESS, READY, SUBMITTED
  type             String       @default("INDIVIDUAL") // INDIVIDUAL, GROUP, PROJECT, MIDTERM, FINAL
  weightPercentage Int          @default(15)
  score            Float?       // Skor nilai murni (0-100) dari dosen
  gradeLetter      String?      // Indeks huruf mutu (A, AB, B, BC, C, D, E)
  lecturerFeedback String?      // Catatan dan evaluasi dari dosen pengampu
  submittedAt      DateTime?
  submissions      Submission[]
  createdAt        DateTime     @default(now())
}

// Entitas Catatan Markdown Perkuliahan
model NoteComment {
  id              String   @id @default(cuid())
  courseId        String?
  materialId      String?
  assignmentId    String?
  contentMarkdown String
  type            String   @default("SUMMARY_NOTE")
  isShared        Boolean  @default(false)
  shareToken      String?  @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## 3.4 Desain Antarmuka Pengguna & Fitur-Fitur Unggulan Sistem
1. **Layar Gerbang Masuk (Vault Login Gate)**:
   - Desain terpusat yang minimalis dan elegan, menampilkan maskot animasi perempuan berhijab, judul resmi *Yuli's Vault*, kolom input kredensial, tombol masuk vault, serta tombol *Quick Access* tanpa hambatan.
2. **Dashboard Utama (Beranda)**:
   - Baris 4 kartu metrik pintar: *Tugas Aktif Minggu Ini*, *Deadline < 48 Jam (Darurat)*, *Total Materi Vault*, dan *Rata-rata Nilai & Progres*.
   - Kartu performa menampilkan status riil strip `-` dan *"Menunggu penilaian dari dosen"* saat belum ada tugas yang dinilai.
   - Widget *Tenggat Waktu & Jadwal Tugas* dengan lencana 5 kategori asesmen resmi.
3. **Papan Kanban & Tabel Tugas (`/assignments`)**:
   - Kolom tahapan: *Belum Dimulai (🕊️)*, *Sedang Dikerjakan (✍️)*, *Siap Dikumpulkan (📦)*, dan *Sudah Dikumpulkan (✅)*.
   - Filter dropdown dinamis berdasarkan mata kuliah dan **Kategori Asesmen**.
4. **Portal Penilaian Khusus Dosen (`/grade/[id]`)**:
   - Menampilkan kartu identitas mahasiswa (*Yuli Indiyanti / 240511130 / TI24D*), nama mata kuliah, minggu pertemuan, rincian instruksi tugas, dan tombol unduh berkas soal.
   - Formulir input skor angka (0–100) interaktif dengan lencana huruf mutu otomatis (*A / B / C*) dan area catatan evaluasi dosen.

---

# BAB IV: RENCANA KERJA & JADWAL IMPLEMENTASI (1-WEEK SPRINT TIMELINE)

## 4.1 Metodologi Pengembangan (Agile Rapid Prototyping)
Pengembangan sistem diselesaikan dalam **1 minggu (7 hari kerja)** menggunakan metodologi *Agile Rapid Prototyping*. Setiap hari berfokus pada penyelesaian modul spesifik yang langsung diuji dan diintegrasikan ke cabang utama repositori Git (*Continuous Integration*).

## 4.2 Rincian Jadwal Kerja 7 Hari (Hari 1 s.d. Hari 7)

```
+---------------------------------------------------------------------------------------------------------+
|                                     JADWAL KERJA SPRINT 1 MINGGU (7 HARI)                               |
+-------+-------------------------------------------------------------+-----------------------------------+
| Hari  | Aktivitas Utama & Fokus Kerja                               | Deliverables / Output             |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-1   | Inisiasi Proyek, Analisis Kebutuhan, Setup Next.js 15,      | - Repositori GitHub terhubung     |
|       | Konfigurasi Prisma ORM, Skema Basis Data SQLite             | - Struktur folder modular         |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-2   | Perancangan Sistem Desain Visual & Layout Utama             | - Palet Luxury Warm Chocolate     |
|       | (Komponen Glitter Sparkles, Animated Avatar, Shell App)     | - Navigasi Sidebar & Navbar       |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-3   | Modul Autentikasi Login Gate & Manajemen Mata Kuliah        | - Gerbang Login & Quick Access    |
|       | (Silabus 16 Pertemuan, Kode Warna Mata Kuliah, Jadwal)      | - CRUD Mata Kuliah Sempurna       |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-4   | Modul Repositori Materi & Mesin Upload Lokal                | - Endpoint Upload `/api/upload`   |
|       | (Multi-File Dropzone, In-App PDF Previewer, Catatan MD)     | - Manajemen Berkas Kuliah         |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-5   | Modul Task & Deadline Tracker (Kanban & Tabel)              | - Papan Kanban Drag-and-Drop      |
|       | (Implementasi 5 Kategori Asesmen, Detektor Urgensi Waktu)   | - Filter Kategori Asesmen         |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-6   | Portal Penilaian Dosen & Rekapitulasi Nilai                 | - Halaman Publik `/grade/[id]`    |
|       | (Input Nilai Dosen Tanpa Login, Selebrasi Confetti, KHS)    | - Kalkulasi Nilai Rata-rata Murni |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-7   | Quality Assurance, Pengujian Bebas Error & Rilis            | - Production Build Exit Code 0    |
|       | (Pembersihan Dummy Data, Uji Responsivitas, Final Proposal) | - Git Push Main Selesai           |
+-------+-------------------------------------------------------------+-----------------------------------+
```

## 4.3 Matriks Deliverables & Milestone Pencapaian

| Milestone | Target Luaran Sistem | Kriteria Keberhasilan | Status Akhir |
| :---: | :--- | :--- | :---: |
| **Milestone 1** | **Fondasi Arsitektur & Database** | Next.js 15 berjalan stabil, skema Prisma SQLite terhubung tanpa kendala migrasi. | ✅ **100% Selesai** |
| **Milestone 2** | **Identitas Visual & Desain Elegan** | Tema Warm Chocolate & Dark Brown aktif dengan animasi glitter dan maskot avatar. | ✅ **100% Selesai** |
| **Milestone 3** | **Gerbang Masuk & Manajemen Kuliah** | Fitur Login Gate & Quick Access berfungsi mengamankan data vault pribadi. | ✅ **100% Selesai** |
| **Milestone 4** | **Repositori Materi & In-App Viewer** | Berkas PDF materi dapat diunggah dan dibaca langsung di browser. | ✅ **100% Selesai** |
| **Milestone 5** | **Manajemen Tugas & 5 Kategori** | Papan Kanban beroperasi mulus dengan kategori Individu, Kelompok, Proyek, UTS, UAS. | ✅ **100% Selesai** |
| **Milestone 6** | **Portal Dosen & Rekap Nilai** | Tautan penilaian dosen tanpa login berhasil menginput skor dan mengevaluasi tugas. | ✅ **100% Selesai** |
| **Milestone 7** | **Produksi & Dokumentasi Akademik** | Kompilasi build lulus 100% tanpa error (`Exit Code 0`) dan proposal lengkap tuntas. | ✅ **100% Selesai** |

---

# BAB V: ANALISIS ANGGARAN BIAYA & KEBUTUHAN SUMBER DAYA

## 5.1 Estimasi Biaya Infrastruktur (100% Free-Tier Architecture)
Salah satu keunggulan perancangan arsitektur sistem ini adalah efisiensi biaya. Sistem dirancang untuk dapat dioperasikan secara penuh tanpa memerlukan biaya operasional rutin (**Rp 0,- / Bulan**):

| Komponen Infrastruktur | Solusi Teknologi yang Digunakan | Kuota Layanan (*Free-Tier Allowance*) | Estimasi Biaya Bulanan |
| :--- | :--- | :--- | :---: |
| **Framework & Logika Sistem** | Next.js 15 App Router (TypeScript) | Open-Source Software (MIT License) | **Rp 0** |
| **Styling & Komponen UI** | Tailwind CSS + Lucide Icons + Canvas-Confetti | Open-Source Software | **Rp 0** |
| **Basis Data Relasional** | SQLite terintegrasi (`prisma/dev.db`) | Lokal / Embedded Server Storage | **Rp 0** |
| **Penyimpanan Berkas (Upload)** | Local Storage Engine (`/public/uploads`) | Memanfaatkan kapasitas disk lokal server | **Rp 0** |
| **Hosting & Web Deployment** | Vercel Free Hobby Tier | 100 GB Bandwidth/Bulan + SSL Otomatis | **Rp 0** |
| **Manajemen Kode & CI/CD** | GitHub Public/Private Repository | Unlimited public repositories & CI builds | **Rp 0** |
| **TOTAL BIAYA OPERASIONAL** | — | — | **Rp 0,- / Bulan** |

## 5.2 Sumber Daya Perangkat Keras dan Perangkat Lunak
Pengembangan dan pengoperasian sistem didukung oleh spesifikasi minimum sebagai berikut:
1. **Perangkat Keras (*Hardware Minimum*)**:
   - Processor: Intel Core i3 / AMD Ryzen 3 atau setara.
   - Memori RAM: Minimal 4 GB (disarankan 8 GB untuk kompilasi Next.js yang cepat).
   - Media Penyimpanan: Ruang disk kosong minimal 1 GB.
2. **Perangkat Lunak (*Software & Tooling*)**:
   - Sistem Operasi: Windows 11 / 10, macOS, atau Linux Ubuntu.
   - Runtime Environment: Node.js versi 18 LTS ke atas (terverifikasi pada Node.js v24).
   - Package Manager: npm versi 10 ke atas.
   - Code Editor: Visual Studio Code / Antigravity IDE.
   - Peramban Web: Google Chrome, Microsoft Edge, atau Mozilla Firefox versi terbaru.

---

# BAB VI: KESIMPULAN & PENUTUP

## 6.1 Kesimpulan
Berdasarkan perancangan, pengembangan, dan pengujian yang telah dilaksanakan, dapat disimpulkan bahwa:
1. Aplikasi web **"Yuli's Vault (Yuli's Second Brain)"** berhasil dirancang dan diimplementasikan secara utuh sebagai sistem informasi akademik personal yang mampu mengatasi masalah disorganisasi materi dan penugasan perkuliahan mahasiswa Teknik Informatika.
2. Sistem berhasil mengadopsi tema visual **Luxury Warm Chocolate & Dark Brown** dengan partikel gerak lembut *Glitter Sparkles* dan maskot animasi perempuan, menghadirkan estetika yang menenangkan dan nyaman di mata pengguna.
3. Seluruh fitur fungsional utama telah berhasil diwujudkan dalam durasi sprint 1 minggu (7 hari kerja), meliputi:
   - **Vault Login Gate**: Sistem gerbang masuk minimalis dengan tombol *Quick Access* ("Masuk cepat sebagai Yuli Indiyanti").
   - **Struktur Tugas Kuliah yang Bersih**: Penerapan 5 kategori asesmen resmi perkuliahan (Tugas Individu, Tugas Kelompok, Tugas Besar, Tugas UTS, Tugas UAS), eliminasi prioritas manual (semua tugas prioritas tinggi), dan eliminasi bobot persentase kalkulator yang rumit.
   - **Portal Penilaian Khusus Dosen (Tanpa Login)**: Akses tautan publik `/grade/[id]` yang memudahkan dosen menginput nilai dan evaluasi tanpa birokrasi login.
   - **Pelacakan Performa Realistis**: Metrik nilai akademik dinamis yang menampilkan status riil (*pending evaluation state*) secara akurat.
   - **Repositori Materi & In-App Document Viewer**: Pratinjau dokumen PDF dan slide langsung di peramban.
4. Hasil pengujian produksi melalui `npm run build` membuktikan bahwa sistem bebas dari kesalahan sintaks maupun *type error* (**Exit Code 0**), serta seluruh kode sumber telah tersinkronisasi di repositori GitHub resmi.

## 6.2 Saran dan Pengembangan Lanjutan
Untuk pengembangan sistem pada rilis mendatang (versi 2.0), disarankan penambahan beberapa fitur berikut:
1. **Notifikasi Pengingat Eksternal**: Integrasi webhook Telegram bot atau WhatsApp API untuk mengirimkan notifikasi pengingat otomatis pada H-1 sebelum deadline tugas.
2. **Sinkronisasi Kalender Digital**: Fitur ekspor jadwal kuliah mingguan dan tenggat waktu tugas ke Google Calendar (.ics).
3. **Penyimpanan Awan (*Cloud Storage*)**: Opsi integrasi dengan Cloudflare R2 atau Supabase Storage apabila kapasitas penyimpanan materi perkuliahan melampaui kuota disk lokal server.

---

**Cirebon, 6 November 2026**  
*Pengusul dan Pengembang Sistem,*

<br><br><br>

**<u>Yuli Indiyanti</u>**  
NIM. 240511130  
Kelas TI24D — Program Studi Teknik Informatika
