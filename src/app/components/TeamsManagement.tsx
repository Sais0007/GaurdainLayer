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
  Building2, 
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
  CheckSquare
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

export interface TeamItem {
  id: string;
  teamId: string;
  name: string;
  description: string;
  organization: string;
  orgId: string;
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
  isPublic?: boolean;
}

export interface ApiPermissionItem {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  description: string;
  access: boolean;
  category: "Virtual Keys" | "Users" | "Teams" | "Policies" | "Models" | "Organizations" | "Logging" | "Guardrails";
}

const mockPermissions: ApiPermissionItem[] = [
  { id: "perm-1", method: "POST", endpoint: "/v1/keys/generate", description: "Generate new virtual key for team", access: true, category: "Virtual Keys" },
  { id: "perm-2", method: "GET", endpoint: "/v1/keys/info", description: "Query key metadata and spend stats", access: true, category: "Virtual Keys" },
  { id: "perm-3", method: "DELETE", endpoint: "/v1/keys/revoke", description: "Revoke active team virtual key", access: false, category: "Virtual Keys" },
  { id: "perm-4", method: "POST", endpoint: "/v1/team/member/invite", description: "Invite new team user", access: true, category: "Users" },
  { id: "perm-5", method: "DELETE", endpoint: "/v1/team/member/remove", description: "Remove member from team", access: false, category: "Users" },
  { id: "perm-6", method: "GET", endpoint: "/v1/chat/completions", description: "Invoke LLM proxy chat endpoint", access: true, category: "Models" },
  { id: "perm-7", method: "GET", endpoint: "/v1/embeddings", description: "Invoke text embedding endpoints", access: true, category: "Models" },
  { id: "perm-8", method: "POST", endpoint: "/v1/policies/attach", description: "Attach policy to team router", access: false, category: "Policies" },
  { id: "perm-9", method: "GET", endpoint: "/v1/logging/audits", description: "Stream team audit logs", access: true, category: "Logging" },
  { id: "perm-10", method: "POST", endpoint: "/v1/guardrails/eval", description: "Evaluate prompt safety guardrails", access: true, category: "Guardrails" }
];

// Initial Mock Teams Data
const mockTeamsData: TeamItem[] = [
  {
    id: "tm-101",
    teamId: "team-a904128",
    name: "AI Research",
    description: "Core AI research team developing production models and fine-tuning completions.",
    organization: "HB Enterprise",
    orgId: "org-57c860ac",
    owner: "John Doe",
    ownerEmail: "john.doe@company.com",
    membersCount: 14,
    virtualKeysCount: 8,
    accessGroupsCount: 3,
    currentSpend: 1420.50,
    maxBudget: 5000.00,
    tpmLimit: 500000,
    rpmLimit: 5000,
    budgetDuration: "Monthly",
    softBudgetPercent: 80,
    status: "Active",
    createdDate: "Jul 10, 2026",
    createdBy: "System Provisioner",
    updatedDate: "Jul 24, 2026",
    allowedModels: ["gpt-4o", "claude-3-5-sonnet", "gemini-1-5-pro", "llama-3-70b"],
    membersList: [
      { id: "m-1", name: "John Doe", email: "john.doe@company.com", userId: "usr-904128", role: "Team Admin", models: ["gpt-4o", "claude-3-5-sonnet"], budget: 2000, currentSpend: 420.50, status: "Active", lastActive: "Just now", addedDate: "Jul 10, 2026" },
      { id: "m-2", name: "Alex Rivera", email: "alex.dev@hb.com", userId: "usr-881029", role: "Developer", models: ["gpt-4o"], budget: 1000, currentSpend: 680.00, status: "Active", lastActive: "2 hrs ago", addedDate: "Jul 12, 2026" },
      { id: "m-3", name: "Sarah Chen", email: "sarah.c@hb.com", userId: "usr-772910", role: "Developer", models: ["claude-3-5-sonnet"], budget: 800, currentSpend: 320.00, status: "Active", lastActive: "1 day ago", addedDate: "Jul 15, 2026" }
    ],
    keysList: [
      { id: "vk-101", alias: "prod-ai-service", keyId: "512360370354...", owner: "john.doe@company.com", keyType: "AI APIs", models: ["gpt-4o", "claude-3-5-sonnet"], budget: 500.00, currentSpend: 142.50, status: "Active", createdOn: "Jul 20, 2026", lastUsed: "Jul 24, 2026 3:28 PM" },
      { id: "vk-102", alias: "research-eval-key", keyId: "8f9a2b3c4d5e...", owner: "superadmin@spinecloudiq.com", keyType: "AI APIs", models: ["All Models"], budget: 1200.00, currentSpend: 1150.00, status: "Near Limit", createdOn: "Jul 18, 2026", lastUsed: "Jul 24, 2026 5:10 PM" }
    ],
    policies: ["Rate Limiting", "IP Whitelist", "Budget Cap"],
    guardrails: ["PII Masking", "Prompt Injection Shield"],
    vectorStores: ["Pinecone Primary", "Qdrant Sandbox"],
    searchTools: ["Tavily AI Search", "Google Serper"],
    mcpServers: ["GitHub MCP", "Database Inspector"],
    agents: ["Customer Care Bot", "Data Summarizer"],
    loggingIntegration: "Splunk Enterprise",
    callbackUrl: "https://api.company.com/webhooks/teams-audit",
    isPublic: false
  },
  {
    id: "tm-102",
    teamId: "team-b110293",
    name: "DevOps Core",
    description: "Infrastructure and automated CI/CD pipeline proxy integrations.",
    organization: "Spine CloudIQ",
    orgId: "org-8f9a2b3c",
    owner: "Super Admin",
    ownerEmail: "superadmin@spinecloudiq.com",
    membersCount: 8,
    virtualKeysCount: 4,
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
    allowedModels: ["All Models"],
    membersList: [
      { id: "m-4", name: "Super Admin", email: "superadmin@spinecloudiq.com", userId: "usr-110293", role: "Team Admin", models: ["All Models"], budget: 5000, currentSpend: 4680.00, status: "Active", lastActive: "10 mins ago", addedDate: "Jul 01, 2026" }
    ],
    keysList: [
      { id: "vk-102", alias: "devops-auto-deploy", keyId: "8f9a2b3c4d5e...", owner: "superadmin@spinecloudiq.com", keyType: "AI APIs", models: ["All Models"], budget: 1200.00, currentSpend: 1150.00, status: "Near Limit", createdOn: "Jul 18, 2026", lastUsed: "Jul 24, 2026 5:10 PM" }
    ],
    policies: ["Cost Guard", "Geo Fence"],
    guardrails: ["Content Safety"],
    vectorStores: ["Weaviate Cloud"],
    searchTools: ["Google Serper"],
    mcpServers: ["Kubernetes Operator MCP"],
    agents: ["Deployment Assistant"],
    loggingIntegration: "Datadog APM",
    callbackUrl: "https://devops.spinecloudiq.com/hooks/teams",
    isPublic: true
  }
];

export default function TeamsManagement() {
  const [teams, setTeams] = useState<TeamItem[]>(mockTeamsData);
  const [viewState, setViewState] = useState<"list" | "detail">("list");
  const [selectedTeam, setSelectedTeam] = useState<TeamItem | null>(null);

  // Detail Sub-Tab State
  const [detailTab, setDetailTab] = useState<"overview" | "my-users" | "virtual-keys" | "members" | "member-permissions" | "settings">("overview");

  // Inline Settings Edit Mode (Inside Settings Tab Only)
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  // Sub-Tab Search Queries
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [searchKeyQuery, setSearchKeyQuery] = useState("");
  const [searchMemberQuery, setSearchMemberQuery] = useState("");
  const [searchPermQuery, setSearchPermQuery] = useState("");

  // Summary Cards Visibility State
  const [showSummary, setShowSummary] = useState(true);

  // Filter Drawer State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filterOrg, setFilterOrg] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterModel, setFilterModel] = useState("All");

  // Export Popup Dialog State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel">("csv");
  const [exportRange, setExportRange] = useState<"current" | "all" | "selected">("current");

  // Selection & Sorting State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof TeamItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Action Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeKeyMenuId, setActiveKeyMenuId] = useState<string | null>(null);
  const [activeUserMenuId, setActiveUserMenuId] = useState<string | null>(null);
  const [showMoreDetailMenu, setShowMoreDetailMenu] = useState(false);

  // Column Visibility Panel State
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const columnAnchorRef = useRef<HTMLDivElement>(null);

  const allColumns: ColumnConfig[] = [
    { key: "name", label: "Team Name" },
    { key: "organization", label: "Organization" },
    { key: "members", label: "Members" },
    { key: "spend", label: "Spend / Budget" },
    { key: "createdDate", label: "Created Date" },
    { key: "status", label: "Status" },
  ];

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    organization: true,
    members: true,
    spend: true,
    createdDate: true,
    status: true,
  });

  const toggleColumn = (key: string) => {
    if (key === "name" || key === "status") return;
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);

  // Edit Member Modal State
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editMemberRole, setEditMemberRole] = useState<TeamMember["role"]>("Developer");
  const [editMemberBudget, setEditMemberBudget] = useState("1000");

  // Create Virtual Key Form State
  const [keyFormAlias, setKeyFormAlias] = useState("");
  const [keyFormType, setKeyFormType] = useState<"AI APIs" | "Management" | "Full Access">("AI APIs");
  const [keyFormBudget, setKeyFormBudget] = useState("500");

  // Extended Create/Edit Team Form State
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formOrg, setFormOrg] = useState("HB Enterprise");
  const [formAllowedModels, setFormAllowedModels] = useState<string[]>(["gpt-4o", "claude-3-5-sonnet"]);
  const [allModelsSelected, setAllModelsSelected] = useState(false);
  const [formMaxBudget, setFormMaxBudget] = useState("5000");
  const [formSoftBudget, setFormSoftBudget] = useState("4000");
  const [formResetCycle, setFormResetCycle] = useState<"Monthly" | "Quarterly" | "Annual" | "Infinite">("Monthly");
  const [formTpmLimit, setFormTpmLimit] = useState("500000");
  const [formRpmLimit, setFormRpmLimit] = useState("5000");
  const [formDefaultRole, setFormDefaultRole] = useState<"Team Admin" | "Developer" | "Viewer">("Developer");
  const [formDefaultPermissions, setFormDefaultPermissions] = useState<string[]>([
    "Create Virtual Keys",
    "Access Models",
  ]);
  const [formVectorStores, setFormVectorStores] = useState<string[]>([]);
  const [formMcpServers, setFormMcpServers] = useState<string[]>([]);
  const [formMetadata, setFormMetadata] = useState("{}");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highlightedTeamId, setHighlightedTeamId] = useState<string | null>(null);

  // Permissions Table State
  const [permissionsList, setPermissionsList] = useState<ApiPermissionItem[]>(mockPermissions);

  // Copy helper
  const handleCopyText = (text: string, label: string = "Copied successfully!") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  // Outside click handler for action menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".action-menu-container")) {
        setActiveMenuId(null);
        setActiveKeyMenuId(null);
        setActiveUserMenuId(null);
        setShowMoreDetailMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Filtered & Sorted Teams
  const filteredTeams = useMemo(() => {
    let result = teams.filter((item) => {
      const matchesSearch = 
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teamId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organization.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOrg = filterOrg === "All" || item.organization === filterOrg;
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;
      const matchesModel =
        filterModel === "All" ||
        item.allowedModels.includes("All Proxy Models") ||
        item.allowedModels.includes(filterModel);

      return matchesSearch && matchesOrg && matchesStatus && matchesModel;
    });

    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [teams, searchQuery, filterOrg, filterStatus, filterModel, sortField, sortDirection]);

  // Paginated Teams
  const paginatedTeams = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTeams.slice(start, start + pageSize);
  }, [filteredTeams, currentPage, pageSize]);

  const handleSort = (field: keyof TeamItem) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIndicator = (field: keyof TeamItem) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === "asc" 
      ? <ArrowUp className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
      : <ArrowDown className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />;
  };

  // Summary Statistics
  const kpiStats = useMemo(() => {
    const totalTeams = teams.length;
    const activeTeams = teams.filter((t) => t.status === "Active").length;
    const orgsSet = new Set(teams.map((t) => t.organization));
    const allModelsSet = new Set(teams.flatMap((t) => t.allowedModels));
    const totalBudgetAssigned = teams.reduce((acc, curr) => acc + curr.maxBudget, 0);

    return [
      { id: "total", label: "Total Teams", value: totalTeams, subValue: "All provisioned teams", icon: Users },
      { id: "active", label: "Active Teams", value: activeTeams, subValue: "Operational teams", icon: ShieldCheck },
      { id: "orgs", label: "Organizations", value: orgsSet.size, subValue: "Connected orgs", icon: Building2 },
      { id: "models", label: "Configured Models", value: allModelsSet.size, subValue: "Distinct LLM models", icon: Cpu },
      { id: "budget", label: "Budget Assigned", value: `$${totalBudgetAssigned.toLocaleString()}`, subValue: "Total allocated budget", icon: DollarSign },
    ];
  }, [teams]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(paginatedTeams.map((t) => t.id)));
    else setSelectedIds(new Set());
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };

  const isDuplicateTeamName = useMemo(() => {
    if (!formName.trim()) return false;
    return teams.some((t) => t.name.toLowerCase().trim() === formName.toLowerCase().trim());
  }, [formName, teams]);

  const isCreateTeamFormValid = useMemo(() => {
    return formName.trim().length > 0 && formName.length <= 100 && !isDuplicateTeamName && !!formOrg;
  }, [formName, isDuplicateTeamName, formOrg]);

  const handleOpenCreateModal = () => {
    setFormName("");
    setFormDescription("");
    setFormOrg("HB Enterprise");
    setFormAllowedModels(["gpt-4o", "claude-3-5-sonnet"]);
    setAllModelsSelected(false);
    setFormMaxBudget("5000");
    setFormSoftBudget("4000");
    setFormResetCycle("Monthly");
    setFormTpmLimit("500000");
    setFormRpmLimit("5000");
    setFormDefaultRole("Developer");
    setFormDefaultPermissions(["Create Virtual Keys", "Access Models"]);
    setFormVectorStores([]);
    setFormMcpServers([]);
    setFormMetadata("{}");
    setShowAdvancedSettings(false);
    setFormTouched(false);
    setIsSubmitting(false);
    setShowCreateModal(true);
  };

  // Enterprise Create Team Submit
  const handleCreateTeamSubmit = () => {
    setFormTouched(true);
    if (!isCreateTeamFormValid) {
      if (isDuplicateTeamName) {
        toast.error("A Team with this name already exists.");
      } else {
        toast.error("Please fill in all mandatory fields.");
      }
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newTeamId = `tm-${Date.now()}`;
      const newTeam: TeamItem = {
        id: newTeamId,
        teamId: `team-${Array.from({ length: 7 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        name: formName.trim(),
        description: formDescription.trim(),
        organization: formOrg,
        orgId: "org-57c860ac",
        owner: "John Doe",
        ownerEmail: "john.doe@company.com",
        membersCount: 1,
        virtualKeysCount: 0,
        accessGroupsCount: 1,
        currentSpend: 0,
        maxBudget: parseFloat(formMaxBudget) || 5000,
        tpmLimit: parseInt(formTpmLimit) || 500000,
        rpmLimit: parseInt(formRpmLimit) || 5000,
        budgetDuration: formResetCycle,
        softBudgetPercent: Math.round(((parseFloat(formSoftBudget) || 4000) / (parseFloat(formMaxBudget) || 5000)) * 100),
        status: "Active",
        createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        createdBy: "superadmin@spinecloudiq.com",
        updatedDate: "Just now",
        allowedModels: allModelsSelected ? ["All Proxy Models"] : (formAllowedModels.length > 0 ? formAllowedModels : ["gpt-4o"]),
        membersList: [{ id: "m-100", name: "John Doe", email: "john.doe@company.com", userId: "usr-904128", role: "Team Admin", models: formAllowedModels, budget: parseFloat(formMaxBudget) || 5000, currentSpend: 0, status: "Active", lastActive: "Just now", addedDate: "Just now" }],
        keysList: [],
        policies: ["Rate Limiting"],
        guardrails: ["PII Masking"],
        vectorStores: formVectorStores,
        searchTools: [],
        mcpServers: formMcpServers,
        agents: [],
        loggingIntegration: "Default HB LogStream",
        isPublic: false
      };

      setTeams((prev) => [newTeam, ...prev]);
      toast.success(`Team "${formName.trim()}" created successfully!`);
      setHighlightedTeamId(newTeamId);
      setIsSubmitting(false);
      setShowCreateModal(false);

      setTimeout(() => setHighlightedTeamId(null), 4000);
    }, 600);
  };

  // Create Key Submit
  const handleCreateKeySubmit = () => {
    if (!keyFormAlias.trim()) {
      toast.error("Please enter a Key Alias");
      return;
    }
    if (!selectedTeam) return;

    const newKey: TeamVirtualKeyRef = {
      id: `vk-${Date.now()}`,
      alias: keyFormAlias,
      keyId: `${Math.random().toString(36).substring(2, 12)}...`,
      owner: selectedTeam.ownerEmail,
      keyType: keyFormType,
      models: selectedTeam.allowedModels,
      budget: parseFloat(keyFormBudget) || 500,
      currentSpend: 0,
      status: "Active",
      createdOn: "Just now",
      lastUsed: "Never"
    };

    const updatedKeys = [newKey, ...selectedTeam.keysList];
    const updatedTeam = { ...selectedTeam, keysList: updatedKeys, virtualKeysCount: updatedKeys.length };

    setSelectedTeam(updatedTeam);
    setTeams((prev) => prev.map((t) => (t.id === selectedTeam.id ? updatedTeam : t)));

    toast.success("Virtual Key Created");
    setShowCreateKeyModal(false);
    setKeyFormAlias("");
  };

  // Save Member Settings Submit (Fix 4)
  const handleSaveMemberSubmit = () => {
    if (!editingMember || !selectedTeam) return;

    const updatedMembers = selectedTeam.membersList.map((m) => {
      if (m.id === editingMember.id) {
        return {
          ...m,
          role: editMemberRole,
          budget: parseFloat(editMemberBudget) || m.budget,
        };
      }
      return m;
    });

    const updatedTeam = { ...selectedTeam, membersList: updatedMembers };
    setSelectedTeam(updatedTeam);
    setTeams((prev) => prev.map((t) => (t.id === selectedTeam.id ? updatedTeam : t)));

    toast.success(`Member settings for ${editingMember.name} updated.`);
    setShowEditMemberModal(false);
    setEditingMember(null);
  };

  // Export Confirmation
  const handleConfirmExport = () => {
    setShowExportModal(false);
    toast.success(`Exported ${exportRange === "selected" ? selectedIds.size : filteredTeams.length} teams to ${exportFormat.toUpperCase()}!`);
  };

  // Delete Team Submit
  const handleDeleteTeamSubmit = () => {
    if (!selectedTeam) return;
    setTeams((prev) => prev.filter((t) => t.id !== selectedTeam.id));
    toast.success(`Team "${selectedTeam.name}" deleted successfully.`);
    setShowDeleteModal(false);
    if (viewState === "detail") setViewState("list");
  };

  // Status Badge Helper
  const getStatusBadgeStyle = (status: TeamItem["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Near Budget":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Suspended":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "Inactive":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700";
    }
  };

  const renderStatusBadge = (status: TeamItem["status"]) => (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadgeStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );

  const getMethodBadgeStyle = (method: ApiPermissionItem["method"]) => {
    switch (method) {
      case "GET": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "POST": return "bg-blue-50 text-blue-700 border-blue-200";
      case "PUT": return "bg-amber-50 text-amber-700 border-amber-200";
      case "DELETE": return "bg-rose-50 text-rose-700 border-rose-200";
      case "PATCH": return "bg-purple-50 text-purple-700 border-purple-200";
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">

      {/* ========================================================================= */}
      {/* VIEW 1: MASTER TEAMS LISTING                                              */}
      {/* ========================================================================= */}
      {viewState === "list" ? (
        <>
          <PageHeader
            title="Teams"
            breadcrumbs={[
              { label: "Site Map", href: "#" },
              { label: "Access Control", href: "#" },
              { label: "Teams", current: true },
            ]}
          >
            <SearchBar
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              placeholder="Search by Team Name, Team ID or Organization..."
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
                  anchorRef={columnAnchorRef}
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
              title="Export Teams Data"
            />

            <IconButton
              icon={RefreshCw}
              label="Refresh"
              onClick={() => toast.success("Refreshed Teams listing data")}
              title="Refresh Table Data"
            />

            <IconButton
              icon={showSummary ? EyeOff : BarChart3}
              label={showSummary ? "Hide Summary" : "Show Summary"}
              onClick={() => setShowSummary(!showSummary)}
              title={showSummary ? "Collapse KPI Summary Cards" : "Expand KPI Summary Cards"}
            />

            <PrimaryButton icon={Plus} onClick={handleOpenCreateModal}>
              Create Team
            </PrimaryButton>
          </PageHeader>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 -mt-4">
            Manage teams, members and their access to AI models and budgets.
          </p>

          {showSummary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 transition-all duration-300 animate-fadeIn">
              {kpiStats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={stat.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{stat.label}</span>
                      <IconComponent className="w-4 h-4 text-primary-600 dark:text-primary-400 opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">{stat.value}</div>
                    <div className="text-[11px] text-neutral-400 dark:text-neutral-500">{stat.subValue}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Master Listing Table */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50/80 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold text-xs">
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === paginatedTeams.length && paginatedTeams.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>

                    {visibleColumns.name && (
                      <th onClick={() => handleSort("name")} className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span>Team Name</span>
                          {renderSortIndicator("name")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.organization && (
                      <th onClick={() => handleSort("organization")} className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span>Organization</span>
                          {renderSortIndicator("organization")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.members && <th className="py-3 px-4">Members & Access</th>}

                    {visibleColumns.spend && (
                      <th onClick={() => handleSort("currentSpend")} className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span>Spend / Budget</span>
                          {renderSortIndicator("currentSpend")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.createdDate && (
                      <th onClick={() => handleSort("createdDate")} className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span>Created Date</span>
                          {renderSortIndicator("createdDate")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.status && (
                      <th onClick={() => handleSort("status")} className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span>Status</span>
                          {renderSortIndicator("status")}
                        </div>
                      </th>
                    )}

                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-neutral-800 dark:text-neutral-200">
                  {paginatedTeams.map((item) => {
                    const isSelected = selectedIds.has(item.id);
                    const isMenuOpen = activeMenuId === item.id;
                    const isUnlimited = item.maxBudget === 0;
                    const spendPercent = isUnlimited ? 0 : Math.min(100, Math.round((item.currentSpend / item.maxBudget) * 100));

                    return (
                      <tr key={item.id} className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors ${isSelected ? "bg-primary-50/40 dark:bg-primary-950/20" : ""}`}>
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                          />
                        </td>

                        {visibleColumns.name && (
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <button
                                onClick={() => {
                                  setSelectedTeam(item);
                                  setDetailTab("overview");
                                  setViewState("detail");
                                }}
                                className="font-bold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 hover:underline transition-colors text-left block"
                              >
                                {item.name}
                              </button>
                              <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                                <span>{item.teamId}</span>
                                <button type="button" onClick={() => handleCopyText(item.teamId, "Team ID copied!")} className="hover:text-primary-600 transition-colors p-0.5" title="Copy Team ID">
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </td>
                        )}

                        {visibleColumns.organization && <td className="py-3.5 px-4 font-medium text-neutral-800 dark:text-neutral-200">{item.organization}</td>}

                        {visibleColumns.members && (
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span onClick={() => { setSelectedTeam(item); setDetailTab("my-users"); setViewState("detail"); }} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[11px] cursor-pointer hover:bg-blue-100 border border-blue-200/60">
                                {item.membersCount} Users
                              </span>
                              <span onClick={() => { setSelectedTeam(item); setDetailTab("virtual-keys"); setViewState("detail"); }} className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium text-[11px] cursor-pointer hover:bg-amber-100 border border-amber-200/60">
                                {item.virtualKeysCount} Keys
                              </span>
                              <span onClick={() => { setSelectedTeam(item); setDetailTab("overview"); setViewState("detail"); }} className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-medium text-[11px] cursor-pointer hover:bg-purple-100 border border-purple-200/60">
                                {item.accessGroupsCount} Groups
                              </span>
                            </div>
                          </td>
                        )}

                        {visibleColumns.spend && (
                          <td className="py-3.5 px-4 max-w-[170px]">
                            <div className="space-y-1">
                              <div className="font-mono font-semibold text-neutral-900 dark:text-white">
                                ${item.currentSpend.toFixed(0)} <span className="text-neutral-400 font-normal">/ {isUnlimited ? "Unlimited" : `$${item.maxBudget.toFixed(0)}`}</span>
                              </div>
                              {!isUnlimited && (
                                <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${spendPercent > 85 ? "bg-rose-500" : spendPercent > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                                    style={{ width: `${spendPercent}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                        )}

                        {visibleColumns.createdDate && <td className="py-3.5 px-4 text-neutral-500">{item.createdDate}</td>}
                        {visibleColumns.status && <td className="py-3.5 px-4">{renderStatusBadge(item.status)}</td>}

                        <td className="py-3.5 px-4 text-right relative action-menu-container">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(isMenuOpen ? null : item.id);
                            }}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-4 top-10 z-30 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1.5 text-left text-xs animate-fadeIn">
                              <button onClick={() => { setActiveMenuId(null); setSelectedTeam(item); setDetailTab("overview"); setViewState("detail"); }} className="w-full px-3 py-2 hover:bg-neutral-50 flex items-center gap-2">
                                <Eye className="w-3.5 h-3.5 text-neutral-500" />
                                <span>View</span>
                              </button>
                              <button onClick={() => { setActiveMenuId(null); setSelectedTeam(item); setDetailTab("settings"); setIsEditingSettings(true); setViewState("detail"); }} className="w-full px-3 py-2 hover:bg-neutral-50 flex items-center gap-2">
                                <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                                <span>Edit Settings</span>
                              </button>
                              <button onClick={() => { setActiveMenuId(null); setSelectedTeam(item); setShowDeleteModal(true); }} className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium">
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredTeams.length / pageSize) || 1}
                totalItems={filteredTeams.length}
                itemsPerPage={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
                onItemsPerPageChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              />
            </div>
          </div>
        </>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: COMPLETE TEAM DETAILS WORKSPACE & ALL 6 SUB-TABS                  */
        /* ========================================================================= */
        selectedTeam && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Breadcrumb Header Shell */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewState("list")}
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Teams
              </button>

              <div className="text-xs text-neutral-400">
                Site Map &gt; Access Control &gt; Teams &gt; <span className="text-neutral-700 dark:text-neutral-300 font-medium">View Team</span>
              </div>
            </div>

            {/* Team Summary Banner Card Shell */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{selectedTeam.name}</h2>
                    {renderStatusBadge(selectedTeam.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 font-mono">
                    <div className="flex items-center gap-1">
                      <span>ID: {selectedTeam.teamId}</span>
                      <button type="button" onClick={() => handleCopyText(selectedTeam.teamId, "Team ID copied!")} className="p-0.5 text-neutral-400 hover:text-primary-600" title="Copy Team ID">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span>•</span>
                    <span>Org: {selectedTeam.organization}</span>
                    <span>•</span>
                    <span>Created: {selectedTeam.createdDate} by {selectedTeam.createdBy}</span>
                  </div>
                </div>

                {/* Top Right Actions */}
                <div className="flex items-center gap-2 relative action-menu-container">
                  <button
                    type="button"
                    onClick={() => setShowMoreDetailMenu(!showMoreDetailMenu)}
                    className="p-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Team Actions Menu"
                  >
                    <span>More Actions</span>
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showMoreDetailMenu && (
                    <div className="absolute right-0 top-12 z-30 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl py-1.5 text-xs">
                      <button onClick={() => { setShowMoreDetailMenu(false); toast.success("Audit Log query generated."); }} className="w-full px-3 py-2 text-left hover:bg-neutral-50 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-neutral-500" />
                        <span>View Audit Logs</span>
                      </button>
                      <button onClick={() => { setShowMoreDetailMenu(false); toast.success(`Team "${selectedTeam.name} (Copy)" cloned.`); }} className="w-full px-3 py-2 text-left hover:bg-neutral-50 flex items-center gap-2">
                        <CopyPlus className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Duplicate Team</span>
                      </button>
                      <button onClick={() => { setShowMoreDetailMenu(false); toast.success(`Team "${selectedTeam.name}" archived.`); }} className="w-full px-3 py-2 text-left hover:bg-neutral-50 text-amber-600 flex items-center gap-2 font-medium">
                        <Archive className="w-3.5 h-3.5" />
                        <span>Archive Team</span>
                      </button>
                      <button onClick={() => { setShowMoreDetailMenu(false); toast.warning(`Team "${selectedTeam.name}" deactivated.`); }} className="w-full px-3 py-2 text-left hover:bg-neutral-50 text-amber-600 flex items-center gap-2 font-medium">
                        <Ban className="w-3.5 h-3.5" />
                        <span>Deactivate Team</span>
                      </button>
                      <hr className="my-1 border-neutral-100 dark:border-neutral-800" />
                      <button onClick={() => { setShowMoreDetailMenu(false); setShowDeleteModal(true); }} className="w-full px-3 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium">
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Team</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Shared Horizontal Sub-Tabs Bar */}
              <div className="border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex gap-6 text-xs font-semibold overflow-x-auto">
                  {(["overview", "my-users", "virtual-keys", "members", "member-permissions", "settings"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setDetailTab(t);
                        if (t !== "settings") setIsEditingSettings(false);
                      }}
                      className={`py-3 border-b-2 transition-colors capitalize whitespace-nowrap ${
                        detailTab === t
                          ? "border-primary-600 text-primary-600 dark:text-primary-400 font-bold"
                          : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                      }`}
                    >
                      {t.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* TAB 1: OVERVIEW */}
              {detailTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2 animate-fadeIn text-xs">
                  <div className="bg-neutral-50/70 dark:bg-neutral-800/40 border rounded-xl p-5 space-y-3">
                    <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" /> Budget Summary
                    </h4>
                    <div className="text-2xl font-bold font-mono">${selectedTeam.currentSpend.toFixed(2)}</div>
                    <div className="text-neutral-400 text-[11px]">Allocated: ${selectedTeam.maxBudget.toFixed(2)}</div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (selectedTeam.currentSpend / selectedTeam.maxBudget) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="bg-neutral-50/70 dark:bg-neutral-800/40 border rounded-xl p-5 space-y-3">
                    <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" /> Rate Limits
                    </h4>
                    <div className="grid grid-cols-2 gap-3 font-mono font-bold text-lg">
                      <div><span className="text-neutral-400 block text-[11px] font-sans">TPM</span>{selectedTeam.tpmLimit.toLocaleString()}</div>
                      <div><span className="text-neutral-400 block text-[11px] font-sans">RPM</span>{selectedTeam.rpmLimit.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="bg-neutral-50/70 dark:bg-neutral-800/40 border rounded-xl p-5 space-y-3">
                    <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-600" /> Assigned Models ({selectedTeam.allowedModels.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTeam.allowedModels.map((m) => (
                        <span key={m} className="px-2.5 py-1 rounded bg-purple-100 text-purple-800 font-mono text-[11px] font-semibold">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MY USERS TAB (FIXED ROW ACTIONS MENU PER SCREENSHOT 1) */}
              {detailTab === "my-users" && (
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <div className="flex items-center justify-between gap-3">
                    <SearchBar value={searchUserQuery} onChange={setSearchUserQuery} placeholder="Search team users..." />
                    <PrimaryButton icon={UserPlus} onClick={() => setShowInviteModal(true)}>
                      Invite User
                    </PrimaryButton>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b text-neutral-600 dark:text-neutral-400 font-semibold">
                        <tr>
                          <th className="py-3 px-4">User Name</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Last Login</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {selectedTeam.membersList.map((m) => {
                          const isUserMenuOpen = activeUserMenuId === m.id;
                          return (
                            <tr key={m.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                              <td className="py-3 px-4 font-bold flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs">
                                  {m.name.charAt(0)}
                                </div>
                                {m.name}
                              </td>
                              <td className="py-3 px-4 text-neutral-500">{m.email}</td>
                              <td className="py-3 px-4 font-semibold text-primary-600">{m.role}</td>
                              <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border">{m.status}</span></td>
                              <td className="py-3 px-4 text-neutral-500">{m.lastActive}</td>
                              
                              {/* Row Action Menu for My Users per Screenshot 1 */}
                              <td className="py-3 px-4 text-right relative action-menu-container">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveUserMenuId(isUserMenuOpen ? null : m.id);
                                  }}
                                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                  title="Actions"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {isUserMenuOpen && (
                                  <div className="absolute right-4 top-10 z-50 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl py-1.5 text-left text-xs animate-fadeIn">
                                    <button onClick={() => { setActiveUserMenuId(null); toast.info(`User: ${m.name} (${m.email})`); }} className="w-full px-3 py-2 hover:bg-neutral-50 flex items-center gap-2">
                                      <Eye className="w-3.5 h-3.5 text-neutral-500" />
                                      <span>View User</span>
                                    </button>
                                    <button onClick={() => { setActiveUserMenuId(null); setEditingMember(m); setEditMemberRole(m.role); setEditMemberBudget(m.budget.toString()); setShowEditMemberModal(true); }} className="w-full px-3 py-2 hover:bg-neutral-50 flex items-center gap-2">
                                      <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                                      <span>Edit Role</span>
                                    </button>
                                    <button onClick={() => { setActiveUserMenuId(null); toast.warning(`User "${m.name}" deactivated.`); }} className="w-full px-3 py-2 hover:bg-amber-50 text-amber-600 flex items-center gap-2 font-medium">
                                      <Ban className="w-3.5 h-3.5" />
                                      <span>Deactivate</span>
                                    </button>
                                    <hr className="my-1 border-neutral-100 dark:border-neutral-800" />
                                    <button onClick={() => { setActiveUserMenuId(null); toast.success(`User "${m.name}" removed from team.`); }} className="w-full px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium">
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Remove from Team</span>
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: VIRTUAL KEYS TAB (FIXED FLOATING DROPDOWN DESIGN PER SCREENSHOT 2) */}
              {detailTab === "virtual-keys" && (
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <div className="flex items-center justify-between gap-3">
                    <SearchBar value={searchKeyQuery} onChange={setSearchKeyQuery} placeholder="Search team virtual keys..." />
                    <PrimaryButton icon={KeyRound} onClick={() => setShowCreateKeyModal(true)}>
                      Create New Key
                    </PrimaryButton>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b text-neutral-600 dark:text-neutral-400 font-semibold">
                        <tr>
                          <th className="py-3 px-4">Key Alias</th>
                          <th className="py-3 px-4">Key ID</th>
                          <th className="py-3 px-4">Owner</th>
                          <th className="py-3 px-4">Key Type</th>
                          <th className="py-3 px-4">Spend</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {selectedTeam.keysList.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-neutral-400 space-y-2">
                              <KeyRound className="w-10 h-10 mx-auto text-neutral-300" />
                              <div className="font-bold">No Virtual Keys Configured</div>
                              <p className="text-xs">Create a new key to allow API access for this team.</p>
                              <PrimaryButton icon={KeyRound} onClick={() => setShowCreateKeyModal(true)}>
                                Create New Key
                              </PrimaryButton>
                            </td>
                          </tr>
                        ) : (
                          selectedTeam.keysList.map((k) => {
                            const isKeyMenuOpen = activeKeyMenuId === k.id;
                            return (
                              <tr key={k.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                                <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{k.alias}</td>
                                <td className="py-3 px-4 font-mono text-neutral-500">
                                  <div className="flex items-center gap-1">
                                    <span>{k.keyId}</span>
                                    <button type="button" onClick={() => handleCopyText(k.keyId, "Key ID copied!")} className="p-0.5 hover:text-primary-600">
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-neutral-500">{k.owner}</td>
                                <td className="py-3 px-4 font-medium">{k.keyType}</td>
                                <td className="py-3 px-4 font-mono font-semibold">${k.currentSpend.toFixed(2)} / ${k.budget.toFixed(2)}</td>
                                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border">{k.status}</span></td>
                                
                                {/* Fixed Clean Floating Row Action Menu per Screenshot 2 */}
                                <td className="py-3 px-4 text-right relative action-menu-container">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveKeyMenuId(isKeyMenuOpen ? null : k.id);
                                    }}
                                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  {isKeyMenuOpen && (
                                    <div className="absolute right-4 top-10 z-50 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl py-1.5 text-left text-xs animate-fadeIn">
                                      <button onClick={() => { setActiveKeyMenuId(null); handleCopyText(k.keyId, "Virtual Key details copied!"); }} className="w-full px-3 py-2 hover:bg-neutral-50 flex items-center gap-2">
                                        <Eye className="w-3.5 h-3.5 text-neutral-500" />
                                        <span>View Key</span>
                                      </button>
                                      <button onClick={() => { setActiveKeyMenuId(null); toast.success(`Key "${k.alias}" updated.`); }} className="w-full px-3 py-2 hover:bg-neutral-50 flex items-center gap-2">
                                        <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                                        <span>Edit Key</span>
                                      </button>
                                      <button onClick={() => { setActiveKeyMenuId(null); toast.success(`Virtual Key "${k.alias}" Regenerated`); }} className="w-full px-3 py-2 hover:bg-neutral-50 text-blue-600 flex items-center gap-2 font-medium">
                                        <RotateCw className="w-3.5 h-3.5" />
                                        <span>Regenerate Key</span>
                                      </button>
                                      <button onClick={() => { setActiveKeyMenuId(null); toast.warning(`Virtual Key "${k.alias}" Disabled`); }} className="w-full px-3 py-2 hover:bg-amber-50 text-amber-600 flex items-center gap-2 font-medium">
                                        <Ban className="w-3.5 h-3.5" />
                                        <span>Disable Key</span>
                                      </button>
                                      <hr className="my-1 border-neutral-100 dark:border-neutral-800" />
                                      <button onClick={() => { setActiveKeyMenuId(null); toast.success(`Virtual Key "${k.alias}" Deleted`); }} className="w-full px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium">
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
                </div>
              )}

              {/* TAB 4: MEMBERS TAB (FIXED EDIT ACTION WIRED TO EDIT MEMBER MODAL PER SCREENSHOT 3) */}
              {detailTab === "members" && (
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <div className="flex items-center justify-between gap-3">
                    <SearchBar value={searchMemberQuery} onChange={setSearchMemberQuery} placeholder="Search members..." />
                    <PrimaryButton icon={UserPlus} onClick={() => setShowAddMemberModal(true)}>
                      Add Member
                    </PrimaryButton>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b text-neutral-600 dark:text-neutral-400 font-semibold">
                        <tr>
                          <th className="py-3 px-4">User</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">Current Spend</th>
                          <th className="py-3 px-4">Budget</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {selectedTeam.membersList.map((m) => (
                          <tr key={m.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                            <td className="py-3 px-4 font-bold">{m.name}</td>
                            <td className="py-3 px-4 text-neutral-500">{m.email}</td>
                            <td className="py-3 px-4 font-semibold text-primary-600">{m.role}</td>
                            <td className="py-3 px-4 font-mono font-semibold">${m.currentSpend.toFixed(2)}</td>
                            <td className="py-3 px-4 font-mono text-neutral-500">${m.budget.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMember(m);
                                  setEditMemberRole(m.role);
                                  setEditMemberBudget(m.budget.toString());
                                  setShowEditMemberModal(true);
                                }}
                                className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-primary-600 transition-colors"
                                title="Edit Member Settings"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: MEMBER PERMISSIONS TAB (ALLOW ACCESS MOVED TO 1ST COLUMN PER TEXT PROMPT & SCREENSHOT 4) */}
              {detailTab === "member-permissions" && (
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <div className="flex items-center justify-between gap-3">
                    <SearchBar value={searchPermQuery} onChange={setSearchPermQuery} placeholder="Search endpoint permissions..." />
                    <div className="flex gap-2">
                      <button onClick={() => toast.success("Enabled selected permissions")} className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 font-semibold rounded-lg text-xs">
                        Enable Selected
                      </button>
                      <button onClick={() => toast.warning("Disabled selected permissions")} className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 font-semibold rounded-lg text-xs">
                        Disable Selected
                      </button>
                    </div>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b text-neutral-600 dark:text-neutral-400 font-semibold">
                        <tr>
                          {/* Allow Access is now 1st Column per user request */}
                          <th className="py-3 px-4 text-left w-32">Allow Access</th>
                          <th className="py-3 px-4">Method</th>
                          <th className="py-3 px-4">Endpoint</th>
                          <th className="py-3 px-4">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {permissionsList.map((p) => (
                          <tr key={p.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                            {/* Allow Access Checkbox 1st Column */}
                            <td className="py-3 px-4 text-left">
                              <input
                                type="checkbox"
                                checked={p.access}
                                onChange={(e) => {
                                  setPermissionsList((prev) => prev.map((x) => (x.id === p.id ? { ...x, access: e.target.checked } : x)));
                                  toast.success(`Permission for ${p.endpoint} updated.`);
                                }}
                                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] border ${getMethodBadgeStyle(p.method)}`}>
                                {p.method}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-medium">{p.endpoint}</td>
                            <td className="py-3 px-4 text-neutral-500">{p.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: SETTINGS TAB */}
              {detailTab === "settings" && (
                <div className="space-y-6 pt-2 animate-fadeIn text-xs">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <SettingsIcon className="w-5 h-5 text-primary-600" />
                      Team Configuration Settings
                    </h3>
                    <PrimaryButton
                      icon={isEditingSettings ? Save : Edit3}
                      onClick={() => {
                        if (isEditingSettings) {
                          setIsEditingSettings(false);
                          toast.success("Team Settings Updated");
                        } else {
                          setIsEditingSettings(true);
                        }
                      }}
                    >
                      {isEditingSettings ? "Save Settings" : "Edit Settings"}
                    </PrimaryButton>
                  </div>

                  {/* 10 Enterprise Accordion Cards */}
                  <div className="space-y-4">
                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50/50 space-y-3">
                      <h4 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider">1. General Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-neutral-500 mb-1 font-semibold">Team Name</label>
                          {isEditingSettings ? (
                            <input type="text" defaultValue={selectedTeam.name} className="w-full h-9 px-3 border rounded-lg bg-white" />
                          ) : (
                            <div className="font-bold text-sm text-neutral-900 dark:text-white">{selectedTeam.name}</div>
                          )}
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1 font-semibold">Organization</label>
                          {isEditingSettings ? (
                            <select defaultValue={selectedTeam.organization} className="w-full h-9 px-3 border rounded-lg bg-white">
                              <option value="HB Enterprise">HB Enterprise</option>
                              <option value="Spine CloudIQ">Spine CloudIQ</option>
                            </select>
                          ) : (
                            <div className="font-bold text-sm text-neutral-900 dark:text-white">{selectedTeam.organization}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50/50 space-y-3">
                      <h4 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider">2. Budget & Quota Thresholds</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-neutral-500 mb-1 font-semibold">Max Budget ($)</label>
                          {isEditingSettings ? (
                            <input type="number" defaultValue={selectedTeam.maxBudget} className="w-full h-9 px-3 border rounded-lg bg-white font-mono" />
                          ) : (
                            <div className="font-mono font-bold text-sm text-neutral-900 dark:text-white">${selectedTeam.maxBudget.toFixed(2)}</div>
                          )}
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1 font-semibold">Budget Reset Cycle</label>
                          {isEditingSettings ? (
                            <select defaultValue={selectedTeam.budgetDuration} className="w-full h-9 px-3 border rounded-lg bg-white">
                              <option value="Monthly">Monthly</option>
                              <option value="Quarterly">Quarterly</option>
                            </select>
                          ) : (
                            <div className="font-medium text-sm text-neutral-900 dark:text-white">{selectedTeam.budgetDuration}</div>
                          )}
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1 font-semibold">Soft Budget Warning (%)</label>
                          {isEditingSettings ? (
                            <input type="number" defaultValue={selectedTeam.softBudgetPercent} className="w-full h-9 px-3 border rounded-lg bg-white font-mono" />
                          ) : (
                            <div className="font-mono font-bold text-sm text-neutral-900 dark:text-white">{selectedTeam.softBudgetPercent}%</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50/50 space-y-3">
                      <h4 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider">3. Allowed Models & Aliases</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTeam.allowedModels.map((m) => (
                          <span key={m} className="px-2.5 py-1 rounded bg-purple-100 text-purple-800 font-mono text-[11px] font-semibold">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {isEditingSettings && (
                    <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl flex items-center justify-between animate-fadeIn">
                      <span className="font-semibold text-primary-900">You are currently editing Team Settings</span>
                      <div className="flex gap-2">
                        <button onClick={() => setIsEditingSettings(false)} className="px-3 py-1.5 bg-white border font-semibold rounded-lg">Cancel</button>
                        <PrimaryButton onClick={() => { setIsEditingSettings(false); toast.success("Team Settings Updated"); }}>Save Changes</PrimaryButton>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* EDIT MEMBER MODAL (Fix for Screenshot 3) */}
      {showEditMemberModal && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary-600" /> Edit Member Settings
              </h3>
              <button onClick={() => setShowEditMemberModal(false)}><X className="w-5 h-5 text-neutral-400" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-neutral-500 font-semibold mb-0.5">Member Name & Email</label>
                <div className="font-bold text-neutral-900 dark:text-white">{editingMember.name} ({editingMember.email})</div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Role *</label>
                <select
                  value={editMemberRole}
                  onChange={(e: any) => setEditMemberRole(e.target.value)}
                  className="w-full h-10 px-3 border rounded-lg bg-white dark:bg-neutral-900"
                >
                  <option value="Team Admin">Team Admin</option>
                  <option value="Developer">Developer</option>
                  <option value="Viewer">Viewer</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Budget Override ($)</label>
                <input
                  type="number"
                  value={editMemberBudget}
                  onChange={(e) => setEditMemberBudget(e.target.value)}
                  className="w-full h-10 px-3 border rounded-lg font-mono"
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowEditMemberModal(false)} className="px-4 py-2 font-semibold text-neutral-600">
                Cancel
              </button>
              <PrimaryButton onClick={handleSaveMemberSubmit}>
                Save Member Settings
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* CREATE VIRTUAL KEY MODAL */}
      {showCreateKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-600" /> Create Virtual Key
              </h3>
              <button onClick={() => setShowCreateKeyModal(false)}><X className="w-5 h-5 text-neutral-400" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Key Alias *</label>
                <input
                  type="text"
                  value={keyFormAlias}
                  onChange={(e) => setKeyFormAlias(e.target.value)}
                  placeholder="e.g. prod-service-key"
                  className="w-full h-10 px-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Key Type</label>
                <select
                  value={keyFormType}
                  onChange={(e: any) => setKeyFormType(e.target.value)}
                  className="w-full h-10 px-3 border rounded-lg"
                >
                  <option value="AI APIs">AI APIs</option>
                  <option value="Management">Management</option>
                  <option value="Full Access">Full Access</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Max Budget ($)</label>
                <input
                  type="number"
                  value={keyFormBudget}
                  onChange={(e) => setKeyFormBudget(e.target.value)}
                  className="w-full h-10 px-3 border rounded-lg font-mono"
                  placeholder="500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowCreateKeyModal(false)} className="px-4 py-2 font-semibold text-neutral-600">
                Cancel
              </button>
              <PrimaryButton onClick={handleCreateKeySubmit}>
                Create Key
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* INVITE USER MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold flex items-center gap-2"><UserPlus className="w-5 h-5 text-primary-600" /> Invite User to Team</h3>
            <div>
              <label className="block font-semibold mb-1">Email or User ID *</label>
              <input type="text" placeholder="e.g. user@company.com" className="w-full h-10 px-3 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Role *</label>
              <select className="w-full h-10 px-3 border rounded-lg">
                <option value="Developer">Developer</option>
                <option value="Viewer">Viewer</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 font-semibold text-neutral-600">Cancel</button>
              <PrimaryButton onClick={() => { setShowInviteModal(false); toast.success("Member Added"); }}>Invite User</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold flex items-center gap-2"><Users className="w-5 h-5 text-primary-600" /> Add Team Member</h3>
            <div>
              <label className="block font-semibold mb-1">User Lookup *</label>
              <input type="text" placeholder="Search user by name or email..." className="w-full h-10 px-3 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Budget Override ($)</label>
              <input type="number" placeholder="1000" className="w-full h-10 px-3 border rounded-lg font-mono" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddMemberModal(false)} className="px-4 py-2 font-semibold text-neutral-600">Cancel</button>
              <PrimaryButton onClick={() => { setShowAddMemberModal(false); toast.success("Member Added"); }}>Add Member</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT POPUP MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-primary-600" />
                Export Teams Data
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Export Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setExportFormat("csv")} className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-2 ${exportFormat === "csv" ? "bg-primary-50 text-primary-700 border-primary-300" : "bg-neutral-50 text-neutral-700"}`}>
                    <FileText className="w-4 h-4" /> CSV Format
                  </button>
                  <button type="button" onClick={() => setExportFormat("excel")} className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-2 ${exportFormat === "excel" ? "bg-primary-50 text-primary-700 border-primary-300" : "bg-neutral-50 text-neutral-700"}`}>
                    <FileSpreadsheet className="w-4 h-4" /> Excel (.xlsx)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowExportModal(false)} className="px-3 py-1.5 font-semibold text-neutral-600">Cancel</button>
              <PrimaryButton icon={Download} onClick={handleConfirmExport}>Export Data</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* 8-SECTION ENTERPRISE CREATE TEAM MODAL (950-1000px Width, Centered, Sticky Footer) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[85vh] overflow-hidden my-auto">
            {/* Modal Sticky Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 text-primary-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Create Team
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Create a new team and configure its default access, models, rate limits, and permissions.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable 8 Sections) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs custom-scrollbar">
              {/* SECTION 1 — BASIC INFORMATION */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <Building2 className="w-4 h-4 text-primary-600" />
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Section 1 — Basic Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Team Name */}
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Team Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Core Engineering & AI Lab"
                      className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-semibold focus:outline-none ${
                        formTouched && isDuplicateTeamName
                          ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    />
                    {isDuplicateTeamName && (
                      <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        A team with this name already exists in the system.
                      </p>
                    )}
                  </div>

                  {/* Organization Selection */}
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Organization <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formOrg}
                      onChange={(e) => setFormOrg(e.target.value)}
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold"
                    >
                      <option value="HB Enterprise">HB Enterprise</option>
                      <option value="Spine CloudIQ">Spine CloudIQ</option>
                      <option value="CyberShield Ltd">CyberShield Ltd</option>
                      <option value="FinTech Solutions">FinTech Solutions</option>
                      <option value="HealthCare AI">HealthCare AI</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="space-y-1 md:col-span-2">
                    <div className="flex justify-between items-center">
                      <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                        Description (Optional)
                      </label>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {formDescription.length}/300
                      </span>
                    </div>
                    <textarea
                      maxLength={300}
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Brief description of the team's operational scope, project responsibilities, and access permissions..."
                      className="w-full p-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2 — MODEL ACCESS */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                      Section 2 — Model Access & Proxy Routing
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllModelsSelected(!allModelsSelected)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                      allModelsSelected
                        ? "bg-purple-600 text-white"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300"
                    }`}
                  >
                    {allModelsSelected ? "All Proxy Models Permitted" : "Allow All Models"}
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-neutral-500">
                    Select models allowed for this team's Virtual Keys:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "gpt-4o",
                      "claude-3-5-sonnet",
                      "gemini-1-5-pro",
                      "llama-3-70b",
                      "codex-mini-latest",
                      "mistral-large",
                    ].map((m) => {
                      const isSelected = formAllowedModels.includes(m) || allModelsSelected;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            if (allModelsSelected) setAllModelsSelected(false);
                            setFormAllowedModels((prev) =>
                              prev.includes(m) ? prev.filter((id) => id !== m) : [...prev, m]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 font-semibold"
                              : "bg-white dark:bg-neutral-950 border-neutral-200 text-neutral-600"
                          }`}
                        >
                          <span>{m}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 3 — BUDGET CONFIGURATION */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Section 3 — Budget Configuration ($ USD)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Maximum Budget ($)
                    </label>
                    <input
                      type="number"
                      value={formMaxBudget}
                      onChange={(e) => setFormMaxBudget(e.target.value)}
                      placeholder="5000"
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-mono font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Soft Budget Warning ($)
                    </label>
                    <input
                      type="number"
                      value={formSoftBudget}
                      onChange={(e) => setFormSoftBudget(e.target.value)}
                      placeholder="4000"
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-mono font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Budget Reset Cycle
                    </label>
                    <select
                      value={formResetCycle}
                      onChange={(e) => setFormResetCycle(e.target.value as any)}
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annual">Annual</option>
                      <option value="Infinite">Infinite (Never)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4 — RATE LIMITS (TPM / RPM) */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Section 4 — Rate Limits (TPM / RPM)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Tokens Per Minute (TPM)
                    </label>
                    <input
                      type="number"
                      value={formTpmLimit}
                      onChange={(e) => setFormTpmLimit(e.target.value)}
                      placeholder="500000"
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-mono font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Requests Per Minute (RPM)
                    </label>
                    <input
                      type="number"
                      value={formRpmLimit}
                      onChange={(e) => setFormRpmLimit(e.target.value)}
                      placeholder="5000"
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-mono font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5 — DEFAULT MEMBER CONFIGURATION */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Section 5 — Default Member Configuration
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Default Member Role
                    </label>
                    <select
                      value={formDefaultRole}
                      onChange={(e) => setFormDefaultRole(e.target.value as any)}
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold"
                    >
                      <option value="Developer">Developer</option>
                      <option value="Team Admin">Team Admin</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Default Member Permissions
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "Create Virtual Keys",
                        "Manage Team Members",
                        "Manage Budgets",
                        "View Reports",
                        "Access Models",
                      ].map((perm) => {
                        const checked = formDefaultPermissions.includes(perm);
                        return (
                          <label key={perm} className="flex items-center gap-2 p-2 bg-white dark:bg-neutral-950 border rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                setFormDefaultPermissions((prev) =>
                                  e.target.checked ? [...prev, perm] : prev.filter((p) => p !== perm)
                                );
                              }}
                              className="w-4 h-4 text-primary-600 rounded"
                            />
                            <span className="font-medium text-neutral-800 dark:text-neutral-200">{perm}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6 — OBJECT PERMISSIONS */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Section 6 — Object Permissions & Resources
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Vector Stores
                    </label>
                    <div className="flex flex-wrap gap-2 p-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg min-h-[44px]">
                      {["vector-store-prod-01", "knowledge-base-hb"].map((vs) => {
                        const checked = formVectorStores.includes(vs);
                        return (
                          <button
                            key={vs}
                            type="button"
                            onClick={() =>
                              setFormVectorStores((prev) =>
                                prev.includes(vs) ? prev.filter((x) => x !== vs) : [...prev, vs]
                              )
                            }
                            className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold flex items-center gap-1 ${
                              checked ? "bg-indigo-100 text-indigo-800 border border-indigo-300" : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            <span>{vs}</span>
                            {checked && <Check className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      MCP Servers
                    </label>
                    <div className="flex flex-wrap gap-2 p-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg min-h-[44px]">
                      {["mcp-auth-gateway", "mcp-db-connector"].map((mcp) => {
                        const checked = formMcpServers.includes(mcp);
                        return (
                          <button
                            key={mcp}
                            type="button"
                            onClick={() =>
                              setFormMcpServers((prev) =>
                                prev.includes(mcp) ? prev.filter((x) => x !== mcp) : [...prev, mcp]
                              )
                            }
                            className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold flex items-center gap-1 ${
                              checked ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            <span>{mcp}</span>
                            {checked && <Check className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 7 — METADATA */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <FileText className="w-4 h-4 text-neutral-500" />
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Section 7 — Custom Metadata (JSON)
                  </h4>
                </div>
                <textarea
                  rows={2}
                  value={formMetadata}
                  onChange={(e) => setFormMetadata(e.target.value)}
                  placeholder="{}"
                  className="w-full p-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-[11px] resize-none"
                />
              </div>

              {/* SECTION 8 — ADVANCED SETTINGS ACCORDION */}
              <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="w-full p-4 bg-neutral-100/60 dark:bg-neutral-800/60 hover:bg-neutral-200/60 font-bold text-left flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <SettingsIcon className="w-4 h-4 text-neutral-500" />
                    Section 8 — Advanced Settings & Reserved Configurations
                  </span>
                  {showAdvancedSettings ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {showAdvancedSettings && (
                  <div className="p-4 bg-white dark:bg-neutral-900 space-y-3 border-t">
                    <p className="text-neutral-500 text-[11px]">
                      Advanced fallback policies, custom proxy headers, and reserved team parameters.
                    </p>
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border font-mono text-[11px]">
                      proxy_pass: "https://gateway.spinecloudiq.com/v1/teams"
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/80 dark:bg-neutral-900/80">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>

              <PrimaryButton
                onClick={handleCreateTeamSubmit}
                disabled={!isCreateTeamFormValid || isSubmitting}
              >
                {isSubmitting ? "Creating Team..." : "Create Team"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-rose-600 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Delete Team</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Are you sure you want to delete <strong>"{selectedTeam.name}"</strong>?</p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-xs font-semibold">Cancel</button>
              <button onClick={handleDeleteTeamSubmit} className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg">Delete Team</button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER DRAWER SLIDE-OVER MODAL */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6">
            <div className="space-y-6 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary-600" />
                  Filter Teams
                </h3>
                <button type="button" onClick={() => setShowFilterDrawer(false)}>
                  <X className="w-5 h-5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200" />
                </button>
              </div>

              <div className="space-y-5 text-xs">
                {/* Organization Filter */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                    Organization
                  </label>
                  <select
                    value={filterOrg}
                    onChange={(e) => setFilterOrg(e.target.value)}
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium text-xs text-neutral-900 dark:text-white"
                  >
                    <option value="All">All Organizations</option>
                    <option value="HB Enterprise">HB Enterprise</option>
                    <option value="Spine CloudIQ">Spine CloudIQ</option>
                    <option value="CyberShield Ltd">CyberShield Ltd</option>
                    <option value="FinTech Solutions">FinTech Solutions</option>
                    <option value="HealthCare AI">HealthCare AI</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium text-xs text-neutral-900 dark:text-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Near Budget">Near Budget</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                {/* Allowed Model Filter */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                    Allowed Model
                  </label>
                  <select
                    value={filterModel}
                    onChange={(e) => setFilterModel(e.target.value)}
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium text-xs text-neutral-900 dark:text-white"
                  >
                    <option value="All">All Models</option>
                    <option value="gpt-4o">gpt-4o</option>
                    <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                    <option value="gemini-1-5-pro">gemini-1-5-pro</option>
                    <option value="llama-3-70b">llama-3-70b</option>
                    <option value="codex-mini-latest">codex-mini-latest</option>
                    <option value="mistral-large">mistral-large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Drawer Footer Buttons */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setFilterOrg("All");
                  setFilterStatus("All");
                  setFilterModel("All");
                  toast.info("Filters reset to default.");
                }}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Reset Filters
              </button>
              <PrimaryButton
                onClick={() => {
                  setShowFilterDrawer(false);
                  toast.success("Filters applied successfully.");
                }}
              >
                Apply Filters
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
