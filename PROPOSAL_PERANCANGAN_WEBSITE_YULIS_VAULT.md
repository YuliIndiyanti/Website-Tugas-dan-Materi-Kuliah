# PROPOSAL PERANCANGAN DAN PENGEMBANGAN SISTEM INFORMASI AKADEMIK PRIBADI
# "YULI'S VAULT (YULI'S SECOND BRAIN)"
### *Personal Academic Vault & Assignment Management Web Application Berbasis Next.js dan SQLite*

---

**Diajukan untuk Memenuhi Tugas Proyek Mata Kuliah:**  
**Analisis dan Perancangan Perangkat Lunak (APPL / ADPL)**  
Program Studi Teknik Informatika — Semester Ganjil 2026/2027

---

### **DATA PENGUSUL & IDENTITAS PROYEK**

| Atribut Dokumen | Informasi Rinci |
| :--- | :--- |
| **Nama Pengusul** | **Yuli Indiyanti** |
| **Nomor Induk Mahasiswa (NIM)** | **240511130** |
| **Kelas / Rombel** | **TI24D** |
| **Program Studi** | Teknik Informatika |
| **Mata Kuliah** | Analisis dan Desain Perangkat Lunak |
| **Judul Produk Perangkat Lunak** | **Yuli's Vault (Yuli's Second Brain)** |
| **Tagline Produk** | *Streamline your study workflow. Track tasks and manage materials effortlessly.* |
| **Durasi Waktu Pengerjaan** | **1 Minggu (7 Hari Kalender / Rapid Agile Sprint)** |
| **Tautan Repositori GitHub** | [https://github.com/YuliIndiyanti/Website-Tugas-dan-Materi-Kuliah.git](https://github.com/YuliIndiyanti/Website-Tugas-dan-Materi-Kuliah.git) |
| **Status Implementasi** | **Selesai Diimplementasikan & Teruji (Production Ready)** |

---

## DAFTAR ISI

1. **BAB I: PENDAHULUAN**
   - 1.1 Latar Belakang Masalah
   - 1.2 Rumusan Masalah
   - 1.3 Tujuan Pengembangan Sistem
   - 1.4 Manfaat Produk
   - 1.5 Ruang Lingkup dan Batasan Sistem
2. **BAB II: ANALISIS KEBUTUHAN SISTEM (SYSTEM REQUIREMENTS)**
   - 2.1 Profil dan Karakteristik Pengguna
   - 2.2 Kebutuhan Fungsional (*Functional Requirements - MoSCoW*)
   - 2.3 Kebutuhan Non-Fungsional (*Non-Functional Requirements*)
   - 2.4 Konsep Identitas Visual (*Soft Pastel Design System*)
3. **BAB III: PERANCANGAN ARSITEKTUR & DESAIN PERANGKAT LUNAK**
   - 3.1 Arsitektur Sistem Fullstack Modern
   - 3.2 Diagram Alur Logika Pengguna (*Core User Flows*)
   - 3.3 Perancangan Basis Data Relasional (*Data Modeling & Prisma Schema*)
   - 3.4 Desain Antarmuka Pengguna & Output Implementasi Sistem
4. **BAB IV: RENCANA KERJA & JADWAL IMPLEMENTASI (1-WEEK SPRINT TIMELINE)**
   - 4.1 Metodologi Pengembangan (*Agile Rapid Prototyping*)
   - 4.2 Rincian Jadwal Kerja 7 Hari (Hari 1 s.d. Hari 7)
   - 4.3 Matriks Deliverables & Milestone Pencapaian
5. **BAB V: ANALISIS ANGGARAN BIAYA & KEBUTUHAN SUMBER DAYA**
   - 5.1 Estimasi Biaya Infrastruktur (*100% Free-Tier Architecture*)
   - 5.2 Sumber Daya Perangkat Keras dan Perangkat Lunak
6. **BAB VI: KESIMPULAN & PENUTUP**
   - 6.1 Kesimpulan
   - 6.2 Saran dan Pengembangan Lanjutan

---

# BAB I: PENDAHULUAN

### 1.1 Latar Belakang Masalah
Dalam era perkuliahan modern, mahasiswa Teknik Informatika menghadapi lonjakan volume informasi akademik yang sangat tinggi. Setiap semester terdiri dari berbagai mata kuliah teknis yang menuntut pengelolaan beragam artefak pembelajaran, seperti:
1. **Materi Kuliah Multiformat**: Slide presentasi dosen (PDF/PPTX), e-book panduan, rekaman video/zoom asistensi, modul praktikum laboratorium, repositori kode sumber, hingga tautan dokumentasi eksternal.
2. **Tugas dan Proyek Berkelanjutan**: Penugasan mingguan, kuis, proyek akhir semester dengan kriteria rubrik penilaian dan tenggat waktu yang ketat.
3. **Siklus Pengumpulan Berkas (Submission Cycle)**: Pengerjaan tugas sering kali melalui tahapan draf awal (`v1`), perbaikan/revisi (`v2`), hingga berkas final yang diserahkan ke sistem LMS kampus (`v3`), disertai kebutuhan untuk mengarsipkan bukti penyerahan tugas (screenshot bukti submit).

Kenyataan di lapangan menunjukkan bahwa artefak perkuliahan tersebut sering kali terserak tanpa struktur yang rapi di berbagai kanal, seperti grup percakapan WhatsApp, Google Drive yang tidak terorganisir, folder unduhan lokal komputer, dan portal LMS kampus. Kondisi ini memicu beberapa permasalahan krusial:
- **Disorganisasi Berkas & Waktu Pencarian yang Lambat**: Mahasiswa membutuhkan waktu lama untuk menemukan kembali materi kuliah menjelang Ujian Tengah Semester (UTS) maupun Ujian Akhir Semester (UAS).
- **Risiko Keterlambatan Pengumpulan (*Missed Deadlines*)**: Sulitnya memantau prioritas urgensi tugas harian menyebabkan tugas terlewat atau dikerjakan secara terburu-buru.
- **Kehilangan Riwayat Versi Tugas**: Kesalahan pengiriman berkas yang belum final ke dosen akibat penamaan file yang acak di komputer lokal.
- **Kelelahan Visual (*Visual Fatigue*)**: Mayoritas antarmuka perangkat lunak manajemen tugas memiliki warna yang terlalu kontras atau monoton, membuat mahasiswa cepat lelah saat belajar berjam-jam.

Berdasarkan permasalahan di atas, diperlukan sebuah solusi sistem informasi akademik personal yang terpusat (*Single Source of Truth*), responsif, intuitif, dan mengedepankan kenyamanan visual bagi pengguna. Maka diusulkanlah perancangan dan pengembangan aplikasi web **"Yuli's Vault (Yuli's Second Brain)"**.

### 1.2 Rumusan Masalah
Berdasarkan latar belakang tersebut, rumusan masalah dalam perancangan sistem ini adalah:
1. Bagaimana merancang arsitektur sistem informasi akademik pribadi yang mampu mengintegrasikan manajemen mata kuliah, repositori materi, pelacakan tugas, pencatatan nilai, dan catatan kuliah dalam satu platform terpusat?
2. Bagaimana membangun fitur pelacakan tugas (*Task & Deadline Tracker*) dengan indikator urgensi dinamis berbasis waktu dan sistem kontrol versi berkas pengumpulan (*versioning submission*)?
3. Bagaimana mengimplementasikan sistem penataan visual berbasis *Soft Pastel Design System* yang estetik, menenangkan, namun tetap memenuhi standar aksesibilitas keterbacaan (WCAG AA/AAA)?
4. Bagaimana menyelesaikan seluruh siklus analisis, perancangan, implementasi, dan pengujian sistem dalam batas waktu kerja cepat selama 1 minggu (7 hari)?

### 1.3 Tujuan Pengembangan Sistem
Tujuan yang ingin dicapai dalam proyek perancangan website ini meliputi:
1. **Tujuan Teknis**:
   - Membangun aplikasi web fullstack berbasis **Next.js 15 (App Router)**, **React 19**, **TypeScript**, dan **Tailwind CSS**.
   - Mengimplementasikan basis data relasional lokal yang cepat dan andal menggunakan **SQLite** melalui abstraksi **Prisma ORM**, didukung oleh *Next.js Server Actions* untuk manipulasi data yang aman tanpa *REST overhead*.
   - Menyediakan mesin pengunggahan berkas lokal (*Local Upload Engine*) untuk menangani materi kuliah dan berkas soal tugas secara aman.
2. **Tujuan Fungsional**:
   - Menghasilkan modul **Mata Kuliah** dengan pemetaan silabus 16 pertemuan dan pemilih tema warna pastel (*course color-coding*).
   - Menghasilkan modul **Materi** yang dilengkapi fitur *multi-file upload*, kategorisasi tag, dan pratinjau dokumen langsung di peramban (*in-app previewer*).
   - Menghasilkan modul **Task & Deadline Tracker** dengan tampilan papan Kanban dan tabel interaktif, sistem modal edit lengkap (mengubah tenggat waktu, instruksi, bobot, kategori, lampiran), serta riwayat versi jawaban (`v1` s.d. `v3`).
   - Menyediakan modul **Rekap Nilai & IPK** untuk memonitor capaian akademik dan estimasi indeks nilai semester berjalan.
3. **Tujuan Pengguna**:
   - Mewujudkan *Personal Second Brain* bagi mahasiswa (Yuli Indiyanti / TI24D) guna meningkatkan kedisiplinan belajar, mempercepat temu-balik materi hingga di bawah 5 detik, dan memastikan nihil tugas yang terlewat (*zero missed deadlines*).

### 1.4 Manfaat Produk
- **Bagi Mahasiswa (Pemilik Vault)**:
  - Meningkatkan produktivitas dan fokus belajar berkat antarmuka yang bersih dan bebas distraksi.
  - Menghilangkan stres akibat lupa deadline dengan adanya indikator visual urgensi tugas (*countdown badge* < 24 jam dan < 3 hari).
  - Memberikan dokumentasi belajar jangka panjang yang rapi untuk portofolio dan referensi skripsi di masa mendatang.
- **Bagi Institusi & Praktik Akademik**:
  - Menjadi studi kasus nyata penerapan disiplin ilmu Analisis dan Perancangan Perangkat Lunak (APPL) dalam membangun produk perangkat lunak bernilai guna tinggi secara mandiri dalam sprint 1 minggu.

### 1.5 Ruang Lingkup dan Batasan Sistem
Agar pengembangan perangkat lunak terarah dan selesai tepat waktu dalam durasi 1 minggu, ditetapkan ruang lingkup dan batasan sebagai berikut:
1. **Target Pengguna**: Sistem dirancang untuk penggunaan pribadi (*Single-User Academic Vault*) oleh Yuli Indiyanti (NIM: 240511130, Kelas: TI24D).
2. **Platform Eksekusi**: Aplikasi web responsif (*Web Application*) yang dapat diakses secara optimal melalui komputer desktop, laptop, tablet, maupun ponsel cerdas.
3. **Manajemen Berkas**: Sistem mendukung pengunggahan berkas lokal (PDF, DOCX, PPTX, XLSX, ZIP, Gambar) ke dalam direktori server lokal dengan ukuran file yang wajar untuk kebutuhan perkuliahan.
4. **Penyimpanan Data**: Menggunakan basis data relasional SQLite lokal terintegrasi yang mudah dibackup dan diekspor ke format JSON.
5. **Lingkungan Pengembangan & Rilis**: Kode sumber dikelola menggunakan Git dan di-push ke repositori GitHub publik/privat, siap di-hosting pada platform Vercel.

---

# BAB II: ANALISIS KEBUTUHAN SISTEM (SYSTEM REQUIREMENTS)

### 2.1 Profil dan Karakteristik Pengguna
Sistem diperuntukkan bagi mahasiswa aktif program studi Teknik Informatika dengan profil sebagai berikut:

| Parameter Pengguna | Deskripsi Karakteristik |
| :--- | :--- |
| **Identitas Pengguna** | Yuli Indiyanti (NIM: 240511130 / Kelas: TI24D) |
| **Tingkat Kemahiran Digital** | Tinggi (*Tech-Savvy*, terbiasa menggunakan shortcut keyboard, browser devtools, dan format berkas teknis) |
| **Pola Penggunaan Sistem** | - **Sesi Kerja Panjang (Desktop/Laptop)**: Mengunggah berkas slide, menyusun draf tugas, mengetik catatan markdown saat jam kuliah/mengerjakan proyek.<br>- **Sesi Akses Cepat (Mobile/Tablet)**: Mengecek jadwal kuliah harian, memeriksa deadline tugas terdekat, dan membaca materi ringkas. |
| **Kebutuhan Emosional UI/UX** | Menginginkan antarmuka yang tenang, estetis, tidak menyilaukan mata, responsif, dan memberikan umpan balik interaksi yang memuaskan (*tactile feedback* & mikro-interaksi). |

### 2.2 Kebutuhan Fungsional (*Functional Requirements - MoSCoW Framework*)
Kebutuhan fungsional diklasifikasikan menggunakan metode MoSCoW:
- **P0 (Must-Have)**: Kebutuhan absolut yang wajib diselesaikan dalam sprint 1 minggu.
- **P1 (Should-Have)**: Kebutuhan penting yang melengkapi efisiensi dan kenyamanan belajar.
- **P2 (Nice-to-Have)**: Fitur pelengkap analitik dan kenyamanan visual tingkat lanjut.

| ID Kebutuhan | Nama Kebutuhan Fungsional | Deskripsi Spesifikasi Sistem | Prioritas |
| :---: | :--- | :--- | :---: |
| **FR-01** | **Manajemen Semester Aktif** | Pengguna dapat membuat data semester akademik, menentukan rentang tanggal, dan menetapkan semester aktif sebagai filter global dashboard. | 🌷 **P0** |
| **FR-02** | **Manajemen Mata Kuliah & Tema Pastel** | Pengguna dapat menambah, mengubah, dan menghapus mata kuliah (Kode MK, Nama MK, SKS, Dosen, Jadwal Kuliah, Ruangan/Link, serta Tema Warna Pastel). | 🌷 **P0** |
| **FR-03** | **Struktur Silabus 16 Pertemuan** | Sistem secara otomatis memetakan materi dan tugas ke dalam pertemuan perkuliahan kronologis (Minggu 1 s.d. 16, UTS, dan UAS). | 🍑 **P1** |
| **FR-04** | **Multi-File Upload Berkas Materi** | Pengguna dapat mengunggah berkas materi (PDF, dokumen, gambar) dengan proses pengunggahan cepat ke penyimpanan lokal server. | 🌷 **P0** |
| **FR-05** | **Kategorisasi & Tagging Materi** | Setiap materi dapat diklasifikasikan ke dalam kategori (*Slide*, *E-Book*, *Rekaman*, *Tautan Luar*) dan dilengkapi tag warna-warni (*#bahan-uts*, dll.). | 🌷 **P0** |
| **FR-06** | **In-App Document Previewer** | Pengguna dapat langsung membuka dan membaca dokumen PDF atau gambar di dalam aplikasi web tanpa perlu mengunduh ulang. | 🌷 **P0** |
| **FR-07** | **Pencarian Cepat & Filter Global** | Fitur pencarian instan (*real-time search*) dan filter berdasarkan mata kuliah, kategori materi, atau prioritas tugas. | 🌷 **P0** |
| **FR-08** | **Pencatatan Tugas & Deadline** | Pengguna dapat mencatat tugas kuliah baru lengkap dengan tanggal/jam tenggat waktu, deskripsi, bobot %, tingkat prioritas, dan file soal lampiran. | 🌷 **P0** |
| **FR-09** | **Papan Kanban & Tampilan Tabel Tugas** | Sistem menyediakan dua mode visualisasi tugas: Papan Kanban 4 kolom status (*Belum Dimulai, Sedang Dikerjakan, Siap Dikumpulkan, Selesai*) dan Tabel Terstruktur. | 🌷 **P0** |
| **FR-10** | **Detektor Urgensi Waktu Nyata** | Sistem secara cerdas menghitung sisa waktu menuju deadline dan memberikan badge visual otomatis (*🌷 Sisa < 24 Jam / Terlambat*, *🍑 Sisa 1-3 Hari*, *🕊️ Santai*). | 🌷 **P0** |
| **FR-11** | **Modal Edit Lengkap Rincian Tugas** | Pengguna dapat mengedit kembali seluruh atribut tugas: judul, tenggat waktu (*datetime-local*), instruksi pengerjaan, bobot %, prioritas, kategori asesmen, serta mengganti/menghapus berkas soal lampiran. | 🌷 **P0** |
| **FR-12** | **Siklus Pengumpulan & Versioning Berkas** | Sistem mengarsipkan tahapan berkas pengerjaan tugas (`v1` draf, `v2` revisi, `v3` final), waktu pengumpulan, tautan bukti kumpul, dan file size. | 🌷 **P0** |
| **FR-13** | **Pencatatan Nilai & Evaluasi Dosen** | Pengguna dapat menginputkan skor nilai (skala 0-100) dan huruf mutu (A s.d. E) beserta feedback evaluasi dari dosen pengampu. | 🍑 **P1** |
| **FR-14** | **Workspace Catatan Terintegrasi (Split-View)** | Layar terpisah antara dokumen materi kuliah di sisi kiri dan editor catatan Markdown interaktif di sisi kanan. | 🍑 **P1** |
| **FR-15** | **Thread Diskusi & Log Aktivitas** | Setiap tugas dan materi memiliki kolom komentar berstempel waktu (*timestamp*) untuk mencatat pertanyaan, progres berpikir, atau log pengerjaan. | 🍑 **P1** |
| **FR-16** | **Kalkulator IPK & Rekapitulasi Akademik** | Sistem menghitung bobot nilai berjalan per mata kuliah dan mengkalkulasi estimasi Indeks Prestasi Kumulatif (IPK) semester. | ☁️ **P2** |
| **FR-17** | **Tautan Berbagi Publik (Read-Only Share)** | Pengguna dapat membuat token tautan publik untuk membagikan materi atau catatan tertentu kepada rekan mahasiswa lain. | ☁️ **P2** |
| **FR-18** | **Cadangan Data & Ekspor JSON** | Pengguna dapat mencadangkan seluruh data akademik dalam satu berkas JSON untuk keamanan data jangka panjang. | 🌷 **P0** |

### 2.3 Kebutuhan Non-Fungsional (*Non-Functional Requirements*)
1. **Performa Sistem**:
   - Waktu muat awal halaman (*First Contentful Paint*) di bawah 1,5 detik pada koneksi internet standar.
   - Waktu respons pemfilteran dan pencarian materi/tugas secara instan di bawah 100 milidetik berkat pemrosesan *client-side reactive state*.
2. **Keandalan & Integritas Data**:
   - Seluruh mutasi data (tambah, ubah, hapus tugas dan materi) tersimpan persisten ke dalam SQLite melalui *Prisma Transactional Engine*.
   - Dukungan *optimistic UI updates* sehingga antarmuka merespons seketika saat pengguna memindahkan kartu Kanban atau mengubah status tugas.
3. **Aksesibilitas & Keterbacaan Visual**:
   - Memenuhi standar **WCAG 2.1 Level AA/AAA** untuk rasio kontras teks terhadap latar belakang (rasio kontras minimal 7:1) dengan memadukan warna latar *Soft Pastel* lembut dan warna teks bernuansa *Deep Slate / Deep Forest / Deep Navy*.
4. **Portabilitas & Responsivitas Antarmuka**:
   - Sistem dirancang menggunakan pendekatan *Mobile-First & Fluid Desktop Grid*, memastikan tata letak beradaptasi sempurna pada resolusi layar ponsel (360px) hingga monitor layar lebar (1920px).

### 2.4 Konsep Identitas Visual (*Soft Pastel Design System*)
Aplikasi web ini menggunakan tema visual **Soft Pastel** yang tenang, modern, dan dirancang khusus untuk mengurangi ketegangan visual saat belajar larut malam:

```
+---------------------------------------------------------------------------------------+
|                              SOFT PASTEL DESIGN TOKENS                                |
+---------------------------------------------------------------------------------------+
|  Brand Lavender   | #E0E7FF (Latar) / #3730A3 (Teks) | Tombol Utama, Header, Tab Aktif|
|  Sakura Blush     | #FCE7F3 (Latar) / #9D174D (Teks) | Aksen UTS/UAS, Search Highlight|
|  Mint Sage        | #D1FAE5 (Latar) / #065F46 (Teks) | Tugas Selesai, Aksi Simpan Sukses|
|  Apricot Peach    | #FEF3C7 (Latar) / #92400E (Teks) | Warning Deadline H-1 s.d. H-3  |
|  Rose Coral       | #FFE4E6 (Latar) / #9F1239 (Teks) | Urgensi Darurat (< 24 Jam/Late)|
|  Warm Cream       | #FDFBF7 (Page)  / #FFFFFF (Card) | Background Halaman & Kartu     |
+---------------------------------------------------------------------------------------+
```

---

# BAB III: PERANCANGAN ARSITEKTUR & DESAIN PERANGKAT LUNAK

### 3.1 Arsitektur Sistem Fullstack Modern
Sistem dibangun dengan arsitektur monolitik modern berbasis **Next.js App Router** yang menggabungkan kemampuan *React Server Components (RSC)*, *Client Components*, *Server Actions*, dan *Direct File Handling* dalam satu kesatuan kode yang kohesif:

```
+-----------------------------------------------------------------------------+
|                            LAPISAN KLIEN (BROWSER)                          |
|  - Next.js 15 Client Pages (Dashboard, Courses, Assignments, Materials)    |
|  - Tailwind CSS + Lucide React + Sonner Notification + Canvas-Confetti      |
|  - VaultContext (Global State & Optimistic UI Manager)                      |
+--------------------------------------+--------------------------------------+
                                       |
                   HTTP POST / Server Action Invocation
                                       |
+--------------------------------------v--------------------------------------+
|                           LAPISAN SERVER (NEXT.JS)                          |
|  - Next.js Server Actions (`src/actions/vaultActions.ts`)                   |
|  - Next.js Route Handler (`src/app/api/upload/route.ts`)                    |
|  - Local File Storage Engine (`public/uploads/...`)                         |
+--------------------------------------+--------------------------------------+
                                       |
                            Prisma Client Queries
                                       |
+--------------------------------------v--------------------------------------+
|                           LAPISAN BASIS DATA (SQLITE)                       |
|  - SQLite Database Engine (`prisma/dev.db`)                                 |
|  - Skema Relasional: Semesters, Courses, Materials, Assignments,            |
|    Submissions, NotesComments                                               |
+-----------------------------------------------------------------------------+
```

### 3.2 Diagram Alur Logika Pengguna (*Core User Flows*)
Terdapat 4 alur kerja utama yang telah diimplementasikan dalam sistem:
1. **Alur Manajemen Perkuliahan**:
   Pengguna membuka menu **Mata Kuliah** ➔ Menambah mata kuliah baru (Kode MK, Nama, SKS, Dosen, Jadwal) ➔ Memilih tema warna Soft Pastel ➔ Sistem merender halaman mata kuliah dengan 16 pertemuan silabus.
2. **Alur Penyimpanan & Penelusuran Materi**:
   Pengguna membuka menu **Materi** ➔ Menyeret berkas dokumen ke *dropzone upload* ➔ Sistem memproses berkas melalui endpoint `/api/upload` dan menyimpan URL berkas ➔ Pengguna dapat membuka dokumen di *In-App Split-View Previewer* sambil membuat catatan Markdown.
3. **Alur Pengelolaan & Pengeditan Tugas**:
   Pengguna membuka menu **Tugas & Status** (*Task & Deadline Tracker*) ➔ Menambah tugas baru lengkap dengan deadline dan lampiran berkas soal ➔ Kartu tugas otomatis masuk ke kolom *Belum Dimulai* dengan indikator urgensi waktu ➔ Pengguna dapat mengklik tombol **Edit Rincian Tugas (✏️)** untuk memperbarui deadline, deskripsi, bobot, atau mengganti berkas soal ➔ Pengguna mengunggah berkas jawaban (`v1`, `v2`, `v3`) ➔ Mengubah status menjadi *Sudah Dikumpulkan* (memicu selebrasi konfeti).
4. **Alur Evaluasi & Pencatatan Nilai**:
   Setelah tugas dinilai oleh dosen, pengguna membuka modal tugas ➔ Memasukkan nilai angka (0-100) dan umpan balik dosen ➔ Sistem memperbarui rekapitulasi nilai dan kartu metrik pada halaman analitika.

### 3.3 Perancangan Basis Data Relasional (*Data Modeling & Prisma Schema*)
Struktur data dirancang dalam format relasional untuk menjamin integritas referensial antar entitas akademik. Skema Prisma mencakup:

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
  tagsJson    String?  // Serialized array of string tags
  createdAt   DateTime @default(now())
}

// Entitas Tugas dan Asesmen
model Assignment {
  id               String       @id @default(cuid())
  courseId         String
  course           Course       @relation(fields: [courseId], references: [id], onDelete: Cascade)
  weekNumber       Int          @default(1)
  title            String
  instructions     String?
  attachmentUrl    String?      // Lampiran berkas soal dari dosen
  attachmentName   String?
  dueDate          DateTime
  priority         String       @default("MEDIUM") // LOW, MEDIUM, HIGH
  status           String       @default("TODO")   // TODO, IN_PROGRESS, READY, SUBMITTED
  type             String       @default("TASK")   // TASK, PROJECT, QUIZ, MIDTERM, FINAL
  weightPercentage Int          @default(10)
  score            Float?
  gradeLetter      String?
  lecturerFeedback String?
  submittedAt      DateTime?
  submissions      Submission[]
  createdAt        DateTime     @default(now())
}

// Entitas Riwayat Versi Pengumpulan Berkas Jawaban Tugas
model Submission {
  id             String     @id @default(cuid())
  assignmentId   String
  assignment     Assignment @relation(fields: [assignmentId], references: [id], onDelete: Cascade)
  versionNumber  Int        @default(1)
  fileName       String
  fileUrl        String
  fileSize       String
  proofUrl       String?    // Bukti kumpul tangkapan layar LMS
  submissionLink String?
  notes          String?
  uploadedAt     DateTime   @default(now())
}

// Entitas Catatan Markdown & Log Diskusi
model NoteComment {
  id              String   @id @default(cuid())
  courseId        String?
  materialId      String?
  assignmentId    String?
  contentMarkdown String
  type            String   @default("COMMENT_LOG") // SUMMARY_NOTE, COMMENT_LOG
  isShared        Boolean  @default(false)
  shareToken      String?  @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### 3.4 Desain Antarmuka Pengguna & Output Implementasi Sistem
Sistem yang telah dibangun memiliki tampilan yang konsisten dan elegan:
1. **Header & Identitas Vault**:
   - Menampilkan identitas personal: **Yuli's Vault**, judul utama **Yuli's Second Brain**, dan subjudul *"Streamline your study workflow. Track tasks and manage materials effortlessly."*
   - Menampilkan lencana profil resmi: **Yuli Indiyanti | NIM: 240511130 | KELAS: TI24D**.
2. **Navigasi Sidebar**:
   - Menu tertata rapi: **Dashboard**, **Mata Kuliah**, **Tugas & Status**, **Materi**, **Rekap Nilai & IPK**, serta **Pengaturan & Backup**.
3. **Halaman Tugas & Status (*Task & Deadline Tracker*)**:
   - Dilengkapi *toggle switcher* antara tampilan Kanban dan Tabel.
   - Modal interaktif yang mendukung mode baca dan mode edit menyeluruh (mengubah judul, tanggal/jam deadline, instruksi pengerjaan, prioritas tinggi/sedang/rendah, bobot %, serta pengunggahan lampiran berkas soal).
4. **Halaman Materi**:
   - Menampilkan repositori kartu berkas dengan indikator format file (PDF, DOCX, ZIP), filter tag pastel, tombol pembersihan materi bawaan (*clean seed data*), dan modal pratinjau dokumen.

---

# BAB IV: RENCANA KERJA & JADWAL IMPLEMENTASI (1-WEEK SPRINT TIMELINE)

### 4.1 Metodologi Pengembangan (*Agile Rapid Prototyping*)
Proyek dilaksanakan menggunakan metode **Agile Rapid Prototyping** dengan durasi sprint terpadat selama **1 minggu (7 hari kerja)**. Pendekatan ini dipilih karena memungkinkan perancangan, koding modular, pengujian harian, dan integrasi berkelanjutan dapat berjalan secara beriringan (*fast feedback loop*).

### 4.2 Rincian Jadwal Kerja 7 Hari

```
+---------------------------------------------------------------------------------------------------------+
|                                     JADWAL KERJA SPRINT 1 MINGGU (7 HARI)                               |
+-------+-------------------------------------------------------------+-----------------------------------+
| Hari  | Aktivitas Utama & Fokus Kerja                               | Deliverables / Output             |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-1   | Analisis Kebutuhan, Penyusunan PRD, Inisialisasi Proyek     | - Dokumen PRD v1.2               |
|       | Next.js 15, Setup Tailwind CSS, Skema Prisma & SQLite       | - Repository GitHub siap pakai   |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-2   | Perancangan Sistem Desain Visual & Layout Utama             | - Token Warna Soft Pastel        |
|       | (Sidebar, Navbar, Responsive Shell, Dark/Light Mode)        | - Komponen Layout Global          |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-3   | Modul Manajemen Semester & Mata Kuliah                      | - CRUD Mata Kuliah & Semester     |
|       | (Pemilih Warna Pastel MK, Jadwal Mingguan, Silabus 16 Mgg)  | - Detail Halaman MK & Accordion   |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-4   | Modul Repositori Materi & Mesin Upload                      | - Upload Engine `/api/upload`     |
|       | (Multi-File Dropzone, In-App PDF Previewer, Catatan MD)     | - Fitur Clean Seed & Share Link   |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-5   | Modul Task & Deadline Tracker                               | - Papan Kanban & Tampilan Tabel   |
|       | (Detektor Urgensi Waktu, Versioning v1-v3, Bukti LMS)       | - Filter Multi-Kriteria Tugas     |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-6   | Fitur Edit Lengkap Tugas, Analitika Nilai, & Ekspor Data    | - Modal Edit Tugas (✏️ Lengkap)   |
|       | (Kalkulator IPK, Umpan Balik Dosen, Backup Database JSON)   | - Rebranding Identitas Pengusul   |
+-------+-------------------------------------------------------------+-----------------------------------+
| H-7   | Testing Menyeluruh, Optimasi Build, Dokumentasi, & Rilis    | - Production Build Exit Code 0    |
|       | (Linting, End-to-End Test, Penyusunan Proposal Proyek)      | - Git Push Main & Laporan Akhir   |
+-------+-------------------------------------------------------------+-----------------------------------+
```

### 4.3 Matriks Deliverables & Milestone Pencapaian

| Hari ke- | Milestone Kerja | Target Pencapaian | Status Akhir |
| :---: | :--- | :--- | :---: |
| **Hari 1** | **Fondasi Arsitektur Proyek** | Repository GitHub terhubung, Next.js 15 terpasang, basis data SQLite terinisialisasi melalui Prisma ORM. | ✅ **Tuntas** |
| **Hari 2** | **Desain Sistem & Navigasi** | Sidebar dengan menu resmi, sistem palet *Soft Pastel* aktif di mode terang dan gelap. | ✅ **Tuntas** |
| **Hari 3** | **Modul Akademik & Mata Kuliah** | Data mata kuliah dapat ditambah dengan warna pastel custom dan terhubung ke jadwal kuliah. | ✅ **Tuntas** |
| **Hari 4** | **Repositori Materi & File Upload** | Berkas kuliah dapat diunggah secara lokal, dipratinjau langsung, dan dihubungkan ke catatan Markdown. | ✅ **Tuntas** |
| **Hari 5** | **Pelacakan Tugas & Alur Kerja** | Kanban dan tabel tugas berjalan dinamis, indikator deadline merah/kuning/hijau berfungsi akurat. | ✅ **Tuntas** |
| **Hari 6** | **Penyempurnaan Fitur Edit & Nilai** | Fitur edit rincian tugas (judul, deadline, instruksi, bobot, lampiran) selesai dan persisten ke SQLite. | ✅ **Tuntas** |
| **Hari 7** | **Quality Assurance & Deployment** | Pengujian bebas error (`npm run build` sukses), sinkronisasi GitHub `main`, dan pembuatan proposal resmi. | ✅ **Tuntas** |

---

# BAB V: ANALISIS ANGGARAN BIAYA & KEBUTUHAN SUMBER DAYA

### 5.1 Estimasi Biaya Infrastruktur (*100% Free-Tier Architecture*)
Salah satu keunggulan utama dari perancangan arsitektur sistem ini adalah efisiensi biaya. Sistem dirancang untuk dapat dioperasikan secara penuh tanpa mengeluarkan biaya operasional langganan bulanan (**Rp 0 / Bulan**):

| Komponen Infrastruktur | Solusi Teknologi yang Digunakan | Kuota Gratis (*Free-Tier Allowance*) | Estimasi Biaya Bulanan |
| :--- | :--- | :--- | :---: |
| **Framework & Logika Sistem** | Next.js 15 App Router (TypeScript) | Open-Source Software | **Rp 0** |
| **Styling & Komponen UI** | Tailwind CSS + Lucide Icons + Radix UI | Open-Source Software | **Rp 0** |
| **Basis Data Relasional** | SQLite terintegrasi (`prisma/dev.db`) | Lokal / Embedded Server Storage | **Rp 0** |
| **Hosting & Web Deployment** | Vercel Hobby Plan | 100 GB Bandwidth/Bulan + SSL Otomatis | **Rp 0** |
| **Penyimpanan Berkas (Upload)** | Local Storage Engine (`/public/uploads`) | Mengikuti sisa kapasitas disk lokal server | **Rp 0** |
| **Manajemen Kode & CI/CD** | GitHub Public/Private Repository | Unlimited public repositories & actions | **Rp 0** |
| **TOTAL BIAYA OPERASIONAL** | — | — | **Rp 0,- / Bulan** |

### 5.2 Sumber Daya Perangkat Keras dan Perangkat Lunak
Pengembangan dan pengoperasian sistem didukung oleh spesifikasi sumber daya minimum sebagai berikut:
1. **Perangkat Keras (*Hardware Minimum*)**:
   - Processor: Intel Core i3 / AMD Ryzen 3 (atau setara).
   - RAM: Minimal 4 GB (disarankan 8 GB untuk kenyamanan kompilasi Next.js).
   - Penyimpanan: Ruang kosong disk minimal 1 GB untuk lingkungan runtime dan berkas unggahan.
2. **Perangkat Lunak (*Software & Tooling*)**:
   - Sistem Operasi: Windows 11 / 10, macOS, atau Linux Ubuntu.
   - Runtime Environment: Node.js versi 18 LTS ke atas (proyek diverifikasi pada Node v24).
   - Package Manager: npm versi 10 ke atas.
   - Text Editor / IDE: Antigravity IDE / Visual Studio Code.
   - Peramban Web: Google Chrome, Microsoft Edge, atau Mozilla Firefox versi terbaru.

---

# BAB VI: KESIMPULAN & PENUTUP

### 6.1 Kesimpulan
Berdasarkan perancangan dan implementasi yang telah dilaksanakan, dapat disimpulkan bahwa:
1. Aplikasi web **"Yuli's Vault (Yuli's Second Brain)"** berhasil dirancang dan dikembangkan sebagai solusi terpadu untuk mengatasi masalah disorganisasi materi dan tugas perkuliahan mahasiswa Teknik Informatika.
2. Sistem berhasil menerapkan pendekatan *Soft Pastel Design System* yang menghadirkan pengalaman visual menenangkan, modern, dan tetap memenuhi standar kontras tinggi WCAG AA/AAA.
3. Seluruh fitur utama yang ditargetkan dalam PRD telah berhasil diwujudkan dalam durasi sprint 1 minggu (7 hari kerja), meliputi:
   - Dashboard analitik dengan indikator urgensi deadline waktu nyata.
   - Manajemen mata kuliah dengan silabus 16 pertemuan dan tema warna pastel.
   - Repositori materi kuliah dengan multi-file upload dan pratinjau dokumen.
   - Modul *Task & Deadline Tracker* dengan mode papan Kanban dan tabel, riwayat pengumpulan berkas (`v1` s.d. `v3`), serta fitur penyuntingan rincian tugas secara penuh.
   - Integrasi basis data relasional SQLite dan Prisma ORM dengan arsitektur bebas biaya (Rp 0/bulan).
4. Hasil pengujian produksi melalui `npm run build` menunjukkan bahwa sistem bebas dari kesalahan sintaks dan *type error*, serta seluruh kode telah tersinkronisasi dengan aman di repositori GitHub resmi.

### 6.2 Saran dan Pengembangan Lanjutan
Untuk pengembangan pada versi berikutnya (versi 2.0), disarankan beberapa penambahan fitur:
1. **Integrasi Notifikasi Eksternal**: Menghubungkan webhook bot Telegram pribadi atau WhatsApp API untuk mengirimkan notifikasi pengingat otomatis pada H-1 sebelum deadline tugas.
2. **Sinkronisasi Kalender**: Menyediakan fitur ekspor jadwal kuliah dan deadline tugas ke Google Calendar (.ics).
3. **Penyimpanan Berkas Cloud**: Menghubungkan modul unggah ke Cloudflare R2 atau Supabase Storage jika pengguna ingin mengakses berkas berukuran gigabyte dari berbagai komputer tanpa membebani penyimpanan lokal.

---

**Cirebon, 25 Oktober 2026**  
*Pengusul dan Pengembang Sistem,*

<br><br>

**<u>Yuli Indiyanti</u>**  
NIM. 240511130  
Kelas TI24D — Program Studi Teknik Informatika
