import { PastelThemeDefinition } from "@/types";

export const PASTEL_THEMES: PastelThemeDefinition[] = [
  {
    id: "espresso-roast",
    name: "Espresso Roast",
    bgHex: "#EFE6DD",
    gradientToHex: "#F7F1EB",
    textHex: "#3D271D",
    borderHex: "#D9C7B6",
    categorySuggestion: "Pemrograman / Rekayasa Perangkat Lunak / Jaringan",
  },
  {
    id: "roasted-hazelnut",
    name: "Roasted Hazelnut",
    bgHex: "#F3EADF",
    gradientToHex: "#FAF4ED",
    textHex: "#4C331E",
    borderHex: "#E0CFBE",
    categorySuggestion: "Basis Data / Sains Data / Praktikum Laboratorium",
  },
  {
    id: "warm-caramel",
    name: "Warm Caramel",
    bgHex: "#F6EDE0",
    gradientToHex: "#FBF6EE",
    textHex: "#5B3B18",
    borderHex: "#E6D4BD",
    categorySuggestion: "Kecerdasan Buatan / Matematika / Algoritma",
  },
  {
    id: "toasted-pecan",
    name: "Toasted Pecan",
    bgHex: "#EDE3D6",
    gradientToHex: "#F5EDE3",
    textHex: "#453120",
    borderHex: "#DAC8B4",
    categorySuggestion: "Desain Interaksi / UI-UX / Multimedia / Humaniora",
  },
  {
    id: "cream-latte",
    name: "Cream Latte",
    bgHex: "#F8F2E8",
    gradientToHex: "#FCF8F2",
    textHex: "#563F28",
    borderHex: "#E8DEC9",
    categorySuggestion: "Manajemen Produk / Bisnis / Kewirausahaan",
  },
  {
    id: "rich-cocoa",
    name: "Rich Cocoa",
    bgHex: "#EAE0D5",
    gradientToHex: "#F2EBE3",
    textHex: "#382314",
    borderHex: "#D4C2B0",
    categorySuggestion: "Mata Kuliah Umum / Bahasa / Metodologi Penelitian",
  },
];

export const STATUS_CONFIG = {
  TODO: {
    label: "Belum Dimulai",
    bgHex: "#F6F0E8",
    textHex: "#6B5543",
    borderHex: "#E4D6C6",
    icon: "⏳",
  },
  IN_PROGRESS: {
    label: "Sedang Dikerjakan",
    bgHex: "#EDE0D2",
    textHex: "#54371C",
    borderHex: "#D8C3AE",
    icon: "✍️",
  },
  READY: {
    label: "Siap Dikumpulkan",
    bgHex: "#E4D4C3",
    textHex: "#462B14",
    borderHex: "#CEB9A3",
    icon: "📦",
  },
  SUBMITTED: {
    label: "Sudah Dikumpulkan",
    bgHex: "#D8C4AF",
    textHex: "#2E1A0A",
    borderHex: "#BD9F84",
    icon: "✓",
  },
};

export const URGENCY_CONFIG = {
  CRITICAL: {
    label: "Darurat (<24 jam / Overdue)",
    bgHex: "#F7E2DD",
    textHex: "#7A271A",
    borderHex: "#E8BFB5",
    icon: "⚠️",
  },
  WARNING: {
    label: "Perhatian (1-3 hari)",
    bgHex: "#F8ECD9",
    textHex: "#734311",
    borderHex: "#EAD3B0",
    icon: "⏱️",
  },
  NORMAL: {
    label: "Aman (>3 hari)",
    bgHex: "#F6F0E8",
    textHex: "#6B5543",
    borderHex: "#E4D6C6",
    icon: "✨",
  },
  COMPLETED: {
    label: "Selesai",
    bgHex: "#D8C4AF",
    textHex: "#2E1A0A",
    borderHex: "#BD9F84",
    icon: "✓",
  },
};

export const GRADE_CONFIG: Record<string, { bgHex: string; textHex: string }> = {
  A: { bgHex: "#D8C4AF", textHex: "#2E1A0A" },
  AB: { bgHex: "#E4D4C3", textHex: "#462B14" },
  B: { bgHex: "#EDE0D2", textHex: "#54371C" },
  BC: { bgHex: "#F3EADF", textHex: "#4C331E" },
  C: { bgHex: "#F6EDE0", textHex: "#5B3B18" },
  D: { bgHex: "#F7E2DD", textHex: "#7A271A" },
  E: { bgHex: "#F7E2DD", textHex: "#7A271A" },
};

export const ASSIGNMENT_TYPE_CONFIG: Record<
  string,
  {
    label: string;
    icon: string;
    bgHex: string;
    textHex: string;
    borderHex: string;
    bg: string;
    text: string;
    border: string;
  }
> = {
  INDIVIDUAL: {
    label: "Tugas Individu",
    icon: "👤",
    bgHex: "#EFE6DD",
    textHex: "#3D271D",
    borderHex: "#D9C7B6",
    bg: "bg-[#EFE6DD] dark:bg-[#281F19]",
    text: "text-[#3D271D] dark:text-[#E8D8C8]",
    border: "border-[#D9C7B6] dark:border-[#3D2F26]",
  },
  GROUP: {
    label: "Tugas Kelompok",
    icon: "👥",
    bgHex: "#F6EDE0",
    textHex: "#5B3B18",
    borderHex: "#E6D4BD",
    bg: "bg-[#F6EDE0] dark:bg-[#2F241C]",
    text: "text-[#5B3B18] dark:text-[#F3EADF]",
    border: "border-[#E6D4BD] dark:border-[#4A3728]",
  },
  PROJECT: {
    label: "Tugas Besar",
    icon: "🚀",
    bgHex: "#EAE0D5",
    textHex: "#382314",
    borderHex: "#D4C2B0",
    bg: "bg-[#EAE0D5] dark:bg-[#3B2519]",
    text: "text-[#382314] dark:text-[#FFD2B3]",
    border: "border-[#D4C2B0] dark:border-[#5C341F]",
  },
  MIDTERM: {
    label: "Tugas UTS",
    icon: "📝",
    bgHex: "#F8ECD9",
    textHex: "#734311",
    borderHex: "#EAD3B0",
    bg: "bg-[#F8ECD9] dark:bg-[#342218]",
    text: "text-[#734311] dark:text-[#EFC7A7]",
    border: "border-[#EAD3B0] dark:border-[#523321]",
  },
  FINAL: {
    label: "Tugas UAS",
    icon: "🎯",
    bgHex: "#F7E2DD",
    textHex: "#7A271A",
    borderHex: "#E8BFB5",
    bg: "bg-[#F7E2DD] dark:bg-[#3F2516]",
    text: "text-[#7A271A] dark:text-[#FDD8B5]",
    border: "border-[#E8BFB5] dark:border-[#60351C]",
  },
  TASK: {
    label: "Tugas Individu",
    icon: "👤",
    bgHex: "#EFE6DD",
    textHex: "#3D271D",
    borderHex: "#D9C7B6",
    bg: "bg-[#EFE6DD] dark:bg-[#281F19]",
    text: "text-[#3D271D] dark:text-[#E8D8C8]",
    border: "border-[#D9C7B6] dark:border-[#3D2F26]",
  },
  QUIZ: {
    label: "Kuis Mandiri",
    icon: "⚡",
    bgHex: "#F3EADF",
    textHex: "#4C331E",
    borderHex: "#E0CFBE",
    bg: "bg-[#F3EADF] dark:bg-[#2B2019]",
    text: "text-[#4C331E] dark:text-[#E6D4C3]",
    border: "border-[#E0CFBE] dark:border-[#483325]",
  },
};

export const DEFAULT_TAGS = [
  { id: "bahan-uts", name: "#bahan-uts", bgHex: "#EFE6DD", textHex: "#3D271D" },
  { id: "bahan-uas", name: "#bahan-uas", bgHex: "#EAE0D5", textHex: "#382314" },
  { id: "penting", name: "#penting", bgHex: "#F7E2DD", textHex: "#7A271A" },
  { id: "praktikum", name: "#praktikum", bgHex: "#EDE0D2", textHex: "#54371C" },
  { id: "bacaan-wajib", name: "#bacaan-wajib", bgHex: "#F6EDE0", textHex: "#5B3B18" },
  { id: "tugas-kelompok", name: "#tugas-kelompok", bgHex: "#F8F2E8", textHex: "#563F28" },
];
