"use client";

import { useState, useMemo, useEffect } from "react";
import type { ChapterData, Question, Reference } from "@/types";
import { fetchChapter } from "@/data/api";
import { QUESTION_TYPES, COMMON_MISTAKES, GEOMETRY_MODELS } from "@/data/skills";
import Sidebar from "./Sidebar";
import QuestionList from "./QuestionList";
import Inspector from "./Inspector";
import ExportDrawer from "@/components/export/ExportDrawer";
import { exportDocx } from "@/data/api";

interface WorkspacePageProps {
  initialData?: ChapterData | null;
}

export default function WorkspacePage({ initialData }: WorkspacePageProps) {
  const [data, setData] = useState<ChapterData | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  // 首次加载：优先用 AI 分析结果，否则从 API 获取
  useEffect(() => {
    if (initialData) return; // 已有 AI 结果，跳过 fetch
    fetchChapter("triangle")
      .then((chapterData) => {
        setData(chapterData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [initialData]);

  // 教师自定义：章节 / 题型 / 易错点 / 几何模型
  const [customChapters, setCustomChapters] = useState<Reference[]>([]);
  const [customTypes, setCustomTypes] = useState<Reference[]>([]);
  const [customMistakes, setCustomMistakes] = useState<Reference[]>([]);
  const [customModels, setCustomModels] = useState<Reference[]>([]);
  const [hiddenTypeIds, setHiddenTypeIds] = useState<Set<string>>(new Set());

  // 统一列表（排除被教师删除的 Skill Library 题型）
  const allTypes = useMemo(
    () => [
      ...QUESTION_TYPES.filter((t) => !hiddenTypeIds.has(t.id)),
      ...customTypes,
    ],
    [customTypes, hiddenTypeIds],
  );
  const allMistakes = useMemo(() => [...COMMON_MISTAKES, ...customMistakes], [customMistakes]);
  const allModels = useMemo(() => [...GEOMETRY_MODELS, ...customModels], [customModels]);
  const allChapters = useMemo(
    () =>
      data
        ? [
            { id: data.chapter.id, name: data.chapter.name, version: data.chapter.version },
            ...customChapters,
          ]
        : customChapters,
    [data, customChapters],
  );

  const filteredQuestions = useMemo(() => {
    if (!data) return [];
    let list = data.questions;
    if (activeFilter) {
      list = list.filter((q) => q.question_type.id === activeFilter);
    }
    return list.sort((a, b) => a.order - b.order);
  }, [data, activeFilter]);

  const selectedQuestion = useMemo(
    () => data?.questions.find((q) => q.question_id === selectedId) ?? null,
    [data, selectedId],
  );

  const questions = data?.questions ?? [];
  const typeIds = new Set(questions.map((q) => q.question_type.id));

  // ── Loading / Error 状态 ──
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-3 animate-spin text-3xl">⏳</div>
          <p className="text-text-secondary">加载题目数据中...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-3 text-4xl">⚠️</div>
          <p className="text-text-secondary">数据加载失败</p>
          <p className="mt-1 text-sm text-text-muted">{error || "未知错误"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-btn bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // ── Helpers ──
  function updateQuestion(id: string, updater: (q: Question) => Question) {
    setData((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.map((q) => (q.question_id === id ? updater(q) : q)),
          }
        : prev,
    );
  }

  function handleAddManualQuestion(ocrText: string, typeId: string) {
    const type = allTypes.find((t) => t.id === typeId);
    if (!type) return;
    const maxOrder = data.questions.reduce((m, q) => Math.max(m, q.order), 0);
    const nextId = `Q${String(data.questions.length + 1).padStart(3, "0")}`;
    const newQ: Question = {
      question_id: nextId,
      order: maxOrder + 1,
      image: "",
      ocr_text: ocrText,
      question_type: { id: type.id, name: type.name, version: type.version },
      common_mistake: null,
      geometry_model: null,
      teacher_note: "",
      confidence: { question_type: 0, common_mistake: 0, geometry_model: 0 },
      meta: { editable_by: { teacher_note: "teacher" } },
    };
    setData((prev) =>
      prev ? { ...prev, questions: [...prev.questions, newQ] } : prev,
    );
    setSelectedId(nextId);
  }

  function handleDeleteType(id: string) {
    setCustomTypes((prev) => prev.filter((t) => t.id !== id));
    if (QUESTION_TYPES.some((t) => t.id === id)) {
      setHiddenTypeIds((prev) => new Set(prev).add(id));
    }
    setData((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.map((q) =>
              q.question_type.id === id
                ? { ...q, question_type: { id: "unknown", name: "待教师确认", version: "v1" } }
                : q,
            ),
          }
        : prev,
    );
    if (activeFilter === id) setActiveFilter(null);
  }

  function makeCreateHandler(
    list: Reference[],
    setter: (fn: (prev: Reference[]) => Reference[]) => void,
    prefix: string,
  ) {
    return (name: string): Reference => {
      const nextNum = list.length + 1;
      const id = `${prefix}_${String(nextNum).padStart(2, "0")}`;
      const ref: Reference = { id, name: name.trim(), version: "v1" };
      setter((prev) => [...prev, ref]);
      return ref;
    };
  }

  // ── Update handlers ──
  function handleUpdateType(id: string) {
    if (!selectedId) return;
    const type = allTypes.find((t) => t.id === id);
    if (!type) return;
    updateQuestion(selectedId, (q) => ({
      ...q,
      question_type: { id: type.id, name: type.name, version: type.version },
    }));
  }

  function handleUpdateMistake(id: string | null) {
    if (!selectedId) return;
    if (!id) {
      updateQuestion(selectedId, (q) => ({
        ...q,
        common_mistake: null,
        confidence: { ...q.confidence, common_mistake: 0 },
      }));
    } else {
      const mistake = allMistakes.find((m) => m.id === id);
      if (!mistake) return;
      updateQuestion(selectedId, (q) => ({
        ...q,
        common_mistake: { id: mistake.id, name: mistake.name, version: mistake.version },
      }));
    }
  }

  function handleUpdateModel(id: string | null) {
    if (!selectedId) return;
    if (!id) {
      updateQuestion(selectedId, (q) => ({
        ...q,
        geometry_model: null,
        confidence: { ...q.confidence, geometry_model: 0 },
      }));
    } else {
      const model = allModels.find((m) => m.id === id);
      if (!model) return;
      updateQuestion(selectedId, (q) => ({
        ...q,
        geometry_model: { id: model.id, name: model.name, version: model.version },
      }));
    }
  }

  function handleUpdateNote(text: string) {
    if (!selectedId) return;
    updateQuestion(selectedId, (q) => ({ ...q, teacher_note: text }));
  }

  function handleDelete() {
    if (!selectedId) return;
    if (!confirm(`确定删除 ${selectedId} 吗？`)) return;
    setData((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.filter((q) => q.question_id !== selectedId),
          }
        : prev,
    );
    setSelectedId(null);
  }

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-2">
        <span className="text-[13px] text-text-secondary">
          📊 共 <strong className="text-text-primary">{data.questions.length}</strong> 道题 ·{" "}
          覆盖 <strong className="text-text-primary">{typeIds.size}</strong> 个题型
        </span>
        <button
          onClick={() => setShowExport(true)}
          className="rounded-btn bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
        >
          📄 导出 Word
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          chapter={data.chapter}
          allTypes={allTypes}
          questions={data.questions}
          activeFilter={activeFilter}
          onFilterChange={(typeId) => {
            setActiveFilter(typeId);
            setSelectedId(null);
          }}
          onDeleteCustomType={handleDeleteType}
          onAddManualQuestion={handleAddManualQuestion}
        />

        <QuestionList
          questions={filteredQuestions}
          selectedId={selectedId}
          onSelect={handleSelect}
        />

        {selectedQuestion ? (
          <Inspector
            question={selectedQuestion}
            allChapters={allChapters}
            allTypes={allTypes}
            allMistakes={allMistakes}
            allModels={allModels}
            onCreateChapter={makeCreateHandler(customChapters, setCustomChapters, "chapter")}
            onCreateType={makeCreateHandler(customTypes, setCustomTypes, "custom_type")}
            onCreateMistake={makeCreateHandler(customMistakes, setCustomMistakes, "mistake")}
            onCreateModel={makeCreateHandler(customModels, setCustomModels, "model")}
            onUpdateType={handleUpdateType}
            onUpdateMistake={handleUpdateMistake}
            onUpdateModel={handleUpdateModel}
            onUpdateNote={handleUpdateNote}
            onDelete={handleDelete}
          />
        ) : (
          <aside className="flex w-inspector flex-shrink-0 flex-col border-l border-border bg-surface">
            <div className="border-b border-border px-5 py-4 text-[15px] font-semibold">
              📝 题目详情
            </div>
            <div className="flex flex-1 items-center justify-center p-5 text-sm text-text-muted">
              <div className="text-center">
                <p>👈 点击左侧题目卡片</p>
                <p>查看和编辑详情</p>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Export Drawer */}
      <ExportDrawer
        open={showExport}
        chapterName={data.chapter.name}
        questionCount={data.questions.length}
        typeCount={typeIds.size}
        onClose={() => setShowExport(false)}
        onExport={(fileName) => {
          setShowExport(false);
          exportDocx(data, fileName).catch((err) =>
            alert("导出失败: " + err.message),
          );
        }}
      />
    </div>
  );
}
