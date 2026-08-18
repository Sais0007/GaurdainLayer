import React, { useState, useMemo } from "react";
import { Key, RotateCcw, ArrowRight, Inbox, AlertCircle } from "lucide-react";
import { VirtualKeyBudgetRow } from "./VirtualKeyBudgetRow";
import { VirtualKeyDetailData } from "./VirtualKeyAnalyticsTooltip";
import { Skeleton } from "../../ui/skeleton";
import { Button } from "../../ui/button";
import { DashboardState } from "../../Dashboard";

interface VirtualKeyBudgetUtilizationProps {
  state?: DashboardState;
  onRetry?: () => void;
  onSelectKey?: (alias: string) => void;
}

export const RANKED_VIRTUAL_KEYS_DATA: VirtualKeyDetailData[] = [
  {
    keyAlias: "support-prod-key",
    assignedTeam: "Support Team",
    assignedUser: "Sarah Connor",
    spend: 1850,
    cap: 2000,
    percent: 92.5,
    status: "near_limit",
    requests: 48900,
    tokens: "28.4M",
    avgCost: 0.038,
    topModel: "Claude 3.5 Sonnet",
    lastActivity: "2 mins ago",
  },
  {
    keyAlias: "marketing-prod-key",
    assignedTeam: "Marketing Team",
    assignedUser: "Michael Scott",
    spend: 1120,
    cap: 1250,
    percent: 89.6,
    status: "near_limit",
    requests: 26800,
    tokens: "12.2M",
    avgCost: 0.041,
    topModel: "GPT-4o",
    lastActivity: "5 mins ago",
  },
  {
    keyAlias: "research-analysis-key",
    assignedTeam: "Research Team",
    assignedUser: "Alex Dev",
    spend: 1420,
    cap: 1700,
    percent: 83.5,
    status: "healthy",
    requests: 34100,
    tokens: "16.5M",
    avgCost: 0.042,
    topModel: "GPT-4o",
    lastActivity: "12 mins ago",
  },
  {
    keyAlias: "clinical-ops-key",
    assignedTeam: "Clinical Operations",
    assignedUser: "John Doe",
    spend: 1050,
    cap: 1400,
    percent: 75.0,
    status: "healthy",
    requests: 39500,
    tokens: "18.2M",
    avgCost: 0.026,
    topModel: "GPT-4o Mini",
    lastActivity: "1 min ago",
  },
  {
    keyAlias: "product-assistant-key",
    assignedTeam: "Product Team",
    assignedUser: "Emily Watson",
    spend: 290,
    cap: 800,
    percent: 36.3,
    status: "healthy",
    requests: 21240,
    tokens: "6.1M",
    avgCost: 0.013,
    topModel: "GPT-4o Mini",
    lastActivity: "18 mins ago",
  },
];

// Skeleton loading component
function VirtualKeyBudgetUtilizationSkeleton() {
  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-64" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </div>
      <div className="space-y-3 pt-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Empty state component
function VirtualKeyBudgetUtilizationEmpty({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center space-y-3 shadow-2xs">
      <Inbox className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto stroke-[1.5]" />
      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
        No Virtual Key budget data available.
      </h4>
      <p className="text-xs text-neutral-400 max-w-xs mx-auto">
        No active Virtual Key budget consumption records found for the current workspace context.
      </p>
      {onRefresh && (
        <Button
          size="sm"
          onClick={onRefresh}
          className="h-8 px-3.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Refresh
        </Button>
      )}
    </div>
  );
}

// Error state component
function VirtualKeyBudgetUtilizationError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="p-8 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 rounded-xl text-center space-y-3">
      <AlertCircle className="w-9 h-9 text-rose-500 mx-auto" />
      <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
        Unable to load Virtual Key budget analytics.
      </h4>
      <p className="text-xs text-rose-600 dark:text-rose-400 max-w-xs mx-auto">
        Failed to communicate with gateway Virtual Key API.
      </p>
      {onRetry && (
        <Button
          size="sm"
          onClick={onRetry}
          className="h-8 px-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Retry
        </Button>
      )}
    </div>
  );
}

export const VirtualKeyBudgetUtilization: React.FC<VirtualKeyBudgetUtilizationProps> = ({
  state = "normal",
  onRetry,
  onSelectKey,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Descending sort by budget utilization percentage
  const sortedKeys = useMemo(() => {
    return [...RANKED_VIRTUAL_KEYS_DATA].sort((a, b) => b.percent - a.percent);
  }, []);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRetry) onRetry();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (state === "loading") {
    return <VirtualKeyBudgetUtilizationSkeleton />;
  }

  if (state === "error") {
    return <VirtualKeyBudgetUtilizationError onRetry={onRetry} />;
  }

  if (state === "empty") {
    return <VirtualKeyBudgetUtilizationEmpty onRefresh={handleRefreshClick} />;
  }

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 min-h-[420px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Key className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Virtual Key Budget Utilization
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              Monitor spending and utilization across active Virtual Keys.
            </p>
          </div>

          {/* Top-Right Compact Icon Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleRefreshClick}
              title="Refresh Key Analytics"
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary-600" : ""}`} />
            </button>
            <button
              onClick={() => alert("Navigating to detailed Virtual Keys Management...")}
              title="View All Virtual Keys"
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold px-2"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 text-primary-600 dark:text-primary-400" />
            </button>
          </div>
        </div>

        {/* Virtual Key List (Descending order of utilization) */}
        <div className="space-y-3 pt-3">
          {sortedKeys.map((keyData) => (
            <VirtualKeyBudgetRow key={keyData.keyAlias} data={keyData} onClickKey={onSelectKey} />
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
        <span>Showing Top 5 active Virtual Keys</span>
        <span>Updated continuously from gateway logs</span>
      </div>
    </div>
  );
};
