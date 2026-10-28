"use client";

import React, { useState, useRef } from "react";
import { useVault } from "@/context/VaultContext";
import {
  X,
  Calendar,
  Clock,
  CheckCircle,
  Upload,
  Link as LinkIcon,
  MessageSquare,
  FileText,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Download,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Trash2,
  Paperclip,
  Edit,
  Save,
  Check,
} from "lucide-react";
import {
  formatDate,
  getAssignmentUrgency,
  scoreToLetter,
} from "@/lib/utils";
import { STATUS_CONFIG, GRADE_CONFIG } from "@/lib/constants";
import { AssignmentStatus, Priority, AssignmentType } from "@/types";
import confetti from "canvas-confetti";
import { toast } from "sonner";

interface AssignmentModalProps {
  assignmentId: string | null;
  onClose: () => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  assignmentId,
  onClose,
}) => {
  const {
    assignments,
    courses,
    notes,
    updateAssignmentStatus,
    updateAssignment,
    updateAssignmentGrade,
    addNoteComment,
    deleteNoteComment,
    deleteAssignment,
  } = useVault();

  const [activeTab, setActiveTab] = useState<"DETAILS" | "GRADE" | "NOTES">("DETAILS");

  // Grade form state
  const [scoreInput, setScoreInput] = useState<number | "">("");
  const [feedbackInput, setFeedbackInput] = useState("");

  // Comment state
  const [newComment, setNewComment] = useState("");

  // Edit Assignment Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState<Priority>("HIGH");
  const [editType, setEditType] = useState<AssignmentType>("TASK");
  const [editWeightPercentage, setEditWeightPercentage] = useState(15);
  const [editWeekNumber, setEditWeekNumber] = useState(1);
  const [editAttachmentUrl, setEditAttachmentUrl] = useState("");
  const [editAttachmentName, setEditAttachmentName] = useState("");
  const [isUploadingEditAttachment, setIsUploadingEditAttachment] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  if (!assignmentId) return null;

  const assignment = assignments.find((a) => a.id === assignmentId);
  if (!assignment) return null;

  const course = courses.find((c) => c.id === assignment.courseId);
  const assignmentNotes = notes.filter((n) => n.assignmentId === assignment.id);
  const urg = getAssignmentUrgency(assignment);
  const statusMeta = STATUS_CONFIG[assignment.status];

  const toLocalDatetimeInput = (isoDateStr: string) => {
    try {
      const d = new Date(isoDateStr);
      if (isNaN(d.getTime())) return "";
      const offset = d.getTimezoneOffset() * 60000;
      const localTime = new Date(d.getTime() - offset);
      return localTime.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  const startEditing = () => {
    setEditTitle(assignment.title);
    setEditInstructions(assignment.instructions || "");
    setEditDueDate(toLocalDatetimeInput(assignment.dueDate));
    setEditPriority(assignment.priority);
    setEditType(assignment.type);
    setEditWeightPercentage(assignment.weightPercentage);
    setEditWeekNumber(assignment.weekNumber);
    setEditAttachmentUrl(assignment.attachmentUrl || "");
    setEditAttachmentName(assignment.attachmentName || "");
    setIsEditing(true);
    setActiveTab("DETAILS");
  };

  const handleEditAttachmentSelect = async (file: File) => {
    setEditAttachmentName(file.name);
    setIsUploadingEditAttachment(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.fileUrl) {
          setEditAttachmentUrl(data.fileUrl);
          toast.success(`Berkas "${file.name}" berhasil diunggah! 📁`);
        }
      } else {
        const localUrl = URL.createObjectURL(file);
        setEditAttachmentUrl(localUrl);
        toast.info(`Berkas "${file.name}" terlampir.`);
      }
    } catch (err) {
      console.warn("Upload fallback to local URL:", err);
      const localUrl = URL.createObjectURL(file);
      setEditAttachmentUrl(localUrl);
    } finally {
      setIsUploadingEditAttachment(false);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      toast.error("Judul tugas tidak boleh kosong!");
      return;
    }

    updateAssignment(assignment.id, {
      title: editTitle.trim(),
      instructions: editInstructions.trim(),
      dueDate: editDueDate ? new Date(editDueDate).toISOString() : assignment.dueDate,
      priority: editPriority,
      type: editType,
      weightPercentage: Number(editWeightPercentage),
      weekNumber: Number(editWeekNumber),
      attachmentUrl: editAttachmentUrl || undefined,
      attachmentName: editAttachmentName || undefined,
    });

    setIsEditing(false);
    toast.success("Rincian tugas berhasil diperbarui! 💾");
  };

  const handleStatusChange = (newStatus: AssignmentStatus) => {
    updateAssignmentStatus(assignment.id, newStatus);
    if (newStatus === "SUBMITTED") {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (scoreInput === "") return;
    updateAssignmentGrade(assignment.id, Number(scoreInput), feedbackInput);
    toast.success("Nilai tugas berhasil disimpan! 🎯");
    setActiveTab("DETAILS");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addNoteComment({
      assignmentId: assignment.id,
      contentMarkdown: newComment.trim(),
      type: "COMMENT_LOG",
    });
    toast.success("Pertanyaan / catatan berhasil ditambahkan! 💬");
    setNewComment("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assignment-detail-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2 sm:hidden flex-shrink-0" />

        {/* Header with course pastel accent */}
        <div
          className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between relative"
          style={{
            background: `linear-gradient(135deg, ${course?.pastelColorHex || "#EFE6DD"} 0%, transparent 60%)`,
          }}
        >
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span
                className="text-xs px-2.5 py-0.5 rounded-md font-bold flex-shrink-0"
                style={{
                  backgroundColor: course?.pastelColorHex || "#EFE6DD",
                  color: course?.pastelTextHex || "#3D271D",
                }}
              >
                {course?.code}
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                {course?.name}
              </span>
              <span className="text-xs font-medium text-slate-400 flex-shrink-0">
                • Minggu {assignment.weekNumber}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0">
                Bobot: {assignment.weightPercentage}%
              </span>
              {isEditing && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 animate-pulse flex-shrink-0">
                  Mode Edit
                </span>
              )}
            </div>
            <h2 id="assignment-detail-modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-100 break-anywhere break-words">
              {assignment.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                if (!isEditing) {
                  startEditing();
                } else {
                  setIsEditing(false);
                }
              }}
              aria-label={isEditing ? "Batal Edit" : "Edit Rincian Tugas"}
              title={isEditing ? "Batal Edit" : "Edit Rincian Tugas (Judul, Deadline, Instruksi, Lampiran)"}
              className={`p-2 rounded-xl transition-colors shadow-xs ${
                isEditing
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                  : "bg-white/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    `Apakah Anda yakin ingin menghapus tugas "${assignment.title}"?\n\nSeluruh data pengumpulan berkas dan catatan terkait tugas ini juga akan dihapus.`
                  )
                ) {
                  deleteAssignment(assignment.id);
                  toast.success(`Tugas "${assignment.title}" berhasil dihapus! 🗑️`);
                  onClose();
                }
              }}
              aria-label="Hapus tugas ini"
              title="Hapus Tugas Ini"
              className="p-2 rounded-xl bg-white/80 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-400 transition-colors shadow-xs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal rincian tugas"
              className="p-2 rounded-xl bg-white/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 transition-colors shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Bar & Urgency Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 text-xs flex-wrap gap-2">
          {/* Urgency */}
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full font-semibold border flex items-center gap-1.5 shadow-xs"
              style={{
                backgroundColor: urg.bgHex,
                color: urg.textHex,
                borderColor: urg.borderHex,
              }}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{urg.label}</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              Deadline: {formatDate(assignment.dueDate)}
            </span>
          </div>

          {/* Status buttons */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            {(["TODO", "IN_PROGRESS", "READY", "SUBMITTED"] as AssignmentStatus[]).map(
              (st) => {
                const conf = STATUS_CONFIG[st];
                const isActive = assignment.status === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
                      isActive
                        ? "shadow-xs font-bold"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: conf.bgHex,
                            color: conf.textHex,
                          }
                        : {}
                    }
                  >
                    <span>{conf.icon}</span>
                    <span className="hidden sm:inline">{conf.label}</span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 px-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("DETAILS")}
            className={`py-3 border-b-2 transition-all ${
              activeTab === "DETAILS"
                ? "border-[#4A2E1B] text-[#4A2E1B] dark:border-[#D9C7B6] dark:text-[#EFE6DD]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            Deskripsi & Instruksi
          </button>
          <button
            onClick={() => setActiveTab("GRADE")}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "GRADE"
                ? "border-[#4A2E1B] text-[#4A2E1B] dark:border-[#D9C7B6] dark:text-[#EFE6DD]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <span>Nilai & Evaluasi Dosen</span>
            {assignment.score !== undefined && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#EDE3D6] text-[#453120] font-bold">
                {assignment.score} ({assignment.gradeLetter})
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("NOTES")}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "NOTES"
                ? "border-[#4A2E1B] text-[#4A2E1B] dark:border-[#D9C7B6] dark:text-[#EFE6DD]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <span>Diskusi & Log ({assignmentNotes.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: DETAILS */}
          {activeTab === "DETAILS" && (
            isEditing ? (
              <form onSubmit={handleSaveEdit} className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#F3EADF] dark:bg-[#281F19] text-[#4A2E1B] dark:text-[#D9C7B6]">
                      <Edit className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Mode Edit Rincian Tugas
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Ubah judul, deadline, instruksi pengerjaan, bobot, dan lampiran soal
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Batal
                  </button>
                </div>

                {/* Judul Tugas */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Judul Tugas <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Contoh: TUGAS INSTALLING, CONNECTING DAN PEMBUATAN WEBSITE"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#EAE0D5] dark:border-[#3D2F26] bg-white dark:bg-[#281F19] text-[#2A1D15] dark:text-[#F5EFEB] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/30 focus:border-[#8B5A2B] transition-all shadow-xs"
                  />
                </div>

                {/* Grid: Deadline & Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#6B5543] dark:text-[#D9C7B6]" />
                      <span>Tenggat Waktu (Deadline) <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE0D5] dark:border-[#3D2F26] bg-white dark:bg-[#281F19] text-[#2A1D15] dark:text-[#F5EFEB] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/30 focus:border-[#8B5A2B] transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kategori Asesmen
                    </label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as AssignmentType)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE0D5] dark:border-[#3D2F26] bg-white dark:bg-[#281F19] text-[#2A1D15] dark:text-[#F5EFEB] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/30 focus:border-[#8B5A2B] transition-all shadow-xs"
                    >
                      <option value="TASK">Tugas Mandiri / Kelompok</option>
                      <option value="PROJECT">Proyek / Tugas Besar</option>
                      <option value="QUIZ">Kuis Mandiri</option>
                      <option value="MIDTERM">Ujian Tengah Semester (UTS)</option>
                      <option value="FINAL">Ujian Akhir Semester (UAS)</option>
                    </select>
                  </div>
                </div>

                {/* Grid: Minggu & Bobot Nilai */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Minggu Pertemuan Kuliah
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={16}
                      value={editWeekNumber}
                      onChange={(e) => setEditWeekNumber(Number(e.target.value) || 1)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE0D5] dark:border-[#3D2F26] bg-white dark:bg-[#281F19] text-[#2A1D15] dark:text-[#F5EFEB] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/30 focus:border-[#8B5A2B] transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Bobot Nilai (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editWeightPercentage}
                      onChange={(e) => setEditWeightPercentage(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE0D5] dark:border-[#3D2F26] bg-white dark:bg-[#281F19] text-[#2A1D15] dark:text-[#F5EFEB] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/30 focus:border-[#8B5A2B] transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Tingkat Prioritas */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tingkat Prioritas
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "LOW", label: "🌱 Rendah", bg: "bg-[#F6F0E8] dark:bg-[#281F19] text-[#6B5543] dark:text-[#D9C7B6] border-[#EAE0D5] dark:border-[#3D2F26]" },
                      { value: "MEDIUM", label: "🍑 Sedang", bg: "bg-[#F8ECD9] dark:bg-[#332214] text-[#734311] dark:text-[#F3EADF] border-[#E8D1B5] dark:border-[#523A2A]" },
                      { value: "HIGH", label: "🌷 Tinggi", bg: "bg-[#F7E2DD] dark:bg-[#3B1E19] text-[#7A271A] dark:text-[#F8D2CA] border-[#EDBCB2] dark:border-[#5A2B23]" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setEditPriority(item.value as Priority)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center gap-1.5 ${
                          editPriority === item.value
                            ? `${item.bg} ring-2 ring-[#8B5A2B]/40 shadow-xs font-extrabold`
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 opacity-70 hover:opacity-100"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deskripsi & Instruksi Pengerjaan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Deskripsi & Instruksi Pengerjaan
                  </label>
                  <textarea
                    rows={4}
                    value={editInstructions}
                    onChange={(e) => setEditInstructions(e.target.value)}
                    placeholder="Tuliskan petunjuk pengerjaan, format berkas yang diminta dosen, kriteria penilaian, dll."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE0D5] dark:border-[#3D2F26] bg-white dark:bg-[#281F19] text-[#2A1D15] dark:text-[#F5EFEB] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/30 focus:border-[#8B5A2B] transition-all shadow-xs leading-relaxed"
                  />
                </div>

                {/* Lampiran Dokumen / Soal */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1512] border border-[#EAE0D5] dark:border-[#3D2F26]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-[#6B5543] dark:text-[#D9C7B6]" />
                      <span>Lampiran Soal / Dokumen Acuan (Opsional)</span>
                    </label>
                    {editAttachmentUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditAttachmentUrl("");
                          setEditAttachmentName("");
                        }}
                        className="text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus Lampiran</span>
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={editFileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleEditAttachmentSelect(f);
                    }}
                  />

                  {editAttachmentName || editAttachmentUrl ? (
                    <div className="p-3 rounded-xl bg-white dark:bg-[#281F19] border border-[#EAE0D5] dark:border-[#3D2F26] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#F3EADF] dark:bg-[#382314] text-[#4A2E1B] dark:text-[#F3EADF] flex items-center justify-center flex-shrink-0">
                          {isUploadingEditAttachment ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#4A2E1B]" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {editAttachmentName || "Berkas Terlampir"}
                          </p>
                          <p className="text-[10px] text-[#54371C] dark:text-[#D9C7B6] font-medium">
                            ✓ Berkas siap disimpan
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={isUploadingEditAttachment}
                        onClick={() => editFileInputRef.current?.click()}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#F3EADF] dark:bg-[#382314] text-[#4A2E1B] dark:text-[#F3EADF] hover:bg-[#EAE0D5] transition-colors flex-shrink-0"
                      >
                        Ganti File
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => editFileInputRef.current?.click()}
                      className="p-4 rounded-xl border-2 border-dashed border-[#EAE0D5] dark:border-[#3D2F26] hover:border-[#8B5A2B] dark:hover:border-[#8B5A2B] bg-white/70 dark:bg-[#281F19]/50 cursor-pointer text-center transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#FAF7F2] dark:bg-[#1C1512] group-hover:bg-[#F3EADF] dark:group-hover:bg-[#382314] text-[#6B5543] group-hover:text-[#4A2E1B] dark:group-hover:text-[#F3EADF] flex items-center justify-center mx-auto mb-1.5 transition-colors">
                        {isUploadingEditAttachment ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#4A2E1B]" />
                        ) : (
                          <UploadCloud className="w-4 h-4" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {isUploadingEditAttachment ? "Mengunggah berkas..." : "Klik untuk unggah berkas soal / panduan tugas"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PDF, DOCX, ZIP, PPTX hingga 50MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/70 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingEditAttachment}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#4A2E1B] hover:bg-[#382314] text-white text-xs font-bold shadow-md shadow-[#4A2E1B]/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Instruksi Pengerjaan
                  </h4>
                  <button
                    type="button"
                    onClick={startEditing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F3EADF] hover:bg-[#EAE0D5] text-[#4A2E1B] dark:bg-[#281F19] dark:text-[#D9C7B6] dark:hover:bg-[#33251E] border border-[#EAE0D5] dark:border-[#3D2F26] transition-colors shadow-2xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Rincian Tugas</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {assignment.instructions || "Tidak ada instruksi khusus dari dosen."}
                  </p>
                </div>

                {/* Lampiran Berkas / Soal Tugas */}
                {assignment.attachmentUrl && (
                  <div className="p-4 rounded-2xl bg-[#F3EADF]/60 dark:bg-[#281F19]/60 border border-[#EAE0D5] dark:border-[#3D2F26] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-10 h-10 rounded-xl bg-[#EAE0D5] dark:bg-[#382314] text-[#4A2E1B] dark:text-[#F3EADF] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {assignment.attachmentName || "Berkas Lampiran Soal Tugas"}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Dokumen Panduan / Soal yang dilampirkan dosen
                        </p>
                      </div>
                    </div>

                    <a
                      href={assignment.attachmentUrl}
                      download={assignment.attachmentName || "Lampiran_Tugas.pdf"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#4A2E1B] text-white hover:bg-[#382314] text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Berkas Soal</span>
                    </a>
                  </div>
                )}

                {/* Status Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Prioritas
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {assignment.priority === "HIGH"
                        ? "🌷 Tinggi"
                        : assignment.priority === "MEDIUM"
                        ? "🍑 Sedang"
                        : "🌱 Rendah"}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Tipe Asesmen
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {assignment.type === "PROJECT"
                        ? "Proyek / Tugas Besar"
                        : assignment.type === "QUIZ"
                        ? "Kuis Mandiri"
                        : assignment.type === "MIDTERM"
                        ? "Ujian Tengah Semester (UTS)"
                        : assignment.type === "FINAL"
                        ? "Ujian Akhir Semester (UAS)"
                        : "Tugas Rutin"}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Status Pengerjaan
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                      <span>{statusMeta.icon}</span>
                      <span>{statusMeta.label}</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          )}

          {/* TAB: GRADE & FEEDBACK (FR-13 & FR-14) */}
          {activeTab === "GRADE" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" /> Nilai & Evaluasi Dosen
                  </h4>
                  {assignment.score !== undefined && (
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold border"
                      style={{
                        backgroundColor:
                          GRADE_CONFIG[assignment.gradeLetter || "A"]?.bgHex ||
                          "#EDE3D6",
                        color:
                          GRADE_CONFIG[assignment.gradeLetter || "A"]?.textHex ||
                          "#453120",
                      }}
                    >
                      Nilai: {assignment.score} ({assignment.gradeLetter})
                    </div>
                  )}
                </div>

                {assignment.lecturerFeedback ? (
                  <div className="p-4 rounded-xl bg-[#FDFBF7] dark:bg-slate-900 border border-slate-100 dark:border-slate-700 mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Komentar / Feedback Dosen:
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-200 italic">
                      &quot;{assignment.lecturerFeedback}&quot;
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic mb-4">
                    Belum ada catatan feedback dosen untuk tugas ini.
                  </p>
                )}

                {/* Grade Input Form */}
                <form
                  onSubmit={handleSaveGrade}
                  className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-3"
                >
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Perbarui Nilai Tugas Ini:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="grade-score-input" className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Skor Angka (0 - 100)
                      </label>
                      <input
                        id="grade-score-input"
                        type="number"
                        min="0"
                        max="100"
                        value={scoreInput}
                        onChange={(e) =>
                          setScoreInput(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        placeholder={
                          assignment.score !== undefined
                            ? String(assignment.score)
                            : "Contoh: 88"
                        }
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="grade-feedback-input" className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Feedback / Evaluasi Dosen
                      </label>
                      <input
                        id="grade-feedback-input"
                        type="text"
                        maxLength={500}
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        placeholder="Contoh: Analisis arsitektur sangat rapi..."
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#4A2E1B] text-white text-xs font-semibold hover:bg-[#382314] transition-colors shadow-xs"
                  >
                    Simpan Nilai & Prediksi Huruf
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: NOTES & DISCUSSION LOG */}
          {activeTab === "NOTES" && (
            <div className="space-y-4">
              <div className="space-y-3">
                {assignmentNotes.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl border border-dashed border-[#DFCFC1] dark:border-[#38261B] bg-[#FAF5EE]/50 dark:bg-[#1E140E]/50">
                    <p className="text-xs text-[#7A5F4E] dark:text-[#CBB5A3] italic">
                      Belum ada catatan atau pertanyaan diskusi untuk tugas ini.
                    </p>
                    <p className="text-[11px] text-[#A08878] mt-1">
                      Ketik di bawah untuk mencatat progres atau pertanyaan Anda.
                    </p>
                  </div>
                ) : (
                  assignmentNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3.5 rounded-2xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#DFCFC1] dark:border-[#38261B] shadow-2xs transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs text-[#2A1810] dark:text-[#FAF5EE] leading-relaxed whitespace-pre-wrap break-anywhere flex-1">
                          {note.contentMarkdown}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Apakah Anda yakin ingin menghapus pertanyaan / catatan ini?")) {
                              deleteNoteComment(note.id);
                              toast.success("Pertanyaan diskusi berhasil dihapus! 🗑️");
                            }
                          }}
                          title="Hapus pertanyaan / catatan ini"
                          aria-label="Hapus pertanyaan / catatan ini"
                          className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex-shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-[#7A5F4E] dark:text-[#CBB5A3] mt-2 font-medium">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment input */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <label htmlFor="assignment-comment-input" className="sr-only">
                  Tulis pertanyaan atau log progres tugas
                </label>
                <input
                  id="assignment-comment-input"
                  type="text"
                  maxLength={500}
                  placeholder="Tulis pertanyaan ke dosen atau log progres tugas..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#DFCFC1] dark:border-[#38261B] bg-[#FFFDFB] dark:bg-[#1E140E] text-[#2A1810] dark:text-[#FAF5EE] placeholder-[#A08878] outline-none break-anywhere focus:border-[#8B5A2B] transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#3D2517] dark:bg-[#2B180F] text-[#FAF5EE] text-xs font-bold hover:bg-[#2A1810] dark:hover:bg-[#3D2316] shadow-xs transition-colors cursor-pointer"
                >
                  Kirim
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
