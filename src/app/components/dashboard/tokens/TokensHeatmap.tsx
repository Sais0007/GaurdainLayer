import React, { useState } from "react";
import { Grid, Clock } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

function getHeatmapIntensity(dayIndex: number, hour: number): number {
  if (dayIndex >= 5) {
    return Math.floor(((hour >= 10 && hour <= 18 ? 35 : 10) + ((dayIndex * hour) % 15)));
  }
  if (hour >= 9 && hour <= 17) {
    if (hour === 14) return 98; // Peak Hour
    if (hour === 15) return 88;
    if (hour === 11) return 82;
    return Math.floor(65 + ((dayIndex * hour) % 25));
  }
  if (hour >= 7 && hour <= 21) {
    return Math.floor(30 + ((dayIndex * hour) % 25));
  }
  return Math.floor(5 + ((dayIndex * hour) % 15));
}

export const TokensHeatmap: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: string; intensity: number; input: string; output: string; reqs: number; spend: string; avgResp: string } | null>(null);

  const getCellBg = (val: number) => {
    if (val >= 90) return "bg-purple-900 border-2 border-purple-400 dark:border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.6)] animate-pulse"; // Peak glowing
    if (val >= 75) return "bg-purple-700 dark:bg-purple-600";
    if (val >= 55) return "bg-indigo-600 dark:bg-indigo-500";
    if (val >= 35) return "bg-sky-500 dark:bg-sky-600";
    if (val >= 15) return "bg-sky-200 dark:bg-sky-950/80";
    return "bg-sky-50 dark:bg-neutral-900/60";
  };

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Grid className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Token Activity Heatmap
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Hourly token volume density across week days with business hour highlights
          </p>
        </div>

        {/* Gradient Legend */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 self-start sm:self-auto">
          <span>Light Blue</span>
          <div className="flex gap-1">
            <span className="w-3.5 h-3.5 rounded-xs bg-sky-50 dark:bg-neutral-900" />
            <span className="w-3.5 h-3.5 rounded-xs bg-sky-200 dark:bg-sky-950/80" />
            <span className="w-3.5 h-3.5 rounded-xs bg-sky-500 dark:bg-sky-600" />
            <span className="w-3.5 h-3.5 rounded-xs bg-indigo-600 dark:bg-indigo-500" />
            <span className="w-3.5 h-3.5 rounded-xs bg-purple-700 dark:bg-purple-600" />
            <span className="w-3.5 h-3.5 rounded-xs bg-purple-900 border border-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
          </div>
          <span>Dark Purple (Glow Peak)</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto relative">
        <div className="min-w-[700px] space-y-1.5 pt-2">
          {/* Hours Header */}
          <div className="grid grid-cols-25 gap-1 items-center text-[9px] font-mono text-neutral-400 text-center">
            <span className="text-left font-bold text-neutral-500">Day</span>
            {HOURS.map((h, i) => (
              <span key={i} className={i >= 9 && i <= 17 ? "text-purple-600 dark:text-purple-400 font-bold" : ""}>
                {i % 3 === 0 ? h : ""}
              </span>
            ))}
          </div>

          {/* Days Rows */}
          {DAYS.map((day, dIdx) => (
            <div key={day} className="grid grid-cols-25 gap-1 items-center text-xs">
              <span className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] w-8">
                {day}
              </span>
              {Array.from({ length: 24 }).map((_, hIdx) => {
                const intensity = getHeatmapIntensity(dIdx, hIdx);
                return (
                  <div
                    key={hIdx}
                    onMouseEnter={() =>
                      setHoveredCell({
                        day,
                        hour: HOURS[hIdx],
                        intensity,
                        input: `${(intensity * 8.2).toFixed(1)}M`,
                        output: `${(intensity * 4.1).toFixed(1)}M`,
                        reqs: Math.floor(intensity * 140),
                        spend: `$${(intensity * 0.052).toFixed(2)}`,
                        avgResp: `${(intensity * 3.4).toFixed(0)}ms`,
                      })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`h-7 rounded-xs transition-all duration-150 cursor-pointer ${getCellBg(intensity)} hover:scale-110 hover:z-20`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Hover Details Card */}
        {hoveredCell && (
          <div className="mt-3 p-3 bg-[#1C1F2E] text-white rounded-xl shadow-xl text-xs flex items-center justify-between font-mono border border-neutral-700/80 animate-fadeIn">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{hoveredCell.day} at {hoveredCell.hour}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Input: <strong className="text-sky-400">{hoveredCell.input}</strong></span>
              <span>Output: <strong className="text-emerald-400">{hoveredCell.output}</strong></span>
              <span>Requests: <strong className="text-white">{hoveredCell.reqs.toLocaleString()}</strong></span>
              <span>Spend: <strong className="text-amber-400">{hoveredCell.spend}</strong></span>
              <span>Avg Resp: <strong className="text-purple-300">{hoveredCell.avgResp}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
        <span>Business Hours Highlighted: <strong>09:00 AM – 05:00 PM</strong></span>
        <span className="text-purple-600 dark:text-purple-400 font-semibold">Peak Hour Glowing: Tuesday 02:00 PM</span>
      </div>
    </div>
  );
};
