import React from "react";

interface VirtualKeyProgressBarProps {
  percent: number;
}

export const VirtualKeyProgressBar: React.FC<VirtualKeyProgressBarProps> = ({ percent }) => {
  const getFillColor = (pct: number) => {
    if (pct > 100) return "bg-rose-700 dark:bg-rose-600 shadow-rose-600/30";
    if (pct >= 95) return "bg-rose-600 dark:bg-rose-500 shadow-rose-500/20";
    if (pct >= 85) return "bg-amber-600 dark:bg-amber-500 shadow-amber-500/20";
    if (pct >= 70) return "bg-amber-500 dark:bg-amber-400 shadow-amber-500/20";
    return "bg-indigo-600 dark:bg-indigo-500 shadow-indigo-500/20";
  };

  return (
    <div className="w-full bg-neutral-200/70 dark:bg-neutral-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-neutral-200/40 dark:border-neutral-700/40 relative">
      <div
        className={`h-full rounded-full transition-all duration-500 group-hover:brightness-110 ${getFillColor(
          percent
        )}`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
      {percent > 100 && (
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-rose-500 animate-pulse" title="Budget Exceeded Overflow" />
      )}
    </div>
  );
};
