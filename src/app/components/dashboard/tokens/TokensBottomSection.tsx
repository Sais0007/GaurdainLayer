import React, { useState } from "react";
import { Gauge, Users, Sparkles, User, Key, CheckCircle, ArrowRight, Zap } from "lucide-react";

export const TokensBottomSection: React.FC = () => {
  const [selectedUserModal, setSelectedUserModal] = useState<string | null>(null);

  const topConsumers = [
    { rank: 1, user: "Dr. Sarah Chen", team: "Research", key: "research-analysis-key", tokens: "2.76B", percent: 17.8, color: "bg-purple-600" },
    { rank: 2, user: "Alex Rivera", team: "Support", key: "support-prod-key", tokens: "2.30B", percent: 14.8, color: "bg-sky-600" },
    { rank: 3, user: "Marcus Vance", team: "Research", key: "research-analysis-key", tokens: "1.90B", percent: 12.2, color: "bg-indigo-600" },
    { rank: 4, user: "Emily Watson", team: "Clinical Ops", key: "clinical-ops-key", tokens: "1.50B", percent: 9.7, color: "bg-emerald-600" },
    { rank: 5, user: "John Doe", team: "Product", key: "product-key", tokens: "1.15B", percent: 7.4, color: "bg-amber-600" },
  ];

  const aiRecommendations = [
    { title: "Enable Prompt Caching for Anthropic", detail: "Repeated context detected (2.8M tokens)", savings: "$840/mo", priority: "High Priority", action: "Enable" },
    { title: "Reduce System Prompt Header", detail: "4.2k tokens redundant system instructions", savings: "$320/mo", priority: "Medium Priority", action: "Compress" },
    { title: "Switch Low-Priority Traffic to GPT-4o Mini", detail: "Background jobs using Claude 3.5", savings: "$550/mo", priority: "Medium Priority", action: "Route" },
    { title: "Remove Unused Prompt Context", detail: "Stale document embeddings attached", savings: "$210/mo", priority: "Low Priority", action: "Clean" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Card 1: Token Efficiency */}
      <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 min-h-[380px]">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Gauge className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Token Efficiency
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Score: 94.2/100
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-850 space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Avg Tokens / Req
              </span>
              <span className="text-base font-bold font-mono text-neutral-900 dark:text-white">
                89.8K
              </span>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-850 space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Avg Prompt Size
              </span>
              <span className="text-base font-bold font-mono text-sky-600 dark:text-sky-400">
                59.1K
              </span>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-850 space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Avg Comp Size
              </span>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                30.7K
              </span>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-850 space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Cost / 1M Tokens
              </span>
              <span className="text-base font-bold font-mono text-purple-600 dark:text-purple-400">
                $4.12
              </span>
            </div>
          </div>

          {/* Efficiency Gauge Banner */}
          <div className="mt-3 p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200 block">
                Efficiency Gauge: Grade A+
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                Optimal prompt context & response compression ratio
              </span>
            </div>
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
          <span>Evaluated continuously against model benchmarks</span>
          <span className="text-emerald-600 font-semibold">99.4% Health Score</span>
        </div>
      </div>

      {/* Card 2: Largest Token Consumers */}
      <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 min-h-[380px]">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Users className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Largest Token Consumers
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-neutral-400">Top 5</span>
          </div>

          {/* Ranked List */}
          <div className="space-y-2.5 pt-3">
            {topConsumers.map((c) => (
              <div
                key={c.user}
                onClick={() => setSelectedUserModal(c.user)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-[10px]">
                    #{c.rank}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-neutral-900 dark:text-white text-xs block group-hover:text-purple-600 transition-colors">
                      {c.user}
                    </span>
                    <span className="text-[10px] text-neutral-400 block font-mono">
                      {c.team} · {c.key}
                    </span>
                  </div>
                </div>
                <div className="text-right font-mono text-xs shrink-0">
                  <span className="font-bold text-neutral-900 dark:text-white block">{c.tokens}</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">{c.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
          <span>Click any consumer for detailed analytics</span>
          <span className="text-purple-600 font-semibold">5 Active Drivers</span>
        </div>
      </div>

      {/* Card 3: AI Optimization Recommendations */}
      <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-250 min-h-[380px]">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
                AI Optimization
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Est: $1,920/mo
            </span>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            {aiRecommendations.map((rec, i) => (
              <div
                key={i}
                className="p-2 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-100 dark:border-neutral-850 flex items-center justify-between gap-2"
              >
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block text-[11px]">{rec.title}</span>
                  <span className="text-[10px] text-neutral-400 block">{rec.detail}</span>
                  <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Est. Savings: {rec.savings}
                  </span>
                </div>
                <button
                  onClick={() => alert(`Applying AI Recommendation: ${rec.title}`)}
                  className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-semibold shrink-0 cursor-pointer transition-colors"
                >
                  {rec.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium flex items-center justify-between">
          <span>AI recommendations evaluated continuously</span>
          <span className="text-purple-600 font-semibold">4 Active Rules</span>
        </div>
      </div>

      {/* User Analytics Modal */}
      {selectedUserModal && (
        <div
          onClick={() => setSelectedUserModal(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl animate-fadeIn font-sans"
          >
            <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">{selectedUserModal}</h3>
                <p className="text-xs text-neutral-400">Detailed Consumer Analytics Profile</p>
              </div>
              <button
                onClick={() => setSelectedUserModal(null)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Tokens:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">2.76B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Contribution Share:</span>
                <span className="font-bold text-emerald-600">17.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Primary Model:</span>
                <span className="font-bold text-sky-400">Claude Sonnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Monthly Cost:</span>
                <span className="font-bold text-amber-400">$11,860 USD</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedUserModal(null)}
              className="w-full h-9 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
