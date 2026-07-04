"use client";

import { useState } from "react";
import type { Question, Reference } from "@/types";

interface InspectorProps {
  question: Question;
  allChapters: Reference[];
  allTypes: Reference[];
  allMistakes: Reference[];
  allModels: Reference[];
  onCreateChapter: (name: string) => Reference;
  onCreateType: (name: string) => Reference;
  onCreateMistake: (name: string) => Reference;
  onCreateModel: (name: string) => Reference;
  onUpdateType: (id: string) => void;
  onUpdateMistake: (id: string | null) => void;
  onUpdateModel: (id: string | null) => void;
  onUpdateNote: (text: string) => void;
  onDelete: () => void;
}

const CUSTOM_OPTION_VALUE = "__custom__";

export default function Inspector({
  question,
  allChapters,
  allTypes,
  allMistakes,
  allModels,
  onCreateChapter,
  onCreateType,
  onCreateMistake,
  onCreateModel,
  onUpdateType,
  onUpdateMistake,
  onUpdateModel,
  onUpdateNote,
  onDelete,
}: InspectorProps) {
  const q = question;
  const confQT = q.confidence.question_type;
  const confCM = q.confidence.common_mistake;
  const confGM = q.confidence.geometry_model;

  // 自定义输入状态（每个下拉独立）
  const [customChapter, setCustomChapter] = useState("");
  const [customType, setCustomType] = useState("");
  const [customMistake, setCustomMistake] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [showCustomChapter, setShowCustomChapter] = useState(false);
  const [showCustomType, setShowCustomType] = useState(false);
  const [showCustomMistake, setShowCustomMistake] = useState(false);
  const [showCustomModel, setShowCustomModel] = useState(false);

  // 当前章节的 display value（Question 暂无 chapter 字段，用 mockChapter 的 chapter）
  // 后续扩展：Question 增加 chapter_id 字段，这里读取 q.chapter?.id
  const chapterValue = "triangle"; // MVP 固定

  return (
    <aside className="flex w-inspector flex-shrink-0 flex-col overflow-y-auto border-l border-border bg-surface">
      <div className="border-b border-border px-5 py-4 text-[15px] font-semibold">
        📝 {q.question_id} 详情
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* 题号 */}
        <Field label="题号">
          <span className="text-sm font-semibold">
            {q.question_id}（第{q.order}题）
          </span>
        </Field>

        {/* 章节 — 新增 */}
        <Field label="章节">
          <CreatableSelect
            value={chapterValue}
            options={allChapters}
            customValue={customChapter}
            showCustom={showCustomChapter}
            onSelect={(id) => {
              if (id === CUSTOM_OPTION_VALUE) {
                setShowCustomChapter(true);
              } else {
                setShowCustomChapter(false);
                // TODO: 后续 Question 有 chapter 字段后接入
              }
            }}
            onCustomChange={setCustomChapter}
            onCustomCreate={() => {
              onCreateChapter(customChapter);
              setCustomChapter("");
              setShowCustomChapter(false);
            }}
            onCustomCancel={() => {
              setShowCustomChapter(false);
              setCustomChapter("");
            }}
            placeholder="新章节名称"
          />
        </Field>

        {/* OCR 文本 */}
        <Field label="OCR 识别文字">
          <textarea
            defaultValue={q.ocr_text}
            className="min-h-[80px] w-full resize-y rounded-btn border border-border bg-surface px-3 py-2 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </Field>

        {/* 题型分类 */}
        <Field label="题型分类">
          <CreatableSelect
            value={q.question_type.id}
            options={allTypes}
            customValue={customType}
            showCustom={showCustomType}
            onSelect={(id) => {
              if (id === CUSTOM_OPTION_VALUE) {
                setShowCustomType(true);
              } else {
                setShowCustomType(false);
                onUpdateType(id);
              }
            }}
            onCustomChange={setCustomType}
            onCustomCreate={() => {
              const ref = onCreateType(customType);
              setCustomType("");
              setShowCustomType(false);
              onUpdateType(ref.id); // 自动选中
            }}
            onCustomCancel={() => {
              setShowCustomType(false);
              setCustomType("");
            }}
            placeholder="新题型名称"
          />
          <ConfidenceBar value={confQT} />
        </Field>

        {/* 易错点 — 可自定义 */}
        <Field label="易错点">
          <CreatableSelect
            value={q.common_mistake?.id || ""}
            options={allMistakes}
            nullable
            customValue={customMistake}
            showCustom={showCustomMistake}
            onSelect={(id) => {
              if (id === CUSTOM_OPTION_VALUE) {
                setShowCustomMistake(true);
              } else {
                setShowCustomMistake(false);
                onUpdateMistake(id || null);
              }
            }}
            onCustomChange={setCustomMistake}
            onCustomCreate={() => {
              const ref = onCreateMistake(customMistake);
              setCustomMistake("");
              setShowCustomMistake(false);
              onUpdateMistake(ref.id); // 自动选中
            }}
            onCustomCancel={() => {
              setShowCustomMistake(false);
              setCustomMistake("");
            }}
            placeholder="新易错点名称"
          />
          {q.common_mistake && <ConfidenceBar value={confCM} />}
        </Field>

        {/* 几何模型 — 可自定义 */}
        <Field label="几何模型">
          <CreatableSelect
            value={q.geometry_model?.id || ""}
            options={allModels}
            nullable
            customValue={customModel}
            showCustom={showCustomModel}
            onSelect={(id) => {
              if (id === CUSTOM_OPTION_VALUE) {
                setShowCustomModel(true);
              } else {
                setShowCustomModel(false);
                onUpdateModel(id || null);
              }
            }}
            onCustomChange={setCustomModel}
            onCustomCreate={() => {
              const ref = onCreateModel(customModel);
              setCustomModel("");
              setShowCustomModel(false);
              onUpdateModel(ref.id); // 自动选中
            }}
            onCustomCancel={() => {
              setShowCustomModel(false);
              setCustomModel("");
            }}
            placeholder="新几何模型名称"
          />
          {q.geometry_model && <ConfidenceBar value={confGM} />}
        </Field>

        {/* 教师备注 */}
        <Field label="教师备注">
          <textarea
            defaultValue={q.teacher_note}
            onChange={(e) => onUpdateNote(e.target.value)}
            placeholder="输入教学备注..."
            className="min-h-[80px] w-full resize-y rounded-btn border border-border bg-surface px-3 py-2 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </Field>

        <button
          onClick={onDelete}
          className="mt-2 w-full rounded-btn border border-border bg-surface px-4 py-2 text-sm text-text-secondary hover:bg-background"
        >
          🗑 删除此题
        </button>
      </div>
    </aside>
  );
}

/* ── Helpers ── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const colorClass = pct > 90 ? "bg-success" : pct > 70 ? "bg-warning" : "bg-danger";

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-text-muted">置信度</span>
      <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${colorClass} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="min-w-[36px] text-right font-semibold text-text-primary">
        {pct}%
      </span>
    </div>
  );
}

/**
 * 可自定义的下拉组件
 *
 * 下拉底部有"+ 自定义..."选项。
 * 选中后显示内联输入框，确认后回调 onCustomCreate。
 */
function CreatableSelect({
  value,
  options,
  nullable,
  customValue,
  showCustom,
  onSelect,
  onCustomChange,
  onCustomCreate,
  onCustomCancel,
  placeholder,
}: {
  value: string;
  options: Reference[];
  nullable?: boolean;
  customValue: string;
  showCustom: boolean;
  onSelect: (id: string) => void;
  onCustomChange: (val: string) => void;
  onCustomCreate: () => void;
  onCustomCancel: () => void;
  placeholder: string;
}) {
  const canCreate = customValue.trim().length > 0;

  return (
    <div className="flex flex-col gap-2">
      <select
        value={showCustom ? CUSTOM_OPTION_VALUE : value}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full rounded-btn border border-border bg-surface px-3 py-2 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
      >
        {nullable && <option value="">-- 无 --</option>}
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
        <option disabled>──────────</option>
        <option value={CUSTOM_OPTION_VALUE}>＋ 自定义...</option>
      </select>

      {showCustom && (
        <div className="flex gap-1.5">
          <input
            type="text"
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canCreate) onCustomCreate();
              if (e.key === "Escape") onCustomCancel();
            }}
            placeholder={placeholder}
            autoFocus
            className="flex-1 rounded-btn border border-primary bg-surface px-3 py-1.5 text-xs text-text-primary focus:outline-none"
          />
          <button
            onClick={onCustomCreate}
            disabled={!canCreate}
            className="rounded-btn bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-[#93C5FD]"
          >
            确定
          </button>
          <button
            onClick={onCustomCancel}
            className="rounded-btn border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary hover:bg-background"
          >
            取消
          </button>
        </div>
      )}
    </div>
  );
}
