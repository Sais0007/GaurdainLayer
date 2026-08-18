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

export interface RpmPoint {
  date: string;
  rpm: number;
}

export const mockRpmData: RpmPoint[] = [
  { date: "Aug 1", rpm: 290 },
  { date: "Aug 3", rpm: 210 },
  { date: "Aug 5", rpm: 280 },
  { date: "Aug 7", rpm: 200 },
  { date: "Aug 9", rpm: 220 },
  { date: "Aug 12", rpm: 310 },
  { date: "Aug 15", rpm: 210 },
  { date: "Aug 18", rpm: 280 },
  { date: "Aug 21", rpm: 220 },
  { date: "Aug 24", rpm: 260 },
  { date: "Aug 27", rpm: 420 }, // Peak
  { date: "Aug 30", rpm: 270 },
];

export const RpmThroughputChart: React.FC = () => {
  const limit = 500;

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 h-full min-h-[380px]">
      <div>
        <div className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Requests Per Minute (RPM) Throughput
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Peak gateway RPM vs configured limit ({limit} RPM)
          </p>
        </div>

        <div className="h-[280px] w-full pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockRpmData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="rpmOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} domain={[0, 600]} />

              <Tooltip
                wrapperStyle={{ zIndex: 9999 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const rpmVal = payload[0].value as number;
                    const util = ((rpmVal / limit) * 100).toFixed(1);
                    return (
                      <div className="!bg-[#1C1F2E] text-white p-3 rounded-[10px] shadow-2xl border border-neutral-700/80 text-xs space-y-1 font-mono w-48 z-[9999] pointer-events-none">
                        <div className="font-bold border-b border-neutral-700 pb-1 text-white">{label}</div>
                        <div className="text-amber-400 font-semibold flex justify-between">
                          <span>RPM:</span>
                          <span>{rpmVal} RPM</span>
                        </div>
                        <div className="text-neutral-400 flex justify-between text-[11px]">
                          <span>Limit:</span>
                          <span>{limit} RPM</span>
                        </div>
                        <div className="text-emerald-400 font-semibold flex justify-between text-[11px]">
                          <span>Utilization:</span>
                          <span>{util}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Threshold Line at 500 RPM */}
              <ReferenceLine
                y={limit}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Limit: ${limit} RPM`,
                  position: "center",
                  fill: "#ef4444",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />

              <Area
                type="monotone"
                dataKey="rpm"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#rpmOrangeGrad)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
