import React, { useState } from "react";

export type RequestsBreakdownDimension = "Team" | "User" | "Virtual Key" | "Model" | "Provider";

export interface RequestBreakdownItem {
  id: string;
  name: string;
  count: number;
  percent: number;
}

export const MOCK_REQUEST_BREAKDOWN_DATA: Record<RequestsBreakdownDimension, RequestBreakdownItem[]> = {
  Team: [
    { id: "1", name: "Support", count: 54200, percent: 29.7 },
    { id: "2", name: "Clinical Operations", count: 42100, percent: 23.1 },
    { id: "3", name: "Research", count: 38600, percent: 21.1 },
    { id: "4", name: "Marketing", count: 29400, percent: 16.1 },
    { id: "5", name: "Product", count: 18340, percent: 10.0 },
  ],
  User: [
    { id: "u1", name: "Dr. Sarah Chen", count: 24800, percent: 13.6 },
    { id: "u2", name: "Alex Rivera", count: 21200, percent: 11.6 },
    { id: "u3", name: "Marcus Vance", count: 18900, percent: 10.3 },
    { id: "u4", name: "Emily Watson", count: 15400, percent: 8.4 },
    { id: "u5", name: "John Doe", count: 12100, percent: 6.6 },
  ],
  "Virtual Key": [
    { id: "vk1", name: "support-prod-key", count: 38200, percent: 20.9 },
    { id: "vk2", name: "clinical-ops-key", count: 31400, percent: 17.2 },
    { id: "vk3", name: "research-key", count: 26800, percent: 14.7 },
    { id: "vk4", name: "marketing-key", count: 21100, percent: 11.5 },
    { id: "vk5", name: "product-key", count: 14200, percent: 7.8 },
  ],
  Model: [
    { id: "m1", name: "Claude Sonnet", count: 68400, percent: 37.4 },
    { id: "m2", name: "GPT-4.1", count: 46200, percent: 25.3 },
    { id: "m3", name: "GPT-5", count: 28900, percent: 15.8 },
    { id: "m4", name: "Gemini Pro", count: 19500, percent: 10.7 },
    { id: "m5", name: "Llama 3.1", count: 12300, percent: 6.7 },
  ],
  Provider: [
    { id: "p1", name: "OpenAI", count: 83300, percent: 45.6 },
    { id: "p2", name: "Anthropic", count: 68400, percent: 37.4 },
    { id: "p3", name: "Google", count: 19500, percent: 10.7 },
    { id: "p4", name: "Meta", count: 12300, percent: 6.7 },
  ],
};

export const RequestVolumeBreakdown: React.FC = () => {
  const [selectedDimension, setSelectedDimension] = useState<RequestsBreakdownDimension>("Team");
  const dimensions: RequestsBreakdownDimension[] = ["Team", "User", "Virtual Key", "Model", "Provider"];

  const currentItems = MOCK_REQUEST_BREAKDOWN_DATA[selectedDimension];

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
        <div>
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Request Volume Breakdown
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Ranked contribution by selected entity dimension
          </p>
        </div>

        {/* View By Selector */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider px-2">VIEW BY:</span>
          {dimensions.map((dim) => (
            <button
              key={dim}
              onClick={() => setSelectedDimension(dim)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                selectedDimension === dim
                  ? "bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-2xs font-bold"
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
        {currentItems.map((item) => (
          <div key={item.id} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-neutral-900 dark:text-white">{item.name}</span>
              <span className="font-mono text-neutral-800 dark:text-neutral-200">
                {item.count.toLocaleString()} reqs ({item.percent}%)
              </span>
            </div>
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
