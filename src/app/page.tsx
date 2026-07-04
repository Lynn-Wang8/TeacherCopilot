"use client";

import { useState } from "react";
import { ChapterData } from "@/types";
import mockQuestions from "@/data/mockQuestions";

// ── App State ──
type AppPage = "upload" | "analysis" | "workspace";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<AppPage>("upload");
  const [chapterData, setChapterData] = useState<ChapterData>(mockQuestions);

  // TODO: Phase 3 — Upload page
  // TODO: Phase 4 — Analysis page
  // TODO: Phase 5 — Workspace page

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex h-header items-center border-b border-border bg-surface px-6">
        <h1 className="text-lg font-bold text-primary">
          📐 Teacher <span className="font-medium text-text-primary">Copilot</span>
        </h1>
        <div className="ml-auto flex gap-1">
          {(["upload", "analysis", "workspace"] as AppPage[]).map((page, i) => (
            <span
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "bg-background text-text-muted hover:bg-primary-light"
              }`}
            >
              {i + 1} {page === "upload" ? "上传" : page === "analysis" ? "分析" : "工作台"}
            </span>
          ))}
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-1 items-center justify-center p-10">
        <div className="rounded-card border border-border bg-surface p-12 text-center shadow-card">
          <h2 className="mb-2 text-2xl font-bold">Phase 1 完成 ✅</h2>
          <p className="text-text-secondary">
            Next.js + TypeScript + Tailwind CSS 项目已就绪。
          </p>
          <p className="mt-1 text-sm text-text-muted">
            {chapterData.questions.length} 道 Mock 题目已加载 ·{" "}
            {chapterData.chapter.name}
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            {(["upload", "analysis", "workspace"] as AppPage[]).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`rounded-btn px-4 py-2 text-sm font-semibold transition-colors ${
                  currentPage === p
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-text-primary hover:bg-background"
                }`}
              >
                {p === "upload" ? "📤 Upload" : p === "analysis" ? "🤖 Analysis" : "📋 Workspace"}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
