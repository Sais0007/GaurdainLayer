import React from "react";
import { Filter, AlertTriangle } from "lucide-react";

export interface ReliabilityFilterState {
  errorCategory: string;
  team: string;
  user: string;
  virtualKey: string;
  provider: string;
  model: string;
}

interface ReliabilityFiltersProps {
  filterState: ReliabilityFilterState;
  onFilterChange: (updates: Partial<ReliabilityFilterState>) => void;
  onInspectTraces?: () => void;
}

export const ReliabilityFilters: React.FC<ReliabilityFiltersProps> = ({
  filterState,
  onFilterChange,
  onInspectTraces,
}) => {
  return (
    <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3">
      {/* Header with Title and Primary Danger Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider">
            Reliability & SLA Diagnostics Filters
          </h3>
        </div>

        {/* Top-Right Red Primary Danger Button */}
        <button
          onClick={onInspectTraces || (() => alert("Opening Incident Trace Logs Inspector..."))}
          className="h-8 px-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Inspect Incident Trace Logs</span>
        </button>
      </div>

      {/* Filters Grid (6 Dropdowns) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* ERROR CATEGORY */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
            ERROR CATEGORY
          </label>
          <select
            value={filterState.errorCategory}
            onChange={(e) => onFilterChange({ errorCategory: e.target.value })}
            className="w-full h-8 px-2.5 bg-rose-50/50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs font-bold text-rose-700 dark:text-rose-300 outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
          >
            <option value="All Error Categories">All Error Categories</option>
            <option value="Provider Down 503">Provider Down (503)</option>
            <option value="Request Timeout 504">Request Timeout (504)</option>
            <option value="RPM Limit Exceeded 429">RPM Limit Exceeded (429)</option>
            <option value="TPM Limit Exceeded 429">TPM Limit Exceeded (429)</option>
            <option value="Budget Exceeded 402">Budget Exceeded (402)</option>
            <option value="Authentication 401">Authentication / Model Error (401)</option>
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
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
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
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
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
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
          >
            <option value="All Virtual Keys">All Virtual Keys</option>
            <option value="support-prod-key">support-prod-key</option>
            <option value="clinical-ops-key">clinical-ops-key</option>
            <option value="research-key">research-key</option>
            <option value="marketing-key">marketing-key</option>
            <option value="product-key">product-key</option>
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
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
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
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
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
