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

  // 教师自定义题型（Skill Library 之外）
  const [customTypes, setCustomTypes] = useState<Reference[]>([]);

  // 统一题型列表：Skill Library + 教师自定义
  const allTypes: Reference[] = useMemo(
    () => [...QUESTION_TYPES, ...customTypes],
    [customTypes],
  );

  // 按筛选条件过滤题目、按 order 排序
  const filteredQuestions = useMemo(() => {
    let list = data.questions;
    if (activeFilter) {
      list = list.filter((q) => q.question_type.id === activeFilter);
    }
    return list.sort((a, b) => a.order - b.order);
  }, [data.questions, activeFilter]);

  // 选中题目
  const selectedQuestion = useMemo(
    () => data.questions.find((q) => q.question_id === selectedId) ?? null,
    [data.questions, selectedId],
  );

  // 统计（不受筛选影响）
  const typeIds = new Set(data.questions.map((q) => q.question_type.id));
  const avgAccuracy =
    data.questions.reduce((sum, q) => sum + q.confidence.question_type, 0) /
    Math.max(data.questions.length, 1);

  // ── Actions ──
  function updateQuestion(id: string, updater: (q: Question) => Question) {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.question_id === id ? updater(q) : q)),
    }));
  }

  function handleCreateCustomType(name: string) {
    if (!name.trim()) return;
    // 生成唯一 id：custom_01, custom_02, ...
    const nextNum = customTypes.length + 1;
    const id = `custom_${String(nextNum).padStart(2, "0")}`;
    const newType: Reference = { id, name: name.trim(), version: "v1" };
    setCustomTypes((prev) => [...prev, newType]);
  }

  function handleUpdateType(id: string) {
    if (!selectedId) return;
    // 在统一列表中查找（Skill Library + 自定义）
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
      const mistake = COMMON_MISTAKES.find((m) => m.id === id);
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
      const model = GEOMETRY_MODELS.find((m) => m.id === id);
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
        {/* Left: Skill Tree */}
        <Sidebar
          chapter={data.chapter}
          allTypes={allTypes}
          questions={data.questions}
          activeFilter={activeFilter}
          onFilterChange={(typeId) => {
            setActiveFilter(typeId);
            setSelectedId(null);
          }}
          onCreateCustomType={handleCreateCustomType}
        />

        {/* Center: Question Cards */}
        <QuestionList
          questions={filteredQuestions}
          selectedId={selectedId}
          onSelect={handleSelect}
        />

        {/* Right: Inspector */}
        {selectedQuestion ? (
          <Inspector
            question={selectedQuestion}
            allTypes={allTypes}
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
