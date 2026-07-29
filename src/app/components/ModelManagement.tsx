import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Cpu, 
  Pause, 
  Play, 
  Activity, 
  AlertTriangle, 
  X, 
  Columns3, 
  ArrowUpDown, 
  ArrowUp,
  ArrowDown,
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCw, 
  Globe, 
  FileText,
  DollarSign,
  Layers,
  Server,
  Loader2,
  KeyRound,
  BarChart3,
  EyeOff
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
import {
  FormModal,
  FormLabel,
  FormInput,
  FormField,
  FormSelect,
  FormGrid,
  FormFooter,
  FormSection
} from "./hb/common/Form";
import { getSharedCredentials, type CredentialItem } from "./CredentialsManagement";

// --- Model Interface ---
export interface ModelItem {
  id: string;
  modelId: string;
  provider: "OpenAI" | "Anthropic" | "Azure AI" | "DeepSeek" | "Ollama";
  name: string;
  alias: string;
  createdBy: string;
  createdOn: string;
  inputCost: number;
  outputCost: number;
  status: "Active" | "Paused" | "Inactive";
  credentialSource: "existing" | "new";
  credentialId?: string;
  apiBaseUrl?: string;
  apiKey?: string;
}

// --- Health Status Interface ---
export interface HealthStatusItem {
  modelId: string;
  name: string;
  provider: string;
  healthStatus: "Healthy" | "Unhealthy" | "None";
  errorDetails?: string;
  lastCheck: string;
  lastSuccess: string;
  monitoringPaused?: boolean;
}

// Initial Mock Models Data
const initialMockModels: ModelItem[] = [
  {
    id: "mod-1",
    modelId: "gpt-4o",
    provider: "OpenAI",
    name: "GPT-4o Omnimodel",
    alias: "primary-gpt4o",
    createdBy: "superadmin@spinecloudiq.com",
    createdOn: "2026-07-15",
    inputCost: 2.50,
    outputCost: 10.00,
    status: "Active",
    credentialSource: "existing",
    credentialId: "cred-101",
  },
  {
    id: "mod-2",
    modelId: "claude-3-5-sonnet",
    provider: "Anthropic",
    name: "Claude 3.5 Sonnet",
    alias: "claude-sonnet-v2",
    createdBy: "sarah.connor@hb.com",
    createdOn: "2026-07-16",
    inputCost: 3.00,
    outputCost: 15.00,
    status: "Active",
    credentialSource: "existing",
    credentialId: "cred-102",
  },
  {
    id: "mod-3",
    modelId: "azure-gpt-4o",
    provider: "Azure AI",
    name: "Azure OpenAI GPT-4o",
    alias: "azure-gpt4o-eastus",
    createdBy: "hbadmin@yopmail.com",
    createdOn: "2026-07-18",
    inputCost: 2.50,
    outputCost: 10.00,
    status: "Active",
    credentialSource: "existing",
    credentialId: "cred-103",
  },
  {
    id: "mod-4",
    modelId: "deepseek-r1",
    provider: "DeepSeek",
    name: "DeepSeek R1 Reasoning",
    alias: "deepseek-reasoner",
    createdBy: "alex.dev@hb.com",
    createdOn: "2026-07-20",
    inputCost: 0.55,
    outputCost: 2.19,
    status: "Active",
    credentialSource: "existing",
    credentialId: "cred-104",
  },
  {
    id: "mod-5",
    modelId: "llama-3-3-70b",
    provider: "Ollama",
    name: "Llama 3.3 70B Local",
    alias: "llama3-local-gpu",
    createdBy: "michael.scott@hb.com",
    createdOn: "2026-07-22",
    inputCost: 0.00,
    outputCost: 0.00,
    status: "Paused",
    credentialSource: "new",
    apiBaseUrl: "http://localhost:11434",
    apiKey: "ollama-key-local",
  },
];

// Initial Health Statuses Data
const initialMockHealth: HealthStatusItem[] = [
  {
    modelId: "gpt-4o",
    name: "GPT-4o Omnimodel",
    provider: "OpenAI",
    healthStatus: "Healthy",
    lastCheck: "Jul 29, 2026 16:40",
    lastSuccess: "Jul 29, 2026 16:40",
  },
  {
    modelId: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    healthStatus: "Healthy",
    lastCheck: "Jul 29, 2026 16:38",
    lastSuccess: "Jul 29, 2026 16:38",
  },
  {
    modelId: "azure-gpt-4o",
    name: "Azure OpenAI GPT-4o",
    provider: "Azure AI",
    healthStatus: "Healthy",
    lastCheck: "Jul 29, 2026 16:25",
    lastSuccess: "Jul 29, 2026 16:25",
  },
  {
    modelId: "deepseek-r1",
    name: "DeepSeek R1 Reasoning",
    provider: "DeepSeek",
    healthStatus: "Unhealthy",
    errorDetails: "Authentication Error: 401",
    lastCheck: "Jul 29, 2026 16:45",
    lastSuccess: "Jul 28, 2026 18:30",
  },
  {
    modelId: "llama-3-3-70b",
    name: "Llama 3.3 70B Local",
    provider: "Ollama",
    healthStatus: "None",
    errorDetails: "Connection Timeout",
    lastCheck: "Jul 29, 2026 15:10",
    lastSuccess: "Jul 27, 2026 12:00",
    monitoringPaused: true,
  },
];

// Provider Preset Models Dictionary
const providerPresetModels: Record<string, { id: string; name: string; inCost: number; outCost: number }[]> = {
  OpenAI: [
    { id: "gpt-4o", name: "GPT-4o Omnimodel", inCost: 2.50, outCost: 10.00 },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", inCost: 0.15, outCost: 0.60 },
    { id: "o1", name: "OpenAI o1 Reasoning", inCost: 15.00, outCost: 60.00 },
    { id: "o3-mini", name: "OpenAI o3 Mini", inCost: 1.10, outCost: 4.40 },
  ],
  "Azure AI": [
    { id: "azure-gpt-4o", name: "Azure OpenAI GPT-4o", inCost: 2.50, outCost: 10.00 },
    { id: "azure-gpt-35-turbo", name: "Azure GPT-3.5 Turbo", inCost: 0.50, outCost: 1.50 },
  ],
  Anthropic: [
    { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", inCost: 3.00, outCost: 15.00 },
    { id: "claude-3-5-haiku", name: "Claude 3.5 Haiku", inCost: 1.00, outCost: 5.00 },
    { id: "claude-3-opus", name: "Claude 3 Opus", inCost: 15.00, outCost: 75.00 },
  ],
  DeepSeek: [
    { id: "deepseek-r1", name: "DeepSeek R1 Reasoning", inCost: 0.55, outCost: 2.19 },
    { id: "deepseek-v3", name: "DeepSeek V3 Model", inCost: 0.14, outCost: 0.28 },
  ],
  Ollama: [
    { id: "llama-3-3-70b", name: "Llama 3.3 70B Local", inCost: 0.00, outCost: 0.00 },
    { id: "qwen2-5-coder", name: "Qwen 2.5 Coder 32B", inCost: 0.00, outCost: 0.00 },
  ],
};

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return "—";
  if (dateStr.includes(",")) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function ModelManagement() {
  const [activeTab, setActiveTab] = useState<"models" | "health">("models");
  
  // Data State
  const [models, setModels] = useState<ModelItem[]>(initialMockModels);
  const [healthItems, setHealthItems] = useState<HealthStatusItem[]>(initialMockHealth);
  const [isLoading, setIsLoading] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Right-Side Filter Drawer State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filterProvider, setFilterProvider] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [appliedProvider, setAppliedProvider] = useState("All");
  const [appliedStatus, setAppliedStatus] = useState("All");

  // Summary Cards State
  const [showSummary, setShowSummary] = useState(true);

  // Sorting State
  const [sortField, setSortField] = useState<keyof ModelItem>("modelId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Popups State
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelItem | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingModel, setDeletingModel] = useState<ModelItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pausingModel, setPausingModel] = useState<ModelItem | null>(null);
  const [isPausing, setIsPausing] = useState(false);

  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const columnAnchorRef = useRef<HTMLDivElement>(null);

  // Test Connection Modals State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [testConnectionMessage, setTestConnectionMessage] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Add/Edit Model Form State
  const [formProvider, setFormProvider] = useState<ModelItem["provider"]>("OpenAI");
  const [formModelId, setFormModelId] = useState("gpt-4o");
  const [formModelName, setFormModelName] = useState("GPT-4o Omnimodel");
  const [formModelAlias, setFormModelAlias] = useState("");
  const [formCredentialSource, setFormCredentialSource] = useState<"existing" | "new">("existing");
  const [formCredentialId, setFormCredentialId] = useState<string>("");
  const [formApiBaseUrl, setFormApiBaseUrl] = useState("https://api.openai.com/v1");
  const [formApiKey, setFormApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSavingModel, setIsSavingModel] = useState(false);

  // Dynamic credentials from Credentials Management store
  const availableCredentials = useMemo(() => getSharedCredentials(), [showAddModelModal]);

  useEffect(() => {
    if (availableCredentials.length > 0 && !formCredentialId) {
      setFormCredentialId(availableCredentials[0].id);
    }
  }, [availableCredentials, formCredentialId]);

  // Column config for Models Tab
  const allColumns: ColumnConfig[] = [
    { key: "modelId", label: "Model ID" },
    { key: "provider", label: "Provider" },
    { key: "name", label: "Model Name" },
    { key: "alias", label: "Model Alias" },
    { key: "createdBy", label: "Created By" },
    { key: "createdOn", label: "Created On" },
    { key: "cost", label: "Cost (USD)" },
    { key: "status", label: "Status" },
  ];

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    modelId: true,
    provider: true,
    name: true,
    alias: true,
    createdBy: true,
    createdOn: true,
    cost: true,
    status: true,
  });

  const toggleColumn = (key: string) => {
    if (key === "modelId" || key === "status") return;
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyText = (text: string, label: string = "Model ID copied to clipboard!") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  // Immediate Export Handler
  const handleImmediateExport = () => {
    toast.success("Exporting Models to CSV...");
  };

  // KPI Summary Calculations
  const kpiStats = useMemo(() => {
    const total = models.length;
    const active = models.filter((m) => m.status === "Active").length;
    const paused = models.filter((m) => m.status === "Paused").length;
    const healthy = healthItems.filter((h) => h.healthStatus === "Healthy").length;
    const unhealthy = healthItems.filter((h) => h.healthStatus === "Unhealthy").length;

    return [
      { id: "total", label: "Total Models", value: total.toString(), subValue: `${active} Active in Gateway` },
      { id: "active", label: "Active Models", value: active.toString(), subValue: `${((active / (total || 1)) * 100).toFixed(0)}% Routing Traffic` },
      { id: "healthy", label: "Healthy Models", value: healthy.toString(), subValue: `${unhealthy} Unhealthy Alerts` },
      { id: "paused", label: "Paused Models", value: paused.toString(), subValue: "Serving Suspended" },
    ];
  }, [models, healthItems]);

  // Provider change handler
  const handleFormProviderChange = (prov: ModelItem["provider"]) => {
    setFormProvider(prov);
    const presets = providerPresetModels[prov] || [];
    if (presets.length > 0) {
      setFormModelId(presets[0].id);
      setFormModelName(presets[0].name);
    }
    const defaultUrls: Record<string, string> = {
      OpenAI: "https://api.openai.com/v1",
      Anthropic: "https://api.anthropic.com/v1",
      "Azure AI": "https://your-resource.openai.azure.com",
      DeepSeek: "https://api.deepseek.com/v1",
      Ollama: "http://localhost:11434",
    };
    setFormApiBaseUrl(defaultUrls[prov] || "");
  };

  // Model Preset change handler
  const handleFormModelPresetChange = (mId: string) => {
    setFormModelId(mId);
    const preset = providerPresetModels[formProvider]?.find((p) => p.id === mId);
    if (preset) {
      setFormModelName(preset.name);
    }
  };

  // Sorting Handler
  const handleSort = (field: keyof ModelItem) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIndicator = (field: keyof ModelItem) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 font-bold" />
    );
  };

  // Filtered Models List
  const filteredModels = useMemo(() => {
    return models.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.modelId.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.alias.toLowerCase().includes(q);

      const matchesProvider = appliedProvider === "All" || item.provider === appliedProvider;
      const matchesStatus = appliedStatus === "All" || item.status === appliedStatus;

      return matchesQuery && matchesProvider && matchesStatus;
    });
  }, [models, searchQuery, appliedProvider, appliedStatus]);

  // Sorted Models List
  const sortedModels = useMemo(() => {
    return [...filteredModels].sort((a, b) => {
      let valA: any = a[sortField] || "";
      let valB: any = b[sortField] || "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredModels, sortField, sortDirection]);

  // Filtered Health List
  const filteredHealth = useMemo(() => {
    return healthItems.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.modelId.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q);

      const matchesStatus = appliedStatus === "All" || item.healthStatus === appliedStatus;

      return matchesQuery && matchesStatus;
    });
  }, [healthItems, searchQuery, appliedStatus]);

  // Open Add Model Modal
  const handleOpenAddModel = () => {
    setIsEditMode(false);
    setEditingModel(null);
    setFormProvider("OpenAI");
    setFormModelId("gpt-4o");
    setFormModelName("GPT-4o Omnimodel");
    setFormModelAlias("");
    setFormCredentialSource("existing");
    if (availableCredentials.length > 0) {
      setFormCredentialId(availableCredentials[0].id);
    }
    setFormApiBaseUrl("https://api.openai.com/v1");
    setFormApiKey("");
    setShowApiKey(false);
    setShowAddModelModal(true);
  };

  // Open Edit Model Modal
  const handleOpenEditModel = (item: ModelItem) => {
    setIsEditMode(true);
    setEditingModel(item);
    setFormProvider(item.provider);
    setFormModelId(item.modelId);
    setFormModelName(item.name);
    setFormModelAlias(item.alias);
    setFormCredentialSource(item.credentialSource || "existing");
    setFormCredentialId(item.credentialId || (availableCredentials[0]?.id || ""));
    setFormApiBaseUrl(item.apiBaseUrl || "https://api.openai.com/v1");
    setFormApiKey(item.apiKey || "");
    setShowApiKey(false);
    setShowAddModelModal(true);
  };

  // Add/Edit Form Validation
  const isModelFormValid = useMemo(() => {
    if (!formProvider || !formModelId) return false;
    if (formCredentialSource === "existing") {
      return formCredentialId.length > 0;
    } else {
      return formApiBaseUrl.trim().length > 0 && formApiKey.trim().length > 0;
    }
  }, [formProvider, formModelId, formCredentialSource, formCredentialId, formApiBaseUrl, formApiKey]);

  // Save Model Form
  const handleSaveModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isModelFormValid) {
      toast.error("Please fill in all required model fields.");
      return;
    }

    setIsSavingModel(true);
    setTimeout(() => {
      const preset = providerPresetModels[formProvider]?.find((p) => p.id === formModelId);
      const inCost = preset ? preset.inCost : 1.00;
      const outCost = preset ? preset.outCost : 5.00;
      const todayDate = new Date().toISOString().split("T")[0];
      const user = "hbadmin@yopmail.com";

      if (isEditMode && editingModel) {
        setModels((prev) =>
          prev.map((item) =>
            item.id === editingModel.id
              ? {
                  ...item,
                  provider: formProvider,
                  modelId: formModelId,
                  name: formModelName,
                  alias: formModelAlias || formModelId,
                  credentialSource: formCredentialSource,
                  credentialId: formCredentialSource === "existing" ? formCredentialId : undefined,
                  apiBaseUrl: formCredentialSource === "new" ? formApiBaseUrl : undefined,
                  apiKey: formCredentialSource === "new" ? formApiKey : undefined,
                }
              : item
          )
        );
        toast.success("Model configuration updated successfully!");
      } else {
        const newModel: ModelItem = {
          id: `mod-${Date.now().toString().slice(-4)}`,
          modelId: formModelId,
          provider: formProvider,
          name: formModelName,
          alias: formModelAlias.trim() || `${formModelId}-alias`,
          createdBy: user,
          createdOn: todayDate,
          inputCost: inCost,
          outputCost: outCost,
          status: "Active",
          credentialSource: formCredentialSource,
          credentialId: formCredentialSource === "existing" ? formCredentialId : undefined,
          apiBaseUrl: formCredentialSource === "new" ? formApiBaseUrl : undefined,
          apiKey: formCredentialSource === "new" ? formApiKey : undefined,
        };

        setModels((prev) => [newModel, ...prev]);

        const newHealth: HealthStatusItem = {
          modelId: formModelId,
          name: formModelName,
          provider: formProvider,
          healthStatus: "Healthy",
          lastCheck: `${formatDateDisplay(todayDate)} 16:50`,
          lastSuccess: `${formatDateDisplay(todayDate)} 16:50`,
        };
        setHealthItems((prev) => [newHealth, ...prev.filter((h) => h.modelId !== formModelId)]);

        toast.success("Model added successfully!");
      }

      setIsSavingModel(false);
      setShowAddModelModal(false);
    }, 500);
  };

  // Test Connection Action
  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setTimeout(() => {
      setIsTestingConnection(false);

      if (formCredentialSource === "existing") {
        const cred = availableCredentials.find((c) => c.id === formCredentialId);
        if (cred && cred.status === "Inactive") {
          setTestConnectionMessage("Authentication failed (401). Verify the API key or endpoint URL before saving.");
          setShowErrorModal(true);
          return;
        }
        setTestConnectionMessage(`Successfully connected to the selected provider using credential "${cred?.name || formCredentialId}".`);
        setShowSuccessModal(true);
      } else {
        if (formApiKey.trim().length > 0 && formApiBaseUrl.trim().length > 0) {
          setTestConnectionMessage("Successfully connected to the selected provider using the supplied credentials.");
          setShowSuccessModal(true);
        } else {
          setTestConnectionMessage("Authentication failed (401). Verify the API key or endpoint URL before saving.");
          setShowErrorModal(true);
        }
      }
    }, 600);
  };

  // Toggle Pause/Resume Model
  const handleTogglePauseModel = (item: ModelItem) => {
    setIsPausing(true);
    setTimeout(() => {
      const nextStatus = item.status === "Paused" ? "Active" : "Paused";
      setModels((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, status: nextStatus } : m))
      );
      toast.success(
        `Model "${item.name}" ${nextStatus === "Paused" ? "paused" : "resumed"} successfully.`
      );
      setIsPausing(false);
      setShowPauseModal(false);
      setPausingModel(null);
    }, 300);
  };

  // Delete Model
  const handleDeleteModel = () => {
    if (!deletingModel) return;
    setIsDeleting(true);
    setTimeout(() => {
      setModels((prev) => prev.filter((m) => m.id !== deletingModel.id));
      setHealthItems((prev) => prev.filter((h) => h.modelId !== deletingModel.modelId));
      toast.success(`Model "${deletingModel.name}" deleted successfully.`);
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletingModel(null);
    }, 400);
  };

  // Global Health Validation
  const handleRunAllHealthChecks = () => {
    setIsLoading(true);
    const toastId = toast.loading("Running health validation for all configured models...");
    setTimeout(() => {
      const now = `${formatDateDisplay(new Date().toISOString().split("T")[0])} 16:55`;
      setHealthItems((prev) =>
        prev.map((item) => {
          if (item.monitoringPaused) return item;
          const isHealthy = item.healthStatus !== "Unhealthy" || Math.random() > 0.3;
          return {
            ...item,
            healthStatus: isHealthy ? "Healthy" : "Unhealthy",
            errorDetails: isHealthy ? undefined : "Authentication Error: 401",
            lastCheck: now,
            lastSuccess: isHealthy ? now : item.lastSuccess,
          };
        })
      );
      setIsLoading(false);
      toast.dismiss(toastId);
      toast.success("Health validation complete for all models.");
    }, 1000);
  };

  // Single Model Health Check
  const handleRunSingleHealthCheck = (hItem: HealthStatusItem) => {
    const toastId = toast.loading(`Checking health for ${hItem.name}...`);
    setTimeout(() => {
      const now = `${formatDateDisplay(new Date().toISOString().split("T")[0])} 16:55`;
      setHealthItems((prev) =>
        prev.map((item) =>
          item.modelId === hItem.modelId
            ? {
                ...item,
                healthStatus: "Healthy",
                errorDetails: undefined,
                lastCheck: now,
                lastSuccess: now,
              }
            : item
        )
      );
      toast.dismiss(toastId);
      toast.success(`Health check passed for ${hItem.name}.`);
    }, 600);
  };

  // Toggle Pause Monitoring
  const handleTogglePauseMonitoring = (hItem: HealthStatusItem) => {
    setHealthItems((prev) =>
      prev.map((item) =>
        item.modelId === hItem.modelId
          ? {
              ...item,
              monitoringPaused: !item.monitoringPaused,
              healthStatus: !item.monitoringPaused ? "None" : "Healthy",
            }
          : item
      )
    );
    toast.info(
      `Health monitoring ${hItem.monitoringPaused ? "resumed" : "paused"} for ${hItem.name}.`
    );
  };

  // Refresh action
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Models list refreshed");
    }, 500);
  };

  // Apply Filter Drawer
  const handleApplyFilterDrawer = () => {
    setAppliedProvider(filterProvider);
    setAppliedStatus(filterStatus);
    setShowFilterDrawer(false);
    toast.success("Filter applied");
  };

  // Reset Filter Drawer
  const handleResetFilterDrawer = () => {
    setFilterProvider("All");
    setFilterStatus("All");
    setAppliedProvider("All");
    setAppliedStatus("All");
    setShowFilterDrawer(false);
    toast.info("Filter reset");
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Page Header — Canonical HB Layout matching Virtual Keys */}
      <PageHeader
        title="Model Management"
        pageId="model-management"
        action="list"
      >
        <SearchBar
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
          placeholder={activeTab === "models" ? "Search by Model ID, Model Name or Alias..." : "Search by Model Name or Model ID..."}
        />

        {activeTab === "models" && (
          <IconButton
            icon={Filter}
            label="Filter"
            onClick={() => setShowFilterDrawer(true)}
            title="Filter Models"
          />
        )}

        {activeTab === "models" && (
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
        )}

        <IconButton
          icon={Download}
          label="Export"
          onClick={handleImmediateExport}
          title="Export Models to CSV"
        />

        <IconButton
          icon={RefreshCw}
          label="Refresh"
          onClick={handleRefresh}
          title="Refresh Models List"
        />

        <IconButton
          icon={showSummary ? EyeOff : BarChart3}
          label={showSummary ? "Hide Summary" : "Show Summary"}
          onClick={() => setShowSummary(!showSummary)}
          title={showSummary ? "Hide KPI Summary Cards" : "Show KPI Summary Cards"}
        />

        {activeTab === "models" ? (
          <PrimaryButton icon={Plus} onClick={handleOpenAddModel}>
            Add Model
          </PrimaryButton>
        ) : (
          <PrimaryButton icon={Activity} onClick={handleRunAllHealthChecks}>
            Run All Checks
          </PrimaryButton>
        )}
      </PageHeader>

      {/* HB Summary KPI Cards (Appears immediately after PageHeader) */}
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

      {/* HB Master Tabs Component */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("models")}
            className={`pb-3.5 px-1 border-b-2 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "models"
                ? "border-primary-600 text-primary-600 dark:text-primary-400 font-semibold"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Models</span>
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-normal">
              {models.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("health")}
            className={`pb-3.5 px-1 border-b-2 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "health"
                ? "border-primary-600 text-primary-600 dark:text-primary-400 font-semibold"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Health Status</span>
            {healthItems.some((h) => h.healthStatus === "Unhealthy") && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </button>
        </nav>
      </div>

      {/* ==================== TAB 1: MODELS ==================== */}
      {activeTab === "models" && (
        <div className="space-y-6">
          {/* Active Filter Badges */}
          {(appliedProvider !== "All" || appliedStatus !== "All") && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-neutral-500">Active filters:</span>
              {appliedProvider !== "All" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full border border-neutral-200 dark:border-neutral-700">
                  Provider: {appliedProvider}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500 ml-1" onClick={() => setAppliedProvider("All")} />
                </span>
              )}
              {appliedStatus !== "All" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full border border-neutral-200 dark:border-neutral-700">
                  Status: {appliedStatus}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500 ml-1" onClick={() => setAppliedStatus("All")} />
                </span>
              )}
              <button onClick={handleResetFilterDrawer} className="text-primary-600 hover:underline text-xs ml-2">
                Clear all
              </button>
            </div>
          )}

          {/* HB Enterprise Table */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto min-h-[320px]">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium sticky top-0 z-10">
                  <tr>
                    {visibleColumns.modelId && (
                      <th
                        className="p-4 font-medium cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
                        onClick={() => handleSort("modelId")}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Model ID</span>
                          {renderSortIndicator("modelId")}
                        </div>
                      </th>
                    )}
                    {visibleColumns.provider && (
                      <th
                        className="p-4 font-medium cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
                        onClick={() => handleSort("provider")}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Provider</span>
                          {renderSortIndicator("provider")}
                        </div>
                      </th>
                    )}
                    {visibleColumns.name && (
                      <th
                        className="p-4 font-medium cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Model Name</span>
                          {renderSortIndicator("name")}
                        </div>
                      </th>
                    )}
                    {visibleColumns.alias && (
                      <th
                        className="p-4 font-medium cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
                        onClick={() => handleSort("alias")}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Model Alias</span>
                          {renderSortIndicator("alias")}
                        </div>
                      </th>
                    )}
                    {visibleColumns.createdBy && <th className="p-4 font-medium">Created By</th>}
                    {visibleColumns.createdOn && (
                      <th
                        className="p-4 font-medium cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
                        onClick={() => handleSort("createdOn")}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Created On</span>
                          {renderSortIndicator("createdOn")}
                        </div>
                      </th>
                    )}
                    {visibleColumns.cost && <th className="p-4 font-medium">Cost (USD)</th>}
                    {visibleColumns.status && (
                      <th
                        className="p-4 font-medium cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Status</span>
                          {renderSortIndicator("status")}
                        </div>
                      </th>
                    )}
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={`skel-${idx}`} className="animate-pulse">
                        <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-24"></div></td>
                        <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-20"></div></td>
                        <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-36"></div></td>
                        <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-28"></div></td>
                        <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-32"></div></td>
                        <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-24"></div></td>
                        <td className="p-4"><div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-24"></div></td>
                        <td className="p-4"><div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full w-16"></div></td>
                        <td className="p-4 text-right"><div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-8 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : sortedModels.length > 0 ? (
                    sortedModels.map((item) => (
                      <tr 
                        key={item.id} 
                        className="hover:bg-neutral-50/80 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest("button, input, a, [data-flyout-container]")) return;
                          handleOpenEditModel(item);
                        }}
                      >
                        {visibleColumns.modelId && (
                          <td className="p-4 font-mono font-medium text-neutral-900 dark:text-white">
                            <div className="flex items-center gap-1.5">
                              <span>{item.modelId}</span>
                              <IconButton
                                icon={Copy}
                                onClick={() => handleCopyText(item.modelId)}
                                title="Copy Model ID"
                                borderless
                              />
                            </div>
                          </td>
                        )}

                        {visibleColumns.provider && (
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                              <Globe className="w-3.5 h-3.5 text-neutral-500" />
                              {item.provider}
                            </span>
                          </td>
                        )}

                        {visibleColumns.name && (
                          <td className="p-4 font-medium text-neutral-900 dark:text-white hover:text-primary-600 transition-colors">
                            {item.name}
                          </td>
                        )}

                        {visibleColumns.alias && (
                          <td className="p-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                            {item.alias}
                          </td>
                        )}

                        {visibleColumns.createdBy && (
                          <td className="p-4 text-neutral-600 dark:text-neutral-400 text-xs truncate max-w-[150px]">
                            {item.createdBy}
                          </td>
                        )}

                        {visibleColumns.createdOn && (
                          <td className="p-4 text-neutral-600 dark:text-neutral-400 text-xs">
                            {formatDateDisplay(item.createdOn)}
                          </td>
                        )}

                        {visibleColumns.cost && (
                          <td className="p-4">
                            <div className="space-y-0.5 text-xs font-mono leading-tight">
                              <div className="text-neutral-700 dark:text-neutral-300">
                                <span className="text-neutral-400 font-sans">Input:</span> ${item.inputCost.toFixed(2)}
                              </div>
                              <div className="text-neutral-700 dark:text-neutral-300">
                                <span className="text-neutral-400 font-sans">Output:</span> ${item.outputCost.toFixed(2)}
                              </div>
                            </div>
                          </td>
                        )}

                        {visibleColumns.status && (
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                item.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                                  : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        )}

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end">
                            <IconButton
                              icon={MoreVertical}
                              title="Actions"
                              borderless
                              menuItems={[
                                {
                                  icon: Edit3,
                                  label: "Edit",
                                  onClick: () => handleOpenEditModel(item),
                                },
                                {
                                  icon: item.status === "Paused" ? Play : Pause,
                                  label: item.status === "Paused" ? "Resume Model" : "Pause Model",
                                  onClick: () => {
                                    setPausingModel(item);
                                    setShowPauseModal(true);
                                  },
                                },
                                {
                                  icon: Trash2,
                                  label: "Delete",
                                  onClick: () => {
                                    setDeletingModel(item);
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
                      <td colSpan={9} className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400">
                            <Cpu className="w-6 h-6" />
                          </div>
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                            No Models Found
                          </h3>
                          <p className="text-xs text-neutral-500 text-center">
                            No AI model configurations found matching your search. Add a new model to get started.
                          </p>
                          <PrimaryButton icon={Plus} onClick={handleOpenAddModel}>
                            Add Model
                          </PrimaryButton>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {sortedModels.length > 0 && !isLoading && (
              <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.max(1, Math.ceil(sortedModels.length / pageSize))}
                  pageSize={pageSize}
                  totalItems={sortedModels.length}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: HEALTH STATUS ==================== */}
      {activeTab === "health" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto min-h-[320px]">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium sticky top-0 z-10">
                  <tr>
                    <th className="p-4 font-medium">Model Name</th>
                    <th className="p-4 font-medium">Model ID</th>
                    <th className="p-4 font-medium">Health Status</th>
                    <th className="p-4 font-medium">Error Details</th>
                    <th className="p-4 font-medium">Last Check</th>
                    <th className="p-4 font-medium">Last Success</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                  {filteredHealth.length > 0 ? (
                    filteredHealth.map((item) => (
                      <tr key={item.modelId} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="p-4 font-medium text-neutral-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                          {item.modelId}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                              item.healthStatus === "Healthy"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                                : item.healthStatus === "Unhealthy"
                                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
                                : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800"
                            }`}
                          >
                            {item.healthStatus === "Healthy" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : item.healthStatus === "Unhealthy" ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : (
                              <HelpCircle className="w-3.5 h-3.5" />
                            )}
                            {item.healthStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          {item.errorDetails ? (
                            <span
                              className="text-xs text-red-600 dark:text-red-400 font-mono truncate block max-w-xs cursor-pointer"
                              title={item.errorDetails}
                            >
                              {item.errorDetails}
                            </span>
                          ) : (
                            <span className="text-xs text-neutral-400 font-mono">--</span>
                          )}
                        </td>
                        <td className="p-4 text-neutral-600 dark:text-neutral-400 text-xs">{item.lastCheck}</td>
                        <td className="p-4 text-neutral-600 dark:text-neutral-400 text-xs">{item.lastSuccess}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end">
                            <IconButton
                              icon={MoreVertical}
                              title="Actions"
                              borderless
                              menuItems={[
                                {
                                  icon: RefreshCw,
                                  label: "Run Health Check",
                                  onClick: () => handleRunSingleHealthCheck(item),
                                },
                                {
                                  icon: RotateCw,
                                  label: "Refresh Status",
                                  onClick: () => handleRunSingleHealthCheck(item),
                                },
                                {
                                  icon: item.monitoringPaused ? Play : Pause,
                                  label: item.monitoringPaused ? "Resume Monitoring" : "Pause Monitoring",
                                  onClick: () => handleTogglePauseMonitoring(item),
                                },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400">
                            <Activity className="w-6 h-6" />
                          </div>
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                            No Health Status Available
                          </h3>
                          <p className="text-xs text-neutral-500 text-center">
                            No health status checks have been executed yet. Click below to run validation.
                          </p>
                          <PrimaryButton icon={Activity} onClick={handleRunAllHealthChecks}>
                            Run All Checks
                          </PrimaryButton>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Standardized Right-Side Slide-Over Filter Drawer Panel */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setShowFilterDrawer(false)} 
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-neutral-950 shadow-2xl border-l border-neutral-200 dark:border-neutral-800 flex flex-col">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Filter Models</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Filter models by provider and gateway status.</p>
                </div>
                <button 
                  onClick={() => setShowFilterDrawer(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                <FormSection title="Filter Parameters">
                  <FormField>
                    <FormLabel>Provider</FormLabel>
                    <FormSelect
                      value={filterProvider}
                      onChange={(e) => setFilterProvider(e.target.value)}
                    >
                      <option value="All">All Providers</option>
                      <option value="OpenAI">OpenAI</option>
                      <option value="Azure AI">Azure AI</option>
                      <option value="Anthropic">Anthropic</option>
                      <option value="DeepSeek">DeepSeek</option>
                      <option value="Ollama">Ollama</option>
                    </FormSelect>
                  </FormField>

                  <FormField>
                    <FormLabel>Status</FormLabel>
                    <FormSelect
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                      <option value="Inactive">Inactive</option>
                    </FormSelect>
                  </FormField>
                </FormSection>
              </div>

              {/* Sticky Footer */}
              <div className="p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-end gap-3 sticky bottom-0">
                <SecondaryButton type="button" onClick={handleResetFilterDrawer}>
                  Reset Filters
                </SecondaryButton>
                <PrimaryButton type="button" onClick={handleApplyFilterDrawer}>
                  Apply Filters
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Model HB Large Modal */}
      <FormModal
        isOpen={showAddModelModal}
        onClose={() => setShowAddModelModal(false)}
        title={isEditMode ? "Edit Model" : "Add Model"}
        description="Configure provider models and authentication."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveModel} className="space-y-5">
          <FormSection title="Section 1 — Provider Selection">
            <FormGrid cols={2}>
              <FormField>
                <FormLabel htmlFor="model-provider-select" required>
                  Provider
                </FormLabel>
                <FormSelect
                  id="model-provider-select"
                  value={formProvider}
                  onChange={(e) => handleFormProviderChange(e.target.value as ModelItem["provider"])}
                  required
                >
                  <option value="OpenAI">OpenAI</option>
                  <option value="Azure AI">Azure AI</option>
                  <option value="Anthropic">Anthropic</option>
                  <option value="DeepSeek">DeepSeek</option>
                  <option value="Ollama">Ollama</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="model-id-select" required>
                  Model
                </FormLabel>
                <FormSelect
                  id="model-id-select"
                  value={formModelId}
                  onChange={(e) => handleFormModelPresetChange(e.target.value)}
                  required
                >
                  {(providerPresetModels[formProvider] || []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.id})
                    </option>
                  ))}
                </FormSelect>
              </FormField>
            </FormGrid>
          </FormSection>

          <FormSection title="Section 3 — Model Alias">
            <FormField>
              <FormLabel htmlFor="model-alias-input">Model Alias (Optional)</FormLabel>
              <FormInput
                id="model-alias-input"
                type="text"
                placeholder="e.g. primary-gpt4o"
                value={formModelAlias}
                onChange={(e) => setFormModelAlias(e.target.value)}
              />
            </FormField>
          </FormSection>

          <FormSection title="Section 4 — Credential Source">
            <div className="space-y-3">
              <div className="flex items-center gap-6 p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  <input
                    type="radio"
                    name="credentialSource"
                    value="existing"
                    checked={formCredentialSource === "existing"}
                    onChange={() => setFormCredentialSource("existing")}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span>Use Existing Credentials</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  <input
                    type="radio"
                    name="credentialSource"
                    value="new"
                    checked={formCredentialSource === "new"}
                    onChange={() => setFormCredentialSource("new")}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span>Configure New Credentials</span>
                </label>
              </div>

              {formCredentialSource === "existing" && (
                <FormField>
                  <FormLabel required>Existing Credentials</FormLabel>
                  <FormSelect
                    value={formCredentialId}
                    onChange={(e) => setFormCredentialId(e.target.value)}
                    required
                  >
                    {availableCredentials.length > 0 ? (
                      availableCredentials.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.provider} - {c.status})
                        </option>
                      ))
                    ) : (
                      <option value="">No saved credentials found</option>
                    )}
                  </FormSelect>
                </FormField>
              )}

              {formCredentialSource === "new" && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3">
                  <FormField>
                    <FormLabel required>API Base URL</FormLabel>
                    <FormInput
                      type="url"
                      placeholder="https://api.provider.com/v1"
                      value={formApiBaseUrl}
                      onChange={(e) => setFormApiBaseUrl(e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField>
                    <FormLabel required>API Key</FormLabel>
                    <div className="relative">
                      <FormInput
                        type={showApiKey ? "text" : "password"}
                        placeholder="Enter API key string..."
                        value={formApiKey}
                        onChange={(e) => setFormApiKey(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                        title={showApiKey ? "Hide Password" : "Show Password"}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormField>
                </div>
              )}
            </div>
          </FormSection>

          <FormFooter>
            <SecondaryButton type="button" onClick={() => setShowAddModelModal(false)} disabled={isSavingModel}>
              Cancel
            </SecondaryButton>
            <SecondaryButton type="button" onClick={handleTestConnection} disabled={isTestingConnection || isSavingModel}>
              {isTestingConnection ? "Testing..." : "Test Connection"}
            </SecondaryButton>
            <button
              type="submit"
              disabled={!isModelFormValid || isSavingModel}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSavingModel && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSavingModel ? "Saving..." : isEditMode ? "Save Changes" : "Save Model"}</span>
            </button>
          </FormFooter>
        </form>
      </FormModal>

      {/* Test Connection Success Modal */}
      <FormModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Connection Successful"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold block text-sm">Connection Successful</span>
              <p>{testConnectionMessage}</p>
            </div>
          </div>
          <FormFooter>
            <PrimaryButton onClick={() => setShowSuccessModal(false)}>
              Close
            </PrimaryButton>
          </FormFooter>
        </div>
      </FormModal>

      {/* Test Connection Failure Modal */}
      <FormModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Connection Failed"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold block text-sm">Provider Error (401)</span>
              <p>{testConnectionMessage}</p>
            </div>
          </div>
          <FormFooter>
            <PrimaryButton onClick={() => setShowErrorModal(false)}>
              Close
            </PrimaryButton>
          </FormFooter>
        </div>
      </FormModal>

      {/* Pause / Resume Model HB Confirmation Dialog */}
      <FormModal
        isOpen={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        title={pausingModel?.status === "Paused" ? "Resume Model" : "Pause Model"}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {pausingModel?.status === "Paused"
              ? `Resume serving requests for "${pausingModel?.name}"?`
              : `Temporarily stop serving requests for this model ("${pausingModel?.name}").`}
          </p>
          <FormFooter>
            <SecondaryButton onClick={() => setShowPauseModal(false)} disabled={isPausing}>
              Cancel
            </SecondaryButton>
            <button
              onClick={() => pausingModel && handleTogglePauseModel(pausingModel)}
              disabled={isPausing}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              {isPausing && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{pausingModel?.status === "Paused" ? "Resume Model" : "Pause Model"}</span>
            </button>
          </FormFooter>
        </div>
      </FormModal>

      {/* Delete Model HB Danger Confirmation */}
      <FormModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Model"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs">
              Deleting this model removes it from the Organization gateway configuration. Applications routing requests to this model alias will be impacted.
            </p>
          </div>

          {deletingModel && (
            <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3.5 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Model Name:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{deletingModel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Provider:</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{deletingModel.provider}</span>
              </div>
            </div>
          )}

          <FormFooter>
            <SecondaryButton onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
              Cancel
            </SecondaryButton>
            <button
              onClick={handleDeleteModel}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isDeleting ? "Deleting..." : "Delete Model"}</span>
            </button>
          </FormFooter>
        </div>
      </FormModal>
    </div>
  );
}
