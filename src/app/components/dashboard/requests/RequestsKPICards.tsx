import React from "react";
import { Skeleton } from "../../ui/skeleton";
import { DashboardState } from "../../Dashboard";

interface RequestsKPICardsProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export const RequestsKPICards: React.FC<RequestsKPICardsProps> = ({ state = "normal" }) => {
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
      {/* ROW 1: Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* TOTAL REQUESTS */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              TOTAL REQUESTS
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-neutral-900 dark:text-white tracking-tight">
              182,640
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            ↑ 18.3% vs prev period
          </div>
        </div>

        {/* SUCCESSFUL */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              SUCCESSFUL
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
              175,699
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            96.2% success rate
          </div>
        </div>

        {/* FAILED */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              FAILED
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tracking-tight">
              6,941
            </div>
          </div>
          <div className="mt-3 text-[11px] font-bold text-rose-600 dark:text-rose-400">
            3.8% error rate
          </div>
        </div>

        {/* AVG REQUESTS / DAY */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              AVG REQUESTS / DAY
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-neutral-900 dark:text-white tracking-tight">
              6,088
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Over 30 day window
          </div>
        </div>

        {/* PEAK REQUEST HOUR */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              PEAK REQUEST HOUR
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-sky-600 dark:text-sky-400 tracking-tight">
              8,420 reqs
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Aug 4 at 2:00 PM
          </div>
        </div>
      </div>

      {/* ROW 2: Dimension Entity KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* MOST ACTIVE TEAM */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              MOST ACTIVE TEAM
            </span>
            <div className="mt-2 text-base font-bold text-neutral-900 dark:text-white truncate">
              Support
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            54,200 reqs (29.7%)
          </div>
        </div>

        {/* MOST ACTIVE USER */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              MOST ACTIVE USER
            </span>
            <div className="mt-2 text-base font-bold text-neutral-900 dark:text-white truncate">
              Dr. Sarah Chen
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            24,800 reqs (13.6%)
          </div>
        </div>

        {/* TOP VIRTUAL KEY */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              TOP VIRTUAL KEY
            </span>
            <div className="mt-2 text-base font-bold font-mono text-neutral-900 dark:text-white truncate">
              support-prod-key
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            38,200 reqs (20.9%)
          </div>
        </div>

        {/* MOST USED MODEL */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              MOST USED MODEL
            </span>
            <div className="mt-2 text-base font-bold text-neutral-900 dark:text-white truncate">
              Claude Sonnet
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            68,400 reqs (37.4%)
          </div>
        </div>

        {/* TOP PROVIDER */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              TOP PROVIDER
            </span>
            <div className="mt-2 text-base font-bold text-neutral-900 dark:text-white truncate">
              OpenAI
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            83,300 reqs (45.6%)
          </div>
        </div>
      </div>
    </div>
  );
};
