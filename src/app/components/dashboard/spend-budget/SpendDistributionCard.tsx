import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as IconPieChart, RotateCcw, Inbox, AlertCircle } from "lucide-react";
import { ViewByOption, mockResourceAllocationData } from "../dashboardData";
import { Skeleton } from "../../ui/skeleton";
import { Button } from "../../ui/button";
import { DashboardState } from "../../Dashboard";

interface SpendDistributionCardProps {
  state?: DashboardState;
  onRetry?: () => void;
}

const COLOR_PALETTE = ["#4f46e5", "#8b5cf6", "#0284c7", "#f59e0b", "#10b981", "#ec4899"];

export const SpendDistributionCard: React.FC<SpendDistributionCardProps> = ({
  state = "normal",
  onRetry,
}) => {
  const [selectedEntity, setSelectedEntity] = useState<ViewByOption>("Teams");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const rawData = mockResourceAllocationData[selectedEntity] || [];
  
  const chartData = useMemo(() => {
    return rawData.map((item, idx) => ({
      name: item.name,
      value: item.spend,
      percent: item.totalSharePercent,
      contextOwner: item.contextOwner,
      requests: item.totalRequests,
      tokens: `${(item.spend * 12.4).toFixed(1)}k`,
      avgCost: (item.spend / (item.totalRequests || 1)).toFixed(3),
      color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
    }));
  }, [rawData]);

  const totalSpend = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  if (state === "loading") {
    return (
      <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <div className="space-y-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-7 w-36 rounded-lg" />
        </div>
        <div className="h-64 flex items-center justify-center">
          <Skeleton className="h-48 w-48 rounded-full" />
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="p-8 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 rounded-xl text-center space-y-3">
        <AlertCircle className="w-9 h-9 text-rose-500 mx-auto" />
        <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
          Unable to load spend distribution.
        </h4>
        {onRetry && (
          <Button size="sm" onClick={onRetry} className="h-8 px-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center space-y-3 shadow-2xs">
        <Inbox className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto stroke-[1.5]" />
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
          No spend distribution data available.
        </h4>
      </div>
    );
  }

  const options: ViewByOption[] = ["Teams", "Users", "Virtual Keys", "Models", "Providers"];

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 min-h-[440px]">
      <div>
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                <IconPieChart className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Spend Distribution
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              Breakdown of spend across organizational entities.
            </p>
          </div>

          {/* Segmented Entity Selector */}
          <div className="flex items-center gap-0.5 p-1 bg-neutral-100 dark:bg-neutral-950 rounded-lg border border-neutral-200/80 dark:border-neutral-800 self-start sm:self-auto overflow-x-auto custom-scrollbar">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setSelectedEntity(opt);
                  setActiveIndex(null);
                }}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedEntity === opt
                    ? "bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-2xs font-bold"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Donut Chart Container */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
          {/* Donut Chart with Center Metric */}
          <div className="sm:col-span-7 h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  wrapperStyle={{ zIndex: 9999 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="!bg-[#1C1F2E] text-white p-4 rounded-[14px] shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-neutral-700/80 text-xs space-y-2 font-mono w-60 z-[9999] pointer-events-none select-none">
                          <div className="font-bold text-emerald-400 border-b border-neutral-700/80 pb-1.5 flex justify-between items-center text-sm font-sans">
                            <span className="truncate">{data.name}</span>
                            <span className="text-[10px] font-mono text-neutral-300 font-normal">
                              {selectedEntity.slice(0, -1)}
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-0.5 text-[11px]">
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-400">Spend:</span>
                              <span className="font-bold text-white">${data.value.toLocaleString()} USD</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-400">Share:</span>
                              <span className="text-emerald-400 font-bold">{data.percent}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-400">Requests:</span>
                              <span className="text-neutral-200 font-bold">{data.requests.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-400">Average Cost:</span>
                              <span className="text-neutral-200">${data.avgCost}/req</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-400">Total Tokens:</span>
                              <span className="text-violet-400 font-bold">{data.tokens}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={92}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, idx) => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.color}
                      stroke="none"
                      className="transition-all duration-300 cursor-pointer hover:opacity-90"
                      opacity={activeIndex === null || activeIndex === idx ? 1 : 0.4}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Metric Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Total Spend
              </span>
              <span className="text-lg font-extrabold text-neutral-900 dark:text-white font-mono leading-none mt-0.5">
                ${totalSpend.toLocaleString("en-US", { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="sm:col-span-5 space-y-2 text-xs">
            {chartData.map((item, idx) => (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer ${
                  activeIndex === idx
                    ? "bg-neutral-100 dark:bg-neutral-800/80 border-primary-300 dark:border-primary-700 shadow-2xs font-bold"
                    : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-950/60"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate text-[11px]">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                  <span className="text-neutral-900 dark:text-white font-bold">${item.value.toLocaleString()}</span>
                  <span className="text-neutral-400 text-[10px]">({item.percent}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
        <span>Showing spend distribution by {selectedEntity}</span>
        <span>Updated continuously from gateway logs</span>
      </div>
    </div>
  );
};
