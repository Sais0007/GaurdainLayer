import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Check, 
  X, 
  ChevronDown, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  KeyRound, 
  Server, 
  Sparkles, 
  Zap, 
  RotateCcw,
  Globe,
  SlidersHorizontal,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { 
  PageHeader, 
  SearchBar, 
  Pagination, 
  PrimaryButton, 
  SecondaryButton 
} from "./hb/listing";
import { getSharedCredentials } from "./CredentialsManagement";

// --- Provider Definition Interface ---
export interface ProviderDef {
  id: string;
  name: string;
  color: string;
}

export const PROVIDERS: ProviderDef[] = [
  { id: "gemini", name: "Gemini", color: "#0891b2" },
  { id: "anthropic", name: "Anthropic", color: "#7c3aed" },
  { id: "aiml", name: "Aiml", color: "#db2777" },
  { id: "openai", name: "OpenAI", color: "#2563eb" },
  { id: "azure", name: "Azure", color: "#059669" },
  { id: "azure_text", name: "Azure_text", color: "#d97706" },
];

// --- Model Interface ---
export interface OrgModelItem {
  id: string;
  name: string;
  providerId: string;
  providerName: string;
  color: string;
  contextWindow: number;
  inputPrice: number; // In $/1M
  outputPrice: number; // Out $/1M
  status: "Active" | "Inactive";
  maxOutput: number;
  maxInput: number;
  capabilities: string[];
  configured: boolean;
  alias?: string;
  credential?: string;
}

// Initial Assigned Models List (Matching Reference HTML)
const initialAssignedModels: OrgModelItem[] = [
  {
    id: "gemini-1",
    name: "gemini/gemini-2.5-flash",
    providerId: "gemini",
    providerName: "Gemini",
    color: "#0891b2",
    contextWindow: 200000,
    inputPrice: 1.19,
    outputPrice: 3.57,
    status: "Active",
    maxOutput: 2048,
    maxInput: 197952,
    capabilities: ["function", "vision", "streaming"],
    configured: true,
    alias: "df",
    credential: "team",
  },
  {
    id: "anthropic-2",
    name: "claude-4-opus-20250514",
    providerId: "anthropic",
    providerName: "Anthropic",
    color: "#7c3aed",
    contextWindow: 4096,
    inputPrice: 2.38,
    outputPrice: 7.14,
    status: "Active",
    maxOutput: 4096,
    maxInput: 0,
    capabilities: ["function", "json", "streaming"],
    configured: false,
  },
  {
    id: "aiml-3",
    name: "aiml/custom-model",
    providerId: "aiml",
    providerName: "Aiml",
    color: "#db2777",
    contextWindow: 8192,
    inputPrice: 0.51,
    outputPrice: 2.04,
    status: "Active",
    maxOutput: 1024,
    maxInput: 7168,
    capabilities: ["streaming"],
    configured: false,
  },
  {
    id: "anthropic-4",
    name: "claude-haiku-4-5",
    providerId: "anthropic",
    providerName: "Anthropic",
    color: "#7c3aed",
    contextWindow: 32768,
    inputPrice: 1.70,
    outputPrice: 3.40,
    status: "Active",
    maxOutput: 8192,
    maxInput: 24576,
    capabilities: ["function", "vision", "streaming"],
    configured: false,
  },
  {
    id: "anthropic-5",
    name: "claude-opus-4-5",
    providerId: "anthropic",
    providerName: "Anthropic",
    color: "#7c3aed",
    contextWindow: 65536,
    inputPrice: 0.85,
    outputPrice: 2.55,
    status: "Active",
    maxOutput: 16384,
    maxInput: 49152,
    capabilities: ["vision", "json", "streaming"],
    configured: false,
  },
  {
    id: "anthropic-6",
    name: "claude-4-sonnet-20250514",
    providerId: "anthropic",
    providerName: "Anthropic",
    color: "#7c3aed",
    contextWindow: 128000,
    inputPrice: 0.02,
    outputPrice: 0.06,
    status: "Active",
    maxOutput: 2048,
    maxInput: 125952,
    capabilities: ["function", "streaming"],
    configured: true,
    alias: "support-bot",
    credential: "Prod Key Vault",
  },
  {
    id: "openai-7",
    name: "gpt-4o-mini",
    providerId: "openai",
    providerName: "OpenAI",
    color: "#2563eb",
    contextWindow: 200000,
    inputPrice: 1.19,
    outputPrice: 4.76,
    status: "Active",
    maxOutput: 4096,
    maxInput: 195904,
    capabilities: ["function", "vision", "json", "streaming"],
    configured: true,
    alias: "mini-assistant",
    credential: "Team Shared Key",
  },
  {
    id: "azure-8",
    name: "azure/o4-mini",
    providerId: "azure",
    providerName: "Azure",
    color: "#059669",
    contextWindow: 4096,
    inputPrice: 2.38,
    outputPrice: 9.52,
    status: "Active",
    maxOutput: 1024,
    maxInput: 3072,
    capabilities: ["json", "streaming"],
    configured: false,
  },
  {
    id: "openai-9",
    name: "gpt-4o",
    providerId: "openai",
    providerName: "OpenAI",
    color: "#2563eb",
    contextWindow: 128000,
    inputPrice: 2.50,
    outputPrice: 10.00,
    status: "Inactive",
    maxOutput: 4096,
    maxInput: 123904,
    capabilities: ["function", "vision", "json", "streaming"],
    configured: true,
    alias: "flagship-gpt4o",
    credential: "Prod Key Vault",
  },
  {
    id: "gemini-10",
    name: "gemini/gemini-2.5-flash-lite",
    providerId: "gemini",
    providerName: "Gemini",
    color: "#0891b2",
    contextWindow: 1000000,
    inputPrice: 0.075,
    outputPrice: 0.30,
    status: "Active",
    maxOutput: 8192,
    maxInput: 991808,
    capabilities: ["function", "streaming"],
    configured: false,
  },
  {
    id: "azure-11",
    name: "azure/gpt-4o-mini",
    providerId: "azure",
    providerName: "Azure",
    color: "#059669",
    contextWindow: 128000,
    inputPrice: 0.15,
    outputPrice: 0.60,
    status: "Active",
    maxOutput: 4096,
    maxInput: 123904,
    capabilities: ["function", "json", "streaming"],
    configured: false,
  },
  {
    id: "gemini-12",
    name: "gemini/gemini-2.5-pro",
    providerId: "gemini",
    providerName: "Gemini",
    color: "#0891b2",
    contextWindow: 2000000,
    inputPrice: 1.25,
    outputPrice: 5.00,
    status: "Active",
    maxOutput: 8192,
    maxInput: 1991808,
    capabilities: ["function", "vision", "json", "streaming"],
    configured: false,
  },
  {
    id: "azure_text-13",
    name: "azure/gpt-3.5-turbo-instruct",
    providerId: "azure_text",
    providerName: "Azure_text",
    color: "#d97706",
    contextWindow: 4096,
    inputPrice: 1.50,
    outputPrice: 2.00,
    status: "Active",
    maxOutput: 4096,
    maxInput: 0,
    capabilities: ["streaming"],
    configured: false,
  },
  {
    id: "openai-14",
    name: "high/1536-x-1024/gpt-image-1",
    providerId: "openai",
    providerName: "OpenAI",
    color: "#2563eb",
    contextWindow: 4096,
    inputPrice: 5.00,
    outputPrice: 15.00,
    status: "Active",
    maxOutput: 1024,
    maxInput: 3072,
    capabilities: ["vision"],
    configured: false,
  },
  {
    id: "azure-15",
    name: "azure/tts-1",
    providerId: "azure",
    providerName: "Azure",
    color: "#059669",
    contextWindow: 4096,
    inputPrice: 15.00,
    outputPrice: 30.00,
    status: "Active",
    maxOutput: 1024,
    maxInput: 3072,
    capabilities: [],
    configured: false,
  },
];

// Initial Available Pool Models (Granted by Super Admin)
const initialPoolModels: OrgModelItem[] = [
  {
    id: "pool-openai-901",
    name: "gpt-4.1",
    providerId: "openai",
    providerName: "OpenAI",
    color: "#2563eb",
    contextWindow: 128000,
    inputPrice: 2.00,
    outputPrice: 8.00,
    status: "Active",
    maxOutput: 4096,
    maxInput: 123904,
    capabilities: ["function", "vision", "json", "streaming"],
    configured: false,
  },
  {
    id: "pool-anthropic-902",
    name: "claude-3-5-haiku-20241022",
    providerId: "anthropic",
    providerName: "Anthropic",
    color: "#7c3aed",
    contextWindow: 200000,
    inputPrice: 1.00,
    outputPrice: 5.00,
    status: "Active",
    maxOutput: 8192,
    maxInput: 191808,
    capabilities: ["function", "json", "streaming"],
    configured: false,
  },
  {
    id: "pool-gemini-903",
    name: "gemini/gemini-1.5-pro",
    providerId: "gemini",
    providerName: "Gemini",
    color: "#0891b2",
    contextWindow: 1000000,
    inputPrice: 1.25,
    outputPrice: 5.00,
    status: "Active",
    maxOutput: 8192,
    maxInput: 991808,
    capabilities: ["function", "vision", "streaming"],
    configured: false,
  },
  {
    id: "pool-azure-904",
    name: "azure/gpt-4-turbo",
    providerId: "azure",
    providerName: "Azure",
    color: "#059669",
    contextWindow: 128000,
    inputPrice: 2.50,
    outputPrice: 10.00,
    status: "Active",
    maxOutput: 4096,
    maxInput: 123904,
    capabilities: ["function", "vision", "streaming"],
    configured: false,
  },
  {
    id: "pool-aiml-905",
    name: "aiml/mixtral-8x7b",
    providerId: "aiml",
    providerName: "Aiml",
    color: "#db2777",
    contextWindow: 32768,
    inputPrice: 0.60,
    outputPrice: 1.80,
    status: "Active",
    maxOutput: 4096,
    maxInput: 28672,
    capabilities: ["streaming"],
    configured: false,
  },
];

// Formatter Helpers
const fmtContext = (n: number): string => {
  if (n >= 1000000) return `${n / 1000000}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
};

const hashStr = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

export default function ModelManagement() {
  // Main Assigned Models & Pool State
  const [models, setModels] = useState<OrgModelItem[]>(initialAssignedModels);
  const [poolModels, setPoolModels] = useState<OrgModelItem[]>(initialPoolModels);

  // View Navigation: "list" | "detail"
  const [view, setView] = useState<"list" | "detail">("list");
  const [detailModelId, setDetailModelId] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "configured" | "unconfigured">("all");
  const [providerFilterIds, setProviderFilterIds] = useState<Record<string, boolean>>({});
  const [priceFilter, setPriceFilter] = useState<"all" | "u1" | "u3" | "u10" | "o10">("all");
  const [priceOutFilter, setPriceOutFilter] = useState<"all" | "u1" | "u3" | "u10" | "o10">("all");
  const [contextFilter, setContextFilter] = useState<"all" | "8k" | "32k" | "128k">("all");
  
  // Facet Dropdown Popover State
  const [openFacet, setOpenFacet] = useState<"provider" | "price" | "priceOut" | "context" | null>(null);
  const facetRef = useRef<HTMLDivElement>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Add Model Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [addSelectedIds, setAddSelectedIds] = useState<Record<string, boolean>>({});

  // Configure Model Modal State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configModelId, setConfigModelId] = useState<string | null>(null);
  const [credentialMode, setCredentialMode] = useState<"existing" | "new">("existing");
  const [activeCredential, setActiveCredential] = useState("");
  const [credentialName, setCredentialName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [aliasDraft, setAliasDraft] = useState("");
  const [testedOk, setTestedOk] = useState(false);

  // Close facet dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (facetRef.current && !facetRef.current.contains(e.target as Node)) {
        setOpenFacet(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Shared Credentials from Credentials Management Module
  const sharedCreds = getSharedCredentials();

  // Summary Metrics Computation
  const statProviders = useMemo(() => {
    return new Set(models.map((m) => m.providerId)).size;
  }, [models]);

  const statTotal = models.length;

  const statConfigured = useMemo(() => {
    return models.filter((m) => m.configured).length;
  }, [models]);

  const statActive = useMemo(() => {
    return models.filter((m) => m.status === "Active").length;
  }, [models]);

  // Provider Counts Mapping for Provider Facet Filter
  const providerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    models.forEach((m) => {
      counts[m.providerId] = (counts[m.providerId] || 0) + 1;
    });
    return counts;
  }, [models]);

  // Active Provider Filter IDs list
  const activeProviderFilterList = useMemo(() => {
    return Object.keys(providerFilterIds).filter((k) => providerFilterIds[k]);
  }, [providerFilterIds]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      statusFilter !== "all" ||
      activeProviderFilterList.length > 0 ||
      priceFilter !== "all" ||
      priceOutFilter !== "all" ||
      contextFilter !== "all"
    );
  }, [searchQuery, statusFilter, activeProviderFilterList, priceFilter, priceOutFilter, contextFilter]);

  // Reset all filters action
  const handleResetFilters = () => {
    setSearchQuery("");
    setIsSearchExpanded(false);
    setStatusFilter("all");
    setProviderFilterIds({});
    setPriceFilter("all");
    setPriceOutFilter("all");
    setContextFilter("all");
    setCurrentPage(1);
    setOpenFacet(null);
  };

  // Filtered Models Calculation
  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      // 1. Search Query Filter
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const nameMatch = m.name.toLowerCase().includes(q);
        const providerMatch = m.providerName.toLowerCase().includes(q);
        const aliasMatch = (m.alias || "").toLowerCase().includes(q);
        if (!nameMatch && !providerMatch && !aliasMatch) return false;
      }

      // 2. Configuration Status Filter
      if (statusFilter === "configured" && !m.configured) return false;
      if (statusFilter === "unconfigured" && m.configured) return false;

      // 3. Provider Facet Filter
      if (activeProviderFilterList.length > 0 && !activeProviderFilterList.includes(m.providerId)) {
        return false;
      }

      // 4. Price In Filter
      if (priceFilter === "u1" && m.inputPrice > 1) return false;
      if (priceFilter === "u3" && m.inputPrice > 3) return false;
      if (priceFilter === "u10" && m.inputPrice > 10) return false;
      if (priceFilter === "o10" && m.inputPrice < 10) return false;

      // 5. Price Out Filter
      if (priceOutFilter === "u1" && m.outputPrice > 1) return false;
      if (priceOutFilter === "u3" && m.outputPrice > 3) return false;
      if (priceOutFilter === "u10" && m.outputPrice > 10) return false;
      if (priceOutFilter === "o10" && m.outputPrice < 10) return false;

      // 6. Context Window Filter
      if (contextFilter === "8k" && m.contextWindow < 8192) return false;
      if (contextFilter === "32k" && m.contextWindow < 32768) return false;
      if (contextFilter === "128k" && m.contextWindow < 131072) return false;

      return true;
    });
  }, [
    models,
    searchQuery,
    statusFilter,
    activeProviderFilterList,
    priceFilter,
    priceOutFilter,
    contextFilter,
  ]);

  // Paginated Models Calculation
  const totalPages = Math.max(1, Math.ceil(filteredModels.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedModels = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredModels.slice(start, start + pageSize);
  }, [filteredModels, safePage, pageSize]);

  // Open Model Configuration Modal Action
  const handleOpenConfigModal = (modelId: string) => {
    const target = models.find((m) => m.id === modelId);
    if (!target) return;
    setConfigModelId(modelId);
    setCredentialMode("existing");
    setActiveCredential(target.credential || "");
    setCredentialName("");
    setBaseUrl("");
    setApiKey("");
    setAliasDraft(target.alias || "");
    setTestedOk(false);
    setShowConfigModal(true);
  };

  // Save Model Configuration Action
  const handleSaveConfig = () => {
    if (!configModelId) return;
    const credLabel =
      credentialMode === "existing"
        ? activeCredential || "Existing Credential"
        : credentialName.trim() || "New Credential";

    setModels((prev) =>
      prev.map((m) => {
        if (m.id === configModelId) {
          return {
            ...m,
            configured: true,
            alias: aliasDraft.trim() || m.name,
            credential: credLabel,
          };
        }
        return m;
      })
    );

    setShowConfigModal(false);
    setConfigModelId(null);
    toast.success("Model configuration saved successfully!");
  };

  // Add Model Workflow Action
  const handleAddSelectedModels = () => {
    const selectedIds = Object.keys(addSelectedIds).filter((k) => addSelectedIds[k]);
    if (selectedIds.length === 0) return;

    const picked = poolModels.filter((m) => selectedIds.includes(m.id));
    setModels((prev) => [...prev, ...picked]);
    setPoolModels((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
    setAddSelectedIds({});
    setShowAddModal(false);
    toast.success(`Added ${picked.length} model(s) to assigned models list!`);
  };

  // Detail Model Object
  const detailModel = useMemo(() => {
    if (!detailModelId) return null;
    return models.find((m) => m.id === detailModelId) || null;
  }, [models, detailModelId]);

  // Detail Page Calculated Capabilities & Features
  const detailFeatures = useMemo(() => {
    if (!detailModel) return [];
    const FEATURE_DEFS = [
      { key: "function", label: "Function Calling" },
      { key: "vision", label: "Vision" },
      { key: "json", label: "JSON Mode" },
      { key: "streaming", label: "Streaming" },
      { key: "toolChoice", label: "Tool Choice" },
      { key: "parallel", label: "Parallel Calls" },
      { key: "audio", label: "Audio Input" },
      { key: "caching", label: "Prompt Caching" },
    ];
    const h = hashStr(detailModel.id);
    const extraOn: Record<string, boolean> = {
      toolChoice: detailModel.capabilities.includes("function"),
      parallel: h % 3 === 0,
      audio: h % 5 === 0,
      caching: h % 2 === 0,
    };

    return FEATURE_DEFS.map((f) => {
      const on = ["function", "vision", "json", "streaming"].includes(f.key)
        ? detailModel.capabilities.includes(f.key)
        : !!extraOn[f.key];
      return {
        key: f.key,
        label: f.label,
        on,
      };
    });
  }, [detailModel]);

  // Pool models search filter
  const filteredPoolModels = useMemo(() => {
    const q = addSearch.toLowerCase().trim();
    if (!q) return poolModels;
    return poolModels.filter(
      (m) => m.name.toLowerCase().includes(q) || m.providerName.toLowerCase().includes(q)
    );
  }, [poolModels, addSearch]);

  const addSelectedCount = useMemo(() => {
    return Object.values(addSelectedIds).filter(Boolean).length;
  }, [addSelectedIds]);

  // Label maps for price & context facet options
  const priceLabels: Record<string, string> = {
    all: "Any",
    u1: "Under $1",
    u3: "Under $3",
    u10: "Under $10",
    o10: "$10+",
  };

  const contextLabels: Record<string, string> = {
    all: "Any",
    "8k": "8K+",
    "32k": "32K+",
    "128k": "128K+",
  };

  // ==========================================
  // RENDER MODEL DETAIL VIEW
  // ==========================================
  if (view === "detail" && detailModel) {
    const isModeEmbedding =
      detailModel.name.includes("embed") ||
      detailModel.name.includes("image") ||
      detailModel.name.includes("tts");
    const modeLabel = isModeEmbedding ? "EMBEDDING" : "CHAT";
    const cacheReadPrice = (Math.round(detailModel.inputPrice * 0.1 * 100) / 100).toFixed(2);
    const cacheWritePrice = (Math.round(detailModel.inputPrice * 1.25 * 100) / 100).toFixed(2);

    return (
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
        {/* Back Navigation */}
        <div>
          <button
            onClick={() => {
              setView("list");
              setDetailModelId(null);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Model Management
          </button>

          {/* Model Identity Header */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-11 h-11 rounded-xl text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: detailModel.color }}
                >
                  {detailModel.providerName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold font-mono text-neutral-900 dark:text-white truncate">
                    {detailModel.name}
                  </h1>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                    {detailModel.providerName} &middot; Alias:{" "}
                    <span className="font-mono text-neutral-800 dark:text-neutral-200 font-semibold">
                      {detailModel.configured ? detailModel.alias || detailModel.name : "—"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold rounded-md tracking-wider">
                  {modeLabel}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${
                    detailModel.status === "Active"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      detailModel.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  {detailModel.status}
                </span>
              </div>
            </div>

            {/* Top Summary Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <div>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold block mb-1">
                  Context Window
                </span>
                <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                  {fmtContext(detailModel.contextWindow)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold block mb-1">
                  Input Price
                </span>
                <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                  ${detailModel.inputPrice.toFixed(2)}/M
                </span>
              </div>

              <div>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold block mb-1">
                  Output Price
                </span>
                <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                  ${detailModel.outputPrice.toFixed(2)}/M
                </span>
              </div>

              <div>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold block mb-1">
                  Max Output
                </span>
                <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                  {detailModel.maxOutput.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Three Responsive Content Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Card 1: Token Pricing */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Token Pricing
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Per 1M tokens where applicable
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    INPUT
                  </span>
                  <span className="text-base font-extrabold font-mono text-neutral-900 dark:text-white block">
                    ${detailModel.inputPrice.toFixed(2)}/M
                  </span>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    OUTPUT
                  </span>
                  <span className="text-base font-extrabold font-mono text-neutral-900 dark:text-white block">
                    ${detailModel.outputPrice.toFixed(2)}/M
                  </span>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    CACHE READ
                  </span>
                  <span className="text-base font-extrabold font-mono text-neutral-900 dark:text-white block">
                    ${cacheReadPrice}/M
                  </span>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    CACHE WRITE
                  </span>
                  <span className="text-base font-extrabold font-mono text-neutral-900 dark:text-white block">
                    ${cacheWritePrice}/M
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Model Info */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Model Info
              </h3>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-neutral-500">Provider</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {detailModel.providerName}
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-neutral-500">Mode</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {modeLabel}
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-neutral-500">Max Input</span>
                  <span className="font-semibold text-neutral-900 dark:text-white font-mono">
                    {detailModel.maxInput.toLocaleString()}{" "}
                    <span className="text-neutral-400 font-sans font-normal">tokens</span>
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-neutral-500">Max Output</span>
                  <span className="font-semibold text-neutral-900 dark:text-white font-mono">
                    {detailModel.maxOutput.toLocaleString()}{" "}
                    <span className="text-neutral-400 font-sans font-normal">tokens</span>
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-neutral-500">Status</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      detailModel.status === "Active" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        detailModel.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {detailModel.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Features */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Features
              </h3>

              <div className="space-y-2.5">
                {detailFeatures.map((f) => (
                  <div key={f.key} className="flex items-center gap-2.5 text-xs">
                    {f.on ? (
                      <Check className="w-4 h-4 text-emerald-500 font-extrabold shrink-0" />
                    ) : (
                      <span className="w-4 text-center text-neutral-400 shrink-0 font-bold">&mdash;</span>
                    )}
                    <span
                      className={
                        f.on
                          ? "text-neutral-900 dark:text-white font-medium"
                          : "text-neutral-400 dark:text-neutral-500"
                      }
                    >
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Card: Configuration Status */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4 mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Configuration
            </h3>

            {detailModel.configured ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-8 flex-wrap">
                  <div>
                    <span className="text-xs text-neutral-400 block mb-1">Status</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Configured
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-neutral-400 block mb-1">Business Alias</span>
                    <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white">
                      {detailModel.alias || detailModel.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-neutral-400 block mb-1">Credential</span>
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      {detailModel.credential || "Default Credential"}
                    </span>
                  </div>
                </div>

                <SecondaryButton onClick={() => handleOpenConfigModal(detailModel.id)}>
                  Edit Configuration
                </SecondaryButton>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 flex-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    This model has no credentials set &mdash; it can't be used until configured.
                  </span>
                </div>

                <PrimaryButton onClick={() => handleOpenConfigModal(detailModel.id)}>
                  Configure Now
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER MODEL LISTING VIEW
  // ==========================================
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* 1. Page Header */}
      <PageHeader
        title="Model Management"
        breadcrumbs={[
          { label: "AI Gateway" },
          { label: "Model Management", current: true },
        ]}
      >
        <PrimaryButton icon={Plus} onClick={() => setShowAddModal(true)}>
          Add Model
        </PrimaryButton>
      </PageHeader>

      {/* 2. Four KPI / Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Providers */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium block">
            Total Providers
          </span>
          <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white block">
            {statProviders}
          </span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block">
            Granted by Super Admin
          </span>
        </div>

        {/* Card 2: Total Models Assigned */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium block">
            Total Models Assigned
          </span>
          <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white block">
            {statTotal}
          </span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block">
            Granted by Super Admin
          </span>
        </div>

        {/* Card 3: Configured */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium block">
            Configured
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
            {statConfigured}
          </span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block">
            Ready to use
          </span>
        </div>

        {/* Card 4: Active Models */}
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium block">
            Active Models
          </span>
          <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white block">
            {statActive}
          </span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block">
            Routing Traffic
          </span>
        </div>
      </div>

      {/* 3. Cohesive Search & Filter Control Bar */}
      <div className="flex items-center justify-end gap-2 flex-wrap relative" ref={facetRef}>
        {/* Expandable/Collapsible Search Control */}
        {isSearchExpanded || searchQuery ? (
          <div className="relative w-48 sm:w-60 animate-fadeIn shrink-0">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              onBlur={() => {
                if (!searchQuery.trim()) {
                  setIsSearchExpanded(false);
                }
              }}
              placeholder="Search models..."
              className="w-full h-9 pl-8 pr-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white shadow-2xs"
            />
            <button
              onClick={() => {
                setSearchQuery("");
                setIsSearchExpanded(false);
                setCurrentPage(1);
              }}
              title="Close search"
              className="absolute right-2 top-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsSearchExpanded(true);
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }}
            title="Search models"
            className="h-9 w-9 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg text-neutral-700 dark:text-neutral-200 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            <Search className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          </button>
        )}

        {/* Provider Facet Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenFacet((prev) => (prev === "provider" ? null : "provider"))}
            className={`h-9 px-3 border rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs ${
              openFacet === "provider" || activeProviderFilterList.length > 0
                ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100"
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800"
            }`}
          >
            <span>Providers{activeProviderFilterList.length > 0 ? ` (${activeProviderFilterList.length})` : ""}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {openFacet === "provider" && (
            <div className="absolute top-full left-0 mt-1.5 w-60 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-3 z-30 space-y-1 animate-fadeIn">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block px-1 pb-1 border-b border-neutral-100 dark:border-neutral-800">
                Filter by Providers
              </span>
              <div className="max-h-56 overflow-y-auto space-y-0.5 pt-1">
                {PROVIDERS.map((p) => {
                  const checked = !!providerFilterIds[p.id];
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setProviderFilterIds((prev) => ({ ...prev, [p.id]: !prev[p.id] }));
                        setCurrentPage(1);
                      }}
                      className={`flex items-center justify-between p-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                        checked ? "bg-neutral-100 dark:bg-neutral-800 font-bold" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                            checked
                              ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900"
                              : "border-neutral-300 dark:border-neutral-700"
                          }`}
                        >
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{p.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {providerCounts[p.id] || 0}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Price In Facet Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenFacet((prev) => (prev === "price" ? null : "price"))}
            className={`h-9 px-3 border rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs ${
              openFacet === "price" || priceFilter !== "all"
                ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100"
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800"
            }`}
          >
            <span>Price In{priceFilter !== "all" ? ` (${priceLabels[priceFilter]})` : ""}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {openFacet === "price" && (
            <div className="absolute top-full left-0 mt-1.5 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 z-30 space-y-0.5 animate-fadeIn">
              {(["all", "u1", "u3", "u10", "o10"] as const).map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setPriceFilter(opt);
                    setCurrentPage(1);
                    setOpenFacet(null);
                  }}
                  className={`flex items-center gap-2 p-1.5 rounded-md text-xs cursor-pointer ${
                    priceFilter === opt ? "bg-neutral-100 dark:bg-neutral-800 font-bold" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                      priceFilter === opt ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white" : "border-neutral-300"
                    }`}
                  />
                  <span>{priceLabels[opt]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Out Facet Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenFacet((prev) => (prev === "priceOut" ? null : "priceOut"))}
            className={`h-9 px-3 border rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs ${
              openFacet === "priceOut" || priceOutFilter !== "all"
                ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100"
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800"
            }`}
          >
            <span>Price Out{priceOutFilter !== "all" ? ` (${priceLabels[priceOutFilter]})` : ""}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {openFacet === "priceOut" && (
            <div className="absolute top-full left-0 mt-1.5 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 z-30 space-y-0.5 animate-fadeIn">
              {(["all", "u1", "u3", "u10", "o10"] as const).map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setPriceOutFilter(opt);
                    setCurrentPage(1);
                    setOpenFacet(null);
                  }}
                  className={`flex items-center gap-2 p-1.5 rounded-md text-xs cursor-pointer ${
                    priceOutFilter === opt ? "bg-neutral-100 dark:bg-neutral-800 font-bold" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                      priceOutFilter === opt ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white" : "border-neutral-300"
                    }`}
                  />
                  <span>{priceLabels[opt]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Context Facet Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenFacet((prev) => (prev === "context" ? null : "context"))}
            className={`h-9 px-3 border rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs ${
              openFacet === "context" || contextFilter !== "all"
                ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100"
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800"
            }`}
          >
            <span>Context{contextFilter !== "all" ? ` (${contextLabels[contextFilter]})` : ""}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {openFacet === "context" && (
            <div className="absolute top-full left-0 mt-1.5 w-40 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 z-30 space-y-0.5 animate-fadeIn">
              {(["all", "8k", "32k", "128k"] as const).map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setContextFilter(opt);
                    setCurrentPage(1);
                    setOpenFacet(null);
                  }}
                  className={`flex items-center gap-2 p-1.5 rounded-md text-xs cursor-pointer ${
                    contextFilter === opt ? "bg-neutral-100 dark:bg-neutral-800 font-bold" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                      contextFilter === opt ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white" : "border-neutral-300"
                    }`}
                  />
                  <span>{contextLabels[opt]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Configuration States Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="h-9 px-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer shadow-2xs"
        >
          <option value="all">All configuration states</option>
          <option value="configured">Configured only</option>
          <option value="unconfigured">Needs configuration</option>
        </select>

        {/* Reset Filters Action */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="h-9 px-3 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
          >
            <X className="w-3.5 h-3.5" />
            Reset filters
          </button>
        )}
      </div>

      {/* 5. Model Listing Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 tracking-wider">
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Alias</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Context</th>
                <th className="py-3 px-4">In $/1M</th>
                <th className="py-3 px-4">Out $/1M</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Configuration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {paginatedModels.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400 font-medium">
                    No models found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedModels.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => {
                      setDetailModelId(row.id);
                      setView("detail");
                    }}
                    className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                  >
                    {/* Model Name */}
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-white truncate max-w-[260px]">
                      {row.name}
                    </td>

                    {/* Alias */}
                    <td className="py-3 px-4 font-mono text-neutral-500 dark:text-neutral-400">
                      {row.configured ? `<${row.alias || row.name}>` : "—"}
                    </td>

                    {/* Provider */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {row.providerName}
                      </span>
                    </td>

                    {/* Context Window */}
                    <td className="py-3 px-4 font-mono text-neutral-700 dark:text-neutral-300 font-medium">
                      {fmtContext(row.contextWindow)}
                    </td>

                    {/* In $/1M */}
                    <td className="py-3 px-4 font-mono text-neutral-700 dark:text-neutral-300 font-medium">
                      ${row.inputPrice.toFixed(2)}
                    </td>

                    {/* Out $/1M */}
                    <td className="py-3 px-4 font-mono text-neutral-700 dark:text-neutral-300 font-medium">
                      ${row.outputPrice.toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          row.status === "Active"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            row.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {row.status}
                      </span>
                    </td>

                    {/* Configuration Status Action */}
                    <td className="py-3 px-4">
                      {row.configured ? (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenConfigModal(row.id);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Configured</span>
                        </div>
                      ) : (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenConfigModal(row.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Not Configured</span>
                          <span className="underline ml-0.5">Configure</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Pagination Footer */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalRecords={filteredModels.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* ==========================================
          7. ADD MODEL MODAL WORKFLOW
          ========================================== */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fadeIn"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Add Model
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Models your Super Admin has granted access to, but that aren't in your list yet.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Available Pool Models Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                placeholder="Search available models..."
                className="w-full h-9 pl-9 pr-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Pool Models Selection List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredPoolModels.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400 font-medium">
                  No more granted models to add &mdash; ask your Super Admin for access to more.
                </div>
              ) : (
                filteredPoolModels.map((m) => {
                  const checked = !!addSelectedIds[m.id];
                  return (
                    <div
                      key={m.id}
                      onClick={() =>
                        setAddSelectedIds((prev) => ({ ...prev, [m.id]: !prev[m.id] }))
                      }
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        checked
                          ? "bg-primary-50/50 dark:bg-primary-950/30 border-primary-300 dark:border-primary-800"
                          : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center text-xs shrink-0 ${
                            checked
                              ? "bg-primary-600 text-white border-primary-600"
                              : "border-neutral-300 dark:border-neutral-700"
                          }`}
                        >
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white block truncate">
                            {m.name}
                          </span>
                          <span className="text-[11px] text-neutral-400 block font-medium">
                            {m.providerName} &middot; {fmtContext(m.contextWindow)} ctx
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <SecondaryButton onClick={() => setShowAddModal(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                disabled={addSelectedCount === 0}
                onClick={handleAddSelectedModels}
              >
                Add {addSelectedCount > 0 ? `(${addSelectedCount})` : ""}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          8. CONFIGURE MODEL MODAL WORKFLOW
          ========================================== */}
      {showConfigModal && configModelId && (
        <div
          onClick={() => setShowConfigModal(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Configure Model
                </h3>
                <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400 block mt-0.5">
                  {models.find((m) => m.id === configModelId)?.name}
                </span>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Credential Selection Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-900 dark:text-white block">
                Credential Selection
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setCredentialMode("existing")}
                  className={`p-3 rounded-xl border cursor-pointer space-y-1 transition-colors ${
                    credentialMode === "existing"
                      ? "bg-neutral-50 dark:bg-neutral-950 border-neutral-900 dark:border-white"
                      : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        credentialMode === "existing"
                          ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white"
                          : "border-neutral-300"
                      }`}
                    />
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Existing Credential
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 pl-5">
                    Reuse a stored credential
                  </p>
                </div>

                <div
                  onClick={() => setCredentialMode("new")}
                  className={`p-3 rounded-xl border cursor-pointer space-y-1 transition-colors ${
                    credentialMode === "new"
                      ? "bg-neutral-50 dark:bg-neutral-950 border-neutral-900 dark:border-white"
                      : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        credentialMode === "new"
                          ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white"
                          : "border-neutral-300"
                      }`}
                    />
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Configure New
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 pl-5">
                    Add base URL & API key
                  </p>
                </div>
              </div>
            </div>

            {/* Credential Inputs depending on mode */}
            {credentialMode === "existing" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                  Available Credentials
                </label>
                <select
                  value={activeCredential}
                  onChange={(e) => setActiveCredential(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="">Select a credential...</option>
                  <option value="Manual">Manual</option>
                  <option value="Team Shared Key">Team Shared Key</option>
                  <option value="Prod Key Vault">Prod Key Vault</option>
                  {sharedCreds.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.provider})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-2.5">
                <input
                  value={credentialName}
                  onChange={(e) => setCredentialName(e.target.value)}
                  placeholder="Credential Name (e.g. Prod OpenAI Key)"
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary-500"
                />
                <input
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="Base URL (optional)"
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary-500"
                />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="API Key"
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            )}

            {/* Model Alias Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-900 dark:text-white block">
                Model Alias
              </label>
              <p className="text-[11px] text-neutral-400">
                Business alias / display name your teams will see
              </p>
              <input
                value={aliasDraft}
                onChange={(e) => setAliasDraft(e.target.value)}
                placeholder="e.g. team-gpt4o, support-bot-model"
                className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Test Connection Result */}
            {testedOk && (
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Connection verified
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <SecondaryButton
                onClick={() => {
                  setTestedOk(true);
                  toast.success("Connection verified successfully!");
                }}
              >
                ✅ Test Connection
              </SecondaryButton>

              <div className="flex items-center gap-2">
                <SecondaryButton onClick={() => setShowConfigModal(false)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  disabled={
                    !aliasDraft.trim() ||
                    (credentialMode === "existing"
                      ? !activeCredential
                      : !credentialName.trim())
                  }
                  onClick={handleSaveConfig}
                >
                  Save
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
