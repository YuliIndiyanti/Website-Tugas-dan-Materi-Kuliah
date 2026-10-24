import {
  Semester,
  Course,
  Material,
  Assignment,
  Submission,
  NoteComment,
} from "@/types";

export const WORST_CASE_SEMESTERS: Semester[] = [
  {
    id: "sem-worst-case",
    name: "Semester Ganjil Reguler Lanjut Tahun Akademik 2026/2027 (Program Merdeka Belajar Kampus Merdeka & MBKM Riset Terpadu)",
    startDate: "2026-09-01",
    endDate: "2027-02-28",
    isActive: true,
    createdAt: "2026-09-01T00:00:00.000Z",
  },
];

export const WORST_CASE_COURSES: Course[] = [
  {
    id: "course-worst-1",
    semesterId: "sem-worst-case",
    code: "IF-COMP-SEC-3012-LAB",
    name: "Perancangan & Implementasi Arsitektur Perangkat Lunak Skala Besar Terdistribusi Berbasis Microservices & Event-Driven Architecture",
    credits: 6,
    lecturerName: "Prof. Dr. Ir. Raden Mas Haryo Danang Kusumo Atmojo Hadiningrat, S.T., M.Kom., Ph.D., IPU., ASEAN Eng.",
    scheduleDay: "Senin",
    scheduleTime: "07:30 - 12:45",
    roomOrLink: "Gedung Laboratorium Terpadu Cyber-Physical Systems Lantai 4 Ruang 402-B / Link Zoom Utama Kuliah Daring https://zoom.us/j/98127391823?pwd=V1dVM0ZKYlJvUT09",
    pastelThemeId: "baby-blue",
    pastelColorHex: "#DBEAFE",
    pastelTextHex: "#1E3A8A",
    createdAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "course-worst-2",
    semesterId: "sem-worst-case",
    code: "X",
    name: "Praktikum Mandiri",
    credits: 1,
    lecturerName: "Dr. Jo",
    scheduleDay: "Jumat",
    scheduleTime: "16:00 - 17:00",
    roomOrLink: "Lab 1",
    pastelThemeId: "sakura-blush",
    pastelColorHex: "#FCE7F3",
    pastelTextHex: "#9D174D",
    createdAt: "2026-09-01T08:00:00.000Z",
  },
];

export const WORST_CASE_MATERIALS: Material[] = [
  {
    id: "mat-worst-1",
    courseId: "course-worst-1",
    weekNumber: 7,
    title: "Slide Pertemuan 07: Analisis Komparatif Algoritma Distributed Consensus (Raft vs Paxos vs PBFT) pada Lingkungan Jaringan Latensi Tinggi",
    description: "Dokumen rincian arsitektur sistem konkurensi tingkat tinggi dengan beban konkurensi 10.000 request per detik, membahas protokol replikasi log, fault tolerance, quorum consensus, dan failover switching otomatis.",
    category: "SLIDE",
    fileName: "LAPORAN_FINAL_PRAKTIKUM_REKAYASA_PERANGKAT_LUNAK_SEMESTER_GANJIL_2026_KELOMPOK_4_SEKSI_02_REVISI_BISMILLAH_ACC_DOSEN_V3_FINAL.pdf",
    fileSize: "148.6 MB",
    mimeType: "application/pdf",
    tags: [
      { id: "tag-long", name: "#tugas-kelompok-gabungan-rekayasa-perangkat-lunak-lanjut", bgHex: "#FFE4E6", textHex: "#9F1239" },
      { id: "tag-penting", name: "#bahan-uas", bgHex: "#EDE9FE", textHex: "#5B21B6" },
    ],
    createdAt: "2026-10-24T10:00:00.000Z",
  },
  {
    id: "mat-worst-2",
    courseId: "course-worst-1",
    weekNumber: 8,
    title: "Tautan Repositori Acuan Skema Basis Data Skala Enterprise",
    description: "Dokumentasi API publik dengan parameter query panjang.",
    category: "LINK",
    externalUrl: "https://raw.githubusercontent.com/deepmind/advanced-agentic-coding/production/artifacts/releases/v2.4.0/academic-specifications-enterprise-architecture-model-reference.pdf?auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    tags: [
      { id: "tag-link", name: "#referensi-eksternal-wajib-baca", bgHex: "#DBEAFE", textHex: "#1E3A8A" },
    ],
    createdAt: "2026-10-24T12:00:00.000Z",
  },
];

export const WORST_CASE_ASSIGNMENTS: Assignment[] = [
  {
    id: "assign-worst-1",
    courseId: "course-worst-1",
    weekNumber: 8,
    title: "TUGAS_BESAR_ANALISIS_DAN_PERANCANGAN_SISTEM_INFORMASI_AKADEMIK_TERPADU_KULIAHVAULT_V1_2_FINAL_REVISI_BISMILLAH_ACC_DOSEN.pdf",
    instructions: "Susun dokumen spesifikasi kebutuhan perangkat lunak (SRS) dengan kamus data lengkap, Use Case Diagram 20 skenario, Sequence Diagram 15 alur, Class Diagram dengan relasi agregasi dan komposisi, serta diagram State Machine siklus hidup penyerahan berkas tugas.",
    dueDate: "2026-10-21T00:00:00.000Z", // Past due (Overdue 3 days)
    priority: "HIGH",
    status: "TODO",
    type: "PROJECT",
    weightPercentage: 45,
    createdAt: "2026-10-15T09:00:00.000Z",
  },
  {
    id: "assign-worst-2",
    courseId: "course-worst-1",
    weekNumber: 7,
    title: "Implementasi Sistem Autentikasi Menggunakan OAuth2 & Single-User Whitelist Security Barrier",
    instructions: "Uji performa waktu muat di bawah 1,5 detik dan pastikan seluruh endpoint private bucket diamankan oleh presigned URL.",
    dueDate: "2026-10-25T03:00:00.000Z", // < 6 hours left (Darurat Rose Coral)
    priority: "HIGH",
    status: "READY",
    type: "TASK",
    weightPercentage: 20,
    createdAt: "2026-10-20T10:00:00.000Z",
  },
  {
    id: "assign-worst-3",
    courseId: "course-worst-2",
    weekNumber: 1,
    title: "K",
    instructions: "Resume 1 paragraf.",
    dueDate: "2026-11-30T23:59:00.000Z",
    priority: "LOW",
    status: "SUBMITTED",
    type: "TASK",
    weightPercentage: 5,
    score: 100,
    gradeLetter: "A",
    lecturerFeedback: "Ringkas, padat, dan memenuhi seluruh kriteria minimum praktikum mandiri dengan evaluasi sempurna.",
    submittedAt: "2026-10-24T18:00:00.000Z",
    createdAt: "2026-10-22T08:00:00.000Z",
  },
];

export const WORST_CASE_SUBMISSIONS: Submission[] = [
  {
    id: "sub-worst-1",
    assignmentId: "assign-worst-2",
    versionNumber: 1,
    fileName: "DRAFT_1_ARSITEKTUR_SISTEM_KULIAHVAULT_V1.pdf",
    fileUrl: "/sample-files/draft.pdf",
    fileSize: "18.4 MB",
    submissionLink: "https://elearning.kampus.ac.id/mod/assign/view.php?id=982348234&action=editsubmission&sesskey=ab12cd34ef56gh78ij90kl12mn34op56qr78st90uv",
    proofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
    notes: "Draf awal telah dikonsultasikan dengan asisten praktikum laboratorium rekayasa perangkat lunak.",
    uploadedAt: "2026-10-24T19:30:00.000Z",
  },
];

export const WORST_CASE_NOTES: NoteComment[] = [
  {
    id: "note-worst-1",
    materialId: "mat-worst-1",
    courseId: "course-worst-1",
    contentMarkdown: `### ⚠️ Rangkuman Ekstrem Uji Stres Format Markdown

> [!WARNING]
> Teks string tanpa spasi terpanjang:
> \`CONCURRENCY_DISTRIBUTED_LOCK_TRANSACTION_ISOLATION_LEVEL_SERIALIZABLE_MUTEX_DEADLOCK_DETECTOR_ACTIVE\`

- Uji list dengan teks panjang yang melintasi beberapa baris sekaligus untuk memastikan tidak ada pemotongan teks secara vertikal pada peramban mobile maupun desktop.
`,
    type: "SUMMARY_NOTE",
    createdAt: "2026-10-24T14:00:00.000Z",
    updatedAt: "2026-10-24T14:00:00.000Z",
  },
];
