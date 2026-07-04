"use client";

import { useState } from "react";
import Header from "@/components/shared/Header";
import UploadPage from "@/components/upload/UploadPage";
import AnalysisPage from "@/components/analysis/AnalysisPage";
import WorkspacePage from "@/components/workspace/WorkspacePage";

type AppPage = "upload" | "analysis" | "workspace";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<AppPage>("upload");
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        currentPage={currentPage}
        actions={
          currentPage === "workspace" ? (
            <button
              onClick={() => {
                // TODO: Phase 6 — Export Drawer
                alert("导出功能将在 Phase 6 实现");
              }}
              className="rounded-btn bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              📄 导出 Word
            </button>
          ) : undefined
        }
      />

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

      {/* ── Page 3: Workspace ── */}
      {currentPage === "workspace" && (
        <WorkspacePage
          onExport={() => {
            // TODO: Phase 6 — Export Drawer
            alert("导出功能将在 Phase 6 实现");
          }}
        />
      )}
    </div>
  );
}
