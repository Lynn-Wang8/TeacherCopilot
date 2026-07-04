"use client";

import { useState } from "react";
import type { Chapter, Question, Reference } from "@/types";

interface SidebarProps {
  chapter: Chapter;
  allTypes: Reference[];
  questions: Question[];
  activeFilter: string | null;
  onFilterChange: (typeId: string | null) => void;
  onCreateCustomType: (name: string) => void;
}

export default function Sidebar({
  chapter,
  allTypes,
  questions,
  activeFilter,
  onFilterChange,
  onCreateCustomType,
}: SidebarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  // 统计每个题型下的题目数量
  const counts: Record<string, number> = {};
  questions.forEach((q) => {
    const id = q.question_type.id;
    counts[id] = (counts[id] || 0) + 1;
  });

  const total = questions.length;

  function handleCreate() {
    if (!newName.trim()) return;
    onCreateCustomType(newName.trim());
    setNewName("");
    setIsAdding(false);
  }

  return (
    <aside className="flex w-sidebar flex-shrink-0 flex-col overflow-y-auto border-r border-border bg-surface">
      {/* 章节标题 */}
      <div className="border-b border-border px-4 py-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-text-muted">
          章节
        </div>
        <div className="mt-1 text-[15px] font-bold text-text-primary">
          📐 {chapter.name}
        </div>
      </div>

      {/* 题型目录 */}
      <div className="px-4 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-text-muted">
        📋 题型目录
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {allTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => onFilterChange(type.id)}
            className={`flex cursor-pointer items-center justify-between gap-2 rounded-btn border px-3 py-2.5 text-[13px] transition-all ${
              activeFilter === type.id
                ? "border-primary bg-primary-light font-semibold text-primary"
                : "border-transparent hover:bg-background"
            }`}
          >
            <span className="truncate">{type.name}</span>
            <span
              className={`rounded-full px-2 py-px text-xs ${
                activeFilter === type.id
                  ? "bg-[#DBEAFE] text-primary"
                  : "bg-background text-text-muted"
              }`}
            >
              {counts[type.id] || 0}
            </span>
          </div>
        ))}

        {/* 全部题目 */}
        <div
          onClick={() => onFilterChange(null)}
          className={`mt-1 flex cursor-pointer items-center justify-between gap-2 rounded-btn border px-3 py-2.5 text-[13px] font-medium transition-all ${
            activeFilter === null
              ? "border-primary bg-primary-light font-semibold text-primary"
              : "border-transparent hover:bg-background"
          }`}
        >
          <span>📋 全部题目</span>
          <span
            className={`rounded-full px-2 py-px text-xs ${
              activeFilter === null
                ? "bg-[#DBEAFE] text-primary"
                : "bg-background text-text-muted"
            }`}
          >
            {total}
          </span>
        </div>
      </div>

      {/* 创建自定义题型 */}
      <div className="border-t border-border p-3">
        {isAdding ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setIsAdding(false);
              }}
              placeholder="输入新题型名称"
              autoFocus
              className="w-full rounded-btn border border-border px-3 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
            />
            <div className="flex gap-1.5">
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="flex-1 rounded-btn bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-[#93C5FD]"
              >
                确定
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewName("");
                }}
                className="flex-1 rounded-btn border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary hover:bg-background"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full rounded-btn border border-dashed border-border px-3 py-2 text-xs text-text-muted transition-colors hover:border-primary hover:text-primary"
          >
            ＋ 新建自定义题型
          </button>
        )}
      </div>
    </aside>
  );
}
