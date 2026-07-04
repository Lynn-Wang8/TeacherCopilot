"use client";

import { useState } from "react";
import Header from "@/components/shared/Header";
import UploadPage from "@/components/upload/UploadPage";
import AnalysisPage from "@/components/analysis/AnalysisPage";

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

      {/* ── Page 2: Analysis ── */}
      {currentPage === "analysis" && (
        <AnalysisPage
          fileCount={uploadedFileNames.length}
          onComplete={() => setCurrentPage("workspace")}
          onRetry={() => setCurrentPage("upload")}
        />
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
