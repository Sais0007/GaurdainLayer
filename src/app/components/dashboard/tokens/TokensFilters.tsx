import React from "react";
import { RotateCcw, Cpu } from "lucide-react";

export interface TokensFilterState {
  tokenType: "All Tokens" | "Input Tokens" | "Output Tokens" | "Cached Tokens";
  team: string;
  user: string;
  virtualKey: string;
  provider: string;
  model: string;
}

interface TokensFiltersProps {
  filterState: TokensFilterState;
  onFilterChange: (updates: Partial<TokensFilterState>) => void;
  onResetFilters: () => void;
}

export const TokensFilters: React.FC<TokensFiltersProps> = ({
  filterState,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider">
            Tokens Analytics Filters
          </h3>
        </div>

        <button
          onClick={onResetFilters}
          className="self-end sm:self-auto text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Token Type Dropdown (FIRST) */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
            TOKEN TYPE
          </label>
          <select
            value={filterState.tokenType}
            onChange={(e) => onFilterChange({ tokenType: e.target.value as any })}
            className="w-full h-8 px-2.5 bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-lg text-xs font-bold text-sky-700 dark:text-sky-300 outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            <option value="All Tokens">All Tokens</option>
            <option value="Input Tokens">Input Tokens</option>
            <option value="Output Tokens">Output Tokens</option>
            <option value="Cached Tokens">Cached Tokens</option>
          </select>
        </div>

        {/* Team Dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            TEAM
          </label>
          <select
            value={filterState.team}
            onChange={(e) => onFilterChange({ team: e.target.value })}
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            <option value="All Teams">All Teams</option>
            <option value="Research">Research</option>
            <option value="Support">Support</option>
            <option value="Clinical Operations">Clinical Operations</option>
            <option value="Marketing">Marketing</option>
            <option value="Product">Product</option>
          </select>
        </div>

        {/* User Dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            USER
          </label>
          <select
            value={filterState.user}
            onChange={(e) => onFilterChange({ user: e.target.value })}
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            <option value="All Users">All Users</option>
            <option value="Dr. Sarah Chen">Dr. Sarah Chen</option>
            <option value="Alex Rivera">Alex Rivera</option>
            <option value="Marcus Vance">Marcus Vance</option>
            <option value="Emily Watson">Emily Watson</option>
            <option value="John Doe">John Doe</option>
          </select>
        </div>

        {/* Virtual Key Dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            VIRTUAL KEY
          </label>
          <select
            value={filterState.virtualKey}
            onChange={(e) => onFilterChange({ virtualKey: e.target.value })}
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            <option value="All Virtual Keys">All Virtual Keys</option>
            <option value="research-analysis-key">research-analysis-key</option>
            <option value="support-prod-key">support-prod-key</option>
            <option value="clinical-ops-key">clinical-ops-key</option>
            <option value="marketing-key">marketing-key</option>
            <option value="product-key">product-key</option>
          </select>
        </div>

        {/* Provider Dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            PROVIDER
          </label>
          <select
            value={filterState.provider}
            onChange={(e) => onFilterChange({ provider: e.target.value })}
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            <option value="All Providers">All Providers</option>
            <option value="Anthropic">Anthropic</option>
            <option value="OpenAI">OpenAI</option>
            <option value="Google">Google</option>
            <option value="Meta">Meta</option>
            <option value="DeepSeek">DeepSeek</option>
          </select>
        </div>

        {/* Model Dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            MODEL
          </label>
          <select
            value={filterState.model}
            onChange={(e) => onFilterChange({ model: e.target.value })}
            className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
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
