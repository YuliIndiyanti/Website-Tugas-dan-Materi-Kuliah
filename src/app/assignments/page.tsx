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
  Trash2,
  Paperclip,
} from "lucide-react";
import { AssignmentStatus, Priority } from "@/types";
import { STATUS_CONFIG } from "@/lib/constants";
import { formatDate, getAssignmentUrgency } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { SparkleStar } from "@/components/GlitterEffects";

export default function AssignmentsPage() {
  const {
    activeAssignments,
    courses,
    updateAssignmentStatus,
    deleteAssignment,
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
      bg: "bg-[#F8F3ED]/90 dark:bg-[#1E140E]/80",
      border: "border-[#E0D1C2] dark:border-[#38261B]",
    },
    {
      id: "IN_PROGRESS",
      label: "Sedang Dikerjakan",
      icon: "☕",
      bg: "bg-[#F3EBE1]/90 dark:bg-[#251810]/80",
      border: "border-[#DECFC0] dark:border-[#422C1F]",
    },
    {
      id: "READY",
      label: "Siap Dikumpulkan",
      icon: "📦",
      bg: "bg-[#EFE5DA]/90 dark:bg-[#2B1B12]/80",
      border: "border-[#DFCFC1] dark:border-[#4D3121]",
    },
    {
      id: "SUBMITTED",
      label: "Sudah Dikumpulkan",
      icon: "✓",
      bg: "bg-[#E8DDD0]/90 dark:bg-[#322015]/80",
      border: "border-[#D5C2B1] dark:border-[#573725]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#2A1810] dark:text-[#FAF5EE] flex items-center gap-2">
              <span>Task & Deadline Tracker</span>
              <SparkleStar size={12} color="#D4A373" className="glitter-star" />
            </h1>
          </div>
          <p className="text-xs text-[#7A5F4E] dark:text-[#CBB5A3] mt-1">
            Prioritize tasks, monitor your progress, and never miss a deadline.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#DECFC0] dark:border-[#38261B] shadow-2xs">
            <button
              onClick={() => setViewMode("KANBAN")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "KANBAN"
                  ? "bg-gradient-to-r from-[#2B1810] via-[#382216] to-[#25150E] text-[#FAF5EE] font-bold shadow-xs"
                  : "text-[#7A5F4E] dark:text-[#CBB5A3] hover:text-[#2A1810] dark:hover:text-[#FAF5EE]"
              }`}
            >
              <Kanban className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("TABLE")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "TABLE"
                  ? "bg-gradient-to-r from-[#2B1810] via-[#382216] to-[#25150E] text-[#FAF5EE] font-bold shadow-xs"
                  : "text-[#7A5F4E] dark:text-[#CBB5A3] hover:text-[#2A1810] dark:hover:text-[#FAF5EE]"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Tabel</span>
            </button>
          </div>

          {/* + Tugas Baru */}
          <button
            onClick={() => setIsNewAssignmentOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#2B1810] via-[#3A2216] to-[#25150E] text-[#FAF5EE] text-xs font-bold hover:opacity-95 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E8CBAE]" />
            <span>+ Tugas Baru</span>
            <SparkleStar size={9} color="#F7D89C" className="glitter-star" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-[#FFFDFB] dark:bg-[#1E140E] p-3 rounded-2xl border border-[#E3D6C9] dark:border-[#38261B] shadow-2xs flex-wrap">
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
                    ? "border-2 border-dashed border-[#8B5A2B] bg-[#F6EDE0]/70 dark:bg-[#281F19]/40 ring-2 ring-[#8B5A2B]/30"
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
                                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#F3EADF] hover:text-[#4A2E1B] text-slate-400 opacity-70 group-hover:opacity-100 transition-all btn-tactile"
                                  aria-label={`Pindahkan ${assignment.title} ke tahap berikutnya`}
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Apakah Anda yakin ingin menghapus tugas "${assignment.title}"?`)) {
                                    deleteAssignment(assignment.id);
                                    toast.success(`Tugas "${assignment.title}" berhasil dihapus! 🗑️`);
                                  }
                                }}
                                title="Hapus Tugas"
                                aria-label={`Hapus tugas ${assignment.title}`}
                                className="p-1 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-slate-400 opacity-50 group-hover:opacity-100 transition-all btn-tactile"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#4A2E1B] dark:group-hover:text-[#D9C7B6] line-clamp-2 break-anywhere break-words">
                            {assignment.title}
                          </h4>

                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 break-anywhere break-words">
                            {assignment.instructions}
                          </p>

                          {assignment.attachmentUrl && (
                            <div className="mt-2 flex items-center gap-1 text-[10px] text-[#4A2E1B] dark:text-[#D9C7B6] bg-[#F3EADF]/80 dark:bg-[#281F19]/40 px-2 py-0.5 rounded-lg border border-[#EAE0D5] dark:border-[#3D2F26] truncate">
                              <Paperclip className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{assignment.attachmentName || "Lampiran Soal"}</span>
                            </div>
                          )}

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
                              <span className="font-bold text-[#4A2E1B] dark:text-[#D9C7B6] flex-shrink-0">
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
                <th className="p-4">Nilai</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
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
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-100">
                      {a.score !== undefined
                        ? `${a.score} (${a.gradeLetter})`
                        : "-"}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Apakah Anda yakin ingin menghapus tugas "${a.title}"?`)) {
                            deleteAssignment(a.id);
                            toast.success(`Tugas "${a.title}" berhasil dihapus! 🗑️`);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors"
                        title="Hapus Tugas"
                        aria-label={`Hapus tugas ${a.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
