import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart as PieChartIcon, Building2, Globe } from "lucide-react";

const donutDistributionData = [
  { name: "Input Tokens", value: 10.8, percent: 65.8, cost: "$46,440", color: "#0284c7" },
  { name: "Output Tokens", value: 5.6, percent: 34.2, cost: "$24,080", color: "#10b981" },
  { name: "Cached Tokens", value: 2.4, percent: 14.6, cost: "$10,320", color: "#8b5cf6" },
  { name: "System Tokens", value: 0.8, percent: 4.8, cost: "$3,440", color: "#f59e0b" },
];

const providerConsumptionData = [
  { name: "Anthropic", tokens: "6.80B", rawValue: 6.8, percent: 41.5, input: "4.5B", output: "2.3B", latency: "380ms", cost: "$0.0051/1k", color: "#8b5cf6" },
  { name: "OpenAI", tokens: "5.40B", rawValue: 5.4, percent: 32.9, input: "3.6B", output: "1.8B", latency: "320ms", cost: "$0.0042/1k", color: "#10b981" },
  { name: "Google", tokens: "2.10B", rawValue: 2.1, percent: 12.8, input: "1.4B", output: "0.7B", latency: "290ms", cost: "$0.0031/1k", color: "#0284c7" },
  { name: "Meta", tokens: "1.30B", rawValue: 1.3, percent: 7.9, input: "0.9B", output: "0.4B", latency: "240ms", cost: "$0.0018/1k", color: "#f59e0b" },
  { name: "DeepSeek", tokens: "0.80B", rawValue: 0.8, percent: 4.9, input: "0.5B", output: "0.3B", latency: "310ms", cost: "$0.0012/1k", color: "#ec4899" },
];

export const TokenFlowVisualization: React.FC = () => {
  const [activeDonutIdx, setActiveDonutIdx] = useState<number | null>(null);
  const [hoveredProvider, setHoveredProvider] = useState<typeof providerConsumptionData[0] | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: Input vs Output Split */}
      <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 min-h-[400px]">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <PieChartIcon className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Input vs Output Split
              </h3>
            </div>
          </div>

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
                          <div className="!bg-[#1C1F2E] text-white p-3.5 rounded-[14px] shadow-2xl border border-neutral-700/80 text-xs space-y-1 font-mono w-52 z-[9999]">
                            <div className="font-bold text-sky-400 border-b border-neutral-700 pb-1">{data.name}</div>
                            <div className="flex justify-between gap-4">
                              <span className="text-neutral-400">Tokens:</span>
                              <span className="font-bold text-white">{data.value}B</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-neutral-400">Percentage:</span>
                              <span className="text-emerald-400 font-bold">{data.percent}%</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-neutral-400">Cost:</span>
                              <span className="text-amber-400 font-bold">{data.cost}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={donutDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={92}
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={(_, idx) => setActiveDonutIdx(idx)}
                    onMouseLeave={() => setActiveDonutIdx(null)}
                  >
                    {donutDistributionData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={entry.color}
                        stroke="none"
                        className="transition-all duration-300 cursor-pointer"
                        opacity={activeDonutIdx === null || activeDonutIdx === idx ? 1 : 0.4}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Metric Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Total Tokens
                </span>
                <span className="text-lg font-extrabold text-neutral-900 dark:text-white font-mono leading-none mt-0.5">
                  16.4B
                </span>
              </div>
            </div>

            {/* Legend List */}
            <div className="sm:col-span-5 space-y-2 text-xs">
              {donutDistributionData.map((item, idx) => (
                <div
                  key={item.name}
                  onMouseEnter={() => setActiveDonutIdx(idx)}
                  onMouseLeave={() => setActiveDonutIdx(null)}
                  className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer ${
                    activeDonutIdx === idx
                      ? "bg-neutral-100 dark:bg-neutral-800/80 border-purple-300 dark:border-purple-700 shadow-2xs font-bold"
                      : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-950/60"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate text-[11px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-neutral-900 dark:text-white shrink-0">
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
          <span>Prompt context ratio: <strong>1.93 : 1</strong></span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Healthy Prompt Density</span>
        </div>
      </div>

      {/* RIGHT: Provider Token Consumption */}
      <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 min-h-[400px]">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Provider Token Consumption
              </h3>
            </div>
          </div>

          {/* Horizontal Provider Bars */}
          <div className="space-y-3 pt-3">
            {providerConsumptionData.map((prov) => (
              <div
                key={prov.name}
                onMouseEnter={() => setHoveredProvider(prov)}
                onMouseLeave={() => setHoveredProvider(null)}
                className="space-y-1.5 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: prov.color }} />
                    <span className="font-bold text-neutral-900 dark:text-white">{prov.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">{prov.tokens}</span>
                    <span className="text-neutral-400">({prov.percent}%)</span>
                  </div>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${prov.percent}%`, backgroundColor: prov.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hover Card */}
          {hoveredProvider && (
            <div className="mt-2 p-2.5 bg-[#1C1F2E] text-white rounded-xl shadow-xl text-xs flex justify-between items-center font-mono border border-neutral-700/80 animate-fadeIn">
              <span className="font-bold text-sky-400">{hoveredProvider.name}</span>
              <span className="text-[10px]">In: <strong>{hoveredProvider.input}</strong> | Out: <strong>{hoveredProvider.output}</strong></span>
              <span className="text-[10px]">Lat: <strong>{hoveredProvider.latency}</strong></span>
              <span className="text-[10px] text-amber-400">Cost: <strong>{hoveredProvider.cost}</strong></span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
          <span>Top Provider: <strong>Anthropic (41.5%)</strong></span>
          <span className="text-sky-600 dark:text-sky-400 font-semibold">5 Active Providers Connected</span>
        </div>
      </div>
    </div>
  );
};
