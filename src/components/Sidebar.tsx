"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVault } from "@/context/VaultContext";
import { useAuth } from "@/context/AuthContext";
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
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-[#E8E4DD] bg-[#F8F7F5] dark:border-[#2A231E] dark:bg-[#110F0E] p-4 min-h-[calc(100vh-4rem)] select-none">
      {/* Primary Navigation */}
      <div className="space-y-1 mb-6">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#8C8278] dark:text-[#786F66] mb-2">
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
                  ? "bg-white dark:bg-[#1C1714] text-[#171310] dark:text-[#F8F6F2] font-semibold shadow-xs border border-[#E8E4DD] dark:border-[#2C241E]"
                  : "text-[#61574E] dark:text-[#A89D91] hover:bg-[#F2ECE4]/80 dark:hover:bg-[#1A1614] hover:text-[#171310] dark:hover:text-[#F8F6F2]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-110",
                  isActive
                    ? "text-[#8B5A2B] dark:text-[#D4A373]"
                    : "text-[#8C8278] dark:text-[#786F66]"
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
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C8278] dark:text-[#786F66]">
            Mata Kuliah ({activeCourses.length})
          </p>
          <button
            onClick={onOpenNewCourse}
            className="p-1 rounded-lg text-[#736B63] hover:text-[#171310] dark:text-[#A3998F] dark:hover:text-[#F5EFEB] hover:bg-[#EFE9E0] dark:hover:bg-[#201B18] transition-colors cursor-pointer"
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
                      ? "bg-white dark:bg-[#1C1714] font-medium shadow-xs border border-[#E8E4DD] dark:border-[#2C241E] text-[#171310] dark:text-[#F8F6F2]"
                      : "text-[#61574E] dark:text-[#A89D91] hover:bg-[#F2ECE4]/70 dark:hover:bg-[#1A1614]"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white dark:ring-[#110F0E]"
                      style={{ backgroundColor: c.pastelTextHex || "#8B5A2B" }}
                    />
                    <span className="truncate font-medium">{c.name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-[#F0ECE4] text-[#61574E] dark:bg-[#221C18] dark:text-[#A89D91] flex-shrink-0">
                    {c.credits} SKS
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="mt-4 pt-3 border-t border-[#E8E4DD] dark:border-[#2A231E] space-y-2">
        <div className="p-3 rounded-2xl bg-white dark:bg-[#181513] border border-[#E8E4DD] dark:border-[#2A231E] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#171310] dark:text-[#F5EFEB]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#D4A373]" /> Beban Studi
            </span>
            <span className="text-[#8B5A2B] dark:text-[#D4A373] font-bold">
              {totalSKS} SKS
            </span>
          </div>
          <p className="text-[11px] text-[#736B63] dark:text-[#A3998F] mt-1 truncate">
            {activeSemester?.name || "Semester Aktif"}
          </p>
        </div>

        {/* Pemilik Vault & Logout Action */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#181513] border border-[#E8E4DD] dark:border-[#2A231E] shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#EAE0D5] text-[#382314] dark:bg-[#3D2C20] dark:text-[#EAE0D5] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              {user?.avatar || "YI"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#171310] dark:text-[#F5EFEB] truncate">
                {user?.name || "Yuli Indiyanti"}
              </p>
              <p className="text-[10px] text-[#736B63] dark:text-[#A3998F] truncate">
                {user?.nim || "240511130"} • {user?.className || "TI24D"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-[#8C8278] hover:text-rose-600 dark:text-[#887E74] dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
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
