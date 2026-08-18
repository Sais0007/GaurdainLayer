import React, { useState } from "react";

export type TokensBreakdownDimension = "Team" | "User" | "Virtual Key" | "Model" | "Provider";

export interface TokenBreakdownRow {
  id: string;
  name: string;
  tokensText: string;
  percent: number;
  inputPercentOfRow: number;
  outputPercentOfRow: number;
}

export const MOCK_TOKENS_BREAKDOWN_ROWS: Record<TokensBreakdownDimension, TokenBreakdownRow[]> = {
  Team: [
    { id: "1", name: "Support", tokensText: "4.61B Tokens (29.7%)", percent: 29.7, inputPercentOfRow: 68, outputPercentOfRow: 32 },
    { id: "2", name: "Clinical Operations", tokensText: "3.58B Tokens (23.1%)", percent: 23.1, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "3", name: "Research", tokensText: "3.28B Tokens (21.1%)", percent: 21.1, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "4", name: "Marketing", tokensText: "2.50B Tokens (16.1%)", percent: 16.1, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "5", name: "Product", tokensText: "1.56B Tokens (10%)", percent: 10.0, inputPercentOfRow: 66, outputPercentOfRow: 34 },
  ],
  User: [
    { id: "u1", name: "Dr. Sarah Chen", tokensText: "2.76B Tokens (17.8%)", percent: 17.8, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "u2", name: "Alex Rivera", tokensText: "2.30B Tokens (14.8%)", percent: 14.8, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "u3", name: "Marcus Vance", tokensText: "1.90B Tokens (12.2%)", percent: 12.2, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "u4", name: "Emily Watson", tokensText: "1.50B Tokens (9.7%)", percent: 9.7, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "u5", name: "John Doe", tokensText: "1.15B Tokens (7.4%)", percent: 7.4, inputPercentOfRow: 66, outputPercentOfRow: 34 },
  ],
  "Virtual Key": [
    { id: "vk1", name: "research-analysis-key", tokensText: "3.80B Tokens (23.2%)", percent: 23.2, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "vk2", name: "support-prod-key", tokensText: "3.58B Tokens (23.1%)", percent: 23.1, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "vk3", name: "clinical-ops-key", tokensText: "2.90B Tokens (18.7%)", percent: 18.7, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "vk4", name: "marketing-key", tokensText: "2.10B Tokens (13.5%)", percent: 13.5, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "vk5", name: "product-key", tokensText: "1.50B Tokens (9.7%)", percent: 9.7, inputPercentOfRow: 66, outputPercentOfRow: 34 },
  ],
  Model: [
    { id: "m1", name: "Claude Sonnet", tokensText: "6.30B Tokens (38.4%)", percent: 38.4, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "m2", name: "GPT-4.1", tokensText: "4.15B Tokens (25.3%)", percent: 25.3, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "m3", name: "GPT-5", tokensText: "2.60B Tokens (15.8%)", percent: 15.8, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "m4", name: "Gemini Pro", tokensText: "1.75B Tokens (10.7%)", percent: 10.7, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "m5", name: "Llama 3.1", tokensText: "1.10B Tokens (6.7%)", percent: 6.7, inputPercentOfRow: 66, outputPercentOfRow: 34 },
  ],
  Provider: [
    { id: "p1", name: "Anthropic", tokensText: "5.81B Tokens (37.4%)", percent: 37.4, inputPercentOfRow: 68, outputPercentOfRow: 32 },
    { id: "p2", name: "OpenAI", tokensText: "7.08B Tokens (45.6%)", percent: 45.6, inputPercentOfRow: 67, outputPercentOfRow: 33 },
    { id: "p3", name: "Google", tokensText: "1.77B Tokens (11.4%)", percent: 11.4, inputPercentOfRow: 66, outputPercentOfRow: 34 },
    { id: "p4", name: "Meta", tokensText: "0.86B Tokens (5.6%)", percent: 5.6, inputPercentOfRow: 66, outputPercentOfRow: 34 },
  ],
};

export const TokensBreakdownTable: React.FC = () => {
  const [selectedDimension, setSelectedDimension] = useState<TokensBreakdownDimension>("Provider");
  const dimensions: TokensBreakdownDimension[] = ["Team", "User", "Virtual Key", "Model", "Provider"];

  const currentRows = MOCK_TOKENS_BREAKDOWN_ROWS[selectedDimension];

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
        <div>
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Token Consumption Breakdown
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Compare prompt context vs completion output across entities
          </p>
        </div>

        {/* View By Selector */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold self-start sm:self-auto">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider px-2">VIEW BY:</span>
          {dimensions.map((dim) => (
            <button
              key={dim}
              onClick={() => setSelectedDimension(dim)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                selectedDimension === dim
                  ? "bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              {dim}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-4 pt-2">
        {currentRows.map((row) => (
          <div key={row.id} className="space-y-1.5 group">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                {row.name}
              </span>
              <span className="font-mono text-neutral-800 dark:text-neutral-200">
                {row.tokensText}
              </span>
            </div>
            {/* Stacked Blue / Green Progress Bar on Light Grey Track */}
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden flex">
              <div
                className="h-full rounded-l-full bg-[#3b82f6] transition-all duration-500"
                style={{ width: `${(row.percent * row.inputPercentOfRow) / 100}%` }}
                title={`Input Tokens (${row.inputPercentOfRow}%)`}
              />
              <div
                className="h-full rounded-r-full bg-[#10b981] transition-all duration-500"
                style={{ width: `${(row.percent * row.outputPercentOfRow) / 100}%` }}
                title={`Output Tokens (${row.outputPercentOfRow}%)`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
