"use client";

import React from "react";
import Link from "next/link";
import { useVault } from "@/context/VaultContext";
import { useAuth } from "@/context/AuthContext";
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
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E4DD] bg-[#F8F7F5]/90 dark:border-[#2A231E] dark:bg-[#110F0E]/90 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section: Brand & Semester Selector */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-[#1A1614] border border-[#E8E4DD] dark:border-[#2C241E] shadow-sm">
              <span className="text-xl">☕</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-[#171310] dark:text-[#F8F6F2] tracking-tight">
                  Yuli&apos;s Vault
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFE9E0] text-[#544434] dark:bg-[#2B2119] dark:text-[#D4C3B2] border border-[#E0D5C7] dark:border-[#3D2F24]">
                  Academic
                </span>
              </div>
              <p className="text-[11px] text-[#736B63] dark:text-[#A3998F] hidden sm:block">
                Personal Academic Second Brain
              </p>
            </div>
          </Link>

          {/* Semester Selector Pill */}
          <div className="relative">
            <button
              onClick={onOpenSemesterModal}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl border border-[#E8E4DD] dark:border-[#2A231E] bg-white dark:bg-[#181513] hover:bg-[#F2ECE4] dark:hover:bg-[#221C18] text-[#171310] dark:text-[#F5EFEB] shadow-xs transition-all btn-tactile cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#D4A373]" />
              <span className="max-w-[140px] truncate">
                {activeSemester?.name || "Pilih Semester"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C8278]" />
            </button>
          </div>
        </div>

        {/* Center: Quick Search Command Bar Button */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-[#736B63] dark:text-[#A3998F] bg-[#F0ECE4]/70 dark:bg-[#1A1614] hover:bg-[#EAE4DC] dark:hover:bg-[#221C18] rounded-xl border border-[#E2DDD5] dark:border-[#2C241E] transition-all shadow-inner btn-tactile cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#8B5A2B] dark:text-[#D4A373]" />
              <span>Cari materi, tugas, slide, tag...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold bg-white text-[#544C44] dark:bg-[#241E1A] dark:text-[#D4C3B2] border border-[#DDD5CA] dark:border-[#382E25] rounded-md shadow-2xs">
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white text-[#171310] hover:bg-[#F4EFEA] dark:bg-[#1C1714] dark:text-[#F5EFEB] dark:hover:bg-[#26201B] border border-[#E2DDD5] dark:border-[#2E2620] shadow-xs transition-all btn-tactile cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">+ Tugas</span>
          </button>

          {/* + Upload Materi */}
          <button
            onClick={onOpenUploadMaterial}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#231A14] text-white hover:bg-[#140F0C] dark:bg-[#EAE0D5] dark:text-[#231A14] dark:hover:bg-white shadow-xs transition-all btn-tactile cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Reminder Bell with Badge */}
          <button
            onClick={onOpenReminderModal}
            className="relative p-2 rounded-xl text-[#544C44] dark:text-[#B5AAA0] hover:bg-[#EFE9E0]/60 dark:hover:bg-[#201B18] border border-transparent hover:border-[#E8E4DD] dark:hover:border-[#2A231E] transition-all btn-tactile cursor-pointer"
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
            className="p-2 rounded-xl text-[#544C44] dark:text-[#B5AAA0] hover:bg-[#EFE9E0]/60 dark:hover:bg-[#201B18] border border-transparent hover:border-[#E8E4DD] dark:hover:border-[#2A231E] transition-all cursor-pointer"
            title={isDarkMode ? "Ganti ke Terang" : "Ganti ke Gelap"}
            aria-label={isDarkMode ? "Beralih ke tema terang" : "Beralih ke tema gelap"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#736B63]" />
            )}
          </button>

          {/* Profile & Logout pill */}
          <div className="hidden lg:flex items-center gap-2 pl-2.5 border-l border-[#E8E4DD] dark:border-[#2A231E]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#EAE0D5] text-[#382314] dark:bg-[#3D2C20] dark:text-[#EAE0D5] flex items-center justify-center text-xs font-bold shadow-2xs border border-[#D9C7B6] dark:border-[#523A2A]">
                {user?.avatar || "YI"}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-[#171310] dark:text-[#F5EFEB] leading-none">
                  {user?.name || "Yuli Indiyanti"}
                </p>
                <p className="text-[10px] text-[#736B63] dark:text-[#A3998F] leading-none mt-1">
                  {user?.nim || "240511130"} • {user?.className || "TI24D"}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 ml-1 rounded-xl text-[#736B63] hover:text-rose-600 dark:text-[#A3998F] dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all btn-tactile cursor-pointer"
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
