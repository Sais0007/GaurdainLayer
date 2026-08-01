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
  EyeOff,
  Eye
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
import { getSharedCredentials, setSharedCredentials, type CredentialItem } from "./CredentialsManagement";

// --- Model Interface ---
export interface ModelItem {
  id: string;
  modelId: string; // Unique alphanumeric Model ID (e.g. mdl-9F3K28A)
  provider: "OpenAI" | "Anthropic" | "Azure AI" | "DeepSeek" | "Ollama";
  name: string; // Provider technical model name (e.g. GPT-4o-2026-08)
  alias: string; // User-friendly business name (e.g. GPT-4o Mini)
  createdBy: string;
  createdOn: string;
  inputCost: number;
  outputCost: number;
  status: "Active" | "Paused" | "Inactive";
  healthStatus: "Healthy" | "Unhealthy";
  errorDetails?: string;
  lastSuccess: string;
  credentialSource: "existing" | "new";
  credentialId?: string;
  apiBaseUrl?: string;
  apiKey?: string;
}

// Initial Mock Models Data
const initialMockModels: ModelItem[] = [
  {
    id: "mod-1",
    modelId: "mdl-9F3K28A",
    provider: "OpenAI",
    name: "GPT-4o-2026-08",
    alias: "GPT-4o Mini",
    createdBy: "Super Admin",
    createdOn: "2026-07-15",
    inputCost: 0.00015,
    outputCost: 0.00060,
    status: "Active",
    healthStatus: "Healthy",
    lastSuccess: "Jul 30, 2026 11:42 AM",
    credentialSource: "existing",
    credentialId: "cred-101",
  },
  {
    id: "mod-2",
    modelId: "mdl-1AB73XZ",
    provider: "Anthropic",
    name: "Claude-3.5-Sonnet",
    alias: "Support Assistant",
    createdBy: "Sarah Connor",
    createdOn: "2026-07-16",
    inputCost: 0.00300,
    outputCost: 0.01500,
    status: "Active",
    healthStatus: "Healthy",
    lastSuccess: "Jul 30, 2026 10:15 AM",
    credentialSource: "existing",
    credentialId: "cred-102",
  },
  {
    id: "mod-3",
    modelId: "mdl-4AZ829K",
    provider: "Azure AI",
    name: "Azure-GPT-4o-EastUS",
    alias: "Sales GPT",
    createdBy: "John Doe",
    createdOn: "2026-07-18",
    inputCost: 0.00250,
    outputCost: 0.01000,
    status: "Active",
    healthStatus: "Healthy",
    lastSuccess: "Jul 30, 2026 09:30 AM",
    credentialSource: "existing",
    credentialId: "cred-103",
  },
  {
    id: "mod-4",
    modelId: "mdl-7DS993P",
    provider: "DeepSeek",
    name: "DeepSeek-R1-Reasoner",
    alias: "Finance AI",
    createdBy: "Alex Dev",
    createdOn: "2026-07-20",
    inputCost: 0.00055,
    outputCost: 0.00219,
    status: "Active",
    healthStatus: "Unhealthy",
    errorDetails: "Authentication Error 401: Invalid API Key string",
    lastSuccess: "Jul 28, 2026 06:30 PM",
    credentialSource: "existing",
    credentialId: "cred-104",
  },
  {
    id: "mod-5",
    modelId: "mdl-3OL551X",
    provider: "Ollama",
    name: "Llama-3.3-70B-Instruct",
    alias: "Local GPU Cluster",
    createdBy: "Michael Scott",
    createdOn: "2026-07-22",
    inputCost: 0.00000,
    outputCost: 0.00000,
    status: "Paused",
    healthStatus: "Unhealthy",
    errorDetails: "Connection Timeout: Endpoint http://localhost:11434 unresponsive",
    lastSuccess: "Never",
    credentialSource: "new",
    apiBaseUrl: "http://localhost:11434",
    apiKey: "ollama-key-local",
  },
];

// Provider Preset Models Dictionary
const providerPresetModels: Record<string, { id: string; name: string; inCost: number; outCost: number }[]> = {
  OpenAI: [
    { id: "GPT-4o-2026-08", name: "GPT-4o-2026-08", inCost: 0.00250, outCost: 0.01000 },
    { id: "GPT-4o-Mini", name: "GPT-4o-Mini", inCost: 0.00015, outCost: 0.00060 },
    { id: "o1-Preview", name: "o1-Preview", inCost: 0.01500, outCost: 0.06000 },
    { id: "o3-Mini", name: "o3-Mini", inCost: 0.00110, outCost: 0.00440 },
  ],
  "Azure AI": [
    { id: "Azure-GPT-4o-EastUS", name: "Azure-GPT-4o-EastUS", inCost: 0.00250, outCost: 0.01000 },
    { id: "Azure-GPT-3.5-Turbo", name: "Azure-GPT-3.5-Turbo", inCost: 0.00050, outCost: 0.00150 },
  ],
  Anthropic: [
    { id: "Claude-3.5-Sonnet", name: "Claude-3.5-Sonnet", inCost: 0.00300, outCost: 0.01500 },
    { id: "Claude-3.5-Haiku", name: "Claude-3.5-Haiku", inCost: 0.00100, outCost: 0.00500 },
    { id: "Claude-3-Opus", name: "Claude-3-Opus", inCost: 0.01500, outCost: 0.07500 },
  ],
  DeepSeek: [
    { id: "DeepSeek-R1-Reasoner", name: "DeepSeek-R1-Reasoner", inCost: 0.00055, outCost: 0.00219 },
    { id: "DeepSeek-V3-Model", name: "DeepSeek-V3-Model", inCost: 0.00014, outCost: 0.00028 },
  ],
  Ollama: [
    { id: "Llama-3.3-70B-Instruct", name: "Llama-3.3-70B-Instruct", inCost: 0.00000, outCost: 0.00000 },
    { id: "Qwen-2.5-Coder-32B", name: "Qwen-2.5-Coder-32B", inCost: 0.00000, outCost: 0.00000 },
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
  // Data State
  const [models, setModels] = useState<ModelItem[]>(initialMockModels);
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

  // Test Connection Feedback State
  const [testStatus, setTestStatus] = useState<"none" | "success" | "error">("none");
  const [testConnectionMessage, setTestConnectionMessage] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Configure New Credential Modal State
  const [showConfigureCredModal, setShowConfigureCredModal] = useState(false);
  const [newCredName, setNewCredName] = useState("");
  const [newCredUrl, setNewCredUrl] = useState("");
  const [newCredKey, setNewCredKey] = useState("");
  const [isSavingNewCred, setIsSavingNewCred] = useState(false);

  // Add/Edit Model Form State
  const [formProvider, setFormProvider] = useState<ModelItem["provider"]>("OpenAI");
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(["GPT-4o-2026-08"]);
  const [formModelAlias, setFormModelAlias] = useState("");
  const [formCredentialSource, setFormCredentialSource] = useState<"existing" | "new">("existing");
  const [formCredentialId, setFormCredentialId] = useState("");
  const [formApiBaseUrl, setFormApiBaseUrl] = useState("https://api.openai.com/v1");
  const [formApiKey, setFormApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSavingModel, setIsSavingModel] = useState(false);

  // Dynamic credentials from Credentials Management store
  const sharedCreds = getSharedCredentials();
  const activeCredentials = useMemo(() => {
    return sharedCreds.filter((c) => c.status === "Active" && (c.provider === formProvider || !formProvider));
  }, [sharedCreds, formProvider]);

  // Preselect active credential when provider changes
  useEffect(() => {
    if (activeCredentials.length > 0) {
      setFormCredentialId(activeCredentials[0].id);
    } else {
      setFormCredentialId("");
    }
  }, [activeCredentials, formProvider]);

  // Columns config - Exact 10 sequence required
  const allColumns: ColumnConfig[] = [
    { key: "modelId", label: "Model ID" },
    { key: "name", label: "Model Name" },
    { key: "alias", label: "Alias" },
    { key: "provider", label: "Provider" },
    { key: "status", label: "Status" },
    { key: "healthStatus", label: "Health Status" },
    { key: "inputCost", label: "Input Cost" },
    { key: "outputCost", label: "Output Cost" },
    { key: "lastSuccess", label: "Last Success" },
    { key: "createdOn", label: "Created Date" },
  ];

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    modelId: true,
    name: true,
    alias: true,
    provider: true,
    status: true,
    healthStatus: true,
    inputCost: true,
    outputCost: true,
    lastSuccess: true,
    createdOn: true,
  });

  const toggleColumn = (key: string) => {
    if (key === "modelId" || key === "status") return;
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyText = (text: string, label: string = "Copied to clipboard!") => {
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
    const healthy = models.filter((m) => m.healthStatus === "Healthy").length;
    const providers = new Set(models.map((m) => m.provider)).size;

    return [
      { id: "total", label: "Total Models", value: total.toString(), subValue: `${active} Active in Gateway` },
      { id: "active", label: "Active Models", value: active.toString(), subValue: `${((active / (total || 1)) * 100).toFixed(0)}% Operational` },
      { id: "healthy", label: "Healthy Models", value: healthy.toString(), subValue: `${healthy}/${total} Validated` },
      { id: "providers", label: "Providers Integrated", value: providers.toString(), subValue: "Multi-Cloud Endpoints" },
    ];
  }, [models]);

  // Filtering
  const filteredModels = useMemo(() => {
    return models.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.modelId.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.alias.toLowerCase().includes(query) ||
        item.provider.toLowerCase().includes(query);

      const matchesProvider = appliedProvider === "All" || item.provider === appliedProvider;
      const matchesStatus = appliedStatus === "All" || item.status === appliedStatus;

      return matchesSearch && matchesProvider && matchesStatus;
    });
  }, [models, searchQuery, appliedProvider, appliedStatus]);

  // Sorting
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

  const sortedModels = useMemo(() => {
    return [...filteredModels].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal || "").toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredModels, sortField, sortDirection]);

  // Pagination calculations
  const totalItems = sortedModels.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedModels = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedModels.slice(start, start + pageSize);
  }, [sortedModels, currentPage, pageSize]);

  // Open Add Model Modal
  const handleOpenAddModel = () => {
    setIsEditMode(false);
    setEditingModel(null);
    setFormProvider("OpenAI");
    setSelectedModelIds(["GPT-4o-2026-08"]);
    setFormModelAlias("GPT-4o Mini");
    setFormCredentialSource("existing");
    setTestStatus("none");
    setTestConnectionMessage("");
    setShowAddModelModal(true);
  };

  // Open Edit Model Modal
  const handleOpenEditModel = (model: ModelItem) => {
    setIsEditMode(true);
    setEditingModel(model);
    setFormProvider(model.provider);
    setSelectedModelIds([model.name]);
    setFormModelAlias(model.alias);
    setFormCredentialSource(model.credentialSource || "existing");
    setFormCredentialId(model.credentialId || "");
    setFormApiBaseUrl(model.apiBaseUrl || "https://api.openai.com/v1");
    setFormApiKey(model.apiKey || "");
    setTestStatus("none");
    setTestConnectionMessage("");
    setShowAddModelModal(true);
  };

  // Handle Provider Selection change in Add/Edit form
  const handleFormProviderChange = (prov: ModelItem["provider"]) => {
    setFormProvider(prov);
    const presets = providerPresetModels[prov] || [];
    if (presets.length > 0) {
      setSelectedModelIds([presets[0].id]);
      setFormModelAlias(presets[0].name);
    }
  };

  // Toggle Multiple Model Selection
  const handleToggleModelSelection = (mId: string) => {
    if (selectedModelIds.includes(mId)) {
      if (selectedModelIds.length > 1) {
        setSelectedModelIds(selectedModelIds.filter((id) => id !== mId));
      }
    } else {
      setSelectedModelIds([...selectedModelIds, mId]);
    }
  };

  // Save New Credential directly from Modal
  const handleSaveNewCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCredName.trim() || !newCredKey.trim()) {
      toast.error("Please fill in Credential Name and API Key.");
      return;
    }
    setIsSavingNewCred(true);
    setTimeout(() => {
      const todayDate = new Date().toISOString().split("T")[0];
      const newCredItem: CredentialItem = {
        id: `cred-${Date.now().toString().slice(-4)}`,
        name: newCredName.trim(),
        provider: formProvider,
        apiBaseUrl: newCredUrl.trim() || "https://api.openai.com/v1",
        apiKey: newCredKey.trim(),
        createdOn: todayDate,
        createdBy: "John Doe",
        updatedOn: todayDate,
        updatedBy: "John Doe",
        status: "Active",
        linkedModelsCount: 1,
      };

      const updated = [newCredItem, ...sharedCreds];
      setSharedCredentials(updated);

      setFormCredentialId(newCredItem.id);
      setFormCredentialSource("existing");
      setIsSavingNewCred(false);
      setShowConfigureCredModal(false);
      toast.success(`Credential "${newCredName}" created & auto-selected!`);
    }, 500);
  };

  // Test Connection Action
  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setTestStatus("none");
    setTimeout(() => {
      setIsTestingConnection(false);
      if (formCredentialSource === "existing" && !formCredentialId) {
        setTestStatus("error");
        setTestConnectionMessage("No active credential selected. Please select a valid credential.");
        toast.error("Test connection failed: No active credential.");
        return;
      }
      setTestStatus("success");
      setTestConnectionMessage(`Connection Successful — Authenticated with ${formProvider} endpoint and verified access for ${selectedModelIds.length} model(s).`);
      toast.success("Test Connection Successful!");
    }, 800);
  };

  // Save Model Handler
  const handleSaveModel = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingModel(true);
    setTimeout(() => {
      const todayDate = new Date().toISOString().split("T")[0];
      const nowStr = `${formatDateDisplay(todayDate)} 11:45 AM`;

      if (isEditMode && editingModel) {
        setModels((prev) =>
          prev.map((item) =>
            item.id === editingModel.id
              ? {
                  ...item,
                  provider: formProvider,
                  name: selectedModelIds[0] || item.name,
                  alias: formModelAlias.trim() || item.alias,
                  credentialSource: formCredentialSource,
                  credentialId: formCredentialId,
                  apiBaseUrl: formApiBaseUrl,
                  apiKey: formApiKey,
                }
              : item
          )
        );
        toast.success("Model updated successfully.");
      } else {
        // Create models for selectedModelIds
        const presets = providerPresetModels[formProvider] || [];
        const newItems: ModelItem[] = selectedModelIds.map((mId, idx) => {
          const match = presets.find((p) => p.id === mId);
          const randHex = Math.random().toString(36).substring(2, 8).toUpperCase();
          return {
            id: `mod-${Date.now()}-${idx}`,
            modelId: `mdl-${randHex}`,
            provider: formProvider,
            name: mId,
            alias: selectedModelIds.length === 1 && formModelAlias.trim() ? formModelAlias.trim() : mId,
            createdBy: "John Doe",
            createdOn: todayDate,
            inputCost: match ? match.inCost : 0.0015,
            outputCost: match ? match.outCost : 0.0060,
            status: "Active",
            healthStatus: "Healthy",
            lastSuccess: nowStr,
            credentialSource: formCredentialSource,
            credentialId: formCredentialId,
            apiBaseUrl: formApiBaseUrl,
            apiKey: formApiKey,
          };
        });

        setModels((prev) => [...newItems, ...prev]);
        toast.success(`Successfully created ${newItems.length} model configuration(s)!`);
      }

      setIsSavingModel(false);
      setShowAddModelModal(false);
    }, 600);
  };

  // Resume Model Action
  const handleResumeModel = (model: ModelItem) => {
    setModels((prev) =>
      prev.map((item) =>
        item.id === model.id ? { ...item, status: "Active", healthStatus: "Healthy" } : item
      )
    );
    toast.success(`Model "${model.alias}" resumed successfully.`);
  };

  // Delete Model Handler
  const handleDeleteModel = () => {
    if (!deletingModel) return;
    setIsDeleting(true);
    setTimeout(() => {
      setModels((prev) => prev.filter((item) => item.id !== deletingModel.id));
      setIsDeleting(false);
      setShowDeleteModal(false);
      toast.success(`Model "${deletingModel.alias}" deleted.`);
    }, 500);
  };

  // Pause Model Handler
  const handlePauseModel = () => {
    if (!pausingModel) return;
    setIsPausing(true);
    setTimeout(() => {
      setModels((prev) =>
        prev.map((item) =>
          item.id === pausingModel.id ? { ...item, status: "Paused" } : item
        )
      );
      setIsPausing(false);
      setShowPauseModal(false);
      toast.info(`Model "${pausingModel.alias}" paused.`);
    }, 500);
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
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6 animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="Model Management"
        pageId="model-management"
        action="list"
      >
        <SearchBar
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
          placeholder="Search by Model ID, Name, Alias, or Provider..."
        />

        <IconButton
          icon={Filter}
          label="Filter"
          onClick={() => setShowFilterDrawer(true)}
          title="Filter Models"
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

        <PrimaryButton icon={Plus} onClick={handleOpenAddModel}>
          Add Model
        </PrimaryButton>
      </PageHeader>

      {/* HB Summary KPI Cards */}
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

      {/* HB Enterprise Table — Exact 10 Columns Sequence */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[320px]">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium sticky top-0 z-10">
              <tr>
                {/* 1. Model ID */}
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

                {/* 2. Model Name */}
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

                {/* 3. Alias */}
                {visibleColumns.alias && (
                  <th
                    className="p-4 font-medium cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
                    onClick={() => handleSort("alias")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Alias</span>
                      {renderSortIndicator("alias")}
                    </div>
                  </th>
                )}

                {/* 4. Provider */}
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

                {/* 5. Status */}
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

                {/* 6. Health Status */}
                {visibleColumns.healthStatus && (
                  <th className="p-4 font-medium">Health Status</th>
                )}

                {/* 7. Input Cost */}
                {visibleColumns.inputCost && (
                  <th className="p-4 font-medium">Input Cost</th>
                )}

                {/* 8. Output Cost */}
                {visibleColumns.outputCost && (
                  <th className="p-4 font-medium">Output Cost</th>
                )}

                {/* 9. Last Success */}
                {visibleColumns.lastSuccess && (
                  <th className="p-4 font-medium">Last Success</th>
                )}

                {/* 10. Created Date */}
                {visibleColumns.createdOn && (
                  <th
                    className="p-4 font-medium cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
                    onClick={() => handleSort("createdOn")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Created Date</span>
                      {renderSortIndicator("createdOn")}
                    </div>
                  </th>
                )}

                {/* 11. Actions */}
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skel-${idx}`} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-32"></div></td>
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full w-16"></div></td>
                    <td className="p-4"><div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-28"></div></td>
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-24"></div></td>
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
                    {/* 1. Model ID */}
                    {visibleColumns.modelId && (
                      <td className="p-4 font-mono text-xs font-semibold text-neutral-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{item.modelId}</span>
                          <IconButton
                            icon={Copy}
                            onClick={() => handleCopyText(item.modelId, "Model ID copied!")}
                            title="Copy Model ID"
                            borderless
                          />
                        </div>
                      </td>
                    )}

                    {/* 2. Model Name */}
                    {visibleColumns.name && (
                      <td className="p-4 font-medium text-neutral-900 dark:text-white hover:text-primary-600 transition-colors">
                        {item.name}
                      </td>
                    )}

                    {/* 3. Alias */}
                    {visibleColumns.alias && (
                      <td className="p-4 font-mono text-xs text-neutral-700 dark:text-neutral-300">
                        {item.alias}
                      </td>
                    )}

                    {/* 4. Provider */}
                    {visibleColumns.provider && (
                      <td className="p-4 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        {item.provider}
                      </td>
                    )}

                    {/* 5. Status */}
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

                    {/* 6. Health Status */}
                    {visibleColumns.healthStatus && (
                      <td className="p-4">
                        {item.healthStatus === "Unhealthy" ? (
                          <div className="relative group inline-block">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 cursor-help">
                              <XCircle className="w-3 h-3 text-rose-500" />
                              Unhealthy
                            </span>
                            {item.errorDetails && (
                              <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-30 w-56 p-2 bg-neutral-900 text-white text-[11px] rounded-lg shadow-xl font-mono border border-neutral-700 leading-tight">
                                <span className="text-rose-400 font-bold block mb-0.5">Latest Error:</span>
                                {item.errorDetails}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Healthy
                          </span>
                        )}
                      </td>
                    )}

                    {/* 7. Input Cost */}
                    {visibleColumns.inputCost && (
                      <td className="p-4 font-mono text-xs text-neutral-700 dark:text-neutral-300">
                        ${item.inputCost.toFixed(5)} / 1K
                      </td>
                    )}

                    {/* 8. Output Cost */}
                    {visibleColumns.outputCost && (
                      <td className="p-4 font-mono text-xs text-neutral-700 dark:text-neutral-300">
                        ${item.outputCost.toFixed(5)} / 1K
                      </td>
                    )}

                    {/* 9. Last Success */}
                    {visibleColumns.lastSuccess && (
                      <td className="p-4 font-mono text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                        {item.lastSuccess || "Never"}
                      </td>
                    )}

                    {/* 10. Created Date */}
                    {visibleColumns.createdOn && (
                      <td className="p-4 text-neutral-600 dark:text-neutral-400 text-xs whitespace-nowrap">
                        {formatDateDisplay(item.createdOn)}
                      </td>
                    )}

                    {/* 11. Contextual Actions Menu (Dynamic for Active vs Paused) */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end">
                        <IconButton
                          icon={MoreVertical}
                          title="Actions"
                          borderless
                          menuItems={[
                            {
                              icon: Eye,
                              label: "View",
                              onClick: () => handleOpenEditModel(item),
                            },
                            {
                              icon: Edit3,
                              label: "Edit",
                              onClick: () => handleOpenEditModel(item),
                            },
                            ...(item.status === "Active"
                              ? [
                                  {
                                    icon: Pause,
                                    label: "Pause",
                                    onClick: () => {
                                      setPausingModel(item);
                                      setShowPauseModal(true);
                                    },
                                  },
                                ]
                              : [
                                  {
                                    icon: Play,
                                    label: "Resume",
                                    onClick: () => handleResumeModel(item),
                                  },
                                ]),
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="p-12 text-center">
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

        {/* HB Pagination Footer */}
        {sortedModels.length > 0 && !isLoading && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* Right-Side Slide-Over Filter Drawer Panel */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity animate-fadeIn"
            onClick={() => setShowFilterDrawer(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
              <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Filter Models</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Filter model configurations by provider or status.</p>
                </div>
                <button 
                  onClick={() => setShowFilterDrawer(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                <FormSection title="Provider">
                  <FormSelect
                    value={filterProvider}
                    onChange={(e) => setFilterProvider(e.target.value)}
                  >
                    <option value="All">All Providers</option>
                    <option value="OpenAI">OpenAI</option>
                    <option value="Anthropic">Anthropic</option>
                    <option value="Azure AI">Azure AI</option>
                    <option value="DeepSeek">DeepSeek</option>
                    <option value="Ollama">Ollama</option>
                  </FormSelect>
                </FormSection>

                <FormSection title="Status">
                  <FormSelect
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                  </FormSelect>
                </FormSection>
              </div>

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

      {/* Add / Edit Model Modal — Following exact Provider -> Models -> Multiple Selection -> Credential Selection -> Test Connection -> Create */}
      <FormModal
        isOpen={showAddModelModal}
        onClose={() => setShowAddModelModal(false)}
        title={isEditMode ? "Edit Model Configuration" : "Add Model"}
        description="Configure provider models, multi-model assignments, credentials, and test connection."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveModel} className="space-y-5">
          {/* Step 1 & 2 & 3: Provider + Multiple Model Selection */}
          <FormSection title="Provider & Models Selection">
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

            {/* Checkable Multiple Models Selection */}
            <FormField className="pt-2">
              <FormLabel required>Select Available Models</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {(providerPresetModels[formProvider] || []).map((m) => {
                  const isChecked = selectedModelIds.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      onClick={() => handleToggleModelSelection(m.id)}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? "bg-primary-50 dark:bg-primary-950/60 border-primary-400 text-primary-900 dark:text-primary-100 font-semibold"
                          : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="block font-semibold">{m.name}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          In: ${m.inCost.toFixed(5)} • Out: ${m.outCost.toFixed(5)}
                        </span>
                      </div>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        isChecked ? "bg-primary-600 border-primary-600 text-white" : "border-neutral-300"
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </FormField>
          </FormSection>

          {/* Model Alias */}
          <FormSection title="Model Alias">
            <FormField>
              <FormLabel htmlFor="model-alias-input">Business Alias / Display Name</FormLabel>
              <FormInput
                id="model-alias-input"
                type="text"
                placeholder="e.g. GPT-4o Mini, Sales GPT, Support Assistant"
                value={formModelAlias}
                onChange={(e) => setFormModelAlias(e.target.value)}
              />
              <p className="text-[11px] text-neutral-400 mt-1">User-friendly business name shown across the portal.</p>
            </FormField>
          </FormSection>

          {/* Step 4 & 7: Credential Selection */}
          <FormSection title="Credential Selection">
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
                  <span>Existing Credential</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  <input
                    type="radio"
                    name="credentialSource"
                    value="new"
                    checked={formCredentialSource === "new"}
                    onChange={() => {
                      setFormCredentialSource("new");
                      setNewCredName(`${formProvider} Key`);
                      setNewCredUrl(formProvider === "OpenAI" ? "https://api.openai.com/v1" : "https://api.provider.com/v1");
                      setNewCredKey("");
                      setShowConfigureCredModal(true);
                    }}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span>Configure New Credential</span>
                </label>
              </div>

              {formCredentialSource === "existing" && (
                <FormField>
                  <FormLabel required>Active Credentials ({formProvider})</FormLabel>

                  <FormSelect
                    value={formCredentialId}
                    onChange={(e) => setFormCredentialId(e.target.value)}
                    required
                  >
                    {activeCredentials.length > 0 ? (
                      activeCredentials.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.provider} — {c.status})
                        </option>
                      ))
                    ) : (
                      <option value="">No active credentials found for {formProvider}</option>
                    )}
                  </FormSelect>
                  {activeCredentials.length === 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> No active credentials for {formProvider}. Select "Configure New Credential" radio option above to add one.
                    </p>
                  )}
                </FormField>
              )}
            </div>
          </FormSection>

          {/* Test Connection Result Alert Banners */}
          {testStatus === "success" && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-900 dark:text-emerald-200">Connection Successful</span>
                <p>{testConnectionMessage}</p>
              </div>
            </div>
          )}

          {testStatus === "error" && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2 animate-fadeIn">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-rose-900 dark:text-rose-200">Invalid API Key</span>
                <p>{testConnectionMessage}</p>
              </div>
            </div>
          )}

          <FormFooter>
            <SecondaryButton type="button" onClick={() => setShowAddModelModal(false)} disabled={isSavingModel}>
              Cancel
            </SecondaryButton>

            {/* Step 8: Test Connection Button */}
            <SecondaryButton 
              type="button" 
              onClick={handleTestConnection} 
              disabled={isTestingConnection || isSavingModel}
              className="border-sky-300 text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:border-sky-800"
            >
              {isTestingConnection ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                  Test Connection
                </>
              )}
            </SecondaryButton>

            <button
              type="submit"
              disabled={isSavingModel || selectedModelIds.length === 0}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSavingModel && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSavingModel ? "Saving..." : isEditMode ? "Save Changes" : "Save Model"}</span>
            </button>
          </FormFooter>
        </form>
      </FormModal>

      {/* Configure New Credential Modal (Reuses existing Add Credential popup from Credential Management) */}
      <FormModal
        isOpen={showConfigureCredModal}
        onClose={() => {
          setShowConfigureCredModal(false);
          setFormCredentialSource("existing");
        }}
        title="Add Credential"
        description={`Configure authentication credentials for ${formProvider}.`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveNewCredential} className="space-y-4">
          <FormSection title="Basic Information">
            <FormGrid cols={2}>
              <FormField>
                <FormLabel required>Credential Name</FormLabel>
                <FormInput
                  type="text"
                  placeholder="e.g. Production OpenAI Key"
                  value={newCredName}
                  onChange={(e) => setNewCredName(e.target.value)}
                  required
                />
              </FormField>
              <FormField>
                <FormLabel required>Provider</FormLabel>
                <FormInput
                  type="text"
                  disabled
                  value={formProvider}
                  className="bg-neutral-100 dark:bg-neutral-800 font-semibold"
                />
              </FormField>
            </FormGrid>
          </FormSection>

          <FormSection title="Connection Details">
            <FormField>
              <FormLabel required>API Base URL</FormLabel>
              <FormInput
                type="url"
                placeholder="https://api.openai.com/v1"
                value={newCredUrl}
                onChange={(e) => setNewCredUrl(e.target.value)}
                required
              />
            </FormField>

            <FormField>
              <FormLabel required>API Key</FormLabel>
              <div className="relative">
                <FormInput
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter API key string..."
                  value={newCredKey}
                  onChange={(e) => setNewCredKey(e.target.value)}
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
          </FormSection>

          <FormFooter>
            <SecondaryButton 
              type="button" 
              onClick={() => {
                setShowConfigureCredModal(false);
                setFormCredentialSource("existing");
              }}
            >
              Cancel
            </SecondaryButton>
            <button
              type="submit"
              disabled={isSavingNewCred || !newCredName.trim() || !newCredKey.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSavingNewCred && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSavingNewCred ? "Saving Credential..." : "Save Credential & Auto-Select"}</span>
            </button>
          </FormFooter>
        </form>
      </FormModal>

      {/* Delete Confirmation Dialog */}
      <FormModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Model Configuration"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold block mb-1">Warning: Gateway Routing Impact</span>
              Deleting this model configuration will remove its endpoint mapping from the Gateway. Virtual Keys routing requests to this model alias will fail until updated.
            </div>
          </div>

          {deletingModel && (
            <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Model ID:</span>
                <span className="font-mono font-semibold text-neutral-900 dark:text-white">{deletingModel.modelId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Model Name:</span>
                <span className="font-medium text-neutral-900 dark:text-white">{deletingModel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Alias:</span>
                <span className="font-mono font-semibold text-neutral-900 dark:text-white">{deletingModel.alias}</span>
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

      {/* Pause Confirmation Dialog */}
      <FormModal
        isOpen={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        title="Pause Model Access"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60">
            <Pause className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold block mb-1">Pause Traffic Routing</span>
              Pausing this model temporarily suspends all incoming prompt completions for this configuration.
            </div>
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowPauseModal(false)} disabled={isPausing}>
              Cancel
            </SecondaryButton>
            <button
              onClick={handlePauseModel}
              disabled={isPausing}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isPausing && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isPausing ? "Pausing..." : "Pause Model"}</span>
            </button>
          </FormFooter>
        </div>
      </FormModal>
    </div>
  );
}
