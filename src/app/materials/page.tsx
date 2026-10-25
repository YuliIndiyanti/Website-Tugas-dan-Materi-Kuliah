"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useVault } from "@/context/VaultContext";
import { MaterialPreviewModal } from "@/components/MaterialPreviewModal";
import { NewMaterialModal } from "@/components/NewMaterialModal";
import {
  FolderArchive,
  Plus,
  Search,
  FileText,
  BookOpen,
  Film,
  Link as LinkIcon,
  Tag,
  ExternalLink,
  Columns,
  Sparkles,
  Trash2,
} from "lucide-react";
import { MaterialCategory } from "@/types";
import { toast } from "sonner";

export default function MaterialsPage() {
  const { activeMaterials, courses, deleteMaterial, deleteSeedMaterials } = useVault();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [tagFilter, setTagFilter] = useState<string>("ALL");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [isNewMaterialOpen, setIsNewMaterialOpen] = useState(false);

  const getCourse = (id: string) => courses.find((c) => c.id === id);

  // Filter materials
  const filtered = activeMaterials.filter((m) => {
    if (categoryFilter !== "ALL" && m.category !== categoryFilter) return false;
    if (tagFilter !== "ALL" && !m.tags.some((t) => t.id === tagFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchDesc = m.description.toLowerCase().includes(q);
      const matchFile = m.fileName?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchFile;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📂</span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
              Vault Penyimpanan Materi Kuliah
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Repositori terpusat untuk slide PDF, modul, e-book, rekaman, dan link referensi
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {activeMaterials.some((m) =>
            [
              "mat-adpl-w6",
              "mat-adpl-w7",
              "mat-db-w5",
              "mat-ai-w6",
              "mat-uiux-w5",
            ].includes(m.id)
          ) && (
            <button
              onClick={() => {
                if (
                  confirm(
                    "Hapus seluruh materi bawaan/contoh (seed data)?\n\nHanya berkas yang Anda upload sendiri yang akan tetap tersimpan di vault."
                  )
                ) {
                  deleteSeedMaterials();
                  toast.success("Seluruh materi bawaan contoh berhasil dihapus! 🧹");
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-900/60 transition-colors shadow-2xs btn-tactile"
              title="Bersihkan semua materi bawaan contoh"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Materi Bawaan</span>
            </button>
          )}

          <button
            onClick={() => setIsNewMaterialOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#3730A3] text-white text-xs font-semibold hover:bg-indigo-800 transition-colors shadow-sm btn-tactile"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload Materi Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul materi, nama file, atau topik..."
            className="w-full text-xs bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              categoryFilter === "ALL"
                ? "bg-[#E0E7FF] text-[#3730A3] dark:bg-[#312E81] dark:text-[#E0E7FF]"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Semua ({activeMaterials.length})
          </button>
          <button
            onClick={() => setCategoryFilter("SLIDE")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              categoryFilter === "SLIDE"
                ? "bg-[#DBEAFE] text-[#1E3A8A] dark:bg-[#1E3A8A]/40 dark:text-[#DBEAFE]"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            📕 Slide & Modul
          </button>
          <button
            onClick={() => setCategoryFilter("BOOK")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              categoryFilter === "BOOK"
                ? "bg-[#D1FAE5] text-[#065F46] dark:bg-[#064E3B] dark:text-[#D1FAE5]"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            📘 E-Book
          </button>
          <button
            onClick={() => setCategoryFilter("RECORDING")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              categoryFilter === "RECORDING"
                ? "bg-[#F3E8FF] text-[#6B21A8] dark:bg-[#6B21A8]/40 dark:text-[#F3E8FF]"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            🎬 Rekaman Kuliah
          </button>
          <button
            onClick={() => setCategoryFilter("LINK")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              categoryFilter === "LINK"
                ? "bg-[#FCE7F3] text-[#9D174D] dark:bg-[#831843] dark:text-[#FCE7F3]"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            🔗 Tautan Luar
          </button>
        </div>
      </div>

      {/* Grid of Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <FolderArchive className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-xs">Tidak ada materi yang sesuai filter.</p>
          </div>
        ) : (
          filtered.map((mat) => {
            const course = getCourse(mat.courseId);

            return (
              <div
                key={mat.id}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-soft hover:shadow-soft-hover transition-all flex flex-col justify-between group card-tactile"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-xl font-bold"
                      style={{
                        backgroundColor: course?.pastelColorHex || "#DBEAFE",
                        color: course?.pastelTextHex || "#1E3A8A",
                      }}
                    >
                      {course?.code} • W{mat.weekNumber}
                    </span>

                    <span className="text-[10px] font-medium text-slate-400">
                      {mat.fileSize || "Tautan"}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {mat.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    {mat.tags.map((t) => (
                      <span
                        key={t.id}
                        className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: t.bgHex, color: t.textHex }}
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedMaterialId(mat.id)}
                    className="flex-1 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs btn-tactile"
                  >
                    Pratinjau File
                  </button>
                  <Link
                    href={`/materials/${mat.id}`}
                    className="flex-1 py-2 rounded-xl bg-[#E0E7FF] text-[#3730A3] hover:bg-indigo-200 text-xs font-semibold flex items-center justify-center gap-1 shadow-xs btn-tactile"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Workspace</span>
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Apakah Anda yakin ingin menghapus materi "${mat.title}"?`)) {
                        deleteMaterial(mat.id);
                        toast.success(`Materi "${mat.title}" berhasil dihapus! 🗑️`);
                      }
                    }}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-xs transition-colors btn-tactile flex-shrink-0"
                    title="Hapus Materi"
                    aria-label={`Hapus materi ${mat.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <MaterialPreviewModal
        materialId={selectedMaterialId}
        onClose={() => setSelectedMaterialId(null)}
      />

      <NewMaterialModal
        isOpen={isNewMaterialOpen}
        onClose={() => setIsNewMaterialOpen(false)}
      />
    </div>
  );
}
