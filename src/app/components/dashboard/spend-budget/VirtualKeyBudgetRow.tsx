import React, { useState, useRef } from "react";
import { VirtualKeyProgressBar } from "./VirtualKeyProgressBar";
import { VirtualKeyUtilizationBadge } from "./VirtualKeyUtilizationBadge";
import { VirtualKeyStatusChip } from "./VirtualKeyStatusChip";
import { VirtualKeyAnalyticsTooltip, VirtualKeyDetailData } from "./VirtualKeyAnalyticsTooltip";

interface VirtualKeyBudgetRowProps {
  data: VirtualKeyDetailData;
  onClickKey?: (alias: string) => void;
}

export const VirtualKeyBudgetRow: React.FC<VirtualKeyBudgetRowProps> = ({ data, onClickKey }) => {
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

  const handleClick = () => {
    if (onClickKey) {
      onClickKey(data.keyAlias);
    } else {
      alert(`Navigating to Virtual Key Details: ${data.keyAlias}`);
    }
  };

  return (
    <div
      ref={rowRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="space-y-1.5 p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850/80 hover:border-primary-200 dark:hover:border-primary-800/60 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/60 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group relative"
    >
      {/* Top Alias, Status Chip & Spend Values Row */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 truncate max-w-[55%]">
          <span className="font-mono font-bold text-neutral-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {data.keyAlias}
          </span>
          <VirtualKeyStatusChip status={data.status} />
        </div>

        <div className="flex items-center gap-2.5 font-mono shrink-0">
          <span className="text-neutral-600 dark:text-neutral-400 text-[11px]">
            ${data.spend.toLocaleString()} / ${data.cap.toLocaleString()}
          </span>
          <VirtualKeyUtilizationBadge percent={data.percent} />
        </div>
      </div>

      {/* Metadata Subtitle */}
      <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium truncate">
        {data.assignedTeam} · Assigned to: <span className="text-neutral-600 dark:text-neutral-300">{data.assignedUser}</span>
      </div>

      {/* Thick Animated Progress Bar */}
      <VirtualKeyProgressBar percent={data.percent} />

      {/* Floating Detailed Hover Tooltip rendered via Portal */}
      {isHovered && targetRect && (
        <VirtualKeyAnalyticsTooltip data={data} targetRect={targetRect} />
      )}
    </div>
  );
};
