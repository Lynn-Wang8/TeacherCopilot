"use client";

import { useState, useEffect, useRef } from "react";
import type { AnalysisStep, ChapterData } from "@/types";
import { analyzeQuestions } from "@/data/api";
import mockQuestions from "@/data/mockQuestions";
import Pipeline from "./Pipeline";

interface AnalysisPageProps {
  fileCount: number;
  onComplete: (data: ChapterData) => void;
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
  const [errorMsg, setErrorMsg] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<ChapterData | null>(null);

  useEffect(() => {
    startPipeline();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function startPipeline() {
    setStatus("running");
    setFailedStep(null);
    setErrorMsg("");
    setCurrentStep(null);

    const steps: AnalysisStep[] = [
      "vision",
      "segmentation",
      "question_type",
      "common_mistake",
      "geometry_model",
      "json_generation",
    ];

    // 播放 Pipeline 动画（最后一步触发真实 API 调用）
    steps.forEach((step, i) => {
      timerRef.current = setTimeout(async () => {
        setCurrentStep(step);

        if (i === steps.length - 1) {
          // 最后一步：调用真实 AI API
          try {
            const qs = mockQuestions.questions.slice(0, 8).map((q) => ({
              question_id: q.question_id,
              order: q.order,
              ocr_text: q.ocr_text,
            }));

            const data = await analyzeQuestions("triangle", "专题03 三角形", qs);

            resultRef.current = data;

            timerRef.current = setTimeout(() => {
              setCurrentStep(null);
              setStatus("completed");
            }, 600);
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "未知错误";
            setFailedStep("json_generation");
            setErrorMsg(msg);
            setStatus("failed");
          }
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
          <p className="mb-4 text-text-secondary">{errorMsg || "AI 分析过程中出现错误"}</p>
          <Pipeline currentStep={null} failedStep={failedStep} />
          <button
            onClick={() => {
              onRetry();
            }}
            className="mt-6 rounded-btn bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            🔄 重新上传
          </button>
        </div>
      </div>
    );
  }

  if (status === "completed") {
    const count = resultRef.current?.questions.length ?? 0;
    const types = new Set(resultRef.current?.questions.map((q) => q.question_type.id) ?? []);
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="w-full max-w-[520px] rounded-card border border-border bg-surface p-12 text-center shadow-card">
          <div className="mb-2 text-5xl">✅</div>
          <h2 className="mb-1 text-xl font-bold">🎉 分析完成！</h2>
          <p className="mb-8 text-text-secondary">
            共识别{" "}
            <strong className="text-text-primary">{count}</strong>{" "}
            道题目，覆盖 <strong className="text-text-primary">{types.size}</strong> 个题型
          </p>
          <Pipeline currentStep={null} isComplete />
          <button
            onClick={() => resultRef.current && onComplete(resultRef.current)}
            className="mt-6 rounded-btn bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            进入工作台 →
          </button>
        </div>
      </div>
    );
  }

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
