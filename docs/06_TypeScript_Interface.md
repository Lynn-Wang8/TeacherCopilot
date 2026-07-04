# 06 TypeScript Interface

> Project：Teacher Copilot
> Version：MVP v1.0
> Status：Ready for Development

---

# 1. Overview

本文件定义 Teacher Copilot 前端全部数据类型。

所有页面状态、API 返回、AI 输出均遵循以下 TypeScript Interface。

与 `05_JSON_SCHEMA.md` 一一对应，任何一方的修改必须同步更新另一方。

---

# 2. Reference（基础引用类型）

所有分类字段统一复用 `Reference`，不再使用纯字符串或完整对象。

```ts
/**
 * 通用引用类型（Lightweight Domain Reference Pattern）
 *
 * 设计意图：
 * - id 永远不变 → 历史数据可追溯
 * - name 可能随 Skill Library 更新而变化 → version 标记语义版本
 * - 前端可直接 render .name，通过 version 差异提示教师"该分类名称已更新"
 *
 * 适用于 Chapter、QuestionType、CommonMistake、GeometryModel 等所有分类字段。
 */
export interface Reference {
  /** 唯一标识，格式 snake_case，如 "triangle_01"、"mistake_05"、"model_01"。一旦分配永不更改。 */
  id: string;

  /** 显示名称，如 "三角形三边关系应用"。前端直接取值渲染，无需查表。 */
  name: string;

  /**
   * 版本标签（可选），如 "v1"。
   *
   * Skill Library 改名时必须递增版本号。
   * UI 可据此检测历史数据语义是否过期，提示教师更新。
   * 省略时视为未版本化。
   */
  version?: string;
}
```

## 2.1 方案对比

| 方案 | 写法 | 问题 |
| --- | --- | --- |
| 纯字符串 | `question_type: string` | 前端每次显示都要查 Skill Library 拿中文名 |
| 完整对象 | `question_type: SkillDefinition` | 每道题复制几十 KB，极度浪费 |
| **Reference Object** ✅ | `question_type: Reference` | 前端直接用 `.name`，体积最小，id 不变则老数据不坏，version 防语义漂移 |

| 优势 | 说明 |
| --- | --- |
| 直接取值 | `question.question_type.name`，无需查表 |
| 体积最小 | 只存 `id` + `name` + 可选 `version`，不复制完整 Skill 对象 |
| 语义防漂移 | Skill 改名时 `id` 不变，`version` 递增，UI 可检测历史数据过期 |
| 统一复用 | Chapter、QuestionType、CommonMistake、GeometryModel 等均用此类型 |

---

# 3. Skill Library Contract

AI 输出的所有分类 id 必须来自 Skill Library。本章定义 Skill Library 与前端类型的契约。

| 属性 | 值 |
| --- | --- |
| 来源（source） | internal registry（项目内置注册表，非外部 API） |
| 存储形式 | JSON 文件，纳入版本管理 |
| id 格式 | `snake_case`，如 `triangle_01`、`mistake_05`、`model_01` |
| id 不可变性（immutable） | 是。一旦分配，永不更改 |
| name 可变性 | 允许更新，但必须同步递增 `version` |
| AI 权限 | 只读。AI 只能从已有条目中选择，不得创造新 id |

```ts
/**
 * Skill Library 条目（内部注册表使用，不嵌入 Question）
 *
 * 仅存在于 Skill Library 的 JSON 文件中。
 * Question 中只存 Reference（{ id, name, version }），不存完整定义。
 */
export interface SkillEntry {
  /** Reference.id 的来源 */
  id: string;

  /** Reference.name 的来源 */
  name: string;

  /** Reference.version 的来源 */
  version: string;

  /** 详细描述（仅 Skill Library 内部使用） */
  description?: string;

  /** 关联关键词（仅 Skill Library 内部使用） */
  keywords?: string[];

  /** 父级分类 ID（仅 Skill Library 内部使用） */
  parent_id?: string | null;
}
```

---

# 4. Chapter

```ts
/** 章节信息，同样采用 Reference 模式，为后续章节扩展做好准备 */
export type Chapter = Reference;
```

示例：

```ts
// MVP
const chapter: Chapter = { id: "triangle", name: "专题03 三角形", version: "v1" };

// 后续扩展
// { id: "quadrilateral", name: "专题04 四边形", version: "v1" }
// { id: "circle", name: "专题05 圆", version: "v1" }
// { id: "function", name: "专题06 函数", version: "v1" }
```

---

# 5. QuestionType

```ts
/** 题型分类。AI 无法匹配时返回 { id: "unknown", name: "待教师确认" } */
export type QuestionType = Reference;
```

---

# 6. CommonMistake

```ts
/**
 * 常见错误。
 * - 有匹配 → Reference
 * - 无匹配或无易错点 → null（语义不存在）
 */
export type CommonMistake = Reference | null;
```

---

# 7. GeometryModel

```ts
/**
 * 几何模型。
 * - 有匹配 → Reference
 * - 无匹配或不涉及 → null（语义不存在）
 */
export type GeometryModel = Reference | null;
```

---

# 8. ConfidenceEvidence

```ts
/**
 * AI 分类依据（可选，用于 agent debugging 和置信度热力图）。
 *
 * 每个维度记录命中关键词 / 规则 / token 列表。
 * 该维度无可信来源时为空数组。
 */
export interface ConfidenceEvidence {
  /** 题型分类依据 */
  question_type: string[];

  /** 易错点识别依据 */
  common_mistake: string[];

  /** 几何模型识别依据 */
  geometry_model: string[];
}
```

---

# 9. QuestionConfidence

```ts
/**
 * AI 分类置信度（ML Inference Metadata Grouping）。
 *
 * 统一收纳所有维度的置信度，避免字段散落。
 * 后续新增维度（如 difficulty、knowledge_point）直接在 Object 内扩 key。
 */
export interface QuestionConfidence {
  /** 题型分类可信度，范围 0 ~ 1 */
  question_type: number;

  /** 易错点识别可信度，范围 0 ~ 1（common_mistake 为 null 时必须为 0） */
  common_mistake: number;

  /** 几何模型识别可信度，范围 0 ~ 1（geometry_model 为 null 时必须为 0） */
  geometry_model: number;

  /**
   * AI 分类依据（可选）。
   *
   * 用于 agent debugging 和置信度热力图展示。
   * 省略时表示未启用证据记录。
   */
  evidence?: ConfidenceEvidence;
}
```

---

# 10. FieldPermissions

```ts
/**
 * 字段级编辑权限映射。
 *
 * 在系统层面 enforce "AI 不得修改 teacher_note" 等约束，
 * 而非仅依赖文档说明。
 */
export interface FieldPermissions {
  /** 仅教师可编辑，AI 和后端自动化流程不得修改 */
  teacher_note: "teacher";

  /** 后续扩展：difficulty: "teacher" | "ai" 等 */
}
```

---

# 11. QuestionMeta

```ts
/**
 * 题目元数据。
 *
 * 收纳不属于题目内容本身但影响系统行为的字段。
 */
export interface QuestionMeta {
  /** 字段级编辑权限映射 */
  editable_by: FieldPermissions;

  /** 后续扩展：created_at, updated_at, reviewed_by 等 */
}
```

---

# 12. Question

```ts
/** 单道题目 */
export interface Question {
  /** 题目唯一编号，格式 Q + 3 位数字，如 "Q001"。系统自动生成，不可重复。 */
  question_id: string;

  /**
   * 题目在原始文档中的顺序编号（从 1 开始）。
   *
   * 下游消费者必须以此字段排序，不得依赖数组索引。
   * 拖拽、插入、删除等操作不会改变 order，确保排序语义稳定。
   */
  order: number;

  /** 原题图片 URL */
  image: string;

  /**
   * Vision 识别后的题目文字内容。
   * OCR 失败时为空字符串 `""`（语义存在但值为空）。
   */
  ocr_text: string;

  /** 题型分类。无法匹配时为 { id: "unknown", name: "待教师确认" } */
  question_type: QuestionType;

  /** 常见错误。无匹配时为 null（语义不存在） */
  common_mistake: CommonMistake;

  /** 几何模型。不涉及时为 null（语义不存在） */
  geometry_model: GeometryModel;

  /**
   * 教师备注，默认为空字符串 `""`（语义存在但为空）。
   *
   * 仅教师可编辑。权限由 meta.editable_by.teacher_note 在系统层面 enforce。
   */
  teacher_note: string;

  /** AI 分类置信度 */
  confidence: QuestionConfidence;

  /** 题目元数据（权限、审计等） */
  meta?: QuestionMeta;
}
```

---

# 13. ChapterData

```ts
/** 完整章节数据，对应 API 返回与本地状态 */
export interface ChapterData {
  /** 章节信息 */
  chapter: Chapter;

  /** 题目列表，按 order 升序排列 */
  questions: Question[];
}
```

---

# 14. UploadImage

```ts
/** 上传图片状态 */
export interface UploadImage {
  /** 前端生成的唯一 ID */
  id: string;

  /** 原始文件名 */
  file_name: string;

  /** 本地预览 URL */
  preview_url: string;

  /** 上传状态 */
  status: "waiting" | "uploading" | "success" | "error";
}
```

---

# 15. AnalysisStep

```ts
/** AI 分析步骤 */
export type AnalysisStep =
  | "vision"
  | "segmentation"
  | "question_type"
  | "common_mistake"
  | "geometry_model"
  | "json_generation"
  | "completed";
```

---

# 16. ExportConfig

```ts
/** 导出配置 */
export interface ExportConfig {
  /** 导出文件名 */
  file_name: string;

  /** 导出格式（MVP 仅支持 docx，pdf 为预留） */
  format: "docx" | "pdf";
}
```

---

# 17. WorkspaceState

```ts
/** 教师工作台状态 */
export interface WorkspaceState {
  /** 当前在 Inspector 中查看的题目 ID，未选中时为 null */
  selected_question_id: string | null;

  /** 左侧 Skill Tree 当前筛选的题型 ID，null 表示显示全部 */
  selected_question_type_id: string | null;

  /** 批量选中的题目 ID 列表 */
  selected_ids: string[];
}
```

---

# 18. APIResponse

```ts
/** 统一 API 返回格式 */
export interface APIResponse {
  /** 请求是否成功 */
  success: boolean;

  /** 提示信息 */
  message: string;

  /** 章节数据 */
  data: ChapterData;
}
```

---

# 19. null vs "" 语义规范

`null` 与 `""` 有明确语义区分，不可混用：

| 字段 | 空值 | 语义 |
| --- | --- | --- |
| `common_mistake` | `null` | 语义不存在——此题无易错点 |
| `geometry_model` | `null` | 语义不存在——此题不涉及几何模型 |
| `teacher_note` | `""` | 语义存在但为空——教师尚未填写 |
| `ocr_text` | `""` | 语义存在但为空——OCR 执行了但识别失败 |

> 这是工程级规范：很多团队会全用 `null` 或全用空字符串。正确的做法是根据"语义是否存在"来决定。

---

# 20. Constraints Summary

| # | 规则 |
| --- | --- |
| 1 | 所有分类字段（`Chapter`、`QuestionType`、`CommonMistake`、`GeometryModel`）统一使用 `Reference` 类型 |
| 2 | 所有置信度统一收纳在 `QuestionConfidence` 中，范围 0 ~ 1 |
| 3 | `common_mistake` 为 `null` 时 `confidence.common_mistake` 必须为 `0` |
| 4 | `geometry_model` 为 `null` 时 `confidence.geometry_model` 必须为 `0` |
| 5 | AI 不允许生成 `Question` 接口之外的字段 |
| 6 | `teacher_note` 仅由教师编辑，系统通过 `meta.editable_by` enforce |
| 7 | 所有页面共享同一套数据模型 |
| 8 | 下游消费者必须按 `order` 字段排序，不得依赖数组索引 |
| 9 | 本文件与 `05_JSON_SCHEMA.md` 一一对应，修改任一方必须同步另一方 |
| 10 | Skill Library 的 id 不可变，name 可变更但必须递增 version |
