import React, { useState, useRef } from "react";
import { TeamBudgetProgressBar } from "./TeamBudgetProgressBar";
import { TeamBudgetBadge } from "./TeamBudgetBadge";
import { TeamBudgetTooltip, TeamDetailData } from "./TeamBudgetTooltip";

interface TeamBudgetRowProps {
  data: TeamDetailData;
}

export const TeamBudgetRow: React.FC<TeamBudgetRowProps> = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (rowRef.current) {
      setTargetRect(rowRef.current.getBoundingClientRect());
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="space-y-1.5 p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850/80 hover:border-primary-200 dark:hover:border-primary-800/60 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/60 transition-all duration-200 cursor-pointer group relative"
    >
      {/* Top Label & Values Row */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {data.team}
        </span>
        
        <div className="flex items-center gap-2.5 font-mono">
          <span className="text-neutral-600 dark:text-neutral-400 text-[11px]">
            ${data.spend.toLocaleString()} / ${data.cap.toLocaleString()} USD
          </span>
          <TeamBudgetBadge percent={data.percent} />
        </div>
      </div>

      {/* Thick Animated Progress Bar */}
      <TeamBudgetProgressBar percent={data.percent} />

      {/* Floating Detailed Hover Tooltip rendered via Portal */}
      {isHovered && targetRect && (
        <TeamBudgetTooltip data={data} targetRect={targetRect} />
      )}
    </div>
  );
};
