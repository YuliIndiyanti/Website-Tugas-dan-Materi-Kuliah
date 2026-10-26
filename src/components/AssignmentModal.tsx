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
    submissions,
    notes,
    updateAssignmentStatus,
    updateAssignment,
    updateAssignmentGrade,
    addSubmission,
    addNoteComment,
    deleteAssignment,
  } = useVault();

  const [activeTab, setActiveTab] = useState<"DETAILS" | "SUBMISSIONS" | "NOTES" | "GRADE">("DETAILS");
  
  // Submission form state
  const [subFileName, setSubFileName] = useState("");
  const [subFileUrl, setSubFileUrl] = useState("");
  const [subFileSize, setSubFileSize] = useState("");
  const [subProofUrl, setSubProofUrl] = useState("");
  const [subLmsLink, setSubLmsLink] = useState("");
  const [subNotes, setSubNotes] = useState("");
  const [isSubmittingNewVer, setIsSubmittingNewVer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const subFileInputRef = useRef<HTMLInputElement>(null);

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
  const assignmentSubmissions = submissions
    .filter((s) => s.assignmentId === assignment.id)
    .sort((a, b) => b.versionNumber - a.versionNumber);
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

  const handleSubFileSelect = async (file: File) => {
    const sizeFormatted =
      file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setSubFileName(file.name);
    setSubFileSize(sizeFormatted);

    setIsUploading(true);
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
          setSubFileUrl(data.fileUrl);
          toast.success(`Berkas "${file.name}" berhasil diunggah! 📁`);
        }
      } else {
        const localUrl = URL.createObjectURL(file);
        setSubFileUrl(localUrl);
        toast.info(`Berkas "${file.name}" siap disubmit.`);
      }
    } catch (err) {
      console.warn("Upload fallback to local URL:", err);
      const localUrl = URL.createObjectURL(file);
      setSubFileUrl(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subFileName) {
      toast.error("Harap pilih atau beri nama berkas tugas!");
      return;
    }

    addSubmission({
      assignmentId: assignment.id,
      fileName: subFileName,
      fileUrl: subFileUrl || `/sample-files/${subFileName}`,
      fileSize: subFileSize || "1.5 MB",
      proofUrl: subProofUrl || undefined,
      submissionLink: subLmsLink || undefined,
      notes: subNotes || undefined,
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    toast.success("Versi pengumpulan berhasil disimpan! 🚀");

    setSubFileName("");
    setSubFileUrl("");
    setSubFileSize("");
    setSubProofUrl("");
    setSubLmsLink("");
    setSubNotes("");
    setIsSubmittingNewVer(false);
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
    toast.success("Catatan tugas ditambahkan.");
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
            onClick={() => setActiveTab("SUBMISSIONS")}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "SUBMISSIONS"
                ? "border-[#4A2E1B] text-[#4A2E1B] dark:border-[#D9C7B6] dark:text-[#EFE6DD]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <span>Riwayat Pengumpulan (Versioning)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {assignmentSubmissions.length}
            </span>
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
                      Status Pengumpulan
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {assignmentSubmissions.length > 0
                        ? `Tersimpan v${assignmentSubmissions[0].versionNumber}`
                        : "Belum ada berkas draft"}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}

          {/* TAB 2: SUBMISSIONS & VERSIONING (FR-11) */}
          {activeTab === "SUBMISSIONS" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Riwayat Versi Berkas Tugas (v1, v2, v3...)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Pantau iterasi draf, revisi, hingga file final yang disubmit ke LMS
                  </p>
                </div>
                {!isSubmittingNewVer && (
                  <button
                    onClick={() => setIsSubmittingNewVer(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EDE3D6] text-[#453120] hover:bg-[#E4D4C3] border border-[#D9C7B6] shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>+ Unggah Versi Baru</span>
                  </button>
                )}
              </div>

              {/* Upload New Version Form */}
              {isSubmittingNewVer && (
                <form
                  onSubmit={handleCreateSubmission}
                  className="p-5 rounded-2xl bg-[#F6EDE0]/60 dark:bg-[#281F19]/60 border border-[#EAE0D5] dark:border-[#3D2F26] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#4A2E1B] dark:text-[#D9C7B6]">
                      Unggah Draf / Final v{assignmentSubmissions.length + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSubmittingNewVer(false)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Batal
                    </button>
                  </div>

                  {/* Real File Upload Dropzone */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Unggah Berkas Tugas (PDF, DOCX, ZIP, dll) *
                    </label>
                    <input
                      ref={subFileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSubFileSelect(file);
                      }}
                    />

                    {subFileName ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-[#EAE0D5] dark:border-[#3D2F26] shadow-xs">
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <div className="w-9 h-9 rounded-xl bg-[#EDE3D6] dark:bg-[#382314] text-[#453120] dark:text-[#EAE0D5] flex items-center justify-center flex-shrink-0">
                            {isUploading ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <FileText className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                              {subFileName}
                            </p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span>{subFileSize || "Berkas terpilih"}</span>
                              {isUploading ? (
                                <span className="text-[#4A2E1B] dark:text-[#D9C7B6] font-semibold animate-pulse">
                                  Mengunggah...
                                </span>
                              ) : (
                                <span className="text-[#54371C] dark:text-[#D9C7B6] font-semibold flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3 inline" /> Siap
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => subFileInputRef.current?.click()}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex-shrink-0"
                        >
                          Ganti
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleSubFileSelect(file);
                        }}
                        onClick={() => subFileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                          isDragging
                            ? "border-[#8B5A2B] bg-[#F6EDE0]/50 dark:bg-[#281F19]/50"
                            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-[#8B5A2B] hover:bg-[#F3EADF]/30"
                        }`}
                      >
                        <UploadCloud className="w-7 h-7 mx-auto text-[#6B5543] dark:text-[#D9C7B6] mb-1.5" />
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          Klik untuk memilih berkas tugas atau seret ke sini
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          PDF, DOCX, ZIP, PPTX, JPG hingga 50 MB
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="sub-file-name" className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Label / Nama Berkas *
                    </label>
                    <input
                      id="sub-file-name"
                      type="text"
                      required
                      placeholder="Contoh: Tugas_Analisis_ADPL_v2_Revisi.pdf"
                      value={subFileName}
                      onChange={(e) => setSubFileName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="sub-lms-link" className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Link Pengumpulan LMS / GitHub (Opsional)
                      </label>
                      <input
                        id="sub-lms-link"
                        type="url"
                        placeholder="https://lms.kampus.ac.id/..."
                        value={subLmsLink}
                        onChange={(e) => setSubLmsLink(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="sub-proof-url" className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        URL Bukti Screenshot Submit (Opsional)
                      </label>
                      <input
                        id="sub-proof-url"
                        type="url"
                        placeholder="https://imgur.com/bukti.png"
                        value={subProofUrl}
                        onChange={(e) => setSubProofUrl(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sub-notes-input" className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Catatan Versi
                    </label>
                    <input
                      id="sub-notes-input"
                      type="text"
                      placeholder="Apa saja perubahan atau catatan pada versi ini..."
                      value={subNotes}
                      onChange={(e) => setSubNotes(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading || !subFileName}
                    className="w-full py-2.5 rounded-xl bg-[#4A2E1B] disabled:opacity-50 text-white text-xs font-semibold hover:bg-[#382314] transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sedang Mengunggah Berkas...</span>
                      </>
                    ) : (
                      <span>Simpan Riwayat Versi v{assignmentSubmissions.length + 1}</span>
                    )}
                  </button>
                </form>
              )}

              {/* Version History List */}
              <div className="space-y-3">
                {assignmentSubmissions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    Belum ada riwayat pengumpulan tugas.
                  </p>
                ) : (
                  assignmentSubmissions.map((sub, idx) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-[#EDE3D6] text-[#453120] dark:bg-[#382314] dark:text-[#EAE0D5] flex items-center justify-center font-bold text-xs flex-shrink-0">
                          v{sub.versionNumber}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                              {sub.fileName}
                            </span>
                            {idx === 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#EAE0D5] text-[#382314]">
                                Terbaru
                              </span>
                            )}
                          </div>
                          {sub.notes && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {sub.notes}
                            </p>
                          )}
                          <p className="text-[10px] text-slate-400 mt-1">
                            Diunggah: {formatDate(sub.uploadedAt)} •{" "}
                            {sub.fileSize || "3 MB"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {sub.fileUrl && (
                          <a
                            href={sub.fileUrl}
                            download={sub.fileName}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-[#4A2E1B] dark:hover:text-[#D9C7B6] px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors shadow-2xs"
                            title="Unduh / Buka Berkas Tugas"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh Berkas</span>
                          </a>
                        )}
                        {sub.submissionLink && (
                          <a
                            href={sub.submissionLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[11px] font-semibold text-[#4A2E1B] dark:text-[#D9C7B6] hover:underline px-2.5 py-1 rounded-xl bg-[#F3EADF] dark:bg-[#281F19]"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span>Link LMS</span>
                          </a>
                        )}
                        {sub.proofUrl && (
                          <a
                            href={sub.proofUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[11px] font-semibold text-[#54371C] dark:text-[#E4D4C3] hover:underline px-2.5 py-1 rounded-xl bg-[#EDE0D2] dark:bg-[#281F19]"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Bukti Kumpul</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: GRADE & FEEDBACK (FR-13 & FR-14) */}
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

          {/* TAB 4: NOTES & DISCUSSION LOG (FR-17) */}
          {activeTab === "NOTES" && (
            <div className="space-y-4">
              <div className="space-y-3">
                {assignmentNotes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">
                    Belum ada catatan atau pertanyaan diskusi untuk tugas ini.
                  </p>
                ) : (
                  assignmentNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700"
                    >
                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap break-anywhere">
                        {note.contentMarkdown}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2">
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
                  className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#4A2E1B] text-white text-xs font-semibold hover:bg-[#382314] shadow-xs"
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
