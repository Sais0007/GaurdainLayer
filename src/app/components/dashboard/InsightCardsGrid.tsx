import React, { useState } from "react";
import { 
  Activity, 
  Cpu, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Gauge, 
  ArrowRight, 
  AlertTriangle, 
  Key, 
  Box, 
  CheckCircle2 
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { 
  mockRequestVolumeData, 
  mockTokenConsumptionData, 
  DashboardTabType 
} from "./dashboardData";

interface InsightCardsGridProps {
  onNavigateTab: (tab: DashboardTabType) => void;
}

export const InsightCardsGrid: React.FC<InsightCardsGridProps> = ({ onNavigateTab }) => {
  const [topContributorMetric, setTopContributorMetric] = useState<"Spend" | "Requests" | "Tokens" | "Failed Requests">("Spend");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. Request Volume Card */}
      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 group">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white tracking-wider">
                Request Volume
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab("Requests")}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
            >
              <span>View Requests</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Request trajectory trend
          </p>
        </div>

        {/* Mini Area Chart */}
        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockRequestVolumeData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="reqVolGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                wrapperStyle={{ zIndex: 9999 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="!bg-[#1C1F2E] text-white p-2.5 rounded-lg shadow-xl text-[10px] font-mono border border-neutral-700/80 z-[9999] pointer-events-none">
                        <div>{label}</div>
                        <div className="font-bold text-sky-400">{payload[0].value?.toLocaleString()} reqs</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="requests" stroke="#0284c7" strokeWidth={2.5} fill="url(#reqVolGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between font-medium">
          <span>Top Model: <strong className="text-neutral-800 dark:text-neutral-200">Claude Sonnet</strong></span>
          <span>Top Team: <strong className="text-neutral-800 dark:text-neutral-200">Support</strong></span>
        </div>
      </div>

      {/* 2. Token Consumption Card */}
      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 group">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-violet-500" />
              <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white tracking-wider">
                Token Consumption
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab("Tokens")}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
            >
              <span>View Tokens</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Input vs Output token split
          </p>
        </div>

        {/* Stacked Bar Chart */}
        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockTokenConsumptionData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                wrapperStyle={{ zIndex: 9999 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="!bg-[#1C1F2E] text-white p-2.5 rounded-lg shadow-xl text-[10px] font-mono border border-neutral-700/80 space-y-0.5 z-[9999] pointer-events-none">
                        <div className="font-bold text-violet-300">{label}</div>
                        <div>Input: {payload[0]?.value}B</div>
                        <div>Output: {payload[1]?.value}B</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="inputTokens" stackId="a" fill="#7c3aed" radius={[0, 0, 2, 2]} />
              <Bar dataKey="outputTokens" stackId="a" fill="#c084fc" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between font-medium">
          <span>Ratio: <strong className="text-neutral-800 dark:text-neutral-200 font-mono">1.93 : 1</strong></span>
          <span>Avg/Req: <strong className="text-neutral-800 dark:text-neutral-200 font-mono">89.8k</strong></span>
        </div>
      </div>

      {/* 3. Request Reliability Card */}
      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 group">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white tracking-wider">
                Request Reliability
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab("Reliability")}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
            >
              <span>View Reliability</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            SLA baseline & error metrics
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">Success Rate:</span>
            <span className="font-extrabold text-emerald-600 font-mono">96.2% <span className="text-[10px] font-normal text-neutral-400">(Target: 98.0%)</span></span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">Failed Requests:</span>
            <span className="font-extrabold text-rose-600 font-mono">6,941 <span className="text-[10px] font-normal text-rose-500">(3.8% rate)</span></span>
          </div>

          {/* Incident Warning Box */}
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-[11px] text-rose-800 dark:text-rose-300 space-y-1">
            <div className="font-bold flex items-center gap-1 text-rose-900 dark:text-rose-200">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              Aug 4 Incident Window (2:00 PM - 3:30 PM)
            </div>
            <p className="text-[10px]">
              Failure Rate increased to 8.4%. Claude Sonnet accounted for 72% of errors.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 flex items-center justify-between font-medium">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3" /> Gateways Operational
          </span>
        </div>
      </div>

      {/* 4. Cost Efficiency Card */}
      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 group">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white tracking-wider">
                Cost Efficiency
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab("Spend & Budget")}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Unit economic ratios
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-950 group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800/60 transition-colors">
            <span className="text-neutral-600 dark:text-neutral-400">Avg Cost / Request:</span>
            <span className="font-mono font-extrabold text-neutral-900 dark:text-white">$0.042</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-950 group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800/60 transition-colors">
            <span className="text-neutral-600 dark:text-neutral-400">Cost / 1K Tokens:</span>
            <span className="font-mono font-extrabold text-neutral-900 dark:text-white">$0.0048</span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-neutral-500">Highest-Cost Model:</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">Claude Sonnet</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-500">Highest-Spend Team:</span>
            <span className="font-semibold text-primary-600 dark:text-primary-400">Support ($2,450)</span>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400 font-medium">
          Optimized across 5 connected providers
        </div>
      </div>

      {/* 5. Top Contributors Card */}
      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 group">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary-600" />
              <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white tracking-wider">
                Top Contributors
              </h4>
            </div>
            <select
              value={topContributorMetric}
              onChange={(e) => setTopContributorMetric(e.target.value as any)}
              className="h-6 px-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-[10px] font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer"
            >
              <option value="Spend">Spend ($)</option>
              <option value="Requests">Requests</option>
              <option value="Tokens">Tokens</option>
              <option value="Failed Requests">Failed Requests</option>
            </select>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Ranked organizational drivers
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 group-hover:bg-neutral-100/80 dark:group-hover:bg-neutral-800/60 transition-colors">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-primary-600" />
              <div>
                <span className="text-[10px] text-neutral-400 font-bold block">Top Team</span>
                <span className="font-bold text-neutral-900 dark:text-white">Support</span>
              </div>
            </div>
            <span className="font-mono font-extrabold text-primary-600 dark:text-primary-400">
              {topContributorMetric === "Spend" ? "$2,450.00" : "54,200 reqs"}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 group-hover:bg-neutral-100/80 dark:group-hover:bg-neutral-800/60 transition-colors">
            <div className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <div>
                <span className="text-[10px] text-neutral-400 font-bold block">Top Key</span>
                <span className="font-bold text-neutral-900 dark:text-white font-mono text-[11px]">support-prod-key</span>
              </div>
            </div>
            <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
              {topContributorMetric === "Spend" ? "$2,150.00" : "48,900 reqs"}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 group-hover:bg-neutral-100/80 dark:group-hover:bg-neutral-800/60 transition-colors">
            <div className="flex items-center gap-2">
              <Box className="w-3.5 h-3.5 text-purple-600" />
              <div>
                <span className="text-[10px] text-neutral-400 font-bold block">Top Model</span>
                <span className="font-bold text-neutral-900 dark:text-white">Claude Sonnet</span>
              </div>
            </div>
            <span className="font-mono font-extrabold text-purple-600 dark:text-purple-400">
              {topContributorMetric === "Spend" ? "$3,450.00" : "78,400 reqs"}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400 font-medium">
          Updated continuously from gateway logs
        </div>
      </div>

      {/* 6. Capacity & Rate Limits Card */}
      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-3 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 group">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-amber-500" />
              <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white tracking-wider">
                Capacity & Rate Limits
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab("Capacity")}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
            >
              <span>View Capacity</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            RPM / TPM throttle ceiling
          </p>
        </div>

        <div className="space-y-2.5 text-xs">
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium mb-1">
              <span className="text-neutral-600 dark:text-neutral-400">Peak RPM Utilization:</span>
              <span className="font-mono font-extrabold text-neutral-900 dark:text-white">84.0% <span className="text-neutral-400 text-[10px] font-normal">(420 / 500 RPM)</span></span>
            </div>
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full w-[84%] group-hover:brightness-110 transition-all" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-medium mb-1">
              <span className="text-neutral-600 dark:text-neutral-400">Peak TPM Utilization:</span>
              <span className="font-mono font-extrabold text-rose-600 dark:text-rose-400">92.5% <span className="text-neutral-400 text-[10px] font-normal">(1.85M / 2.0M TPM)</span></span>
            </div>
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full w-[92.5%] group-hover:brightness-110 transition-all" />
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] font-semibold">
            <span className="text-amber-600 dark:text-amber-400">Keys Near Limit: 2</span>
            <span className="text-rose-600 dark:text-rose-400">Key Throttle Events: 4</span>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400 font-medium">
          Auto-scaling enabled for OpenAI & Anthropic
        </div>
      </div>
    </div>
  );
};
