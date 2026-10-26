"use client";

import React from "react";
import { useVault } from "@/context/VaultContext";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { formatShortDate, getAssignmentUrgency } from "@/lib/utils";
import { STATUS_CONFIG } from "@/lib/constants";

interface DeadlineListProps {
  onSelectAssignment: (assignmentId: string) => void;
  onOpenNewAssignment: () => void;
}

export const DeadlineList: React.FC<DeadlineListProps> = ({
  onSelectAssignment,
  onOpenNewAssignment,
}) => {
  const { activeAssignments, courses } = useVault();

  // Sort assignments by due date ascending
  const sorted = [...activeAssignments].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getCourse = (id: string) => courses.find((c) => c.id === id);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>⏰</span> Tenggat Waktu & Prioritas Pengerjaan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Diurutkan berdasarkan deadline terdekat dengan penanda palet warna brown
          </p>
        </div>
        <button
          onClick={onOpenNewAssignment}
          className="text-xs font-semibold text-[#4A2E1B] dark:text-[#D9C7B6] hover:underline btn-tactile"
        >
          + Tambah
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          <p className="text-xs italic">Tidak ada tugas yang terdaftar saat ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((assignment) => {
            const course = getCourse(assignment.courseId);
            const urg = getAssignmentUrgency(assignment);
            const statusMeta = STATUS_CONFIG[assignment.status];

            return (
              <div
                key={assignment.id}
                onClick={() => onSelectAssignment(assignment.id)}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#FDFBF7] dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 hover:border-[#8B5A2B] dark:hover:border-[#8B5A2B] transition-all cursor-pointer shadow-xs hover:shadow-soft card-tactile"
                style={{
                  borderLeftWidth: "5px",
                  borderLeftColor: course?.pastelTextHex || "#4A2E1B",
                }}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-md font-bold tracking-tight"
                      style={{
                        backgroundColor: course?.pastelColorHex || "#EFE6DD",
                        color: course?.pastelTextHex || "#3D271D",
                      }}
                    >
                      {course?.code || "MK"}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                      {course?.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      W{assignment.weekNumber}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#4A2E1B] dark:group-hover:text-[#D9C7B6] transition-colors line-clamp-2 break-anywhere break-words">
                    {assignment.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 break-anywhere break-words">
                    {assignment.instructions}
                  </p>
                </div>

                {/* Right side: Countdown and Status */}
                <div className="flex items-center justify-between sm:justify-end gap-3 mt-3 sm:mt-0 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  {/* Urgency Badge */}
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs flex-shrink-0"
                    style={{
                      backgroundColor: urg.bgHex,
                      color: urg.textHex,
                      borderColor: urg.borderHex,
                    }}
                  >
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="whitespace-nowrap">{urg.label}</span>
                  </span>

                  {/* Status Pill */}
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium border flex-shrink-0"
                    style={{
                      backgroundColor: statusMeta.bgHex,
                      color: statusMeta.textHex,
                      borderColor: statusMeta.borderHex,
                    }}
                  >
                    <span>{statusMeta.icon}</span>
                    <span className="hidden sm:inline whitespace-nowrap">{statusMeta.label}</span>
                  </span>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform hidden sm:block" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
