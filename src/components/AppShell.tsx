"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoginPage } from "./LoginPage";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "./CommandPalette";
import { NewAssignmentModal } from "./NewAssignmentModal";
import { NewMaterialModal } from "./NewMaterialModal";
import { CourseModal } from "./CourseModal";
import { SemesterModal } from "./SemesterModal";
import { TelegramReminderModal } from "./TelegramReminderModal";
import { AssignmentModal } from "./AssignmentModal";
import { MaterialPreviewModal } from "./MaterialPreviewModal";
import { BreakUiToggle } from "./BreakUiToggle";
import { Toaster } from "sonner";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [isUploadMaterialOpen, setIsUploadMaterialOpen] = useState(false);
  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false);
  const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  // Allow access to shared material links without forcing login
  const isPublicRoute = pathname?.startsWith("/shared/");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F2EB] dark:bg-[#150E0A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFDFB] dark:bg-[#201610] border border-[#E3D6C9] dark:border-[#38261B] flex items-center justify-center text-xl shadow-xs animate-pulse">
            ☕
          </div>
          <p className="text-xs font-semibold text-[#6B5547] dark:text-[#B8A495] tracking-wide">
            Memuat Yuli&apos;s Vault...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicRoute) {
    return (
      <>
        <LoginPage />
        <Toaster
          position="bottom-right"
          closeButton
          richColors
          toastOptions={{
            style: {
              borderRadius: "1.25rem",
              padding: "0.875rem 1rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
            },
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2EB] dark:bg-[#150E0A] text-[#2A1810] dark:text-[#FAF5F0] transition-colors">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNewAssignment={() => setIsNewAssignmentOpen(true)}
        onOpenUploadMaterial={() => setIsUploadMaterialOpen(true)}
        onOpenSemesterModal={() => setIsSemesterModalOpen(true)}
        onOpenReminderModal={() => setIsReminderModalOpen(true)}
      />

      <div className="flex-1 flex w-full">
        {/* Left Sidebar */}
        <Sidebar onOpenNewCourse={() => setIsNewCourseOpen(true)} />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenMaterialPreview={(id) => setSelectedMaterialId(id)}
        onOpenAssignmentDetail={(id) => setSelectedAssignmentId(id)}
      />

      <NewAssignmentModal
        isOpen={isNewAssignmentOpen}
        onClose={() => setIsNewAssignmentOpen(false)}
      />

      <NewMaterialModal
        isOpen={isUploadMaterialOpen}
        onClose={() => setIsUploadMaterialOpen(false)}
      />

      <CourseModal
        isOpen={isNewCourseOpen}
        onClose={() => setIsNewCourseOpen(false)}
      />

      <SemesterModal
        isOpen={isSemesterModalOpen}
        onClose={() => setIsSemesterModalOpen(false)}
      />

      <TelegramReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
      />

      <AssignmentModal
        assignmentId={selectedAssignmentId}
        onClose={() => setSelectedAssignmentId(null)}
      />

      <MaterialPreviewModal
        materialId={selectedMaterialId}
        onClose={() => setSelectedMaterialId(null)}
      />

      {/* Dev-Only Break-UI Toggle */}
      <BreakUiToggle />

      {/* Modern Toast System (Sonner) */}
      <Toaster
        position="bottom-right"
        closeButton
        richColors
        toastOptions={{
          style: {
            borderRadius: "1.25rem",
            padding: "0.875rem 1rem",
            fontSize: "0.8125rem",
            fontWeight: 600,
          },
        }}
      />
    </div>
  );
};
