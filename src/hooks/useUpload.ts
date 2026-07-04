"use client";

import { useState, useCallback } from "react";
import type { UploadImage } from "@/types";

/** 允许的文件类型 */
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

/** 文件大小上限：20MB */
const MAX_SIZE = 20 * 1024 * 1024;

interface UseUploadReturn {
  files: UploadImage[];
  rawFiles: File[];
  status: "empty" | "uploading" | "uploaded" | "error";
  error: string | null;
  addFiles: (fileList: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearAll: () => void;
}

export function useUpload(): UseUploadReturn {
  const [files, setFiles] = useState<UploadImage[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<UseUploadReturn["status"]>("empty");
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback((fileList: FileList | File[]) => {
    setError(null);
    const incoming = Array.from(fileList);

    // 格式校验
    const invalid = incoming.filter((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalid.length > 0) {
      setError(`不支持的格式：${invalid.map((f) => f.name).join("、")}`);
      return;
    }

    // 大小校验
    const oversized = incoming.filter((f) => f.size > MAX_SIZE);
    if (oversized.length > 0) {
      setError(`文件过大（超过 20MB）：${oversized.map((f) => f.name).join("、")}`);
      return;
    }

    setStatus("uploading");

    const newFiles: UploadImage[] = incoming.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file_name: file.name,
      preview_url: URL.createObjectURL(file),
      status: "success" as const,
    }));

    setFiles((prev) => {
      const updated = [...prev, ...newFiles];
      setStatus(updated.length > 0 ? "uploaded" : "empty");
      return updated;
    });
    setRawFiles((prev) => [...prev, ...incoming]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview_url);
      const idx = prev.findIndex((f) => f.id === id);
      if (idx >= 0) {
        setRawFiles((prev2) => prev2.filter((_, i) => i !== idx));
      }
      const updated = prev.filter((f) => f.id !== id);
      setStatus(updated.length > 0 ? "uploaded" : "empty");
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.preview_url));
    setFiles([]);
    setRawFiles([]);
    setStatus("empty");
    setError(null);
  }, [files]);

  return { files, rawFiles, status, error, addFiles, removeFile, clearAll };
}
