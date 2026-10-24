"use client";

import React, { useState } from "react";
import { useVault } from "@/context/VaultContext";
import { X, Calendar, Plus, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SemesterModal: React.FC<SemesterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    semesters,
    activeSemesterId,
    setActiveSemesterId,
    addSemester,
    deleteSemester,
  } = useVault();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2027-01-30");

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addSemester({
      name,
      startDate,
      endDate,
      isActive: true,
    });

    toast.success(`Semester "${name}" berhasil ditambahkan! 📅`);

    setName("");
    setIsAdding(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="semester-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh] animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0" />

        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-[#FDFBF7] dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" aria-hidden="true" />
            <h3 id="semester-modal-title" className="text-base font-bold text-slate-800 dark:text-slate-100">
              Kelola Semester Akademik
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal semester"
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 btn-tactile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* List of semesters */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pilih Semester Aktif
            </p>
            {semesters.map((sem) => {
              const isActive = sem.id === activeSemesterId;
              return (
                <div
                  key={sem.id}
                  onClick={() => setActiveSemesterId(sem.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isActive
                      ? "bg-[#E0E7FF] text-[#3730A3] border-indigo-300 dark:bg-[#312E81] dark:text-[#E0E7FF] font-semibold shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                        isActive
                          ? "bg-[#3730A3] text-white dark:bg-[#E0E7FF] dark:text-[#312E81]"
                          : "border border-slate-300"
                      }`}
                    >
                      {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs break-anywhere font-medium">{sem.name}</p>
                      <p className="text-[10px] opacity-70">
                        {sem.startDate} s/d {sem.endDate}
                      </p>
                    </div>
                  </div>

                  {semesters.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSemester(sem.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors flex-shrink-0"
                      aria-label={`Hapus ${sem.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Semester Form */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 rounded-2xl border border-dashed border-indigo-300 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Buat Semester Baru</span>
            </button>
          ) : (
            <form
              onSubmit={handleAdd}
              className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  Semester Baru
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Batal
                </button>
              </div>

              <div>
                <label htmlFor="semester-name-input" className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Semester *
                </label>
                <input
                  id="semester-name-input"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Contoh: Semester Genap 2026/2027"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none break-anywhere"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="semester-start-date" className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    id="semester-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="semester-end-date" className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    id="semester-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
              >
                Simpan & Aktifkan
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
