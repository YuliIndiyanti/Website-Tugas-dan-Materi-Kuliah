"use client";

import React, { useState } from "react";
import { useVault } from "@/context/VaultContext";
import { X, Upload, Link as LinkIcon, FileText, Sparkles, Tag } from "lucide-react";
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
  const [externalUrl, setExternalUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<PastelTag[]>([DEFAULT_TAGS[0]]);

  if (!isOpen) return null;

  const toggleTag = (tag: PastelTag) => {
    if (selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId) return;

    addMaterial({
      courseId,
      weekNumber: Number(weekNumber),
      title,
      description,
      category,
      fileName: fileName || `${title.replace(/\s+/g, "_")}.pdf`,
      fileSize: "4.5 MB",
      fileUrl: externalUrl ? undefined : `/sample-files/${fileName || "materi.pdf"}`,
      externalUrl: externalUrl || undefined,
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
              Unggah Materi ke KuliahVault
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
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tipe Materi
            </span>
            <div className="grid grid-cols-4 gap-2" role="radiogroup">
              {[
                { id: "SLIDE", label: "📕 Slide/PDF" },
                { id: "BOOK", label: "📘 E-Book" },
                { id: "RECORDING", label: "🎬 Rekaman" },
                { id: "LINK", label: "🔗 Link Web" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={category === c.id}
                  onClick={() => setCategory(c.id as MaterialCategory)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    category === c.id
                      ? "bg-[#E0E7FF] text-[#3730A3] border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* External URL or file name */}
          {category === "LINK" ? (
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
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="material-filename-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama File / Berkas
              </label>
              <input
                id="material-filename-input"
                type="text"
                maxLength={180}
                placeholder="Contoh: Modul_Praktikum_Pertemuan_7.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
              />
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
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
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
              className="w-full py-2.5 rounded-2xl bg-[#3730A3] text-white text-xs font-bold hover:bg-indigo-800 transition-colors shadow-md flex items-center justify-center gap-1.5 btn-tactile"
            >
              <Upload className="w-4 h-4" />
              <span>Simpan Materi ke Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
