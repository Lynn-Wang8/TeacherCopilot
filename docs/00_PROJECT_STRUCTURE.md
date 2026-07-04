# 00_PROJECT_STRUCTURE

> Project: Teacher Copilot  
> Version: MVP v1.0  
> Status: Complete

---

## Project Tree

```
TeacherCopilot/
│
├── README.md                     ← 产品说明 + 技术栈 + Roadmap
├── AGENTS.md                     ← AI 开发规范（给 Claude/Cursor 等 AI 工具读取）
├── CHANGELOG.md                  ← 版本变更记录（Keep a Changelog）
├── DEPLOY.md                     ← 本地运行 / 生产部署指南
├── FEEDBACK.md                   ← 教师可用性测试反馈表
├── LICENSE                       ← MIT
├── .env.example                  ← 环境变量模板（AI_API_KEY 等）
├── .gitignore
├── .eslintrc.json
├── .prettierrc
│
├── package.json                  ← Next.js 项目依赖
├── tsconfig.json                 ← TypeScript 配置
├── next.config.mjs               ← Next.js 配置
├── tailwind.config.ts            ← Tailwind 品牌色 + 设计 Token
├── postcss.config.mjs
│
├── docs/                         ← 产品设计文档
│   ├── 00_PROJECT_STRUCTURE.md   ← 本文件：项目结构说明
│   ├── 01_User_Journey.md        ← 用户旅程 + 痛点分析
│   ├── 02_User_Story.md          ← 用户故事（李老师的 6 步）
│   ├── 03_Page_Spec.md           ← 4 个页面的精确规格
│   ├── 04_AI_Flow.md             ← AI Pipeline 7 阶段流程
│   ├── 05_JSON_SCHEMA.md         ← 全流程唯一数据结构
│   └── 06_TypeScript_Interface.md ← 前端 TS 类型定义
│
├── skills/                       ← Skill Library 知识库（AI 只读）
│   └── triangle/
│       ├── 01_triangle_skills.json   ← 7 题型 + 6 易错点 + 5 模型
│       └── triangle_examples.pdf     ← AI few-shot 参考例题
│
├── prompts/                      ← AI Prompt 模板
│   └── classify_prompt.md        ← 题目分类 Prompt（System Role + Skill Library + 示例）
│
├── data/                         ← 数据文件
│   └── mock_questions.json       ← 8 道 Mock 题目（Question 引用 Skill by id）
│
├── assets/                       ← 静态资源
│   ├── prototype/
│   │   └── index.html            ← 交互原型（可独立打开的完整 4 页流程）
│   └── images/                   ← 截图 / 文档用图
│
├── src/                          ← 前端源码（Next.js App Router）
│   ├── app/
│   │   ├── globals.css           ← Tailwind + CSS 变量（品牌色、间距、圆角）
│   │   ├── layout.tsx            ← 根布局 + Metadata
│   │   └── page.tsx              ← 主页面：页面路由 + 数据流中枢
│   │
│   ├── components/
│   │   ├── shared/
│   │   │   └── Header.tsx        ← 公用 Header（Logo + 步骤指示器）
│   │   ├── upload/
│   │   │   ├── UploadPage.tsx    ← 上传页容器（状态编排）
│   │   │   ├── Dropzone.tsx      ← 拖拽 / 点击上传区域
│   │   │   └── PreviewList.tsx   ← 缩略图列表 + 删除
│   │   ├── analysis/
│   │   │   ├── AnalysisPage.tsx  ← 分析页（4 状态：Waiting/Running/Completed/Failed）
│   │   │   └── Pipeline.tsx      ← 6 步 Pipeline 动画组件
│   │   ├── workspace/
│   │   │   ├── WorkspacePage.tsx ← 工作台容器（ChapterData state + 全部 handler）
│   │   │   ├── StatsBar.tsx      ← 顶部统计栏
│   │   │   ├── Sidebar.tsx       ← 左侧 280px：章节标题 + 题型目录 + 新建题目
│   │   │   ├── QuestionList.tsx  ← 中间：按 order 排序的卡片列表
│   │   │   ├── QuestionCard.tsx  ← 题目卡片（图片 + OCR + 分类标签）
│   │   │   └── Inspector.tsx     ← 右侧 360px：详情编辑 + 置信度 + 可自定义下拉
│   │   └── export/
│   │       └── ExportDrawer.tsx  ← 导出抽屉（文件名 + 格式 + 导出按钮）
│   │
│   ├── data/
│   │   ├── api.ts                ← API 客户端（fetchChapter / analyzeQuestions / exportDocx）
│   │   ├── mockQuestions.ts      ← Mock 数据模块（引用 Skill Library）
│   │   └── skills.ts             ← Skill 常量（题型/易错点/模型列表，前端用）
│   │
│   ├── types/
│   │   └── index.ts              ← 15 个 TypeScript Interface（与 06 文档对应）
│   │
│   └── hooks/
│       └── useUpload.ts          ← 上传状态管理 Hook（文件校验 + 预览 + 原始 File）
│
└── backend/                      ← 后端源码（FastAPI）
    ├── requirements.txt           ← Python 依赖
    ├── app/
    │   ├── main.py                ← FastAPI 入口 + CORS + 路由注册
    │   ├── models/
    │   │   └── schemas.py         ← Pydantic 数据模型（与 TS Interface 对应）
    │   ├── routers/
    │   │   ├── chapter.py         ← GET /api/chapter/{id} + PUT /api/question/{id}
    │   │   ├── analyze.py         ← POST /api/analyze + POST /api/analyze-images
    │   │   └── export_docx.py     ← POST /api/export/docx → .docx 文件流
    │   └── services/
    │       ├── ai.py              ← AI 分类服务（多 Provider + Mock 回退 + Vision OCR）
    │       └── export.py          ← DOCX 生成服务（python-docx）
    └── tests/
        ├── conftest.py            ← pytest fixtures（TestClient）
        ├── test_chapter.py        ← Chapter API 测试（4 tests）
        └── test_analyze.py        ← Analyze API 测试（3 tests）
```

---

## Architecture Overview

```
┌─ Browser ──────────────────────────────────────────────────┐
│                                                              │
│  Upload → Analysis → Workspace → Export                     │
│    │         │           │           │                       │
│    │    Pipeline     三栏布局    ExportDrawer                │
│    │    动画          280/自适应/360   ↓                      │
│    │         │           │        POST /api/export/docx      │
│    │         ↓           │           │                       │
│    │   POST /api/analyze │           ↓                       │
│    │   POST /api/analyze-images     .docx 下载               │
│    │         │           │                                   │
│    ▼         ▼           ▼                                   │
├─ FastAPI (:8000) ───────────────────────────────────────────┤
│    │         │           │                                   │
│    │    ┌────┴────┐      │                                   │
│    │    │ AI Services│     │                                  │
│    │    │           │     │                                   │
│    │    │ 智谱 GLM  │     │                                   │
│    │    │  (OCR)    │     │                                   │
│    │    │     ↓     │     │                                   │
│    │    │ DeepSeek  │     │                                   │
│    │    │ (Classify)│     │                                   │
│    │    └───────────┘     │                                   │
│    │                      │                                   │
│    ▼                      ▼                                   │
│  data/mock_questions.json  ← GET / PUT                       │
│  skills/triangle/*.json    ← Skill Library (AI 只读)         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

| 决策 | 说明 |
|------|------|
| **Reference Object 模式** | `{ id, name, version }` 代替纯字符串，前端直接 render `.name`，`version` 防语义漂移 |
| **Question / Skill 分离** | `mock_questions.json` 引用 `skills/triangle/01_triangle_skills.json`，数据与知识库解耦 |
| **Human in the Loop** | 所有 AI 输出可编辑，`teacher_note` 仅教师可修改（`meta.editable_by` enforce） |
| **Multi-Provider AI** | Vision（智谱/阿里/OpenAI）和 Classify（DeepSeek/OpenAI）独立配置，Mock 自动回退 |
| **null vs "" 语义** | `common_mistake: null` = 语义不存在，`teacher_note: ""` = 语义存在但为空 |
| **order 字段排序** | 下游必须按 `order` 排序，不依赖数组索引（防拖拽/删除导致顺序失真） |

---

## Data Model

```typescript
ChapterData {
  chapter: Reference           // { id, name, version }
  questions: Question[]        // 按 order 排序
}

Question {
  question_id: string          // "Q001"
  order: number                // 从 1 开始
  image: string                // URL 或 base64
  ocr_text: string             // OCR 文字
  question_type: Reference     // 必选，来自 Skill Library
  common_mistake: Reference | null   // 可为空
  geometry_model: Reference | null   // 可为空
  teacher_note: string         // 教师填写，默认 ""
  confidence: {
    question_type: number      // 0~1
    common_mistake: number
    geometry_model: number
    evidence?: { ... }         // 分类依据（可选）
  }
  meta?: { editable_by: { teacher_note: "teacher" } }
}
```

---

## API Endpoints

| Method | Path | 说明 |
|--------|------|------|
| `GET` | `/api/chapter/{id}` | 获取章节完整数据 |
| `PUT` | `/api/question/{id}` | 更新单道题目 |
| `POST` | `/api/analyze` | 文本 → AI 分类 |
| `POST` | `/api/analyze-images` | 图片 → OCR → AI 分类 |
| `POST` | `/api/export/docx` | 导出 Word 讲义 |

---

## Sample Files

| 文件 | 用途 | 谁用 |
|------|------|------|
| `skills/triangle/01_triangle_skills.json` | Skill Library 知识库 | AI 只读，作为分类依据 |
| `data/mock_questions.json` | Mock 题目数据 | 前端加载 + 后端 API 返回 |
| `prompts/classify_prompt.md` | AI 分类 Prompt | 后端 AI Service 读取 |
| `.env.example` | 环境变量模板 | 开发者复制为 `.env` |
| `FEEDBACK.md` | 教师测试反馈表 | 打印给测试教师填写 |
