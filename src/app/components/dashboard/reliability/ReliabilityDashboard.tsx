import React, { useState } from "react";
import { ReliabilityFilters, ReliabilityFilterState } from "./ReliabilityFilters";
import { ReliabilityKPICards } from "./ReliabilityKPICards";
import { SuccessFailureTimeline } from "./SuccessFailureTimeline";
import { OperationalMatrixTable } from "./OperationalMatrixTable";
import { FailureCauseDistribution } from "./FailureCauseDistribution";
import { AuditTraceInspectorModal } from "../AuditTraceInspectorModal";
import { DashboardSkeleton } from "../DashboardSkeleton";
import { DashboardEmptyState } from "../DashboardEmptyState";
import { DashboardErrorState } from "../DashboardErrorState";
import { DashboardState } from "../../Dashboard";

interface ReliabilityDashboardProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export const ReliabilityDashboard: React.FC<ReliabilityDashboardProps> = ({
  state = "normal",
  onRetry,
}) => {
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);
  const [filterState, setFilterState] = useState<ReliabilityFilterState>({
    errorCategory: "All Error Categories",
    team: "All Teams",
    user: "All Users",
    virtualKey: "All Virtual Keys",
    provider: "All Providers",
    model: "All Models",
  });

  const handleFilterUpdate = (updates: Partial<ReliabilityFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilterState({
      errorCategory: "All Error Categories",
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
      {/* 1. Reliability & SLA Diagnostics Filters */}
      <ReliabilityFilters
        filterState={filterState}
        onFilterChange={handleFilterUpdate}
        onInspectTraces={() => setIsTraceModalOpen(true)}
      />

      {/* 2. KPI Cards (10 Cards in 2 Rows) */}
      <ReliabilityKPICards state={state} onRetry={onRetry} />

      {/* 3. Section 1: Success and Failure Timeline (Stacked Vertical Bar Chart) */}
      <SuccessFailureTimeline />

      {/* 4. Section 2: Model and Provider Operational Matrix (Table) */}
      <OperationalMatrixTable />

      {/* 5. Section 3: Normalized Failure Cause Distribution (2-Column Grid) */}
      <FailureCauseDistribution />

      {/* Incident Trace Logs Modal */}
      {isTraceModalOpen && (
        <AuditTraceInspectorModal
          isOpen={isTraceModalOpen}
          onClose={() => setIsTraceModalOpen(false)}
        />
      )}
    </div>
  );
};
