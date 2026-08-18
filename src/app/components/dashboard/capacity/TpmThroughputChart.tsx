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

export interface TpmPoint {
  date: string;
  tpm: number; // in Millions
}

export const mockTpmData: TpmPoint[] = [
  { date: "Aug 1", tpm: 0.62 },
  { date: "Aug 3", tpm: 1.12 },
  { date: "Aug 5", tpm: 0.95 },
  { date: "Aug 7", tpm: 1.18 },
  { date: "Aug 9", tpm: 1.03 },
  { date: "Aug 12", tpm: 1.16 },
  { date: "Aug 15", tpm: 0.65 },
  { date: "Aug 18", tpm: 1.17 },
  { date: "Aug 21", tpm: 0.88 },
  { date: "Aug 24", tpm: 1.22 },
  { date: "Aug 27", tpm: 1.85 }, // Peak
  { date: "Aug 30", tpm: 1.30 },
];

export const TpmThroughputChart: React.FC = () => {
  const limit = 2.0; // 2.0M

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 h-full min-h-[380px]">
      <div>
        <div className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Tokens Per Minute (TPM) Burst Throughput
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Peak burst TPM vs configured limit ({limit}M TPM)
          </p>
        </div>

        <div className="h-[280px] w-full pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTpmData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="tpmPinkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v.toFixed(1)}M`}
                domain={[0, 2.2]}
              />

              <Tooltip
                wrapperStyle={{ zIndex: 9999 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const tpmVal = payload[0].value as number;
                    const util = ((tpmVal / limit) * 100).toFixed(1);
                    return (
                      <div className="!bg-[#1C1F2E] text-white p-3 rounded-[10px] shadow-2xl border border-neutral-700/80 text-xs space-y-1 font-mono w-48 z-[9999] pointer-events-none">
                        <div className="font-bold border-b border-neutral-700 pb-1 text-white">{label}</div>
                        <div className="text-rose-400 font-semibold flex justify-between">
                          <span>TPM:</span>
                          <span>{tpmVal.toFixed(2)}M TPM</span>
                        </div>
                        <div className="text-neutral-400 flex justify-between text-[11px]">
                          <span>Limit:</span>
                          <span>{limit.toFixed(1)}M TPM</span>
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

              {/* Threshold Line at 2.0M TPM */}
              <ReferenceLine
                y={limit}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Limit: ${limit.toFixed(1)}M TPM`,
                  position: "center",
                  fill: "#ef4444",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />

              <Area
                type="monotone"
                dataKey="tpm"
                stroke="#ec4899"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tpmPinkGrad)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
