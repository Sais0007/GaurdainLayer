import React, { useState } from "react";
import { SpendBudgetFilters, SpendBudgetFilterState } from "./SpendBudgetFilters";
import { SpendKPICards } from "./SpendKPICards";
import { BudgetBurnTrajectory } from "./BudgetBurnTrajectory";
import { TeamBudgetUtilization } from "./TeamBudgetUtilization";
import { VirtualKeyBudgetUtilization } from "./VirtualKeyBudgetUtilization";
import { DashboardSkeleton } from "../DashboardSkeleton";
import { DashboardEmptyState } from "../DashboardEmptyState";
import { DashboardErrorState } from "../DashboardErrorState";
import { DashboardState } from "../../Dashboard";

import { SpendBudgetBottomSection } from "./SpendBudgetBottomSection";

interface SpendBudgetDashboardProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export const SpendBudgetDashboard: React.FC<SpendBudgetDashboardProps> = ({
  state = "normal",
  onRetry,
}) => {
  const [filterState, setFilterState] = useState<SpendBudgetFilterState>({
    budgetStatus: "All Statuses",
    team: "All Teams",
    user: "All Users",
    virtualKey: "All Virtual Keys",
    provider: "All Providers",
    model: "All Models",
  });

  const handleFilterUpdate = (updates: Partial<SpendBudgetFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilterState({
      budgetStatus: "All Statuses",
      team: "All Teams",
      user: "All Users",
      virtualKey: "All Virtual Keys",
      provider: "All Providers",
      model: "All Models",
    });
  };

  if (state === "loading") {
    return <DashboardSkeleton />;
  }

  if (state === "error") {
    return <DashboardErrorState onRetry={onRetry || (() => {})} />;
  }

  if (state === "empty") {
    return <DashboardEmptyState onResetFilters={handleResetFilters} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* SECTION 1: Spend & Budget Analytics Filters */}
      <SpendBudgetFilters
        filterState={filterState}
        onFilterChange={handleFilterUpdate}
        onResetFilters={handleResetFilters}
      />

      {/* SECTION 2: Top 10 KPI Cards (5x2 grid desktop, 2-col tablet, 1-col mobile) */}
      <SpendKPICards state={state} onRetry={onRetry} />

      {/* SECTION 3: Budget Burn Rate Trajectory Chart (Hero Analytics Chart) */}
      <BudgetBurnTrajectory state={state} onRetry={onRetry} onResetFilters={handleResetFilters} />

      {/* SECTION 4: Team & Virtual Key Utilization (2 equal-width cards side-by-side on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamBudgetUtilization state={state} onRetry={onRetry} />
        <VirtualKeyBudgetUtilization state={state} onRetry={onRetry} />
      </div>

      {/* SECTION 5: Spend Distribution, Top Consumers, Budget Alerts & Cost Optimization (2x2 Grid) */}
      <SpendBudgetBottomSection state={state} onRetry={onRetry} />
    </div>
  );
};
