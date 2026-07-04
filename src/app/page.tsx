"use client";

import { useState } from "react";
import Header from "@/components/shared/Header";
import UploadPage from "@/components/upload/UploadPage";

type AppPage = "upload" | "analysis" | "workspace";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<AppPage>("upload");
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentPage={currentPage} />

      {/* ── Page 1: Upload ── */}
      {currentPage === "upload" && (
        <UploadPage
          onStartAnalysis={(files) => {
            setUploadedFileNames(files.map((f) => f.name));
            setCurrentPage("analysis");
          }}
        />
      )}

      {/* ── Page 2: Analysis (Phase 4 占位) ── */}
      {currentPage === "analysis" && (
        <div className="flex flex-1 items-center justify-center p-10">
          <div className="w-full max-w-[520px] rounded-card border border-border bg-surface p-12 text-center shadow-card">
            <h2 className="mb-8 text-xl font-bold">🤖 AI 正在分析中...</h2>
            <p className="text-text-secondary">
              已接收 {uploadedFileNames.length} 张图片
            </p>
            <p className="mt-1 text-sm text-text-muted">
              分析组件将在 Phase 4 实现
            </p>
            <button
              onClick={() => setCurrentPage("workspace")}
              className="mt-6 rounded-btn bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              跳过动画 → 进入工作台
            </button>
            <button
              onClick={() => setCurrentPage("upload")}
              className="mt-3 block w-full rounded-btn border border-border bg-surface px-6 py-2 text-sm font-semibold text-text-primary hover:bg-background"
            >
              ← 返回上传
            </button>
          </div>
        </div>
      )}

      {/* ── Page 3: Workspace (Phase 5 占位) ── */}
      {currentPage === "workspace" && (
        <div className="flex flex-1 items-center justify-center p-10">
          <div className="w-full max-w-[520px] rounded-card border border-border bg-surface p-12 text-center shadow-card">
            <h2 className="text-xl font-bold">📋 教师工作台</h2>
            <p className="mt-2 text-text-secondary">
              三栏布局工作台将在 Phase 5 实现
            </p>
            <button
              onClick={() => setCurrentPage("upload")}
              className="mt-6 rounded-btn border border-border bg-surface px-6 py-2 text-sm font-semibold text-text-primary hover:bg-background"
            >
              ← 回到上传
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
