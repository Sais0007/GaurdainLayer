import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Users,
  Building2,
  Sparkles,
  BarChart3,
  Check,
  ChevronDown,
  X,
  AlertCircle,
  Info,
  Mail,
  User as UserIcon,
  Search,
  Lock,
  Loader2
} from 'lucide-react';
import { PageHeader, PrimaryButton, SecondaryButton } from './hb/listing';
import { toast } from 'sonner';

// Multi-cloud provider definitions matching Add User.dc.html & Teams parity
export interface ProviderInfo {
  id: string;
  name: string;
  count: number;
  color: string;
}

export const USER_PROVIDERS_LIST: ProviderInfo[] = [
  { id: "openai", name: "OpenAI", count: 12, color: "#2563eb" },
  { id: "anthropic", name: "Anthropic", count: 35, color: "#7c3aed" },
  { id: "gemini", name: "Google Gemini", count: 55, color: "#0891b2" },
  { id: "azure", name: "Azure OpenAI", count: 50, color: "#059669" },
  { id: "bedrock", name: "AWS Bedrock", count: 80, color: "#d97706" },
  { id: "mistral", name: "Mistral AI", count: 40, color: "#db2777" },
  { id: "cohere", name: "Cohere", count: 25, color: "#2563eb" },
  { id: "groq", name: "Groq", count: 18, color: "#7c3aed" },
  { id: "perplexity", name: "Perplexity", count: 12, color: "#0891b2" },
  { id: "deepseek", name: "DeepSeek", count: 20, color: "#059669" },
  { id: "xai", name: "xAI", count: 10, color: "#d97706" },
  { id: "metaLlama", name: "Meta Llama", count: 30, color: "#db2777" },
  { id: "watsonx", name: "IBM watsonx", count: 22, color: "#2563eb" },
  { id: "ai21", name: "AI21 Labs", count: 15, color: "#7c3aed" },
  { id: "voyage", name: "Voyage AI", count: 13, color: "#0891b2" },
  { id: "huggingface", name: "HuggingFace", count: 380, color: "#d97706" },
  { id: "openrouter", name: "OpenRouter", count: 220, color: "#059669" },
  { id: "together", name: "Together AI", count: 150, color: "#db2777" },
  { id: "fireworks", name: "Fireworks AI", count: 120, color: "#2563eb" },
  { id: "replicate", name: "Replicate", count: 90, color: "#7c3aed" },
];

const buildUserFullCatalog = (): Record<string, string[]> => {
  const curated: Record<string, string[]> = {
    openai: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini", "o3", "o3-mini", "o4-mini", "chatgpt-image-latest", "sora-2-pro", "tts-1", "whisper-1", "text-embedding-3-large"],
    anthropic: ["claude-opus-4-5", "claude-sonnet-4-5", "claude-haiku-4-5", "claude-3-5-sonnet-20241022", "claude-3-opus-20240229"],
    gemini: ["gemini/gemini-2.5-flash", "gemini/gemini-2.5-pro", "gemini-pro-latest", "gemini-flash-latest", "gemini-embedding-001"],
    azure: ["azure/gpt-4o", "azure/gpt-4o-mini", "azure/gpt-4.1", "azure/o3-mini", "azure/text-embedding-3-large"],
    bedrock: ["amazon.titan-text-express-v1", "anthropic.claude-3-sonnet-20240229-v1:0", "meta.llama3-70b-instruct-v1:0", "mistral.mixtral-8x7b-instruct-v0:1"],
    mistral: ["mistral-large-latest", "mistral-small-latest", "codestral-latest", "mistral-embed"],
    cohere: ["command-r-plus", "command-r", "embed-english-v3.0"],
    groq: ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"],
    perplexity: ["sonar-pro", "sonar", "sonar-reasoning"],
    deepseek: ["deepseek-chat", "deepseek-reasoner"],
    xai: ["grok-3", "grok-3-mini", "grok-2-vision"],
    metaLlama: ["llama-3.3-70b", "llama-3.1-405b"],
    watsonx: ["granite-13b-chat-v2", "llama-3-70b-instruct"],
    ai21: ["jamba-1.5-large", "jamba-1.5-mini"],
    voyage: ["voyage-3", "voyage-code-3"],
  };

  const ORGS = ["meta-llama", "mistralai", "Qwen", "google", "microsoft", "tiiuae", "deepseek-ai", "bigcode"];
  const FAMILIES = ["llama-3", "mistral-7b", "mixtral-8x7b", "qwen2.5-72b", "gemma-2-9b", "phi-3-medium"];
  const SIZES = ["1.3", "7", "13", "34", "70"];
  const VARIANTS = ["instruct", "chat", "it", "base"];

  const hub: Record<string, string[]> = {};
  USER_PROVIDERS_LIST.forEach((p) => {
    if (curated[p.id]) return;
    hub[p.id] = Array.from({ length: p.count }, (_, i) => {
      const org = ORGS[i % ORGS.length];
      const fam = FAMILIES[(i * 3) % FAMILIES.length].split("-")[0];
      const size = SIZES[(i * 7) % SIZES.length];
      const variant = VARIANTS[(i * 11) % VARIANTS.length];
      return `${org}/${fam}-${size}b-${variant}`;
    });
  });

  return { ...curated, ...hub };
};

export const USER_FULL_CATALOG = buildUserFullCatalog();

const hashStr = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const fmtContext = (n: number): string => {
  if (n >= 1000000) return `${n / 1000000}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
};

const getModelInfoText = (name: string): string => {
  const h = hashStr(name);
  const CTX = [4096, 8192, 16384, 32768, 65536, 131072, 200000, 1000000];
  const contextWindow = CTX[h % CTX.length];
  const maxOutput = [1024, 2048, 4096, 8192, 16384][h % 5];
  const inputPrice = Math.round((((h * 17) % 300) / 100) * 100) / 100;
  const outputPrice = Math.round(inputPrice * (2 + (h % 3)) * 100) / 100;
  return `Context: ${fmtContext(contextWindow)} · Max Output: ${fmtContext(maxOutput)} · Input: $${inputPrice.toFixed(2)}/1M · Output: $${outputPrice.toFixed(2)}/1M`;
};

export const AVAILABLE_TEAMS_LIST = [
  "New Testing Team",
  "Core Engineering & AI Lab",
  "AI Research",
  "DevOps Core",
  "QA Testing",
  "Data Science",
  "Customer Support Bots",
  "Infrastructure"
];

export const AVAILABLE_ROLES_OPTIONS = [
  { name: "Organization Admin", value: "Org Admin", description: "Administrative authority over assigned organization & teams" },
  { name: "Internal User", value: "Internal User", description: "Can manage virtual keys & personal resources" },
  { name: "Developer", value: "Developer", description: "View-only access to assigned proxy routes" },
  { name: "Read-Only Viewer", value: "Viewer", description: "Read-only access to organization telemetry" },
];

export interface UserFormProps {
  mode: "create" | "edit";
  initialUser?: any;
  onBack: () => void;
  onSave: (data: any) => void;
}

export function UserForm({ mode, initialUser, onBack, onSave }: UserFormProps) {
  // Stepper Step State
  const [stepIndex, setStepIndex] = useState(0);

  // Step 1: User Info & Teams
  const [email, setEmail] = useState(initialUser?.email || "");
  const [name, setName] = useState(initialUser?.userAlias || initialUser?.name || "");
  const [role, setRole] = useState(initialUser?.role || "Internal User");
  const [selectedTeams, setSelectedTeams] = useState<string[]>(
    initialUser?.assignedTeams || (initialUser?.team ? [initialUser.team] : ["AI Research"])
  );
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");

  // Step 2: Model Access Assignment
  const [accessMode, setAccessMode] = useState<"all" | "selected">(
    initialUser?.accessMode || (initialUser?.allowedModels?.includes("All Available Models") ? "all" : "selected")
  );
  const [selectedByProvider, setSelectedByProvider] = useState<Record<string, Record<string, boolean>>>(
    initialUser?.selectedByProvider || {
      openai: { "gpt-4o": true, "gpt-4o-mini": true },
      anthropic: { "claude-3-5-sonnet-20241022": true }
    }
  );
  const [globalSearch, setGlobalSearch] = useState("");
  const [providerSearch, setProviderSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [activeProviderId, setActiveProviderId] = useState("openai");
  const [infoOpenKey, setInfoOpenKey] = useState<string | null>(null);
  const [expandedSummaryProviderId, setExpandedSummaryProviderId] = useState<string | null>(null);

  // Step 3: Budget Configuration
  const initialBudget = initialUser?.budgetUsd !== undefined ? initialUser.budgetUsd : 500;
  const [unlimitedBudget, setUnlimitedBudget] = useState(initialBudget === null);
  const [maxBudget, setMaxBudget] = useState<string>(initialBudget !== null ? String(initialBudget) : "500");
  const [softBudget, setSoftBudget] = useState<string>(
    initialUser?.softBudgetUsd !== undefined ? String(initialUser.softBudgetUsd) : "400"
  );
  const [resetDuration, setResetDuration] = useState<string>(initialUser?.budgetDuration || "Monthly");
  const [emailChipsList, setEmailChipsList] = useState<string[]>(
    initialUser?.notificationEmails || (initialUser?.email ? [initialUser.email] : ["hbadmin@yopmail.com"])
  );
  const [emailDraft, setEmailDraft] = useState("");

  // Form Interactions
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-team-dropdown-container")) {
        setTeamDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Validation Rules
  const isEmailValid = useMemo(() => {
    if (!email.trim()) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const isNameValid = useMemo(() => name.trim() !== "", [name]);

  const isStep0Valid = useMemo(() => isEmailValid && isNameValid, [isEmailValid, isNameValid]);

  const isStep1Valid = useMemo(() => {
    if (accessMode === "all") return true;
    const count = Object.values(selectedByProvider).reduce(
      (acc, p) => acc + Object.values(p).filter(Boolean).length,
      0
    );
    return count > 0;
  }, [accessMode, selectedByProvider]);

  const isStep2Valid = useMemo(() => {
    if (unlimitedBudget) return true;
    return maxBudget.trim() !== "" && !isNaN(Number(maxBudget)) && Number(maxBudget) >= 0;
  }, [unlimitedBudget, maxBudget]);

  const handleSubmit = () => {
    setTouched(true);
    if (!isStep0Valid) {
      setStepIndex(0);
      toast.error("Please enter a valid Name and Email Address.");
      return;
    }
    if (!isStep1Valid) {
      setStepIndex(1);
      toast.error("Please select at least one model.");
      return;
    }
    if (!isStep2Valid) {
      setStepIndex(2);
      toast.error("Please enter a valid Max Budget.");
      return;
    }

    setIsSubmitting(true);

    const assignedProvidersList = Object.entries(selectedByProvider)
      .map(([pId, modelsMap]) => {
        const selectedMs = Object.keys(modelsMap).filter((m) => modelsMap[m]);
        const pObj = USER_PROVIDERS_LIST.find((x) => x.id === pId);
        return {
          provider: pObj ? pObj.name : pId,
          selectedModels: selectedMs,
        };
      })
      .filter((p) => p.selectedModels.length > 0);

    const allowedModelsList = accessMode === "all"
      ? ["All Available Models"]
      : assignedProvidersList.flatMap((p) => p.selectedModels);

    const finalUserData = {
      ...(initialUser || {}),
      id: initialUser?.id || `usr-${Math.floor(100000 + Math.random() * 900000)}`,
      email: email.trim(),
      userAlias: name.trim(),
      name: name.trim(),
      role: role,
      organization: initialUser?.organization || "HB Enterprise",
      team: selectedTeams.length > 0 ? selectedTeams[0] : "AI Research",
      assignedTeams: selectedTeams,
      accessMode: accessMode,
      selectedByProvider: selectedByProvider,
      allowedModels: allowedModelsList,
      status: initialUser?.status || "active",
      spendUsd: initialUser?.spendUsd || 0,
      budgetUsd: unlimitedBudget ? null : Number(maxBudget),
      softBudgetUsd: unlimitedBudget ? undefined : Number(softBudget),
      budgetDuration: resetDuration,
      notificationEmails: emailChipsList,
      updatedAt: new Date().toISOString().split("T")[0],
      createdAt: initialUser?.createdAt || new Date().toISOString().split("T")[0],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSave(finalUserData);
    }, 300);
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full space-y-5 animate-fadeIn text-xs pb-12">
      {/* Back Navigation Button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Users</span>
      </button>

      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
          {mode === "edit" ? "Edit User" : "Add User"}
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          {mode === "edit"
            ? "Update user details, assigned teams, model access, and budget settings."
            : "Create a user, assign teams, and set model access & budget."}
        </p>
      </div>

      {/* Informational Email Banner (Create Mode) */}
      {mode === "create" && (
        <div className="p-3.5 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-xl flex items-start gap-3 text-xs text-teal-900 dark:text-teal-200">
          <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-teal-950 dark:text-teal-100">Email Invitations</span>
            <span className="text-teal-700 dark:text-teal-300">
              New users receive an invitation email after configuration is completed.
            </span>
          </div>
        </div>
      )}

      {/* 3-Step Stepper Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs">
        {[
          { id: 0, label: "User Info & Teams" },
          { id: 1, label: "Model Access" },
          { id: 2, label: "Budget Configuration" },
        ].map((step, idx, arr) => {
          const isDone = stepIndex > idx;
          const isCurrent = stepIndex === idx;

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => {
                  if (idx === 0 || isStep0Valid) {
                    setStepIndex(idx);
                  } else {
                    toast.error("Please enter a valid Name and Email first.");
                  }
                }}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? "bg-teal-600 text-white"
                      : isCurrent
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 ring-2 ring-neutral-900/10 dark:ring-white/10"
                      : "bg-white dark:bg-neutral-950 text-neutral-400 border border-neutral-300 dark:border-neutral-700"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-semibold whitespace-nowrap ${
                    isCurrent
                      ? "text-neutral-900 dark:text-white"
                      : isDone
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-4 ${
                    isDone ? "bg-teal-600" : "bg-neutral-200 dark:bg-neutral-800"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 1: USER INFO & TEAMS */}
      {stepIndex === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
          {/* User Information Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <UserIcon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">User Information</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  disabled={mode === "edit"}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-all ${
                    mode === "edit" ? "bg-neutral-100 dark:bg-neutral-950 cursor-not-allowed text-neutral-500" : ""
                  } ${
                    touched && !isEmailValid ? "border-rose-500" : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500"
                  }`}
                />
                {touched && !isEmailValid && (
                  <span className="text-[11px] text-rose-500">Please enter a valid email address.</span>
                )}
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-all ${
                    touched && !isNameValid ? "border-rose-500" : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500"
                  }`}
                />
                {touched && !isNameValid && (
                  <span className="text-[11px] text-rose-500">Full Name is required.</span>
                )}
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {AVAILABLE_ROLES_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-neutral-400 block mt-0.5">
                  {AVAILABLE_ROLES_OPTIONS.find((r) => r.value === role)?.description}
                </span>
              </div>
            </div>
          </div>

          {/* Organization & Teams Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <Building2 className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Organization & Teams</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Assigned Teams
                </label>

                {/* Teams Multi-Select Input Box */}
                <div className="relative user-team-dropdown-container">
                  <div
                    onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
                    className="w-full min-h-[42px] p-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg flex items-center justify-between gap-2 cursor-pointer hover:border-neutral-400"
                  >
                    <div className="flex flex-wrap gap-1.5 flex-1 items-center">
                      {selectedTeams.length === 0 ? (
                        <span className="text-neutral-400 text-xs px-1">Select teams...</span>
                      ) : (
                        selectedTeams.map((tName) => (
                          <span
                            key={tName}
                            className="px-2.5 py-1 bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-md text-xs font-semibold flex items-center gap-1.5"
                          >
                            <span>{tName}</span>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTeams((prev) => prev.filter((x) => x !== tName));
                              }}
                              className="text-teal-400 hover:text-teal-800 cursor-pointer font-bold"
                            >
                              ×
                            </span>
                          </span>
                        ))
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${teamDropdownOpen ? "rotate-180" : ""}`} />
                  </div>

                  {/* Searchable Teams Dropdown Menu */}
                  {teamDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 z-30 max-h-56 overflow-y-auto custom-scrollbar">
                      <div className="p-1 mb-1.5">
                        <input
                          type="text"
                          value={teamSearchQuery}
                          onChange={(e) => setTeamSearchQuery(e.target.value)}
                          placeholder="Search available teams..."
                          className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs outline-none"
                        />
                      </div>
                      {AVAILABLE_TEAMS_LIST.filter((t) =>
                        t.toLowerCase().includes(teamSearchQuery.toLowerCase())
                      ).map((tName) => {
                        const isSelected = selectedTeams.includes(tName);
                        return (
                          <div
                            key={tName}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedTeams((prev) => prev.filter((x) => x !== tName));
                              } else {
                                setSelectedTeams((prev) => [...prev, tName]);
                              }
                            }}
                            className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-teal-50 dark:bg-teal-950/60 font-bold text-teal-800 dark:text-teal-200"
                                : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
                            }`}
                          >
                            <span>{tName}</span>
                            {isSelected && <Check className="w-4 h-4 text-teal-600 stroke-[3]" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: MODEL ACCESS ASSIGNMENT */}
      {stepIndex === 1 && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
              <Sparkles className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <span>Models Access Assignment</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {accessMode === "all"
                ? `Full catalog access across ${USER_PROVIDERS_LIST.length} providers`
                : `${Object.values(selectedByProvider).reduce((acc, p) => acc + Object.values(p).filter(Boolean).length, 0)} model(s) selected across ${USER_PROVIDERS_LIST.filter((p) => Object.values(selectedByProvider[p.id] || {}).filter(Boolean).length > 0).length} of ${USER_PROVIDERS_LIST.length} providers`}
            </p>
          </div>

          {/* Mode Selection Radios */}
          <div className="flex items-center gap-6 py-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <input
                type="radio"
                name="userAccessMode"
                checked={accessMode === "all"}
                onChange={() => setAccessMode("all")}
                className="w-4 h-4 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
              />
              <span>All Available Models</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <input
                type="radio"
                name="userAccessMode"
                checked={accessMode === "selected"}
                onChange={() => setAccessMode("selected")}
                className="w-4 h-4 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
              />
              <span>Selected Models</span>
            </label>
          </div>

          {/* All Available Models Banner */}
          {accessMode === "all" && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              This user gets access to every model across all {USER_PROVIDERS_LIST.length} providers, including new models onboarded later. Browse the full catalog below — it's read-only in this mode.
            </div>
          )}

          {/* Selected Models Summary Chips */}
          {accessMode === "selected" && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 text-xs">
                  {Object.values(selectedByProvider).reduce((acc, p) => acc + Object.values(p).filter(Boolean).length, 0)} model(s) selected:
                </span>

                {USER_PROVIDERS_LIST.filter((p) => Object.values(selectedByProvider[p.id] || {}).filter(Boolean).length > 0).map((p) => {
                  const count = Object.values(selectedByProvider[p.id] || {}).filter(Boolean).length;
                  const isExpanded = expandedSummaryProviderId === p.id;
                  return (
                    <div
                      key={p.id}
                      className="px-2.5 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs"
                    >
                      <span
                        onClick={() => setExpandedSummaryProviderId(isExpanded ? null : p.id)}
                        className="cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <span>{p.name} ({count})</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </span>
                      <span
                        onClick={() => setSelectedByProvider((prev) => ({ ...prev, [p.id]: {} }))}
                        className="text-neutral-400 hover:text-rose-600 cursor-pointer font-bold"
                      >
                        ×
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Expanded Provider Models */}
              {expandedSummaryProviderId && (
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-1.5">
                  {Object.keys(selectedByProvider[expandedSummaryProviderId] || {})
                    .filter((mName) => selectedByProvider[expandedSummaryProviderId][mName])
                    .map((mName) => (
                      <span
                        key={mName}
                        className="px-2 py-0.5 bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded text-[11px] font-mono font-semibold flex items-center gap-1.5"
                      >
                        <span>{mName}</span>
                        <span
                          onClick={() =>
                            setSelectedByProvider((prev) => ({
                              ...prev,
                              [expandedSummaryProviderId]: {
                                ...prev[expandedSummaryProviderId],
                                [mName]: false,
                              },
                            }))
                          }
                          className="cursor-pointer text-teal-400 hover:text-teal-800 font-bold"
                        >
                          ×
                        </span>
                      </span>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Global Model Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Not sure which provider? Search all models by name..."
              className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Global Search Results Panel */}
          {globalSearch.trim() ? (
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl h-96 flex flex-col overflow-hidden bg-white dark:bg-neutral-950">
              <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
                Search results across all providers
              </div>
              <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scrollbar align-content-start">
                {USER_PROVIDERS_LIST.flatMap((p) => {
                  const list = USER_FULL_CATALOG[p.id] || [];
                  const query = globalSearch.trim().toLowerCase();
                  return list
                    .filter((mName) => mName.toLowerCase().includes(query))
                    .map((mName) => ({ provider: p, name: mName }));
                }).map((item) => {
                  const isChecked = accessMode === "all" || !!(selectedByProvider[item.provider.id] || {})[item.name];
                  const infoKey = `global-${item.provider.id}-${item.name}`;
                  const isInfoOpen = infoOpenKey === infoKey;

                  return (
                    <div
                      key={infoKey}
                      onClick={() => {
                        if (accessMode === "all") return;
                        setSelectedByProvider((prev) => ({
                          ...prev,
                          [item.provider.id]: {
                            ...(prev[item.provider.id] || {}),
                            [item.name]: !isChecked,
                          },
                        }));
                      }}
                      className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-teal-50/60 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800"
                          : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          disabled={accessMode === "all"}
                          className="w-4 h-4 text-teal-600 rounded cursor-pointer shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-mono text-xs font-semibold block text-neutral-900 dark:text-white truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-bold block" style={{ color: item.provider.color }}>
                            {item.provider.name}
                          </span>
                        </div>
                      </div>

                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInfoOpenKey(isInfoOpen ? null : infoKey);
                          }}
                          className="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                        >
                          i
                        </button>
                        {isInfoOpen && (
                          <div className="absolute right-0 top-6 w-56 p-2.5 bg-neutral-900 text-white rounded-lg text-[11px] shadow-2xl z-50 animate-fadeIn font-sans">
                            {getModelInfoText(item.name)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Provider Browsing Panel (Sidebar + Active Grid) */
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl h-96 flex overflow-hidden bg-white dark:bg-neutral-950">
              {/* Left Provider Navigation Sidebar */}
              <div className="w-56 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex flex-col shrink-0">
                <div className="p-2 border-b border-neutral-200 dark:border-neutral-800">
                  <input
                    type="text"
                    value={providerSearch}
                    onChange={(e) => setProviderSearch(e.target.value)}
                    placeholder={`Search ${USER_PROVIDERS_LIST.length} providers...`}
                    className="w-full h-8 px-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs outline-none"
                  />
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {USER_PROVIDERS_LIST.filter((p) =>
                    p.name.toLowerCase().includes(providerSearch.toLowerCase())
                  ).map((p) => {
                    const isSelected = activeProviderId === p.id;
                    const selCount = Object.values(selectedByProvider[p.id] || {}).filter(Boolean).length;

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActiveProviderId(p.id);
                          setModelSearch("");
                        }}
                        className={`p-2.5 flex items-center justify-between cursor-pointer border-l-3 transition-colors ${
                          isSelected
                            ? "bg-white dark:bg-neutral-900 border-l-teal-600 font-bold"
                            : "border-l-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="w-4 h-4 rounded flex items-center justify-center text-white font-bold text-[9px] shrink-0"
                            style={{ backgroundColor: p.color }}
                          >
                            {p.name[0]}
                          </div>
                          <span className="text-xs text-neutral-800 dark:text-neutral-200 truncate">
                            {p.name}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            selCount > 0
                              ? "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                              : "text-neutral-400 bg-neutral-100 dark:bg-neutral-800"
                          }`}
                        >
                          {selCount > 0 ? selCount : p.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Active Provider Models Grid */}
              <div className="flex-1 flex flex-col min-w-0">
                {(() => {
                  const activeProv = USER_PROVIDERS_LIST.find((x) => x.id === activeProviderId);
                  const catalogList = activeProv ? USER_FULL_CATALOG[activeProv.id] || [] : [];
                  const filteredList = catalogList.filter((m) =>
                    m.toLowerCase().includes(modelSearch.toLowerCase())
                  );
                  const activeSelectedMap = selectedByProvider[activeProviderId] || {};

                  return (
                    <>
                      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 bg-neutral-50/50 dark:bg-neutral-900/30">
                        <div className="font-bold text-xs text-neutral-900 dark:text-white">
                          {activeProv?.name} ·{" "}
                          <span className="font-normal text-neutral-400">
                            {catalogList.length} models in catalog
                          </span>
                        </div>

                        {accessMode === "selected" && activeProv && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const allMap: Record<string, boolean> = { ...activeSelectedMap };
                                filteredList.forEach((mName) => (allMap[mName] = true));
                                setSelectedByProvider((prev) => ({
                                  ...prev,
                                  [activeProv.id]: allMap,
                                }));
                              }}
                              className="px-2.5 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs font-semibold hover:bg-neutral-100 cursor-pointer"
                            >
                              Select all
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedByProvider((prev) => ({
                                  ...prev,
                                  [activeProv.id]: {},
                                }));
                              }}
                              className="px-2.5 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs font-semibold hover:bg-neutral-100 cursor-pointer text-rose-600"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="p-2 border-b border-neutral-200 dark:border-neutral-800">
                        <input
                          type="text"
                          value={modelSearch}
                          onChange={(e) => setModelSearch(e.target.value)}
                          placeholder={`Search ${activeProv?.name} models by name...`}
                          className="w-full h-8 px-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs outline-none"
                        />
                      </div>

                      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scrollbar align-content-start">
                        {filteredList.map((mName) => {
                          const isChecked = accessMode === "all" || !!activeSelectedMap[mName];
                          const infoKey = `active-${mName}`;
                          const isInfoOpen = infoOpenKey === infoKey;

                          return (
                            <div
                              key={mName}
                              onClick={() => {
                                if (accessMode === "all" || !activeProv) return;
                                setSelectedByProvider((prev) => ({
                                  ...prev,
                                  [activeProv.id]: {
                                    ...(prev[activeProv.id] || {}),
                                    [mName]: !isChecked,
                                  },
                                }));
                              }}
                              className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                                isChecked
                                  ? "bg-teal-50/60 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800"
                                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  readOnly
                                  disabled={accessMode === "all"}
                                  className="w-4 h-4 text-teal-600 rounded cursor-pointer shrink-0"
                                />
                                <span className="font-mono text-xs font-semibold truncate text-neutral-900 dark:text-white">
                                  {mName}
                                </span>
                              </div>

                              <div className="relative shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInfoOpenKey(isInfoOpen ? null : infoKey);
                                  }}
                                  className="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                                >
                                  i
                                </button>
                                {isInfoOpen && (
                                  <div className="absolute right-0 top-6 w-56 p-2.5 bg-neutral-900 text-white rounded-lg text-[11px] shadow-2xl z-50 animate-fadeIn font-sans">
                                    {getModelInfoText(mName)}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: BUDGET CONFIGURATION */}
      {stepIndex === 2 && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Budget Configuration</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <input
                type="checkbox"
                checked={unlimitedBudget}
                onChange={() => setUnlimitedBudget(!unlimitedBudget)}
                className="w-4 h-4 text-neutral-900 rounded cursor-pointer"
              />
              <span>Unlimited Budget</span>
            </label>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-3 transition-opacity ${
              unlimitedBudget ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="space-y-1">
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                Max Budget ($ USD) {!unlimitedBudget && <span className="text-rose-500">*</span>}
              </label>
              <input
                type="number"
                disabled={unlimitedBudget}
                value={unlimitedBudget ? "" : maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="500"
                className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                Soft Budget ($ USD)
              </label>
              <input
                type="number"
                disabled={unlimitedBudget}
                value={unlimitedBudget ? "" : softBudget}
                onChange={(e) => setSoftBudget(e.target.value)}
                placeholder="400"
                className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                Budget Reset Duration
              </label>
              <select
                disabled={unlimitedBudget}
                value={resetDuration}
                onChange={(e) => setResetDuration(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Daily">Daily</option>
                <option value="Lifetime">Lifetime</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
              Budget Notification Email
            </label>
            <div className="p-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 rounded-lg flex flex-wrap items-center gap-1.5 min-h-[40px]">
              {emailChipsList.map((emailItem) => (
                <span
                  key={emailItem}
                  className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium text-xs flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-700"
                >
                  {emailItem}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-600"
                    onClick={() => setEmailChipsList(emailChipsList.filter((e) => e !== emailItem))}
                  />
                </span>
              ))}
              <input
                type="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = emailDraft.trim();
                    if (val && !emailChipsList.includes(val)) {
                      setEmailChipsList([...emailChipsList, val]);
                      setEmailDraft("");
                    }
                  }
                }}
                placeholder={emailChipsList.length === 0 ? "Add email and press Enter..." : "Add email..."}
                className="flex-1 min-w-[140px] bg-transparent text-xs text-neutral-900 dark:text-white outline-none py-0.5"
              />
            </div>
            <span className="text-[11px] text-neutral-400 block">
              Recipients receive email notifications when Soft Budget or Maximum Budget is reached. Press Enter to add.
            </span>
          </div>
        </div>
      )}

      {/* Stepper Navigation Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
            className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold disabled:opacity-40 cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {stepIndex < 2 ? (
          <button
            type="button"
            onClick={() => {
              if (stepIndex === 0 && !isStep0Valid) {
                setTouched(true);
                toast.error("Please enter a valid Name and Email Address.");
                return;
              }
              if (stepIndex === 1 && !isStep1Valid) {
                toast.error("Please select at least one model.");
                return;
              }
              setStepIndex((prev) => Math.min(2, prev + 1));
            }}
            className="h-10 px-5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-2xs cursor-pointer"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="h-10 px-5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{mode === "edit" ? "Save Changes" : "Invite User"}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default UserForm;
