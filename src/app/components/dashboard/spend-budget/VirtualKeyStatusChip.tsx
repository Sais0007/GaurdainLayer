import React from "react";
import { cn } from "../../ui/utils";

export type VirtualKeyHealthStatus = "healthy" | "near_limit" | "critical" | "exceeded";

interface VirtualKeyStatusChipProps {
  status: VirtualKeyHealthStatus;
}

export const VirtualKeyStatusChip: React.FC<VirtualKeyStatusChipProps> = ({ status }) => {
  const getChipStyle = () => {
    switch (status) {
      case "exceeded":
        return "bg-rose-100 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700";
      case "critical":
        return "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "near_limit":
        return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "healthy":
      default:
        return "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "exceeded":
        return "Exceeded";
      case "critical":
        return "Critical";
      case "near_limit":
        return "Near Limit";
      case "healthy":
      default:
        return "Healthy";
    }
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-semibold border shadow-2xs transition-all shrink-0",
        getChipStyle()
      )}
    >
      {getLabel()}
    </span>
  );
};
