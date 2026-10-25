"use server";

import { prisma } from "@/lib/prisma";
import {
  Semester,
  Course,
  Material,
  Assignment,
  Submission,
  NoteComment,
  AssignmentStatus,
  Priority,
  AssignmentType,
  MaterialCategory,
} from "@/types";
import {
  INITIAL_SEMESTERS,
  INITIAL_COURSES,
  INITIAL_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_NOTES,
} from "@/lib/seedData";

export async function getInitialVaultData() {
  try {
    // Check if database has any semester; if not, seed with initial data
    const semesterCount = await prisma.semester.count();
    if (semesterCount === 0) {
      await seedDatabase();
    }

    const [
      dbSemesters,
      dbCourses,
      dbMaterials,
      dbAssignments,
      dbSubmissions,
      dbNotes,
    ] = await Promise.all([
      prisma.semester.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.course.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.material.findMany({ orderBy: { weekNumber: "asc" } }),
      prisma.assignment.findMany({ orderBy: { dueDate: "asc" } }),
      prisma.submission.findMany({ orderBy: { uploadedAt: "asc" } }),
      prisma.noteComment.findMany({ orderBy: { createdAt: "asc" } }),
    ]);

    const semesters: Semester[] = dbSemesters.map((s) => ({
      id: s.id,
      name: s.name,
      startDate: s.startDate,
      endDate: s.endDate,
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString(),
    }));

    const courses: Course[] = dbCourses.map((c) => ({
      id: c.id,
      semesterId: c.semesterId,
      code: c.code,
      name: c.name,
      credits: c.credits,
      lecturerName: c.lecturerName,
      scheduleDay: c.scheduleDay,
      scheduleTime: c.scheduleTime,
      roomOrLink: c.roomOrLink,
      pastelThemeId: c.pastelThemeId,
      pastelColorHex: c.pastelColorHex,
      pastelTextHex: c.pastelTextHex,
      createdAt: c.createdAt.toISOString(),
    }));

    const materials: Material[] = dbMaterials.map((m) => {
      let tags = [];
      try {
        tags = JSON.parse(m.tagsJson);
      } catch {
        tags = [];
      }
      return {
        id: m.id,
        courseId: m.courseId,
        weekNumber: m.weekNumber,
        title: m.title,
        description: m.description,
        category: m.category as MaterialCategory,
        fileUrl: m.fileUrl || undefined,
        fileName: m.fileName || undefined,
        fileSize: m.fileSize || undefined,
        mimeType: m.mimeType || undefined,
        externalUrl: m.externalUrl || undefined,
        tags,
        createdAt: m.createdAt.toISOString(),
      };
    });

    const assignments: Assignment[] = dbAssignments.map((a) => ({
      id: a.id,
      courseId: a.courseId,
      weekNumber: a.weekNumber,
      title: a.title,
      instructions: a.instructions,
      attachmentUrl: a.attachmentUrl || undefined,
      attachmentName: a.attachmentName || undefined,
      dueDate: a.dueDate,
      priority: a.priority as Priority,
      status: a.status as AssignmentStatus,
      type: a.type as AssignmentType,
      weightPercentage: a.weightPercentage,
      score: a.score !== null ? a.score : undefined,
      gradeLetter: a.gradeLetter || undefined,
      lecturerFeedback: a.lecturerFeedback || undefined,
      submittedAt: a.submittedAt || undefined,
      createdAt: a.createdAt.toISOString(),
    }));

    const submissions: Submission[] = dbSubmissions.map((s) => ({
      id: s.id,
      assignmentId: s.assignmentId,
      versionNumber: s.versionNumber,
      fileName: s.fileName,
      fileUrl: s.fileUrl,
      fileSize: s.fileSize || undefined,
      proofUrl: s.proofUrl || undefined,
      submissionLink: s.submissionLink || undefined,
      notes: s.notes || undefined,
      uploadedAt: s.uploadedAt.toISOString(),
    }));

    const notes: NoteComment[] = dbNotes.map((n) => ({
      id: n.id,
      courseId: n.courseId || undefined,
      materialId: n.materialId || undefined,
      assignmentId: n.assignmentId || undefined,
      type: n.type as "SUMMARY_NOTE" | "COMMENT_LOG",
      contentMarkdown: n.contentMarkdown,
      isShared: n.isShared,
      shareToken: n.shareToken || undefined,
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.createdAt.toISOString(),
    }));

    return {
      success: true,
      semesters,
      courses,
      materials,
      assignments,
      submissions,
      notes,
    };
  } catch (error) {
    console.error("Failed to load initial vault data from SQLite:", error);
    return {
      success: false,
      semesters: INITIAL_SEMESTERS,
      courses: INITIAL_COURSES,
      materials: INITIAL_MATERIALS,
      assignments: INITIAL_ASSIGNMENTS,
      submissions: INITIAL_SUBMISSIONS,
      notes: INITIAL_NOTES,
    };
  }
}

export async function seedDatabase() {
  // Create Semesters
  for (const s of INITIAL_SEMESTERS) {
    await prisma.semester.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        name: s.name,
        startDate: s.startDate,
        endDate: s.endDate,
        isActive: s.isActive,
        createdAt: new Date(s.createdAt),
      },
    });
  }

  // Create Courses
  for (const c of INITIAL_COURSES) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        semesterId: c.semesterId,
        code: c.code,
        name: c.name,
        credits: c.credits,
        lecturerName: c.lecturerName,
        scheduleDay: c.scheduleDay,
        scheduleTime: c.scheduleTime,
        roomOrLink: c.roomOrLink,
        pastelThemeId: c.pastelThemeId,
        pastelColorHex: c.pastelColorHex,
        pastelTextHex: c.pastelTextHex,
        createdAt: new Date(c.createdAt),
      },
    });
  }

  // Create Materials
  for (const m of INITIAL_MATERIALS) {
    await prisma.material.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        courseId: m.courseId,
        weekNumber: m.weekNumber,
        title: m.title,
        description: m.description,
        category: m.category,
        fileUrl: m.fileUrl,
        fileName: m.fileName,
        fileSize: m.fileSize,
        mimeType: m.mimeType,
        externalUrl: m.externalUrl,
        tagsJson: JSON.stringify(m.tags),
        createdAt: new Date(m.createdAt),
      },
    });
  }

  // Create Assignments
  for (const a of INITIAL_ASSIGNMENTS) {
    await prisma.assignment.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        courseId: a.courseId,
        weekNumber: a.weekNumber,
        title: a.title,
        instructions: a.instructions,
        attachmentUrl: a.attachmentUrl,
        attachmentName: a.attachmentName,
        dueDate: a.dueDate,
        priority: a.priority,
        status: a.status,
        type: a.type,
        weightPercentage: a.weightPercentage,
        score: a.score,
        gradeLetter: a.gradeLetter,
        lecturerFeedback: a.lecturerFeedback,
        submittedAt: a.submittedAt,
        createdAt: new Date(a.createdAt),
      },
    });
  }

  // Create Submissions
  for (const s of INITIAL_SUBMISSIONS) {
    await prisma.submission.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        assignmentId: s.assignmentId,
        versionNumber: s.versionNumber,
        fileName: s.fileName,
        fileUrl: s.fileUrl,
        fileSize: s.fileSize,
        proofUrl: s.proofUrl,
        submissionLink: s.submissionLink,
        notes: s.notes,
        uploadedAt: new Date(s.uploadedAt),
      },
    });
  }

  // Create Notes
  for (const n of INITIAL_NOTES) {
    await prisma.noteComment.upsert({
      where: { id: n.id },
      update: {},
      create: {
        id: n.id,
        courseId: n.courseId,
        materialId: n.materialId,
        assignmentId: n.assignmentId,
        type: n.type,
        contentMarkdown: n.contentMarkdown,
        isShared: n.isShared || false,
        shareToken: n.shareToken,
        createdAt: new Date(n.createdAt),
      },
    });
  }
}

// Course Actions
export async function createCourseAction(course: Course) {
  try {
    const created = await prisma.course.create({
      data: {
        id: course.id,
        semesterId: course.semesterId,
        code: course.code,
        name: course.name,
        credits: course.credits,
        lecturerName: course.lecturerName,
        scheduleDay: course.scheduleDay,
        scheduleTime: course.scheduleTime,
        roomOrLink: course.roomOrLink,
        pastelThemeId: course.pastelThemeId,
        pastelColorHex: course.pastelColorHex,
        pastelTextHex: course.pastelTextHex,
        createdAt: new Date(course.createdAt),
      },
    });
    return { success: true, course: created };
  } catch (error) {
    console.error("createCourseAction error:", error);
    return { success: false, error };
  }
}

export async function updateCourseAction(id: string, data: Partial<Course>) {
  try {
    const updated = await prisma.course.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        credits: data.credits,
        lecturerName: data.lecturerName,
        scheduleDay: data.scheduleDay,
        scheduleTime: data.scheduleTime,
        roomOrLink: data.roomOrLink,
        pastelThemeId: data.pastelThemeId,
        pastelColorHex: data.pastelColorHex,
        pastelTextHex: data.pastelTextHex,
      },
    });
    return { success: true, course: updated };
  } catch (error) {
    console.error("updateCourseAction error:", error);
    return { success: false, error };
  }
}

export async function deleteCourseAction(id: string) {
  try {
    await prisma.course.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("deleteCourseAction error:", error);
    return { success: false, error };
  }
}

// Assignment Actions
export async function createAssignmentAction(assignment: Assignment) {
  try {
    const created = await prisma.assignment.create({
      data: {
        id: assignment.id,
        courseId: assignment.courseId,
        weekNumber: assignment.weekNumber,
        title: assignment.title,
        instructions: assignment.instructions,
        attachmentUrl: assignment.attachmentUrl,
        attachmentName: assignment.attachmentName,
        dueDate: assignment.dueDate,
        priority: assignment.priority,
        status: assignment.status,
        type: assignment.type,
        weightPercentage: assignment.weightPercentage,
        score: assignment.score,
        gradeLetter: assignment.gradeLetter,
        lecturerFeedback: assignment.lecturerFeedback,
        submittedAt: assignment.submittedAt,
        createdAt: new Date(assignment.createdAt),
      },
    });
    return { success: true, assignment: created };
  } catch (error) {
    console.error("createAssignmentAction error:", error);
    return { success: false, error };
  }
}

export async function updateAssignmentStatusAction(id: string, status: AssignmentStatus) {
  try {
    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        status,
        submittedAt: status === "SUBMITTED" ? new Date().toISOString() : undefined,
      },
    });
    return { success: true, assignment: updated };
  } catch (error) {
    console.error("updateAssignmentStatusAction error:", error);
    return { success: false, error };
  }
}

export async function updateAssignmentGradeAction(
  id: string,
  score: number,
  feedback?: string,
  gradeLetter?: string
) {
  try {
    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        score,
        lecturerFeedback: feedback,
        gradeLetter,
      },
    });
    return { success: true, assignment: updated };
  } catch (error) {
    console.error("updateAssignmentGradeAction error:", error);
    return { success: false, error };
  }
}

// Material Actions
export async function createMaterialAction(material: Material) {
  try {
    const created = await prisma.material.create({
      data: {
        id: material.id,
        courseId: material.courseId,
        weekNumber: material.weekNumber,
        title: material.title,
        description: material.description,
        category: material.category,
        fileUrl: material.fileUrl,
        fileName: material.fileName,
        fileSize: material.fileSize,
        mimeType: material.mimeType,
        externalUrl: material.externalUrl,
        tagsJson: JSON.stringify(material.tags),
        createdAt: new Date(material.createdAt),
      },
    });
    return { success: true, material: created };
  } catch (error) {
    console.error("createMaterialAction error:", error);
    return { success: false, error };
  }
}

// Submission Actions
export async function createSubmissionAction(submission: Submission) {
  try {
    const created = await prisma.submission.create({
      data: {
        id: submission.id,
        assignmentId: submission.assignmentId,
        versionNumber: submission.versionNumber,
        fileName: submission.fileName,
        fileUrl: submission.fileUrl,
        fileSize: submission.fileSize,
        proofUrl: submission.proofUrl,
        submissionLink: submission.submissionLink,
        notes: submission.notes,
        uploadedAt: new Date(submission.uploadedAt),
      },
    });
    return { success: true, submission: created };
  } catch (error) {
    console.error("createSubmissionAction error:", error);
    return { success: false, error };
  }
}

// Note Actions
export async function saveNoteCommentAction(note: NoteComment) {
  try {
    const saved = await prisma.noteComment.upsert({
      where: { id: note.id },
      update: {
        contentMarkdown: note.contentMarkdown,
        isShared: note.isShared,
        shareToken: note.shareToken,
      },
      create: {
        id: note.id,
        courseId: note.courseId,
        materialId: note.materialId,
        assignmentId: note.assignmentId,
        type: note.type,
        contentMarkdown: note.contentMarkdown,
        isShared: note.isShared,
        shareToken: note.shareToken,
        createdAt: new Date(note.createdAt),
      },
    });
    return { success: true, note: saved };
  } catch (error) {
    console.error("saveNoteCommentAction error:", error);
    return { success: false, error };
  }
}

export async function toggleShareNoteAction(id: string, isShared: boolean, shareToken?: string) {
  try {
    const updated = await prisma.noteComment.update({
      where: { id },
      data: {
        isShared,
        shareToken,
      },
    });
    return { success: true, note: updated };
  } catch (error) {
    console.error("toggleShareNoteAction error:", error);
    return { success: false, error };
  }
}

// Semester Actions
export async function createSemesterAction(semester: Semester) {
  try {
    const created = await prisma.semester.create({
      data: {
        id: semester.id,
        name: semester.name,
        startDate: semester.startDate,
        endDate: semester.endDate,
        isActive: semester.isActive,
        createdAt: new Date(semester.createdAt),
      },
    });
    return { success: true, semester: created };
  } catch (error) {
    console.error("createSemesterAction error:", error);
    return { success: false, error };
  }
}

export async function deleteSemesterAction(id: string) {
  try {
    await prisma.semester.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("deleteSemesterAction error:", error);
    return { success: false, error };
  }
}
