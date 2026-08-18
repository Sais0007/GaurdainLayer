import React, { useState } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Layers,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  TrendingDown,
  RefreshCw,
  Clock,
  Eye,
  Sliders,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

export function SecurityMonitoringManagement() {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOwaspFilter, setSelectedOwaspFilter] = useState("All Nodes (10)");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Security telemetry & ASR logs refreshed");
    }, 600);
  };

  const owaspData = [
    { id: "LLM01", name: "Prompt Injection", features: ["Direct System Override Detection", "Jailbreak Pattern Matching"], status: "Protected", active: true },
    { id: "LLM02", name: "Sensitive Information Disclosure", features: ["Presidio PII Redaction", "Regex Masking Rules"], status: "Protected", active: true },
    { id: "LLM03", name: "Supply Chain Vulnerabilities", features: ["Model Integrity Verification"], status: "Protected", active: true },
    { id: "LLM04", name: "Data and Model Poisoning", features: ["Input Sanitation", "Training Data Filters"], status: "Protected", active: true },
    { id: "LLM05", name: "Improper Output Handling", features: ["Post-Call Schema Validation", "Output Sanitizer"], status: "Protected", active: true },
    { id: "LLM06", name: "Excessive Agency", features: ["Tool Call Authorization", "Permission Scoping"], status: "Protected", active: true },
    { id: "LLM07", name: "System Prompt Leakage", features: ["Pre-Call Canary Words", "Extraction Guards"], status: "Protected", active: true },
    { id: "LLM08", name: "Vector and Embedding Weaknesses", features: ["RAG Context Sanitization"], status: "Protected", active: true },
    { id: "LLM09", name: "Misinformation & Hallucination", features: ["Confidence Threshold Checking"], status: "Protected", active: true },
    { id: "LLM10", name: "Unbounded Consumption", features: ["Rate Limiting", "Max Token Budgeting"], status: "Protected", active: true },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#fafafa] dark:bg-neutral-950 min-h-screen">
      {/* Header Bar matching Screenshot 4 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              Security Monitoring
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#f3e8ff] dark:bg-purple-950/70 text-[#9333ea] dark:text-purple-300">
              ASR Tracking
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time monitoring inspired by a-scanner ASR tracking, with Guardian\x27s unique multi-layer defense
          </p>
        </div>

        {/* Live Feed & Range Selectors */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Feed</span>
          </div>

          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="Last 24 hours">Last 24 hours</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 90 days">Last 90 days</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white shadow-2xs transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics matching Screenshot 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#faf5ff] dark:bg-purple-950/60 text-[#9333ea] flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">TOTAL SCANS</div>
            <div className="text-xl font-extrabold text-neutral-900 dark:text-white mt-0.5">27,218</div>
            <div className="text-[11px] text-neutral-400">Analyzed requests</div>
          </div>
        </div>

        {/* Blocked */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#fef2f2] dark:bg-red-950/60 text-[#ef4444] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">BLOCKED</div>
            <div className="text-xl font-extrabold text-[#ef4444] mt-0.5">2,312</div>
            <div className="text-[11px] text-neutral-400">Threats neutralized</div>
          </div>
        </div>

        {/* Detection Rate */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] dark:bg-emerald-950/60 text-[#059669] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">DETECTION RATE</div>
            <div className="text-xl font-extrabold text-[#059669] mt-0.5">92.0%</div>
            <div className="text-[11px] text-neutral-400">Higher is better</div>
          </div>
        </div>

        {/* ASR */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#eff6ff] dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">ASR</div>
            <div className="text-xl font-extrabold text-[#2563eb] mt-0.5">8.0%</div>
            <div className="text-[11px] text-neutral-400">Attack Success Response</div>
          </div>
        </div>
      </div>

      {/* Multi-Layer Detection Pipeline matching Screenshot 4 */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Multi-Layer Detection Pipeline
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Guardian\x27s 4-layer defense — What makes it different from scan-only tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* L1 */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs space-y-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#faf5ff] text-[#9333ea]">
              L1: REGEX / PII FILTER LAYER
            </span>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">971</div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Instant pattern-matching for credentials, PII &amp; API keys
            </p>
          </div>

          {/* L2 */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs space-y-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#faf5ff] text-[#9333ea]">
              L2: KEYWORD &amp; SEMANTIC FILTER
            </span>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">647</div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Toxicity, hate-speech &amp; harmful topic classification
            </p>
          </div>

          {/* L3 */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs space-y-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#faf5ff] text-[#9333ea]">
              L3: LITELLM PRE/POST MODERATION
            </span>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">416</div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Upstream and downstream provider guardrails
            </p>
          </div>

          {/* L4 */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs space-y-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#faf5ff] text-[#9333ea]">
              L4: MULTI-LAYER LLM EVALUATOR
            </span>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">277</div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Deep context reasoning and prompt injection mitigation
            </p>
          </div>
        </div>
      </div>

      {/* ASR Trend Chart & Risk Distribution matching Screenshot 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ASR Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                ASR Trend (Attack Success Rate)
              </h3>
              <p className="text-[11px] text-neutral-400">
                Attack success rate tracking over time
              </p>
            </div>
            <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-[#faf5ff] text-[#9333ea]">
              Lower ASR = stronger defense
            </span>
          </div>

          <div className="h-52 w-full relative pt-2">
            <svg viewBox="0 0 700 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="asrGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 40, 80, 120, 160].map((y, i) => (
                <line key={i} x1="40" y1={y} x2="680" y2={y} stroke="#f3f4f6" strokeDasharray="3 3" />
              ))}

              {/* Y Labels */}
              <text x="5" y="165" fill="#9ca3af" fontSize="9">0.0%</text>
              <text x="5" y="125" fill="#9ca3af" fontSize="9">25.0%</text>
              <text x="5" y="85" fill="#9ca3af" fontSize="9">50.0%</text>
              <text x="5" y="45" fill="#9ca3af" fontSize="9">75.0%</text>
              <text x="5" y="10" fill="#9ca3af" fontSize="9">100.0%</text>

              {/* Area & Line */}
              <path
                d="M 50 145 Q 150 148, 250 152 T 450 156 T 650 158 L 650 160 L 50 160 Z"
                fill="url(#asrGradient)"
              />
              <path
                d="M 50 145 Q 150 148, 250 152 T 450 156 T 650 158"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
              />

              {/* Data Points */}
              {[
                { x: 50, y: 145 },
                { x: 150, y: 148 },
                { x: 250, y: 152 },
                { x: 350, y: 154 },
                { x: 450, y: 156 },
                { x: 550, y: 157 },
                { x: 650, y: 158 },
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#8b5cf6" className="cursor-pointer hover:r-5 transition-all" />
              ))}
            </svg>
            <div className="flex justify-between text-[10px] text-neutral-400 px-6 pt-1">
              <span>Day 1</span>
              <span>Day 5</span>
              <span>Day 10</span>
              <span>Day 15</span>
              <span>Day 20</span>
              <span>Day 25</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Risk Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
              Risk Distribution
            </h3>
            <p className="text-[11px] text-neutral-400">
              Threat categorization by severity level
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { label: "Critical", count: 185, color: "bg-red-500", pct: "15%" },
              { label: "High", count: 555, color: "bg-amber-500", pct: "45%" },
              { label: "Medium", count: "1,064", color: "bg-purple-600", pct: "85%" },
              { label: "Low", count: 509, color: "bg-emerald-500", pct: "40%" },
            ].map((r) => (
              <div key={r.label} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-neutral-700 dark:text-neutral-300">{r.label}</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{r.count}</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className={`h-full ${r.color} rounded-full`} style={{ width: r.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Response & Live Audits matching Screenshot 4 */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
              Incident Response &amp; Live Audits
            </h3>
            <p className="text-[11px] text-neutral-400">
              Track ongoing mitigations, investigate system alerts, and review real-time incident event streams.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Event Breakdown */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-neutral-800 dark:text-neutral-200">Event Breakdown</span>
              <span className="text-[11px] text-neutral-400">Total: 2,312 events</span>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-4 items-end h-40">
              {[
                { name: "Prompt Injection Neutralized", count: 809, h: "75%" },
                { name: "PII Leakage Blocked", count: 691, h: "60%" },
                { name: "Insecure Output Blocked", count: 462, h: "45%" },
                { name: "Harmful Content Rejected", count: 347, h: "35%" },
              ].map((ev) => (
                <div key={ev.name} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-bold font-mono">{ev.count}</span>
                  <div className="w-full bg-[#8b5cf6] rounded-t-md transition-all" style={{ height: ev.h }} />
                  <span className="text-[9px] text-neutral-500 text-center line-clamp-2 leading-tight">
                    {ev.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Distribution Donut */}
          <div className="lg:col-span-5 space-y-2 border-l border-neutral-100 dark:border-neutral-800 pl-6">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Severity Distribution</span>
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-amber-500"
                    strokeDasharray="10, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.8"
                  />
                  <path
                    className="text-red-500"
                    strokeDasharray="90, 100"
                    strokeDashoffset="-10"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.8"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-base font-extrabold text-neutral-900 dark:text-white leading-none">10</span>
                  <span className="text-[9px] text-neutral-400 uppercase tracking-wider">ALERTS</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] pt-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Critical (9)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>High (1)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stream matching Screenshot 4 */}
        <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="text-xs font-bold text-neutral-900 dark:text-white">Recent System Events</div>
          <div className="space-y-2">
            {[
              {
                title: "System prompt extraction override blocked on pre_call hook",
                event: "Event: Prompt Injection Attempt | Request ID: req_6f190a21d",
                time: "Just now",
                dot: "bg-amber-500",
              },
              {
                title: "Credit card and national identifier masked automatically",
                event: "Event: PII Exfiltration Prevented | Request ID: req_39ad59ec1",
                time: "3 mins ago",
                dot: "bg-red-500",
              },
              {
                title: "Harmful content classification matched category threshold",
                event: "Event: Content Policy Triggered | Request ID: req_b1991cf74",
                time: "12 mins ago",
                dot: "bg-amber-500",
              },
              {
                title: "High entropy token density observed in response buffer",
                event: "Event: Execution Anomaly Flagged | Request ID: req_e120400fa",
                time: "28 mins ago",
                dot: "bg-amber-500",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-neutral-50/60 dark:bg-neutral-800/40 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-start gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${item.dot} mt-1.5 shrink-0`} />
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">{item.title}</div>
                    <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{item.event}</div>
                  </div>
                </div>
                <span className="text-[11px] text-neutral-400 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OWASP Top 10 Scorecard matching Screenshot 4 */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
              OWASP LLM Top 10 Scorecard
            </h3>
            <p className="text-[11px] text-neutral-400">
              Protection status per threat category with Guardian\x27s unique features
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400">Filter:</span>
            <select
              value={selectedOwaspFilter}
              onChange={(e) => setSelectedOwaspFilter(e.target.value)}
              className="px-2.5 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg font-medium"
            >
              <option value="All Nodes (10)">All Nodes (10)</option>
              <option value="Protected">Protected</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {owaspData.map((node) => (
            <div
              key={node.id}
              className="p-3 bg-white dark:bg-neutral-800/70 border border-neutral-100 dark:border-neutral-800 rounded-xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 font-mono font-bold text-[10px] rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                  {node.id}
                </span>
                <span className="font-bold text-neutral-900 dark:text-white min-w-[200px]">
                  {node.name}
                </span>
                <div className="flex flex-wrap gap-1">
                  {node.features.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#faf5ff] text-[#9333ea] border border-[#f3e8ff]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                  ACTIVE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                  Protected
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
