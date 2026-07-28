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
  Trash2, 
  Copy, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Building2, 
  Users, 
  AlertTriangle, 
  X, 
  Columns3, 
  BarChart3, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  EyeOff, 
  ChevronDown, 
  Lock, 
  FileText, 
  Database,
  Server
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

// --- Organization Data Interface ---
export interface OrganizationItem {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  createdDate: string;
  currentSpend: number;
  maxBudget: number; // 0 for unlimited
  resetCycle: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly" | "Never";
  assignedModels: string[];
  tpmLimit: number;
  rpmLimit: number;
  membersCount: number;
  status: "Active" | "Inactive" | "Suspended";
  vectorStores?: string[];
  mcpServers?: string[];
  metadata?: string;
  createdBy: string;
}

// Initial Mock Organizations
const mockOrganizations: OrganizationItem[] = [
  {
    id: "org-101",
    orgId: "org-57c860ac",
    name: "HB Enterprise",
    description: "Primary enterprise organization for core platform services and internal AI apps",
    createdDate: "Jul 15, 2026",
    currentSpend: 3420.50,
    maxBudget: 10000,
    resetCycle: "Monthly",
    assignedModels: ["gpt-4o", "claude-3-5-sonnet", "gemini-1-5-pro", "llama-3-70b"],
    tpmLimit: 1000000,
    rpmLimit: 10000,
    membersCount: 42,
    status: "Active",
    vectorStores: ["vector-store-prod-01", "knowledge-base-hb"],
    mcpServers: ["mcp-auth-gateway", "mcp-db-connector"],
    metadata: '{\n  "environment": "production",\n  "tier": "enterprise"\n}',
    createdBy: "superadmin@spinecloudiq.com",
  },
  {
    id: "org-102",
    orgId: "org-89b12d4f",
    name: "Spine CloudIQ",
    description: "Cloud infrastructure and automated DevOps AI research workspace",
    createdDate: "Jul 18, 2026",
    currentSpend: 1850.00,
    maxBudget: 5000,
    resetCycle: "Monthly",
    assignedModels: ["gpt-4o", "claude-3-5-sonnet", "codex-mini-latest"],
    tpmLimit: 500000,
    rpmLimit: 5000,
    membersCount: 18,
    status: "Active",
    vectorStores: ["vector-store-devops"],
    mcpServers: ["mcp-k8s-agent"],
    metadata: '{\n  "dept": "devops"\n}',
    createdBy: "hbadmin@yopmail.com",
  },
  {
    id: "org-103",
    orgId: "org-34a981bc",
    name: "CyberShield Ltd",
    description: "Security operations and automated vulnerability analysis unit",
    createdDate: "Jul 20, 2026",
    currentSpend: 890.25,
    maxBudget: 2500,
    resetCycle: "Monthly",
    assignedModels: ["claude-3-5-sonnet", "mistral-large"],
    tpmLimit: 250000,
    rpmLimit: 2500,
    membersCount: 12,
    status: "Active",
    vectorStores: ["sec-threat-vault"],
    mcpServers: ["mcp-siem-bridge"],
    metadata: '{\n  "compliance": "hipaa-soc2"\n}',
    createdBy: "sarah.connor@hb.com",
  },
  {
    id: "org-104",
    orgId: "org-12d773ee",
    name: "FinTech Solutions",
    description: "Quantitative analytics and financial modeling sandbox",
    createdDate: "Jul 22, 2026",
    currentSpend: 0.00,
    maxBudget: 0, // Unlimited
    resetCycle: "Never",
    assignedModels: ["All Models"],
    tpmLimit: 2000000,
    rpmLimit: 20000,
    membersCount: 8,
    status: "Inactive",
    vectorStores: [],
    mcpServers: [],
    metadata: "",
    createdBy: "alex.dev@hb.com",
  },
  {
    id: "org-105",
    orgId: "org-99c642aa",
    name: "HealthCare AI",
    description: "Medical research and clinical diagnostics experimentation lab",
    createdDate: "Jul 24, 2026",
    currentSpend: 4200.00,
    maxBudget: 4000,
    resetCycle: "Monthly",
    assignedModels: ["gpt-4o", "gemini-1-5-pro"],
    tpmLimit: 300000,
    rpmLimit: 3000,
    membersCount: 15,
    status: "Suspended",
    vectorStores: ["clinical-trials-v1"],
    mcpServers: [],
    metadata: '{\n  "audit": "active"\n}',
    createdBy: "michael.scott@hb.com",
  },
];

const AVAILABLE_MODELS = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", badge: "Flagship" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", badge: "Reasoning" },
  { id: "gemini-1-5-pro", name: "Gemini 1.5 Pro", provider: "Google", badge: "Multimodal" },
  { id: "llama-3-70b", name: "Llama 3 70B", provider: "Meta", badge: "Open Source" },
  { id: "codex-mini-latest", name: "Codex", provider: "OpenAI", badge: "Code" },
  { id: "mistral-large", name: "Mistral Large", provider: "Mistral", badge: "Fast" },
];

const AVAILABLE_VECTOR_STORES = [
  "vector-store-prod-01",
  "knowledge-base-hb",
  "vector-store-devops",
  "sec-threat-vault",
  "clinical-trials-v1"
];

const AVAILABLE_MCP_SERVERS = [
  "mcp-auth-gateway",
  "mcp-db-connector",
  "mcp-k8s-agent",
  "mcp-siem-bridge"
];

export interface OrgMemberItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "Organization Admin" | "Internal User" | "Internal User Viewer";
  currentSpend: number;
  joinedDate: string;
  status: "Active" | "Inactive" | "Pending Invitation";
}

const mockSystemUsers = [
  { id: "usr-9901a", name: "John Doe", email: "superadmin@spinecloudiq.com" },
  { id: "usr-4412b", name: "Sarah Connor", email: "sarah.connor@hb.com" },
  { id: "usr-8823c", name: "Alex Dev", email: "alex.dev@hb.com" },
  { id: "usr-1104d", name: "Michael Scott", email: "michael.scott@hb.com" },
  { id: "usr-5590e", name: "Emily Watson", email: "emily.watson@yopmail.com" },
  { id: "usr-7731f", name: "HB Admin", email: "hbadmin@yopmail.com" },
  { id: "usr-3091g", name: "David Miller", email: "david.miller@hb.com" },
  { id: "usr-6124h", name: "Jessica Taylor", email: "jessica.taylor@hb.com" },
];

const mockOrgMembers: Record<string, OrgMemberItem[]> = {
  "org-101": [
    {
      id: "mem-1",
      userId: "usr-9901a",
      name: "John Doe (Super Admin)",
      email: "superadmin@spinecloudiq.com",
      role: "Organization Admin",
      currentSpend: 1450.00,
      joinedDate: "Jul 15, 2026",
      status: "Active",
    },
    {
      id: "mem-2",
      userId: "usr-4412b",
      name: "Sarah Connor",
      email: "sarah.connor@hb.com",
      role: "Organization Admin",
      currentSpend: 890.50,
      joinedDate: "Jul 16, 2026",
      status: "Active",
    },
    {
      id: "mem-3",
      userId: "usr-8823c",
      name: "Alex Dev",
      email: "alex.dev@hb.com",
      role: "Internal User",
      currentSpend: 620.00,
      joinedDate: "Jul 18, 2026",
      status: "Active",
    },
    {
      id: "mem-4",
      userId: "usr-1104d",
      name: "Michael Scott",
      email: "michael.scott@hb.com",
      role: "Internal User Viewer",
      currentSpend: 0,
      joinedDate: "Jul 20, 2026",
      status: "Inactive",
    },
    {
      id: "mem-5",
      userId: "usr-5590e",
      name: "Emily Watson",
      email: "emily.watson@yopmail.com",
      role: "Internal User",
      currentSpend: 0,
      joinedDate: "Jul 25, 2026",
      status: "Pending Invitation",
    },
  ],
  "org-102": [
    {
      id: "mem-6",
      userId: "usr-7731f",
      name: "HB Admin",
      email: "hbadmin@yopmail.com",
      role: "Organization Admin",
      currentSpend: 1850.00,
      joinedDate: "Jul 18, 2026",
      status: "Active",
    },
  ],
};

export default function OrganizationManagement() {
  const [organizations, setOrganizations] = useState<OrganizationItem[]>(mockOrganizations);
  const [viewState, setViewState] = useState<"list" | "detail">("list");
  const [selectedOrg, setSelectedOrg] = useState<OrganizationItem | null>(null);

  // Members Tab Data & State
  const [membersMap, setMembersMap] = useState<Record<string, OrgMemberItem[]>>(mockOrgMembers);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberFilterRole, setMemberFilterRole] = useState("All");
  const [memberFilterStatus, setMemberFilterStatus] = useState("All");
  const [showMemberSummary, setShowMemberSummary] = useState(true);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());
  const [activeMemberMenuId, setActiveMemberMenuId] = useState<string | null>(null);

  // Member Modals State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<OrgMemberItem | null>(null);

  // Add/Edit Member Form State
  const [userLookupMethod, setUserLookupMethod] = useState<"email" | "userId">("email");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedMemberRole, setSelectedMemberRole] = useState<OrgMemberItem["role"]>("Internal User");
  const [memberFormTouched, setMemberFormTouched] = useState(false);
  // Settings Tab Inline Edit State
  const [isSettingsEditMode, setIsSettingsEditMode] = useState(false);
  const [settingsFormName, setSettingsFormName] = useState("");
  const [settingsFormDescription, setSettingsFormDescription] = useState("");
  const [settingsMaxBudget, setSettingsMaxBudget] = useState("5000");
  const [settingsSoftBudget, setSettingsSoftBudget] = useState("4000");
  const [settingsResetCycle, setSettingsResetCycle] = useState<OrganizationItem["resetCycle"]>("Monthly");
  const [settingsTpmLimit, setSettingsTpmLimit] = useState("500000");
  const [settingsRpmLimit, setSettingsRpmLimit] = useState("5000");
  const [settingsFormTouched, setSettingsFormTouched] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterModel, setFilterModel] = useState("All");

  // Summary KPI Visibility State
  const [showSummary, setShowSummary] = useState(true);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sorting state
  const [sortField, setSortField] = useState<keyof OrganizationItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Action Dropdown & Column visibility
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showHeaderActionsMenu, setShowHeaderActionsMenu] = useState(false);
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const columnAnchorRef = useRef<HTMLDivElement>(null);

  const allColumns: ColumnConfig[] = [
    { key: "name", label: "Organization Name" },
    { key: "createdDate", label: "Created Date" },
    { key: "currentSpend", label: "Spend / Budget" },
    { key: "rateLimits", label: "Rate Limits" },
    { key: "membersCount", label: "Members" },
    { key: "status", label: "Status" },
  ];

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    createdDate: true,
    currentSpend: true,
    rateLimits: true,
    membersCount: true,
    status: true,
  });

  const toggleColumn = (key: string) => {
    if (key === "name" || key === "status") return;
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [highlightedOrgId, setHighlightedOrgId] = useState<string | null>(null);

  // Form State for Enterprise Create Organization Modal
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // Detail View Tab
  const [detailTab, setDetailTab] = useState<"overview" | "members" | "models" | "permissions">("overview");

  // Copy helper
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopyText = (text: string, label: string = "Copied successfully!") => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(label);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Reset view state on global navigation
  useEffect(() => {
    const handleReset = () => {
      setViewState("list");
      setSelectedOrg(null);
    };
    window.addEventListener("reset-view-state", handleReset);
    return () => window.removeEventListener("reset-view-state", handleReset);
  }, []);

  // Validation calculations
  const isDuplicateName = useMemo(() => {
    if (!formName.trim()) return false;
    return organizations.some(
      (o) =>
        o.name.toLowerCase().trim() === formName.toLowerCase().trim() &&
        (!isEditMode || o.id !== selectedOrg?.id)
    );
  }, [formName, organizations, isEditMode, selectedOrg]);

  const isFormValid = useMemo(() => {
    return (
      formName.trim().length > 0 &&
      formName.length <= 100 &&
      !isDuplicateName
    );
  }, [formName, isDuplicateName]);

  // Derived Members for Selected Organization
  const currentOrgMembers = useMemo(() => {
    if (!selectedOrg) return [];
    return membersMap[selectedOrg.id] || [];
  }, [membersMap, selectedOrg]);

  const filteredMembers = useMemo(() => {
    return currentOrgMembers.filter((m) => {
      const q = memberSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.userId.toLowerCase().includes(q);

      const matchesRole = memberFilterRole === "All" || m.role === memberFilterRole;
      const matchesStatus = memberFilterStatus === "All" || m.status === memberFilterStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [currentOrgMembers, memberSearchQuery, memberFilterRole, memberFilterStatus]);

  // Members Compact KPI Stats
  const memberKpiStats = useMemo(() => {
    const total = currentOrgMembers.length;
    const admins = currentOrgMembers.filter((m) => m.role === "Organization Admin").length;
    const users = currentOrgMembers.filter((m) => m.role === "Internal User").length;
    const viewers = currentOrgMembers.filter((m) => m.role === "Internal User Viewer").length;

    return [
      { id: "tot-mem", label: "Total Members", value: total.toString() },
      { id: "adm-mem", label: "Organization Admins", value: admins.toString() },
      { id: "usr-mem", label: "Internal Users", value: users.toString() },
      { id: "view-mem", label: "View Only Users", value: viewers.toString() },
    ];
  }, [currentOrgMembers]);

  // Member Handlers
  const isDuplicateMember = useMemo(() => {
    if (!selectedOrg) return false;
    const targetEmail = selectedUserEmail.toLowerCase().trim();
    const targetUserId = selectedUserId.toLowerCase().trim();
    return currentOrgMembers.some(
      (m) =>
        (userLookupMethod === "email" && m.email.toLowerCase() === targetEmail) ||
        (userLookupMethod === "userId" && m.userId.toLowerCase() === targetUserId)
    );
  }, [currentOrgMembers, selectedUserEmail, selectedUserId, userLookupMethod, selectedOrg]);

  const isAddMemberFormValid = useMemo(() => {
    if (userLookupMethod === "email") {
      return selectedUserEmail.trim().length > 0 && !isDuplicateMember;
    } else {
      return selectedUserId.trim().length > 0 && !isDuplicateMember;
    }
  }, [userLookupMethod, selectedUserEmail, selectedUserId, isDuplicateMember]);

  const handleOpenAddMemberModal = () => {
    setSelectedUserEmail(mockSystemUsers[0]?.email || "");
    setSelectedUserId(mockSystemUsers[0]?.id || "");
    setSelectedMemberRole("Internal User");
    setUserLookupMethod("email");
    setMemberFormTouched(false);
    setShowAddMemberModal(true);
  };

  const handleOpenEditMemberModal = (member: OrgMemberItem) => {
    setSelectedMember(member);
    setSelectedMemberRole(member.role);
    setShowEditMemberModal(true);
  };

  const handleSaveAddMember = () => {
    setMemberFormTouched(true);
    if (!selectedOrg || !isAddMemberFormValid) {
      if (isDuplicateMember) {
        toast.error("This user is already a member of this Organization.");
      } else {
        toast.error("Please select a valid user.");
      }
      return;
    }

    const matchedUser = mockSystemUsers.find((u) =>
      userLookupMethod === "email"
        ? u.email.toLowerCase() === selectedUserEmail.toLowerCase()
        : u.id.toLowerCase() === selectedUserId.toLowerCase()
    ) || {
      id: selectedUserId || `usr-${Date.now()}`,
      name: selectedUserEmail.split("@")[0] || "New User",
      email: selectedUserEmail || "user@hb.com",
    };

    const newMember: OrgMemberItem = {
      id: `mem-${Date.now()}`,
      userId: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: selectedMemberRole,
      currentSpend: 0,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      status: "Active",
    };

    setMembersMap((prev) => ({
      ...prev,
      [selectedOrg.id]: [newMember, ...(prev[selectedOrg.id] || [])],
    }));

    // Update membersCount on organization
    setOrganizations((prev) =>
      prev.map((o) =>
        o.id === selectedOrg.id ? { ...o, membersCount: o.membersCount + 1 } : o
      )
    );

    toast.success(`Member "${matchedUser.name}" added to ${selectedOrg.name}!`);
    setShowAddMemberModal(false);
  };

  const handleSaveEditMember = () => {
    if (!selectedOrg || !selectedMember) return;

    setMembersMap((prev) => ({
      ...prev,
      [selectedOrg.id]: (prev[selectedOrg.id] || []).map((m) =>
        m.id === selectedMember.id ? { ...m, role: selectedMemberRole } : m
      ),
    }));

    toast.success(`Role for "${selectedMember.name}" updated to ${selectedMemberRole}.`);
    setShowEditMemberModal(false);
  };

  const handleRemoveMemberSubmit = () => {
    if (!selectedOrg || !selectedMember) return;

    setMembersMap((prev) => ({
      ...prev,
      [selectedOrg.id]: (prev[selectedOrg.id] || []).filter((m) => m.id !== selectedMember.id),
    }));

    setOrganizations((prev) =>
      prev.map((o) =>
        o.id === selectedOrg.id ? { ...o, membersCount: Math.max(0, o.membersCount - 1) } : o
      )
    );

    toast.success(`Member "${selectedMember.name}" removed from ${selectedOrg.name}.`);
    setShowRemoveMemberModal(false);
  };

  const handleResendInvitation = (member: OrgMemberItem) => {
    toast.success(`Invitation re-sent to ${member.email}`);
  };

  // Settings Tab Inline Edit Handlers
  const handleStartInlineSettingsEdit = () => {
    if (!selectedOrg) return;
    setSettingsFormName(selectedOrg.name);
    setSettingsFormDescription(selectedOrg.description || "");
    setSettingsMaxBudget(selectedOrg.maxBudget.toString());
    setSettingsSoftBudget((selectedOrg.maxBudget * 0.8).toString());
    setSettingsResetCycle(selectedOrg.resetCycle);
    setSettingsTpmLimit(selectedOrg.tpmLimit.toString());
    setSettingsRpmLimit(selectedOrg.rpmLimit.toString());
    setSettingsFormTouched(false);
    setIsSettingsEditMode(true);
  };

  const handleSaveInlineSettings = () => {
    setSettingsFormTouched(true);
    if (!selectedOrg || !settingsFormName.trim()) {
      toast.error("Organization Name is required.");
      return;
    }

    const updatedOrg: OrganizationItem = {
      ...selectedOrg,
      name: settingsFormName.trim(),
      description: settingsFormDescription.trim(),
      maxBudget: parseFloat(settingsMaxBudget) || 0,
      resetCycle: settingsResetCycle,
      tpmLimit: parseInt(settingsTpmLimit) || 500000,
      rpmLimit: parseInt(settingsRpmLimit) || 5000,
    };

    setSelectedOrg(updatedOrg);
    setOrganizations((prev) => prev.map((o) => (o.id === selectedOrg.id ? updatedOrg : o)));
    toast.success(`Settings for "${updatedOrg.name}" updated successfully!`);
    setIsSettingsEditMode(false);
  };

  const handleCancelInlineSettings = () => {
    setIsSettingsEditMode(false);
  };

  // Dynamic KPI Summary Stats
  const kpiStats = useMemo(() => {
    const totalOrgs = organizations.length;
    const activeOrgs = organizations.filter((o) => o.status === "Active").length;
    const totalMembers = organizations.reduce((sum, o) => sum + o.membersCount, 0);
    const totalBudget = organizations.reduce((sum, o) => sum + o.maxBudget, 0);
    const configuredModelsCount = AVAILABLE_MODELS.length;

    return [
      {
        id: "total-orgs",
        label: "Total Organizations",
        value: totalOrgs.toString(),
        subValue: `${activeOrgs} Active in Gateway`,
      },
      {
        id: "active-orgs",
        label: "Active Organizations",
        value: activeOrgs.toString(),
        subValue: `${((activeOrgs / (totalOrgs || 1)) * 100).toFixed(0)}% Operational`,
      },
      {
        id: "total-members",
        label: "Total Members",
        value: totalMembers.toString(),
        subValue: "Assigned Across Orgs",
      },
      {
        id: "configured-models",
        label: "Configured Models",
        value: configuredModelsCount.toString(),
        subValue: "Available in Catalog",
      },
      {
        id: "total-budget",
        label: "Total Budget Allocated",
        value: `$${totalBudget.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        subValue: "Current Monthly Cap",
      },
    ];
  }, [organizations]);

  // Filtered Organizations
  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        org.name.toLowerCase().includes(query) ||
        org.orgId.toLowerCase().includes(query) ||
        (org.description && org.description.toLowerCase().includes(query));

      const matchesStatus = filterStatus === "All" || org.status === filterStatus;
      const matchesModel =
        filterModel === "All" ||
        org.assignedModels.includes("All Models") ||
        org.assignedModels.includes(filterModel);

      return matchesSearch && matchesStatus && matchesModel;
    });
  }, [organizations, searchQuery, filterStatus, filterModel]);

  // Sorted Organizations
  const sortedOrgs = useMemo(() => {
    return [...filteredOrgs].sort((a, b) => {
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
  }, [filteredOrgs, sortField, sortDirection]);

  // Paginated Organizations
  const paginatedOrgs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedOrgs.slice(start, start + pageSize);
  }, [sortedOrgs, currentPage, pageSize]);

  // Handlers
  const handleSort = (field: keyof OrganizationItem) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIndicator = (field: keyof OrganizationItem) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 font-bold" />
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedOrgs.map((o) => o.id)));
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

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedOrg(null);
    setFormName("");
    setFormDescription("");
    setFormTouched(false);
    setIsSubmitting(false);
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (org: OrganizationItem) => {
    setSelectedOrg(org);
    setIsEditMode(true);
    setFormName(org.name);
    setFormDescription(org.description || "");
    setFormTouched(false);
    setIsSubmitting(false);
    setShowCreateModal(true);
  };

  const handleSaveOrganization = () => {
    setFormTouched(true);

    if (!isFormValid) {
      if (isDuplicateName) {
        toast.error("An Organization with this name already exists.");
      } else {
        toast.error("Please fill in all required fields.");
      }
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (isEditMode && selectedOrg) {
        setOrganizations((prev) =>
          prev.map((o) =>
            o.id === selectedOrg.id
              ? {
                  ...o,
                  name: formName.trim(),
                  description: formDescription.trim(),
                }
              : o
          )
        );
        toast.success(`Organization "${formName.trim()}" updated successfully!`);
        setHighlightedOrgId(selectedOrg.id);
      } else {
        const newId = `org-${Date.now()}`;
        const newOrgItem: OrganizationItem = {
          id: newId,
          orgId: `org-${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          name: formName.trim(),
          description: formDescription.trim(),
          createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          currentSpend: 0,
          maxBudget: 5000,
          resetCycle: "Monthly",
          assignedModels: ["All Models"],
          tpmLimit: 500000,
          rpmLimit: 5000,
          membersCount: 1,
          status: "Active",
          createdBy: "hbadmin@yopmail.com",
        };
        setOrganizations((prev) => [newOrgItem, ...prev]);
        toast.success(`Organization "${formName.trim()}" created successfully!`);
        setHighlightedOrgId(newId);
      }

      setIsSubmitting(false);
      setShowCreateModal(false);

      setTimeout(() => {
        setHighlightedOrgId(null);
      }, 4000);
    }, 600);
  };

  const handleDeleteOrgSubmit = () => {
    if (!selectedOrg) return;
    setOrganizations((prev) => prev.filter((o) => o.id !== selectedOrg.id));
    toast.success(`Organization "${selectedOrg.name}" deleted permanently.`);
    setShowDeleteModal(false);
    if (viewState === "detail") setViewState("list");
  };

  const getBadgeStyle = (status: OrganizationItem["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Inactive":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700";
      case "Suspended":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    }
  };

  const renderStatusBadge = (status: OrganizationItem["status"]) => (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getBadgeStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">

      {/* ========================================================================= */}
      {/* SCREEN 1: ORGANIZATIONS LISTING TABLE                                     */}
      {/* ========================================================================= */}
      {viewState === "list" || !selectedOrg ? (
        <>
          <PageHeader
            pageId="organizations"
            action="list"
          >
            {/* 1. Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              placeholder="Search Organizations..."
            />

            {/* 2. Filter Button */}
            <IconButton
              icon={Filter}
              label="Filter"
              onClick={() => setShowFilterModal(true)}
              title="Filter Organizations"
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
              onClick={() => setShowExportModal(true)}
            />

            {/* 5. Refresh */}
            <IconButton
              icon={RefreshCw}
              label="Refresh"
              onClick={() => toast.success("Refreshed Organizations list")}
            />

            {/* 6. Show/Hide Summary Toggle */}
            <IconButton
              icon={showSummary ? EyeOff : BarChart3}
              label={showSummary ? "Hide Summary" : "Show Summary"}
              onClick={() => setShowSummary(!showSummary)}
              title={showSummary ? "Hide Summary Cards" : "Show Summary Cards"}
            />

            {/* 7. Create Organization Primary Button (Last Position) */}
            <PrimaryButton icon={Plus} onClick={handleOpenCreateModal}>
              Create Organization
            </PrimaryButton>
          </PageHeader>

          {/* Collapsible Summary Cards */}
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
                        checked={selectedIds.size === paginatedOrgs.length && paginatedOrgs.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>

                    {visibleColumns.name && (
                      <th 
                        onClick={() => handleSort("name")} 
                        className="py-3 px-4 cursor-pointer select-none group hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Organization Name</span>
                          {renderSortIndicator("name")}
                        </div>
                      </th>
                    )}

                    {visibleColumns.createdDate && <th className="py-3 px-4">Created Date</th>}
                    {visibleColumns.currentSpend && <th className="py-3 px-4">Spend / Budget</th>}
                    {visibleColumns.assignedModels && <th className="py-3 px-4">Assigned Models</th>}
                    {visibleColumns.rateLimits && <th className="py-3 px-4">Rate Limits (TPM/RPM)</th>}
                    {visibleColumns.membersCount && <th className="py-3 px-4">Members</th>}
                    {visibleColumns.status && <th className="py-3 px-4">Status</th>}

                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-neutral-800 dark:text-neutral-200">
                  {paginatedOrgs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-neutral-400 dark:text-neutral-500 space-y-3">
                        <Building2 className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-700 stroke-1" />
                        <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">No Organizations Found</div>
                        <p className="text-xs max-w-sm mx-auto">No organizations match your search query or filter selection.</p>
                        <PrimaryButton icon={Plus} onClick={handleOpenCreateModal}>
                          Create Organization
                        </PrimaryButton>
                      </td>
                    </tr>
                  ) : (
                    paginatedOrgs.map((item) => {
                      const isSelected = selectedIds.has(item.id);
                      const isMenuOpen = activeMenuId === item.id;
                      const isHighlighted = item.id === highlightedOrgId;
                      const spendPercent = item.maxBudget > 0 ? Math.min(100, (item.currentSpend / item.maxBudget) * 100) : 0;

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

                          {/* Organization Name & ID Column */}
                          {visibleColumns.name && (
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                <button
                                  onClick={() => {
                                    setSelectedOrg(item);
                                    setViewState("detail");
                                  }}
                                  className="font-bold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 hover:underline transition-colors text-left block"
                                >
                                  {item.name}
                                </button>
                                <div className="flex items-center gap-1 font-mono text-[11px] text-neutral-400">
                                  <span>{item.orgId}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyText(item.orgId, "Copied Organization ID!")}
                                    className="hover:text-primary-600 transition-colors p-0.5"
                                    title="Copy Org ID"
                                  >
                                    {copiedId === item.orgId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              </div>
                            </td>
                          )}

                          {visibleColumns.createdDate && <td className="py-3.5 px-4 text-neutral-500">{item.createdDate}</td>}

                          {/* Spend / Budget Progress Column */}
                          {visibleColumns.currentSpend && (
                            <td className="py-3.5 px-4 min-w-[140px]">
                              <div className="space-y-1 font-mono text-[11px]">
                                <div className="flex justify-between font-medium">
                                  <span>${item.currentSpend.toFixed(2)}</span>
                                  <span className="text-neutral-400">{item.maxBudget === 0 ? "Unlimited" : `$${item.maxBudget.toFixed(2)}`}</span>
                                </div>
                                {item.maxBudget > 0 && (
                                  <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full transition-all ${spendPercent > 90 ? "bg-rose-500" : spendPercent > 70 ? "bg-amber-500" : "bg-primary-600"}`} 
                                      style={{ width: `${spendPercent}%` }} 
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                          )}

                          {/* Assigned Models Chips Column */}
                          {visibleColumns.assignedModels && (
                            <td className="py-3.5 px-4 max-w-[180px]">
                              <div className="flex flex-wrap gap-1">
                                {item.assignedModels.slice(0, 3).map((m) => (
                                  <span key={m} className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200/50">
                                    {m}
                                  </span>
                                ))}
                                {item.assignedModels.length > 3 && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-950/60 text-[11px] font-bold text-primary-700 dark:text-primary-300">
                                    +{item.assignedModels.length - 3} More
                                  </span>
                                )}
                              </div>
                            </td>
                          )}

                          {/* Rate Limits Column */}
                          {visibleColumns.rateLimits && (
                            <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                              <div>TPM: {item.tpmLimit.toLocaleString()}</div>
                              <div>RPM: {item.rpmLimit.toLocaleString()}</div>
                            </td>
                          )}

                          {/* Members Column */}
                          {visibleColumns.membersCount && (
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrg(item);
                                  setDetailTab("members");
                                  setViewState("detail");
                                }}
                                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>{item.membersCount} Members</span>
                              </button>
                            </td>
                          )}

                          {/* Status Badge */}
                          {visibleColumns.status && (
                            <td className="py-3.5 px-4">{renderStatusBadge(item.status)}</td>
                          )}

                          {/* Actions Three-Dot Menu */}
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
                                    setSelectedOrg(item);
                                    setViewState("detail");
                                  }}
                                  className="w-full px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                                >
                                  <Eye className="w-3.5 h-3.5 text-neutral-500" />
                                  <span>View Organization</span>
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
                                  <span>Edit Settings</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setSelectedOrg(item);
                                    setDetailTab("members");
                                    setViewState("detail");
                                  }}
                                  className="w-full px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                                >
                                  <Users className="w-3.5 h-3.5 text-neutral-500" />
                                  <span>Members ({item.membersCount})</span>
                                </button>

                                <hr className="my-1 border-neutral-100 dark:border-neutral-800" />

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setSelectedOrg(item);
                                    setShowDeleteModal(true);
                                  }}
                                  className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
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
                totalPages={Math.ceil(filteredOrgs.length / pageSize) || 1}
                totalItems={filteredOrgs.length}
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
        /* SCREEN 2: ORGANIZATION DETAIL VIEW PAGE                                   */
        /* ========================================================================= */
        selectedOrg && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Navigation & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setViewState("list")}
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Organizations
              </button>

              <div className="flex items-center gap-2 relative">
                <button
                  type="button"
                  onClick={() => setShowHeaderActionsMenu(!showHeaderActionsMenu)}
                  className="px-3.5 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Organization Actions"
                >
                  <MoreVertical className="w-4 h-4 text-neutral-500" />
                  <span>Actions</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {showHeaderActionsMenu && (
                  <div className="absolute right-0 top-11 z-30 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1.5 text-left text-xs animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => {
                        setShowHeaderActionsMenu(false);
                        handleOpenEditModal(selectedOrg);
                      }}
                      className="w-full px-3.5 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Edit Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowHeaderActionsMenu(false);
                        toast.info("Viewing Audit Logs for " + selectedOrg.name);
                      }}
                      className="w-full px-3.5 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-500" />
                      <span>View Audit Logs</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowHeaderActionsMenu(false);
                        toast.success(`Organization "${selectedOrg.name}" archived.`);
                      }}
                      className="w-full px-3.5 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Archive Organization</span>
                    </button>

                    <hr className="my-1 border-neutral-100 dark:border-neutral-800" />

                    <button
                      type="button"
                      onClick={() => {
                        setShowHeaderActionsMenu(false);
                        setShowDeleteModal(true);
                      }}
                      className="w-full px-3.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Organization</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Header Summary Card */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      {selectedOrg.name}
                    </h2>
                    {renderStatusBadge(selectedOrg.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono min-w-0">
                    <span className="truncate max-w-[320px]" title={selectedOrg.orgId}>
                      Org ID: {selectedOrg.orgId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedOrg.orgId, "Copied Organization ID!")}
                      className="text-neutral-400 hover:text-primary-600 transition-colors p-1 shrink-0"
                      title="Copy Org ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <div className="text-neutral-400 font-medium">Accumulated Spend</div>
                    <div className="text-lg font-bold text-neutral-900 dark:text-white font-mono">${selectedOrg.currentSpend.toFixed(2)}</div>
                  </div>
                  <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />
                  <div className="text-right">
                    <div className="text-neutral-400 font-medium">Max Budget Cap</div>
                    <div className="text-lg font-bold text-neutral-900 dark:text-white font-mono">{selectedOrg.maxBudget === 0 ? "Unlimited" : `$${selectedOrg.maxBudget.toFixed(2)}`}</div>
                  </div>
                </div>
              </div>

              {/* Metadata Header Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">Created By</div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate" title={selectedOrg.createdBy}>{selectedOrg.createdBy}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">Created Date</div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedOrg.createdDate}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">Reset Cycle</div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedOrg.resetCycle}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">TPM / RPM Limits</div>
                  <div className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">{selectedOrg.tpmLimit.toLocaleString()} / {selectedOrg.rpmLimit.toLocaleString()}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-neutral-400 font-medium mb-1">Members</div>
                  <div className="font-semibold text-primary-600">{selectedOrg.membersCount} Active Members</div>
                </div>
              </div>
            </div>

            {/* Standard HB Horizontal Tabs */}
            <div className="border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
              <div className="flex gap-6 text-xs font-semibold min-w-max">
                {(["overview", "members", "settings"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab as any)}
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

            {/* OVERVIEW TAB — 7 RESPONSIVE DASHBOARD CARDS */}
            {detailTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                {/* CARD 1 — ORGANIZATION INFORMATION */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow space-y-3.5">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                    <Building2 className="w-4 h-4 text-primary-600" />
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                      Organization Information
                    </h3>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-medium">Organization Name:</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{selectedOrg.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-medium">Organization ID:</span>
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <span className="truncate max-w-[120px]">{selectedOrg.orgId}</span>
                        <button type="button" onClick={() => handleCopyText(selectedOrg.orgId, "Copied Organization ID!")} title="Copy Org ID">
                          <Copy className="w-3 h-3 text-neutral-400 hover:text-primary-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-medium">Created Date:</span>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">{selectedOrg.createdDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-medium">Created By:</span>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300 truncate max-w-[140px]">{selectedOrg.createdBy}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-medium">Status:</span>
                      {renderStatusBadge(selectedOrg.status)}
                    </div>
                  </div>
                </div>

                {/* CARD 2 — BUDGET SUMMARY */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                        Budget Summary
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50">
                      {selectedOrg.resetCycle} Reset
                    </span>
                  </div>
                  <div className="space-y-2.5 font-mono">
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Current Spend:</span>
                      <span className="font-bold text-neutral-900 dark:text-white">${selectedOrg.currentSpend.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Allocated Budget:</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{selectedOrg.maxBudget === 0 ? "Unlimited" : `$${selectedOrg.maxBudget.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Remaining Budget:</span>
                      <span className="font-bold text-emerald-600">{selectedOrg.maxBudget === 0 ? "Unlimited" : `$${Math.max(0, selectedOrg.maxBudget - selectedOrg.currentSpend).toFixed(2)}`}</span>
                    </div>
                    {selectedOrg.maxBudget > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-600 rounded-full transition-all" 
                            style={{ width: `${Math.min(100, (selectedOrg.currentSpend / selectedOrg.maxBudget) * 100)}%` }} 
                          />
                        </div>
                        <div className="text-[10px] text-right text-neutral-400">
                          {((selectedOrg.currentSpend / selectedOrg.maxBudget) * 100).toFixed(1)}% Used
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CARD 3 — RATE LIMITS */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow space-y-3.5">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                      Rate Limits
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg text-center">
                      <div className="text-neutral-400 text-[10px] font-semibold uppercase">TPM Limit</div>
                      <div className="text-lg font-bold text-neutral-900 dark:text-white font-mono mt-0.5">
                        {selectedOrg.tpmLimit ? selectedOrg.tpmLimit.toLocaleString() : "Unlimited"}
                      </div>
                    </div>
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg text-center">
                      <div className="text-neutral-400 text-[10px] font-semibold uppercase">RPM Limit</div>
                      <div className="text-lg font-bold text-neutral-900 dark:text-white font-mono mt-0.5">
                        {selectedOrg.rpmLimit ? selectedOrg.rpmLimit.toLocaleString() : "Unlimited"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 4 — TEAMS */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                        Assigned Teams
                      </h3>
                    </div>
                    <span className="font-bold text-xs text-primary-600">3 Teams</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-neutral-50 dark:bg-neutral-800/40 rounded text-neutral-800 dark:text-neutral-200 font-medium">DevOps Core</div>
                    <div className="p-2 bg-neutral-50 dark:bg-neutral-800/40 rounded text-neutral-800 dark:text-neutral-200 font-medium">AI Research Lab</div>
                    <div className="p-2 bg-neutral-50 dark:bg-neutral-800/40 rounded text-neutral-800 dark:text-neutral-200 font-medium">Security Ops</div>
                  </div>
                  <div className="pt-1 text-right">
                    <button 
                      type="button" 
                      onClick={() => toast.info("Navigating to Teams module filtered by " + selectedOrg.name)}
                      className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      View All Teams →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MEMBERS TAB IMPLEMENTATION */}
            {detailTab === "members" && (
              <div className="space-y-4 text-xs animate-fadeIn">
                {/* Members Action Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 shadow-2xs">
                  <div className="flex items-center gap-2 flex-1">
                    <SearchBar
                      value={memberSearchQuery}
                      onChange={(val) => setMemberSearchQuery(val)}
                      placeholder="Search Members by Name, Email, or User ID..."
                    />
                    <select
                      value={memberFilterRole}
                      onChange={(e) => setMemberFilterRole(e.target.value)}
                      className="h-9 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium"
                    >
                      <option value="All">All Roles</option>
                      <option value="Organization Admin">Organization Admin</option>
                      <option value="Internal User">Internal User</option>
                      <option value="Internal User Viewer">Internal User Viewer</option>
                    </select>
                    <select
                      value={memberFilterStatus}
                      onChange={(e) => setMemberFilterStatus(e.target.value)}
                      className="h-9 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending Invitation">Pending Invitation</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <IconButton
                      icon={showMemberSummary ? EyeOff : BarChart3}
                      label={showMemberSummary ? "Hide Summary" : "Show Summary"}
                      onClick={() => setShowMemberSummary(!showMemberSummary)}
                      title="Toggle Member Summary Cards"
                    />
                    <IconButton
                      icon={Download}
                      label="Export"
                      onClick={() => toast.success("Exported Members list to CSV")}
                    />
                    <IconButton
                      icon={RefreshCw}
                      label="Refresh"
                      onClick={() => toast.success("Refreshed Organization Members")}
                    />
                    <PrimaryButton icon={Plus} onClick={handleOpenAddMemberModal}>
                      Add Member
                    </PrimaryButton>
                  </div>
                </div>

                {/* Compact Members KPI Summary Cards */}
                {showMemberSummary && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeIn">
                    {memberKpiStats.map((stat) => (
                      <div key={stat.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 shadow-2xs">
                        <div className="text-neutral-400 text-[11px] font-medium">{stat.label}</div>
                        <div className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Members Table */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-neutral-50/80 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold">
                          <th className="py-3 px-4 w-10">
                            <input
                              type="checkbox"
                              checked={selectedMemberIds.size === filteredMembers.length && filteredMembers.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMemberIds(new Set(filteredMembers.map((m) => m.id)));
                                } else {
                                  setSelectedMemberIds(new Set());
                                }
                              }}
                              className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                            />
                          </th>
                          <th className="py-3 px-4">User Information</th>
                          <th className="py-3 px-4">Organization Role</th>
                          <th className="py-3 px-4">Current Spend</th>
                          <th className="py-3 px-4">Joined Date</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-neutral-800 dark:text-neutral-200">
                        {filteredMembers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-neutral-400 space-y-3">
                              <Users className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-700 stroke-1" />
                              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">No Members Added</div>
                              <p className="text-xs max-w-sm mx-auto">No members match your search or filter selection in this organization.</p>
                              <PrimaryButton icon={Plus} onClick={handleOpenAddMemberModal}>
                                Add Member
                              </PrimaryButton>
                            </td>
                          </tr>
                        ) : (
                          filteredMembers.map((mem) => {
                            const isMenuOpen = activeMemberMenuId === mem.id;
                            const isSelected = selectedMemberIds.has(mem.id);

                            return (
                              <tr key={mem.id} className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors ${isSelected ? "bg-primary-50/30" : ""}`}>
                                <td className="py-3.5 px-4">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const next = new Set(selectedMemberIds);
                                      if (e.target.checked) next.add(mem.id);
                                      else next.delete(mem.id);
                                      setSelectedMemberIds(next);
                                    }}
                                    className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                  />
                                </td>

                                {/* User Information Column (3 Lines) */}
                                <td className="py-3.5 px-4">
                                  <div className="space-y-0.5">
                                    <div className="font-bold text-neutral-900 dark:text-white">{mem.name}</div>
                                    <div className="text-neutral-500 text-[11px]">{mem.email}</div>
                                    <div className="flex items-center gap-1 font-mono text-[10px] text-neutral-400">
                                      <span>User ID: {mem.userId}</span>
                                      <button type="button" onClick={() => handleCopyText(mem.userId, "Copied User ID!")} title="Copy User ID">
                                        <Copy className="w-3 h-3 hover:text-primary-600" />
                                      </button>
                                    </div>
                                  </div>
                                </td>

                                {/* Organization Role Badge */}
                                <td className="py-3.5 px-4">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                                    mem.role === "Organization Admin"
                                      ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200"
                                      : mem.role === "Internal User"
                                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200"
                                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200"
                                  }`}>
                                    {mem.role}
                                  </span>
                                </td>

                                {/* Current Spend */}
                                <td className="py-3.5 px-4 font-mono font-medium text-neutral-700 dark:text-neutral-300">
                                  {mem.currentSpend > 0 ? `$${mem.currentSpend.toFixed(2)}` : "—"}
                                </td>

                                {/* Joined Date */}
                                <td className="py-3.5 px-4 text-neutral-500">{mem.joinedDate}</td>

                                {/* Status Badge */}
                                <td className="py-3.5 px-4">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                    mem.status === "Active"
                                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200"
                                      : mem.status === "Pending Invitation"
                                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200"
                                      : "bg-neutral-100 text-neutral-600 border-neutral-200"
                                  }`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {mem.status}
                                  </span>
                                </td>

                                {/* Actions Menu */}
                                <td className="py-3.5 px-4 text-right relative">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMemberMenuId(isMenuOpen ? null : mem.id);
                                    }}
                                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  {isMenuOpen && (
                                    <div className="absolute right-4 top-10 z-30 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1.5 text-left text-xs animate-fadeIn">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveMemberMenuId(null);
                                          handleOpenEditMemberModal(mem);
                                        }}
                                        className="w-full px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                                      >
                                        <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                                        <span>Edit Member / Role</span>
                                      </button>

                                      {mem.status === "Pending Invitation" && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveMemberMenuId(null);
                                            handleResendInvitation(mem);
                                          }}
                                          className="w-full px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                                        >
                                          <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                                          <span>Resend Invitation</span>
                                        </button>
                                      )}

                                      <hr className="my-1 border-neutral-100 dark:border-neutral-800" />

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveMemberMenuId(null);
                                          setSelectedMember(mem);
                                          setShowRemoveMemberModal(true);
                                        }}
                                        className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Remove Member</span>
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
              </div>
            )}

            {/* SETTINGS TAB IMPLEMENTATION (VIEW MODE + INLINE EDIT MODE) */}
            {detailTab === "settings" && (
              <div className="space-y-6 text-xs animate-fadeIn">
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs">
                  <div>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                      <Lock className="w-4.5 h-4.5 text-primary-600" />
                      Organization Settings & Configuration
                      {isSettingsEditMode && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300">
                          Inline Edit Mode Active
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {isSettingsEditMode
                        ? "Modify organization settings below and click Save Changes to persist."
                        : "View enterprise budgets, permitted models, rate limits, and object permissions."}
                    </p>
                  </div>

                  {!isSettingsEditMode && (
                    <PrimaryButton icon={Edit3} onClick={handleStartInlineSettingsEdit}>
                      Edit Settings
                    </PrimaryButton>
                  )}
                </div>

                {/* VIEW MODE CARDS */}
                {!isSettingsEditMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* CARD 1 — BASIC INFORMATION */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow space-y-3.5">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                        <Building2 className="w-4 h-4 text-primary-600" />
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Basic Information</h4>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400 font-medium">Organization Name:</span>
                          <span className="font-semibold text-neutral-900 dark:text-white">{selectedOrg.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400 font-medium">Organization ID:</span>
                          <div className="flex items-center gap-1 font-mono text-[11px]">
                            <span className="truncate max-w-[120px]">{selectedOrg.orgId}</span>
                            <button type="button" onClick={() => handleCopyText(selectedOrg.orgId, "Copied Organization ID!")} title="Copy Org ID">
                              <Copy className="w-3 h-3 text-neutral-400 hover:text-primary-600" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400 font-medium">Created Date:</span>
                          <span className="font-semibold text-neutral-700 dark:text-neutral-300">{selectedOrg.createdDate}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400 font-medium">Created By:</span>
                          <span className="font-semibold text-neutral-700 dark:text-neutral-300 truncate max-w-[140px]">{selectedOrg.createdBy}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400 font-medium">Status:</span>
                          {renderStatusBadge(selectedOrg.status)}
                        </div>
                      </div>
                    </div>

                    {/* CARD 2 — BUDGET CONFIGURATION */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow space-y-3.5">
                      <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-emerald-600" />
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Budget Configuration</h4>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50">
                          {selectedOrg.resetCycle} Reset
                        </span>
                      </div>
                      <div className="space-y-2.5 font-mono">
                        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                          <span>Max Budget:</span>
                          <span className="font-bold text-neutral-900 dark:text-white">{selectedOrg.maxBudget === 0 ? "Unlimited" : `$${selectedOrg.maxBudget.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                          <span>Soft Budget (80%):</span>
                          <span className="font-bold text-neutral-900 dark:text-white">{selectedOrg.maxBudget === 0 ? "Unlimited" : `$${(selectedOrg.maxBudget * 0.8).toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                          <span>Current Spend:</span>
                          <span className="font-bold text-neutral-900 dark:text-white">${selectedOrg.currentSpend.toFixed(2)}</span>
                        </div>
                        {selectedOrg.maxBudget > 0 && (
                          <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-primary-600 rounded-full" style={{ width: `${Math.min(100, (selectedOrg.currentSpend / selectedOrg.maxBudget) * 100)}%` }} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CARD 3 — RATE LIMITS */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow space-y-3.5">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Rate Limits</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg text-center">
                          <div className="text-neutral-400 text-[10px] font-semibold uppercase">TPM Limit</div>
                          <div className="text-base font-bold text-neutral-900 dark:text-white font-mono mt-0.5">
                            {selectedOrg.tpmLimit ? selectedOrg.tpmLimit.toLocaleString() : "Unlimited"}
                          </div>
                        </div>
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg text-center">
                          <div className="text-neutral-400 text-[10px] font-semibold uppercase">RPM Limit</div>
                          <div className="text-base font-bold text-neutral-900 dark:text-white font-mono mt-0.5">
                            {selectedOrg.rpmLimit ? selectedOrg.rpmLimit.toLocaleString() : "Unlimited"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* INLINE EDIT MODE FORM LAYOUT */
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-lg p-6 space-y-6 animate-fadeIn">
                    {/* Section 1 — Basic Information */}
                    <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                        <Building2 className="w-4 h-4 text-primary-600" />
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Basic Information</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 md:col-span-2">
                          <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                            Organization Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={settingsFormName}
                            onChange={(e) => setSettingsFormName(e.target.value)}
                            placeholder="Organization Name"
                            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                            Description
                          </label>
                          <textarea
                            value={settingsFormDescription}
                            onChange={(e) => setSettingsFormDescription(e.target.value)}
                            rows={2}
                            className="w-full p-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2 — Budget */}
                    <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Budget Configuration</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Max Budget ($)</label>
                          <input
                            type="number"
                            value={settingsMaxBudget}
                            onChange={(e) => setSettingsMaxBudget(e.target.value)}
                            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Soft Budget Limit ($)</label>
                          <input
                            type="number"
                            value={settingsSoftBudget}
                            onChange={(e) => setSettingsSoftBudget(e.target.value)}
                            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Reset Cycle</label>
                          <select
                            value={settingsResetCycle}
                            onChange={(e) => setSettingsResetCycle(e.target.value as any)}
                            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium"
                          >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Yearly">Yearly</option>
                            <option value="Never">Never</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Section 3 — Rate Limits */}
                    <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Rate Limits</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block font-semibold text-neutral-800 dark:text-neutral-200">TPM Limit</label>
                          <input
                            type="number"
                            value={settingsTpmLimit}
                            onChange={(e) => setSettingsTpmLimit(e.target.value)}
                            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-semibold text-neutral-800 dark:text-neutral-200">RPM Limit</label>
                          <input
                            type="number"
                            value={settingsRpmLimit}
                            onChange={(e) => setSettingsRpmLimit(e.target.value)}
                            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sticky Footer Bar */}
                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between sticky bottom-0 bg-white dark:bg-neutral-900 p-2 shadow-lg rounded-b-xl">
                      <button
                        type="button"
                        onClick={handleCancelInlineSettings}
                        className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
                      >
                        Cancel
                      </button>
                      <PrimaryButton onClick={handleSaveInlineSettings}>
                        Save Changes
                      </PrimaryButton>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      )}

      {/* ========================================================================= */}
      {/* 6-SECTION ENTERPRISE CREATE ORGANIZATION MODAL                             */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden my-auto">
            {/* Modal Sticky Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    {isEditMode ? "Edit Organization Settings" : "Create Organization"}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                      Enterprise Config
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Create an organization and configure default budgets, models, rate limits, and object permissions.
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
                    Basic Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Organization Name */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Organization Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Enter Organization Name (e.g. Spine CloudIQ)"
                      maxLength={100}
                      className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                        formTouched && (!formName.trim() || isDuplicateName)
                          ? "border-rose-500 focus:ring-rose-500/20"
                          : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20"
                      }`}
                    />
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      {formName.trim() === "" && formTouched ? (
                        <span className="text-rose-500 font-medium">Organization Name is required.</span>
                      ) : isDuplicateName ? (
                        <span className="text-rose-500 font-medium">An Organization with this name already exists.</span>
                      ) : (
                        <span className="text-neutral-400">Must be unique across your Gateway instance.</span>
                      )}
                      <span className="text-neutral-400 font-mono">{formName.length}/100</span>
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
                      placeholder="Describe the department, unit, or team scope of this organization..."
                      maxLength={300}
                      rows={2}
                      className="w-full p-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
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
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>

              <PrimaryButton
                onClick={handleSaveOrganization}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting
                  ? "Saving Organization..."
                  : isEditMode
                  ? "Update Organization"
                  : "Create Organization"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* FILTER DRAWER MODAL */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6">
            <div className="space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary-600" />
                  Filter Organizations
                </h3>
                <button type="button" onClick={() => setShowFilterModal(false)}>
                  <X className="w-5 h-5 text-neutral-400 hover:text-neutral-700" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Assigned Model</label>
                  <select
                    value={filterModel}
                    onChange={(e) => setFilterModel(e.target.value)}
                    className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  >
                    <option value="All">All Models</option>
                    {AVAILABLE_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setFilterStatus("All");
                  setFilterModel("All");
                  setSearchQuery("");
                }}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-lg"
              >
                Reset
              </button>
              <PrimaryButton onClick={() => setShowFilterModal(false)}>
                Apply Filters
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-primary-600" />
                Export Organizations
              </h3>
              <button type="button" onClick={() => setShowExportModal(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  toast.success(`Exported ${filteredOrgs.length} Organizations to CSV!`);
                  setShowExportModal(false);
                }}
                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-primary-50 font-medium text-left flex items-center justify-between border"
              >
                <span>Export as CSV File</span>
                <Download className="w-4 h-4 text-neutral-400" />
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success(`Exported ${filteredOrgs.length} Organizations to Excel!`);
                  setShowExportModal(false);
                }}
                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-primary-50 font-medium text-left flex items-center justify-between border"
              >
                <span>Export as Excel Spreadsheet</span>
                <Download className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-rose-200 dark:border-rose-900 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Delete Organization?
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Are you sure you want to permanently delete <strong>"{selectedOrg.name}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteOrgSubmit}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
              >
                Delete Organization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL (800-900px Width, Centered, Sticky Footer) */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[85vh] overflow-hidden my-auto">
            {/* Modal Sticky Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 text-primary-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Add Organization Member
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Invite an existing user and assign an organization role.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs custom-scrollbar">
              {/* USER SELECTION */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-600" />
                    Select User
                  </h4>

                  {/* Toggle between Email and User ID Lookup */}
                  <div className="flex bg-neutral-200 dark:bg-neutral-800 p-0.5 rounded-lg text-[11px]">
                    <button
                      type="button"
                      onClick={() => setUserLookupMethod("email")}
                      className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                        userLookupMethod === "email"
                          ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                          : "text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      Search by Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserLookupMethod("userId")}
                      className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                        userLookupMethod === "userId"
                          ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                          : "text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      Search by User ID
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {userLookupMethod === "email" ? (
                    <div className="space-y-1">
                      <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                        User Email Address <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={selectedUserEmail}
                        onChange={(e) => {
                          setSelectedUserEmail(e.target.value);
                          const matched = mockSystemUsers.find((u) => u.email === e.target.value);
                          if (matched) setSelectedUserId(matched.id);
                        }}
                        className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-medium text-neutral-900 dark:text-white focus:outline-none ${
                          isDuplicateMember ? "border-rose-500 focus:ring-rose-500/20" : "border-neutral-300 dark:border-neutral-700"
                        }`}
                      >
                        {mockSystemUsers.map((u) => (
                          <option key={u.id} value={u.email}>
                            {u.name} ({u.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                        User ID <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={selectedUserId}
                        onChange={(e) => {
                          setSelectedUserId(e.target.value);
                          const matched = mockSystemUsers.find((u) => u.id === e.target.value);
                          if (matched) setSelectedUserEmail(matched.email);
                        }}
                        className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono font-medium text-neutral-900 dark:text-white focus:outline-none ${
                          isDuplicateMember ? "border-rose-500 focus:ring-rose-500/20" : "border-neutral-300 dark:border-neutral-700"
                        }`}
                      >
                        {mockSystemUsers.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.id} — {u.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Inline Duplicate Validation Message */}
                  {isDuplicateMember && (
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>This user is already an active member of {selectedOrg?.name}.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ORGANIZATION ROLE */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Organization Role
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Select Organization Role <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedMemberRole}
                      onChange={(e) => setSelectedMemberRole(e.target.value as any)}
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold"
                    >
                      <option value="Organization Admin">Organization Admin</option>
                      <option value="Internal User">Internal User</option>
                      <option value="Internal User Viewer">Internal User Viewer</option>
                    </select>
                  </div>

                  {/* Dynamic Role Description Box */}
                  <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-primary-600" />
                      <span>{selectedMemberRole} Permission Scope</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {selectedMemberRole === "Organization Admin"
                        ? "Can manage organization settings, members, models, rate limits, and allocated budgets."
                        : selectedMemberRole === "Internal User"
                        ? "Can create and manage their own Virtual Keys within organization budgets and rate limits."
                        : "Read-only access to assigned organization resources and reporting dashboards."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/80 dark:bg-neutral-900/80">
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>

              <PrimaryButton
                onClick={handleSaveAddMember}
                disabled={!isAddMemberFormValid}
              >
                Add Member
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {showEditMemberModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-primary-600" />
                Edit Member Role
              </h3>
              <button type="button" onClick={() => setShowEditMemberModal(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Read-Only Member Information */}
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg space-y-1 font-mono">
                <div className="font-bold text-neutral-900 dark:text-white">{selectedMember.name}</div>
                <div className="text-neutral-500 text-[11px]">{selectedMember.email}</div>
                <div className="text-neutral-400 text-[10px]">User ID: {selectedMember.userId}</div>
              </div>

              {/* Editable Role Selection */}
              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Organization Role
                </label>
                <select
                  value={selectedMemberRole}
                  onChange={(e) => setSelectedMemberRole(e.target.value as any)}
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold"
                >
                  <option value="Organization Admin">Organization Admin</option>
                  <option value="Internal User">Internal User</option>
                  <option value="Internal User Viewer">Internal User Viewer</option>
                </select>
                <p className="text-neutral-500 text-[11px]">
                  {selectedMemberRole === "Organization Admin"
                    ? "Can manage organization settings, members, and resources."
                    : selectedMemberRole === "Internal User"
                    ? "Can create and manage their own Virtual Keys."
                    : "Read-only access to their assigned resources."}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditMemberModal(false)}
                className="px-4 py-2 border border-neutral-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <PrimaryButton onClick={handleSaveEditMember}>
                Save Changes
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE MEMBER CONFIRMATION MODAL */}
      {showRemoveMemberModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-rose-200 dark:border-rose-900 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Remove Organization Member?
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Are you sure you want to remove <strong>"{selectedMember.name}"</strong>? This member will lose access to this organization.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowRemoveMemberModal(false)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemoveMemberSubmit}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
