"""
Pydantic 数据模型 — 与前端 src/types/index.ts 严格对应

任何一方的修改必须同步另一方。
"""

from pydantic import BaseModel, Field
from typing import Optional


# ── Reference（通用引用类型）──

class Reference(BaseModel):
    """
    轻量级领域引用模式（Lightweight Domain Reference Pattern）

    - id 永远不变 → 历史数据可追溯
    - name 可能随 Skill Library 更新而变化
    - version 标记语义版本，防止题库语义漂移
    """
    id: str = Field(..., examples=["triangle_01"])
    name: str = Field(..., examples=["三角形三边关系应用"])
    version: Optional[str] = Field(default=None, examples=["v1"])


# ── Chapter ──

class Chapter(Reference):
    """章节信息。MVP 固定为 triangle，后续扩展为四边形/圆/函数等。"""
    pass


# ── QuestionType / CommonMistake / GeometryModel ──

class QuestionType(Reference):
    """题型分类。AI 无法匹配时返回 { id: "unknown", name: "待教师确认" }"""
    pass


class CommonMistake(Reference):
    """常见错误。无匹配时为 None（语义不存在）"""
    pass


class GeometryModel(Reference):
    """几何模型。不涉及时为 None（语义不存在）"""
    pass


# ── Confidence ──

class ConfidenceEvidence(BaseModel):
    """AI 分类依据（可选，用于 agent debugging）"""
    question_type: list[str] = Field(default_factory=list)
    common_mistake: list[str] = Field(default_factory=list)
    geometry_model: list[str] = Field(default_factory=list)


class QuestionConfidence(BaseModel):
    """AI 分类置信度。范围 0~1。对应字段为 null 时该维度必须为 0"""
    question_type: float = Field(..., ge=0, le=1)
    common_mistake: float = Field(..., ge=0, le=1)
    geometry_model: float = Field(..., ge=0, le=1)
    evidence: Optional[ConfidenceEvidence] = None


# ── QuestionMeta ──

class FieldPermissions(BaseModel):
    teacher_note: str = "teacher"


class QuestionMeta(BaseModel):
    editable_by: FieldPermissions = Field(default_factory=FieldPermissions)


# ── Question ──

class Question(BaseModel):
    """单道题目"""
    question_id: str = Field(..., examples=["Q001"])
    order: int = Field(..., ge=1)
    image: str = Field(default="")
    ocr_text: str = Field(default="")
    question_type: QuestionType
    common_mistake: Optional[CommonMistake] = None
    geometry_model: Optional[GeometryModel] = None
    teacher_note: str = Field(default="")
    confidence: QuestionConfidence
    meta: Optional[QuestionMeta] = None


# ── ChapterData ──

class ChapterData(BaseModel):
    """完整章节数据，对应 API 响应"""
    chapter: Chapter
    questions: list[Question]


# ── API ──

class APIResponse(BaseModel):
    """统一 API 返回格式"""
    success: bool
    message: str
    data: Optional[ChapterData] = None


class ErrorResponse(BaseModel):
    """错误响应"""
    success: bool = False
    message: str
    data: None = None
