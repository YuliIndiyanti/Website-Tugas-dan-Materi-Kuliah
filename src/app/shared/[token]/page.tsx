"use client";

import React, { use } from "react";
import Link from "next/link";
import { useVault } from "@/context/VaultContext";
import {
  Share2,
  FileText,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function SharedViewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const unwrappedParams = use(params);
  const token = unwrappedParams.token;

  const { notes, materials, courses } = useVault();

  // Find note by shareToken or fallback to first shared note
  const note =
    notes.find((n) => n.shareToken === token || n.isShared) || notes[0];
  const material = materials.find((m) => m.id === note?.materialId);
  const course = courses.find((c) => c.id === (material?.courseId || note?.courseId));

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Read-only notification pill */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EFE5DA] text-[#3D2417] dark:bg-[#20150E] dark:text-[#E8CBAE] border border-[#DECFC0] dark:border-[#38261B] text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8B5A2B] dark:text-[#D4A373]" />
          <span>
            <b>Tautan Baca-Saja (Read-Only Share):</b> Dokumen ini dibagikan melalui Yuli&apos;s Vault
          </span>
        </div>
        <Link
          href="/"
          className="text-[#8B5A2B] dark:text-[#D4A373] font-bold hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Buka Vault</span>
        </Link>
      </div>

      {/* Main Shared Document Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-soft space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs px-2.5 py-0.5 rounded-md font-bold"
              style={{
                backgroundColor: course?.pastelColorHex || "#DBEAFE",
                color: course?.pastelTextHex || "#1E3A8A",
              }}
            >
              {course?.code || "MK"}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {course?.name}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {material?.title || "Catatan Rangkuman Akademik"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Terakhir diperbarui: {formatDate(note?.updatedAt || new Date().toISOString())}
          </p>
        </div>

        {/* Note Content Render */}
        <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed space-y-3 whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-200">
          {note?.contentMarkdown}
        </div>
      </div>
    </div>
  );
}
