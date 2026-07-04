"use client";

import { useState, useEffect, useRef } from "react";
import type { AnalysisStep } from "@/types";
import Pipeline from "./Pipeline";

interface AnalysisPageProps {
  fileCount: number;
  onComplete: () => void;
  onRetry: () => void;
}

export default function AnalysisPage({
  fileCount,
  onComplete,
  onRetry,
}: AnalysisPageProps) {
  const [status, setStatus] = useState<"waiting" | "running" | "completed" | "failed">("waiting");
  const [currentStep, setCurrentStep] = useState<AnalysisStep | null>(null);
  const [failedStep, setFailedStep] = useState<AnalysisStep | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    startPipeline();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function startPipeline() {
    setStatus("running");
    setFailedStep(null);
    setCurrentStep(null);

    const steps: AnalysisStep[] = [
      "vision",
      "segmentation",
      "question_type",
      "common_mistake",
      "geometry_model",
      "json_generation",
    ];

    steps.forEach((step, i) => {
      timerRef.current = setTimeout(() => {
        setCurrentStep(step);

        // Simulate occasional failure on step 2 (for demo)
        // In real implementation, this comes from API error
        if (step === "segmentation" && Math.random() < 0.05) {
          setFailedStep(step);
          setStatus("failed");
          return;
        }

        if (i === steps.length - 1) {
          // Last step: complete
          timerRef.current = setTimeout(() => {
            setCurrentStep(null);
            setStatus("completed");
            // Random question count 5-12
            setQuestionCount(Math.floor(Math.random() * 8) + 5);
          }, 600);
        }
      }, (i + 1) * 900);
    });
  }

  if (status === "failed") {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="w-full max-w-[520px] rounded-card border border-border bg-surface p-12 text-center shadow-card">
          <div className="mb-4 text-5xl">⚠️</div>
          <h2 className="mb-2 text-xl font-bold">分析失败</h2>
          <p className="mb-8 text-text-secondary">
            {failedStep === "segmentation"
              ? "题目切分失败，请确认图片清晰度后重试。"
              : "AI 分析过程中出现错误，请重试。"}
          </p>
          <Pipeline currentStep={null} failedStep={failedStep} />
          <button
            onClick={() => {
              onRetry();
              startPipeline();
            }}
            className="mt-6 rounded-btn bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            🔄 重新分析
          </button>
        </div>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="w-full max-w-[520px] rounded-card border border-border bg-surface p-12 text-center shadow-card">
          <div className="mb-2 text-5xl">✅</div>
          <h2 className="mb-1 text-xl font-bold">🎉 分析完成！</h2>
          <p className="mb-8 text-text-secondary">
            共识别{" "}
            <strong className="text-text-primary">{questionCount}</strong>{" "}
            道题目，覆盖 <strong className="text-text-primary">6</strong> 个题型
          </p>
          <Pipeline currentStep={null} />
          <button
            onClick={onComplete}
            className="mt-6 rounded-btn bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            进入工作台 →
          </button>
        </div>
      </div>
    );
  }

  // Running state
  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <div className="w-full max-w-[520px] rounded-card border border-border bg-surface p-12 text-center shadow-card">
        <h2 className="mb-8 text-xl font-bold">🤖 AI 正在分析中...</h2>
        <Pipeline currentStep={currentStep} />
        <p className="mt-6 text-sm text-text-muted">
          已上传 {fileCount} 张图片 · 正在第{" "}
          {currentStep
            ? ["vision", "segmentation", "question_type", "common_mistake", "geometry_model", "json_generation"].indexOf(currentStep) + 1
            : "?"}
          /6 步
        </p>
      </div>
    </div>
  );
}
