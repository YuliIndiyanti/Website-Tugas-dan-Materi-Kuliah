"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Semester,
  Course,
  Material,
  Assignment,
  Submission,
  NoteComment,
  AssignmentStatus,
} from "@/types";
import {
  INITIAL_SEMESTERS,
  INITIAL_COURSES,
  INITIAL_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_NOTES,
} from "@/lib/seedData";
import {
  WORST_CASE_SEMESTERS,
  WORST_CASE_COURSES,
  WORST_CASE_MATERIALS,
  WORST_CASE_ASSIGNMENTS,
  WORST_CASE_SUBMISSIONS,
  WORST_CASE_NOTES,
} from "@/lib/worstCaseData";
import { generateId, scoreToLetter } from "@/lib/utils";

export type DatasetMode = "DEMO" | "WORST_CASE" | "EMPTY";

interface VaultContextType {
  semesters: Semester[];
  activeSemesterId: string;
  activeSemester: Semester | undefined;
  setActiveSemesterId: (id: string) => void;
  courses: Course[];
  materials: Material[];
  assignments: Assignment[];
  submissions: Submission[];
  notes: NoteComment[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  datasetMode: DatasetMode;
  switchDatasetMode: (mode: DatasetMode) => void;
  // Semester CRUD
  addSemester: (sem: Omit<Semester, "id" | "createdAt">) => Semester;
  updateSemester: (id: string, sem: Partial<Semester>) => void;
  deleteSemester: (id: string) => void;
  // Course CRUD
  addCourse: (course: Omit<Course, "id" | "createdAt">) => Course;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  // Material CRUD
  addMaterial: (mat: Omit<Material, "id" | "createdAt">) => Material;
  updateMaterial: (id: string, mat: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  // Assignment CRUD
  addAssignment: (assign: Omit<Assignment, "id" | "createdAt">) => Assignment;
  updateAssignment: (id: string, assign: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  updateAssignmentStatus: (id: string, status: AssignmentStatus) => void;
  updateAssignmentGrade: (
    id: string,
    score: number,
    feedback?: string
  ) => void;
  // Submission
  addSubmission: (
    sub: Omit<Submission, "id" | "versionNumber" | "uploadedAt">
  ) => Submission;
  // Note Comment
  addNoteComment: (
    note: Omit<NoteComment, "id" | "createdAt" | "updatedAt">
  ) => NoteComment;
  updateNoteComment: (id: string, content: string) => void;
  deleteNoteComment: (id: string) => void;
  toggleShareNote: (id: string) => string;
  // Data backup & reset
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  resetToDefault: () => void;
  // Quick stats
  activeCourses: Course[];
  activeAssignments: Assignment[];
  activeMaterials: Material[];
}

const STORAGE_KEY = "kuliahvault_data_v1.2";
const THEME_KEY = "kuliahvault_theme";

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [datasetMode, setDatasetMode] = useState<DatasetMode>("DEMO");

  const [semesters, setSemesters] = useState<Semester[]>(INITIAL_SEMESTERS);
  const [activeSemesterId, setActiveSemesterId] = useState<string>("sem-2026-ganjil");
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [notes, setNotes] = useState<NoteComment[]>(INITIAL_NOTES);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      }

      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.semesters) setSemesters(parsed.semesters);
        if (parsed.activeSemesterId) setActiveSemesterId(parsed.activeSemesterId);
        if (parsed.courses) setCourses(parsed.courses);
        if (parsed.materials) setMaterials(parsed.materials);
        if (parsed.assignments) setAssignments(parsed.assignments);
        if (parsed.submissions) setSubmissions(parsed.submissions);
        if (parsed.notes) setNotes(parsed.notes);
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    if (!mounted) return;
    try {
      const payload = {
        semesters,
        activeSemesterId,
        courses,
        materials,
        assignments,
        submissions,
        notes,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Failed to save data to localStorage", e);
    }
  }, [
    mounted,
    semesters,
    activeSemesterId,
    courses,
    materials,
    assignments,
    submissions,
    notes,
  ]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem(THEME_KEY, "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem(THEME_KEY, "light");
      }
      return next;
    });
  };

  const activeSemester = semesters.find((s) => s.id === activeSemesterId);
  const activeCourses = courses.filter((c) => c.semesterId === activeSemesterId);
  const activeCourseIds = new Set(activeCourses.map((c) => c.id));
  const activeAssignments = assignments.filter((a) =>
    activeCourseIds.has(a.courseId)
  );
  const activeMaterials = materials.filter((m) =>
    activeCourseIds.has(m.courseId)
  );

  // Semester actions
  const addSemester = (sem: Omit<Semester, "id" | "createdAt">): Semester => {
    const newSem: Semester = {
      ...sem,
      id: "sem-" + generateId(),
      createdAt: new Date().toISOString(),
    };
    if (newSem.isActive) {
      setSemesters((prev) =>
        prev.map((s) => ({ ...s, isActive: false })).concat(newSem)
      );
      setActiveSemesterId(newSem.id);
    } else {
      setSemesters((prev) => [...prev, newSem]);
    }
    return newSem;
  };

  const updateSemester = (id: string, patch: Partial<Semester>) => {
    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...patch };
          if (patch.isActive) {
            setActiveSemesterId(id);
          }
          return updated;
        }
        if (patch.isActive) {
          return { ...s, isActive: false };
        }
        return s;
      })
    );
  };

  const deleteSemester = (id: string) => {
    setSemesters((prev) => prev.filter((s) => s.id !== id));
    if (activeSemesterId === id) {
      const remaining = semesters.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setActiveSemesterId(remaining[0].id);
      }
    }
  };

  // Course actions
  const addCourse = (course: Omit<Course, "id" | "createdAt">): Course => {
    const newCourse: Course = {
      ...course,
      id: "course-" + generateId(),
      createdAt: new Date().toISOString(),
    };
    setCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  };

  const updateCourse = (id: string, patch: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setMaterials((prev) => prev.filter((m) => m.courseId !== id));
    setAssignments((prev) => prev.filter((a) => a.courseId !== id));
  };

  // Material actions
  const addMaterial = (mat: Omit<Material, "id" | "createdAt">): Material => {
    const newMat: Material = {
      ...mat,
      id: "mat-" + generateId(),
      createdAt: new Date().toISOString(),
    };
    setMaterials((prev) => [newMat, ...prev]);
    return newMat;
  };

  const updateMaterial = (id: string, patch: Partial<Material>) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  // Assignment actions
  const addAssignment = (
    assign: Omit<Assignment, "id" | "createdAt">
  ): Assignment => {
    const newAssign: Assignment = {
      ...assign,
      id: "assign-" + generateId(),
      createdAt: new Date().toISOString(),
    };
    setAssignments((prev) => [newAssign, ...prev]);
    return newAssign;
  };

  const updateAssignment = (id: string, patch: Partial<Assignment>) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setSubmissions((prev) => prev.filter((s) => s.assignmentId !== id));
  };

  const updateAssignmentStatus = (id: string, status: AssignmentStatus) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return {
          ...a,
          status,
          submittedAt:
            status === "SUBMITTED"
              ? a.submittedAt || new Date().toISOString()
              : a.submittedAt,
        };
      })
    );
  };

  const updateAssignmentGrade = (
    id: string,
    score: number,
    feedback?: string
  ) => {
    const letter = scoreToLetter(score);
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              score,
              gradeLetter: letter,
              lecturerFeedback:
                feedback !== undefined ? feedback : a.lecturerFeedback,
            }
          : a
      )
    );
  };

  // Submission actions
  const addSubmission = (
    sub: Omit<Submission, "id" | "versionNumber" | "uploadedAt">
  ): Submission => {
    const existing = submissions.filter((s) => s.assignmentId === sub.assignmentId);
    const nextVer = existing.length + 1;
    const newSub: Submission = {
      ...sub,
      id: "sub-" + generateId(),
      versionNumber: nextVer,
      uploadedAt: new Date().toISOString(),
    };
    setSubmissions((prev) => [...prev, newSub]);

    // If proof or final, mark assignment as READY or SUBMITTED
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === sub.assignmentId) {
          if (sub.proofUrl || sub.submissionLink) {
            return {
              ...a,
              status: "SUBMITTED",
              submittedAt: new Date().toISOString(),
            };
          }
          if (a.status === "TODO") {
            return { ...a, status: "IN_PROGRESS" };
          }
        }
        return a;
      })
    );
    return newSub;
  };

  // Note actions
  const addNoteComment = (
    note: Omit<NoteComment, "id" | "createdAt" | "updatedAt">
  ): NoteComment => {
    const newNote: NoteComment = {
      ...note,
      id: "note-" + generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNoteComment = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, contentMarkdown: content, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  const deleteNoteComment = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleShareNote = (id: string): string => {
    let token = "";
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const isShared = !n.isShared;
          token = isShared ? n.shareToken || "share-" + generateId() : "";
          return { ...n, isShared, shareToken: token };
        }
        return n;
      })
    );
    return token;
  };

  // Backup & Reset
  const exportDataJSON = () => {
    const payload = {
      version: "1.2",
      exportedAt: new Date().toISOString(),
      semesters,
      activeSemesterId,
      courses,
      materials,
      assignments,
      submissions,
      notes,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.semesters && parsed.courses) {
        setSemesters(parsed.semesters);
        if (parsed.activeSemesterId) setActiveSemesterId(parsed.activeSemesterId);
        setCourses(parsed.courses);
        if (parsed.materials) setMaterials(parsed.materials);
        if (parsed.assignments) setAssignments(parsed.assignments);
        if (parsed.submissions) setSubmissions(parsed.submissions);
        if (parsed.notes) setNotes(parsed.notes);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Invalid JSON format", e);
      return false;
    }
  };

  const resetToDefault = () => {
    setSemesters(INITIAL_SEMESTERS);
    setActiveSemesterId("sem-2026-ganjil");
    setCourses(INITIAL_COURSES);
    setMaterials(INITIAL_MATERIALS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setNotes(INITIAL_NOTES);
    setDatasetMode("DEMO");
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchDatasetMode = (mode: DatasetMode) => {
    setDatasetMode(mode);
    if (mode === "WORST_CASE") {
      setSemesters(WORST_CASE_SEMESTERS);
      setActiveSemesterId("sem-worst-case");
      setCourses(WORST_CASE_COURSES);
      setMaterials(WORST_CASE_MATERIALS);
      setAssignments(WORST_CASE_ASSIGNMENTS);
      setSubmissions(WORST_CASE_SUBMISSIONS);
      setNotes(WORST_CASE_NOTES);
    } else if (mode === "EMPTY") {
      setSemesters([
        {
          id: "sem-empty",
          name: "Semester Baru (Belum Ada Data)",
          startDate: "2026-09-01",
          endDate: "2027-01-30",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ]);
      setActiveSemesterId("sem-empty");
      setCourses([]);
      setMaterials([]);
      setAssignments([]);
      setSubmissions([]);
      setNotes([]);
    } else {
      setSemesters(INITIAL_SEMESTERS);
      setActiveSemesterId("sem-2026-ganjil");
      setCourses(INITIAL_COURSES);
      setMaterials(INITIAL_MATERIALS);
      setAssignments(INITIAL_ASSIGNMENTS);
      setSubmissions(INITIAL_SUBMISSIONS);
      setNotes(INITIAL_NOTES);
    }
  };

  return (
    <VaultContext.Provider
      value={{
        semesters,
        activeSemesterId,
        activeSemester,
        setActiveSemesterId,
        courses,
        materials,
        assignments,
        submissions,
        notes,
        isDarkMode,
        toggleDarkMode,
        datasetMode,
        switchDatasetMode,
        addSemester,
        updateSemester,
        deleteSemester,
        addCourse,
        updateCourse,
        deleteCourse,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        updateAssignmentStatus,
        updateAssignmentGrade,
        addSubmission,
        addNoteComment,
        updateNoteComment,
        deleteNoteComment,
        toggleShareNote,
        exportDataJSON,
        importDataJSON,
        resetToDefault,
        activeCourses,
        activeAssignments,
        activeMaterials,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
};
