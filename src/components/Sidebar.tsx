"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVault } from "@/context/VaultContext";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onOpenNewCourse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenNewCourse }) => {
  const pathname = usePathname();
  const { activeCourses, activeSemester } = useVault();

  const totalSKS = activeCourses.reduce((sum, c) => sum + (c.credits || 0), 0);

  const navLinks = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      activeColor: "bg-[#EFE6DD] text-[#3D271D] dark:bg-[#3D271D] dark:text-[#EFE6DD]",
    },
    {
      label: "Mata Kuliah",
      href: "/courses",
      icon: BookOpen,
      activeColor: "bg-[#F3EADF] text-[#4C331E] dark:bg-[#432C19] dark:text-[#F3EADF]",
    },
    {
      label: "Tugas & Status",
      href: "/assignments",
      icon: CheckSquare,
      activeColor: "bg-[#EDE3D6] text-[#453120] dark:bg-[#382618] dark:text-[#EDE3D6]",
    },
    {
      label: "Materi",
      href: "/materials",
      icon: FolderArchive,
      activeColor: "bg-[#F6EDE0] text-[#5B3B18] dark:bg-[#4E3113] dark:text-[#F6EDE0]",
    },
    {
      label: "Rekap Nilai & IPK",
      href: "/analytics",
      icon: BarChart3,
      activeColor: "bg-[#EAE0D5] text-[#382314] dark:bg-[#362112] dark:text-[#EAE0D5]",
    },
    {
      label: "Pengaturan & Backup",
      href: "/settings",
      icon: Settings,
      activeColor: "bg-[#F8F2E8] text-[#563F28] dark:bg-[#48331E] dark:text-[#F8F2E8]",
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-[#EAE0D5] bg-[#FAF7F2] dark:border-[#3D2F26] dark:bg-[#1C1512] p-4 min-h-[calc(100vh-4rem)] select-none">
      {/* Primary Navigation */}
      <div className="space-y-1 mb-6">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Menu Utama
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
                  ? `${item.activeColor} font-semibold shadow-xs`
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-110",
                  isActive
                    ? "text-inherit"
                    : "text-slate-400 dark:text-slate-500"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Courses List Section */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Mata Kuliah ({activeCourses.length})
          </p>
          <button
            onClick={onOpenNewCourse}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                      ? "bg-white dark:bg-slate-800 font-medium shadow-xs border border-slate-200/80 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white dark:ring-slate-900"
                      style={{ backgroundColor: c.pastelTextHex || "#3730A3" }}
                    />
                    <span className="truncate font-medium">{c.name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 flex-shrink-0">
                    {c.credits} SKS
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="mt-4 pt-3 border-t border-[#EAE0D5] dark:border-[#3D2F26] space-y-2">
        <div className="p-3 rounded-2xl bg-[#F3EADF]/70 dark:bg-[#281F19] border border-[#E0CFBE] dark:border-[#3D2F26]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#3D271D] dark:text-[#EFE6DD]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#967252]" /> Beban Studi
            </span>
            <span className="text-[#5B3B18] dark:text-[#D4C2B0] font-bold">
              {totalSKS} SKS
            </span>
          </div>
          <p className="text-[11px] text-[#756353] dark:text-[#B0A092] mt-1 truncate">
            {activeSemester?.name || "Semester Aktif"}
          </p>
        </div>

        {/* Pemilik Vault Pill */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#281F19] border border-[#EAE0D5] dark:border-[#3D2F26] shadow-2xs">
          <div className="w-7 h-7 rounded-full bg-[#EAE0D5] text-[#3D271D] dark:bg-[#3D271D] dark:text-[#EFE6DD] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
            YI
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#2A1D15] dark:text-[#F5EFEB] truncate">
              Yuli Indiyanti
            </p>
            <p className="text-[10px] text-[#756353] dark:text-[#B0A092] truncate">
              240511130 • TI24D
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
