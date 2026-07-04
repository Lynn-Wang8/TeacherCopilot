"use client";

import { useState, useMemo } from "react";
import type { ChapterData, Question, Reference } from "@/types";
import mockChapterData from "@/data/mockQuestions";
import { QUESTION_TYPES, COMMON_MISTAKES, GEOMETRY_MODELS } from "@/data/skills";
import StatsBar from "./StatsBar";
import Sidebar from "./Sidebar";
import QuestionList from "./QuestionList";
import Inspector from "./Inspector";

interface WorkspacePageProps {
  onExport: () => void;
}

export default function WorkspacePage({ onExport }: WorkspacePageProps) {
  const [data, setData] = useState<ChapterData>(structuredClone(mockChapterData));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // 教师自定义：章节 / 题型 / 易错点 / 几何模型
  const [customChapters, setCustomChapters] = useState<Reference[]>([]);
  const [customTypes, setCustomTypes] = useState<Reference[]>([]);
  const [customMistakes, setCustomMistakes] = useState<Reference[]>([]);
  const [customModels, setCustomModels] = useState<Reference[]>([]);

  // 统一列表
  const allTypes = useMemo(() => [...QUESTION_TYPES, ...customTypes], [customTypes]);
  const allMistakes = useMemo(() => [...COMMON_MISTAKES, ...customMistakes], [customMistakes]);
  const allModels = useMemo(() => [...GEOMETRY_MODELS, ...customModels], [customModels]);
  const allChapters = useMemo(
    () => [
      { id: data.chapter.id, name: data.chapter.name, version: data.chapter.version },
      ...customChapters,
    ],
    [data.chapter, customChapters],
  );

  const filteredQuestions = useMemo(() => {
    let list = data.questions;
    if (activeFilter) {
      list = list.filter((q) => q.question_type.id === activeFilter);
    }
    return list.sort((a, b) => a.order - b.order);
  }, [data.questions, activeFilter]);

  const selectedQuestion = useMemo(
    () => data.questions.find((q) => q.question_id === selectedId) ?? null,
    [data.questions, selectedId],
  );

  const typeIds = new Set(data.questions.map((q) => q.question_type.id));
  const avgAccuracy =
    data.questions.reduce((sum, q) => sum + q.confidence.question_type, 0) /
    Math.max(data.questions.length, 1);

  // ── Helpers ──
  function updateQuestion(id: string, updater: (q: Question) => Question) {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.question_id === id ? updater(q) : q)),
    }));
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
    setData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.question_id !== selectedId),
    }));
    setSelectedId(null);
  }

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <StatsBar
        totalQuestions={data.questions.length}
        typeCount={typeIds.size}
        accuracy={avgAccuracy}
        chapterName={data.chapter.name}
      />

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
          onCreateCustomType={makeCreateHandler(customTypes, setCustomTypes, "custom_type")}
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
    </div>
  );
}
