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
  alertEmails?: string[];
}

export interface ApiPermissionItem {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  description: string;
  access: boolean;
  category: "Virtual Keys" | "Users" | "Teams" | "Policies" | "Models" | "Organizations" | "Logging" | "Guardrails";
}

// --- Multi Email Input Component (Notification Email Recipients) ---
export function MultiEmailInput({
  emails,
  onChange,
  label = "Notification Email Recipients",
  placeholder = "Type email and press Enter or comma...",
  helpText = "Recipients receive email notifications when Soft Budget or Maximum Budget threshold is reached."
}: {
  emails: string[];
  onChange: (newEmails: string[]) => void;
  label?: string;
  placeholder?: string;
  helpText?: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const addEmails = (rawInput: string) => {
    const candidateEmails = rawInput
      .split(/[\s,\n;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0);

    if (candidateEmails.length === 0) return;

    let addedCount = 0;
    const newEmails = [...emails];

    for (const email of candidateEmails) {
      if (!validateEmail(email)) {
        setError(`"${email}" is not a valid email address.`);
        toast.error(`"${email}" is not a valid email address.`);
        continue;
      }
      if (newEmails.includes(email)) {
        setError(`"${email}" is already added.`);
        continue;
      }
      newEmails.push(email);
      addedCount++;
    }

    if (addedCount > 0) {
      onChange(newEmails);
      setInputValue("");
      setError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === ";") {
      e.preventDefault();
      addEmails(inputValue);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addEmails(inputValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    addEmails(pastedText);
  };

  const removeEmail = (indexToRemove: number) => {
    onChange(emails.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-1.5 col-span-full">
      <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
        {label}
      </label>
      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
        {helpText}
      </p>

      <div className="min-h-[44px] p-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all flex flex-wrap items-center gap-2">
        {emails.map((email, idx) => (
          <span
            key={email + idx}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-50 dark:bg-primary-950/60 border border-primary-200/80 dark:border-primary-800 text-primary-700 dark:text-primary-300 font-mono text-xs font-medium animate-fadeIn"
          >
            <Mail className="w-3 h-3 text-primary-500" />
            {email}
            <button
              type="button"
              onClick={() => removeEmail(idx)}
              className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-primary-200/60 dark:hover:bg-primary-800/80 text-primary-600 dark:text-primary-400 transition-colors"
              title={`Remove ${email}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          type="email"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={emails.length === 0 ? placeholder : "Add email..."}
          className="flex-1 min-w-[180px] bg-transparent text-xs font-medium outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600 py-0.5"
        />
      </div>
      {error && <div className="text-[11px] text-rose-500 font-medium">{error}</div>}
    </div>
  );
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
  const [viewState, setViewState] = useState<"list" | "detail" | "edit" | "audit-log">("list");
  const [selectedTeam, setSelectedTeam] = useState<TeamItem | null>(null);

  // Team Audit Log State (reusing Virtual Key Details -> Logs pattern)
  const [teamAuditSearch, setTeamAuditSearch] = useState("");
  const [teamAuditActionFilter, setTeamAuditActionFilter] = useState("All");
  const [teamAuditPage, setTeamAuditPage] = useState(1);

  // Detail Sub-Tab State (Member Permissions, My Users, and Settings removed)
  const [detailTab, setDetailTab] = useState<"overview" | "virtual-keys" | "members">("overview");

  // Sub-Tab Search Queries
  const [searchQuery, setSearchQuery] = useState("");
  const [searchKeyQuery, setSearchKeyQuery] = useState("");
  const [searchMemberQuery, setSearchMemberQuery] = useState("");

  // Summary Cards Visibility State
  const [showSummary, setShowSummary] = useState(true);

  // Filter Drawer State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
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
  const [formAlertEmails, setFormAlertEmails] = useState<string[]>(["john@company.com", "sarah@company.com", "finance@company.com"]);
  const [formTpmLimit, setFormTpmLimit] = useState("500000");
  const [formRpmLimit, setFormRpmLimit] = useState("5000");
  const [formTouched, setFormTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highlightedTeamId, setHighlightedTeamId] = useState<string | null>(null);

  // Virtual Key Specific Action Modals
  const [selectedVkKey, setSelectedVkKey] = useState<TeamVirtualKeyRef | null>(null);
  const [keyMenuPosition, setKeyMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [showVkViewModal, setShowVkViewModal] = useState(false);
  const [showVkEditModal, setShowVkEditModal] = useState(false);
  const [showVkRegenerateModal, setShowVkRegenerateModal] = useState(false);
  const [showVkDisableModal, setShowVkDisableModal] = useState(false);
  const [showVkDeleteModal, setShowVkDeleteModal] = useState(false);

  // Edit Vk Form State
  const [vkEditAlias, setVkEditAlias] = useState("");
  const [vkEditType, setVkEditType] = useState<"AI APIs" | "Management" | "Full Access">("AI APIs");
  const [vkEditBudget, setVkEditBudget] = useState("500");

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
        setMenuPosition(null);
        setKeyMenuPosition(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Team Audit Logs Mock Data (matching Virtual Key Details -> Logs tab pattern)
  const mockTeamAuditLogs = [
    { id: "log-1", date: "Jul 29, 2026 18:45:00", user: "john.doe@company.com", action: "Team Config", ip: "192.168.1.45", status: "Success", description: "Updated soft budget warning threshold to 80% and added alert recipients" },
    { id: "log-2", date: "Jul 28, 2026 14:30:12", user: "superadmin@spinecloudiq.com", action: "Key Operations", ip: "10.0.4.12", status: "Success", description: "Generated new Virtual Key 'prod-ai-gateway-key'" },
    { id: "log-3", date: "Jul 26, 2026 11:15:33", user: "john.doe@company.com", action: "User Access", ip: "192.168.1.45", status: "Success", description: "Added user sarah.connor@company.com with role Developer" },
    { id: "log-4", date: "Jul 24, 2026 16:02:19", user: "sarah.connor@company.com", action: "Budget Update", ip: "192.168.1.88", status: "Success", description: "Soft budget threshold alert triggered (80% spend reached)" },
    { id: "log-5", date: "Jul 20, 2026 09:20:00", user: "system.bot", action: "Team Config", ip: "10.0.0.1", status: "Success", description: "Automated monthly budget cycle reset executed successfully" },
    { id: "log-6", date: "Jul 15, 2026 13:40:05", user: "alex.smith@company.com", action: "Key Operations", ip: "172.16.0.22", status: "Success", description: "Regenerated Virtual Key secret for 'dev-sandbox-key'" },
    { id: "log-7", date: "Jul 10, 2026 10:11:42", user: "john.doe@company.com", action: "User Access", ip: "192.168.1.45", status: "Success", description: "Updated role permissions for member finance@company.com" }
  ];

  const filteredTeamLogs = mockTeamAuditLogs.filter((l) => {
    const matchesSearch = !teamAuditSearch || 
      l.user.toLowerCase().includes(teamAuditSearch.toLowerCase()) || 
      l.action.toLowerCase().includes(teamAuditSearch.toLowerCase()) || 
      l.ip.toLowerCase().includes(teamAuditSearch.toLowerCase()) || 
      l.description.toLowerCase().includes(teamAuditSearch.toLowerCase());
    const matchesAction = teamAuditActionFilter === "All" || l.action === teamAuditActionFilter;
    return matchesSearch && matchesAction;
  });

  // Filtered & Sorted Teams
  const filteredTeams = useMemo(() => {
    let result = teams.filter((item) => {
      const matchesSearch = 
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teamId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === "All" || item.status === filterStatus;
      const matchesModel =
        filterModel === "All" ||
        item.allowedModels.includes("All Proxy Models") ||
        item.allowedModels.includes(filterModel);

      return matchesSearch && matchesStatus && matchesModel;
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
  }, [teams, searchQuery, filterStatus, filterModel, sortField, sortDirection]);

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
    const allModelsSet = new Set(teams.flatMap((t) => t.allowedModels));
    const totalBudgetAssigned = teams.reduce((acc, curr) => acc + curr.maxBudget, 0);

    return [
      { id: "total", label: "Total Teams", value: totalTeams, subValue: "All provisioned teams", icon: Users },
      { id: "active", label: "Active Teams", value: activeTeams, subValue: "Operational teams", icon: ShieldCheck },
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
    setFormAlertEmails(["john@company.com", "sarah@company.com", "finance@company.com"]);
    setFormTpmLimit("500000");
    setFormRpmLimit("5000");
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
        alertEmails: formAlertEmails,
        membersList: [{ id: "m-100", name: "John Doe", email: "john.doe@company.com", userId: "usr-904128", role: "Team Admin", models: formAllowedModels, budget: parseFloat(formMaxBudget) || 5000, currentSpend: 0, status: "Active", lastActive: "Just now", addedDate: "Just now" }],
        keysList: [],
        policies: ["Rate Limiting"],
        guardrails: ["PII Masking"],
        vectorStores: [],
        searchTools: [],
        mcpServers: [],
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
              placeholder="Search by Team Name or Team ID..."
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 transition-all duration-300 animate-fadeIn">
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
                              if (activeMenuId === item.id) {
                                setActiveMenuId(null);
                                setMenuPosition(null);
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setMenuPosition({
                                  top: rect.bottom + 4,
                                  left: Math.max(10, rect.right - 192)
                                });
                                setActiveMenuId(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="More Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && menuPosition && (
                            <div
                              style={{ position: "fixed", top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                              className="z-[9999] w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl py-1.5 text-left text-xs animate-fadeIn action-menu-container"
                            >
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setMenuPosition(null);
                                  setSelectedTeam(item);
                                  setDetailTab("overview");
                                  setViewState("detail");
                                }}
                                className="w-full px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2 text-neutral-700 dark:text-neutral-300 transition-colors font-medium"
                              >
                                <Eye className="w-3.5 h-3.5 text-neutral-500" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setMenuPosition(null);
                                  setSelectedTeam(item);
                                  setViewState("edit");
                                }}
                                className="w-full px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2 text-neutral-700 dark:text-neutral-300 transition-colors font-medium"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setMenuPosition(null);
                                  setSelectedTeam(item);
                                  setShowDeleteModal(true);
                                }}
                                className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium transition-colors"
                              >
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
      ) : viewState === "detail" ? (
        /* ========================================================================= */
        /* VIEW 2: COMPLETE TEAM DETAILS WORKSPACE                                   */
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
                      <button onClick={() => { setShowMoreDetailMenu(false); setViewState("edit"); }} className="w-full px-3 py-2 text-left hover:bg-neutral-50 flex items-center gap-2">
                        <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Edit Team</span>
                      </button>
                      <button 
                        onClick={() => { 
                          setShowMoreDetailMenu(false); 
                          setViewState("audit-log");
                        }} 
                        className="w-full px-3 py-2 text-left hover:bg-neutral-50 flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5 text-neutral-500" />
                        <span>View Audit Log</span>
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
                  {(["overview", "virtual-keys", "members"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDetailTab(t)}
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

              {/* TAB 2: VIRTUAL KEYS TAB */}
              {detailTab === "virtual-keys" && (
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <div className="flex items-center justify-between gap-3">
                    <SearchBar value={searchKeyQuery} onChange={setSearchKeyQuery} placeholder="Search team virtual keys..." />
                    <PrimaryButton icon={KeyRound} onClick={() => setShowCreateKeyModal(true)}>
                      Create New Key
                    </PrimaryButton>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-neutral-50/80 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold">
                        <tr>
                          <th className="py-3 px-4">Key Alias</th>
                          <th className="py-3 px-4">Key ID</th>
                          <th className="py-3 px-4">Owner</th>
                          <th className="py-3 px-4">Key Type</th>
                          <th className="py-3 px-4">Spend / Budget</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {selectedTeam.keysList.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-neutral-400 dark:text-neutral-500 space-y-3">
                              <KeyRound className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-700 stroke-1" />
                              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">No Virtual Keys Provisioned</div>
                              <p className="text-xs max-w-sm mx-auto">Create a new key to grant API gateway access for this team.</p>
                              <PrimaryButton icon={KeyRound} onClick={() => setShowCreateKeyModal(true)}>
                                Create New Key
                              </PrimaryButton>
                            </td>
                          </tr>
                        ) : (
                          selectedTeam.keysList
                            .filter((k) => !searchKeyQuery || k.alias.toLowerCase().includes(searchKeyQuery.toLowerCase()) || k.keyId.toLowerCase().includes(searchKeyQuery.toLowerCase()))
                            .map((k) => {
                              const isKeyMenuOpen = activeKeyMenuId === k.id;
                              return (
                                <tr key={k.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                                  <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">{k.alias}</td>
                                  <td className="py-3.5 px-4 font-mono text-neutral-500">
                                    <div className="flex items-center gap-1">
                                      <span>{k.keyId}</span>
                                      <button type="button" onClick={() => handleCopyText(k.keyId, "Key ID copied!")} className="p-0.5 text-neutral-400 hover:text-primary-600 transition-colors" title="Copy Key ID">
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4 text-neutral-500">{k.owner}</td>
                                  <td className="py-3.5 px-4 font-medium">{k.keyType}</td>
                                  <td className="py-3.5 px-4 font-mono font-semibold">${k.currentSpend.toFixed(2)} / ${k.budget.toFixed(2)}</td>
                                  <td className="py-3.5 px-4">{renderStatusBadge(k.status as any)}</td>

                                  <td className="py-3.5 px-4 text-right action-menu-container">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (activeKeyMenuId === k.id) {
                                          setActiveKeyMenuId(null);
                                          setKeyMenuPosition(null);
                                        } else {
                                          const rect = e.currentTarget.getBoundingClientRect();
                                          setKeyMenuPosition({
                                            top: rect.bottom + 4,
                                            left: Math.max(10, rect.right - 192)
                                          });
                                          setActiveKeyMenuId(k.id);
                                        }
                                      }}
                                      className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                      title="Actions Menu"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {isKeyMenuOpen && keyMenuPosition && (
                                      <div
                                        style={{ position: "fixed", top: `${keyMenuPosition.top}px`, left: `${keyMenuPosition.left}px` }}
                                        className="z-[9999] w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl py-1.5 text-left text-xs animate-fadeIn action-menu-container"
                                      >
                                        <button
                                          onClick={() => {
                                            setActiveKeyMenuId(null);
                                            setKeyMenuPosition(null);
                                            setSelectedVkKey(k);
                                            setShowVkViewModal(true);
                                          }}
                                          className="w-full px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
                                        >
                                          <Eye className="w-3.5 h-3.5 text-neutral-500" />
                                          <span>View Key</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            setActiveKeyMenuId(null);
                                            setKeyMenuPosition(null);
                                            setSelectedVkKey(k);
                                            setVkEditAlias(k.alias);
                                            setVkEditType(k.keyType);
                                            setVkEditBudget(k.budget.toString());
                                            setShowVkEditModal(true);
                                          }}
                                          className="w-full px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
                                        >
                                          <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                                          <span>Edit Key</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            setActiveKeyMenuId(null);
                                            setKeyMenuPosition(null);
                                            setSelectedVkKey(k);
                                            setShowVkRegenerateModal(true);
                                          }}
                                          className="w-full px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-blue-600 flex items-center gap-2 font-medium transition-colors"
                                        >
                                          <RotateCw className="w-3.5 h-3.5" />
                                          <span>Regenerate Key</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            setActiveKeyMenuId(null);
                                            setKeyMenuPosition(null);
                                            setSelectedVkKey(k);
                                            setShowVkDisableModal(true);
                                          }}
                                          className="w-full px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 flex items-center gap-2 font-medium transition-colors"
                                        >
                                          <Ban className="w-3.5 h-3.5" />
                                          <span>{k.status === "Disabled" || k.status === "Blocked" ? "Enable Key" : "Disable Key"}</span>
                                        </button>
                                        <hr className="my-1 border-neutral-100 dark:border-neutral-800" />
                                        <button
                                          onClick={() => {
                                            setActiveKeyMenuId(null);
                                            setKeyMenuPosition(null);
                                            setSelectedVkKey(k);
                                            setShowVkDeleteModal(true);
                                          }}
                                          className="w-full px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 flex items-center gap-2 font-medium transition-colors"
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
                </div>
              )}

              {/* TAB 4: MEMBERS TAB */}
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
            </div>
          </div>
        )
      ) : viewState === "edit" ? (
        /* ========================================================================= */
        /* VIEW 3: DEDICATED EDIT TEAM PAGE                                         */
        /* ========================================================================= */
        selectedTeam && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Navigation & Header */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewState("detail")}
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Team Details
              </button>

              <div className="text-xs text-neutral-400">
                Site Map &gt; Access Control &gt; Teams &gt; <span className="text-neutral-700 dark:text-neutral-300 font-medium">Edit Team</span>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-neutral-100 dark:border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-primary-600" />
                    Edit Team: {selectedTeam.name}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Update team configurations, rate limits, budgets, and model access.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setViewState("detail")}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <PrimaryButton
                    icon={Save}
                    onClick={() => {
                      toast.success(`Team "${selectedTeam.name}" updated successfully.`);
                      setViewState("detail");
                    }}
                  >
                    Save Changes
                  </PrimaryButton>
                </div>
              </div>

              {/* Form Content */}
              <div className="space-y-6 text-xs">
                {/* Basic Information */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50/50 space-y-4">
                  <h4 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-600" /> Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Team Name *</label>
                      <input
                        type="text"
                        defaultValue={selectedTeam.name}
                        onChange={(e) => {
                          const updated = { ...selectedTeam, name: e.target.value };
                          setSelectedTeam(updated);
                          setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                        }}
                        className="w-full h-10 px-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-xs font-semibold focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Team Description</label>
                      <input
                        type="text"
                        defaultValue={selectedTeam.description}
                        onChange={(e) => {
                          const updated = { ...selectedTeam, description: e.target.value };
                          setSelectedTeam(updated);
                          setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                        }}
                        className="w-full h-10 px-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Budget & Quota Thresholds */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50/50 space-y-4">
                  <h4 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" /> Budget & Quota Thresholds
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Max Budget ($)</label>
                      <input
                        type="number"
                        defaultValue={selectedTeam.maxBudget}
                        onChange={(e) => {
                          const updated = { ...selectedTeam, maxBudget: parseFloat(e.target.value) || 0 };
                          setSelectedTeam(updated);
                          setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                        }}
                        className="w-full h-10 px-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-xs font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Budget Reset Cycle</label>
                      <select
                        defaultValue={selectedTeam.budgetDuration}
                        onChange={(e) => {
                          const updated = { ...selectedTeam, budgetDuration: e.target.value as any };
                          setSelectedTeam(updated);
                          setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                        }}
                        className="w-full h-10 px-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-xs font-medium"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Annual">Annual</option>
                        <option value="Infinite">Infinite</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Soft Warning Threshold (%)</label>
                      <input
                        type="number"
                        defaultValue={selectedTeam.softBudgetPercent}
                        onChange={(e) => {
                          const updated = { ...selectedTeam, softBudgetPercent: parseInt(e.target.value) || 80 };
                          setSelectedTeam(updated);
                          setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                        }}
                        className="w-full h-10 px-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-xs font-mono font-semibold"
                      />
                    </div>

                    {/* Alert Email Recipients */}
                    <MultiEmailInput
                      emails={selectedTeam.alertEmails || ["john@company.com", "sarah@company.com", "finance@company.com"]}
                      onChange={(newEmails) => {
                        const updated = { ...selectedTeam, alertEmails: newEmails };
                        setSelectedTeam(updated);
                        setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                      }}
                      label="Notification Email Recipients"
                      helpText="Recipients receive email notifications when Soft Budget or Maximum Budget threshold is reached."
                    />
                  </div>
                </div>

                {/* Rate Limits */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50/50 space-y-4">
                  <h4 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" /> Rate Limits (TPM / RPM)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Tokens Per Minute (TPM)</label>
                      <input
                        type="number"
                        defaultValue={selectedTeam.tpmLimit}
                        onChange={(e) => {
                          const updated = { ...selectedTeam, tpmLimit: parseInt(e.target.value) || 500000 };
                          setSelectedTeam(updated);
                          setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                        }}
                        className="w-full h-10 px-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-xs font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Requests Per Minute (RPM)</label>
                      <input
                        type="number"
                        defaultValue={selectedTeam.rpmLimit}
                        onChange={(e) => {
                          const updated = { ...selectedTeam, rpmLimit: parseInt(e.target.value) || 5000 };
                          setSelectedTeam(updated);
                          setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                        }}
                        className="w-full h-10 px-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-xs font-mono font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ) : viewState === "audit-log" ? (
        /* ========================================================================= */
        /* VIEW 4: TEAM AUDIT LOG WORKSPACE (REUSING VIRTUAL KEY DETAILS -> LOGS)   */
        /* ========================================================================= */
        selectedTeam && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Navigation & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewState("detail")}
                  className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Back to Team Details"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Site Map</span>
                    <span>/</span>
                    <span>Access Control</span>
                    <span>/</span>
                    <span>Teams</span>
                    <span>/</span>
                    <span className="text-primary-600 dark:text-primary-400 font-bold">Audit Log</span>
                  </div>
                  <h1 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2 mt-0.5">
                    <FileText className="w-5 h-5 text-primary-600" />
                    Audit Log: {selectedTeam.name}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewState("detail")}
                  className="px-3.5 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors"
                >
                  Back to Team Details
                </button>
              </div>
            </div>

            {/* Top Toolbar matching Virtual Key Details -> Logs Tab */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={teamAuditSearch}
                    onChange={(e) => setTeamAuditSearch(e.target.value)}
                    placeholder="Search team audit logs by IP, user, action..."
                    className="h-9 pl-8 pr-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg w-64 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <select
                  value={teamAuditActionFilter}
                  onChange={(e) => setTeamAuditActionFilter(e.target.value)}
                  className="h-9 px-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none"
                >
                  <option value="All">All Actions</option>
                  <option value="Team Config">Team Config</option>
                  <option value="Budget Update">Budget Checks</option>
                  <option value="Key Operations">Key Operations</option>
                  <option value="User Access">User Access</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <IconButton icon={Download} label="Export" onClick={() => toast.success("Exporting Team audit logs CSV...")} />
                <IconButton icon={RefreshCw} label="Refresh" onClick={() => toast.success("Team audit logs refreshed")} />
              </div>
            </div>

            {/* Audit Logs HB Enterprise Table matching Virtual Key Details -> Logs */}
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
                    {filteredTeamLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-neutral-400 dark:text-neutral-500 space-y-2">
                          <FileText className="w-8 h-8 mx-auto stroke-1 text-neutral-300 dark:text-neutral-700" />
                          <div className="font-semibold text-neutral-700 dark:text-neutral-300">No Audit Logs Found</div>
                          <p className="text-xs">No audit events matched your search or action filter criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredTeamLogs.map((l) => (
                        <tr key={l.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">{l.date}</td>
                          <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">{l.user}</td>
                          <td className="py-3 px-4 font-semibold text-primary-600 dark:text-primary-400">{l.action}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">{l.ip}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {l.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{l.description}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer & Pagination */}
              <div className="px-4 py-3 bg-neutral-50/60 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                <div>
                  Showing <span className="font-semibold text-neutral-800 dark:text-neutral-200">{filteredTeamLogs.length}</span> audit logs for <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedTeam.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={teamAuditPage === 1}
                    onClick={() => setTeamAuditPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 border border-neutral-300 dark:border-neutral-700 rounded text-xs disabled:opacity-40 font-medium hover:bg-neutral-100 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Page {teamAuditPage} of 1</span>
                  <button
                    type="button"
                    disabled={true}
                    className="px-2.5 py-1 border border-neutral-300 dark:border-neutral-700 rounded text-xs disabled:opacity-40 font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      ) : null}

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

      {/* CREATE VIRTUAL KEY MODAL (Reusing Virtual Key Workflow Modal) */}
      {showCreateKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden my-auto text-xs">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Create Virtual Key
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Generate a new API key for {selectedTeam?.name || "Team"} to route LLM requests.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateKeyModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Key Alias / Name *</label>
                  <input
                    type="text"
                    value={keyFormAlias}
                    onChange={(e) => setKeyFormAlias(e.target.value)}
                    placeholder="e.g. prod-service-key"
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Key Type *</label>
                  <select
                    value={keyFormType}
                    onChange={(e: any) => setKeyFormType(e.target.value)}
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium"
                  >
                    <option value="AI APIs">AI APIs (LLM Proxy Access)</option>
                    <option value="Management">Management (API Gateway Admin)</option>
                    <option value="Full Access">Full Access (Admin + AI Proxy)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Assigned Team</label>
                  <div className="h-10 px-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Users className="w-3.5 h-3.5 text-neutral-400" />
                    {selectedTeam?.name || "HB Enterprise Team"}
                    <span className="ml-auto text-[10px] bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded text-neutral-500">Auto</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Owner Email</label>
                  <div className="h-10 px-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    {selectedTeam?.ownerEmail || "john.doe@company.com"}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Max Budget Cap ($)</label>
                  <input
                    type="number"
                    value={keyFormBudget}
                    onChange={(e) => setKeyFormBudget(e.target.value)}
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-mono font-semibold"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Expiration Duration</label>
                  <select className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium">
                    <option value="Never">Never (No Expiration)</option>
                    <option value="30 Days">30 Days</option>
                    <option value="90 Days">90 Days</option>
                    <option value="1 Year">1 Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2 bg-neutral-50/50 dark:bg-neutral-900/50">
              <button
                type="button"
                onClick={() => setShowCreateKeyModal(false)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <PrimaryButton icon={KeyRound} onClick={handleCreateKeySubmit}>
                Create Virtual Key
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
                    Basic Information
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
                      Model Access & Proxy Routing
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
                    Budget Configuration ($ USD)
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

                  {/* Alert Email Recipients */}
                  <MultiEmailInput
                    emails={formAlertEmails}
                    onChange={setFormAlertEmails}
                    label="Notification Email Recipients"
                    helpText="Recipients receive email notifications when Soft Budget or Maximum Budget threshold is reached."
                  />
                </div>
              </div>

              {/* SECTION 4 — RATE LIMITS (TPM / RPM) */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Rate Limits (TPM / RPM)
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

      {/* ========================================================================= */}
      {/* VIRTUAL KEY ACTION MODALS (REUSED WORKFLOWS FOR VIEW, EDIT, REGENERATE, DISABLE, DELETE) */}
      {/* ========================================================================= */}

      {/* 1. VIEW VIRTUAL KEY MODAL */}
      {showVkViewModal && selectedVkKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between border-b pb-3 border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Virtual Key Details</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-neutral-500 font-mono">{selectedVkKey.keyId}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedVkKey.keyId, "Key ID copied successfully.")}
                      className="p-1 text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Copy Key ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => setShowVkViewModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 font-medium block mb-0.5">Key Alias / Name</span>
                  <div className="font-bold text-neutral-900 dark:text-white text-sm">{selectedVkKey.alias}</div>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 font-medium block mb-0.5">Key Type</span>
                  <div className="font-bold text-neutral-900 dark:text-white text-sm">{selectedVkKey.keyType}</div>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-1">
                <span className="text-[11px] text-neutral-400 font-medium block">Owner</span>
                <div className="font-mono font-medium text-neutral-800 dark:text-neutral-200">{selectedVkKey.owner}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 font-medium block mb-0.5">Current Spend</span>
                  <div className="font-mono font-bold text-emerald-600">${selectedVkKey.currentSpend.toFixed(2)}</div>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 font-medium block mb-0.5">Budget Cap</span>
                  <div className="font-mono font-bold text-neutral-900 dark:text-white">${selectedVkKey.budget.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setShowVkViewModal(false)}
                className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-semibold rounded-lg text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDIT VIRTUAL KEY MODAL */}
      {showVkEditModal && selectedVkKey && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3 border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-primary-600" /> Edit Virtual Key
              </h3>
              <button type="button" onClick={() => setShowVkEditModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Read-Only Key ID Field */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/80 rounded-xl p-3 space-y-1">
                <label className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Key ID
                </label>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white select-all">
                    {selectedVkKey.keyId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(selectedVkKey.keyId, "Key ID copied successfully.")}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-700 rounded transition-colors"
                    title="Copy Key ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-800 dark:text-neutral-200">Key Alias *</label>
                <input
                  type="text"
                  value={vkEditAlias}
                  onChange={(e) => setVkEditAlias(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-800 dark:text-neutral-200">Key Type</label>
                <select
                  value={vkEditType}
                  onChange={(e: any) => setVkEditType(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium"
                >
                  <option value="AI APIs">AI APIs</option>
                  <option value="Management">Management</option>
                  <option value="Full Access">Full Access</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-800 dark:text-neutral-200">Budget Cap ($)</label>
                <input
                  type="number"
                  value={vkEditBudget}
                  onChange={(e) => setVkEditBudget(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-mono font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setShowVkEditModal(false)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <PrimaryButton
                onClick={() => {
                  const updatedKeys = selectedTeam.keysList.map((k) =>
                    k.id === selectedVkKey.id
                      ? { ...k, alias: vkEditAlias || k.alias, keyType: vkEditType, budget: parseFloat(vkEditBudget) || k.budget }
                      : k
                  );
                  const updatedTeam = { ...selectedTeam, keysList: updatedKeys };
                  setSelectedTeam(updatedTeam);
                  setTeams((prev) => prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));
                  setShowVkEditModal(false);
                  toast.success(`Virtual Key "${vkEditAlias}" updated successfully.`);
                }}
              >
                Save Changes
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* 3. REGENERATE VIRTUAL KEY MODAL */}
      {showVkRegenerateModal && selectedVkKey && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center gap-3 border-b pb-3 border-neutral-100 dark:border-neutral-800">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 text-blue-600 flex items-center justify-center">
                <RotateCw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Regenerate Virtual Key</h3>
                <p className="text-xs text-neutral-500">Generate a fresh API key token string.</p>
              </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400">
              Are you sure you want to regenerate key <strong>"{selectedVkKey.alias}"</strong>? The current key secret will be immediately invalidated and replaced with a new token.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setShowVkRegenerateModal(false)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const freshKeyId = `vk-sec-${Math.random().toString(36).slice(2, 10)}`;
                  const updatedKeys = selectedTeam.keysList.map((k) =>
                    k.id === selectedVkKey.id ? { ...k, keyId: freshKeyId } : k
                  );
                  const updatedTeam = { ...selectedTeam, keysList: updatedKeys };
                  setSelectedTeam(updatedTeam);
                  setTeams((prev) => prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));
                  setShowVkRegenerateModal(false);
                  toast.success(`Virtual Key "${selectedVkKey.alias}" regenerated successfully.`);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Regenerate Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. DISABLE / ENABLE VIRTUAL KEY MODAL */}
      {showVkDisableModal && selectedVkKey && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center gap-3 border-b pb-3 border-neutral-100 dark:border-neutral-800">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 text-amber-600 flex items-center justify-center">
                <Ban className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {selectedVkKey.status === "Disabled" || selectedVkKey.status === "Blocked" ? "Enable Virtual Key" : "Disable Virtual Key"}
                </h3>
                <p className="text-xs text-neutral-500">Toggle active status for this virtual key.</p>
              </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400">
              Are you sure you want to {selectedVkKey.status === "Disabled" || selectedVkKey.status === "Blocked" ? "enable" : "disable"} key <strong>"{selectedVkKey.alias}"</strong>?
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setShowVkDisableModal(false)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const newStatus = selectedVkKey.status === "Disabled" || selectedVkKey.status === "Blocked" ? "Active" : "Disabled";
                  const updatedKeys = selectedTeam.keysList.map((k) =>
                    k.id === selectedVkKey.id ? { ...k, status: newStatus as any } : k
                  );
                  const updatedTeam = { ...selectedTeam, keysList: updatedKeys };
                  setSelectedTeam(updatedTeam);
                  setTeams((prev) => prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));
                  setShowVkDisableModal(false);
                  toast.success(`Virtual Key "${selectedVkKey.alias}" ${newStatus === "Active" ? "enabled" : "disabled"} successfully.`);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DELETE VIRTUAL KEY MODAL */}
      {showVkDeleteModal && selectedVkKey && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center gap-3 border-b pb-3 border-neutral-100 dark:border-neutral-800">
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-600">Delete Virtual Key</h3>
                <p className="text-xs text-neutral-500">Permanently delete this virtual key record.</p>
              </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400">
              Are you sure you want to delete virtual key <strong>"{selectedVkKey.alias}"</strong>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setShowVkDeleteModal(false)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const updatedKeys = selectedTeam.keysList.filter((k) => k.id !== selectedVkKey.id);
                  const updatedTeam = {
                    ...selectedTeam,
                    keysList: updatedKeys,
                    virtualKeysCount: updatedKeys.length
                  };
                  setSelectedTeam(updatedTeam);
                  setTeams((prev) => prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));
                  setShowVkDeleteModal(false);
                  toast.success(`Virtual Key "${selectedVkKey.alias}" deleted successfully.`);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors"
              >
                Delete Key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
