import React from "react";
import { Activity, CheckCircle2, AlertTriangle, Cpu, TrendingUp, TrendingDown } from "lucide-react";
import { OperationalKpis } from "./dashboardData";

interface OperationalHealthOverviewProps {
  data: OperationalKpis;
}

export const OperationalHealthOverview: React.FC<OperationalHealthOverviewProps> = ({ data }) => {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Operational Health & Gateway Volume
          </h2>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
          Request processing totals, token volume, SLA success baseline, and error failure counts
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Requests */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-neutral-500 dark:text-neutral-400 tracking-wider">
              Total Requests
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:brightness-105 transition-all">
              <TrendingUp className="w-3 h-3" />
              ↑ {data.totalRequests.trend}%
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-mono group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {data.totalRequests.value.toLocaleString()}
            </div>
            {/* Request Volume Bars */}
            <div className="flex items-end gap-1 mt-2.5 h-4">
              {[40, 50, 45, 65, 70, 85, 90, 95, 88, 100].map((h, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-indigo-500/80 dark:bg-indigo-400/80 rounded-xs transition-all duration-300 group-hover:brightness-110"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between font-medium">
            <span>Processed during selected period</span>
            <span className="font-mono text-neutral-700 dark:text-neutral-300">Peak: {data.totalRequests.peakRateHour.toLocaleString()}/h</span>
          </div>
        </div>

        {/* Card 2: Success Rate */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-emerald-200/60 dark:border-emerald-900/30 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-neutral-500 dark:text-neutral-400 tracking-wider">
              Success Rate
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:brightness-105 transition-all">
              <TrendingUp className="w-3 h-3" />
              ↑ {data.successRate.trend}%
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
              {data.successRate.percent}%
            </div>
            {/* SLA Solid Progress Bar */}
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-3 rounded-full overflow-hidden flex mt-2.5 p-0.5">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                style={{ width: `${data.successRate.percent}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between font-medium">
            <span>Target: {data.successRate.targetPercent}% SLA</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> SLA Met
            </span>
          </div>
        </div>

        {/* Card 3: Failed Requests (VISUALLY HIGHLIGHTED FOR FAILURE RISK) */}
        <div className="p-4 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md hover:border-rose-400 dark:hover:border-rose-700 transition-all duration-200 cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-rose-800 dark:text-rose-300 tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              Failed Requests
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700 hover:brightness-105 transition-all">
              <TrendingDown className="w-3 h-3" />
              ↓ {Math.abs(data.failedRequests.trend)}%
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-rose-700 dark:text-rose-300 tracking-tight font-mono">
              {data.failedRequests.value.toLocaleString()}
            </div>
            {/* Failure Spike Highlight Chart */}
            <div className="flex items-end gap-1 mt-2.5 h-4">
              {[20, 25, 30, 95, 100, 85, 40, 25, 15, 10].map((h, idx) => (
                <div
                  key={idx}
                  className={`flex-1 rounded-xs transition-all duration-300 ${
                    idx === 3 || idx === 4 || idx === 5
                      ? "bg-rose-600 dark:bg-rose-500 animate-pulse"
                      : "bg-rose-200 dark:bg-rose-900/40 group-hover:brightness-110"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-rose-200/80 dark:border-rose-900/40 text-[10px] text-rose-700 dark:text-rose-300 flex items-center justify-between font-medium">
            <span className="truncate pr-1 font-semibold">{data.failedRequests.failureSharePercent}% {data.failedRequests.topFailureModel}</span>
            <span className="shrink-0 font-mono text-[9px] bg-rose-200/60 dark:bg-rose-900/50 px-1.5 py-0.5 rounded text-rose-800 dark:text-rose-200">Incident Window</span>
          </div>
        </div>

        {/* Card 4: Total Tokens */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-neutral-500 dark:text-neutral-400 tracking-wider flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-violet-500" />
              Total Tokens
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 hover:brightness-105 transition-all">
              <TrendingUp className="w-3 h-3" />
              ↑ 14.1%
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-mono group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {data.totalTokens.formatted}
            </div>
            {/* Input vs Output Stacked Bar */}
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-3 rounded-full overflow-hidden flex mt-2.5 p-0.5">
              <div className="bg-violet-600 h-full rounded-l-full w-[66%] group-hover:brightness-110 transition-all" />
              <div className="bg-purple-400 h-full rounded-r-full flex-1 group-hover:brightness-110 transition-all" />
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between font-medium">
            <span>{data.totalTokens.rawInput} · {data.totalTokens.rawOutput}</span>
            <span className="font-mono">Avg: {data.totalTokens.avgTokensPerReq.toLocaleString()}/req</span>
          </div>
        </div>
      </div>
    </div>
  );
};
