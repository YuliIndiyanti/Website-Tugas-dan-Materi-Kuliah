const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  UnderlineType,
} = require("docx");

function createCell(text, options = {}) {
  const {
    isHeader = false,
    width = undefined,
    bgColor = isHeader ? "F1F5F9" : undefined,
    bold = isHeader,
    color = isHeader ? "0F172A" : "334155",
    align = AlignmentType.LEFT,
    size = 20, // 10pt
  } = options;

  return new TableCell({
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: bgColor ? { fill: bgColor } : undefined,
    margins: {
      top: 140, // ~7pt
      bottom: 140,
      left: 180, // ~9pt
      right: 180,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
    },
    children: [
      new Paragraph({
        alignment: align,
        spacing: { before: 0, after: 0, line: 260 },
        children: [
          new TextRun({
            text,
            bold,
            size,
            color,
            font: "Calibri",
          }),
        ],
      }),
    ],
  });
}

function createParagraph(text, options = {}) {
  const {
    bold = false,
    italic = false,
    size = 22, // 11pt
    color = "334155",
    align = AlignmentType.JUSTIFY,
    spaceBefore = 0,
    spaceAfter = 140,
    line = 276, // 1.15 line spacing
  } = options;

  return new Paragraph({
    alignment: align,
    spacing: { before: spaceBefore, after: spaceAfter, line },
    children: [
      new TextRun({
        text,
        bold,
        italic,
        size,
        color,
        font: "Calibri",
      }),
    ],
  });
}

function createBullet(text, options = {}) {
  const { boldPrefix = "", spaceAfter = 80 } = options;

  const children = [];
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix + " ",
        bold: true,
        size: 22,
        color: "1E293B",
        font: "Calibri",
      })
    );
  }
  children.push(
    new TextRun({
      text,
      size: 22,
      color: "334155",
      font: "Calibri",
    })
  );

  return new Paragraph({
    bullet: { level: 0 },
    alignment: AlignmentType.JUSTIFY,
    spacing: { before: 0, after: spaceAfter, line: 260 },
    children,
  });
}

function createChapterHeading(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    border: {
      bottom: {
        color: "3730A3",
        space: 6,
        style: BorderStyle.SINGLE,
        size: 16,
      },
    },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 28, // 14pt
        color: "1E293B",
        font: "Calibri",
      }),
    ],
  });
}

function createSubchapterHeading(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 24, // 12pt
        color: "1E293B",
        font: "Calibri",
      }),
    ],
  });
}

async function generateDocx() {
  const doc = new Document({
    creator: "Yuli Indiyanti (NIM: 240511130)",
    title: "Proposal Perancangan Website - Yuli's Vault (Yuli's Second Brain)",
    description: "Proposal Perancangan Sistem Informasi Akademik Pribadi untuk Tugas Analisis dan Desain Perangkat Lunak",
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22,
            color: "334155",
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 dxa
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: "Proposal Perancangan Perangkat Lunak | Yuli's Vault",
                    size: 18,
                    italic: true,
                    color: "94A3B8",
                    font: "Calibri",
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "Halaman ",
                    size: 18,
                    color: "94A3B8",
                    font: "Calibri",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: "94A3B8",
                    font: "Calibri",
                  }),
                  new TextRun({
                    text: " dari ",
                    size: 18,
                    color: "94A3B8",
                    font: "Calibri",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: "94A3B8",
                    font: "Calibri",
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // HEADER COVER
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 140 },
            children: [
              new TextRun({
                text: "PROPOSAL PERANCANGAN SISTEM INFORMASI AKADEMIK",
                size: 20,
                bold: true,
                color: "64748B",
                font: "Calibri",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 120 },
            children: [
              new TextRun({
                text: 'PROPOSAL PERANCANGAN DAN PENGEMBANGAN SISTEM INFORMASI AKADEMIK PRIBADI\n"YULI\'S VAULT (YULI\'S SECOND BRAIN)"',
                bold: true,
                size: 32, // 16pt
                color: "1E293B",
                font: "Calibri",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 80 },
            children: [
              new TextRun({
                text: "Personal Academic Vault & Assignment Management Web Application Berbasis Next.js dan SQLite",
                bold: true,
                size: 24, // 12pt
                color: "3730A3",
                font: "Calibri",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 240 },
            children: [
              new TextRun({
                text: '"Streamline your study workflow. Track tasks and manage materials effortlessly."',
                italic: true,
                size: 20,
                color: "64748B",
                font: "Calibri",
              }),
            ],
          }),

          // METADATA TABLE
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  createCell("Mata Kuliah", { bold: true, width: 2800, bgColor: "F8FAFC" }),
                  createCell("Analisis dan Perancangan Perangkat Lunak (APPL / ADPL)", { width: 6560, bold: true, color: "0F172A" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Nama Pengusul", { bold: true, width: 2800, bgColor: "F8FAFC" }),
                  createCell("Yuli Indiyanti", { width: 6560, bold: true, color: "0F172A" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Nomor Induk Mahasiswa (NIM)", { bold: true, width: 2800, bgColor: "F8FAFC" }),
                  createCell("240511130", { width: 6560, bold: true, color: "0F172A" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Kelas / Program Studi", { bold: true, width: 2800, bgColor: "F8FAFC" }),
                  createCell("TI24D / Teknik Informatika", { width: 6560, bold: true, color: "0F172A" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Durasi Waktu Pengerjaan", { bold: true, width: 2800, bgColor: "F8FAFC" }),
                  createCell("1 Minggu (7 Hari Kalender / Agile Sprint)", { width: 6560, bold: true, color: "065F46", bgColor: "D1FAE5" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Tautan Repositori GitHub", { bold: true, width: 2800, bgColor: "F8FAFC" }),
                  createCell("https://github.com/YuliIndiyanti/Website-Tugas-dan-Materi-Kuliah.git", { width: 6560, color: "3730A3" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Status Implementasi", { bold: true, width: 2800, bgColor: "F8FAFC" }),
                  createCell("Selesai Diimplementasikan, Teruji, dan Siap Produksi (Production Ready)", { width: 6560, bold: true, color: "065F46" }),
                ],
              }),
            ],
          }),

          // RINGKASAN EKSEKUTIF CALLOUT BOX
          new Paragraph({ spacing: { before: 200, after: 60 } }),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "FDFBF7" },
                    margins: { top: 160, bottom: 160, left: 240, right: 240 },
                    borders: {
                      left: { style: BorderStyle.SINGLE, size: 24, color: "3730A3" },
                      top: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
                      right: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
                      bottom: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
                    },
                    children: [
                      new Paragraph({
                        spacing: { before: 0, after: 60, line: 260 },
                        children: [
                          new TextRun({
                            text: "RINGKASAN EKSEKUTIF",
                            bold: true,
                            size: 22,
                            color: "3730A3",
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.JUSTIFY,
                        spacing: { before: 0, after: 0, line: 260 },
                        children: [
                          new TextRun({
                            text: "Proposal ini menguraikan perancangan dan implementasi aplikasi web akademik pribadi \"Yuli's Vault (Yuli's Second Brain)\". Dibangun menggunakan Next.js 15, Prisma ORM, dan SQLite dengan pendekatan Soft Pastel Design System yang estetik dan ergonomis, sistem berhasil diselesaikan dalam rentang sprint 1 minggu (7 hari kerja). Sistem mengintegrasikan manajemen mata kuliah, repositori materi kuliah, pelacak tugas (Task & Deadline Tracker) dengan fitur edit lengkap dan versioning submission (v1-v3), serta rekapitulasi nilai dengan arsitektur 100% bebas biaya operasional (Rp 0/bulan).",
                            size: 20,
                            color: "334155",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // BAB I: PENDAHULUAN
          createChapterHeading("BAB I: PENDAHULUAN"),
          createSubchapterHeading("1.1 Latar Belakang Masalah"),
          createParagraph(
            "Dalam era perkuliahan modern, mahasiswa Teknik Informatika menghadapi lonjakan volume informasi akademik yang sangat tinggi. Setiap semester terdiri dari berbagai mata kuliah teknis yang menuntut pengelolaan beragam artefak pembelajaran, seperti: slide presentasi dosen (PDF/PPTX), e-book acuan, modul praktikum, rekaman video perkuliahan, kode sumber pemrograman, hingga penugasan mingguan dan proyek besar."
          ),
          createParagraph(
            "Kenyataan di lapangan menunjukkan bahwa artefak perkuliahan tersebut sering kali terserak tanpa struktur yang rapi di berbagai kanal seperti grup percakapan WhatsApp, Google Drive yang bercampur baur, folder unduhan lokal komputer, dan portal LMS kampus. Kondisi ini memicu permasalahan nyata:"
          ),
          createBullet(
            "Mahasiswa menghabiskan waktu rata-rata 10-15 menit hanya untuk mencari kembali materi kuliah saat menjelang Ujian Tengah Semester (UTS) atau Ujian Akhir Semester (UAS).",
            { boldPrefix: "• Disorganisasi Berkas & Waktu Pencarian Lambat:" }
          ),
          createBullet(
            "Tidak adanya sistem peringatan dini yang adaptif membuat prioritas tugas harian tidak terpantau secara jelas, berisiko menyebabkan tugas terlambat atau terlewat.",
            { boldPrefix: "• Risiko Keterlambatan Pengumpulan (Missed Deadlines):" }
          ),
          createBullet(
            "Sering terjadi kesalahan pengunggahan draf mentah yang belum direvisi ke portal dosen akibat penamaan berkas di komputer lokal yang tidak tertata rapi.",
            { boldPrefix: "• Ketidakteraturan Riwayat Versi Tugas:" }
          ),
          createBullet(
            "Mayoritas antarmuka perangkat lunak manajemen tugas konvensional memiliki warna yang terlalu kontras atau monoton, menimbulkan kejenuhan visual saat digunakan belajar berjam-jam.",
            { boldPrefix: "• Kelelahan Visual (Visual Fatigue):" }
          ),
          createParagraph(
            "Berdasarkan permasalahan di atas, diperlukan sebuah solusi sistem informasi akademik personal yang terpusat (Single Source of Truth), responsif, intuitif, dan mengedepankan kenyamanan visual bagi pengguna. Maka diusulkanlah perancangan dan pengembangan aplikasi web \"Yuli's Vault (Yuli's Second Brain)\"."
          ),

          createSubchapterHeading("1.2 Rumusan Masalah"),
          createParagraph("Berdasarkan latar belakang tersebut, rumusan masalah dalam perancangan sistem ini adalah:"),
          createBullet("Bagaimana merancang arsitektur sistem informasi akademik personal yang mampu mengonsolidasikan repositori materi, pelacak tugas, catatan Markdown, dan rekapitulasi nilai dalam satu platform terpusat?"),
          createBullet("Bagaimana mengimplementasikan pelacakan tugas (Task & Deadline Tracker) dengan indikator urgensi waktu nyata dan kontrol versi berkas pengumpulan (v1, v2, v3)?"),
          createBullet("Bagaimana menerapkan estetika Soft Pastel Design System yang memenuhi kriteria aksesibilitas kontras tinggi (WCAG AA/AAA)?"),
          createBullet("Bagaimana menyelesaikan seluruh siklus analisis, perancangan, implementasi, dan pengujian sistem dalam batas waktu 1 minggu (7 hari)?"),

          createSubchapterHeading("1.3 Tujuan Pengembangan Sistem"),
          createBullet("Membangun aplikasi web fullstack berbasis Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, serta basis data relasional SQLite melalui Prisma ORM dengan arsitektur zero-cost (Rp 0/bulan).", { boldPrefix: "1. Tujuan Teknis:" }),
          createBullet("Menghasilkan 6 modul utama: Dashboard Ringkasan, Manajemen Mata Kuliah & Silabus 16 Pertemuan, Repositori Materi & Multi-File Upload, Task & Deadline Tracker (Kanban & Tabel dengan fitur Edit Rincian Lengkap), Rekap Nilai & IPK, serta Pengaturan & Backup JSON.", { boldPrefix: "2. Tujuan Fungsional:" }),
          createBullet("Menyediakan Personal Second Brain bagi mahasiswa (Yuli Indiyanti / TI24D) untuk mengefisiensikan waktu pencarian materi hingga < 5 detik dan memastikan 0 tugas terlewat sepanjang semester.", { boldPrefix: "3. Tujuan Pengguna:" }),

          createSubchapterHeading("1.4 Manfaat Produk"),
          createBullet("Menyederhanakan alur kerja studi harian, menekan stres akademis, dan mengarsipkan dokumen kuliah secara berkelanjutan.", { boldPrefix: "• Bagi Mahasiswa (Pemilik Vault):" }),
          createBullet("Memenuhi standar implementasi nyata mata kuliah Analisis dan Perancangan Perangkat Lunak (APPL) dengan kualitas kode produksi (production-grade).", { boldPrefix: "• Bagi Praktik Akademik:" }),

          createSubchapterHeading("1.5 Ruang Lingkup dan Batasan Sistem"),
          createBullet("Dikhususkan untuk kebutuhan personal mahasiswa (Yuli Indiyanti / TI24D).", { boldPrefix: "• Pengguna Tunggal (Single-User):" }),
          createBullet("Pengunggahan berkas lokal terpusat (PDF, DOCX, ZIP, Gambar) melalui endpoint /api/upload.", { boldPrefix: "• Penyimpanan Berkas:" }),
          createBullet("Menggunakan basis data relasional SQLite lokal persisten yang mudah dicadangkan ke format JSON.", { boldPrefix: "• Basis Data:" }),
          createBullet("Tepat 1 minggu (7 hari kerja) mulai dari analisis kebutuhan hingga peluncuran produksi.", { boldPrefix: "• Waktu Pengerjaan:" }),

          // BAB II: ANALISIS KEBUTUHAN SISTEM
          createChapterHeading("BAB II: ANALISIS KEBUTUHAN SISTEM (SYSTEM REQUIREMENTS)"),
          createSubchapterHeading("2.1 Profil dan Karakteristik Pengguna"),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  createCell("Kategori Parameter", { isHeader: true, width: 2800 }),
                  createCell("Deskripsi Karakteristik Pengguna", { isHeader: true, width: 6560 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Pengguna Utama", { bold: true }),
                  createCell("Yuli Indiyanti (NIM: 240511130 | Kelas: TI24D | Teknik Informatika)"),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Tingkat Kemahiran Digital", { bold: true }),
                  createCell("Tinggi (Tech-Savvy, terbiasa dengan shortcut keyboard, browser tools, dan berkas teknis)"),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Pola Penggunaan Sistem", { bold: true }),
                  createCell("Sesi Kerja Desktop (unggah materi, buat draf tugas, tulis catatan) dan Sesi Akses Mobile (cek jadwal & status deadline)"),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Kebutuhan Kritis", { bold: true }),
                  createCell("Upload berkas instan, pembagian silabus per minggu, indikator visual deadline, dan kontrol versi draf"),
                ],
              }),
            ],
          }),

          createSubchapterHeading("2.2 Kebutuhan Fungsional (MoSCoW Framework)"),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  createCell("ID", { isHeader: true, width: 1000 }),
                  createCell("Modul / Fitur", { isHeader: true, width: 2800 }),
                  createCell("Deskripsi Spesifikasi Kebutuhan", { isHeader: true, width: 4360 }),
                  createCell("Prioritas", { isHeader: true, width: 1200 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("FR-01", { bold: true }),
                  createCell("Manajemen Semester", { bold: true }),
                  createCell("Pembuatan data semester aktif sebagai acuan filter global seluruh aplikasi"),
                  createCell("P0 (Must)", { bold: true, color: "9F1239", bgColor: "FFE4E6" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("FR-02", { bold: true }),
                  createCell("Manajemen Mata Kuliah", { bold: true }),
                  createCell("Pencatatan Kode MK, Nama MK, SKS, Dosen, Jadwal, dan Course Pastel Color Theme"),
                  createCell("P0 (Must)", { bold: true, color: "9F1239", bgColor: "FFE4E6" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("FR-03", { bold: true }),
                  createCell("Silabus 16 Pertemuan", { bold: true }),
                  createCell("Struktur folder hirarkis berdasarkan minggu perkuliahan (Minggu 1 s.d. 16, UTS, UAS)"),
                  createCell("P1 (Should)", { bold: true, color: "92400E", bgColor: "FEF3C7" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("FR-04", { bold: true }),
                  createCell("Multi-File Upload Materi", { bold: true }),
                  createCell("Pengunggahan berkas materi (PDF, DOCX, ZIP, PPTX) ke direktori lokal server secara cepat"),
                  createCell("P0 (Must)", { bold: true, color: "9F1239", bgColor: "FFE4E6" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("FR-05", { bold: true }),
                  createCell("In-App Document Previewer", { bold: true }),
                  createCell("Pratinjau langsung file PDF dan gambar di dalam aplikasi web tanpa perlu mengunduh file"),
                  createCell("P0 (Must)", { bold: true, color: "9F1239", bgColor: "FFE4E6" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("FR-06", { bold: true }),
                  createCell("Task & Deadline Tracker", { bold: true }),
                  createCell("Pelacakan tugas dalam tampilan Papan Kanban (4 status) dan Tabel dengan detektor sisa waktu"),
                  createCell("P0 (Must)", { bold: true, color: "9F1239", bgColor: "FFE4E6" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("FR-07", { bold: true }),
                  createCell("Modal Edit Lengkap Tugas", { bold: true }),
                  createCell("Penyuntingan judul, deadline (datetime-local), instruksi, bobot %, prioritas, dan lampiran soal"),
                  createCell("P0 (Must)", { bold: true, color: "9F1239", bgColor: "FFE4E6" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("FR-08", { bold: true }),
                  createCell("Versioning Berkas Jawaban", { bold: true }),
                  createCell("Pengarsipan versi berkas tugas (v1 - Draf, v2 - Revisi, v3 - Final) beserta bukti kumpul LMS"),
                  createCell("P0 (Must)", { bold: true, color: "9F1239", bgColor: "FFE4E6" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("FR-09", { bold: true }),
                  createCell("Pencatatan Nilai & IPK", { bold: true }),
                  createCell("Perekaman skor nilai angka/huruf, feedback dosen, serta kalkulasi IPK berjalan semester"),
                  createCell("P1 (Should)", { bold: true, color: "92400E", bgColor: "FEF3C7" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("FR-10", { bold: true }),
                  createCell("Workspace Catatan Split-View", { bold: true }),
                  createCell("Layar terpisah antara dokumen materi perkuliahan dan editor catatan Markdown interaktif"),
                  createCell("P1 (Should)", { bold: true, color: "92400E", bgColor: "FEF3C7" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("FR-11", { bold: true }),
                  createCell("Pencadangan & Ekspor JSON", { bold: true }),
                  createCell("Pencadangan seluruh basis data perkuliahan ke dalam berkas JSON mandiri"),
                  createCell("P0 (Must)", { bold: true, color: "9F1239", bgColor: "FFE4E6" }),
                ],
              }),
            ],
          }),

          createSubchapterHeading("2.3 Identitas Visual & Soft Pastel Design System"),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  createCell("Token Pastel", { isHeader: true, width: 2200 }),
                  createCell("Kode Hex (Latar / Teks)", { isHeader: true, width: 3000 }),
                  createCell("Penerapan pada Antarmuka", { isHeader: true, width: 4160 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Primary Lavender", { bold: true, bgColor: "E0E7FF", color: "3730A3" }),
                  createCell("#E0E7FF (Latar) / #3730A3 (Teks)"),
                  createCell("Tombol aksi utama, tab aktif, dan sorotan navigasi sidebar"),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Mint Sage", { bold: true, bgColor: "D1FAE5", color: "065F46" }),
                  createCell("#D1FAE5 (Latar) / #065F46 (Teks)"),
                  createCell("Tugas selesai (Submitted), nilai mutu A/AB, indikator sukses simpan"),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Apricot Peach", { bold: true, bgColor: "FEF3C7", color: "92400E" }),
                  createCell("#FEF3C7 (Latar) / #92400E (Teks)"),
                  createCell("Peringatan deadline sedang (tersisa 1 s.d. 3 hari), tugas in-progress"),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Rose Coral", { bold: true, bgColor: "FFE4E6", color: "9F1239" }),
                  createCell("#FFE4E6 (Latar) / #9F1239 (Teks)"),
                  createCell("Deadline darurat (< 24 jam), tugas terlambat, prioritas tinggi"),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Warm Cream", { bold: true, bgColor: "FDFBF7", color: "1E293B" }),
                  createCell("#FDFBF7 (Halaman) / #FFFFFF (Kartu)"),
                  createCell("Latar belakang halaman utama agar mata tetap nyaman dan tidak cepat lelah"),
                ],
              }),
            ],
          }),

          // BAB III: PERANCANGAN ARSITEKTUR & DESAIN
          createChapterHeading("BAB III: PERANCANGAN ARSITEKTUR & DESAIN PERANGKAT LUNAK"),
          createSubchapterHeading("3.1 Arsitektur Sistem Fullstack Modern"),
          createParagraph(
            "Sistem dibangun menggunakan arsitektur modern Next.js 15 App Router yang mengintegrasikan lapisan antarmuka (Client Components) dengan lapisan server (Server Actions dan Route Handlers) tanpa perantara REST API konvensional:"
          ),
          createBullet("Next.js 15 Client Pages (Dashboard, Courses, Assignments, Materials), Tailwind CSS, Lucide Icons, Sonner Notification, Canvas-Confetti, dan VaultContext sebagai pengelola state global reaktif.", { boldPrefix: "1. Lapisan Klien (Browser):" }),
          createBullet("Next.js Server Actions (src/actions/vaultActions.ts) untuk eksekusi query mutasi Prisma yang aman, serta endpoint /api/upload untuk pengunggahan berkas lokal.", { boldPrefix: "2. Lapisan Server (Next.js):" }),
          createBullet("SQLite Database terintegrasi (prisma/dev.db) yang diabstraksikan melalui Prisma ORM dengan relasi referensial Cascade Delete.", { boldPrefix: "3. Lapisan Basis Data:" }),

          createSubchapterHeading("3.2 Skema Data Relasional (Data Model)"),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  createCell("Nama Tabel", { isHeader: true, width: 2200 }),
                  createCell("Atribut Utama (Kolom)", { isHeader: true, width: 4500 }),
                  createCell("Relasi & Keterangan", { isHeader: true, width: 2660 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("semesters", { bold: true }),
                  createCell("id, name, startDate, endDate, isActive, createdAt"),
                  createCell("1 : N ke courses"),
                ],
              }),
              new TableRow({
                children: [
                  createCell("courses", { bold: true }),
                  createCell("id, semesterId, code, name, credits, lecturerName, scheduleDay, scheduleTime, roomOrLink, pastelColorHex, pastelTextHex"),
                  createCell("1 : N ke materials & assignments"),
                ],
              }),
              new TableRow({
                children: [
                  createCell("materials", { bold: true }),
                  createCell("id, courseId, weekNumber, title, description, category, fileUrl, fileName, fileSize, mimeType, externalUrl, tagsJson"),
                  createCell("Tersimpan di local storage engine"),
                ],
              }),
              new TableRow({
                children: [
                  createCell("assignments", { bold: true }),
                  createCell("id, courseId, weekNumber, title, instructions, attachmentUrl, attachmentName, dueDate, priority, status, type, weightPercentage, score, gradeLetter"),
                  createCell("1 : N ke submissions"),
                ],
              }),
              new TableRow({
                children: [
                  createCell("submissions", { bold: true }),
                  createCell("id, assignmentId, versionNumber, fileName, fileUrl, fileSize, proofUrl, submissionLink, notes, uploadedAt"),
                  createCell("Riwayat versi v1, v2, v3"),
                ],
              }),
              new TableRow({
                children: [
                  createCell("notes_comments", { bold: true }),
                  createCell("id, courseId, materialId, assignmentId, contentMarkdown, type, isShared, shareToken, createdAt"),
                  createCell("Catatan Markdown & Log Diskusi"),
                ],
              }),
            ],
          }),

          createSubchapterHeading("3.3 Output Implementasi Sistem"),
          createBullet("Header menampilkan nama Yuli's Vault, hero title Yuli's Second Brain, subjudul 'Streamline your study workflow. Track tasks and manage materials effortlessly.', serta badge identitas resmi Yuli Indiyanti NIM 240511130 KELAS TI24D.", { boldPrefix: "• Header & Identitas Vault:" }),
          createBullet("Menu navigasi tertata rapi: Dashboard, Mata Kuliah, Tugas & Status, Materi, Rekap Nilai & IPK, serta Pengaturan & Backup.", { boldPrefix: "• Navigasi Sidebar:" }),
          createBullet("Mode visualisasi ganda (Kanban & Tabel), detektor batas waktu sisa jam/hari, dan modal edit lengkap (mengubah deadline, deskripsi, bobot %, prioritas, kategori asesmen, serta mengganti lampiran soal).", { boldPrefix: "• Task & Deadline Tracker:" }),
          createBullet("Repositori dokumen kuliah dengan upload dropzone, filter format materi, pratinjau PDF/gambar langsung di peramban, serta tombol pembersihan materi contoh (clean seed data).", { boldPrefix: "• Repositori Materi:" }),

          // BAB IV: RENCANA KERJA 1 MINGGU
          createChapterHeading("BAB IV: RENCANA KERJA & JADWAL IMPLEMENTASI (1-WEEK SPRINT TIMELINE)"),
          createSubchapterHeading("4.1 Metodologi Agile Rapid Prototyping"),
          createParagraph(
            "Seluruh siklus rekayasa perangkat lunak dilaksanakan secara terstruktur dan intensif selama 1 minggu (7 hari kerja) dengan pembagian fokus kerja harian sebagai berikut:"
          ),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  createCell("Hari", { isHeader: true, width: 1200 }),
                  createCell("Aktivitas Utama & Fokus Kerja", { isHeader: true, width: 4560 }),
                  createCell("Deliverables / Hasil Kerja Nyata", { isHeader: true, width: 2400 }),
                  createCell("Status", { isHeader: true, width: 1200 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Hari 1", { bold: true }),
                  createCell("Analisis Kebutuhan, Penyusunan PRD, Inisialisasi Proyek Next.js 15, Setup Tailwind CSS, Skema Prisma & SQLite"),
                  createCell("PRD v1.2, Repo GitHub, Basis Data Inisial"),
                  createCell("Tuntas", { bold: true, color: "065F46", bgColor: "D1FAE5" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Hari 2", { bold: true }),
                  createCell("Perancangan Sistem Desain Visual & Layout Utama (Sidebar, Navbar, Responsive Shell, Dark/Light Mode)"),
                  createCell("Pastel Tokens, Layout Global, Sidebar Nav"),
                  createCell("Tuntas", { bold: true, color: "065F46", bgColor: "D1FAE5" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Hari 3", { bold: true }),
                  createCell("Pengembangan Modul Semester & Mata Kuliah (CRUD, SKS, Silabus 16 Pertemuan, Pastel Color Picker)"),
                  createCell("Halaman MK, Card Grid, Silabus Mingguan"),
                  createCell("Tuntas", { bold: true, color: "065F46", bgColor: "D1FAE5" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Hari 4", { bold: true }),
                  createCell("Pembangunan Repositori Materi & Mesin Upload Lokal (In-App PDF Previewer, Catatan Markdown)"),
                  createCell("API Upload, Tagging, Split-View Previewer"),
                  createCell("Tuntas", { bold: true, color: "065F46", bgColor: "D1FAE5" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Hari 5", { bold: true }),
                  createCell("Pengembangan Task & Deadline Tracker (Kanban Board, Tabel, Versioning v1-v3, Bukti LMS)"),
                  createCell("Kanban 4 Status, Urgency Countdowns, Form Kumpul"),
                  createCell("Tuntas", { bold: true, color: "065F46", bgColor: "D1FAE5" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Hari 6", { bold: true }),
                  createCell("Penyempurnaan Fitur Edit Lengkap Tugas, Analitika Nilai, dan Rebranding Identitas Pengusul"),
                  createCell("Modal Edit Tugas (✏️), Kalkulator IPK, Rebranding"),
                  createCell("Tuntas", { bold: true, color: "065F46", bgColor: "D1FAE5" }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Hari 7", { bold: true }),
                  createCell("Testing Menyeluruh, Optimasi Build Produksi, Sinkronisasi GitHub Main, & Penyusunan Proposal"),
                  createCell("Build Exit Code 0, Git Push Main, Proposal Resmi"),
                  createCell("Tuntas", { bold: true, color: "065F46", bgColor: "D1FAE5" }),
                ],
              }),
            ],
          }),

          // BAB V: ANGGARAN BIAYA & SUMBER DAYA
          createChapterHeading("BAB V: ANALISIS ANGGARAN BIAYA & KEBUTUHAN SUMBER DAYA"),
          createSubchapterHeading("5.1 Estimasi Biaya Infrastruktur (100% Free-Tier Architecture)"),
          createParagraph(
            "Salah satu keunggulan utama dari perancangan arsitektur sistem ini adalah efisiensi biaya. Sistem dirancang untuk dapat dioperasikan secara penuh tanpa mengeluarkan biaya operasional langganan bulanan:"
          ),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  createCell("Komponen Infrastruktur", { isHeader: true, width: 2600 }),
                  createCell("Solusi Teknologi Terpilih", { isHeader: true, width: 2800 }),
                  createCell("Kapasitas Bebas Biaya (Free-Tier)", { isHeader: true, width: 2560 }),
                  createCell("Biaya Bulanan", { isHeader: true, width: 1400 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Framework Fullstack"),
                  createCell("Next.js 15 App Router & React 19"),
                  createCell("Open-Source Software (MIT)"),
                  createCell("Rp 0,-", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Styling & Komponen"),
                  createCell("Tailwind CSS & Lucide Icons"),
                  createCell("Open-Source Software"),
                  createCell("Rp 0,-", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Basis Data Relasional"),
                  createCell("SQLite terintegrasi via Prisma ORM"),
                  createCell("Penyimpanan Lokal Persisten"),
                  createCell("Rp 0,-", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Hosting & Deployment"),
                  createCell("Vercel Hobby Plan & GitHub"),
                  createCell("100 GB Bandwidth/Bulan + SSL Otomatis"),
                  createCell("Rp 0,-", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Penyimpanan Berkas"),
                  createCell("Local Storage Engine (/public/uploads)"),
                  createCell("Sisa Kapasitas Harddisk Komputer"),
                  createCell("Rp 0,-", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  createCell("TOTAL BIAYA OPERASIONAL", { bold: true, bgColor: "F1F5F9", width: 7960 }, { colspan: 3 }),
                  createCell("Rp 0,- / Bulan", { bold: true, color: "065F46", bgColor: "D1FAE5", width: 1400 }),
                ],
              }),
            ],
          }),

          createSubchapterHeading("5.2 Sumber Daya Perangkat Keras dan Perangkat Lunak"),
          createBullet("Processor: Intel Core i3 / AMD Ryzen 3 (atau setara), RAM minimal 4 GB (disarankan 8 GB), ruang kosong harddisk minimal 1 GB.", { boldPrefix: "• Perangkat Keras (Hardware):" }),
          createBullet("Sistem Operasi Windows 11/10 / macOS / Linux, Node.js versi 18+ (diverifikasi pada Node v24), npm versi 10+, peramban web modern.", { boldPrefix: "• Perangkat Lunak (Software):" }),

          // BAB VI: KESIMPULAN & PENUTUP
          createChapterHeading("BAB VI: KESIMPULAN & PENUTUP"),
          createSubchapterHeading("6.1 Kesimpulan"),
          createParagraph(
            "Perancangan dan pengembangan aplikasi web \"Yuli's Vault (Yuli's Second Brain)\" telah berhasil diselesaikan secara menyeluruh dalam kurun waktu 1 minggu (7 hari kerja). Sistem mampu menjawab kebutuhan akademik mahasiswa Teknik Informatika dengan menyediakan platform terintegrasi yang andal, ergonomis, dan sangat mudah digunakan."
          ),
          createParagraph(
            "Seluruh kebutuhan fungsional mulai dari manajemen mata kuliah, repositori materi kuliah, pelacakan tugas dengan fitur penyuntingan rincian lengkap, kontrol versi berkas jawaban (v1 s.d. v3), hingga rekapitulasi nilai telah teruji dengan baik dan siap digunakan untuk mendukung kegiatan perkuliahan sehari-hari secara berkelanjutan."
          ),

          createSubchapterHeading("6.2 Saran dan Pengembangan Lanjutan"),
          createBullet("Integrasi bot notifikasi Telegram pribadi atau WhatsApp API untuk pengingat otomatis H-1 sebelum deadline tugas.", { boldPrefix: "1. Notifikasi Eksternal:" }),
          createBullet("Fitur ekspor jadwal kuliah dan deadline tugas ke Google Calendar (.ics).", { boldPrefix: "2. Sinkronisasi Kalender:" }),
          createBullet("Integrasi Cloudflare R2 atau Supabase Storage jika pengguna ingin mengakses berkas berukuran besar dari luar jaringan lokal.", { boldPrefix: "3. Penyimpanan Cloud:" }),

          // LEMBAR TANDA TANGAN
          new Paragraph({ spacing: { before: 400, after: 60 } }),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 5500, type: WidthType.DXA },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [new Paragraph({ text: "" })],
                  }),
                  new TableCell({
                    width: { size: 3860, type: WidthType.DXA },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({
                        spacing: { before: 0, after: 60 },
                        children: [new TextRun({ text: "Cirebon, 25 Oktober 2026", size: 22, color: "334155" })],
                      }),
                      new Paragraph({
                        spacing: { before: 0, after: 600 },
                        children: [new TextRun({ text: "Pengusul & Pengembang Sistem,", bold: true, size: 22, color: "0F172A" })],
                      }),
                      new Paragraph({
                        spacing: { before: 0, after: 40 },
                        children: [
                          new TextRun({
                            text: "YULI INDIYANTI",
                            bold: true,
                            size: 24,
                            underline: { type: UnderlineType.SINGLE },
                            color: "0F172A",
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { before: 0, after: 20 },
                        children: [new TextRun({ text: "NIM. 240511130", size: 20, color: "475569" })],
                      }),
                      new Paragraph({
                        spacing: { before: 0, after: 0 },
                        children: [new TextRun({ text: "Kelas TI24D — Teknik Informatika", size: 20, color: "475569" })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, "..", "PROPOSAL_PERANCANGAN_WEBSITE_YULIS_VAULT.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log("Successfully generated:", outputPath);
}

generateDocx().catch((err) => {
  console.error("Error generating docx:", err);
  process.exit(1);
});
