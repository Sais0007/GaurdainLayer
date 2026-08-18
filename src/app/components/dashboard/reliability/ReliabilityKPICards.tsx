import React from "react";
import { Skeleton } from "../../ui/skeleton";
import { DashboardState } from "../../Dashboard";

interface ReliabilityKPICardsProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export const ReliabilityKPICards: React.FC<ReliabilityKPICardsProps> = ({ state = "normal" }) => {
  if (state === "loading") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[14px] space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ROW 1: SLA & Rate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* SUCCESS RATE */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              SUCCESS RATE
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
              96.2%
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Target SLA: 98.0%
          </div>
        </div>

        {/* FAILURE RATE */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              FAILURE RATE
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tracking-tight">
              3.8%
            </div>
          </div>
          <div className="mt-3 text-[11px] font-bold text-rose-600 dark:text-rose-400">
            ↑ 05.8% vs prev period
          </div>
        </div>

        {/* SUCCESSFUL */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              SUCCESSFUL
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-neutral-900 dark:text-white tracking-tight">
              175,699
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Completed API calls
          </div>
        </div>

        {/* FAILED REQUESTS */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              FAILED REQUESTS
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tracking-tight">
              6,941
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            4xx / 5xx error responses
          </div>
        </div>

        {/* ELEVATED PERIODS */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              ELEVATED PERIODS
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-neutral-900 dark:text-white tracking-tight">
              1 Event
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Aug 4 (2:00 PM - 3:30 PM)
          </div>
        </div>
      </div>

      {/* ROW 2: Impact & Root Cause Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* AFFECTED KEYS */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              AFFECTED KEYS
            </span>
            <div className="mt-2 text-base font-bold text-neutral-900 dark:text-white truncate">
              3 Keys
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            support-prod-key & 2 others
          </div>
        </div>

        {/* AFFECTED TEAMS */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              AFFECTED TEAMS
            </span>
            <div className="mt-2 text-base font-bold text-neutral-900 dark:text-white truncate">
              3 Teams / 8 Users
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Support, Research, Product
          </div>
        </div>

        {/* MOST FAILED MODEL */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              MOST FAILED MODEL
            </span>
            <div className="mt-2 text-base font-bold text-neutral-900 dark:text-white truncate">
              Claude Sonnet
            </div>
          </div>
          <div className="mt-3 text-[11px] font-bold text-rose-600 dark:text-rose-400">
            7.3% error rate
          </div>
        </div>

        {/* MOST FAILED PROVIDER */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              MOST FAILED PROVIDER
            </span>
            <div className="mt-2 text-base font-bold text-neutral-900 dark:text-white truncate">
              Anthropic
            </div>
          </div>
          <div className="mt-3 text-[11px] font-bold text-rose-600 dark:text-rose-400">
            7.3% error rate
          </div>
        </div>

        {/* PRIMARY ERROR */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              PRIMARY ERROR
            </span>
            <div className="mt-2 text-base font-bold text-rose-600 dark:text-rose-400 truncate">
              503 Provider Down
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            3,420 errors (49.3%)
          </div>
        </div>
      </div>
    </div>
  );
};
