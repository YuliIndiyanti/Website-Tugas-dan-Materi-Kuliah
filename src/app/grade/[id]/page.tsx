"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useVault } from "@/context/VaultContext";
import { AnimatedGirlAvatar } from "@/components/AnimatedGirlAvatar";
import { SparkleStar, GlitterField } from "@/components/GlitterEffects";
import {
  Award,
  CheckCircle2,
  Clock,
  FileText,
  Paperclip,
  Send,
  Sparkles,
  ArrowLeft,
  UserCheck,
  Check,
  ExternalLink,
} from "lucide-react";
import { formatDate, scoreToLetter } from "@/lib/utils";
import { GRADE_CONFIG } from "@/lib/constants";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export default function LecturerGradingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const assignmentId = unwrappedParams.id;

  const { assignments, courses, updateAssignmentGrade } = useVault();

  const assignment = assignments.find((a) => a.id === assignmentId);
  const course = courses.find((c) => c.id === assignment?.courseId);

  const [scoreInput, setScoreInput] = useState<number | "">(
    assignment?.score !== undefined ? assignment.score : ""
  );
  const [feedbackInput, setFeedbackInput] = useState<string>(
    assignment?.lecturerFeedback || ""
  );
  const [lecturerName, setLecturerName] = useState<string>("");
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if assignment loads asynchronously
  React.useEffect(() => {
    if (assignment) {
      if (assignment.score !== undefined && scoreInput === "") {
        setScoreInput(assignment.score);
      }
      if (assignment.lecturerFeedback && feedbackInput === "") {
        setFeedbackInput(assignment.lecturerFeedback);
      }
    }
  }, [assignment]);

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F7F2EB] dark:bg-[#150E0A] text-[#2A1810] dark:text-[#FAF5EE]">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#E3D6C9] dark:border-[#38261B] shadow-xl space-y-4">
          <AnimatedGirlAvatar size={64} className="mx-auto" />
          <h2 className="text-xl font-bold">Tugas Tidak Ditemukan</h2>
          <p className="text-xs text-[#7A5F4E] dark:text-[#CBB5A3]">
            Tautan penilaian mungkin sudah tidak berlaku atau ID tugas tidak terdaftar di sistem.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2A1810] text-[#FAF5EE] text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentScoreNumber = typeof scoreInput === "number" ? scoreInput : 0;
  const predictedLetter = scoreInput !== "" ? scoreToLetter(currentScoreNumber) : "-";
  const letterConfig = GRADE_CONFIG[predictedLetter === "-" ? "A" : predictedLetter];

  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (scoreInput === "" || isNaN(Number(scoreInput))) {
      toast.error("Harap masukkan skor angka yang valid (0 - 100)!");
      return;
    }

    const numScore = Math.min(100, Math.max(0, Number(scoreInput)));
    setIsSubmitting(true);

    const feedbackWithSignature = lecturerName.trim()
      ? `${feedbackInput.trim()} — Ditinjau oleh: ${lecturerName.trim()}`
      : feedbackInput.trim();

    setTimeout(() => {
      updateAssignmentGrade(assignment.id, numScore, feedbackWithSignature);
      setIsSubmitting(false);
      setIsSavedSuccess(true);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success("Nilai dan evaluasi berhasil disimpan ke Vault Mahasiswa! 🎯", {
        description: `Skor ${numScore} (${scoreToLetter(numScore)}) tersinkronisasi otomatis.`,
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F7F2EB] dark:bg-[#150E0A] text-[#2A1810] dark:text-[#FAF5EE] py-8 sm:py-12 px-4 relative overflow-hidden transition-colors selection:bg-[#E8D9C8]">
      {/* Background Glitter sparkles */}
      <GlitterField count={10} />

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-6 rounded-3xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#E3D6C9] dark:border-[#38261B] shadow-md">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <AnimatedGirlAvatar size={54} />
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Lembar Penilaian Dosen
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFE5DA] text-[#3D2316] dark:bg-[#2B180F] dark:text-[#E8CBAE] border border-[#DFCFC1] dark:border-[#422919]">
                  Yuli&apos;s Vault
                </span>
              </div>
              <p className="text-xs text-[#7A5F4E] dark:text-[#CBB5A3] mt-0.5">
                Portal evaluasi tugas akademik mandiri untuk Dosen Pengampu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#F6EDE0] dark:bg-[#281F19] border border-[#E6D4BD] dark:border-[#3D2F26] text-xs font-semibold text-[#5B3B18] dark:text-[#E8CBAE]">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#D4A373]" />
            <span>Akses Dosen Terverifikasi</span>
          </div>
        </div>

        {/* Student & Course Information Card */}
        <div className="p-6 rounded-3xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#E3D6C9] dark:border-[#38261B] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DC] dark:border-[#2D1F17] flex-wrap gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#947866] tracking-wider block">
                Data Mahasiswa
              </span>
              <p className="text-sm font-bold text-[#2A1810] dark:text-[#FAF5EE] mt-0.5">
                👩‍🎓 Yuli Indiyanti
              </p>
              <p className="text-xs text-[#7A5F4E] dark:text-[#CBB5A3]">
                NIM: <b>240511130</b> • Kelas: <b>TI24D</b> (Teknik Informatika)
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-[#947866] tracking-wider block">
                Mata Kuliah
              </span>
              <p className="text-xs font-bold text-[#8B5A2B] dark:text-[#D4A373] mt-0.5">
                {course?.code} - {course?.name}
              </p>
              <p className="text-[11px] text-[#7A5F4E] dark:text-[#CBB5A3]">
                Minggu ke-{assignment.weekNumber}
              </p>
            </div>
          </div>

          {/* Assignment Title & Instructions */}
          <div>
            <span className="text-[10px] uppercase font-bold text-[#947866] tracking-wider block mb-1">
              Rincian Tugas yang Dinilai
            </span>
            <h2 className="text-base font-bold text-[#2A1810] dark:text-[#FAF5EE]">
              {assignment.title}
            </h2>
            {assignment.instructions && (
              <div className="mt-2 p-3.5 rounded-2xl bg-[#FAF5EE] dark:bg-[#180E09] border border-[#EFE5DA] dark:border-[#2D1F17] text-xs text-[#5C4537] dark:text-[#CBB5A3] leading-relaxed whitespace-pre-wrap">
                {assignment.instructions}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-[#7A5F4E] dark:text-[#CBB5A3] flex-wrap gap-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Tenggat Waktu: {formatDate(assignment.dueDate)}</span>
            </span>

            {assignment.attachmentUrl && (
              <a
                href={assignment.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B5A2B] dark:text-[#D4A373] hover:underline"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Lihat Lampiran Berkas Soal</span>
              </a>
            )}
          </div>
        </div>

        {/* Existing Grade Status Banner if already graded */}
        {assignment.score !== undefined && !isSavedSuccess && (
          <div className="p-4 rounded-2xl bg-[#FAF5EE] dark:bg-[#20150E] border border-[#DFCFC1] dark:border-[#38261B] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-[#2A1810] dark:text-[#FAF5EE]">
                  Tugas ini sebelumnya sudah memiliki nilai: {assignment.score} ({assignment.gradeLetter})
                </p>
                <p className="text-[11px] text-[#7A5F4E] dark:text-[#CBB5A3]">
                  Anda dapat mengisi formulir di bawah jika ingin memperbarui skor atau evaluasi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Confirmation Card */}
        {isSavedSuccess && (
          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">
                  Nilai Berhasil Dikirim ke Mahasiswa!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Skor <b>{scoreInput} ({predictedLetter})</b> dan catatan evaluasi telah masuk ke dalam sistem akademik Yuli Indiyanti.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsSavedSuccess(false)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-2xs"
              >
                Ubah Nilai Kembali
              </button>
            </div>
          </div>
        )}

        {/* Lecturer Grading Form Card */}
        {!isSavedSuccess && (
          <form
            onSubmit={handleSubmitGrade}
            className="p-6 sm:p-7 rounded-3xl bg-[#FFFDFB] dark:bg-[#1E140E] border border-[#E3D6C9] dark:border-[#38261B] shadow-xl space-y-5"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0E6DC] dark:border-[#2D1F17]">
              <Award className="w-5 h-5 text-[#8B5A2B] dark:text-[#D4A373]" />
              <h3 className="text-sm font-bold text-[#2A1810] dark:text-[#FAF5EE]">
                Formulir Evaluasi & Nilai Akhir Tugas
              </h3>
            </div>

            {/* Nama Dosen Penilai */}
            <div>
              <label
                htmlFor="lecturer-name-input"
                className="block text-xs font-bold text-[#5C4537] dark:text-[#CBB5A3] uppercase tracking-wider mb-1.5"
              >
                Nama Dosen Pengampu / Penilai (Opsional)
              </label>
              <input
                id="lecturer-name-input"
                type="text"
                placeholder="Contoh: Dosen Pengampu, M.Kom."
                value={lecturerName}
                onChange={(e) => setLecturerName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-2xl border border-[#DECFC0] dark:border-[#38261B] bg-[#FFFDFB] dark:bg-[#150E0A] text-[#2A1810] dark:text-[#FAF5EE] placeholder-[#A08878] outline-none focus:border-[#8B5A2B] transition-colors"
              />
            </div>

            {/* Score Input with Dynamic Letter Badge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="lecturer-score-input"
                  className="block text-xs font-bold text-[#5C4537] dark:text-[#CBB5A3] uppercase tracking-wider"
                >
                  Skor Nilai Mahasiswa (Skala 0 - 100) *
                </label>
                {scoreInput !== "" && (
                  <span
                    className="px-3 py-0.5 rounded-full text-xs font-bold border transition-all"
                    style={{
                      backgroundColor: letterConfig?.bgHex || "#EDE3D6",
                      color: letterConfig?.textHex || "#453120",
                    }}
                  >
                    Prediksi Indeks: {predictedLetter}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  id="lecturer-score-input"
                  type="number"
                  required
                  min={0}
                  max={100}
                  placeholder="Contoh: 88 atau 95"
                  value={scoreInput}
                  onChange={(e) =>
                    setScoreInput(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full text-lg font-bold px-4 py-3 rounded-2xl border border-[#DECFC0] dark:border-[#38261B] bg-[#FFFDFB] dark:bg-[#150E0A] text-[#2A1810] dark:text-[#FAF5EE] placeholder-[#A08878] outline-none focus:border-[#8B5A2B] transition-colors"
                />
              </div>
              <p className="text-[11px] text-[#7A5F4E] dark:text-[#CBB5A3]">
                Rentang Nilai: A (≥ 85), AB (78-84), B (70-77), BC (63-69), C (55-62), D (40-54), E (&lt; 40)
              </p>
            </div>

            {/* Feedback / Evaluasi Dosen */}
            <div>
              <label
                htmlFor="lecturer-feedback-input"
                className="block text-xs font-bold text-[#5C4537] dark:text-[#CBB5A3] uppercase tracking-wider mb-1.5"
              >
                Catatan Evaluasi / Masukan Dosen
              </label>
              <textarea
                id="lecturer-feedback-input"
                rows={4}
                maxLength={800}
                placeholder="Tuliskan apresiasi, koreksi pengerjaan, saran perbaikan kode/analisis, atau catatan evaluasi untuk mahasiswa..."
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="w-full text-xs p-3.5 rounded-2xl border border-[#DECFC0] dark:border-[#38261B] bg-[#FFFDFB] dark:bg-[#150E0A] text-[#2A1810] dark:text-[#FAF5EE] placeholder-[#A08878] outline-none focus:border-[#8B5A2B] transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || scoreInput === ""}
              className="w-full py-3.5 rounded-2xl bg-[#2A1810] hover:bg-[#3D2517] dark:bg-[#FAF5EE] dark:hover:bg-[#EFE5DA] text-[#FAF5EE] dark:text-[#2A1810] text-xs font-bold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? "Menyimpan Nilai..."
                  : "Kirim Nilai & Evaluasi ke Mahasiswa"}
              </span>
            </button>
          </form>
        )}

        {/* Footer info */}
        <p className="text-center text-[11px] text-[#8C7362] dark:text-[#A89484] pt-2">
          Sistem Penilaian Akademik Mandiri • Terkoneksi ke Yuli&apos;s Second Brain
        </p>
      </div>
    </div>
  );
}
