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
  Globe, 
  AlertTriangle, 
  X, 
  Columns3, 
  ArrowUpDown, 
  ArrowUp,
  ArrowDown,
  Eye, 
  EyeOff, 
  FileText,
  Calendar,
  KeyRound,
  Loader2,
  Layers,
  CheckCircle2,
  ShieldCheck,
  BarChart3
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

// --- Credential Data Interface ---
export interface CredentialItem {
  id: string;
  name: string;
  provider: "OpenAI" | "Anthropic" | "Azure AI" | "DeepSeek" | "Ollama";
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  status: "Active" | "Inactive";
  apiBaseUrl: string;
  apiKey: string;
  linkedModelsCount?: number;
}

// Global initial credentials storage for cross-module sharing
export const initialMockCredentials: CredentialItem[] = [
  {
    id: "cred-101",
    name: "OpenAI Production Key",
    provider: "OpenAI",
    createdOn: "2026-07-10",
    createdBy: "superadmin@spinecloudiq.com",
    updatedOn: "2026-07-20",
    updatedBy: "superadmin@spinecloudiq.com",
    status: "Active",
    apiBaseUrl: "https://api.openai.com/v1",
    apiKey: "sk-proj-99281734910287a1",
    linkedModelsCount: 2,
  },
  {
    id: "cred-102",
    name: "Claude Enterprise Key",
    provider: "Anthropic",
    createdOn: "2026-07-12",
    createdBy: "sarah.connor@hb.com",
    updatedOn: "2026-07-22",
    updatedBy: "sarah.connor@hb.com",
    status: "Active",
    apiBaseUrl: "https://api.anthropic.com/v1",
    apiKey: "sk-ant-api03-77192038144bc",
    linkedModelsCount: 1,
  },
  {
    id: "cred-103",
    name: "Azure AI Endpoint Key",
    provider: "Azure AI",
    createdOn: "2026-07-15",
    createdBy: "hbadmin@yopmail.com",
    updatedOn: "2026-07-15",
    updatedBy: "hbadmin@yopmail.com",
    status: "Active",
    apiBaseUrl: "https://hb-azure-ai.openai.azure.com",
    apiKey: "az-key-88129301990f",
    linkedModelsCount: 1,
  },
  {
    id: "cred-104",
    name: "DeepSeek R1 Key",
    provider: "DeepSeek",
    createdOn: "2026-07-18",
    createdBy: "alex.dev@hb.com",
    updatedOn: "2026-07-18",
    updatedBy: "alex.dev@hb.com",
    status: "Active",
    apiBaseUrl: "https://api.deepseek.com/v1",
    apiKey: "sk-ds-33129481001e",
    linkedModelsCount: 1,
  },
  {
    id: "cred-105",
    name: "Local Ollama Cluster",
    provider: "Ollama",
    createdOn: "2026-07-20",
    createdBy: "michael.scott@hb.com",
    updatedOn: "2026-07-20",
    updatedBy: "michael.scott@hb.com",
    status: "Inactive",
    apiBaseUrl: "http://localhost:11434",
    apiKey: "ollama-local-key",
    linkedModelsCount: 0,
  },
];

let sharedCredentialsStore: CredentialItem[] = [...initialMockCredentials];
export const getSharedCredentials = () => sharedCredentialsStore;
export const setSharedCredentials = (creds: CredentialItem[]) => {
  sharedCredentialsStore = creds;
};

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return "—";
  if (dateStr.includes(",")) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function CredentialsManagement() {
  const [credentials, setCredentials] = useState<CredentialItem[]>(() => getSharedCredentials());
  const [isLoading, setIsLoading] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Right-Side Filter Drawer State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  // Summary Cards State
  const [showSummary, setShowSummary] = useState(true);

  // Sorting State
  const [sortField, setSortField] = useState<keyof CredentialItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Column Visibility State
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const columnAnchorRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<CredentialItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<CredentialItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State for Add/Edit Credential Modal
  const [formName, setFormName] = useState("");
  const [formProvider, setFormProvider] = useState<CredentialItem["provider"]>("OpenAI");
  const [formApiBaseUrl, setFormApiBaseUrl] = useState("https://api.openai.com/v1");
  const [formApiKey, setFormApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formTouched, setFormTouched] = useState({ name: false, url: false, key: false });

  // Sync with global store
  useEffect(() => {
    setSharedCredentials(credentials);
  }, [credentials]);

  // Provider Default URLs
  const providerDefaultUrls: Record<CredentialItem["provider"], string> = {
    OpenAI: "https://api.openai.com/v1",
    Anthropic: "https://api.anthropic.com/v1",
    "Azure AI": "https://your-resource.openai.azure.com",
    DeepSeek: "https://api.deepseek.com/v1",
    Ollama: "http://localhost:11434",
  };

  const handleProviderChange = (provider: CredentialItem["provider"]) => {
    setFormProvider(provider);
    if (!isEditMode) {
      setFormApiBaseUrl(providerDefaultUrls[provider] || "");
    }
  };

  // Columns definition
  const allColumns: ColumnConfig[] = [
    { key: "name", label: "Credential Name" },
    { key: "provider", label: "Provider Name" },
    { key: "createdOn", label: "Created On" },
    { key: "createdBy", label: "Created By" },
    { key: "updatedOn", label: "Updated On" },
    { key: "updatedBy", label: "Updated By" },
    { key: "status", label: "Status" },
  ];

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    provider: true,
    createdOn: true,
    createdBy: true,
    updatedOn: true,
    updatedBy: true,
    status: true,
  });

  const toggleColumn = (key: string) => {
    if (key === "name" || key === "status") return;
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Immediate Export Handler
  const handleImmediateExport = () => {
    toast.success("Exporting Credentials to CSV...");
  };

  // Refresh Handler
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Credentials list refreshed");
    }, 500);
  };

  // KPI Summary Calculations
  const kpiStats = useMemo(() => {
    const total = credentials.length;
    const active = credentials.filter((c) => c.status === "Active").length;
    const inactive = credentials.filter((c) => c.status === "Inactive").length;
    const providers = new Set(credentials.map((c) => c.provider)).size;

    return [
      { id: "total", label: "Total Credentials", value: total.toString(), subValue: `${active} Active in Gateway` },
      { id: "active", label: "Active Credentials", value: active.toString(), subValue: `${((active / (total || 1)) * 100).toFixed(0)}% Operational` },
      { id: "inactive", label: "Inactive Credentials", value: inactive.toString(), subValue: "Access Suspended" },
      { id: "providers", label: "Providers Configured", value: providers.toString(), subValue: "Multi-Cloud Gateways" },
    ];
  }, [credentials]);

  // Filtering
  const filteredCredentials = useMemo(() => {
    return credentials.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.provider.toLowerCase().includes(query);

      let matchesDateRange = true;
      if (appliedStartDate || appliedEndDate) {
        const itemDate = new Date(item.createdOn);
        if (appliedStartDate) {
          const start = new Date(appliedStartDate);
          start.setHours(0, 0, 0, 0);
          if (itemDate < start) matchesDateRange = false;
        }
        if (appliedEndDate) {
          const end = new Date(appliedEndDate);
          end.setHours(23, 59, 59, 999);
          if (itemDate > end) matchesDateRange = false;
        }
      }

      return matchesSearch && matchesDateRange;
    });
  }, [credentials, searchQuery, appliedStartDate, appliedEndDate]);

  // Sorting
  const handleSort = (field: keyof CredentialItem) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIndicator = (field: keyof CredentialItem) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 font-bold" />
    );
  };

  const sortedCredentials = useMemo(() => {
    return [...filteredCredentials].sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredCredentials, sortField, sortDirection]);

  // Pagination Calculations
  const totalItems = sortedCredentials.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedCredentials = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCredentials.slice(start, start + pageSize);
  }, [sortedCredentials, currentPage, pageSize]);

  // Open Add Credential Modal
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingItem(null);
    setFormName("");
    setFormProvider("OpenAI");
    setFormApiBaseUrl(providerDefaultUrls["OpenAI"]);
    setFormApiKey("");
    setShowApiKey(false);
    setFormTouched({ name: false, url: false, key: false });
    setShowModal(true);
  };

  // Open Edit Credential Modal
  const handleOpenEditModal = (item: CredentialItem) => {
    setIsEditMode(true);
    setEditingItem(item);
    setFormName(item.name);
    setFormProvider(item.provider);
    setFormApiBaseUrl(item.apiBaseUrl);
    setFormApiKey(item.apiKey);
    setShowApiKey(false);
    setFormTouched({ name: false, url: false, key: false });
    setShowModal(true);
  };

  // Validation check
  const isFormValid = useMemo(() => {
    return (
      formName.trim().length > 0 &&
      formProvider.length > 0 &&
      formApiBaseUrl.trim().length > 0 &&
      formApiKey.trim().length > 0
    );
  }, [formName, formProvider, formApiBaseUrl, formApiKey]);

  // Save Handler
  const handleSaveCredential = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched({ name: true, url: true, key: true });

    if (!isFormValid) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const todayDate = new Date().toISOString().split("T")[0];
      const currentUser = "hbadmin@yopmail.com";

      if (isEditMode && editingItem) {
        setCredentials((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  name: formName.trim(),
                  provider: formProvider,
                  apiBaseUrl: formApiBaseUrl.trim(),
                  apiKey: formApiKey.trim(),
                  updatedOn: todayDate,
                  updatedBy: currentUser,
                }
              : item
          )
        );
        toast.success("Credential saved successfully.");
      } else {
        const newItem: CredentialItem = {
          id: `cred-${Date.now().toString().slice(-4)}`,
          name: formName.trim(),
          provider: formProvider,
          apiBaseUrl: formApiBaseUrl.trim() || providerDefaultUrls[formProvider],
          apiKey: formApiKey.trim(),
          createdOn: todayDate,
          createdBy: currentUser,
          updatedOn: todayDate,
          updatedBy: currentUser,
          status: "Active",
          linkedModelsCount: 0,
        };
        setCredentials((prev) => [newItem, ...prev]);
        toast.success("Credential saved successfully.");
      }

      setIsSaving(false);
      setShowModal(false);
    }, 500);
  };

  // Delete Handler
  const handleDeleteCredential = () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    setTimeout(() => {
      setCredentials((prev) => prev.filter((item) => item.id !== deletingItem.id));
      toast.success(`Credential "${deletingItem.name}" deleted successfully.`);
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletingItem(null);
    }, 400);
  };

  // Filter Drawer actions
  const handleApplyFilterDrawer = () => {
    setAppliedStartDate(filterStartDate);
    setAppliedEndDate(filterEndDate);
    setShowFilterDrawer(false);
    toast.success("Filter applied");
  };

  const handleResetFilterDrawer = () => {
    setFilterStartDate("");
    setFilterEndDate("");
    setAppliedStartDate("");
    setAppliedEndDate("");
    setShowFilterDrawer(false);
    toast.info("Filter reset");
  };

  const handleCopyFormApiKey = () => {
    if (!formApiKey) return;
    navigator.clipboard.writeText(formApiKey);
    toast.success("API Key copied to clipboard.");
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Page Header — Canonical HB Layout matching Virtual Keys */}
      <PageHeader
        title="Credentials Management"
        pageId="credentials-management"
        action="list"
      >
        {/* 1. Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
          placeholder="Search by Provider Name or Credential Name..."
        />

        {/* 2. Filter Button */}
        <IconButton
          icon={Filter}
          label="Filter"
          onClick={() => setShowFilterDrawer(true)}
          title="Filter Credentials"
        />

        {/* 3. Column Selector */}
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

        {/* 4. Export */}
        <IconButton
          icon={Download}
          label="Export"
          onClick={handleImmediateExport}
          title="Export Credentials to CSV"
        />

        {/* 5. Refresh */}
        <IconButton
          icon={RefreshCw}
          label="Refresh"
          onClick={handleRefresh}
          title="Refresh Credentials List"
        />

        {/* 6. Show/Hide Summary Toggle */}
        <IconButton
          icon={showSummary ? EyeOff : BarChart3}
          label={showSummary ? "Hide Summary" : "Show Summary"}
          onClick={() => setShowSummary(!showSummary)}
          title={showSummary ? "Hide KPI Summary Cards" : "Show KPI Summary Cards"}
        />

        {/* 7. Primary Action Button */}
        <PrimaryButton icon={Plus} onClick={handleOpenAddModal}>
          Add Credential
        </PrimaryButton>
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

      {/* Active Filter Chips */}
      {(appliedStartDate || appliedEndDate) && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-neutral-500">Active Filter:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full border border-neutral-200 dark:border-neutral-700">
            <Calendar className="w-3 h-3 text-neutral-400" />
            Created On: {appliedStartDate || "Start"} to {appliedEndDate || "End"}
            <X
              className="w-3 h-3 cursor-pointer hover:text-red-500 ml-1"
              onClick={handleResetFilterDrawer}
            />
          </span>
          <button
            onClick={handleResetFilterDrawer}
            className="text-primary-600 hover:underline text-xs ml-2"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* HB Enterprise Table */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[320px]">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium sticky top-0 z-10">
              <tr>
                {visibleColumns.name && (
                  <th
                    className="p-4 font-medium cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Credential Name</span>
                      {renderSortIndicator("name")}
                    </div>
                  </th>
                )}
                {visibleColumns.provider && (
                  <th
                    className="p-4 font-medium cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
                    onClick={() => handleSort("provider")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Provider Name</span>
                      {renderSortIndicator("provider")}
                    </div>
                  </th>
                )}
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
                {visibleColumns.createdBy && <th className="p-4 font-medium">Created By</th>}
                {visibleColumns.updatedOn && (
                  <th
                    className="p-4 font-medium cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
                    onClick={() => handleSort("updatedOn")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Updated On</span>
                      {renderSortIndicator("updatedOn")}
                    </div>
                  </th>
                )}
                {visibleColumns.updatedBy && <th className="p-4 font-medium">Updated By</th>}
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
                  <tr key={`skeleton-${idx}`} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-48"></div></td>
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-28"></div></td>
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-36"></div></td>
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-28"></div></td>
                    <td className="p-4"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-36"></div></td>
                    <td className="p-4"><div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full w-16"></div></td>
                    <td className="p-4 text-right"><div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : paginatedCredentials.length > 0 ? (
                paginatedCredentials.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-50/80 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("button, input, a, [data-flyout-container]")) return;
                      handleOpenEditModal(item);
                    }}
                  >
                    {/* Credential Name */}
                    {visibleColumns.name && (
                      <td className="p-4 font-medium">
                        <div>
                          <span className="font-semibold text-neutral-900 dark:text-white block hover:text-primary-600 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-xs text-neutral-500 font-mono block max-w-xs truncate">
                            {item.apiBaseUrl}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* Provider Name */}
                    {visibleColumns.provider && (
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 shadow-xs">
                          <Globe className="w-3.5 h-3.5 text-neutral-500" />
                          {item.provider}
                        </span>
                      </td>
                    )}

                    {/* Created On */}
                    {visibleColumns.createdOn && (
                      <td className="p-4 text-neutral-600 dark:text-neutral-400 text-xs">
                        {formatDateDisplay(item.createdOn)}
                      </td>
                    )}

                    {/* Created By */}
                    {visibleColumns.createdBy && (
                      <td className="p-4 text-neutral-600 dark:text-neutral-400 text-xs truncate max-w-[160px]">
                        {item.createdBy}
                      </td>
                    )}

                    {/* Updated On */}
                    {visibleColumns.updatedOn && (
                      <td className="p-4 text-neutral-600 dark:text-neutral-400 text-xs">
                        {formatDateDisplay(item.updatedOn)}
                      </td>
                    )}

                    {/* Updated By */}
                    {visibleColumns.updatedBy && (
                      <td className="p-4 text-neutral-600 dark:text-neutral-400 text-xs truncate max-w-[160px]">
                        {item.updatedBy}
                      </td>
                    )}

                    {/* Status Badges */}
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

                    {/* Three-Dot Action Menu */}
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
                              onClick: () => handleOpenEditModal(item),
                            },
                            {
                              icon: Trash2,
                              label: "Delete",
                              onClick: () => {
                                setDeletingItem(item);
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
                /* Empty State */
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                        No Credentials Found
                      </h3>
                      <p className="text-xs text-neutral-500 text-center">
                        No provider credentials match your search or filter parameters. Try resetting your search or add a new credential.
                      </p>
                      <PrimaryButton
                        icon={Plus}
                        onClick={handleOpenAddModal}
                      >
                        Add Credential
                      </PrimaryButton>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* HB Pagination Footer */}
        {sortedCredentials.length > 0 && !isLoading && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>

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
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Filter Credentials</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Filter listing by creation date range.</p>
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
                <FormSection title="Created On Date Range">
                  <FormField>
                    <FormLabel>Start Date</FormLabel>
                    <FormInput
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                    />
                  </FormField>

                  <FormField>
                    <FormLabel>End Date</FormLabel>
                    <FormInput
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                      min={filterStartDate}
                    />
                  </FormField>

                  {/* Quick Presets */}
                  <div className="pt-2">
                    <span className="text-xs text-neutral-500 block mb-2 font-medium">Quick Date Presets:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date().toISOString().split("T")[0];
                          setFilterStartDate(today);
                          setFilterEndDate(today);
                        }}
                        className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-left"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          const last7 = new Date(today);
                          last7.setDate(last7.getDate() - 7);
                          setFilterStartDate(last7.toISOString().split("T")[0]);
                          setFilterEndDate(today.toISOString().split("T")[0]);
                        }}
                        className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-left"
                      >
                        Last 7 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          const last30 = new Date(today);
                          last30.setDate(last30.getDate() - 30);
                          setFilterStartDate(last30.toISOString().split("T")[0]);
                          setFilterEndDate(today.toISOString().split("T")[0]);
                        }}
                        className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-left"
                      >
                        Last 30 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                          setFilterStartDate(firstDay.toISOString().split("T")[0]);
                          setFilterEndDate(today.toISOString().split("T")[0]);
                        }}
                        className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-left"
                      >
                        This Month
                      </button>
                    </div>
                  </div>
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

      {/* Add / Edit Credential Modal */}
      <FormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditMode ? "Edit Credential" : "Add Credential"}
        description="Configure authentication credentials for AI model providers."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveCredential} className="space-y-5">
          <FormSection title="Section 1 — Basic Information">
            <FormGrid cols={2}>
              <FormField>
                <FormLabel htmlFor="credential-name-input" required>
                  Credential Name
                </FormLabel>
                <FormInput
                  id="credential-name-input"
                  type="text"
                  placeholder="Enter credential name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  onBlur={() => setFormTouched((prev) => ({ ...prev, name: true }))}
                  className={formTouched.name && !formName.trim() ? "border-red-500 focus:ring-red-500" : ""}
                  required
                />
                {formTouched.name && !formName.trim() && (
                  <p className="text-xs text-red-500 mt-1">Credential Name is required.</p>
                )}
              </FormField>

              <FormField>
                <FormLabel htmlFor="provider-select" required>
                  Provider
                </FormLabel>
                <FormSelect
                  id="provider-select"
                  value={formProvider}
                  onChange={(e) => handleProviderChange(e.target.value as CredentialItem["provider"])}
                  required
                >
                  <option value="OpenAI">OpenAI</option>
                  <option value="Anthropic">Anthropic</option>
                  <option value="Azure AI">Azure AI</option>
                  <option value="DeepSeek">DeepSeek</option>
                  <option value="Ollama">Ollama</option>
                </FormSelect>
              </FormField>
            </FormGrid>
          </FormSection>

          <FormSection title="Section 2 — Connection Details">
            <FormField>
              <FormLabel htmlFor="api-base-url-input" required>
                API Base URL
              </FormLabel>
              <FormInput
                id="api-base-url-input"
                type="url"
                placeholder="https://api.provider.com/v1"
                value={formApiBaseUrl}
                onChange={(e) => setFormApiBaseUrl(e.target.value)}
                onBlur={() => setFormTouched((prev) => ({ ...prev, url: true }))}
                className={formTouched.url && !formApiBaseUrl.trim() ? "border-red-500 focus:ring-red-500" : ""}
                required
              />
              {formTouched.url && !formApiBaseUrl.trim() && (
                <p className="text-xs text-red-500 mt-1">API Base URL is required.</p>
              )}
            </FormField>

            <FormField>
              <FormLabel htmlFor="api-key-input" required>
                API Key
              </FormLabel>
              <div className="relative">
                <FormInput
                  id="api-key-input"
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter API key string..."
                  value={formApiKey}
                  onChange={(e) => setFormApiKey(e.target.value)}
                  onBlur={() => setFormTouched((prev) => ({ ...prev, key: true }))}
                  className={`pr-20 ${formTouched.key && !formApiKey.trim() ? "border-red-500 focus:ring-red-500" : ""}`}
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-neutral-400">
                  {formApiKey && (
                    <button
                      type="button"
                      onClick={handleCopyFormApiKey}
                      className="p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                      title="Copy API Key"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                    title={showApiKey ? "Hide Password" : "Show Password"}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {formTouched.key && !formApiKey.trim() && (
                <p className="text-xs text-red-500 mt-1">API Key is required.</p>
              )}
            </FormField>
          </FormSection>

          <FormFooter>
            <SecondaryButton type="button" onClick={() => setShowModal(false)} disabled={isSaving}>
              Cancel
            </SecondaryButton>
            <button
              type="submit"
              disabled={!isFormValid || isSaving}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSaving ? "Saving..." : isEditMode ? "Save Changes" : "Save Credential"}</span>
            </button>
          </FormFooter>
        </form>
      </FormModal>

      {/* Delete Confirmation Dialog */}
      <FormModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Credential"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold block mb-1">Warning: Authentication Impact</span>
              Deleting this credential may impact AI models currently using it. Models configured with this credential may fail authentication until another valid credential is assigned.
            </div>
          </div>

          {deletingItem && (
            <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Credential Name:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{deletingItem.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Provider:</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{deletingItem.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Linked Models:</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {deletingItem.linkedModelsCount ?? 1} active model(s)
                </span>
              </div>
            </div>
          )}

          <FormFooter>
            <SecondaryButton onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
              Cancel
            </SecondaryButton>
            <button
              onClick={handleDeleteCredential}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isDeleting ? "Deleting..." : "Delete Credential"}</span>
            </button>
          </FormFooter>
        </div>
      </FormModal>
    </div>
  );
}
