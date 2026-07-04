"""
Analyze API — 调用 AI 对题目进行分类

POST /api/analyze         → 接收 OCR 文本 → DeepSeek 分类
POST /api/analyze-images  → 接收图片 → 智谱 GLM OCR → DeepSeek 分类
"""

import os
import base64
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field

from app.models.schemas import ChapterData, Chapter, Question, APIResponse
from app.services.ai import classify_questions, classify_questions_mock, ocr_images

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


# ── 图片分析端点（完整 pipeline）──

@router.post("/analyze-images", response_model=APIResponse)
async def analyze_images(
    chapter_id: str = "triangle",
    chapter_name: str = "专题03 三角形",
    files: list[UploadFile] = File(...),
):
    """
    完整 AI Pipeline：图片 → OCR → 分类

    流程：
    1. 接收图片（JPG/PNG）
    2. 智谱 GLM-4V-Flash OCR 提取文字
    3. DeepSeek 题型分类
    4. 返回结构化 JSON

    也可以用纯文本端点：POST /api/analyze
    """
    try:
        # Step 1: 图片转 base64
        base64_images = []
        file_names = []
        for f in files:
            content = await f.read()
            b64 = base64.b64encode(content).decode("utf-8")
            ext = f.filename.split(".")[-1] if f.filename else "png"
            base64_images.append(f"data:image/{ext};base64,{b64}")
            file_names.append(f.filename or "unknown")

        # Step 2: OCR（智谱 GLM / 其他 Vision 模型）
        vision_key = os.environ.get("VISION_API_KEY") or os.environ.get("AI_API_KEY")
        use_vision = bool(vision_key)

        if use_vision:
            ocr_texts = await ocr_images(base64_images)
        else:
            # 无 Vision Key → 使用文件名作为占位 OCR
            ocr_texts = [f"图片: {name}" for name in file_names]

        # Step 3: 分类（DeepSeek / Mock）
        classify_key = os.environ.get("AI_API_KEY") or os.environ.get("OPENAI_API_KEY")
        questions_input = [
            {
                "question_id": f"Q{i+1:03d}",
                "order": i + 1,
                "ocr_text": text,
            }
            for i, text in enumerate(ocr_texts)
        ]

        if classify_key:
            classified = await classify_questions(questions_input)
            mode = "OCR + AI 分类"
        else:
            classified = classify_questions_mock(questions_input)
            mode = "OCR + Mock 分类"

        # 把上传的图片 base64 填回 Question.image 字段
        # 当前 MVP：多题来自同张图时共享该图
        # 完整版需要 Question Segmentation（图片切分）
        if len(base64_images) == 1 and len(classified) > 1:
            # 一张图含多道题 → 共享同一张整图
            for q in classified:
                q.image = base64_images[0]
        else:
            for i, q in enumerate(classified):
                if i < len(base64_images):
                    q.image = base64_images[i]

        chapter_data = ChapterData(
            chapter=Chapter(id=chapter_id, name=chapter_name, version="v1"),
            questions=classified,
        )

        return APIResponse(
            success=True,
            message=f"分析完成（{mode}），共 {len(classified)} 道题",
            data=chapter_data,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"分析失败: {str(e)}")
