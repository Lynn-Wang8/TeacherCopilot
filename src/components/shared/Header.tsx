"use client";

type AppPage = "upload" | "analysis" | "workspace";

const STEPS: { key: AppPage; label: string }[] = [
  { key: "upload", label: "上传" },
  { key: "analysis", label: "分析" },
  { key: "workspace", label: "工作台" },
];

interface HeaderProps {
  currentPage: AppPage;
  actions?: React.ReactNode;
}

export default function Header({ currentPage, actions }: HeaderProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentPage);

  return (
    <header className="flex h-header items-center border-b border-border bg-surface px-6">
      <h1 className="whitespace-nowrap text-lg font-bold text-primary">
        📐 Teacher <span className="font-medium text-text-primary">Copilot</span>
      </h1>

      <div className="ml-auto flex items-center gap-3">
        {actions}
        <div className="flex items-center gap-1">
          {STEPS.map((step, i) => {
            let bgClass = "bg-background text-text-muted";
            if (i < currentIndex) bgClass = "bg-[#DCFCE7] text-[#15803D]";
            else if (i === currentIndex) bgClass = "bg-primary text-white";

            return (
              <span
                key={step.key}
                className={`rounded-full px-3 py-1 text-xs font-medium ${bgClass}`}
              >
                {i + 1} {step.label}
              </span>
            );
          })}
        </div>
      </div>
    </header>
  );
}
