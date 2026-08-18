import React from "react";
import { Skeleton } from "../../ui/skeleton";
import { DashboardState } from "../../Dashboard";

interface CapacityKPICardsProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export const CapacityKPICards: React.FC<CapacityKPICardsProps> = ({ state = "normal" }) => {
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
      {/* ROW 1: Gateway Ceilings & Throughput */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* PEAK RPM THROUGHPUT */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              PEAK RPM THROUGHPUT
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-neutral-900 dark:text-white tracking-tight">
              420 RPM
            </div>
          </div>
          <div className="mt-3 text-[11px] font-bold text-amber-600 dark:text-amber-400">
            84.0% of gateway limit
          </div>
        </div>

        {/* GATEWAY RPM LIMIT */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              GATEWAY RPM LIMIT
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-sky-600 dark:text-sky-400 tracking-tight">
              500 RPM
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Configured org ceiling
          </div>
        </div>

        {/* PEAK TPM THROUGHPUT */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              PEAK TPM THROUGHPUT
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-neutral-900 dark:text-white tracking-tight">
              1.85M TPM
            </div>
          </div>
          <div className="mt-3 text-[11px] font-bold text-rose-600 dark:text-rose-400">
            92.5% of gateway limit
          </div>
        </div>

        {/* GATEWAY TPM LIMIT */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              GATEWAY TPM LIMIT
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 tracking-tight">
              2.0M TPM
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Configured burst ceiling
          </div>
        </div>

        {/* THROTTLE BREACHES */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              THROTTLE BREACHES
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tracking-tight">
              820 Events
            </div>
          </div>
          <div className="mt-3 text-[11px] font-bold text-rose-600 dark:text-rose-400">
            429 HTTP responses
          </div>
        </div>
      </div>

      {/* ROW 2: Key Risks & Drivers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KEYS NEAR CAPACITY */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              KEYS NEAR CAPACITY
            </span>
            <div className="mt-2 text-base font-bold text-amber-600 dark:text-amber-400 truncate">
              2 Keys
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            &gt;85% throttle risk
          </div>
        </div>

        {/* HIGHEST RPM KEY */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              HIGHEST RPM KEY
            </span>
            <div className="mt-2 text-base font-bold font-mono text-neutral-900 dark:text-white truncate">
              marketing-prod-key
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            180 / 200 RPM (90.0%)
          </div>
        </div>

        {/* HIGHEST TPM KEY */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              HIGHEST TPM KEY
            </span>
            <div className="mt-2 text-base font-bold font-mono text-neutral-900 dark:text-white truncate">
              research-analysis-key
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            720K / 800K TPM (90.0%)
          </div>
        </div>

        {/* TOP THROTTLE TEAM */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              TOP THROTTLE TEAM
            </span>
            <div className="mt-2 text-base font-bold text-neutral-900 dark:text-white truncate">
              Marketing
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            520 Rate limit events
          </div>
        </div>

        {/* TOP THROTTLE MODEL */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              TOP THROTTLE MODEL
            </span>
            <div className="mt-2 text-base font-bold text-neutral-900 dark:text-white truncate">
              Claude Sonnet
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            480 Throttle events
          </div>
        </div>
      </div>
    </div>
  );
};
