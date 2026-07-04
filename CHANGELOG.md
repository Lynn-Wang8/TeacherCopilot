# Changelog

All notable changes to Teacher Copilot will be documented in this file.

---

## [0.1.0] — 2026-07-04

### Added
- **Phase 0**: Repository setup (README, .gitignore, CHANGELOG, LICENSE)
- **Phase 1**: Next.js + TypeScript + Tailwind CSS project initialization
- **Phase 2**: TypeScript interfaces (15 types, strict per spec)
- **Phase 3**: Upload page (drag & drop, thumbnails, file validation)
- **Phase 4**: AI Analysis page (6-step pipeline animation, 4 states)
- **Phase 5**: Teacher Workspace (3-column layout, skill tree, question cards, inspector)
- **Phase 6**: Export Drawer (file name, format selection, slide-in animation)
- **Phase 7**: FastAPI backend + frontend API integration
- **Phase 8**: AI integration (DeepSeek + GLM-4V-Flash, multi-provider support)
- **Phase 9**: DOCX export with python-docx (structured teaching document)
- **Phase 10**: API tests (pytest, 7 tests all passing)
- **Phase 11**: Deployment guide, .env.example, teacher feedback template

### Documentation
- User Journey (01), User Story (02), Page Spec (03)
- AI Flow (04), JSON Schema (05), TypeScript Interface (06)
- Skill Library: Triangle chapter (7 types + 6 mistakes + 5 models)
- Interactive prototype (4-page flow)
- AI Classification Prompt

### Architecture
- Frontend: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- Backend: FastAPI + Pydantic + python-docx
- AI: DeepSeek (classify) + GLM-4V-Flash (OCR) with mock fallback
- Data: Reference Object pattern, Question/Skill separation
- Design: Human-in-the-Loop, AI suggests, teacher decides
