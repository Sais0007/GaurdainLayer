import React, { useState } from "react";

export interface FailureCauseItem {
  id: string;
  cause: string;
  description: string;
  count: number;
  percent: number;
}

export const MOCK_FAILURE_CAUSES: FailureCauseItem[] = [
  {
    id: "f1",
    cause: "Provider Unavailable / Degraded",
    description: "Anthropic Claude API connection reset or 503 HTTP gateway error",
    count: 3420,
    percent: 49.3,
  },
  {
    id: "f2",
    cause: "Request Timeout",
    description: "Upstream response exceeded 30s timeout window",
    count: 1810,
    percent: 26.1,
  },
  {
    id: "f3",
    cause: "RPM Limit Exceeded",
    description: "Virtual key breached local RPM throttle ceiling",
    count: 820,
    percent: 11.8,
  },
  {
    id: "f4",
    cause: "TPM Limit Exceeded",
    description: "Virtual key breached local TPM burst token limit",
    count: 480,
    percent: 6.9,
  },
  {
    id: "f5",
    cause: "Budget Exceeded",
    description: "Team soft limit restriction triggered rejection",
    count: 220,
    percent: 3.2,
  },
  {
    id: "f6",
    cause: "Authentication / Model Error",
    description: "Invalid model configuration or header credential failure",
    count: 191,
    percent: 2.7,
  },
];

export const FailureCauseDistribution: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
      {/* Header */}
      <div className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
        <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Normalized Failure Cause Distribution
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
          Categorized error codes and root cause frequency
        </p>
      </div>

      {/* Two-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {MOCK_FAILURE_CAUSES.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`p-4 rounded-xl bg-neutral-50/80 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850 hover:border-rose-300 dark:hover:border-rose-800/80 transition-all duration-200 cursor-pointer space-y-2 group ${
              hoveredId === item.id ? "bg-rose-50/30 dark:bg-rose-950/20 shadow-2xs" : ""
            }`}
          >
            {/* Cause Title & Error Count */}
            <div className="flex justify-between items-start gap-2">
              <span className="font-bold text-neutral-900 dark:text-white text-xs group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                {item.cause}
              </span>
              <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 shrink-0">
                {item.count.toLocaleString()} errors ({item.percent.toFixed(1)}%)
              </span>
            </div>

            {/* Subtitle Description */}
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
              {item.description}
            </p>

            {/* Red Progress Bar */}
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-600 dark:bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
