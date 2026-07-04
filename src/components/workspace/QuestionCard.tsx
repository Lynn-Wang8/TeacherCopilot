"use client";

import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  isSelected: boolean;
  onClick: () => void;
}

export default function QuestionCard({
  question,
  isSelected,
  onClick,
}: QuestionCardProps) {
  const q = question;

  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer gap-4 rounded-card border bg-surface p-4 shadow-sm transition-all ${
        isSelected
          ? "border-primary shadow-[0_0_0_2px_rgba(37,99,235,.15)]"
          : "border-border hover:border-primary hover:shadow-md"
      }`}
    >
      {/* 题目图片 */}
      <div className="h-[90px] w-[120px] flex-shrink-0 overflow-hidden rounded-btn border border-border bg-slate-100">
        {q.image ? (
          <img
            src={q.image}
            alt={q.question_id}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl text-text-muted">
            📷
          </div>
        )}
      </div>

      {/* 题目信息 */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-[11px] font-semibold text-text-muted">
          {q.question_id} · 第{q.order}题
        </div>
        <div className="mb-2 line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
          {q.ocr_text}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {/* 题型标签 */}
          <span className="inline-block rounded-md bg-primary-light px-2.5 py-[3px] text-[11px] font-medium text-primary">
            📘 {q.question_type.name}
          </span>

          {/* 易错点标签 */}
          {q.common_mistake ? (
            <span className="inline-block rounded-md bg-[#FEF3C7] px-2.5 py-[3px] text-[11px] font-medium text-[#D97706]">
              ⚠ {q.common_mistake.name}
            </span>
          ) : (
            <span className="inline-block rounded-md bg-slate-100 px-2.5 py-[3px] text-[11px] text-text-muted">
              易错点：无
            </span>
          )}

          {/* 几何模型标签 */}
          {q.geometry_model ? (
            <span className="inline-block rounded-md bg-[#F3E8FF] px-2.5 py-[3px] text-[11px] font-medium text-[#7C3AED]">
              🔷 {q.geometry_model.name}
            </span>
          ) : (
            <span className="inline-block rounded-md bg-slate-100 px-2.5 py-[3px] text-[11px] text-text-muted">
              模型：无
            </span>
          )}
        </div>

        {/* 教师备注 */}
        {q.teacher_note && (
          <div className="mt-1.5 text-xs italic text-text-secondary">
            💬 {q.teacher_note}
          </div>
        )}
      </div>
    </div>
  );
}
