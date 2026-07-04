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

      {/* ── Page 3: Workspace ── */}
      {currentPage === "workspace" && <WorkspacePage />}
    </div>
  );
}
