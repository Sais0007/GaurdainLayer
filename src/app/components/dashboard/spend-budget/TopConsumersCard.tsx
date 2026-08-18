import React, { useState, useMemo } from "react";
import { Users, Key, Box, Building2, TrendingUp, TrendingDown, ArrowRight, RotateCcw, Inbox, AlertCircle } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";
import { Button } from "../../ui/button";
import { DashboardState } from "../../Dashboard";

interface TopConsumersCardProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export interface ConsumerItem {
  rank: number;
  name: string;
  type: "Team" | "Virtual Key" | "Model" | "User" | "Provider";
  spend: number;
  requests: number;
  tokens: string;
  trend: string;
  trendType: "up" | "down" | "flat";
  sharePercent: number;
}

export const MOCK_TOP_10_CONSUMERS: ConsumerItem[] = [
  { rank: 1, name: "Support Team", type: "Team", spend: 2450, requests: 54200, tokens: "22.8M", trend: "↑ 14%", trendType: "up", sharePercent: 31.4 },
  { rank: 2, name: "support-prod-key", type: "Virtual Key", spend: 2150, requests: 48900, tokens: "28.4M", trend: "↑ 8%", trendType: "up", sharePercent: 27.5 },
  { rank: 3, name: "Clinical Operations", type: "Team", spend: 1920, requests: 42309, tokens: "18.2M", trend: "↑ 11%", trendType: "up", sharePercent: 24.6 },
  { rank: 4, name: "Research Team", type: "Team", spend: 1850, requests: 38640, tokens: "15.4M", trend: "→ 0%", trendType: "flat", sharePercent: 23.7 },
  { rank: 5, name: "Sarah Connor", type: "User", spend: 1450, requests: 31200, tokens: "14.2M", trend: "↑ 5%", trendType: "up", sharePercent: 18.5 },
  { rank: 6, name: "Marketing Team", type: "Team", spend: 1290, requests: 29409, tokens: "8.5M", trend: "↓ 3%", trendType: "down", sharePercent: 16.5 },
  { rank: 7, name: "marketing-prod-key", type: "Virtual Key", spend: 1120, requests: 26800, tokens: "12.2M", trend: "↑ 6%", trendType: "up", sharePercent: 14.3 },
  { rank: 8, name: "John Doe", type: "User", spend: 990, requests: 21100, tokens: "9.8M", trend: "→ 0%", trendType: "flat", sharePercent: 12.7 },
  { rank: 9, name: "DeepSeek R1", type: "Model", spend: 640, requests: 12900, tokens: "4.5M", trend: "↑ 22%", trendType: "up", sharePercent: 8.2 },
  { rank: 10, name: "Product Team", type: "Team", spend: 290, requests: 18082, tokens: "6.1M", trend: "↓ 8%", trendType: "down", sharePercent: 3.7 },
];

export const TopConsumersCard: React.FC<TopConsumersCardProps> = ({
  state = "normal",
  onRetry,
}) => {
  const [rankBy, setRankBy] = useState<"Spend" | "Requests" | "Tokens">("Spend");

  const sortedConsumers = useMemo(() => {
    const data = [...MOCK_TOP_10_CONSUMERS];
    if (rankBy === "Requests") {
      data.sort((a, b) => b.requests - a.requests);
    } else if (rankBy === "Tokens") {
      data.sort((a, b) => parseFloat(b.tokens) - parseFloat(a.tokens));
    } else {
      data.sort((a, b) => b.spend - a.spend);
    }
    return data.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [rankBy]);

  const getEntityIcon = (type: ConsumerItem["type"]) => {
    switch (type) {
      case "Virtual Key":
        return <Key className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case "Model":
        return <Box className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case "Provider":
        return <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
      case "Team":
      case "User":
      default:
        return <Users className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />;
    }
  };

  if (state === "loading") {
    return (
      <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <div className="space-y-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
        <div className="space-y-2 pt-1">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="p-2 bg-neutral-50 dark:bg-neutral-950 rounded-lg flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="p-8 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 rounded-xl text-center space-y-3">
        <AlertCircle className="w-9 h-9 text-rose-500 mx-auto" />
        <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
          Unable to load top budget consumers.
        </h4>
        {onRetry && (
          <Button size="sm" onClick={onRetry} className="h-8 px-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center space-y-3 shadow-2xs">
        <Inbox className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto stroke-[1.5]" />
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
          No consumer data available.
        </h4>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 min-h-[440px]">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Users className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Top Budget Consumers
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              Ranked organizational drivers by metric volume.
            </p>
          </div>

          {/* Rank By Dropdown */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Rank By:</span>
            <select
              value={rankBy}
              onChange={(e) => setRankBy(e.target.value as any)}
              className="h-7 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer"
            >
              <option value="Spend">Spend ($)</option>
              <option value="Requests">Requests</option>
              <option value="Tokens">Tokens</option>
            </select>
          </div>
        </div>

        {/* Top 10 Ranked List */}
        <div className="space-y-1.5 pt-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
          {sortedConsumers.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-2 rounded-lg bg-neutral-50/60 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all text-xs group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate min-w-0">
                <span className="text-[11px] font-mono font-bold text-neutral-400 shrink-0 w-5">
                  #{item.rank}
                </span>
                <div className="p-1 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
                  {getEntityIcon(item.type)}
                </div>
                <div className="truncate min-w-0">
                  <span className="font-bold text-neutral-900 dark:text-white truncate block group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">{item.type}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono">
                <div className="text-right">
                  <span className="font-bold text-neutral-900 dark:text-white block text-xs">
                    {rankBy === "Spend" ? `$${item.spend.toLocaleString()}` : rankBy === "Requests" ? `${item.requests.toLocaleString()} reqs` : item.tokens}
                  </span>
                  <span className="text-[9px] text-neutral-400">{item.sharePercent}% share</span>
                </div>

                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 ${
                    item.trendType === "up"
                      ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                      : item.trendType === "down"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                  }`}
                >
                  {item.trend}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Navigating to ${item.name} details...`);
                  }}
                  className="p-1 text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="View Details"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
        <span>Displaying Top 10 organizational drivers</span>
        <span>Ranked by {rankBy}</span>
      </div>
    </div>
  );
};
