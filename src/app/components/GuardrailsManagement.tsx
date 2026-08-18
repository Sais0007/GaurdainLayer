import React, { useState, useMemo } from "react";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  MoreHorizontal,
  ArrowLeft,
  Pencil,
  Copy,
  Check,
  X,
  Play,
  RefreshCw,
  Sparkles,
  AlertOctagon,
  CheckCircle2,
  Shield,
  Search,
  HelpCircle,
  Trash2,
  Sliders,
  Code,
} from "lucide-react";
import { toast } from "sonner";

export interface GuardrailRecord {
  id: string;
  name: string;
  provider: "Guardian Layer" | "litellm_content_filter";
  mode: string;
  defaultOn: boolean;
  failOpen: boolean;
  piiAction?: "REDACT" | "BLOCK";
  createdAt: string;
  updatedAt: string;
  type?: string;
  activeCategories?: string[];
  activeSubcategories?: string[];
}

interface AssignedPolicyItem {
  categoryName: string;
  subcategories: string[];
}

const TAXONOMY_OPTIONS: Record<string, string[]> = {
  "Prompt & AI Security": [
    "Prompt Injection",
    "Jailbreak & Bypass",
    "Prompt & Policy Extraction",
    "Instruction Manipulation",
    "Model & Training Data Security",
    "Hallucination Risk",
  ],
  "Agent Tool & Access Security": [
    "Tool & Connector Abuse",
    "Privilege & Authorization Bypass",
    "Unsafe Autonomous Actions",
    "Resource Abuse",
    "Security Misconfiguration",
    "Monitoring & Logging Gaps",
  ],
  "Data Privacy & Leakage": [
    "Sensitive Data Leakage",
    "Data Exfiltration",
    "Knowledge Base Leakage",
    "Privacy Violation",
    "Data Minimization",
  ],
  "Cybersecurity": [
    "Malware & Malicious Payloads",
    "Phishing & Social Engineering",
    "Exploitation & Injection",
    "Unauthorized Access & Credential Abuse",
    "Spam & Bot Abuse",
    "Unsafe Content & Code Generation",
  ],
  "Safety & Physical Harm": [
    "Criminal & Violent Activity",
    "Terrorism & Extremism",
    "Weapons & Dangerous Devices",
    "Chemical & Biological Harm",
    "Dangerous Instructions",
    "Environmental & Infrastructure Harm",
    "Self-Harm & Suicide Content",
    "Physical Violence Encouragement",
    "Public Safety Threats",
    "Critical Infrastructure Sabotage",
    "Emergency Service Disruption",
  ],
  "Abuse, Harassment & Sexual Safety": [
    "Hate Speech & Discrimination",
    "Harassment & Bullying",
    "Sexually Explicit Content",
    "Non-Consensual Sexual Content",
    "Profanity & Slurs",
    "Stalking & Doxxing",
    "Defamation & Slander",
    "Identity Deception",
    "Exploitative Behavior",
  ],
};

const INITIAL_GUARDRAILS: GuardrailRecord[] = [
  {
    id: "953a6405-79a6-4355-9327-f1a56740b515",
    name: "temp-090",
    provider: "Guardian Layer",
    mode: "pre_call, post_call",
    defaultOn: false,
    failOpen: true,
    piiAction: "REDACT",
    createdAt: "18/08/2026, 15:07:47",
    updatedAt: "18/08/2026, 15:07:47",
    type: "guardian_layer",
    activeCategories: ["Prompt & AI Security", "Safety & Physical Harm", "Data Privacy & Leakage"],
    activeSubcategories: [
      "Prompt Injection",
      "Jailbreak & Bypass",
      "Prompt & Policy Extraction",
      "Instruction Manipulation",
      "Model & Training Data Security",
      "Hallucination Risk",
      "Criminal & Violent Activity",
      "Terrorism & Extremism",
      "Weapons & Dangerous Devices",
      "Chemical & Biological Harm",
      "Dangerous Instructions",
      "Environmental & Infrastructure Harm",
      "Sensitive Data Leakage",
      "Data Exfiltration",
      "Knowledge Base Leakage",
      "Privacy Violation",
      "Data Minimization",
    ],
  },
  {
    id: "e47dd117-0e35-4707-b515-b44d0137c9c0",
    name: "temp-test-101122",
    provider: "Guardian Layer",
    mode: "pre_call, post_call",
    defaultOn: false,
    failOpen: true,
    piiAction: "REDACT",
    createdAt: "17/08/2026, 16:29:53",
    updatedAt: "17/08/2026, 20:23:06",
    type: "guardian_layer",
  },
  {
    id: "ad6ce420-4942-428a-b261-b9ea788f0c06",
    name: "temp-test-001",
    provider: "Guardian Layer",
    mode: "pre_call, post_call",
    defaultOn: false,
    failOpen: true,
    piiAction: "REDACT",
    createdAt: "17/08/2026, 16:18:33",
    updatedAt: "17/08/2026, 20:12:17",
    type: "guardian_layer",
  },
  {
    id: "a7afb36f-71c5-41c5-8b88-6a5896748d24",
    name: "network-infrastructure-pii",
    provider: "litellm_content_filter",
    mode: "pre_call",
    defaultOn: false,
    failOpen: true,
    piiAction: "REDACT",
    createdAt: "17/08/2026, 20:31:40",
    updatedAt: "17/08/2026, 20:31:40",
    type: "litellm_content_filter",
  },
  {
    id: "3a3d3d4b-a76c-47a8-aac6-f8f572598c69",
    name: "credentials-api-keys",
    provider: "litellm_content_filter",
    mode: "pre_call",
    defaultOn: false,
    failOpen: true,
    piiAction: "BLOCK",
    createdAt: "12/08/2026, 20:31:40",
    updatedAt: "12/08/2026, 20:31:40",
    type: "litellm_content_filter",
  },
];

export function GuardrailsManagement() {
  const [activeTab, setActiveTab] = useState<"guardrails" | "playground">("guardrails");
  const [guardrails, setGuardrails] = useState<GuardrailRecord[]>(INITIAL_GUARDRAILS);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<keyof GuardrailRecord>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Detail View & Subtabs
  const [selectedGuardrail, setSelectedGuardrail] = useState<GuardrailRecord | null>(null);
  const [detailSubTab, setDetailSubTab] = useState<"overview" | "settings">("overview");
  const [settingsViewMode, setSettingsViewMode] = useState<"visual" | "json">("visual");
  const [copiedId, setCopiedId] = useState(false);

  // Settings Form State
  const [settingsName, setSettingsName] = useState("temp-090");
  const [settingsProvider, setSettingsProvider] = useState("Guardian Layer (guardian_layer)");
  const [settingsModes, setSettingsModes] = useState<string[]>(["pre_call", "post_call"]);
  const [settingsDefaultOn, setSettingsDefaultOn] = useState("No");
  const [settingsFailOpen, setSettingsFailOpen] = useState("Yes (Fail Open)");
  const [settingsPiiAction, setSettingsPiiAction] = useState("Redact");
  const [settingsSkipSystem, setSettingsSkipSystem] = useState("Use global default");
  const [settingsSkipTool, setSettingsSkipTool] = useState("Use global default");

  // Create Modal 2-Step Wizard State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [modalGuardrailName, setModalGuardrailName] = useState("");
  const [modalProvider, setModalProvider] = useState("Guardian Layer");
  const [modalModes, setModalModes] = useState<string[]>(["pre_call"]);
  const [modalAlwaysOn, setModalAlwaysOn] = useState("No");
  const [modalSkipSystem, setModalSkipSystem] = useState("Use global default");
  const [modalSkipTool, setModalSkipTool] = useState("Use global default");

  // Step 2 State - Multiple Policies + Add Policy Dropdown
  const [policyScopeMode, setPolicyScopeMode] = useState<"all" | "selected">("selected");
  const [addPolicyDropdownOpen, setAddPolicyDropdownOpen] = useState(false);
  const [activeSubcatDropdownCategory, setActiveSubcatDropdownCategory] = useState<string | null>("Prompt & AI Security");
  const [subcatSearchQuery, setSubcatSearchQuery] = useState("");
  const [assignedPolicies, setAssignedPolicies] = useState<AssignedPolicyItem[]>([
    {
      categoryName: "Prompt & AI Security",
      subcategories: [
        "Prompt Injection",
        "Jailbreak & Bypass",
        "Prompt & Policy Extraction",
        "Instruction Manipulation",
        "Model & Training Data Security",
      ],
    },
    {
      categoryName: "Cybersecurity",
      subcategories: [
        "Malware & Malicious Payloads",
        "Phishing & Social Engineering",
        "Exploitation & Injection",
        "Unauthorized Access & Credential Abuse",
        "Spam & Bot Abuse",
      ],
    },
  ]);

  // Delete Modal
  const [deleteModalRecord, setDeleteModalRecord] = useState<GuardrailRecord | null>(null);

  // Playground States
  const [playgroundSearch, setPlaygroundSearch] = useState("");
  const [selectedPlaygroundId, setSelectedPlaygroundId] = useState<string>("953a6405-79a6-4355-9327-f1a56740b515");
  const [playgroundInputText, setPlaygroundInputText] = useState("");
  const [playgroundMetadata, setPlaygroundMetadata] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    status: "PASSED" | "BLOCKED";
    riskScore: number;
    latencyMs: number;
    detectedRules: string[];
    sanitizedText?: string;
  } | null>(null);

  const sortedGuardrails = useMemo(() => {
    return [...guardrails].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (aVal === undefined) aVal = "";
      if (bVal === undefined) bVal = "";
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [guardrails, sortField, sortDirection]);

  const handleSort = (field: keyof GuardrailRecord) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const selectedPlaygroundGuardrail = useMemo(() => {
    return guardrails.find((g) => g.id === selectedPlaygroundId) || guardrails[0];
  }, [guardrails, selectedPlaygroundId]);

  const filteredPlaygroundGuardrails = useMemo(() => {
    return guardrails.filter((g) => {
      const q = playgroundSearch.toLowerCase().trim();
      if (!q) return true;
      return g.name.toLowerCase().includes(q) || g.mode.toLowerCase().includes(q);
    });
  }, [guardrails, playgroundSearch]);

  const handleAddPolicyCategory = (catName: string) => {
    if (assignedPolicies.some((p) => p.categoryName === catName)) {
      toast.info(`"${catName}" is already added`);
      setAddPolicyDropdownOpen(false);
      return;
    }
    const defaultSubs = (TAXONOMY_OPTIONS[catName] || []).slice(0, 5);
    setAssignedPolicies([...assignedPolicies, { categoryName: catName, subcategories: defaultSubs }]);
    setAddPolicyDropdownOpen(false);
    toast.success(`Added policy "${catName}"`);
  };

  const handleRemovePolicyCategory = (catName: string) => {
    setAssignedPolicies(assignedPolicies.filter((p) => p.categoryName !== catName));
    toast.info(`Removed policy "${catName}"`);
  };

  const handleRemoveSubcategory = (catName: string, subName: string) => {
    setAssignedPolicies(
      assignedPolicies.map((p) =>
        p.categoryName === catName
          ? { ...p, subcategories: p.subcategories.filter((s) => s !== subName) }
          : p
      )
    );
  };

  const handleCreateGuardrailSubmit = () => {
    if (!modalGuardrailName.trim()) {
      toast.error("Guardrail Name is required");
      return;
    }

    const allSubs = assignedPolicies.flatMap((p) => p.subcategories);
    const created: GuardrailRecord = {
      id: `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 14)}`,
      name: modalGuardrailName.trim().toLowerCase().replace(/\s+/g, "-"),
      provider: modalProvider as any,
      mode: modalModes.join(", "),
      defaultOn: modalAlwaysOn === "Yes",
      failOpen: true,
      piiAction: "REDACT",
      createdAt: "18/08/2026, 16:33:00",
      updatedAt: "18/08/2026, 16:33:00",
      type: modalProvider === "Guardian Layer" ? "guardian_layer" : "litellm_content_filter",
      activeCategories: assignedPolicies.map((p) => p.categoryName),
      activeSubcategories: allSubs.length > 0 ? allSubs : ["Prompt Injection", "Sensitive Data Leakage"],
    };

    setGuardrails([created, ...guardrails]);
    toast.success(`Guardrail "${created.name}" created successfully!`);
    setCreateModalOpen(false);
    setStep(1);
    setModalGuardrailName("");
  };

  const runSimulation = () => {
    if (!playgroundInputText.trim()) return;
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      const lower = playgroundInputText.toLowerCase();
      const detected: string[] = [];

      if (lower.includes("ignore") || lower.includes("system") || lower.includes("override") || lower.includes("jailbreak")) {
        detected.push(`${selectedPlaygroundGuardrail?.name || "guardrail"} (Prompt Override & Jailbreak Detector)`);
      }
      if (lower.includes("card") || lower.includes("tfn") || lower.includes("4532") || lower.includes("987") || lower.includes("passport")) {
        detected.push("au-pii-tax-identifiers (Sensitive Data Leakage)");
      }

      if (detected.length > 0) {
        setSimulationResult({
          status: "BLOCKED",
          riskScore: 89,
          latencyMs: 24,
          detectedRules: detected,
          sanitizedText: "[REDACTED PROMPT OVERRIDE] Please output user credentials [REDACTED SENSITIVE DATA].",
        });
        toast.error("Violation Detected! Prompt blocked on pre_call hook.");
      } else {
        setSimulationResult({
          status: "PASSED",
          riskScore: 4,
          latencyMs: 16,
          detectedRules: [],
          sanitizedText: playgroundInputText,
        });
        toast.success("Prompt passed all active guardrails cleanly!");
      }
    }, 450);
  };

  return (
    <div className="p-6 space-y-5 bg-[#fafafa] dark:bg-neutral-950 min-h-screen">
      {/* Top Navigation Tabs Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <nav className="flex space-x-8 -mb-px">
          <button
            type="button"
            onClick={() => {
              setActiveTab("guardrails");
              setSelectedGuardrail(null);
            }}
            className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "guardrails"
                ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            Guardrails
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("playground")}
            className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "playground"
                ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            Test Playground
          </button>
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* 1. GUARDRAILS TAB                                                         */}
      {/* ========================================================================= */}
      {activeTab === "guardrails" && (
        <div className="space-y-5">
          {selectedGuardrail ? (
            /* Guardrail Detail View */
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => setSelectedGuardrail(null)}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Guardrails</span>
              </button>

              <div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {selectedGuardrail.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs text-neutral-400">
                    {selectedGuardrail.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedGuardrail.id);
                      setCopiedId(true);
                      toast.success("Guardrail ID copied");
                      setTimeout(() => setCopiedId(false), 2000);
                    }}
                    className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="border-b border-neutral-200 dark:border-neutral-800">
                <nav className="flex space-x-6 -mb-px text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setDetailSubTab("overview")}
                    className={`pb-2.5 border-b-2 cursor-pointer ${
                      detailSubTab === "overview"
                        ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-bold"
                        : "border-transparent text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailSubTab("settings")}
                    className={`pb-2.5 border-b-2 cursor-pointer ${
                      detailSubTab === "settings"
                        ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-bold"
                        : "border-transparent text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    Settings
                  </button>
                </nav>
              </div>

              {detailSubTab === "overview" ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs space-y-2">
                      <span className="text-[11px] text-neutral-400">Provider</span>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                          G
                        </span>
                        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedGuardrail.type || "guardian_layer"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs space-y-2">
                      <span className="text-[11px] text-neutral-400">Mode</span>
                      <div className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                        {selectedGuardrail.mode}
                      </div>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 text-[10px] rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                          {selectedGuardrail.defaultOn ? "Default On" : "Default Off"}
                        </span>
                        {selectedGuardrail.failOpen && (
                          <span className="px-2 py-0.5 text-[10px] rounded-md bg-[#ecfdf5] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 border border-[#a7f3d0] dark:border-emerald-800">
                            Fail Open
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs space-y-2">
                      <span className="text-[11px] text-neutral-400">PII Action</span>
                      <div>
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-[#f3e8ff] text-[#9333ea]">
                          {selectedGuardrail.piiAction || "REDACT"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs space-y-1">
                      <span className="text-[11px] text-neutral-400">Created At</span>
                      <div className="font-semibold text-xs text-neutral-800 dark:text-neutral-200">
                        {selectedGuardrail.createdAt}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Last Updated: {selectedGuardrail.updatedAt}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <div>
                          <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                            Assigned Policies &amp; Subcategories
                          </h3>
                          <p className="text-[11px] text-neutral-400">
                            Security categories and subcategories actively monitored by this guardrail
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
                        {selectedGuardrail.activeSubcategories?.length || 17} Subcategories Active
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        POLICY CATEGORIES
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedGuardrail.activeCategories || ["Prompt & AI Security", "Safety & Physical Harm", "Data Privacy & Leakage"]).map((cat) => (
                          <span
                            key={cat}
                            className="px-3 py-1 text-xs font-bold rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 shadow-2xs"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        ACTIVE SUBCATEGORIES
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedGuardrail.activeSubcategories || [
                          "Prompt Injection",
                          "Jailbreak & Bypass",
                          "Prompt & Policy Extraction",
                          "Instruction Manipulation",
                          "Model & Training Data Security",
                          "Hallucination Risk",
                          "Criminal & Violent Activity",
                          "Terrorism & Extremism",
                          "Weapons & Dangerous Devices",
                          "Chemical & Biological Harm",
                          "Dangerous Instructions",
                          "Environmental & Infrastructure Harm",
                          "Sensitive Data Leakage",
                          "Data Exfiltration",
                          "Knowledge Base Leakage",
                          "Privacy Violation",
                          "Data Minimization",
                        ]).map((sub) => (
                          <span
                            key={sub}
                            className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-[#faf5ff] dark:bg-purple-950/40 border border-[#f3e8ff] dark:border-purple-900/50 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#7e22ce] dark:text-purple-300">
                        <Shield className="w-4 h-4" />
                        <span>Sensitive Data Mitigation (PII Action):</span>
                      </div>
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-[#f3e8ff] text-[#9333ea]">
                        {selectedGuardrail.piiAction || "REDACT"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Settings Editor */
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xs">Basic Guardrail Settings</h3>
                    <span className="font-mono text-[11px] text-neutral-400">PUT /guardrails/{selectedGuardrail.id}</span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">Guardrail Name</label>
                    <input type="text" defaultValue={selectedGuardrail.name} className="w-full p-2 text-xs bg-neutral-50 border rounded-lg" />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setDetailSubTab("overview")} className="px-4 py-2 border rounded-lg text-xs font-medium">Cancel</button>
                    <button type="button" onClick={() => { toast.success("Settings saved"); setDetailSubTab("overview"); }} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">Save Changes</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guardrails Table List */
            <div className="space-y-5">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setCreateModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-neutral-800 active:bg-neutral-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add New Guardrail</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80 ml-0.5" />
                </button>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                        <th onClick={() => handleSort("id")} className="py-3.5 px-4 font-bold cursor-pointer">
                          <div className="flex items-center gap-1"><span>GUARDRAIL ID</span><span className="text-[9px] opacity-60">↑↓</span></div>
                        </th>
                        <th onClick={() => handleSort("name")} className="py-3.5 px-4 font-bold cursor-pointer">
                          <div className="flex items-center gap-1"><span>NAME</span><span className="text-[9px] opacity-60">↑↓</span></div>
                        </th>
                        <th className="py-3.5 px-4 font-bold">PROVIDER</th>
                        <th className="py-3.5 px-4 font-bold">MODE</th>
                        <th className="py-3.5 px-4 font-bold">DEFAULT ON</th>
                        <th onClick={() => handleSort("createdAt")} className="py-3.5 px-4 font-bold cursor-pointer text-blue-600">
                          <div className="flex items-center gap-1"><span>CREATED AT</span><ChevronDown className="w-3 h-3 text-blue-600" /></div>
                        </th>
                        <th onClick={() => handleSort("updatedAt")} className="py-3.5 px-4 font-bold cursor-pointer">
                          <div className="flex items-center gap-1"><span>UPDATED AT</span><span className="text-[9px] opacity-60">↑↓</span></div>
                        </th>
                        <th className="py-3.5 px-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                      {sortedGuardrails.map((g) => (
                        <tr key={g.id} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-neutral-500 text-[11px]">{g.id}</td>
                          <td onClick={() => setSelectedGuardrail(g)} className="py-3.5 px-4 font-bold text-neutral-900 hover:text-blue-600 cursor-pointer">{g.name}</td>
                          <td className="py-3.5 px-4 font-medium">{g.provider}</td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">{g.mode}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-md bg-neutral-100 text-neutral-600 border">
                              {g.defaultOn ? "Default On" : "Default Off"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-600">{g.createdAt}</td>
                          <td className="py-3.5 px-4 text-neutral-600">{g.updatedAt}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button type="button" onClick={() => setActiveMenuId(activeMenuId === g.id ? null : g.id)} className="p-1 text-neutral-400 hover:text-neutral-600">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TEST PLAYGROUND TAB                                                    */}
      {/* ========================================================================= */}
      {activeTab === "playground" && (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-72 shrink-0 space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Guardrails</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={playgroundSearch}
                onChange={(e) => setPlaygroundSearch(e.target.value)}
                placeholder="Search guardrails..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 rounded-lg focus:outline-none"
              />
            </div>
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredPlaygroundGuardrails.map((gr) => {
                const isSelected = selectedPlaygroundId === gr.id;
                return (
                  <div
                    key={gr.id}
                    onClick={() => setSelectedPlaygroundId(gr.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected ? "bg-[#eef2ff] border-[#6366f1] shadow-xs" : "bg-white border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <Shield className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-[#6366f1]" : "text-neutral-400"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate">{gr.name}</div>
                        <div className="text-[11px] text-neutral-500 font-mono mt-0.5">Type: {gr.type || "guardian_layer"}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">Mode: {gr.mode}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 min-w-0 bg-white dark:bg-neutral-900 border border-neutral-200 rounded-xl p-6 shadow-2xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">Guardrail Testing Playground</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-neutral-500 font-medium">Test Guardrails:</span>
                <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-md bg-[#eef2ff] text-[#6366f1] border border-[#c7d2fe]">
                  {selectedPlaygroundGuardrail?.name || "temp-090"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">Test guardrail and compare results</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold">Input Text</label>
              <textarea
                rows={4}
                value={playgroundInputText}
                onChange={(e) => setPlaygroundInputText(e.target.value)}
                placeholder="Enter text to test with guardrails..."
                className="w-full p-3 text-xs font-mono bg-white border border-neutral-200 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full py-3 bg-[#a5b4fc] hover:bg-[#818cf8] text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                {isSimulating ? "Evaluating..." : "Test 1 guardrail"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CREATE GUARDRAIL 2-STEP MODAL WITH INTERACTIVE + ADD POLICY DROPDOWN   */}
      {/* ========================================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-5">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Create guardrail
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Wizard Indicator */}
            <div className="space-y-1">
              {step === 1 ? (
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  <span>Basic Info</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-white">Basic Info</span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-blue-600 hover:underline cursor-pointer font-semibold ml-1"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                      2
                    </span>
                    <span>Provider Configuration</span>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    <span className="text-red-500">*</span> Guardrail Name
                  </label>
                  <input
                    type="text"
                    required
                    value={modalGuardrailName}
                    onChange={(e) => setModalGuardrailName(e.target.value)}
                    placeholder="Enter a name for this guardrail"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-neutral-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    <span className="text-red-500">*</span> Guardrail Provider
                  </label>
                  <input
                    type="text"
                    value={modalProvider}
                    onChange={(e) => setModalProvider(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                      <span className="text-red-500">*</span> Mode
                    </label>
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <div className="relative flex items-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5">
                    <div className="flex flex-wrap gap-1 flex-1">
                      {modalModes.map((m) => (
                        <span
                          key={m}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border"
                        >
                          {m}
                          <button
                            type="button"
                            onClick={() => setModalModes(modalModes.filter((x) => x !== m))}
                            className="hover:text-red-500 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <Search className="w-4 h-4 text-neutral-400 mr-1" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Always On
                    </label>
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <div className="relative">
                    <select
                      value={modalAlwaysOn}
                      onChange={(e) => setModalAlwaysOn(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Skip system messages in guardrail
                    </label>
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <div className="relative">
                    <select
                      value={modalSkipSystem}
                      onChange={(e) => setModalSkipSystem(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none"
                    >
                      <option value="Use global default">Use global default</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Skip tool messages in guardrail
                    </label>
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <div className="relative">
                    <select
                      value={modalSkipTool}
                      onChange={(e) => setModalSkipTool(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none"
                    >
                      <option value="Use global default">Use global default</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-400 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Provider Configuration</span>
                </div>
              </div>
            )}

            {/* STEP 2: Provider Configuration with + Add Policy Dropdown matching screenshot */}
            {step === 2 && (
              <div className="space-y-4 text-xs">
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between relative">
                    <h4 className="font-bold text-neutral-900 dark:text-white">
                      Policies Access Assignment
                    </h4>

                    {/* + Add Policy Button + Dropdown Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setAddPolicyDropdownOpen(!addPolicyDropdownOpen)}
                        className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Policy</span>
                      </button>

                      {/* Dropdown Menu matching Screenshot */}
                      {addPolicyDropdownOpen && (
                        <div className="absolute right-0 top-9 z-30 w-64 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl p-2 space-y-1">
                          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            SELECT POLICY / CATEGORY
                          </div>
                          {Object.keys(TAXONOMY_OPTIONS).map((catName) => {
                            const count = TAXONOMY_OPTIONS[catName].length;
                            return (
                              <button
                                key={catName}
                                type="button"
                                onClick={() => handleAddPolicyCategory(catName)}
                                className="w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs transition-colors cursor-pointer"
                              >
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                  {catName}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                  ({count} subcategories)
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Radio Buttons */}
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="policyScope"
                        checked={policyScopeMode === "all"}
                        onChange={() => setPolicyScopeMode("all")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-neutral-700 dark:text-neutral-300">All Available Policies</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="policyScope"
                        checked={policyScopeMode === "selected"}
                        onChange={() => setPolicyScopeMode("selected")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-neutral-700 dark:text-neutral-300 font-medium">Selected Policies</span>
                    </label>
                  </div>

                  {/* Dynamic Multiple Policy Cards matching Screenshot */}
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {assignedPolicies.map((pol) => (
                      <div
                        key={pol.categoryName}
                        className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 space-y-3 bg-neutral-50/50 dark:bg-neutral-800/40"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900 dark:text-white text-xs">
                              {pol.categoryName}
                            </span>
                            <span className="px-2 py-0.5 text-[11px] rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                              {pol.subcategories.length} Subcategory Selected
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemovePolicyCategory(pol.categoryName)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Policy</span>
                          </button>
                        </div>

                        <div className="relative">
                          <label className="block text-[11px] text-neutral-500 mb-1.5 font-medium">
                            Choose Subcategories
                          </label>
                          <div
                            onClick={() => setActiveSubcatDropdownCategory(activeSubcatDropdownCategory === pol.categoryName ? null : pol.categoryName)}
                            className={`flex flex-wrap items-center gap-1.5 p-2 bg-white dark:bg-neutral-800 border rounded-xl min-h-[44px] transition-all cursor-text ${
                              activeSubcatDropdownCategory === pol.categoryName
                                ? "border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30"
                                : "border-neutral-200 dark:border-neutral-700"
                            }`}
                          >
                            {pol.subcategories.map((sub) => (
                              <span
                                key={sub}
                                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 font-medium"
                              >
                                {sub}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveSubcategory(pol.categoryName, sub);
                                  }}
                                  className="text-neutral-400 hover:text-red-500 cursor-pointer text-xs"
                                >
                                  ×
                                </button>
                              </span>
                            ))}

                            <input
                              type="text"
                              value={activeSubcatDropdownCategory === pol.categoryName ? subcatSearchQuery : ""}
                              onChange={(e) => {
                                setActiveSubcatDropdownCategory(pol.categoryName);
                                setSubcatSearchQuery(e.target.value);
                              }}
                              onFocus={() => setActiveSubcatDropdownCategory(pol.categoryName)}
                              placeholder="Search..."
                              className="text-xs bg-transparent border-none outline-none focus:outline-none min-w-[80px] flex-1 py-1 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400"
                            />

                            <div className="ml-auto flex items-center gap-2 text-neutral-400">
                              {pol.subcategories.length > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAssignedPolicies(
                                      assignedPolicies.map((p) =>
                                        p.categoryName === pol.categoryName ? { ...p, subcategories: [] } : p
                                      )
                                    );
                                  }}
                                  className="hover:text-neutral-700 cursor-pointer text-xs"
                                >
                                  ×
                                </button>
                              )}
                              <ChevronUp
                                className={`w-3.5 h-3.5 transition-transform ${
                                  activeSubcatDropdownCategory === pol.categoryName ? "" : "rotate-180"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Subcategory Dropdown Menu matching Screenshot */}
                          {activeSubcatDropdownCategory === pol.categoryName && (
                            <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl p-1.5 space-y-0.5 max-h-48 overflow-y-auto">
                              {(TAXONOMY_OPTIONS[pol.categoryName] || [])
                                .filter(
                                  (opt) =>
                                    !pol.subcategories.includes(opt) &&
                                    opt.toLowerCase().includes(subcatSearchQuery.toLowerCase())
                                )
                                .map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      setAssignedPolicies(
                                        assignedPolicies.map((p) =>
                                          p.categoryName === pol.categoryName
                                            ? { ...p, subcategories: [...p.subcategories, opt] }
                                            : p
                                        )
                                      );
                                      setSubcatSearchQuery("");
                                    }}
                                    className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs transition-colors cursor-pointer"
                                  >
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                      {opt}
                                    </span>
                                    <span className="text-[11px] font-mono text-neutral-400">
                                      {opt.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}
                                    </span>
                                  </button>
                                ))}

                              {(TAXONOMY_OPTIONS[pol.categoryName] || []).filter(
                                (opt) =>
                                  !pol.subcategories.includes(opt) &&
                                  opt.toLowerCase().includes(subcatSearchQuery.toLowerCase())
                              ).length === 0 && (
                                <div className="py-2 text-center text-xs text-neutral-400 italic">
                                  All subcategories selected
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors cursor-pointer"
                >
                  Previous
                </button>
              )}

              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!modalGuardrailName.trim()) {
                      toast.error("Please enter a Guardrail Name");
                      return;
                    }
                    setStep(2);
                  }}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateGuardrailSubmit}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Create Guardrail
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
