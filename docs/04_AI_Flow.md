# 04_AI_Flow

Version: MVP v1.0
Product: Teacher Copilot
Status: Ready for Development

---

# 1. Overview

Teacher Copilot 采用 Human-in-the-Loop 的 AI 工作流。

AI 负责识别、分析、组织知识。

教师负责审核、修改和最终导出。

整个流程遵循：

图片 → AI理解 → 教师确认 → Word讲义

AI 不直接生成最终结果。

教师始终拥有最终编辑权。

---

# 2. AI Pipeline

整体流程如下：

Teacher Upload

↓

Vision Understanding

↓

Question Segmentation

↓

Question Type Classification

↓

Common Mistake Recognition

↓

Geometry Model Recognition

↓

Structured JSON Generation

↓

Teacher Review

↓

Word Export

---

# 3. Phase 1：Image Input

输入：

教师上传图片。

支持：

JPG

PNG

PDF（转换为图片处理）

允许一次上传多张图片。

输出：

Image List

---

# 4. Phase 2：Vision Understanding

目标：

理解图片内容。

AI 使用智谱 GLM-4V（或其他多模态模型）完成：

• 图片内容理解

• 数学文字识别

• 数学公式理解

• 几何图形理解

• 题号识别

输出：

Raw OCR + Layout Information

说明：

此阶段不仅识别文字，还需要理解图片中的几何关系。

---

# 5. Phase 3：Question Segmentation

目标：

将整张试卷切分为独立题目。

每道题生成唯一 Question ID。

例如：

Q001

Q002

Q003

……

若发现：

①

②

③

等小问，

默认作为同一道题处理。

输出：

Question List

---

# 6. Phase 4：Question Type Classification

目标：

识别题目所属题型。

分类依据：

01_triangle_skills.json

AI 必须严格按照 Skill Library 分类。

不得创造新的题型。

MVP 共支持七类：

1. 三角形三边关系应用

2. 三角形内角和与外角角度计算

3. 三角形重要线段性质应用

4. 全等三角形及其性质

5. 全等三角形基础判定证明

6. 全等三角形辅助线问题

7. 三角形折叠动态角度问题

输出：

Question Type

Confidence

若置信度较低：

仍输出最接近题型，

供教师修改。

---

# 7. Phase 5：Common Mistake Recognition

目标：

判断题目是否涉及常见易错点。

依据：

Skill Library 中定义的 Common Mistake。

允许为空。

当前支持：

• 三边关系判断疏漏

• 钝角三角形高的位置判断错误

• SAS 判定忽略夹角

• 对应边对应角找错

• 三线概念混淆

• 分类讨论遗漏

输出：

Common Mistake

Confidence

---

# 8. Phase 6：Geometry Model Recognition

目标：

识别题目涉及的重要几何模型。

依据：

Skill Library。

允许为空。

当前支持：

• 双角平分线模型

• 倍长中线模型

• 一线三等角模型

• 手拉手旋转模型

• 半角模型

输出：

Geometry Model

Confidence

---

# 9. Phase 7：Structured JSON Generation

AI 最终输出统一 JSON。

JSON 不包含排版信息。

仅包含结构化数据。

字段包括：

Question ID

OCR Text

Question Type

Common Mistake

Geometry Model

Confidence

Teacher Note（默认空）

所有后续页面均读取该 JSON。

---

# 10. Teacher Review

AI 输出后进入教师工作台。

教师可：

修改题型

修改易错点

修改模型

新增备注

删除题目

新增题型（自定义）

教师修改优先级最高。

AI 不会再次覆盖教师修改。

---

# 11. Word Generation

点击导出后：

系统读取最终 JSON。

按照：

专题

↓

题型

↓

题目

生成 DOCX。

每道题包含：

原题图片

OCR（可选）

易错点

模型

教师备注

生成后允许继续编辑。

---

# 12. Error Handling

若图片无法识别：

提示重新上传。

若分类失败：

Question Type：

待教师确认

若易错点无法判断：

返回 null。

若模型无法识别：

返回 null。

系统不得编造不存在的信息。

---

# 13. Design Principles

整个 AI Workflow 遵循：

Human in the Loop

Structure First

Editable Everything

Single Source of Truth

AI Assist, Human Decide

MVP 优先保证：

稳定

可解释

可修改

而不是追求完全自动化。