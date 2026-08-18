import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Sparkles, BarChart2, PieChart as PieChartIcon } from "lucide-react";

const dailySplitData = [
  { date: "Aug 1", input: 420, output: 210, total: 630, ratio: "2.0 : 1" },
  { date: "Aug 2", input: 510, output: 245, total: 755, ratio: "2.1 : 1" },
  { date: "Aug 3", input: 480, output: 230, total: 710, ratio: "2.1 : 1" },
  { date: "Aug 4", input: 620, output: 310, total: 930, ratio: "2.0 : 1" },
  { date: "Aug 5", input: 580, output: 290, total: 870, ratio: "2.0 : 1" },
  { date: "Aug 6", input: 490, output: 240, total: 730, ratio: "2.0 : 1" },
  { date: "Aug 7", input: 690, output: 340, total: 1030, ratio: "2.0 : 1" },
];

const distributionDonutData = [
  { name: "Input Tokens", value: 12.4, percent: 66.7, color: "#10b981" },
  { name: "Output Tokens", value: 6.2, percent: 33.3, color: "#0284c7" },
  { name: "Cached Tokens", value: 2.8, percent: 15.0, color: "#8b5cf6" },
  { name: "System Tokens", value: 0.9, percent: 4.8, color: "#f59e0b" },
];

export const InputOutputTokenSplit: React.FC = () => {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column: Stacked Vertical Bar Chart */}
      <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 min-h-[420px]">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <BarChart2 className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  Input vs Output Token Ratio
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                Daily comparison of prompt input versus completion output tokens.
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySplitData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
                <Tooltip
                  wrapperStyle={{ zIndex: 9999 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="!bg-[#1C1F2E] text-white p-3.5 rounded-[14px] shadow-2xl border border-neutral-700/80 text-xs space-y-1.5 font-mono w-56 z-[9999]">
                          <div className="font-bold text-emerald-400 border-b border-neutral-700 pb-1 flex justify-between">
                            <span>{label}</span>
                            <span className="text-[10px] text-neutral-300 font-sans font-normal">Ratio {d.ratio}</span>
                          </div>
                          <div className="flex justify-between items-center text-emerald-400">
                            <span>Input Tokens:</span>
                            <span className="font-bold">{d.input}M</span>
                          </div>
                          <div className="flex justify-between items-center text-sky-400">
                            <span>Output Tokens:</span>
                            <span className="font-bold">{d.output}M</span>
                          </div>
                          <div className="flex justify-between items-center border-t border-neutral-700 pt-1 text-white font-bold">
                            <span>Total Volume:</span>
                            <span>{d.total}M</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="input" name="Input Tokens" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={24} />
                <Bar dataKey="output" name="Output Tokens" stackId="a" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
          <span>Average Input/Output Ratio: <strong>2.0 : 1</strong></span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Prompt Heavy Workloads</span>
        </div>
      </div>

      {/* Right Column: Donut Chart (Token Distribution) */}
      <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 min-h-[420px]">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <PieChartIcon className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  Token Distribution Breakdown
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                Categorized token allocation across execution layers.
              </p>
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
                            <div className="font-bold text-purple-300 border-b border-neutral-700 pb-1">{data.name}</div>
                            <div className="flex justify-between gap-4">
                              <span className="text-neutral-400">Volume:</span>
                              <span className="font-bold text-white">{data.value}B Tokens</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-neutral-400">Share:</span>
                              <span className="text-emerald-400 font-bold">{data.percent}%</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={distributionDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={92}
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={(_, idx) => setActiveSegmentIndex(idx)}
                    onMouseLeave={() => setActiveSegmentIndex(null)}
                  >
                    {distributionDonutData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={entry.color}
                        stroke="none"
                        className="transition-all duration-300 cursor-pointer"
                        opacity={activeSegmentIndex === null || activeSegmentIndex === idx ? 1 : 0.4}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Metric Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Total Volume
                </span>
                <span className="text-lg font-extrabold text-neutral-900 dark:text-white font-mono leading-none mt-0.5">
                  18.6B
                </span>
              </div>
            </div>

            {/* Interactive Legend List */}
            <div className="sm:col-span-5 space-y-2 text-xs">
              {distributionDonutData.map((item, idx) => (
                <div
                  key={item.name}
                  onMouseEnter={() => setActiveSegmentIndex(idx)}
                  onMouseLeave={() => setActiveSegmentIndex(null)}
                  className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer ${
                    activeSegmentIndex === idx
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
          <span>Cached Tokens efficiency savings: <strong>$840/mo</strong></span>
          <span className="text-purple-600 dark:text-purple-400 font-semibold">15% Prompt Caching Enabled</span>
        </div>
      </div>
    </div>
  );
};
