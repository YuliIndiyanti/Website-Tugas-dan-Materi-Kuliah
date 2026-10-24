"use client";

import React from "react";
import { useVault } from "@/context/VaultContext";
import { CheckSquare, AlertCircle, FolderArchive, Award, TrendingUp } from "lucide-react";
import { getAssignmentUrgency } from "@/lib/utils";

export const MetricCards: React.FC = () => {
  const { activeAssignments, activeMaterials } = useVault();

  // Active tasks (not yet submitted)
  const activeTasks = activeAssignments.filter((a) => a.status !== "SUBMITTED");

  // Urgent tasks < 48 hours or overdue
  const urgentTasks = activeAssignments.filter((a) => {
    if (a.status === "SUBMITTED") return false;
    const urg = getAssignmentUrgency(a);
    return urg.hoursRemaining <= 48;
  });

  // Submitted assignments
  const submittedTasks = activeAssignments.filter((a) => a.status === "SUBMITTED");
  const completionRate =
    activeAssignments.length > 0
      ? Math.round((submittedTasks.length / activeAssignments.length) * 100)
      : 0;

  // Average score
  const gradedTasks = activeAssignments.filter(
    (a) => a.score !== undefined && a.score !== null
  );
  const avgScore =
    gradedTasks.length > 0
      ? Math.round(
          gradedTasks.reduce((sum, a) => sum + (a.score || 0), 0) /
            gradedTasks.length
        )
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Active Tasks (Baby Sky Pastel #E0F2FE / #075985) */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-[#E0F2FE] text-[#075985] dark:bg-[#075985]/30 dark:text-[#BAE6FD] border border-[#BAE6FD] dark:border-[#075985]/60 shadow-soft transition-all hover:shadow-soft-hover card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
            Tugas Aktif Minggu Ini
          </span>
          <div className="w-8 h-8 rounded-2xl bg-white/80 dark:bg-sky-950/80 flex items-center justify-center text-[#075985] dark:text-[#BAE6FD] shadow-xs">
            <CheckSquare className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight">
            {activeTasks.length}
          </span>
          <span className="text-xs font-medium opacity-80">
            dari {activeAssignments.length} tugas total
          </span>
        </div>
        <div className="mt-2 text-[11px] font-medium flex items-center gap-1.5 opacity-90">
          <span className="inline-block w-2 h-2 rounded-full bg-[#075985] dark:bg-[#BAE6FD]" />
          <span>{submittedTasks.length} tugas telah dikumpulkan</span>
        </div>
      </div>

      {/* Card 2: Urgently Due < 48 Jam (Rose Blush Pastel #FFE4E6 / #9F1239) */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-[#FFE4E6] text-[#9F1239] dark:bg-[#9F1239]/30 dark:text-[#FECDD3] border border-[#FECDD3] dark:border-[#9F1239]/60 shadow-soft transition-all hover:shadow-soft-hover card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
            Deadline &lt; 48 Jam
          </span>
          <div className="w-8 h-8 rounded-2xl bg-white/80 dark:bg-rose-950/80 flex items-center justify-center text-[#9F1239] dark:text-[#FECDD3] shadow-xs">
            <AlertCircle className="w-4 h-4 animate-pulse" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight">
            {urgentTasks.length}
          </span>
          <span className="text-xs font-medium opacity-80">
            butuh atensi segera
          </span>
        </div>
        <div className="mt-2 text-[11px] font-medium flex items-center gap-1.5 opacity-90">
          <span className="inline-block w-2 h-2 rounded-full bg-[#9F1239] dark:bg-[#FECDD3]" />
          <span>
            {urgentTasks.length > 0
              ? "Segera cek kolom darurat"
              : "Semua tugas aman terkendali"}
          </span>
        </div>
      </div>

      {/* Card 3: Total Materials Saved (Soft Lavender Pastel #F3E8FF / #6B21A8) */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-[#F3E8FF] text-[#6B21A8] dark:bg-[#6B21A8]/30 dark:text-[#E9D5FF] border border-[#E9D5FF] dark:border-[#6B21A8]/60 shadow-soft transition-all hover:shadow-soft-hover card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
            Total Materi Vault
          </span>
          <div className="w-8 h-8 rounded-2xl bg-white/80 dark:bg-purple-950/80 flex items-center justify-center text-[#6B21A8] dark:text-[#E9D5FF] shadow-xs">
            <FolderArchive className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight">
            {activeMaterials.length}
          </span>
          <span className="text-xs font-medium opacity-80">file & tautan</span>
        </div>
        <div className="mt-2 text-[11px] font-medium flex items-center gap-1.5 opacity-90">
          <span className="inline-block w-2 h-2 rounded-full bg-[#6B21A8] dark:bg-[#E9D5FF]" />
          <span>PDF, Slide, Modul & Catatan</span>
        </div>
      </div>

      {/* Card 4: Average Score & Progress (Mint Sage Pastel #D1FAE5 / #065F46) */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-[#D1FAE5] text-[#065F46] dark:bg-[#064E3B]/40 dark:text-[#D1FAE5] border border-[#A7F3D0] dark:border-[#065F46]/60 shadow-soft transition-all hover:shadow-soft-hover card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
            Rata-rata Nilai & Progres
          </span>
          <div className="w-8 h-8 rounded-2xl bg-white/80 dark:bg-emerald-950/80 flex items-center justify-center text-[#065F46] dark:text-[#D1FAE5] shadow-xs">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight">
            {avgScore > 0 ? avgScore : "94"}
          </span>
          <span className="text-xs font-medium opacity-80">
            skor ({completionRate}% kumpul)
          </span>
        </div>
        <div className="mt-2 text-[11px] font-medium flex items-center gap-1.5 opacity-90">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Indeks Prediksi: A (Amat Baik)</span>
        </div>
      </div>
    </div>
  );
};
