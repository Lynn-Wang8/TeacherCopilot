"""
Analyze API — 调用 AI 对题目进行分类

POST /api/analyze  → 接收 OCR 文本，返回分类后的结构化数据
"""

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.models.schemas import ChapterData, Chapter, APIResponse
from app.services.ai import classify_questions, classify_questions_mock

router = APIRouter(tags=["analyze"])


# ── 请求体 ──

class AnalyzeRequest(BaseModel):
    """分析请求"""
    chapter_id: str = Field(default="triangle", examples=["triangle"])
    chapter_name: str = Field(default="专题03 三角形", examples=["专题03 三角形"])
    questions: list[dict] = Field(
        ...,
        examples=[[
            {"question_id": "Q001", "order": 1, "ocr_text": "已知AB=5，AC=8，求BC的取值范围。"},
            {"question_id": "Q002", "order": 2, "ocr_text": "在△ABC中，∠A=50°，∠B=70°，求∠C。"},
        ]],
        description="OCR 识别后的题目文本列表",
    )


# ── 端点 ──

@router.post("/analyze", response_model=APIResponse)
async def analyze_questions(request: AnalyzeRequest):
    """
    对上传的题目进行 AI 分类

    如果有 OPENAI_API_KEY 环境变量 → 调用 GPT-4o
    否则 → 使用关键词 Mock 分类

    示例请求体：
    {
      "chapter_id": "triangle",
      "chapter_name": "专题03 三角形",
      "questions": [
        {"question_id": "Q001", "order": 1, "ocr_text": "已知AB=5，AC=8，求BC的取值范围。"}
      ]
    }
    """
    try:
        # 判断用真 AI 还是 Mock
        api_key = os.environ.get("AI_API_KEY") or os.environ.get("OPENAI_API_KEY")
        provider = os.environ.get("AI_PROVIDER", "deepseek")

        if api_key:
            classified = await classify_questions(request.questions)
            mode = f"AI ({provider})"
        else:
            classified = classify_questions_mock(request.questions)
            mode = "Mock (关键词匹配)"

        chapter_data = ChapterData(
            chapter=Chapter(
                id=request.chapter_id,
                name=request.chapter_name,
                version="v1",
            ),
            questions=classified,
        )

        return APIResponse(
            success=True,
            message=f"分类完成（{mode}），共 {len(classified)} 道题",
            data=chapter_data,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"分析失败: {str(e)}")
