import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface TimelineDataPoint {
  date: string;
  successful: number;
  failed: number;
  isAnomalous?: boolean;
}

export const mockTimelineData: TimelineDataPoint[] = [
  { date: "Aug 1", successful: 6600, failed: 240 },
  { date: "Aug 2", successful: 6800, failed: 250 },
  { date: "Aug 3", successful: 5100, failed: 210 },
  { date: "Aug 4", successful: 6151, failed: 1280, isAnomalous: true }, // Spike day
  { date: "Aug 5", successful: 5500, failed: 220 },
  { date: "Aug 6", successful: 6300, failed: 240 },
  { date: "Aug 7", successful: 6500, failed: 250 },
  { date: "Aug 8", successful: 7100, failed: 270 },
  { date: "Aug 9", successful: 5200, failed: 200 },
  { date: "Aug 10", successful: 5700, failed: 220 },
  { date: "Aug 12", successful: 6800, failed: 260 },
  { date: "Aug 14", successful: 5000, failed: 190 },
  { date: "Aug 16", successful: 6900, failed: 250 },
  { date: "Aug 18", successful: 5800, failed: 210 },
  { date: "Aug 20", successful: 5200, failed: 190 },
  { date: "Aug 22", successful: 6900, failed: 260 },
  { date: "Aug 24", successful: 5200, failed: 190 },
  { date: "Aug 26", successful: 6600, failed: 240 },
  { date: "Aug 28", successful: 8800, failed: 340 },
  { date: "Aug 30", successful: 7100, failed: 260 },
];

export const SuccessFailureTimeline: React.FC = () => {
  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
      {/* Header with Title and Target Baseline SLA Badge */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Success and Failure Timeline
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Continuous volume trace with baseline vs anomalous error periods
          </p>
        </div>

        {/* Top-Right SLA Target Badge */}
        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
          Target Baseline: <strong>98.0% SLA</strong>
        </span>
      </div>

      {/* Stacked Vertical Bar Chart (~380px) */}
      <div className="h-[360px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockTimelineData} margin={{ top: 15, right: 15, left: -15, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => v.toLocaleString()} />

            <Tooltip
              wrapperStyle={{ zIndex: 9999 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as TimelineDataPoint;
                  return (
                    <div className="!bg-[#1C1F2E] text-white p-3.5 rounded-[12px] shadow-2xl border border-neutral-700/80 text-xs space-y-1.5 font-mono w-56 z-[9999] pointer-events-none">
                      <div className="font-bold border-b border-neutral-700 pb-1 text-white">{label}</div>
                      <div className="text-rose-400 font-semibold flex justify-between">
                        <span>Failed Requests :</span>
                        <span>{data.failed.toLocaleString()}</span>
                      </div>
                      <div className="text-sky-400 font-semibold flex justify-between">
                        <span>Successful Requests :</span>
                        <span>{data.successful.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Stacked Bar Series: Blue for Successful, Red for Failed */}
            <Bar dataKey="successful" name="Successful Requests" stackId="a" fill="#2563eb" radius={[0, 0, 2, 2]} barSize={16} />
            <Bar dataKey="failed" name="Failed Requests" stackId="a" fill="#ef4444" radius={[2, 2, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#ef4444]" />
            <span>Failed Requests</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#2563eb]" />
            <span>Successful Requests</span>
          </div>
        </div>
      </div>
    </div>
  );
};
