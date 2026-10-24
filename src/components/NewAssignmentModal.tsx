"use client";

import React, { useState } from "react";
import { useVault } from "@/context/VaultContext";
import { X, Plus, Calendar, Clock, Sparkles } from "lucide-react";
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId) return;

    addAssignment({
      courseId,
      weekNumber: Number(weekNumber),
      title,
      instructions,
      dueDate: new Date(dueDate).toISOString(),
      priority,
      status: "TODO",
      type,
      weightPercentage: Number(weightPercentage),
    });

    toast.success(`Tugas "${title}" berhasil dicatat! 📝`);

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
                  { id: "LOW", label: "🌱 Rendah", bg: "bg-[#D1FAE5] text-[#065F46]" },
                  { id: "MEDIUM", label: "🍑 Sedang", bg: "bg-[#FEF3C7] text-[#92400E]" },
                  { id: "HIGH", label: "🌷 Tinggi", bg: "bg-[#FFE4E6] text-[#9F1239]" },
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
              className="w-full py-2.5 rounded-2xl bg-[#065F46] text-white text-xs font-bold hover:bg-emerald-800 transition-colors shadow-md flex items-center justify-center gap-1.5 btn-tactile"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Simpan Tugas Baru</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
