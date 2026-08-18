import React from "react";
import { Calendar, ArrowRightLeft, Clock } from "lucide-react";
import { TimePeriodOption, GranularityOption, DashboardFilterState } from "./dashboardData";

interface DashboardControlBarProps {
  filterState: DashboardFilterState;
  onFilterChange: (updates: Partial<DashboardFilterState>) => void;
}

export const DashboardControlBar: React.FC<DashboardControlBarProps> = ({
  filterState,
  onFilterChange,
}) => {
  const handleTimePeriodSelect = (period: TimePeriodOption) => {
    let defaultGranularity: GranularityOption = "Daily";
    if (period === "Today") defaultGranularity = "Hourly";
    else if (period === "Last 3 Months" || period === "Last 6 Months" || period === "Last 1 Year") defaultGranularity = "Weekly";

    onFilterChange({
      timePeriod: period,
      granularity: defaultGranularity,
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-50/80 dark:bg-neutral-900/60 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-xs">
      <div className="flex flex-wrap items-center gap-3">
        {/* Time Period Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="dashboard-time-period" className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            Time Period:
          </label>
          <select
            id="dashboard-time-period"
            value={filterState.timePeriod}
            onChange={(e) => handleTimePeriodSelect(e.target.value as TimePeriodOption)}
            className="h-8 px-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 shadow-2xs cursor-pointer"
          >
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Last 1 Month">Last 1 Month</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="Last 1 Year">Last 1 Year</option>
            <option value="Custom Date Range">Custom Date Range</option>
          </select>
        </div>

        {/* Selected Date Range Badge */}
        <div className="px-2.5 py-1 rounded-md bg-white dark:bg-neutral-950 border border-neutral-200/90 dark:border-neutral-800 font-mono text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
          Aug 4, 2026 - Aug 8, 2026
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Comparison Control */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200/90 dark:border-neutral-800 font-medium text-neutral-600 dark:text-neutral-400 text-[11px]">
          <ArrowRightLeft className="w-3 h-3 text-neutral-400 shrink-0" />
          <span>Comparison:</span>
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">vs Aug 3, 2026</span>
        </div>

        {/* Granularity Selector */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="dashboard-granularity" className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            Granularity:
          </label>
          <select
            id="dashboard-granularity"
            value={filterState.granularity}
            onChange={(e) => onFilterChange({ granularity: e.target.value as GranularityOption })}
            className="h-8 px-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 shadow-2xs cursor-pointer"
          >
            <option value="Hourly">Hourly</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
      </div>
    </div>
  );
};
