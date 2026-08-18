import React from "react";
import { 
  LayoutDashboard, 
  DollarSign, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Gauge 
} from "lucide-react";
import { DashboardTabType } from "./dashboardData";
import { cn } from "../ui/utils";

interface DashboardTabsBarProps {
  activeTab: DashboardTabType;
  onTabChange: (tab: DashboardTabType) => void;
}

export const DashboardTabsBar: React.FC<DashboardTabsBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { type: DashboardTabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: "Overview", label: "Overview", icon: LayoutDashboard },
    { type: "Spend & Budget", label: "Spend & Budget", icon: DollarSign },
    { type: "Requests", label: "Requests", icon: Activity },
    { type: "Tokens", label: "Tokens", icon: Cpu },
    { type: "Reliability", label: "Reliability", icon: ShieldCheck },
    { type: "Capacity", label: "Capacity", icon: Gauge },
  ];

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto custom-scrollbar no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.type;
          return (
            <button
              key={tab.type}
              onClick={() => onTabChange(tab.type)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0",
                isActive
                  ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-bold bg-primary-50/50 dark:bg-primary-950/30 rounded-t-lg"
                  : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 rounded-t-lg"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-primary-600 dark:text-primary-400" : "text-neutral-400")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
