"use client";

import React, { useState } from "react";
import {
  Bold,
  Italic,
  List,
  Code,
  Quote,
  Eye,
  Edit3,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content,
  onChange,
  placeholder = "Tulis catatan kuliah, rangkuman, atau poin penting...",
}) => {
  const [isPreview, setIsPreview] = useState(false);

  const insertText = (prefix: string, suffix: string = "") => {
    onChange(`${content}\n${prefix}Teks Anda di sini${suffix}\n`);
  };

  const insertCallout = (type: "NOTE" | "TIP" | "IMPORTANT" | "WARNING") => {
    const callout = `> [!${type}]\n> Tulis pesan penting di sini...\n`;
    onChange(`${content}\n${callout}`);
  };

  // Basic markdown parser for preview
  const renderPreview = (text: string) => {
    if (!text) {
      return (
        <p className="text-xs text-slate-400 italic">
          Belum ada catatan yang ditulis.
        </p>
      );
    }

    const lines = text.split("\n");
    return (
      <div className="space-y-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200 markdown-body">
        {lines.map((line, i) => {
          if (line.startsWith("> [!NOTE]")) {
            return (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#E0E7FF] text-[#3730A3] border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-200 my-2 font-medium"
              >
                <span className="font-bold flex items-center gap-1 mb-1">
                  <Info className="w-3.5 h-3.5" /> CATATAN PENTING:
                </span>
                <span>{lines[i + 1]?.replace(/^>\s*/, "")}</span>
              </div>
            );
          }
          if (line.startsWith("> [!TIP]")) {
            return (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#D1FAE5] text-[#065F46] border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 my-2 font-medium"
              >
                <span className="font-bold flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> TIPS & TRIK:
                </span>
                <span>{lines[i + 1]?.replace(/^>\s*/, "")}</span>
              </div>
            );
          }
          if (line.startsWith("> [!WARNING]")) {
            return (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#FFE4E6] text-[#9F1239] border border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 my-2 font-medium"
              >
                <span className="font-bold flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> PERHATIAN:
                </span>
                <span>{lines[i + 1]?.replace(/^>\s*/, "")}</span>
              </div>
            );
          }
          if (line.startsWith(">")) {
            return null; // Handled in callout or blockquote
          }
          if (line.startsWith("### ")) {
            return (
              <h3 key={i} className="text-sm font-bold text-indigo-700 dark:text-indigo-400 mt-2">
                {line.replace("### ", "")}
              </h3>
            );
          }
          if (line.startsWith("## ")) {
            return (
              <h2 key={i} className="text-base font-bold text-slate-800 dark:text-slate-100 mt-3">
                {line.replace("## ", "")}
              </h2>
            );
          }
          if (line.startsWith("# ")) {
            return (
              <h1 key={i} className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-3">
                {line.replace("# ", "")}
              </h1>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <li key={i} className="ml-4 list-disc text-slate-700 dark:text-slate-300">
                {line.replace("- ", "")}
              </li>
            );
          }
          if (line.startsWith("```")) {
            return null;
          }
          if (!line.trim()) {
            return <div key={i} className="h-1.5" />;
          }
          return (
            <p key={i} className="text-slate-700 dark:text-slate-300">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-slate-100 dark:border-slate-800 bg-[#FDFBF7] dark:bg-slate-900/90 text-xs flex-wrap gap-1">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => insertText("**", "**")}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            title="Tebal (Bold)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertText("*", "*")}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            title="Miring (Italic)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertText("- ")}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            title="Daftar Bullet"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertText("```typescript\n", "\n```")}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            title="Kode Blok"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Pastel Callout Buttons */}
          <button
            type="button"
            onClick={() => insertCallout("NOTE")}
            className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-[#E0E7FF] text-[#3730A3] hover:bg-indigo-200"
            title="Sisipkan Callout Pastel Lavender"
          >
            + [!NOTE]
          </button>
          <button
            type="button"
            onClick={() => insertCallout("TIP")}
            className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-[#D1FAE5] text-[#065F46] hover:bg-emerald-200"
            title="Sisipkan Callout Pastel Mint"
          >
            + [!TIP]
          </button>
          <button
            type="button"
            onClick={() => insertCallout("WARNING")}
            className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-[#FFE4E6] text-[#9F1239] hover:bg-rose-200"
            title="Sisipkan Callout Pastel Rose"
          >
            + [!WARNING]
          </button>
        </div>

        {/* Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
        >
          {isPreview ? (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </>
          )}
        </button>
      </div>

      {/* Editor / Preview Area */}
      <div className="flex-1 p-3 overflow-y-auto">
        {isPreview ? (
          <div className="p-2">{renderPreview(content)}</div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[220px] resize-none bg-transparent text-xs font-mono text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none leading-relaxed"
          />
        )}
      </div>
    </div>
  );
};
