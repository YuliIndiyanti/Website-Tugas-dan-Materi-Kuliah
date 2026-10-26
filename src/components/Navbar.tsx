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
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE0D5] bg-[#FAF7F2]/90 dark:border-[#3D2F26] dark:bg-[#1C1512]/90 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section: Brand & Semester Selector */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#EFE6DD] via-[#F3EADF] to-[#EAE0D5] dark:from-[#3D271D] dark:via-[#4C331E] dark:to-[#2E1A0A] shadow-sm border border-[#D9C7B6] dark:border-[#523A2A]">
              <span className="text-xl">☕</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-[#2A1D15] dark:text-[#F5EFEB] tracking-tight">
                  Yuli&apos;s Vault
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFE6DD] text-[#3D271D] dark:bg-[#3D271D] dark:text-[#EFE6DD] border border-[#D9C7B6]/70 dark:border-[#523A2A]">
                  Warm Mocha
                </span>
              </div>
              <p className="text-[11px] text-[#756353] dark:text-[#B0A092] hidden sm:block">
                Personal Academic Vault
              </p>
            </div>
          </Link>

          {/* Semester Selector Pill */}
          <div className="relative">
            <button
              onClick={onOpenSemesterModal}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl border border-[#EAE0D5] dark:border-[#3D2F26] bg-white dark:bg-[#281F19] hover:bg-[#F3EADF]/50 dark:hover:bg-[#35271F] text-[#3D271D] dark:text-[#EFE6DD] shadow-sm transition-all btn-tactile"
            >
              <Calendar className="w-3.5 h-3.5 text-[#967252] dark:text-[#D4C2B0]" />
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
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-[#756353] dark:text-[#B0A092] bg-[#F3EADF]/60 dark:bg-[#281F19] hover:bg-[#EFE6DD] dark:hover:bg-[#35271F] rounded-xl border border-[#EAE0D5] dark:border-[#3D2F26] transition-all shadow-inner btn-tactile"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#967252]" />
              <span>Cari materi, tugas, slide, tag...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold bg-[#EFE6DD] text-[#3D271D] dark:bg-[#3D271D] dark:text-[#EFE6DD] border border-[#D9C7B6] dark:border-[#523A2A] rounded-md shadow-xs">
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

          {/* + Tugas Baru */}
          <button
            onClick={onOpenNewAssignment}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#EFE6DD] text-[#3D271D] hover:bg-[#E2D5C7] dark:bg-[#3D271D] dark:text-[#EFE6DD] dark:hover:bg-[#4C331E] border border-[#D9C7B6] dark:border-[#523A2A] shadow-sm transition-all btn-tactile"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">+ Tugas</span>
          </button>

          {/* + Upload Materi */}
          <button
            onClick={onOpenUploadMaterial}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#4A2E1B] text-white hover:bg-[#382314] dark:bg-[#5C3D26] dark:hover:bg-[#4A2E1B] shadow-sm transition-all btn-tactile"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Reminder Bell with Badge */}
          <button
            onClick={onOpenReminderModal}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-[#EAE0D5] dark:hover:border-[#3D2F26] transition-all btn-tactile"
            title="Pengingat Deadline Telegram & Web"
            aria-label={`Pengingat deadline telegram, ${urgentCount} tugas mendesak`}
          >
            <Bell className="w-4 h-4" />
            {urgentCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#F7E2DD] text-[#7A271A] text-[10px] font-bold border border-[#E8BFB5] animate-pulse">
                {urgentCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-[#EAE0D5] dark:hover:border-[#3D2F26] transition-all"
            title={isDarkMode ? "Ganti ke Terang" : "Ganti ke Gelap"}
            aria-label={isDarkMode ? "Beralih ke tema terang" : "Beralih ke tema gelap"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#756353]" />
            )}
          </button>

          {/* Profile pill */}
          <div
            className="hidden lg:flex items-center gap-2.5 pl-2.5 border-l border-[#EAE0D5] dark:border-[#3D2F26]"
            title="Yuli Indiyanti - NIM 240511130 KELAS TI24D (Pemilik Vault)"
          >
            <div className="w-8 h-8 rounded-full bg-[#EAE0D5] text-[#3D271D] dark:bg-[#3D271D] dark:text-[#EFE6DD] flex items-center justify-center text-xs font-bold shadow-sm border border-[#D9C7B6] dark:border-[#523A2A]">
              YI
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-[#2A1D15] dark:text-[#F5EFEB] leading-none">
                Yuli Indiyanti
              </p>
              <p className="text-[10px] text-[#756353] dark:text-[#B0A092] leading-none mt-1">
                240511130 • TI24D
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
