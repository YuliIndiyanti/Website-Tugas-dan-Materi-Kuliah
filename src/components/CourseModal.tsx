"use client";

import React, { useState } from "react";
import { useVault } from "@/context/VaultContext";
import { X, BookOpen, Sparkles, Check } from "lucide-react";
import { PASTEL_THEMES } from "@/lib/constants";
import { Course } from "@/types";
import { toast } from "sonner";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editCourse?: Course | null;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  editCourse,
}) => {
  const { activeSemesterId, addCourse, updateCourse } = useVault();

  const [code, setCode] = useState(editCourse?.code || "");
  const [name, setName] = useState(editCourse?.name || "");
  const [credits, setCredits] = useState(editCourse?.credits || 3);
  const [lecturerName, setLecturerName] = useState(editCourse?.lecturerName || "");
  const [scheduleDay, setScheduleDay] = useState(editCourse?.scheduleDay || "Senin");
  const [scheduleTime, setScheduleTime] = useState(
    editCourse?.scheduleTime || "08:00 - 10:30"
  );
  const [roomOrLink, setRoomOrLink] = useState(editCourse?.roomOrLink || "");
  const [selectedThemeId, setSelectedThemeId] = useState(
    editCourse?.pastelThemeId || "baby-blue"
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    const theme =
      PASTEL_THEMES.find((t) => t.id === selectedThemeId) || PASTEL_THEMES[0];

    if (editCourse) {
      updateCourse(editCourse.id, {
        code,
        name,
        credits: Number(credits),
        lecturerName,
        scheduleDay,
        scheduleTime,
        roomOrLink,
        pastelThemeId: theme.id,
        pastelColorHex: theme.bgHex,
        pastelTextHex: theme.textHex,
      });
      toast.success(`Mata kuliah "${name}" berhasil diperbarui! 📚`);
    } else {
      addCourse({
        semesterId: activeSemesterId,
        code,
        name,
        credits: Number(credits),
        lecturerName,
        scheduleDay,
        scheduleTime,
        roomOrLink,
        pastelThemeId: theme.id,
        pastelColorHex: theme.bgHex,
        pastelTextHex: theme.textHex,
      });
      toast.success(`Mata kuliah "${name}" berhasil ditambahkan! 📚`);
    }

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
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
            <span className="text-xl" aria-hidden="true">📚</span>
            <h3 id="course-modal-title" className="text-base font-bold text-slate-800 dark:text-slate-100">
              {editCourse ? "Ubah Mata Kuliah" : "Tambah Mata Kuliah Baru"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal mata kuliah"
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 btn-tactile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Code & Credits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="course-code-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kode Mata Kuliah *
              </label>
              <input
                id="course-code-input"
                type="text"
                required
                maxLength={24}
                placeholder="Contoh: IF301"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none uppercase font-bold break-anywhere"
              />
            </div>
            <div>
              <label htmlFor="course-credits-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                SKS *
              </label>
              <input
                id="course-credits-input"
                type="number"
                min="1"
                max="12"
                required
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="course-name-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Mata Kuliah *
            </label>
            <input
              id="course-name-input"
              type="text"
              required
              maxLength={150}
              placeholder="Contoh: Analisis dan Desain Perangkat Lunak"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
            />
          </div>

          {/* Lecturer */}
          <div>
            <label htmlFor="course-lecturer-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Dosen Pengampu
            </label>
            <input
              id="course-lecturer-input"
              type="text"
              maxLength={150}
              placeholder="Contoh: Prof. Dr. Ir. Hendra Kusuma, M.T."
              value={lecturerName}
              onChange={(e) => setLecturerName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
            />
          </div>

          {/* Schedule & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="course-day-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hari Kuliah
              </label>
              <select
                id="course-day-select"
                value={scheduleDay}
                onChange={(e) => setScheduleDay(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              >
                {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map(
                  (d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label htmlFor="course-time-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jam Kuliah
              </label>
              <input
                id="course-time-input"
                type="text"
                maxLength={40}
                placeholder="08:00 - 11:30"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
            <div>
              <label htmlFor="course-room-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ruangan / Link
              </label>
              <input
                id="course-room-input"
                type="text"
                maxLength={200}
                placeholder="Lab RPL / Zoom"
                value={roomOrLink}
                onChange={(e) => setRoomOrLink(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
              />
            </div>
          </div>

          {/* Soft Pastel Theme Picker (PRD Section 3.3) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Identitas Tema Warna Soft Pastel</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PASTEL_THEMES.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`p-2.5 rounded-2xl cursor-pointer border transition-all relative ${
                      isSelected
                        ? "ring-2 ring-indigo-500 shadow-sm"
                        : "opacity-80 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: theme.bgHex,
                      borderColor: theme.borderHex,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-bold leading-tight"
                        style={{ color: theme.textHex }}
                      >
                        {theme.name}
                      </span>
                      {isSelected && (
                        <Check
                          className="w-3.5 h-3.5"
                          style={{ color: theme.textHex }}
                        />
                      )}
                    </div>
                    <p
                      className="text-[9px] mt-1 line-clamp-1 opacity-80"
                      style={{ color: theme.textHex }}
                    >
                      {theme.categorySuggestion}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-[#3730A3] text-white text-xs font-bold hover:bg-indigo-800 transition-colors shadow-md btn-tactile"
            >
              {editCourse ? "Simpan Perubahan Mata Kuliah" : "Tambah Mata Kuliah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
