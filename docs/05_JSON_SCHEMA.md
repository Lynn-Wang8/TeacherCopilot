# 05 JSON Schema

> Project：Teacher Copilot
> Version：MVP v1.0
> Status：Ready for Development

---

# 1. Overview

本文件定义 Teacher Copilot 全流程唯一数据结构（Single Source of Truth）。

| 消费者 | 用途 |
| --- | --- |
| AI（OpenAI Structured Output） | 按 Schema 输出 JSON，不得输出额外字段 |
| 前端（React / Next.js） | 渲染 Workspace，驱动所有页面状态 |
| 后端（FastAPI） | 接收 AI 输出、持久化、传给 DOCX 生成器 |
| DOCX Generator | 读取最终 JSON，按题型生成 Word 讲义 |

---

# 2. Design Principle：Reference Object

本 Schema 中所有**分类字段**统一采用 Reference Object（引用对象）模式：

```json
{
  "id": "triangle_01",
  "name": "三角形三边关系应用",
  "version": "v1"
}
```

## 2.1 方案对比

| 方案 | 写法 | 问题 |
| --- | --- | --- |
| 纯字符串 | `"question_type": "triangle_01"` | 前端每次显示都要查 Skill Library 拿中文名 |
| 完整对象 | `"question_type": { "id": "...", "name": "...", "description": "...", "keywords": [...] }` | 每道题复制几十 KB，极度浪费 |
| **Reference Object** ✅ | `"question_type": { "id": "triangle_01", "name": "三角形三边关系应用", "version": "v1" }` | 前端直接用 `.name`，体积最小，id 不变则老数据不坏，version 防语义漂移 |

## 2.2 字段说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | String | 是 | 唯一标识，格式 `snake_case`，例如 `triangle_01`、`mistake_05`、`model_01` |
| `name` | String | 是 | 显示名称，前端直接 `.name` 渲染，无需二次查表 |
| `version` | String | 否 | 版本标签，例如 `"v1"`。Skill Library 改名时递增版本号，UI 可据此检测历史数据语义是否过期 |

## 2.3 设计意图

- `id` 永远不变 → 历史数据可追溯
- `name` 可能随 Skill Library 更新而变化 → `version` 标记语义版本，防止题库语义漂移
- 前端可直接 render `.name`，同时通过 `version` 差异提示教师"该分类名称已更新"
- 这是一个 **lightweight domain reference pattern**，在可读性与稳定性之间做折中

## 2.4 适用范围

| 字段 | 类型 |
| --- | --- |
| `chapter` | Reference |
| `question_type` | Reference |
| `common_mistake` | Reference 或 null |
| `geometry_model` | Reference 或 null |
| 后续新增 `difficulty`、`knowledge_point` 等 | Reference 或 null |

---

# 3. Skill Library Contract

AI 输出的所有分类 id 必须来自 Skill Library。本章定义 Skill Library 与 Schema 之间的契约。

| 属性 | 值 |
| --- | --- |
| 来源（source） | internal registry（项目内置注册表，非外部 API） |
| 存储形式 | JSON 文件，纳入版本管理 |
| id 格式 | `snake_case`，如 `triangle_01`、`mistake_05`、`model_01` |
| id 不可变性（immutable） | 是。一旦分配，永不更改 |
| name 可变性 | 允许更新，但必须同步递增 `version` |
| AI 权限 | 只读。AI 只能从已有条目中选择，不得创造新 id |

## 3.1 不确定处理（Human-in-the-Loop Hook）

| 场景 | 返回值 | 意图 |
| --- | --- | --- |
| 题型无法匹配 | `{ "id": "unknown", "name": "待教师确认" }` | 不阻断 pipeline，进入 teacher correction loop |
| 易错点无法匹配 | `null` | 语义不存在 |
| 几何模型无法匹配 | `null` | 语义不存在 |

`"unknown"` fallback 是关键设计：它让 AI 在不确定时仍然输出合法 JSON，同时 UI 可将其渲染为"待处理卡片"，引导教师介入纠正。

---

# 4. Root Object

```json
{
  "chapter": {
    "id": "triangle",
    "name": "专题03 三角形",
    "version": "v1"
  },
  "questions": []
}
```

---

# 5. Question Object

```json
{
  "question_id": "Q001",
  "order": 1,
  "image": "",
  "ocr_text": "",
  "question_type": {
    "id": "triangle_03",
    "name": "三角形重要线段性质应用",
    "version": "v1"
  },
  "common_mistake": {
    "id": "mistake_05",
    "name": "三角形中线、角平分线、高线概念混淆",
    "version": "v1"
  },
  "geometry_model": {
    "id": "model_01",
    "name": "双角平分线模型",
    "version": "v1"
  },
  "teacher_note": "",
  "confidence": {
    "question_type": 0.97,
    "common_mistake": 0.88,
    "geometry_model": 0.92,
    "evidence": {
      "question_type": ["triangle inequality", "两边之和大于第三边"],
      "common_mistake": ["中线性质", "角平分线定义"],
      "geometry_model": []
    }
  },
  "meta": {
    "editable_by": {
      "teacher_note": "teacher"
    }
  }
}
```

---

# 6. Field Definition

## 6.1 chapter

| 属性 | 值 |
| --- | --- |
| 类型 | Object (Reference) |
| 必填 | 是 |
| 可为 null | 否 |

子字段：

| 字段 | 类型 | 说明 | 示例 |
| --- | --- | --- | --- |
| `id` | String | 章节唯一标识 | `"triangle"` |
| `name` | String | 章节显示名称 | `"专题03 三角形"` |
| `version` | String（可选） | 版本标签 | `"v1"` |

说明：MVP 固定为三角形章节。后续章节（四边形、圆、函数等）统一复用此结构。

---

## 6.2 question_id

| 属性 | 值 |
| --- | --- |
| 类型 | String |
| 必填 | 是 |
| 可为 null | 否 |
| 格式 | `Q` + 3 位数字，如 `"Q001"` |

说明：题目唯一编号，系统自动生成，不可重复。

---

## 6.3 order

| 属性 | 值 |
| --- | --- |
| 类型 | Number（整数） |
| 必填 | 是 |
| 可为 null | 否 |
| 起始值 | `1` |

说明：题目在原始文档中的顺序编号。DOCX 生成器和其他下游消费者**必须**以此字段排序，不得依赖数组索引。防止拖拽、插入、删除等操作导致数组顺序语义失真。

---

## 6.4 image

| 属性 | 值 |
| --- | --- |
| 类型 | String |
| 必填 | 是 |
| 可为 null | 否 |

说明：原题图片 URL。保留原图作为教学资源，不强制重绘几何图形。

---

## 6.5 ocr_text

| 属性 | 值 |
| --- | --- |
| 类型 | String |
| 必填 | 是 |
| 可为 null | 否 |
| 空值 | `""`（OCR 失败时） |

说明：Vision 识别后的题目文字内容。允许教师修改。

> **null vs "" 规范：** `""` 表示"语义存在但值为空"（OCR 执行了但识别失败），`null` 表示"语义不存在"（如无几何模型时不设此字段）。以下字段同理。

---

## 6.6 question_type

| 属性 | 值 |
| --- | --- |
| 类型 | Object (Reference) |
| 必填 | 是 |
| 可为 null | 否 |
| 来源 | Skill Library（详见 §3） |

子字段：

| 字段 | 类型 | 说明 | 示例 |
| --- | --- | --- | --- |
| `id` | String | Skill ID | `"triangle_03"` |
| `name` | String | Skill 显示名称 | `"三角形重要线段性质应用"` |
| `version` | String（可选） | 版本标签 | `"v1"` |

约束：

- AI 只能从 Skill Library 中选择已有题型
- 无法匹配时返回 `{ "id": "unknown", "name": "待教师确认" }`
- 教师后续可在 Workspace 中拖拽至正确题型

---

## 6.7 common_mistake

| 属性 | 值 |
| --- | --- |
| 类型 | Object (Reference) 或 null |
| 必填 | 否 |
| 可为 null | 是 |
| 来源 | Skill Library（详见 §3） |

子字段（非 null 时）：

| 字段 | 类型 | 说明 | 示例 |
| --- | --- | --- | --- |
| `id` | String | 错误 ID | `"mistake_05"` |
| `name` | String | 错误描述 | `"三角形中线、角平分线、高线概念混淆"` |
| `version` | String（可选） | 版本标签 | `"v1"` |

约束：

- 无法匹配或无易错点 → `null`
- `null` 时 `confidence.common_mistake` 必须为 `0`

---

## 6.8 geometry_model

| 属性 | 值 |
| --- | --- |
| 类型 | Object (Reference) 或 null |
| 必填 | 否 |
| 可为 null | 是 |
| 来源 | Skill Library（详见 §3） |

子字段（非 null 时）：

| 字段 | 类型 | 说明 | 示例 |
| --- | --- | --- | --- |
| `id` | String | 模型 ID | `"model_01"` |
| `name` | String | 模型名称 | `"双角平分线模型"` |
| `version` | String（可选） | 版本标签 | `"v1"` |

约束：

- 不涉及特定几何模型 → `null`
- `null` 时 `confidence.geometry_model` 必须为 `0`

---

## 6.9 teacher_note

| 属性 | 值 |
| --- | --- |
| 类型 | String |
| 必填 | 是 |
| 可为 null | 否 |
| 默认值 | `""` |

约束：

- 仅教师在 Workspace 中编辑
- AI 不得修改此字段
- 权限由 `meta.editable_by.teacher_note` 在系统层面 enforce（详见 §6.11）

---

## 6.10 confidence

| 属性 | 值 |
| --- | --- |
| 类型 | Object |
| 必填 | 是 |
| 可为 null | 否 |

子字段：

| 字段 | 类型 | 范围 | 说明 |
| --- | --- | --- | --- |
| `question_type` | Number | 0 ~ 1 | 题型分类可信度 |
| `common_mistake` | Number | 0 ~ 1 | 易错点识别可信度 |
| `geometry_model` | Number | 0 ~ 1 | 几何模型识别可信度 |
| `evidence` | Object | — | AI 分类依据（可选，用于 agent debugging） |

`evidence` 子字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `question_type` | String[] | 命中关键词 / 规则 / token |
| `common_mistake` | String[] | 命中关键词 / 规则 / token |
| `geometry_model` | String[] | 命中关键词 / 规则 / token |

说明：

- 统一收纳所有维度的 AI 置信度，避免字段散落
- 对应分类字段为 `null` 时，该维度置信度必须为 `0`
- 后续新增维度（如 `difficulty`、`knowledge_point`）直接在 `confidence` 内扩 key，不污染 root schema
- `evidence` 为可选字段，用于未来 agent debugging 和置信度热力图展示
- 这是一个典型的 **ML inference metadata grouping** 设计

---

## 6.11 meta

| 属性 | 值 |
| --- | --- |
| 类型 | Object |
| 必填 | 否 |
| 可为 null | 否 |

子字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `editable_by` | Object | 字段级编辑权限映射 |

`editable_by` 子字段：

| 字段 | 值 | 说明 |
| --- | --- | --- |
| `teacher_note` | `"teacher"` | 仅教师可编辑，AI 和后端自动化流程不得修改 |

说明：

- 仅用文档约束"AI 不得修改"是不够的——`meta.editable_by` 在系统层面提供 enforce 依据
- 前端可根据此映射禁用非授权角色的编辑控件
- 后端可在写操作前校验调用方角色

---

# 7. Empty Value Rules

`null` 与 `""` 有明确语义区分，不可混用：

| 字段 | 条件 | 空值 | 语义 |
| --- | --- | --- | --- |
| `common_mistake` | 无易错点 | `null` | 语义不存在 |
| `geometry_model` | 无几何模型 | `null` | 语义不存在 |
| `teacher_note` | 教师未填写 | `""` | 语义存在但为空 |
| `ocr_text` | OCR 失败 | `""` | 语义存在但为空 |

---

# 8. Constraints Summary

## 8.1 分类来源

| 字段 | 来源 | AI 权限 |
| --- | --- | --- |
| `question_type.id` | Skill Library | 只读选择 |
| `common_mistake.id` | Skill Library | 只读选择 |
| `geometry_model.id` | Skill Library | 只读选择 |

AI 不得创造 Skill Library 中不存在的新分类。

## 8.2 字段约束

| # | 约束 |
| --- | --- |
| 1 | AI 不得输出 Schema 之外的字段 |
| 2 | AI 不得修改 `teacher_note`（系统 enforce via `meta.editable_by`） |
| 3 | 所有 Reference Object 必须同时包含 `id` 和 `name`，`version` 为可选 |
| 4 | `common_mistake` 为 `null` → `confidence.common_mistake` 为 `0` |
| 5 | `geometry_model` 为 `null` → `confidence.geometry_model` 为 `0` |
| 6 | 下游消费者必须按 `order` 字段排序，不得依赖数组索引 |

---

# 9. Complete Example

```json
{
  "chapter": {
    "id": "triangle",
    "name": "专题03 三角形",
    "version": "v1"
  },
  "questions": [
    {
      "question_id": "Q001",
      "order": 1,
      "image": "images/q001.png",
      "ocr_text": "已知AB=5，AC=8，求BC的取值范围。",
      "question_type": {
        "id": "triangle_01",
        "name": "三角形三边关系应用",
        "version": "v1"
      },
      "common_mistake": {
        "id": "mistake_01",
        "name": "忽略两边之和大于第三边",
        "version": "v1"
      },
      "geometry_model": null,
      "teacher_note": "",
      "confidence": {
        "question_type": 0.98,
        "common_mistake": 0.91,
        "geometry_model": 0,
        "evidence": {
          "question_type": ["triangle inequality", "AB+AC>BC"],
          "common_mistake": ["两边之和", "第三边"],
          "geometry_model": []
        }
      },
      "meta": {
        "editable_by": {
          "teacher_note": "teacher"
        }
      }
    },
    {
      "question_id": "Q002",
      "order": 2,
      "image": "images/q002.png",
      "ocr_text": "如图，AD是△ABC的中线，BE是角平分线，求证：...",
      "question_type": {
        "id": "triangle_03",
        "name": "三角形重要线段性质应用",
        "version": "v1"
      },
      "common_mistake": {
        "id": "mistake_05",
        "name": "三角形中线、角平分线、高线概念混淆",
        "version": "v1"
      },
      "geometry_model": {
        "id": "model_01",
        "name": "双角平分线模型",
        "version": "v1"
      },
      "teacher_note": "课堂重点讲解辅助线作法",
      "confidence": {
        "question_type": 0.95,
        "common_mistake": 0.88,
        "geometry_model": 0.92,
        "evidence": {
          "question_type": ["中线", "角平分线", "重要线段"],
          "common_mistake": ["中线性质", "角平分线定义", "高线"],
          "geometry_model": ["双角平分线", "角平分线交点"]
        }
      },
      "meta": {
        "editable_by": {
          "teacher_note": "teacher"
        }
      }
    }
  ]
}
```

---

# 10. Extensibility

## 10.1 新增分类字段

统一采用 Reference Object：

```json
{
  "difficulty": {
    "id": "diff_02",
    "name": "中等",
    "version": "v1"
  }
}
```

## 10.2 新增置信度字段

统一放入 `confidence` Object：

```json
{
  "confidence": {
    "question_type": 0.97,
    "common_mistake": 0.88,
    "geometry_model": 0.92,
    "difficulty": 0.85,
    "evidence": {
      "question_type": ["..."],
      "common_mistake": ["..."],
      "geometry_model": ["..."],
      "difficulty": ["..."]
    }
  }
}
```

## 10.3 新增权限字段

统一放入 `meta.editable_by`：

```json
{
  "meta": {
    "editable_by": {
      "teacher_note": "teacher",
      "difficulty": "teacher"
    }
  }
}
```

## 10.4 原则

| 维度的扩展 | 策略 |
| --- | --- |
| 分类字段 | Reference Object（`{ id, name, version }`） |
| 置信度 | `confidence` Object 内扩 key |
| 权限 | `meta.editable_by` 内扩 key |
| 排序 | `order` 字段，不依赖数组索引 |
| 新增类型 | 不引入新的顶层字段模式，复用已有范式 |
