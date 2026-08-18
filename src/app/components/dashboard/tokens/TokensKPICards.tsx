import React from "react";
import { 
  Cpu, 
  ArrowUpRight, 
  Zap, 
  Sparkles, 
  PieChart, 
  Layers, 
  Users, 
  Key, 
  Box, 
  Activity,
  ArrowRightLeft
} from "lucide-react";
import { Skeleton } from "../../ui/skeleton";
import { DashboardState } from "../../Dashboard";

interface TokensKPICardsProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export const TokensKPICards: React.FC<TokensKPICardsProps> = ({ state = "normal" }) => {
  if (state === "loading") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[14px] space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[14px] space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ROW 1 (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: TOTAL TOKENS */}
        <div className="p-4.5 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                TOTAL TOKENS
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ArrowUpRight className="w-3 h-3" />
                <span>14.1% vs prev period</span>
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-neutral-900 dark:text-white tracking-tight">
              16.4B
            </div>
            {/* Stacked Blocks */}
            <div className="mt-2 h-3.5 w-full flex items-center gap-1">
              <div className="h-3 bg-sky-500 rounded-l-xs w-[65.8%]" title="Input Tokens (65.8%)" />
              <div className="h-3 bg-emerald-500 rounded-r-xs w-[34.2%]" title="Output Tokens (34.2%)" />
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 font-medium">
            Combined token volume
          </div>
        </div>

        {/* Card 2: INPUT TOKENS */}
        <div className="p-4.5 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                INPUT TOKENS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                65.8%
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-sky-600 dark:text-sky-400 tracking-tight">
              10.8B
            </div>
            <div className="mt-2 h-4 w-full flex items-end">
              <svg className="w-full h-4 opacity-90" viewBox="0 0 120 16" preserveAspectRatio="none">
                <path d="M 0 12 Q 30 6, 60 10 T 120 2" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 font-medium">
            65.8% of total volume
          </div>
        </div>

        {/* Card 3: OUTPUT TOKENS */}
        <div className="p-4.5 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                OUTPUT TOKENS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                34.2%
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
              5.6B
            </div>
            <div className="mt-2 h-4 w-full flex items-end">
              <svg className="w-full h-4 opacity-90" viewBox="0 0 120 16" preserveAspectRatio="none">
                <path d="M 0 14 Q 40 16, 80 6 T 120 2" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 font-medium">
            34.2% of total volume
          </div>
        </div>

        {/* Card 4: AVG TOKENS / REQUEST */}
        <div className="p-4.5 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              AVG TOKENS / REQUEST
            </span>
            <div className="mt-2 text-2xl font-bold font-mono text-neutral-900 dark:text-white tracking-tight">
              89,800
            </div>
            <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full w-[72%]" />
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 font-medium">
            Combined payload size
          </div>
        </div>

        {/* Card 5: IN/OUT TOKEN RATIO */}
        <div className="p-4.5 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                IN/OUT TOKEN RATIO
              </span>
              <span className="p-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <ArrowRightLeft className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 tracking-tight">
              1.93 : 1
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 font-medium">
            Prompt vs Completion
          </div>
        </div>
      </div>

      {/* ROW 2 (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 6: AVG INPUT / REQ */}
        <div className="p-4.5 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              AVG INPUT / REQ
            </span>
            <div className="mt-2 text-xl font-bold font-mono text-neutral-900 dark:text-white tracking-tight">
              59,100 <span className="text-xs text-neutral-400 font-normal">tokens</span>
            </div>
            <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full w-[66%]" />
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 font-medium">
            Prompt context size
          </div>
        </div>

        {/* Card 7: AVG OUTPUT / REQ */}
        <div className="p-4.5 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              AVG OUTPUT / REQ
            </span>
            <div className="mt-2 text-xl font-bold font-mono text-neutral-900 dark:text-white tracking-tight">
              30,700 <span className="text-xs text-neutral-400 font-normal">tokens</span>
            </div>
            <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-[34%]" />
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 font-medium">
            Generation response length
          </div>
        </div>

        {/* Card 8: TOP TOKEN TEAM */}
        <div className="p-4.5 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              TOP TOKEN TEAM
            </span>
            <div className="mt-2 text-lg font-bold text-neutral-900 dark:text-white truncate">
              Research
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 font-medium">
            4.20B Tokens (25.6%)
          </div>
        </div>

        {/* Card 9: TOP TOKEN KEY */}
        <div className="p-4.5 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              TOP TOKEN KEY
            </span>
            <div className="mt-2 text-sm font-bold font-mono text-neutral-900 dark:text-white truncate">
              research-analysis-key
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 font-medium">
            3.80B Tokens (23.2%)
          </div>
        </div>

        {/* Card 10: TOP TOKEN MODEL */}
        <div className="p-4.5 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              TOP TOKEN MODEL
            </span>
            <div className="mt-2 text-base font-bold text-neutral-900 dark:text-white truncate">
              Claude Sonnet
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 font-medium">
            6.30B Tokens (38.4%)
          </div>
        </div>
      </div>
    </div>
  );
};
