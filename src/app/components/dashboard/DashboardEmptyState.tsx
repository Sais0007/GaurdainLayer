import React from "react";
import { Inbox, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";

interface DashboardEmptyStateProps {
  onResetFilters: () => void;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({ onResetFilters }) => {
  return (
    <div className="p-12 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center space-y-4 shadow-2xs">
      <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
        <Inbox className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
          No data available
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto font-medium">
          There is no gateway activity for the selected time period and filter parameters.
        </p>
      </div>
      <Button
        onClick={onResetFilters}
        size="sm"
        className="h-8 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold"
      >
        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
        Reset Filters
      </Button>
    </div>
  );
};
