export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type AssignmentStatus = "TODO" | "IN_PROGRESS" | "READY" | "SUBMITTED";

export type AssignmentType = "TASK" | "QUIZ" | "PROJECT" | "MIDTERM" | "FINAL";

export type MaterialCategory = "SLIDE" | "BOOK" | "RECORDING" | "LINK" | "OTHER";

export type NoteType = "SUMMARY_NOTE" | "COMMENT_LOG";

export interface PastelTag {
  id: string;
  name: string;
  bgHex: string;
  textHex: string;
}

export interface PastelThemeDefinition {
  id: string;
  name: string;
  bgHex: string;
  gradientToHex: string;
  textHex: string;
  borderHex: string;
  categorySuggestion: string;
}

export interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  semesterId: string;
  code: string;
  name: string;
  credits: number;
  lecturerName: string;
  scheduleDay: string;
  scheduleTime: string;
  roomOrLink: string;
  pastelThemeId: string;
  pastelColorHex: string;
  pastelTextHex: string;
  createdAt: string;
}

export interface Material {
  id: string;
  courseId: string;
  weekNumber: number; // 1-16 or special week like 8 for UTS, 16 for UAS
  title: string;
  description: string;
  category: MaterialCategory;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  mimeType?: string;
  externalUrl?: string;
  tags: PastelTag[];
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  versionNumber: number; // 1, 2, 3...
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  proofUrl?: string; // screenshot proof of LMS submit
  submissionLink?: string; // URL in LMS or git repo
  notes?: string;
  uploadedAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  weekNumber: number;
  title: string;
  instructions: string;
  attachmentUrl?: string;
  attachmentName?: string;
  dueDate: string; // ISO string
  priority: Priority;
  status: AssignmentStatus;
  type: AssignmentType;
  weightPercentage: number; // 0 - 100
  score?: number; // 0 - 100
  gradeLetter?: string; // A, AB, B, BC, C, D, E
  lecturerFeedback?: string;
  submittedAt?: string;
  createdAt: string;
}

export interface NoteComment {
  id: string;
  courseId?: string;
  materialId?: string;
  assignmentId?: string;
  contentMarkdown: string;
  type: NoteType;
  isShared?: boolean;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}
