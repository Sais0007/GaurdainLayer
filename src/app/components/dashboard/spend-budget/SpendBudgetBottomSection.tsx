import React from "react";
import { SpendDistributionCard } from "./SpendDistributionCard";
import { TopConsumersCard } from "./TopConsumersCard";
import { BudgetAlertsCard } from "./BudgetAlertsCard";
import { CostOptimizationCard } from "./CostOptimizationCard";
import { DashboardState } from "../../Dashboard";

interface SpendBudgetBottomSectionProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export const SpendBudgetBottomSection: React.FC<SpendBudgetBottomSectionProps> = ({
  state = "normal",
  onRetry,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card 1: Spend Distribution */}
      <SpendDistributionCard state={state} onRetry={onRetry} />

      {/* Card 2: Top Budget Consumers */}
      <TopConsumersCard state={state} onRetry={onRetry} />

      {/* Card 3: Budget Alerts */}
      <BudgetAlertsCard state={state} onRetry={onRetry} />

      {/* Card 4: Cost Optimization Insights */}
      <CostOptimizationCard state={state} onRetry={onRetry} />
    </div>
  );
};
