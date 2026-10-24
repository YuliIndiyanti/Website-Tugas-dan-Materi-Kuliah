import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { URGENCY_CONFIG } from "./constants";
import { Assignment } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    }).format(d);
  } catch {
    return dateString;
  }
}

export interface UrgencyInfo {
  type: "CRITICAL" | "WARNING" | "NORMAL" | "COMPLETED";
  label: string;
  badgeLabel: string;
  bgHex: string;
  textHex: string;
  borderHex: string;
  isOverdue: boolean;
  hoursRemaining: number;
}

export function getAssignmentUrgency(assignment: {
  dueDate: string;
  status: string;
}): UrgencyInfo {
  if (assignment.status === "SUBMITTED") {
    return {
      type: "COMPLETED",
      label: "Sudah Dikumpulkan",
      badgeLabel: "Selesai",
      bgHex: URGENCY_CONFIG.COMPLETED.bgHex,
      textHex: URGENCY_CONFIG.COMPLETED.textHex,
      borderHex: URGENCY_CONFIG.COMPLETED.borderHex,
      isOverdue: false,
      hoursRemaining: 99999,
    };
  }

  const now = new Date().getTime();
  const due = new Date(assignment.dueDate).getTime();
  const diffMs = due - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) {
    const passedHours = Math.abs(Math.round(diffHours));
    const passedDays = Math.floor(passedHours / 24);
    const label =
      passedDays > 0 ? `Terlambat ${passedDays} hari` : `Terlambat ${passedHours} jam`;
    return {
      type: "CRITICAL",
      label,
      badgeLabel: label,
      bgHex: URGENCY_CONFIG.CRITICAL.bgHex,
      textHex: URGENCY_CONFIG.CRITICAL.textHex,
      borderHex: URGENCY_CONFIG.CRITICAL.borderHex,
      isOverdue: true,
      hoursRemaining: diffHours,
    };
  }

  if (diffHours <= 24) {
    const hours = Math.max(1, Math.round(diffHours));
    return {
      type: "CRITICAL",
      label: `Sisa ${hours} jam lagi!`,
      badgeLabel: `< 24 jam`,
      bgHex: URGENCY_CONFIG.CRITICAL.bgHex,
      textHex: URGENCY_CONFIG.CRITICAL.textHex,
      borderHex: URGENCY_CONFIG.CRITICAL.borderHex,
      isOverdue: false,
      hoursRemaining: diffHours,
    };
  }

  if (diffHours <= 72) {
    const days = Math.ceil(diffHours / 24);
    return {
      type: "WARNING",
      label: `Sisa ${days} hari lagi`,
      badgeLabel: `${days} hari lagi`,
      bgHex: URGENCY_CONFIG.WARNING.bgHex,
      textHex: URGENCY_CONFIG.WARNING.textHex,
      borderHex: URGENCY_CONFIG.WARNING.borderHex,
      isOverdue: false,
      hoursRemaining: diffHours,
    };
  }

  const days = Math.floor(diffHours / 24);
  return {
    type: "NORMAL",
    label: `${days} hari lagi`,
    badgeLabel: `${days} hari`,
    bgHex: URGENCY_CONFIG.NORMAL.bgHex,
    textHex: URGENCY_CONFIG.NORMAL.textHex,
    borderHex: URGENCY_CONFIG.NORMAL.borderHex,
    isOverdue: false,
    hoursRemaining: diffHours,
  };
}

export function scoreToLetter(score: number): string {
  if (score >= 85) return "A";
  if (score >= 78) return "AB";
  if (score >= 70) return "B";
  if (score >= 63) return "BC";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "E";
}

export function scoreToGpaPoint(score: number): number {
  if (score >= 85) return 4.0;
  if (score >= 78) return 3.5;
  if (score >= 70) return 3.0;
  if (score >= 63) return 2.5;
  if (score >= 55) return 2.0;
  if (score >= 40) return 1.0;
  return 0.0;
}

export function calculateCourseAverage(assignments: Assignment[]) {
  const scored = assignments.filter((a) => a.score !== undefined && a.score !== null);
  if (scored.length === 0) return { weightedAverage: 0, totalWeight: 0, letter: "-" };

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const a of scored) {
    const weight = a.weightPercentage || 10;
    totalWeightedScore += (a.score as number) * weight;
    totalWeight += weight;
  }

  const average = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  const letter = scoreToLetter(average);
  return {
    weightedAverage: Math.round(average * 10) / 10,
    totalWeight,
    letter,
  };
}
