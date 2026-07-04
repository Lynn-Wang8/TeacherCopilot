# 03_Page_Spec

Version: MVP v1.0
Product: Teacher Copilot
Platform: Web
Language: 中文
Status: Ready for Development

---

# 1. Overview

## 1.1 页面目标

Teacher Copilot 是一款 AI 辅助教师备课工具。

本产品不是聊天机器人，不提供 AI 对话，不提供搜题功能。

产品聚焦于一个核心任务：

> 将教师上传的数学错题图片，自动整理为可编辑、可导出的结构化备课文档。

教师始终拥有最终修改权，AI 仅负责识别、分类与整理。

---

# 2. Information Architecture

整个 MVP 共包含四个页面。

Upload
↓

AI Analysis
↓

Teacher Workspace
↓

Export

页面之间采用线性流程，不提供复杂导航。

---

# 3. Page 01 - 上传图片（Upload）

## 页面目标

收集教师待整理的数学题图片。

## 页面布局

顶部：

Teacher Copilot Logo

产品标题

中部：

图片上传区域（Drag & Drop）

底部：

开始分析按钮

## 上传区域

支持：

JPG

PNG

PDF（MVP 可转图片处理）

支持：

拖拽上传

点击上传

批量上传

上传后显示缩略图。

每张图片支持：

删除

重新上传

继续添加

## 页面状态

Empty

未上传图片

Uploading

上传中

Uploaded

上传完成

Error

上传失败

## 页面按钮

开始分析

只有至少上传一张图片后允许点击。

---

# 4. Page 02 - AI Analysis

## 页面目标

展示 AI 正在处理图片。

用户无需任何操作。

## 页面布局

页面中央：

分析动画

分析步骤

当前状态

## AI Pipeline

① Vision Analysis

识别图片内容

↓

② Question Segmentation

切分题目

↓

③ Question Type Classification

识别题型

↓

④ Common Mistake Recognition

识别易错点

↓

⑤ Geometry Model Recognition

识别模型

↓

⑥ Generate Structured JSON

生成结构化数据

## 页面状态

Waiting

Running

Completed

Failed

若失败：

允许重新分析。

---

# 5. Page 03 - Teacher Workspace

## 页面目标

教师审核 AI 分类结果。

所有 AI 输出均允许修改。

本页面为整个产品核心页面。

---

## 页面布局

采用三栏布局。

Left Sidebar（280px）

Question List（自适应）

Inspector（360px）

---

### Left Sidebar

展示：

题型目录

固定七类。

例如：

题型1

三角形三边关系应用（5）

题型2

三角形内角和与外角角度计算（3）

……

支持：

点击筛选

拖拽排序（预留）

显示题目数量

---

### Center - Question Workspace

每道题以 Card 展示。

Card 包含：

原题图片

OCR 文本（可折叠）

AI 分类结果

Question Type

Common Mistake

Geometry Model

Teacher Note

支持：

拖拽

展开

收起

删除

多选（预留）

---

Question Card 示例

──────────────────

题号：Q001

【图片】

OCR：

......

————————————

题型

三角形重要线段性质应用

易错点

三角形中线、角平分线、高线概念混淆

模型

双角平分线模型

教师备注

____________

──────────────────

---

### Right Inspector

点击题目后显示详情。

所有字段允许修改。

字段包括：

Question Type（下拉）

Common Mistake（下拉，可为空）

Geometry Model（下拉，可为空）

Teacher Note（文本）

修改后自动保存。

---

# 6. Page 04 - Export

## 页面目标

导出教师最终备课文档。

采用 Drawer。

包含：

文件名称

导出格式

导出按钮

默认文件名：

2026-07-04 三角形错题整理

导出格式：

DOCX

PDF（Coming Soon）

---

# 7. AI Output Fields

AI 必须输出以下字段：

Question Type（必填）

Common Mistake（可为空）

Geometry Model（可为空）

Confidence（置信度）

Teacher Note 默认为空。

---

# 8. Interaction Rules

上传完成后方可分析。

AI 完成后自动进入 Workspace。

所有修改实时保存。

允许重新分析。

导出前无需再次确认。

---

# 9. Design System

整体风格：

Modern

Minimal

Workspace First

参考：

Notion

Linear

Cursor

禁止：

聊天界面

气泡消息

AI 助手对话框

颜色：

Primary：

#2563EB

Background：

#F8FAFC

Border：

#E5E7EB

圆角：

12px

阴影：

轻量级 Shadow

字体：

Inter（英文）

PingFang SC（中文）

---

# 10. MVP Scope

MVP 仅支持：

专题03 三角形

输出 DOCX

Web 平台

不支持：

账号系统

多学科

云同步

AI 讲题

移动端

未来可扩展：

四边形

圆

函数

更多章节