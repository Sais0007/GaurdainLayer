import React, { useState, useMemo } from "react";
import { Users, RotateCcw, ArrowRight, Inbox, AlertCircle } from "lucide-react";
import { TeamBudgetRow } from "./TeamBudgetRow";
import { TeamDetailData } from "./TeamBudgetTooltip";
import { Skeleton } from "../../ui/skeleton";
import { Button } from "../../ui/button";
import { DashboardState } from "../../Dashboard";

interface TeamBudgetUtilizationProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export const RANKED_TEAMS_DATA: TeamDetailData[] = [
  {
    team: "Research",
    spend: 1880,
    cap: 2200,
    percent: 85.5,
    requests: 38640,
    tokens: "15.4M",
    avgCost: 0.048,
    topModel: "GPT-4o",
  },
  {
    team: "Marketing",
    spend: 1260,
    cap: 1500,
    percent: 84.0,
    requests: 29409,
    tokens: "8.5M",
    avgCost: 0.043,
    topModel: "Claude 3.5 Sonnet",
  },
  {
    team: "Support",
    spend: 2450,
    cap: 3000,
    percent: 81.7,
    requests: 54200,
    tokens: "22.8M",
    avgCost: 0.045,
    topModel: "Claude 3.5 Sonnet",
  },
  {
    team: "Clinical Operations",
    spend: 1920,
    cap: 2500,
    percent: 76.8,
    requests: 42309,
    tokens: "18.2M",
    avgCost: 0.045,
    topModel: "GPT-4o",
  },
  {
    team: "Product",
    spend: 290,
    cap: 800,
    percent: 36.3,
    requests: 18082,
    tokens: "6.1M",
    avgCost: 0.016,
    topModel: "GPT-4o Mini",
  },
];

// Skeleton loading component
function TeamBudgetUtilizationSkeleton() {
  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-40" />
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
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-32" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Empty state component
function TeamBudgetUtilizationEmpty({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center space-y-3 shadow-2xs">
      <Inbox className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto stroke-[1.5]" />
      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
        No team budget data available.
      </h4>
      <p className="text-xs text-neutral-400 max-w-xs mx-auto">
        No team budget allocation records found for the current workspace context.
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
function TeamBudgetUtilizationError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="p-8 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 rounded-xl text-center space-y-3">
      <AlertCircle className="w-9 h-9 text-rose-500 mx-auto" />
      <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
        Unable to load team budget analytics.
      </h4>
      <p className="text-xs text-rose-600 dark:text-rose-400 max-w-xs mx-auto">
        Failed to communicate with gateway metrics API.
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

export const TeamBudgetUtilization: React.FC<TeamBudgetUtilizationProps> = ({
  state = "normal",
  onRetry,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Descending sort by budget utilization percentage
  const sortedTeams = useMemo(() => {
    return [...RANKED_TEAMS_DATA].sort((a, b) => b.percent - a.percent);
  }, []);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRetry) onRetry();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (state === "loading") {
    return <TeamBudgetUtilizationSkeleton />;
  }

  if (state === "error") {
    return <TeamBudgetUtilizationError onRetry={onRetry} />;
  }

  if (state === "empty") {
    return <TeamBudgetUtilizationEmpty onRefresh={handleRefreshClick} />;
  }

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 min-h-[420px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                <Users className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Team Budget Utilization
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              Ranked team budget consumption against allocated monthly budgets.
            </p>
          </div>

          {/* Top-Right Compact Icon Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleRefreshClick}
              title="Refresh Team Analytics"
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary-600" : ""}`} />
            </button>
            <button
              onClick={() => alert("Navigating to detailed Team Budget Management...")}
              title="View All Teams"
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold px-2"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 text-primary-600 dark:text-primary-400" />
            </button>
          </div>
        </div>

        {/* Team List (Descending order of utilization) */}
        <div className="space-y-3 pt-3">
          {sortedTeams.map((teamData) => (
            <TeamBudgetRow key={teamData.team} data={teamData} />
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
        <span>Showing Top 5 organization drivers</span>
        <span>Updated continuously from gateway logs</span>
      </div>
    </div>
  );
};
