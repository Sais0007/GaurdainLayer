import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { FILTER_OPTIONS, DashboardFilterState } from "./dashboardData";

interface DashboardFilterBarProps {
  filterState: DashboardFilterState;
  onFilterChange: (updates: Partial<DashboardFilterState>) => void;
  onResetFilters: () => void;
}

export const DashboardFilterBar: React.FC<DashboardFilterBarProps> = ({
  filterState,
  onFilterChange,
  onResetFilters,
}) => {
  const isFiltered = 
    filterState.team !== "All Teams" ||
    filterState.user !== "All Users" ||
    filterState.virtualKey !== "All Virtual Keys" ||
    filterState.provider !== "All Providers" ||
    filterState.model !== "All Models" ||
    filterState.outcome !== "All Outcomes";

  return (
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 tracking-wider">
          <Filter className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          Requests Analytics Filters
        </h3>
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Team Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-team" className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tight">
            Team
          </label>
          <select
            id="filter-team"
            value={filterState.team}
            onChange={(e) => onFilterChange({ team: e.target.value })}
            className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {FILTER_OPTIONS.teams.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* User Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-user" className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tight">
            User
          </label>
          <select
            id="filter-user"
            value={filterState.user}
            onChange={(e) => onFilterChange({ user: e.target.value })}
            className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {FILTER_OPTIONS.users.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        {/* Virtual Key Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-virtual-key" className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tight">
            Virtual Key
          </label>
          <select
            id="filter-virtual-key"
            value={filterState.virtualKey}
            onChange={(e) => onFilterChange({ virtualKey: e.target.value })}
            className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {FILTER_OPTIONS.virtualKeys.map((vk) => (
              <option key={vk} value={vk}>{vk}</option>
            ))}
          </select>
        </div>

        {/* Provider Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-provider" className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tight">
            Provider
          </label>
          <select
            id="filter-provider"
            value={filterState.provider}
            onChange={(e) => onFilterChange({ provider: e.target.value })}
            className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {FILTER_OPTIONS.providers.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Model Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-model" className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tight">
            Model
          </label>
          <select
            id="filter-model"
            value={filterState.model}
            onChange={(e) => onFilterChange({ model: e.target.value })}
            className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {FILTER_OPTIONS.models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Outcome Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-outcome" className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tight">
            Outcome
          </label>
          <select
            id="filter-outcome"
            value={filterState.outcome}
            onChange={(e) => onFilterChange({ outcome: e.target.value as DashboardFilterState['outcome'] })}
            className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {FILTER_OPTIONS.outcomes.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
