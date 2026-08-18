import React from "react";
import { Sparkles, Cpu, Key, Wallet, ArrowRight, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";
import { Button } from "../../ui/button";
import { DashboardState } from "../../Dashboard";

interface CostOptimizationCardProps {
  state?: DashboardState;
  onRetry?: () => void;
}

export interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  estimatedSavings: string;
  confidenceScore: string;
  priority: "critical" | "high" | "medium" | "low";
  ctaText: string;
  icon: React.ElementType;
}

export const MOCK_RECOMMENDATIONS: OptimizationRecommendation[] = [
  {
    id: "opt-1",
    title: "Move GPT-4o requests to GPT-4o Mini",
    description: "34.2k low-complexity prompt requests identified using GPT-4o.",
    estimatedSavings: "$620 / month",
    confidenceScore: "High (94%)",
    priority: "critical",
    ctaText: "Optimize",
    icon: Cpu,
  },
  {
    id: "opt-2",
    title: "Unused Virtual Key Cleanup",
    description: "2 virtual keys with active caps have zero requests in last 14 days.",
    estimatedSavings: "$350 / month",
    confidenceScore: "High (98%)",
    priority: "high",
    ctaText: "Deactivate",
    icon: Key,
  },
  {
    id: "opt-3",
    title: "Idle Budget Cap Reallocation",
    description: "Product team holds $510 unused buffer while Support is near limit.",
    estimatedSavings: "$450 / month",
    confidenceScore: "Medium (85%)",
    priority: "medium",
    ctaText: "Reallocate",
    icon: Wallet,
  },
  {
    id: "opt-4",
    title: "Enable Prompt Caching for Anthropic",
    description: "Repetitive system prompts account for 2.8M input tokens.",
    estimatedSavings: "$840 / month",
    confidenceScore: "High (92%)",
    priority: "high",
    ctaText: "Enable Caching",
    icon: Sparkles,
  },
];

export const CostOptimizationCard: React.FC<CostOptimizationCardProps> = ({
  state = "normal",
  onRetry,
}) => {
  const getPriorityBadge = (priority: OptimizationRecommendation["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "high":
        return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "medium":
        return "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "low":
      default:
        return "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800";
    }
  };

  if (state === "loading") {
    return (
      <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-2 pt-1">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-16 w-full rounded-xl" />
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
          Unable to load cost optimization insights.
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

  if (state === "empty" || MOCK_RECOMMENDATIONS.length === 0) {
    return (
      <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center space-y-3 shadow-2xs">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto stroke-[1.5]" />
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
          Optimal Cost Efficiency Achieved.
        </h4>
        <p className="text-xs text-neutral-400 max-w-xs mx-auto">
          No new optimization recommendations at this time.
        </p>
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
              <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Cost Optimization Insights
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              Recommended actions to improve cost efficiency.
            </p>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Est. Savings: $2,260/mo
          </span>
        </div>

        {/* Insight Recommendation Cards List */}
        <div className="space-y-2.5 pt-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
          {MOCK_RECOMMENDATIONS.map((rec) => {
            const IconComp = rec.icon;
            return (
              <div
                key={rec.id}
                className="p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850 space-y-1.5 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all text-xs group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate font-bold text-neutral-900 dark:text-white">
                    <div className="p-1 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
                      <IconComp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="truncate">{rec.title}</span>
                  </div>

                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold capitalize border shrink-0 ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
                  {rec.description}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                      Savings: {rec.estimatedSavings}
                    </span>
                    <span className="text-neutral-400">· Score: {rec.confidenceScore}</span>
                  </div>

                  <button
                    onClick={() => alert(`Applying recommendation: ${rec.title}...`)}
                    className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    <span>{rec.ctaText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
        <span>AI intelligence engine recommendations</span>
        <button
          onClick={() => alert("Running deep cost optimization audit...")}
          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
        >
          Run Audit →
        </button>
      </div>
    </div>
  );
};
