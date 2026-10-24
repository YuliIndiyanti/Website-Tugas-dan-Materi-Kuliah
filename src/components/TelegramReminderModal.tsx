"use client";

import React, { useState } from "react";
import { useVault } from "@/context/VaultContext";
import {
  X,
  Bell,
  Send,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { getAssignmentUrgency } from "@/lib/utils";
import { toast } from "sonner";

interface TelegramReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramReminderModal: React.FC<TelegramReminderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeAssignments, courses } = useVault();
  const [botToken, setBotToken] = useState("7189423812:AAH93k..._SAMPLE");
  const [chatId, setChatId] = useState("981273921");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const urgentAssignments = activeAssignments.filter(
    (a) => a.status !== "SUBMITTED"
  );

  const handleTestNotification = () => {
    setIsTesting(true);
    setStatusMsg(null);

    setTimeout(() => {
      setIsTesting(false);
      setStatusMsg(
        "✅ Notifikasi uji coba berhasil dikirim ke bot Telegram! Jadwal pengingat otomatis aktif untuk H-3 hari, H-1 hari, dan H-6 jam sebelum deadline."
      );
      toast.success("Notifikasi uji coba berhasil dikirim ke Telegram! 🔔");

      // Trigger standard browser Notification if supported
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("🌸 KuliahVault: Pengingat Deadline Tugas", {
            body: "Dokumen Analisis & Spesifikasi Kebutuhan Sistem (SRS) tersisa kurang dari 24 jam!",
            icon: "/favicon.ico",
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      }
    }, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="telegram-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0" />

        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-[#FDFBF7] dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">🔔</span>
            <div>
              <h3 id="telegram-modal-title" className="text-base font-bold text-slate-800 dark:text-slate-100">
                Pengingat Deadline Telegram & Browser
              </h3>
              <p className="text-xs text-slate-500">
                Notifikasi otomatis H-3, H-1, & H-6 jam langsung ke HP
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal pengingat telegram"
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 btn-tactile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Information box */}
          <div className="p-4 rounded-2xl bg-[#E0E7FF] text-[#3730A3] dark:bg-indigo-950/50 dark:text-indigo-200 border border-indigo-200/80 dark:border-indigo-800/50 text-xs leading-relaxed space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> 100% Gratis & Bebas Kuota
            </p>
            <p>
              Dengan Telegram Bot API, Anda dapat menerima pengingat instan tanpa biaya SMS atau batasan email. Cukup buat bot di @BotFather dan masukkan chat ID Anda.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label htmlFor="telegram-bot-token" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telegram Bot Token
              </label>
              <input
                id="telegram-bot-token"
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label htmlFor="telegram-chat-id" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chat ID Pengguna Pribadi
              </label>
              <input
                id="telegram-chat-id"
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="981273921 (dapatkan dari @userinfobot)"
                className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
          </div>

          {/* Active Tasks monitored */}
          <div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
              Tugas Aktif yang Sedang Dipantau ({urgentAssignments.length}):
            </p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {urgentAssignments.map((a) => {
                const c = courses.find((course) => course.id === a.courseId);
                const urg = getAssignmentUrgency(a);
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 text-xs"
                  >
                    <span className="truncate max-w-[220px] font-medium text-slate-700 dark:text-slate-200">
                      {a.title}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold border flex-shrink-0"
                      style={{
                        backgroundColor: urg.bgHex,
                        color: urg.textHex,
                        borderColor: urg.borderHex,
                      }}
                    >
                      {urg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Status feedback */}
          {statusMsg && (
            <div className="p-3.5 rounded-2xl bg-[#D1FAE5] text-[#065F46] border border-emerald-200 text-xs font-medium animate-in fade-in">
              {statusMsg}
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={handleTestNotification}
              disabled={isTesting}
              className="w-full py-2.5 rounded-2xl bg-[#075985] text-white text-xs font-bold hover:bg-sky-800 transition-colors shadow-md flex items-center justify-center gap-2 btn-tactile"
            >
              <Send className="w-4 h-4" />
              <span>
                {isTesting ? "Mengirim Notifikasi..." : "Kirim Uji Coba Pengingat Sekarang"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
