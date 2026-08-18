import React from "react";
import { Filter, RotateCcw } from "lucide-react";

export interface SpendBudgetFilterState {
  budgetStatus: string;
  team: string;
  user: string;
  virtualKey: string;
  provider: string;
  model: string;
}

interface SpendBudgetFiltersProps {
  filterState: SpendBudgetFilterState;
  onFilterChange: (updates: Partial<SpendBudgetFilterState>) => void;
  onResetFilters: () => void;
}

export const SPEND_BUDGET_FILTER_OPTIONS = {
  budgetStatuses: ["All Statuses", "Healthy", "Near Limit", "Over Budget"],
  teams: ["All Teams", "Support", "Clinical Operations", "Research", "Marketing", "Product"],
  users: ["All Users", "Sarah Connor", "John Doe", "Alex Dev", "Michael Scott", "Emily Watson", "David Miller"],
  virtualKeys: ["All Virtual Keys", "support-prod-key", "marketing-prod-key", "research-analysis-key", "clinical ops key", "product-assistant-key"],
  providers: ["All Providers", "OpenAI", "Anthropic", "Google Gemini", "DeepSeek"],
  models: ["All Models", "Claude Sonnet", "GPT-4o", "Gemini Pro", "GPT-4o Mini"]
};

export const SpendBudgetFilters: React.FC<SpendBudgetFiltersProps> = ({
  filterState,
  onFilterChange,
  onResetFilters,
}) => {
  const isFiltered =
    filterState.budgetStatus !== "All Statuses" ||
    filterState.team !== "All Teams" ||
    filterState.user !== "All Users" ||
    filterState.virtualKey !== "All Virtual Keys" ||
    filterState.provider !== "All Providers" ||
    filterState.model !== "All Models";

  return (
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-3">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 tracking-wider">
          <Filter className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          Spend & Budget Analytics Filters
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

      {/* Filter Options Grid: Single row on desktop, wrapping on tablet, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
        {/* Budget Status Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-budget-status" className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tight">
            BUDGET STATUS
          </label>
          <select
            id="filter-budget-status"
            value={filterState.budgetStatus}
            onChange={(e) => onFilterChange({ budgetStatus: e.target.value })}
            className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {SPEND_BUDGET_FILTER_OPTIONS.budgetStatuses.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Team Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-sb-team" className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tight">
            TEAM
          </label>
          <select
            id="filter-sb-team"
            value={filterState.team}
            onChange={(e) => onFilterChange({ team: e.target.value })}
            className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {SPEND_BUDGET_FILTER_OPTIONS.teams.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* User Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-sb-user" className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tight">
            USER
          </label>
          <select
            id="filter-sb-user"
            value={filterState.user}
            onChange={(e) => onFilterChange({ user: e.target.value })}
            className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {SPEND_BUDGET_FILTER_OPTIONS.users.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        {/* Virtual Key Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-sb-virtual-key" className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tight">
            VIRTUAL KEY
          </label>
          <select
            id="filter-sb-virtual-key"
            value={filterState.virtualKey}
            onChange={(e) => onFilterChange({ virtualKey: e.target.value })}
            className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {SPEND_BUDGET_FILTER_OPTIONS.virtualKeys.map((vk) => (
              <option key={vk} value={vk}>{vk}</option>
            ))}
          </select>
        </div>

        {/* Provider Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-sb-provider" className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tight">
            PROVIDER
          </label>
          <select
            id="filter-sb-provider"
            value={filterState.provider}
            onChange={(e) => onFilterChange({ provider: e.target.value })}
            className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {SPEND_BUDGET_FILTER_OPTIONS.providers.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Model Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-sb-model" className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tight">
            MODEL
          </label>
          <select
            id="filter-sb-model"
            value={filterState.model}
            onChange={(e) => onFilterChange({ model: e.target.value })}
            className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {SPEND_BUDGET_FILTER_OPTIONS.models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
