# Teacher Copilot
An AI-powered Error Organization System for Middle School Mathematics Teachers
Transform exam papers into structured teaching materials in minutes.
Built a domain-specific Skill Library for junior high school geometry classification, covering 7 triangle question types with structured recognition rules, knowledge points, misconception patterns and few-shot examples.
________________________________________
# Overview
Teacher Copilot is an AI-native teaching assistant designed for middle school mathematics teachers.
Instead of acting as another AI chatbot, Teacher Copilot is built around the real workflow of lesson preparation. It helps teachers transform scattered exam papers and screenshots into structured teaching materials through AI-assisted classification, error analysis and document generation.
The first MVP focuses on one specific scenario:
Automatically organize Triangle chapter error questions into structured teaching notes.
The goal is not to replace teachers.
The goal is to eliminate repetitive work so teachers can spend more time teaching.
________________________________________
# Why We Build This
Teachers spend a considerable amount of time organizing error questions after every examination.
A typical workflow today looks like this:
Take Photos
        ↓
OCR
        ↓
Copy into Word
        ↓
Manually Classify Questions
        ↓
Summarize Error Points
        ↓
Adjust Layout
        ↓
Generate Teaching Materials
OCR solves only one problem:
Converting images into text.
However, the most time-consuming work begins after OCR.
Teachers still need to:
•	classify questions
•	identify knowledge points
•	summarize common mistakes
•	organize teaching materials
This process is repetitive, manual and difficult to standardize.
Teacher Copilot is designed to solve this missing step.
________________________________________
# Product Vision
We believe AI should understand how teachers organize knowledge, rather than simply answering questions.
Teacher Copilot introduces a structured teaching workflow:
Exam Paper
        ↓
OCR
        ↓
Question Segmentation
        ↓
Skill Classification
        ↓
Error Pattern Analysis
        ↓
Teacher Review
        ↓
Teaching Material Export
AI assists.
Teachers make the final decision.
________________________________________
# Target Users
Primary Users
Middle School Mathematics Teachers
Typical characteristics:
•	Prepare lessons every day
•	Frequently organize examination papers
•	Need reusable teaching materials
•	Prefer editable Word documents
________________________________________
# Future Users
•	Private tutors
•	After-school training teachers
•	Pre-service mathematics teachers
________________________________________
# MVP Scope
The first MVP intentionally focuses on only one chapter:
Chapter 03 — Triangle
Supported Features
•	Upload exam images
•	OCR recognition
•	Question segmentation
•	Question type classification (7 types)
•	Common mistake recognition (6 patterns)
•	Geometry model recognition (5 models)
•	Manual adjustment
•	Word export
Not Included
•	User accounts
•	Cloud synchronization
•	Student management
•	AI tutoring
•	Multi-subject support
Our philosophy is simple:
Build one workflow exceptionally well before expanding.
________________________________________
# AI Workflow
Upload Images
        ↓
Vision Understanding（OCR + Math Recognition）
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
Teacher Review & Edit
        ↓
Export Teaching Document（DOCX）
Teacher Copilot is not designed to generate unrestricted AI responses.
Instead, every question is transformed into structured teaching knowledge.
________________________________________
# Skill Library
Unlike general-purpose LLMs, Teacher Copilot classifies every question according to a predefined teaching Skill Library.
Current MVP includes the Triangle chapter with three classification dimensions:

Question Types (7 types)

| ID | Skill |
| --- | --- |
| triangle_01 | 三角形三边关系应用 |
| triangle_02 | 三角形内角和与外角角度计算 |
| triangle_03 | 三角形重要线段性质应用 |
| triangle_04 | 全等三角形及其性质 |
| triangle_05 | 全等三角形基础判定证明（SAS/ASA/AAS/SSS） |
| triangle_06 | 全等三角形辅助线问题 |
| triangle_07 | 三角形折叠动态角度问题 |

Common Mistakes (6 patterns)

| ID | Pattern |
| --- | --- |
| mistake_01 | 三角形三边关系判断疏漏 |
| mistake_02 | 钝角三角形高的位置判断错误 |
| mistake_03 | SAS判定忽略"夹角"条件 |
| mistake_04 | 全等三角形对应边、对应角找错 |
| mistake_05 | 三角形中线、角平分线、高线概念混淆 |
| mistake_06 | 未分类讨论（遗漏多解） |

Geometry Models (5 models)

| ID | Model |
| --- | --- |
| model_01 | 双角平分线模型（含 3 种子模型） |
| model_02 | 倍长中线模型 |
| model_03 | 一线三等角模型 |
| model_04 | 手拉手旋转模型 |
| model_05 | 等角三角形中的半角模型 |

The Skill Library defines the teacher's thinking process instead of allowing AI to invent new categories.
Teachers may also create custom skills when necessary.
________________________________________
# Core Features
# Upload
Upload one or multiple examination images.
Supported formats:
•	JPG
•	PNG
•	PDF（converted to images for processing）
________________________________________
# AI Classification
Automatically identify:
•	Question Type（based on Skill Library, 7 types）
•	Common Mistake（6 patterns, optional — can be null）
•	Geometry Model（5 models, optional — can be null）
•	Confidence Score（0 ~ 1 per dimension, with evidence trace）
________________________________________
# Human Review
Teachers can:
•	Edit AI results
•	Drag questions between skills
•	Reorder questions
•	Create custom skills
•	Add teaching notes
•	Rename exported files
Every AI output remains editable.
________________________________________
# Export
Generate editable teaching documents.
Example:
Triangle Error Collection

Question Type 01
三角形三边关系应用

Question 1

Image
[Original question image]

OCR Text
已知AB=5，AC=8，求BC的取值范围。

Common Mistake
忽略两边之和大于第三边

Geometry Model
无

Teacher Note
课堂重点讲解辅助线作法

--------------------------------

Question 2
...
The exported document is designed for direct classroom use instead of AI demonstration.
________________________________________
# Product Principles
AI Copilot
AI assists teachers.
Teachers always make the final decision.
________________________________________
Structured First
Every AI output must be structured.
Example:
{
  "question_type": { "id": "triangle_01", "name": "三角形三边关系应用" },
  "common_mistake": { "id": "mistake_01", "name": "忽略两边之和大于第三边" },
  "geometry_model": null,
  "confidence": {
    "question_type": 0.98,
    "common_mistake": 0.91,
    "geometry_model": 0
  },
  "teacher_note": ""
}
Structured data enables editing, exporting and future expansion.
________________________________________
Human in the Loop
Teachers remain part of every important decision.
AI provides suggestions.
Teachers approve or modify them.
________________________________________
Reusable Teaching Assets
Every organized question becomes part of the teacher's personal knowledge base.
Today's organization becomes tomorrow's teaching resource.
________________________________________
# Design Decisions
Why only Triangle?
Because MVP is designed to validate the workflow instead of maximizing feature coverage.
A complete workflow for one chapter is more valuable than incomplete support for all chapters.
________________________________________
Why not use free-form AI responses?
Teachers require consistency.
Teacher Copilot uses predefined Skill Libraries to reduce hallucinations and improve classification stability.
________________________________________
Why allow manual editing?
AI will inevitably make mistakes.
Instead of forcing regeneration, teachers can directly modify results.
This creates a faster and more trustworthy workflow.
________________________________________
Why export Word instead of keeping everything online?
Teachers still rely heavily on editable Word documents for lesson preparation and printing.
The product should fit teachers' existing workflow rather than forcing new habits.
________________________________________
# Success Metrics
The MVP will be considered successful if it achieves the following goals:
•	AI classification accuracy ≥ 90%
•	Reduce manual organization time by at least 50%
•	Successfully export editable teaching documents
•	Teachers are willing to reuse the product for future lesson preparation
________________________________________
# Planned Tech Stack
Frontend
•	Next.js
•	React
•	TypeScript
•	Tailwind CSS
Backend
•	FastAPI
AI
•	OpenAI API（Vision + Structured Output）
•	Prompt Engineering
Export
•	python-docx
________________________________________
# Roadmap
Version 1.0（MVP）
•	Triangle chapter（专题03 三角形）
•	7 question types + 6 common mistakes + 5 geometry models
•	AI classification with confidence & evidence
•	Editable workspace（three-column layout）
•	DOCX export

Version 2.0
•	Multiple chapters（四边形、圆、函数等）
•	Personal question bank
•	Classification history
•	Search
•	PDF export

Version 3.0
•	Teaching knowledge graph
•	AI lesson preparation
•	Intelligent worksheet generation
________________________________________
# Project Structure
TeacherCopilot/

README.md
AGENTS.md

docs/
├── 00_PROJECT_STRUCTURE.md
├── 01_User_Journey.md
├── 02_User_Story.md
├── 03_Page_Spec.md
├── 04_AI_Flow.md
├── 05_JSON_SCHEMA.md
├── 06_TypeScript_Interface.md

skills/
└── triangle/
    ├── 01_triangle_skills.json
    └── triangle_examples.pdf

prompts/

frontend/

backend/
________________________________________
👤 Author
Lynn Wang
AI Product Manager Portfolio Project
________________________________________
Teachers should spend time teaching, not formatting Word documents.
