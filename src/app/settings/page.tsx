"use client";

import React, { useState } from "react";
import { useVault } from "@/context/VaultContext";
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Shield,
  FileSpreadsheet,
  Check,
  AlertTriangle,
  Smartphone,
} from "lucide-react";

export default function SettingsPage() {
  const {
    exportDataJSON,
    importDataJSON,
    resetToDefault,
    activeSemester,
    activeCourses,
    activeAssignments,
    activeMaterials,
  } = useVault();

  const [importText, setImportText] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<{
    text: string;
    isError?: boolean;
  } | null>(null);

  const handleDownloadJSON = () => {
    const data = exportDataJSON();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kuliahvault-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setFeedbackMsg({ text: "✅ Backup JSON berhasil diunduh ke laptop Anda!" });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleDownloadCSV = () => {
    // Generate CSV for assignments
    const headers = "ID,MataKuliah,Judul,Deadline,Status,Bobot,Skor,Huruf\n";
    const rows = activeAssignments
      .map((a) => {
        const c = activeCourses.find((course) => course.id === a.courseId);
        return `"${a.id}","${c?.name || ""}","${a.title}","${a.dueDate}","${a.status}",${a.weightPercentage},${a.score || ""},"${a.gradeLetter || ""}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kuliahvault-assignments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setFeedbackMsg({ text: "✅ Rekap tugas format CSV berhasil diekspor!" });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = importDataJSON(importText.trim());
    if (ok) {
      setFeedbackMsg({ text: "✅ Data KuliahVault berhasil dipulihkan dari file backup!" });
      setImportText("");
    } else {
      setFeedbackMsg({
        text: "❌ Format JSON tidak valid atau struktur file tidak cocok.",
        isError: true,
      });
    }
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleReset = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin mengatur ulang data ke kondisi bawaan (seed data awal)?"
      )
    ) {
      resetToDefault();
      setFeedbackMsg({ text: "🌸 Data KuliahVault berhasil di-reset ke data bawaan!" });
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl">⚙️</span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            Pengaturan & Cadangan Data (Backup)
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Simpan cadangan offline berkala dan kelola preferensi privasi akun tunggal Anda
        </p>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            feedbackMsg.isError
              ? "bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]"
              : "bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]"
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      {/* Backup & Export Section (PRD Section 9.3) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Download className="w-4 h-4 text-indigo-500" />
          <span>Ekspor Cadangan Data Lokal (JSON & CSV)</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Seluruh data semester, mata kuliah, metadata materi, tugas, dan catatan tersimpan di browser Anda. Unduh salinan cadangan kapan saja agar data Anda selalu aman.
        </p>

        <div className="flex items-center gap-3 flex-wrap pt-2">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E0E7FF] text-[#3730A3] dark:bg-[#312E81] dark:text-[#E0E7FF] text-xs font-bold hover:bg-indigo-200 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Cadangan Lengkap (JSON)</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#D1FAE5] text-[#065F46] dark:bg-[#064E3B] dark:text-[#D1FAE5] text-xs font-bold hover:bg-emerald-200 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Rekap Tugas (CSV / Excel)</span>
          </button>
        </div>
      </div>

      {/* Restore Data Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Upload className="w-4 h-4 text-indigo-500" />
          <span>Pulihkan Cadangan (Restore JSON)</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Tempel isi file cadangan JSON yang sebelumnya telah Anda unduh untuk memulihkan seluruh struktur data.
        </p>

        <textarea
          rows={3}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder='Tempel konten JSON cadangan di sini (misal: {"semesters": [...], "courses": [...]})'
          className="w-full text-xs font-mono p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
        />

        <button
          onClick={handleImport}
          className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs"
        >
          Terapkan Pemulihan Data
        </button>
      </div>

      {/* Single-User Profile & Security Specification (PRD Section 2 & 9.1) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Profil & Spesifikasi Single-User Pribadi
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Aplikasi berjalan dalam mode Pengguna Tunggal (*Single-User Whitelist*) berkecepatan tinggi tanpa otorisasi bertingkat yang memperlambat alur kerja harian.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Peran Akun
            </span>
            <p className="font-bold text-slate-800 dark:text-slate-100 mt-1">
              🧑‍🎓 Mahasiswa (Pemilik Vault Tunggal)
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Kapasitas Free-Tier
            </span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              🌱 100% Gratis Selamanya (Rp 0/bulan)
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset to Default */}
      <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 shadow-soft space-y-3">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
          <AlertTriangle className="w-4 h-4" />
          <h3 className="text-sm font-bold">Zona Bahaya (Reset Data)</h3>
        </div>
        <p className="text-xs text-rose-600/80 dark:text-rose-300 leading-relaxed">
          Kembalikan data ke contoh awal Semester Ganjil 2026/2027 beserta seluruh materi dan tugas percontohan.
        </p>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset ke Data Bawaan</span>
        </button>
      </div>
    </div>
  );
}
