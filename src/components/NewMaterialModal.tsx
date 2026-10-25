"use client";

import React, { useState, useRef } from "react";
import { useVault } from "@/context/VaultContext";
import {
  X,
  Upload,
  Link as LinkIcon,
  FileText,
  Sparkles,
  Tag,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Film,
  BookOpen,
} from "lucide-react";
import { MaterialCategory, PastelTag } from "@/types";
import { DEFAULT_TAGS } from "@/lib/constants";
import { toast } from "sonner";

interface NewMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseId?: string;
}

export const NewMaterialModal: React.FC<NewMaterialModalProps> = ({
  isOpen,
  onClose,
  defaultCourseId,
}) => {
  const { activeCourses, addMaterial } = useVault();

  const [courseId, setCourseId] = useState(
    defaultCourseId || activeCourses[0]?.id || ""
  );
  const [weekNumber, setWeekNumber] = useState(7);
  const [category, setCategory] = useState<MaterialCategory>("SLIDE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<PastelTag[]>([DEFAULT_TAGS[0]]);
  
  // Real file upload states
  const [isExternalUrlMode, setIsExternalUrlMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const toggleTag = (tag: PastelTag) => {
    if (selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const sizeFormatted =
      file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setFileSize(sizeFormatted);
    setFileName(file.name);

    // Auto-detect title if empty
    if (!title.trim()) {
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      setTitle(cleanTitle);
    }

    // Auto-detect category
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (["pdf", "ppt", "pptx"].includes(ext)) {
      setCategory("SLIDE");
    } else if (["epub", "doc", "docx"].includes(ext) || file.name.toLowerCase().includes("modul")) {
      setCategory("BOOK");
    } else if (["mp4", "mov", "mkv", "mp3", "wav", "m4a"].includes(ext)) {
      setCategory("RECORDING");
    }

    // Upload to server API /api/upload
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
          setFileUrl(data.fileUrl);
          toast.success(`Berkas "${file.name}" berhasil diunggah! 📁`);
        }
      } else {
        // Fallback to local object URL if API failed
        const localUrl = URL.createObjectURL(file);
        setFileUrl(localUrl);
        toast.info(`Berkas "${file.name}" dimuat langsung di browser.`);
      }
    } catch (err) {
      console.warn("Upload fallback to local URL:", err);
      const localUrl = URL.createObjectURL(file);
      setFileUrl(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId) return;

    if (!isExternalUrlMode && !fileUrl && !fileName) {
      toast.error("Harap pilih atau unggah berkas materi terlebih dahulu!");
      return;
    }

    addMaterial({
      courseId,
      weekNumber: Number(weekNumber),
      title,
      description,
      category: isExternalUrlMode ? "LINK" : category,
      fileName: isExternalUrlMode ? undefined : fileName || `${title.replace(/\s+/g, "_")}.pdf`,
      fileSize: isExternalUrlMode ? undefined : fileSize || "3.5 MB",
      fileUrl: isExternalUrlMode ? undefined : fileUrl || `/sample-files/${fileName || "materi.pdf"}`,
      externalUrl: isExternalUrlMode ? externalUrl : undefined,
      tags: selectedTags,
    });

    toast.success(`Materi "${title}" berhasil disimpan ke Vault! 📂`);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-material-modal-title"
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
            <span className="text-xl" aria-hidden="true">📂</span>
            <h3 id="new-material-modal-title" className="text-base font-bold text-slate-800 dark:text-slate-100">
              Unggah Materi ke Yuli&apos;s Vault
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal unggah materi"
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 btn-tactile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Source Mode Toggle: Upload File vs External URL */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setIsExternalUrlMode(false);
                if (category === "LINK") setCategory("SLIDE");
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all btn-tactile ${
                !isExternalUrlMode
                  ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Unggah Berkas File</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsExternalUrlMode(true);
                setCategory("LINK");
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all btn-tactile ${
                isExternalUrlMode
                  ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Tautan Eksternal (URL)</span>
            </button>
          </div>

          {/* Real File Upload Dropzone */}
          {!isExternalUrlMode ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Berkas Dokumen / File Materi *
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.epub,.txt,.mp4,.mov,.mp3,.wav,.zip,.png,.jpg,.jpeg"
                className="hidden"
              />

              {!selectedFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileSelect(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-200"
                      : "border-indigo-200/80 hover:border-indigo-400 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/30"
                  }`}
                >
                  <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center shadow-xs">
                    <UploadCloud className="w-5 h-5 animate-pulse" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Klik untuk memilih file atau seret & lepas berkas ke sini
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Format: PDF, Slide PPTX, Word DOCX, Rekaman MP4/MP3, E-Book, ZIP (Maks 50MB)
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl border border-indigo-200/80 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs border border-indigo-100 dark:border-indigo-900">
                      {fileName.endsWith(".pdf")
                        ? "📕 PDF"
                        : fileName.match(/\.(ppt|pptx)$/)
                        ? "📊 PPT"
                        : fileName.match(/\.(doc|docx)$/)
                        ? "📝 DOC"
                        : fileName.match(/\.(mp4|mov|mkv)$/)
                        ? "🎬 VID"
                        : "📁 FILE"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate break-anywhere">
                        {fileName}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                        <span>{fileSize}</span>
                        <span>•</span>
                        {isUploading ? (
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Mengunggah berkas...</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Tersimpan & Siap</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 border border-slate-200 dark:border-slate-700 shadow-xs btn-tactile"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFileName("");
                        setFileUrl("");
                        setFileSize("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 transition-colors btn-tactile"
                      title="Hapus file terpilih"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label htmlFor="material-url-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tautan Eksternal (URL) *
              </label>
              <input
                id="material-url-input"
                type="url"
                required
                placeholder="https://youtube.com/watch?... atau https://github.com/..."
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
          )}

          {/* Course & Week */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="material-course-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mata Kuliah *
              </label>
              <select
                id="material-course-select"
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
              <label htmlFor="material-week-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pertemuan (Minggu)
              </label>
              <select
                id="material-week-select"
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

          {/* Title & Category */}
          <div>
            <label htmlFor="material-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Judul Materi *
            </label>
            <input
              id="material-title-input"
              type="text"
              required
              maxLength={180}
              placeholder="Contoh: Slide 07: Arsitektur Microservices & REST API"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere font-medium"
            />
          </div>

          {!isExternalUrlMode && (
            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tipe Materi
              </span>
              <div className="grid grid-cols-3 gap-2" role="radiogroup">
                {[
                  { id: "SLIDE", label: "📕 Slide/PDF" },
                  { id: "BOOK", label: "📘 E-Book / Modul" },
                  { id: "RECORDING", label: "🎬 Rekaman" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={category === c.id}
                    onClick={() => setCategory(c.id as MaterialCategory)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all text-center btn-tactile ${
                      category === c.id
                        ? "bg-[#E0E7FF] text-[#3730A3] border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label htmlFor="material-desc-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ringkasan Isi Materi
            </label>
            <textarea
              id="material-desc-input"
              rows={2}
              maxLength={1500}
              placeholder="Rangkuman topik bahasan, materi apa saja yang dicakup..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
            />
          </div>

          {/* Pastel Tags Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Pilih Tag Kategori Pastel</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_TAGS.map((t) => {
                const isSelected = selectedTags.some((tag) => tag.id === t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all btn-tactile ${
                      isSelected
                        ? "ring-2 ring-indigo-400 shadow-xs"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: t.bgHex,
                      color: t.textHex,
                      borderColor: t.textHex,
                    }}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-2.5 rounded-2xl bg-[#3730A3] text-white text-xs font-bold hover:bg-indigo-800 transition-colors shadow-md flex items-center justify-center gap-2 btn-tactile disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengunggah Berkas...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Simpan Materi ke Vault</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
