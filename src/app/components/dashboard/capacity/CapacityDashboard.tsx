import React, { useState } from "react";
import { CapacityFilters, CapacityFilterState } from "./CapacityFilters";
import { CapacityKPICards } from "./CapacityKPICards";
import { RpmThroughputChart } from "./RpmThroughputChart";
import { TpmThroughputChart } from "./TpmThroughputChart";
import { VirtualKeysCapacityList } from "./VirtualKeysCapacityList";
import { DashboardSkeleton } from "../DashboardSkeleton";
import { DashboardEmptyState } from "../DashboardEmptyState";
import { DashboardErrorState } from "../DashboardErrorState";
import { DashboardState } from "../../Dashboard";

interface CapacityDashboardProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export const CapacityDashboard: React.FC<CapacityDashboardProps> = ({
  state = "normal",
  onRetry,
}) => {
  const [filterState, setFilterState] = useState<CapacityFilterState>({
    limitType: "All Limits (RPM & TPM)",
    team: "All Teams",
    user: "All Users",
    virtualKey: "All Virtual Keys",
    provider: "All Providers",
    model: "All Models",
  });

  const handleFilterUpdate = (updates: Partial<CapacityFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilterState({
      limitType: "All Limits (RPM & TPM)",
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
      {/* 1. Capacity & Throughput Filters */}
      <CapacityFilters
        filterState={filterState}
        onFilterChange={handleFilterUpdate}
      />

      {/* 2. KPI Cards (10 Cards in 2 Rows) */}
      <CapacityKPICards state={state} onRetry={onRetry} />

      {/* 3 & 4. Side-by-Side RPM and TPM Throughput Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <RpmThroughputChart />
        <TpmThroughputChart />
      </div>

      {/* 5. Virtual Keys Capacity & Throttle Risk */}
      <VirtualKeysCapacityList />
    </div>
  );
};
