import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "../../ui/utils";

export interface TokenTrendPoint {
  date: string;
  inputTokens: number; // in Millions
  outputTokens: number; // in Millions
  totalTokens: number; // in Millions
}

export const mockTokenTrendData: TokenTrendPoint[] = [
  { date: "Aug 1", inputTokens: 430, outputTokens: 220, totalTokens: 650 },
  { date: "Aug 2", inputTokens: 380, outputTokens: 190, totalTokens: 570 },
  { date: "Aug 3", inputTokens: 290, outputTokens: 150, totalTokens: 440 },
  { date: "Aug 4", inputTokens: 370, outputTokens: 190, totalTokens: 560 },
  { date: "Aug 5", inputTokens: 410, outputTokens: 210, totalTokens: 620 },
  { date: "Aug 6", inputTokens: 400, outputTokens: 210, totalTokens: 610 },
  { date: "Aug 7", inputTokens: 390, outputTokens: 200, totalTokens: 590 },
  { date: "Aug 8", inputTokens: 400, outputTokens: 200, totalTokens: 600 },
  { date: "Aug 9", inputTokens: 340, outputTokens: 180, totalTokens: 520 },
  { date: "Aug 10", inputTokens: 310, outputTokens: 160, totalTokens: 470 },
  { date: "Aug 12", inputTokens: 420, outputTokens: 220, totalTokens: 640 },
  { date: "Aug 14", inputTokens: 430, outputTokens: 210, totalTokens: 640 },
  { date: "Aug 16", inputTokens: 389, outputTokens: 203, totalTokens: 592 },
  { date: "Aug 18", inputTokens: 400, outputTokens: 200, totalTokens: 600 },
  { date: "Aug 20", inputTokens: 300, outputTokens: 160, totalTokens: 460 },
  { date: "Aug 22", inputTokens: 400, outputTokens: 200, totalTokens: 600 },
  { date: "Aug 24", inputTokens: 310, outputTokens: 150, totalTokens: 460 },
  { date: "Aug 26", inputTokens: 330, outputTokens: 170, totalTokens: 500 },
  { date: "Aug 28", inputTokens: 560, outputTokens: 280, totalTokens: 840 },
  { date: "Aug 30", inputTokens: 410, outputTokens: 210, totalTokens: 620 },
];

export const TokensTrendChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Total Volume" | "Input Tokens" | "Output Tokens">("Total Volume");

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Input vs Output Token Trend
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Token distribution over selected time range
          </p>
        </div>

        {/* Toggle Chips */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
          {(["Total Volume", "Input Tokens", "Output Tokens"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer",
                activeTab === tab
                  ? tab === "Input Tokens"
                    ? "bg-white dark:bg-neutral-900 text-sky-600 dark:text-sky-400 shadow-2xs"
                    : tab === "Output Tokens"
                    ? "bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                    : "bg-white dark:bg-neutral-900 text-purple-600 dark:text-purple-400 shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stacked Vertical Bar Chart */}
      <div className="h-[360px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockTokenTrendData} margin={{ top: 15, right: 15, left: -15, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}B`}
            />

            <Tooltip
              wrapperStyle={{ zIndex: 9999 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as TokenTrendPoint;
                  return (
                    <div className="!bg-[#1C1F2E] text-white p-3 rounded-[10px] shadow-2xl border border-neutral-700/80 text-xs space-y-1 font-mono w-48 z-[9999] pointer-events-none">
                      <div className="font-bold border-b border-neutral-700 pb-1 text-white">{label}</div>
                      <div className="text-sky-400 font-semibold flex justify-between">
                        <span>Input:</span>
                        <span>{data.inputTokens.toFixed(1)}M tokens</span>
                      </div>
                      <div className="text-emerald-400 font-semibold flex justify-between">
                        <span>Output:</span>
                        <span>{data.outputTokens.toFixed(1)}M tokens</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {(activeTab === "Total Volume" || activeTab === "Input Tokens") && (
              <Bar dataKey="inputTokens" name="Input Tokens" stackId="a" fill="#3b82f6" radius={[0, 0, 2, 2]} barSize={16} />
            )}
            {(activeTab === "Total Volume" || activeTab === "Output Tokens") && (
              <Bar dataKey="outputTokens" name="Output Tokens" stackId="a" fill="#10b981" radius={[2, 2, 0, 0]} barSize={16} />
            )}
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#3b82f6]" />
            <span>Input Tokens</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#10b981]" />
            <span>Output Tokens</span>
          </div>
        </div>
      </div>
    </div>
  );
};
