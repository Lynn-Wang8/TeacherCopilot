"use client";

import { QUESTION_TYPES } from "@/data/skills";
import type { Question } from "@/types";

interface SidebarProps {
  questions: Question[];
  activeFilter: string | null;
  onFilterChange: (typeId: string | null) => void;
}

export default function Sidebar({
  questions,
  activeFilter,
  onFilterChange,
}: SidebarProps) {
  // 统计每个题型下的题目数量
  const counts: Record<string, number> = {};
  questions.forEach((q) => {
    const id = q.question_type.id;
    counts[id] = (counts[id] || 0) + 1;
  });

  const total = questions.length;

  return (
    <aside className="flex w-sidebar flex-shrink-0 flex-col overflow-y-auto border-r border-border bg-surface">
      <div className="px-4 pb-2 pt-4 text-xs font-bold uppercase tracking-wide text-text-muted">
        📋 题型目录
      </div>

      <div className="px-2 pb-3">
        {QUESTION_TYPES.map((type) => (
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

      {/* 分隔线 + 自定义题型 */}
      <div className="mx-4 h-px bg-border" />
      <div className="p-4">
        <button
          onClick={() => {}}
          className="w-full rounded-btn border border-border bg-surface px-3 py-2 text-xs text-text-secondary hover:bg-background"
          title="MVP 预留功能"
        >
          ＋ 新建自定义题型
        </button>
      </div>
    </aside>
  );
}
