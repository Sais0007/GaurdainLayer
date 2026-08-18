import React, { useState } from "react";
import { ChartHeader, BudgetHealthStatus } from "./ChartHeader";
import { SpendChart } from "./SpendChart";
import { InteractiveLegend, LegendVisibilityState } from "./InteractiveLegend";
import { SummaryMetrics } from "./SummaryMetrics";
import { Skeleton } from "../../ui/skeleton";
import { Button } from "../../ui/button";
import { AlertCircle, RotateCcw, Filter, Inbox } from "lucide-react";
import { DashboardState } from "../../Dashboard";

interface BudgetBurnTrajectoryProps {
  state?: DashboardState;
  onRetry?: () => void;
  onResetFilters?: () => void;
}

// Skeleton loading component
function BudgetBurnTrajectorySkeleton() {
  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-5">
      <div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <Skeleton className="h-80 w-full rounded-xl" />

      <div className="flex gap-4 pt-2">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-6 w-40 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-3.5 bg-neutral-50 dark:bg-neutral-950 rounded-xl space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Empty state component
function BudgetBurnTrajectoryEmpty({ onResetFilters }: { onResetFilters?: () => void }) {
  return (
    <div className="p-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center space-y-3.5 shadow-2xs">
      <Inbox className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto stroke-[1.5]" />
      <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
        No spend data available for the selected period.
      </h4>
      <p className="text-xs text-neutral-400 max-w-md mx-auto">
        There are no recorded organization spend events matching the current filter parameters.
      </p>
      {onResetFilters && (
        <Button
          size="sm"
          onClick={onResetFilters}
          className="h-8 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5 mr-1.5" />
          Change Filters
        </Button>
      )}
    </div>
  );
}

// Error state component
function BudgetBurnTrajectoryError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="p-10 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 rounded-xl text-center space-y-3.5">
      <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
      <h4 className="text-base font-bold text-rose-900 dark:text-rose-200">
        Unable to load budget analytics.
      </h4>
      <p className="text-xs text-rose-600 dark:text-rose-400 max-w-md mx-auto">
        A network or server error occurred while retrieving budget burn trajectory data.
      </p>
      {onRetry && (
        <Button
          size="sm"
          onClick={onRetry}
          className="h-8 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Retry
        </Button>
      )}
    </div>
  );
}

export const BudgetBurnTrajectory: React.FC<BudgetBurnTrajectoryProps> = ({
  state = "normal",
  onRetry,
  onResetFilters,
}) => {
  // Interactive Legend Visibility State
  const [legendVisibility, setLegendVisibility] = useState<LegendVisibilityState>({
    actualSpend: true,
    forecastPace: true,
    budgetCeiling: true,
  });

  const handleLegendToggle = (key: keyof LegendVisibilityState) => {
    setLegendVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (state === "loading") {
    return <BudgetBurnTrajectorySkeleton />;
  }

  if (state === "error") {
    return <BudgetBurnTrajectoryError onRetry={onRetry} />;
  }

  if (state === "empty") {
    return <BudgetBurnTrajectoryEmpty onResetFilters={onResetFilters} />;
  }

  // Dynamic Health Status calculation (Projected spend: $8,694 vs Cap: $10,000)
  const projectedSpend = 8694;
  const budgetCap = 10000;
  let healthStatus: BudgetHealthStatus = "healthy";
  let healthLabel = "On Track";

  if (projectedSpend > budgetCap) {
    healthStatus = "critical";
    healthLabel = "Over Budget";
  } else if (projectedSpend > budgetCap * 0.85) {
    healthStatus = "warning";
    healthLabel = "Near Limit";
  }

  return (
    <div className="p-5 sm:p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 relative overflow-hidden transition-all duration-250">
      {/* 1. Header (Title, Subtitle, Dynamic Status Badge) */}
      <ChartHeader
        title="Budget Burn Rate Trajectory"
        subtitle="Cumulative organization spend versus monthly budget trajectory."
        status={healthStatus}
        statusLabel={healthLabel}
      />

      {/* 2. Large Interactive Chart (~480px to ~520px container height) */}
      <SpendChart visibility={legendVisibility} />

      {/* 3. Interactive Legend (Toggle visibility for Actual Spend, Forecast Pace, Budget Ceiling) */}
      <InteractiveLegend
        visibility={legendVisibility}
        onToggle={handleLegendToggle}
      />

      {/* 4. Summary Metrics Row (4 Analytics Cards Below Chart) */}
      <SummaryMetrics
        currentSpend={8050}
        budgetCap={budgetCap}
        projectedSpend={projectedSpend}
      />
    </div>
  );
};
