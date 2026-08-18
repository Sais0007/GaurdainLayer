import React, { useState } from "react";
import { Grid, Clock, Sparkles } from "lucide-react";
import { generateHeatmapData, HeatmapCell } from "./dashboardData";

export const HourlySpendGridHeatmap: React.FC = () => {
  const [heatmapMatrix] = useState<HeatmapCell[][]>(generateHeatmapData);
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const hours = Array.from({ length: 24 }).map((_, i) => `${i}h`);

  const getIntensityClass = (intensity: HeatmapCell["intensity"]) => {
    switch (intensity) {
      case "very-high":
        return "bg-indigo-600 dark:bg-indigo-500 text-white font-bold shadow-xs";
      case "high":
        return "bg-indigo-400 dark:bg-indigo-600 text-white font-medium";
      case "medium":
        return "bg-indigo-200 dark:bg-indigo-900/60 text-indigo-950 dark:text-indigo-200 font-medium";
      case "low":
        return "bg-indigo-50 dark:bg-indigo-950/30 text-neutral-600 dark:text-neutral-400";
      case "none":
      default:
        return "bg-neutral-100/70 dark:bg-neutral-800/40 text-neutral-400";
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200">
      {/* Header & Scale Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Hourly Spend Grid & Contribution Graph
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            24-hour breakdown by date showing spend intensity and peak activity windows
          </p>
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-medium self-start sm:self-auto">
          <span>Spend Level:</span>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" title="None" />
            <span className="w-3.5 h-3.5 rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800" title="Low" />
            <span className="w-3.5 h-3.5 rounded bg-indigo-200 dark:bg-indigo-900/60" title="Medium" />
            <span className="w-3.5 h-3.5 rounded bg-indigo-400 dark:bg-indigo-600" title="High" />
            <span className="w-3.5 h-3.5 rounded bg-indigo-600 dark:bg-indigo-500" title="Very High" />
          </div>
          <span className="font-bold text-neutral-700 dark:text-neutral-300">+High</span>
        </div>
      </div>

      {/* Heatmap Grid Visualization */}
      <div className="overflow-x-auto custom-scrollbar relative">
        <div className="min-w-[700px] space-y-1">
          {/* Hours Header Row */}
          <div className="grid grid-cols-25 gap-1 text-[10px] font-mono text-neutral-400 font-bold text-center pb-1 border-b border-neutral-100 dark:border-neutral-800">
            <div className="text-left font-sans text-neutral-500">Date</div>
            {hours.map((h) => (
              <div key={h}>{h}</div>
            ))}
          </div>

          {/* 7 Day Rows */}
          {heatmapMatrix.map((row) => {
            const dayLabel = row[0].day;
            return (
              <div key={dayLabel} className="grid grid-cols-25 gap-1 items-center">
                <div className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 font-mono">
                  {dayLabel}
                </div>
                {row.map((cell) => (
                  <div
                    key={`${cell.day}-${cell.hour}`}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`h-7 rounded flex items-center justify-center text-[9px] font-mono transition-transform hover:scale-110 hover:border-2 hover:border-indigo-400 dark:hover:border-indigo-300 cursor-pointer ${getIntensityClass(
                      cell.intensity
                    )}`}
                  >
                    {cell.spend > 100 ? `$${Math.round(cell.spend)}` : ""}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Hover Floating Tooltip */}
        {hoveredCell && (
          <div className="mt-3 p-3 bg-[#1C1F2E] text-white rounded-xl text-xs space-y-1.5 font-mono inline-block shadow-2xl border border-neutral-700/80 animate-fadeIn z-[9999]">
            <div className="font-bold text-indigo-400 border-b border-neutral-700 pb-1">
              {hoveredCell.day} at {hoveredCell.hour}:00
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-neutral-400">Spend:</span>
              <span className="font-bold text-emerald-400">${hoveredCell.spend.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-neutral-400">Requests:</span>
              <span className="font-bold text-white">{hoveredCell.requests.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-neutral-400">Tokens:</span>
              <span className="font-bold text-purple-300">{hoveredCell.tokensFormatted}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Insight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-300 transition-colors">
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-neutral-500 tracking-tight block">Peak Hour Window</span>
            <span className="font-bold text-neutral-900 dark:text-white font-mono">14:00 - 15:00 <span className="text-neutral-400 text-[10px]">($142.50 avg spend)</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-300 transition-colors">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-neutral-500 tracking-tight block">Business Hours Average</span>
            <span className="font-bold text-neutral-900 dark:text-white font-mono">$46.40 / hour <span className="text-neutral-400 text-[10px]">(09:00 - 17:00)</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 transition-colors">
          <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-neutral-500 tracking-tight block">Quiet Window Spend</span>
            <span className="font-bold text-neutral-900 dark:text-white font-mono">$3.20 / hour <span className="text-neutral-400 text-[10px]">(01:00 - 06:00)</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
