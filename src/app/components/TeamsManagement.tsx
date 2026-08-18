import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  MoreVertical, 
  Eye, 
  Edit3, 
  RotateCw, 
  Ban, 
  Trash2, 
  Copy, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Cpu, 
  Users, 
  AlertTriangle, 
  X, 
  HelpCircle,
  Clock,
  Activity,
  Sliders,
  Columns3,
  BarChart3,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Lock,
  Globe,
  Tag,
  FileText,
  DollarSign,
  TrendingUp,
  KeyRound,
  CopyPlus,
  Archive,
  Database,
  SearchCode,
  Bot,
  Layers,
  Settings as SettingsIcon,
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  Code,
  Network,
  ListFilter,
  Maximize2,
  Minimize2,
  Save,
  CheckSquare,
  Building2
} from "lucide-react";
import { toast } from "sonner";
import { 
  PageHeader, 
  SearchBar, 
  IconButton, 
  Pagination, 
  PrimaryButton, 
  SecondaryButton,
  ColumnVisibilityPanel, 
  type ColumnConfig
} from "./hb/listing";

// Helper: Format Date for Display
const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
};

// --- Team Interfaces ---
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  userId: string;
  role: "Team Admin" | "Manager" | "Developer" | "Viewer" | "Custom Role";
  models: string[];
  budget: number;
  currentSpend: number;
  status: "Active" | "Suspended" | "Pending";
  lastActive: string;
  addedDate: string;
}

export interface TeamVirtualKeyRef {
  id: string;
  alias: string;
  keyId: string;
  owner: string;
  keyType: "AI APIs" | "Management" | "Full Access";
  models: string[];
  budget: number;
  currentSpend: number;
  status: "Active" | "Near Limit" | "Blocked" | "Expired";
  createdOn: string;
  lastUsed: string;
}

export interface AssignedProviderConfig {
  provider: string;
  selectedModels: string[];
}

export interface TeamItem {
  id: string;
  teamId: string;
  name: string;
  description: string;
  owner: string;
  ownerEmail: string;
  membersCount: number;
  virtualKeysCount: number;
  accessGroupsCount: number;
  currentSpend: number;
  maxBudget: number; // 0 = Unlimited
  tpmLimit: number;
  rpmLimit: number;
  budgetDuration: "Monthly" | "Quarterly" | "Annual" | "Infinite";
  softBudgetPercent: number;
  status: "Active" | "Inactive" | "Near Budget" | "Suspended";
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  assignedProviders: AssignedProviderConfig[];
  allowedModels: string[];
  membersList: TeamMember[];
  keysList: TeamVirtualKeyRef[];
  policies: string[];
  guardrails: string[];
  vectorStores: string[];
  searchTools: string[];
  mcpServers: string[];
  agents: string[];
  loggingIntegration: string;
  callbackUrl?: string;
  alertEmails?: string[];
}

// Available Providers & Models Dictionary matching exact screenshots
export const ALL_PROVIDER_MODELS: Record<string, { id: string; name: string; tag: string }[]> = {
  OpenAI: [
    { id: "GPT-4o", name: "GPT-4o", tag: "Multimodal" },
    { id: "GPT-4.1", name: "GPT-4.1", tag: "Flagship" },
    { id: "GPT-4 Turbo", name: "GPT-4 Turbo", tag: "Flagship" },
    { id: "GPT-4o Mini", name: "GPT-4o Mini", tag: "Fast" },
    { id: "o3", name: "o3", tag: "Reasoning" },
    { id: "o4-mini", name: "o4-mini", tag: "Reasoning" },
  ],
  Anthropic: [
    { id: "Claude 3.5 Sonnet", name: "Claude 3.5 Sonnet", tag: "Multimodal" },
    { id: "Claude 3.5 Haiku", name: "Claude 3.5 Haiku", tag: "Fast" },
    { id: "Claude 3 Opus", name: "Claude 3 Opus", tag: "Flagship" },
  ],
  "Azure AI": [
    { id: "Azure GPT-4o", name: "Azure GPT-4o", tag: "Multimodal" },
    { id: "Azure GPT-3.5 Turbo", name: "Azure GPT-3.5 Turbo", tag: "Fast" },
  ],
  DeepSeek: [
    { id: "DeepSeek R1", name: "DeepSeek R1", tag: "Reasoning" },
    { id: "DeepSeek V3", name: "DeepSeek V3", tag: "Flagship" },
  ],
  Ollama: [
    { id: "Llama 3.3 70B", name: "Llama 3.3 70B", tag: "Open Weight" },
    { id: "Qwen 2.5 Coder", name: "Qwen 2.5 Coder", tag: "Code" },
  ],
  Gemini: [
    { id: "Gemini 2.5 Pro", name: "Gemini 2.5 Pro", tag: "Multimodal" },
    { id: "Gemini 1.5 Flash", name: "Gemini 1.5 Flash", tag: "Fast" },
  ],
};

// Provider Info & Catalog Setup matching Add Team.dc.html
export interface ProviderInfo {
  id: string;
  name: string;
  count: number;
  color: string;
}

export const PROVIDERS_LIST: ProviderInfo[] = [
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

const buildFullCatalog = (): Record<string, string[]> => {
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
  ["huggingface", "openrouter", "together", "fireworks", "replicate"].forEach((id) => {
    const p = PROVIDERS_LIST.find((x) => x.id === id);
    if (!p) return;
    hub[id] = Array.from({ length: p.count }, (_, i) => {
      const org = ORGS[i % ORGS.length];
      const fam = FAMILIES[(i * 3) % FAMILIES.length].split("-")[0];
      const size = SIZES[(i * 7) % SIZES.length];
      const variant = VARIANTS[(i * 11) % VARIANTS.length];
      return `${org}/${fam}-${size}b-${variant}`;
    });
  });

  return { ...curated, ...hub };
};

export const FULL_CATALOG = buildFullCatalog();

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

// Available System Users Pool for Add User Screen
const AVAILABLE_SYSTEM_USERS = [
  { id: "usr-101", name: "John Doe", email: "john.doe@company.com", role: "Team Admin", department: "Engineering" },
  { id: "usr-102", name: "Sarah Connor", email: "sarah.connor@company.com", role: "Manager", department: "Product" },
  { id: "usr-103", name: "Alex Dev", email: "alex.dev@company.com", role: "Developer", department: "AI Core" },
  { id: "usr-104", name: "Michael Scott", email: "michael.scott@company.com", role: "Manager", department: "Sales Operations" },
  { id: "usr-105", name: "Jane Smith", email: "jane.smith@company.com", role: "Developer", department: "Backend" },
  { id: "usr-106", name: "David Miller", email: "david.miller@company.com", role: "Viewer", department: "Analytics" },
  { id: "usr-107", name: "Elena Rostova", email: "elena.rostova@company.com", role: "Developer", department: "ML Research" },
];

// Initial Mock Teams Data
const mockTeamsData: TeamItem[] = [
  {
    id: "team-1",
    teamId: "tm-882194",
    name: "Core Engineering & AI Lab",
    description: "Primary engineering unit building core gateway features, LLM orchestration, and RAG pipelines.",
    owner: "John Doe",
    ownerEmail: "john.doe@company.com",
    membersCount: 5,
    virtualKeysCount: 3,
    accessGroupsCount: 4,
    currentSpend: 2450.00,
    maxBudget: 5000.00,
    tpmLimit: 500000,
    rpmLimit: 5000,
    budgetDuration: "Monthly",
    softBudgetPercent: 80,
    status: "Active",
    createdDate: "Jul 10, 2026",
    createdBy: "Super Admin",
    updatedDate: "Jul 22, 2026",
    assignedProviders: [
      { provider: "OpenAI", selectedModels: ["GPT-4o", "GPT-4o Mini"] },
      { provider: "Anthropic", selectedModels: ["Claude 3.5 Sonnet"] },
    ],
    allowedModels: ["GPT-4o", "GPT-4o Mini", "Claude 3.5 Sonnet"],
    membersList: [
      { id: "m-1", name: "John Doe", email: "john.doe@company.com", userId: "usr-101", role: "Team Admin", models: ["GPT-4o", "GPT-4o Mini"], budget: 2000, currentSpend: 1100, status: "Active", lastActive: "Just now", addedDate: "Jul 10, 2026" },
      { id: "m-2", name: "Alex Dev", email: "alex.dev@company.com", userId: "usr-103", role: "Developer", models: ["Claude 3.5 Sonnet"], budget: 1500, currentSpend: 850, status: "Active", lastActive: "2 hours ago", addedDate: "Jul 12, 2026" },
      { id: "m-3", name: "Elena Rostova", email: "elena.rostova@company.com", userId: "usr-107", role: "Developer", models: ["GPT-4o"], budget: 1500, currentSpend: 500, status: "Active", lastActive: "1 day ago", addedDate: "Jul 15, 2026" },
    ],
    keysList: [
      { id: "vk-101", alias: "crm-integration-key", keyId: "sk-gate-99218...", owner: "john.doe@company.com", keyType: "AI APIs", models: ["GPT-4o", "GPT-4o Mini"], budget: 3000.00, currentSpend: 1450.00, status: "Active", createdOn: "Jul 15, 2026", lastUsed: "Jul 25, 2026 2:15 PM" }
    ],
    policies: ["Zero Retention", "PII Redaction"],
    guardrails: ["Toxicity Filter", "Prompt Injection Shield"],
    vectorStores: ["Pinecone Prod", "Qdrant Cluster"],
    searchTools: ["Tavily Search"],
    mcpServers: ["GitHub MCP Server"],
    agents: ["Customer Support Bot"],
    loggingIntegration: "Datadog APM",
    callbackUrl: "https://api.company.com/webhooks/teams",
    alertEmails: ["john.doe@company.com"]
  },
  {
    id: "team-2",
    teamId: "tm-551029",
    name: "DevOps & Infrastructure",
    description: "Automated deployment, Kubernetes operator maintenance, and continuous integration pipelines.",
    owner: "Super Admin",
    ownerEmail: "superadmin@spinecloudiq.com",
    membersCount: 4,
    virtualKeysCount: 2,
    accessGroupsCount: 2,
    currentSpend: 4680.00,
    maxBudget: 5000.00,
    tpmLimit: 1000000,
    rpmLimit: 10000,
    budgetDuration: "Monthly",
    softBudgetPercent: 90,
    status: "Near Budget",
    createdDate: "Jul 01, 2026",
    createdBy: "Auto Provisioner",
    updatedDate: "Jul 23, 2026",
    assignedProviders: [
      { provider: "OpenAI", selectedModels: ["GPT-4.1"] },
      { provider: "DeepSeek", selectedModels: ["DeepSeek R1"] },
    ],
    allowedModels: ["GPT-4.1", "DeepSeek R1"],
    membersList: [
      { id: "m-4", name: "Super Admin", email: "superadmin@spinecloudiq.com", userId: "usr-110", role: "Team Admin", models: ["GPT-4.1"], budget: 5000, currentSpend: 4680.00, status: "Active", lastActive: "10 mins ago", addedDate: "Jul 01, 2026" }
    ],
    keysList: [
      { id: "vk-102", alias: "devops-auto-deploy", keyId: "8f9a2b3c4d5e...", owner: "superadmin@spinecloudiq.com", keyType: "AI APIs", models: ["GPT-4.1"], budget: 1200.00, currentSpend: 1150.00, status: "Near Limit", createdOn: "Jul 18, 2026", lastUsed: "Jul 24, 2026 5:10 PM" }
    ],
    policies: ["Cost Guard"],
    guardrails: ["Content Safety"],
    vectorStores: ["Weaviate Cloud"],
    searchTools: ["Google Serper"],
    mcpServers: ["Kubernetes Operator MCP"],
    agents: ["Deployment Assistant"],
    loggingIntegration: "Datadog APM",
    callbackUrl: "https://devops.company.com/hooks/teams",
  }
];

// --- Reusable MultiEmailInput Component ---
export interface MultiEmailInputProps {
  emails: string[];
  onChange: (emails: string[]) => void;
  label?: string;
  helpText?: string;
}

export function MultiEmailInput({ emails, onChange, label = "Notification Emails", helpText }: MultiEmailInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      const trimmed = inputValue.trim().replace(/,/g, "");
      if (trimmed && !emails.includes(trimmed)) {
        onChange([...emails, trimmed]);
        setInputValue("");
      }
    }
  };

  const handleRemove = (emailToRemove: string) => {
    onChange(emails.filter((e) => e !== emailToRemove));
  };

  return (
    <div className="space-y-1 text-xs">
      {label && <label className="block font-semibold text-neutral-800 dark:text-neutral-200">{label}</label>}
      <div className="p-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl flex flex-wrap items-center gap-1.5 min-h-[40px]">
        {emails.map((e) => (
          <span key={e} className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium text-xs flex items-center gap-1 border border-neutral-200 dark:border-neutral-700">
            {e}
            <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => handleRemove(e)} />
          </span>
        ))}
        <input
          type="email"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            const trimmed = inputValue.trim().replace(/,/g, "");
            if (trimmed && !emails.includes(trimmed)) {
              onChange([...emails, trimmed]);
              setInputValue("");
            }
          }}
          placeholder={emails.length === 0 ? "Type email and press Enter..." : "Add email..."}
          className="flex-1 min-w-[140px] bg-transparent text-xs text-neutral-900 dark:text-white focus:outline-none py-0.5"
        />
      </div>
      {helpText && <p className="text-[11px] text-neutral-400 mt-1">{helpText}</p>}
    </div>
  );
}

// --- Reusable Provider & Model Assignment Component (Matching Screenshots 1 & 2!) ---
interface ProviderModelSelectorProps {
  assignedProviders: AssignedProviderConfig[];
  onChange: (updated: AssignedProviderConfig[]) => void;
}

function ProviderModelSelector({ assignedProviders, onChange }: ProviderModelSelectorProps) {
  const [openDropdownProvider, setOpenDropdownProvider] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownProvider(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableProvidersToSelect = useMemo(() => {
    return Object.keys(ALL_PROVIDER_MODELS).filter(
      (prov) => !assignedProviders.some((p) => p.provider === prov)
    );
  }, [assignedProviders]);

  const handleAddProvider = (provName: string) => {
    const defaultModels = ALL_PROVIDER_MODELS[provName]?.slice(0, 2).map((m) => m.id) || [];
    onChange([...assignedProviders, { provider: provName, selectedModels: defaultModels }]);
  };

  const handleRemoveProvider = (provName: string) => {
    onChange(assignedProviders.filter((p) => p.provider !== provName));
  };

  const handleToggleModel = (provName: string, modelId: string) => {
    onChange(
      assignedProviders.map((p) => {
        if (p.provider !== provName) return p;
        const exists = p.selectedModels.includes(modelId);
        const updated = exists
          ? p.selectedModels.filter((id) => id !== modelId)
          : [...p.selectedModels, modelId];
        return { ...p, selectedModels: updated };
      })
    );
  };

  const handleSelectAllModels = (provName: string) => {
    const all = ALL_PROVIDER_MODELS[provName]?.map((m) => m.id) || [];
    onChange(
      assignedProviders.map((p) => (p.provider === provName ? { ...p, selectedModels: all } : p))
    );
  };

  const handleClearAllModels = (provName: string) => {
    onChange(
      assignedProviders.map((p) => (p.provider === provName ? { ...p, selectedModels: [] } : p))
    );
  };

  return (
    <div className="space-y-4" ref={dropdownRef}>
      {assignedProviders.map((config) => {
        const providerName = config.provider;
        const selected = config.selectedModels;
        const allModels = ALL_PROVIDER_MODELS[providerName] || [];
        const search = (searchTerm[providerName] || "").toLowerCase();
        const filteredModels = allModels.filter((m) => m.name.toLowerCase().includes(search));
        const isOpen = openDropdownProvider === providerName;

        return (
          <div
            key={providerName}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-2xs space-y-3 relative"
          >
            {/* Top Bar: Provider Name + Badge + Remove Provider */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-neutral-900 dark:text-white">
                  {providerName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80">
                  {selected.length} {selected.length === 1 ? "Model" : "Models"} Selected
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveProvider(providerName)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Provider</span>
              </button>
            </div>

            {/* Choose Models Input Field */}
            <div className="space-y-1 relative">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Choose Models
              </label>

              <div
                onClick={() => setOpenDropdownProvider(isOpen ? null : providerName)}
                className="w-full min-h-[44px] p-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl flex flex-wrap items-center gap-1.5 cursor-pointer hover:border-purple-400 transition-all shadow-2xs"
              >
                {/* Selected Model Chips */}
                {selected.map((mId) => (
                  <span
                    key={mId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200/60 shadow-2xs"
                  >
                    <span>{mId}</span>
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-rose-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleModel(providerName, mId);
                      }}
                    />
                  </span>
                ))}

                {/* Search Input inside chip container */}
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchTerm[providerName] || ""}
                  onChange={(e) => setSearchTerm({ ...searchTerm, [providerName]: e.target.value })}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownProvider(providerName);
                  }}
                  className="flex-1 min-w-[120px] text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 bg-transparent focus:outline-none py-1"
                />

                <div className="flex items-center gap-1 ml-auto text-neutral-400 shrink-0">
                  {selected.length > 0 && (
                    <X
                      className="w-3.5 h-3.5 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearAllModels(providerName);
                      }}
                    />
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </div>

              {/* Floating Dropdown Menu (Exact match with Screenshot 1!) */}
              {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-3 space-y-2 animate-fadeIn max-h-64 overflow-y-auto custom-scrollbar">
                  {/* Top Action Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800 text-xs font-semibold">
                    <span className="text-neutral-500 font-mono">
                      {selected.length} of {allModels.length} Selected
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectAllModels(providerName)}
                        className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => handleClearAllModels(providerName)}
                        className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* List of Models with Checkboxes and Tag Badges */}
                  <div className="space-y-0.5">
                    {filteredModels.map((m) => {
                      const isChecked = selected.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleToggleModel(providerName, m.id)}
                          className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-100 font-semibold"
                              : "hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                            <span>{m.name}</span>
                          </div>

                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800">
                            {m.tag}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Add Provider Button / Dropdown */}
      {availableProvidersToSelect.length > 0 && (
        <div className="flex items-center gap-2 pt-1">
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleAddProvider(e.target.value);
                e.target.value = "";
              }
            }}
            defaultValue=""
            className="h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
          >
            <option value="" disabled>
              + Add Provider
            </option>
            {availableProvidersToSelect.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

// --- Reusable Team Members Selector Component ---
interface TeamMembersSelectorProps {
  members: TeamMember[];
  availableUsers: typeof AVAILABLE_SYSTEM_USERS;
  onChange: (updatedMembers: TeamMember[]) => void;
  onInviteUserClick: () => void;
}

function TeamMembersSelector({
  members,
  availableUsers,
  onChange,
  onInviteUserClick,
}: TeamMembersSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter available users based on search term (Name, Email, User ID)
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return availableUsers;
    return availableUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.id.toLowerCase().includes(term)
    );
  }, [availableUsers, searchTerm]);

  const isUserSelected = (userEmail: string) => {
    return members.some((m) => m.email.toLowerCase() === userEmail.toLowerCase());
  };

  const handleToggleUser = (user: typeof AVAILABLE_SYSTEM_USERS[0]) => {
    if (isUserSelected(user.email)) {
      const mem = members.find((m) => m.email.toLowerCase() === user.email.toLowerCase());
      if (mem) setMemberToRemove(mem);
    } else {
      const todayDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const newMember: TeamMember = {
        id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: user.name,
        email: user.email,
        userId: user.id,
        role: "Member", // Default role
        models: [],
        budget: 0,
        currentSpend: 0,
        status: "Active",
        lastActive: "Just now",
        addedDate: todayDate,
      };
      onChange([...members, newMember]);
    }
  };

  const handleUpdateRole = (memberId: string, newRole: string) => {
    onChange(
      members.map((m) => (m.id === memberId ? { ...m, role: newRole as any } : m))
    );
  };

  const confirmRemoveMember = () => {
    if (!memberToRemove) return;
    onChange(members.filter((m) => m.id !== memberToRemove.id));
    toast.success(`Removed "${memberToRemove.name}" from team selection.`);
    setMemberToRemove(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Search & Multi-Select Input Dropdown */}
      <div className="space-y-1.5 relative" ref={dropdownRef}>
        <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          Assigned Members
        </label>
        
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              placeholder="Search members by name, email, or user ID..."
              className="w-full h-10 pl-9 pr-8 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-primary-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown Options */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const selected = isUserSelected(user.email);
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleToggleUser(user)}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        selected
                          ? "bg-primary-50/70 dark:bg-primary-950/40 text-primary-900 dark:text-primary-100"
                          : "hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => {}} // div onClick handles toggle
                          className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold truncate text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                              {user.id}
                            </span>
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                            {user.email} &bull; <span className="italic">{user.department || user.role}</span>
                          </p>
                        </div>
                      </div>

                      {selected && (
                        <span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 px-2 py-0.5 rounded-full shrink-0">
                          Selected
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center space-y-2">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    No organization members match "{searchTerm}".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onInviteUserClick();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Invite New User</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Members Chips / Removable Cards */}
      {members.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              Selected Team Members ({members.length})
            </span>
            <span className="text-[11px] text-neutral-400">
              Assign team roles below
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-1 custom-scrollbar">
            {members.map((mem) => (
              <div
                key={mem.id}
                className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl gap-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                    {getInitials(mem.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                      {mem.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {mem.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Team Role Assignment Selector */}
                  <select
                    value={mem.role || "Member"}
                    onChange={(e) => handleUpdateRole(mem.id, e.target.value)}
                    className="h-7 px-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-primary-500 cursor-pointer"
                    title="Assign Team Role"
                  >
                    <option value="Member">Member</option>
                    <option value="Team Admin">Team Admin</option>
                  </select>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => setMemberToRemove(mem)}
                    className="p-1 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                    title="Remove member"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl text-center space-y-2">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            No organization members are available for this team yet.
          </p>
          <button
            type="button"
            onClick={onInviteUserClick}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Invite First User</span>
          </button>
        </div>
      )}

      {/* Action Button: + Invite New User */}
      <div className="pt-1 flex items-center justify-between">
        <button
          type="button"
          onClick={onInviteUserClick}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Invite New User</span>
        </button>
        <span className="text-[11px] text-neutral-400">
          User will be automatically invited & assigned
        </span>
      </div>

      {/* MEMBER REMOVAL CONFIRMATION DIALOG */}
      {memberToRemove && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-sm w-full p-5 space-y-4 animate-scaleUp text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Remove {memberToRemove.name}?
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Confirm team membership removal
                </p>
              </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Remove <strong className="text-neutral-900 dark:text-white">{memberToRemove.name}</strong> from this team? This only removes their association with this team and will not delete their user account.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setMemberToRemove(null)}
                className="px-3.5 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemoveMember}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg font-medium transition-colors shadow-xs cursor-pointer text-xs"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeamsManagement() {
  const [teams, setTeams] = useState<TeamItem[]>(mockTeamsData);
  // View State: "list" | "detail" | "create" | "edit" | "add-user"
  const [viewState, setViewState] = useState<"list" | "detail" | "create" | "edit" | "add-user">("list");
  const [selectedTeam, setSelectedTeam] = useState<TeamItem | null>(null);

  // Detail Sub-Tab State
  const [detailTab, setDetailTab] = useState<"overview" | "virtual-keys" | "members">("overview");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterModel, setFilterModel] = useState("All");
  const [appliedStatus, setAppliedStatus] = useState("All");
  const [appliedModel, setAppliedModel] = useState("All");

  // Export Popup Dialog State
  const [showExportModal, setShowExportModal] = useState(false);

  // Sorting & Pagination
  const [sortField, setSortField] = useState<keyof TeamItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showSummary, setShowSummary] = useState(true);

  // Action Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTeam, setDeletingTeam] = useState<TeamItem | null>(null);

  // Column Visibility Panel State
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const columnAnchorRef = useRef<HTMLDivElement>(null);

  const allColumns: ColumnConfig[] = [
    { key: "name", label: "Team Name" },
    { key: "members", label: "Members" },
    { key: "spend", label: "Spend / Budget" },
    { key: "createdDate", label: "Created Date" },
    { key: "status", label: "Status" },
  ];

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    members: true,
    spend: true,
    createdDate: true,
    status: true,
  });

  const toggleColumn = (key: string) => {
    if (key === "name" || key === "status") return;
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Reset view to listing on navigation event
  useEffect(() => {
    const handleReset = (e: any) => {
      if (e.detail?.pageId === "teams" || e.detail?.pageId === "ai-teams") {
        setViewState("list");
        setSelectedTeam(null);
      }
    };
    window.addEventListener("reset-view-state", handleReset);
    return () => window.removeEventListener("reset-view-state", handleReset);
  }, []);

  // --- Create / Edit Form Stepper State (matching Add Team.dc.html) ---
  const [stepIndex, setStepIndex] = useState(0);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAccessMode, setFormAccessMode] = useState<"all" | "selected">("all");
  const [formSelectedByProvider, setFormSelectedByProvider] = useState<Record<string, Record<string, boolean>>>({
    openai: { "gpt-4o": true, "gpt-4o-mini": true }
  });
  const [formGlobalSearch, setFormGlobalSearch] = useState("");
  const [formProviderSearch, setFormProviderSearch] = useState("");
  const [formModelSearch, setFormModelSearch] = useState("");
  const [formActiveProviderId, setFormActiveProviderId] = useState("openai");
  const [formInfoOpenKey, setFormInfoOpenKey] = useState<string | null>(null);
  const [formExpandedSummaryProviderId, setFormExpandedSummaryProviderId] = useState<string | null>(null);

  const [formMemberSearch, setFormMemberSearch] = useState("");
  const [formMemberDropdownOpen, setFormMemberDropdownOpen] = useState(false);
  const [formMembersList, setFormMembersList] = useState<TeamMember[]>([]);
  const [formShowInvitePanel, setFormShowInvitePanel] = useState(false);
  const [formInviteName, setFormInviteName] = useState("");
  const [formInviteEmail, setFormInviteEmail] = useState("");

  const [formUnlimitedBudget, setFormUnlimitedBudget] = useState(false);
  const [formMaxBudget, setFormMaxBudget] = useState<number>(5000);
  const [formSoftBudget, setFormSoftBudget] = useState<number>(80);
  const [formBudgetDuration, setFormBudgetDuration] = useState<string>("Lifetime");
  const [formAlertEmails, setFormAlertEmails] = useState<string[]>(["john.doe@company.com"]);
  const [formEmailDraft, setFormEmailDraft] = useState("");

  const [formUnlimitedRateLimits, setFormUnlimitedRateLimits] = useState(false);
  const [formTpmLimit, setFormTpmLimit] = useState<number>(500000);
  const [formRpmLimit, setFormRpmLimit] = useState<number>(5000);

  // --- Inline Invite User Modal State in Team Form ---
  const [showInviteModalInTeamForm, setShowInviteModalInTeamForm] = useState(false);
  const [newUserNameInForm, setNewUserNameInForm] = useState("");
  const [newUserEmailInForm, setNewUserEmailInForm] = useState("");
  const [newUserRoleInForm, setNewUserRoleInForm] = useState("Member");

  const handleInviteUserSubmitInForm = () => {
    if (!newUserNameInForm.trim() || !newUserEmailInForm.trim()) return;

    const newUserId = `usr-${Math.floor(100000 + Math.random() * 900000)}`;
    const newSysUser = {
      id: newUserId,
      name: newUserNameInForm.trim(),
      email: newUserEmailInForm.trim(),
      role: newUserRoleInForm,
      department: "Engineering",
    };

    setAvailableSystemUsersList((prev) => [newSysUser, ...prev]);

    const todayDate = formatDateDisplay(new Date().toISOString().split("T")[0]);
    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: newUserNameInForm.trim(),
      email: newUserEmailInForm.trim(),
      userId: newUserId,
      role: newUserRoleInForm as any,
      models: [],
      budget: 0,
      currentSpend: 0,
      status: "Active",
      lastActive: "Just now",
      addedDate: todayDate,
    };

    setFormMembersList((prev) => [...prev, newMember]);
    toast.success(`User "${newUserNameInForm.trim()}" invited and assigned to team!`);

    setShowInviteModalInTeamForm(false);
    setNewUserNameInForm("");
    setNewUserEmailInForm("");
    setNewUserRoleInForm("Member");
  };

  // --- Add User Dedicated Screen State ---
  const [availableSystemUsersList, setAvailableSystemUsersList] = useState(AVAILABLE_SYSTEM_USERS);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Open Dedicated Create Team Page
  const handleOpenCreatePage = () => {
    setSelectedTeam(null);
    setStepIndex(0);
    setFormName("");
    setFormDescription("");
    setFormAccessMode("all");
    setFormSelectedByProvider({ openai: { "gpt-4o": true, "gpt-4o-mini": true } });
    setFormGlobalSearch("");
    setFormProviderSearch("");
    setFormModelSearch("");
    setFormActiveProviderId("openai");
    setFormInfoOpenKey(null);
    setFormExpandedSummaryProviderId(null);
    setFormMemberSearch("");
    setFormMemberDropdownOpen(false);
    setFormShowInvitePanel(false);
    setFormInviteName("");
    setFormInviteEmail("");
    setShowInviteModalInTeamForm(false);
    setNewUserNameInForm("");
    setNewUserEmailInForm("");
    setNewUserRoleInForm("Member");
    setFormUnlimitedBudget(false);
    setFormMaxBudget(5000);
    setFormSoftBudget(80);
    setFormBudgetDuration("Lifetime");
    setFormAlertEmails(["john.doe@company.com"]);
    setFormEmailDraft("");
    setFormUnlimitedRateLimits(false);
    setFormTpmLimit(500000);
    setFormRpmLimit(5000);

    const todayDate = formatDateDisplay(new Date().toISOString().split("T")[0]);
    setFormMembersList([
      { id: "m-101", name: "atindra.ojha+user", email: "atindra.ojha+user@hiddenbrains.in", userId: "usr-101", role: "Team Admin", models: ["GPT-4o"], budget: 5000, currentSpend: 0, status: "Active", lastActive: "Just now", addedDate: todayDate },
      { id: "m-102", name: "unlimited", email: "unlimited@yopmail.com", userId: "usr-102", role: "Developer", models: ["Claude 3.5 Sonnet"], budget: 2000, currentSpend: 0, status: "Active", lastActive: "Just now", addedDate: todayDate }
    ]);
    setViewState("create");
  };

  // Open Dedicated Edit Team Page
  const handleOpenEditPage = (team: TeamItem) => {
    setSelectedTeam(team);
    setStepIndex(0);
    setFormName(team.name);
    setFormDescription(team.description || "");

    const isAll = !team.assignedProviders || team.assignedProviders.length === 0 || team.allowedModels?.includes("All Available Models");
    setFormAccessMode(isAll ? "all" : "selected");

    const initialSel: Record<string, Record<string, boolean>> = {};
    if (team.assignedProviders && team.assignedProviders.length > 0) {
      team.assignedProviders.forEach((p) => {
        const pObj = PROVIDERS_LIST.find((x) => x.name.toLowerCase() === p.provider.toLowerCase());
        const pId = pObj ? pObj.id : p.provider.toLowerCase().replace(/[^a-z0-9]/g, "");
        initialSel[pId] = {};
        p.selectedModels.forEach((m) => {
          initialSel[pId][m] = true;
        });
      });
    } else if (team.allowedModels) {
      initialSel["openai"] = {};
      team.allowedModels.forEach((m) => {
        initialSel["openai"][m] = true;
      });
    }
    setFormSelectedByProvider(initialSel);

    setFormGlobalSearch("");
    setFormProviderSearch("");
    setFormModelSearch("");
    setFormActiveProviderId("openai");
    setFormInfoOpenKey(null);
    setFormExpandedSummaryProviderId(null);
    setFormMemberSearch("");
    setFormMemberDropdownOpen(false);
    setFormShowInvitePanel(false);
    setFormInviteName("");
    setFormInviteEmail("");
    setShowInviteModalInTeamForm(false);
    setNewUserNameInForm("");
    setNewUserEmailInForm("");
    setNewUserRoleInForm("Member");

    setFormMembersList(team.membersList || []);
    setFormUnlimitedBudget(team.maxBudget === 0);
    setFormMaxBudget(team.maxBudget || 0);
    setFormSoftBudget(team.softBudgetPercent || 80);
    setFormBudgetDuration(team.budgetDuration || "Lifetime");
    setFormAlertEmails(team.alertEmails || [team.ownerEmail || "john.doe@company.com"]);
    setFormEmailDraft("");
    setFormUnlimitedRateLimits(team.tpmLimit === 0 && team.rpmLimit === 0);
    setFormTpmLimit(team.tpmLimit || 0);
    setFormRpmLimit(team.rpmLimit || 0);

    setViewState("edit");
  };

  // Save / Update Team Handler
  const handleSaveTeamForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formName.trim()) {
      toast.error("Please enter Team Name.");
      setStepIndex(0);
      return;
    }

    if (formAccessMode === "selected") {
      const selCount = Object.values(formSelectedByProvider).reduce(
        (acc, p) => acc + Object.values(p).filter(Boolean).length,
        0
      );
      if (selCount === 0) {
        toast.error("Please select at least one model before saving.");
        setStepIndex(2);
        return;
      }
    }

    const todayDate = new Date().toISOString().split("T")[0];
    const formattedDate = formatDateDisplay(todayDate);

    const assignedProvidersList: AssignedProviderConfig[] = Object.entries(formSelectedByProvider)
      .map(([pId, modelsMap]) => {
        const selectedMs = Object.keys(modelsMap).filter((m) => modelsMap[m]);
        const pObj = PROVIDERS_LIST.find((x) => x.id === pId);
        return {
          provider: pObj ? pObj.name : pId,
          selectedModels: selectedMs,
        };
      })
      .filter((p) => p.selectedModels.length > 0);

    const allowed =
      formAccessMode === "all"
        ? ["All Available Models"]
        : assignedProvidersList.flatMap((p) => p.selectedModels);

    const finalMaxBudget = formUnlimitedBudget ? 0 : Number(formMaxBudget);
    const finalTpm = formUnlimitedRateLimits ? 0 : Number(formTpmLimit);
    const finalRpm = formUnlimitedRateLimits ? 0 : Number(formRpmLimit);

    if (viewState === "edit" && selectedTeam) {
      const updatedItem: TeamItem = {
        ...selectedTeam,
        name: formName.trim(),
        description: formDescription.trim(),
        maxBudget: finalMaxBudget,
        softBudgetPercent: Number(formSoftBudget),
        budgetDuration: formBudgetDuration as any,
        tpmLimit: finalTpm,
        rpmLimit: finalRpm,
        assignedProviders: assignedProvidersList,
        allowedModels: allowed,
        updatedDate: formattedDate,
        alertEmails: formAlertEmails,
        membersList: formMembersList,
        membersCount: formMembersList.length,
      };

      setTeams((prev) => prev.map((t) => (t.id === selectedTeam.id ? updatedItem : t)));
      setSelectedTeam(updatedItem);
      toast.success(`Team "${updatedItem.name}" updated successfully!`);
    } else {
      const newTeam: TeamItem = {
        id: `team-${Date.now()}`,
        teamId: `tm-${Math.floor(100000 + Math.random() * 900000)}`,
        name: formName.trim(),
        description: formDescription.trim(),
        owner: "John Doe",
        ownerEmail: "john.doe@company.com",
        membersCount: formMembersList.length,
        virtualKeysCount: 0,
        accessGroupsCount: 0,
        currentSpend: 0,
        maxBudget: finalMaxBudget,
        softBudgetPercent: Number(formSoftBudget),
        budgetDuration: formBudgetDuration as any,
        tpmLimit: finalTpm,
        rpmLimit: finalRpm,
        status: "Active",
        createdDate: formattedDate,
        createdBy: "John Doe",
        updatedDate: formattedDate,
        assignedProviders: assignedProvidersList,
        allowedModels: allowed,
        membersList: formMembersList,
        keysList: [],
        policies: ["Zero Retention"],
        guardrails: ["Content Safety"],
        vectorStores: [],
        searchTools: [],
        mcpServers: [],
        agents: [],
        loggingIntegration: "Gateway Standard",
        alertEmails: formAlertEmails,
      };

      setTeams((prev) => [newTeam, ...prev]);
      toast.success(`Team "${newTeam.name}" created successfully!`);
    }

    setViewState("list");
  };

  // Open Dedicated Add User Screen
  const handleOpenAddUserScreen = () => {
    setSelectedUserIds([]);
    setUserSearchQuery("");
    setViewState("add-user");
  };

  // Confirm Assigning Users to Team
  const handleConfirmAssignUsers = () => {
    if (!selectedTeam || selectedUserIds.length === 0) {
      toast.error("Please select at least one user to assign.");
      return;
    }

    const todayDate = formatDateDisplay(new Date().toISOString().split("T")[0]);
    const newMembers: TeamMember[] = selectedUserIds.map((uId) => {
      const u = AVAILABLE_SYSTEM_USERS.find((item) => item.id === uId)!;
      return {
        id: `m-${Date.now()}-${uId}`,
        name: u.name,
        email: u.email,
        userId: u.id,
        role: "Developer",
        models: selectedTeam.allowedModels || ["All Models"],
        budget: 1000,
        currentSpend: 0,
        status: "Active",
        lastActive: "Just now",
        addedDate: todayDate,
      };
    });

    const updatedTeam: TeamItem = {
      ...selectedTeam,
      membersList: [...selectedTeam.membersList, ...newMembers],
      membersCount: selectedTeam.membersList.length + newMembers.length,
    };

    setTeams((prev) => prev.map((t) => (t.id === selectedTeam.id ? updatedTeam : t)));
    setSelectedTeam(updatedTeam);
    toast.success(`Assigned ${newMembers.length} user(s) to ${selectedTeam.name}.`);
    setDetailTab("members");
    setViewState("detail");
  };

  // Filtered Listing Teams
  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.owner.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query);

      const matchesStatus = appliedStatus === "All" || t.status === appliedStatus;
      const matchesModel =
        appliedModel === "All" ||
        t.allowedModels.some((m) => m.toLowerCase().includes(appliedModel.toLowerCase()));

      return matchesSearch && matchesStatus && matchesModel;
    });
  }, [teams, searchQuery, appliedStatus, appliedModel]);

  // KPI Calculations
  const kpiStats = useMemo(() => {
    const total = teams.length;
    const active = teams.filter((t) => t.status === "Active").length;
    const nearBudget = teams.filter((t) => t.status === "Near Budget").length;

    return [
      { id: "total", label: "Total Teams", value: total.toString(), subValue: `${active} Active Teams` },
      { id: "active", label: "Active Operational", value: active.toString(), subValue: "Normal Consumption" },
      { id: "budget", label: "Near Budget Limit", value: nearBudget.toString(), subValue: "Requires Review" },
      { id: "keys", label: "Total Members", value: teams.reduce((acc, t) => acc + t.membersCount, 0).toString(), subValue: "Assigned Users" },
    ];
  }, [teams]);

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6 animate-fadeIn">
      {/* ==================== VIEW 1: TEAM LISTING ==================== */}
      {viewState === "list" && (
        <>
          <PageHeader
            title="Teams Management"
            pageId="teams-management"
            action="list"
          >
            <SearchBar
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              placeholder="Search by Team Name, Owner, or Description..."
            />

            <IconButton
              icon={Filter}
              label="Filter"
              onClick={() => setShowFilterDrawer(true)}
              title="Filter Teams"
            />

            <div className="relative" ref={columnAnchorRef}>
              <IconButton
                icon={Columns3}
                label="Columns"
                onClick={() => setShowColumnPanel(!showColumnPanel)}
                title="Customize Table Columns"
              />
              {showColumnPanel && (
                <ColumnVisibilityPanel
                  isOpen={showColumnPanel}
                  onClose={() => setShowColumnPanel(false)}
                  anchorRef={columnAnchorRef as any}
                  columns={allColumns}
                  visibleColumns={visibleColumns}
                  onToggleColumn={toggleColumn}
                />
              )}
            </div>

            <IconButton
              icon={Download}
              label="Export"
              onClick={() => setShowExportModal(true)}
              title="Export Teams to CSV"
            />

            <IconButton
              icon={RefreshCw}
              label="Refresh"
              onClick={() => toast.success("Teams refreshed")}
              title="Refresh Listing"
            />

            <IconButton
              icon={showSummary ? EyeOff : BarChart3}
              label={showSummary ? "Hide Summary" : "Show Summary"}
              onClick={() => setShowSummary(!showSummary)}
              title={showSummary ? "Hide KPI Summary Cards" : "Show KPI Summary Cards"}
            />

            <PrimaryButton icon={Plus} onClick={handleOpenCreatePage}>
              Create Team
            </PrimaryButton>
          </PageHeader>

          {/* KPI Summary Cards */}
          {showSummary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 transition-all duration-300">
              {kpiStats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
                    {stat.label}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block">
                    {stat.subValue}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* HB Enterprise Table */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto min-h-[320px]">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium sticky top-0 z-10">
                  <tr>
                    {visibleColumns.name && <th className="p-4 font-medium">Team Name</th>}
                    {visibleColumns.members && <th className="p-4 font-medium">Members</th>}
                    {visibleColumns.spend && <th className="p-4 font-medium">Spend / Budget</th>}
                    {visibleColumns.createdDate && <th className="p-4 font-medium">Created Date</th>}
                    {visibleColumns.status && <th className="p-4 font-medium">Status</th>}
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                  {filteredTeams.length > 0 ? (
                    filteredTeams.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-neutral-50/80 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest("button, input, a, [data-flyout-container]")) return;
                          setSelectedTeam(item);
                          setViewState("detail");
                        }}
                      >
                        {/* Team Name & Owner */}
                        {visibleColumns.name && (
                          <td className="p-4 font-medium">
                            <div>
                              <span className="font-semibold text-neutral-900 dark:text-white block hover:text-primary-600 transition-colors">
                                {item.name}
                              </span>
                              <span className="text-xs text-neutral-500 block truncate max-w-xs">
                                {item.description}
                              </span>
                            </div>
                          </td>
                        )}

                        {/* Members Count */}
                        {visibleColumns.members && (
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                              <Users className="w-3.5 h-3.5 text-primary-500" />
                              {item.membersCount} Members
                            </span>
                          </td>
                        )}

                        {/* Spend / Budget */}
                        {visibleColumns.spend && (
                          <td className="p-4 font-mono text-xs">
                            <div className="space-y-0.5">
                              <span className="font-semibold text-neutral-900 dark:text-white">
                                ${item.currentSpend.toFixed(2)}
                              </span>
                              <span className="text-neutral-400 block text-[11px]">
                                of ${item.maxBudget.toFixed(2)} {item.budgetDuration}
                              </span>
                            </div>
                          </td>
                        )}

                        {/* Created Date */}
                        {visibleColumns.createdDate && (
                          <td className="p-4 text-xs text-neutral-600 dark:text-neutral-400">
                            {item.createdDate}
                          </td>
                        )}

                        {/* Status */}
                        {visibleColumns.status && (
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                item.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                                  : item.status === "Near Budget"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                                  : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        )}

                        {/* Actions Menu — Fixed Z-Index & Portal Dropdown */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end relative z-20" data-flyout-container>
                            <IconButton
                              icon={MoreVertical}
                              title="Actions"
                              borderless
                              menuItems={[
                                {
                                  icon: Eye,
                                  label: "View Details",
                                  onClick: () => {
                                    setSelectedTeam(item);
                                    setViewState("detail");
                                  },
                                },
                                {
                                  icon: Edit3,
                                  label: "Edit Team",
                                  onClick: () => handleOpenEditPage(item),
                                },
                                {
                                  icon: Trash2,
                                  label: "Delete Team",
                                  onClick: () => {
                                    setDeletingTeam(item);
                                    setShowDeleteModal(true);
                                  },
                                },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-neutral-500">
                        No Teams found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredTeams.length / pageSize) || 1}
                totalItems={filteredTeams.length}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* ==================== VIEW 2: DEDICATED FULL-PAGE CREATE / EDIT TEAM (4-STEP STEPPER MATCHING ADD TEAM.DC.HTML) ==================== */}
      {(viewState === "create" || viewState === "edit") && (
        <div className="max-w-[900px] mx-auto w-full space-y-5 animate-fadeIn text-xs pb-12">
          {/* Back Navigation */}
          <button
            type="button"
            onClick={() => setViewState(selectedTeam ? "detail" : "list")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Teams</span>
          </button>

          {/* Form Header */}
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              {viewState === "edit" ? "Edit Team" : "Create Team"}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {viewState === "edit"
                ? "Update team information, model access, members, and usage limits."
                : "Set up a team, assign models, members, and usage limits."}
            </p>
          </div>

          {/* 4-Step Stepper Bar */}
          <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs">
            {[
              { id: 0, label: "Basic Info" },
              { id: 1, label: "Team Members" },
              { id: 2, label: "Providers & Models" },
              { id: 3, label: "Budget & Limits" },
            ].map((step, idx, arr) => {
              const isDone = stepIndex > idx;
              const isCurrent = stepIndex === idx;

              return (
                <React.Fragment key={step.id}>
                  <div
                    onClick={() => {
                      if (idx === 0 || formName.trim()) {
                        setStepIndex(idx);
                      } else {
                        toast.error("Please enter a valid Team Name first.");
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
                      className={`flex-1 h-[2px] mx-3 ${
                        isDone ? "bg-teal-600" : "bg-neutral-200 dark:bg-neutral-800"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* STEP 1: BASIC INFORMATION */}
          {stepIndex === 0 && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <Users className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Basic Information</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Team Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Core Engineering & AI Lab"
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                  />
                  {!formName.trim() && (
                    <span className="text-[11px] text-rose-500">Team Name is required.</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Description <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description of the team's operational scope, project responsibilities, and model assignments..."
                    className="w-full p-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500 resize-y"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TEAM MEMBERS */}
          {stepIndex === 1 && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
              <div>
                <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
                  <Users className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  <span>Team Members</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Assign organization members who should belong to this team.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Assigned Members
                </label>

                {/* Member Search & Dropdown */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formMemberSearch}
                      onChange={(e) => {
                        setFormMemberSearch(e.target.value);
                        setFormMemberDropdownOpen(true);
                      }}
                      onFocus={() => setFormMemberDropdownOpen(true)}
                      placeholder="Search members by name, email, or user ID..."
                      className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                    />

                    {/* Member Suggestions Dropdown */}
                    {formMemberDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 z-40 max-h-48 overflow-y-auto custom-scrollbar">
                        {AVAILABLE_SYSTEM_USERS.filter((u) => {
                          const q = formMemberSearch.trim().toLowerCase();
                          const isAlreadyInTeam = formMembersList.some((m) => m.email.toLowerCase() === u.email.toLowerCase());
                          if (isAlreadyInTeam) return false;
                          return (
                            !q ||
                            u.name.toLowerCase().includes(q) ||
                            u.email.toLowerCase().includes(q) ||
                            u.id.toLowerCase().includes(q)
                          );
                        }).map((u) => (
                          <div
                            key={u.id}
                            onClick={() => {
                              const newMem: TeamMember = {
                                id: `m-${Date.now()}-${u.id}`,
                                name: u.name,
                                email: u.email,
                                userId: u.id,
                                role: "Member",
                                models: [],
                                budget: 0,
                                currentSpend: 0,
                                status: "Active",
                                lastActive: "Just now",
                                addedDate: formatDateDisplay(new Date().toISOString().split("T")[0]),
                              };
                              setFormMembersList((prev) => [...prev, newMem]);
                              setFormMemberSearch("");
                              setFormMemberDropdownOpen(false);
                            }}
                            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold block text-neutral-900 dark:text-white">{u.name}</span>
                              <span className="text-[11px] text-neutral-500">{u.email}</span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded font-semibold text-neutral-600 dark:text-neutral-400">
                              + Add
                            </span>
                          </div>
                        ))}

                        {AVAILABLE_SYSTEM_USERS.filter((u) => {
                          const q = formMemberSearch.trim().toLowerCase();
                          const isAlreadyInTeam = formMembersList.some((m) => m.email.toLowerCase() === u.email.toLowerCase());
                          return !isAlreadyInTeam && (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
                        }).length === 0 && (
                          <div className="p-3 text-center text-neutral-500 text-xs">
                            No matching members found.{" "}
                            <button
                              type="button"
                              onClick={() => {
                                setFormInviteEmail(formMemberSearch.includes("@") ? formMemberSearch : "");
                                setFormInviteName(formMemberSearch.includes("@") ? "" : formMemberSearch);
                                setFormShowInvitePanel(true);
                                setFormMemberDropdownOpen(false);
                              }}
                              className="text-teal-600 underline font-semibold cursor-pointer"
                            >
                              Invite "{formMemberSearch}"
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormShowInvitePanel(true)}
                    className="h-10 px-3.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    + Invite New User
                  </button>
                </div>

                {/* Inline Invite User Panel */}
                {formShowInvitePanel && (
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3 animate-fadeIn">
                    <span className="font-bold text-xs text-neutral-900 dark:text-white block">
                      Invite New User
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formInviteName}
                        onChange={(e) => setFormInviteName(e.target.value)}
                        placeholder="Full name"
                        className="h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
                      />
                      <input
                        type="email"
                        value={formInviteEmail}
                        onChange={(e) => setFormInviteEmail(e.target.value)}
                        placeholder="Email address"
                        className="h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-neutral-400">
                        They'll receive an email invite to join the organization and this team.
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormShowInvitePanel(false)}
                          className="h-8 px-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={!formInviteEmail.trim()}
                          onClick={() => {
                            const email = formInviteEmail.trim();
                            if (!email) return;
                            const name = formInviteName.trim() || email;
                            const newMem: TeamMember = {
                              id: `m-invited-${Date.now()}`,
                              name,
                              email,
                              userId: `usr-inv-${Date.now()}`,
                              role: "Member",
                              models: [],
                              budget: 0,
                              currentSpend: 0,
                              status: "Active",
                              lastActive: "Just now",
                              addedDate: formatDateDisplay(new Date().toISOString().split("T")[0]),
                            };
                            setFormMembersList((prev) => [...prev, newMem]);
                            toast.success(`Invited and assigned ${name} to team.`);
                            setFormShowInvitePanel(false);
                            setFormInviteName("");
                            setFormInviteEmail("");
                          }}
                          className="h-8 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer"
                        >
                          Invite & Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Members Cards Grid */}
                <div className="space-y-2 pt-2">
                  <span className="font-semibold text-xs text-neutral-800 dark:text-neutral-200 block">
                    Selected Team Members ({formMembersList.length})
                  </span>

                  {formMembersList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {formMembersList.map((sm) => (
                        <div
                          key={sm.id}
                          className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <span className="font-bold block text-neutral-900 dark:text-white truncate">
                              {sm.name}
                            </span>
                            <span className="text-[11px] text-neutral-500 truncate block">
                              {sm.email}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setFormMembersList((prev) => prev.filter((m) => m.id !== sm.id))
                            }
                            className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer font-bold text-sm"
                            title="Remove member"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl text-center text-neutral-400 text-xs">
                      No members added yet. Search above to add teammates.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROVIDERS & MODELS */}
          {stepIndex === 2 && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
              <div>
                <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
                  <Cpu className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  <span>Models Access Assignment</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {formAccessMode === "all"
                    ? `Full catalog access across ${PROVIDERS_LIST.length} providers`
                    : `${Object.values(formSelectedByProvider).reduce((acc, p) => acc + Object.values(p).filter(Boolean).length, 0)} model(s) selected across ${PROVIDERS_LIST.filter((p) => Object.values(formSelectedByProvider[p.id] || {}).filter(Boolean).length > 0).length} of ${PROVIDERS_LIST.length} providers`}
                </p>
              </div>

              {/* Mode Selection Radio Group */}
              <div className="flex items-center gap-6 py-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  <input
                    type="radio"
                    name="accessMode"
                    checked={formAccessMode === "all"}
                    onChange={() => setFormAccessMode("all")}
                    className="w-4 h-4 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                  />
                  <span>All Available Models</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  <input
                    type="radio"
                    name="accessMode"
                    checked={formAccessMode === "selected"}
                    onChange={() => setFormAccessMode("selected")}
                    className="w-4 h-4 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                  />
                  <span>Selected Models</span>
                </label>
              </div>

              {/* Informational Message for All Available Models */}
              {formAccessMode === "all" && (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  This team gets access to every model across all {PROVIDERS_LIST.length} providers, including new models onboarded later. Browse the full catalog below — it's read-only in this mode.
                </div>
              )}

              {/* Summary Chips for Selected Models Mode */}
              {formAccessMode === "selected" && (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 text-xs">
                      {Object.values(formSelectedByProvider).reduce((acc, p) => acc + Object.values(p).filter(Boolean).length, 0)} model(s) selected:
                    </span>

                    {PROVIDERS_LIST.filter((p) => Object.values(formSelectedByProvider[p.id] || {}).filter(Boolean).length > 0).map((p) => {
                      const count = Object.values(formSelectedByProvider[p.id] || {}).filter(Boolean).length;
                      const isExpanded = formExpandedSummaryProviderId === p.id;
                      return (
                        <div
                          key={p.id}
                          className="px-2.5 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs"
                        >
                          <span
                            onClick={() =>
                              setFormExpandedSummaryProviderId(isExpanded ? null : p.id)
                            }
                            className="cursor-pointer flex items-center gap-1.5"
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: p.color }}
                            />
                            <span>{p.name} ({count})</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </span>
                          <span
                            onClick={() =>
                              setFormSelectedByProvider((prev) => ({ ...prev, [p.id]: {} }))
                            }
                            className="text-neutral-400 hover:text-rose-600 cursor-pointer font-bold"
                          >
                            ×
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Expanded Summary Models */}
                  {formExpandedSummaryProviderId && (
                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-1.5">
                      {Object.keys(formSelectedByProvider[formExpandedSummaryProviderId] || {})
                        .filter((mName) => formSelectedByProvider[formExpandedSummaryProviderId][mName])
                        .map((mName) => (
                          <span
                            key={mName}
                            className="px-2 py-0.5 bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded text-[11px] font-mono font-semibold flex items-center gap-1.5"
                          >
                            <span>{mName}</span>
                            <span
                              onClick={() =>
                                setFormSelectedByProvider((prev) => ({
                                  ...prev,
                                  [formExpandedSummaryProviderId]: {
                                    ...prev[formExpandedSummaryProviderId],
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
                  value={formGlobalSearch}
                  onChange={(e) => setFormGlobalSearch(e.target.value)}
                  placeholder={`Not sure which provider? Search all models by name...`}
                  className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              {/* Global Model Search Results Panel */}
              {formGlobalSearch.trim() ? (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl h-96 flex flex-col overflow-hidden bg-white dark:bg-neutral-950">
                  <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
                    Search results across all providers
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scrollbar align-content-start">
                    {PROVIDERS_LIST.flatMap((p) => {
                      const list = FULL_CATALOG[p.id] || [];
                      const query = formGlobalSearch.trim().toLowerCase();
                      return list
                        .filter((mName) => mName.toLowerCase().includes(query))
                        .map((mName) => ({ provider: p, name: mName }));
                    }).map((item) => {
                      const isChecked =
                        formAccessMode === "all" ||
                        !!(formSelectedByProvider[item.provider.id] || {})[item.name];
                      const infoKey = `global-${item.provider.id}-${item.name}`;
                      const isInfoOpen = formInfoOpenKey === infoKey;

                      return (
                        <div
                          key={infoKey}
                          onClick={() => {
                            if (formAccessMode === "all") return;
                            setFormSelectedByProvider((prev) => ({
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
                              disabled={formAccessMode === "all"}
                              className="w-4 h-4 text-teal-600 rounded cursor-pointer shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-mono text-xs font-semibold block text-neutral-900 dark:text-white truncate">
                                {item.name}
                              </span>
                              <span
                                className="text-[10px] font-bold block"
                                style={{ color: item.provider.color }}
                              >
                                {item.provider.name}
                              </span>
                            </div>
                          </div>

                          <div className="relative shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormInfoOpenKey(isInfoOpen ? null : infoKey);
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
                /* Provider Browsing Panel (Left Sidebar + Right Active Models Grid) */
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl h-96 flex overflow-hidden bg-white dark:bg-neutral-950">
                  {/* Left Provider Navigation Sidebar */}
                  <div className="w-56 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex flex-col shrink-0">
                    <div className="p-2 border-b border-neutral-200 dark:border-neutral-800">
                      <input
                        type="text"
                        value={formProviderSearch}
                        onChange={(e) => setFormProviderSearch(e.target.value)}
                        placeholder={`Search ${PROVIDERS_LIST.length} providers...`}
                        className="w-full h-8 px-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs outline-none"
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {PROVIDERS_LIST.filter((p) =>
                        p.name.toLowerCase().includes(formProviderSearch.toLowerCase())
                      ).map((p) => {
                        const isSelected = formActiveProviderId === p.id;
                        const selCount = Object.values(formSelectedByProvider[p.id] || {}).filter(Boolean).length;

                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              setFormActiveProviderId(p.id);
                              setFormModelSearch("");
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
                      const activeProv = PROVIDERS_LIST.find((x) => x.id === formActiveProviderId);
                      const catalogList = activeProv ? FULL_CATALOG[activeProv.id] || [] : [];
                      const filteredList = catalogList.filter((m) =>
                        m.toLowerCase().includes(formModelSearch.toLowerCase())
                      );
                      const activeSelectedMap = formSelectedByProvider[formActiveProviderId] || {};

                      return (
                        <>
                          <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 bg-neutral-50/50 dark:bg-neutral-900/30">
                            <div className="font-bold text-xs text-neutral-900 dark:text-white">
                              {activeProv?.name} ·{" "}
                              <span className="font-normal text-neutral-400">
                                {catalogList.length} models in catalog
                              </span>
                            </div>

                            {formAccessMode === "selected" && activeProv && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const allMap: Record<string, boolean> = { ...activeSelectedMap };
                                    filteredList.forEach((mName) => (allMap[mName] = true));
                                    setFormSelectedByProvider((prev) => ({
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
                                    setFormSelectedByProvider((prev) => ({
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
                              value={formModelSearch}
                              onChange={(e) => setFormModelSearch(e.target.value)}
                              placeholder={`Search ${activeProv?.name} models by name...`}
                              className="w-full h-8 px-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs outline-none"
                            />
                          </div>

                          <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scrollbar align-content-start">
                            {filteredList.map((mName) => {
                              const isChecked =
                                formAccessMode === "all" || !!activeSelectedMap[mName];
                              const infoKey = `active-${mName}`;
                              const isInfoOpen = formInfoOpenKey === infoKey;

                              return (
                                <div
                                  key={mName}
                                  onClick={() => {
                                    if (formAccessMode === "all" || !activeProv) return;
                                    setFormSelectedByProvider((prev) => ({
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
                                      disabled={formAccessMode === "all"}
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
                                        setFormInfoOpenKey(isInfoOpen ? null : infoKey);
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

          {/* STEP 4: BUDGET & LIMITS */}
          {stepIndex === 3 && (
            <div className="space-y-4">
              {/* Budget Configuration Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Budget Configuration</span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    <input
                      type="checkbox"
                      checked={formUnlimitedBudget}
                      onChange={() => setFormUnlimitedBudget(!formUnlimitedBudget)}
                      className="w-4 h-4 text-neutral-900 rounded cursor-pointer"
                    />
                    <span>Unlimited Budget</span>
                  </label>
                </div>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-3 gap-3 transition-opacity ${
                    formUnlimitedBudget ? "opacity-50 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Maximum Budget (USD) <span className="text-neutral-400 font-normal">(0 = Unlimited)</span>
                    </label>
                    <input
                      type="number"
                      disabled={formUnlimitedBudget}
                      value={formMaxBudget}
                      onChange={(e) => setFormMaxBudget(Number(e.target.value))}
                      placeholder="5000"
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Soft Budget Alert (%)
                    </label>
                    <input
                      type="number"
                      disabled={formUnlimitedBudget}
                      value={formSoftBudget}
                      onChange={(e) => setFormSoftBudget(Number(e.target.value))}
                      placeholder="80"
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Budget Reset Duration
                    </label>
                    <select
                      disabled={formUnlimitedBudget}
                      value={formBudgetDuration}
                      onChange={(e) => setFormBudgetDuration(e.target.value)}
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="Lifetime">Lifetime</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Daily">Daily</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Budget Notification Email
                  </label>
                  <div className="p-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 rounded-lg flex flex-wrap items-center gap-1.5 min-h-[40px]">
                    {formAlertEmails.map((email) => (
                      <span
                        key={email}
                        className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium text-xs flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-700"
                      >
                        {email}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-rose-600"
                          onClick={() =>
                            setFormAlertEmails(formAlertEmails.filter((e) => e !== email))
                          }
                        />
                      </span>
                    ))}
                    <input
                      type="email"
                      value={formEmailDraft}
                      onChange={(e) => setFormEmailDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = formEmailDraft.trim();
                          if (val && !formAlertEmails.includes(val)) {
                            setFormAlertEmails([...formAlertEmails, val]);
                            setFormEmailDraft("");
                          }
                        }
                      }}
                      placeholder={formAlertEmails.length === 0 ? "Add email and press Enter..." : "Add email..."}
                      className="flex-1 min-w-[140px] bg-transparent text-xs text-neutral-900 dark:text-white outline-none py-0.5"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-400 block">
                    Recipients receive email notifications when Soft Budget or Maximum Budget is reached. Press Enter to add.
                  </span>
                </div>
              </div>

              {/* Rate Limits Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Rate Limits</span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    <input
                      type="checkbox"
                      checked={formUnlimitedRateLimits}
                      onChange={() => setFormUnlimitedRateLimits(!formUnlimitedRateLimits)}
                      className="w-4 h-4 text-neutral-900 rounded cursor-pointer"
                    />
                    <span>Unlimited Rate Limits</span>
                  </label>
                </div>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-opacity ${
                    formUnlimitedRateLimits ? "opacity-50 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      TPM Limit (Tokens Per Minute)
                    </label>
                    <input
                      type="number"
                      disabled={formUnlimitedRateLimits}
                      value={formTpmLimit}
                      onChange={(e) => setFormTpmLimit(Number(e.target.value))}
                      placeholder="500000"
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      RPM Limit (Requests Per Minute)
                    </label>
                    <input
                      type="number"
                      disabled={formUnlimitedRateLimits}
                      value={formRpmLimit}
                      onChange={(e) => setFormRpmLimit(Number(e.target.value))}
                      placeholder="5000"
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewState(selectedTeam ? "detail" : "list")}
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

            {stepIndex < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (stepIndex === 0 && !formName.trim()) {
                    toast.error("Please enter a valid Team Name.");
                    return;
                  }
                  if (stepIndex === 2 && formAccessMode === "selected") {
                    const selCount = Object.values(formSelectedByProvider).reduce(
                      (acc, p) => acc + Object.values(p).filter(Boolean).length,
                      0
                    );
                    if (selCount === 0) {
                      toast.error("Please select at least one model.");
                      return;
                    }
                  }
                  setStepIndex((prev) => Math.min(3, prev + 1));
                }}
                className="h-10 px-5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-2xs cursor-pointer"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSaveTeamForm()}
                className="h-10 px-5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{viewState === "edit" ? "Save Changes" : "Save Team"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==================== VIEW 3: DEDICATED FULL-PAGE ADD USER SCREEN ==================== */}
      {viewState === "add-user" && selectedTeam && (
        <div className="space-y-6 animate-fadeIn">
          <PageHeader
            title={`Add User to Team — ${selectedTeam.name}`}
            pageId="add-user-to-team"
            action="create"
          >
            <SecondaryButton
              icon={ArrowLeft}
              onClick={() => {
                setDetailTab("members");
                setViewState("detail");
              }}
            >
              Back to Team
            </SecondaryButton>
          </PageHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            {/* Main Selection Area */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-primary-600" />
                    Available System Users
                  </h3>
                  <span className="text-neutral-500 font-mono text-xs">
                    {AVAILABLE_SYSTEM_USERS.length} Users Total
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search users by name, email, or role..."
                    className="w-full h-10 pl-9 pr-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-medium focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Available Users List */}
                <div className="space-y-2 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                  {AVAILABLE_SYSTEM_USERS.filter((u) => {
                    const q = userSearchQuery.toLowerCase();
                    return (
                      !q ||
                      u.name.toLowerCase().includes(q) ||
                      u.email.toLowerCase().includes(q) ||
                      u.role.toLowerCase().includes(q)
                    );
                  }).map((u) => {
                    const isSelected = selectedUserIds.includes(u.id);
                    const isAlreadyMember = selectedTeam.membersList.some((m) => m.email === u.email);

                    return (
                      <div
                        key={u.id}
                        onClick={() => {
                          if (isAlreadyMember) return;
                          if (isSelected) {
                            setSelectedUserIds(selectedUserIds.filter((id) => id !== u.id));
                          } else {
                            setSelectedUserIds([...selectedUserIds, u.id]);
                          }
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isAlreadyMember
                            ? "bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 opacity-60 cursor-not-allowed"
                            : isSelected
                            ? "bg-primary-50 dark:bg-primary-950/60 border-primary-400 text-primary-950 dark:text-primary-100 font-semibold cursor-pointer shadow-2xs"
                            : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center text-xs">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold block text-neutral-900 dark:text-white">
                              {u.name}
                            </span>
                            <span className="text-neutral-500 text-[11px] block">{u.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            {u.role}
                          </span>

                          {isAlreadyMember ? (
                            <span className="text-[10px] font-semibold text-neutral-400 italic">
                              Already Member
                            </span>
                          ) : (
                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                              isSelected ? "bg-primary-600 border-primary-600 text-white" : "border-neutral-300"
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs space-y-4">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Selected Users ({selectedUserIds.length})
                </h3>

                <div className="flex flex-wrap gap-1.5 min-h-[80px]">
                  {selectedUserIds.length === 0 ? (
                    <span className="text-neutral-400 italic text-xs">
                      No users selected yet. Click users on the left to select them.
                    </span>
                  ) : (
                    selectedUserIds.map((uId) => {
                      const u = AVAILABLE_SYSTEM_USERS.find((item) => item.id === uId);
                      return (
                        <span
                          key={uId}
                          className="px-2.5 py-1 rounded-md bg-primary-50 dark:bg-primary-950/60 border border-primary-200 text-primary-700 dark:text-primary-300 font-semibold text-xs flex items-center gap-1.5"
                        >
                          <span>{u?.name}</span>
                          <X
                            className="w-3 h-3 hover:text-rose-600 cursor-pointer"
                            onClick={() => setSelectedUserIds(selectedUserIds.filter((id) => id !== uId))}
                          />
                        </span>
                      );
                    })
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
                  <PrimaryButton
                    icon={UserPlus}
                    onClick={handleConfirmAssignUsers}
                    disabled={selectedUserIds.length === 0}
                    className="w-full justify-center"
                  >
                    Assign Selected Users ({selectedUserIds.length})
                  </PrimaryButton>
                  <SecondaryButton
                    onClick={() => {
                      setDetailTab("members");
                      setViewState("detail");
                    }}
                    className="w-full justify-center"
                  >
                    Cancel
                  </SecondaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== VIEW 4: TEAM DETAILS ==================== */}
      {viewState === "detail" && selectedTeam && (
        <div className="space-y-6 animate-fadeIn">
          {/* Details Page Header */}
          <PageHeader
            title={selectedTeam.name}
            pageId="team-details"
            action="detail"
          >
            <SecondaryButton
              icon={ArrowLeft}
              onClick={() => setViewState("list")}
            >
              Back to Listing
            </SecondaryButton>

            <PrimaryButton
              icon={Edit3}
              onClick={() => handleOpenEditPage(selectedTeam)}
            >
              Edit Team
            </PrimaryButton>
          </PageHeader>

          {/* Details Header Summary Banner */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 text-primary-600 flex items-center justify-center font-bold text-lg">
                  {selectedTeam.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    {selectedTeam.name}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {selectedTeam.status}
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {selectedTeam.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono">
                <div>
                  <span className="text-neutral-400 block text-[10px]">Spend / Budget</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    ${selectedTeam.currentSpend.toFixed(2)} / ${selectedTeam.maxBudget.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">TPM Limit</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {selectedTeam.tpmLimit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs inside Details */}
            <div className="flex items-center gap-2 pt-1 border-b border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => setDetailTab("overview")}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  detailTab === "overview"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setDetailTab("virtual-keys")}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  detailTab === "virtual-keys"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Virtual Keys ({selectedTeam.keysList.length})
              </button>
              <button
                onClick={() => setDetailTab("members")}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  detailTab === "members"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Members ({selectedTeam.membersList.length})
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {detailTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  Assigned Provider & Model Sets
                </h3>
                <div className="space-y-2">
                  {(selectedTeam.assignedProviders || []).map((pConfig) => (
                    <div key={pConfig.provider} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                      <span className="font-bold text-neutral-900 dark:text-white block">{pConfig.provider}</span>
                      <div className="flex flex-wrap gap-1">
                        {pConfig.selectedModels.map((m) => (
                          <span key={m} className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold text-[11px]">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Applied Policies & Guardrails
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedTeam.policies || []).map((pol) => (
                    <span key={pol} className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-xs">
                      {pol}
                    </span>
                  ))}
                  {(selectedTeam.guardrails || []).map((g) => (
                    <span key={g} className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-semibold text-xs">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VIRTUAL KEYS */}
          {detailTab === "virtual-keys" && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-500" />
                Assigned Virtual Keys
              </h3>

              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {selectedTeam.keysList.map((vk) => (
                  <div key={vk.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white block">{vk.alias}</span>
                      <span className="font-mono text-neutral-400 text-[11px]">{vk.keyId}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-semibold block">${vk.currentSpend.toFixed(2)} / ${vk.budget.toFixed(2)}</span>
                      <span className="text-[10px] text-neutral-400">{vk.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MEMBERS (With Prominent Add User Button -> Dedicated Add User Screen!) */}
          {detailTab === "members" && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-600" />
                    Team Members ({selectedTeam.membersList.length})
                  </h3>
                  <p className="text-neutral-500 text-[11px] mt-0.5">Manage user access and roles for this team.</p>
                </div>

                <PrimaryButton icon={UserPlus} onClick={handleOpenAddUserScreen}>
                  Add User
                </PrimaryButton>
              </div>

              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {selectedTeam.membersList.map((mem) => (
                  <div key={mem.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center text-xs">
                        {mem.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-900 dark:text-white block">{mem.name}</span>
                        <span className="text-neutral-500 text-[11px] block">{mem.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {mem.role}
                      </span>
                      <span className="text-neutral-400 font-mono text-[11px]">{mem.lastActive}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide-Over Filter Drawer */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity animate-fadeIn"
            onClick={() => setShowFilterDrawer(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
              <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Filter Teams</h3>
                <button onClick={() => setShowFilterDrawer(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Near Budget">Near Budget</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Allowed Model</label>
                  <input
                    type="text"
                    value={filterModel}
                    onChange={(e) => setFilterModel(e.target.value)}
                    placeholder="Search by model e.g. GPT-4o..."
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
                <SecondaryButton
                  onClick={() => {
                    setFilterStatus("All");
                    setFilterModel("All");
                    setAppliedStatus("All");
                    setAppliedModel("All");
                    setShowFilterDrawer(false);
                  }}
                >
                  Reset
                </SecondaryButton>
                <PrimaryButton
                  onClick={() => {
                    setAppliedStatus(filterStatus);
                    setAppliedModel(filterModel);
                    setShowFilterDrawer(false);
                  }}
                >
                  Apply Filters
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Delete Team
            </h3>
            <p className="text-neutral-500">
              Are you sure you want to delete <span className="font-bold text-neutral-900 dark:text-white">{deletingTeam.name}</span>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <SecondaryButton onClick={() => setShowDeleteModal(false)}>Cancel</SecondaryButton>
              <button
                onClick={() => {
                  setTeams(teams.filter((t) => t.id !== deletingTeam.id));
                  setShowDeleteModal(false);
                  toast.success(`Team "${deletingTeam.name}" deleted.`);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition-colors"
              >
                Delete Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Invite User Modal Overlay in Team Form */}
      {showInviteModalInTeamForm && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 my-auto animate-scaleUp text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Invite & Add User</h3>
                  <p className="text-[11px] text-neutral-500">Create user and auto-assign to this team.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModalInTeamForm(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newUserNameInForm}
                  onChange={(e) => setNewUserNameInForm(e.target.value)}
                  placeholder="e.g. Sarah Lead"
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={newUserEmailInForm}
                  onChange={(e) => setNewUserEmailInForm(e.target.value)}
                  placeholder="e.g. sarah.lead@company.com"
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Team Role</label>
                <select
                  value={newUserRoleInForm}
                  onChange={(e) => setNewUserRoleInForm(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500 cursor-pointer"
                >
                  <option value="Member">Member</option>
                  <option value="Team Admin">Team Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={() => setShowInviteModalInTeamForm(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                disabled={!newUserNameInForm.trim() || !newUserEmailInForm.trim()}
                onClick={handleInviteUserSubmitInForm}
              >
                Invite & Assign User
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
