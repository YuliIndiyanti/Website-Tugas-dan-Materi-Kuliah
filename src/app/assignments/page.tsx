"use client";

import React, { useState } from "react";
import { useVault } from "@/context/VaultContext";
import { AssignmentModal } from "@/components/AssignmentModal";
import { NewAssignmentModal } from "@/components/NewAssignmentModal";
import {
  CheckSquare,
  Plus,
  Kanban,
  Table as TableIcon,
  Filter,
  Clock,
  ChevronRight,
  AlertCircle,
  FileCheck,
  Award,
  ArrowRight,
} from "lucide-react";
import { AssignmentStatus, Priority } from "@/types";
import { STATUS_CONFIG } from "@/lib/constants";
import { formatDate, getAssignmentUrgency } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function AssignmentsPage() {
  const {
    activeAssignments,
    courses,
    updateAssignmentStatus,
    activeSemester,
  } = useVault();

  const [viewMode, setViewMode] = useState<"KANBAN" | "TABLE">("KANBAN");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("ALL");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>("ALL");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [draggedAssignmentId, setDraggedAssignmentId] = useState<string | null>(null);
  const [activeDropColId, setActiveDropColId] = useState<string | null>(null);

  const statusProgression: Record<AssignmentStatus, AssignmentStatus> = {
    TODO: "IN_PROGRESS",
    IN_PROGRESS: "READY",
    READY: "SUBMITTED",
    SUBMITTED: "TODO",
  };

  const handleMoveStatus = (assignmentId: string, newStatus: AssignmentStatus) => {
    const target = activeAssignments.find((a) => a.id === assignmentId);
    if (!target || target.status === newStatus) return;

    const prevStatus = target.status;
    updateAssignmentStatus(assignmentId, newStatus);

    if (newStatus === "SUBMITTED") {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      toast.success(`Tugas "${target.title}" selesai dikumpulkan! 🎉`, {
        action: {
          label: "Urungkan",
          onClick: () => updateAssignmentStatus(assignmentId, prevStatus),
        },
      });
    } else {
      toast.info(`Status tugas diperbarui ke "${STATUS_CONFIG[newStatus].label}"`, {
        action: {
          label: "Urungkan",
          onClick: () => updateAssignmentStatus(assignmentId, prevStatus),
        },
      });
    }
  };

  const handleAdvanceStatus = (assignment: any) => {
    const nextStatus = statusProgression[assignment.status as AssignmentStatus];
    if (nextStatus) {
      handleMoveStatus(assignment.id, nextStatus);
    }
  };

  // Filter assignments
  const filteredAssignments = activeAssignments.filter((a) => {
    if (selectedCourseFilter !== "ALL" && a.courseId !== selectedCourseFilter) {
      return false;
    }
    if (
      selectedPriorityFilter !== "ALL" &&
      a.priority !== selectedPriorityFilter
    ) {
      return false;
    }
    return true;
  });

  const getCourse = (id: string) => courses.find((c) => c.id === id);

  const columns: { id: AssignmentStatus; label: string; icon: string; bg: string; border: string }[] = [
    {
      id: "TODO",
      label: "Belum Dimulai",
      icon: "🕊️",
      bg: "bg-[#F1F5F9]/60 dark:bg-slate-800/40",
      border: "border-slate-200 dark:border-slate-700",
    },
    {
      id: "IN_PROGRESS",
      label: "Sedang Dikerjakan",
      icon: "☁️",
      bg: "bg-[#E0F2FE]/40 dark:bg-sky-950/20",
      border: "border-sky-200 dark:border-sky-900/40",
    },
    {
      id: "READY",
      label: "Siap Dikumpulkan",
      icon: "🪻",
      bg: "bg-[#F3E8FF]/40 dark:bg-purple-950/20",
      border: "border-purple-200 dark:border-purple-900/40",
    },
    {
      id: "SUBMITTED",
      label: "Sudah Dikumpulkan",
      icon: "🌱",
      bg: "bg-[#D1FAE5]/40 dark:bg-emerald-950/20",
      border: "border-emerald-200 dark:border-emerald-900/40",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
              Pelacakan Tugas & Alur Kerja Kanban
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola deadline, draf pengerjaan v1-v3, status kumpul LMS, dan nilai tugas
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <button
              onClick={() => setViewMode("KANBAN")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "KANBAN"
                  ? "bg-[#E0E7FF] text-[#3730A3] dark:bg-[#312E81] dark:text-[#E0E7FF]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("TABLE")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "TABLE"
                  ? "bg-[#E0E7FF] text-[#3730A3] dark:bg-[#312E81] dark:text-[#E0E7FF]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
          </div>

          {/* + Tugas Baru */}
          <button
            onClick={() => setIsNewAssignmentOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#065F46] text-white text-xs font-bold hover:bg-emerald-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tugas Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>

        {/* Filter by Course */}
        <select
          value={selectedCourseFilter}
          onChange={(e) => setSelectedCourseFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
        >
          <option value="ALL">Semua Mata Kuliah ({activeAssignments.length})</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} - {c.name}
            </option>
          ))}
        </select>

        {/* Filter by Priority */}
        <select
          value={selectedPriorityFilter}
          onChange={(e) => setSelectedPriorityFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
        >
          <option value="ALL">Semua Prioritas</option>
          <option value="HIGH">🌷 Prioritas Tinggi</option>
          <option value="MEDIUM">🍑 Prioritas Sedang</option>
          <option value="LOW">🌱 Prioritas Rendah</option>
        </select>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === "KANBAN" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredAssignments.filter((a) => a.status === col.id);
            const isDropActive = activeDropColId === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setActiveDropColId(col.id);
                }}
                onDragLeave={() => {
                  setActiveDropColId((prev) => (prev === col.id ? null : prev));
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedAssignmentId) {
                    handleMoveStatus(draggedAssignmentId, col.id as AssignmentStatus);
                    setDraggedAssignmentId(null);
                    setActiveDropColId(null);
                  }
                }}
                className={`rounded-3xl p-4 border transition-all duration-150 flex flex-col min-h-[500px] shadow-xs ${
                  isDropActive
                    ? "border-2 border-dashed border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-200"
                    : `${col.border} ${col.bg}`
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{col.icon}</span>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {col.label}
                    </h3>
                  </div>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-slate-400 text-xs italic">
                      Tidak ada tugas di kolom ini
                    </div>
                  ) : (
                    colTasks.map((assignment) => {
                      const course = getCourse(assignment.courseId);
                      const urg = getAssignmentUrgency(assignment);
                      const isBeingDragged = draggedAssignmentId === assignment.id;

                      return (
                        <div
                          key={assignment.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", assignment.id);
                            setDraggedAssignmentId(assignment.id);
                          }}
                          onDragEnd={() => {
                            setDraggedAssignmentId(null);
                            setActiveDropColId(null);
                          }}
                          onClick={() => setSelectedAssignmentId(assignment.id)}
                          className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-soft transition-all cursor-grab active:cursor-grabbing group min-w-0 card-tactile ${
                            isBeingDragged ? "opacity-40 scale-95" : ""
                          }`}
                          style={{
                            borderLeftWidth: "5px",
                            borderLeftColor: course?.pastelTextHex || "#3730A3",
                          }}
                        >
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-md font-bold flex-shrink-0"
                              style={{
                                backgroundColor:
                                  course?.pastelColorHex || "#DBEAFE",
                                color: course?.pastelTextHex || "#1E3A8A",
                              }}
                            >
                              {course?.code}
                            </span>
                            
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                                W{assignment.weekNumber} • {assignment.weightPercentage}%
                              </span>

                              {col.id !== "SUBMITTED" && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAdvanceStatus(assignment);
                                  }}
                                  title="Pindah ke kolom berikutnya"
                                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 hover:text-indigo-700 text-slate-400 opacity-70 group-hover:opacity-100 transition-all btn-tactile"
                                  aria-label={`Pindahkan ${assignment.title} ke tahap berikutnya`}
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 line-clamp-2 break-anywhere break-words">
                            {assignment.title}
                          </h4>

                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 break-anywhere break-words">
                            {assignment.instructions}
                          </p>

                          {/* Urgency Badge */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] gap-1">
                            <span
                              className="px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1 flex-shrink-0"
                              style={{
                                backgroundColor: urg.bgHex,
                                color: urg.textHex,
                                borderColor: urg.borderHex,
                              }}
                            >
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="whitespace-nowrap">{urg.badgeLabel}</span>
                            </span>

                            {assignment.score !== undefined && (
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                Skor: {assignment.score}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-soft">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FDFBF7] dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4 pl-6">Mata Kuliah</th>
                <th className="p-4">Judul Tugas</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">Urgensi</th>
                <th className="p-4">Status</th>
                <th className="p-4">Bobot</th>
                <th className="p-4 pr-6">Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAssignments.map((a) => {
                const course = getCourse(a.courseId);
                const urg = getAssignmentUrgency(a);
                const st = STATUS_CONFIG[a.status];

                return (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedAssignmentId(a.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  >
                    <td className="p-4 pl-6">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-md font-bold"
                        style={{
                          backgroundColor: course?.pastelColorHex,
                          color: course?.pastelTextHex,
                        }}
                      >
                        {course?.code}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-100 max-w-xs truncate">
                      {a.title}
                    </td>
                    <td className="p-4 text-slate-500">{formatDate(a.dueDate)}</td>
                    <td className="p-4">
                      <span
                        className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold border"
                        style={{
                          backgroundColor: urg.bgHex,
                          color: urg.textHex,
                          borderColor: urg.borderHex,
                        }}
                      >
                        {urg.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className="text-[10px] px-2.5 py-1 rounded-xl font-medium border"
                        style={{
                          backgroundColor: st.bgHex,
                          color: st.textHex,
                          borderColor: st.borderHex,
                        }}
                      >
                        {st.icon} {st.label}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{a.weightPercentage}%</td>
                    <td className="p-4 pr-6 font-bold text-slate-800 dark:text-slate-100">
                      {a.score !== undefined
                        ? `${a.score} (${a.gradeLetter})`
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <AssignmentModal
        assignmentId={selectedAssignmentId}
        onClose={() => setSelectedAssignmentId(null)}
      />

      <NewAssignmentModal
        isOpen={isNewAssignmentOpen}
        onClose={() => setIsNewAssignmentOpen(false)}
      />
    </div>
  );
}
