import React from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus 
} from "lucide-react";
import { cn } from "../../ui/utils";

export type TrendType = "positive" | "negative" | "warning" | "neutral" | "purple" | "blue";
export type VisualizationType = 
  | "sparkline" 
  | "budget_ceiling" 
  | "reverse_blocks" 
  | "segmented_bar" 
  | "forecast_line" 
  | "histogram" 
  | "token_split" 
  | "horizontal_bar" 
  | "key_progress" 
  | "model_sparkline";

export interface SpendBudgetKPICardProps {
  id: string;
  title: string;
  subtitle?: string;
  value: string;
  trend?: {
    text: string;
    type: TrendType;
    icon?: "up" | "down" | "flat";
  };
  supportingText: string;
  icon: React.ElementType;
  visualizationType: VisualizationType;
  accentColor?: string;
}

export const SpendBudgetKPICard: React.FC<SpendBudgetKPICardProps> = ({
  title,
  subtitle,
  value,
  trend,
  supportingText,
  icon: IconComponent,
  visualizationType,
}) => {
  // Uniform pill badge styles matching the design system
  const getBadgeClasses = (type: TrendType) => {
    switch (type) {
      case "positive":
        return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80";
      case "negative":
        return "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/80";
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80";
      case "purple":
        return "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/80";
      case "blue":
        return "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/80";
      case "neutral":
      default:
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700";
    }
  };

  // Render clean, aligned mini visualizations for each KPI type
  const renderVisualization = () => {
    switch (visualizationType) {
      case "sparkline":
        return (
          <div className="h-8 w-full flex items-end pt-1">
            <svg className="w-full h-7 overflow-visible opacity-90" viewBox="0 0 120 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="spendSparkGradFix" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 20 Q 20 24, 40 14 T 80 10 T 120 3 L 120 28 L 0 28 Z"
                fill="url(#spendSparkGradFix)"
              />
              <path
                d="M 0 20 Q 20 24, 40 14 T 80 10 T 120 3"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-300 group-hover:stroke-width-2.5"
              />
              <circle cx="120" cy="3" r="2.5" fill="#ef4444" />
            </svg>
          </div>
        );

      case "budget_ceiling":
        return (
          <div className="h-8 w-full flex flex-col justify-end space-y-1">
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>$0</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">$10,000 Cap</span>
            </div>
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden relative p-0.5 border border-neutral-200/50 dark:border-neutral-700/50">
              <div className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full rounded-full w-[78%] transition-all duration-500 group-hover:brightness-110" />
            </div>
          </div>
        );

      case "reverse_blocks":
        return (
          <div className="h-8 w-full flex flex-col justify-end space-y-1">
            <div className="flex items-center gap-1">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-3 rounded-xs transition-all duration-300 ${
                    idx < 3
                      ? "bg-emerald-500 dark:bg-emerald-400 opacity-90 group-hover:scale-y-110"
                      : "bg-neutral-100 dark:bg-neutral-800"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-neutral-400 font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">2.2 Blocks Available</span>
              <span>7.8 Used</span>
            </div>
          </div>
        );

      case "segmented_bar":
        return (
          <div className="h-8 w-full flex flex-col justify-end space-y-1">
            <div className="relative w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden flex gap-0.5 p-0.5">
              <div className="bg-amber-500 h-full rounded-full w-[78%] transition-all duration-500 group-hover:bg-amber-400" />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-neutral-900 dark:bg-white z-10"
                style={{ left: "70%" }}
                title="Expected 70% Run Rate"
              />
            </div>
            <div className="flex justify-between text-[9px] text-neutral-400 font-mono">
              <span>Actual: 78%</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">Target: 70%</span>
            </div>
          </div>
        );

      case "forecast_line":
        return (
          <div className="h-8 w-full flex items-end pt-1">
            <svg className="w-full h-7 overflow-visible opacity-90" viewBox="0 0 120 28" preserveAspectRatio="none">
              <path
                d="M 0 24 L 40 20 L 75 14"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 75 14 L 95 9 L 120 3"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="3 3"
                strokeLinecap="round"
                className="transition-all duration-300 group-hover:stroke-width-2.5"
              />
              <circle cx="120" cy="3" r="2.5" fill="#f59e0b" />
            </svg>
          </div>
        );

      case "histogram":
        return (
          <div className="h-8 w-full flex items-end justify-between gap-1 pt-1">
            {[45, 60, 50, 75, 80, 65, 90, 85, 95, 70].map((h, idx) => (
              <div
                key={idx}
                className="flex-1 bg-sky-100 dark:bg-sky-950/60 rounded-xs overflow-hidden h-5"
              >
                <div
                  className="bg-sky-600 dark:bg-sky-500 w-full rounded-xs transition-all duration-300 group-hover:bg-sky-400"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        );

      case "token_split":
        return (
          <div className="h-8 w-full flex flex-col justify-end space-y-1">
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden flex p-0.5 gap-0.5">
              <div className="bg-violet-600 h-full rounded-l-full w-[66%]" title="Input Tokens (66%)" />
              <div className="bg-purple-400 h-full rounded-r-full flex-1" title="Output Tokens (34%)" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-neutral-400">
              <span className="text-violet-600 dark:text-violet-400 font-bold">Input $0.00031</span>
              <span className="text-purple-500 font-bold">Output $0.00016</span>
            </div>
          </div>
        );

      case "horizontal_bar":
        return (
          <div className="h-8 w-full flex flex-col justify-end space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-neutral-700 dark:text-neutral-300">
              <span>Support Team</span>
              <span className="font-mono text-primary-600 dark:text-primary-400">$2,450.00</span>
            </div>
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div className="bg-primary-600 dark:bg-primary-500 h-full rounded-full w-[31.4%] transition-all duration-500 group-hover:w-[35%]" />
            </div>
          </div>
        );

      case "key_progress":
        return (
          <div className="h-8 w-full flex flex-col justify-end space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
              <span className="truncate max-w-[130px]">support-prod-key</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">23.7%</span>
            </div>
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full w-[23.7%] transition-all duration-500 group-hover:bg-indigo-400" />
            </div>
          </div>
        );

      case "model_sparkline":
        return (
          <div className="h-8 w-full flex items-end pt-1">
            <svg className="w-full h-7 overflow-visible opacity-90" viewBox="0 0 120 28" preserveAspectRatio="none">
              <path
                d="M 0 18 Q 30 8, 60 20 T 120 5"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-300 group-hover:stroke-width-2.5"
              />
              <circle cx="120" cy="5" r="2.5" fill="#a855f7" />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  // Determine if the metric value is a long string (like support-prod-key or Claude Sonnet) or a standard currency/percentage
  const isLongStringValue = value.length > 9 || value.includes("-") || value.includes(" ");

  return (
    <div className="p-3.5 sm:p-4 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[14px] shadow-2xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 cursor-pointer group relative overflow-hidden h-full min-h-[160px]">
      <div>
        {/* 1. Header Row (Icon + Title + Subtitle on Left, Status Badge on Right) */}
        <div className="flex items-start justify-between gap-1.5 min-h-[32px]">
          <div className="flex items-start gap-1.5 min-w-0 flex-1">
            <div className="p-1 rounded-md bg-neutral-100/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/60 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors shrink-0 mt-0.5">
              <IconComponent className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[11px] sm:text-[11.5px] font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight leading-snug group-hover:text-neutral-900 dark:group-hover:text-white transition-colors whitespace-normal break-words">
                {title}
              </h4>
              {subtitle && (
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-normal block leading-tight mt-0.5 truncate">
                  {subtitle}
                </span>
              )}
            </div>
          </div>

          {/* Status Badge Pill - Uniform smaller pill shape, proper padding & vertical alignment */}
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border shadow-2xs transition-all shrink-0 whitespace-nowrap self-start mt-0.5",
                getBadgeClasses(trend.type)
              )}
            >
              {trend.icon === "up" && <ArrowUpRight className="w-2.5 h-2.5" />}
              {trend.icon === "down" && <ArrowDownRight className="w-2.5 h-2.5" />}
              {trend.icon === "flat" && <Minus className="w-2.5 h-2.5" />}
              <span>{trend.text}</span>
            </span>
          )}
        </div>

        {/* 2. Primary KPI Value - Reduced font size by ~10-15%, bold, mono, truncate if long string */}
        <div className="mt-2.5">
          <div
            className={cn(
              "font-bold text-neutral-900 dark:text-white tracking-tight leading-none group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate",
              isLongStringValue ? "text-xs sm:text-sm font-semibold font-sans" : "text-lg sm:text-xl font-mono"
            )}
            title={value}
          >
            {value}
          </div>
        </div>

        {/* 3. Mini Visualization */}
        <div className="mt-2">
          {renderVisualization()}
        </div>
      </div>

      {/* 4. Footer Insight - Separated with whitespace, smaller typography */}
      <div className="mt-2.5 pt-1.5 border-t border-neutral-100 dark:border-neutral-800/80 text-[10.5px] text-neutral-400 dark:text-neutral-500 font-medium">
        <span className="truncate block group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
          {supportingText}
        </span>
      </div>
    </div>
  );
};
