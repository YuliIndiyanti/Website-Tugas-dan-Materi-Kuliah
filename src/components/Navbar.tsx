"use client";

import React from "react";
import Link from "next/link";
import { useVault } from "@/context/VaultContext";
import {
  Search,
  Plus,
  Moon,
  Sun,
  Upload,
  Calendar,
  Bell,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { getAssignmentUrgency } from "@/lib/utils";

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenNewAssignment: () => void;
  onOpenUploadMaterial: () => void;
  onOpenSemesterModal: () => void;
  onOpenReminderModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenNewAssignment,
  onOpenUploadMaterial,
  onOpenSemesterModal,
  onOpenReminderModal,
}) => {
  const {
    activeSemester,
    semesters,
    setActiveSemesterId,
    activeAssignments,
    isDarkMode,
    toggleDarkMode,
  } = useVault();

  // Count urgent assignments (<24h or overdue)
  const urgentCount = activeAssignments.filter((a) => {
    const urg = getAssignmentUrgency(a);
    return urg.type === "CRITICAL" && a.status !== "SUBMITTED";
  }).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-[#FDFBF7]/90 dark:border-slate-800 dark:bg-[#0F172A]/90 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section: Brand & Semester Selector */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-200 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 shadow-sm border border-indigo-200/60 dark:border-indigo-700/50">
              <span className="text-xl">🌸</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
                  Yuli&apos;s Vault
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FCE7F3] text-[#9D174D] dark:bg-[#831843] dark:text-[#FCE7F3]">
                  Soft Pastel
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Personal Academic Vault
              </p>
            </div>
          </Link>

          {/* Semester Selector Pill */}
          <div className="relative">
            <button
              onClick={onOpenSemesterModal}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 shadow-sm transition-all btn-tactile"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span className="max-w-[140px] truncate">
                {activeSemester?.name || "Pilih Semester"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Center: Quick Search Command Bar Button */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 transition-all shadow-inner btn-tactile"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Cari materi, tugas, slide, tag...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold bg-[#FCE7F3] text-[#9D174D] dark:bg-[#831843] dark:text-[#FCE7F3] rounded-md shadow-xs">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Section: Quick Actions, Reminder, Dark Mode, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile search button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Cari"
            aria-label="Buka pencarian cepat"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* + Tugas Baru (Mint Sage) */}
          <button
            onClick={onOpenNewAssignment}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#D1FAE5] text-[#065F46] hover:bg-[#A7F3D0] dark:bg-[#064E3B] dark:text-[#D1FAE5] dark:hover:bg-[#065F46] border border-[#A7F3D0] dark:border-[#065F46] shadow-sm transition-all btn-tactile"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">+ Tugas</span>
          </button>

          {/* + Upload Materi (Soft Lavender) */}
          <button
            onClick={onOpenUploadMaterial}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#E0E7FF] text-[#3730A3] hover:bg-[#C7D2FE] dark:bg-[#312E81] dark:text-[#E0E7FF] dark:hover:bg-[#3730A3] border border-[#C7D2FE] dark:border-[#3730A3] shadow-sm transition-all btn-tactile"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Reminder Bell with Badge */}
          <button
            onClick={onOpenReminderModal}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:border-slate-700 transition-all btn-tactile"
            title="Pengingat Deadline Telegram & Web"
            aria-label={`Pengingat deadline telegram, ${urgentCount} tugas mendesak`}
          >
            <Bell className="w-4 h-4" />
            {urgentCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#FFE4E6] text-[#9F1239] text-[10px] font-bold border border-[#FECDD3] animate-pulse">
                {urgentCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
            title={isDarkMode ? "Ganti ke Terang" : "Ganti ke Gelap"}
            aria-label={isDarkMode ? "Beralih ke tema terang" : "Beralih ke tema gelap"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Profile pill */}
          <div
            className="hidden lg:flex items-center gap-2.5 pl-2.5 border-l border-slate-200 dark:border-slate-800"
            title="Yuli Indiyanti - NIM 240511130 KELAS TI24D (Pemilik Vault)"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-200 via-pink-200 to-amber-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm border border-white dark:border-slate-700">
              YI
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                Yuli Indiyanti
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-1">
                240511130 • TI24D
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
