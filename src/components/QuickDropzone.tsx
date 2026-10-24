"use client";

import React, { useState, useRef } from "react";
import { useVault } from "@/context/VaultContext";
import {
  UploadCloud,
  FileText,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Film,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { MaterialCategory } from "@/types";

interface QuickDropzoneProps {
  onOpenMaterialPreview: (materialId: string) => void;
}

export const QuickDropzone: React.FC<QuickDropzoneProps> = ({
  onOpenMaterialPreview,
}) => {
  const { activeCourses, addMaterial, activeMaterials } = useVault();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    activeCourses[0]?.id || ""
  );
  const [selectedWeek, setSelectedWeek] = useState<number>(7);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const simulateUpload = (fileName: string, fileSize: string) => {
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            // Save material to vault
            const courseId = selectedCourseId || activeCourses[0]?.id || "";
            const isPdf = fileName.toLowerCase().endsWith(".pdf");
            const isVideo = fileName.toLowerCase().match(/\.(mp4|mov|mkv)$/);
            const isAudio = fileName.toLowerCase().match(/\.(mp3|wav|m4a)$/);

            let cat: MaterialCategory = "SLIDE";
            if (isVideo || isAudio) cat = "RECORDING";
            else if (fileName.toLowerCase().includes("book") || fileName.toLowerCase().includes("modul")) cat = "BOOK";

            addMaterial({
              courseId,
              weekNumber: Number(selectedWeek),
              title: fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
              description: `Diunggah melalui Quick Dropzone pada ${new Date().toLocaleDateString("id-ID")}`,
              category: cat,
              fileName,
              fileSize,
              fileUrl: `/sample-files/${fileName}`,
              mimeType: isPdf ? "application/pdf" : "application/octet-stream",
              tags: [
                { id: "baru", name: "#baru", bgHex: "#D1FAE5", textHex: "#065F46" },
                { id: "bahan-uts", name: "#bahan-uts", bgHex: "#FCE7F3", textHex: "#9D174D" },
              ],
            });
            setUploadProgress(null);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      simulateUpload(file.name, sizeMb);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      simulateUpload(file.name, sizeMb);
    }
  };

  // Recent 4 materials
  const recentMaterials = [...activeMaterials]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Quick Upload Dropzone Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Quick Upload Materi Vault</span>
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#F3E8FF] text-[#6B21A8] dark:bg-purple-950 dark:text-purple-300">
            Drag & Drop
          </span>
        </div>

        {/* Target course & week selector */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Mata Kuliah
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full text-xs font-medium px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
            >
              {activeCourses.length === 0 ? (
                <option value="">Belum ada mata kuliah</option>
              ) : (
                activeCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name.substring(0, 20)}...
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Pertemuan
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="w-full text-xs font-medium px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
            >
              {Array.from({ length: 16 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  Minggu {w} {w === 8 ? "(UTS)" : w === 16 ? "(UAS)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-purple-400 bg-purple-50/50 dark:bg-purple-950/20 scale-[1.01]"
              : "border-indigo-200 dark:border-slate-700 bg-[#FDFBF7] dark:bg-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-slate-800"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />
          <div className="w-10 h-10 rounded-2xl mx-auto flex items-center justify-center bg-[#E0E7FF] text-[#3730A3] dark:bg-indigo-950 dark:text-indigo-300 shadow-xs mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Tarik file slide/modul ke sini atau klik untuk browse
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
            Mendukung PDF, DOCX, PPTX, XLSX, MP4, MP3, PNG, ZIP
          </p>

          {/* Progress bar pastel indicator */}
          {uploadProgress !== null && (
            <div className="mt-3 pt-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                <span>Mengunggah file ke Vault...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-indigo-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recently Opened Materials */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Materi Terakhir Dibuka
          </h3>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline">
            Lihat Semua
          </span>
        </div>

        <div className="space-y-2">
          {recentMaterials.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-3 text-center">
              Belum ada riwayat materi di semester ini.
            </p>
          ) : (
            recentMaterials.map((mat) => {
              const course = activeCourses.find((c) => c.id === mat.courseId);
              return (
                <div
                  key={mat.id}
                  onClick={() => onOpenMaterialPreview(mat.id)}
                  className="group flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 hover:bg-purple-50/50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-[#F3E8FF] text-[#6B21A8] dark:bg-purple-950 dark:text-purple-300 flex-shrink-0 text-xs font-bold">
                      {mat.category === "SLIDE" ? (
                        <FileText className="w-3.5 h-3.5" />
                      ) : mat.category === "RECORDING" ? (
                        <Film className="w-3.5 h-3.5" />
                      ) : (
                        <BookOpen className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 break-anywhere">
                        {mat.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {course?.code || "MK"} • Minggu {mat.weekNumber}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-500 flex-shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
