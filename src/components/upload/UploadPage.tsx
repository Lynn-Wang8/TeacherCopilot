"use client";

import Dropzone from "./Dropzone";
import PreviewList from "./PreviewList";
import { useUpload } from "@/hooks/useUpload";

interface UploadPageProps {
  onStartAnalysis: (files: File[]) => void;
}

export default function UploadPage({ onStartAnalysis }: UploadPageProps) {
  const { files, status, error, addFiles, removeFile } = useUpload();

  const hasFiles = files.length > 0;

  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <div className="w-full max-w-[640px] rounded-card border border-border bg-surface p-12 text-center shadow-card">
        <h1 className="mb-2 text-2xl font-bold text-text-primary">
          📤 上传错题图片
        </h1>
        <p className="mb-8 text-text-secondary">
          将学生作业或试卷照片拖入下方区域，支持批量上传
        </p>

        {/* 上传区域 */}
        <Dropzone onFilesAdded={(fileList) => addFiles(fileList)} />

        {/* 错误提示 */}
        {error && (
          <p className="mt-3 text-sm text-danger">{error}</p>
        )}

        {/* 缩略图预览 */}
        <PreviewList files={files} onRemove={removeFile} />

        {/* 开始分析按钮 */}
        <button
          onClick={() => {
            const rawFiles = files.map((f) => {
              // 从 blob URL 还原 File 对象（MVP 阶段保留引用）
              // 后续接 API 时改为上传后拿到的 URL
              return new File([], f.file_name);
            });
            onStartAnalysis(rawFiles);
          }}
          disabled={!hasFiles}
          className={`mt-7 inline-flex items-center gap-2 rounded-btn px-10 py-3.5 text-base font-semibold transition-all ${
            hasFiles
              ? "bg-primary text-white hover:bg-primary-hover cursor-pointer"
              : "cursor-not-allowed bg-[#93C5FD] text-white"
          }`}
        >
          ⚡ {hasFiles ? `开始分析（${files.length} 张图片）` : "开始分析"}
        </button>

        {/* 状态指示 */}
        {status === "uploading" && (
          <p className="mt-3 text-sm text-text-muted">上传中...</p>
        )}
        {status === "uploaded" && (
          <p className="mt-3 text-sm text-success">
            ✅ 已就绪 {files.length} 张图片，点击上方按钮开始 AI 分析
          </p>
        )}
      </div>
    </div>
  );
}
