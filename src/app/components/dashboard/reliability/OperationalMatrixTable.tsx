import React, { useState } from "react";

export interface OperationalMatrixRow {
  id: string;
  model: string;
  provider: string;
  requests: number;
  spendUsd: number;
  costPerReq: number;
  costPer1kTokens: number;
  successPercent: number;
  failurePercent: number;
  status: "HEALTHY" | "WARNING" | "DEGRADED" | "CRITICAL";
}

export const MOCK_OPERATIONAL_MATRIX_DATA: OperationalMatrixRow[] = [
  {
    id: "m1",
    model: "Claude Sonnet",
    provider: "Anthropic",
    requests: 68400,
    spendUsd: 3180,
    costPerReq: 0.0465,
    costPer1kTokens: 0.000505,
    successPercent: 92.7,
    failurePercent: 7.3,
    status: "DEGRADED",
  },
  {
    id: "m2",
    model: "GPT-4.1",
    provider: "OpenAI",
    requests: 52100,
    spendUsd: 2450,
    costPerReq: 0.0470,
    costPer1kTokens: 0.000521,
    successPercent: 99.2,
    failurePercent: 0.8,
    status: "HEALTHY",
  },
  {
    id: "m3",
    model: "GPT-5",
    provider: "OpenAI",
    requests: 31200,
    spendUsd: 1370,
    costPerReq: 0.0439,
    costPer1kTokens: 0.000415,
    successPercent: 99.1,
    failurePercent: 0.9,
    status: "HEALTHY",
  },
  {
    id: "m4",
    model: "Gemini Pro",
    provider: "Google",
    requests: 20800,
    spendUsd: 620,
    costPerReq: 0.0298,
    costPer1kTokens: 0.000421,
    successPercent: 98.9,
    failurePercent: 1.1,
    status: "HEALTHY",
  },
  {
    id: "m5",
    model: "Llama 3.1",
    provider: "Meta",
    requests: 10140,
    spendUsd: 180,
    costPerReq: 0.0178,
    costPer1kTokens: 0.000285,
    successPercent: 99.5,
    failurePercent: 0.5,
    status: "HEALTHY",
  },
];

export const OperationalMatrixTable: React.FC = () => {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const getStatusBadge = (status: OperationalMatrixRow["status"]) => {
    switch (status) {
      case "DEGRADED":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            DEGRADED
          </span>
        );
      case "WARNING":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
            WARNING
          </span>
        );
      case "CRITICAL":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            CRITICAL
          </span>
        );
      case "HEALTHY":
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            HEALTHY
          </span>
        );
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
      {/* Header */}
      <div className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
        <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Model and Provider Operational Matrix
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
          Unit economics, latency, and failure rates across LLM providers
        </p>
      </div>

      {/* Responsive Scrollable Table with Sticky Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-neutral-700 dark:text-neutral-300">
          <thead className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-50/80 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 sticky top-0">
            <tr>
              <th className="py-2.5 px-4 font-bold">MODEL</th>
              <th className="py-2.5 px-4 font-bold">PROVIDER</th>
              <th className="py-2.5 px-4 font-mono font-bold text-right">REQUESTS</th>
              <th className="py-2.5 px-4 font-mono font-bold text-right">SPEND USD</th>
              <th className="py-2.5 px-4 font-mono font-bold text-right">COST / REQ</th>
              <th className="py-2.5 px-4 font-mono font-bold text-right">COST / 1K TOKENS</th>
              <th className="py-2.5 px-4 font-mono font-bold text-right">SUCCESS %</th>
              <th className="py-2.5 px-4 font-mono font-bold text-right">FAILURE %</th>
              <th className="py-2.5 px-4 text-center font-bold">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono">
            {MOCK_OPERATIONAL_MATRIX_DATA.map((row) => (
              <tr
                key={row.id}
                onMouseEnter={() => setHoveredRowId(row.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                className={`transition-colors cursor-pointer ${
                  hoveredRowId === row.id
                    ? "bg-neutral-100/70 dark:bg-neutral-800/60"
                    : "hover:bg-neutral-50/80 dark:hover:bg-neutral-950/40"
                }`}
              >
                <td className="py-3 px-4 font-sans font-bold text-neutral-900 dark:text-white">
                  {row.model}
                </td>
                <td className="py-3 px-4 font-sans text-neutral-600 dark:text-neutral-400 font-semibold">
                  {row.provider}
                </td>
                <td className="py-3 px-4 text-right text-neutral-900 dark:text-white font-bold">
                  {row.requests.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right text-neutral-900 dark:text-white font-bold">
                  ${row.spendUsd.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right text-neutral-600 dark:text-neutral-400">
                  ${row.costPerReq.toFixed(4)}
                </td>
                <td className="py-3 px-4 text-right text-neutral-600 dark:text-neutral-400">
                  ${row.costPer1kTokens.toFixed(6)}
                </td>
                <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                  {row.successPercent.toFixed(1)}%
                </td>
                <td className={`py-3 px-4 text-right font-bold ${row.failurePercent > 2 ? "text-rose-600 dark:text-rose-400" : "text-neutral-600 dark:text-neutral-400"}`}>
                  {row.failurePercent.toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-center">
                  {getStatusBadge(row.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
