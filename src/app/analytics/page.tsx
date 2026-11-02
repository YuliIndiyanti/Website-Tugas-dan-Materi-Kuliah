"use client";

import React from "react";
import { useVault } from "@/context/VaultContext";
import {
  Award,
  TrendingUp,
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

  // Calculate course GPAs based on pure average
  let totalCredits = 0;
  let totalQualityPoints = 0;
  let totalGradedCount = 0;

  const courseStats = activeCourses.map((c) => {
    const courseAssignments = assignments.filter((a) => a.courseId === c.id);
    const avg = calculateCourseAverage(courseAssignments);
    const gpaPoint = scoreToGpaPoint(avg.average);
    const scoredCount = courseAssignments.filter((a) => a.score !== undefined && a.score !== null).length;

    totalCredits += c.credits;
    if (scoredCount > 0) {
      totalQualityPoints += gpaPoint * c.credits;
      totalGradedCount += scoredCount;
    }

    return {
      course: c,
      assignments: courseAssignments,
      ...avg,
      gpaPoint,
    };
  });

  const estimatedGPA =
    totalCredits > 0 && totalGradedCount > 0
      ? (totalQualityPoints / totalCredits).toFixed(2)
      : "-";

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
            {estimatedGPA !== "-"
              ? Number(estimatedGPA) >= 3.5
                ? "Prediksi yudisium: Dengan Pujian (Cum Laude)"
                : Number(estimatedGPA) >= 3.0
                ? "Prediksi yudisium: Sangat Memuaskan"
                : "Prediksi yudisium: Memuaskan"
              : "Belum ada nilai tugas yang masuk dari dosen"}
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

      {/* Course Grade Breakdown Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-soft">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Rincian Capaian Nilai per Mata Kuliah
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Nilai akhir dihitung otomatis berdasarkan rata-rata nilai tugas murni
            </p>
          </div>
        </div>

        <table className="w-full text-xs text-left">
          <thead className="bg-[#FDFBF7] dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="p-4 pl-6">Mata Kuliah</th>
              <th className="p-4">SKS</th>
              <th className="p-4">Tugas Dinilai</th>
              <th className="p-4">Rata-rata Nilai</th>
              <th className="p-4">Prediksi Huruf</th>
              <th className="p-4">Poin Mutu</th>
              <th className="p-4 pr-6">Status Capaian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {courseStats.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                  Belum ada data mata kuliah yang terdaftar di semester ini.
                </td>
              </tr>
            ) : (
              courseStats.map((cs) => {
                const gradedCount = cs.assignments.filter((a) => a.score !== undefined).length;
                const totalCount = cs.assignments.length;

                return (
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
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                      {gradedCount} / {totalCount} tugas
                    </td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-100">
                      {cs.average > 0 ? cs.average : "-"}
                    </td>
                    <td className="p-4">
                      {cs.letter !== "-" ? (
                        <span
                          className="px-2.5 py-1 rounded-xl text-xs font-bold border"
                          style={{
                            backgroundColor:
                              GRADE_CONFIG[cs.letter]?.bgHex || "#EDE3D6",
                            color:
                              GRADE_CONFIG[cs.letter]?.textHex || "#453120",
                          }}
                        >
                          {cs.letter}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">-</span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-700 dark:text-slate-200">
                      {cs.gpaPoint > 0 ? (cs.gpaPoint * cs.course.credits).toFixed(1) : "-"}
                    </td>
                    <td className="p-4 pr-6">
                      {cs.average >= 85 ? (
                        <span className="text-[#382314] dark:text-[#E8CBAE] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Sangat Memuaskan</span>
                        </span>
                      ) : cs.average >= 70 ? (
                        <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                          <span>Memuaskan</span>
                        </span>
                      ) : cs.average > 0 ? (
                        <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Perlu Ditingkatkan</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Belum ada nilai</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
