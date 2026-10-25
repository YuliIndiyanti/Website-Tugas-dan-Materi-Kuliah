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
    updateAssignmentGrade,
    addSubmission,
    addNoteComment,
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
            background: `linear-gradient(135deg, ${course?.pastelColorHex || "#DBEAFE"} 0%, transparent 60%)`,
          }}
        >
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span
                className="text-xs px-2.5 py-0.5 rounded-md font-bold flex-shrink-0"
                style={{
                  backgroundColor: course?.pastelColorHex || "#DBEAFE",
                  color: course?.pastelTextHex || "#1E3A8A",
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
            </div>
            <h2 id="assignment-detail-modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-100 break-anywhere break-words">
              {assignment.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal rincian tugas"
            className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 transition-colors shadow-xs flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
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
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            Deskripsi & Instruksi
          </button>
          <button
            onClick={() => setActiveTab("SUBMISSIONS")}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "SUBMISSIONS"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
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
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <span>Nilai & Evaluasi Dosen</span>
            {assignment.score !== undefined && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#D1FAE5] text-[#065F46] font-bold">
                {assignment.score} ({assignment.gradeLetter})
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("NOTES")}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "NOTES"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
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
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Instruksi Pengerjaan
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {assignment.instructions}
                </p>
              </div>

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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#D1FAE5] text-[#065F46] hover:bg-[#A7F3D0] border border-[#A7F3D0] shadow-xs"
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
                  className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
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
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 shadow-xs">
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
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
                                <span className="text-indigo-600 font-semibold animate-pulse">
                                  Mengunggah...
                                </span>
                              ) : (
                                <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
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
                            ? "border-emerald-500 bg-emerald-100/50 dark:bg-emerald-900/30"
                            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-emerald-500 hover:bg-emerald-50/30"
                        }`}
                      >
                        <UploadCloud className="w-7 h-7 mx-auto text-emerald-600 mb-1.5" />
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
                    className="w-full py-2.5 rounded-xl bg-[#065F46] disabled:opacity-50 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-xs flex items-center justify-center gap-2"
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
                        <div className="w-10 h-10 rounded-2xl bg-[#E0E7FF] text-[#3730A3] dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          v{sub.versionNumber}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                              {sub.fileName}
                            </span>
                            {idx === 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#D1FAE5] text-[#065F46]">
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
                            className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors shadow-2xs"
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
                            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60"
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
                            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60"
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
                          "#D1FAE5",
                        color:
                          GRADE_CONFIG[assignment.gradeLetter || "A"]?.textHex ||
                          "#065F46",
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
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-xs"
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
