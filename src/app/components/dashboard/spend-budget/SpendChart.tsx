import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { LegendVisibilityState } from "./InteractiveLegend";
import { mockBudgetBurnChartData, BudgetBurnPoint } from "../dashboardData";

interface SpendChartProps {
  visibility: LegendVisibilityState;
  data?: BudgetBurnPoint[];
}

export const SpendChart: React.FC<SpendChartProps> = ({
  visibility,
  data = mockBudgetBurnChartData,
}) => {
  return (
    <div className="h-80 sm:h-96 w-full pt-3 relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="actualSpendHeroGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
          
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: "#64748b" }} 
            axisLine={false} 
            tickLine={false} 
          />
          
          <YAxis 
            tick={{ fontSize: 11, fill: "#64748b" }} 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(val) => `$${val.toLocaleString()}`} 
          />

          <Tooltip
            wrapperStyle={{ zIndex: 9999 }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const actual = payload.find((p) => p.dataKey === "actualSpend")?.value as number | undefined;
                const budget = payload.find((p) => p.dataKey === "expectedBudgetPace")?.value as number | undefined;
                const forecast = payload.find((p) => p.dataKey === "forecastPace")?.value as number | undefined;

                const cap = 10000;
                const currentVal = actual !== undefined ? actual : forecast !== undefined ? forecast : 0;
                const remaining = cap - currentVal;
                const variance = budget !== undefined ? currentVal - budget : 0;
                const isOver = currentVal > cap;

                return (
                  <div className="!bg-[#1C1F2E] text-white p-4 rounded-[14px] shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-neutral-700/80 text-xs space-y-2 min-w-[220px] font-mono z-[9999]">
                    <div className="font-bold border-b border-neutral-800 pb-1.5 flex justify-between items-center text-primary-300">
                      <span>{label}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${isOver ? "bg-rose-900/80 text-rose-300 border border-rose-700" : "bg-emerald-900/80 text-emerald-300 border border-emerald-700"}`}>
                        {isOver ? "OVER CAP" : "HEALTHY"}
                      </span>
                    </div>

                    <div className="space-y-1 font-mono">
                      {actual !== undefined && (
                        <div className="flex justify-between items-center text-indigo-300">
                          <span>Actual Spend:</span>
                          <span className="font-bold text-white">${actual.toLocaleString()}</span>
                        </div>
                      )}

                      {forecast !== undefined && (
                        <div className="flex justify-between items-center text-amber-300">
                          <span>Forecast Pace:</span>
                          <span>${forecast.toLocaleString()}</span>
                        </div>
                      )}

                      {budget !== undefined && (
                        <div className="flex justify-between items-center text-neutral-400">
                          <span>Expected Pace:</span>
                          <span>${budget.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="pt-1 border-t border-neutral-800/80 flex justify-between items-center text-[11px]">
                        <span className="text-neutral-400">Variance:</span>
                        <span className={variance > 0 ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                          {variance > 0 ? `+$${variance.toLocaleString()}` : `-$${Math.abs(variance).toLocaleString()}`}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-neutral-400">Remaining Cap:</span>
                        <span className="text-emerald-400 font-bold">${remaining.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Today's Marker Line */}
          <ReferenceLine
            x="Aug 10"
            stroke="#0284c7"
            strokeDasharray="3 3"
            strokeWidth={1.5}
            label={{
              value: "Today (Aug 10)",
              position: "top",
              fill: "#0284c7",
              fontSize: 10,
              fontWeight: 700,
            }}
          />

          {/* Budget Ceiling Horizontal Reference Line */}
          {visibility.budgetCeiling && (
            <ReferenceLine
              y={10000}
              stroke="#ef4444"
              strokeWidth={2}
              label={{
                value: "Monthly Budget Cap ($10,000)",
                position: "right",
                fill: "#ef4444",
                fontSize: 10,
                fontWeight: 800,
              }}
            />
          )}

          {/* Expected / Forecast Linear Pace Line */}
          {visibility.forecastPace && (
            <Area
              type="monotone"
              dataKey="expectedBudgetPace"
              name="Forecast Pace"
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={2}
              fill="none"
              isAnimationActive={true}
            />
          )}

          {/* Actual Cumulative Spend Area */}
          {visibility.actualSpend && (
            <Area
              type="monotone"
              dataKey="actualSpend"
              name="Actual Spend"
              stroke="#4f46e5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#actualSpendHeroGrad)"
              isAnimationActive={true}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
