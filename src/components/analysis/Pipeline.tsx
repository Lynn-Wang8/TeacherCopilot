"use client";

import type { AnalysisStep } from "@/types";

const PIPELINE_STEPS: { key: AnalysisStep; num: number; label: string }[] = [
  { key: "vision", num: 1, label: "Vision 识别图片内容" },
  { key: "segmentation", num: 2, label: "题目切分（Question Segmentation）" },
  { key: "question_type", num: 3, label: "题型分类（Question Type）" },
  { key: "common_mistake", num: 4, label: "易错点识别（Common Mistake）" },
  { key: "geometry_model", num: 5, label: "几何模型识别（Geometry Model）" },
  { key: "json_generation", num: 6, label: "生成结构化 JSON" },
];

interface PipelineProps {
  currentStep: AnalysisStep | null;
  failedStep?: AnalysisStep | null;
}

export default function Pipeline({ currentStep, failedStep }: PipelineProps) {
  const currentIndex = currentStep
    ? PIPELINE_STEPS.findIndex((s) => s.key === currentStep)
    : -1;

  return (
    <div className="text-left">
      {PIPELINE_STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        const isFailed = failedStep === step.key;

        let dotClass = "bg-slate-100 text-text-muted";
        if (isFailed) dotClass = "bg-danger/10 text-danger";
        else if (isDone) dotClass = "bg-[#DCFCE7] text-[#16A34A]";
        else if (isActive) dotClass = "bg-primary text-white animate-pulse";

        let textClass = "text-text-muted";
        if (isFailed) textClass = "text-danger";
        else if (isActive) textClass = "font-semibold text-primary";

        return (
          <div
            key={step.key}
            className={`flex items-center gap-3 border-b border-border px-0 py-3 text-sm last:border-b-0 ${textClass}`}
          >
            <span
              className={`flex h-[28px] w-[28px] flex-shrink-0 items-center justify-center rounded-full text-[13px] transition-colors ${dotClass}`}
            >
              {isDone ? "✓" : isFailed ? "✗" : step.num}
            </span>
            <span>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
