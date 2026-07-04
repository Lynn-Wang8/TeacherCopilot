"use client";

import type { Question } from "@/types";
import QuestionCard from "./QuestionCard";

interface QuestionListProps {
  questions: Question[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function QuestionList({
  questions,
  selectedId,
  onSelect,
}: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-text-muted">
        该题型下暂无题目
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">📋 题目列表</h3>
        <span className="text-[13px] text-text-secondary">
          共 {questions.length} 题
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {questions.map((q) => (
          <QuestionCard
            key={q.question_id}
            question={q}
            isSelected={selectedId === q.question_id}
            onClick={() => onSelect(q.question_id)}
          />
        ))}
      </div>
    </div>
  );
}
