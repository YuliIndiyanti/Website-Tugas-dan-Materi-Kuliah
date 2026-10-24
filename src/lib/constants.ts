import { PastelThemeDefinition } from "@/types";

export const PASTEL_THEMES: PastelThemeDefinition[] = [
  {
    id: "baby-blue",
    name: "Baby Blue Pastel",
    bgHex: "#DBEAFE",
    gradientToHex: "#E0E7FF",
    textHex: "#1E3A8A",
    borderHex: "#BFDBFE",
    categorySuggestion: "Pemrograman / Rekayasa Perangkat Lunak / Jaringan",
  },
  {
    id: "mint-sage",
    name: "Mint Sage Pastel",
    bgHex: "#D1FAE5",
    gradientToHex: "#CCFBF1",
    textHex: "#065F46",
    borderHex: "#A7F3D0",
    categorySuggestion: "Basis Data / Sains Data / Praktikum Laboratorium",
  },
  {
    id: "soft-lavender",
    name: "Soft Lavender Pastel",
    bgHex: "#EDE9FE",
    gradientToHex: "#F3E8FF",
    textHex: "#5B21B6",
    borderHex: "#DDD6FE",
    categorySuggestion: "Kecerdasan Buatan / Matematika / Algoritma",
  },
  {
    id: "sakura-blush",
    name: "Sakura Blush Pastel",
    bgHex: "#FCE7F3",
    gradientToHex: "#FFE4E6",
    textHex: "#9D174D",
    borderHex: "#FBCFE8",
    categorySuggestion: "Desain Interaksi / UI-UX / Multimedia / Humaniora",
  },
  {
    id: "soft-peach",
    name: "Soft Peach Pastel",
    bgHex: "#FFEDD5",
    gradientToHex: "#FEF3C7",
    textHex: "#9A3412",
    borderHex: "#FED7AA",
    categorySuggestion: "Manajemen Produk / Bisnis / Kewirausahaan",
  },
  {
    id: "buttercream-yellow",
    name: "Buttercream Yellow",
    bgHex: "#FEF9C3",
    gradientToHex: "#FEF3C7",
    textHex: "#854D0E",
    borderHex: "#FEF08A",
    categorySuggestion: "Mata Kuliah Umum / Bahasa / Metodologi Penelitian",
  },
];

export const STATUS_CONFIG = {
  TODO: {
    label: "Belum Dimulai",
    bgHex: "#F1F5F9",
    textHex: "#475569",
    borderHex: "#E2E8F0",
    icon: "🕊️",
  },
  IN_PROGRESS: {
    label: "Sedang Dikerjakan",
    bgHex: "#E0F2FE",
    textHex: "#075985",
    borderHex: "#BAE6FD",
    icon: "☁️",
  },
  READY: {
    label: "Siap Dikumpulkan",
    bgHex: "#F3E8FF",
    textHex: "#6B21A8",
    borderHex: "#E9D5FF",
    icon: "🪻",
  },
  SUBMITTED: {
    label: "Sudah Dikumpulkan",
    bgHex: "#D1FAE5",
    textHex: "#065F46",
    borderHex: "#A7F3D0",
    icon: "🌱",
  },
};

export const URGENCY_CONFIG = {
  CRITICAL: {
    label: "Darurat (<24 jam / Overdue)",
    bgHex: "#FFE4E6",
    textHex: "#9F1239",
    borderHex: "#FECDD3",
    icon: "🌷",
  },
  WARNING: {
    label: "Perhatian (1-3 hari)",
    bgHex: "#FEF3C7",
    textHex: "#92400E",
    borderHex: "#FDE68A",
    icon: "🍑",
  },
  NORMAL: {
    label: "Aman (>3 hari)",
    bgHex: "#F1F5F9",
    textHex: "#475569",
    borderHex: "#E2E8F0",
    icon: "🕊️",
  },
  COMPLETED: {
    label: "Selesai",
    bgHex: "#D1FAE5",
    textHex: "#065F46",
    borderHex: "#A7F3D0",
    icon: "🌱",
  },
};

export const GRADE_CONFIG: Record<string, { bgHex: string; textHex: string }> = {
  A: { bgHex: "#D1FAE5", textHex: "#065F46" },
  AB: { bgHex: "#D1FAE5", textHex: "#065F46" },
  B: { bgHex: "#DBEAFE", textHex: "#1E3A8A" },
  BC: { bgHex: "#DBEAFE", textHex: "#1E3A8A" },
  C: { bgHex: "#FFEDD5", textHex: "#9A3412" },
  D: { bgHex: "#FFE4E6", textHex: "#9F1239" },
  E: { bgHex: "#FFE4E6", textHex: "#9F1239" },
};

export const DEFAULT_TAGS = [
  { id: "bahan-uts", name: "#bahan-uts", bgHex: "#FCE7F3", textHex: "#9D174D" },
  { id: "bahan-uas", name: "#bahan-uas", bgHex: "#EDE9FE", textHex: "#5B21B6" },
  { id: "penting", name: "#penting", bgHex: "#FFE4E6", textHex: "#9F1239" },
  { id: "praktikum", name: "#praktikum", bgHex: "#D1FAE5", textHex: "#065F46" },
  { id: "bacaan-wajib", name: "#bacaan-wajib", bgHex: "#DBEAFE", textHex: "#1E3A8A" },
  { id: "tugas-kelompok", name: "#tugas-kelompok", bgHex: "#FFEDD5", textHex: "#9A3412" },
];
