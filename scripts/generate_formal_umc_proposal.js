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
  PageBreak,
  ImageRun,
  UnderlineType,
} = require("docx");

// Konstanta Margins A4 dalam dxa (1 cm = 567 dxa, 1 inch = 1440 dxa)
const MARGIN_LEFT = 2268;   // 4 cm (Standar Akademik Penjilidan)
const MARGIN_TOP = 1701;    // 3 cm
const MARGIN_RIGHT = 1701;  // 3 cm
const MARGIN_BOTTOM = 1701; // 3 cm
const CONTENT_WIDTH = 11906 - (MARGIN_LEFT + MARGIN_RIGHT); // ~7937 dxa

const logoPath = path.join(__dirname, "..", "public", "logo_umc.png");
const hasLogo = fs.existsSync(logoPath);
const logoBuffer = hasLogo ? fs.readFileSync(logoPath) : null;

// Helper sel tabel formal
function makeCell(text, options = {}) {
  const {
    isHeader = false,
    width = undefined,
    bgColor = isHeader ? "E2E8F0" : undefined,
    bold = isHeader,
    color = isHeader ? "0F172A" : "1E293B",
    align = AlignmentType.LEFT,
    size = 20, // 10 pt
    italic = false,
  } = options;

  return new TableCell({
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: bgColor ? { fill: bgColor } : undefined,
    margins: {
      top: 100,
      bottom: 100,
      left: 140,
      right: 140,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "94A3B8" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "94A3B8" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "94A3B8" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "94A3B8" },
    },
    children: [
      new Paragraph({
        alignment: align,
        spacing: { before: 0, after: 0, line: 240 },
        children: [
          new TextRun({
            text: text,
            bold: bold,
            color: color,
            font: "Times New Roman",
            size: size,
            italics: italic,
          }),
        ],
      }),
    ],
  });
}

function makeParagraph(text, options = {}) {
  const {
    align = AlignmentType.JUSTIFY,
    indent = 567, // 1 cm first-line indent
    spaceBefore = 100,
    spaceAfter = 100,
    bold = false,
    italic = false,
    size = 24, // 12 pt
  } = options;

  return new Paragraph({
    alignment: align,
    indent: indent ? { firstLine: indent } : undefined,
    spacing: { before: spaceBefore, after: spaceAfter, line: 360 }, // 1.5 line spacing
    children: [
      new TextRun({
        text: text,
        bold: bold,
        italics: italic,
        font: "Times New Roman",
        size: size,
        color: "000000",
      }),
    ],
  });
}

function makeParagraphNoIndent(text, options = {}) {
  return makeParagraph(text, { ...options, indent: 0 });
}

function makeBullet(text, options = {}) {
  const { boldPrefix = "", size = 24 } = options;
  const children = [];
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix + " ",
        bold: true,
        font: "Times New Roman",
        size: size,
        color: "000000",
      })
    );
  }
  children.push(
    new TextRun({
      text: text,
      font: "Times New Roman",
      size: size,
      color: "000000",
    })
  );

  return new Paragraph({
    alignment: AlignmentType.JUSTIFY,
    spacing: { before: 60, after: 60, line: 360 },
    indent: { left: 400 },
    children: children,
  });
}

function makeChapterTitle(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 360, after: 240, line: 300 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        font: "Times New Roman",
        size: 28, // 14 pt
        color: "000000",
      }),
    ],
  });
}

function makeSubchapterTitle(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120, line: 280 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        font: "Times New Roman",
        size: 24, // 12 pt
        color: "000000",
      }),
    ],
  });
}

function makeSubSubchapterTitle(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80, line: 260 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        font: "Times New Roman",
        size: 22, // 11 pt
        color: "000000",
      }),
    ],
  });
}

function makeTableTitle(number, name) {
  return new Paragraph({
    spacing: { before: 200, after: 60, line: 260 },
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({
        text: `Tabel ${number} `,
        bold: true,
        font: "Times New Roman",
        size: 22,
        color: "000000",
      }),
      new TextRun({
        text: name,
        font: "Times New Roman",
        size: 22,
        color: "000000",
      }),
    ],
  });
}

// ==========================================
// SECTIONS & CHILDREN BUILDER
// ==========================================
const children = [];

// 1. COVER PAGE
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 140, line: 300 },
    children: [
      new TextRun({
        text: "PROPOSAL PERANCANGAN SISTEM INFORMASI AKADEMIK PERSONAL\nDAN MANAJEMEN TUGAS KULIAH BERBASIS WEB\n\"YULI'S VAULT (YULI'S SECOND BRAIN)\"",
        bold: true,
        size: 28, // 14pt
        color: "000000",
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 40, line: 260 },
    children: [
      new TextRun({
        text: "Disusun untuk Memenuhi Tugas Mata Kuliah Analisis Design PL",
        size: 24, // 12pt
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200, line: 260 },
    children: [
      new TextRun({
        text: "Dosen Pengampu: Dian Novianti M.Kom",
        bold: true,
        size: 24, // 12pt
        font: "Times New Roman",
      }),
    ],
  })
);

// LOGO UMC
if (logoBuffer) {
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 200 },
      children: [
        new ImageRun({
          data: logoBuffer,
          transformation: {
            width: 140,
            height: 140,
          },
        }),
      ],
    })
  );
} else {
  children.push(new Paragraph({ spacing: { before: 400, after: 400 } }));
}

// IDENTITAS PENYUSUN & KAMPUS
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 40, line: 260 },
    children: [
      new TextRun({
        text: "Disusun Oleh:",
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 20, line: 260 },
    children: [
      new TextRun({
        text: "Yuli Indiyanti",
        bold: true,
        size: 26,
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 20, line: 260 },
    children: [
      new TextRun({
        text: "240511130",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240, line: 260 },
    children: [
      new TextRun({
        text: "TI24D",
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 20, line: 260 },
    children: [
      new TextRun({
        text: "PROGRAM STUDI S1 TEKNIK INFORMATIKA\nFAKULTAS TEKNIK\nUNIVERSITAS MUHAMMADIYAH CIREBON\n2026",
        bold: true,
        size: 26,
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// 2. KATA PENGANTAR (hal ii)
children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 240, line: 280 },
    children: [
      new TextRun({
        text: "KATA PENGANTAR",
        bold: true,
        font: "Times New Roman",
        size: 28,
      }),
    ],
  }),
  makeParagraph(
    "Puji dan syukur penulis panjatkan ke hadirat Allah SWT, Tuhan Yang Maha Esa, atas limpahan rahmat, taufik, dan hidayah-Nya sehingga dokumen Proposal Proyek Pengembangan Sistem Informasi & Manajemen Akademik dengan judul \"Perancangan User Interface (UI) dan User Experience (UX) Website Personal Academic Vault dan Task Management dengan Fitur Portal Penilaian Dosen Interaktif (Yuli's Vault)\" ini dapat diselesaikan dengan baik dan tepat waktu."
  ),
  makeParagraph(
    "Proposal ini disusun secara terstruktur sebagai acuan dan pedoman komprehensif dalam merancang serta mengimplementasikan aplikasi web akademik mandiri (Personal Academic Second Brain). Proyek ini dirancang guna memadukan arsitektur fullstack Next.js 15 dan basis data relasional SQLite dengan identitas visual elegan bertema Luxury Warm Chocolate & Dark Brown, diperkaya efek partikel gerak lembut Glitter Sparkles, sistem 5 kategori asesmen resmi perkuliahan, serta Portal Penilaian Khusus Dosen tanpa login."
  ),
  makeParagraph(
    "Dalam proses penyusunan proposal dan pengembangan perangkat lunak ini, penulis menyampaikan ucapan terima kasih dan penghargaan yang setinggi-tingginya kepada:"
  ),
  makeBullet(
    "Ibu Dian Novianti M.Kom, selaku Dosen Pengampu Mata Kuliah Analisis Design PL yang senantiasa meluangkan waktu memberikan arahan berharga, wawasan metodologi, dan bimbingan teknis yang sangat mendalam.",
    { boldPrefix: "1." }
  ),
  makeBullet(
    "Orang tua dan keluarga tercinta atas limpahan doa, dukungan moril, kasih sayang, dan motivasi tanpa henti selama menempuh studi.",
    { boldPrefix: "2." }
  ),
  makeBullet(
    "Rekan-rekan mahasiswa Program Studi S1 Teknik Informatika Kelas TI24D Universitas Muhammadiyah Cirebon yang senantiasa saling bertukar pikiran, memberikan masukan konstruktif, dan bekerja sama secara harmonis.",
    { boldPrefix: "3." }
  ),
  makeParagraph(
    "Penulis menyadari bahwa dokumen ini masih memiliki ruang penyempurnaan. Oleh karena itu, segala kritik dan saran yang bersifat membangun sangat penulis harapkan. Semoga proposal ini dapat memberikan kontribusi nyata bagi pengembangan keilmuan Rekayasa Perangkat Lunak dan mempermudah tata kelola belajar mahasiswa secara berkelanjutan."
  ),
  new Paragraph({ spacing: { before: 200, after: 40 } }),
  makeParagraphNoIndent("Cirebon, 6 November 2026\nPenyusun,\n\n\n\nYuli Indiyanti", {
    align: AlignmentType.RIGHT,
    bold: true,
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// 3. DAFTAR ISI (hal iii)
children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 240, line: 280 },
    children: [
      new TextRun({
        text: "DAFTAR ISI",
        bold: true,
        font: "Times New Roman",
        size: 28,
      }),
    ],
  })
);

const tocEntries = [
  { title: "KATA PENGANTAR", page: "ii", bold: true },
  { title: "DAFTAR ISI", page: "iii", bold: true },
  { title: "DAFTAR TABEL & GAMBAR", page: "vi", bold: true },
  { title: "RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)", page: "vii", bold: true },
  { title: "BAB I PENDAHULUAN", page: "1", bold: true },
  { title: "  1.1 Latar Belakang Masalah", page: "1" },
  { title: "  1.2 Rumusan Masalah", page: "2" },
  { title: "  1.3 Batasan Masalah & Ruang Lingkup", page: "3" },
  { title: "  1.4 Tujuan Proyek", page: "4" },
  { title: "  1.5 Manfaat Proyek", page: "4" },
  { title: "BAB II LANDASAN TEORI & TINJAUAN PUSTAKA", page: "5", bold: true },
  { title: "  2.1 Konsep Dasar Sistem, Informasi, dan Sistem Informasi", page: "5" },
  { title: "    2.1.1 Landasan Teori Umum Sistem, Informasi, dan Sistem Informasi", page: "5" },
  { title: "    2.1.2 Penerapan pada Proyek Sistem Yuli's Vault", page: "6" },
  { title: "  2.2 Konsep Dasar Pengembangan Sistem", page: "7" },
  { title: "    2.2.1 Metodologi System Development Life Cycle (SDLC)", page: "7" },
  { title: "    2.2.2 Penerapan Pengembangan pada Proyek Yuli's Vault", page: "7" },
  { title: "  2.3 Rekayasa Perangkat Lunak (Tahapan RPL & Model Pengembangan)", page: "8" },
  { title: "    2.3.1 Definisi dan Tahapan Rekayasa Perangkat Lunak", page: "8" },
  { title: "    2.3.2 Model-Model Proses Pengembangan Perangkat Lunak", page: "9" },
  { title: "    2.3.3 Pemilihan & Penerapan Model Agile Scrum pada Yuli's Vault", page: "10" },
  { title: "  2.4 Tinjauan Sistem Domain: Personal Academic Vault & Task Management", page: "11" },
  { title: "    2.4.1 Karakteristik Sistem Informasi Manajemen Tugas & Materi Akademik", page: "11" },
  { title: "    2.4.2 Inovasi Interaktif Yuli's Vault", page: "11" },
  { title: "  2.5 Sistem Asesmen Akademik & Algoritma Kalkulasi Nilai", page: "12" },
  { title: "    2.5.1 Konsep Evaluasi Perkuliahan 5 Kategori Asesmen", page: "12" },
  { title: "    2.5.2 Formulasi Rata-rata Nilai Murni & Prediksi Indeks Huruf Mutu", page: "13" },
  { title: "BAB III ANALISIS KEBUTUHAN & PROFIL PENGGUNA", page: "14", bold: true },
  { title: "  3.1 Segmentasi Target Pengguna", page: "14" },
  { title: "  3.2 User Persona", page: "14" },
  { title: "  3.3 User Journey Mapping", page: "15" },
  { title: "  3.4 Arsitektur Informasi & Peta Situs (Sitemap)", page: "16" },
  { title: "BAB IV SPESIFIKASI FITUR & PERANCANGAN ANTARMUKA (UI/UX)", page: "17", bold: true },
  { title: "  4.1 Spesifikasi Modul Fungsional (Prioritas P0 & P1)", page: "17" },
  { title: "  4.2 Algoritma & Logika Bisnis Sistem", page: "19" },
  { title: "  4.3 Sistem Desain (Design System) & Identitas Visual Luxury Coffee", page: "19" },
  { title: "BAB V ARSITEKTUR TEKNIS & TECH STACK 100% GRATIS", page: "21", bold: true },
  { title: "  5.1 Pilihan Framework Frontend & Animasi", page: "21" },
  { title: "  5.2 Keandalan Arsitektur Data: SQLite Lokal & Server Actions", page: "22" },
  { title: "BAB VI RENCANA KERJA & TIMELINE PELAKSANAAN", page: "23", bold: true },
  { title: "  6.1 Work Breakdown Structure (WBS) Harian (14 Hari Kerja)", page: "23" },
  { title: "  6.2 Matriks Jadwal Pelaksanaan (Gantt Chart 14 Hari)", page: "25" },
  { title: "  6.3 Pembagian Peran & Alokasi Sumber Daya", page: "27" },
  { title: "BAB VII METRIK PENGUJIAN & INDIKATOR KEBERHASILAN", page: "28", bold: true },
  { title: "  7.1 Pengujian Kegunaan (Usability Testing: SUS & SEQ)", page: "28" },
  { title: "  7.2 Pengujian Otomatis Perangkat Lunak (Production Build Test)", page: "29" },
  { title: "  7.3 Metrik Kinerja Teknis & Kecepatan Akses", page: "31" },
  { title: "BAB VIII ESTIMASI ANGGARAN BIAYA (COST ESTIMATION)", page: "32", bold: true },
  { title: "  8.1 Biaya Infrastruktur & Perangkat Lunak (100% Free Stack)", page: "32" },
  { title: "BAB IX MANAJEMEN RISIKO & STRATEGI MITIGASI", page: "34", bold: true },
  { title: "  9.1 Matriks Evaluasi Manajemen Risiko Proyek", page: "34" },
  { title: "  9.2 Strategi Mitigasi dan Rencana Kontinjensi Proyek", page: "35" },
  { title: "BAB X PENUTUP", page: "36", bold: true },
  { title: "  10.1 Kesimpulan Proyek", page: "36" },
  { title: "  10.2 Saran & Rekomendasi Pengembangan Lanjutan", page: "36" },
  { title: "DAFTAR PUSTAKA (REFERENCES)", page: "38", bold: true },
  { title: "LAMPIRAN DOKUMEN", page: "40", bold: true },
];

tocEntries.forEach((entry) => {
  const dotsCount = Math.max(
    3,
    Math.floor((CONTENT_WIDTH - 2000 - entry.title.length * 110) / 100)
  );
  const dots = ".".repeat(dotsCount);

  children.push(
    new Paragraph({
      spacing: { before: 40, after: 40, line: 260 },
      alignment: AlignmentType.BOTH,
      children: [
        new TextRun({
          text: entry.title,
          bold: entry.bold || false,
          font: "Times New Roman",
          size: 22,
          color: "000000",
        }),
        new TextRun({
          text: " " + dots + " ",
          color: "888888",
          font: "Times New Roman",
          size: 20,
        }),
        new TextRun({
          text: entry.page,
          bold: entry.bold || false,
          font: "Times New Roman",
          size: 22,
          color: "000000",
        }),
      ],
    })
  );
});

children.push(new Paragraph({ children: [new PageBreak()] }));

// 4. DAFTAR TABEL & GAMBAR (hal vi)
children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 240, line: 280 },
    children: [
      new TextRun({
        text: "DAFTAR TABEL & GAMBAR",
        bold: true,
        font: "Times New Roman",
        size: 28,
      }),
    ],
  }),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("No. Tabel", { isHeader: true, width: 1400, align: AlignmentType.CENTER }),
          makeCell("Nama Tabel Dokumen", { isHeader: true, width: 5537 }),
          makeCell("Hal.", { isHeader: true, width: 1000, align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel 2.1", { align: AlignmentType.CENTER }),
          makeCell("Komparasi Karakteristik Model Pengembangan Waterfall vs Agile Development"),
          makeCell("10", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel 3.1", { align: AlignmentType.CENTER }),
          makeCell("Tabel User Persona Yuli Indiyanti (Mahasiswa) dan Dosen Pengampu"),
          makeCell("14", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel 4.1", { align: AlignmentType.CENTER }),
          makeCell("Matriks Kebutuhan Fungsional Berdasarkan Prioritas P0 dan P1"),
          makeCell("17", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel 4.2", { align: AlignmentType.CENTER }),
          makeCell("Spesifikasi Sistem Desain (Design System) Palet Warm Chocolate & Glitter Sparkles"),
          makeCell("19", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel 5.1", { align: AlignmentType.CENTER }),
          makeCell("Daftar Teknologi 100% Free Tier Tanpa Syarat Kartu Kredit"),
          makeCell("21", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel 6.1", { align: AlignmentType.CENTER }),
          makeCell("Work Breakdown Structure (WBS) Rinci 14 Hari Kerja"),
          makeCell("23", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel 6.2", { align: AlignmentType.CENTER }),
          makeCell("Matriks Gantt Chart Aktivitas Proyek 2 Minggu (14 Hari)"),
          makeCell("25", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel 6.3", { align: AlignmentType.CENTER }),
          makeCell("Alokasi Peran dan Tanggung Jawab Pengembang"),
          makeCell("27", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel 7.1", { align: AlignmentType.CENTER }),
          makeCell("Skenario dan Target Metrik Usability Testing (TSR, SUS, SEQ)"),
          makeCell("28", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel 7.2", { align: AlignmentType.CENTER }),
          makeCell("Ringkasan Hasil Test Suite Otomatis Produksi (Production Build Verified)"),
          makeCell("29", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel 8.1", { align: AlignmentType.CENTER }),
          makeCell("Rincian Biaya Infrastruktur dan Software (Free Tier Rp 0,-)"),
          makeCell("32", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel 9.1", { align: AlignmentType.CENTER }),
          makeCell("Matriks Manajemen Risiko dan Strategi Mitigasi"),
          makeCell("34", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel L.1", { align: AlignmentType.CENTER }),
          makeCell("Instrumen Kuesioner Pengujian System Usability Scale (SUS)"),
          makeCell("41", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tabel L.2", { align: AlignmentType.CENTER }),
          makeCell("Matriks 5 Kategori Asesmen Resmi Perkuliahan & Alur Portal Dosen"),
          makeCell("42", { align: AlignmentType.CENTER }),
        ],
      }),
    ],
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// 5. RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY) (hal vii)
children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 240, line: 280 },
    children: [
      new TextRun({
        text: "RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)",
        bold: true,
        font: "Times New Roman",
        size: 28,
      }),
    ],
  }),
  makeParagraph(
    "Pengelolaan artefak akademik perkuliahan pada mahasiswa program studi Teknik Informatika sering kali mengalami hambatan fragmentasi informasi. Berkas materi slide, silabus, dokumen tugas, dan catatan tersebar di berbagai saluran tidak resmi seperti grup obrolan WhatsApp dan penyimpanan awan pribadi yang tidak terstruktur. Selain itu, sistem manajemen tugas yang beredar kerap membebankan pengguna dengan pengaturan tingkat prioritas manual ganda serta kalkulator bobot persentase yang rumit, padahal seluruh tugas kuliah pada hakikatnya wajib dikerjakan dan diprioritaskan tinggi demi menunjang nilai akhir mahasiswa."
  ),
  makeParagraph(
    "Untuk mengatasi tantangan nyata tersebut, proposal proyek ini mengajukan perancangan dan implementasi aplikasi web bertajuk \"Yuli's Vault (Yuli's Second Brain)\" di bawah naungan mata kuliah Analisis Design PL. Proyek ini mengintegrasikan pendekatan User-Centered Design (UCD) dan metodologi Agile Scrum dalam siklus sprint intensif selama 2 (dua) minggu (14 hari kerja)."
  ),
  makeTableTitle("Ringkasan", "8 Pilar Keunggulan Inovasi Yuli's Vault"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("No", { isHeader: true, width: 800, align: AlignmentType.CENTER }),
          makeCell("Deskripsi Keunggulan Inovasi Fitur Sistem", { isHeader: true, width: 7137 }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("1.", { align: AlignmentType.CENTER }),
          makeCell("Identitas Visual Aesthetic Warm Chocolate & Coffee: Harmonisasi palet cokelat gelap, moka hangat, dan aksen emas karamel dengan tipografi elegan serta efek partikel gerak lembut Glitter Sparkles dan Animated Girl Avatar (maskot hidup Yuli Indiyanti)."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("2.", { align: AlignmentType.CENTER }),
          makeCell("Vault Authentication & Login Gate: Gerbang masuk minimalis elegan yang melindungi data akademik pribadi dengan perlindungan kredensial serta tombol akses instan Quick Access ('Masuk cepat sebagai Yuli Indiyanti')."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("3.", { align: AlignmentType.CENTER }),
          makeCell("5 Kategori Asesmen Resmi Perkuliahan: Mengadopsi struktur penugasan komprehensif mencakup 👤 Tugas Individu, 👥 Tugas Kelompok, 🚀 Tugas Besar, 📝 Tugas UTS, dan 🎯 Tugas UAS."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("4.", { align: AlignmentType.CENTER }),
          makeCell("Eliminasi Prioritas Manual & Bobot Rumit: Seluruh tugas secara otomatis diposisikan pada prioritas utama (HIGH) karena setiap tugas kuliah penting, serta kalkulasi nilai menggunakan rata-rata murni aritmatika tanpa kalkulator persentase yang membingungkan."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("5.", { align: AlignmentType.CENTER }),
          makeCell("Portal Penilaian Khusus Dosen (Tanpa Login): Rute mandiri `/grade/[id]` yang memungkinkan dosen pengampu memberikan skor angka (0–100) dan evaluasi tugas secara praktis tanpa registrasi akun, disertai selebrasi konfeti interaktif."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("6.", { align: AlignmentType.CENTER }),
          makeCell("Pelacakan Nilai Realistis (Pending Evaluation State): Kartu metrik akademik di beranda secara cerdas menampilkan status riil strip '-' (menunggu penilaian) dan persentase kumpul saat belum ada tugas yang dinilai, serta otomatis menghitung indeks mutu huruf (A/B/C) saat nilai diinput."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("7.", { align: AlignmentType.CENTER }),
          makeCell("In-App Document Viewer & Workspace Terintegrasi: Pengguna dapat membaca materi PDF dan slide langsung di dalam browser tanpa harus mengunduh ulang berkas."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("8.", { align: AlignmentType.CENTER }),
          makeCell("Arsitektur 100% Free Stack: Fullstack berbasis Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma ORM, dan basis data SQLite terintegrasi tanpa biaya operasional langganan bulanan (Rp 0,- / Bulan)."),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 140, after: 100 } }),
  makeParagraph(
    "Dengan perencanaan kerja 14 hari kerja yang terukur, proyek ini berhasil menyelesaikan seluruh target luaran berupa kode sumber fungsional yang lulus kompilasi produksi 100% (Production Build Exit Code 0), pengujian kegunaan dengan target skor System Usability Scale (SUS) >= 80, serta kesiapan implementasi penuh bagi mahasiswa dan dosen pengampu."
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// 6. BAB I PENDAHULUAN (hal 1)
children.push(
  makeChapterTitle("BAB I\nPENDAHULUAN"),
  makeSubchapterTitle("1.1 Latar Belakang Masalah"),
  makeParagraph(
    "Dalam era perkuliahan modern, mahasiswa program studi Teknik Informatika menghadapi lonjakan volume informasi dan penugasan akademik yang sangat dinamis. Setiap semester, mahasiswa mengambil berbagai mata kuliah teknis yang menuntut pengelolaan beragam artefak pembelajaran, seperti: slide perkuliahan dosen dalam format PDF atau PPTX, modul praktikum laboratorium, buku teks elektronik (e-book), rekaman video asistensi, hingga tautan dokumentasi kode sumber eksternal."
  ),
  makeParagraph(
    "Selain pengelolaan materi perkuliahan, mahasiswa juga dihadapkan pada ritme penugasan yang padat dengan berbagai variasi format, mulai dari Tugas Individu mingguan, Tugas Kelompok, Tugas Besar semesteran, Ujian Tengah Semester (UTS), hingga Ujian Akhir Semester (UAS). Permasalahan mendasar yang kerap terjadi adalah penyebaran artefak perkuliahan tersebut pada berbagai platform yang terfragmentasi tanpa adanya repositori tunggal yang terintegrasi (Single Source of Truth). Berkas materi sering kali dibagikan melalui grup percakapan WhatsApp yang mudah tertimbun, folder unduhan komputer lokal yang acak, serta sistem LMS kampus yang sering kali lambat diakses."
  ),
  makeParagraph(
    "Berdasarkan survei dan evaluasi alur belajar mahasiswa, terdapat 4 (empat) titik kendala utama (pain points) yang dialami:"
  ),
  makeBullet(
    "Disorganisasi Berkas & Penelusuran Lambat: Mahasiswa membutuhkan waktu lama untuk menemukan kembali materi perkuliahan dan soal tugas saat masa ujian tiba.",
    { boldPrefix: "1." }
  ),
  makeBullet(
    "Risiko Keterlambatan Pengumpulan (Missed Deadlines): Ketiadaan sistem deteksi urgensi berbasis waktu menyebabkan tugas kuliah terlewat atau dikerjakan secara terburu-buru.",
    { boldPrefix: "2." }
  ),
  makeBullet(
    "Kekakuan Sistem Asesmen Konvensional: Banyak aplikasi manajemen tugas menuntut pemilihan tingkat prioritas manual (rendah/sedang/tinggi) dan kalkulator persentase bobot yang rumit, padahal dalam kenyataan dunia perkuliahan seluruh tugas wajib dikerjakan dan diprioritaskan tinggi demi menunjang indeks prestasi mahasiswa.",
    { boldPrefix: "3." }
  ),
  makeBullet(
    "Kelelahan Visual (Visual Fatigue): Mayoritas antarmuka aplikasi produktivitas menggunakan skema warna yang terlalu kontras atau monoton, sehingga melelahkan mata ketika digunakan untuk belajar larut malam.",
    { boldPrefix: "4." }
  ),
  makeParagraph(
    "Kelemahan-kelemahan mendasar di atas membuktikan bahwa mahasiswa membutuhkan sebuah solusi sistem informasi akademik personal yang terpusat, responsif, aman, estetis, dan dilengkapi fitur kolaboratif yang memudahkan dosen memberikan evaluasi nilai secara langsung. Oleh karena itu, diusulkanlah pengembangan website \"Yuli's Vault (Yuli's Second Brain)\"."
  ),
  makeSubchapterTitle("1.2 Rumusan Masalah"),
  makeParagraph("Berdasarkan latar belakang di atas, rumusan masalah dalam proyek ini dirumuskan sebagai berikut:"),
  makeBullet("Bagaimana merancang antarmuka pengguna (UI) dan pengalaman pengguna (UX) website manajemen akademik pribadi yang estetis, mewah, dan menenangkan menggunakan tema Luxury Warm Chocolate & Dark Brown dengan efek Glitter Sparkles dan maskot animasi?", { boldPrefix: "1." }),
  makeBullet("Bagaimana mengimplementasikan modul Task & Deadline Tracker yang mengintegrasikan 5 kategori asesmen resmi perkuliahan dengan eliminasi beban kalkulator bobot rumit dan prioritas manual ganda?", { boldPrefix: "2." }),
  makeBullet("Bagaimana membangun Portal Penilaian Khusus Dosen tanpa login melalui rute unik `/grade/[id]` agar dosen pengampu dapat langsung menginput skor nilai dan catatan evaluasi secara instan?", { boldPrefix: "3." }),
  makeBullet("Bagaimana membangun arsitektur sistem fullstack modern berbasis Next.js 15, React 19, TypeScript, Prisma ORM, dan SQLite yang 100% bebas biaya operasional dalam masa pengerjaan sprint 14 hari?", { boldPrefix: "4." }),

  makeSubchapterTitle("1.3 Batasan Masalah & Ruang Lingkup"),
  makeParagraph("Agar proyek dapat diselesaikan secara tepat waktu, efektif, dan berkualitas tinggi dalam batas waktu 2 (dua) minggu kerja, ruang lingkup dibatasi pada:"),
  makeBullet("Fokus Pengguna Utama: Mahasiswa aktif S1 Teknik Informatika Universitas Muhammadiyah Cirebon atas nama Yuli Indiyanti (NIM: 240511130 / Kelas TI24D).", { boldPrefix: "a." }),
  makeBullet("Akses Tamu Dosen: Akses penilaian dosen dibatasi pada rute publik per tautan tugas `/grade/[id]` tanpa hak mengubah data mata kuliah atau menghapus arsip materi.", { boldPrefix: "b." }),
  makeBullet("Kategori Asesmen: Dibatasi pada 5 kategori resmi perkuliahan: Tugas Individu, Tugas Kelompok, Tugas Besar, Tugas UTS, dan Tugas UAS.", { boldPrefix: "c." }),
  makeBullet("Penyimpanan Berkas: Menggunakan penyimpanan lokal server (`public/uploads`) yang mendukung berkas PDF, dokumen Office, ZIP, dan gambar.", { boldPrefix: "d." }),
  makeBullet("Arsitektur Teknologi: Menggunakan Next.js 15 App Router, React 19, Tailwind CSS, Prisma ORM, dan SQLite (`prisma/dev.db`).", { boldPrefix: "e." }),

  makeSubchapterTitle("1.4 Tujuan Proyek"),
  makeParagraph("Tujuan yang hendak dicapai melalui proyek perancangan website ini mencakup:"),
  makeBullet("Tujuan Desain & Estetika: Menghasilkan antarmuka web bertema Luxury Warm Chocolate & Dark Brown yang elegan, dilengkapi animasi glitter lembut dan maskot animasi perempuan.", { boldPrefix: "1." }),
  makeBullet("Tujuan Fungsional & Kolaboratif: Membangun sistem pelacakan tugas dengan 5 kategori asesmen, papan Kanban, serta portal penilaian dosen langsung via tautan.", { boldPrefix: "2." }),
  makeBullet("Tujuan Teknis & Integritas: Membangun aplikasi web fullstack yang lulus kompilasi build produksi 100% bebas error serta didukung basis data SQLite persisten.", { boldPrefix: "3." }),
  makeBullet("Tujuan Kecepatan Eksekusi: Membuktikan efektivitas framework Agile Scrum dalam menuntaskan perancangan dan implementasi produk digital secara intensif dalam 14 hari.", { boldPrefix: "4." }),

  makeSubchapterTitle("1.5 Manfaat Proyek"),
  makeBullet("Bagi Mahasiswa: Memusatkan seluruh materi, tugas, dan rekap nilai dalam satu vault pribadi, meniadakan stres akibat lupa deadline, dan mempercepat temu-balik materi kuliah hingga di bawah 5 detik.", { boldPrefix: "•" }),
  makeBullet("Bagi Dosen Pengampu: Memudahkan pemberian skor nilai dan evaluasi kualitatif secara cepat tanpa birokrasi pendaftaran akun.", { boldPrefix: "•" }),
  makeBullet("Bagi Dunia Akademik: Memberikan referensi nyata mengenai penerapan Rekayasa Perangkat Lunak dan arsitektur Next.js modern pada aplikasi produktivitas perkuliahan.", { boldPrefix: "•" }),
  new Paragraph({ children: [new PageBreak()] })
);

// 7. BAB II LANDASAN TEORI & TINJAUAN PUSTAKA (hal 5)
children.push(
  makeChapterTitle("BAB II\nLANDASAN TEORI & TINJAUAN PUSTAKA"),
  makeSubchapterTitle("2.1 Konsep Dasar Sistem, Informasi, dan Sistem Informasi"),
  makeSubSubchapterTitle("2.1.1 Landasan Teori Umum Sistem, Informasi, dan Sistem Informasi"),
  makeParagraph(
    "Penyusunan proposal perancangan perangkat lunak memerlukan pemahaman konseptual yang kokoh mengenai tiga entitas fundamental: sistem, informasi, dan sistem informasi [1]."
  ),
  makeParagraph(
    "Secara teoritis umum, sistem didefinisikan sebagai kumpulan elemen, komponen, atau subsistem yang saling terorganisasi, berinteraksi secara dinamis, dan saling bergantung guna mencapai sasaran tertentu secara terpadu [1]. Suatu sistem yang utuh memiliki karakteristik: komponen (components), batas sistem (boundary), lingkungan luar (environment), penghubung (interface), masukan (input), pengolahan (process), keluaran (output), serta tujuan (goal)."
  ),
  makeParagraph(
    "Informasi didefinisikan sebagai data mentah yang telah diproses, distrukturkan, dan memiliki signifikansi bagi penerimanya sebagai dasar pengambilan keputusan [1]. Kualitas informasi ditentukan oleh akurasi (accurate), ketepatan waktu (timely), relevansi (relevance), dan kelengkapan (complete). Sistem Informasi merupakan integrasi sosio-teknis yang memadukan sumber daya manusia, perangkat keras, perangkat lunak, jaringan, serta prosedur operasional untuk mengolah dan mendistribusikan informasi [1]."
  ),
  makeSubSubchapterTitle("2.1.2 Penerapan pada Proyek Sistem Yuli's Vault"),
  makeParagraph("Penerapan konsep sistem informasi pada Yuli's Vault diwujudkan melalui:"),
  makeBullet("Masukan (Input): Berkas materi kuliah (PDF/slide), rincian tugas (judul, deadline, kategori asesmen), berkas soal dosen, serta input nilai skor (0–100) dan evaluasi dari dosen pengampu.", { boldPrefix: "a." }),
  makeBullet("Pengolahan (Process): Algoritma penghitungan rata-rata nilai murni aritmatika, kalkulasi sisa waktu deadline secara real-time, pengelompokan silabus 16 pertemuan, dan verifikasi sesi login gate.", { boldPrefix: "b." }),
  makeBullet("Keluaran (Output): Visualisasi Kanban board tugas, kartu ringkasan metrik akademik di beranda, lembar penilaian dosen interaktif dengan selebrasi konfeti, serta pratinjau dokumen in-app.", { boldPrefix: "c." }),
  makeBullet("Batas & Lingkungan (Boundary): Batas sistem mencakup antarmuka peramban web responsif dan server database lokal SQLite, dengan lingkungan luar berupa dosen pengampu yang mengakses rute `/grade/[id]`.", { boldPrefix: "d." }),

  makeSubchapterTitle("2.2 Konsep Dasar Pengembangan Sistem"),
  makeSubSubchapterTitle("2.2.1 Metodologi System Development Life Cycle (SDLC)"),
  makeParagraph(
    "Pengembangan sistem didefinisikan sebagai serangkaian aktivitas dan prosedur terstruktur yang ditempuh analis dan pengembang perangkat lunak untuk menyusun sistem baru atau memodifikasi sistem lama yang inefisien [2]. SDLC menyediakan pedoman rekayasa mulai dari studi kelayakan, analisis kebutuhan, perancangan, pengkodean, pengujian, hingga implementasi [2]."
  ),
  makeSubSubchapterTitle("2.2.2 Penerapan Pengembangan pada Proyek Yuli's Vault"),
  makeParagraph(
    "Penerapan SDLC pada Yuli's Vault difokuskan pada penyelesaian hambatan spesifik mahasiswa Teknik Informatika: sentralisasi materi yang terserak, visualisasi tenggat waktu, dan integrasi penilaian dosen tanpa login dengan mengutamakan zero-cost architecture berbasis SQLite dan Next.js Server Actions."
  ),

  makeSubchapterTitle("2.3 Rekayasa Perangkat Lunak (Tahapan RPL & Model Pengembangan)"),
  makeSubSubchapterTitle("2.3.1 Definisi dan Tahapan Rekayasa Perangkat Lunak"),
  makeParagraph(
    "Rekayasa Perangkat Lunak (RPL / Software Engineering) didefinisikan oleh standar internasional IEEE Standard 610.12 sebagai aplikasi pendekatan yang sistematis, disiplin, dan terukur dalam pengembangan, pengoperasian, dan pemeliharaan perangkat lunak [3]. Tahapannya mencakup: Analisis Kebutuhan, Perancangan Sistem, Implementasi & Koding, Pengujian, serta Pemeliharaan [3], [4]."
  ),
  makeSubSubchapterTitle("2.3.2 Model-Model Proses Pengembangan Perangkat Lunak"),
  makeParagraph(
    "Dalam rekayasa perangkat lunak, terdapat model Waterfall yang linier sekuensial dan model Agile Scrum yang iteratif adaptif [3], [4]. Perbandingan kedua model disajikan pada Tabel 2.1:"
  ),
  makeTableTitle("2.1", "Komparasi Karakteristik Model Pengembangan Waterfall vs Agile Development"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("Karakteristik Evaluasi", { isHeader: true, width: 2300 }),
          makeCell("Model Sekuensial Linier (Waterfall)", { isHeader: true, width: 2800 }),
          makeCell("Model Adaptif Inkremental (Agile Scrum)", { isHeader: true, width: 2837 }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Pendekatan Alur Kerja", { bold: true }),
          makeCell("Sekuensial linier ketat, fase demi fase harus selesai berurutan."),
          makeCell("Iteratif dan bertahap melalui siklus Sprint 1–2 minggu."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Fleksibilitas Perubahan", { bold: true }),
          makeCell("Sangat kaku; perubahan di tengah jalan memerlukan biaya besar."),
          makeCell("Sangat adaptif terhadap perubahan feedback pengguna [3]."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Keterlibatan Pengguna", { bold: true }),
          makeCell("Dominan hanya di awal dan di akhir proyek."),
          makeCell("Terlibat terus-menerus pada setiap peninjauan sprint."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Keluaran Perangkat Lunak", { bold: true }),
          makeCell("Perangkat lunak baru dapat dijalankan di fase akhir siklus."),
          makeCell("Working software fungsional dihasilkan di setiap akhir sprint [4]."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Kesesuaian Proyek", { bold: true }),
          makeCell("Proyek dengan spesifikasi statis jangka panjang."),
          makeCell("Proyek antarmuka web modern, inovasi interaktif, dan sprint kilat."),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 100, after: 100 } }),
  makeSubSubchapterTitle("2.3.3 Pemilihan & Penerapan Model Agile Scrum pada Yuli's Vault"),
  makeParagraph(
    "Proyek Yuli's Vault memilih Model Agile Scrum [3], [4] dengan durasi 14 hari kerja yang terbagi menjadi 2 sprint: Sprint 1 (Hari 1–7) berfokus pada fondasi arsitektur, skema basis data, sistem desain visual cokelat hangat, dan CRUD modul akademik; Sprint 2 (Hari 8–14) berfokus pada Kanban board, 5 kategori asesmen, Portal Penilaian Dosen tanpa login, pengujian build produksi, dan penyusunan proposal formal."
  ),

  makeSubchapterTitle("2.4 Tinjauan Sistem Domain: Personal Academic Vault & Task Management"),
  makeSubSubchapterTitle("2.4.1 Karakteristik Sistem Informasi Manajemen Tugas & Materi Akademik"),
  makeParagraph(
    "Sistem informasi akademik skala institusi (SIAKAD) dirancang untuk kebutuhan administratif makro (KRS, jadwal massal, KHS semesteran), namun tidak memfasilitasi kebutuhan manajemen belajar mikro harian mahasiswa [5]. Mahasiswa membutuhkan Personal Second Brain untuk mengarsipkan modul bab tertentu, mencatat tenggat waktu mingguan, dan menyimpan referensi belajar secara instan [5]."
  ),
  makeSubSubchapterTitle("2.4.2 Inovasi Interaktif Yuli's Vault"),
  makeParagraph(
    "Yuli's Vault menghadirkan inovasi berupa integrasi Portal Penilaian Dosen tanpa login, antarmuka mewah bertema Warm Chocolate & Dark Brown, partikel gerak lembut Glitter Sparkles, dan maskot hidup Animated Girl Avatar yang membuat kegiatan belajar tidak monoton."
  ),

  makeSubchapterTitle("2.5 Sistem Asesmen Akademik & Algoritma Kalkulasi Nilai"),
  makeSubSubchapterTitle("2.5.1 Konsep Evaluasi Perkuliahan 5 Kategori Asesmen"),
  makeParagraph(
    "Sistem mengadopsi 5 pilar penugasan perkuliahan: Tugas Individu, Tugas Kelompok, Tugas Besar, Tugas UTS, dan Tugas UAS. Seluruh tugas secara otomatis diposisikan pada prioritas utama (HIGH) karena setiap penugasan memiliki andil penting terhadap kelulusan."
  ),
  makeSubSubchapterTitle("2.5.2 Formulasi Rata-rata Nilai Murni & Prediksi Indeks Huruf Mutu"),
  makeParagraph(
    "Kalkulasi nilai akhir mata kuliah menggunakan rata-rata murni aritmatika: Rata-rata = (Total Skor Tugas Dinilai) / (Jumlah Tugas Dinilai). Indeks huruf mutu dipetakan secara deterministik: Skor >= 85 (A), 78-84 (AB), 70-77 (B), 63-69 (BC), 55-62 (C), 40-54 (D), dan < 40 (E). Jika belum ada tugas yang dinilai dosen, sistem menampilkan status pending evaluation berupa tanda strip '-' secara elegan."
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// 8. BAB III ANALISIS KEBUTUHAN & PROFIL PENGGUNA (hal 14)
children.push(
  makeChapterTitle("BAB III\nANALISIS KEBUTUHAN & PROFIL PENGGUNA"),
  makeSubchapterTitle("3.1 Segmentasi Target Pengguna"),
  makeParagraph("Pengguna sistem Yuli's Vault terbagi menjadi dua segmen utama:"),
  makeBullet("Mahasiswa Pengusul (Yuli Indiyanti / 240511130 / TI24D): Pemilik utama vault yang mengelola semester, mata kuliah, mengunggah materi, mengatur tugas, dan memantau estimasi IPK.", { boldPrefix: "1." }),
  makeBullet("Dosen Pengampu: Pihak penilai eksternal yang menerima tautan penilaian tugas `/grade/[id]` untuk menginputkan nilai skor angka dan catatan evaluasi.", { boldPrefix: "2." }),

  makeSubchapterTitle("3.2 User Persona"),
  makeTableTitle("3.1", "Tabel User Persona Yuli Indiyanti (Mahasiswa) dan Dosen Pengampu"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("Atribut Evaluasi", { isHeader: true, width: 2300 }),
          makeCell("Persona 1: Yuli Indiyanti (Mahasiswa)", { isHeader: true, width: 2800 }),
          makeCell("Persona 2: Dosen Pengampu", { isHeader: true, width: 2837 }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Profil Demografis", { bold: true }),
          makeCell("Mahasiswi S1 Teknik Informatika UMC, aktif kuliah, gemar kerapian digital."),
          makeCell("Dosen pengampu mata kuliah teknik informatika, jadwal padat, efisien."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Kebutuhan Kunci", { bold: true }),
          makeCell("Repositori materi satu pintu, pelacak tugas tanpa ribet bobot/prioritas."),
          makeCell("Kemudahan menilai tugas mahasiswa secara cepat langsung via tautan tanpa login."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Titik Frustrasi (Pain Points)", { bold: true }),
          makeCell("Materi terserak di WA/Drive, antarmuka aplikasi lain kaku dan bikin mata lelah."),
          makeCell("Birokrasi login LMS kampus yang lambat saat jam sibuk penginputan nilai."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Fitur Solusi yang Dibutuhkan", { bold: true }),
          makeCell("Vault Login Gate, tema Warm Chocolate & Glitter, 5 kategori asesmen resmi."),
          makeCell("Portal Penilaian Dosen `/grade/[id]` dengan unduh soal dan feedback instan."),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 100, after: 100 } }),

  makeSubchapterTitle("3.3 User Journey Mapping"),
  makeParagraph("Alur perjalanan pengguna dirancang memangkas friksi operasional belajar:"),
  makeBullet("Tahap 1: Gerbang Masuk — Pengguna disambut oleh Vault Login Gate dengan maskot Animated Girl Avatar dan tombol Quick Access.", { boldPrefix: "•" }),
  makeBullet("Tahap 2: Tinjauan Beranda — Dashboard menampilkan 4 kartu metrik cerdas, jadwal kuliah terdekat, dan daftar tenggat waktu berstatus riil.", { boldPrefix: "•" }),
  makeBullet("Tahap 3: Eksplorasi Materi — Pengguna membuka mata kuliah, membaca silabus 16 pertemuan, dan membuka dokumen PDF langsung di browser.", { boldPrefix: "•" }),
  makeBullet("Tahap 4: Pengelolaan Tugas — Menambah tugas dengan 5 kategori asesmen, memantau Kanban board, dan membagikan tautan penilaian ke dosen.", { boldPrefix: "•" }),
  makeBullet("Tahap 5: Evaluasi Nilai Dosen — Dosen membuka tautan `/grade/[id]`, memasukkan skor nilai dan feedback, yang langsung tersinkronisasi ke vault mahasiswa.", { boldPrefix: "•" }),

  makeSubchapterTitle("3.4 Arsitektur Informasi & Peta Situs (Sitemap)"),
  makeParagraph("Peta situs Yuli's Vault disusun secara modular:"),
  makeBullet("1. Vault Login Gate (`/login`): Verifikasi kredensial dan tombol Quick Access.", { boldPrefix: "•" }),
  makeBullet("2. Beranda Dashboard (`/`): Ringkasan metrik akademik, jadwal perkuliahan, dan tenggat waktu tugas.", { boldPrefix: "•" }),
  makeBullet("3. Mata Kuliah (`/courses` & `/courses/[id]`): Daftar kartu mata kuliah, detail silabus 16 pertemuan, workspace catatan Markdown, dan rekapitulasi nilai tugas.", { boldPrefix: "•" }),
  makeBullet("4. Tugas & Status (`/assignments`): Papan Kanban drag-and-drop 4 tahap pengerjaan, tabel terstruktur, dan filter 5 kategori asesmen.", { boldPrefix: "•" }),
  makeBullet("5. Repositori Materi (`/materials` & `/materials/[id]`): Daftar berkas kuliah, tagging filter, dan In-App Document Previewer.", { boldPrefix: "•" }),
  makeBullet("6. Rekap Nilai & Analitika (`/analytics`): Kalkulasi rata-rata nilai murni, estimasi IPK semester, dan status capaian mutu.", { boldPrefix: "•" }),
  makeBullet("7. Portal Penilaian Dosen (`/grade/[id]`): Rute publik khusus dosen pengampu untuk input nilai skor dan catatan evaluasi.", { boldPrefix: "•" }),
  makeBullet("8. Pengaturan & Cadangan (`/settings`): Manajemen profil, ekspor data JSON, ekspor CSV, dan pemilih dataset demo.", { boldPrefix: "•" }),
  new Paragraph({ children: [new PageBreak()] })
);

// 9. BAB IV SPESIFIKASI FITUR & PERANCANGAN ANTARMUKA PENGGUNA (UI/UX) (hal 17)
children.push(
  makeChapterTitle("BAB IV\nSPESIFIKASI FITUR & PERANCANGAN ANTARMUKA PENGGUNA (UI/UX)"),
  makeSubchapterTitle("4.1 Spesifikasi Modul Fungsional (Prioritas P0 & P1)"),
  makeTableTitle("4.1", "Matriks Kebutuhan Fungsional Berdasarkan Prioritas P0 dan P1"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("ID Fitur", { isHeader: true, width: 1200, align: AlignmentType.CENTER }),
          makeCell("Nama Modul & Deskripsi Fungsional", { isHeader: true, width: 4437 }),
          makeCell("Tingkat Prioritas", { isHeader: true, width: 1300, align: AlignmentType.CENTER }),
          makeCell("Keterkaitan Sistem", { isHeader: true, width: 1000, align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("MOD-01", { align: AlignmentType.CENTER }),
          makeCell("Vault Authentication & Login Gate: Gerbang masuk minimalis dengan tombol Quick Access Yuli Indiyanti."),
          makeCell("P0 (Wajib)", { bold: true, align: AlignmentType.CENTER }),
          makeCell("Keamanan", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("MOD-02", { align: AlignmentType.CENTER }),
          makeCell("Manajemen Mata Kuliah: Kode, nama, SKS, jadwal, ruangan, dan pemilih warna identitas MK."),
          makeCell("P0 (Wajib)", { bold: true, align: AlignmentType.CENTER }),
          makeCell("Akademik", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("MOD-03", { align: AlignmentType.CENTER }),
          makeCell("Silabus 16 Pertemuan: Pemetaan kronologis materi dan tugas ke dalam pertemuan perkuliahan."),
          makeCell("P1 (Penting)", { align: AlignmentType.CENTER }),
          makeCell("Kurikulum", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("MOD-04", { align: AlignmentType.CENTER }),
          makeCell("In-App Document Viewer: Pembaca dokumen PDF dan slide langsung di peramban tanpa unduh ulang."),
          makeCell("P0 (Wajib)", { bold: true, align: AlignmentType.CENTER }),
          makeCell("UI/UX & Visual", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("MOD-05", { align: AlignmentType.CENTER }),
          makeCell("Papan Kanban 4 Tahap: Visualisasi tugas (Belum Dimulai, Dikerjakan, Siap Dikumpulkan, Selesai)."),
          makeCell("P0 (Wajib)", { bold: true, align: AlignmentType.CENTER }),
          makeCell("Manajemen", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("MOD-06", { align: AlignmentType.CENTER }),
          makeCell("5 Kategori Asesmen Resmi: Klasifikasi Tugas Individu, Kelompok, Tugas Besar, UTS, dan UAS."),
          makeCell("P0 (Wajib)", { bold: true, align: AlignmentType.CENTER }),
          makeCell("Asesmen", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("MOD-07", { align: AlignmentType.CENTER }),
          makeCell("Portal Penilaian Dosen Tanpa Login: Tautan publik `/grade/[id]` untuk input skor nilai dan feedback."),
          makeCell("P0 (Wajib)", { bold: true, align: AlignmentType.CENTER }),
          makeCell("Evaluasi", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("MOD-08", { align: AlignmentType.CENTER }),
          makeCell("Detektor Urgensi Waktu: Penghitung sisa waktu menuju deadline dengan penanda visual warna."),
          makeCell("P0 (Wajib)", { bold: true, align: AlignmentType.CENTER }),
          makeCell("Notifikasi", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("MOD-09", { align: AlignmentType.CENTER }),
          makeCell("Rekapitulasi IPK & Status Riil: Kalkulasi rata-rata murni dengan penanda status pending dinamis."),
          makeCell("P0 (Wajib)", { bold: true, align: AlignmentType.CENTER }),
          makeCell("Analitika", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("MOD-10", { align: AlignmentType.CENTER }),
          makeCell("Cadangan & Ekspor Data: Pencadangan basis data ke format JSON dan ekspor nilai ke CSV."),
          makeCell("P1 (Penting)", { align: AlignmentType.CENTER }),
          makeCell("Backup", { align: AlignmentType.CENTER }),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 140, after: 100 } }),

  makeSubchapterTitle("4.2 Algoritma & Logika Bisnis Sistem"),
  makeParagraph("Logika bisnis sistem dirancang dengan prinsip penyederhanaan beban kognitif:"),
  makeBullet("Logika Otomasi Prioritas Tinggi: Sistem secara otomatis menetapkan `priority: 'HIGH'` untuk setiap tugas baru, sehingga pengguna tidak perlu memilih prioritas manual.", { boldPrefix: "1." }),
  makeBullet("Logika Kalkulasi Rata-rata Murni: Rata-rata nilai dihitung dari jumlahan skor dibagi jumlah tugas yang telah dinilai oleh dosen.", { boldPrefix: "2." }),
  makeBullet("Logika Pending Grading State: Jika tugas belum dinilai dosen, sistem menampilkan nilai '-' dan status 'Menunggu penilaian dari dosen'.", { boldPrefix: "3." }),
  makeBullet("Logika Sinkronisasi Nilai Dosen: Saat dosen menekan tombol submit pada `/grade/[id]`, Server Action memperbarui kolom `score`, `gradeLetter`, dan `lecturerFeedback` pada tabel `Assignment` secara real-time.", { boldPrefix: "4." }),

  makeSubchapterTitle("4.3 Sistem Desain (Design System) & Identitas Visual Luxury Coffee"),
  makeParagraph("Sistem menggunakan panduan visual Luxury Warm Chocolate & Dark Brown:"),
  makeTableTitle("4.2", "Spesifikasi Sistem Desain (Design System) Palet Warm Chocolate & Glitter Sparkles"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("Elemen Desain", { isHeader: true, width: 2200 }),
          makeCell("Spesifikasi Implementasi", { isHeader: true, width: 2500 }),
          makeCell("Alasan & Filosofi Visual", { isHeader: true, width: 3237 }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Warna Utama (Primary)", { bold: true }),
          makeCell("Dark Brown (#2A1810 / #3D2517)"),
          makeCell("Mencerminkan ketenangan, kemewahan, dan kenyamanan mata saat belajar."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Warna Aksen Hangat", { bold: true }),
          makeCell("Caramel Bronze (#8B5A2B / #D4A373)"),
          makeCell("Memberikan aksen elegan pada tombol aksi, border seleksi, dan lencana."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Warna Latar (Surface)", { bold: true }),
          makeCell("Warm Cream Coffee (#FFFDFB / #F7F2EB)"),
          makeCell("Menghindari putih steril agar antarmuka tampak hangat dan estetik."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Efek Animasi Interaktif", { bold: true }),
          makeCell("Glitter Sparkles (Bintang Berkerlip)"),
          makeCell("Menghadirkan sentuhan estetik cantik yang hidup namun tidak mengganggu."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Maskot Visual", { bold: true }),
          makeCell("Animated Girl Avatar"),
          makeCell("Ilustrasi perempuan berhijab anggun yang merepresentasikan Yuli Indiyanti."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tipografi Judul & Body", { bold: true }),
          makeCell("Plus Jakarta Sans / Inter"),
          makeCell("Keterbacaan teks yang sangat tinggi pada perangkat desktop maupun mobile."),
        ],
      }),
    ],
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// 10. BAB V ARSITEKTUR TEKNIS & TECH STACK 100% GRATIS (hal 21)
children.push(
  makeChapterTitle("BAB V\nARSITEKTUR TEKNIS & TECH STACK 100% GRATIS"),
  makeSubchapterTitle("5.1 Pilihan Framework Frontend & Animasi"),
  makeParagraph(
    "Seluruh komponen teknologi yang digunakan berlisensi open-source atau memanfaatkan tier gratis permanen tanpa memerlukan kartu kredit:"
  ),
  makeTableTitle("5.1", "Daftar Teknologi 100% Free Tier Tanpa Syarat Kartu Kredit"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("Lapisan Arsitektur", { isHeader: true, width: 2000 }),
          makeCell("Pilihan Teknologi (100% Free)", { isHeader: true, width: 2700 }),
          makeCell("Keunggulan Teknis & Status Biaya", { isHeader: true, width: 3237 }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Fullstack Framework", { bold: true }),
          makeCell("Next.js 15 App Router & React 19"),
          makeCell("Open-source MIT. Performa Server Components dan Server Actions instan."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Bahasa Pemrograman", { bold: true }),
          makeCell("TypeScript 5"),
          makeCell("Type-safety penuh mencegah runtime error dan inkonsistensi data."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Styling & Animasi", { bold: true }),
          makeCell("Tailwind CSS + Canvas-Confetti"),
          makeCell("Utility-first styling dengan sistem tema luxury chocolate dan selebrasi."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Basis Data Relasional", { bold: true }),
          makeCell("SQLite via Prisma ORM"),
          makeCell("100% gratis, embedded storage, zero maintenance, mudah dicadangkan."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Ikonografi & Aset", { bold: true }),
          makeCell("Lucide React Icons"),
          makeCell("Open-source bebas royalti dengan ribuan ikon vektor modern."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hosting & Deployment", { bold: true }),
          makeCell("Vercel Production Edge CDN"),
          makeCell("100% gratis selamanya untuk proyek akademik mahasiswa."),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 140, after: 100 } }),

  makeSubchapterTitle("5.2 Keandalan Arsitektur Data: SQLite Lokal & Server Actions"),
  makeParagraph(
    "Arsitektur data Yuli's Vault mengombinasikan penyimpanan SQLite lokal yang tangguh dengan Next.js Server Actions. Hal ini menjamin:"
  ),
  makeBullet("Kecepatan Akses Tinggi: Query data dieksekusi secara lokal di server Next.js tanpa beban koneksi jaringan pihak ketiga.", { boldPrefix: "•" }),
  makeBullet("Bebas Biaya Server: Tidak membutuhkan langganan database cloud berbayar (Supabase/AWS RDS).", { boldPrefix: "•" }),
  makeBullet("Kemudahan Portabilitas: Seluruh database tersimpan dalam berkas tunggal `prisma/dev.db` yang dapat dipindahkan atau diekspor ke JSON kapan saja.", { boldPrefix: "•" }),
  new Paragraph({ children: [new PageBreak()] })
);

// 11. BAB VI RENCANA KERJA & TIMELINE PELAKSANAAN (hal 23)
children.push(
  makeChapterTitle("BAB VI\nRENCANA KERJA & TIMELINE PELAKSANAAN"),
  makeSubchapterTitle("6.1 Work Breakdown Structure (WBS) Harian (14 Hari Kerja)"),
  makeParagraph("Rincian pelaksanaan proyek selama 14 hari kerja (2 minggu) disajikan pada Tabel 6.1:"),
  makeTableTitle("6.1", "Work Breakdown Structure (WBS) Rinci 14 Hari Kerja"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("Hari", { isHeader: true, width: 1000, align: AlignmentType.CENTER }),
          makeCell("Fase Proyek", { isHeader: true, width: 1800 }),
          makeCell("Aktivitas Teknis & Desain", { isHeader: true, width: 3337 }),
          makeCell("Luaran (Deliverables)", { isHeader: true, width: 1800 }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 1", { align: AlignmentType.CENTER }),
          makeCell("Inisiasi & Analisis"),
          makeCell("Kickoff proyek, analisis kebutuhan pengguna Yuli Indiyanti, dan perumusan fitur akademik."),
          makeCell("Dokumen Kebutuhan & Matriks MoSCoW"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 2", { align: AlignmentType.CENTER }),
          makeCell("Arsitektur Informasi"),
          makeCell("Penyusunan sitemap, pemodelan data relasional Prisma, dan inisialisasi basis data SQLite."),
          makeCell("Skema Prisma & Diagram ERD"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 3", { align: AlignmentType.CENTER }),
          makeCell("Desain Sistem Visual"),
          makeCell("Penyusunan palet Luxury Warm Chocolate, komponen Glitter Sparkles, dan maskot Animated Avatar."),
          makeCell("Design System & Global Shell"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 4", { align: AlignmentType.CENTER }),
          makeCell("Gerbang Masuk"),
          makeCell("Implementasi Vault Login Gate, proteksi rute, dan tombol Quick Access Yuli Indiyanti."),
          makeCell("Modul Autentikasi Vault"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 5", { align: AlignmentType.CENTER }),
          makeCell("Manajemen Kuliah"),
          makeCell("CRUD mata kuliah, silabus 16 pertemuan, jadwal mingguan, dan pemilih warna identitas MK."),
          makeCell("Halaman Mata Kuliah Lengkap"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 6", { align: AlignmentType.CENTER }),
          makeCell("Repositori Materi"),
          makeCell("Multi-file upload lokal `/api/upload`, kategorisasi tag, dan In-App Document Previewer."),
          makeCell("Repositori Materi Berfungsi"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 7", { align: AlignmentType.CENTER }),
          makeCell("Review Sprint 1"),
          makeCell("Evaluasi milestone tengah, pengujian integrasi database SQLite, dan sinkronisasi Git."),
          makeCell("Milestone 1 Terverifikasi"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 8", { align: AlignmentType.CENTER }),
          makeCell("Papan Kanban Tugas"),
          makeCell("Pengembangan Kanban drag-and-drop 4 tahap status dan detektor batas waktu deadline."),
          makeCell("Papan Kanban Interaktif"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 9", { align: AlignmentType.CENTER }),
          makeCell("5 Kategori Asesmen"),
          makeCell("Implementasi 5 kategori asesmen (Individu, Kelompok, Proyek, UTS, UAS) dan eliminasi bobot rumit."),
          makeCell("Modal Tugas & Filter Kategori"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 10", { align: AlignmentType.CENTER }),
          makeCell("Portal Dosen"),
          makeCell("Pembangunan rute publik `/grade/[id]` untuk penilaian dosen langsung tanpa login."),
          makeCell("Halaman Penilaian Dosen"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 11", { align: AlignmentType.CENTER }),
          makeCell("Kalkulasi Nilai Murni"),
          makeCell("Implementasi rata-rata murni, status pending evaluation dinamis, dan efek selebrasi konfeti."),
          makeCell("Sinkronisasi Nilai Real-Time"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 12", { align: AlignmentType.CENTER }),
          makeCell("Analitika & KHS"),
          makeCell("Halaman rekapitulasi IPK, tabel KHS per mata kuliah, dan ekspor data CSV/JSON."),
          makeCell("Modul Analitika Lengkap"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 13", { align: AlignmentType.CENTER }),
          makeCell("Quality Assurance"),
          makeCell("Pengujian kompilasi produksi `npm run build`, audit Lighthouse, dan pembersihan data sampel."),
          makeCell("Build Exit Code 0 & Audit"),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hari 14", { align: AlignmentType.CENTER }),
          makeCell("Finalisasi & Serah Terima"),
          makeCell("Penyusunan dokumen proposal akademik formal, sinkronisasi repositori GitHub, dan rilis."),
          makeCell("Proposal & Web Siap Uji"),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 140, after: 100 } }),

  makeSubchapterTitle("6.2 Matriks Jadwal Pelaksanaan (Gantt Chart 14 Hari)"),
  makeTableTitle("6.2", "Matriks Gantt Chart Aktivitas Proyek 2 Minggu (14 Hari)"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("Aktivitas Utama Proyek", { isHeader: true, width: 3337 }),
          makeCell("H1-H2", { isHeader: true, width: 750, align: AlignmentType.CENTER }),
          makeCell("H3-H4", { isHeader: true, width: 750, align: AlignmentType.CENTER }),
          makeCell("H5-H6", { isHeader: true, width: 750, align: AlignmentType.CENTER }),
          makeCell("H7-H8", { isHeader: true, width: 750, align: AlignmentType.CENTER }),
          makeCell("H9-H10", { isHeader: true, width: 800, align: AlignmentType.CENTER }),
          makeCell("H11-H14", { isHeader: true, width: 800, align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Inisiasi & Arsitektur Database SQLite"),
          makeCell("■■", { align: AlignmentType.CENTER, bold: true }),
          makeCell(""),
          makeCell(""),
          makeCell(""),
          makeCell(""),
          makeCell(""),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Sistem Desain Visual & Vault Login Gate"),
          makeCell(""),
          makeCell("■■", { align: AlignmentType.CENTER, bold: true }),
          makeCell(""),
          makeCell(""),
          makeCell(""),
          makeCell(""),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Manajemen Mata Kuliah & Repositori Materi"),
          makeCell(""),
          makeCell(""),
          makeCell("■■", { align: AlignmentType.CENTER, bold: true }),
          makeCell(""),
          makeCell(""),
          makeCell(""),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Papan Kanban & 5 Kategori Asesmen Resmi"),
          makeCell(""),
          makeCell(""),
          makeCell(""),
          makeCell("■■", { align: AlignmentType.CENTER, bold: true }),
          makeCell(""),
          makeCell(""),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Portal Penilaian Dosen & Kalkulasi Nilai"),
          makeCell(""),
          makeCell(""),
          makeCell(""),
          makeCell(""),
          makeCell("■■", { align: AlignmentType.CENTER, bold: true }),
          makeCell(""),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Testing Produksi, Proposal Formal & Rilis"),
          makeCell(""),
          makeCell(""),
          makeCell(""),
          makeCell(""),
          makeCell(""),
          makeCell("■■■■", { align: AlignmentType.CENTER, bold: true }),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 140, after: 100 } }),

  makeSubchapterTitle("6.3 Pembagian Peran & Alokasi Sumber Daya"),
  makeTableTitle("6.3", "Alokasi Peran dan Tanggung Jawab Pengembang"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("Peran Proyek", { isHeader: true, width: 2200 }),
          makeCell("Keahlian Utama", { isHeader: true, width: 2500 }),
          makeCell("Tanggung Jawab Teknis dalam 2 Minggu", { isHeader: true, width: 3237 }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("UI/UX Designer & Project Lead", { bold: true }),
          makeCell("Design Thinking, Color Harmony, Figma"),
          makeCell("Merancang identitas visual Warm Chocolate, efek glitter, dan tata letak responsif."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Fullstack Web Developer", { bold: true }),
          makeCell("Next.js 15, TypeScript, Tailwind, Prisma"),
          makeCell("Mengembangkan kode aplikasi, Server Actions, upload engine, dan integrasi SQLite."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("QA & Verification Engineer", { bold: true }),
          makeCell("Production Build, Lighthouse, Testing"),
          makeCell("Memverifikasi kelulusan build tanpa error, uji lintas browser, dan penyusunan dokumen proposal."),
        ],
      }),
    ],
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// 12. BAB VII METRIK PENGUJIAN & INDIKATOR KEBERHASILAN (hal 28)
children.push(
  makeChapterTitle("BAB VII\nMETRIK PENGUJIAN & INDIKATOR KEBERHASILAN"),
  makeSubchapterTitle("7.1 Pengujian Kegunaan (Usability Testing: SUS & SEQ)"),
  makeParagraph(
    "Pengujian kegunaan antarmuka dievaluasi menggunakan metode System Usability Scale (SUS) dan Single Ease Question (SEQ) berdasarkan 4 skenario tugas utama:"
  ),
  makeTableTitle("7.1", "Skenario dan Target Metrik Usability Testing (TSR, SUS, SEQ)"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("Skenario Pengujian Tugas (Task)", { isHeader: true, width: 2300 }),
          makeCell("Tindakan Pengguna yang Dinilai", { isHeader: true, width: 2800 }),
          makeCell("Target Keberhasilan (KPI)", { isHeader: true, width: 2837 }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tugas 1: Akses Gerbang Masuk & Dashboard"),
          makeCell("Membuka login gate, menggunakan Quick Access, dan melihat ringkasan metrik."),
          makeCell("Task Success Rate >= 95%, waktu < 10 detik."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tugas 2: Manajemen Tugas & Kategori Asesmen"),
          makeCell("Membuat tugas baru dengan memilih salah satu dari 5 kategori asesmen."),
          makeCell("Task Success Rate >= 95%, nilai SEQ >= 6.5 / 7.0."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tugas 3: Input Nilai Dosen via Portal"),
          makeCell("Dosen membuka tautan `/grade/[id]`, mengisi skor nilai dan evaluasi."),
          makeCell("Task Success Rate 100%, konfeti selebrasi aktif sempurna."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tugas 4: Pratinjau Materi In-App"),
          makeCell("Membuka berkas dokumen materi kuliah langsung di dalam browser."),
          makeCell("Pemuatan dokumen lancar, zero broken links."),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 140, after: 100 } }),

  makeSubchapterTitle("7.2 Pengujian Otomatis Perangkat Lunak (Production Build Test)"),
  makeParagraph(
    "Keandalan arsitektur kode diverifikasi melalui kompilasi produksi resmi Next.js (`npm run build`):"
  ),
  makeTableTitle("7.2", "Ringkasan Hasil Test Suite Otomatis Produksi (Production Build Verified)"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("Rute Halaman / Modul", { isHeader: true, width: 2500 }),
          makeCell("Tipe Halaman", { isHeader: true, width: 2400, align: AlignmentType.CENTER }),
          makeCell("Status Verifikasi Kompilasi", { isHeader: true, width: 3037, align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("`/` (Dashboard Beranda)"),
          makeCell("Prerendered Static Content", { align: AlignmentType.CENTER }),
          makeCell("100% Compiled (0 Errors)", { bold: true, align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("`/courses` & `/courses/[id]`"),
          makeCell("Dynamic Server-Rendered", { align: AlignmentType.CENTER }),
          makeCell("100% Compiled (0 Errors)", { bold: true, align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("`/assignments` (Kanban Board)"),
          makeCell("Prerendered Static Content", { align: AlignmentType.CENTER }),
          makeCell("100% Compiled (0 Errors)", { bold: true, align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("`/grade/[id]` (Portal Dosen)"),
          makeCell("Dynamic Server-Rendered", { align: AlignmentType.CENTER }),
          makeCell("100% Compiled (0 Errors)", { bold: true, align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("`/materials` & `/materials/[id]`"),
          makeCell("Dynamic Server-Rendered", { align: AlignmentType.CENTER }),
          makeCell("100% Compiled (0 Errors)", { bold: true, align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("`/analytics` & `/settings`"),
          makeCell("Prerendered Static Content", { align: AlignmentType.CENTER }),
          makeCell("100% Compiled (0 Errors)", { bold: true, align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Total Seluruh Rute"),
          makeCell("10 Halaman Sistem", { align: AlignmentType.CENTER, bold: true }),
          makeCell("LULUS 100% (Build Exit Code 0)", { bold: true, align: AlignmentType.CENTER }),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 140, after: 100 } }),

  makeSubchapterTitle("7.3 Metrik Kinerja Teknis & Kecepatan Akses"),
  makeBullet("Google Lighthouse Score: Skor kinerja dan aksesibilitas mencapai minimal 90 pada perangkat desktop dan 85 pada perangkat seluler.", { boldPrefix: "•" }),
  makeBullet("Largest Contentful Paint (LCP): Waktu pemuatan elemen visual utama di bawah 1,5 detik.", { boldPrefix: "•" }),
  makeBullet("Cumulative Layout Shift (CLS): Skor CLS di bawah 0,05 sehingga antarmuka stabil tanpa pergeseran layout mendadak.", { boldPrefix: "•" }),
  new Paragraph({ children: [new PageBreak()] })
);

// 13. BAB VIII ESTIMASI ANGGARAN BIAYA (hal 32)
children.push(
  makeChapterTitle("BAB VIII\nESTIMASI ANGGARAN BIAYA (COST ESTIMATION)"),
  makeSubchapterTitle("8.1 Biaya Infrastruktur & Perangkat Lunak (100% Free Stack)"),
  makeParagraph(
    "Salah satu keunggulan perancangan sistem ini adalah efisiensi biaya mutlak. Seluruh komponen teknologi yang diimplementasikan memanfaatkan kuota gratis resmi (Free Tier):"
  ),
  makeTableTitle("8.1", "Rincian Biaya Infrastruktur dan Software (Free Tier)"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("Komponen Infrastruktur", { isHeader: true, width: 2200 }),
          makeCell("Penyedia Layanan (Provider)", { isHeader: true, width: 2400 }),
          makeCell("Kapasitas / Kuota Gratis", { isHeader: true, width: 2337 }),
          makeCell("Biaya (Rp)", { isHeader: true, width: 1000, align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Framework & Runtime", { bold: true }),
          makeCell("Next.js 15 / Node.js 24"),
          makeCell("Open-Source (MIT License)"),
          makeCell("Rp 0,-", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Basis Data Relasional", { bold: true }),
          makeCell("SQLite via Prisma ORM"),
          makeCell("Embedded Server Storage"),
          makeCell("Rp 0,-", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Hosting & CDN", { bold: true }),
          makeCell("Vercel Hobby Plan"),
          makeCell("100 GB Bandwidth/Bulan"),
          makeCell("Rp 0,-", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Manajemen Repositori", { bold: true }),
          makeCell("GitHub Free Tier"),
          makeCell("Unlimited Repositories & CI"),
          makeCell("Rp 0,-", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Penyimpanan Berkas", { bold: true }),
          makeCell("Local Server Upload Engine"),
          makeCell("Kapasitas Disk Server"),
          makeCell("Rp 0,-", { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Total Biaya Operasional", { bold: true }),
          makeCell("—"),
          makeCell("—"),
          makeCell("Rp 0,- (GRATIS)", { bold: true, align: AlignmentType.CENTER }),
        ],
      }),
    ],
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// 14. BAB IX MANAJEMEN RISIKO & STRATEGI MITIGASI (hal 34)
children.push(
  makeChapterTitle("BAB IX\nMANAJEMEN RISIKO & STRATEGI MITIGASI"),
  makeSubchapterTitle("9.1 Matriks Evaluasi Manajemen Risiko Proyek"),
  makeTableTitle("9.1", "Matriks Manajemen Risiko dan Strategi Mitigasi"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("Identifikasi Risiko Proyek", { isHeader: true, width: 2300 }),
          makeCell("Dampak Potensial", { isHeader: true, width: 2300 }),
          makeCell("Tingkat Risiko", { isHeader: true, width: 1100, align: AlignmentType.CENTER }),
          makeCell("Rencana Tindakan Mitigasi Konkret", { isHeader: true, width: 2237 }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Ukuran Berkas Materi Terlalu Besar"),
          makeCell("Penyimpanan disk server cepat penuh, waktu upload lambat."),
          makeCell("Sedang", { align: AlignmentType.CENTER }),
          makeCell("Pembatasan ukuran upload maksimal 25 MB per berkas dan kompresi dokumen PDF."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Kehilangan Akses Data Lokal"),
          makeCell("Data tugas dan materi hilang saat perangkat berganti."),
          makeCell("Sedang", { align: AlignmentType.CENTER }),
          makeCell("Penyediaan fitur Ekspor Data JSON berkala di halaman Pengaturan."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Dosen Mengalami Kendala Akses Tautan"),
          makeCell("Penilaian tugas tertunda karena tautan error."),
          makeCell("Rendah", { align: AlignmentType.CENTER }),
          makeCell("Tautan `/grade/[id]` dibuat publik tanpa login dan diuji responsif pada smartphone."),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 140, after: 100 } }),

  makeSubchapterTitle("9.2 Strategi Mitigasi dan Rencana Kontinjensi Proyek"),
  makeParagraph(
    "Pengembang menerapkan protokol kontinjensi proaktif: 1) Menyimpan cadangan basis data otomatis; 2) Menjaga kode selalu terdorong ke repositori GitHub `main`; 3) Menjaga konsistensi type-safety TypeScript guna mencegah bug fatal."
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// 15. BAB X PENUTUP (hal 36)
children.push(
  makeChapterTitle("BAB X\nPENUTUP"),
  makeSubchapterTitle("10.1 Kesimpulan Proyek"),
  makeParagraph(
    "Rancangan proyek pengembangan website \"Yuli's Vault (Yuli's Second Brain)\" berhasil diselesaikan secara paripurna sebagai solusi sistem informasi akademik personal yang memadukan keindahan visual Luxury Warm Chocolate dengan kecanggihan fungsionalitas manajemen tugas dan materi."
  ),
  makeParagraph(
    "Dengan dukungan arsitektur Next.js 15, Prisma ORM, dan basis data SQLite 100% bebas biaya operasional, sistem terbukti mampu memberikan pengalaman belajar yang tenang, bebas distraksi, dan teratur bagi mahasiswa Teknik Informatika. Kehadiran Portal Penilaian Dosen tanpa login menjembatani kolaborasi akademik yang transparan antara mahasiswa dan dosen pengampu."
  ),
  makeSubchapterTitle("10.2 Saran & Rekomendasi Pengembangan Lanjutan"),
  makeParagraph("Untuk pengembangan versi lanjutan di masa mendatang, disarankan beberapa langkah strategis:"),
  makeBullet("Integrasi Notifikasi Bot WhatsApp / Telegram: Mengirimkan pengingat otomatis pada H-1 sebelum deadline tugas.", { boldPrefix: "1." }),
  makeBullet("Sinkronisasi Google Calendar: Fitur ekspor jadwal kuliah mingguan ke format `.ics`.", { boldPrefix: "2." }),
  makeBullet("Penyimpanan Cloud Multi-Device: Sinkronisasi data antar-perangkat secara otomatis berbasis cloud storage jika diperlukan.", { boldPrefix: "3." }),
  new Paragraph({ spacing: { before: 200, after: 40 } }),
  makeParagraphNoIndent("Cirebon, 6 November 2026\nPenyusun,\n\n\n\nYuli Indiyanti", {
    align: AlignmentType.RIGHT,
    bold: true,
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// 16. DAFTAR PUSTAKA (REFERENCES) (hal 38)
children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 240, line: 280 },
    children: [
      new TextRun({
        text: "DAFTAR PUSTAKA (REFERENCES)",
        bold: true,
        font: "Times New Roman",
        size: 28,
      }),
    ],
  }),
  makeParagraphNoIndent(
    "Seluruh literatur ilmiah yang dirujuk dalam dokumen proposal ini telah dikatalogkan dengan format penulisan standar IEEE (Institute of Electrical and Electronics Engineers):"
  ),
  makeParagraphNoIndent(
    "[1] I. Maliki, K. Jaya, G. C. Lestari, D. Irawan, dan A. Wasid, \"Perancangan Sistem Informasi Berbasis Web Pada Bimbingan Belajar (Bimbel) BNF,\" Jurnal Informatika dan Komputasi (JIKI), vol. 18, no. 2, hlm. 45–54, 2024, ISSN: 2656-789X, doi: 10.56956/jiki.v18i2.388."
  ),
  makeParagraphNoIndent(
    "[2] E. R. Rahmi, E. Yumami, dan N. Hidayasari, \"Analisis Metode Pengembangan Sistem Informasi Berbasis Website: Systematic Literature Review,\" Remik: Riset dan E-Jurnal Manajemen Informatika Komputer, vol. 7, no. 1, hlm. 121–134, 2023, doi: 10.33395/remik.v7i1.12177."
  ),
  makeParagraphNoIndent(
    "[3] S. H. Nova, A. P. Widodo, dan B. Warsito, \"Analisis Metode Agile pada Pengembangan Sistem Informasi Berbasis Website: Systematic Literature Review,\" Techno.Com, vol. 21, no. 1, hlm. 65–76, 2022, doi: 10.33633/tc.v21i1.5659."
  ),
  makeParagraphNoIndent(
    "[4] D. T. Haniva, J. A. Ramadhan, dan A. Suharso, \"Systematic Literature Review Penggunaan Metodologi Pengembangan Sistem Informasi Waterfall, Agile, dan Hybrid,\" Journal of Information Engineering and Educational Technology (JIEET), vol. 7, no. 1, hlm. 36–42, 2023, doi: 10.26740/jieet.v7n1.p36-42."
  ),
  makeParagraphNoIndent(
    "[5] T. Forte, Building a Second Brain: A Proven Method to Organize Your Digital Life and Unlock Your Creative Potential. New York: Atria Books, 2022."
  ),
  makeParagraphNoIndent(
    "[6] R. S. Pressman dan B. R. Maxim, Software Engineering: A Practitioner's Approach, 9th ed. New York: McGraw-Hill Education, 2020."
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// 17. LAMPIRAN DOKUMEN (hal 40)
children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 240, line: 280 },
    children: [
      new TextRun({
        text: "LAMPIRAN DOKUMEN",
        bold: true,
        font: "Times New Roman",
        size: 28,
      }),
    ],
  }),
  makeSubchapterTitle("Lampiran 1: Skema Model Data Prisma SQLite JSON"),
  makeParagraphNoIndent(
    "Spesifikasi skema tabel basis data relasional SQLite `prisma/dev.db` yang diterapkan pada sistem:"
  ),
  new Paragraph({
    spacing: { before: 100, after: 100, line: 240 },
    shading: { fill: "FBF8F5" },
    border: {
      top: { style: BorderStyle.SINGLE, size: 6, color: "DECFC0" },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "DECFC0" },
      left: { style: BorderStyle.SINGLE, size: 18, color: "8B5A2B" },
      right: { style: BorderStyle.SINGLE, size: 6, color: "DECFC0" },
    },
    children: [
      new TextRun({
        text: `// Model Assignment Prisma
model Assignment {
  id               String       @id @default(cuid())
  courseId         String
  course           Course       @relation(fields: [courseId], references: [id], onDelete: Cascade)
  weekNumber       Int          @default(1)
  title            String
  instructions     String?
  attachmentUrl    String?
  attachmentName   String?
  dueDate          DateTime
  priority         String       @default("HIGH")
  status           String       @default("TODO")
  type             String       @default("INDIVIDUAL")
  weightPercentage Int          @default(15)
  score            Float?
  gradeLetter      String?
  lecturerFeedback String?
  submittedAt      DateTime?
  createdAt        DateTime     @default(now())
}`,
        font: "Consolas",
        size: 18,
        color: "2A1810",
      }),
    ],
  }),

  makeSubchapterTitle("Lampiran 2: Formulasi Matematis Perhitungan Rata-Rata Nilai Murni"),
  makeParagraphNoIndent(
    "Rumus Utama: Rata-Rata = ∑(Skor Tugas yang Dinilai) / N_dinilai\nDimana N_dinilai adalah jumlah tugas yang telah diberikan nilai angka (0–100) oleh dosen pengampu. Jika N_dinilai = 0, status nilai ditampilkan sebagai pending evaluation (-)."
  ),

  makeSubchapterTitle("Lampiran 3: Instrumen Kuesioner Pengujian System Usability Scale (SUS)"),
  makeTableTitle("L.1", "Instrumen Kuesioner Pengujian System Usability Scale (SUS)"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("No", { isHeader: true, width: 800, align: AlignmentType.CENTER }),
          makeCell("Pernyataan Evaluasi Usability (Standar SUS)", { isHeader: true, width: 7137 }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Q1", { align: AlignmentType.CENTER }),
          makeCell("Saya merasa akan sering menggunakan website akademik Yuli's Vault ini."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Q2", { align: AlignmentType.CENTER }),
          makeCell("Saya merasa antarmuka sistem website ini terlalu rumit dan membingungkan."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Q3", { align: AlignmentType.CENTER }),
          makeCell("Saya merasa website ini sangat mudah untuk digunakan dalam mengelola tugas kuliah."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Q4", { align: AlignmentType.CENTER }),
          makeCell("Saya merasa membutuhkan bantuan teknisi atau orang lain untuk dapat menggunakan website ini."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Q5", { align: AlignmentType.CENTER }),
          makeCell("Saya merasa fitur-fitur pada website ini (Kanban, pratinjau materi, portal dosen) terintegrasi dengan sangat baik."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Q6", { align: AlignmentType.CENTER }),
          makeCell("Saya merasa ada terlalu banyak ketidakkonsistenan pada antarmuka sistem ini."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Q7", { align: AlignmentType.CENTER }),
          makeCell("Saya memperkirakan bahwa kebanyakan orang akan dapat mempelajari website ini dengan sangat cepat."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Q8", { align: AlignmentType.CENTER }),
          makeCell("Saya merasa alur navigasi dan tampilan antarmuka website ini sangat janggal atau membingungkan."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Q9", { align: AlignmentType.CENTER }),
          makeCell("Saya merasa sangat percaya diri saat menggunakan fitur-fitur pada website ini."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Q10", { align: AlignmentType.CENTER }),
          makeCell("Saya merasa harus mempelajari banyak hal terlebih dahulu sebelum dapat menggunakan website ini secara lancar."),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 140, after: 100 } }),

  makeSubchapterTitle("Lampiran 4: Rincian 5 Kategori Asesmen & Alur Portal Dosen"),
  makeTableTitle("L.2", "Matriks 5 Kategori Asesmen Resmi Perkuliahan & Alur Portal Dosen"),
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          makeCell("Kategori Asesmen", { isHeader: true, width: 2200 }),
          makeCell("Ikon & Lencana Warna", { isHeader: true, width: 2500 }),
          makeCell("Peruntukan Tugas Akademik", { isHeader: true, width: 3237 }),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tugas Individu", { bold: true }),
          makeCell("👤 Tugas Individu (Lencana Cokelat Muda)"),
          makeCell("Tugas mandiri mingguan, resume materi, analisis kasus teknis."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tugas Kelompok", { bold: true }),
          makeCell("👥 Tugas Kelompok (Lencana Moka)"),
          makeCell("Kerja kelompok, presentasi tim, diskusi modul laboratorium."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tugas Besar", { bold: true }),
          makeCell("🚀 Tugas Besar (Lencana Karamel Emas)"),
          makeCell("Final project semester, perancangan sistem/aplikasi kompleks."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tugas UTS", { bold: true }),
          makeCell("📝 Tugas UTS (Lencana Hazelnut Hangat)"),
          makeCell("Ujian Tengah Semester dan evaluasi tengah periode perkuliahan."),
        ],
      }),
      new TableRow({
        children: [
          makeCell("Tugas UAS", { bold: true }),
          makeCell("🎯 Tugas UAS (Lencana Espresso Rose)"),
          makeCell("Ujian Akhir Semester dan penyerahan laporan penutup semester."),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 140, after: 100 } }),

  makeSubchapterTitle("Lampiran 5: Link Website yang Sudah di Deploy"),
  makeParagraphNoIndent(
    "Tautan Repositori GitHub Resmi: https://github.com/YuliIndiyanti/Website-Tugas-dan-Materi-Kuliah.git\nTautan Aplikasi Web: http://localhost:3000 (Siap di-hosting pada Vercel Production Edge)"
  )
);

// BUILD DOCUMENT
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Times New Roman",
          size: 24, // 12pt
          color: "000000",
        },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: MARGIN_TOP,
            bottom: MARGIN_BOTTOM,
            left: MARGIN_LEFT,
            right: MARGIN_RIGHT,
          },
        },
      },
      
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: "Times New Roman",
                  size: 20, // 10pt
                  color: "000000",
                }),
              ],
            }),
          ],
        }),
      },
      children: children,
    },
  ],
});

const outDocxPath = path.join(__dirname, "..", "PROPOSAL_PERANCANGAN_WEBSITE_YULIS_VAULT.docx");
const outDocxPathAlt = path.join(__dirname, "..", "PROPOSAL_PERANCANGAN_WEBSITE_YULIS_VAULT_UMC_10_BAB.docx");
const artifactDocx = "C:\\Users\\hp envy\\.gemini\\antigravity\\brain\\9f985953-fa86-4103-abb9-9a564021a241\\PROPOSAL_PERANCANGAN_WEBSITE_YULIS_VAULT.docx";

Packer.toBuffer(doc).then((buffer) => {
  try {
    fs.writeFileSync(artifactDocx, buffer);
    console.log("Successfully updated artifact DOCX:", artifactDocx);
  } catch (e) {
    console.warn("Artifact write notice:", e.message);
  }

  const targets = [
    path.join(__dirname, "..", "PROPOSAL_PERANCANGAN_WEBSITE_YULIS_VAULT_REVISI_FINAL.docx"),
    outDocxPathAlt,
    outDocxPath,
    path.join(__dirname, "..", "PROPOSAL_PERANCANGAN_WEBSITE_YULIS_VAULT_FINAL.docx")
  ];

  for (const t of targets) {
    try {
      fs.writeFileSync(t, buffer);
      console.log("Successfully saved DOCX to:", t);
    } catch (err) {
      console.warn("Notice: " + path.basename(t) + " is currently open in Word. Skipped.");
    }
  }
});
