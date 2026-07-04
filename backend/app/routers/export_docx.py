"""
Export API — 生成 DOCX 讲义

POST /api/export/docx  → 接收 ChapterData → 返回 .docx 文件下载
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import io

from app.models.schemas import ChapterData
from app.services.export import generate_docx

router = APIRouter(tags=["export"])


@router.post("/export/docx")
async def export_docx(data: ChapterData):
    """
    将章节数据导出为可编辑的 Word 讲义（.docx）

    请求体：完整的 ChapterData JSON
    响应：.docx 文件流

    前端使用方式：
      const res = await fetch("/api/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chapterData),
      });
      const blob = await res.blob();
      // 触发浏览器下载
    """
    try:
        docx_bytes = generate_docx(data)

        file_name = f"{data.chapter.name} 错题整理.docx"

        return StreamingResponse(
            io.BytesIO(docx_bytes),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f'attachment; filename="{file_name}"',
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"导出失败: {str(e)}")
