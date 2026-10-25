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
  UnderlineType,
} = require("docx");

// Konstanta Ukuran Satuan DXA (1 cm = 567 dxa, 1 inch = 1440 dxa)
const MARGIN_LEFT = 2268;   // 4 cm (Standar Akademik Indonesia untuk Penjilidan)
const MARGIN_TOP = 1701;    // 3 cm
const MARGIN_RIGHT = 1701;  // 3 cm
const MARGIN_BOTTOM = 1701; // 3 cm
const CONTENT_WIDTH = 11906 - (MARGIN_LEFT + MARGIN_RIGHT); // A4 Width (11906) - margins = ~7937 dxa

// Helper fungsi untuk membuat sel tabel formal
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
      top: 100, // ~5pt
      bottom: 100,
      left: 140, // ~7pt
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
        spacing: { before: 0, after: 0, line: 240 }, // single line spacing inside tables
        children: [
          new TextRun({
            text,
            bold,
            italic,
            size,
            color,
            font: "Times New Roman",
          }),
        ],
      }),
    ],
  });
}

// Helper paragraf isi formal akademik (Times New Roman 12pt, 1.5 spasi, Justified, First-line indent 1.27 cm)
function makeParagraph(text, options = {}) {
  const {
    bold = false,
    italic = false,
    size = 24, // 12pt
    color = "000000",
    align = AlignmentType.JUSTIFY,
    indent = 720, // 0.5 inch / 1.27 cm first line indent
    spaceBefore = 0,
    spaceAfter = 120, // 6pt space after
    line = 360, // 1.5 line spacing (standar proposal skripsi/tugas besar)
  } = options;

  return new Paragraph({
    alignment: align,
    indent: indent ? { firstLine: indent } : undefined,
    spacing: { before: spaceBefore, after: spaceAfter, line },
    children: [
      new TextRun({
        text,
        bold,
        italic,
        size,
        color,
        font: "Times New Roman",
      }),
    ],
  });
}

// Helper paragraf tanpa indent (untuk pembuka, keterangan gambar, atau transisi)
function makeParagraphNoIndent(text, options = {}) {
  return makeParagraph(text, { ...options, indent: 0 });
}

// Helper bullet point formal
function makeBullet(text, options = {}) {
  const { boldPrefix = "", spaceAfter = 60 } = options;

  const children = [];
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix + " ",
        bold: true,
        size: 24, // 12pt
        color: "000000",
        font: "Times New Roman",
      })
    );
  }
  children.push(
    new TextRun({
      text,
      size: 24, // 12pt
      color: "000000",
      font: "Times New Roman",
    })
  );

  return new Paragraph({
    bullet: { level: 0 },
    alignment: AlignmentType.JUSTIFY,
    spacing: { before: 0, after: spaceAfter, line: 360 }, // 1.5 spasi
    children,
  });
}

// Helper Judul Bab (BAB I, BAB II, dst.) - Rata Tengah, Huruf Kapital, Tebal 14pt
function makeChapterTitle(chapterNumber, chapterTitle) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 360, after: 60, line: 280 },
      children: [
        new TextRun({
          text: chapterNumber,
          bold: true,
          size: 28, // 14pt
          color: "000000",
          font: "Times New Roman",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240, line: 280 },
      children: [
        new TextRun({
          text: chapterTitle,
          bold: true,
          size: 28, // 14pt
          color: "000000",
          font: "Times New Roman",
        }),
      ],
    }),
  ];
}

// Helper Judul Sub-Bab (1.1, 1.2, dst.) - Rata Kiri, Tebal 12pt
function makeSubchapterTitle(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100, line: 300 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 24, // 12pt
        color: "000000",
        font: "Times New Roman",
      }),
    ],
  });
}

// Helper Judul Sub-sub-Bab (1.1.1, dst.)
function makeSubSubchapterTitle(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 80, line: 300 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        italic: true,
        size: 24, // 12pt
        color: "000000",
        font: "Times New Roman",
      }),
    ],
  });
}

// Helper Keterangan Judul Tabel
function makeTableCaption(tableNumber, captionText) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 140, after: 60, line: 240 },
    children: [
      new TextRun({
        text: `${tableNumber} ${captionText}`,
        bold: true,
        size: 22, // 11pt
        color: "000000",
        font: "Times New Roman",
      }),
    ],
  });
}

async function buildFormalProposalDocx() {
  const doc = new Document({
    creator: "Yuli Indiyanti (NIM: 240511130)",
    title: "PROPOSAL PERANCANGAN SISTEM INFORMASI AKADEMIK PRIBADI - YULI'S VAULT",
    description: "Proposal Formal Perancangan dan Pengembangan Sistem Informasi Akademik Pribadi Yuli's Vault untuk Mata Kuliah Analisis dan Perancangan Perangkat Lunak",
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
              right: MARGIN_RIGHT,
              bottom: MARGIN_BOTTOM,
              left: MARGIN_LEFT,
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
                    text: "Proposal Perancangan Perangkat Lunak — Yuli's Vault (TI24D)",
                    size: 18, // 9pt
                    italic: true,
                    color: "64748B",
                    font: "Times New Roman",
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
                    size: 20, // 10pt
                    color: "475569",
                    font: "Times New Roman",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 20,
                    bold: true,
                    color: "000000",
                    font: "Times New Roman",
                  }),
                  new TextRun({
                    text: " dari ",
                    size: 20,
                    color: "475569",
                    font: "Times New Roman",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 20,
                    bold: true,
                    color: "000000",
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // ==========================================
          // 1. HALAMAN SAMPUL / COVER RESMI
          // ==========================================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 60, line: 260 },
            children: [
              new TextRun({
                text: "PROPOSAL TUGAS BESAR REKAYASA PERANGKAT LUNAK",
                bold: true,
                size: 28, // 14pt
                color: "000000",
                font: "Times New Roman",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 120, line: 300 },
            children: [
              new TextRun({
                text: "PERANCANGAN DAN PENGEMBANGAN SISTEM INFORMASI AKADEMIK PRIBADI \"YULI'S VAULT (YULI'S SECOND BRAIN)\"\nBERBASIS WEB DENGAN PELACAK TUGAS, KONTROL VERSI BERKAS, DAN PENATAAN VISUAL SOFT PASTEL MENGGUNAKAN NEXT.JS DAN SQLITE",
                bold: true,
                size: 28, // 14pt
                color: "000000",
                font: "Times New Roman",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 180, line: 260 },
            children: [
              new TextRun({
                text: "Personal Academic Vault & Assignment Management Web Application\n\"Streamline your study workflow. Track tasks and manage materials effortlessly.\"",
                italic: true,
                size: 22, // 11pt
                color: "334155",
                font: "Times New Roman",
              }),
            ],
          }),

          // Garis Dekoratif Cover
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 200 },
            children: [
              new TextRun({
                text: "________________________________________________________",
                bold: true,
                color: "1E3A8A",
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 120, line: 280 },
            children: [
              new TextRun({
                text: "Diajukan untuk Memenuhi Syarat Kelulusan Tugas Besar Mata Kuliah\nAnalisis dan Perancangan Perangkat Lunak (APPL / ADPL)\nSemester Ganjil Tahun Akademik 2026/2027",
                size: 24, // 12pt
                color: "000000",
                font: "Times New Roman",
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 60, line: 260 },
            children: [
              new TextRun({
                text: "Disusun Oleh:",
                bold: true,
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
                text: "YULI INDIYANTI",
                bold: true,
                size: 26, // 13pt
                underline: { type: UnderlineType.SINGLE },
                color: "000000",
                font: "Times New Roman",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 20, line: 260 },
            children: [
              new TextRun({
                text: "NIM. 240511130",
                bold: true,
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 360, line: 260 },
            children: [
              new TextRun({
                text: "Kelas: TI24D",
                bold: true,
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 20, line: 260 },
            children: [
              new TextRun({
                text: "PROGRAM STUDI TEKNIK INFORMATIKA",
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
                text: "FAKULTAS TEKNOLOGI INFORMASI DAN ILMU KOMPUTER",
                bold: true,
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 0, line: 260 },
            children: [
              new TextRun({
                text: "CIREBON\n2026",
                bold: true,
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),

          // PAGE BREAK MENUJU LEMBAR PENGESAHAN
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // 2. LEMBAR PENGESAHAN PROPOSAL
          // ==========================================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 60, line: 280 },
            children: [
              new TextRun({
                text: "LEMBAR PENGESAHAN PROPOSAL PROYEK PERANGKAT LUNAK",
                bold: true,
                size: 26, // 13pt
                color: "000000",
                font: "Times New Roman",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 240 },
            children: [
              new TextRun({
                text: "________________________________________________________",
                bold: true,
                color: "000000",
              }),
            ],
          }),

          makeParagraphNoIndent("Proposal Tugas Besar Perancangan Perangkat Lunak ini telah diperiksa, dievaluasi, dan disahkan sebagai acuan formal pelaksanaan proyek pengembangan perangkat lunak bagi mahasiswa yang bersangkutan:"),

          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  makeCell("Judul Produk Sistem", { bold: true, width: 2600 }),
                  makeCell("Yuli's Vault (Yuli's Second Brain) — Personal Academic Vault & Assignment Management Web Application", { width: 5337, bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Nama Pengusul", { bold: true, width: 2600 }),
                  makeCell("Yuli Indiyanti", { width: 5337, bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Nomor Induk Mahasiswa", { bold: true, width: 2600 }),
                  makeCell("240511130", { width: 5337 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Program Studi / Kelas", { bold: true, width: 2600 }),
                  makeCell("Teknik Informatika / TI24D", { width: 5337 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Mata Kuliah", { bold: true, width: 2600 }),
                  makeCell("Analisis dan Perancangan Perangkat Lunak (APPL / ADPL)", { width: 5337 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Jangka Waktu Pengerjaan", { bold: true, width: 2600 }),
                  makeCell("1 Minggu (7 Hari Kalender / Agile Sprint)", { width: 5337, bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Tautan Repositori GitHub", { bold: true, width: 2600 }),
                  makeCell("https://github.com/YuliIndiyanti/Website-Tugas-dan-Materi-Kuliah.git", { width: 5337, color: "1E3A8A" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Status Verifikasi", { bold: true, width: 2600 }),
                  makeCell("Disetujui untuk Diujikan dan Diimplementasikan (100% Ready)", { width: 5337, bold: true }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 240, after: 60 } }),
          makeParagraphNoIndent("Disahkan di: Cirebon\nPada Tanggal: 26 Oktober 2026", { align: AlignmentType.RIGHT }),

          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 3968, type: WidthType.DXA },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 0, after: 600, line: 260 },
                        children: [
                          new TextRun({ text: "Mengetahui / Menyetujui,\nDosen Pengampu Mata Kuliah APPL\n\n\n\n\n", bold: true, font: "Times New Roman" }),
                          new TextRun({ text: "(_______________________________)\n", bold: true, font: "Times New Roman" }),
                          new TextRun({ text: "NIP/NIDN. ....................................", font: "Times New Roman", size: 20 }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 3968, type: WidthType.DXA },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 0, after: 600, line: 260 },
                        children: [
                          new TextRun({ text: "Pengusul & Pengembang Sistem,\nMahasiswa Penyusun\n\n\n\n\n", bold: true, font: "Times New Roman" }),
                          new TextRun({ text: "YULI INDIYANTI\n", bold: true, underline: { type: UnderlineType.SINGLE }, font: "Times New Roman" }),
                          new TextRun({ text: "NIM. 240511130\nKelas TI24D — Teknik Informatika", font: "Times New Roman", size: 20 }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // PAGE BREAK MENUJU KATA PENGANTAR
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // 3. KATA PENGANTAR
          // ==========================================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200, line: 280 },
            children: [
              new TextRun({
                text: "KATA PENGANTAR",
                bold: true,
                size: 28, // 14pt
                font: "Times New Roman",
              }),
            ],
          }),

          makeParagraph("Puji dan syukur penulis panjatkan ke hadirat Allah SWT, Tuhan Yang Maha Esa, karena atas limpahan rahmat, petunjuk, dan karunia-Nya, penulis dapat menyelesaikan penyusunan dokumen proposal proyek rekayasa perangkat lunak dengan judul: \"Perancangan dan Pengembangan Sistem Informasi Akademik Pribadi 'Yuli's Vault (Yuli's Second Brain)' Berbasis Web Menggunakan Next.js dan SQLite\" dengan baik dan tepat waktu."),

          makeParagraph("Proposal ini disusun sebagai bagian dari pemenuhan tugas besar mata kuliah Analisis dan Perancangan Perangkat Lunak (APPL / ADPL) pada Program Studi Teknik Informatika, Fakultas Teknologi Informasi dan Ilmu Komputer. Sistem ini dikembangkan untuk menjawab permasalahan nyata disorganisasi materi kuliah, tingginya risiko kelalaian tenggat waktu tugas, dan ketidakteraturan riwayat revisi berkas akademik mahasiswa."),

          makeParagraph("Dalam kesempatan ini, penulis ingin menyampaikan ucapan terima kasih dan penghargaan yang tulus kepada:"),
          makeBullet("Dosen Pengampu Mata Kuliah Analisis dan Perancangan Perangkat Lunak yang telah memberikan arahan berharga, wawasan konseptual, dan bimbingan teknis selama proses perkuliahan dan perancangan sistem ini.", { boldPrefix: "1." }),
          makeBullet("Orang tua dan keluarga tercinta yang senantiasa melimpahkan doa, dorongan moral, dan motivasi tanpa henti selama proses studi penulis.", { boldPrefix: "2." }),
          makeBullet("Rekan-rekan mahasiswa Program Studi Teknik Informatika Kelas TI24D yang senantiasa saling bertukar pikiran, memberikan masukan konstruktif, dan bekerja sama secara solid.", { boldPrefix: "3." }),
          makeBullet("Seluruh komunitas pengembang sumber terbuka (open-source community) yang telah menyediakan ekosistem Next.js, React, Tailwind CSS, dan Prisma ORM.", { boldPrefix: "4." }),

          makeParagraph("Penulis menyadari sepenuhnya bahwa proposal ini masih jauh dari kesempurnaan. Oleh karena itu, penulis sangat terbuka terhadap segala bentuk kritik yang membangun dan saran demi penyempurnaan sistem informasi ini di masa mendatang. Semoga proposal dan perangkat lunak yang dihasilkan dapat memberikan manfaat konkret bagi efisiensi studi mahasiswa."),

          new Paragraph({ spacing: { before: 200, after: 40 } }),
          makeParagraphNoIndent("Cirebon, 26 Oktober 2026\n\nPenulis,\n\n\n", { align: AlignmentType.RIGHT }),
          makeParagraphNoIndent("YULI INDIYANTI\nNIM. 240511130", { align: AlignmentType.RIGHT, bold: true }),

          // PAGE BREAK MENUJU DAFTAR ISI
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // 4. DAFTAR ISI
          // ==========================================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200, line: 280 },
            children: [
              new TextRun({
                text: "DAFTAR ISI",
                bold: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
          }),

          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  makeCell("HALAMAN SAMPUL / COVER", { bold: true, width: 6800, bgColor: "FFFFFF" }),
                  makeCell("i", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("LEMBAR PENGESAHAN PROPOSAL", { bold: true, width: 6800, bgColor: "FFFFFF" }),
                  makeCell("ii", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("KATA PENGANTAR", { bold: true, width: 6800, bgColor: "FFFFFF" }),
                  makeCell("iii", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("DAFTAR ISI", { bold: true, width: 6800, bgColor: "FFFFFF" }),
                  makeCell("iv", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("DAFTAR TABEL", { bold: true, width: 6800, bgColor: "FFFFFF" }),
                  makeCell("v", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("DAFTAR GAMBAR", { bold: true, width: 6800, bgColor: "FFFFFF" }),
                  makeCell("vi", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("BAB I: PENDAHULUAN", { bold: true, width: 6800, bgColor: "F8FAFC" }),
                  makeCell("1", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "F8FAFC" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   1.1 Latar Belakang Masalah", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("1", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   1.2 Identifikasi Masalah", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("2", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   1.3 Rumusan Masalah", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("2", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   1.4 Batasan Masalah", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("3", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   1.5 Tujuan Pengembangan Sistem", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("3", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   1.6 Manfaat Produk", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("4", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   1.7 Sistematika Penulisan", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("4", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("BAB II: LANDASAN TEORI DAN TINJAUAN PUSTAKA", { bold: true, width: 6800, bgColor: "F8FAFC" }),
                  makeCell("5", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "F8FAFC" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   2.1 Sistem Informasi Akademik & Personal Knowledge Management (Second Brain)", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("5", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   2.2 Metodologi Analisis OOAD & Agile Rapid Prototyping", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("6", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   2.3 Ekosistem Next.js 15, React 19, dan TypeScript", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("7", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   2.4 Basis Data Relasional SQLite dan Prisma ORM", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("8", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   2.5 Ergonomi Visual Soft Pastel Design System dan Standar Aksesibilitas WCAG", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("9", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("BAB III: ANALISIS KEBUTUHAN SISTEM", { bold: true, width: 6800, bgColor: "F8FAFC" }),
                  makeCell("10", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "F8FAFC" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   3.1 Analisis Sistem yang Berjalan (Kerangka PIECES)", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("10", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   3.2 Profil dan Karakteristik Pengguna", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("11", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   3.3 Spesifikasi Kebutuhan Fungsional (MoSCoW FR-01 s.d. FR-18)", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("12", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   3.4 Spesifikasi Kebutuhan Non-Fungsional", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("14", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("BAB IV: PERANCANGAN SISTEM DAN ARSITEKTUR PERANGKAT LUNAK", { bold: true, width: 6800, bgColor: "F8FAFC" }),
                  makeCell("15", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "F8FAFC" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   4.1 Arsitektur Sistem Tiga Lapis (Three-Tier Architecture)", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("15", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   4.2 Diagram Alur Logika Pengguna (Core User Flows)", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("16", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   4.3 Perancangan Basis Data Relasional dan Kamus Data (6 Tabel)", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("17", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   4.4 Desain Antarmuka Pengguna & Output Implementasi Nyata", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("20", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("BAB V: RENCANA KERJA, JADWAL IMPLEMENTASI, DAN ANGGARAN BIAYA", { bold: true, width: 6800, bgColor: "F8FAFC" }),
                  makeCell("22", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "F8FAFC" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   5.1 Metodologi Agile Rapid Prototyping (1-Week Sprint)", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("22", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   5.2 Rincian Jadwal Pelaksanaan Harian (Hari 1 s.d. Hari 7)", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("22", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   5.3 Matriks Deliverables & Milestone Pencapaian", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("24", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   5.4 Analisis Anggaran Biaya Operasional (100% Free-Tier / Rp 0)", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("25", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   5.5 Sumber Daya Perangkat Keras dan Perangkat Lunak", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("25", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("BAB VI: KESIMPULAN DAN SARAN", { bold: true, width: 6800, bgColor: "F8FAFC" }),
                  makeCell("26", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "F8FAFC" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   6.1 Kesimpulan", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("26", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("   6.2 Saran dan Pengembangan Lanjutan", { width: 6800, bgColor: "FFFFFF" }),
                  makeCell("27", { align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("DAFTAR PUSTAKA", { bold: true, width: 6800, bgColor: "FFFFFF" }),
                  makeCell("28", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("LAMPIRAN", { bold: true, width: 6800, bgColor: "FFFFFF" }),
                  makeCell("29", { bold: true, align: AlignmentType.RIGHT, width: 1137, bgColor: "FFFFFF" }),
                ],
              }),
            ],
          }),

          // PAGE BREAK MENUJU BAB I
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // 5. BAB I: PENDAHULUAN
          // ==========================================
          ...makeChapterTitle("BAB I", "PENDAHULUAN"),

          makeSubchapterTitle("1.1 Latar Belakang Masalah"),
          makeParagraph("Dalam era transformasi digital pendidikan tinggi saat ini, mahasiswa Program Studi Teknik Informatika dihadapkan pada arus pertukaran informasi dan volume berkas perkuliahan yang meningkat secara eksponensial. Pada setiap semester, seorang mahasiswa rata-rata menempuh antara 18 hingga 24 Satuan Kredit Semester (SKS) yang terbagi ke dalam 6 hingga 8 mata kuliah teknis yang berbeda. Setiap mata kuliah tersebut secara rutin menghasilkan berbagai jenis artefak akademik, antara lain: slide presentasi dosen dalam format PDF atau PPTX, modul praktikum laboratorium, buku teks elektronik (e-book), tautan repositori kode sumber (Git), video rekaman asistensi perkuliahan, kuis mandiri, serta penugasan berkala dan proyek akhir semester."),

          makeParagraph("Permasalahan mendasar yang kerap dihadapi oleh mahasiswa adalah penyebaran artefak perkuliahan tersebut pada berbagai platform yang terfragmentasi tanpa adanya repositori tunggal yang terintegrasi (Single Source of Truth). Berkas materi sering kali dibagikan melalui grup percakapan instan WhatsApp yang mudah tertimbun oleh pesan lain, Google Drive pribadi yang tidak terstruktur, folder 'Downloads' lokal pada perangkat komputer yang acak, serta sistem Learning Management System (LMS) kampus yang sering kali lambat diakses saat jam sibuk perkuliahan."),

          makeParagraph("Kondisi desentralisasi dan disorganisasi berkas tersebut menimbulkan dampak akademik yang merugikan bagi mahasiswa, di antaranya:"),
          makeBullet("Mahasiswa membutuhkan waktu yang cukup lama (berkisar antara 10 hingga 20 menit) hanya untuk mencari kembali berkas modul atau slide perkuliahan pada minggu tertentu saat mempersiapkan diri menghadapi Ujian Tengah Semester (UTS) maupun Ujian Akhir Semester (UAS).", { boldPrefix: "1. Kehilangan Waktu Berharga (Time Inefficiency):" }),
          makeBullet("Ketidakmampuan memantau tenggat waktu tugas secara komprehensif menyebabkan beberapa tugas terlewatkan (missed deadlines) atau baru dikerjakan pada saat-saat terakhir (prokrastinasi ekstrem) dengan kualitas pengerjaan yang kurang optimal.", { boldPrefix: "2. Risiko Kelalaian Tenggat Waktu Tugas (Missed Deadlines):" }),
          makeBullet("Proses penyelesaian tugas sering kali melibatkan beberapa tahapan draf berkas (draf awal, draf hasil diskusi, dan berkas final). Ketiadaan manajemen kontrol versi yang sistematis sering kali memicu insiden pengunggahan berkas yang salah atau draf yang belum selesai ke portal dosen.", { boldPrefix: "3. Ketidakteraturan Kontrol Versi Berkas (Submission Disarray):" }),
          makeBullet("Mayoritas aplikasi manajemen tugas konvensional yang beredar di pasaran menggunakan skema warna yang terlalu kontras (high-contrast stark contrast) atau monoton monokromatik, sehingga mempercepat terjadinya kelelahan visual (digital eye strain) ketika digunakan untuk belajar selama berjam-jam.", { boldPrefix: "4. Kelelahan Visual (Visual Fatigue):" }),

          makeParagraph("Menanggapi permasalahan nyata tersebut, diperlukan sebuah sistem informasi akademik personal yang terpusat, tangkas, andal, serta mengedepankan ergonomi visual bagi penggunanya. Oleh karena itu, penulis merancang dan membangun sebuah aplikasi web bertajuk \"Yuli's Vault (Yuli's Second Brain)\" sebagai solusi komprehensif untuk mendukung alur kerja perkuliahan mahasiswa Teknik Informatika secara mandiri dan berkelanjutan."),

          makeSubchapterTitle("1.2 Identifikasi Masalah"),
          makeParagraph("Berdasarkan observasi pada alur kerja akademik mahasiswa sehari-hari, dapat diidentifikasikan sejumlah masalah utama sebagai berikut:"),
          makeBullet("Belum tersedianya media penyimpanan digital terpadu yang mampu mengelompokkan materi kuliah berdasarkan mata kuliah dan minggu pertemuan perkuliahan (Minggu 1 hingga 16).", { boldPrefix: "1." }),
          makeBullet("Sulitnya menentukan urutan prioritas pengerjaan tugas akibat ketiadaan indikator urgensi waktu nyata yang membedakan tugas darurat (< 24 jam), tugas mendesak (1-3 hari), dan tugas santai.", { boldPrefix: "2." }),
          makeBullet("Ketiadaan wadah pencatatan riwayat penyerahan tugas (versioning submission v1, v2, v3) beserta arsip bukti pengumpulan resmi (tangkapan layar LMS).", { boldPrefix: "3." }),
          makeBullet("Tingginya biaya langganan perangkat lunak produktivitas pihak ketiga (seperti Notion berbayar atau layanan cloud storage komersial), sehingga diperlukan sistem mandiri yang 100% bebas biaya (Rp 0/bulan).", { boldPrefix: "4." }),

          makeSubchapterTitle("1.3 Rumusan Masalah"),
          makeParagraph("Rumusan masalah dalam penelitian dan perancangan perangkat lunak ini dirumuskan sebagai berikut:"),
          makeBullet("Bagaimana merancang arsitektur sistem informasi akademik pribadi yang mampu mengintegrasikan manajemen semester, silabus mata kuliah, repositori materi, pelacak tugas, catatan Markdown, dan rekapitulasi nilai dalam satu platform terpusat?"),
          makeBullet("Bagaimana mengimplementasikan modul pelacakan tugas (Task & Deadline Tracker) berbasis papan Kanban dan tabel interaktif yang dilengkapi fitur penyuntingan rincian tugas secara penuh serta kontrol versi berkas pengumpulan?"),
          makeBullet("Bagaimana menerapkan penataan visual berbasis Soft Pastel Design System yang menenangkan mata namun tetap memenuhi kriteria aksesibilitas kontras tinggi (WCAG AA/AAA)?"),
          makeBullet("Bagaimana menyelesaikan seluruh siklus rekayasa perangkat lunak mulai dari analisis, desain basis data, koding, pengujian hingga rilis produksi dalam rentang waktu pengerjaan 1 minggu (7 hari)?"),

          makeSubchapterTitle("1.4 Batasan Masalah"),
          makeParagraph("Agar proses pengembangan terarah dan dapat diselesaikan tepat waktu dalam sprint 1 minggu, ditetapkan batasan-batasan sistem sebagai berikut:"),
          makeBullet("Sistem dibangun untuk penggunaan pribadi (Single-User Academic Vault) bagi mahasiswa pengusul: Yuli Indiyanti (NIM: 240511130, Kelas: TI24D).", { boldPrefix: "1. Pengguna:" }),
          makeBullet("Aplikasi berbasis web responsif yang dioptimalkan untuk peramban komputer desktop/laptop dan ponsel cerdas modern.", { boldPrefix: "2. Platform:" }),
          makeBullet("Penyimpanan berkas materi dan tugas menggunakan mesin pengunggahan lokal server (/public/uploads) yang mendukung berkas PDF, DOCX, PPTX, XLSX, ZIP, dan format gambar.", { boldPrefix: "3. Berkas:" }),
          makeBullet("Menggunakan basis data relasional SQLite lokal terintegrasi yang diabstraksikan melalui Prisma ORM serta mendukung pencadangan data dalam format JSON.", { boldPrefix: "4. Basis Data:" }),
          makeBullet("Seluruh proses perancangan hingga deployment diselesaikan dalam batas waktu 7 hari kerja (1 minggu).", { boldPrefix: "5. Durasi Pengerjaan:" }),

          makeSubchapterTitle("1.5 Tujuan Pengembangan Sistem"),
          makeParagraph("Tujuan yang ingin dicapai dalam proyek ini dibagi menjadi dua kategori:"),
          makeSubSubchapterTitle("1.5.1 Tujuan Teknis"),
          makeBullet("Membangun arsitektur monolitik modern berbasis Next.js 15 App Router, React 19, TypeScript, dan Tailwind CSS.", { boldPrefix: "a." }),
          makeBullet("Mengimplementasikan manipulasi data yang aman dan reaktif menggunakan Next.js Server Actions tanpa beban overhead REST API konvensional.", { boldPrefix: "b." }),
          makeBullet("Mendesain skema basis data relasional yang konsisten dengan relasi Cascade Delete menggunakan Prisma ORM dan SQLite.", { boldPrefix: "c." }),
          makeBullet("Menyediakan mesin pengunggahan berkas lokal yang cepat dengan feedback notifikasi instan menggunakan Sonner Toast.", { boldPrefix: "d." }),

          makeSubSubchapterTitle("1.5.2 Tujuan Fungsional & Praktis"),
          makeBullet("Menyediakan antarmuka manajemen mata kuliah lengkap dengan pemetaan silabus 16 pertemuan dan pemilih tema warna pastel.", { boldPrefix: "a." }),
          makeBullet("Menyediakan repositori materi kuliah dengan fitur upload multi-berkas, kategorisasi tag, dan penampil dokumen langsung di aplikasi (In-App Previewer).", { boldPrefix: "b." }),
          makeBullet("Menyediakan modul Task & Deadline Tracker dengan visualisasi Kanban/Tabel, modal edit rincian tugas secara menyeluruh, serta riwayat versi jawaban (v1 s.d. v3).", { boldPrefix: "c." }),
          makeBullet("Mewujudkan 'Personal Second Brain' bagi Yuli Indiyanti guna menekan waktu pencarian materi hingga di bawah 5 detik dan memastikan nihil tugas terlewat sepanjang semester perkuliahan.", { boldPrefix: "d." }),

          makeSubchapterTitle("1.6 Manfaat Produk"),
          makeParagraph("Manfaat yang diharapkan dari pengembangan sistem informasi ini meliputi:"),
          makeBullet("Meningkatkan fokus dan efisiensi belajar mahasiswa berkat lingkungan digital yang bebas distraksi, rapi, dan teratur.", { boldPrefix: "1. Manfaat bagi Mahasiswa:" }),
          makeBullet("Menghilangkan kecemasan terhadap tenggat waktu perkuliahan berkat adanya indikator visual batas waktu yang dinamis.", { boldPrefix: "2. Reduksi Beban Pikiran (Cognitive Offloading):" }),
          makeBullet("Sebagai portofolio nyata dan bukti kompetensi dalam menerapkan disiplin ilmu Analisis dan Perancangan Perangkat Lunak (APPL) untuk membangun produk perangkat lunak skala produksi secara mandiri.", { boldPrefix: "3. Manfaat Akademik:" }),

          makeSubchapterTitle("1.7 Sistematika Penulisan Proposal"),
          makeParagraph("Proposal ini disusun secara sistematis ke dalam enam bab pembahasan:"),
          makeBullet("Berisi latar belakang masalah, identifikasi masalah, rumusan masalah, batasan masalah, tujuan, manfaat, dan sistematika penulisan.", { boldPrefix: "BAB I PENDAHULUAN:" }),
          makeBullet("Menguraikan teori-teori pendukung seperti sistem informasi akademik, konsep Second Brain, teknologi Next.js, basis data relasional SQLite, dan ergonomi visual Soft Pastel.", { boldPrefix: "BAB II LANDASAN TEORI:" }),
          makeBullet("Membahas analisis masalah sistem berjalan menggunakan kerangka PIECES, karakteristik pengguna, spesifikasi kebutuhan fungsional (MoSCoW), dan non-fungsional.", { boldPrefix: "BAB III ANALISIS KEBUTUHAN SISTEM:" }),
          makeBullet("Menyajikan rancangan arsitektur sistem tiga lapis, diagram alur logika proses, perancangan basis data dan kamus data, serta visualisasi antarmuka pengguna.", { boldPrefix: "BAB IV PERANCANGAN SISTEM:" }),
          makeBullet("Menjabarkan metodologi Agile sprint 1 minggu, rincian jadwal kerja harian, matriks deliverables, estimasi anggaran biaya Rp 0, dan kebutuhan sumber daya.", { boldPrefix: "BAB V RENCANA KERJA DAN ANGGARAN BIAYA:" }),
          makeBullet("Memuat kesimpulan akhir dari perancangan sistem dan rekomendasi arah pengembangan pada versi selanjutnya.", { boldPrefix: "BAB VI PENUTUP:" }),

          // PAGE BREAK MENUJU BAB II
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // 6. BAB II: LANDASAN TEORI
          // ==========================================
          ...makeChapterTitle("BAB II", "LANDASAN TEORI DAN TINJAUAN PUSTAKA"),

          makeSubchapterTitle("2.1 Sistem Informasi Akademik & Personal Knowledge Management (Second Brain)"),
          makeParagraph("Sistem Informasi Akademik (SIAKAD) pada umumnya dirancang untuk memenuhi kebutuhan tata kelola administratif perguruan tinggi dalam skala makro, seperti registrasi kartu rencana studi (KRS), penjadwalan ruang kuliah massal, dan pencatatan nilai akhir di tingkat program studi. Namun demikian, sistem skala kelembagaan tersebut tidak dirancang untuk menangani kebutuhan manajemen belajar mikro harian seorang mahasiswa, seperti mengarsipkan draf tugas mingguan, menyimpan e-book referensi bab tertentu, maupun mencatat instruksi khusus dari dosen di kelas."),

          makeParagraph("Konsep \"Second Brain\" (Otak Kedua) yang dipopulerkan oleh Tiago Forte (2022) dalam metodologi Building a Second Brain menyatakan bahwa kapasitas memori biologis manusia tidak dirancang untuk menyimpan ribuan butir informasi teknis secara statis, melainkan untuk berpikir kreatif, menganalisis masalah, dan mengambil keputusan. Oleh karena itu, mahasiswa memerlukan sebuah 'External Digital Brain' yang sistematis untuk mengumpulkan (Capture), mengorganisir (Organize), menyaring inti sari (Distill), dan mengekspresikan karya akademik (Express). Aplikasi \"Yuli's Vault\" mengadopsi prinsip ini dengan menyediakan repositori terpusat bagi seluruh artefak perkuliahan."),

          makeSubchapterTitle("2.2 Metodologi Analisis OOAD & Agile Rapid Prototyping"),
          makeParagraph("Dalam rekayasa perangkat lunak, Object-Oriented Analysis and Design (OOAD) merupakan pendekatan standar industri yang memodelkan sistem informasi sebagai kumpulan objek yang saling berinteraksi dan memiliki atribut serta perilaku tertentu. Dalam sistem Yuli's Vault, entitas dunia nyata perkuliahan dimodelkan ke dalam objek Course, Assignment, Material, Submission, dan NoteComment."),

          makeParagraph("Guna menyelesaikan pengembangan dalam rentang waktu yang sangat terbatas (1 minggu), proyek ini mengombinasikan OOAD dengan metodologi Agile Rapid Prototyping. Pendekatan ini menekankan pada siklus iterasi harian yang sangat cepat: merancang model data, membangun antarmuka prototipe fungsional, melakukan uji coba internal, menerima umpan balik, dan langsung mengintegrasikan perbaikan kode secara berkesinambungan tanpa hambatan birokrasi dokumentasi yang kaku."),

          makeSubchapterTitle("2.3 Ekosistem Next.js 15, React 19, dan TypeScript"),
          makeParagraph("Next.js versi 15 merupakan kerangka kerja (framework) React fullstack tingkat lanjut yang mengusung paradigma App Router berbasis React Server Components (RSC). Keunggulan utama Next.js 15 dalam proyek ini adalah:"),
          makeBullet("Memungkinkan perenderan komponen di sisi server (Server Components) untuk memangkas ukuran bundel JavaScript yang dikirim ke peramban, menghasilkan waktu muat awal halaman yang instan.", { boldPrefix: "1. Kinerja Perenderan Optimal:" }),
          makeBullet("Fitur Server Actions memungkinkan fungsi-fungsi manipulasi data (seperti menambah tugas, mengubah deadline, dan mengunggah berkas) dieksekusi secara asinkron di server secara langsung dari komponen klien tanpa perlu menyusun endpoint REST API perantara.", { boldPrefix: "2. Next.js Server Actions:" }),
          makeBullet("Penggunaan TypeScript versi 5.7 menjamin keamanan tipe data (type-safety) secara mutlak dari lapisan antarmuka hingga lapisan basis data, meminimalkan potensi runtime error seperti 'undefined is not a function'.", { boldPrefix: "3. Keamanan Tipe (Type-Safety):" }),

          makeSubchapterTitle("2.4 Basis Data Relasional SQLite dan Prisma ORM"),
          makeParagraph("SQLite merupakan mesin basis data relasional berbasis berkas (file-based database engine) yang mandiri, tanpa konfigurasi server yang rumit (serverless), serta memiliki efisiensi I/O yang sangat tinggi. Karakteristik ini menjadikan SQLite pilihan sempurna untuk aplikasi personal vault karena berkas basis data (`prisma/dev.db`) dapat disalin, dicadangkan, atau dipindahkan ke komputer lain dengan mudah."),

          makeParagraph("Prisma ORM (Object-Relational Mapping) berfungsi sebagai jembatan deklaratif antara kode TypeScript dan basis data SQLite. Dengan Prisma Schema, pengembang dapat mendefinisikan skema tabel, relasi referensial (seperti One-to-Many antara Mata Kuliah dan Tugas), serta aturan integritas Cascade Delete. Prisma Client secara otomatis menghasilkan query SQL yang teroptimasi, aman dari ancaman SQL Injection, dan sepenuhnya bertipe kuat (strongly-typed)."),

          makeSubchapterTitle("2.5 Ergonomi Visual Soft Pastel Design System dan Standar Aksesibilitas WCAG"),
          makeParagraph("Kenyamanan visual saat belajar dalam durasi lama ditentukan oleh penerapan teori warna yang tepat. Sistem desain visual Yuli's Vault menerapkan Soft Pastel Design System yang mengombinasikan warna latar bertingkat kejenuhan rendah (low-saturation pastel surfaces) dengan teks berwarna gelap kontras tinggi (deep muted contrast text)."),

          makeParagraph("Standar Web Content Accessibility Guidelines (WCAG) 2.1 Level AA mensyaratkan rasio kontras teks terhadap warna latar minimal sebesar 4.5:1 untuk teks normal dan Level AAA sebesar 7:1. Penerapan warna pada Yuli's Vault (seperti teks `#3730A3` di atas latar `#E0E7FF`, atau teks `#065F46` di atas latar `#D1FAE5`) menghasilkan rasio kontras melebihi 7:1, sehingga memenuhi standar keterbacaan tertinggi sekaligus menghindarkan pengguna dari silau visual."),

          // PAGE BREAK MENUJU BAB III
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // 7. BAB III: ANALISIS KEBUTUHAN SISTEM
          // ==========================================
          ...makeChapterTitle("BAB III", "ANALISIS KEBUTUHAN SISTEM"),

          makeSubchapterTitle("3.1 Analisis Sistem yang Berjalan (Kerangka PIECES)"),
          makeParagraph("Untuk memahami kelemahan sistem pengelolaan akademik konvensional yang digunakan mahasiswa saat ini, dilakukan evaluasi komprehensif menggunakan kerangka analisis PIECES (Performance, Information, Economics, Control, Efficiency, Service):"),

          makeTableCaption("Tabel 3.1", "Analisis Sistem Pengelolaan Akademik Menggunakan Kerangka PIECES"),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  makeCell("Dimensi PIECES", { isHeader: true, width: 2200 }),
                  makeCell("Kondisi Sistem Berjalan (Konvensional)", { isHeader: true, width: 2868 }),
                  makeCell("Target Perbaikan pada Yuli's Vault", { isHeader: true, width: 2869 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Performance (Kinerja)", { bold: true }),
                  makeCell("Pencarian berkas di WhatsApp/Drive memakan waktu 10-15 menit per berkas."),
                  makeCell("Temu-kembali berkas dan pencarian instan selesai dalam waktu < 5 detik."),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Information (Informasi)", { bold: true }),
                  makeCell("Tenggat waktu tugas sering terlewat karena tidak ada klasifikasi urgensi visual."),
                  makeCell("Detektor urgensi otomatis berbasis waktu (< 24 jam merah, 1-3 hari kuning)."),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Economics (Ekonomi)", { bold: true }),
                  makeCell("Layanan cloud komersial (Notion, Google One) menuntut biaya langganan bulanan."),
                  makeCell("Arsitektur 100% Free-Tier (Rp 0/bulan) menggunakan Next.js dan SQLite."),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Control (Pengendalian)", { bold: true }),
                  makeCell("Riwayat draf tugas tidak terpantau, rentan salah kirim berkas belum selesai."),
                  makeCell("Sistem kontrol versi berkas (v1 draf, v2 revisi, v3 final) dan bukti submit."),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Efficiency (Efisiensi)", { bold: true }),
                  makeCell("Mahasiswa harus membuka banyak tab (LMS, folder, catatan) secara terpisah."),
                  makeCell("Workspace terpadu split-view: membaca materi sambil mengetik catatan."),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Service (Pelayanan)", { bold: true }),
                  makeCell("Antarmuka konvensional kaku, membosankan, dan menyebabkan mata cepat lelah."),
                  makeCell("Antarmuka Soft Pastel ergonomis yang menenangkan mata saat belajar lama."),
                ],
              }),
            ],
          }),

          makeSubchapterTitle("3.2 Profil dan Karakteristik Pengguna"),
          makeParagraph("Sistem informasi ini secara spesifik dirancang untuk pengguna tunggal (Single-User) dengan profil:"),
          makeBullet("Mahasiswa aktif Program Studi Teknik Informatika, Fakultas Teknologi Informasi dan Ilmu Komputer.", { boldPrefix: "• Identitas:" }),
          makeBullet("Yuli Indiyanti (NIM: 240511130 | Kelas: TI24D).", { boldPrefix: "• Nama & Identitas Akademik:" }),
          makeBullet("Memiliki kecakapan teknologi tingkat menengah-tinggi (Tech-Savvy), terbiasa dengan pintasan keyboard, manajemen file digital, dan lingkungan pemrograman.", { boldPrefix: "• Kemahiran Digital:" }),
          makeBullet("Membutuhkan sistem manajemen studi yang cepat, tidak berbelit-belit dengan autentikasi multi-user yang rumit, responsif di ponsel cerdas saat mengecek jadwal, dan luas di layar laptop saat belajar.", { boldPrefix: "• Preferensi Alur Kerja:" }),

          makeSubchapterTitle("3.3 Spesifikasi Kebutuhan Fungsional (MoSCoW Framework)"),
          makeParagraph("Kebutuhan fungsional sistem diklasifikasikan menggunakan metode MoSCoW: Must-Have (wajib ada pada rilis pertama), Should-Have (sangat penting melengkapi alur kerja), dan Could-Have (fitur tambahan bernilai guna tinggi):"),

          makeTableCaption("Tabel 3.2", "Matriks Kebutuhan Fungsional Sistem Berdasarkan Metode MoSCoW"),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  makeCell("Kode", { isHeader: true, width: 900 }),
                  makeCell("Modul Fitur", { isHeader: true, width: 2200 }),
                  makeCell("Deskripsi Spesifikasi Kebutuhan Fungsional", { isHeader: true, width: 3637 }),
                  makeCell("Prioritas", { isHeader: true, width: 1200 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-01", { bold: true }),
                  makeCell("Manajemen Semester", { bold: true }),
                  makeCell("Pengguna dapat membuat, memilih, dan mengarsipkan semester aktif sebagai filter data global."),
                  makeCell("Must-Have (P0)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-02", { bold: true }),
                  makeCell("Manajemen Mata Kuliah", { bold: true }),
                  makeCell("Pengguna dapat menambah, mengedit, dan menghapus mata kuliah (Kode, Nama, SKS, Dosen, Jadwal, Tema Warna Pastel)."),
                  makeCell("Must-Have (P0)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-03", { bold: true }),
                  makeCell("Silabus 16 Pertemuan", { bold: true }),
                  makeCell("Pengelompokan otomatis berkas materi dan tugas berdasarkan minggu pertemuan (Minggu 1 s.d. 16, UTS, UAS)."),
                  makeCell("Should-Have (P1)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-04", { bold: true }),
                  makeCell("Multi-File Upload Materi", { bold: true }),
                  makeCell("Dukungan upload berkas materi (PDF, DOCX, ZIP, PPTX) ke direktori lokal server secara instan."),
                  makeCell("Must-Have (P0)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-05", { bold: true }),
                  makeCell("Kategorisasi & Tagging", { bold: true }),
                  makeCell("Pemberian kategori (Slide, E-Book, Rekaman, Tautan) dan tag pastel (#bahan-uts, dll.)."),
                  makeCell("Must-Have (P0)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-06", { bold: true }),
                  makeCell("In-App Document Preview", { bold: true }),
                  makeCell("Membuka dan membaca berkas PDF atau gambar langsung di browser tanpa perlu unduh ulang."),
                  makeCell("Must-Have (P0)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-07", { bold: true }),
                  makeCell("Pencarian & Filter Instan", { bold: true }),
                  makeCell("Pencarian cepat berdasarkan judul materi, nama berkas, mata kuliah, dan tag warna."),
                  makeCell("Must-Have (P0)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-08", { bold: true }),
                  makeCell("Pencatatan Tugas Baru", { bold: true }),
                  makeCell("Pencatatan tugas dengan tanggal/jam deadline, deskripsi, bobot %, prioritas, dan lampiran soal."),
                  makeCell("Must-Have (P0)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-09", { bold: true }),
                  makeCell("Papan Kanban & Tabel", { bold: true }),
                  makeCell("Visualisasi alur kerja tugas: Belum Dimulai, Sedang Dikerjakan, Siap Kumpul, Sudah Dikumpulkan."),
                  makeCell("Must-Have (P0)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-10", { bold: true }),
                  makeCell("Detektor Urgensi Waktu", { bold: true }),
                  makeCell("Kalkulasi dinamis sisa waktu: Merah (< 24 jam/terlambat), Kuning (1-3 hari), Hijau (> 3 hari)."),
                  makeCell("Must-Have (P0)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-11", { bold: true }),
                  makeCell("Modal Edit Lengkap Tugas", { bold: true }),
                  makeCell("Pengguna dapat mengedit kembali judul, deadline (datetime-local), instruksi, bobot, prioritas, dan lampiran soal."),
                  makeCell("Must-Have (P0)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-12", { bold: true }),
                  makeCell("Versioning Pengumpulan", { bold: true }),
                  makeCell("Penyimpanan riwayat draf pengumpulan tugas (v1, v2, v3) beserta tautan bukti submit LMS."),
                  makeCell("Must-Have (P0)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-13", { bold: true }),
                  makeCell("Pencatatan Nilai & Mutu", { bold: true }),
                  makeCell("Penginputan skor nilai angka (0-100), huruf mutu (A-E), serta evaluasi/feedback dari dosen."),
                  makeCell("Should-Have (P1)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-14", { bold: true }),
                  makeCell("Workspace Split-View", { bold: true }),
                  makeCell("Tampilan layar terpisah antara pratinjau materi kuliah dan editor catatan Markdown."),
                  makeCell("Should-Have (P1)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-15", { bold: true }),
                  makeCell("Log Komentar & Diskusi", { bold: true }),
                  makeCell("Kolom log aktivitas dan catatan pemikiran berstempel waktu (timestamped) pada setiap tugas."),
                  makeCell("Should-Have (P1)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-16", { bold: true }),
                  makeCell("Kalkulator IPK Semester", { bold: true }),
                  makeCell("Kalkulasi otomatis bobot nilai berjalan dan estimasi Indeks Prestasi Kumulatif semester."),
                  makeCell("Could-Have (P2)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-17", { bold: true }),
                  makeCell("Tautan Berbagi Publik", { bold: true }),
                  makeCell("Pembuatan tautan baca-saja (read-only share link) materi perkuliahan untuk rekan mahasiswa."),
                  makeCell("Could-Have (P2)", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("FR-18", { bold: true }),
                  makeCell("Cadangan & Ekspor JSON", { bold: true }),
                  makeCell("Pencadangan seluruh data akademik ke dalam satu berkas JSON untuk keamanan jangka panjang."),
                  makeCell("Must-Have (P0)", { bold: true }),
                ],
              }),
            ],
          }),

          makeSubchapterTitle("3.4 Spesifikasi Kebutuhan Non-Fungsional"),
          makeParagraph("Kebutuhan non-fungsional memastikan sistem beroperasi dengan performa tinggi, andal, dan ramah pengguna:"),
          makeBullet("Waktu render awal halaman (First Contentful Paint) tidak melebihi 1,5 detik, dan waktu eksekusi pencarian lokal instan di bawah 100 milidetik.", { boldPrefix: "1. Kinerja & Kecepatan:" }),
          makeBullet("Seluruh operasi penulisan data (create, update, delete) dikelola melalui transaksi Prisma dengan dukungan optimasi optimistic UI.", { boldPrefix: "2. Keandalan Data:" }),
          makeBullet("Menerapkan rasio kontras warna tinggi (WCAG Level AA/AAA ≥ 7:1) pada seluruh kombinasi teks dan latar pastel.", { boldPrefix: "3. Ergonomi & Aksesibilitas:" }),
          makeBullet("Tata letak dirancang responsif adaptif terhadap resolusi layar gawai mulai dari 360px hingga 1920px.", { boldPrefix: "4. Responsivitas:" }),

          // PAGE BREAK MENUJU BAB IV
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // 8. BAB IV: PERANCANGAN SISTEM
          // ==========================================
          ...makeChapterTitle("BAB IV", "PERANCANGAN SISTEM DAN ARSITEKTUR PERANGKAT LUNAK"),

          makeSubchapterTitle("4.1 Arsitektur Sistem Tiga Lapis (Three-Tier Architecture)"),
          makeParagraph("Aplikasi Yuli's Vault dirancang menggunakan arsitektur monolitik modern tiga lapis (Three-Tier Architecture) yang terintegrasi di dalam ekosistem Next.js 15:"),
          makeBullet("Dibangun menggunakan Next.js Client Components, Tailwind CSS, Lucide Icons, dan Sonner Toast. Mengelola status aplikasi secara global dan reaktif menggunakan React Context API (VaultContext).", { boldPrefix: "1. Presentation Layer (Lapisan Klien):" }),
          makeBullet("Menggunakan Next.js Server Actions (src/actions/vaultActions.ts) sebagai pemroses logika bisnis yang berjalan di sisi server secara aman, serta endpoint /api/upload untuk mengelola berkas multipart.", { boldPrefix: "2. Application / Logic Layer (Lapisan Server):" }),
          makeBullet("Memanfaatkan basis data relasional SQLite lokal (prisma/dev.db) yang diabstraksikan oleh Prisma Client untuk eksekusi query data yang konsisten dan terisolasi.", { boldPrefix: "3. Data Layer (Lapisan Basis Data):" }),

          makeSubchapterTitle("4.2 Diagram Alur Logika Pengguna (Core User Flows)"),
          makeParagraph("Sistem memiliki empat alur interaksi pengguna utama:"),
          makeBullet("Pengguna mengakses menu Mata Kuliah ➔ Menekan tombol '+ Tambah MK' ➔ Mengisi kode, nama, SKS, dosen, jadwal ➔ Memilih tema warna pastel ➔ Sistem menyimpan data ke basis data dan merender silabus 16 pertemuan.", { boldPrefix: "1. Alur Penyiapan Mata Kuliah:" }),
          makeBullet("Pengguna membuka halaman Materi ➔ Menyeret berkas dokumen ke dropzone ➔ Endpoint /api/upload memvalidasi dan menyimpan berkas ke direktori server ➔ Sistem mencatat metadata berkas ke tabel Material ➔ Pengguna dapat membaca berkas langsung di in-app previewer sambil menulis catatan Markdown.", { boldPrefix: "2. Alur Pengunggahan & Pratinjau Materi:" }),
          makeBullet("Pengguna membuka menu Tugas & Status (Task & Deadline Tracker) ➔ Menambah tugas baru dengan deadline dan berkas soal ➔ Kartu tugas tampil di kolom Kanban dengan badge urgensi otomatis ➔ Pengguna dapat membuka modal dan mengklik tombol 'Edit Rincian Tugas' (✏️) untuk mengubah batas waktu, instruksi, bobot, atau mengganti berkas soal ➔ Pengguna mengunggah draf jawaban (v1, v2) dan draf final (v3) ➔ Mengubah status menjadi 'Sudah Dikumpulkan' (memicu selebrasi konfeti).", { boldPrefix: "3. Alur Pelacakan & Pengeditan Tugas:" }),
          makeBullet("Setelah tugas dinilai oleh dosen, pengguna membuka modal tugas ➔ Menginputkan skor nilai angka (0-100) dan catatan feedback dosen ➔ Sistem menghitung konversi huruf mutu dan memperbarui grafik analitika IPK.", { boldPrefix: "4. Alur Evaluasi & Pencatatan Nilai:" }),

          makeSubchapterTitle("4.3 Perancangan Basis Data Relasional dan Kamus Data"),
          makeParagraph("Basis data terdiri dari 6 entitas tabel yang saling berelasi secara referensial. Berikut adalah kamus data rinci untuk setiap tabel:"),

          makeTableCaption("Tabel 4.1", "Kamus Data Tabel 'semesters' (Data Semester Akademik)"),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  makeCell("Nama Atribut", { isHeader: true, width: 2200 }),
                  makeCell("Tipe Data", { isHeader: true, width: 1600 }),
                  makeCell("Keterangan & Batasan", { isHeader: true, width: 4137 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("id", { bold: true }),
                  makeCell("String (CUID)"),
                  makeCell("Primary Key (Kunci Utama unik semester)"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("name", { bold: true }),
                  makeCell("String"),
                  makeCell("Nama semester (Contoh: 'Semester Ganjil 2026/2027')"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("startDate / endDate", { bold: true }),
                  makeCell("DateTime"),
                  makeCell("Rentang tanggal mulai dan berakhirnya perkuliahan"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("isActive", { bold: true }),
                  makeCell("Boolean"),
                  makeCell("Menandai apakah semester ini sedang aktif berjalan"),
                ],
              }),
            ],
          }),

          makeTableCaption("Tabel 4.2", "Kamus Data Tabel 'courses' (Data Mata Kuliah)"),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  makeCell("Nama Atribut", { isHeader: true, width: 2200 }),
                  makeCell("Tipe Data", { isHeader: true, width: 1600 }),
                  makeCell("Keterangan & Batasan", { isHeader: true, width: 4137 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("id / semesterId", { bold: true }),
                  makeCell("String (CUID)"),
                  makeCell("Primary Key / Foreign Key ke tabel semesters"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("code / name", { bold: true }),
                  makeCell("String"),
                  makeCell("Kode mata kuliah (TI24D) dan nama mata kuliah"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("credits", { bold: true }),
                  makeCell("Integer"),
                  makeCell("Jumlah Satuan Kredit Semester (SKS)"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("lecturerName / schedule", { bold: true }),
                  makeCell("String"),
                  makeCell("Nama dosen pengampu, hari kuliah, jam kuliah, dan ruangan"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("pastelColorHex / pastelTextHex", { bold: true }),
                  makeCell("String"),
                  makeCell("Kode warna tema soft pastel dan teks kontras pendukung"),
                ],
              }),
            ],
          }),

          makeTableCaption("Tabel 4.3", "Kamus Data Tabel 'materials' (Data Berkas Materi Kuliah)"),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  makeCell("Nama Atribut", { isHeader: true, width: 2200 }),
                  makeCell("Tipe Data", { isHeader: true, width: 1600 }),
                  makeCell("Keterangan & Batasan", { isHeader: true, width: 4137 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("id / courseId", { bold: true }),
                  makeCell("String (CUID)"),
                  makeCell("Primary Key / Foreign Key ke tabel courses (Cascade Delete)"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("weekNumber", { bold: true }),
                  makeCell("Integer"),
                  makeCell("Pertemuan kuliah minggu ke- (1 s.d. 16)"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("title / description", { bold: true }),
                  makeCell("String"),
                  makeCell("Judul berkas materi dan penjelasan ringkas materi"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("category", { bold: true }),
                  makeCell("String"),
                  makeCell("Enum: SLIDE, BOOK, RECORDING, LINK"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("fileUrl / fileName / fileSize", { bold: true }),
                  makeCell("String"),
                  makeCell("Lokasi berkas lokal server, nama berkas, dan ukuran berkas"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("tagsJson", { bold: true }),
                  makeCell("String (JSON)"),
                  makeCell("Daftar tag beranotasi pastel (#bahan-uts, dll.)"),
                ],
              }),
            ],
          }),

          makeTableCaption("Tabel 4.4", "Kamus Data Tabel 'assignments' (Data Tugas & Asesmen)"),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  makeCell("Nama Atribut", { isHeader: true, width: 2200 }),
                  makeCell("Tipe Data", { isHeader: true, width: 1600 }),
                  makeCell("Keterangan & Batasan", { isHeader: true, width: 4137 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("id / courseId", { bold: true }),
                  makeCell("String (CUID)"),
                  makeCell("Primary Key / Foreign Key ke tabel courses"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("title / instructions", { bold: true }),
                  makeCell("String"),
                  makeCell("Judul tugas dan petunjuk teknis pengerjaan tugas"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("dueDate", { bold: true }),
                  makeCell("DateTime"),
                  makeCell("Tenggat waktu pengumpulan (tanggal & jam tepat)"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("priority / status", { bold: true }),
                  makeCell("String"),
                  makeCell("Prioritas (LOW, MEDIUM, HIGH) & Status (TODO s.d. SUBMITTED)"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("type / weightPercentage", { bold: true }),
                  makeCell("String / Integer"),
                  makeCell("Kategori asesmen (TASK, PROJECT, QUIZ) & Bobot persentase nilai"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("attachmentUrl / attachmentName", { bold: true }),
                  makeCell("String"),
                  makeCell("Lampiran berkas soal dari dosen yang dapat diubah/diganti"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("score / gradeLetter", { bold: true }),
                  makeCell("Float / String"),
                  makeCell("Nilai perolehan (0-100) dan konversi huruf mutu (A-E)"),
                ],
              }),
            ],
          }),

          makeTableCaption("Tabel 4.5", "Kamus Data Tabel 'submissions' (Riwayat Versi Pengumpulan Berkas)"),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  makeCell("Nama Atribut", { isHeader: true, width: 2200 }),
                  makeCell("Tipe Data", { isHeader: true, width: 1600 }),
                  makeCell("Keterangan & Batasan", { isHeader: true, width: 4137 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("id / assignmentId", { bold: true }),
                  makeCell("String (CUID)"),
                  makeCell("Primary Key / Foreign Key ke tabel assignments"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("versionNumber", { bold: true }),
                  makeCell("Integer"),
                  makeCell("Penomoran versi berkas (1 = draf, 2 = revisi, 3 = final)"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("fileName / fileUrl / fileSize", { bold: true }),
                  makeCell("String"),
                  makeCell("Informasi berkas jawaban tugas yang diunggah"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("proofUrl / uploadedAt", { bold: true }),
                  makeCell("String / DateTime"),
                  makeCell("Bukti tangkapan layar submit LMS dan waktu unggah riil"),
                ],
              }),
            ],
          }),

          makeTableCaption("Tabel 4.6", "Kamus Data Tabel 'notes_comments' (Catatan Markdown & Log Diskusi)"),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  makeCell("Nama Atribut", { isHeader: true, width: 2200 }),
                  makeCell("Tipe Data", { isHeader: true, width: 1600 }),
                  makeCell("Keterangan & Batasan", { isHeader: true, width: 4137 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("id", { bold: true }),
                  makeCell("String (CUID)"),
                  makeCell("Primary Key unik entitas catatan"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("courseId / materialId / assignmentId", { bold: true }),
                  makeCell("String (Nullable)"),
                  makeCell("Relasi fleksibel ke mata kuliah, materi, atau tugas tertentu"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("contentMarkdown", { bold: true }),
                  makeCell("String"),
                  makeCell("Isi teks catatan dalam format Markdown terstruktur"),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("type / isShared / shareToken", { bold: true }),
                  makeCell("String / Boolean"),
                  makeCell("Tipe catatan (SUMMARY_NOTE atau COMMENT_LOG) dan token publik"),
                ],
              }),
            ],
          }),

          makeSubchapterTitle("4.4 Desain Antarmuka Pengguna & Output Implementasi Nyata"),
          makeParagraph("Seluruh rancangan antarmuka telah berhasil diwujudkan dalam kode produksi nyata:"),
          makeBullet("Menampilkan identitas 'Yuli's Vault', hero title 'Yuli's Second Brain', sub-teks resmi 'Streamline your study workflow. Track tasks and manage materials effortlessly.', serta badge identitas resmi pemilik vault: Yuli Indiyanti NIM 240511130 KELAS TI24D.", { boldPrefix: "1. Header & Identitas Vault:" }),
          makeBullet("Sidebar navigasi tertata rapi dan intuitif dengan label baku: 'Dashboard', 'Mata Kuliah', 'Tugas & Status', 'Materi', 'Rekap Nilai & IPK', serta 'Pengaturan & Backup'.", { boldPrefix: "2. Navigasi Sidebar Utama:" }),
          makeBullet("Dilengkapi switcher antara mode Kanban dan Tabel, detektor batas waktu sisa jam/hari (Rose Coral < 24 jam, Apricot Peach 1-3 hari), serta modal edit interaktif (ikon pensil ✏️) yang memungkinkan pengubahan judul tugas, tanggal/jam deadline (datetime-local), instruksi pengerjaan, bobot %, prioritas, kategori asesmen, serta mengganti/menghapus lampiran soal.", { boldPrefix: "3. Halaman Tugas & Status (Task & Deadline Tracker):" }),
          makeBullet("Repositori dokumen kuliah dengan drag-and-drop upload, filter format materi, pratinjau langsung file PDF/gambar, serta tombol pembersih materi contoh bawaan (clean seed data).", { boldPrefix: "4. Halaman Materi:" }),

          // PAGE BREAK MENUJU BAB V
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // 9. BAB V: RENCANA KERJA & ANGGARAN BIAYA
          // ==========================================
          ...makeChapterTitle("BAB V", "RENCANA KERJA, JADWAL IMPLEMENTASI, DAN ANGGARAN BIAYA"),

          makeSubchapterTitle("5.1 Metodologi Agile Rapid Prototyping (1-Week Sprint)"),
          makeParagraph("Pengembangan sistem dilaksanakan selama 1 minggu (7 hari kerja) menggunakan metode Agile Rapid Prototyping terstruktur. Setiap hari kalender difokuskan pada satu milestone utama yang langsung teruji dan terintegrasi."),

          makeSubchapterTitle("5.2 Rincian Jadwal Pelaksanaan Harian (Hari 1 s.d. Hari 7)"),
          makeTableCaption("Tabel 5.1", "Rincian Pelaksanaan Sprint 1 Minggu Pengembangan Yuli's Vault"),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  makeCell("Hari", { isHeader: true, width: 1100 }),
                  makeCell("Aktivitas Rekayasa Perangkat Lunak", { isHeader: true, width: 3200 }),
                  makeCell("Target Deliverables / Bukti Luaran", { isHeader: true, width: 2537 }),
                  makeCell("Status", { isHeader: true, width: 1100 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Hari 1", { bold: true }),
                  makeCell("Analisis kebutuhan, perumusan PRD, inisialisasi Next.js 15, konfigurasi Tailwind CSS, skema Prisma, dan SQLite."),
                  makeCell("Dokumen PRD v1.2, Repo GitHub terhubung, Basis Data dev.db aktif."),
                  makeCell("Tuntas", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Hari 2", { bold: true }),
                  makeCell("Penerapan sistem visual Soft Pastel, pembuatan komponen layout shell, sidebar navigasi, dan dukungan tema terang/gelap."),
                  makeCell("Token CSS Variables pastel, Navbar, Sidebar responsif."),
                  makeCell("Tuntas", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Hari 3", { bold: true }),
                  makeCell("Pembangunan modul Semester & Mata Kuliah (CRUD MK, SKS, jadwal, silabus 16 pertemuan, dan pastel color picker)."),
                  makeCell("Halaman daftar MK, pemilih tema pastel, kartu jadwal mingguan."),
                  makeCell("Tuntas", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Hari 4", { bold: true }),
                  makeCell("Pembangunan repositori materi kuliah, endpoint /api/upload lokal, pratinjau dokumen PDF/gambar, dan split-view Markdown."),
                  makeCell("Upload engine aktif, filter format berkas, tombol clean seed data."),
                  makeCell("Tuntas", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Hari 5", { bold: true }),
                  makeCell("Pengembangan Task & Deadline Tracker (mode Kanban 4 status, tabel tugas, detektor urgensi sisa jam, kontrol versi v1-v3)."),
                  makeCell("Papan Kanban reaktif, form submit tugas, arsip bukti LMS."),
                  makeCell("Tuntas", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Hari 6", { bold: true }),
                  makeCell("Pengembangan fitur edit lengkap tugas (✏️), analitika rekapitulasi nilai IPK, ekspor JSON, serta rebranding identitas Yuli's Vault."),
                  makeCell("Modal edit tugas menyeluruh persisten ke SQLite, identitas resmi TI24D."),
                  makeCell("Tuntas", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Hari 7", { bold: true }),
                  makeCell("Testing produksi (npm run build exit code 0), audit aksesibilitas, sinkronisasi Git push main, dan penyusunan proposal resmi."),
                  makeCell("Build produksi berhasil, repositori terbarui, dokumen proposal DOCX."),
                  makeCell("Tuntas", { bold: true }),
                ],
              }),
            ],
          }),

          makeSubchapterTitle("5.3 Analisis Anggaran Biaya Operasional (100% Free-Tier / Rp 0)"),
          makeParagraph("Sistem dirancang dengan arsitektur bebas biaya berlangganan guna menjamin kemandirian operasional mahasiswa:"),

          makeTableCaption("Tabel 5.2", "Rincian Analisis Biaya Infrastruktur Perangkat Lunak"),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  makeCell("Komponen Infrastruktur", { isHeader: true, width: 2400 }),
                  makeCell("Teknologi yang Dipilih", { isHeader: true, width: 2400 }),
                  makeCell("Kapasitas Bebas Biaya (Free-Tier)", { isHeader: true, width: 2037 }),
                  makeCell("Biaya / Bulan", { isHeader: true, width: 1100 }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Framework Fullstack"),
                  makeCell("Next.js 15 (App Router) & React 19"),
                  makeCell("Lisensi Open Source MIT"),
                  makeCell("Rp 0,-", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Basis Data Relasional"),
                  makeCell("SQLite via Prisma ORM"),
                  makeCell("Penyimpanan lokal pada disk komputer"),
                  makeCell("Rp 0,-", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Penyimpanan Berkas"),
                  makeCell("Local Upload Engine (/public/uploads)"),
                  makeCell("Sesuai kapasitas sisa harddisk"),
                  makeCell("Rp 0,-", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("Hosting & Deployment"),
                  makeCell("Vercel Hobby Plan & GitHub"),
                  makeCell("100 GB Bandwidth / bln + SSL Otomatis"),
                  makeCell("Rp 0,-", { bold: true }),
                ],
              }),
              new TableRow({
                children: [
                  makeCell("TOTAL BIAYA OPERASIONAL", { bold: true, bgColor: "F1F5F9", width: 6837 }, { colspan: 3 }),
                  makeCell("Rp 0,- / Bln", { bold: true, width: 1100 }),
                ],
              }),
            ],
          }),

          makeSubchapterTitle("5.4 Sumber Daya Perangkat Keras dan Perangkat Lunak"),
          makeParagraph("Spesifikasi minimum lingkungan yang digunakan untuk pengembangan dan pengoperasian sistem meliputi:"),
          makeBullet("Komputer Laptop dengan Processor Intel Core i3 / AMD Ryzen 3, RAM minimal 4 GB (disarankan 8 GB), dan ruang penyimpanan kosong minimal 1 GB.", { boldPrefix: "1. Perangkat Keras:" }),
          makeBullet("Sistem Operasi Windows 10/11 / macOS / Linux, Runtime Node.js versi 24 LTS, npm versi 10, serta browser Google Chrome atau Microsoft Edge terbaru.", { boldPrefix: "2. Perangkat Lunak:" }),

          // PAGE BREAK MENUJU BAB VI
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // 10. BAB VI: KESIMPULAN & PENUTUP
          // ==========================================
          ...makeChapterTitle("BAB VI", "KESIMPULAN DAN SARAN"),

          makeSubchapterTitle("6.1 Kesimpulan"),
          makeParagraph("Berdasarkan seluruh tahapan rekayasa perangkat lunak yang telah dilaksanakan dalam sprint 1 minggu (7 hari kerja), dapat diambil kesimpulan sebagai berikut:"),
          makeBullet("Sistem Informasi Akademik Pribadi 'Yuli's Vault (Yuli's Second Brain)' berhasil dirancang dan diimplementasikan secara utuh sebagai wadah terintegrasi untuk mengorganisasi seluruh materi kuliah, melacak tugas akademik, dan mencatat evaluasi nilai perkuliahan mahasiswa.", { boldPrefix: "1." }),
          makeBullet("Penerapan Next.js 15 App Router, React 19, TypeScript, dan Prisma ORM dengan basis data SQLite terbukti menghasilkan aplikasi web yang sangat responsif, aman bertipe kuat, andal, serta 100% bebas biaya operasional bulanan (Rp 0/bulan).", { boldPrefix: "2." }),
          makeBullet("Modul Task & Deadline Tracker berhasil menghadirkan alur kerja produktif dengan tampilan papan Kanban dan tabel, indikator urgensi dinamis berbasis waktu nyata, kontrol versi berkas jawaban (v1 s.d. v3), serta modal penyuntingan rincian tugas secara menyeluruh (judul, batas waktu, instruksi, bobot %, prioritas, dan lampiran soal).", { boldPrefix: "3." }),
          makeBullet("Penerapan Soft Pastel Design System berhasil menciptakan kenyamanan visual yang ergonomis bagi mahasiswa saat belajar berjam-jam sekaligus memenuhi standar aksesibilitas kontras tinggi WCAG AA/AAA.", { boldPrefix: "4." }),
          makeBullet("Pengujian produksi akhir melalui perintah 'npm run build' menghasilkan status bebas error (exit code 0), dan seluruh kode sumber telah disinkronkan secara aman pada repositori GitHub resmi.", { boldPrefix: "5." }),

          makeSubchapterTitle("6.2 Saran dan Pengembangan Lanjutan"),
          makeParagraph("Untuk penyempurnaan sistem pada versi berikutnya (versi 2.0), disarankan beberapa hal:"),
          makeBullet("Menghubungkan webhook bot Telegram pribadi atau WhatsApp API untuk mengirimkan notifikasi pengingat otomatis ke ponsel mahasiswa pada H-1 dan H-6 jam sebelum batas waktu pengumpulan tugas.", { boldPrefix: "1. Integrasi Notifikasi Pengingat Eksternal:" }),
          makeBullet("Menyediakan fitur sinkronisasi jadwal kuliah dan batas waktu tugas secara dua arah dengan Google Calendar menggunakan format iCalendar (.ics).", { boldPrefix: "2. Sinkronisasi Kalender Eksternal:" }),
          makeBullet("Menyediakan opsi penyimpanan berkas cloud seperti Cloudflare R2 atau Supabase Storage apabila mahasiswa memerlukan akses berkas berukuran besar dari luar jaringan komputer lokal.", { boldPrefix: "3. Opsi Penyimpanan Awan (Cloud Object Storage):" }),

          // PAGE BREAK MENUJU DAFTAR PUSTAKA
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // 11. DAFTAR PUSTAKA
          // ==========================================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200, line: 280 },
            children: [
              new TextRun({
                text: "DAFTAR PUSTAKA",
                bold: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
          }),

          makeParagraphNoIndent("Forte, T. (2022). Building a Second Brain: A Proven Method to Organize Your Digital Life and Unlock Your Creative Potential. New York: Atria Books."),
          makeParagraphNoIndent("Pressman, R. S., & Maxim, B. R. (2020). Software Engineering: A Practitioner's Approach (9th ed.). New York: McGraw-Hill Education."),
          makeParagraphNoIndent("Sommerville, I. (2016). Software Engineering (10th ed.). Boston: Pearson Education."),
          makeParagraphNoIndent("Vercel Inc. (2025). Next.js Documentation: App Router, Server Components, and Server Actions. Diakses pada 24 Oktober 2026, dari https://nextjs.org/docs"),
          makeParagraphNoIndent("Prisma Data, Inc. (2025). Prisma ORM Documentation: Next-generation ORM for Node.js and TypeScript. Diakses pada 24 Oktober 2026, dari https://www.prisma.io/docs"),
          makeParagraphNoIndent("W3C. (2018). Web Content Accessibility Guidelines (WCAG) 2.1. World Wide Web Consortium. Diakses dari https://www.w3.org/TR/WCAG21/"),
          makeParagraphNoIndent("Schwaber, K., & Sutherland, J. (2020). The Scrum Guide: The Definitive Guide to Scrum: The Rules of the Game. Scrum.org."),

          // PAGE BREAK MENUJU LAMPIRAN
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // 12. LAMPIRAN
          // ==========================================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200, line: 280 },
            children: [
              new TextRun({
                text: "LAMPIRAN",
                bold: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
          }),

          makeSubchapterTitle("Lampiran 1: Tautan Repositori Kode Sumber & Status Verifikasi"),
          makeBullet("https://github.com/YuliIndiyanti/Website-Tugas-dan-Materi-Kuliah.git", { boldPrefix: "• URL Repositori GitHub:" }),
          makeBullet("main (Tersinkronisasi penuh)", { boldPrefix: "• Branch Utama:" }),
          makeBullet("npm run build — Exit Code 0 (Kompilasi Sukses 10 Halaman Statis & Dinamis)", { boldPrefix: "• Status Kompilasi Produksi:" }),
          makeBullet("Yuli Indiyanti (NIM: 240511130 | Kelas: TI24D | Teknik Informatika)", { boldPrefix: "• Identitas Pemilik & Pengembang:" }),

          makeSubchapterTitle("Lampiran 2: Petunjuk Instalasi & Menjalankan Aplikasi di Komputer Lokal"),
          makeParagraphNoIndent("1. Clone repositori dari GitHub:\n   git clone https://github.com/YuliIndiyanti/Website-Tugas-dan-Materi-Kuliah.git\n\n2. Masuk ke direktori proyek dan pasang dependensi:\n   cd Website-Tugas-dan-Materi-Kuliah\n   npm install\n\n3. Sinkronkan skema basis data SQLite via Prisma:\n   npx prisma db push\n\n4. Jalankan server pengembangan lokal:\n   npm run dev\n\n5. Buka peramban web pada alamat:\n   http://localhost:3000"),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, "..", "PROPOSAL_PERANCANGAN_WEBSITE_YULIS_VAULT.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log("Successfully generated formal proposal DOCX:", outputPath);
}

buildFormalProposalDocx().catch((err) => {
  console.error("Error generating formal docx:", err);
  process.exit(1);
});
