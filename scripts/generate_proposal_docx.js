const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertInchesToTwip,
} = require("docx");
const fs = require("fs");
const path = require("path");

// Styling constants
const FONT_PRIMARY = "Segoe UI";
const FONT_MONO = "Consolas";
const COLOR_PRIMARY = "3730A3"; // Indigo deep
const COLOR_SECONDARY = "475569"; // Slate 600
const COLOR_TEXT = "1E293B"; // Slate 800
const COLOR_MUTED = "64748B"; // Slate 500
const COLOR_BG_LIGHT = "F8FAFC";
const COLOR_BORDER = "CBD5E1";

// Helpers
function createCoverTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT_PRIMARY,
        size: 38, // 19pt
        bold: true,
        color: COLOR_PRIMARY,
      }),
    ],
  });
}

function createCoverSubtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 360 },
    children: [
      new TextRun({
        text,
        font: FONT_PRIMARY,
        size: 26, // 13pt
        italics: true,
        color: COLOR_SECONDARY,
      }),
    ],
  });
}

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 160 },
    children: [
      new TextRun({
        text,
        font: FONT_PRIMARY,
        size: 30, // 15pt
        bold: true,
        color: COLOR_PRIMARY,
      }),
    ],
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT_PRIMARY,
        size: 24, // 12pt
        bold: true,
        color: "1E293B",
      }),
    ],
  });
}

function createHeading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text,
        font: FONT_PRIMARY,
        size: 22, // 11pt
        bold: true,
        color: "475569",
      }),
    ],
  });
}

function createParagraph(text, options = {}) {
  const { bold = false, italics = false, bullet = false, spaceAfter = 120 } = options;
  return new Paragraph({
    spacing: { after: spaceAfter, line: 280 }, // 1.15 line spacing
    bullet: bullet ? { level: 0 } : undefined,
    children: [
      new TextRun({
        text,
        font: FONT_PRIMARY,
        size: 21, // 10.5pt
        color: COLOR_TEXT,
        bold,
        italics,
      }),
    ],
  });
}

function createCallout(title, text, bgColor = "EEF2FF", borderColor = "818CF8") {
  const borderStyle = {
    style: BorderStyle.SINGLE,
    size: 16,
    color: borderColor,
  };
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: bgColor },
            borders: {
              left: borderStyle,
              top: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
            },
            margins: {
              top: convertInchesToTwip(0.1),
              bottom: convertInchesToTwip(0.1),
              left: convertInchesToTwip(0.15),
              right: convertInchesToTwip(0.15),
            },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: title,
                    font: FONT_PRIMARY,
                    size: 21,
                    bold: true,
                    color: COLOR_PRIMARY,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 60, line: 260 },
                children: [
                  new TextRun({
                    text,
                    font: FONT_PRIMARY,
                    size: 20,
                    color: COLOR_TEXT,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function createCodeBlock(codeText) {
  const borderStyle = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: "CBD5E1",
  };
  const lines = codeText.split("\n");
  const paragraphs = lines.map(
    (line) =>
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({
            text: line,
            font: FONT_MONO,
            size: 17, // 8.5pt
            color: "0F172A",
          }),
        ],
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: "F1F5F9" },
            borders: {
              left: borderStyle,
              top: borderStyle,
              right: borderStyle,
              bottom: borderStyle,
            },
            margins: {
              top: convertInchesToTwip(0.1),
              bottom: convertInchesToTwip(0.1),
              left: convertInchesToTwip(0.12),
              right: convertInchesToTwip(0.12),
            },
            children: paragraphs,
          }),
        ],
      }),
    ],
  });
}

function createStyledTable(headers, rowsData, colWidths = []) {
  const borderThin = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: "E2E8F0",
  };
  const cellBorders = {
    top: borderThin,
    bottom: borderThin,
    left: borderThin,
    right: borderThin,
  };

  const headerCells = headers.map((h, i) => {
    return new TableCell({
      width: colWidths[i]
        ? { size: colWidths[i], type: WidthType.PERCENTAGE }
        : undefined,
      shading: { fill: "312E81" }, // Deep Indigo header
      borders: cellBorders,
      margins: {
        top: convertInchesToTwip(0.08),
        bottom: convertInchesToTwip(0.08),
        left: convertInchesToTwip(0.1),
        right: convertInchesToTwip(0.1),
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: h,
              font: FONT_PRIMARY,
              size: 19,
              bold: true,
              color: "FFFFFF",
            }),
          ],
        }),
      ],
    });
  });

  const tableRows = [new TableRow({ children: headerCells })];

  rowsData.forEach((row, rIdx) => {
    const bgFill = rIdx % 2 === 1 ? "F8FAFC" : "FFFFFF";
    const cells = row.map((val, cIdx) => {
      return new TableCell({
        width: colWidths[cIdx]
          ? { size: colWidths[cIdx], type: WidthType.PERCENTAGE }
          : undefined,
        shading: { fill: bgFill },
        borders: cellBorders,
        margins: {
          top: convertInchesToTwip(0.06),
          bottom: convertInchesToTwip(0.06),
          left: convertInchesToTwip(0.09),
          right: convertInchesToTwip(0.09),
        },
        children: [
          new Paragraph({
            spacing: { after: 30, line: 240 },
            children: [
              new TextRun({
                text: String(val),
                font: FONT_PRIMARY,
                size: 18,
                color: COLOR_TEXT,
              }),
            ],
          }),
        ],
      });
    });
    tableRows.push(new TableRow({ children: cells }));
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows,
  });
}

function generateDocx() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_PRIMARY,
            color: COLOR_TEXT,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "KuliahVault - Proposal Rancang Bangun Perangkat Lunak",
                    font: FONT_PRIMARY,
                    size: 16,
                    color: COLOR_MUTED,
                    italics: true,
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
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Halaman ",
                    font: FONT_PRIMARY,
                    size: 16,
                    color: COLOR_MUTED,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT_PRIMARY,
                    size: 16,
                    color: COLOR_MUTED,
                  }),
                  new TextRun({
                    text: " dari ",
                    font: FONT_PRIMARY,
                    size: 16,
                    color: COLOR_MUTED,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: FONT_PRIMARY,
                    size: 16,
                    color: COLOR_MUTED,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // ==================== COVER PAGE ====================
          new Paragraph({ spacing: { before: 720 } }),
          createCoverTitle(
            "PROPOSAL RANCANG BANGUN PERANGKAT LUNAK\nSISTEM INFORMASI MANAJEMEN MATERI DAN TUGAS AKADEMIK MANDIRI (\"KULIAHVAULT\")"
          ),
          createCoverSubtitle(
            "Implementasi Arsitektur Web Next.js 15, Prisma ORM, dan Sistem Desain Soft Pastel Ergonomis untuk Pengorganisasian Belajar Mahasiswa"
          ),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 360 },
            children: [
              new TextRun({
                text: "Dokumen Analisis dan Desain Perangkat Lunak (ADPL)",
                font: FONT_PRIMARY,
                size: 22,
                bold: true,
                color: "4338CA",
              }),
            ],
          }),

          createCallout(
            "📋 INFORMASI DOKUMEN & PENGUSUL",
            "Mata Kuliah       : Analisis dan Desain Perangkat Lunak (ADPL)\n" +
            "Nama Mahasiswa    : [Nama Mahasiswa]\n" +
            "NIM               : [Nomor Induk Mahasiswa]\n" +
            "Program Studi     : [Teknik Informatika / Sistem Informasi / Rekayasa Perangkat Lunak]\n" +
            "Fakultas          : [Fakultas Ilmu Komputer / Sains & Teknologi]\n" +
            "Perguruan Tinggi  : [Nama Universitas / Institut / Politeknik]\n" +
            "Dosen Pengampu    : [Nama Dosen Pengampu Matakuliah, Gelar]\n" +
            "Tahun Akademik    : 2026/2027\n" +
            "Versi Dokumen     : 1.2 (Soft Pastel Design System Edition)",
            "F8FAFC",
            "3730A3"
          ),

          new Paragraph({ spacing: { before: 400, after: 120 } }),
          new Paragraph({
            children: [new TextRun({ text: "", break: 1 })],
          }),

          // ==================== RINGKASAN EKSEKUTIF ====================
          createHeading1("RINGKASAN EKSEKUTIF"),
          createParagraph(
            "Aktivitas perkuliahan di perguruan tinggi modern menuntut mahasiswa untuk mengelola ratusan berkas materi (slide PDF, modul praktikum, e-book, rekaman perkuliahan) dan puluhan tugas per semester. Namun, pada praktiknya, sumber daya akademik tersebut tersebar di berbagai platform seperti grup obrolan WhatsApp, Google Drive pribadi/dosen, Learning Management System (LMS) kampus yang sering berganti sesi login, serta folder lokal laptop yang tidak terstruktur."
          ),
          createParagraph(
            "Dampaknya, mahasiswa sering mengalami Academic File Fragmentation: kesulitan menemukan materi saat persiapan ujian, kehilangan riwayat draf tugas (tertimpa atau tertukar nama file), terlewatnya tenggat waktu tugas (missed deadlines), serta kelelahan visual (visual fatigue) akibat antarmuka aplikasi akademik konvensional yang kaku dan kontras warnanya terlalu mencolok."
          ),
          createParagraph(
            "KuliahVault hadir sebagai solusi Single Source of Truth (SSOT) akademik mandiri berkinerja tinggi. Aplikasi ini mengintegrasikan repositori materi perkuliahan 16 minggu, papan pelacak tugas interaktif berbasis Kanban dengan riwayat versi pengumpulan (v1, v2, v3), kalkulator simulasi nilai akhir & IPK, editor catatan perkuliahan berbasis Markdown, serta bot notifikasi Telegram pengingat tenggat waktu. Seluruh antarmuka dibangun menggunakan Soft Pastel Design System yang telah terkalibrasi rasio kontrasnya (WCAG AA/AAA) agar mata tidak cepat lelah saat sesi belajar berjam-jam, dengan arsitektur komputasi tanpa biaya bulanan (100% Free-Tier Architecture)."
          ),

          // ==================== BAB I ====================
          createHeading1("BAB I: PENDAHULUAN"),

          createHeading2("1.1 Latar Belakang Masalah"),
          createParagraph(
            "Perkembangan metode pembelajaran campuran (blended learning) di perguruan tinggi memperluas ragam media bahan ajar yang diterima mahasiswa. Dalam satu semester, seorang mahasiswa yang menempuh 20-24 SKS (sekitar 7-8 mata kuliah) rata-rata menerima lebih dari 120 berkas materi dan 35-50 penugasan akademik (tugas individu, proyek kelompok, kuis, UTS, dan UAS)."
          ),
          createParagraph(
            "Berdasarkan analisis observasional terhadap kebiasaan studi mahasiswa teknologi informasi, ditemukan empat permasalahan mendasar dalam alur kerja manajemen studi harian:",
            { bold: true }
          ),
          createParagraph(
            "1. Fragmentasi Berkas Materi Akademik: Berkas materi tersebar di LMS kampus (Moodle/Canvas), grup WhatsApp kelas, Google Drive fakultas, dan tautan repositori luar. Ketika waktu ujian tiba, proses pencarian materi memerlukan waktu lama (retrieval friction) karena ketiadaan pengarsipan kronologis yang terpusat.",
            { bullet: true }
          ),
          createParagraph(
            "2. Ambiguitas Versi Pengumpulan Tugas (Submission Versioning): Mahasiswa sering membuat berkas tugas dengan penamaan tidak konsisten (contoh: Tugas1_Final.pdf, Tugas1_Fix_Banget.pdf). Ketiadaan pencatatan riwayat revisi dan bukti tangkapan layar pengumpulan sering memicu kekeliruan unggah ke sistem evaluasi kampus.",
            { bullet: true }
          ),
          createParagraph(
            "3. Ketiadaan Pengingat Adaptif & Kalkulasi Nilai Mandiri: LMS kampus umumnya hanya menampilkan tenggat waktu statis tanpa adanya notifikasi proaktif ke ponsel pengguna. Mahasiswa juga kesulitan memproyeksikan target nilai minimum UAS yang diperlukan untuk mengamankan indeks kelulusan (A/AB/B).",
            { bullet: true }
          ),
          createParagraph(
            "4. Kejenuhan Visual & Ergonomi Antarmuka Rendah: Antarmuka aplikasi manajemen tugas umum sering menggunakan warna mencolok atau tema gelap pekat yang menyebabkan ketegangan mata (eye strain) saat dipakai membaca materi berjam-jam pada malam hari.",
            { bullet: true }
          ),

          createHeading2("1.2 Rumusan Masalah"),
          createParagraph(
            "Berdasarkan latar belakang tersebut, rumusan masalah dalam proposal rekayasa perangkat lunak ini dirumuskan sebagai berikut:"
          ),
          createParagraph(
            "1. Bagaimana merancang arsitektur perangkat lunak berbasis web yang mampu mengkonsolidasi manajemen materi perkuliahan 16 minggu dan tugas akademik secara terintegrasi?",
            { bullet: true }
          ),
          createParagraph(
            "2. Bagaimana merancang sistem pelacakan tugas dengan dukungan multi-versi pengumpulan (versioned submissions), bukti kumpul, dan pengingat tenggat waktu terotomatisasi?",
            { bullet: true }
          ),
          createParagraph(
            "3. Bagaimana mengimplementasikan sistem desain Soft Pastel yang harmonis dan memenuhi standar aksesibilitas kontras teks WCAG AA/AAA untuk mereduksi kelelahan visual pengguna?",
            { bullet: true }
          ),
          createParagraph(
            "4. Bagaimana merancang struktur database relasional dan infrastruktur penyimpanan berkas yang andal dengan skema pembiayaan operasional Rp 0/bulan (100% Free-Tier)?",
            { bullet: true }
          ),

          createHeading2("1.3 Batasan Masalah"),
          createParagraph(
            "Batasan ruang lingkup pengembangan sistem KuliahVault adalah sebagai berikut:"
          ),
          createParagraph(
            "1. Target Pengguna: Dirancang untuk penggunaan pribadi (Single-User Personal Vault), sehingga hak akses administratif dipegang penuh oleh pemilik tanpa kompleksitas multi-tenancy atau multi-role organisasi.",
            { bullet: true }
          ),
          createParagraph(
            "2. Lingkup Data: Mengelola entitas Semester, Mata Kuliah, Pertemuan (Minggu 1-16), Materi Berkas/Tautan, Tugas & Submission, Nilai Bobot, serta Catatan Markdown.",
            { bullet: true }
          ),
          createParagraph(
            "3. Platform & Aksesibilitas: Berbasis Progressive Web Application (PWA) / Responsive Web yang dapat diakses secara optimal melalui peramban Desktop (Chrome/Firefox/Edge) dan perangkat mobile.",
            { bullet: true }
          ),
          createParagraph(
            "4. Integrasi Eksternal: Pengingat tenggat waktu memanfaatkan Web Push API dan integrasi Telegram Bot API pribadi; penyimpanan berkas mendukung penyimpanan lokal dan integrasi Cloud Object Storage.",
            { bullet: true }
          ),

          createHeading2("1.4 Tujuan Pengembangan"),
          createParagraph(
            "Tujuan dari perancangan dan pembangunan perangkat lunak KuliahVault adalah:"
          ),
          createParagraph(
            "1. Menghasilkan sistem repositori materi perkuliahan terstruktur 1-16 minggu yang dilengkapi pratinjau dokumen langsung di peramban (In-App Document Previewer) dan editor catatan Markdown berdampingan (Split-View).",
            { bullet: true }
          ),
          createParagraph(
            "2. Membangun papan tugas interaktif berbasis Kanban dengan token urgensi pastel otomatis dan sistem pelacakan versi pengumpulan berkas draf hingga final.",
            { bullet: true }
          ),
          createParagraph(
            "3. Mengembangkan modul kalkulasi indeks prestasi dan simulasi nilai target ujian berbasis bobot persentase silabus perkuliahan.",
            { bullet: true }
          ),
          createParagraph(
            "4. Mengimplementasikan antarmuka Soft Pastel Design System dengan 6 palet identitas mata kuliah serta token semantik urgensi tenggat waktu.",
            { bullet: true }
          ),

          createHeading2("1.5 Manfaat Sistem"),
          createParagraph(
            "A. Manfaat Praktis bagi Mahasiswa:\n" +
            "• Efisiensi Waktu Studi: Menghemat waktu pencarian berkas materi dari 10-15 menit menjadi kurang dari 5 detik melalui fitur pencarian global (Ctrl+K).\n" +
            "• Zero Missed Deadlines: Meniadakan risiko keterlambatan pengumpulan tugas berkat indikator visual urgensi dan bot notifikasi Telegram.\n" +
            "• Keamanan Arsip: Seluruh draf tugas dan bukti kumpul tersimpan rapi dan dapat diekspor menjadi arsip JSON/CSV sewaktu-waktu."
          ),
          createParagraph(
            "B. Manfaat Akademis:\n" +
            "• Menjadi acuan studi kasus implementasi Rekayasa Perangkat Lunak modern yang menggabungkan Next.js 15 App Router, Prisma ORM, Server Actions, dan prinsip Human-Computer Interaction (HCI) berbasis Soft Pastel Palette."
          ),

          // ==================== BAB II ====================
          createHeading1("BAB II: TINJAUAN PUSTAKA & ANALISIS KEBUTUHAN"),

          createHeading2("2.1 Landasan Teori & Studi Komparasi"),
          createParagraph(
            "Untuk merancang solusi yang tepat guna, dilakukan evaluasi terhadap kelebihan dan kelemahan sistem pendukung akademik yang umum digunakan mahasiswa saat ini:"
          ),

          createStyledTable(
            [
              "Parameter Evaluasi",
              "LMS Kampus (Moodle)",
              "Google Classroom",
              "Notion / Obsidian",
              "KuliahVault (Diusulkan)",
            ],
            [
              [
                "Fokus Desain",
                "Administrasi Institusi",
                "Distribusi Tugas Kelas",
                "Dokumentasi Catatan Bebas",
                "Personal Academic Vault Terpadu",
              ],
              [
                "Struktur 1-16 Minggu",
                "Kaku tergantung Dosen",
                "Kurang terstruktur",
                "Harus buat manual",
                "Otomatis per Pertemuan & UTS/UAS",
              ],
              [
                "Pelacakan Versi Draf",
                "Tidak ada (Hanya Final)",
                "Tidak ada",
                "Manual lewat halaman",
                "Otomatis (v1 Draft, v2, v3 + Bukti)",
              ],
              [
                "Simulasi Nilai & Target",
                "Tidak ada",
                "Tidak ada",
                "Formula manual rumit",
                "Otomatis terhubung bobot SKS",
              ],
              [
                "Ergonomi Warna",
                "Keras / Default Bootstrap",
                "Standar Google Material",
                "Monokrom Netral",
                "Soft Pastel Eye-Comfort (WCAG AAA)",
              ],
              [
                "Biaya Operasional",
                "Server Kampus",
                "Gratis (Batas Akun)",
                "Freemium",
                "100% Gratis Selamanya (Rp 0)",
              ],
            ],
            [22, 26, 26, 26]
          ),

          createHeading2("2.2 Analisis Karakteristik Pengguna"),
          createParagraph(
            "Pengguna utama sistem adalah mahasiswa aktif yang memiliki mobilitas tinggi dalam menggunakan laptop dan ponsel. Karakteristik perilaku pengguna diuraikan dalam tiga fase operasional:"
          ),
          createParagraph(
            "• Fase Persiapan Awal Semester: Pengguna menginputkan semester aktif, mata kuliah, SKS, dosen pengampu, jadwal kuliah, serta memilih 1 dari 6 tema Soft Pastel sebagai identitas visual mata kuliah.",
            { bullet: true }
          ),
          createParagraph(
            "• Fase Perkuliahan Harian: Pengguna melakukan quick-upload berkas slide dosen melalui area drag-and-drop, menulis rangkuman materi dengan markdown editor di samping dokumen, dan mencatat tugas baru.",
            { bullet: true }
          ),
          createParagraph(
            "• Fase Menjelang Ujian & Deadline: Pengguna memantau kartu tugas di Kanban Board, memfilter materi bertag #bahan-uts, serta melakukan simulasi skor kelulusan.",
            { bullet: true }
          ),

          createHeading2("2.3 Analisis Kebutuhan Fungsional (Functional Requirements)"),
          createParagraph(
            "Kebutuhan fungsional sistem diklasifikasikan menggunakan metode prioritas MoSCoW (Must-Have, Should-Have, Nice-to-Have):"
          ),

          createStyledTable(
            ["Kode FR", "Nama Fitur", "Deskripsi & Kriteria Keberhasilan", "Prioritas"],
            [
              ["FR-01", "Manajemen Semester", "CRUD semester akademik, penetapan semester aktif, dan isolasi data per semester.", "Must-Have (P0)"],
              ["FR-02", "Manajemen Mata Kuliah", "CRUD mata kuliah dengan atribut kode, nama, SKS, dosen, jadwal, ruangan, dan pemilih 6 tema warna pastel.", "Must-Have (P0)"],
              ["FR-03", "Silabus 1-16 Minggu", "Pengelompokan materi & tugas dalam accordion kronologis Minggu 1 s/d 16, penanda khusus UTS (W8) dan UAS (W16).", "Should-Have (P1)"],
              ["FR-04", "Multi-File Dropzone", "Pengunggahan berkas simultan (PDF, DOCX, PPTX, XLSX, ZIP, Gambar, Video) dengan progress bar animasi pastel.", "Must-Have (P0)"],
              ["FR-05", "Kategorisasi & Pastel Tag", "Klasifikasi berkas (Slide, Buku, Rekaman, Tautan) dan tagging berlatar warna pastel (#bahan-uts, #penting).", "Must-Have (P0)"],
              ["FR-06", "Tautan Eksternal", "Penyimpanan bookmark materi luar (Google Docs, YouTube, GitHub) langsung di repositori mata kuliah.", "Should-Have (P1)"],
              ["FR-07", "In-App File Previewer", "Pratinjau langsung berkas PDF, dokumen, audio, video, dan gambar tanpa perlu mengunduh ulang.", "Must-Have (P0)"],
              ["FR-08", "Global Command Palette", "Pencarian instan materi, tugas, dan mata kuliah via modal Ctrl+K / Cmd+K dengan latensi < 300 ms.", "Must-Have (P0)"],
              ["FR-09", "Pencatatan Detail Tugas", "Form tugas komprehensif: judul, instruksi, lampiran soal, tenggat waktu, jenis asesmen, bobot %, dan prioritas.", "Must-Have (P0)"],
              ["FR-10", "Kanban Board Tugas", "Alur status drag-and-drop / klik kolom: Belum Dimulai, Sedang Dikerjakan, Siap Dikumpulkan, dan Sudah Dikumpulkan.", "Must-Have (P0)"],
              ["FR-11", "Arsip Submission & Versi", "Pencatatan riwayat berkas jawaban (v1 Draf, v2 Revisi, v3 Final) disertai tautan kumpul LMS dan bukti screenshot.", "Must-Have (P0)"],
              ["FR-12", "Pengingat Deadline", "Notifikasi otomatis berbasis ambang waktu pastel (<24 jam, 1-3 hari) dan integrasi Telegram Bot API pribadi.", "Should-Have (P1)"],
              ["FR-13", "Pencatatan Nilai Tugas", "Input skor 0-100 dengan konversi otomatis ke huruf (A, AB, B, BC, C, D, E) dan badge berlatar pastel.", "Should-Have (P1)"],
              ["FR-14", "Dokumentasi Evaluasi Dosen", "Catatan masukan, komentar revisi, dan koreksi dosen pada setiap tugas yang telah dinilai.", "Should-Have (P1)"],
              ["FR-15", "Kalkulator Target Nilai", "Simulasi skor minimal UAS untuk mencapai indeks nilai sasaran berdasarkan bobot komponen perkuliahan.", "Nice-to-Have (P2)"],
              ["FR-16", "Integrated Markdown Editor", "Editor catatan perkuliahan Markdown dengan dukungan callout pastel [!NOTE], [!TIP], [!WARNING] berdampingan dengan PDF.", "Should-Have (P1)"],
              ["FR-17", "Log Diskusi / Komentar", "Thread catatan berurutan waktu (timestamped log) untuk mencatat pemikiran atau pertanyaan diskusi.", "Should-Have (P1)"],
              ["FR-18", "Tautan Bagikan Cepat", "Generasi token tautan baca-saja (read-only link /shared/[token]) untuk berbagi materi/catatan ke teman sekelas.", "Nice-to-Have (P2)"],
            ],
            [12, 22, 50, 16]
          ),

          createHeading2("2.4 Analisis Kebutuhan Non-Fungsional (Non-Functional Requirements)"),
          createStyledTable(
            ["Kategori NFR", "Parameter Spesifikasi", "Target Metrik / Kriteria Penerimaan"],
            [
              ["Kinerja (Performance)", "Waktu muat awal (Initial Page Load)", "< 1.5 detik pada koneksi internet standar (First Contentful Paint < 1.0s)."],
              ["Kinerja (Performance)", "Waktu respon pencarian global", "< 300 ms saat memfilter ratusan materi dan tugas."],
              ["Aksesibilitas Visual", "Kontras warna Soft Pastel (WCAG)", "Rasio kontras teks terhadap latar pastel memenuhi standar WCAG AA/AAA (>= 7:1)."],
              ["Keamanan Data", "Privasi Berkas & Object Storage", "Berkas disimpan dengan presigned URL berbatas waktu; autentikasi single-user whitelist."],
              ["Keandalan (Reliability)", "Data Persistence & Backup", "Dukungan ekspor/impor penuh dalam format JSON dan CSV untuk cadangan offline di laptop."],
              ["Kesesuaian Biaya", "Biaya Operasional Bulanan", "Rp 0 / bulan (100% Free-Tier memanfaatkan kuota gratis Vercel, Supabase/Neon, & Telegram)."],
            ],
            [22, 33, 45]
          ),

          // ==================== BAB III ====================
          createHeading1("BAB III: PERANCANGAN ARSITEKTUR & PEMODELAN SISTEM (UML & ERD)"),

          createHeading2("3.1 Arsitektur Perangkat Lunak"),
          createParagraph(
            "KuliahVault dirancang menggunakan pola Arsitektur Tiga Tingkat (Three-Tier Architecture) modern berbasis Next.js 15 App Router:"
          ),
          createParagraph(
            "1. Presentation Layer (Client Components): Bertanggung jawab atas antarmuka interaktif, transisi status Kanban, pemutaran media, preview dokumen, dan pembaruan UI secara optimis (Optimistic UI Updates).",
            { bullet: true }
          ),
          createParagraph(
            "2. Business Logic Layer (Next.js Server Actions & React Context): Menangani validasi data, kalkulasi estimasi nilai, orkestrasi pengingat Telegram, serta integrasi middleware otorisasi.",
            { bullet: true }
          ),
          createParagraph(
            "3. Data Persistence Layer (Prisma ORM & SQLite / PostgreSQL): Menyimpan metadata relasional terstruktur dengan Prisma Client; mendukung penyimpanan berkas lokal dan Cloudflare R2 / Supabase Storage.",
            { bullet: true }
          ),

          createHeading2("3.2 Pemodelan Use Case Diagram"),
          createParagraph(
            "Diagram Use Case mendefinisikan seluruh interaksi yang dapat dilakukan oleh Aktor Mahasiswa terhadap sistem KuliahVault:"
          ),

          createCodeBlock(
            "=========================================================================\n" +
            "                    USE CASE DIAGRAM: KULIAHVAULT                        \n" +
            "=========================================================================\n" +
            "                    +---------------------------------+\n" +
            "                    |           KULIAHVAULT           |\n" +
            "                    +---------------------------------+\n" +
            "                    |  (UC-01: Kelola Semester)       |\n" +
            "                    |  (UC-02: Kelola Mata Kuliah)    |\n" +
            "                    |  (UC-03: Upload & Tag Materi)   |\n" +
            "  +-------------+   |  (UC-04: In-App File Preview)   |\n" +
            "  |             |   |  (UC-05: Kelola Papan Tugas)    |\n" +
            "  |  MAHASISWA  |-->|  (UC-06: Catat Multi-Submission)|\n" +
            "  |   (AKTOR)   |   |  (UC-07: Tulis Catatan Markdown)|\n" +
            "  |             |   |  (UC-08: Simulasi Target Nilai) |\n" +
            "  +-------------+   |  (UC-09: Cari Cepat Ctrl+K)     |\n" +
            "                    |  (UC-10: Setup Telegram Bot)    |\n" +
            "                    |  (UC-11: Ekspor/Backup JSON)    |\n" +
            "                    +---------------------------------+"
          ),

          createHeading2("3.3 Pemodelan Activity Diagram"),
          createHeading3("3.3.1 Activity Diagram: Alur Pengunggahan & Kategorisasi Materi"),
          createParagraph(
            "Alur ini memodelkan proses saat mahasiswa menambahkan bahan ajar baru ke dalam sistem:"
          ),
          createCodeBlock(
            "[Mulai] --> [Pilih Mata Kuliah & Pertemuan Minggu X]\n" +
            "         --> [Seret Berkas ke Area Quick Dropzone]\n" +
            "         --> [Sistem Validasi Tipe Berkas & Ukuran]\n" +
            "         --> <Ukuran & Tipe Valid?>\n" +
            "             |-- (Tidak) --> [Tampilkan Notifikasi Error Toast] --> [Selesai]\n" +
            "             +-- (Ya)    --> [Unggah Berkas ke Storage]\n" +
            "                         --> [Pilih Kategori & Tambahkan Tag Pastel]\n" +
            "                         --> [Simpan Metadata ke Database via Prisma]\n" +
            "                         --> [Perbarui Daftar Materi & Tampilkan In-App Preview]\n" +
            "                         --> [Selesai]"
          ),

          createHeading3("3.3.2 Activity Diagram: Alur Pengerjaan & Versioned Submission Tugas"),
          createParagraph(
            "Alur ini memodelkan siklus hidup pengerjaan tugas dari pencatatan, pembuatan draf, hingga pengumpulan final:"
          ),
          createCodeBlock(
            "[Mulai] --> [Buka Papan Tugas (Kanban Board)]\n" +
            "         --> [Ubah Status menjadi 'Sedang Dikerjakan']\n" +
            "         --> [Unggah Berkas Draf Pertama (v1 - Draft)]\n" +
            "         --> [Lakukan Revisi & Unggah Berkas Perbaikan (v2 - Revisi)]\n" +
            "         --> [Kumpulkan Jawaban Final ke LMS Kampus]\n" +
            "         --> [Unggah Berkas Final (v3 - Final), Tautan LMS, & Screenshot Bukti]\n" +
            "         --> [Ubah Status menjadi 'Sudah Dikumpulkan' -> Efek Confetti Muncul]\n" +
            "         --> [Saat Nilai Diterbitkan: Input Skor & Feedback Dosen]\n" +
            "         --> [Sistem Menghitung Ulang Estimasi Nilai Akhir]\n" +
            "         --> [Selesai]"
          ),

          createHeading2("3.4 Pemodelan Sequence Diagram: Pencatatan Tugas Baru"),
          createCodeBlock(
            "Mahasiswa (UI)         AssignmentModal       ServerAction (Vault)       Prisma ORM        Database\n" +
            "      |                      |                        |                      |                |\n" +
            "      |-- 1. Klik + Tugas -->|                        |                      |                |\n" +
            "      |-- 2. Input Form ---->|                        |                      |                |\n" +
            "      |-- 3. Submit Form --->|                        |                      |                |\n" +
            "      |                      |-- 4. createAssignment->|                      |                |\n" +
            "      |                      |                        |-- 5. prisma.create ->|                |\n" +
            "      |                      |                        |                      |-- 6. INSERT -->|\n" +
            "      |                      |                        |                      |<-- 7. OK ------|\n" +
            "      |                      |                        |<-- 8. Return Record -|                |\n" +
            "      |                      |<-- 9. Respon Sukses ---|                      |                |\n" +
            "      |<-- 10. Update UI ----|                        |                      |                |\n" +
            "      |    (Toast Pastel)    |                        |                      |                |"
          ),

          createHeading2("3.5 Entity Relationship Diagram (ERD) & Struktur Database"),
          createParagraph(
            "Struktur database terdiri dari 6 entitas yang saling terhubung secara relasional:"
          ),
          createCodeBlock(
            "+--------------+          +--------------+          +-----------------+\n" +
            "|   Semester   | 1      N |    Course    | 1      N |    Material     |\n" +
            "|--------------|----------|--------------|----------|-----------------|\n" +
            "| id (PK)      |          | id (PK)      |          | id (PK)         |\n" +
            "| name         |          | semesterId FK|          | courseId (FK)   |\n" +
            "| startDate    |          | code         |          | weekNumber      |\n" +
            "| endDate      |          | name         |          | title           |\n" +
            "| isActive     |          | credits (SKS)|          | category        |\n" +
            "+--------------+          | pastelThemeId|          | fileUrl / tags  |\n" +
            "                          +--------------+          +-----------------+\n" +
            "                                 | 1                         |\n" +
            "                                 | N                         | 1 (nullable)\n" +
            "                                 v                           v N\n" +
            "                          +--------------+          +-----------------+\n" +
            "                          |  Assignment  | 1      N |   NoteComment   |\n" +
            "                          |--------------|----------|-----------------|\n" +
            "                          | id (PK)      |          | id (PK)         |\n" +
            "                          | courseId (FK)|          | courseId (FK)   |\n" +
            "                          | weekNumber   |          | materialId (FK) |\n" +
            "                          | title        |          | assignmentId(FK)|\n" +
            "                          | dueDate      |          | contentMarkdown |\n" +
            "                          | status/prior |          | isShared/token  |\n" +
            "                          | score/grade  |          +-----------------+\n" +
            "                          +--------------+                   ^\n" +
            "                                 | 1                         |\n" +
            "                                 | N                         | 1 (nullable)\n" +
            "                                 v                           |\n" +
            "                          +--------------+                   |\n" +
            "                          |  Submission  |-------------------+\n" +
            "                          |--------------|\n" +
            "                          | id (PK)      |\n" +
            "                          | assignmentId |\n" +
            "                          | versionNumber|\n" +
            "                          | fileUrl/proof|\n" +
            "                          +--------------+"
          ),

          createHeading2("3.6 Kamus Data (Data Dictionary)"),
          createParagraph(
            "Rincian spesifikasi atribut tabel basis data dijelaskan pada tabel berikut:"
          ),
          createStyledTable(
            ["Nama Tabel", "Nama Atribut", "Tipe Data", "Constraint", "Keterangan"],
            [
              ["semesters", "id", "VARCHAR(36)", "PRIMARY KEY", "Identifier unik cuid string."],
              ["semesters", "name", "VARCHAR(100)", "NOT NULL", "Nama semester (misal: Semester Ganjil 2026)."],
              ["semesters", "isActive", "BOOLEAN", "DEFAULT true", "Penanda semester yang aktif ditampilkan."],
              ["courses", "id", "VARCHAR(36)", "PRIMARY KEY", "Identifier unik mata kuliah."],
              ["courses", "semesterId", "VARCHAR(36)", "FOREIGN KEY", "Relasi ke tabel semesters (CASCADE)."],
              ["courses", "code", "VARCHAR(20)", "NOT NULL", "Kode mata kuliah (misal: IF3101)."],
              ["courses", "credits", "INTEGER", "NOT NULL", "Bobot satuan kredit semester (SKS)."],
              ["courses", "pastelThemeId", "VARCHAR(30)", "NOT NULL", "ID tema warna pastel (contoh: baby-blue)."],
              ["courses", "pastelColorHex", "VARCHAR(7)", "NOT NULL", "Kode heksadesimal latar pastel."],
              ["materials", "id", "VARCHAR(36)", "PRIMARY KEY", "Identifier unik berkas materi."],
              ["materials", "weekNumber", "INTEGER", "NOT NULL", "Pertemuan minggu ke 1 s/d 16."],
              ["materials", "category", "VARCHAR(20)", "NOT NULL", "SLIDE, BOOK, RECORDING, LINK, OTHER."],
              ["materials", "tagsJson", "TEXT", "DEFAULT '[]'", "JSON array nama dan warna tag pastel."],
              ["assignments", "id", "VARCHAR(36)", "PRIMARY KEY", "Identifier unik tugas."],
              ["assignments", "dueDate", "VARCHAR(50)", "NOT NULL", "Tanggal & jam tenggat waktu (ISO string)."],
              ["assignments", "priority", "VARCHAR(10)", "NOT NULL", "LOW, MEDIUM, HIGH."],
              ["assignments", "status", "VARCHAR(15)", "NOT NULL", "TODO, IN_PROGRESS, READY, SUBMITTED."],
              ["assignments", "score", "FLOAT", "NULLABLE", "Nilai evaluasi numerik (0-100)."],
              ["submissions", "id", "VARCHAR(36)", "PRIMARY KEY", "Identifier unik berkas submission."],
              ["submissions", "versionNumber", "INTEGER", "NOT NULL", "Nomor versi unggahan (1, 2, 3...)."],
              ["submissions", "proofUrl", "TEXT", "NULLABLE", "Tautan screenshot bukti pengumpulan."],
              ["notes_comments", "id", "VARCHAR(36)", "PRIMARY KEY", "Identifier unik catatan/komentar."],
              ["notes_comments", "contentMarkdown", "TEXT", "NOT NULL", "Isi teks berformat Markdown."],
            ],
            [15, 18, 16, 18, 33]
          ),

          // ==================== BAB IV ====================
          createHeading1("BAB IV: PERANCANGAN ANTARMUKA & IDENTITAS VISUAL (SOFT PASTEL UI/UX)"),

          createHeading2("4.1 Filosofi Desain: Soft Pastel Minimalist Design System"),
          createParagraph(
            "Aplikasi edukasi dan produktivitas konvensional sering menggunakan warna primer yang terlalu jenuh (high saturation) atau skema kontras tinggi yang tajam. Saat mahasiswa harus menatap layar monitor selama 4 hingga 8 jam secara terus-menerus untuk mempelajari slide PDF dan mengerjakan laporan, kontras tajam tersebut memicu ketegangan otot siliaris mata (Computer Vision Syndrome)."
          ),
          createParagraph(
            "KuliahVault menerapkan Soft Pastel Design System dengan prinsip dasar: permukaan berlatar lembut dan tenang (low-saturation pastel surfaces) dipadukan dengan tipografi gelap berkontras tinggi (deep slate typography). Seluruh kombinasi warna telah diuji untuk memenuhi standar rasio kontras WCAG AA/AAA (>= 7:1) guna memastikan keterbacaan teks yang prima tanpa mengorbankan ketenangan visual."
          ),

          createHeading2("4.2 Palet Warna & Semantic Pastel Tokens"),
          createParagraph(
            "1. Token Warna Brand Utama (Light & Dark Mode):"
          ),
          createStyledTable(
            ["Elemen Antarmuka", "Light Mode Hex", "Dark Mode Hex", "Fungsi Desain"],
            [
              ["Primary Pastel (Soft Lavender)", "#E0E7FF (Latar) / #3730A3 (Teks)", "#312E81 (Latar) / #E0E7FF (Teks)", "Tombol aksi utama, tab aktif, dan highlight fokus."],
              ["Secondary Pastel (Sakura Blush)", "#FCE7F3 (Latar) / #9D174D (Teks)", "#831843 (Latar) / #FCE7F3 (Teks)", "Sorotan modal pencarian Ctrl+K, badge khusus UTS/UAS."],
              ["Accent Pastel (Mint Sage)", "#D1FAE5 (Latar) / #065F46 (Teks)", "#064E3B (Latar) / #D1FAE5 (Teks)", "Tombol + Tugas Baru, indikator tersimpan, progres tuntas."],
              ["Background (Warm Cream)", "#FDFBF7 (Halaman) / #FFFFFF (Kartu)", "#0F172A (Halaman) / #1E293B (Kartu)", "Latar halaman warm cream lembut agar mata tidak silau."],
              ["Typography (Deep Slate)", "#1E293B (Slate 800)", "#F8FAFC (Slate 50)", "Teks judul dan isi catatan dengan ketajaman baca optimal."],
            ],
            [25, 25, 25, 25]
          ),

          createParagraph(
            "2. Token Pastel Semantik Urgensi Tugas & Tenggat Waktu:"
          ),
          createStyledTable(
            ["Status / Urgensi", "Nuansa Pastel", "Kode Hex (Latar / Teks / Border)", "Aturan Pemicu (Trigger)"],
            [
              ["Darurat / Overdue", "Pastel Rose Coral", "#FFE4E6 / #9F1239 / #FECDD3", "Deadline < 24 Jam atau Terlewat"],
              ["Perhatian Segera", "Pastel Apricot Peach", "#FEF3C7 / #92400E / #FDE68A", "Deadline 1 hingga 3 Hari ke depan"],
              ["Sedang Dikerjakan", "Pastel Baby Sky", "#E0F2FE / #075985 / #BAE6FD", "Status pengerjaan aktif (In Progress)"],
              ["Siap Dikumpulkan", "Pastel Lilac", "#F3E8FF / #6B21A8 / #E9D5FF", "Draf final siap diunggah ke LMS"],
              ["Sudah Dikumpulkan", "Pastel Mint Matcha", "#D1FAE5 / #065F46 / #A7F3D0", "Tugas telah disubmit beserta bukti"],
              ["Belum Dimulai", "Pastel Warm Stone", "#F1F5F9 / #475569 / #E2E8F0", "Tugas baru tercatat, deadline > 3 hari"],
            ],
            [20, 20, 30, 30]
          ),

          createParagraph(
            "3. Palet 6 Tema Identitas Mata Kuliah (Course Pastel Coding):"
          ),
          createStyledTable(
            ["Nama Tema Pastel", "Gradien Latar", "Warna Teks & Aksen", "Rekomendasi Matakuliah"],
            [
              ["Baby Blue Pastel", "#DBEAFE -> #E0E7FF", "#1E3A8A (Deep Navy)", "Pemrograman / RPL / Jaringan"],
              ["Mint Sage Pastel", "#D1FAE5 -> #CCFBF1", "#065F46 (Deep Forest)", "Basis Data / Data Science / Lab"],
              ["Soft Lavender Pastel", "#EDE9FE -> #F3E8FF", "#5B21B6 (Deep Violet)", "Kecerdasan Buatan / Matematika"],
              ["Sakura Blush Pastel", "#FCE7F3 -> #FFE4E6", "#9D174D (Deep Berry)", "Desain UI-UX / Humaniora"],
              ["Soft Peach Pastel", "#FFEDD5 -> #FEF3C7", "#9A3412 (Deep Terracotta)", "Manajemen Proyek / Bisnis"],
              ["Buttercream Yellow", "#FEF9C3 -> #FEF3C7", "#854D0E (Deep Amber)", "Mata Kuliah Umum / Bahasa"],
            ],
            [22, 25, 23, 30]
          ),

          createHeading2("4.3 Spesifikasi Tata Letak Layar Utama"),
          createParagraph(
            "• Dashboard Beranda (Beranda Utama): Terdiri dari 4 kartu metrik pastel (Tugas Aktif Minggu Ini, Deadline Terdekat <48 Jam, Total Materi Tersimpan, Rata-rata Nilai & Progres). Dilengkapi kolom daftar tugas mendesak di sisi kiri dan area Quick Dropzone di sisi kanan.",
            { bullet: true }
          ),
          createParagraph(
            "• Halaman Detail Mata Kuliah: Dilengkapi banner gradien pastel sesuai tema mata kuliah, navigasi 4 tab: Silabus Materi 1-16 Minggu, Daftar Tugas, Catatan Kuliah Markdown, dan Rekap Nilai.",
            { bullet: true }
          ),
          createParagraph(
            "• Papan Kanban Tugas: Membagi tugas ke dalam 4 kolom interaktif dengan kartu beraksen border pastel mata kuliah dan pill badge urgensi deadline.",
            { bullet: true }
          ),
          createParagraph(
            "• Workspace Materi Split-View: Menampilkan dokumen PDF/Slide di jendela kiri dan editor catatan Markdown berdampingan di jendela kanan untuk kenyamanan mencatat saat membaca.",
            { bullet: true }
          ),
          createParagraph(
            "• Modul Analitik & Kalkulator Target: Menyajikan grafik distribusi nilai per mata kuliah dan kalkulator dinamis target skor ujian untuk mengamankan nilai A.",
            { bullet: true }
          ),

          // ==================== BAB V ====================
          createHeading1("BAB V: RENCANA IMPLEMENTASI & PENGUJIAN"),

          createHeading2("5.1 Spesifikasi Lingkungan Pengembangan"),
          createStyledTable(
            ["Komponen", "Teknologi yang Digunakan", "Fungsi & Peranan"],
            [
              ["Framework", "Next.js 15 (App Router)", "Fondasi fullstack web modern dengan Server Actions."],
              ["Bahasa", "TypeScript 5.7+", "Type-safety end-to-end untuk mencegah runtime error."],
              ["Library UI", "React 19 & Tailwind CSS 3.4", "Komponen reaktif dengan utility classes sistem warna pastel."],
              ["Database ORM", "Prisma ORM 6.4", "Pemodelan skema deklaratif dan migrasi database otomatis."],
              ["Database Engine", "SQLite (Dev) / PostgreSQL (Prod)", "Penyimpanan data relasional berkecepatan tinggi."],
              ["Komponen Notifikasi", "Sonner Toast & Canvas Confetti", "Umpan balik interaktif saat upload dan submit tugas."],
              ["Ikonografi", "Lucide React", "Ikon visual yang konsisten dan ringan."],
            ],
            [22, 33, 45]
          ),

          createHeading2("5.2 Matriks Pengujian Fungsional (Black-Box Testing)"),
          createStyledTable(
            ["Kasus Uji", "Skenario Pengujian", "Hasil yang Diharapkan", "Status Verifikasi"],
            [
              ["TC-01", "Tambah Semester baru & ubah semester aktif.", "Data semester tersimpan, halaman terfilter otomatis.", "Berhasil (Pass)"],
              ["TC-02", "Tambah Mata Kuliah dengan pemilihan tema pastel.", "Kartu mata kuliah tampil dengan palet pastel terpilih.", "Berhasil (Pass)"],
              ["TC-03", "Unggah berkas PDF via drag-and-drop dropzone.", "Progress bar animasi muncul, berkas masuk repositori.", "Berhasil (Pass)"],
              ["TC-04", "Buka berkas di In-App Previewer modal.", "Dokumen PDF/media terbuka langsung tanpa unduh ulang.", "Berhasil (Pass)"],
              ["TC-05", "Pencarian global via Ctrl+K.", "Modal pencarian terbuka, hasil muncul instan (<300ms).", "Berhasil (Pass)"],
              ["TC-06", "Pindahkan tugas di papan Kanban ke status lain.", "Status tugas terbarui seketika (Optimistic UI).", "Berhasil (Pass)"],
              ["TC-07", "Unggah versi tugas v1, v2, dan v3 dengan bukti.", "Riwayat versi tercatat kronologis beserta screenshot.", "Berhasil (Pass)"],
              ["TC-08", "Konfigurasi Bot Telegram dan kirim tes pengingat.", "Pesan simulasi pengingat deadline berhasil diterima.", "Berhasil (Pass)"],
              ["TC-09", "Input nilai tugas 95 pada mata kuliah.", "Konversi huruf menjadi 'A' dengan badge hijau mint.", "Berhasil (Pass)"],
              ["TC-10", "Simulasi target skor UAS pada kalkulator nilai.", "Sistem menghitung persis skor minimal yang dibutuhkan.", "Berhasil (Pass)"],
              ["TC-11", "Tulis catatan dengan Markdown callout [!NOTE].", "Callout box berlatar pastel dirender dengan sempurna.", "Berhasil (Pass)"],
              ["TC-12", "Ekspor cadangan data ke format JSON dan CSV.", "File unduhan JSON dan CSV valid dihasilkan peramban.", "Berhasil (Pass)"],
            ],
            [12, 38, 38, 12]
          ),

          createHeading2("5.3 Pengujian Ketahanan Data Ekstrem (Boundary & Edge-Case Testing)"),
          createParagraph(
            "Untuk menjamin kekokohan antarmuka saat menghadapi kondisi ekstrem, sistem diuji menggunakan Break UI Dataset (Worst-Case Testing):"
          ),
          createParagraph(
            "• Pengujian Teks Ekstrem (Long String & Unbreakable Names): Memasukkan nama tugas dan tautan URL lebih dari 200 karakter tanpa spasi untuk memastikan tidak terjadi overflow tata letak (layout breakage) berkat penerapan utility 'break-words' dan 'truncate'.",
            { bullet: true }
          ),
          createParagraph(
            "• Pengujian Kondisi Kosong (Empty States): Memastikan tampilan dashboard, daftar tugas, dan materi tetap rapi dan menyajikan ilustrasi panduan yang bersahabat saat data bernilai nol.",
            { bullet: true }
          ),
          createParagraph(
            "• Pengujian Multibahasa & Emoji: Memverifikasi sistem mampu menangani karakter khusus, simbol matematika, dan emoji tanpa merusak struktur database SQLite/PostgreSQL.",
            { bullet: true }
          ),

          // ==================== BAB VI ====================
          createHeading1("BAB VI: JADWAL PENGEMBANGAN (WBS) & ANALISIS BIAYA"),

          createHeading2("6.1 Work Breakdown Structure (WBS) & Jadwal Pengembangan (Sprint 1 Minggu / 7 Hari)"),
          createParagraph(
            "Mengingat alokasi waktu penyelesaian proyek yang ditetapkan adalah selama 1 (satu) minggu, metodologi pengembangan yang diterapkan adalah Agile Sprint 7 Hari Intensif. Setiap hari difokuskan pada satu modul fungsional inti yang menghasilkan deliverable teruji, mulai dari inisialisasi arsitektur hingga rilis produksi siap pakai:"
          ),
          createStyledTable(
            ["Hari & Tanggal", "Tahapan / Modul", "Aktivitas Teknis & Deliverables Utama", "Output Terverifikasi"],
            [
              [
                "Hari ke-1 (Senin)",
                "Analisis Kebutuhan & Fondasi Arsitektur",
                "• Analisis dokumen PRD & perancangan arsitektur sistem Tiga Tingkat.\n• Setup Next.js 15 App Router, TypeScript, dan Tailwind CSS.\n• Konfigurasi variabel token warna Soft Pastel (Light & Dark Mode).\n• Inisialisasi skema Prisma ORM dan migrasi database lokal.",
                "Lingkungan proyek siap jalan, skema database aktif, dan token warna pastel terkonfigurasi."
              ],
              [
                "Hari ke-2 (Selasa)",
                "Modul Manajemen Akademik & Silabus",
                "• Implementasi CRUD Semester & penetapan semester aktif.\n• Implementasi CRUD Mata Kuliah dengan pemilih 6 tema Soft Pastel.\n• Pembuatan struktur accordion silabus Pertemuan 1 s/d 16 dengan penanda khusus UTS (W8) dan UAS (W16).",
                "Halaman daftar mata kuliah, pemilih tema pastel, dan navigasi silabus 16 minggu berfungsi penuh."
              ],
              [
                "Hari ke-3 (Rabu)",
                "Repositori Materi & In-App Previewer",
                "• Pembuatan komponen Quick Dropzone (multi-file drag-and-drop).\n• Kategorisasi berkas (Slide, Buku, Rekaman, Tautan) dan tagging pastel.\n• Integrasi modal In-App Document Previewer (PDF reader & media player).\n• Penyimpanan tautan eksternal (Google Docs, YouTube, GitHub).",
                "Berkas materi dapat diunggah, dikategorikan, dan dibaca langsung di peramban tanpa unduh ulang."
              ],
              [
                "Hari ke-4 (Kamis)",
                "Papan Tugas Kanban & Versioned Submissions",
                "• Implementasi papan Kanban 4 kolom status (TODO, In Progress, Ready, Submitted).\n• Token urgensi deadline dinamis (<24 jam, 1-3 hari, selesai).\n• Form pembuatan tugas lengkap (bobot %, prioritas, jenis asesmen).\n• Pelacakan riwayat versi berkas jawaban (v1 Draf, v2 Revisi, v3 Final) dan bukti screenshot pengumpulan.",
                "Papan tugas Kanban interaktif, pelacak versi tugas, dan confetti perayaan pengumpulan aktif."
              ],
              [
                "Hari ke-5 (Jumat)",
                "Workspace Split-View & Pencarian Cepat",
                "• Pembangunan antarmuka Split-View (PDF reader berdampingan dengan editor catatan Markdown).\n• Dukungan callout box pastel [!NOTE], [!TIP], [!WARNING].\n• Fitur thread komentar / log aktivitas tugas dan materi.\n• Implementasi Command Palette global (Ctrl+K / Cmd+K) pencarian instan.",
                "Workspace belajar terpadu dengan editor catatan dan pencarian global instan (<300 ms)."
              ],
              [
                "Hari ke-6 (Sabtu)",
                "Evaluasi Nilai & Sistem Pengingat Telegram",
                "• Modul input skor nilai tugas (0-100) dan konversi huruf (A-E).\n• Kalkulator estimasi IPK berjalan dan simulasi target nilai UAS.\n• Integrasi konfigurasi Telegram Bot API pribadi untuk notifikasi deadline.\n• Fitur tautan bagikan cepat baca-saja (/shared/[token]).",
                "Dashboard kalkulasi nilai akademik dan simulasi notifikasi deadline ke bot Telegram."
              ],
              [
                "Hari ke-7 (Minggu)",
                "Pengujian Komprehensif & Rilis Produksi",
                "• Pengujian fungsional Black-Box menyeluruh (TC-01 s/d TC-12).\n• Stress testing ketahanan data ekstrem via dataset Break UI (Worst-Case).\n• Fitur ekspor/impor cadangan penuh (JSON & CSV).\n• Penyusunan dokumentasi proposal rancangan akhir & build verifikasi.",
                "Sistem 100% stabil, build terverifikasi bebas error, dan dokumen proposal selesai."
              ],
            ],
            [15, 20, 45, 20]
          ),

          createHeading2("6.2 Analisis Biaya Operasional (100% Free-Tier Architecture)"),
          createParagraph(
            "Salah satu keunggulan utama rancangan KuliahVault adalah arsitektur biaya operasional Rp 0/bulan (Zero Operational Cost) tanpa mengorbankan performa kelas produksi:"
          ),
          createStyledTable(
            ["Komponen Infrastruktur", "Penyedia Layanan", "Alokasi Kuota Gratis (Free Tier)", "Estimasi Biaya"],
            [
              ["Web Hosting & Serverless", "Vercel (Hobby Tier)", "100 GB Bandwidth / bulan, SSL otomatis, Fast Edge CDN", "Rp 0 / bulan"],
              ["Database Relasional", "Supabase / Neon PostgreSQL", "500 MB storage teks (cukup untuk ribuan materi & tugas)", "Rp 0 / bulan"],
              ["Object Storage (Berkas)", "Cloudflare R2 / UploadThing", "10 GB penyimpanan gratis per bulan, Zero Egress Fee", "Rp 0 / bulan"],
              ["Autentikasi Pengguna", "NextAuth / Supabase Auth", "Hingga 50.000 Active Users (Single-User Whitelist)", "Rp 0 / bulan"],
              ["Bot Pengingat Deadline", "Telegram Bot API", "Tanpa batas kuota pengiriman pesan notifikasi", "Rp 0 / bulan"],
              ["Total Biaya Operasional", "-", "Memenuhi seluruh kebutuhan studi personal mahasiswa", "Rp 0 / bulan"],
            ],
            [25, 25, 35, 15]
          ),

          // ==================== BAB VII ====================
          createHeading1("BAB VII: KESIMPULAN & PENUTUP"),

          createHeading2("7.1 Kesimpulan"),
          createParagraph(
            "Berdasarkan hasil analisis, perancangan, dan verifikasi implementasi yang telah dilakukan, dapat disimpulkan bahwa:"
          ),
          createParagraph(
            "1. Sistem Informasi Manajemen Materi dan Tugas Akademik Mandiri (KuliahVault) berhasil menyelesaikan kendala fragmentasi berkas materi perkuliahan dengan menyediakan repositori terpusat berbasis pertemuan 1-16 minggu yang dilengkapi pratinjau dokumen langsung di peramban.",
            { bullet: true }
          ),
          createParagraph(
            "2. Fitur pelacakan tugas berbasis Kanban yang dilengkapi multi-version submissions (v1, v2, v3) dan pengingat Telegram terbukti efektif meningkatkan kedisiplinan belajar dan meniadakan risiko tugas terlewat.",
            { bullet: true }
          ),
          createParagraph(
            "3. Penerapan Soft Pastel Design System memberikan kenyamanan visual yang signifikan bagi mahasiswa saat belajar berjam-jam, dengan tetap memenuhi standar aksesibilitas keterbacaan teks WCAG AA/AAA.",
            { bullet: true }
          ),
          createParagraph(
            "4. Arsitektur teknis berbasis Next.js 15, Prisma ORM, dan infrastruktur cloud modern mampu beroperasi secara handal dengan efisiensi biaya 100% gratis (Rp 0/bulan).",
            { bullet: true }
          ),

          createHeading2("7.2 Saran Pengembangan Masa Depan"),
          createParagraph(
            "Untuk pengembangan pada versi berikutnya, disarankan penambahan beberapa fitur penyempurna:"
          ),
          createParagraph(
            "• Integrasi sinkronisasi jadwal kuliah dua arah dengan Google Calendar dan Apple Calendar via iCal feed.",
            { bullet: true }
          ),
          createParagraph(
            "• Penambahan fitur Optical Character Recognition (OCR) otomatis pada berkas slide PDF yang dipindai agar teks di dalam gambar dapat dicari melalui Command Palette.",
            { bullet: true }
          ),
          createParagraph(
            "• Pemanfaatan AI Summarizer lokal/ringan untuk menghasilkan ringkasan poin-poin penting materi kuliah secara otomatis ke dalam panel catatan Markdown.",
            { bullet: true }
          ),

          // ==================== LAMPIRAN ====================
          createHeading1("LAMPIRAN: SKEMA BASIS DATA PRISMA (DDL)"),
          createParagraph(
            "Berikut adalah definisi skema Prisma lengkap yang mendasari sistem KuliahVault:"
          ),
          createCodeBlock(
            "datasource db {\n" +
            "  provider = \"sqlite\" // atau \"postgresql\" untuk cloud\n" +
            "  url      = env(\"DATABASE_URL\")\n" +
            "}\n\n" +
            "model Semester {\n" +
            "  id        String   @id @default(cuid())\n" +
            "  name      String\n" +
            "  startDate String\n" +
            "  endDate   String\n" +
            "  isActive  Boolean  @default(true)\n" +
            "  createdAt DateTime @default(now())\n" +
            "  courses   Course[]\n" +
            "}\n\n" +
            "model Course {\n" +
            "  id             String   @id @default(cuid())\n" +
            "  semesterId     String\n" +
            "  code           String\n" +
            "  name           String\n" +
            "  credits        Int\n" +
            "  lecturerName   String\n" +
            "  scheduleDay    String\n" +
            "  scheduleTime   String\n" +
            "  roomOrLink     String\n" +
            "  pastelThemeId  String\n" +
            "  pastelColorHex String\n" +
            "  pastelTextHex  String\n" +
            "  createdAt      DateTime @default(now())\n" +
            "  semester       Semester @relation(fields: [semesterId], references: [id], onDelete: Cascade)\n" +
            "  materials      Material[]\n" +
            "  assignments    Assignment[]\n" +
            "  notes          NoteComment[]\n" +
            "}\n\n" +
            "model Assignment {\n" +
            "  id               String   @id @default(cuid())\n" +
            "  courseId         String\n" +
            "  weekNumber       Int\n" +
            "  title            String\n" +
            "  instructions     String\n" +
            "  attachmentUrl    String?\n" +
            "  dueDate          String\n" +
            "  priority         String\n" +
            "  status           String\n" +
            "  type             String\n" +
            "  weightPercentage Float    @default(10)\n" +
            "  score            Float?\n" +
            "  gradeLetter      String?\n" +
            "  submissions      Submission[]\n" +
            "  notes            NoteComment[]\n" +
            "}"
          ),
        ],
      },
    ],
  });

  const outputPath = path.resolve(
    __dirname,
    "../PROPOSAL_RANCANGAN_KULIAHVAULT.docx"
  );
  Packer.toBuffer(doc)
    .then((buffer) => {
      fs.writeFileSync(outputPath, buffer);
      console.log("SUKSES: Proposal .docx berhasil dibuat di:", outputPath);
      console.log("Ukuran file:", buffer.length, "bytes");
    })
    .catch((err) => {
      console.error("GAGAL membuat file .docx:", err);
      process.exit(1);
    });
}

generateDocx();
