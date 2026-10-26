"use client";

import React, { useState, useRef } from "react";
import { useVault } from "@/context/VaultContext";
import {
  X,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  Paperclip,
  Trash2,
} from "lucide-react";
import { Priority, AssignmentType } from "@/types";
import { toast } from "sonner";

interface NewAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseId?: string;
}

export const NewAssignmentModal: React.FC<NewAssignmentModalProps> = ({
  isOpen,
  onClose,
  defaultCourseId,
}) => {
  const { activeCourses, addAssignment } = useVault();

  const [courseId, setCourseId] = useState(
    defaultCourseId || activeCourses[0]?.id || ""
  );
  const [weekNumber, setWeekNumber] = useState(7);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("2026-10-27T23:59");
  const [priority, setPriority] = useState<Priority>("HIGH");
  const [type, setType] = useState<AssignmentType>("TASK");
  const [weightPercentage, setWeightPercentage] = useState(15);

  // File Attachment State
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentSize, setAttachmentSize] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    const sizeFormatted =
      file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setAttachmentName(file.name);
    setAttachmentSize(sizeFormatted);

    // Auto-detect title if empty
    if (!title.trim()) {
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      setTitle(cleanTitle);
    }

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
          setAttachmentUrl(data.fileUrl);
          toast.success(`Berkas tugas "${file.name}" berhasil diunggah! 📁`);
        }
      } else {
        const localUrl = URL.createObjectURL(file);
        setAttachmentUrl(localUrl);
        toast.info(`Berkas "${file.name}" terlampir di browser.`);
      }
    } catch (err) {
      console.warn("Upload fallback to local URL:", err);
      const localUrl = URL.createObjectURL(file);
      setAttachmentUrl(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentUrl("");
    setAttachmentName("");
    setAttachmentSize("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId) return;

    addAssignment({
      courseId,
      weekNumber: Number(weekNumber),
      title,
      instructions,
      attachmentUrl: attachmentUrl || undefined,
      attachmentName: attachmentName || undefined,
      dueDate: new Date(dueDate).toISOString(),
      priority,
      status: "TODO",
      type,
      weightPercentage: Number(weightPercentage),
    });

    toast.success(`Tugas "${title}" berhasil dicatat! 📝`);

    handleRemoveAttachment();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-assignment-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0" />

        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-[#FDFBF7] dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">📝</span>
            <h3 id="new-assignment-modal-title" className="text-base font-bold text-slate-800 dark:text-slate-100">
              Buat Catatan Tugas Baru
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal tambah tugas"
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 btn-tactile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Course & Week */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="assign-course-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mata Kuliah *
              </label>
              <select
                id="assign-course-select"
                required
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              >
                {activeCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="assign-week-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pertemuan (Minggu ke-)
              </label>
              <select
                id="assign-week-select"
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              >
                {Array.from({ length: 16 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Minggu {w} {w === 8 ? "(UTS)" : w === 16 ? "(UAS)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="assign-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Judul Tugas / Proyek *
            </label>
            <input
              id="assign-title-input"
              type="text"
              required
              maxLength={200}
              placeholder="Contoh: Implementasi Arsitektur Clean Code & Unit Testing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
            />
          </div>

          {/* Instructions */}
          <div>
            <label htmlFor="assign-instructions-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi & Instruksi Dosen
            </label>
            <textarea
              id="assign-instructions-input"
              rows={3}
              maxLength={3000}
              placeholder="Tuliskan format pengumpulan, instruksi soal, atau kriteria penilaian..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
            />
          </div>

          {/* Attachment Upload (Soal / Dokumen Tugas) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-[#6B5543] dark:text-[#D9C7B6]" />
                <span>Unggah Berkas / Soal Tugas (PDF, DOCX, ZIP, dll)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Opsional</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />

            {attachmentName ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-[#EAE0D5] dark:border-[#3D2F26] shadow-xs">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-9 h-9 rounded-xl bg-[#EDE3D6] dark:bg-[#382314] text-[#453120] dark:text-[#EAE0D5] flex items-center justify-center flex-shrink-0">
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {attachmentName}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{attachmentSize || "Berkas terpilih"}</span>
                      {isUploading ? (
                        <span className="text-[#4A2E1B] dark:text-[#D9C7B6] font-semibold animate-pulse">
                          Mengunggah ke server...
                        </span>
                      ) : (
                        <span className="text-[#54371C] dark:text-[#D9C7B6] font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 inline" /> Berkas Siap
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    Ganti
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Hapus Lampiran"
                    aria-label="Hapus Lampiran"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
                  if (file) handleFileSelect(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-[#8B5A2B] bg-[#F6EDE0]/50 dark:bg-[#281F19]/50"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-[#8B5A2B] hover:bg-[#F3EADF]/20"
                }`}
              >
                <UploadCloud className="w-6 h-6 mx-auto text-[#6B5543] dark:text-[#D9C7B6] mb-1" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Tarik file soal/tugas ke sini atau klik untuk browse
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Mendukung PDF, DOCX, PPTX, XLSX, MP4, MP3, PNG, ZIP hingga 50 MB
                </p>
              </div>
            )}
          </div>

          {/* Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="assign-due-date-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tenggat Waktu (Tanggal & Jam) *
              </label>
              <input
                id="assign-due-date-input"
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
            <div>
              <label htmlFor="assign-weight-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bobot Nilai (%)
              </label>
              <input
                id="assign-weight-input"
                type="number"
                min="0"
                max="100"
                value={weightPercentage}
                onChange={(e) => setWeightPercentage(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
          </div>

          {/* Priority & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <fieldset>
              <legend className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tingkat Prioritas
              </legend>
              <div className="flex gap-1.5" role="radiogroup">
                {[
                  { id: "LOW", label: "🌱 Rendah", bg: "bg-[#F6F0E8] text-[#6B5543] dark:bg-[#281F19] dark:text-[#D9C7B6]" },
                  { id: "MEDIUM", label: "🍑 Sedang", bg: "bg-[#F8ECD9] text-[#734311] dark:bg-[#332214] dark:text-[#F3EADF]" },
                  { id: "HIGH", label: "🌷 Tinggi", bg: "bg-[#F7E2DD] text-[#7A271A] dark:bg-[#3B1E19] dark:text-[#F8D2CA]" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={priority === p.id}
                    onClick={() => setPriority(p.id as Priority)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      priority === p.id
                        ? `${p.bg} border-current shadow-xs`
                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="assign-type-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Asesmen
              </label>
              <select
                id="assign-type-select"
                value={type}
                onChange={(e) => setType(e.target.value as AssignmentType)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              >
                <option value="TASK">Tugas Rutin</option>
                <option value="PROJECT">Proyek / Tugas Besar</option>
                <option value="QUIZ">Kuis / Post-Test</option>
                <option value="MIDTERM">Ujian Tengah Semester (UTS)</option>
                <option value="FINAL">Ujian Akhir Semester (UAS)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-2.5 rounded-2xl bg-[#4A2E1B] disabled:opacity-50 text-white text-xs font-bold hover:bg-[#382314] transition-colors shadow-md flex items-center justify-center gap-1.5 btn-tactile"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengunggah Berkas Tugas...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Simpan Tugas Baru</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
