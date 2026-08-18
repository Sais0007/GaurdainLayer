import React, { useState, useMemo } from "react";
import {
  Shield,
  Plus,
  X,
  MoreHorizontal,
  ArrowUpDown,
  ChevronUp,
  Info,
  RefreshCw,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export interface DefinedPolicyItem {
  id: string;
  name: string;
  description: string;
  inheritsFrom?: string;
  guardrailsAdd: string[];
  guardrailsAddCountExtra?: number;
  guardrailsRemove: string[];
  modelCondition?: string;
  createdAt: string;
}

export interface RuleDetail {
  name: string;
  description: string;
  filterType: string;
  hook: string;
  patternCount?: string;
}

export interface TemplateCard {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  detectionElements: string[];
  rules: RuleDetail[];
  complexity: "High Complexity" | "Medium Complexity" | "Low Complexity";
}

const TEMPLATE_CATEGORIES = [
  { name: "Prompt & AI Security", count: 6 },
  { name: "Agent Tool & Access Security", count: 6 },
  { name: "Data Privacy & Leakage", count: 5 },
  { name: "Cybersecurity", count: 6 },
  { name: "Safety & Physical Harm", count: 11 },
  { name: "Abuse, Harassment & Sexual Safety", count: 9 },
];

const TEMPLATE_CARDS: TemplateCard[] = [
  {
    id: "tmpl-1",
    title: "Prompt Injection",
    description: "Attempts to manipulate the model through direct or externally supplied instructions that override, conflict with, or influence its intended behavior.",
    categoryName: "Prompt & AI Security",
    detectionElements: ["Direct Prompt Injection", "Indirect Prompt Injection", "RAG Poisoning", "MCP Context Poisoning"],
    rules: [
      {
        name: "Direct Prompt Injection",
        description: "Detects system prompt overrides, jailbreaks, and adversarial prompt attacks",
        filterType: "guardian_layer_content_filter",
        hook: "pre_call",
        patternCount: "7 pattern(s)",
      },
      {
        name: "Indirect Prompt Injection",
        description: "Detects system prompt overrides, jailbreaks, and adversarial prompt attacks",
        filterType: "guardian_layer_content_filter",
        hook: "pre_call",
        patternCount: "7 pattern(s)",
      },
      {
        name: "RAG Poisoning",
        description: "Enforces detection and masking for RAG Poisoning.",
        filterType: "guardian_layer_content_filter",
        hook: "pre_call",
        patternCount: "3 pattern(s)",
      },
      {
        name: "MCP Context Poisoning",
        description: "Prevents unauthorized tool instruction hijacking and context manipulation.",
        filterType: "guardian_layer_content_filter",
        hook: "pre_call",
        patternCount: "2 pattern(s)",
      },
    ],
    complexity: "High Complexity",
  },
  {
    id: "tmpl-2",
    title: "Jailbreak & Bypass",
    description: "Attempts to bypass the model\x27s safety restrictions, refusal behavior, or policy controls through specially crafted prompts, reframing, repetition, role-playing, or other manipulation...",
    categoryName: "Prompt & AI Security",
    detectionElements: ["Jailbreak", "Refusal Bypass", "Role Bypass"],
    rules: [
      {
        name: "Jailbreak",
        description: "Detects persona hijacking, DAN variants, and hypothetical framing bypasses.",
        filterType: "guardian_layer_content_filter",
        hook: "pre_call",
        patternCount: "8 pattern(s)",
      },
      {
        name: "Refusal Bypass",
        description: "Prevents deceptive framing intended to evade standard model refusal policies.",
        filterType: "guardian_layer_content_filter",
        hook: "pre_call",
        patternCount: "4 pattern(s)",
      },
      {
        name: "Role Bypass",
        description: "Blocks simulated developer or administrator role assumption.",
        filterType: "guardian_layer_content_filter",
        hook: "pre_call",
        patternCount: "3 pattern(s)",
      },
    ],
    complexity: "High Complexity",
  },
  {
    id: "tmpl-3",
    title: "Prompt & Policy Extraction",
    description: "Attempts to discover, obtain, or expose hidden system prompts, developer instructions, internal policies, safety rules, or other confidential model instructions.",
    categoryName: "Prompt & AI Security",
    detectionElements: ["Prompt Extraction", "Policy Probing"],
    rules: [
      {
        name: "Prompt Extraction",
        description: "Catches explicit queries seeking internal system instructions and preamble tokens.",
        filterType: "guardian_layer_content_filter",
        hook: "pre_call",
        patternCount: "5 pattern(s)",
      },
      {
        name: "Policy Probing",
        description: "Identifies systemic boundary testing against organization guardrails.",
        filterType: "guardian_layer_content_filter",
        hook: "pre_call",
        patternCount: "2 pattern(s)",
      },
    ],
    complexity: "High Complexity",
  },
  {
    id: "tmpl-4",
    title: "Instruction Manipulation",
    description: "Attempts to create conflicting, deceptive, adversarial, or otherwise manipulated instructions intended to confuse the model or cause it to prioritize unintended behavior.",
    categoryName: "Prompt & AI Security",
    detectionElements: ["Instruction Conflict", "Adversarial Attacks"],
    rules: [
      {
        name: "Instruction Conflict",
        description: "Blocks contradictory directives that aim to override developer instructions.",
        filterType: "guardian_layer_content_filter",
        hook: "pre_call",
        patternCount: "4 pattern(s)",
      },
      {
        name: "Adversarial Attacks",
        description: "Identifies gradient-based or token-glitched adversarial injection payloads.",
        filterType: "guardian_layer_content_filter",
        hook: "pre_call",
        patternCount: "6 pattern(s)",
      },
    ],
    complexity: "High Complexity",
  },
  {
    id: "tmpl-5",
    title: "Model & Training Data Security",
    description: "Attempts to extract, reproduce, compromise, or manipulate proprietary model behavior, model capabilities, or information contained within training and fine-tuning data.",
    categoryName: "Prompt & AI Security",
    detectionElements: ["Model Theft", "Training Data Leakage", "Training Data Poisoning"],
    rules: [
      {
        name: "Model Theft",
        description: "Monitors high-volume distillation and extraction patterns.",
        filterType: "guardian_layer_content_filter",
        hook: "pre_call",
        patternCount: "3 pattern(s)",
      },
    ],
    complexity: "High Complexity",
  },
  {
    id: "tmpl-6",
    title: "Hallucination Risk",
    description: "Situations where the model may generate unsupported, fabricated, misleading, or unverifiable information as though it were accurate.",
    categoryName: "Prompt & AI Security",
    detectionElements: ["Hallucination Risk"],
    rules: [
      {
        name: "Hallucination Risk",
        description: "Enforces citation grounding and confidence scoring verification.",
        filterType: "guardian_layer_content_filter",
        hook: "post_call",
        patternCount: "2 pattern(s)",
      },
    ],
    complexity: "High Complexity",
  },
];

const INITIAL_POLICIES: DefinedPolicyItem[] = [
  {
    id: "pol-1",
    name: "test-100",
    description: "testing",
    inheritsFrom: undefined,
    guardrailsAdd: [],
    guardrailsRemove: [],
    modelCondition: undefined,
    createdAt: "Aug 17, 16:25:24",
  },
  {
    id: "pol-2",
    name: "advanced-pii-protection-australia-dfd",
    description: "Comprehensive PII detection and masking policy for ...",
    inheritsFrom: undefined,
    guardrailsAdd: ["au-pii-tax-identifiers", "au-pii-passports"],
    guardrailsAddCountExtra: 6,
    guardrailsRemove: [],
    modelCondition: undefined,
    createdAt: "Aug 6, 21:42:58",
  },
  {
    id: "pol-3",
    name: "advanced-pii-protection-australia",
    description: "Comprehensive PII detection and masking policy for ...",
    inheritsFrom: undefined,
    guardrailsAdd: ["au-pii-tax-identifiers", "au-pii-passports"],
    guardrailsAddCountExtra: 6,
    guardrailsRemove: [],
    modelCondition: undefined,
    createdAt: "Aug 6, 21:41:19",
  },
];

export function PoliciesManagement() {
  const [activeTab, setActiveTab] = useState<"templates" | "policies">("templates");
  const [showAboutBanner, setShowAboutBanner] = useState(true);
  const [policies, setPolicies] = useState<DefinedPolicyItem[]>(INITIAL_POLICIES);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateCard | null>(null);

  // Detail & Action States
  const [selectedPolicy, setSelectedPolicy] = useState<DefinedPolicyItem | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Create Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newRegexPattern, setNewRegexPattern] = useState("");

  // Delete Modal
  const [deleteModalPolicy, setDeleteModalPolicy] = useState<DefinedPolicyItem | null>(null);

  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const filteredTemplates = useMemo(() => {
    if (selectedCategories.length === 0) return TEMPLATE_CARDS;
    return TEMPLATE_CARDS.filter((c) => selectedCategories.includes(c.categoryName));
  }, [selectedCategories]);

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyName.trim()) {
      toast.error("Policy name is required");
      return;
    }
    if (!newDescription.trim()) {
      toast.error("Description is required");
      return;
    }

    const created: DefinedPolicyItem = {
      id: `pol-${Date.now()}`,
      name: newPolicyName.trim().toLowerCase().replace(/\s+/g, "-"),
      description: newDescription.trim(),
      guardrailsAdd: ["au-pii-tax-identifiers", "au-pii-passports"],
      guardrailsAddCountExtra: 4,
      guardrailsRemove: [],
      modelCondition: newRegexPattern.trim() || undefined,
      createdAt: "Aug 18, 15:50:00",
    };

    setPolicies([created, ...policies]);
    toast.success(`Policy "${created.name}" created successfully!`);
    setAddModalOpen(false);
    setNewPolicyName("");
    setNewDescription("");
    setNewRegexPattern("");
  };

  const handleDeletePolicy = () => {
    if (!deleteModalPolicy) return;
    setPolicies(policies.filter((p) => p.id !== deleteModalPolicy.id));
    toast.success(`Deleted policy "${deleteModalPolicy.name}"`);
    if (selectedPolicy?.id === deleteModalPolicy.id) {
      setSelectedPolicy(null);
    }
    setDeleteModalPolicy(null);
  };

  return (
    <div className="p-6 space-y-5 bg-[#fafafa] dark:bg-neutral-950 min-h-screen">
      {/* Top Navigation Tabs Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <nav className="flex space-x-8 -mb-px">
          <button
            type="button"
            onClick={() => {
              setActiveTab("templates");
              setSelectedPolicy(null);
            }}
            className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "templates"
                ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            Templates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("policies")}
            className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "policies"
                ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            Policies
          </button>
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* 1. TEMPLATES TAB                                                          */}
      {/* ========================================================================= */}
      {activeTab === "templates" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                Policy Templates
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Start with a pre-configured policy template to quickly set up guardrails for your organization.
              </p>
            </div>
            <button
              type="button"
              onClick={() => toast.success("Taxonomy refreshed")}
              className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* Left Categories Sidebar */}
            <div className="w-full lg:w-64 shrink-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  CATEGORIES
                </h3>
                {selectedCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategories([])}
                    className="text-xs text-blue-600 hover:underline cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {TEMPLATE_CATEGORIES.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.name);
                  return (
                    <label
                      key={cat.name}
                      className="flex items-center justify-between text-xs py-2 px-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat.name)}
                          className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span
                          className={`text-xs ${
                            isChecked
                              ? "font-semibold text-neutral-900 dark:text-white"
                              : "text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 font-medium ml-2 shrink-0">
                        {cat.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Template Cards Grid */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTemplates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Icon & Complexity Badge */}
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <Shield className="w-4 h-4" />
                        </div>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                          {tmpl.complexity}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                          {tmpl.title}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed line-clamp-3">
                          {tmpl.description}
                        </p>
                      </div>

                      {/* Category Tag Pill */}
                      <div>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300">
                          {tmpl.categoryName}
                        </span>
                      </div>

                      {/* Included Guardrails */}
                      <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <h4 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                          INCLUDED GUARDRAILS
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {tmpl.detectionElements.map((elem, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-[10px] font-medium rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 font-mono"
                            >
                              {elem}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* View Template Button */}
                    <div className="pt-4 mt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTemplate(tmpl)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
                      >
                        View Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. POLICIES TAB                                                           */}
      {/* ========================================================================= */}
      {activeTab === "policies" && (
        <div className="space-y-5">
          {/* About Policies Banner */}
          {showAboutBanner && (
            <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl p-5 relative space-y-2.5">
              <button
                type="button"
                onClick={() => setShowAboutBanner(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
                <Info className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                <span>About Policies</span>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                Use policies to group guardrails and control which ones run for specific teams, keys, or models.
              </p>

              <div className="space-y-1 pt-1">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  Why use policies?
                </h4>
                <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-300 space-y-0.5 pl-0.5">
                  <li>Enable/disable specific guardrails for teams, keys, or models</li>
                  <li>Group guardrails into a single policy</li>
                  <li>Inherit from existing policies and override what you need</li>
                </ul>
              </div>
            </div>
          )}

          {/* Add New Policy Button */}
          <div>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#5c60f5] hover:bg-[#4d51ea] active:bg-[#4346d9] text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add New Policy</span>
            </button>
          </div>

          {/* Policies Table View */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/70 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">
                      <div className="flex items-center gap-1 cursor-pointer">
                        <span>NAME</span>
                        <ChevronUp className="w-3 h-3 text-neutral-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 font-bold">DESCRIPTION</th>
                    <th className="py-3.5 px-4 font-bold">INHERITS FROM</th>
                    <th className="py-3.5 px-4 font-bold">GUARDRAILS (ADD)</th>
                    <th className="py-3.5 px-4 font-bold">GUARDRAILS (REMOVE)</th>
                    <th className="py-3.5 px-4 font-bold">MODEL CONDITION</th>
                    <th className="py-3.5 px-4 font-bold">
                      <div className="flex items-center gap-1 cursor-pointer">
                        <span>CREATED AT</span>
                        <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                  {policies.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td
                        onClick={() => setSelectedPolicy(p)}
                        className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-white hover:text-indigo-600 cursor-pointer underline-offset-2 hover:underline whitespace-nowrap"
                      >
                        {p.name}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                        {p.description}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400">{p.inheritsFrom || "-"}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {p.guardrailsAdd.length > 0 ? (
                            <>
                              {p.guardrailsAdd.map((g, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-0.5 text-[11px] font-mono rounded-full bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-900 dark:border-neutral-400 font-semibold"
                                >
                                  {g}
                                </span>
                              ))}
                              {Boolean(p.guardrailsAddCountExtra) && (
                                <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                                  +{p.guardrailsAddCountExtra}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-neutral-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400">-</td>
                      <td className="py-3.5 px-4 text-neutral-400">{p.modelCondition || "-"}</td>
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 whitespace-nowrap font-medium">
                        {p.createdAt}
                      </td>
                      <td className="py-3.5 px-4 text-right relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                          className="p-1 text-neutral-400 hover:text-neutral-600 rounded hover:bg-neutral-100 transition-colors"
                        >
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

      {/* ========================================================================= */}
      {/* 3. MODAL: VIEW TEMPLATE (Matching Screenshot 2 EXACTLY)                   */}
      {/* ========================================================================= */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {selectedTemplate.title}
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    {selectedTemplate.categoryName}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Template details, rules, and guardrail specifications
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Blue Info Alert matching Screenshot 2 */}
            <div className="p-3 bg-[#f0f9ff] dark:bg-blue-950/40 border border-[#bae6fd] dark:border-blue-900/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#0284c7] dark:text-blue-300 font-medium">
                <Info className="w-4 h-4 shrink-0" />
                <span>
                  <strong>{selectedTemplate.rules.length} Guardrail Rules</strong> configured for this policy template
                </span>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#f3e8ff] text-[#9333ea]">
                {selectedTemplate.complexity}
              </span>
            </div>

            {/* Rules Cards List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {selectedTemplate.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white dark:bg-neutral-800/80 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono font-bold text-xs text-neutral-900 dark:text-white">
                      {rule.name}
                    </h4>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
                      Active Rule
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {rule.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border">
                      {rule.filterType}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
                      {rule.hook}
                    </span>
                    {rule.patternCount && (
                      <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#faf5ff] text-[#9333ea] border border-[#e9d5ff]">
                        {rule.patternCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer matching Screenshot 2 */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-xs text-neutral-500">
                Category: <strong>{selectedTemplate.categoryName}</strong> • {selectedTemplate.rules.length} rules
              </div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: CREATE POLICY ======================= */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreatePolicy}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Create New Policy</h3>
                <p className="text-xs text-neutral-500">Define compliance rules and guardrail groupings.</p>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  <span className="text-red-500">*</span> Policy Name
                </label>
                <input
                  type="text"
                  required
                  value={newPolicyName}
                  onChange={(e) => setNewPolicyName(e.target.value)}
                  placeholder="e.g. strict-compliance-aus"
                  className="w-full p-2.5 font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300">
                    <span className="text-red-500">*</span> Description
                  </label>
                  <span className="text-[10px] text-neutral-400 font-mono">{newDescription.length}/2000</span>
                </div>
                <textarea
                  rows={3}
                  required
                  maxLength={2000}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed description of rules enforced..."
                  className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800 pt-3">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#5c60f5] hover:bg-[#4d51ea] text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                Create Policy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
