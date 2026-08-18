import React, { useState } from "react";

export interface VirtualKeyCapacityRow {
  id: string;
  keyAlias: string;
  team: string;
  rpmPeak: number;
  rpmCap: number;
  rpmPercent: number;
  tpmPeakText: string;
  tpmCapText: string;
  tpmPercent: number;
  overallUtilization: number;
}

export const MOCK_KEY_CAPACITY_DATA: VirtualKeyCapacityRow[] = [
  {
    id: "vk1",
    keyAlias: "support-prod-key",
    team: "Support Team",
    rpmPeak: 180,
    rpmCap: 200,
    rpmPercent: 90.0,
    tpmPeakText: "740K",
    tpmCapText: "800K",
    tpmPercent: 92.5,
    overallUtilization: 92.5,
  },
  {
    id: "vk2",
    keyAlias: "marketing-prod-key",
    team: "Marketing Team",
    rpmPeak: 180,
    rpmCap: 200,
    rpmPercent: 90.0,
    tpmPeakText: "716K",
    tpmCapText: "800K",
    tpmPercent: 89.6,
    overallUtilization: 89.6,
  },
  {
    id: "vk3",
    keyAlias: "research-analysis-key",
    team: "Research Team",
    rpmPeak: 167,
    rpmCap: 200,
    rpmPercent: 83.5,
    tpmPeakText: "668K",
    tpmCapText: "800K",
    tpmPercent: 83.5,
    overallUtilization: 83.5,
  },
  {
    id: "vk4",
    keyAlias: "clinical-ops-key",
    team: "Clinical Operations",
    rpmPeak: 150,
    rpmCap: 200,
    rpmPercent: 75.0,
    tpmPeakText: "600K",
    tpmCapText: "800K",
    tpmPercent: 75.0,
    overallUtilization: 75.0,
  },
  {
    id: "vk5",
    keyAlias: "product-assistant-key",
    team: "Product Team",
    rpmPeak: 72.6,
    rpmCap: 200,
    rpmPercent: 36.3,
    tpmPeakText: "290K",
    tpmCapText: "800K",
    tpmPercent: 36.3,
    overallUtilization: 36.3,
  },
];

export const VirtualKeysCapacityList: React.FC = () => {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const getUtilizationBadge = (util: number) => {
    if (util >= 90) {
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase tracking-wide bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shrink-0">
          {util}% UTILIZATION
        </span>
      );
    }
    if (util >= 80) {
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase tracking-wide bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shrink-0">
          {util}% UTILIZATION
        </span>
      );
    }
    if (util >= 70) {
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase tracking-wide bg-yellow-100 dark:bg-yellow-950/80 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-800 shrink-0">
          {util}% UTILIZATION
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
        {util}% UTILIZATION
      </span>
    );
  };

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
      {/* Header */}
      <div className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
        <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Virtual Keys Capacity & Throttle Risk
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
          Detailed key-level throughput ceilings, peak usage, and rate-limit breach counts
        </p>
      </div>

      {/* Rows List */}
      <div className="space-y-3 pt-1">
        {MOCK_KEY_CAPACITY_DATA.map((row) => (
          <div
            key={row.id}
            onMouseEnter={() => setHoveredRowId(row.id)}
            onMouseLeave={() => setHoveredRowId(null)}
            className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer space-y-2 group ${
              hoveredRowId === row.id
                ? "bg-neutral-100/80 dark:bg-neutral-800/60 border-amber-300 dark:border-amber-700 shadow-2xs"
                : "bg-neutral-50/70 dark:bg-neutral-950/40 border-neutral-100 dark:border-neutral-850"
            }`}
          >
            {/* Top Key Alias & Utilization Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-neutral-900 dark:text-white text-xs group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {row.keyAlias}
                </span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                  ({row.team})
                </span>
              </div>
              {getUtilizationBadge(row.overallUtilization)}
            </div>

            {/* Dual Bars Row: Left RPM (Orange), Right TPM (Pink) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* RPM Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                  <span>RPM Peak: <strong>{row.rpmPeak} / {row.rpmCap} RPM</strong></span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${row.rpmPercent}%` }}
                  />
                </div>
              </div>

              {/* TPM Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                  <span>TPM Peak: <strong>{row.tpmPeakText} / {row.tpmCapText} TPM</strong></span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${row.tpmPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
