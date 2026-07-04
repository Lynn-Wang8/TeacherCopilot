import type { ChapterData, Question } from "@/types";

const API_BASE = "http://localhost:8000/api";

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
