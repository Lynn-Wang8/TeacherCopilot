"""
Chapter API — 获取章节数据、更新题目

GET  /api/chapter/{chapter_id}  → 获取完整章节数据
PUT  /api/question/{question_id} → 更新单道题目（教师修改）
"""

import json
from pathlib import Path
from fastapi import APIRouter, HTTPException

from app.models.schemas import ChapterData, Question, APIResponse

router = APIRouter(tags=["chapter"])

# Mock 数据路径（相对于项目根目录）
DATA_FILE = Path(__file__).parent.parent.parent.parent / "data" / "mock_questions.json"

# 内存中的数据副本（首次加载后缓存在内存，重启恢复）
_cache: dict[str, ChapterData] = {}


def _load_chapter(chapter_id: str) -> ChapterData:
    """从 JSON 文件加载章节数据（首次加载后缓存）"""
    if chapter_id in _cache:
        return _cache[chapter_id]

    if not DATA_FILE.exists():
        raise HTTPException(status_code=404, detail=f"数据文件不存在: {DATA_FILE}")

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        raw = json.load(f)

    # Pydantic 自动校验 JSON → Python 对象
    chapter_data = ChapterData(**raw)
    _cache[chapter_id] = chapter_data
    return chapter_data


def _save_chapter(chapter_id: str):
    """保存缓存中的章节数据回 JSON 文件（MVP 阶段用文件持久化）"""
    if chapter_id not in _cache:
        return
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(
            _cache[chapter_id].model_dump(),
            f,
            ensure_ascii=False,
            indent=2,
        )


# ── Endpoints ──

@router.get("/chapter/{chapter_id}", response_model=APIResponse)
def get_chapter(chapter_id: str):
    """
    获取章节完整数据（所有题目）

    示例：GET /api/chapter/triangle
    """
    # MVP 仅支持 triangle 章节
    if chapter_id != "triangle":
        raise HTTPException(
            status_code=404,
            detail=f"章节 '{chapter_id}' 不存在。当前仅支持: triangle",
        )
    data = _load_chapter(chapter_id)
    return APIResponse(
        success=True,
        message=f"已加载 {len(data.questions)} 道题目",
        data=data,
    )


@router.put("/question/{question_id}", response_model=APIResponse)
def update_question(question_id: str, updated: Question):
    """
    教师修改题目（题型、易错点、模型、备注等）

    示例：PUT /api/question/Q001
    Body: { "question_id": "Q001", ... }
    """
    # MVP 阶段：从三角形章节数据中查找
    data = _load_chapter("triangle")

    for i, q in enumerate(data.questions):
        if q.question_id == question_id:
            data.questions[i] = updated
            _cache["triangle"] = data
            _save_chapter("triangle")
            return APIResponse(
                success=True,
                message=f"已更新 {question_id}",
                data=data,
            )

    raise HTTPException(status_code=404, detail=f"题目 {question_id} 不存在")
