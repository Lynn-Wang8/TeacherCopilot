import type { Reference } from "@/types";

/**
 * 题型列表 — 来自 Skill Library
 * 用于 Sidebar 筛选和 Inspector 下拉选项
 */
export const QUESTION_TYPES: Reference[] = [
  { id: "triangle_01", name: "三角形三边关系应用", version: "v1" },
  { id: "triangle_02", name: "三角形内角和与外角角度计算", version: "v1" },
  { id: "triangle_03", name: "三角形重要线段性质应用", version: "v1" },
  { id: "triangle_04", name: "全等三角形及其性质", version: "v1" },
  { id: "triangle_05", name: "全等三角形基础判定证明", version: "v1" },
  { id: "triangle_06", name: "全等三角形辅助线问题", version: "v1" },
  { id: "triangle_07", name: "三角形折叠动态角度问题", version: "v1" },
];

/**
 * 易错点列表 — 来自 Skill Library
 * 用于 Inspector 下拉选项
 */
export const COMMON_MISTAKES: Reference[] = [
  { id: "mistake_01", name: "三角形三边关系判断疏漏", version: "v1" },
  { id: "mistake_02", name: "钝角三角形高的位置判断错误", version: "v1" },
  { id: "mistake_03", name: "SAS判定忽略「夹角」条件", version: "v1" },
  { id: "mistake_04", name: "全等三角形对应边、对应角找错", version: "v1" },
  { id: "mistake_05", name: "三角形中线、角平分线、高线概念混淆", version: "v1" },
  { id: "mistake_06", name: "未分类讨论（遗漏多解）", version: "v1" },
];

/**
 * 几何模型列表 — 来自 Skill Library
 * 用于 Inspector 下拉选项
 */
export const GEOMETRY_MODELS: Reference[] = [
  { id: "model_01", name: "双角平分线模型", version: "v1" },
  { id: "model_02", name: "倍长中线模型", version: "v1" },
  { id: "model_03", name: "一线三等角模型", version: "v1" },
  { id: "model_04", name: "手拉手旋转模型", version: "v1" },
  { id: "model_05", name: "等角三角形中的半角模型", version: "v1" },
];
