import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, CheckCircle2 } from "lucide-react";
import { mockBudgetBurnChartData } from "./dashboardData";

export const BudgetBurnForecastChart: React.FC = () => {
  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200">
      {/* Header & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Budget Burn & Forecast Pace
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Cumulative organizational spend trajectory vs linear budget allocation
          </p>
        </div>

        <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:brightness-105 transition-all">
          <CheckCircle2 className="w-3.5 h-3.5" />
          On Track
        </span>
      </div>

      {/* Main Recharts Graphic */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockBudgetBurnChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualSpendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />

            <Tooltip
              wrapperStyle={{ zIndex: 9999 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const actual = payload.find((p) => p.dataKey === "actualSpend")?.value;
                  const budget = payload.find((p) => p.dataKey === "expectedBudgetPace")?.value;
                  return (
                    <div className="!bg-[#1C1F2E] text-white p-3.5 rounded-[12px] shadow-2xl border border-neutral-700/80 text-xs space-y-1.5 font-mono w-52 z-[9999] pointer-events-none">
                      <div className="font-bold border-b border-neutral-700 pb-1 text-primary-400">{label}</div>
                      <div className="flex items-center justify-between gap-4 font-mono">
                        <span className="text-neutral-400">Forecast Pace:</span>
                        <span className="font-bold text-white">${Number(actual).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 font-mono">
                        <span className="text-neutral-400">Budget Pace:</span>
                        <span className="text-neutral-300">${Number(budget).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Expected Trajectory Line (Dashed) */}
            <Area
              type="monotone"
              dataKey="expectedBudgetPace"
              stroke="#94a3b8"
              strokeDasharray="4 4"
              strokeWidth={2}
              fill="none"
            />

            {/* Actual Cumulative Spend Area */}
            <Area
              type="monotone"
              dataKey="actualSpend"
              stroke="#4f46e5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#actualSpendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-wider block">
            Current Period Spend
          </span>
          <span className="text-base font-extrabold text-neutral-900 dark:text-white font-mono">$8,050</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-wider block">
            Monthly Budget Cap
          </span>
          <span className="text-base font-extrabold text-neutral-900 dark:text-white font-mono">$10,321</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-wider block">
            Projected End-of-Month
          </span>
          <span className="text-base font-extrabold text-primary-600 dark:text-primary-400 font-mono">$8,694</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-wider block">
            Budget Variance
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Under Cap
          </span>
        </div>
      </div>
    </div>
  );
};
