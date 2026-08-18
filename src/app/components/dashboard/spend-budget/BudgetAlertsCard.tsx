import React from "react";
import { AlertTriangle, AlertCircle, Info, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";
import { Button } from "../../ui/button";
import { DashboardState } from "../../Dashboard";

interface BudgetAlertsCardProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export interface BudgetAlertItem {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  entity: string;
  description: string;
  timestamp: string;
  suggestedAction: string;
  ctaText: string;
}

export const MOCK_BUDGET_ALERTS: BudgetAlertItem[] = [
  {
    id: "alert-1",
    severity: "critical",
    entity: "Support Team",
    description: "Budget utilization reached 92% ($2,450 / $3,000 Cap).",
    timestamp: "10 mins ago",
    suggestedAction: "Review team allocation cap.",
    ctaText: "View Team",
  },
  {
    id: "alert-2",
    severity: "high",
    entity: "marketing-prod-key",
    description: "Abnormal spend spike (+42% vs yesterday average).",
    timestamp: "25 mins ago",
    suggestedAction: "Inspect virtual key rate limits.",
    ctaText: "Inspect Key",
  },
  {
    id: "alert-3",
    severity: "medium",
    entity: "Claude 3.5 Sonnet",
    description: "Projected model spend exceeds monthly target by $218.",
    timestamp: "1 hour ago",
    suggestedAction: "Shift non-critical prompts to Haiku/Mini.",
    ctaText: "Optimize Model",
  },
  {
    id: "alert-4",
    severity: "low",
    entity: "Product Team",
    description: "Unused allocation ($510 buffer remaining with 3 days left).",
    timestamp: "3 hours ago",
    suggestedAction: "Reallocate unspent budget to Support.",
    ctaText: "Reallocate",
  },
];

export const BudgetAlertsCard: React.FC<BudgetAlertsCardProps> = ({
  state = "normal",
  onRetry,
}) => {
  const getSeverityBadge = (severity: BudgetAlertItem["severity"]) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />,
        };
      case "high":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />,
        };
      case "medium":
        return {
          bg: "bg-amber-50/70 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
        };
      case "low":
      default:
        return {
          bg: "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
          icon: <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />,
        };
    }
  };

  if (state === "loading") {
    return (
      <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="space-y-2 pt-1">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="p-8 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 rounded-xl text-center space-y-3">
        <AlertCircle className="w-9 h-9 text-rose-500 mx-auto" />
        <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
          Unable to load budget alerts.
        </h4>
        {onRetry && (
          <Button size="sm" onClick={onRetry} className="h-8 px-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (state === "empty" || MOCK_BUDGET_ALERTS.length === 0) {
    return (
      <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center space-y-3 shadow-2xs">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto stroke-[1.5]" />
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
          No active budget alerts.
        </h4>
        <p className="text-xs text-neutral-400 max-w-xs mx-auto">
          All team and key budget allocations are operating within healthy parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 min-h-[440px]">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Budget Alerts
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              Real-time financial risk and anomaly notifications.
            </p>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-2xs">
            {MOCK_BUDGET_ALERTS.length} Active Alerts
          </span>
        </div>

        {/* Alert Cards List */}
        <div className="space-y-2.5 pt-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
          {MOCK_BUDGET_ALERTS.map((alert) => {
            const severityStyle = getSeverityBadge(alert.severity);
            return (
              <div
                key={alert.id}
                className="p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850 space-y-1.5 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all text-xs group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white">
                    {severityStyle.icon}
                    <span>{alert.entity}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">{alert.timestamp}</span>
                </div>

                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
                  {alert.description}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-neutral-400 italic">
                    Action: <strong className="text-neutral-700 dark:text-neutral-300 font-semibold">{alert.suggestedAction}</strong>
                  </span>

                  <button
                    onClick={() => alert(`Taking action on ${alert.entity}...`)}
                    className="inline-flex items-center gap-1 font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline cursor-pointer"
                  >
                    <span>{alert.ctaText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
        <span>Evaluated against active threshold policies</span>
        <button
          onClick={() => alert("Opening Alert Settings...")}
          className="text-primary-600 dark:text-primary-400 font-semibold hover:underline cursor-pointer"
        >
          Configure Rules →
        </button>
      </div>
    </div>
  );
};
