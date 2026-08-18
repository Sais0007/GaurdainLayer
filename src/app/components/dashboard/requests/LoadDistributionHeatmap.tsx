import React, { useState } from "react";
import { Grid, Clock } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i}h`);

export const LoadDistributionHeatmap: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: string; reqs: number; status: string } | null>(null);

  const getHeatmapBg = (dIdx: number, hIdx: number) => {
    // Failure spike highlight box on 14h (2pm) Mon/Tue
    if ((dIdx === 0 || dIdx === 1) && hIdx === 14) {
      return "bg-rose-600 dark:bg-rose-500 text-white font-bold animate-pulse";
    }
    // High load business hours 9h - 17h
    if (hIdx >= 9 && hIdx <= 17) {
      if (hIdx >= 11 && hIdx <= 15) return "bg-primary-600 dark:bg-primary-500";
      return "bg-primary-500/80 dark:bg-primary-600/80";
    }
    if (hIdx >= 7 && hIdx <= 20) {
      return "bg-primary-300/60 dark:bg-primary-900/60";
    }
    return "bg-primary-100/40 dark:bg-primary-950/40";
  };

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
              <Grid className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Load Distribution Heatmap (Day × Hour)
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Identifies peak load windows and recurring failure spikes
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 self-start sm:self-auto">
          <span>Low</span>
          <div className="flex gap-1">
            <span className="w-3.5 h-3.5 rounded-xs bg-primary-100/40 dark:bg-primary-950/40" />
            <span className="w-3.5 h-3.5 rounded-xs bg-primary-300/60 dark:bg-primary-900/60" />
            <span className="w-3.5 h-3.5 rounded-xs bg-primary-500/80 dark:bg-primary-600/80" />
            <span className="w-3.5 h-3.5 rounded-xs bg-primary-600 dark:bg-primary-500" />
            <span className="w-3.5 h-3.5 rounded-xs bg-rose-600" />
          </div>
          <span>Failure Spike</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] space-y-1.5 pt-2">
          {/* Hours Header */}
          <div className="grid grid-cols-25 gap-1 text-[9px] font-mono text-neutral-400 text-center">
            <span className="text-left font-bold text-neutral-500">Day</span>
            {HOURS.map((h, i) => (
              <span key={i} className={i >= 9 && i <= 17 ? "text-primary-600 dark:text-primary-400 font-bold" : ""}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {DAYS.map((day, dIdx) => (
            <div key={day} className="grid grid-cols-25 gap-1 items-center text-xs">
              <span className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] w-8">
                {day}
              </span>
              {Array.from({ length: 24 }).map((_, hIdx) => {
                const isSpike = (dIdx === 0 || dIdx === 1) && hIdx === 14;
                const reqs = isSpike ? 8420 : Math.floor(1200 + (hIdx * 240) % 5000);
                return (
                  <div
                    key={hIdx}
                    onMouseEnter={() =>
                      setHoveredCell({
                        day,
                        hour: `${hIdx}:00`,
                        reqs,
                        status: isSpike ? "Critical Load Spike (429 Rate Limit)" : "Normal Load",
                      })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`h-6 rounded-xs transition-all duration-150 cursor-pointer ${getHeatmapBg(dIdx, hIdx)} hover:scale-110 hover:z-20`}
                    title={`${day} ${hIdx}:00 - ${reqs.toLocaleString()} reqs`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Hover Details Card */}
        {hoveredCell && (
          <div className="mt-3 p-3 bg-neutral-900/95 text-white rounded-xl shadow-xl text-xs flex items-center justify-between font-mono border border-neutral-800 animate-fadeIn">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{hoveredCell.day} at {hoveredCell.hour}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Requests: <strong className="text-white">{hoveredCell.reqs.toLocaleString()}</strong></span>
              <span>Status: <strong className={hoveredCell.status.includes("Critical") ? "text-rose-400" : "text-emerald-400"}>{hoveredCell.status}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
