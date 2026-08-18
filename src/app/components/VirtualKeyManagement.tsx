import React, { useState, useMemo, useRef, useEffect } from "react";
import { MultiEmailInput } from "./TeamsManagement";
import VirtualKeySuccessModal from "./VirtualKeySuccessModal";
import VirtualKeyForm from "./VirtualKeyForm";
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
  User,
  UserPlus,
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
  "Finance Lead",
  "John Doe",
  "Alex Dev",
  "Sarah Lead",
  "hbadmin@yopmail.com",
  "superadmin@spinecloudiq.com",
];

const AVAILABLE_TEAMS = [
  { name: "AI Research", org: "HB Enterprise", defaultPolicies: ["Rate Limiting", "IP Whitelist"] },
  { name: "Engineering", org: "HB Enterprise", defaultPolicies: ["Rate Limiting"] },
  { name: "DevOps Core", org: "Spine CloudIQ", defaultPolicies: ["Cost Guard", "Geo Fence"] },
  { name: "Marketing", org: "HB Enterprise", defaultPolicies: ["Rate Limiting"] },
  { name: "Sales", org: "HB Enterprise", defaultPolicies: ["Rate Limiting"] },
  { name: "Finance", org: "HB Enterprise", defaultPolicies: ["Rate Limiting"] },
  { name: "DevOps", org: "HB Enterprise", defaultPolicies: ["Rate Limiting"] },
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
  const [viewState, setViewState] = useState<"list" | "detail" | "create" | "edit">("list");
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdSuccessKey, setCreatedSuccessKey] = useState<{ secretKey: string; alias: string } | null>(null);

  // Highlighted key ID after creation
  const [highlightedKeyId, setHighlightedKeyId] = useState<string | null>(null);

  // Form State
  const [ownershipType, setOwnershipType] = useState<"user" | "team">("user");
  const [initialOwnershipType, setInitialOwnershipType] = useState<"user" | "team">("user");
  const [showReassignConfirmModal, setShowReassignConfirmModal] = useState(false);

  // Dynamic lists for inline add actions
  const [availableOwnersList, setAvailableOwnersList] = useState<string[]>(AVAILABLE_OWNERS);
  const [availableTeamsList, setAvailableTeamsList] = useState(AVAILABLE_TEAMS);

  // Overlay Modals State
  const [showInviteUserModalOverlay, setShowInviteUserModalOverlay] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Internal User");

  const [showCreateTeamModalOverlay, setShowCreateTeamModalOverlay] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");

  const [formOwner, setFormOwner] = useState("Finance Lead");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);

  const [teamSearch, setTeamSearch] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  const [formOwnerType, setFormOwnerType] = useState<"You" | "Another User">("You");
  const [formOrg, setFormOrg] = useState("HB Enterprise");
  const [formTeam, setFormTeam] = useState("");

  const handleSwitchOwnershipType = (type: "user" | "team") => {
    setOwnershipType(type);
    if (type === "user") {
      setFormTeam("");
      if (!formOwner) {
        setFormOwner(availableOwnersList[0] || "Finance Lead");
      }
    } else {
      setFormOwner("");
      if (!formTeam) {
        setFormTeam(availableTeamsList[0]?.name || "AI Research");
      }
    }
  };
  const [formAlias, setFormAlias] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formModels, setFormModels] = useState<string[]>(["gpt-4o", "claude-3-5-sonnet"]);
  const [allModelsSelected, setAllModelsSelected] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [formKeyType, setFormKeyType] = useState<"AI APIs" | "Management" | "Full Access">("AI APIs");
  const [formMaxBudget, setFormMaxBudget] = useState("500");
  const [formSoftBudget, setFormSoftBudget] = useState("400");
  const [formBudgetCycle, setFormBudgetCycle] = useState("Lifetime");
  const [formAlertEmails, setFormAlertEmails] = useState<string[]>(["john@company.com"]);
  const [formTpmLimit, setFormTpmLimit] = useState("100000");
  const [formRpmLimit, setFormRpmLimit] = useState("1000");
  const [formExpiryDuration, setFormExpiryDuration] = useState("Never");
  const [formGracePeriod, setFormGracePeriod] = useState("7 Days");
  const [formPolicies, setFormPolicies] = useState<string[]>(["Rate Limiting", "IP Whitelist"]);
  const [formGuardrails, setFormGuardrails] = useState<string[]>(["PII Masking"]);
  const [formLogging, setFormLogging] = useState("Splunk Enterprise");
  const [formAutoRotation, setFormAutoRotation] = useState(true);
  const [formCallbackUrl, setFormCallbackUrl] = useState("https://api.company.com/webhooks/ai-audit");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // Detail View Tab
  const [detailTab, setDetailTab] = useState<"overview" | "configuration" | "usage" | "logs">("overview");

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

  const isOwnershipValid = useMemo(() => {
    if (ownershipType === "user") return formOwner.trim().length > 0;
    if (ownershipType === "team") return formTeam.trim().length > 0;
    return false;
  }, [ownershipType, formOwner, formTeam]);

  const isFormValid = useMemo(() => {
    return (
      formAlias.trim().length > 0 &&
      formAlias.length <= 100 &&
      !isDuplicateName &&
      isOwnershipValid &&
      !isBudgetInvalid &&
      !isSoftBudgetInvalid &&
      !isTpmInvalid &&
      !isRpmInvalid
    );
  }, [formAlias, isDuplicateName, isOwnershipValid, isBudgetInvalid, isSoftBudgetInvalid, isTpmInvalid, isRpmInvalid]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedKey(null);
    setShowCreateModal(false);
    setViewState("create");
  };

  const handleOpenEditModal = (keyItem: VirtualKey) => {
    setSelectedKey(keyItem);
    setIsEditMode(true);
    setShowCreateModal(false);
    setViewState("edit");
  };

  const handleSelectTeam = (teamName: string) => {
    setFormTeam(teamName);
    const foundTeam = availableTeamsList.find((t) => t.name === teamName);
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
      } else if (!isOwnershipValid) {
        toast.error(ownershipType === "user" ? "Please select an assigned user." : "Please select an assigned team.");
      } else {
        toast.error("Please resolve all validation errors before proceeding.");
      }
      return;
    }

    if (isEditMode && selectedKey && ownershipType !== initialOwnershipType) {
      setShowReassignConfirmModal(true);
      return;
    }

    executeSaveVirtualKey();
  };

  const executeSaveVirtualKey = () => {
    setIsGenerating(true);
    setShowReassignConfirmModal(false);

    setTimeout(() => {
      if (isEditMode && selectedKey) {
        setKeys((prev) =>
          prev.map((k) =>
            k.id === selectedKey.id
              ? {
                  ...k,
                  alias: formAlias.trim(),
                  description: formDescription.trim(),
                  owner: ownershipType === "user" ? formOwner : "",
                  team: ownershipType === "team" ? formTeam : "",
                  organization: formOrg,
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
        const p1 = Math.random().toString(36).substring(2, 10);
        const p2 = Math.random().toString(36).substring(2, 10);
        const p3 = Math.random().toString(36).substring(2, 10);
        const p4 = Math.random().toString(36).substring(2, 10);
        const plaintextKey = `sk-gl-${p1}${p2}${p3}${p4}`;

        const newKey: VirtualKey = {
          id: newId,
          keyId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          secretKeyMasked: `sk-gl-${p1}••••••••••••••••••••••••`,
          alias: formAlias.trim(),
          description: formDescription.trim(),
          owner: ownershipType === "user" ? formOwner : "",
          team: ownershipType === "team" ? formTeam : "",
          ownerId: ownershipType === "user" ? `usr-${Math.floor(100000 + Math.random() * 900000)}` : "",
          ownerType: "You",
          organization: "HB Enterprise",
          orgId: "org-57c860ac",
          keyType: formKeyType,
          models: allModelsSelected ? ["All Models"] : (formModels.length > 0 ? formModels : ["gpt-4o"]),
          maxBudget: parseFloat(formMaxBudget) || 500,
          currentSpend: 0,
          tpmLimit: parseInt(formTpmLimit) || 100000,
          rpmLimit: parseInt(formRpmLimit) || 1000,
          expiryDuration: formExpiryDuration,
          gracePeriod: formGracePeriod,
          policies: formPolicies,
          guardrails: formGuardrails,
          loggingIntegration: formLogging,
          autoRotation: formAutoRotation,
          callbackUrl: formCallbackUrl,
          status: "active",
          lastUsed: "Just now",
          createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          createdBy: "superadmin@spinecloudiq.com",
        };
        setKeys((prev) => [newKey, ...prev]);
        setHighlightedKeyId(newId);
        setTimeout(() => setHighlightedKeyId(null), 3000);

        // Open Virtual Key Creation Success Popup
        setCreatedSuccessKey({ secretKey: plaintextKey, alias: formAlias.trim() });
        setShowSuccessModal(true);
      }

      setIsGenerating(false);
      setShowCreateModal(false);
    }, 600);
  };

  const handleRegenerateKeySubmit = () => {
    if (!selectedKey) return;
    const p1 = Math.random().toString(36).substring(2, 10);
    const p2 = Math.random().toString(36).substring(2, 10);
    const p3 = Math.random().toString(36).substring(2, 10);
    const p4 = Math.random().toString(36).substring(2, 10);
    const plaintextKey = `sk-gl-${p1}${p2}${p3}${p4}`;
    const newKeyId = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    setKeys((prev) =>
      prev.map((k) => (k.id === selectedKey.id ? { ...k, keyId: newKeyId, secretKeyMasked: `sk-gl-${p1}••••••••••••••••••••••••`, lastUsed: "Just now" } : k))
    );
    setShowRegenerateModal(false);
    setCreatedSuccessKey({ secretKey: plaintextKey, alias: selectedKey.alias });
    setShowSuccessModal(true);
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

  if (viewState === "create") {
    return (
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <VirtualKeyForm
          mode="create"
          availableUsers={availableOwnersList.map((u, i) => ({ id: `u${i + 1}`, label: u }))}
          availableTeams={availableTeamsList.map((t, i) => ({ id: `t${i + 1}`, label: t.name }))}
          onBack={() => setViewState("list")}
          onSave={(newKeyData, generatedSecret) => {
            setKeys((prev) => [newKeyData, ...prev]);
            if (generatedSecret) {
              setCreatedSuccessKey({
                secretKey: generatedSecret,
                alias: newKeyData.alias,
              });
              setShowSuccessModal(true);
            }
            setHighlightedKeyId(newKeyData.id);
            setViewState("list");
            toast.success(`Virtual key "${newKeyData.alias}" created successfully!`);
          }}
        />
      </div>
    );
  }

  if (viewState === "edit" && selectedKey) {
    return (
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <VirtualKeyForm
          mode="edit"
          initialKey={selectedKey}
          availableUsers={availableOwnersList.map((u, i) => ({ id: `u${i + 1}`, label: u }))}
          availableTeams={availableTeamsList.map((t, i) => ({ id: `t${i + 1}`, label: t.name }))}
          onBack={() => setViewState("list")}
          onSave={(updatedKeyData) => {
            setKeys((prev) =>
              prev.map((k) => (k.id === updatedKeyData.id ? { ...k, ...updatedKeyData } : k))
            );
            setSelectedKey(updatedKeyData);
            setViewState("list");
            toast.success(`Virtual key "${updatedKeyData.alias}" updated successfully!`);
          }}
        />
      </div>
    );
  }

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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">Ownership Type</div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 min-w-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedKey.owner ? "bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800" : "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                    }`}>
                      {selectedKey.owner ? "User" : "Team"}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">
                    {selectedKey.owner ? "Assigned User" : "Assigned Team"}
                  </div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 min-w-0">
                    {selectedKey.owner ? (
                      <>
                        <User className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                        <span className="truncate" title={selectedKey.owner}>{selectedKey.owner}</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span className="truncate" title={selectedKey.team}>{selectedKey.team}</span>
                      </>
                    )}
                  </div>
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
                {(["overview", "configuration", "usage", "logs"] as const).map((tab) => (
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
              <div className="space-y-6 animate-fadeIn">
                {/* Virtual Key Information Card */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-primary-600" />
                    Virtual Key Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2">
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
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: CONFIGURATION TAB                                                  */}
            {/* ========================================================================= */}
            {detailTab === "configuration" && (
              <div className="animate-fadeIn">
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

      {/* Inline Overlay Modal: + Add New User */}
      {showInviteUserModalOverlay && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 my-auto animate-scaleUp text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Invite & Add User</h3>
                  <p className="text-[11px] text-neutral-500">Create user and auto-assign as key owner.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteUserModalOverlay(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
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
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Finance Lead"
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. finance.lead@fintech.com"
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">User Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white"
                >
                  <option value="Internal User">Internal User</option>
                  <option value="Organization Admin">Organization Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={() => setShowInviteUserModalOverlay(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                disabled={!newUserName.trim() || !newUserEmail.trim()}
                onClick={() => {
                  const addedUserStr = `${newUserName.trim()} (${newUserEmail.trim()})`;
                  setAvailableOwnersList((prev) => [addedUserStr, ...prev]);
                  setFormOwner(addedUserStr);
                  setShowInviteUserModalOverlay(false);
                  setNewUserName("");
                  setNewUserEmail("");
                  toast.success(`User "${newUserName.trim()}" created and auto-assigned as key owner!`);
                }}
              >
                Create & Auto-Select
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Inline Overlay Modal: + Add New Team */}
      {showCreateTeamModalOverlay && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 my-auto animate-scaleUp text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Create New Team</h3>
                  <p className="text-[11px] text-neutral-500">Create team and auto-assign as key owner.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateTeamModalOverlay(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Team Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Engineering, Sales, Marketing"
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Description</label>
                <textarea
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="Describe team function or project scope..."
                  rows={2}
                  className="w-full p-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={() => setShowCreateTeamModalOverlay(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                disabled={!newTeamName.trim()}
                onClick={() => {
                  const teamObj = {
                    name: newTeamName.trim(),
                    org: "HB Enterprise",
                    defaultPolicies: ["Rate Limiting"],
                  };
                  setAvailableTeamsList((prev) => [teamObj, ...prev]);
                  handleSelectTeam(teamObj.name);
                  setShowCreateTeamModalOverlay(false);
                  setNewTeamName("");
                  setNewTeamDesc("");
                  toast.success(`Team "${teamObj.name}" created and auto-assigned as key owner!`);
                }}
              >
                Create & Auto-Select
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Ownership Reassignment */}
      {showReassignConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 my-auto text-xs animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Confirm Ownership Reassignment</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  You are changing the ownership type of this Virtual Key.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl space-y-1">
              <p className="font-semibold text-xs flex items-center gap-1.5 text-amber-950 dark:text-amber-100">
                <span>Ownership Transfer Warning</span>
              </p>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                Changing ownership will reassign this Virtual Key from the current owner (<strong>{initialOwnershipType === "user" ? selectedKey?.owner : selectedKey?.team}</strong>) to the selected owner (<strong>{ownershipType === "user" ? formOwner : formTeam}</strong>). Existing permissions will follow the new assignment.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={() => setShowReassignConfirmModal(false)}>
                Cancel
              </SecondaryButton>
              <button
                type="button"
                onClick={executeSaveVirtualKey}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-2xs"
              >
                Confirm Reassignment & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Key Creation / Regeneration Success Modal */}
      <VirtualKeySuccessModal
        isOpen={showSuccessModal}
        secretKey={createdSuccessKey?.secretKey || null}
        keyAlias={createdSuccessKey?.alias}
        onClose={() => {
          setShowSuccessModal(false);
          setCreatedSuccessKey(null);
        }}
      />

    </div>
  );
}
