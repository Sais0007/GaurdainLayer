import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

interface DashboardGlobalHeaderProps {
  orgName?: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const DashboardGlobalHeader: React.FC<DashboardGlobalHeaderProps> = ({
  orgName = "Acme Health",
  isRefreshing,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Organization Dashboard
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            {orgName}
          </span>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
          Real-time gateway usage, cost analytics, reliability, and AI capacity insights
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 px-3 text-xs bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-2xs font-medium cursor-pointer"
        >
          <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5 text-neutral-500", isRefreshing && "animate-spin text-primary-600")} />
          <span>{isRefreshing ? "Refreshing..." : "Refreshed just now"}</span>
        </Button>
      </div>
    </div>
  );
};
