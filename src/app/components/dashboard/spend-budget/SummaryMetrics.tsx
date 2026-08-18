import React from "react";
import { DollarSign, Wallet, TrendingUp, Activity, CheckCircle2, AlertTriangle } from "lucide-react";

interface SummaryMetricsProps {
  currentSpend?: number;
  budgetCap?: number;
  projectedSpend?: number;
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({
  currentSpend = 8050,
  budgetCap = 10000,
  projectedSpend = 8694,
}) => {
  const variance = budgetCap - projectedSpend;
  const isUnderBudget = variance >= 0;
  const variancePercent = Math.abs((variance / budgetCap) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
      {/* 1. Current Period Spend */}
      <div className="p-3.5 bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200/80 dark:border-neutral-800 rounded-xl space-y-1 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
          <span>Current Period Spend</span>
          <DollarSign className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="text-xl font-extrabold text-neutral-900 dark:text-white font-mono">
          ${currentSpend.toLocaleString("en-US", { minimumFractionDigits: 0 })}
        </div>
        <div className="text-[10px] text-neutral-400 font-medium">
          Accrued spend for active billing cycle
        </div>
      </div>

      {/* 2. Monthly Budget Cap */}
      <div className="p-3.5 bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200/80 dark:border-neutral-800 rounded-xl space-y-1 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
          <span>Monthly Budget Cap</span>
          <Wallet className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="text-xl font-extrabold text-neutral-900 dark:text-white font-mono">
          ${budgetCap.toLocaleString("en-US", { minimumFractionDigits: 0 })}
        </div>
        <div className="text-[10px] text-neutral-400 font-medium">
          Configured organization ceiling cap
        </div>
      </div>

      {/* 3. Projected End of Month */}
      <div className="p-3.5 bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200/80 dark:border-neutral-800 rounded-xl space-y-1 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
          <span>Projected End of Month</span>
          <TrendingUp className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
        </div>
        <div className="text-xl font-extrabold text-sky-600 dark:text-sky-400 font-mono">
          ${projectedSpend.toLocaleString("en-US", { minimumFractionDigits: 0 })}
        </div>
        <div className="text-[10px] text-neutral-400 font-medium">
          Run-rate trajectory forecast
        </div>
      </div>

      {/* 4. Budget Variance */}
      <div className="p-3.5 bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200/80 dark:border-neutral-800 rounded-xl space-y-1 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
          <span>Budget Variance</span>
          <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
            {isUnderBudget ? `-$${variance.toLocaleString()} below cap` : `+$${Math.abs(variance).toLocaleString()} over cap`}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
              isUnderBudget
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
            }`}
          >
            {isUnderBudget ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {isUnderBudget ? "Under Cap" : "Over Budget"}
          </span>
        </div>
        <div className="text-[10px] text-neutral-400 font-medium">
          {isUnderBudget ? `${variancePercent}% available safety buffer` : `${variancePercent}% budget ceiling exceedance`}
        </div>
      </div>
    </div>
  );
};
