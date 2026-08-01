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

  // --- Create / Edit Form State ---
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAssignedProviders, setFormAssignedProviders] = useState<AssignedProviderConfig[]>([
    { provider: "OpenAI", selectedModels: ["GPT-4o", "GPT-4o Mini"] },
  ]);
  const [formMaxBudget, setFormMaxBudget] = useState<number>(5000);
  const [formSoftBudget, setFormSoftBudget] = useState<number>(80);
  const [formBudgetDuration, setFormBudgetDuration] = useState<"Monthly" | "Quarterly" | "Annual" | "Infinite">("Monthly");
  const [formTpmLimit, setFormTpmLimit] = useState<number>(500000);
  const [formRpmLimit, setFormRpmLimit] = useState<number>(5000);
  const [formAlertEmails, setFormAlertEmails] = useState("john.doe@company.com");

  // --- Add User Dedicated Screen State ---
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Open Dedicated Create Team Page
  const handleOpenCreatePage = () => {
    setSelectedTeam(null);
    setFormName("");
    setFormDescription("");
    setFormAssignedProviders([{ provider: "OpenAI", selectedModels: ["GPT-4o", "GPT-4o Mini"] }]);
    setFormMaxBudget(5000);
    setFormSoftBudget(80);
    setFormBudgetDuration("Monthly");
    setFormTpmLimit(500000);
    setFormRpmLimit(5000);
    setFormAlertEmails("john.doe@company.com");
    setViewState("create");
  };

  // Open Dedicated Edit Team Page
  const handleOpenEditPage = (team: TeamItem) => {
    setSelectedTeam(team);
    setFormName(team.name);
    setFormDescription(team.description);
    setFormAssignedProviders(
      team.assignedProviders || [{ provider: "OpenAI", selectedModels: team.allowedModels || ["GPT-4o"] }]
    );
    setFormMaxBudget(team.maxBudget);
    setFormSoftBudget(team.softBudgetPercent);
    setFormBudgetDuration(team.budgetDuration);
    setFormTpmLimit(team.tpmLimit);
    setFormRpmLimit(team.rpmLimit);
    setFormAlertEmails((team.alertEmails || []).join(", "));
    setViewState("edit");
  };

  // Save / Update Team Handler
  const handleSaveTeamForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Please enter Team Name.");
      return;
    }

    const todayDate = new Date().toISOString().split("T")[0];
    const formattedDate = formatDateDisplay(todayDate);

    // Compute allowed models list
    const allowed = formAssignedProviders.flatMap((p) => p.selectedModels);

    if (viewState === "edit" && selectedTeam) {
      const updatedItem: TeamItem = {
        ...selectedTeam,
        name: formName.trim(),
        description: formDescription.trim(),
        maxBudget: formMaxBudget,
        softBudgetPercent: formSoftBudget,
        budgetDuration: formBudgetDuration,
        tpmLimit: formTpmLimit,
        rpmLimit: formRpmLimit,
        assignedProviders: formAssignedProviders,
        allowedModels: allowed,
        updatedDate: formattedDate,
        alertEmails: formAlertEmails.split(",").map((e) => e.trim()).filter(Boolean),
      };

      setTeams((prev) => prev.map((t) => (t.id === selectedTeam.id ? updatedItem : t)));
      setSelectedTeam(updatedItem);
      toast.success(`Team "${updatedItem.name}" updated successfully.`);
    } else {
      const newTeam: TeamItem = {
        id: `team-${Date.now()}`,
        teamId: `tm-${Math.random().toString().substring(2, 8)}`,
        name: formName.trim(),
        description: formDescription.trim(),
        owner: "John Doe",
        ownerEmail: "john.doe@company.com",
        membersCount: 1,
        virtualKeysCount: 0,
        accessGroupsCount: 0,
        currentSpend: 0,
        maxBudget: formMaxBudget,
        softBudgetPercent: formSoftBudget,
        budgetDuration: formBudgetDuration,
        tpmLimit: formTpmLimit,
        rpmLimit: formRpmLimit,
        status: "Active",
        createdDate: formattedDate,
        createdBy: "John Doe",
        updatedDate: formattedDate,
        assignedProviders: formAssignedProviders,
        allowedModels: allowed,
        membersList: [
          { id: "m-101", name: "John Doe", email: "john.doe@company.com", userId: "usr-101", role: "Team Admin", models: allowed, budget: formMaxBudget, currentSpend: 0, status: "Active", lastActive: "Just now", addedDate: formattedDate }
        ],
        keysList: [],
        policies: ["Zero Retention"],
        guardrails: ["Content Safety"],
        vectorStores: [],
        searchTools: [],
        mcpServers: [],
        agents: [],
        loggingIntegration: "Gateway Standard",
        alertEmails: formAlertEmails.split(",").map((e) => e.trim()).filter(Boolean),
      };

      setTeams((prev) => [newTeam, ...prev]);
      toast.success(`Team "${newTeam.name}" created successfully.`);
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

      {/* ==================== VIEW 2: DEDICATED FULL-PAGE CREATE / EDIT TEAM ==================== */}
      {(viewState === "create" || viewState === "edit") && (
        <div className="space-y-6 animate-fadeIn">
          <PageHeader
            title={viewState === "edit" ? `Edit Team — ${selectedTeam?.name}` : "Create Team"}
            pageId="create-edit-team"
            action="create"
          >
            <SecondaryButton
              icon={ArrowLeft}
              onClick={() => setViewState(selectedTeam ? "detail" : "list")}
            >
              Back
            </SecondaryButton>
          </PageHeader>

          <form onSubmit={handleSaveTeamForm} className="space-y-6">
            {/* 1. Basic Information */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Team Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Core Engineering & AI Lab"
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl font-semibold text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Description <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description of the team's operational scope, project responsibilities, and model assignments..."
                    className="w-full p-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Provider & Model Assignment (Reusable ProviderModelSelector matching screenshots!) */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Provider & Model Assignment</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Assign multi-cloud AI providers and allowed model sets to this team.</p>
                </div>
              </div>

              <ProviderModelSelector
                assignedProviders={formAssignedProviders}
                onChange={(updated) => setFormAssignedProviders(updated)}
              />
            </div>

            {/* 3. Budget Configuration */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Budget Configuration</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Maximum Budget (USD) <span className="text-neutral-400 font-normal">(0 = Unlimited)</span>
                  </label>
                  <input
                    type="number"
                    value={formMaxBudget}
                    onChange={(e) => setFormMaxBudget(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Soft Budget Alert (%)
                  </label>
                  <input
                    type="number"
                    value={formSoftBudget}
                    onChange={(e) => setFormSoftBudget(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Budget Reset Period
                  </label>
                  <select
                    value={formBudgetDuration}
                    onChange={(e) => setFormBudgetDuration(e.target.value as any)}
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl font-semibold text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500 cursor-pointer"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                    <option value="Infinite">Infinite</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-3">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Notification Alert Emails
                  </label>
                  <input
                    type="text"
                    value={formAlertEmails}
                    onChange={(e) => setFormAlertEmails(e.target.value)}
                    placeholder="Comma-separated emails e.g. lead@domain.com, admin@domain.com"
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* 4. Rate Limits */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Rate Limits</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    TPM Limit (Tokens Per Minute)
                  </label>
                  <input
                    type="number"
                    value={formTpmLimit}
                    onChange={(e) => setFormTpmLimit(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    RPM Limit (Requests Per Minute)
                  </label>
                  <input
                    type="number"
                    value={formRpmLimit}
                    onChange={(e) => setFormRpmLimit(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Page Form Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton
                type="button"
                onClick={() => setViewState(selectedTeam ? "detail" : "list")}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" icon={Save}>
                {viewState === "edit" ? "Update Team" : "Save Team"}
              </PrimaryButton>
            </div>
          </form>
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
    </div>
  );
}
