import React, { useState } from "react";
import { TokensFilters, TokensFilterState } from "./TokensFilters";
import { TokensKPICards } from "./TokensKPICards";
import { TokensTrendChart } from "./TokensTrendChart";
import { TokensBreakdownTable } from "./TokensBreakdownTable";
import { DashboardSkeleton } from "../DashboardSkeleton";
import { DashboardEmptyState } from "../DashboardEmptyState";
import { DashboardErrorState } from "../DashboardErrorState";
import { DashboardState } from "../../Dashboard";

interface TokensDashboardProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export const TokensDashboard: React.FC<TokensDashboardProps> = ({
  state = "normal",
  onRetry,
}) => {
  const [filterState, setFilterState] = useState<TokensFilterState>({
    tokenType: "All Tokens",
    team: "All Teams",
    user: "All Users",
    virtualKey: "All Virtual Keys",
    provider: "All Providers",
    model: "All Models",
  });

  const handleFilterUpdate = (updates: Partial<TokensFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilterState({
      tokenType: "All Tokens",
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
      {/* 1. Tokens Analytics Filters */}
      <TokensFilters
        filterState={filterState}
        onFilterChange={handleFilterUpdate}
        onResetFilters={handleResetFilters}
      />

      {/* 2. KPI Cards (10 Cards in 5x2 Grid) */}
      <TokensKPICards state={state} onRetry={onRetry} />

      {/* 3. Input vs Output Token Trend (Stacked Vertical Bar Chart) */}
      <TokensTrendChart />

      {/* 4. Token Consumption Breakdown (Last Section) */}
      <TokensBreakdownTable />
    </div>
  );
};
