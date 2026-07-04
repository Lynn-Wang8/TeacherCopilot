"""
AI 服务 — 调用智谱 / DeepSeek 进行题目分类

流程：
  OCR 文本 → DeepSeek + classify_prompt → 结构化分类结果

使用方式：
  from app.services.ai import classify_questions
  result = await classify_questions(["已知AB=5，AC=8，求BC的取值范围", ...])

依赖：需要设置环境变量 OPENAI_API_KEY
"""

import os
import json
import re
from typing import Optional

from app.models.schemas import (
    Question,
    QuestionType,
    CommonMistake,
    GeometryModel,
    QuestionConfidence,
    ConfidenceEvidence,
)


# ── 分类 Prompt（从 prompts/classify_prompt.md 提取的核心部分）──

SYSTEM_PROMPT = """你是一位拥有 10 年教龄的初中数学教研组长。
你的任务是将学生错题按照指定的 Skill Library 进行分类。

核心原则：
- 必须严格依照 Skill Library 选择分类，不得自创题型
- 如果不确定题型，返回 { "id": "unknown", "name": "待教师确认" }
- 易错点和几何模型不确定时返回 null

Skill Library — 题型（7 类，必选其一）：
| ID | 题型 | 特征 |
| triangle_01 | 三角形三边关系应用 | 求第三边范围、判断能否构成三角形 |
| triangle_02 | 三角形内角和与外角角度计算 | 求角度、内角和180°、外角关系 |
| triangle_03 | 三角形重要线段性质应用 | 中线/角平分线/高线性质 |
| triangle_04 | 全等三角形及其性质 | 利用全等性质求边/角 |
| triangle_05 | 全等三角形基础判定证明 | SAS/ASA/AAS/SSS 直接判定 |
| triangle_06 | 全等三角形辅助线问题 | 需要添加辅助线 |
| triangle_07 | 三角形折叠动态角度问题 | 折叠/翻折变换 |

Skill Library — 易错点（6 类，可为 null）：
mistake_01: 三角形三边关系判断疏漏
mistake_02: 钝角三角形高的位置判断错误
mistake_03: SAS判定忽略"夹角"条件
mistake_04: 全等三角形对应边、对应角找错
mistake_05: 三角形中线、角平分线、高线概念混淆
mistake_06: 未分类讨论（遗漏多解）

Skill Library — 几何模型（5 类，可为 null）：
model_01: 双角平分线模型
model_02: 倍长中线模型
model_03: 一线三等角模型
model_04: 手拉手旋转模型
model_05: 等角三角形中的半角模型

分类规则：
1. 每道题必须且只能归入一个题型
2. 先分类题型 → 再判断易错点 → 最后判断几何模型
3. 易错点和几何模型均可为 null
4. null 时对应置信度为 0

输出格式（严格 JSON）：
{
  "question_id": "Q00X",
  "order": N,
  "ocr_text": "...",
  "question_type": { "id": "triangle_0X", "name": "..." },
  "common_mistake": { "id": "mistake_0X", "name": "..." } | null,
  "geometry_model": { "id": "model_0X", "name": "..." } | null,
  "teacher_note": "",
  "confidence": {
    "question_type": 0.95,
    "common_mistake": 0.88,
    "geometry_model": 0,
    "evidence": {
      "question_type": ["关键词1", "关键词2"],
      "common_mistake": ["关键词"],
      "geometry_model": []
    }
  }
}

请直接返回 JSON 数组，不要包含 markdown 代码块标记。"""


# ── API 配置 ──
# 两步分离：Vision（识图） + Classify（分类）
# 通过环境变量切换：
#
#  分类模型（纯文本，必须）:
#    AI_API_KEY=sk-xxx          API Key
#    AI_PROVIDER=deepseek       默认 DeepSeek（便宜 20 倍）
#    AI_MODEL=deepseek-chat     模型名
#    AI_BASE_URL=https://api.deepseek.com
#
#  视觉模型（图片 OCR，可选）:
#    VISION_API_KEY=sk-xxx      Vision API Key
#    VISION_PROVIDER=qwen       默认 Qwen-VL（阿里，性价比高）
#    VISION_MODEL=qwen-vl-plus  模型名

_AI_CONFIG = {
    "deepseek":    {"base_url": "https://api.deepseek.com",          "model": "deepseek-chat"},
    "openai":      {"base_url": "https://api.openai.com/v1",         "model": "gpt-4o"},
    "qwen":        {"base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1", "model": "qwen-vl-plus"},
    "glm":         {"base_url": "https://open.bigmodel.cn/api/paas/v4", "model": "glm-4v-flash"},
    "moonshot":    {"base_url": "https://api.moonshot.cn/v1",        "model": "moonshot-v1-8k"},
}

_provider = os.environ.get("AI_PROVIDER", "deepseek").lower()
_provider_config = _AI_CONFIG.get(_provider, _AI_CONFIG["deepseek"])


def _get_api_config(for_vision: bool = False):
    """获取 API 配置"""
    if for_vision:
        provider = os.environ.get("VISION_PROVIDER", "qwen").lower()
        config = _AI_CONFIG.get(provider, _AI_CONFIG["qwen"])
        base_url = os.environ.get("VISION_BASE_URL", config["base_url"])
        model = os.environ.get("VISION_MODEL", config["model"])
        api_key = os.environ.get("VISION_API_KEY", os.environ.get("AI_API_KEY", ""))
        return base_url, model, api_key, provider

    base_url = os.environ.get("AI_BASE_URL", _provider_config["base_url"])
    model = os.environ.get("AI_MODEL", _provider_config["model"])
    api_key = os.environ.get("AI_API_KEY", os.environ.get("OPENAI_API_KEY", ""))

    return base_url, model, api_key, _provider


async def _call_ai(messages: list[dict], for_vision: bool = False) -> str:
    """统一的 AI API 调用（OpenAI 兼容格式）"""
    import httpx

    base_url, model, key, provider = _get_api_config(for_vision)

    if not key:
        raise ValueError(
            f"未设置 API Key。{'Vision' if for_vision else '分类'} 模型需要 Key：\n"
            f"  {'VISION_API_KEY' if for_vision else 'AI_API_KEY'}=sk-xxx\n"
            f"获取: https://platform.deepseek.com/api_keys"
        )

    url = f"{base_url.rstrip('/')}/chat/completions"

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            url,
            headers={
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": messages,
                "temperature": 0.1,
                "max_tokens": 1024 if for_vision else 4096,
            },
        )

        if response.status_code != 200:
            raise RuntimeError(
                f"{provider} API 调用失败 (HTTP {response.status_code}): {response.text[:500]}"
            )

        return response.json()["choices"][0]["message"]["content"]


# ── API 调用 ──

# ── 步骤 1：图片 OCR（可选，需要 Vision 模型）──

async def ocr_images(image_urls: list[str]) -> list[str]:
    """
    使用 Vision 模型从图片中提取题目文字

    Args:
        image_urls: 图片 URL 或 base64 列表

    Returns:
        list[str]: 每张图片的 OCR 文字
    """
    results = []
    for url in image_urls:
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": url},
                    },
                    {
                        "type": "text",
                        "text": "请提取这张图片中的数学题文字，只输出题目原文，不要添加解释。",
                    },
                ],
            }
        ]
        text = await _call_ai(messages, for_vision=True)
        results.append(text.strip())

    return results


# ── 步骤 2：题目分类（纯文本，DeepSeek 足够）──

async def classify_questions(
    ocr_texts: list[dict],
    api_key: Optional[str] = None,
) -> list[Question]:
    """
    对一批题目文本进行 AI 分类

    Args:
        ocr_texts: [{"question_id": "Q001", "order": 1, "ocr_text": "..."}, ...]

    Returns:
        list[Question]: Pydantic 模型列表
    """
    # 构建用户消息
    user_message = "请对以下数学题目进行分类：\n\n"
    for item in ocr_texts:
        user_message += f"[{item['question_id']}] {item['ocr_text']}\n"

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message},
    ]

    content = await _call_ai(messages, for_vision=False)

    # 解析 JSON 响应
    return _parse_response(content, ocr_texts)


def _parse_response(content: str, ocr_texts: list[dict]) -> list[Question]:
    """解析 AI 返回的 JSON，容错处理"""
    # 去除可能的 markdown 代码块标记
    content = content.strip()
    if content.startswith("```"):
        content = re.sub(r"^```(?:json)?\s*", "", content)
        content = re.sub(r"```\s*$", "", content)

    try:
        raw_list = json.loads(content)
    except json.JSONDecodeError:
        # 尝试提取 JSON 数组
        match = re.search(r"\[.*\]", content, re.DOTALL)
        if match:
            raw_list = json.loads(match.group())
        else:
            raise ValueError(f"无法解析 AI 返回的 JSON:\n{content[:500]}")

    questions = []
    for i, raw in enumerate(raw_list):
        # 强制使用输入中的 question_id 和 order（AI 不可信）
        raw["question_id"] = ocr_texts[i]["question_id"] if i < len(ocr_texts) else f"Q{i+1:03d}"
        raw["order"] = ocr_texts[i]["order"] if i < len(ocr_texts) else i + 1
        raw.setdefault("image", "")
        raw.setdefault("teacher_note", "")
        raw.setdefault("meta", {"editable_by": {"teacher_note": "teacher"}})

        # 确保 confidence 结构完整
        if "confidence" not in raw:
            raw["confidence"] = {
                "question_type": 0.5,
                "common_mistake": 0,
                "geometry_model": 0,
            }
        conf = raw["confidence"]
        conf.setdefault("common_mistake", 0)
        conf.setdefault("geometry_model", 0)

        # null 检查：对应字段为 null 时置信度设为 0
        if raw.get("common_mistake") is None:
            conf["common_mistake"] = 0
        if raw.get("geometry_model") is None:
            conf["geometry_model"] = 0

        questions.append(Question(**raw))

    return questions


# ── Mock 模式（无 API Key 时使用）──

def classify_questions_mock(ocr_texts: list[dict]) -> list[Question]:
    """
    Mock 分类：使用简单的关键词匹配，不调用 AI
    用于开发和演示环境
    """
    # 关键词 → 题型 映射表
    KEYWORD_MAP = [
        (["取值范围", "能否构成", "组成三角形", "三边关系", "两边之和", "两边之差"], "triangle_01", "三角形三边关系应用"),
        (["内角和", "外角", "角度", "度数", "∠", "180°"], "triangle_02", "三角形内角和与外角角度计算"),
        (["中线", "角平分线", "高线", "重心", "垂线", "中点", "三线"], "triangle_03", "三角形重要线段性质应用"),
        (["全等", "≌", "对应边", "对应角", "全等三角形"], "triangle_04", "全等三角形及其性质"),
        (["SAS", "ASA", "AAS", "SSS", "判定", "证明全等", "求证"], "triangle_05", "全等三角形基础判定证明"),
        (["辅助线", "倍长", "延长", "构造", "截长补短"], "triangle_06", "全等三角形辅助线问题"),
        (["折叠", "翻折", "重合", "对称", "折痕"], "triangle_07", "三角形折叠动态角度问题"),
    ]

    MISSTAKE_MAP = [
        (["两边之差", "第三边范围", "忽略条件"], "mistake_01", "三角形三边关系判断疏漏"),
        (["钝角", "高在外部", "高线位置"], "mistake_02", "钝角三角形高的位置判断错误"),
        (["SAS", "夹角", "边边角", "不是夹角"], "mistake_03", "SAS判定忽略「夹角」条件"),
        (["对应边", "对应角", "对应关系", "找错"], "mistake_04", "全等三角形对应边、对应角找错"),
        (["概念混淆", "三线混淆", "搞混"], "mistake_05", "三角形中线、角平分线、高线概念混淆"),
        (["分类讨论", "两种情况", "多解", "遗漏"], "mistake_06", "未分类讨论（遗漏多解）"),
    ]

    MODEL_MAP = [
        (["角平分线", "BP平分", "CP平分", "双角平分线"], "model_01", "双角平分线模型"),
        (["倍长中线", "延长中线", "中线加倍"], "model_02", "倍长中线模型"),
        (["三等角", "一线三等角", "共线等角"], "model_03", "一线三等角模型"),
        (["手拉手", "旋转全等", "共顶点等边"], "model_04", "手拉手旋转模型"),
        (["半角", "半角模型", "倍半关系"], "model_05", "等角三角形中的半角模型"),
    ]

    def match(text: str, mapping: list) -> Optional[dict]:
        for keywords, id_, name in mapping:
            for kw in keywords:
                if kw in text:
                    return {"id": id_, "name": name, "version": "v1"}
        return None

    results = []
    for item in ocr_texts:
        text = item["ocr_text"]
        q_type = match(text, KEYWORD_MAP) or {"id": "unknown", "name": "待教师确认", "version": "v1"}
        mistake = match(text, MISSTAKE_MAP)
        model = match(text, MODEL_MAP)

        question = Question(
            question_id=item["question_id"],
            order=item["order"],
            image="",
            ocr_text=text,
            question_type=QuestionType(**q_type),
            common_mistake=CommonMistake(**mistake) if mistake else None,
            geometry_model=GeometryModel(**model) if model else None,
            teacher_note="",
            confidence=QuestionConfidence(
                question_type=0.85 if q_type["id"] != "unknown" else 0.3,
                common_mistake=0.8 if mistake else 0,
                geometry_model=0.85 if model else 0,
                evidence=ConfidenceEvidence(
                    question_type=[kw for kws, _, _ in KEYWORD_MAP for kw in kws if kw in text],
                    common_mistake=[kw for kws, _, _ in MISSTAKE_MAP for kw in kws if kw in text],
                    geometry_model=[kw for kws, _, _ in MODEL_MAP for kw in kws if kw in text],
                ),
            ),
            meta={"editable_by": {"teacher_note": "teacher"}},
        )
        results.append(question)

    return results
