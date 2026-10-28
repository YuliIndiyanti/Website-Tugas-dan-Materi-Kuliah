"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useVault } from "@/context/VaultContext";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import {
  FileText,
  ExternalLink,
  Share2,
  Check,
  ChevronLeft,
  Columns,
  MessageSquare,
  Sparkles,
  Save,
  BookOpen,
  Download,
  Film,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function MaterialWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const materialId = unwrappedParams.id;

  const {
    materials,
    courses,
    notes,
    addNoteComment,
    updateNoteComment,
    toggleShareNote,
  } = useVault();

  const material = materials.find((m) => m.id === materialId);
  const course = courses.find((c) => c.id === material?.courseId);

  // Existing note for this material
  const materialNote = notes.find((n) => n.materialId === materialId);
  const [markdownContent, setMarkdownContent] = useState(
    materialNote?.contentMarkdown ||
      `### 📌 Rangkuman Catatan: ${material?.title || "Materi"}\n\n> [!NOTE]\nTuliskan poin penting dari slide di samping agar mudah diulas saat UTS.\n\n- Konsep 1:\n- Konsep 2:\n`
  );

  const [activeRightTab, setActiveRightTab] = useState<"NOTES" | "COMMENTS">("NOTES");
  const [newComment, setNewComment] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  if (!material) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Materi tidak ditemukan.</p>
        <Link
          href="/materials"
          className="text-xs font-semibold text-indigo-600 hover:underline mt-2 inline-block"
        >
          Kembali ke Materi
        </Link>
      </div>
    );
  }

  const materialComments = notes.filter(
    (n) => n.materialId === material.id && n.type === "COMMENT_LOG"
  );

  const handleSaveNote = () => {
    if (materialNote) {
      updateNoteComment(materialNote.id, markdownContent);
    } else {
      addNoteComment({
        materialId: material.id,
        courseId: material.courseId,
        contentMarkdown: markdownContent,
        type: "SUMMARY_NOTE",
      });
    }
    setIsSaved(true);
    toast.success("Catatan materi berhasil disimpan! 💾");
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addNoteComment({
      materialId: material.id,
      contentMarkdown: newComment.trim(),
      type: "COMMENT_LOG",
    });
    toast.success("Komentar berhasil ditambahkan!");
    setNewComment("");
  };

  const handleShareLink = () => {
    let noteId = materialNote?.id;
    if (!noteId) {
      const created = addNoteComment({
        materialId: material.id,
        courseId: material.courseId,
        contentMarkdown: markdownContent,
        type: "SUMMARY_NOTE",
        isShared: true,
      });
      noteId = created.id;
    }
    const token = toggleShareNote(noteId);
    const link = `${window.location.origin}/shared/${token || "share-token-kv"}`;
    navigator.clipboard.writeText(link);
    setShareUrl(link);
    toast.success("Tautan catatan publik berhasil disalin ke clipboard! 🔗");
    setTimeout(() => setShareUrl(null), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/materials"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] px-2 py-0.5 rounded-md font-bold"
                style={{
                  backgroundColor: course?.pastelColorHex || "#DBEAFE",
                  color: course?.pastelTextHex || "#1E3A8A",
                }}
              >
                {course?.code}
              </span>
              <span className="text-xs text-slate-400">
                Minggu {material.weekNumber}
              </span>
            </div>
            <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">
              {material.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Share Button (FR-18) */}
          <button
            onClick={handleShareLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
            title="Buat Tautan Bagikan Baca-Saja"
          >
            {shareUrl ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span>{shareUrl ? "Tautan Tersalin!" : "Bagikan Catatan"}</span>
          </button>

          {/* Save Note Button */}
          <button
            onClick={handleSaveNote}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#2B1810] via-[#3A2216] to-[#25150E] text-[#FAF5EE] text-xs font-semibold hover:opacity-95 shadow-xs cursor-pointer"
          >
            {isSaved ? (
              <Check className="w-3.5 h-3.5 text-[#E8CBAE]" />
            ) : (
              <Save className="w-3.5 h-3.5 text-[#E8CBAE]" />
            )}
            <span>{isSaved ? "Tersimpan" : "Simpan Catatan"}</span>
          </button>
        </div>
      </div>

      {/* Share feedback toast */}
      {shareUrl && (
        <div className="p-3 rounded-2xl bg-[#F8F2EA] dark:bg-[#20150E] text-[#3D2417] dark:text-[#E8CBAE] border border-[#DECFC0] dark:border-[#38261B] text-xs font-medium flex items-center justify-between">
          <span>
            🎉 Tautan baca-saja siap dibagikan ke teman sekelas: <b>{shareUrl}</b>
          </span>
          <span className="text-[10px] bg-white dark:bg-[#2D1B11] px-2 py-0.5 rounded-md border border-[#DECFC0] dark:border-[#422919]">
            Read-Only Token
          </span>
        </div>
      )}

      {/* SPLIT-VIEW WORKSPACE (Desktop: Left preview, Right markdown notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-12rem)] min-h-[550px]">
        {/* Left Side: Document / Slide Reader (6 or 7 cols) */}
        <div className="lg:col-span-6 xl:col-span-7 rounded-3xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#E3D6C9] dark:border-[#38261B] shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#EBE0D5] dark:border-[#38261B] bg-[#FAF6F0] dark:bg-[#251810] flex items-center justify-between text-xs">
            <span className="font-bold text-[#2A1810] dark:text-[#FAF5EE] flex items-center gap-2 truncate pr-2">
              <FileText className="w-4 h-4 text-[#8B5A2B] dark:text-[#D4A373] flex-shrink-0" />
              <span className="truncate">{material.fileName || material.title}</span>
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              {material.fileUrl && (
                <a
                  href={material.fileUrl}
                  download={material.fileName || material.title}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </a>
              )}
              <span className="text-[11px] text-slate-400">
                {material.fileSize || "Berkas"}
              </span>
            </div>
          </div>

          {material.fileUrl && (material.fileUrl.toLowerCase().endsWith(".pdf") || material.fileName?.toLowerCase().endsWith(".pdf") || material.fileUrl.startsWith("blob:")) ? (
            <div className="flex-1 flex flex-col p-4 bg-slate-100/50 dark:bg-slate-950/40 min-h-0">
              <iframe
                src={`${material.fileUrl}#toolbar=1`}
                title={material.title}
                className="w-full flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner bg-white min-h-[440px]"
              />
            </div>
          ) : material.fileUrl && material.fileUrl.match(/\.(mp4|webm|mov|mkv)$/i) ? (
            <div className="flex-1 p-6 bg-slate-950 flex flex-col items-center justify-center">
              <video
                controls
                src={material.fileUrl}
                className="w-full max-h-[480px] rounded-2xl shadow-lg bg-black"
              />
            </div>
          ) : material.fileUrl && material.fileUrl.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i) ? (
            <div className="flex-1 p-6 bg-slate-100/50 dark:bg-slate-950/40 flex flex-col items-center justify-center overflow-auto">
              <img
                src={material.fileUrl}
                alt={material.title}
                className="max-h-[460px] rounded-2xl shadow-md object-contain border border-slate-200 dark:border-slate-800"
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50 dark:bg-slate-950/40 space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {material.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {material.description}
                </p>

                <div className="p-4 rounded-xl bg-[#E0E7FF]/60 dark:bg-indigo-950/40 text-xs text-[#3730A3] dark:text-indigo-200 border border-indigo-200/80 space-y-1">
                  <p className="font-bold">Topik Bahasan Utama Pertemuan Ini:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Diagram Arsitektur & Prinsip Desain Berorientasi Objek</li>
                    <li>Metodologi Refactoring & Pola Desain (Design Patterns)</li>
                    <li>Koneksi API & Skema Basis Data Relasional</li>
                  </ul>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  {material.tags.map((t) => (
                    <span
                      key={t.id}
                      className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: t.bgHex, color: t.textHex }}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              {material.fileUrl && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <a
                    href={material.fileUrl}
                    download={material.fileName || material.title}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Berkas Terlampir ({material.fileSize})</span>
                  </a>
                </div>
              )}

              {material.externalUrl && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <a
                    href={material.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buka Berkas Asli di Sumber Eksternal</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Markdown Editor & Comment Thread (6 or 5 cols) */}
        <div className="lg:col-span-6 xl:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-[#FDFBF7] dark:bg-slate-900 px-4 text-xs font-semibold">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveRightTab("NOTES")}
                className={`py-3 border-b-2 transition-all ${
                  activeRightTab === "NOTES"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "border-transparent text-slate-500"
                }`}
              >
                Catatan Markdown
              </button>
              <button
                onClick={() => setActiveRightTab("COMMENTS")}
                className={`py-3 border-b-2 transition-all flex items-center gap-1 ${
                  activeRightTab === "COMMENTS"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "border-transparent text-slate-500"
                }`}
              >
                <span>Log Diskusi</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600">
                  {materialComments.length}
                </span>
              </button>
            </div>

            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] font-semibold">
              Auto-Save Aktif
            </span>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-3 overflow-hidden flex flex-col">
            {activeRightTab === "NOTES" ? (
              <MarkdownEditor
                content={markdownContent}
                onChange={(val) => setMarkdownContent(val)}
                placeholder="Catat hal penting sambil membaca slide di sebelah kiri..."
              />
            ) : (
              /* COMMENTS & ACTIVITY LOG */
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-2.5 p-2">
                  {materialComments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-8">
                      Belum ada catatan diskusi atau pertanyaan untuk materi ini.
                    </p>
                  ) : (
                    materialComments.map((com) => (
                      <div
                        key={com.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs"
                      >
                        <p className="text-slate-800 dark:text-slate-200">
                          {com.contentMarkdown}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {formatDate(com.createdAt)}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tulis pertanyaan atau log pemikiran..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-xs"
                  >
                    Kirim
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
