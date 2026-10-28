"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVault } from "@/context/VaultContext";
import { useAuth } from "@/context/AuthContext";
import { SparkleStar } from "./GlitterEffects";
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  FolderArchive,
  BarChart3,
  Settings,
  Plus,
  Clock,
  Sparkles,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onOpenNewCourse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenNewCourse }) => {
  const pathname = usePathname();
  const { activeCourses, activeSemester } = useVault();
  const { user, logout } = useAuth();

  const totalSKS = activeCourses.reduce((sum, c) => sum + (c.credits || 0), 0);

  const navLinks = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Mata Kuliah",
      href: "/courses",
      icon: BookOpen,
    },
    {
      label: "Tugas & Status",
      href: "/assignments",
      icon: CheckSquare,
    },
    {
      label: "Materi",
      href: "/materials",
      icon: FolderArchive,
    },
    {
      label: "Rekap Nilai & IPK",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      label: "Pengaturan & Backup",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-[#E3D6C9] bg-[#F7F2EC] dark:border-[#38261B] dark:bg-[#160E08] p-4 min-h-[calc(100vh-4rem)] select-none">
      {/* Primary Navigation */}
      <div className="space-y-1 mb-6">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#947866] dark:text-[#A08878] mb-2 flex items-center justify-between">
          <span>Menu Utama</span>
          <SparkleStar size={9} color="#D4A373" className="glitter-star" />
        </p>
        {navLinks.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group btn-tactile",
                isActive
                  ? "bg-gradient-to-r from-[#2B1810] via-[#382216] to-[#25150E] text-[#FAF5EE] font-bold shadow-xs border border-[#4F301F]"
                  : "text-[#5C4537] dark:text-[#CBB5A3] hover:bg-[#EFE5DA] dark:hover:bg-[#20150E] hover:text-[#2A1810] dark:hover:text-[#FAF5EE]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-110",
                  isActive
                    ? "text-[#E8CBAE]"
                    : "text-[#8C7362] dark:text-[#A89484]"
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <SparkleStar size={9} color="#F7D89C" className="glitter-star ml-auto" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Courses List Section */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#947866] dark:text-[#A08878]">
            Mata Kuliah ({activeCourses.length})
          </p>
          <button
            onClick={onOpenNewCourse}
            className="p-1 rounded-lg text-[#7A5F4E] hover:text-[#2A1810] dark:text-[#CBB5A3] dark:hover:text-[#FAF5EE] hover:bg-[#EFE5DA] dark:hover:bg-[#20150E] transition-colors cursor-pointer"
            title="Tambah Mata Kuliah"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          {activeCourses.length === 0 ? (
            <p className="px-3 text-xs text-slate-400 italic py-2">
              Belum ada mata kuliah di semester ini.
            </p>
          ) : (
            activeCourses.map((c) => {
              const isSelected = pathname === `/courses/${c.id}`;
              return (
                <Link
                  key={c.id}
                  href={`/courses/${c.id}`}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all group",
                    isSelected
                      ? "bg-[#FFFDFB] dark:bg-[#1E140E] font-bold shadow-xs border border-[#DECFC0] dark:border-[#38261B] text-[#2A1810] dark:text-[#FAF5EE]"
                      : "text-[#5C4537] dark:text-[#CBB5A3] hover:bg-[#EFE5DA]/70 dark:hover:bg-[#20150E]"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white dark:ring-[#160E08]"
                      style={{ backgroundColor: c.pastelTextHex || "#8B5A2B" }}
                    />
                    <span className="truncate font-medium">{c.name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-[#EFE5DA] text-[#4A2E1F] dark:bg-[#281B13] dark:text-[#CBB5A3] flex-shrink-0">
                    {c.credits} SKS
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="mt-4 pt-3 border-t border-[#E3D6C9] dark:border-[#38261B] space-y-2">
        <div className="p-3 rounded-2xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#E3D6C9] dark:border-[#38261B] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#2A1810] dark:text-[#FAF5EE]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#D4A373]" /> Beban Studi
            </span>
            <span className="text-[#8B5A2B] dark:text-[#D4A373] font-bold">
              {totalSKS} SKS
            </span>
          </div>
          <p className="text-[11px] text-[#7A5F4E] dark:text-[#CBB5A3] mt-1 truncate">
            {activeSemester?.name || "Semester Aktif"}
          </p>
        </div>

        {/* Pemilik Vault & Logout Action */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#E3D6C9] dark:border-[#38261B] shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#EFE5DA] text-[#3D2316] dark:bg-[#2B180F] dark:text-[#E8CBAE] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              {user?.avatar || "YI"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#2A1810] dark:text-[#FAF5EE] truncate">
                {user?.name || "Yuli Indiyanti"}
              </p>
              <p className="text-[10px] text-[#7A5F4E] dark:text-[#CBB5A3] truncate">
                {user?.nim || "240511130"} • {user?.className || "TI24D"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-[#947866] hover:text-rose-600 dark:text-[#A08878] dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            title="Keluar (Logout)"
            aria-label="Keluar dari akun"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
