"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useVault } from "@/context/VaultContext";
import { CourseModal } from "@/components/CourseModal";
import {
  BookOpen,
  Plus,
  Clock,
  MapPin,
  User,
  ArrowRight,
  FolderArchive,
  CheckSquare,
  Edit2,
  Trash2,
} from "lucide-react";
import { Course } from "@/types";
import { toast } from "sonner";

export default function CoursesPage() {
  const { activeCourses, activeSemester, assignments, materials, deleteCourse, addCourse } =
    useVault();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const totalSKS = activeCourses.reduce((sum, c) => sum + (c.credits || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
              Daftar Mata Kuliah
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {activeSemester?.name || "Semester Aktif"} • Total {activeCourses.length} Mata Kuliah ({totalSKS} SKS)
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCourse(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#3730A3] text-white text-xs font-semibold hover:bg-indigo-800 transition-colors shadow-sm self-start sm:self-auto btn-tactile"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Mata Kuliah</span>
        </button>
      </div>

      {/* Course Cards Grid */}
      {activeCourses.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Belum Ada Mata Kuliah
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Semester ini belum memiliki mata kuliah terdaftar. Klik tombol Tambah Mata Kuliah untuk mulai mencatat.
          </p>
          <button
            onClick={() => {
              setEditingCourse(null);
              setIsModalOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded-2xl bg-[#E0E7FF] text-[#3730A3] text-xs font-bold hover:bg-indigo-200 btn-tactile"
          >
            + Tambah Mata Kuliah Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeCourses.map((c) => {
            const courseAssignments = assignments.filter((a) => a.courseId === c.id);
            const courseMaterials = materials.filter((m) => m.courseId === c.id);

            return (
              <div
                key={c.id}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-soft hover:shadow-soft-hover transition-all flex flex-col group min-w-0 card-tactile"
              >
                {/* Header Banner with pastel gradient */}
                <div
                  className="p-5 border-b relative"
                  style={{
                    background: `linear-gradient(135deg, ${c.pastelColorHex} 0%, #FFFFFF 100%)`,
                    borderColor: `${c.pastelColorHex}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-xl shadow-xs flex-shrink-0"
                      style={{
                        backgroundColor: c.pastelColorHex,
                        color: c.pastelTextHex,
                      }}
                    >
                      {c.code}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingCourse(c);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 shadow-xs btn-tactile"
                        title="Edit Mata Kuliah"
                        aria-label={`Edit mata kuliah ${c.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const deleted = { ...c };
                          deleteCourse(c.id);
                          toast.success(`Mata kuliah "${deleted.name}" dihapus`, {
                            action: {
                              label: "Urungkan",
                              onClick: () => addCourse(deleted),
                            },
                          });
                        }}
                        className="p-1.5 rounded-lg bg-white/80 hover:bg-rose-50 text-slate-400 hover:text-rose-600 shadow-xs btn-tactile"
                        title="Hapus Mata Kuliah"
                        aria-label={`Hapus mata kuliah ${c.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2.5 line-clamp-2 break-anywhere">
                    {c.name}
                  </h3>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate break-anywhere">{c.lecturerName}</span>
                  </p>
                </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {c.scheduleDay}, {c.scheduleTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{c.roomOrLink}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 dark:border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      Bobot
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {c.credits} SKS
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      Materi
                    </span>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      {courseMaterials.length} file
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      Tugas
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {courseAssignments.length} item
                    </span>
                  </div>
                </div>

                {/* Footer link to detail */}
                <Link
                  href={`/courses/${c.id}`}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-[#E0E7FF] dark:hover:bg-[#312E81] text-slate-700 dark:text-slate-200 hover:text-[#3730A3] dark:hover:text-[#E0E7FF] text-xs font-bold flex items-center justify-center gap-1.5 transition-all group-hover:shadow-xs"
                >
                  <span>Buka Workspace Mata Kuliah</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      )}

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editCourse={editingCourse}
      />
    </div>
  );
}
