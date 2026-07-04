"use client";

import { useState } from "react";
import type { ChapterData } from "@/types";
import Header from "@/components/shared/Header";
import UploadPage from "@/components/upload/UploadPage";
import AnalysisPage from "@/components/analysis/AnalysisPage";
import WorkspacePage from "@/components/workspace/WorkspacePage";

type AppPage = "upload" | "analysis" | "workspace";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<AppPage>("upload");
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<ChapterData | null>(null);

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentPage={currentPage} />

      {currentPage === "upload" && (
        <UploadPage
          onStartAnalysis={(files) => {
            setUploadedFileNames(files.map((f) => f.name));
            setCurrentPage("analysis");
          }}
        />
      )}

      {currentPage === "analysis" && (
        <AnalysisPage
          fileCount={uploadedFileNames.length}
          onComplete={(data) => {
            setAnalysisResult(data);
            setCurrentPage("workspace");
          }}
          onRetry={() => setCurrentPage("upload")}
        />
      )}

      {currentPage === "workspace" && (
        <WorkspacePage initialData={analysisResult} />
      )}
    </div>
  );
}
