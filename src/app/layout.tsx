import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teacher Copilot — AI 错题备课助手",
  description:
    "面向初中数学教师的一站式 AI 错题整理助手。上传作业图片，自动分类题型，导出结构化备课讲义。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
