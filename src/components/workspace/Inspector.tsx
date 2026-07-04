"use client";

import type { Question, Reference } from "@/types";
import { COMMON_MISTAKES, GEOMETRY_MODELS } from "@/data/skills";

interface InspectorProps {
  question: Question;
  allTypes: Reference[];
  onUpdateType: (id: string) => void;
  onUpdateMistake: (id: string | null) => void;
  onUpdateModel: (id: string | null) => void;
  onUpdateNote: (text: string) => void;
  onDelete: () => void;
}

export default function Inspector({
  question,
  allTypes,
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

        {/* OCR 文本 */}
        <Field label="OCR 识别文字">
          <textarea
            defaultValue={q.ocr_text}
            className="min-h-[80px] w-full resize-y rounded-btn border border-border bg-surface px-3 py-2 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </Field>

        {/* 题型分类 — 下拉来自 Sidebar 的全部题型 */}
        <Field label="题型分类">
          <SelectField
            value={q.question_type.id}
            options={allTypes}
            onChange={(id) => onUpdateType(id)}
          />
          <ConfidenceBar value={confQT} />
        </Field>

        {/* 易错点 */}
        <Field label="易错点">
          <SelectField
            value={q.common_mistake?.id || ""}
            options={COMMON_MISTAKES}
            nullable
            onChange={(id) => onUpdateMistake(id || null)}
          />
          {q.common_mistake && <ConfidenceBar value={confCM} />}
        </Field>

        {/* 几何模型 */}
        <Field label="几何模型">
          <SelectField
            value={q.geometry_model?.id || ""}
            options={GEOMETRY_MODELS}
            nullable
            onChange={(id) => onUpdateModel(id || null)}
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

        {/* 删除按钮 */}
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

function SelectField({
  value,
  options,
  nullable,
  onChange,
}: {
  value: string;
  options: Reference[];
  nullable?: boolean;
  onChange: (id: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-btn border border-border bg-surface px-3 py-2 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
    >
      {nullable && <option value="">-- 无 --</option>}
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
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
