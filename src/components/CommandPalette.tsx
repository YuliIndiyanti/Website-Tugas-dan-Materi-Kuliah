"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useVault } from "@/context/VaultContext";
import {
  Search,
  BookOpen,
  CheckSquare,
  FileText,
  Tag,
  ArrowRight,
  X,
  ExternalLink,
} from "lucide-react";
import { getAssignmentUrgency } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMaterialPreview: (materialId: string) => void;
  onOpenAssignmentDetail: (assignmentId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenMaterialPreview,
  onOpenAssignmentDetail,
}) => {
  const router = useRouter();
  const { courses, materials, assignments } = useVault();
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "MATERIAL" | "ASSIGNMENT" | "COURSE">("ALL");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search courses
  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.lecturerName.toLowerCase().includes(q)
  );

  // Search materials
  const filteredMaterials = materials.filter((m) => {
    const matchTitle = m.title.toLowerCase().includes(q);
    const matchDesc = m.description.toLowerCase().includes(q);
    const matchFile = m.fileName?.toLowerCase().includes(q);
    const matchTags = m.tags.some((t) => t.name.toLowerCase().includes(q));
    return matchTitle || matchDesc || matchFile || matchTags;
  });

  // Search assignments
  const filteredAssignments = assignments.filter((a) => {
    const matchTitle = a.title.toLowerCase().includes(q);
    const matchInstr = a.instructions.toLowerCase().includes(q);
    return matchTitle || matchInstr;
  });

  const getCourse = (courseId: string) => courses.find((c) => c.id === courseId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian Cepat Yuli's Vault"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-in fade-in"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#FDFBF7] dark:bg-slate-900">
          <Search className="w-5 h-5 text-[#6B5543] dark:text-[#D9C7B6] flex-shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            aria-label="Cari materi kuliah, tugas, dosen, atau tag"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari materi kuliah, tugas, dosen, atau tag (#bahan-uts)..."
            className="w-full text-sm font-medium bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Hapus kata kunci pencarian"
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 text-xs">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              filterType === "ALL"
                ? "bg-[#4A2E1B] text-white dark:bg-[#D9C7B6] dark:text-[#1C1512]"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType("MATERIAL")}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              filterType === "MATERIAL"
                ? "bg-[#EDE3D6] text-[#453120] dark:bg-[#382314] dark:text-[#EAE0D5]"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50"
            }`}
          >
            Materi ({filteredMaterials.length})
          </button>
          <button
            onClick={() => setFilterType("ASSIGNMENT")}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              filterType === "ASSIGNMENT"
                ? "bg-[#F6EDE0] text-[#5B3B18] dark:bg-[#281F19] dark:text-[#F6EDE0]"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50"
            }`}
          >
            Tugas ({filteredAssignments.length})
          </button>
          <button
            onClick={() => setFilterType("COURSE")}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              filterType === "COURSE"
                ? "bg-[#EAE0D5] text-[#382314] dark:bg-[#382314] dark:text-[#EAE0D5]"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50"
            }`}
          >
            Mata Kuliah ({filteredCourses.length})
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Materials Section */}
          {(filterType === "ALL" || filterType === "MATERIAL") &&
            filteredMaterials.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Materi & Dokumen ({filteredMaterials.length})
                </p>
                <div className="space-y-1.5">
                  {filteredMaterials.slice(0, 5).map((m) => {
                    const c = getCourse(m.courseId);
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          onClose();
                          onOpenMaterialPreview(m.id);
                        }}
                        className="group flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 hover:bg-[#F3EADF]/40 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#EDE3D6] text-[#453120] dark:bg-[#382314] dark:text-[#EAE0D5] flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#4A2E1B] dark:group-hover:text-[#D9C7B6]">
                              {m.title}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span>{c?.name || "Mata Kuliah"}</span>
                              <span>•</span>
                              <span>Minggu {m.weekNumber}</span>
                              {m.fileName && <span>• {m.fileName}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {m.tags.slice(0, 2).map((t) => (
                            <span
                              key={t.id}
                              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: t.bgHex, color: t.textHex }}
                            >
                              {t.name}
                            </span>
                          ))}
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Assignments Section */}
          {(filterType === "ALL" || filterType === "ASSIGNMENT") &&
            filteredAssignments.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Tugas & Deadline ({filteredAssignments.length})
                </p>
                <div className="space-y-1.5">
                  {filteredAssignments.slice(0, 5).map((a) => {
                    const c = getCourse(a.courseId);
                    const urg = getAssignmentUrgency(a);
                    return (
                      <div
                        key={a.id}
                        onClick={() => {
                          onClose();
                          onOpenAssignmentDetail(a.id);
                        }}
                        className="group flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 hover:bg-[#EDE3D6]/40 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#F6EDE0] text-[#5B3B18] dark:bg-[#382314] dark:text-[#EAE0D5] flex-shrink-0">
                            <CheckSquare className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#4A2E1B] dark:group-hover:text-[#D9C7B6]">
                              {a.title}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span>{c?.name}</span>
                              <span>•</span>
                              <span>Bobot {a.weightPercentage}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold border"
                            style={{
                              backgroundColor: urg.bgHex,
                              color: urg.textHex,
                              borderColor: urg.borderHex,
                            }}
                          >
                            {urg.label}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Courses Section */}
          {(filterType === "ALL" || filterType === "COURSE") &&
            filteredCourses.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Mata Kuliah ({filteredCourses.length})
                </p>
                <div className="space-y-1.5">
                  {filteredCourses.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onClose();
                        router.push(`/courses/${c.id}`);
                      }}
                      className="group flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 hover:bg-[#F3EADF]/40 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
                          style={{
                            backgroundColor: c.pastelColorHex,
                            color: c.pastelTextHex,
                          }}
                        >
                          {c.code.substring(0, 4)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {c.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {c.lecturerName} • {c.scheduleDay},{" "}
                            {c.scheduleTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {c.credits} SKS
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {filteredMaterials.length === 0 &&
            filteredAssignments.length === 0 &&
            filteredCourses.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">
                  Tidak ditemukan hasil untuk pencarian &quot;{query}&quot;
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
