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
      {/* Card 1: Active Tasks */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-[#181513] border border-[#E8E4DD] dark:border-[#2A231E] shadow-xs transition-all hover:shadow-md hover:border-[#D4CBBF] dark:hover:border-[#3D332A] card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#736B63] dark:text-[#A3998F]">
            Tugas Aktif Minggu Ini
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#F8F7F5] dark:bg-[#221C18] border border-[#EAE6E0] dark:border-[#2E2620] flex items-center justify-center text-[#8B5A2B] dark:text-[#D4A373] shadow-2xs">
            <CheckSquare className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171310] dark:text-[#F8F6F2]">
            {activeTasks.length}
          </span>
          <span className="text-xs font-medium text-[#8C8278] dark:text-[#786F66]">
            dari {activeAssignments.length} total tugas
          </span>
        </div>
        <div className="mt-2.5 text-[11px] font-medium flex items-center gap-1.5 text-[#544C44] dark:text-[#B5AAA0]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#8B5A2B] dark:bg-[#D4A373]" />
          <span>{submittedTasks.length} tugas telah dikumpulkan</span>
        </div>
      </div>

      {/* Card 2: Urgently Due < 48 Jam */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-[#181513] border border-[#E8E4DD] dark:border-[#2A231E] shadow-xs transition-all hover:shadow-md hover:border-[#D4CBBF] dark:hover:border-[#3D332A] card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#736B63] dark:text-[#A3998F]">
            Deadline &lt; 48 Jam
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#FFF1F0] dark:bg-[#2D1616] border border-[#FED7D7] dark:border-[#4D2424] flex items-center justify-center text-[#E5484D] dark:text-[#F87171] shadow-2xs">
            <AlertCircle className="w-4 h-4 animate-pulse" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171310] dark:text-[#F8F6F2]">
            {urgentTasks.length}
          </span>
          <span className="text-xs font-medium text-[#8C8278] dark:text-[#786F66]">
            butuh atensi segera
          </span>
        </div>
        <div className="mt-2.5 text-[11px] font-medium flex items-center gap-1.5 text-[#544C44] dark:text-[#B5AAA0]">
          <span className={`inline-block w-2 h-2 rounded-full ${urgentTasks.length > 0 ? "bg-[#E5484D]" : "bg-emerald-500"}`} />
          <span>
            {urgentTasks.length > 0
              ? "Segera cek kolom darurat"
              : "Semua tugas aman terkendali"}
          </span>
        </div>
      </div>

      {/* Card 3: Total Materials Saved */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-[#181513] border border-[#E8E4DD] dark:border-[#2A231E] shadow-xs transition-all hover:shadow-md hover:border-[#D4CBBF] dark:hover:border-[#3D332A] card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#736B63] dark:text-[#A3998F]">
            Total Materi Vault
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#F8F7F5] dark:bg-[#221C18] border border-[#EAE6E0] dark:border-[#2E2620] flex items-center justify-center text-[#8B5A2B] dark:text-[#D4A373] shadow-2xs">
            <FolderArchive className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171310] dark:text-[#F8F6F2]">
            {activeMaterials.length}
          </span>
          <span className="text-xs font-medium text-[#8C8278] dark:text-[#786F66]">
            file & tautan terorganisir
          </span>
        </div>
        <div className="mt-2.5 text-[11px] font-medium flex items-center gap-1.5 text-[#544C44] dark:text-[#B5AAA0]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#8B5A2B] dark:bg-[#D4A373]" />
          <span>PDF, Slide, Modul & Catatan</span>
        </div>
      </div>

      {/* Card 4: Average Score & Progress */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-[#181513] border border-[#E8E4DD] dark:border-[#2A231E] shadow-xs transition-all hover:shadow-md hover:border-[#D4CBBF] dark:hover:border-[#3D332A] card-tactile">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#736B63] dark:text-[#A3998F]">
            Rata-rata Nilai & Progres
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#F8F7F5] dark:bg-[#221C18] border border-[#EAE6E0] dark:border-[#2E2620] flex items-center justify-center text-[#8B5A2B] dark:text-[#D4A373] shadow-2xs">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171310] dark:text-[#F8F6F2]">
            {avgScore > 0 ? avgScore : "94"}
          </span>
          <span className="text-xs font-medium text-[#8C8278] dark:text-[#786F66]">
            skor ({completionRate}% kumpul)
          </span>
        </div>
        <div className="mt-2.5 text-[11px] font-medium flex items-center gap-1.5 text-[#544C44] dark:text-[#B5AAA0]">
          <TrendingUp className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#D4A373]" />
          <span>Indeks Prediksi: A (Amat Baik)</span>
        </div>
      </div>
    </div>
  );
};
