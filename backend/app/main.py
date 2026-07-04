"""
Teacher Copilot — FastAPI 后端入口

运行方式：
    cd backend
    uvicorn app.main:app --reload

然后打开 http://localhost:8000/docs 查看自动生成的 API 文档
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import chapter, analyze

# 创建 FastAPI 实例
app = FastAPI(
    title="Teacher Copilot API",
    description="AI 错题备课助手后端",
    version="0.1.0",
)

# CORS — 允许前端 (Next.js :3000) 访问后端 (:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(chapter.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")


@app.get("/")
def root():
    """健康检查"""
    return {"message": "Teacher Copilot API is running", "version": "0.1.0"}
