"use client";

import React, { useState } from "react";
import { useVault } from "@/context/VaultContext";
import { MetricCards } from "@/components/MetricCards";
import { DeadlineList } from "@/components/DeadlineList";
import { QuickDropzone } from "@/components/QuickDropzone";
import { AssignmentModal } from "@/components/AssignmentModal";
import { MaterialPreviewModal } from "@/components/MaterialPreviewModal";
import { NewAssignmentModal } from "@/components/NewAssignmentModal";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { activeCourses, activeSemester } = useVault();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);

  // Today's schedule (e.g. today is Saturday in 2026-10-24, or Monday mock)
  const todayClasses = activeCourses.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Welcome Banner: Sleek executive card with subtle luxury ambient glow */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#181513] border border-[#E8E4DD] dark:border-[#2A231E] shadow-xs">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F8F7F5] dark:bg-[#221C18] text-[#544434] dark:text-[#D4C3B2] shadow-2xs mb-3 border border-[#E2DDD5] dark:border-[#352B24]">
            <span>☕</span>
            <span>Yuli&apos;s Vault • {activeSemester?.name || "Semester Aktif"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171310] dark:text-[#F8F6F2] tracking-tight">
            Yuli&apos;s Second Brain
          </h1>
          <p className="text-xs sm:text-sm text-[#736B63] dark:text-[#A3998F] mt-2 leading-relaxed">
            Streamline your study workflow. Track tasks and manage materials effortlessly.
          </p>
        </div>

        {/* Decorative subtle ambient luxury glow */}
        <div className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-gradient-to-br from-[#EAE0D5]/40 via-[#DFCEBC]/20 to-transparent dark:from-[#3D2C20]/30 dark:via-[#261B14]/10 blur-3xl pointer-events-none" />
      </div>

      {/* Row of 4 Metric Cards */}
      <MetricCards />

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Priority & Deadlines Tracker */}
        <div className="lg:col-span-7 space-y-6">
          <DeadlineList
            onSelectAssignment={(id) => setSelectedAssignmentId(id)}
            onOpenNewAssignment={() => setIsNewAssignmentOpen(true)}
          />

          {/* Today's Schedule Card */}
          <div className="bg-white dark:bg-[#181513] rounded-3xl p-5 border border-[#E8E4DD] dark:border-[#2A231E] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#171310] dark:text-[#F8F6F2] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8B5A2B] dark:text-[#D4A373]" />
                <span>Jadwal Perkuliahan Terdekat</span>
              </h3>
              <Link
                href="/courses"
                className="text-xs font-semibold text-[#8B5A2B] dark:text-[#D4A373] hover:underline"
              >
                Lihat Semua MK
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {todayClasses.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-3 col-span-2">
                  Belum ada jadwal kuliah terdaftar di semester ini.
                </p>
              ) : (
                todayClasses.map((c) => (
                  <Link
                    key={c.id}
                    href={`/courses/${c.id}`}
                    className="group p-4 rounded-2xl border transition-all hover:shadow-soft min-w-0 card-tactile"
                    style={{
                      backgroundColor: `${c.pastelColorHex}40`,
                      borderColor: `${c.pastelColorHex}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5 gap-1">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-md font-bold flex-shrink-0"
                        style={{
                          backgroundColor: c.pastelColorHex,
                          color: c.pastelTextHex,
                        }}
                      >
                        {c.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">{c.scheduleTime}</span>
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-[#4A2E1B] dark:group-hover:text-[#D9C7B6] break-anywhere">
                      {c.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate break-anywhere">{c.roomOrLink}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Quick Dropzone & Recents */}
        <div className="lg:col-span-5">
          <QuickDropzone
            onOpenMaterialPreview={(id) => setSelectedMaterialId(id)}
          />
        </div>
      </div>

      {/* Modals triggered from page */}
      <AssignmentModal
        assignmentId={selectedAssignmentId}
        onClose={() => setSelectedAssignmentId(null)}
      />

      <MaterialPreviewModal
        materialId={selectedMaterialId}
        onClose={() => setSelectedMaterialId(null)}
      />

      <NewAssignmentModal
        isOpen={isNewAssignmentOpen}
        onClose={() => setIsNewAssignmentOpen(false)}
      />
    </div>
  );
}
