import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface DashboardErrorStateProps {
  onRetry: () => void;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="p-8 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl text-center space-y-3">
      <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
          Unable to load dashboard data
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
          Please check your network connection and try again.
        </p>
      </div>
      <Button
        onClick={onRetry}
        size="sm"
        className="h-8 px-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs"
      >
        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
        Retry
      </Button>
    </div>
  );
};
