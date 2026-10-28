"use client";

import React from "react";
import Link from "next/link";
import { useVault } from "@/context/VaultContext";
import { useAuth } from "@/context/AuthContext";
import { SparkleStar } from "./GlitterEffects";
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
  LogOut,
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
  const { user, logout } = useAuth();

  // Count urgent assignments (<24h or overdue)
  const urgentCount = activeAssignments.filter((a) => {
    const urg = getAssignmentUrgency(a);
    return urg.type === "CRITICAL" && a.status !== "SUBMITTED";
  }).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E3D6C9] bg-[#F7F2EB]/95 dark:border-[#38261B] dark:bg-[#150E0A]/95 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section: Brand & Semester Selector */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3D2517] via-[#2D1B11] to-[#1C100A] text-[#E8CBAE] border border-[#523321] shadow-sm relative">
              <span className="text-xl">☕</span>
              <SparkleStar size={9} color="#F7D89C" className="absolute -top-1 -right-1 glitter-star" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-[#2A1810] dark:text-[#FAF5EE] tracking-tight">
                  Yuli&apos;s Vault
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFE5DA] text-[#3D2316] dark:bg-[#2B180F] dark:text-[#E8CBAE] border border-[#DFCFC1] dark:border-[#422919]">
                  Academic
                </span>
              </div>
              <p className="text-[11px] text-[#7A5F4E] dark:text-[#CBB5A3] hidden sm:block">
                Personal Academic Second Brain
              </p>
            </div>
          </Link>

          {/* Semester Selector Pill */}
          <div className="relative">
            <button
              onClick={onOpenSemesterModal}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#DECFC0] dark:border-[#38261B] bg-[#FFFDFB] dark:bg-[#1E140E] hover:bg-[#F3EBE1] dark:hover:bg-[#281B13] text-[#2A1810] dark:text-[#FAF5EE] shadow-2xs transition-all btn-tactile cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#D4A373]" />
              <span className="max-w-[140px] truncate">
                {activeSemester?.name || "Pilih Semester"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#947866]" />
            </button>
          </div>
        </div>

        {/* Center: Quick Search Command Bar Button */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-[#7A5F4E] dark:text-[#CBB5A3] bg-[#EFE5DA]/70 dark:bg-[#1E140E] hover:bg-[#EAE0D4] dark:hover:bg-[#281B13] rounded-xl border border-[#DECFC0] dark:border-[#38261B] transition-all shadow-inner btn-tactile cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#8B5A2B] dark:text-[#D4A373]" />
              <span>Cari materi, tugas, slide, tag...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold bg-[#FFFDFB] text-[#5C4537] dark:bg-[#281B13] dark:text-[#E8CBAE] border border-[#DECFC0] dark:border-[#422C1F] rounded-md shadow-2xs">
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#FFFDFB] text-[#2A1810] hover:bg-[#F3EBE1] dark:bg-[#1E140E] dark:text-[#FAF5EE] dark:hover:bg-[#281B13] border border-[#DECFC0] dark:border-[#38261B] shadow-2xs transition-all btn-tactile cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">+ Tugas</span>
          </button>

          {/* + Upload Materi */}
          <button
            onClick={onOpenUploadMaterial}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#2B1810] via-[#3A2216] to-[#25150E] text-[#FAF5EE] hover:from-[#1C0F0A] hover:to-[#1C0F0A] shadow-xs transition-all btn-tactile cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Reminder Bell with Badge */}
          <button
            onClick={onOpenReminderModal}
            className="relative p-2 rounded-xl text-[#5C4537] dark:text-[#CBB5A3] hover:bg-[#EFE5DA]/60 dark:hover:bg-[#281B13] border border-transparent hover:border-[#DECFC0] dark:hover:border-[#38261B] transition-all btn-tactile cursor-pointer"
            title="Pengingat Deadline Telegram & Web"
            aria-label={`Pengingat deadline telegram, ${urgentCount} tugas mendesak`}
          >
            <Bell className="w-4 h-4" />
            {urgentCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#E5484D] text-white text-[10px] font-bold shadow-xs animate-pulse">
                {urgentCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-[#5C4537] dark:text-[#CBB5A3] hover:bg-[#EFE5DA]/60 dark:hover:bg-[#281B13] border border-transparent hover:border-[#DECFC0] dark:hover:border-[#38261B] transition-all cursor-pointer"
            title={isDarkMode ? "Ganti ke Terang" : "Ganti ke Gelap"}
            aria-label={isDarkMode ? "Beralih ke tema terang" : "Beralih ke tema gelap"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#7A5F4E]" />
            )}
          </button>

          {/* Profile & Logout pill */}
          <div className="hidden lg:flex items-center gap-2 pl-2.5 border-l border-[#DECFC0] dark:border-[#38261B]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#EFE5DA] text-[#3D2316] dark:bg-[#2B180F] dark:text-[#E8CBAE] flex items-center justify-center text-xs font-bold shadow-2xs border border-[#DFCFC1] dark:border-[#422919]">
                {user?.avatar || "YI"}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#2A1810] dark:text-[#FAF5EE] leading-none">
                  {user?.name || "Yuli Indiyanti"}
                </p>
                <p className="text-[10px] text-[#7A5F4E] dark:text-[#CBB5A3] leading-none mt-1">
                  {user?.nim || "240511130"} • {user?.className || "TI24D"}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 ml-1 rounded-xl text-[#947866] hover:text-rose-600 dark:text-[#A08878] dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all btn-tactile cursor-pointer"
              title="Keluar dari Akun (Logout)"
              aria-label="Keluar dari akun"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
