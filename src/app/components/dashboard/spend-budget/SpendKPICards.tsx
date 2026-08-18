import React from "react";
import { 
  DollarSign, 
  Wallet, 
  Coins, 
  Gauge, 
  TrendingUp, 
  Receipt, 
  Cpu, 
  Users, 
  Key, 
  Box,
  AlertCircle,
  RotateCcw,
  Inbox
} from "lucide-react";
import { SpendBudgetKPICard, SpendBudgetKPICardProps } from "./SpendBudgetKPICard";
import { Skeleton } from "../../ui/skeleton";
import { Button } from "../../ui/button";
import { DashboardState } from "../../Dashboard";

interface SpendKPICardsProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export const ALL_10_KPI_CARDS_CONFIG: SpendBudgetKPICardProps[] = [
  {
    id: "card_1_current_spend",
    title: "Current Spend",
    subtitle: "Current billing cycle",
    value: "$7,800.00",
    trend: { text: "↑ 12.5%", type: "negative", icon: "up" },
    supportingText: "Compared with previous period",
    icon: DollarSign,
    visualizationType: "sparkline",
  },
  {
    id: "card_2_monthly_budget",
    title: "Monthly Budget",
    subtitle: "Configured Budget",
    value: "$10,000",
    trend: { text: "Cap", type: "blue", icon: "flat" },
    supportingText: "Configured ceiling cap",
    icon: Wallet,
    visualizationType: "budget_ceiling",
  },
  {
    id: "card_3_remaining_budget",
    title: "Remaining Budget",
    subtitle: "Available Buffer",
    value: "$2,200",
    trend: { text: "22% Buffer", type: "positive", icon: "down" },
    supportingText: "22% Available Buffer",
    icon: Coins,
    visualizationType: "reverse_blocks",
  },
  {
    id: "card_4_budget_utilization",
    title: "Budget Utilization",
    subtitle: "Run Rate",
    value: "78%",
    trend: { text: "On Track", type: "warning", icon: "flat" },
    supportingText: "Expected Run Rate: 70%",
    icon: Gauge,
    visualizationType: "segmented_bar",
  },
  {
    id: "card_5_pace_forecast",
    title: "Pace Forecast",
    subtitle: "End of Month",
    value: "$10,240",
    trend: { text: "+2.4%", type: "warning", icon: "up" },
    supportingText: "Projected month end spend",
    icon: TrendingUp,
    visualizationType: "forecast_line",
  },
  {
    id: "card_6_cost_per_request",
    title: "Cost Per Request",
    subtitle: "Unit Economic",
    value: "$0.042",
    trend: { text: "Avg Unit", type: "blue", icon: "flat" },
    supportingText: "Average gateway unit cost",
    icon: Receipt,
    visualizationType: "histogram",
  },
  {
    id: "card_7_cost_per_1k_tokens",
    title: "Cost Per 1K Tokens",
    subtitle: "Token Rate",
    value: "$0.000475",
    trend: { text: "Weighted", type: "purple", icon: "flat" },
    supportingText: "Weighted model token rate",
    icon: Cpu,
    visualizationType: "token_split",
  },
  {
    id: "card_8_top_spend_team",
    title: "Top Spend Team",
    subtitle: "Org Driver",
    value: "Support",
    trend: { text: "31.4% Share", type: "blue", icon: "up" },
    supportingText: "$2,450.00 accrued this cycle",
    icon: Users,
    visualizationType: "horizontal_bar",
  },
  {
    id: "card_9_top_spend_key",
    title: "Top Spend Key",
    subtitle: "API Key",
    value: "support-prod-key",
    trend: { text: "#1 Rank", type: "neutral", icon: "flat" },
    supportingText: "$1,850.00 accrued this cycle",
    icon: Key,
    visualizationType: "key_progress",
  },
  {
    id: "card_10_top_spend_model",
    title: "Top Spend Model",
    subtitle: "Anthropic",
    value: "Claude Sonnet",
    trend: { text: "40.7% Share", type: "purple", icon: "up" },
    supportingText: "$3,180.00 accrued this cycle",
    icon: Box,
    visualizationType: "model_sparkline",
  },
];

// Skeleton loading cards component
function SpendKPICardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {Array.from({ length: 10 }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[14px] shadow-2xs space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="w-7 h-7 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="h-8 w-28 mt-2" />
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state component
function SpendKPICardsEmpty() {
  return (
    <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[14px] text-center space-y-3 shadow-2xs">
      <Inbox className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto stroke-[1.5]" />
      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">No Analytics Available</h4>
      <p className="text-xs text-neutral-400 max-w-sm mx-auto">
        No spending or budget metrics available for the selected filter parameters.
      </p>
    </div>
  );
}

// Error state component
function SpendKPICardsError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="p-8 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 rounded-[14px] text-center space-y-3">
      <AlertCircle className="w-9 h-9 text-rose-500 mx-auto" />
      <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">Unable to load analytics</h4>
      <p className="text-xs text-rose-600 dark:text-rose-400">
        An error occurred while fetching KPI metrics. Please try again.
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

export const SpendKPICards: React.FC<SpendKPICardsProps> = ({
  state = "normal",
  onRetry,
}) => {
  if (state === "loading") {
    return <SpendKPICardsSkeleton />;
  }

  if (state === "error") {
    return <SpendKPICardsError onRetry={onRetry} />;
  }

  if (state === "empty") {
    return <SpendKPICardsEmpty />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {ALL_10_KPI_CARDS_CONFIG.map((cardConfig) => (
        <SpendBudgetKPICard key={cardConfig.id} {...cardConfig} />
      ))}
    </div>
  );
};
