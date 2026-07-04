// ═══════════════════════════════════════════
// Teacher Copilot — TypeScript Interfaces
// 严格对应 docs/06_TypeScript_Interface.md
// ═══════════════════════════════════════════

// ── 2. Reference ──

/**
 * 通用引用类型（Lightweight Domain Reference Pattern）
 *
 * 设计意图：
 * - id 永远不变 → 历史数据可追溯
 * - name 可能随 Skill Library 更新而变化 → version 标记语义版本
 * - 前端可直接 render .name，通过 version 差异提示教师"该分类名称已更新"
 */
export interface Reference {
  id: string;
  name: string;
  version?: string;
}

// ── 3. Skill Library Contract ──

export interface SkillEntry {
  id: string;
  name: string;
  version: string;
  description?: string;
  keywords?: string[];
  parent_id?: string | null;
}

// ── 4–7. Domain Types ──

export type Chapter = Reference;
export type QuestionType = Reference;
export type CommonMistake = Reference | null;
export type GeometryModel = Reference | null;

// ── 8. ConfidenceEvidence ──

export interface ConfidenceEvidence {
  question_type: string[];
  common_mistake: string[];
  geometry_model: string[];
}

// ── 9. QuestionConfidence ──

export interface QuestionConfidence {
  question_type: number;
  common_mistake: number;
  geometry_model: number;
  evidence?: ConfidenceEvidence;
}

// ── 10. FieldPermissions ──

export interface FieldPermissions {
  teacher_note: "teacher";
}

// ── 11. QuestionMeta ──

export interface QuestionMeta {
  editable_by: FieldPermissions;
}

// ── 12. Question ──

export interface Question {
  question_id: string;
  order: number;
  image: string;
  ocr_text: string;
  question_type: QuestionType;
  common_mistake: CommonMistake;
  geometry_model: GeometryModel;
  teacher_note: string;
  confidence: QuestionConfidence;
  meta?: QuestionMeta;
}

// ── 13. ChapterData ──

export interface ChapterData {
  chapter: Chapter;
  questions: Question[];
}

// ── 14. UploadImage ──

export interface UploadImage {
  id: string;
  file_name: string;
  preview_url: string;
  status: "waiting" | "uploading" | "success" | "error";
}

// ── 15. AnalysisStep ──

export type AnalysisStep =
  | "vision"
  | "segmentation"
  | "question_type"
  | "common_mistake"
  | "geometry_model"
  | "json_generation"
  | "completed";

// ── 16. ExportConfig ──

export interface ExportConfig {
  file_name: string;
  format: "docx" | "pdf";
}

// ── 17. WorkspaceState ──

export interface WorkspaceState {
  selected_question_id: string | null;
  selected_question_type_id: string | null;
  selected_ids: string[];
}

// ── 18. APIResponse ──

export interface APIResponse {
  success: boolean;
  message: string;
  data: ChapterData;
}
