import React, { useState } from "react";
import { RequestsFilters, RequestsFilterState } from "./RequestsFilters";
import { RequestsKPICards } from "./RequestsKPICards";
import { RequestVolumeTrend } from "./RequestVolumeTrend";
import { RequestVolumeBreakdown } from "./RequestVolumeBreakdown";
import { LoadDistributionHeatmap } from "./LoadDistributionHeatmap";
import { DashboardSkeleton } from "../DashboardSkeleton";
import { DashboardEmptyState } from "../DashboardEmptyState";
import { DashboardErrorState } from "../DashboardErrorState";
import { DashboardState } from "../../Dashboard";

interface RequestsDashboardProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export const RequestsDashboard: React.FC<RequestsDashboardProps> = ({
  state = "normal",
  onRetry,
}) => {
  const [filterState, setFilterState] = useState<RequestsFilterState>({
    team: "All Teams",
    user: "All Users",
    virtualKey: "All Virtual Keys",
    provider: "All Providers",
    model: "All Models",
    outcome: "All Outcomes",
  });

  const handleFilterUpdate = (updates: Partial<RequestsFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilterState({
      team: "All Teams",
      user: "All Users",
      virtualKey: "All Virtual Keys",
      provider: "All Providers",
      model: "All Models",
      outcome: "All Outcomes",
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
      {/* SECTION 1: Requests Analytics Filters */}
      <RequestsFilters
        filterState={filterState}
        onFilterChange={handleFilterUpdate}
        onResetFilters={handleResetFilters}
      />

      {/* SECTION 2: KPI Cards (2 Rows of 5 Cards) */}
      <RequestsKPICards state={state} onRetry={onRetry} />

      {/* SECTION 3: Request Volume Trend (~380px Area Chart) */}
      <RequestVolumeTrend />

      {/* SECTION 4: Request Volume Breakdown (Horizontal Progress Bars) */}
      <RequestVolumeBreakdown />

      {/* SECTION 5: Load Distribution Heatmap (Day x Hour Matrix) */}
      <LoadDistributionHeatmap />
    </div>
  );
};
