import type { ChapterData, Question } from "@/types";

const API_BASE = "http://localhost:8000/api";

/**
 * AI 分类题目
 *
 * 发送 OCR 文本列表 → 后端调用 AI → 返回分类后的结构化数据
 */
/**
 * 完整 AI Pipeline：图片 → OCR → 分类
 *
 * 上传图片 → 后端调智谱 GLM OCR → DeepSeek 分类 → 返回结果
 */
export async function analyzeImages(
  chapterId: string,
  chapterName: string,
  files: File[],
): Promise<ChapterData> {
  const formData = new FormData();
  formData.append("chapter_id", chapterId);
  formData.append("chapter_name", chapterName);
  files.forEach((f) => formData.append("files", f));

  const res = await fetch(`${API_BASE}/analyze-images`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API 请求失败: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "未知错误");
  }

  return json.data as ChapterData;
}

/**
 * 纯文本 AI 分类（已有 OCR 文字时使用）
 */
export async function analyzeQuestions(
  chapterId: string,
  chapterName: string,
  questions: { question_id: string; order: number; ocr_text: string }[],
): Promise<ChapterData> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chapter_id: chapterId,
      chapter_name: chapterName,
      questions,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API 请求失败: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "未知错误");
  }

  return json.data as ChapterData;
}

/**
 * 获取章节完整数据
 *
 * 以后替换数据源只需改这里：
 *   const res = await fetch(`${API_BASE}/chapter/triangle`);
 * 改成：
 *   const res = await fetch(`${API_BASE}/chapter/${id}`);
 */
export async function fetchChapter(chapterId: string): Promise<ChapterData> {
  const res = await fetch(`${API_BASE}/chapter/${chapterId}`);

  if (!res.ok) {
    throw new Error(`API 请求失败: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "未知错误");
  }

  return json.data as ChapterData;
}

/**
 * 更新单道题目（教师修改后保存）
 */
export async function updateQuestionOnServer(
  questionId: string,
  question: Question,
): Promise<ChapterData> {
  const res = await fetch(`${API_BASE}/question/${questionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  });

  if (!res.ok) {
    throw new Error(`API 请求失败: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "未知错误");
  }

  return json.data as ChapterData;
}
