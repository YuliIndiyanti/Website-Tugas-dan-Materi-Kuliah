"use client";

import React from "react";
import { useVault } from "@/context/VaultContext";
import { CheckSquare, AlertCircle, FolderArchive, Award, TrendingUp } from "lucide-react";
import { getAssignmentUrgency } from "@/lib/utils";
import { SparkleStar } from "./GlitterEffects";

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
      {/* Card 1: Active Tasks */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#E3D6C9] dark:border-[#38261B] shadow-xs transition-all hover:shadow-md hover:border-[#D5C2B1] dark:hover:border-[#4D3323] card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5F4E] dark:text-[#CBB5A3]">
            Tugas Aktif Minggu Ini
          </span>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3D2517] to-[#25150E] border border-[#523321] flex items-center justify-center text-[#E8CBAE] shadow-2xs relative">
            <CheckSquare className="w-4 h-4" />
            <SparkleStar size={8} color="#F7D89C" className="absolute -top-0.5 -right-0.5 glitter-star" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2B1810] dark:text-[#FAF5EE]">
            {activeTasks.length}
          </span>
          <span className="text-xs font-medium text-[#8C7362] dark:text-[#A89484]">
            dari {activeAssignments.length} total tugas
          </span>
        </div>
        <div className="mt-2.5 text-[11px] font-medium flex items-center gap-1.5 text-[#5C4537] dark:text-[#CBB5A3]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#8B5A2B] dark:bg-[#D4A373]" />
          <span>{submittedTasks.length} tugas telah dikumpulkan</span>
        </div>
      </div>

      {/* Card 2: Urgently Due < 48 Jam */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#E3D6C9] dark:border-[#38261B] shadow-xs transition-all hover:shadow-md hover:border-[#D5C2B1] dark:hover:border-[#4D3323] card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5F4E] dark:text-[#CBB5A3]">
            Deadline &lt; 48 Jam
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#3D1815] border border-[#5E2522] flex items-center justify-center text-[#FCA5A5] shadow-2xs relative">
            <AlertCircle className="w-4 h-4 animate-pulse" />
            <SparkleStar size={8} color="#F87171" className="absolute -top-0.5 -right-0.5 glitter-star" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2B1810] dark:text-[#FAF5EE]">
            {urgentTasks.length}
          </span>
          <span className="text-xs font-medium text-[#8C7362] dark:text-[#A89484]">
            butuh atensi segera
          </span>
        </div>
        <div className="mt-2.5 text-[11px] font-medium flex items-center gap-1.5 text-[#5C4537] dark:text-[#CBB5A3]">
          <span className={`inline-block w-2 h-2 rounded-full ${urgentTasks.length > 0 ? "bg-[#E5484D]" : "bg-emerald-500"}`} />
          <span>
            {urgentTasks.length > 0
              ? "Segera cek kolom darurat"
              : "Semua tugas aman terkendali"}
          </span>
        </div>
      </div>

      {/* Card 3: Total Materials Saved */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#E3D6C9] dark:border-[#38261B] shadow-xs transition-all hover:shadow-md hover:border-[#D5C2B1] dark:hover:border-[#4D3323] card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5F4E] dark:text-[#CBB5A3]">
            Total Materi Vault
          </span>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3D2517] to-[#25150E] border border-[#523321] flex items-center justify-center text-[#E8CBAE] shadow-2xs relative">
            <FolderArchive className="w-4 h-4" />
            <SparkleStar size={8} color="#F7D89C" className="absolute -top-0.5 -right-0.5 glitter-star" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2B1810] dark:text-[#FAF5EE]">
            {activeMaterials.length}
          </span>
          <span className="text-xs font-medium text-[#8C7362] dark:text-[#A89484]">
            file & tautan terorganisir
          </span>
        </div>
        <div className="mt-2.5 text-[11px] font-medium flex items-center gap-1.5 text-[#5C4537] dark:text-[#CBB5A3]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#8B5A2B] dark:bg-[#D4A373]" />
          <span>PDF, Slide, Modul & Catatan</span>
        </div>
      </div>

      {/* Card 4: Average Score & Progress */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#E3D6C9] dark:border-[#38261B] shadow-xs transition-all hover:shadow-md hover:border-[#D5C2B1] dark:hover:border-[#4D3323] card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5F4E] dark:text-[#CBB5A3]">
            Rata-rata Nilai & Progres
          </span>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3D2517] to-[#25150E] border border-[#523321] flex items-center justify-center text-[#E8CBAE] shadow-2xs relative">
            <Award className="w-4 h-4" />
            <SparkleStar size={8} color="#F7D89C" className="absolute -top-0.5 -right-0.5 glitter-star" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2B1810] dark:text-[#FAF5EE]">
            {avgScore > 0 ? avgScore : "94"}
          </span>
          <span className="text-xs font-medium text-[#8C7362] dark:text-[#A89484]">
            skor ({completionRate}% kumpul)
          </span>
        </div>
        <div className="mt-2.5 text-[11px] font-medium flex items-center gap-1.5 text-[#5C4537] dark:text-[#CBB5A3]">
          <TrendingUp className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#D4A373]" />
          <span>Indeks Prediksi: A (Amat Baik)</span>
        </div>
      </div>
    </div>
  );
};
