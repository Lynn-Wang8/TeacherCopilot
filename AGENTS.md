# AGENTS.md

> Project：Teacher Copilot
> Version：MVP v1.0

---

# Project Overview

Teacher Copilot 是一个面向初中数学教师的一站式 AI 错题整理助手。

产品目标不是替代教师教学，而是帮助教师完成备课过程中最耗时的重复整理工作。

核心流程：

> 图片 → AI分析 → 教师工作台 → Word讲义

整个产品遵循：

**Human in the Loop（AI建议，教师决策）**

---

# Product Vision

帮助教师把时间留给教学，而不是留给 Word 排版。

AI负责：

* 图片理解
* 题型分类
* 知识点整理
* 易错点总结

教师负责：

* 修改
* 审核
* 教学

---

# MVP Scope

当前版本仅实现：

## 输入

* 上传数学作业图片
* 支持 JPG / PNG

## AI能力

* OCR识别
* 数学题理解（Vision）
* Skill Library 分类
* 知识点识别
* 易错点生成

## 工作台

教师可以：

* 查看分类结果
* 修改分类
* 拖拽题目
* 新建题型
* 编辑备注
* 导出 Word

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend

* FastAPI

## AI

* OpenAI API（Vision + Structured Output）

## Export

* python-docx

---

# UI Principles

整个产品采用：

现代 AI Workspace 风格。

设计要求：

* 中文界面
* 白色背景
* 蓝色品牌色
* 卡片式布局
* 极简风格
* 信息密度高
* 不做营销官网风格
* 不使用聊天机器人界面

产品更接近：

Notion

*

Linear

*

Cursor

而不是：

ChatGPT

---

# Workspace Layout

统一采用三栏布局。

左侧：

题型目录

中间：

题目列表

右侧：

题目详情

所有页面保持一致。

---

# Development Principles

所有开发遵循以下原则：

## 1.

每次只实现一个功能。

不要一次开发整个产品。

---

## 2.

先完成 UI。

后接 AI。

最后接真实数据。

---

## 3.

所有组件保持可复用。

不要复制代码。

---

## 4.

所有 AI 返回统一 JSON。

不要直接返回 Markdown。

---

## 5.

教师可以修改所有 AI 输出。

任何 AI 内容都不能锁定。

---

## 6.

不要删除已有功能。

如果需要修改：

优先重构。

不要重写。

---

# AI Design Principles

AI 永远不是最终决策者。

任何时候：

教师拥有最终控制权。

如果 AI 分类不确定：

返回：

> 待教师确认

不要自行创造新题型。

---

# Skill Library

Skill Library 为当前产品唯一分类标准。

AI 必须：

优先匹配已有 Skill。

如果无法匹配：

返回：

待教师确认

教师后续可创建自定义题型。

---

# Data Flow

整个产品统一采用：

```text
Image

↓

Structured JSON

↓

Workspace

↓

Updated JSON

↓

Word
```

不要：

```text
Image

↓

Word
```

JSON 是整个产品唯一的数据中心。

---

# File Structure

```
TeacherCopilot

README.md

AGENTS.md

docs/

frontend/

backend/
```

所有产品文档放入：

docs/

所有代码分别放入：

frontend/

backend/

---

# Coding Rules

所有代码：

* 保持模块化
* 保持可维护
* 使用 TypeScript
* 使用 ESLint
* 使用 Prettier

组件：

一个组件一个职责。

不要超过 300 行。

---

# Development Workflow

开发顺序固定：

1. 页面 UI
2. 页面交互
3. 假数据
4. API
5. AI
6. 测试
7. 部署

不要跳步骤。

---

# Current Goal

当前目标：

完成 MVP。

验证：

教师是否愿意使用 AI 整理错题。

不是：

实现所有 AI 教学能力。

所有开发应围绕 MVP 展开。

---

# Success Criteria

MVP 成功标准：

教师能够：

* 上传图片；
* 自动获得题型分类；
* 手动调整分类；
* 导出 Word；

整个流程控制在 10 分钟以内。

如果达到以上目标，则 MVP 验证成功。