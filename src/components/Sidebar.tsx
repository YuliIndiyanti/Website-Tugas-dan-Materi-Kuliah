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
      activeColor: "bg-[#E0E7FF] text-[#3730A3] dark:bg-[#312E81] dark:text-[#E0E7FF]",
    },
    {
      label: "Mata Kuliah",
      href: "/courses",
      icon: BookOpen,
      activeColor: "bg-[#DBEAFE] text-[#1E3A8A] dark:bg-[#1E3A8A]/40 dark:text-[#DBEAFE]",
    },
    {
      label: "Tugas & Kanban",
      href: "/assignments",
      icon: CheckSquare,
      activeColor: "bg-[#D1FAE5] text-[#065F46] dark:bg-[#064E3B] dark:text-[#D1FAE5]",
    },
    {
      label: "Vault Materi",
      href: "/materials",
      icon: FolderArchive,
      activeColor: "bg-[#F3E8FF] text-[#6B21A8] dark:bg-[#6B21A8]/40 dark:text-[#F3E8FF]",
    },
    {
      label: "Rekap Nilai & IPK",
      href: "/analytics",
      icon: BarChart3,
      activeColor: "bg-[#FEF3C7] text-[#92400E] dark:bg-[#92400E]/40 dark:text-[#FEF3C7]",
    },
    {
      label: "Pengaturan & Backup",
      href: "/settings",
      icon: Settings,
      activeColor: "bg-[#FCE7F3] text-[#9D174D] dark:bg-[#831843] dark:text-[#FCE7F3]",
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-slate-200/80 bg-[#FDFBF7] dark:border-slate-800 dark:bg-[#0F172A] p-4 min-h-[calc(100vh-4rem)] select-none">
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
      <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-800/80 dark:via-indigo-950/40 dark:to-slate-800/80 border border-indigo-100/80 dark:border-indigo-900/40">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Beban Studi
            </span>
            <span className="text-indigo-600 dark:text-indigo-400">
              {totalSKS} SKS
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {activeSemester?.name || "Semester Aktif"}
          </p>
        </div>
      </div>
    </aside>
  );
};
