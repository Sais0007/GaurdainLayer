import React from "react";
import { cn } from "../../ui/utils";

interface TeamBudgetBadgeProps {
  percent: number;
}

export const TeamBudgetBadge: React.FC<TeamBudgetBadgeProps> = ({ percent }) => {
  const getBadgeStyle = (pct: number) => {
    if (pct >= 95) {
      return "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 shadow-rose-500/10";
    }
    if (pct >= 85) {
      return "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 shadow-amber-500/10";
    }
    if (pct >= 70) {
      return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 shadow-amber-500/10";
    }
    return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shadow-emerald-500/10";
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-[11px] font-mono font-extrabold border shadow-2xs transition-all",
        getBadgeStyle(percent)
      )}
    >
      {percent}%
    </span>
  );
};
