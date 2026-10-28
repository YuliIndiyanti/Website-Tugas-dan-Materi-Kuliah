"use client";

import React, { useState, use } from "react";
import { useVault } from "@/context/VaultContext";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { AssignmentModal } from "@/components/AssignmentModal";
import { MaterialPreviewModal } from "@/components/MaterialPreviewModal";
import { NewAssignmentModal } from "@/components/NewAssignmentModal";
import { NewMaterialModal } from "@/components/NewMaterialModal";
import { SparkleStar } from "@/components/GlitterEffects";
import {
  BookOpen,
  CheckSquare,
  FileText,
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  ExternalLink,
  Edit,
  Save,
  Check,
  Trash2,
  Paperclip,
  Download,
} from "lucide-react";
import {
  formatDate,
  getAssignmentUrgency,
  calculateCourseAverage,
} from "@/lib/utils";
import { STATUS_CONFIG, GRADE_CONFIG } from "@/lib/constants";
import Link from "next/link";
import { toast } from "sonner";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.id;

  const {
    courses,
    materials,
    assignments,
    notes,
    addNoteComment,
    updateNoteComment,
    deleteMaterial,
    deleteAssignment,
  } = useVault();

  const [activeTab, setActiveTab] = useState<
    "MATERIALS" | "ASSIGNMENTS" | "NOTES" | "GRADES"
  >("MATERIALS");
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({
    6: true,
    7: true,
    8: true,
  });

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [isNewMaterialOpen, setIsNewMaterialOpen] = useState(false);

  const course = courses.find((c) => c.id === courseId);

  // Notes for this course
  const courseNote = notes.find((n) => n.courseId === courseId);
  const [noteContent, setNoteContent] = useState(
    courseNote?.contentMarkdown ||
      `### 🌸 Catatan Kuliah ${course?.name || ""}\n\n> [!NOTE]\nTulis rangkuman penting perkuliahan mingguan di sini.\n\n- Poin utama minggu ini...\n`
  );
  const [isSavedNote, setIsSavedNote] = useState(false);

  if (!course) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Mata kuliah tidak ditemukan.</p>
        <Link
          href="/courses"
          className="text-xs font-semibold text-indigo-600 hover:underline mt-2 inline-block"
        >
          Kembali ke Daftar Mata Kuliah
        </Link>
      </div>
    );
  }

  const courseMaterials = materials.filter((m) => m.courseId === course.id);
  const courseAssignments = assignments.filter((a) => a.courseId === course.id);
  const gradeCalc = calculateCourseAverage(courseAssignments);

  const toggleWeek = (week: number) => {
    setExpandedWeeks((prev) => ({ ...prev, [week]: !prev[week] }));
  };

  const handleSaveNotes = () => {
    if (courseNote) {
      updateNoteComment(courseNote.id, noteContent);
    } else {
      addNoteComment({
        courseId: course.id,
        contentMarkdown: noteContent,
        type: "SUMMARY_NOTE",
      });
    }
    setIsSavedNote(true);
    toast.success("Catatan perkuliahan berhasil disimpan! ✍️");
    setTimeout(() => setIsSavedNote(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Course Pastel Theme */}
      <div
        className="rounded-3xl p-6 sm:p-8 border shadow-soft relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${course.pastelColorHex} 0%, #FFFFFF 85%)`,
          borderColor: course.pastelColorHex,
        }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-bold px-3 py-1 rounded-xl shadow-xs"
                style={{
                  backgroundColor: course.pastelColorHex,
                  color: course.pastelTextHex,
                }}
              >
                {course.code}
              </span>
              <span className="text-xs font-semibold text-slate-700 bg-white/80 px-2.5 py-1 rounded-xl shadow-xs">
                {course.credits} SKS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {course.name}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-2 flex-wrap">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {course.lecturerName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {course.scheduleDay}, {course.scheduleTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {course.roomOrLink}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewMaterialOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-[#FFFDFB] dark:bg-[#1E140E] text-[#2A1810] dark:text-[#FAF5EE] text-xs font-bold hover:bg-[#F4ECE3] dark:hover:bg-[#281B13] shadow-xs border border-[#DECFC0] dark:border-[#38261B] flex items-center gap-1.5 btn-tactile cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#D4A373]" />
              <span>Upload Materi</span>
            </button>
            <button
              onClick={() => setIsNewAssignmentOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#2B1810] via-[#3A2216] to-[#25150E] text-[#FAF5EE] hover:opacity-95 text-xs font-bold shadow-xs flex items-center gap-1.5 btn-tactile cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#E8CBAE]" />
              <span>+ Tugas Baru</span>
              <SparkleStar size={9} color="#F7D89C" className="glitter-star" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Tabs Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#E3D6C9] dark:border-[#38261B] pb-1 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab("MATERIALS")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === "MATERIALS"
              ? "bg-gradient-to-r from-[#2B1810] via-[#382216] to-[#25150E] text-[#FAF5EE] shadow-xs font-bold border border-[#4F301F]"
              : "text-[#7A5F4E] dark:text-[#CBB5A3] hover:text-[#2A1810] dark:hover:text-[#FAF5EE] hover:bg-[#EFE5DA]/70 dark:hover:bg-[#20150E]"
          }`}
        >
          <FileText className="w-4 h-4 text-[#D4A373]" />
          <span>Materi per Pertemuan ({courseMaterials.length})</span>
          {activeTab === "MATERIALS" && (
            <SparkleStar size={8} color="#F7D89C" className="glitter-star" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("ASSIGNMENTS")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === "ASSIGNMENTS"
              ? "bg-gradient-to-r from-[#2B1810] via-[#382216] to-[#25150E] text-[#FAF5EE] shadow-xs font-bold border border-[#4F301F]"
              : "text-[#7A5F4E] dark:text-[#CBB5A3] hover:text-[#2A1810] dark:hover:text-[#FAF5EE] hover:bg-[#EFE5DA]/70 dark:hover:bg-[#20150E]"
          }`}
        >
          <CheckSquare className="w-4 h-4 text-[#D4A373]" />
          <span>Daftar Tugas & Kuis ({courseAssignments.length})</span>
          {activeTab === "ASSIGNMENTS" && (
            <SparkleStar size={8} color="#F7D89C" className="glitter-star" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("NOTES")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === "NOTES"
              ? "bg-gradient-to-r from-[#2B1810] via-[#382216] to-[#25150E] text-[#FAF5EE] shadow-xs font-bold border border-[#4F301F]"
              : "text-[#7A5F4E] dark:text-[#CBB5A3] hover:text-[#2A1810] dark:hover:text-[#FAF5EE] hover:bg-[#EFE5DA]/70 dark:hover:bg-[#20150E]"
          }`}
        >
          <Edit className="w-4 h-4 text-[#D4A373]" />
          <span>Catatan Kuliah Markdown</span>
          {activeTab === "NOTES" && (
            <SparkleStar size={8} color="#F7D89C" className="glitter-star" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("GRADES")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === "GRADES"
              ? "bg-gradient-to-r from-[#2B1810] via-[#382216] to-[#25150E] text-[#FAF5EE] shadow-xs font-bold border border-[#4F301F]"
              : "text-[#7A5F4E] dark:text-[#CBB5A3] hover:text-[#2A1810] dark:hover:text-[#FAF5EE] hover:bg-[#EFE5DA]/70 dark:hover:bg-[#20150E]"
          }`}
        >
          <Award className="w-4 h-4 text-[#D4A373]" />
          <span>Rekap Nilai ({gradeCalc.letter})</span>
          {activeTab === "GRADES" && (
            <SparkleStar size={8} color="#F7D89C" className="glitter-star" />
          )}
        </button>
      </div>

      {/* Tab 1: Materials per Week (1 to 16) */}
      {activeTab === "MATERIALS" && (
        <div className="space-y-3">
          {Array.from({ length: 16 }, (_, i) => i + 1).map((week) => {
            const weekMaterials = courseMaterials.filter(
              (m) => m.weekNumber === week
            );
            const isExpanded = expandedWeeks[week] ?? (week <= 8);
            const isUts = week === 8;
            const isUas = week === 16;

            return (
              <div
                key={week}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
              >
                <div
                  onClick={() => toggleWeek(week)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                        isUts
                          ? "bg-[#FCE7F3] text-[#9D174D]"
                          : isUas
                          ? "bg-[#EDE9FE] text-[#5B21B6]"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      Minggu {week} {isUts ? "(UTS)" : isUas ? "(UAS)" : ""}
                    </span>
                    <span className="text-xs text-slate-500">
                      {weekMaterials.length} materi tersimpan
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Week Materials List */}
                {isExpanded && (
                  <div className="p-4 pt-0 space-y-2 border-t border-slate-100 dark:border-slate-800">
                    {weekMaterials.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        Belum ada berkas materi untuk pertemuan ini.
                      </p>
                    ) : (
                      weekMaterials.map((mat) => (
                        <div
                          key={mat.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#E3D6C9] dark:border-[#38261B] hover:border-[#DECFC0] transition-all gap-2"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#3D2517] to-[#25150E] text-[#E8CBAE] border border-[#523321] font-bold text-xs flex-shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#2A1810] dark:text-[#FAF5EE] truncate">
                                {mat.title}
                              </p>
                              <p className="text-[11px] text-[#7A5F4E] dark:text-[#CBB5A3] truncate">
                                {mat.description}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                {mat.tags.map((t) => (
                                  <span
                                    key={t.id}
                                    className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                                    style={{
                                      backgroundColor: t.bgHex,
                                      color: t.textHex,
                                    }}
                                  >
                                    {t.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                            <button
                              onClick={() => setSelectedMaterialId(mat.id)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF6F0] dark:bg-[#281B13] text-[#2A1810] dark:text-[#FAF5EE] border border-[#DECFC0] dark:border-[#38261B] shadow-xs hover:bg-[#F4ECE3] cursor-pointer"
                            >
                              Pratinjau
                            </button>
                            <Link
                              href={`/materials/${mat.id}`}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EFE5DA] text-[#3D2316] dark:bg-[#281B13] dark:text-[#E8CBAE] hover:bg-[#E2D5C7] border border-[#DFCFC1] dark:border-[#422C1F] shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <span>Workspace</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Apakah Anda yakin ingin menghapus materi "${mat.title}"?`)) {
                                  deleteMaterial(mat.id);
                                  toast.success(`Materi "${mat.title}" berhasil dihapus! 🗑️`);
                                }
                              }}
                              className="p-1.5 rounded-xl text-[#947866] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Hapus Materi"
                              aria-label={`Hapus materi ${mat.title}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Assignments List */}
      {activeTab === "ASSIGNMENTS" && (
        <div className="space-y-3">
          {courseAssignments.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs italic">
                Belum ada tugas yang dibuat untuk mata kuliah ini.
              </p>
            </div>
          ) : (
            courseAssignments.map((a) => {
              const urg = getAssignmentUrgency(a);
              const st = STATUS_CONFIG[a.status];

              return (
                <div
                  key={a.id}
                  onClick={() => setSelectedAssignmentId(a.id)}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all"
                  style={{
                    borderLeftWidth: "6px",
                    borderLeftColor: course.pastelTextHex,
                  }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Minggu {a.weekNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        Bobot: {a.weightPercentage}%
                      </span>
                      {a.score !== undefined && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#D1FAE5] text-[#065F46]">
                          Nilai: {a.score} ({a.gradeLetter})
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {a.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {a.instructions}
                    </p>
                    {a.attachmentUrl && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-200/80 dark:border-indigo-800/60">
                          <Paperclip className="w-3 h-3" />
                          <span className="truncate max-w-[200px]">{a.attachmentName || "Lampiran Berkas"}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-semibold border"
                      style={{
                        backgroundColor: urg.bgHex,
                        color: urg.textHex,
                        borderColor: urg.borderHex,
                      }}
                    >
                      {urg.label}
                    </span>
                    <span
                      className="text-xs px-2.5 py-1 rounded-xl font-medium border"
                      style={{
                        backgroundColor: st.bgHex,
                        color: st.textHex,
                        borderColor: st.borderHex,
                      }}
                    >
                      {st.icon} {st.label}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Apakah Anda yakin ingin menghapus tugas "${a.title}"?`)) {
                          deleteAssignment(a.id);
                          toast.success(`Tugas "${a.title}" berhasil dihapus! 🗑️`);
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Hapus Tugas Ini"
                      aria-label={`Hapus tugas ${a.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Markdown Course Notes Editor */}
      {activeTab === "NOTES" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Catatan Rangkuman & Refleksi Mandiri
              </h3>
              <p className="text-xs text-slate-500">
                Mendukung sintaks Markdown, Callout Pastel, dan snippet kode
              </p>
            </div>
            <button
              onClick={handleSaveNotes}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#2B1810] via-[#3A2216] to-[#25150E] text-[#FAF5EE] text-xs font-bold hover:opacity-95 shadow-sm cursor-pointer"
            >
              {isSavedNote ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#E8CBAE]" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-[#E8CBAE]" />
                  <span>Simpan Catatan</span>
                  <SparkleStar size={8} color="#F7D89C" className="glitter-star" />
                </>
              )}
            </button>
          </div>

          <div className="h-[480px]">
            <MarkdownEditor
              content={noteContent}
              onChange={(val) => setNoteContent(val)}
            />
          </div>
        </div>
      )}

      {/* Tab 4: Grading Recap (FR-15) */}
      {activeTab === "GRADES" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#FFFDFB] dark:bg-[#1E140E] text-[#2A1810] dark:text-[#FAF5EE] border border-[#E3D6C9] dark:border-[#38261B] shadow-xs">
              <span className="text-xs font-bold uppercase text-[#7A5F4E] dark:text-[#CBB5A3]">
                Estimasi Rata-rata Berjalan
              </span>
              <p className="text-3xl font-extrabold mt-2 text-[#2B1810] dark:text-[#FAF5EE]">
                {gradeCalc.weightedAverage > 0 ? gradeCalc.weightedAverage : "-"}
              </p>
              <p className="text-[11px] mt-1 text-[#8C7362] dark:text-[#A89484]">
                Berdasarkan {courseAssignments.length} komponen tugas
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFDFB] dark:bg-[#1E140E] text-[#2A1810] dark:text-[#FAF5EE] border border-[#E3D6C9] dark:border-[#38261B] shadow-xs">
              <span className="text-xs font-bold uppercase text-[#7A5F4E] dark:text-[#CBB5A3]">
                Indeks Nilai Huruf
              </span>
              <p className="text-3xl font-extrabold mt-2 text-[#8B5A2B] dark:text-[#D4A373]">
                {gradeCalc.letter}
              </p>
              <p className="text-[11px] mt-1 text-[#8C7362] dark:text-[#A89484]">
                Skala 4.0 (A: 4.0, B: 3.0, C: 2.0)
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFDFB] dark:bg-[#1E140E] text-[#2A1810] dark:text-[#FAF5EE] border border-[#E3D6C9] dark:border-[#38261B] shadow-xs">
              <span className="text-xs font-bold uppercase text-[#7A5F4E] dark:text-[#CBB5A3]">
                Total Bobot Tercakup
              </span>
              <p className="text-3xl font-extrabold mt-2 text-[#2B1810] dark:text-[#FAF5EE]">
                {gradeCalc.totalWeight}%
              </p>
              <p className="text-[11px] mt-1 text-[#8C7362] dark:text-[#A89484]">
                dari 100% total semester
              </p>
            </div>
          </div>

          {/* Table of assignments and scores */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FDFBF7] dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 pl-5">Komponen Tugas</th>
                  <th className="p-3.5">Bobot</th>
                  <th className="p-3.5">Skor (0-100)</th>
                  <th className="p-3.5">Huruf</th>
                  <th className="p-3.5 pr-5">Feedback Dosen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {courseAssignments.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedAssignmentId(a.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  >
                    <td className="p-3.5 pl-5 font-semibold text-slate-800 dark:text-slate-100">
                      {a.title}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {a.weightPercentage}%
                    </td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-100">
                      {a.score !== undefined ? a.score : "-"}
                    </td>
                    <td className="p-3.5">
                      {a.gradeLetter ? (
                        <span
                          className="px-2 py-0.5 rounded-md font-bold"
                          style={{
                            backgroundColor:
                              GRADE_CONFIG[a.gradeLetter]?.bgHex || "#D1FAE5",
                            color:
                              GRADE_CONFIG[a.gradeLetter]?.textHex || "#065F46",
                          }}
                        >
                          {a.gradeLetter}
                        </span>
                      ) : (
                        <span className="text-slate-400">Belum dinilai</span>
                      )}
                    </td>
                    <td className="p-3.5 pr-5 text-slate-500 italic max-w-xs truncate">
                      {a.lecturerFeedback || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AssignmentModal
        assignmentId={selectedAssignmentId}
        onClose={() => setSelectedAssignmentId(null)}
      />

      <MaterialPreviewModal
        materialId={selectedMaterialId}
        onClose={() => setSelectedMaterialId(null)}
      />

      <NewAssignmentModal
        isOpen={isNewAssignmentOpen}
        onClose={() => setIsNewAssignmentOpen(false)}
        defaultCourseId={course.id}
      />

      <NewMaterialModal
        isOpen={isNewMaterialOpen}
        onClose={() => setIsNewMaterialOpen(false)}
        defaultCourseId={course.id}
      />
    </div>
  );
}
