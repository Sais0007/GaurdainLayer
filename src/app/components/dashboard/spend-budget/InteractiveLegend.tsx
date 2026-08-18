import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../ui/utils";

export interface LegendVisibilityState {
  actualSpend: boolean;
  forecastPace: boolean;
  budgetCeiling: boolean;
}

interface InteractiveLegendProps {
  visibility: LegendVisibilityState;
  onToggle: (key: keyof LegendVisibilityState) => void;
}

export const InteractiveLegend: React.FC<InteractiveLegendProps> = ({
  visibility,
  onToggle,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
      {/* 1. Actual Spend Toggle */}
      <button
        onClick={() => onToggle("actualSpend")}
        className={cn(
          "flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all cursor-pointer select-none",
          visibility.actualSpend
            ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 shadow-2xs font-bold"
            : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 opacity-60 hover:opacity-100"
        )}
      >
        <span className="w-3 h-3 rounded-xs bg-indigo-600 dark:bg-indigo-500 inline-block shrink-0" />
        <span>Actual Cumulative Spend</span>
        {visibility.actualSpend ? (
          <Eye className="w-3 h-3 text-indigo-600 dark:text-indigo-400 ml-1" />
        ) : (
          <EyeOff className="w-3 h-3 text-neutral-400 ml-1" />
        )}
      </button>

      {/* 2. Forecast Pace Toggle */}
      <button
        onClick={() => onToggle("forecastPace")}
        className={cn(
          "flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all cursor-pointer select-none",
          visibility.forecastPace
            ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 shadow-2xs font-bold"
            : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 opacity-60 hover:opacity-100"
        )}
      >
        <span className="w-3 h-0.5 bg-amber-500 border-t border-dashed border-amber-500 inline-block shrink-0" />
        <span>Forecast Pace</span>
        {visibility.forecastPace ? (
          <Eye className="w-3 h-3 text-amber-600 dark:text-amber-400 ml-1" />
        ) : (
          <EyeOff className="w-3 h-3 text-neutral-400 ml-1" />
        )}
      </button>

      {/* 3. Budget Ceiling Toggle */}
      <button
        onClick={() => onToggle("budgetCeiling")}
        className={cn(
          "flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all cursor-pointer select-none",
          visibility.budgetCeiling
            ? "bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 shadow-2xs font-bold"
            : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 opacity-60 hover:opacity-100"
        )}
      >
        <span className="w-3 h-0.5 bg-rose-500 inline-block shrink-0" />
        <span>Budget Ceiling ($10,000 Cap)</span>
        {visibility.budgetCeiling ? (
          <Eye className="w-3 h-3 text-rose-600 dark:text-rose-400 ml-1" />
        ) : (
          <EyeOff className="w-3 h-3 text-neutral-400 ml-1" />
        )}
      </button>
    </div>
  );
};
