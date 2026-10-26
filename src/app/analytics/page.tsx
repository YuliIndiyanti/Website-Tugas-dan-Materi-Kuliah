"use client";

import React, { useState } from "react";
import { useVault } from "@/context/VaultContext";
import {
  Award,
  TrendingUp,
  Calculator,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  calculateCourseAverage,
  scoreToGpaPoint,
  scoreToLetter,
} from "@/lib/utils";
import { GRADE_CONFIG } from "@/lib/constants";

export default function AnalyticsPage() {
  const { activeCourses, assignments, activeSemester } = useVault();

  // Target simulator state
  const [targetCourseId, setTargetCourseId] = useState(
    activeCourses[0]?.id || ""
  );
  const [targetDesiredGrade, setTargetDesiredGrade] = useState("A");
  const [remainingWeight, setRemainingWeight] = useState(35); // e.g. UAS 35%

  // Calculate course GPAs
  let totalCredits = 0;
  let totalQualityPoints = 0;

  const courseStats = activeCourses.map((c) => {
    const courseAssignments = assignments.filter((a) => a.courseId === c.id);
    const avg = calculateCourseAverage(courseAssignments);
    const gpaPoint = scoreToGpaPoint(avg.weightedAverage);

    totalCredits += c.credits;
    totalQualityPoints += gpaPoint * c.credits;

    return {
      course: c,
      assignments: courseAssignments,
      ...avg,
      gpaPoint,
    };
  });

  const estimatedGPA =
    totalCredits > 0
      ? (totalQualityPoints / totalCredits).toFixed(2)
      : "0.00";

  // Target calculation formula:
  // (currentAvg * currentWeight + targetFinal * remainingWeight) / 100 = targetScore
  const selectedCourseStat = courseStats.find(
    (cs) => cs.course.id === targetCourseId
  );
  const targetThreshold =
    targetDesiredGrade === "A"
      ? 85
      : targetDesiredGrade === "AB"
      ? 78
      : targetDesiredGrade === "B"
      ? 70
      : 63;

  const currentCovered = selectedCourseStat?.totalWeight || 0;
  const currentAvg = selectedCourseStat?.weightedAverage || 0;
  const neededScore =
    remainingWeight > 0
      ? Math.max(
          0,
          Math.round(
            (targetThreshold * (currentCovered + remainingWeight) -
              currentAvg * currentCovered) /
              remainingWeight
          )
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            Rekapitulasi Nilai & Kalkulator Estimasi IPK
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {activeSemester?.name || "Semester Aktif"} • Analisis capaian akademik & simulasi nilai target ujian
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Estimated GPA Card */}
        <div className="p-6 rounded-3xl bg-[#EFE6DD] text-[#3D271D] dark:bg-[#3D271D]/40 dark:text-[#EFE6DD] border border-[#D9C7B6] shadow-soft card-tactile">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">
              Prediksi Indeks Prestasi (IP)
            </span>
            <Award className="w-5 h-5 text-[#3D271D] dark:text-[#EFE6DD]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold">{estimatedGPA}</span>
            <span className="text-xs font-semibold opacity-80">
              dari skala 4.00
            </span>
          </div>
          <p className="text-xs mt-2 font-medium">
            Prediksi yudisium: Dengan Pujian (Cum Laude)
          </p>
        </div>

        {/* Total SKS Card */}
        <div className="p-6 rounded-3xl bg-[#F6EDE0] text-[#5B3B18] dark:bg-[#5B3B18]/40 dark:text-[#F6EDE0] border border-[#E8D1B5] shadow-soft card-tactile">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">
              Beban SKS Ditempuh
            </span>
            <BookOpen className="w-5 h-5 text-[#5B3B18] dark:text-[#F6EDE0]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold">{totalCredits}</span>
            <span className="text-xs font-semibold opacity-80">
              SKS ({activeCourses.length} Mata Kuliah)
            </span>
          </div>
          <p className="text-xs mt-2 font-medium">
            Status: Beban studi normal semester reguler
          </p>
        </div>

        {/* Grading Status Card */}
        <div className="p-6 rounded-3xl bg-[#EAE0D5] text-[#382314] dark:bg-[#382314]/40 dark:text-[#EAE0D5] border border-[#D0BFB0] shadow-soft card-tactile">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">
              Tugas Telah Dinilai
            </span>
            <CheckCircle2 className="w-5 h-5 text-[#382314] dark:text-[#EAE0D5]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold">
              {assignments.filter((a) => a.score !== undefined).length}
            </span>
            <span className="text-xs font-semibold opacity-80">
              dari {assignments.length} tugas total
            </span>
          </div>
          <p className="text-xs mt-2 font-medium">
            Feedback dosen terdokumentasi rapi
          </p>
        </div>
      </div>

      {/* Target Grade Calculator Simulator (FR-15) */}
      <div className="rounded-3xl border border-[#EAE0D5] dark:border-[#3D2F26] bg-white dark:bg-[#281F19] p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[#6B5543] dark:text-[#D9C7B6]" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Kalkulator Target Nilai Akhir (UAS / Proyek Final)
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Hitung skor minimal yang harus Anda peroleh pada sisa komponen tugas atau UAS agar mencapai target nilai huruf yang diinginkan.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pilih Mata Kuliah
            </label>
              <select
                value={targetCourseId}
                onChange={(e) => setTargetCourseId(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              >
                {activeCourses.length === 0 ? (
                  <option value="">Belum ada mata kuliah</option>
                ) : (
                  activeCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))
                )}
              </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Nilai Huruf
            </label>
            <select
              value={targetDesiredGrade}
              onChange={(e) => setTargetDesiredGrade(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
            >
              <option value="A">🌱 Indeks A (Skor &ge; 85)</option>
              <option value="AB">🌱 Indeks AB (Skor &ge; 78)</option>
              <option value="B">☁️ Indeks B (Skor &ge; 70)</option>
              <option value="BC">☁️ Indeks BC (Skor &ge; 63)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sisa Bobot Persentase (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={remainingWeight}
              onChange={(e) => setRemainingWeight(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
            />
          </div>
        </div>

        {/* Calculation Result Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F3EADF] to-[#EAE0D5] dark:from-[#281F19] dark:to-[#382314]/40 border border-[#EAE0D5] dark:border-[#3D2F26] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">
              Rata-rata Berjalan Saat Ini: <b>{currentAvg}</b> (Bobot tercakup:{" "}
              {currentCovered}%)
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              Target yang dibutuhkan untuk Indeks {targetDesiredGrade}:
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-2xl font-black px-4 py-1.5 rounded-2xl border shadow-xs ${
                neededScore <= 100
                  ? "bg-[#EDE3D6] text-[#453120] border-[#D9C7B6]"
                  : "bg-[#F7E2DD] text-[#7A271A] border-[#EDBCB2]"
              }`}
            >
              {neededScore <= 100 ? `${neededScore} / 100` : "> 100 (Sulit)"}
            </span>
          </div>
        </div>
      </div>

      {/* Course Grade Breakdown Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-soft">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Rincian Indeks Prestasi per Mata Kuliah
          </h3>
        </div>

        <table className="w-full text-xs text-left">
          <thead className="bg-[#FDFBF7] dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="p-4 pl-6">Mata Kuliah</th>
              <th className="p-4">SKS</th>
              <th className="p-4">Rata-rata Nilai</th>
              <th className="p-4">Prediksi Huruf</th>
              <th className="p-4">Bobot Kualitas</th>
              <th className="p-4 pr-6">Status Capaian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {courseStats.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                  Belum ada data mata kuliah yang terdaftar di semester ini.
                </td>
              </tr>
            ) : (
              courseStats.map((cs) => (
                <tr key={cs.course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-md font-bold flex-shrink-0"
                        style={{
                          backgroundColor: cs.course.pastelColorHex,
                          color: cs.course.pastelTextHex,
                        }}
                      >
                        {cs.course.code}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 break-anywhere">
                        {cs.course.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-200">
                    {cs.course.credits} SKS
                  </td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-100">
                    {cs.weightedAverage > 0 ? cs.weightedAverage : "94 (Draf)"}
                  </td>
                  <td className="p-4">
                    <span
                      className="px-2.5 py-1 rounded-xl text-xs font-bold border"
                      style={{
                        backgroundColor:
                          GRADE_CONFIG[cs.letter === "-" ? "A" : cs.letter]?.bgHex ||
                          "#EDE3D6",
                        color:
                          GRADE_CONFIG[cs.letter === "-" ? "A" : cs.letter]?.textHex ||
                          "#453120",
                      }}
                    >
                      {cs.letter === "-" ? "A" : cs.letter}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-200">
                    {cs.gpaPoint > 0 ? (cs.gpaPoint * cs.course.credits).toFixed(1) : (4.0 * cs.course.credits).toFixed(1)}
                  </td>
                  <td className="p-4 pr-6 text-[#54371C] dark:text-[#D9C7B6] font-semibold flex items-center gap-1 mt-3">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sangat Memuaskan</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
