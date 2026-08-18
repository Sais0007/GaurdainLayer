import React from "react";
import { Filter } from "lucide-react";

export interface CapacityFilterState {
  limitType: string;
  team: string;
  user: string;
  virtualKey: string;
  provider: string;
  model: string;
}

interface CapacityFiltersProps {
  filterState: CapacityFilterState;
  onFilterChange: (updates: Partial<CapacityFilterState>) => void;
}

export const CapacityFilters: React.FC<CapacityFiltersProps> = ({
  filterState,
  onFilterChange,
}) => {
  return (
    <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
          <Filter className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider">
          Capacity & Throughput Filters
        </h3>
      </div>

      {/* Filters Grid (6 Dropdowns) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* LIMIT TYPE */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            LIMIT TYPE
          </label>
          <select
            value={filterState.limitType}
            onChange={(e) => onFilterChange({ limitType: e.target.value })}
            className="w-full h-8 px-2.5 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="All Limits (RPM & TPM)">All Limits (RPM & TPM)</option>
            <option value="RPM Only">RPM Only</option>
            <option value="TPM Only">TPM Only</option>
          </select>
        </div>

        {/* TEAM */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            TEAM
          </label>
          <select
            value={filterState.team}
            onChange={(e) => onFilterChange({ team: e.target.value })}
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="All Teams">All Teams</option>
            <option value="Support">Support</option>
            <option value="Research">Research</option>
            <option value="Clinical Operations">Clinical Operations</option>
            <option value="Marketing">Marketing</option>
            <option value="Product">Product</option>
          </select>
        </div>

        {/* USER */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            USER
          </label>
          <select
            value={filterState.user}
            onChange={(e) => onFilterChange({ user: e.target.value })}
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="All Users">All Users</option>
            <option value="Dr. Sarah Chen">Dr. Sarah Chen</option>
            <option value="Alex Rivera">Alex Rivera</option>
            <option value="Marcus Vance">Marcus Vance</option>
            <option value="Emily Watson">Emily Watson</option>
            <option value="John Doe">John Doe</option>
          </select>
        </div>

        {/* VIRTUAL KEY */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            VIRTUAL KEY
          </label>
          <select
            value={filterState.virtualKey}
            onChange={(e) => onFilterChange({ virtualKey: e.target.value })}
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="All Virtual Keys">All Virtual Keys</option>
            <option value="marketing-prod-key">marketing-prod-key</option>
            <option value="research-analysis-key">research-analysis-key</option>
            <option value="support-prod-key">support-prod-key</option>
            <option value="clinical-ops-key">clinical-ops-key</option>
            <option value="product-assistant-key">product-assistant-key</option>
          </select>
        </div>

        {/* PROVIDER */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            PROVIDER
          </label>
          <select
            value={filterState.provider}
            onChange={(e) => onFilterChange({ provider: e.target.value })}
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="All Providers">All Providers</option>
            <option value="Anthropic">Anthropic</option>
            <option value="OpenAI">OpenAI</option>
            <option value="Google">Google</option>
            <option value="Meta">Meta</option>
          </select>
        </div>

        {/* MODEL */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            MODEL
          </label>
          <select
            value={filterState.model}
            onChange={(e) => onFilterChange({ model: e.target.value })}
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="All Models">All Models</option>
            <option value="Claude Sonnet">Claude Sonnet</option>
            <option value="GPT-4.1">GPT-4.1</option>
            <option value="GPT-5">GPT-5</option>
            <option value="Gemini Pro">Gemini Pro</option>
            <option value="Llama 3.1">Llama 3.1</option>
          </select>
        </div>
      </div>
    </div>
  );
};
