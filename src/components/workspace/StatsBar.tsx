"use client";

interface StatsBarProps {
  totalQuestions: number;
  typeCount: number;
  accuracy: number;
  chapterName: string;
}

export default function StatsBar({
  totalQuestions,
  typeCount,
  accuracy,
  chapterName,
}: StatsBarProps) {
  return (
    <div className="flex gap-4 border-b border-border bg-surface px-5 py-3 text-[13px] text-text-secondary">
      <span>
        📊 共 <strong className="text-text-primary">{totalQuestions}</strong> 道题
      </span>
      <span>
        📁 覆盖 <strong className="text-text-primary">{typeCount}</strong> 个题型
      </span>
      <span>
        🎯 AI 分类准确率预估{" "}
        <strong className="text-text-primary">{Math.round(accuracy * 100)}%</strong>
      </span>
      <span className="text-text-muted">{chapterName}</span>
    </div>
  );
}
