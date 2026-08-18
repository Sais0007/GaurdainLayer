import React from "react";
import { TrendingUp, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

export type BudgetHealthStatus = "healthy" | "warning" | "critical";

interface ChartHeaderProps {
  title?: string;
  subtitle?: string;
  status?: BudgetHealthStatus;
  statusLabel?: string;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  title = "Budget Burn Rate Trajectory",
  subtitle = "Cumulative organization spend versus monthly budget trajectory.",
  status = "healthy",
  statusLabel = "On Track",
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case "critical":
        return "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 shadow-rose-500/10";
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 shadow-amber-500/10";
      case "healthy":
      default:
        return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shadow-emerald-500/10";
    }
  };

  const StatusIcon = status === "critical" ? AlertCircle : status === "warning" ? AlertTriangle : CheckCircle2;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {title}
          </h3>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-normal">
          {subtitle}
        </p>
      </div>

      {/* Dynamic Status Badge */}
      <span
        className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs transition-all ${getBadgeStyle()}`}
      >
        <StatusIcon className="w-3.5 h-3.5" />
        {statusLabel}
      </span>
    </div>
  );
};
