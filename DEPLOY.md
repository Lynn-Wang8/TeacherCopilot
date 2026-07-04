# Teacher Copilot — 部署指南

## 本地运行

### 1. 前端（Next.js）

```bash
cd TeacherCopilot
npm install
npm run dev
# → http://localhost:3000
```

### 2. 后端（FastAPI）

```bash
cd backend
pip install -r requirements.txt

# 设置 API Key（PowerShell）
$env:AI_API_KEY="sk-your-deepseek-key"
$env:VISION_API_KEY="your-zhipu-key"

# 启动
uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs （API 文档）
```

### 3. 测试

```bash
cd backend
python -m pytest tests/ -v
```

---

## 生产部署

### 前端 → Vercel（免费）

1. 推送代码到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入仓库
3. Framework: Next.js，自动检测
4. 部署完成

### 后端 → Railway / Render（免费额度）

1. 在 [railway.app](https://railway.app) 新建项目
2. 设置 Root Directory: `backend`
3. 设置 Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. 在 Environment Variables 中添加 `AI_API_KEY`
5. 部署完成后，将前端 `src/data/api.ts` 中的 `API_BASE` 改为生产 URL

---

## 教师可用性测试

### 测试任务（约 15 分钟）

1. **上传图片**（2 分钟）
   - 拍摄 3-5 张三角形作业照片
   - 拖入上传区域
   - 点击"开始分析"

2. **审核 AI 分类**（5 分钟）
   - 在左侧题型目录切换查看
   - 检查 AI 分类是否准确
   - 修改分类错误的题目
   - 尝试删除不用的题型

3. **添加备注**（3 分钟）
   - 为典型错题添加教学备注
   - 尝试新建自定义题型

4. **导出讲义**（2 分钟）
   - 点击"导出 Word"
   - 设置文件名
   - 下载并打开 DOCX

5. **反馈**（3 分钟）
   - 填写反馈表

### 观察指标

- 是否能独立完成全流程？
- AI 分类准确率感受如何？
- 最困惑的操作是什么？
- 是否愿意在真实备课中使用？
- 最希望增加的功能是什么？
