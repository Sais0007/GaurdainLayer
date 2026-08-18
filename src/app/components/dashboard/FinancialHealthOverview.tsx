import React from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { FinancialKpis } from "./dashboardData";

interface FinancialHealthOverviewProps {
  data: FinancialKpis;
}

export const FinancialHealthOverview: React.FC<FinancialHealthOverviewProps> = ({ data }) => {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <Wallet className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Financial Health & Budget Overview
          </h2>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
          Primary financial impact metrics, budget burn pace, and projected end-of-cycle spend
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Period Spend */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-neutral-500 dark:text-neutral-400 tracking-wider">
              Period Spend
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:brightness-105 transition-all">
              <TrendingUp className="w-3 h-3" />
              ↑ {data.periodSpend.trend}%
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-mono group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              ${data.periodSpend.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            {/* Mini Trend Bar */}
            <div className="flex items-center gap-1 mt-2.5">
              {[40, 55, 60, 48, 75, 82, 90, 85, 95, 100].map((h, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-primary-100 dark:bg-primary-950/60 rounded-xs h-3 overflow-hidden"
                >
                  <div
                    className="bg-primary-600 dark:bg-primary-500 h-full rounded-xs transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between font-medium">
            <span>Spend for selected period</span>
            <span className="font-mono text-neutral-700 dark:text-neutral-300">Avg/Req: ${data.periodSpend.avgCostPerReq}</span>
          </div>
        </div>

        {/* Card 2: Budget Utilization */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-neutral-500 dark:text-neutral-400 tracking-wider">
              Budget Utilization
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:brightness-105 transition-all">
              <TrendingUp className="w-3 h-3" />
              ↑ 11.4%
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-mono group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {data.budgetUtilization.percent}%
            </div>
            {/* Segmented Horizontal Progress Bar */}
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-3 rounded-full overflow-hidden flex gap-0.5 mt-2.5 p-0.5">
              <div
                className="bg-gradient-to-r from-primary-500 to-indigo-600 h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                style={{ width: `${data.budgetUtilization.percent}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between font-medium">
            <span>${data.budgetUtilization.spend.toLocaleString()} of ${data.budgetUtilization.totalBudget.toLocaleString()}</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.budgetUtilization.trajectory}</span>
          </div>
        </div>

        {/* Card 3: Remaining Budget */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-neutral-500 dark:text-neutral-400 tracking-wider">
              Remaining Budget
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:brightness-105 transition-all">
              <TrendingDown className="w-3 h-3" />
              ↓ 8.4%
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-mono group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              ${data.remainingBudget.remainingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            {/* Decreasing Block Visualization */}
            <div className="flex items-center gap-1 mt-2.5">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-3 rounded-xs transition-colors ${
                    idx < 3
                      ? "bg-emerald-500 dark:bg-emerald-400 group-hover:brightness-110"
                      : "bg-neutral-100 dark:bg-neutral-800"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between font-medium">
            <span>{data.remainingBudget.remainingPercent}% remaining · {data.remainingBudget.daysLeft} days left</span>
            <span className="font-mono">Cap: ${data.remainingBudget.budgetCeiling.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 4: Forecasted Cycle-End Spend */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-neutral-500 dark:text-neutral-400 tracking-wider">
              Forecasted Cycle-End Spend
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:brightness-105 transition-all">
              <TrendingUp className="w-3 h-3" />
              ↑ 2.2%
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-mono group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              ${data.forecastedSpend.forecastedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            {/* Forecast Trend Bar */}
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-3 rounded-full overflow-hidden flex mt-2.5 p-0.5">
              <div className="bg-primary-500 h-full rounded-l-full w-[78%] group-hover:brightness-110 transition-all" />
              <div className="bg-rose-500 h-full rounded-r-full flex-1 group-hover:brightness-110 transition-all" />
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between font-medium">
            <span className="text-rose-600 dark:text-rose-400 font-semibold">Forecast: ${data.forecastedSpend.overBudgetAmount} over cap</span>
            <span>Projected Total</span>
          </div>
        </div>
      </div>
    </div>
  );
};
