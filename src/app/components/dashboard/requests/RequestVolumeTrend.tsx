import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";
import { cn } from "../../ui/utils";

export interface RequestTrendPoint {
  date: string;
  totalVolume: number;
  successful: number;
  failed: number;
}

export const mockRequestTrendData: RequestTrendPoint[] = [
  { date: "Aug 1", totalVolume: 6100, successful: 5870, failed: 230 },
  { date: "Aug 2", totalVolume: 7420, successful: 7140, failed: 280 },
  { date: "Aug 3", totalVolume: 5280, successful: 5080, failed: 200 },
  { date: "Aug 4", totalVolume: 7050, successful: 6830, failed: 220 },
  { date: "Aug 5", totalVolume: 5800, successful: 5550, failed: 250 },
  { date: "Aug 6", totalVolume: 6490, successful: 6270, failed: 220 },
  { date: "Aug 7", totalVolume: 6600, successful: 6350, failed: 250 },
  { date: "Aug 8", totalVolume: 7450, successful: 7170, failed: 280 },
  { date: "Aug 9", totalVolume: 5500, successful: 5300, failed: 200 },
  { date: "Aug 10", totalVolume: 6180, successful: 5940, failed: 240 },
  { date: "Aug 11", totalVolume: 7276, successful: 7046, failed: 230 },
  { date: "Aug 12", totalVolume: 5490, successful: 5280, failed: 210 },
  { date: "Aug 14", totalVolume: 7500, successful: 7220, failed: 280 },
  { date: "Aug 16", totalVolume: 7200, successful: 6940, failed: 260 },
  { date: "Aug 18", totalVolume: 5380, successful: 5180, failed: 200 },
  { date: "Aug 20", totalVolume: 7050, successful: 6790, failed: 260 },
  { date: "Aug 22", totalVolume: 5120, successful: 4930, failed: 190 },
  { date: "Aug 24", totalVolume: 7400, successful: 7120, failed: 280 },
  { date: "Aug 26", totalVolume: 5650, successful: 5440, failed: 210 },
  { date: "Aug 28", totalVolume: 9200, successful: 8850, failed: 350 },
  { date: "Aug 30", totalVolume: 6300, successful: 6060, failed: 240 },
];

export const RequestVolumeTrend: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Total Volume" | "Successful" | "Failed">("Total Volume");

  const getMetricKey = () => {
    switch (activeTab) {
      case "Successful":
        return "successful";
      case "Failed":
        return "failed";
      case "Total Volume":
      default:
        return "totalVolume";
    }
  };

  const getStrokeColor = () => {
    if (activeTab === "Failed") return "#ef4444";
    if (activeTab === "Successful") return "#10b981";
    return "#3b82f6";
  };

  const getGradId = () => {
    if (activeTab === "Failed") return "failedGrad";
    if (activeTab === "Successful") return "successGrad";
    return "totalGrad";
  };

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Request Volume Trend
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Continuous request trajectory across selected time range
          </p>
        </div>

        {/* Toggle Chips */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
          {(["Total Volume", "Successful", "Failed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer",
                activeTab === tab
                  ? tab === "Failed"
                    ? "bg-white dark:bg-neutral-900 text-rose-600 shadow-2xs"
                    : "bg-white dark:bg-neutral-900 text-sky-600 dark:text-sky-400 shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Area Chart (~380px) */}
      <div className="h-[380px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockRequestTrendData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="failedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => v.toLocaleString()} />

            <Tooltip
              wrapperStyle={{ zIndex: 9999 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  return (
                    <div className="!bg-[#1C1F2E] text-white p-3.5 rounded-[12px] shadow-2xl border border-neutral-700/80 text-xs space-y-1 font-sans w-52 z-[9999]">
                      <div className="font-bold border-b border-neutral-700/80 pb-1 text-white">{label}</div>
                      <div className="pt-1 flex justify-between items-center">
                        <span className="text-neutral-400 font-medium">Volume :</span>
                        <span className="font-bold text-sky-400">{val.toLocaleString()} requests</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey={getMetricKey()}
              stroke={getStrokeColor()}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${getGradId()})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
