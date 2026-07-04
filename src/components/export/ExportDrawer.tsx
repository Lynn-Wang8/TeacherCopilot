"use client";

import { useState } from "react";

interface ExportDrawerProps {
  open: boolean;
  chapterName: string;
  questionCount: number;
  typeCount: number;
  onClose: () => void;
  onExport: (fileName: string) => void;
}

export default function ExportDrawer({
  open,
  chapterName,
  questionCount,
  typeCount,
  onClose,
  onExport,
}: ExportDrawerProps) {
  const today = new Date().toISOString().slice(0, 10);
  const defaultName = `${today} 三角形错题整理`;

  const [fileName, setFileName] = useState(defaultName);
  const [format, setFormat] = useState<"docx" | "pdf">("docx");

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 right-0 top-0 z-50 flex w-[460px] max-w-full animate-[slideIn_0.2s_ease-out] flex-col gap-5 bg-surface p-6 shadow-[-4px_0_20px_rgba(0,0,0,.1)]">
        <h3 className="text-lg font-bold">📄 导出备课讲义</h3>

        {/* 文件名 */}
        <Field label="文件名称">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full rounded-btn border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </Field>

        {/* 导出格式 */}
        <Field label="导出格式">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as "docx" | "pdf")}
            className="w-full rounded-btn border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="docx">📝 DOCX（可编辑 Word 文档）</option>
            <option value="pdf" disabled>
              📕 PDF（Coming Soon）
            </option>
          </select>
        </Field>

        {/* 导出预览 */}
        <div className="rounded-btn bg-background p-3 text-xs text-text-muted">
          📋 导出内容预览：
          <br />
          {chapterName} → {typeCount} 个题型分组 → {questionCount} 道题
          （含原图 + OCR + 易错点 + 模型 + 教师备注）
        </div>

        {/* 按钮 */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-btn border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-background"
          >
            取消
          </button>
          <button
            onClick={() => onExport(fileName)}
            className="flex-1 rounded-btn bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            ⬇ 导出
          </button>
        </div>
      </div>

      {/* Slide-in animation */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
