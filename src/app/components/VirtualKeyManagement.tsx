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
  RotateCcw, 
  Ban, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowLeft, 
  ShieldCheck, 
  Cpu, 
  KeyRound, 
  Building2, 
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
  ChevronUp,
  Lock,
  Globe,
  Tag,
  FileText,
  DollarSign,
  TrendingUp,
  Server,
  Layers
} from "lucide-react";
import { toast } from "sonner";
import { 
  PageHeader, 
  SearchBar, 
  IconButton, 
  Pagination, 
  PrimaryButton, 
  ColumnVisibilityPanel, 
  type ColumnConfig
} from "./hb/listing";

// --- Virtual Key Data Interface ---
export interface VirtualKey {
  id: string;
  keyId: string;
  alias: string;
  owner: string;
  ownerId: string;
  ownerType: "You" | "Another User";
  organization: string;
  orgId: string;
  team: string;
  keyType: "AI APIs" | "Management" | "Full Access";
  models: string[]; // ['All Models'] or ['gpt-4o', 'claude-3-5-sonnet']
  maxBudget: number; // 0 for unlimited
  currentSpend: number;
  status: "Active" | "Near Limit" | "Blocked" | "Expired" | "Draft";
  tpmLimit: number;
  rpmLimit: number;
  expiryDuration: string;
  expiryDate: string;
  gracePeriod: string;
  policies: string[];
  guardrails: string[];
  loggingIntegration: string;
  autoRotation: boolean;
  callbackUrl?: string;
  lastUsed: string;
  createdDate: string;
  createdBy: string;
  description?: string;
  secretKeyMasked: string;
}

// Dropdown Option Constants
const AVAILABLE_OWNERS = [
  "hbadmin@yopmail.com",
  "superadmin@spinecloudiq.com",
  "alex.dev@hb.com",
  "sarah.connor@hb.com",
  "michael.scott@hb.com",
];

const AVAILABLE_TEAMS = [
  { name: "AI Research", org: "HB Enterprise", defaultPolicies: ["Rate Limiting", "IP Whitelist"] },
  { name: "DevOps Core", org: "Spine CloudIQ", defaultPolicies: ["Cost Guard", "Geo Fence"] },
  { name: "SecOps Team", org: "CyberShield Ltd", defaultPolicies: ["Rate Limiting", "PII Masking"] },
  { name: "QA Testing", org: "HB Enterprise", defaultPolicies: ["Rate Limiting"] },
  { name: "Frontend Platform", org: "HB Enterprise", defaultPolicies: ["Rate Limiting", "Caching"] },
  { name: "Data Science", org: "Spine CloudIQ", defaultPolicies: ["Cost Guard", "Rate Limiting"] },
];

const AVAILABLE_MODELS = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", badge: "Flagship" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", badge: "Reasoning" },
  { id: "gemini-1-5-pro", name: "Gemini 1.5 Pro", provider: "Google", badge: "Multimodal" },
  { id: "llama-3-70b", name: "Llama 3 70B", provider: "Meta", badge: "Open Source" },
  { id: "codex-mini-latest", name: "Codex", provider: "OpenAI", badge: "Code" },
  { id: "mistral-large", name: "Mistral Large", provider: "Mistral", badge: "Fast" },
];

// Initial Mock Keys
const mockVirtualKeys: VirtualKey[] = [
  {
    id: "vk-101",
    keyId: "512360370354dc140e72731f224b1916bee2a8e2920a71269250fde479762a1a",
    secretKeyMasked: "sk-litellm-512360370354••••••••••••••••••••••••",
    alias: "prod-ai-service",
    owner: "hbadmin@yopmail.com",
    ownerId: "usr-904128",
    ownerType: "You",
    organization: "HB Enterprise",
    orgId: "org-57c860ac",
    team: "AI Research",
    keyType: "AI APIs",
    models: ["gpt-4o", "claude-3-5-sonnet"],
    maxBudget: 500,
    currentSpend: 142.50,
    status: "Active",
    tpmLimit: 100000,
    rpmLimit: 1000,
    expiryDuration: "Never",
    expiryDate: "Never",
    gracePeriod: "7 Days",
    policies: ["Rate Limiting", "IP Whitelist"],
    guardrails: ["PII Masking", "Prompt Injection Shield"],
    loggingIntegration: "Splunk Enterprise",
    autoRotation: true,
    callbackUrl: "https://api.company.com/webhooks/ai-audit",
    lastUsed: "Jul 24, 2026 3:26 PM",
    createdDate: "Jul 24, 2026",
    createdBy: "hbadmin@yopmail.com",
    description: "Primary key for production AI completions service"
  },
  {
    id: "vk-102",
    keyId: "8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
    secretKeyMasked: "sk-litellm-8f9a2b3c4d5e••••••••••••••••••••••••",
    alias: "devops-auto-deploy",
    owner: "superadmin@spinecloudiq.com",
    ownerId: "usr-110293",
    ownerType: "Another User",
    organization: "Spine CloudIQ",
    orgId: "org-8f9a2b3c",
    team: "DevOps Core",
    keyType: "Full Access",
    models: ["All Models"],
    maxBudget: 1200,
    currentSpend: 1150.00,
    status: "Near Limit",
    tpmLimit: 250000,
    rpmLimit: 2500,
    expiryDuration: "90 Days",
    expiryDate: "Oct 24, 2026",
    gracePeriod: "3 Days",
    policies: ["Cost Guard", "Geo Fence"],
    guardrails: ["Content Safety"],
    loggingIntegration: "Datadog APM",
    autoRotation: true,
    callbackUrl: "https://devops.spinecloudiq.com/hooks/ai",
    lastUsed: "Jul 24, 2026 5:10 PM",
    createdDate: "Jul 20, 2026",
    createdBy: "superadmin@spinecloudiq.com",
    description: "High-capacity automated deployment key"
  },
  {
    id: "vk-103",
    keyId: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    secretKeyMasked: "sk-litellm-1a2b3c4d5e6f••••••••••••••••••••••••",
    alias: "secops-audit-key",
    owner: "alex.dev@hb.com",
    ownerId: "usr-449102",
    ownerType: "Another User",
    organization: "CyberShield Ltd",
    orgId: "org-1a2b3c4d",
    team: "SecOps Team",
    keyType: "Management",
    models: ["codex-mini-latest"],
    maxBudget: 200,
    currentSpend: 200.00,
    status: "Blocked",
    tpmLimit: 50000,
    rpmLimit: 500,
    expiryDuration: "30 Days",
    expiryDate: "Jun 15, 2026",
    gracePeriod: "None",
    policies: ["Rate Limiting"],
    guardrails: ["PII Masking"],
    loggingIntegration: "AWS S3 Bucket",
    autoRotation: false,
    lastUsed: "Jun 14, 2026 11:05 AM",
    createdDate: "May 15, 2026",
    createdBy: "alex.dev@hb.com",
    description: "Temporarily blocked key due to policy review"
  },
  {
    id: "vk-104",
    keyId: "9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    secretKeyMasked: "sk-litellm-9b8a7c6d5e4f••••••••••••••••••••••••",
    alias: "qa-regression-sandbox",
    owner: "hbadmin@yopmail.com",
    ownerId: "usr-904128",
    ownerType: "You",
    organization: "HB Enterprise",
    orgId: "org-57c860ac",
    team: "QA Testing",
    keyType: "AI APIs",
    models: ["gpt-4o", "llama-3-70b"],
    maxBudget: 100,
    currentSpend: 100.00,
    status: "Expired",
    tpmLimit: 20000,
    rpmLimit: 200,
    expiryDuration: "30 Days",
    expiryDate: "Jul 01, 2026",
    gracePeriod: "0 Days",
    policies: [],
    guardrails: ["Content Safety"],
    loggingIntegration: "Default HB LogStream",
    autoRotation: false,
    lastUsed: "Jul 01, 2026 12:00 PM",
    createdDate: "Jun 01, 2026",
    createdBy: "hbadmin@yopmail.com",
    description: "Expired sandbox key for QA regression testing"
  }
];

// Mock Logs Data for Logs Tab
interface AuditLogEntry {
  id: string;
  date: string;
  user: string;
  action: string;
  ip: string;
  status: "Success" | "Failed" | "Blocked";
  description: string;
}

const mockAuditLogs: AuditLogEntry[] = [
  { id: "log-1", date: "Jul 24, 2026 15:26:04", user: "hbadmin@yopmail.com", action: "API Call (gpt-4o)", ip: "192.168.1.104", status: "Success", description: "Completed completion request (2,450 tokens, 140ms latency)" },
  { id: "log-2", date: "Jul 24, 2026 14:10:12", user: "hbadmin@yopmail.com", action: "API Call (claude-3-5)", ip: "192.168.1.104", status: "Success", description: "Completed message request (1,120 tokens, 95ms latency)" },
  { id: "log-3", date: "Jul 23, 2026 09:45:00", user: "system-auto", action: "Budget Check", ip: "Internal Proxy", status: "Success", description: "Spend threshold evaluated (28.5% of $500.00 cap)" },
  { id: "log-4", date: "Jul 22, 2026 18:30:15", user: "superadmin@spinecloudiq.com", action: "Key Update", ip: "10.0.4.12", status: "Success", description: "Updated rate limits (TPM: 100,000, RPM: 1,000)" },
  { id: "log-5", date: "Jul 20, 2026 11:20:00", user: "hbadmin@yopmail.com", action: "Key Provisioned", ip: "192.168.1.104", status: "Success", description: "Initial Virtual Key generated and assigned to AI Research" },
];

export default function VirtualKeyManagement() {
  const [keys, setKeys] = useState<VirtualKey[]>(mockVirtualKeys);
  const [viewState, setViewState] = useState<"list" | "detail">("list");
  const [selectedKey, setSelectedKey] = useState<VirtualKey | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter Fields State
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterOwner, setFilterOwner] = useState("All");
  const [filterOrg, setFilterOrg] = useState("All");
  const [filterTeam, setFilterTeam] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterModel, setFilterModel] = useState("All");

  // Summary KPI Visibility State
  const [showSummary, setShowSummary] = useState(true);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sorting state (Title Case columns)
  const [sortField, setSortField] = useState<keyof VirtualKey>("alias");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Action Dropdown state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showHeaderActionsMenu, setShowHeaderActionsMenu] = useState(false);

  // Column visibility state (Matching required columns)
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const columnAnchorRef = useRef<HTMLDivElement>(null);

  const allColumns: ColumnConfig[] = [
    { key: "alias", label: "Key Alias" },
    { key: "keyId", label: "Key ID" },
    { key: "owner", label: "Owner" },
    { key: "organization", label: "Organization" },
    { key: "team", label: "Team" },
    { key: "models", label: "Models" },
    { key: "maxBudget", label: "Budget" },
    { key: "currentSpend", label: "Spend" },
    { key: "status", label: "Status" },
    { key: "lastUsed", label: "Last Used" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "createdDate", label: "Created Date" },
  ];

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    alias: true,
    keyId: true,
    owner: true,
    organization: true,
    team: true,
    models: true,
    maxBudget: true,
    currentSpend: true,
    status: true,
    lastUsed: true,
    expiryDate: false,
    createdDate: false,
  });

  const toggleColumn = (key: string) => {
    if (key === "alias" || key === "status") return;
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showResetSpendModal, setShowResetSpendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Highlighted key ID after creation
  const [highlightedKeyId, setHighlightedKeyId] = useState<string | null>(null);

  // Form State
  const [formOwner, setFormOwner] = useState("hbadmin@yopmail.com");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);

  const [teamSearch, setTeamSearch] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  const [formOwnerType, setFormOwnerType] = useState<"You" | "Another User">("You");
  const [formOrg, setFormOrg] = useState("HB Enterprise");
  const [formTeam, setFormTeam] = useState("AI Research");
  const [formAlias, setFormAlias] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formModels, setFormModels] = useState<string[]>(["gpt-4o", "claude-3-5-sonnet"]);
  const [allModelsSelected, setAllModelsSelected] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [formKeyType, setFormKeyType] = useState<"AI APIs" | "Management" | "Full Access">("AI APIs");
  const [formMaxBudget, setFormMaxBudget] = useState("500");
  const [formSoftBudget, setFormSoftBudget] = useState("400");
  const [formBudgetCycle, setFormBudgetCycle] = useState("Monthly");
  const [formTpmLimit, setFormTpmLimit] = useState("100000");
  const [formRpmLimit, setFormRpmLimit] = useState("1000");
  const [formModelSpecificLimits, setFormModelSpecificLimits] = useState("");
  const [formExpiryDuration, setFormExpiryDuration] = useState("Never");
  const [formGracePeriod, setFormGracePeriod] = useState("7 Days");
  const [formPolicies, setFormPolicies] = useState<string[]>(["Rate Limiting", "IP Whitelist"]);
  const [formGuardrails, setFormGuardrails] = useState<string[]>(["PII Masking"]);
  const [formLogging, setFormLogging] = useState("Splunk Enterprise");
  const [formAutoRotation, setFormAutoRotation] = useState(true);
  const [formCallbackUrl, setFormCallbackUrl] = useState("https://api.company.com/webhooks/ai-audit");

  const [formCapabilities, setFormCapabilities] = useState({
    apiAccess: true,
    modelAccess: true,
    spendTracking: true,
    logging: true,
    teamResources: false,
  });

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [formTags, setFormTags] = useState("env:production, gateway:v1");
  const [formAllowedIps, setFormAllowedIps] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // Detail View Tab
  const [detailTab, setDetailTab] = useState<"overview" | "configuration" | "usage" | "policies" | "logs">("overview");

  // Logs Tab Filters & Search
  const [logsSearch, setLogsSearch] = useState("");
  const [logsActionFilter, setLogsActionFilter] = useState("All");

  // Copy helper with HB Toast
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopyText = (text: string, label: string = "Copied successfully!") => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(label);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Close active dropdowns outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".action-menu-container")) {
        setActiveMenuId(null);
        setShowHeaderActionsMenu(false);
      }
      if (!target.closest(".model-dropdown-container")) {
        setShowModelDropdown(false);
      }
      if (!target.closest(".owner-dropdown-container")) {
        setShowOwnerDropdown(false);
      }
      if (!target.closest(".team-dropdown-container")) {
        setShowTeamDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Reset view state to listing when navigating via global menu
  useEffect(() => {
    const handleReset = () => {
      setViewState("list");
      setSelectedKey(null);
    };
    window.addEventListener("reset-view-state", handleReset);
    return () => window.removeEventListener("reset-view-state", handleReset);
  }, []);

  // Validation calculations
  const isDuplicateName = useMemo(() => {
    if (!formAlias.trim()) return false;
    return keys.some(
      (k) =>
        k.alias.toLowerCase().trim() === formAlias.toLowerCase().trim() &&
        (!isEditMode || k.id !== selectedKey?.id)
    );
  }, [formAlias, keys, isEditMode, selectedKey]);

  const isBudgetInvalid = useMemo(() => {
    if (formMaxBudget === "") return false;
    const num = Number(formMaxBudget);
    return isNaN(num) || num < 0;
  }, [formMaxBudget]);

  const isSoftBudgetInvalid = useMemo(() => {
    if (formSoftBudget === "") return false;
    const num = Number(formSoftBudget);
    const maxNum = Number(formMaxBudget);
    return isNaN(num) || num < 0 || (!isNaN(maxNum) && maxNum > 0 && num > maxNum);
  }, [formSoftBudget, formMaxBudget]);

  const isTpmInvalid = useMemo(() => {
    if (formTpmLimit === "") return false;
    const num = Number(formTpmLimit);
    return isNaN(num) || num < 0;
  }, [formTpmLimit]);

  const isRpmInvalid = useMemo(() => {
    if (formRpmLimit === "") return false;
    const num = Number(formRpmLimit);
    return isNaN(num) || num < 0;
  }, [formRpmLimit]);

  const isFormValid = useMemo(() => {
    return (
      formAlias.trim().length > 0 &&
      formAlias.length <= 100 &&
      !isDuplicateName &&
      !isBudgetInvalid &&
      !isSoftBudgetInvalid &&
      !isTpmInvalid &&
      !isRpmInvalid
    );
  }, [formAlias, isDuplicateName, isBudgetInvalid, isSoftBudgetInvalid, isTpmInvalid, isRpmInvalid]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedKey(null);
    setFormAlias("");
    setFormDescription("");
    setFormOwner("hbadmin@yopmail.com");
    setFormTeam("AI Research");
    setFormOrg("HB Enterprise");
    setFormKeyType("AI APIs");
    setFormModels(["gpt-4o", "claude-3-5-sonnet"]);
    setAllModelsSelected(false);
    setFormMaxBudget("500");
    setFormSoftBudget("400");
    setFormBudgetCycle("Monthly");
    setFormTpmLimit("100000");
    setFormRpmLimit("1000");
    setFormModelSpecificLimits("");
    setFormCapabilities({
      apiAccess: true,
      modelAccess: true,
      spendTracking: true,
      logging: true,
      teamResources: false,
    });
    setShowAdvancedSettings(false);
    setFormTags("env:production, gateway:v1");
    setFormExpiryDuration("Never");
    setFormAllowedIps("");
    setFormNotes("");
    setFormTouched(false);
    setIsGenerating(false);
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (keyItem: VirtualKey) => {
    setSelectedKey(keyItem);
    setIsEditMode(true);
    setFormAlias(keyItem.alias);
    setFormDescription(keyItem.description || "");
    setFormOwner(keyItem.owner || "hbadmin@yopmail.com");
    setFormOwnerType(keyItem.ownerType);
    setFormOrg(keyItem.organization);
    setFormTeam(keyItem.team);
    setFormKeyType(keyItem.keyType);
    setFormModels(keyItem.models);
    setAllModelsSelected(keyItem.models.includes("All Models"));
    setFormMaxBudget(keyItem.maxBudget.toString());
    setFormSoftBudget((keyItem.maxBudget * 0.8).toString());
    setFormBudgetCycle("Monthly");
    setFormTpmLimit(keyItem.tpmLimit.toString());
    setFormRpmLimit(keyItem.rpmLimit.toString());
    setFormModelSpecificLimits("");
    setFormCapabilities({
      apiAccess: true,
      modelAccess: true,
      spendTracking: true,
      logging: true,
      teamResources: true,
    });
    setFormExpiryDuration(keyItem.expiryDuration);
    setFormGracePeriod(keyItem.gracePeriod);
    setFormPolicies(keyItem.policies);
    setFormGuardrails(keyItem.guardrails);
    setFormLogging(keyItem.loggingIntegration);
    setFormAutoRotation(keyItem.autoRotation);
    setFormCallbackUrl(keyItem.callbackUrl || "");
    setShowAdvancedSettings(false);
    setFormTags("env:production");
    setFormAllowedIps("");
    setFormNotes("");
    setFormTouched(false);
    setIsGenerating(false);
    setShowCreateModal(true);
  };

  const handleSelectTeam = (teamName: string) => {
    setFormTeam(teamName);
    const foundTeam = AVAILABLE_TEAMS.find((t) => t.name === teamName);
    if (foundTeam) {
      setFormOrg(foundTeam.org);
      setFormPolicies(foundTeam.defaultPolicies);
    }
  };

  const handleSaveVirtualKey = () => {
    setFormTouched(true);

    if (!isFormValid) {
      if (isDuplicateName) {
        toast.error("A Virtual Key with this name already exists.");
      } else {
        toast.error("Please resolve all validation errors before proceeding.");
      }
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      if (isEditMode && selectedKey) {
        setKeys((prev) =>
          prev.map((k) =>
            k.id === selectedKey.id
              ? {
                  ...k,
                  alias: formAlias.trim(),
                  description: formDescription.trim(),
                  owner: formOwner,
                  organization: formOrg,
                  team: formTeam,
                  keyType: formKeyType,
                  models: allModelsSelected ? ["All Models"] : (formModels.length > 0 ? formModels : ["gpt-4o"]),
                  maxBudget: parseFloat(formMaxBudget) || 0,
                  tpmLimit: parseInt(formTpmLimit) || 100000,
                  rpmLimit: parseInt(formRpmLimit) || 1000,
                  expiryDuration: formExpiryDuration,
                  gracePeriod: formGracePeriod,
                  policies: formPolicies,
                  guardrails: formGuardrails,
                  loggingIntegration: formLogging,
                  autoRotation: formAutoRotation,
                  callbackUrl: formCallbackUrl,
                }
              : k
          )
        );
        toast.success(`Virtual Key "${formAlias.trim()}" updated successfully!`);
        setHighlightedKeyId(selectedKey.id);
      } else {
        const newId = `vk-${Date.now()}`;
        const newKeyItem: VirtualKey = {
          id: newId,
          keyId: `${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          secretKeyMasked: "sk-litellm-" + Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "••••••••••••••••",
          alias: formAlias.trim(),
          owner: formOwner,
          ownerId: "usr-904128",
          ownerType: formOwner === "hbadmin@yopmail.com" ? "You" : "Another User",
          organization: formOrg,
          orgId: "org-57c860ac",
          team: formTeam,
          keyType: formKeyType,
          models: allModelsSelected ? ["All Models"] : (formModels.length > 0 ? formModels : ["gpt-4o"]),
          maxBudget: parseFloat(formMaxBudget) || 500,
          currentSpend: 0,
          status: "Active",
          tpmLimit: parseInt(formTpmLimit) || 100000,
          rpmLimit: parseInt(formRpmLimit) || 1000,
          expiryDuration: formExpiryDuration,
          expiryDate: formExpiryDuration === "Never" ? "Never" : "Oct 24, 2026",
          gracePeriod: "7 Days",
          policies: formPolicies.length > 0 ? formPolicies : ["Rate Limiting"],
          guardrails: ["PII Masking"],
          loggingIntegration: "Splunk Enterprise",
          autoRotation: true,
          callbackUrl: "https://api.company.com/webhooks/ai-audit",
          lastUsed: "Just now",
          createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          createdBy: formOwner,
          description: formDescription.trim(),
        };
        setKeys((prev) => [newKeyItem, ...prev]);
        toast.success(`Virtual Key "${formAlias.trim()}" generated successfully!`);
        setHighlightedKeyId(newId);
      }

      setIsGenerating(false);
      setShowCreateModal(false);

      setTimeout(() => {
        setHighlightedKeyId(null);
      }, 4000);
    }, 600);
  };

  const handleRegenerateKeySubmit = () => {
    if (!selectedKey) return;
    const newKeyId = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setKeys((prev) =>
      prev.map((k) => (k.id === selectedKey.id ? { ...k, keyId: newKeyId, lastUsed: "Just now" } : k))
    );
    toast.success(`Regenerated secret key for "${selectedKey.alias}"!`);
    setShowRegenerateModal(false);
  };

  const handleResetSpendSubmit = () => {
    if (!selectedKey) return;
    setKeys((prev) =>
      prev.map((k) =>
        k.id === selectedKey.id
          ? { ...k, currentSpend: 0, status: k.status === "Near Limit" ? "Active" : k.status }
          : k
      )
    );
    toast.success(`Reset accumulated spend for "${selectedKey.alias}" to $0.00!`);
    setShowResetSpendModal(false);
  };

  const handleToggleBlockSubmit = () => {
    if (!selectedKey) return;
    const newStatus = selectedKey.status === "Blocked" ? "Active" : "Blocked";
    setKeys((prev) =>
      prev.map((k) => (k.id === selectedKey.id ? { ...k, status: newStatus } : k))
    );
    toast.info(`Virtual Key "${selectedKey.alias}" is now ${newStatus}.`);
    setShowBlockModal(false);
  };

  const handleDeleteKeySubmit = () => {
    if (!selectedKey) return;
    setKeys((prev) => prev.filter((k) => k.id !== selectedKey.id));
    toast.success(`Virtual Key "${selectedKey.alias}" deleted permanently.`);
    setShowDeleteModal(false);
    if (viewState === "detail") setViewState("list");
  };

  const getBadgeStyle = (status: VirtualKey["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Near Limit":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Blocked":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "Expired":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700";
      case "Draft":
        return "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800";
    }
  };

  const renderStatusBadge = (status: VirtualKey["status"]) => (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getBadgeStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );

  const availableModelsList = [
    "gpt-4o",
    "codex-mini-latest",
    "claude-3-5-sonnet",
    "gemini-1-5-pro",
    "llama-3-70b",
    "mistral-large"
  ];

  // Dynamic KPI Summary Stats
  const kpiStats = useMemo(() => {
    const totalKeys = keys.length;
    const activeKeys = keys.filter((k) => k.status === "Active").length;
    const nearLimitKeys = keys.filter((k) => k.status === "Near Limit").length;
    const totalSpend = keys.reduce((sum, k) => sum + k.currentSpend, 0);
    const blockedKeys = keys.filter((k) => k.status === "Blocked" || k.status === "Expired").length;

    return [
      {
        id: "total-keys",
        label: "Total Virtual Keys",
        value: totalKeys.toString(),
        subValue: `${activeKeys} Active in Production`,
      },
      {
        id: "active-keys",
        label: "Active Keys",
        value: activeKeys.toString(),
        subValue: `${((activeKeys / (totalKeys || 1)) * 100).toFixed(0)}% Operational`,
      },
      {
        id: "total-spend",
        label: "Accumulated Spend",
        value: `$${totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        subValue: "Current Billing Cycle",
      },
      {
        id: "near-limit",
        label: "Near Limit Alerts",
        value: nearLimitKeys.toString(),
        subValue: nearLimitKeys > 0 ? "Requires Budget Attention" : "All Within Thresholds",
      },
      {
        id: "blocked-keys",
        label: "Blocked / Expired",
        value: blockedKeys.toString(),
        subValue: "Access Suspended",
      },
    ];
  }, [keys]);

  // 1. Filtered Virtual Keys
  const filteredKeys = useMemo(() => {
    return keys.filter((key) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        key.alias.toLowerCase().includes(query) ||
        key.keyId.toLowerCase().includes(query) ||
        key.owner.toLowerCase().includes(query) ||
        key.team.toLowerCase().includes(query) ||
        key.organization.toLowerCase().includes(query) ||
        (key.description && key.description.toLowerCase().includes(query)) ||
        key.models.some((m) => m.toLowerCase().includes(query));

      const matchesStatus = filterStatus === "All" || key.status === filterStatus;
      const matchesOwner = filterOwner === "All" || key.owner === filterOwner;
      const matchesOrg = filterOrg === "All" || key.organization === filterOrg;
      const matchesTeam = filterTeam === "All" || key.team === filterTeam;
      const matchesType = filterType === "All" || key.keyType === filterType;
      const matchesModel =
        filterModel === "All" ||
        key.models.includes("All Models") ||
        key.models.includes(filterModel);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesOwner &&
        matchesOrg &&
        matchesTeam &&
        matchesType &&
        matchesModel
      );
    });
  }, [
    keys,
    searchQuery,
    filterStatus,
    filterOwner,
    filterOrg,
    filterTeam,
    filterType,
    filterModel,
  ]);

  // 2. Sorted Virtual Keys
  const sortedKeys = useMemo(() => {
    return [...filteredKeys].sort((a, b) => {
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
  }, [filteredKeys, sortField, sortDirection]);

  // 3. Paginated Virtual Keys
  const paginatedKeys = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedKeys.slice(start, start + pageSize);
  }, [sortedKeys, currentPage, pageSize]);

  // Sorting Table Helper
  const handleSort = (field: keyof VirtualKey) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIndicator = (field: keyof VirtualKey) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 font-bold" />
    );
  };

  // Checkbox Selection Helpers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedKeys.map((k) => k.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  const handleResetFilters = () => {
    setFilterStatus("All");
    setFilterOwner("All");
    setFilterOrg("All");
    setFilterTeam("All");
    setFilterType("All");
    setFilterModel("All");
    setSearchQuery("");
  };

  // Filtered audit logs
  const filteredAuditLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchesSearch = !logsSearch || log.description.toLowerCase().includes(logsSearch.toLowerCase()) || log.user.toLowerCase().includes(logsSearch.toLowerCase()) || log.ip.includes(logsSearch);
      const matchesAction = logsActionFilter === "All" || log.action.includes(logsActionFilter);
      return matchesSearch && matchesAction;
    });
  }, [logsSearch, logsActionFilter]);

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">

      {/* ========================================================================= */}
      {/* SCREEN 1: VIRTUAL KEY LISTING (TABLE VIEW ONLY)                           */}
      {/* ========================================================================= */}
      {viewState === "list" || !selectedKey ? (
        <>
          <PageHeader
            pageId="virtual-key"
            action="list"
          >
            {/* 1. Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              placeholder="Search Virtual Keys..."
            />

            {/* 2. Filter Button */}
            <IconButton
              icon={Filter}
              label="Filter"
              onClick={() => setShowFilterModal(true)}
              title="Filter Virtual Keys"
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
                  anchorRef={columnAnchorRef}
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
              onClick={() => toast.success("Exporting Virtual Keys to CSV...")}
            />

            {/* 5. Refresh */}
            <IconButton
              icon={RefreshCw}
              label="Refresh"
              onClick={() => toast.success("Refreshed Virtual Keys list")}
            />

            {/* 6. Show/Hide Summary Toggle */}
            <IconButton
              icon={showSummary ? EyeOff : BarChart3}
              label={showSummary ? "Hide Summary" : "Show Summary"}
              onClick={() => setShowSummary(!showSummary)}
              title={showSummary ? "Hide KPI Summary Cards" : "Show KPI Summary Cards"}
            />

            {/* 7. Create Virtual Key Primary Button (Last Position) */}
            <PrimaryButton icon={Plus} onClick={handleOpenCreateModal}>
              Create Virtual Key
            </PrimaryButton>
          </PageHeader>

          {/* Collapsible KPI Summary Cards */}
          {showSummary && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 transition-all duration-300 animate-fadeIn">
              {kpiStats.map((stat) => (
                <div 
                  key={stat.id} 
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                    {stat.subValue}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Listing Table Container */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50/80 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold text-xs">
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === paginatedKeys.length && paginatedKeys.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>

                    {visibleColumns.alias && (
                      <th 
                        onClick={() => handleSort("alias")} 
                        className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Key Alias</span>
                          {renderSortIndicator("alias")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.keyId && <th className="py-3 px-4">Key ID</th>}

                    {visibleColumns.owner && (
                      <th 
                        onClick={() => handleSort("owner")} 
                        className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Owner</span>
                          {renderSortIndicator("owner")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.organization && (
                      <th 
                        onClick={() => handleSort("organization")} 
                        className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Organization</span>
                          {renderSortIndicator("organization")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.team && (
                      <th 
                        onClick={() => handleSort("team")} 
                        className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Team</span>
                          {renderSortIndicator("team")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.models && <th className="py-3 px-4">Models</th>}

                    {visibleColumns.maxBudget && (
                      <th 
                        onClick={() => handleSort("maxBudget")} 
                        className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Budget</span>
                          {renderSortIndicator("maxBudget")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.currentSpend && (
                      <th 
                        onClick={() => handleSort("currentSpend")} 
                        className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Spend</span>
                          {renderSortIndicator("currentSpend")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.status && (
                      <th 
                        onClick={() => handleSort("status")} 
                        className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Status</span>
                          {renderSortIndicator("status")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.lastUsed && (
                      <th 
                        onClick={() => handleSort("lastUsed")} 
                        className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Last Used</span>
                          {renderSortIndicator("lastUsed")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.expiryDate && <th className="py-3 px-4">Expiry Date</th>}
                    {visibleColumns.createdDate && <th className="py-3 px-4">Created Date</th>}

                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-neutral-800 dark:text-neutral-200">
                  {paginatedKeys.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-12 text-center text-neutral-400 dark:text-neutral-500 space-y-3">
                        <KeyRound className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-700 stroke-1" />
                        <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">No Virtual Keys Found</div>
                        <p className="text-xs max-w-sm mx-auto">No keys match your search query or filter selection.</p>
                        <PrimaryButton icon={Plus} onClick={handleOpenCreateModal}>
                          Create Virtual Key
                        </PrimaryButton>
                      </td>
                    </tr>
                  ) : (
                    paginatedKeys.map((item) => {
                      const isSelected = selectedIds.has(item.id);
                      const isMenuOpen = activeMenuId === item.id;

                      const isHighlighted = item.id === highlightedKeyId;

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-all duration-500 ${
                            isHighlighted
                              ? "bg-primary-50/80 dark:bg-primary-950/60 ring-2 ring-primary-500/60 shadow-xs"
                              : isSelected
                              ? "bg-primary-50/40 dark:bg-primary-950/20"
                              : ""
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                              className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>

                          {visibleColumns.alias && (
                            <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-white">
                              <button
                                onClick={() => {
                                  setSelectedKey(item);
                                  setViewState("detail");
                                }}
                                className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline transition-colors text-left"
                              >
                                {item.alias}
                              </button>
                            </td>
                          )}

                          {visibleColumns.keyId && (
                            <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                              <div className="flex items-center gap-1 max-w-[140px] truncate" title={item.keyId}>
                                <span>{item.keyId.substring(0, 14)}...</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(item.keyId, "Copied successfully!")}
                                  className="text-neutral-400 hover:text-primary-600 transition-colors p-0.5"
                                  title="Copy Key ID"
                                >
                                  {copiedId === item.keyId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>
                          )}

                          {visibleColumns.owner && <td className="py-3.5 px-4">{item.owner}</td>}
                          {visibleColumns.organization && <td className="py-3.5 px-4">{item.organization}</td>}
                          {visibleColumns.team && <td className="py-3.5 px-4">{item.team}</td>}

                          {visibleColumns.models && (
                            <td className="py-3.5 px-4 max-w-[150px] truncate">
                              <div className="flex flex-wrap gap-1">
                                {item.models.map((m) => (
                                  <span key={m} className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </td>
                          )}

                          {visibleColumns.maxBudget && (
                            <td className="py-3.5 px-4 font-mono">
                              {item.maxBudget === 0 ? "Unlimited" : `$${item.maxBudget.toFixed(2)}`}
                            </td>
                          )}

                          {visibleColumns.currentSpend && (
                            <td className="py-3.5 px-4 font-mono font-semibold text-neutral-900 dark:text-white">
                              ${item.currentSpend.toFixed(2)}
                            </td>
                          )}

                          {visibleColumns.status && (
                            <td className="py-3.5 px-4">{renderStatusBadge(item.status)}</td>
                          )}

                          {visibleColumns.lastUsed && (
                            <td className="py-3.5 px-4 text-neutral-500">{item.lastUsed}</td>
                          )}

                          {visibleColumns.expiryDate && (
                            <td className="py-3.5 px-4 text-neutral-500">{item.expiryDate}</td>
                          )}

                          {visibleColumns.createdDate && (
                            <td className="py-3.5 px-4 text-neutral-500">{item.createdDate}</td>
                          )}

                          {/* Action Column: Single Three-Dot Menu */}
                          <td className="py-3.5 px-4 text-right relative action-menu-container">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(isMenuOpen ? null : item.id);
                              }}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                              title="Actions Menu"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-4 top-10 z-30 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1.5 text-left text-xs animate-fadeIn">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setSelectedKey(item);
                                    setViewState("detail");
                                  }}
                                  className="w-full px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                                >
                                  <Eye className="w-3.5 h-3.5 text-neutral-500" />
                                  <span>View</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    handleOpenEditModal(item);
                                  }}
                                  className="w-full px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setSelectedKey(item);
                                    setShowRegenerateModal(true);
                                  }}
                                  className="w-full px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                                >
                                  <RotateCw className="w-3.5 h-3.5 text-neutral-500" />
                                  <span>Regenerate Key</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setSelectedKey(item);
                                    setShowResetSpendModal(true);
                                  }}
                                  className="w-full px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                                  <span>Reset Spend</span>
                                </button>

                                <hr className="my-1 border-neutral-100 dark:border-neutral-800" />

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setSelectedKey(item);
                                    setShowBlockModal(true);
                                  }}
                                  className="w-full px-3 py-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2 font-medium"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>{item.status === "Blocked" ? "Unblock Key" : "Block Key"}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setSelectedKey(item);
                                    setShowDeleteModal(true);
                                  }}
                                  className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Key</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredKeys.length / pageSize) || 1}
                totalItems={filteredKeys.length}
                itemsPerPage={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
                onItemsPerPageChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </>
      ) : (
        /* ========================================================================= */
        /* SCREEN 3: FULL VIRTUAL KEY DETAIL PAGE (WITH ALL TABS ENHANCED)           */
        /* ========================================================================= */
        selectedKey && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Navigation & Labeled Enterprise Header Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setViewState("list")}
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Virtual Keys
              </button>

              {/* Labeled Enterprise Header Buttons & Dropdown */}
              <div className="flex items-center gap-2 action-menu-container">
                <button
                  type="button"
                  onClick={() => setShowRegenerateModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <RotateCw className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Regenerate Key</span>
                </button>

                {/* Secondary Actions Dropdown Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowHeaderActionsMenu(!showHeaderActionsMenu)}
                    className="px-3.5 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>Actions</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                  </button>

                  {showHeaderActionsMenu && (
                    <div className="absolute right-0 top-10 z-30 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1.5 text-left text-xs animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => {
                          setShowHeaderActionsMenu(false);
                          handleOpenEditModal(selectedKey);
                        }}
                        className="w-full px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Edit Virtual Key</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowHeaderActionsMenu(false);
                          setShowResetSpendModal(true);
                        }}
                        className="w-full px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Reset Spend</span>
                      </button>

                      <hr className="my-1 border-neutral-100 dark:border-neutral-800" />

                      <button
                        type="button"
                        onClick={() => {
                          setShowHeaderActionsMenu(false);
                          setShowBlockModal(true);
                        }}
                        className="w-full px-3 py-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2 font-medium"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{selectedKey.status === "Blocked" ? "Unblock Key" : "Block Key"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowHeaderActionsMenu(false);
                          setShowDeleteModal(true);
                        }}
                        className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Key</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Page Information Header Summary Card */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      {selectedKey.alias}
                    </h2>
                    {renderStatusBadge(selectedKey.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono min-w-0">
                    <span className="truncate max-w-[280px] sm:max-w-[420px]" title={selectedKey.keyId}>
                      Key ID: {selectedKey.keyId.length > 32 ? `${selectedKey.keyId.substring(0, 24)}...` : selectedKey.keyId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedKey.keyId, "Copied successfully!")}
                      className="text-neutral-400 hover:text-primary-600 transition-colors p-1 shrink-0"
                      title="Copy Key ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <div className="text-neutral-400 font-medium">Accumulated Spend</div>
                    <div className="text-lg font-bold text-neutral-900 dark:text-white font-mono">${selectedKey.currentSpend.toFixed(2)}</div>
                  </div>
                  <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />
                  <div className="text-right">
                    <div className="text-neutral-400 font-medium">Max Budget Cap</div>
                    <div className="text-lg font-bold text-neutral-900 dark:text-white font-mono">${selectedKey.maxBudget.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Comprehensive Metadata Header Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">Owner</div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 min-w-0">
                    <span className="truncate" title={selectedKey.owner}>{selectedKey.owner}</span>
                    <button type="button" onClick={() => handleCopyText(selectedKey.ownerId, "Copied successfully!")} title="Copy Owner ID" className="shrink-0 p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                      <Copy className="w-3 h-3 text-neutral-400 hover:text-primary-600 transition-colors" />
                    </button>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">Organization</div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 min-w-0">
                    <span className="truncate" title={selectedKey.organization}>{selectedKey.organization}</span>
                    <button type="button" onClick={() => handleCopyText(selectedKey.orgId, "Copied successfully!")} title="Copy Org ID" className="shrink-0 p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                      <Copy className="w-3 h-3 text-neutral-400 hover:text-primary-600 transition-colors" />
                    </button>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">Team</div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate" title={selectedKey.team}>{selectedKey.team}</div>
                </div>

                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">Created By</div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate" title={selectedKey.createdBy}>{selectedKey.createdBy}</div>
                </div>

                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">Created Date</div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{selectedKey.createdDate}</div>
                </div>

                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">Last Activity</div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{selectedKey.lastUsed}</div>
                </div>
              </div>
            </div>

            {/* Detail Tabs */}
            <div className="border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
              <div className="flex gap-6 text-xs font-semibold min-w-max">
                {(["overview", "configuration", "usage", "policies", "logs"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    className={`py-2.5 border-b-2 capitalize transition-colors ${
                      detailTab === tab
                        ? "border-primary-600 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* TAB 1: OVERVIEW                                                           */}
            {/* ========================================================================= */}
            {detailTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Virtual Key Information Card */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-primary-600" />
                      Virtual Key Information
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-neutral-400 font-medium mb-0.5">Secret Key</div>
                        <div className="font-mono font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-2 bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg border border-neutral-200/60 dark:border-neutral-700">
                          <span className="truncate">{selectedKey.secretKeyMasked}</span>
                          <button 
                            type="button" 
                            onClick={() => handleCopyText("sk-litellm-512360370354dc140e72731f224b1916bee2a8e2920a71269250fde479762a1a", "Copied successfully!")}
                            className="text-neutral-400 hover:text-primary-600 p-1"
                            title="Copy Full Secret Key"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="text-neutral-400 font-medium mb-0.5">Authorization Scope</div>
                        <div className="font-semibold text-neutral-800 dark:text-neutral-200 p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200/60 dark:border-neutral-700">
                          {selectedKey.keyType} (Allowed API Routes)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Budget & Usage Card with Spend Progress Bar */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        Budget & Spend Cap Progress
                      </h3>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        28.5% Used
                      </span>
                    </div>

                    {/* Spend Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-neutral-600 dark:text-neutral-400">Current Spend: ${selectedKey.currentSpend.toFixed(2)}</span>
                        <span className="text-neutral-900 dark:text-white">Max Cap: ${selectedKey.maxBudget.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-600 rounded-full transition-all duration-500" style={{ width: "28.5%" }} />
                      </div>
                      <div className="flex justify-between text-[11px] text-neutral-400">
                        <span>Remaining Budget: ${(selectedKey.maxBudget - selectedKey.currentSpend).toFixed(2)}</span>
                        <span>Reset Schedule: Monthly on 1st</span>
                      </div>
                    </div>
                  </div>

                  {/* Rate Limits & Auto Rotation Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-2">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-blue-600" />
                        Rate Limits & Throughput
                      </h4>
                      <div className="space-y-1 text-xs pt-1">
                        <div className="flex justify-between"><span className="text-neutral-400">TPM Limit:</span> <span className="font-mono font-semibold">{selectedKey.tpmLimit.toLocaleString()} Tokens/min</span></div>
                        <div className="flex justify-between"><span className="text-neutral-400">RPM Limit:</span> <span className="font-mono font-semibold">{selectedKey.rpmLimit.toLocaleString()} Reqs/min</span></div>
                        <div className="flex justify-between"><span className="text-neutral-400">Max Parallel Requests:</span> <span className="font-mono font-semibold">50 Concurrent</span></div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-2">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <RotateCw className="w-4 h-4 text-purple-600" />
                        Auto Rotation Settings
                      </h4>
                      <div className="space-y-1 text-xs pt-1">
                        <div className="flex justify-between"><span className="text-neutral-400">Status:</span> <span className="font-semibold text-emerald-600">Enabled</span></div>
                        <div className="flex justify-between"><span className="text-neutral-400">Rotation Cycle:</span> <span className="font-semibold">Every 90 Days</span></div>
                        <div className="flex justify-between"><span className="text-neutral-400">Grace Period:</span> <span className="font-semibold">{selectedKey.gracePeriod}</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Timeline Card */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-600" />
                    Timeline Card (Recent Activity)
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div className="border-l-2 border-primary-500 pl-3 space-y-0.5">
                      <div className="font-semibold text-neutral-900 dark:text-white">API Usage Executed</div>
                      <div className="text-neutral-500">gpt-4o completion request (2,450 tokens)</div>
                      <div className="text-[10px] text-neutral-400">Jul 24, 2026 3:26 PM</div>
                    </div>

                    <div className="border-l-2 border-emerald-500 pl-3 space-y-0.5">
                      <div className="font-semibold text-neutral-900 dark:text-white">Budget Cap Updated</div>
                      <div className="text-neutral-500">Cap set to $500.00 by {selectedKey.createdBy}</div>
                      <div className="text-[10px] text-neutral-400">Jul 22, 2026 6:30 PM</div>
                    </div>

                    <div className="border-l-2 border-blue-500 pl-3 space-y-0.5">
                      <div className="font-semibold text-neutral-900 dark:text-white">Security Policies Attached</div>
                      <div className="text-neutral-500">Rate Limiting & IP Whitelist assigned</div>
                      <div className="text-[10px] text-neutral-400">Jul 21, 2026 10:15 AM</div>
                    </div>

                    <div className="border-l-2 border-purple-500 pl-3 space-y-0.5">
                      <div className="font-semibold text-neutral-900 dark:text-white">Key Created</div>
                      <div className="text-neutral-500">Provisioned for {selectedKey.organization}</div>
                      <div className="text-[10px] text-neutral-400">{selectedKey.createdDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: CONFIGURATION TAB                                                  */}
            {/* ========================================================================= */}
            {detailTab === "configuration" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                {/* Models Card */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary-600" />
                    Model Access Configuration
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Allow All Models:</span>
                      <span className="font-semibold">{selectedKey.models.includes("All Models") ? "True (Unrestricted)" : "False (Restricted)"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Model Count:</span>
                      <span className="font-semibold">{selectedKey.models.length} Permitted</span>
                    </div>
                    <div>
                      <div className="text-neutral-500 mb-1.5">Selected Models:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedKey.models.map((m) => (
                          <span key={m} className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-medium text-neutral-800 dark:text-neutral-200">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Authorization Card */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    Authorization & Route Permissions
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Key Type:</span>
                      <span className="font-semibold text-primary-600">{selectedKey.keyType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Allowed Routes:</span>
                      <span className="font-mono font-semibold">/v1/chat/completions, /v1/embeddings</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Management Access:</span>
                      <span className="font-semibold text-neutral-600">Restricted</span>
                    </div>
                  </div>
                </div>

                {/* Permissions & Guardrails Card */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Guardrails & Security Policies
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedKey.guardrails.map((g) => (
                        <span key={g} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200/60">
                          {g}
                        </span>
                      ))}
                      {selectedKey.policies.map((p) => (
                        <span key={p} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium border border-blue-200/60">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Logging & Webhooks Card */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-600" />
                    Logging Integration & Webhooks
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Logging Provider:</span>
                      <span className="font-semibold">{selectedKey.loggingIntegration}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Callback URL:</span>
                      <span className="font-mono text-neutral-700 dark:text-neutral-300 truncate max-w-[200px]">{selectedKey.callbackUrl || "Not Configured"}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-neutral-500">Webhook Status:</span>
                      <span className="font-semibold text-emerald-600">Healthy (200 OK)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: USAGE TAB (CHARTS & RECENT CALLS)                                  */}
            {/* ========================================================================= */}
            {detailTab === "usage" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Usage Metrics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
                    <div className="text-xs text-neutral-400 mb-1">Current Spend</div>
                    <div className="text-xl font-bold font-mono text-neutral-900 dark:text-white">${selectedKey.currentSpend.toFixed(2)}</div>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
                    <div className="text-xs text-neutral-400 mb-1">Monthly Spend</div>
                    <div className="text-xl font-bold font-mono text-neutral-900 dark:text-white">$410.00</div>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
                    <div className="text-xs text-neutral-400 mb-1">Requests Today</div>
                    <div className="text-xl font-bold text-neutral-900 dark:text-white">14,250</div>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
                    <div className="text-xs text-neutral-400 mb-1">Total Requests</div>
                    <div className="text-xl font-bold text-neutral-900 dark:text-white">382,900</div>
                  </div>
                </div>

                {/* Usage Visual Breakdown Bars */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                    Daily Usage & Top Models Breakdown
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-500 mb-3">Model Usage Distribution</h4>
                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold">gpt-4o</span>
                            <span className="font-mono">65% (248,885 reqs)</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-600 rounded-full" style={{ width: "65%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold">claude-3-5-sonnet</span>
                            <span className="font-mono">35% (134,015 reqs)</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600 rounded-full" style={{ width: "35%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-neutral-500 mb-3">Weekly Spend ($) Breakdown</h4>
                      <div className="grid grid-cols-7 gap-2 text-center items-end h-28 pt-4">
                        {[{ day: "Mon", val: 32 }, { day: "Tue", val: 48 }, { day: "Wed", val: 65 }, { day: "Thu", val: 50 }, { day: "Fri", val: 82 }, { day: "Sat", val: 20 }, { day: "Sun", val: 15 }].map((d) => (
                          <div key={d.day} className="flex flex-col items-center gap-1">
                            <div className="w-full bg-primary-500/80 rounded-t" style={{ height: `${d.val}%` }} />
                            <span className="text-[10px] text-neutral-400">{d.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: POLICIES TAB                                                       */}
            {/* ========================================================================= */}
            {detailTab === "policies" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Applied Key Policies */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-blue-600" />
                      Applied Direct Key Policies
                    </h3>
                    <div className="space-y-2 text-xs">
                      {selectedKey.policies.map((p) => (
                        <div key={p} className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white">{p}</div>
                            <div className="text-[11px] text-neutral-400">Strictly enforced for {selectedKey.alias}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">ACTIVE</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inherited Organization & Team Policies */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary-600" />
                      Inherited Organization & Team Policies
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                        <div className="font-semibold text-neutral-900 dark:text-white">TLS 1.3 Strict Encryption</div>
                        <div className="text-[11px] text-neutral-400">Inherited from Organization: {selectedKey.organization}</div>
                      </div>
                      <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                        <div className="font-semibold text-neutral-900 dark:text-white">Max Budget Cap Enforcement</div>
                        <div className="text-[11px] text-neutral-400">Inherited from Team: {selectedKey.team}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 5: LOGS TAB                                                           */}
            {/* ========================================================================= */}
            {detailTab === "logs" && (
              <div className="space-y-4 animate-fadeIn">
                {/* Filters & Actions for Logs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={logsSearch}
                        onChange={(e) => setLogsSearch(e.target.value)}
                        placeholder="Search logs by IP, user..."
                        className="h-9 pl-8 pr-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg w-52"
                      />
                    </div>
                    <select
                      value={logsActionFilter}
                      onChange={(e) => setLogsActionFilter(e.target.value)}
                      className="h-9 px-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                    >
                      <option value="All">All Actions</option>
                      <option value="API Call">API Calls</option>
                      <option value="Budget">Budget Checks</option>
                      <option value="Key">Key Operations</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <IconButton icon={Download} label="Export" onClick={() => toast.success("Exporting logs CSV...")} />
                    <IconButton icon={RefreshCw} label="Refresh" onClick={() => toast.success("Logs refreshed")} />
                  </div>
                </div>

                {/* Audit Logs HB Table */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 font-semibold text-neutral-600 dark:text-neutral-400">
                          <th className="py-3 px-4">Date & Time</th>
                          <th className="py-3 px-4">User</th>
                          <th className="py-3 px-4">Action</th>
                          <th className="py-3 px-4">IP Address</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {filteredAuditLogs.map((l) => (
                          <tr key={l.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30">
                            <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">{l.date}</td>
                            <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">{l.user}</td>
                            <td className="py-3 px-4 font-semibold text-primary-600">{l.action}</td>
                            <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">{l.ip}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {l.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{l.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* Modals & Dialogs Remain Active */}
      {/* ... Create/Edit, Regenerate, Filter, Block, Reset Spend, Delete Modals ... */}
      {/* Restore Enterprise Create Virtual Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden my-auto">
            {/* Modal Sticky Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    {isEditMode ? "Edit Virtual Key" : "Create Virtual Key"}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                      Enterprise Config
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Create and configure a Virtual Key for secure AI Gateway access.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs custom-scrollbar">
              {/* SECTION 1 — BASIC INFORMATION */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Section 1 — Basic Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Virtual Key Name */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Virtual Key Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formAlias}
                      onChange={(e) => setFormAlias(e.target.value)}
                      placeholder="Enter Virtual Key Name (e.g. prod-ai-completions)"
                      maxLength={100}
                      className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                        formTouched && (!formAlias.trim() || isDuplicateName)
                          ? "border-rose-500 focus:ring-rose-500/20"
                          : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20"
                      }`}
                    />
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      {formAlias.trim() === "" && formTouched ? (
                        <span className="text-rose-500 font-medium">Virtual Key Name is required.</span>
                      ) : isDuplicateName ? (
                        <span className="text-rose-500 font-medium">A Virtual Key with this name already exists.</span>
                      ) : (
                        <span className="text-neutral-400">Must be unique across your organization.</span>
                      )}
                      <span className="text-neutral-400 font-mono">{formAlias.length}/100</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Description <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Describe the purpose, application scope, or target service for this key..."
                      maxLength={300}
                      rows={2}
                      className="w-full p-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                    />
                    <div className="text-right text-[11px] text-neutral-400 font-mono">
                      {formDescription.length}/300
                    </div>
                  </div>

                  {/* Owner (Searchable Dropdown) */}
                  <div className="space-y-1 relative owner-dropdown-container">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Owner <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowOwnerDropdown(!showOwnerDropdown)}
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white flex items-center justify-between hover:border-neutral-400 transition-colors"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        {formOwner}
                      </span>
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    </button>

                    {showOwnerDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 space-y-1 animate-fadeIn">
                        <div className="relative mb-1">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            value={ownerSearch}
                            onChange={(e) => setOwnerSearch(e.target.value)}
                            placeholder="Search owners..."
                            className="w-full h-8 pl-8 pr-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                          />
                        </div>
                        <div className="max-h-36 overflow-y-auto space-y-0.5">
                          {AVAILABLE_OWNERS.filter((o) =>
                            o.toLowerCase().includes(ownerSearch.toLowerCase())
                          ).map((ownerEmail) => (
                            <button
                              key={ownerEmail}
                              type="button"
                              onClick={() => {
                                setFormOwner(ownerEmail);
                                setShowOwnerDropdown(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md hover:bg-primary-50 dark:hover:bg-primary-950/50 flex items-center justify-between text-xs transition-colors ${
                                formOwner === ownerEmail ? "bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-semibold" : "text-neutral-700 dark:text-neutral-300"
                              }`}
                            >
                              <span>{ownerEmail}</span>
                              {formOwner === ownerEmail && <Check className="w-3.5 h-3.5 text-primary-600" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Team (Searchable Dropdown) */}
                  <div className="space-y-1 relative team-dropdown-container">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Team <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white flex items-center justify-between hover:border-neutral-400 transition-colors"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        {formTeam}
                      </span>
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    </button>

                    {showTeamDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 space-y-1 animate-fadeIn">
                        <div className="relative mb-1">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            value={teamSearch}
                            onChange={(e) => setTeamSearch(e.target.value)}
                            placeholder="Search teams..."
                            className="w-full h-8 pl-8 pr-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                          />
                        </div>
                        <div className="max-h-36 overflow-y-auto space-y-0.5">
                          {AVAILABLE_TEAMS.filter((t) =>
                            t.name.toLowerCase().includes(teamSearch.toLowerCase())
                          ).map((teamObj) => (
                            <button
                              key={teamObj.name}
                              type="button"
                              onClick={() => {
                                handleSelectTeam(teamObj.name);
                                setShowTeamDropdown(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md hover:bg-primary-50 dark:hover:bg-primary-950/50 flex items-center justify-between text-xs transition-colors ${
                                formTeam === teamObj.name ? "bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-semibold" : "text-neutral-700 dark:text-neutral-300"
                              }`}
                            >
                              <div>
                                <div>{teamObj.name}</div>
                                <div className="text-[10px] text-neutral-400">{teamObj.org}</div>
                              </div>
                              {formTeam === teamObj.name && <Check className="w-3.5 h-3.5 text-primary-600" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Organization (Read-Only) */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Organization <span className="text-neutral-400 font-normal">(Auto-Inherited from Team)</span>
                    </label>
                    <div className="h-10 px-3 bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                      {formOrg}
                      <span className="ml-auto text-[10px] font-normal px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-500 rounded">
                        Read Only
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2 — MODEL ACCESS */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                        Section 2 — Model Access
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Configure which AI models can be routed through this Virtual Key.
                      </p>
                    </div>
                  </div>

                  {/* All Models Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300">
                    <input
                      type="checkbox"
                      checked={allModelsSelected}
                      onChange={(e) => {
                        setAllModelsSelected(e.target.checked);
                        if (e.target.checked) {
                          setFormModels(AVAILABLE_MODELS.map((m) => m.id));
                        }
                      }}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      Support All Models
                    </span>
                  </label>
                </div>

                {/* Model Controls bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={modelSearchQuery}
                      onChange={(e) => setModelSearchQuery(e.target.value)}
                      placeholder="Search models by name or provider..."
                      className="w-full h-8 pl-8 pr-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormModels(AVAILABLE_MODELS.map((m) => m.id));
                        setAllModelsSelected(true);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 rounded-md transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormModels([]);
                        setAllModelsSelected(false);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-neutral-500 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-md transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Selected Model Chips Display */}
                <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2">
                  <div className="text-[11px] font-semibold text-neutral-500 flex items-center justify-between">
                    <span>Selected Models ({allModelsSelected ? "All Models" : formModels.length}):</span>
                    {formModels.length > 4 && !allModelsSelected && (
                      <span className="text-primary-600 font-medium">+{formModels.length - 4} More selected</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {allModelsSelected ? (
                      <span className="px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-semibold text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> All Models Enabled
                      </span>
                    ) : formModels.length === 0 ? (
                      <span className="text-neutral-400 italic text-xs">No models selected (defaults to GPT-4o)</span>
                    ) : (
                      formModels.slice(0, 5).map((mId) => {
                        const mObj = AVAILABLE_MODELS.find((m) => m.id === mId);
                        const label = mObj ? mObj.name : mId;
                        return (
                          <span
                            key={mId}
                            className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium text-xs flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-700"
                          >
                            {label}
                            <button
                              type="button"
                              onClick={() => {
                                setAllModelsSelected(false);
                                setFormModels(formModels.filter((id) => id !== mId));
                              }}
                              className="text-neutral-400 hover:text-rose-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })
                    )}
                    {!allModelsSelected && formModels.length > 5 && (
                      <span className="px-2.5 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold text-xs">
                        +{formModels.length - 5} More
                      </span>
                    )}
                  </div>
                </div>

                {/* Model Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {AVAILABLE_MODELS.filter(
                    (m) =>
                      m.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
                      m.provider.toLowerCase().includes(modelSearchQuery.toLowerCase())
                  ).map((mObj) => {
                    const isChecked = allModelsSelected || formModels.includes(mObj.id);
                    return (
                      <label
                        key={mObj.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? "bg-primary-50/50 dark:bg-primary-950/40 border-primary-300 dark:border-primary-800"
                            : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setAllModelsSelected(false);
                              if (formModels.includes(mObj.id)) {
                                setFormModels(formModels.filter((id) => id !== mObj.id));
                              } else {
                                setFormModels([...formModels, mObj.id]);
                              }
                            }}
                            className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white">
                              {mObj.name}
                            </div>
                            <div className="text-[10px] text-neutral-400">{mObj.provider}</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-medium">
                          {mObj.badge}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3 — BUDGET CONFIGURATION */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <DollarSign className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                      Section 3 — Budget Configuration
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Set maximum spend limits and automated reset schedules.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Maximum Budget */}
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Maximum Budget ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold">$</span>
                      <input
                        type="number"
                        min="0"
                        value={formMaxBudget}
                        onChange={(e) => setFormMaxBudget(e.target.value)}
                        placeholder="500"
                        className={`w-full h-10 pl-7 pr-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 ${
                          isBudgetInvalid ? "border-rose-500 focus:ring-rose-500/20" : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20"
                        }`}
                      />
                    </div>
                    {isBudgetInvalid ? (
                      <p className="text-rose-500 text-[11px]">Must be a non-negative number.</p>
                    ) : (
                      <p className="text-[11px] text-neutral-400">Enter 0 for unlimited hard budget cap.</p>
                    )}
                  </div>

                  {/* Soft Budget */}
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Soft Budget ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold">$</span>
                      <input
                        type="number"
                        min="0"
                        value={formSoftBudget}
                        onChange={(e) => setFormSoftBudget(e.target.value)}
                        placeholder="400"
                        className={`w-full h-10 pl-7 pr-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 ${
                          isSoftBudgetInvalid ? "border-rose-500 focus:ring-rose-500/20" : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20"
                        }`}
                      />
                    </div>
                    {isSoftBudgetInvalid ? (
                      <p className="text-rose-500 text-[11px]">Soft budget cannot exceed maximum budget.</p>
                    ) : (
                      <p className="text-[11px] text-neutral-400">Alert triggers at this spend threshold.</p>
                    )}
                  </div>

                  {/* Budget Reset Cycle */}
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Budget Reset Cycle
                    </label>
                    <select
                      value={formBudgetCycle}
                      onChange={(e) => setFormBudgetCycle(e.target.value)}
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Never">Never (One-Time Cap)</option>
                    </select>
                    <p className="text-[11px] text-neutral-400">Resets accrued spend counter.</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg flex items-center gap-2 text-amber-800 dark:text-amber-300 text-[11px]">
                  <HelpCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Soft budget alerts notify team owners via webhooks prior to API requests being hard-throttled at 100% cap.
                  </span>
                </div>
              </div>

              {/* SECTION 4 — RATE LIMITS */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <Activity className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                      Section 4 — Rate Limits
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Configure Tokens Per Minute (TPM) and Requests Per Minute (RPM).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* TPM Limit */}
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      TPM (Tokens Per Minute)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formTpmLimit}
                      onChange={(e) => setFormTpmLimit(e.target.value)}
                      placeholder="100000"
                      className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 ${
                        isTpmInvalid ? "border-rose-500 focus:ring-rose-500/20" : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20"
                      }`}
                    />
                    {isTpmInvalid ? (
                      <p className="text-rose-500 text-[11px]">Must be a positive value.</p>
                    ) : (
                      <p className="text-[11px] text-neutral-400">Default: 100,000 TPM limit.</p>
                    )}
                  </div>

                  {/* RPM Limit */}
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      RPM (Requests Per Minute)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formRpmLimit}
                      onChange={(e) => setFormRpmLimit(e.target.value)}
                      placeholder="1000"
                      className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 ${
                        isRpmInvalid ? "border-rose-500 focus:ring-rose-500/20" : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20"
                      }`}
                    />
                    {isRpmInvalid ? (
                      <p className="text-rose-500 text-[11px]">Must be a positive value.</p>
                    ) : (
                      <p className="text-[11px] text-neutral-400">Default: 1,000 RPM limit.</p>
                    )}
                  </div>

                  {/* Optional Model-specific limits */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Optional Model-Specific Overrides <span className="text-neutral-400 font-normal">(Advanced JSON/Key-Value)</span>
                    </label>
                    <input
                      type="text"
                      value={formModelSpecificLimits}
                      onChange={(e) => setFormModelSpecificLimits(e.target.value)}
                      placeholder="e.g. gpt-4o: 50k TPM, claude-3-5-sonnet: 20k TPM"
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5 — PERMISSIONS */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                      Section 5 — Permissions & Capabilities
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Toggle operational capabilities permitted for requests authenticated with this key.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: "apiAccess", label: "AI API Access", desc: "Allow proxying chat & embedding completions" },
                    { id: "modelAccess", label: "Model Access", desc: "Allow listing accessible model catalogs" },
                    { id: "spendTracking", label: "Spend Tracking", desc: "Log real-time token spend telemetry" },
                    { id: "logging", label: "Payload Logging", desc: "Ship audit logs to SIEM integration" },
                    { id: "teamResources", label: "Team Resources", desc: "Allow team members to share key" },
                  ].map((perm) => {
                    const isChecked = (formCapabilities as any)[perm.id];
                    return (
                      <label
                        key={perm.id}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          isChecked
                            ? "bg-white dark:bg-neutral-950 border-primary-300 dark:border-primary-800 shadow-2xs"
                            : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 opacity-75"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setFormCapabilities((prev) => ({ ...prev, [perm.id]: e.target.checked }))
                          }
                          className="w-4 h-4 mt-0.5 rounded text-primary-600 focus:ring-primary-500 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white">
                            {perm.label}
                          </div>
                          <div className="text-[10px] text-neutral-400 mt-0.5">{perm.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 6 — ADVANCED SETTINGS (COLLAPSED BY DEFAULT) */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="w-full px-4 py-3 bg-neutral-100/70 dark:bg-neutral-800/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-neutral-500" />
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">
                      Section 6 — Advanced Settings (Metadata, Expiration, Allowed IPs, Notes)
                    </span>
                  </div>
                  {showAdvancedSettings ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                {showAdvancedSettings && (
                  <div className="p-4 bg-neutral-50/30 dark:bg-neutral-900/30 space-y-4 animate-fadeIn border-t border-neutral-200 dark:border-neutral-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Metadata / Tags */}
                      <div className="space-y-1">
                        <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                          Metadata / Tags
                        </label>
                        <div className="relative">
                          <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            value={formTags}
                            onChange={(e) => setFormTags(e.target.value)}
                            placeholder="env:production, gateway:v1, team:ml"
                            className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs"
                          />
                        </div>
                        <p className="text-[10px] text-neutral-400">Comma-separated tag pairs.</p>
                      </div>

                      {/* Expiration Date */}
                      <div className="space-y-1">
                        <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                          Expiration Duration
                        </label>
                        <select
                          value={formExpiryDuration}
                          onChange={(e) => setFormExpiryDuration(e.target.value)}
                          className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium"
                        >
                          <option value="Never">Never (No expiration)</option>
                          <option value="30 Days">30 Days</option>
                          <option value="60 Days">60 Days</option>
                          <option value="90 Days">90 Days</option>
                          <option value="1 Year">1 Year</option>
                        </select>
                      </div>

                      {/* Allowed IPs */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                          Allowed IPs <span className="text-neutral-400 font-normal">(IP Whitelist / CIDR)</span>
                        </label>
                        <div className="relative">
                          <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            value={formAllowedIps}
                            onChange={(e) => setFormAllowedIps(e.target.value)}
                            placeholder="e.g. 192.168.1.1, 10.0.0.0/24 (Leave blank to allow all IPs)"
                            className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>

                      {/* Internal Notes */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                          Internal Notes
                        </label>
                        <textarea
                          value={formNotes}
                          onChange={(e) => setFormNotes(e.target.value)}
                          placeholder="Architectural or internal ticketing reference numbers..."
                          rows={2}
                          className="w-full p-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/80 dark:bg-neutral-900/80 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {isGenerating ? (
                  <button
                    disabled
                    className="px-5 py-2 text-xs font-semibold text-white bg-primary-600/80 rounded-lg flex items-center gap-2 cursor-not-allowed shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {isEditMode ? "Saving Changes..." : "Generating Virtual Key..."}
                  </button>
                ) : (
                  <PrimaryButton
                    onClick={handleSaveVirtualKey}
                    disabled={!isFormValid}
                    className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {isEditMode ? "Save Changes" : "Generate Virtual Key"}
                  </PrimaryButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate Key Modal */}
      {showRegenerateModal && selectedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-primary-600" />
              Regenerate Secret Key
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Regenerating will instantly revoke the existing secret key for <strong>{selectedKey.alias}</strong> and issue a new credential.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setShowRegenerateModal(false)} className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 rounded-lg">
                Cancel
              </button>
              <PrimaryButton onClick={handleRegenerateKeySubmit}>
                Regenerate
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Reset Spend Modal */}
      {showResetSpendModal && selectedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              Reset Usage & Spend
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              This action will reset the accumulated spend for Virtual Key <strong>"{selectedKey.alias}"</strong> back to <strong>$0.00</strong>.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowResetSpendModal(false)} className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Cancel
              </button>
              <button onClick={handleResetSpendSubmit} className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg">
                Reset Usage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Key Modal */}
      {showBlockModal && selectedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-amber-600 flex items-center gap-2">
              <Ban className="w-5 h-5" />
              {selectedKey.status === "Blocked" ? "Unblock Virtual Key" : "Block Virtual Key"}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {selectedKey.status === "Blocked"
                ? `Unblocking "${selectedKey.alias}" will immediately restore API access for this proxy key.`
                : `Blocking "${selectedKey.alias}" immediately prevents any API usage across all connected endpoints.`}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowBlockModal(false)} className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Cancel
              </button>
              <button onClick={handleToggleBlockSubmit} className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg">
                {selectedKey.status === "Blocked" ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Key Modal */}
      {showDeleteModal && selectedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-rose-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Delete Virtual Key
            </h3>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-800 dark:text-rose-300">
              <strong>Warning:</strong> Deleting <strong>"{selectedKey.alias}"</strong> cannot be undone.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Cancel
              </button>
              <button onClick={handleDeleteKeySubmit} className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg">
                Delete Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-600" />
                Filter Virtual Keys
              </h3>
              <button type="button" onClick={() => setShowFilterModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Near Limit">Near Limit</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Organization</label>
                <select
                  value={filterOrg}
                  onChange={(e) => setFilterOrg(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                >
                  <option value="All">All Organizations</option>
                  <option value="HB Enterprise">HB Enterprise</option>
                  <option value="Spine CloudIQ">Spine CloudIQ</option>
                  <option value="CyberShield Ltd">CyberShield Ltd</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Team</label>
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                >
                  <option value="All">All Teams</option>
                  <option value="AI Research">AI Research</option>
                  <option value="DevOps Core">DevOps Core</option>
                  <option value="SecOps Team">SecOps Team</option>
                  <option value="QA Testing">QA Testing</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Key Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                >
                  <option value="All">All Key Types</option>
                  <option value="AI APIs">AI APIs</option>
                  <option value="Management">Management</option>
                  <option value="Full Access">Full Access</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setFilterStatus("All");
                  setFilterOwner("All");
                  setFilterOrg("All");
                  setFilterTeam("All");
                  setFilterType("All");
                  setFilterModel("All");
                }}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                Clear All
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <PrimaryButton onClick={() => setShowFilterModal(false)}>
                  Apply Filters
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
