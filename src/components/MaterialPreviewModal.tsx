"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useVault } from "@/context/VaultContext";
import {
  X,
  FileText,
  Download,
  ExternalLink,
  BookOpen,
  Film,
  Music,
  Columns,
  Share2,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface MaterialPreviewModalProps {
  materialId: string | null;
  onClose: () => void;
}

export const MaterialPreviewModal: React.FC<MaterialPreviewModalProps> = ({
  materialId,
  onClose,
}) => {
  const { materials, courses } = useVault();
  const [copied, setCopied] = useState(false);

  if (!materialId) return null;
  const material = materials.find((m) => m.id === materialId);
  if (!material) return null;

  const course = courses.find((c) => c.id === material.courseId);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/materials/${material.id}`
    );
    setCopied(true);
    toast.success("Tautan materi berhasil disalin ke clipboard! 📋");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="material-preview-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-[#FDFBF7] dark:bg-slate-900">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs flex-shrink-0"
              style={{
                backgroundColor: course?.pastelColorHex || "#DBEAFE",
                color: course?.pastelTextHex || "#1E3A8A",
              }}
            >
              {course?.code || "MK"}
            </div>
            <div className="min-w-0">
              <h3 id="material-preview-modal-title" className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate break-anywhere">
                {material.title}
              </h3>
              <p className="text-xs text-slate-500">
                {course?.name} • Minggu {material.weekNumber} •{" "}
                {material.fileSize || "Tautan"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Open in Split-view Workspace */}
            <Link
              href={`/materials/${material.id}`}
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#E0E7FF] text-[#3730A3] hover:bg-indigo-200 border border-indigo-200 shadow-xs"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Workspace Catatan</span>
            </Link>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              title="Salin Tautan Materi"
              aria-label="Salin Tautan Materi"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onClose}
              aria-label="Tutup modal pratinjau materi"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tags bar */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400">Tag:</span>
          {material.tags.map((t) => (
            <span
              key={t.id}
              className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: t.bgHex, color: t.textHex }}
            >
              {t.name}
            </span>
          ))}
          {material.externalUrl && (
            <a
              href={material.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 ml-auto"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Kunjungi Tautan Asli</span>
            </a>
          )}
        </div>

        {/* Preview Area (Simulated Interactive PDF / Media Reader) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/60 dark:bg-slate-950/60 flex flex-col items-center justify-center min-h-[420px]">
          {material.category === "RECORDING" ? (
            <div className="w-full max-w-xl aspect-video rounded-2xl bg-black flex flex-col items-center justify-center text-white p-6 shadow-lg">
              <Film className="w-12 h-12 text-purple-400 mb-3" />
              <p className="text-sm font-semibold text-center">
                {material.fileName || material.title}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                In-App Media Player • Video Kuliah
              </p>
              {material.externalUrl && (
                <a
                  href={material.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Video di Tab Baru</span>
                </a>
              )}
            </div>
          ) : material.category === "LINK" ? (
            <div className="w-full max-w-lg p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-lg">
              <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-[#FCE7F3] text-[#9D174D] mb-4">
                <ExternalLink className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Tautan Referensi Eksternal
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                {material.description}
              </p>
              <a
                href={material.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#3730A3] text-white text-xs font-semibold hover:bg-indigo-800 shadow-md"
              >
                <span>Buka Referensi Sekarang</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            // PDF Document Reader Simulation with structured interactive pages
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-8 text-left space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span>Dokumen PDF: Halaman 1 dari 18</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  Mode Pratinjau Cepat
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {material.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Mata Kuliah: {course?.name} ({course?.code})
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FDFBF7] dark:bg-slate-800/60 border border-indigo-100/70 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <p className="font-semibold text-indigo-700 dark:text-indigo-400">
                  Ringkasan Eksekutif & Capaian Pembelajaran:
                </p>
                <p>{material.description}</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pt-1">
                  <li>Konsep dasar dan pemetaan arsitektural.</li>
                  <li>Daftar studi kasus implementasi nyata di industri.</li>
                  <li>Keterkaitan materi dengan tugas project semester.</li>
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Ukuran Berkas: {material.fileSize || "4.8 MB"}</span>
                <Link
                  href={`/materials/${material.id}`}
                  onClick={onClose}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Buka Workspace Catatan Lengkap</span>
                  <Columns className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
