import React from "react";
import { createPortal } from "react-dom";

export interface TeamDetailData {
  team: string;
  spend: number;
  cap: number;
  percent: number;
  requests: number;
  tokens: string;
  avgCost: number;
  topModel: string;
}

interface TeamBudgetTooltipProps {
  data: TeamDetailData;
  targetRect: DOMRect | null;
}

export const TeamBudgetTooltip: React.FC<TeamBudgetTooltipProps> = ({
  data,
  targetRect,
}) => {
  if (!targetRect || typeof document === "undefined") return null;

  const remaining = data.cap - data.spend;
  const TOOLTIP_WIDTH = 270;
  const TOOLTIP_HEIGHT = 200;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let top = targetRect.top + 4;
  if (top + TOOLTIP_HEIGHT > viewportHeight - 10) {
    top = Math.max(10, targetRect.bottom - TOOLTIP_HEIGHT - 4);
  }

  let left = targetRect.right - 250;
  if (left + TOOLTIP_WIDTH > viewportWidth - 10) {
    left = viewportWidth - TOOLTIP_WIDTH - 15;
  }
  if (left < 10) {
    left = 10;
  }

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 999999,
      }}
      className="!bg-[#1C1F2E] text-white p-4 rounded-[14px] shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-neutral-700/90 text-xs space-y-2 w-68 pointer-events-none select-none animate-fadeIn"
    >
      <div className="font-bold border-b border-neutral-700/80 pb-2 flex justify-between items-center text-emerald-400 font-sans text-sm">
        <span className="text-white truncate">{data.team}</span>
        <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/80">
          {data.percent}% Utilized
        </span>
      </div>

      <div className="space-y-1.5 font-mono text-[11px] pt-1">
        <div className="flex justify-between items-center">
          <span className="text-neutral-400">Current Spend:</span>
          <span className="font-bold text-white">${data.spend.toLocaleString()} USD</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-neutral-400">Allocated Budget:</span>
          <span className="text-neutral-300">${data.cap.toLocaleString()} USD</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-neutral-400">Remaining Budget:</span>
          <span className={`font-bold ${remaining > 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {remaining > 0 ? `$${remaining.toLocaleString()} USD` : "$0 USD"}
          </span>
        </div>

        <div className="pt-1.5 border-t border-neutral-700/60 flex justify-between items-center">
          <span className="text-neutral-400">Total Requests:</span>
          <span className="text-neutral-200 font-bold">{data.requests.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-neutral-400">Total Tokens:</span>
          <span className="text-violet-400 font-bold">{data.tokens}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-neutral-400">Average Cost:</span>
          <span className="text-neutral-200">${data.avgCost.toFixed(3)}/req</span>
        </div>
        <div className="pt-1.5 border-t border-neutral-700/60 flex justify-between items-center text-[10px]">
          <span className="text-neutral-400">Primary AI Model:</span>
          <span className="text-sky-400 font-bold">{data.topModel}</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
