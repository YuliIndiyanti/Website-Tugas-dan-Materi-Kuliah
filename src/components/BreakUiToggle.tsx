"use client";

import React from "react";
import { useVault, DatasetMode } from "@/context/VaultContext";
import { Sparkles, AlertOctagon, Inbox } from "lucide-react";

export const BreakUiToggle: React.FC = () => {
  const { datasetMode, switchDatasetMode } = useVault();

  const options: { mode: DatasetMode; label: string; icon: React.ReactNode; color: string }[] = [
    {
      mode: "DEMO",
      label: "Demo Data",
      icon: <Sparkles className="w-3.5 h-3.5" />,
      color: "bg-[#E0E7FF] text-[#3730A3] dark:bg-[#312E81] dark:text-[#E0E7FF]",
    },
    {
      mode: "WORST_CASE",
      label: "Worst-Case UI",
      icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />,
      color: "bg-[#FFE4E6] text-[#9F1239] dark:bg-[#9F1239]/40 dark:text-[#FECDD3]",
    },
    {
      mode: "EMPTY",
      label: "Kosong (Empty)",
      icon: <Inbox className="w-3.5 h-3.5 text-slate-500" />,
      color: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
    },
  ];

  return (
    <aside
      aria-label="Pengatur Dataset Pengujian UI"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 p-1 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-300/80 dark:border-slate-700 shadow-2xl backdrop-blur-md"
    >
      <div className="hidden sm:flex items-center gap-1.5 pl-3 pr-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-r border-slate-200 dark:border-slate-800">
        <span>Break-UI</span>
      </div>

      <div className="flex items-center gap-1">
        {options.map((opt) => {
          const isActive = datasetMode === opt.mode;
          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => switchDatasetMode(opt.mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? `${opt.color} shadow-sm scale-100`
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
              }`}
              aria-pressed={isActive}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
