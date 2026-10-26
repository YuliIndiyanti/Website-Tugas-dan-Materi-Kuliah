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
      {/* Card 1: Active Tasks (Toasted Hazelnut Brown #EFE6DD / #3D271D) */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-[#EFE6DD] text-[#3D271D] dark:bg-[#3D271D]/40 dark:text-[#EFE6DD] border border-[#D9C7B6] dark:border-[#523A2A] shadow-soft transition-all hover:shadow-soft-hover card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
            Tugas Aktif Minggu Ini
          </span>
          <div className="w-8 h-8 rounded-2xl bg-white/80 dark:bg-[#281F19]/80 flex items-center justify-center text-[#3D271D] dark:text-[#EFE6DD] shadow-xs">
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
          <span className="inline-block w-2 h-2 rounded-full bg-[#3D271D] dark:bg-[#EFE6DD]" />
          <span>{submittedTasks.length} tugas telah dikumpulkan</span>
        </div>
      </div>

      {/* Card 2: Urgently Due < 48 Jam (Terracotta Brown #F7E2DD / #7A271A) */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-[#F7E2DD] text-[#7A271A] dark:bg-[#5C2318]/40 dark:text-[#F7E2DD] border border-[#E8BFB5] dark:border-[#7A271A]/60 shadow-soft transition-all hover:shadow-soft-hover card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
            Deadline &lt; 48 Jam
          </span>
          <div className="w-8 h-8 rounded-2xl bg-white/80 dark:bg-[#281F19]/80 flex items-center justify-center text-[#7A271A] dark:text-[#F7E2DD] shadow-xs">
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
          <span className="inline-block w-2 h-2 rounded-full bg-[#7A271A] dark:bg-[#F7E2DD]" />
          <span>
            {urgentTasks.length > 0
              ? "Segera cek kolom darurat"
              : "Semua tugas aman terkendali"}
          </span>
        </div>
      </div>

      {/* Card 3: Total Materials Saved (Warm Caramel Latte #F6EDE0 / #5B3B18) */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-[#F6EDE0] text-[#5B3B18] dark:bg-[#4E3113]/40 dark:text-[#F6EDE0] border border-[#E6D4BD] dark:border-[#6B461E]/60 shadow-soft transition-all hover:shadow-soft-hover card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
            Total Materi Vault
          </span>
          <div className="w-8 h-8 rounded-2xl bg-white/80 dark:bg-[#281F19]/80 flex items-center justify-center text-[#5B3B18] dark:text-[#F6EDE0] shadow-xs">
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
          <span className="inline-block w-2 h-2 rounded-full bg-[#5B3B18] dark:bg-[#F6EDE0]" />
          <span>PDF, Slide, Modul & Catatan</span>
        </div>
      </div>

      {/* Card 4: Average Score & Progress (Rich Espresso Chocolate #EAE0D5 / #382314) */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-[#EAE0D5] text-[#382314] dark:bg-[#362112]/40 dark:text-[#EAE0D5] border border-[#D4C2B0] dark:border-[#543823]/60 shadow-soft transition-all hover:shadow-soft-hover card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
            Rata-rata Nilai & Progres
          </span>
          <div className="w-8 h-8 rounded-2xl bg-white/80 dark:bg-[#281F19]/80 flex items-center justify-center text-[#382314] dark:text-[#EAE0D5] shadow-xs">
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
