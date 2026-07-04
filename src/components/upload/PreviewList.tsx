"use client";

import type { UploadImage } from "@/types";

interface PreviewListProps {
  files: UploadImage[];
  onRemove: (id: string) => void;
}

export default function PreviewList({ files, onRemove }: PreviewListProps) {
  if (files.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {files.map((file) => (
        <div
          key={file.id}
          className="group relative h-[100px] w-[100px] overflow-hidden rounded-btn border border-border bg-slate-100"
        >
          {/* 图片预览 */}
          {file.preview_url ? (
            <img
              src={file.preview_url}
              alt={file.file_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-text-muted">
              📄
            </div>
          )}

          {/* 删除按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(file.id);
            }}
            className="absolute right-1 top-1 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black/50 text-sm text-white opacity-0 transition-opacity hover:bg-danger group-hover:opacity-100"
            title="删除"
          >
            ×
          </button>

          {/* 文件名 */}
          <div className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1.5 py-0.5 text-[10px] text-white text-center">
            {file.file_name}
          </div>
        </div>
      ))}
    </div>
  );
}
