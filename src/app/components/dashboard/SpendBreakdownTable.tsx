import React, { useState } from "react";
import { Layers, ArrowUpDown, ArrowRight } from "lucide-react";
import { ViewByOption, mockResourceAllocationData } from "./dashboardData";
import { AuditTraceInspectorModal } from "./AuditTraceInspectorModal";

export const SpendBreakdownTable: React.FC = () => {
  const [viewBy, setViewBy] = useState<ViewByOption>("Teams");
  const [selectedEntityForAudit, setSelectedEntityForAudit] = useState<{ name: string; type: string } | null>(null);

  const data = mockResourceAllocationData[viewBy] || [];
  const maxSpend = data.length > 0 ? Math.max(...data.map((d) => d.spend)) : 1;
  const totalCombinedSpend = data.reduce((acc, curr) => acc + curr.spend, 0);

  const viewByOptions: ViewByOption[] = ["Teams", "Users", "Virtual Keys", "Models", "Providers"];

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200">
      {/* Header & View By Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Spend Breakdown & Resource Allocation
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Sorted strictly from highest spend at top to lowest spend at bottom
          </p>
        </div>

        {/* View By Segmented Toggle */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-950 rounded-lg border border-neutral-200/80 dark:border-neutral-800 self-start sm:self-auto overflow-x-auto custom-scrollbar">
          <span className="text-[10px] font-bold text-neutral-400 tracking-wider px-2 shrink-0">View By:</span>
          {viewByOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setViewBy(opt)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                viewBy === opt
                  ? "bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-2xs font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Ranking Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] tracking-wider font-extrabold text-neutral-500 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-950/40">
              <th className="p-3">Rank</th>
              <th className="p-3">{viewBy.slice(0, -1)} Name</th>
              <th className="p-3">Context / Owner</th>
              <th className="p-3 flex items-center gap-1 font-bold text-neutral-900 dark:text-white">
                <span>Spend (USD)</span>
                <ArrowUpDown className="w-3 h-3 text-primary-600" />
              </th>
              <th className="p-3">Total Share</th>
              <th className="p-3 min-w-[120px]">Relative Spend Bar</th>
              <th className="p-3">Total Requests</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-medium text-neutral-800 dark:text-neutral-200">
            {data.map((item) => {
              const relativePercent = (item.spend / maxSpend) * 100;
              return (
                <tr key={item.id} className="hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer group">
                  <td className="p-3 font-mono font-bold text-neutral-400">#{item.rank}</td>
                  <td className="p-3 font-bold text-neutral-900 dark:text-white text-xs group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.name}</td>
                  <td className="p-3 text-neutral-500 dark:text-neutral-400 text-[11px]">{item.contextOwner}</td>
                  <td className="p-3 font-mono font-extrabold text-neutral-900 dark:text-white text-xs">
                    ${item.spend.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 font-mono text-primary-600 dark:text-primary-400 font-bold">
                    {item.totalSharePercent}%
                  </td>
                  <td className="p-3">
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary-600 dark:bg-primary-500 h-full rounded-full transition-all duration-300 group-hover:brightness-110"
                        style={{ width: `${relativePercent}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-3 font-mono text-neutral-700 dark:text-neutral-300">
                    {item.totalRequests.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedEntityForAudit({ name: item.name, type: viewBy.slice(0, -1) })}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer transition-colors group-hover:translate-x-0.5"
                    >
                      <span>Audit Traces</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 font-medium">
        <span>Showing all {data.length} entities in category</span>
        <span className="font-mono text-neutral-900 dark:text-white font-extrabold">
          Total Combined Spend: ${totalCombinedSpend.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Audit Trace Inspector Drawer */}
      {selectedEntityForAudit && (
        <AuditTraceInspectorModal
          isOpen={Boolean(selectedEntityForAudit)}
          onClose={() => setSelectedEntityForAudit(null)}
          entityName={selectedEntityForAudit.name}
          entityType={selectedEntityForAudit.type}
        />
      )}
    </div>
  );
};
