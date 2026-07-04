# Teacher Copilot
An AI-powered Error Organization System for Middle School Mathematics Teachers
Transform exam papers into structured teaching materials in minutes.
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
•	Skill classification
•	Error pattern generation
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
OCR Recognition
        ↓
Question Segmentation
        ↓
Knowledge Point Recognition
        ↓
Skill Classification
        ↓
Error Pattern Analysis
        ↓
Teacher Review
        ↓
Export Teaching Document
Teacher Copilot is not designed to generate unrestricted AI responses.
Instead, every question is transformed into structured teaching knowledge.
________________________________________
# Skill Library
Unlike general-purpose LLMs, Teacher Copilot classifies every question according to a predefined teaching Skill Library.
Current MVP includes the Triangle chapter.
Example:
Skill ID	Skill
01	Triangle Side Relationships
02	Median / Altitude / Angle Bisector
03	Interior & Exterior Angles
04	Congruent Triangles
05	Isosceles Triangle
...	...
The Skill Library defines the teacher's thinking process instead of allowing AI to invent new categories.
Teachers may also create custom skills when necessary.
________________________________________
# Core Features
# Upload
Upload one or multiple examination images.
Supported formats:
•	JPG
•	PNG
•	PDF
________________________________________
# AI Classification
Automatically identify:
•	Knowledge Point
•	Skill
•	Error Pattern
•	Difficulty
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

Skill 01
Triangle Side Relationships

Question 1
Knowledge Point
...

Error Pattern
...

Teacher Note
...

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
  "knowledge": "",
  "skill": "",
  "error_pattern": "",
  "difficulty": "",
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
•	Tailwind CSS
Backend
•	FastAPI
AI
•	OpenAI API
•	OCR
•	Prompt Engineering
•	Structured Output
Export
•	DOCX Generator
________________________________________
# Roadmap
Version 1.0
•	Triangle chapter
•	AI classification
•	Editable workspace
•	Word export
________________________________________
Version 2.0
•	Multiple chapters
•	Personal question bank
•	Classification history
•	Search
________________________________________
Version 3.0
•	Teaching knowledge graph
•	AI lesson preparation
•	Intelligent worksheet generation
________________________________________
# Project Structure
teacher-copilot/

README.md

docs/
├── 01_User_Journey.md
├── 02_User_Story.md
├── 03_Page_Spec.md
├── 04_AI_Flow.md
├── 05_System_Architecture.md
├── 06_Prompt_Design.md
├── 07_Tech_Architecture.md
├── 08_Development_Log.md

frontend/

backend/
________________________________________
👤 Author
Lynn Wang
AI Product Manager Portfolio Project
________________________________________
Teachers should spend time teaching, not formatting Word documents.

