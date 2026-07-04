"use client";

import { useRef, type DragEvent } from "react";

interface DropzoneProps {
  onFilesAdded: (files: FileList) => void;
}

export default function Dropzone({ onFilesAdded }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dropRef.current?.classList.add("border-primary", "bg-primary-light");
  }

  function handleDragLeave() {
    dropRef.current?.classList.remove("border-primary", "bg-primary-light");
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dropRef.current?.classList.remove("border-primary", "bg-primary-light");
    if (e.dataTransfer.files.length > 0) {
      onFilesAdded(e.dataTransfer.files);
    }
  }

  return (
    <div
      ref={dropRef}
      className="cursor-pointer rounded-card border-2 border-dashed border-border bg-background p-12 text-center transition-all duration-200"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className="mb-3 text-[40px]">🖼️</div>
      <p className="text-sm text-text-secondary">
        拖拽图片到此处 或 <strong className="text-primary">点击选择文件</strong>
      </p>
      <p className="mt-2 text-xs text-text-muted">
        支持 JPG / PNG · 单次最多 20 张
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onFilesAdded(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
