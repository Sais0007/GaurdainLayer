import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Users,
  UserCheck,
  ShieldCheck,
  KeyRound,
  Building2,
  Search,
  Filter,
  Plus,
  Upload,
  UserPlus,
  Edit,
  MoreVertical,
  CheckSquare,
  X,
  RefreshCw,
  Download,
  Columns,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  Copy,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  ChevronDown,
  SlidersHorizontal,
  AlertCircle,
  Sparkles,
  Key,
  RotateCcw,
  Info,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Loader2,
  Sliders,
  Settings,
  Edit3
} from 'lucide-react';
import { PageHeader, PrimaryButton, SecondaryButton, IconButton } from './hb/listing';
import { toast } from 'sonner';
import UserDetail from './UserDetail';
import UserEdit from './UserEdit';
import { UserStatusModal } from './UserStatusModal';
import { User } from '../../mockAPI/usersData';

export interface InternalUser {
  id: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'Admin' | 'Org Admin' | 'Internal User' | 'Developer' | 'Viewer';
  userAlias: string;
  spendUsd: number;
  budgetUsd: number | null; // null represents Unlimited
  ssoId: string;
  virtualKeysCount: number;
  createdAt: string;
  updatedAt: string;
  organization: string;
  team: string;
}

export const INITIAL_INTERNAL_USERS: InternalUser[] = [
  {
    id: "usr-lite-8f9a2b",
    email: "hbadmin@yopmail.com",
    status: "active",
    role: "Admin",
    userAlias: "HB Admin",
    spendUsd: 142.50,
    budgetUsd: 500.00,
    ssoId: "sso-okta-8f9a",
    virtualKeysCount: 2,
    createdAt: "2024-01-15",
    updatedAt: "2026-07-20",
    organization: "HB Enterprise",
    team: "AI Research",
  },
  {
    id: "usr-lite-512360",
    email: "superadmin@spinecloudiq.com",
    status: "active",
    role: "Admin",
    userAlias: "Super Admin",
    spendUsd: 1150.00,
    budgetUsd: 1200.00,
    ssoId: "sso-azure-5123",
    virtualKeysCount: 1,
    createdAt: "2024-02-20",
    updatedAt: "2026-07-25",
    organization: "Spine CloudIQ",
    team: "DevOps Core",
  },
  {
    id: "usr-lite-9bb7a7",
    email: "alex.dev@hbenterprise.com",
    status: "active",
    role: "Developer",
    userAlias: "Alex Dev",
    spendUsd: 48.20,
    budgetUsd: null, // Unlimited
    ssoId: "sso-google-9bb7",
    virtualKeysCount: 0,
    createdAt: "2024-03-01",
    updatedAt: "2026-06-14",
    organization: "HB Enterprise",
    team: "AI Research",
  },
  {
    id: "usr-lite-3c819d",
    email: "sarah.lead@hbenterprise.com",
    status: "active",
    role: "Org Admin",
    userAlias: "Sarah Lead",
    spendUsd: 890.00,
    budgetUsd: 1000.00,
    ssoId: "sso-okta-3c81",
    virtualKeysCount: 3,
    createdAt: "2024-03-12",
    updatedAt: "2026-07-26",
    organization: "HB Enterprise",
    team: "QA Testing",
  },
  {
    id: "usr-lite-7e21a4",
    email: "ops.admin@cybershield.com",
    status: "inactive",
    role: "Org Admin",
    userAlias: "Ops Admin",
    spendUsd: 0.00,
    budgetUsd: null,
    ssoId: "sso-ping-7e21",
    virtualKeysCount: 1,
    createdAt: "2024-04-05",
    updatedAt: "2026-05-10",
    organization: "CyberShield Ltd",
    team: "Infrastructure",
  },
  {
    id: "usr-lite-12f84b",
    email: "finance.lead@fintech.com",
    status: "active",
    role: "Internal User",
    userAlias: "Finance Lead",
    spendUsd: 2410.50,
    budgetUsd: 3000.00,
    ssoId: "sso-azure-12f8",
    virtualKeysCount: 4,
    createdAt: "2024-04-18",
    updatedAt: "2026-07-22",
    organization: "FinTech Solutions",
    team: "DevOps Core",
  },
  {
    id: "usr-lite-6d930c",
    email: "doctor.ai@healthcare.org",
    status: "active",
    role: "Viewer",
    userAlias: "Doctor AI",
    spendUsd: 12.00,
    budgetUsd: 100.00,
    ssoId: "sso-google-6d93",
    virtualKeysCount: 0,
    createdAt: "2024-05-02",
    updatedAt: "2026-04-15",
    organization: "HealthCare AI",
    team: "AI Research",
  },
  {
    id: "usr-lite-4a559e",
    email: "security.audit@spinecloudiq.com",
    status: "active",
    role: "Admin",
    userAlias: "Security Auditor",
    spendUsd: 620.40,
    budgetUsd: 800.00,
    ssoId: "sso-okta-4a55",
    virtualKeysCount: 2,
    createdAt: "2024-05-20",
    updatedAt: "2026-07-18",
    organization: "Spine CloudIQ",
    team: "DevOps Core",
  },
];

type ColumnKey =
  | 'id'
  | 'email'
  | 'status'
  | 'role'
  | 'userAlias'
  | 'spendUsd'
  | 'budgetUsd'
  | 'ssoId'
  | 'virtualKeysCount'
  | 'createdAt'
  | 'updatedAt';

interface ColumnDef {
  key: ColumnKey;
  label: string;
}

const ALL_COLUMNS: ColumnDef[] = [
  { key: 'id', label: 'User ID' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  { key: 'role', label: 'Role' },
  { key: 'userAlias', label: 'User Alias' },
  { key: 'spendUsd', label: 'Spend (USD)' },
  { key: 'budgetUsd', label: 'Budget (USD)' },
  { key: 'ssoId', label: 'SSO ID' },
  { key: 'virtualKeysCount', label: 'Virtual Keys' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
];

const AVAILABLE_ROLES_OPTIONS = [
  {
    name: "Admin (All Permissions)",
    value: "Admin",
    description: "Full administrative access across all gateway settings & APIs"
  },
  {
    name: "Admin (View Only)",
    value: "Viewer",
    description: "Read-only access to admin panels and telemetry reports"
  },
  {
    name: "Organization Admin",
    value: "Org Admin",
    description: "Administrative authority over assigned organization & teams"
  },
  {
    name: "Internal User (Create/Delete/View)",
    value: "Internal User",
    description: "Can manage virtual keys & personal resources"
  },
  {
    name: "Internal User (View Only)",
    value: "Developer",
    description: "View-only access to assigned proxy routes"
  }
];

const AVAILABLE_ORGANIZATIONS = [
  "HB Enterprise",
  "Spine CloudIQ",
  "CyberShield Ltd",
  "FinTech Solutions",
  "HealthCare AI"
];

const AVAILABLE_TEAMS_LIST = [
  "AI Research",
  "DevOps Core",
  "QA Testing",
  "Infrastructure"
];

const AVAILABLE_MODELS_LIST = [
  "gpt-4o",
  "claude-3-5-sonnet",
  "gemini-1-5-pro",
  "llama-3-70b",
  "codex-mini-latest",
  "mistral-large"
];

export default function UserManagement() {
  // Navigation & View mode state
  const [viewModeState, setViewModeState] = useState<'list' | 'detail' | 'edit'>('list');
  const [selectedLegacyUser, setSelectedLegacyUser] = useState<User | null>(null);

  // Data & List state
  const [usersList, setUsersList] = useState<InternalUser[]>(INITIAL_INTERNAL_USERS);
  const [isLoading, setIsLoading] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'users' | 'default-settings'>('users');

  // Summary widgets state
  const [showSummary, setShowSummary] = useState(true);

  // Expandable Search
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter Drawer
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filterUserId, setFilterUserId] = useState('');
  const [filterSsoId, setFilterSsoId] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterTeam, setFilterTeam] = useState('All');

  // Active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterUserId.trim()) count++;
    if (filterSsoId.trim()) count++;
    if (filterRole !== 'All') count++;
    if (filterTeam !== 'All') count++;
    return count;
  }, [filterUserId, filterSsoId, filterRole, filterTeam]);

  // Column Visibility Panel
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    id: true,
    email: true,
    status: true,
    role: true,
    userAlias: true,
    spendUsd: true,
    budgetUsd: true,
    ssoId: true,
    virtualKeysCount: true,
    createdAt: true,
    updatedAt: true,
  });

  // Multi-Selection State
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Sorting State
  const [sortField, setSortField] = useState<ColumnKey>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);

  // Action Menu Dropdown state
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Row Action Modals (Reset Password & Delete User)
  const [resetPasswordUser, setResetPasswordUser] = useState<InternalUser | null>(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState<InternalUser | null>(null);

  /* -------------------- MODAL POPUP STATES -------------------- */
  // Screen 1: Invite User Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRoleOption, setInviteRoleOption] = useState(AVAILABLE_ROLES_OPTIONS[3]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [inviteOrg, setInviteOrg] = useState('HB Enterprise');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [inviteTeams, setInviteTeams] = useState<string[]>(['AI Research']);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [inviteModels, setInviteModels] = useState<string[]>(['gpt-4o', 'claude-3-5-sonnet']);
  const [inviteModelPreset, setInviteModelPreset] = useState<'Configured Models' | 'All Proxy Models' | 'No Default Models'>('Configured Models');

  const [inviteUnlimitedBudget, setInviteUnlimitedBudget] = useState(false);
  const [inviteMaxBudget, setInviteMaxBudget] = useState('500');
  const [inviteBudgetReset, setInviteBudgetReset] = useState('Monthly');
  const [inviteMetadata, setInviteMetadata] = useState('');
  const [inviteTouched, setInviteTouched] = useState(false);
  const [inviteIsSubmitting, setInviteIsSubmitting] = useState(false);

  // Screen 2: Bulk Invite Users Modal
  const [showBulkInviteModal, setShowBulkInviteModal] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [bulkIsUploading, setBulkIsUploading] = useState(false);
  const [bulkIsImporting, setBulkIsImporting] = useState(false);
  const [bulkValidationError, setBulkValidationError] = useState<string | null>(null);
  const [bulkUploadResult, setBulkUploadResult] = useState<{
    totalRows: number;
    successful: number;
    failed: number;
    warnings: number;
  } | null>(null);

  /* -------------------- BULK EDIT USERS MODAL STATE -------------------- */
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showBulkConfirmDialog, setShowBulkConfirmDialog] = useState(false);

  // Activation Checkboxes for Bulk Edit Sections
  const [enableBulkRole, setEnableBulkRole] = useState(false);
  const [bulkRoleOption, setBulkRoleOption] = useState(AVAILABLE_ROLES_OPTIONS[3]);
  const [showBulkRoleDropdown, setShowBulkRoleDropdown] = useState(false);

  const [enableBulkTeams, setEnableBulkTeams] = useState(false);
  const [bulkTeams, setBulkTeams] = useState<string[]>(['AI Research']);
  const [showBulkTeamDropdown, setShowBulkTeamDropdown] = useState(false);

  const [enableBulkModels, setEnableBulkModels] = useState(false);
  const [bulkModels, setBulkModels] = useState<string[]>(['gpt-4o', 'claude-3-5-sonnet']);
  const [bulkModelPreset, setBulkModelPreset] = useState<'Configured Models' | 'All Proxy Models' | 'No Default Models'>('Configured Models');

  const [enableBulkBudget, setEnableBulkBudget] = useState(false);
  const [bulkUnlimitedBudget, setBulkUnlimitedBudget] = useState(false);
  const [bulkMaxBudget, setBulkMaxBudget] = useState('500');
  const [bulkBudgetReset, setBulkBudgetReset] = useState('Monthly');

  const [enableBulkMetadata, setEnableBulkMetadata] = useState(false);
  const [bulkMetadata, setBulkMetadata] = useState('');

  const [bulkEditIsSubmitting, setBulkEditIsSubmitting] = useState(false);

  /* -------------------- DEFAULT USER SETTINGS STATE -------------------- */
  const [savedDefaultRoleOption, setSavedDefaultRoleOption] = useState(AVAILABLE_ROLES_OPTIONS[3]);
  const [savedDefaultUnlimitedBudget, setSavedDefaultUnlimitedBudget] = useState(false);
  const [savedDefaultMaxBudget, setSavedDefaultMaxBudget] = useState('500');
  const [savedDefaultBudgetReset, setSavedDefaultBudgetReset] = useState('Monthly');
  const [savedDefaultModels, setSavedDefaultModels] = useState<string[]>(['gpt-4o', 'claude-3-5-sonnet']);
  const [savedDefaultTeams, setSavedDefaultTeams] = useState<string[]>(['AI Research']);

  // Settings Edit Mode
  const [isSettingsEditing, setIsSettingsEditing] = useState(false);
  const [editDefaultRoleOption, setEditDefaultRoleOption] = useState(AVAILABLE_ROLES_OPTIONS[3]);
  const [showEditRoleDropdown, setShowEditRoleDropdown] = useState(false);
  const [editDefaultUnlimitedBudget, setEditDefaultUnlimitedBudget] = useState(false);
  const [editDefaultMaxBudget, setEditDefaultMaxBudget] = useState('500');
  const [editDefaultBudgetReset, setEditDefaultBudgetReset] = useState('Monthly');
  const [editDefaultModels, setEditDefaultModels] = useState<string[]>(['gpt-4o', 'claude-3-5-sonnet']);
  const [editDefaultModelPreset, setEditDefaultModelPreset] = useState<'Configured Models' | 'All Proxy Models' | 'No Default Models'>('Configured Models');
  const [editDefaultTeams, setEditDefaultTeams] = useState<string[]>(['AI Research']);
  const [showEditTeamDropdown, setShowEditTeamDropdown] = useState(false);
  const [editSettingsIsSaving, setEditSettingsIsSaving] = useState(false);
  const [editSettingsTouched, setEditSettingsTouched] = useState(false);

  // Listen for reset-view-state events
  useEffect(() => {
    const handleReset = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && (detail.pageId === "internal-users" || detail.pageId === "user-management")) {
        setViewModeState('list');
        setSelectedLegacyUser(null);
      }
    };
    window.addEventListener("reset-view-state", handleReset);
    return () => window.removeEventListener("reset-view-state", handleReset);
  }, []);

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-action-menu-container')) {
        setOpenActionMenuId(null);
      }
      if (!target.closest('.column-panel-container')) {
        setShowColumnPanel(false);
      }
      if (!target.closest('.role-select-dropdown')) {
        setShowRoleDropdown(false);
      }
      if (!target.closest('.edit-role-select-dropdown')) {
        setShowEditRoleDropdown(false);
      }
      if (!target.closest('.bulk-role-select-dropdown')) {
        setShowBulkRoleDropdown(false);
      }
      if (!target.closest('.org-select-dropdown')) {
        setShowOrgDropdown(false);
      }
      if (!target.closest('.team-select-dropdown')) {
        setShowTeamDropdown(false);
      }
      if (!target.closest('.edit-team-select-dropdown')) {
        setShowEditTeamDropdown(false);
      }
      if (!target.closest('.bulk-team-select-dropdown')) {
        setShowBulkTeamDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Auto focus search when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Filtering Logic
  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      // Global Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesQuery =
          user.email.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query) ||
          user.userAlias.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Filter Drawer Fields
      if (filterUserId.trim() && !user.id.toLowerCase().includes(filterUserId.toLowerCase().trim())) {
        return false;
      }
      if (filterSsoId.trim() && !user.ssoId.toLowerCase().includes(filterSsoId.toLowerCase().trim())) {
        return false;
      }
      if (filterRole !== 'All' && user.role !== filterRole) {
        return false;
      }
      if (filterTeam !== 'All' && user.team !== filterTeam) {
        return false;
      }

      return true;
    });
  }, [usersList, searchQuery, filterUserId, filterSsoId, filterRole, filterTeam]);

  // Sorting Logic
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'budgetUsd') {
        aVal = aVal === null ? Infinity : aVal;
        bVal = bVal === null ? Infinity : bVal;
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toString().toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / rowsPerPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedUsers.slice(start, start + rowsPerPage);
  }, [sortedUsers, currentPage, rowsPerPage]);

  // Invite Form Validations
  const isInviteEmailValid = useMemo(() => {
    return inviteEmail.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim());
  }, [inviteEmail]);

  const isInviteMetadataValid = useMemo(() => {
    if (!inviteMetadata.trim()) return true;
    try {
      JSON.parse(inviteMetadata);
      return true;
    } catch {
      return false;
    }
  }, [inviteMetadata]);

  const isInviteFormValid = useMemo(() => {
    return (
      isInviteEmailValid &&
      inviteRoleOption !== null &&
      inviteOrg.trim() !== '' &&
      isInviteMetadataValid
    );
  }, [isInviteEmailValid, inviteRoleOption, inviteOrg, isInviteMetadataValid]);

  // Default Settings Edit Form Validation
  const isEditSettingsBudgetValid = useMemo(() => {
    if (editDefaultUnlimitedBudget) return true;
    return editDefaultMaxBudget.trim() !== '' && !isNaN(Number(editDefaultMaxBudget)) && Number(editDefaultMaxBudget) >= 0;
  }, [editDefaultUnlimitedBudget, editDefaultMaxBudget]);

  const isEditSettingsFormValid = useMemo(() => {
    return editDefaultRoleOption !== null && isEditSettingsBudgetValid;
  }, [editDefaultRoleOption, isEditSettingsBudgetValid]);

  // Bulk Edit Form Validation
  const isBulkBudgetValid = useMemo(() => {
    if (!enableBulkBudget || bulkUnlimitedBudget) return true;
    return bulkMaxBudget.trim() !== '' && !isNaN(Number(bulkMaxBudget)) && Number(bulkMaxBudget) >= 0;
  }, [enableBulkBudget, bulkUnlimitedBudget, bulkMaxBudget]);

  const isBulkMetadataValid = useMemo(() => {
    if (!enableBulkMetadata || !bulkMetadata.trim()) return true;
    try {
      JSON.parse(bulkMetadata);
      return true;
    } catch {
      return false;
    }
  }, [enableBulkMetadata, bulkMetadata]);

  const hasAnyBulkSectionEnabled = useMemo(() => {
    return (
      enableBulkRole ||
      enableBulkTeams ||
      enableBulkModels ||
      enableBulkBudget ||
      enableBulkMetadata
    );
  }, [enableBulkRole, enableBulkTeams, enableBulkModels, enableBulkBudget, enableBulkMetadata]);

  const isBulkEditFormValid = useMemo(() => {
    return hasAnyBulkSectionEnabled && isBulkBudgetValid && isBulkMetadataValid;
  }, [hasAnyBulkSectionEnabled, isBulkBudgetValid, isBulkMetadataValid]);

  // Handlers
  const handleSort = (field: ColumnKey) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.size === paginatedUsers.length && paginatedUsers.length > 0) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(paginatedUsers.map((u) => u.id)));
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Refreshed Internal Users list");
    }, 400);
  };

  const handleExportCsv = () => {
    const dataToExport = selectedUserIds.size > 0
      ? sortedUsers.filter((u) => selectedUserIds.has(u.id))
      : sortedUsers;

    if (dataToExport.length === 0) {
      toast.error("No users available to export.");
      return;
    }

    const headers = ["User ID", "Email", "Status", "Role", "User Alias", "Spend (USD)", "Budget (USD)", "SSO ID", "Virtual Keys", "Created At", "Updated At"];
    const rows = dataToExport.map((u) => [
      `"${u.id}"`,
      `"${u.email}"`,
      `"${u.status}"`,
      `"${u.role}"`,
      `"${u.userAlias}"`,
      `"${u.spendUsd.toFixed(2)}"`,
      `"${u.budgetUsd !== null ? u.budgetUsd.toFixed(2) : "Unlimited"}"`,
      `"${u.ssoId}"`,
      `"${u.virtualKeysCount}"`,
      `"${u.createdAt}"`,
      `"${u.updatedAt}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `internal_users_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${dataToExport.length} users to CSV.`);
  };

  const handleResetFilters = () => {
    setFilterUserId('');
    setFilterSsoId('');
    setFilterRole('All');
    setFilterTeam('All');
    setShowFilterDrawer(false);
    toast.info("Filters reset to default.");
  };

  const handleViewDetails = (user: InternalUser) => {
    setSelectedLegacyUser({
      id: user.id,
      name: user.userAlias,
      email: user.email,
      status: user.status,
      createdDate: user.createdAt,
      metrics: { totalEventsCreated: 0, totalEventsJoined: 0, activeEvents: 0, expiredEvents: 0 },
      createdEvents: [],
      joinedEvents: []
    });
    setViewModeState('detail');
  };

  const handleEditUser = (user: InternalUser) => {
    setSelectedLegacyUser({
      id: user.id,
      name: user.userAlias,
      email: user.email,
      status: user.status,
      createdDate: user.createdAt,
      metrics: { totalEventsCreated: 0, totalEventsJoined: 0, activeEvents: 0, expiredEvents: 0 },
      createdEvents: [],
      joinedEvents: []
    });
    setViewModeState('edit');
  };

  const handleResetPassword = (user: InternalUser) => {
    setOpenActionMenuId(null);
    setResetPasswordUser(user);
  };

  const handleCopyUserId = (userId: string) => {
    navigator.clipboard.writeText(userId);
    toast.success(`Copied User ID: ${userId}`);
    setOpenActionMenuId(null);
  };

  const handleDeleteUser = (user: InternalUser) => {
    setOpenActionMenuId(null);
    setDeleteUserTarget(user);
  };

  const handleConfirmDeleteUserRow = () => {
    if (!deleteUserTarget) return;
    setUsersList((prev) => prev.filter((u) => u.id !== deleteUserTarget.id));
    toast.success(`User "${deleteUserTarget.userAlias}" (${deleteUserTarget.id}) deleted successfully.`);
    setDeleteUserTarget(null);
  };

  /* -------------------- BULK EDIT HANDLERS -------------------- */
  const handleOpenBulkEditModal = () => {
    if (selectedUserIds.size === 0) {
      toast.error("Please select at least one user to perform bulk edit.");
      return;
    }

    setEnableBulkRole(false);
    setBulkRoleOption(AVAILABLE_ROLES_OPTIONS[3]);
    setEnableBulkTeams(false);
    setBulkTeams(['AI Research']);
    setEnableBulkModels(false);
    setBulkModels(['gpt-4o', 'claude-3-5-sonnet']);
    setBulkModelPreset('Configured Models');
    setEnableBulkBudget(false);
    setBulkUnlimitedBudget(false);
    setBulkMaxBudget('500');
    setBulkBudgetReset('Monthly');
    setEnableBulkMetadata(false);
    setBulkMetadata('');
    setShowBulkConfirmDialog(false);
    setShowBulkEditModal(true);
  };

  const handleConfirmBulkChangesSubmit = () => {
    setBulkEditIsSubmitting(true);
    setTimeout(() => {
      setUsersList((prev) =>
        prev.map((user) => {
          if (!selectedUserIds.has(user.id)) return user;

          const updated = { ...user };
          if (enableBulkRole) {
            updated.role = bulkRoleOption.value as any;
          }
          if (enableBulkTeams && bulkTeams.length > 0) {
            updated.team = bulkTeams[0];
          }
          if (enableBulkBudget) {
            updated.budgetUsd = bulkUnlimitedBudget ? null : parseFloat(bulkMaxBudget) || 500;
          }
          updated.updatedAt = new Date().toISOString().split('T')[0];
          return updated;
        })
      );

      const count = selectedUserIds.size;
      setBulkEditIsSubmitting(false);
      setShowBulkConfirmDialog(false);
      setShowBulkEditModal(false);
      setSelectedUserIds(new Set());
      setIsMultiSelectActive(false);
      toast.success(`Successfully applied bulk changes to ${count} selected users.`);
    }, 600);
  };

  /* -------------------- DEFAULT SETTINGS HANDLERS -------------------- */
  const handleStartEditDefaultSettings = () => {
    setEditDefaultRoleOption(savedDefaultRoleOption);
    setEditDefaultUnlimitedBudget(savedDefaultUnlimitedBudget);
    setEditDefaultMaxBudget(savedDefaultMaxBudget);
    setEditDefaultBudgetReset(savedDefaultBudgetReset);
    setEditDefaultModels([...savedDefaultModels]);
    setEditDefaultModelPreset('Configured Models');
    setEditDefaultTeams([...savedDefaultTeams]);
    setEditSettingsTouched(false);
    setIsSettingsEditing(true);
  };

  const handleSaveDefaultSettings = () => {
    setEditSettingsTouched(true);
    if (!isEditSettingsFormValid) return;

    setEditSettingsIsSaving(true);
    setTimeout(() => {
      setSavedDefaultRoleOption(editDefaultRoleOption);
      setSavedDefaultUnlimitedBudget(editDefaultUnlimitedBudget);
      setSavedDefaultMaxBudget(editDefaultMaxBudget);
      setSavedDefaultBudgetReset(editDefaultBudgetReset);
      setSavedDefaultModels([...editDefaultModels]);
      setSavedDefaultTeams([...editDefaultTeams]);
      setEditSettingsIsSaving(false);
      setIsSettingsEditing(false);
      toast.success("Updated Default User Settings successfully");
    }, 400);
  };

  const handleCancelDefaultSettings = () => {
    setIsSettingsEditing(false);
  };

  /* -------------------- INVITE USER HANDLER -------------------- */
  const handleOpenInviteModal = () => {
    setInviteEmail('');
    setInviteRoleOption(AVAILABLE_ROLES_OPTIONS[3]);
    setInviteOrg('HB Enterprise');
    setInviteTeams(['AI Research']);
    setInviteModels(['gpt-4o', 'claude-3-5-sonnet']);
    setInviteModelPreset('Configured Models');
    setInviteUnlimitedBudget(false);
    setInviteMaxBudget('500');
    setInviteBudgetReset('Monthly');
    setInviteMetadata('');
    setInviteTouched(false);
    setInviteIsSubmitting(false);
    setShowInviteModal(true);
  };

  const handleSubmitInviteUser = () => {
    setInviteTouched(true);
    if (!isInviteFormValid) return;

    setInviteIsSubmitting(true);
    setTimeout(() => {
      const alias = inviteEmail.split('@')[0].replace('.', ' ');
      const formattedAlias = alias.charAt(0).toUpperCase() + alias.slice(1);
      const newUser: InternalUser = {
        id: `usr-lite-${Math.random().toString(36).substr(2, 6)}`,
        email: inviteEmail.trim(),
        status: 'active',
        role: inviteRoleOption.value as any,
        userAlias: formattedAlias,
        spendUsd: 0,
        budgetUsd: inviteUnlimitedBudget ? null : parseFloat(inviteMaxBudget) || 500,
        ssoId: `sso-okta-${Math.random().toString(36).substr(2, 4)}`,
        virtualKeysCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        organization: inviteOrg,
        team: inviteTeams[0] || 'AI Research'
      };

      setUsersList((prev) => [newUser, ...prev]);
      setInviteIsSubmitting(false);
      setShowInviteModal(false);
      toast.success(`Successfully sent invitation email to ${newUser.email}`);
    }, 600);
  };

  /* -------------------- BULK INVITE HANDLERS -------------------- */
  const handleOpenBulkInviteModal = () => {
    setBulkFile(null);
    setBulkUploadProgress(0);
    setBulkIsUploading(false);
    setBulkIsImporting(false);
    setBulkValidationError(null);
    setBulkUploadResult(null);
    setShowBulkInviteModal(true);
  };

  const handleDownloadCsvTemplate = () => {
    const csvHeaders = "user_email,user_role,teams,budget,budget_duration,models\n";
    const sampleRow1 = "dev1@hbenterprise.com,Internal User,AI Research,500,Monthly,\"gpt-4o,claude-3-5-sonnet\"\n";
    const sampleRow2 = "ops2@spinecloudiq.com,Org Admin,DevOps Core,1200,Monthly,\"gpt-4o,llama-3-70b\"\n";
    const blob = new Blob([csvHeaders + sampleRow1 + sampleRow2], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "bulk_user_invite_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded CSV template (bulk_user_invite_template.csv)");
  };

  const handleProcessBulkFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setBulkValidationError("Invalid file type. Please upload a valid .csv file.");
      setBulkFile(null);
      return;
    }
    if (file.size === 0) {
      setBulkValidationError("The uploaded file is empty.");
      setBulkFile(null);
      return;
    }

    setBulkValidationError(null);
    setBulkFile(file);
    setBulkIsUploading(true);
    setBulkUploadProgress(20);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setBulkUploadProgress(70);

      setTimeout(() => {
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim() !== "");
        if (lines.length <= 1) {
          setBulkValidationError("CSV file must contain a header line and at least one data row.");
          setBulkIsUploading(false);
          setBulkUploadProgress(0);
          return;
        }

        const header = lines[0].toLowerCase();
        if (!header.includes("user_email") || !header.includes("user_role")) {
          setBulkValidationError("Malformed CSV: Missing required columns 'user_email' or 'user_role'.");
          setBulkIsUploading(false);
          setBulkUploadProgress(0);
          return;
        }

        const dataRows = lines.slice(1);
        setBulkUploadProgress(100);
        setBulkIsUploading(false);
        setBulkUploadResult({
          totalRows: dataRows.length,
          successful: dataRows.length,
          failed: 0,
          warnings: 0
        });
        toast.success(`Successfully validated ${dataRows.length} user rows from CSV.`);
      }, 400);
    };
    reader.readAsText(file);
  };

  const handleExecuteBulkImport = () => {
    if (!bulkUploadResult || bulkUploadResult.successful === 0) return;
    setBulkIsImporting(true);
    setTimeout(() => {
      setBulkIsImporting(false);
      setShowBulkInviteModal(false);
      toast.success(`Successfully imported ${bulkUploadResult.successful} users from CSV.`);
    }, 600);
  };

  // KPI Summary Statistics
  const totalCount = usersList.length;
  const activeCount = usersList.filter((u) => u.status === 'active').length;
  const adminCount = usersList.filter((u) => u.role === 'Admin').length;
  const orgAdminCount = usersList.filter((u) => u.role === 'Org Admin').length;
  const withKeysCount = usersList.filter((u) => u.virtualKeysCount > 0).length;

  // Render legacy detail or edit screens if triggered
  if (viewModeState === 'detail' && selectedLegacyUser) {
    return (
      <UserDetail
        user={selectedLegacyUser}
        onBack={() => setViewModeState('list')}
        onEdit={() => setViewModeState('edit')}
        onToggleStatus={() => {}}
      />
    );
  }

  if (viewModeState === 'edit' && selectedLegacyUser) {
    return (
      <UserEdit
        user={selectedLegacyUser}
        onBack={() => setViewModeState('detail')}
      />
    );
  }

  return (
    <div className="p-6 bg-transparent dark:bg-neutral-950 space-y-6">
      {/* 1. HB PAGE HEADER */}
      <PageHeader
        pageId="internal-users"
        action="list"
      >
        <div className="flex items-center gap-2">
          {/* Action 1: Invite User (Primary) */}
          <PrimaryButton
            icon={Plus}
            onClick={handleOpenInviteModal}
          >
            Invite User
          </PrimaryButton>

          {/* Action 2: Bulk Invite Users (Primary) */}
          <PrimaryButton
            icon={Upload}
            onClick={handleOpenBulkInviteModal}
          >
            Bulk Invite Users
          </PrimaryButton>

          {/* Action 3: Multi-Select Mode Toggle / Bulk Edit */}
          {activeTab === 'users' && (
            isMultiSelectActive ? (
              <>
                <PrimaryButton
                  icon={Edit3}
                  disabled={selectedUserIds.size === 0}
                  onClick={handleOpenBulkEditModal}
                >
                  Bulk Edit ({selectedUserIds.size} Selected)
                </PrimaryButton>

                <SecondaryButton
                  icon={X}
                  onClick={() => {
                    setIsMultiSelectActive(false);
                    setSelectedUserIds(new Set());
                  }}
                >
                  Cancel Selection
                </SecondaryButton>
              </>
            ) : (
              <SecondaryButton
                icon={CheckSquare}
                onClick={() => setIsMultiSelectActive(true)}
              >
                Select Users
              </SecondaryButton>
            )
          )}
        </div>
      </PageHeader>

      {/* 2. TABS (Users & Default User Settings) */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <nav className="-mb-px flex gap-6 text-sm font-semibold" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`py-2.5 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Users className="w-4 h-4" />
            Users
            <span className="px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {usersList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('default-settings')}
            className={`py-2.5 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'default-settings'
                ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Lock className="w-4 h-4" />
            Default User Settings
          </button>
        </nav>
      </div>

      {/* TAB 1: USERS LISTING */}
      {activeTab === 'users' && (
        <>
          {/* 3. SUMMARY KPI CARDS (Collapsible) */}
          {showSummary && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 transition-all duration-300 animate-fadeIn">
              {/* Total Users */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Users</span>
                  <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                {isLoading ? (
                  <div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded w-16 animate-pulse my-1" />
                ) : (
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">{totalCount}</div>
                )}
                <div className="text-[11px] text-neutral-400 dark:text-neutral-500">100% Account Allocation</div>
              </div>

              {/* Active Users */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Active Users</span>
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                {isLoading ? (
                  <div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded w-16 animate-pulse my-1" />
                ) : (
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">{activeCount}</div>
                )}
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(1) : 0}% Operational
                </div>
              </div>

              {/* Admin Users */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Admin Users</span>
                  <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                {isLoading ? (
                  <div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded w-16 animate-pulse my-1" />
                ) : (
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">{adminCount}</div>
                )}
                <div className="text-[11px] text-neutral-400 dark:text-neutral-500">System & Platform Admins</div>
              </div>

              {/* Organization Admins */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Organization Admins</span>
                  <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                {isLoading ? (
                  <div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded w-16 animate-pulse my-1" />
                ) : (
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">{orgAdminCount}</div>
                )}
                <div className="text-[11px] text-neutral-400 dark:text-neutral-500">Departmental Admins</div>
              </div>

              {/* Users With Keys */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Users With Keys</span>
                  <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                {isLoading ? (
                  <div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded w-16 animate-pulse my-1" />
                ) : (
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">{withKeysCount}</div>
                )}
                <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  {totalCount > 0 ? ((withKeysCount / totalCount) * 100).toFixed(0) : 0}% Key Assigned
                </div>
              </div>
            </div>
          )}

          {/* 4. TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            {/* Left: HB Expandable Search */}
            <div className="flex items-center gap-2">
              {isSearchExpanded ? (
                <div className="relative flex items-center animate-fadeIn">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Email..."
                    className="w-64 md:w-80 h-9 pl-9 pr-8 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsSearchExpanded(false)}
                      className="absolute right-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <IconButton
                  icon={Search}
                  label="Search"
                  onClick={() => setIsSearchExpanded(true)}
                  title="Expand Search"
                />
              )}

              {/* HB Filter Drawer Trigger */}
              <div className="relative filter-drawer-container">
                <IconButton
                  icon={Filter}
                  label={activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filter"}
                  onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                  title="Open Filter Drawer"
                />

                {/* HB Filter Drawer Modal */}
                {showFilterDrawer && (
                  <div className="absolute left-0 top-full mt-2 z-40 w-80 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl p-4 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Filter Users</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowFilterDrawer(false)}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* User ID */}
                      <div className="space-y-1">
                        <label className="block font-semibold text-neutral-800 dark:text-neutral-200">User ID</label>
                        <input
                          type="text"
                          value={filterUserId}
                          onChange={(e) => setFilterUserId(e.target.value)}
                          placeholder="e.g. usr-lite-8f9a2b"
                          className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* SSO ID */}
                      <div className="space-y-1">
                        <label className="block font-semibold text-neutral-800 dark:text-neutral-200">SSO ID</label>
                        <input
                          type="text"
                          value={filterSsoId}
                          onChange={(e) => setFilterSsoId(e.target.value)}
                          placeholder="e.g. sso-okta-8f9a"
                          className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* Role */}
                      <div className="space-y-1">
                        <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Role</label>
                        <select
                          value={filterRole}
                          onChange={(e) => setFilterRole(e.target.value)}
                          className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium text-neutral-900 dark:text-white"
                        >
                          <option value="All">All Roles</option>
                          <option value="Admin">Admin</option>
                          <option value="Org Admin">Org Admin</option>
                          <option value="Internal User">Internal User</option>
                          <option value="Developer">Developer</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </div>

                      {/* Team */}
                      <div className="space-y-1">
                        <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Team</label>
                        <select
                          value={filterTeam}
                          onChange={(e) => setFilterTeam(e.target.value)}
                          className="w-full h-8 px-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium text-neutral-900 dark:text-white"
                        >
                          <option value="All">All Teams</option>
                          <option value="AI Research">AI Research</option>
                          <option value="DevOps Core">DevOps Core</option>
                          <option value="QA Testing">QA Testing</option>
                          <option value="Infrastructure">Infrastructure</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 dark:border-neutral-800">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        Reset
                      </button>
                      <PrimaryButton
                        onClick={() => {
                          setShowFilterDrawer(false);
                          toast.success("Applied filters to user list");
                        }}
                      >
                        Apply Filters
                      </PrimaryButton>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1.5">
              <div className="relative column-panel-container">
                <IconButton
                  icon={Columns}
                  label="Columns"
                  onClick={() => setShowColumnPanel(!showColumnPanel)}
                  title="Manage Columns"
                />

                {showColumnPanel && (
                  <div className="absolute right-0 top-full mt-2 z-40 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-3 space-y-2 animate-fadeIn">
                    <div className="text-xs font-bold text-neutral-900 dark:text-white pb-1.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <span>Toggle Columns</span>
                      <span className="text-[10px] font-normal text-neutral-400">Persisted</span>
                    </div>
                    <div className="space-y-1 max-h-56 overflow-y-auto custom-scrollbar">
                      {ALL_COLUMNS.map((col) => (
                        <label
                          key={col.key}
                          className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 p-1.5 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns[col.key]}
                            onChange={() => {
                              setVisibleColumns((prev) => ({
                                ...prev,
                                [col.key]: !prev[col.key],
                              }));
                            }}
                            className="w-3.5 h-3.5 rounded text-primary-600 focus:ring-primary-500"
                          />
                          <span>{col.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <IconButton
                icon={Download}
                label="Export"
                onClick={handleExportCsv}
                title="Export to CSV"
              />

              <IconButton
                icon={RefreshCw}
                label="Refresh"
                onClick={handleRefresh}
                title="Refresh List"
              />

              <IconButton
                icon={showSummary ? EyeOff : BarChart3}
                label={showSummary ? "Hide Summary" : "Show Summary"}
                onClick={() => setShowSummary(!showSummary)}
                title={showSummary ? "Hide KPI Summary Cards" : "Show KPI Summary Cards"}
              />
            </div>
          </div>

          {/* 5. HB ENTERPRISE TABLE */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50/80 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold select-none">
                    {isMultiSelectActive && (
                      <th className="py-3 px-4 w-10 text-center sticky left-0 bg-neutral-50 dark:bg-neutral-900 z-10">
                        <input
                          type="checkbox"
                          checked={
                            selectedUserIds.size === paginatedUsers.length &&
                            paginatedUsers.length > 0
                          }
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                      </th>
                    )}

                    {visibleColumns.id && (
                      <th onClick={() => handleSort('id')} className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1">
                          <span>User ID</span>
                          {sortField === 'id' ? (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-50" />}
                        </div>
                      </th>
                    )}

                    {visibleColumns.email && (
                      <th onClick={() => handleSort('email')} className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1">
                          <span>Email</span>
                          {sortField === 'email' ? (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-50" />}
                        </div>
                      </th>
                    )}

                    {visibleColumns.status && (
                      <th onClick={() => handleSort('status')} className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1">
                          <span>Status</span>
                          {sortField === 'status' ? (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-50" />}
                        </div>
                      </th>
                    )}

                    {visibleColumns.role && (
                      <th onClick={() => handleSort('role')} className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1">
                          <span>Role</span>
                          {sortField === 'role' ? (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-50" />}
                        </div>
                      </th>
                    )}

                    {visibleColumns.userAlias && (
                      <th onClick={() => handleSort('userAlias')} className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1">
                          <span>User Alias</span>
                          {sortField === 'userAlias' ? (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-50" />}
                        </div>
                      </th>
                    )}

                    {visibleColumns.spendUsd && (
                      <th onClick={() => handleSort('spendUsd')} className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1">
                          <span>Spend (USD)</span>
                          {sortField === 'spendUsd' ? (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-50" />}
                        </div>
                      </th>
                    )}

                    {visibleColumns.budgetUsd && (
                      <th onClick={() => handleSort('budgetUsd')} className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1">
                          <span>Budget (USD)</span>
                          {sortField === 'budgetUsd' ? (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-50" />}
                        </div>
                      </th>
                    )}

                    {visibleColumns.ssoId && (
                      <th onClick={() => handleSort('ssoId')} className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1">
                          <span>SSO ID</span>
                          {sortField === 'ssoId' ? (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-50" />}
                        </div>
                      </th>
                    )}

                    {visibleColumns.virtualKeysCount && (
                      <th onClick={() => handleSort('virtualKeysCount')} className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1">
                          <span>Virtual Keys</span>
                          {sortField === 'virtualKeysCount' ? (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-50" />}
                        </div>
                      </th>
                    )}

                    {visibleColumns.createdAt && (
                      <th onClick={() => handleSort('createdAt')} className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1">
                          <span>Created At</span>
                          {sortField === 'createdAt' ? (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-50" />}
                        </div>
                      </th>
                    )}

                    {visibleColumns.updatedAt && (
                      <th onClick={() => handleSort('updatedAt')} className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <div className="flex items-center gap-1">
                          <span>Updated At</span>
                          {sortField === 'updatedAt' ? (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-50" />}
                        </div>
                      </th>
                    )}

                    <th className="py-3 px-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        {isMultiSelectActive && <td className="py-4 px-4"><div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" /></td>}
                        {visibleColumns.id && <td className="py-4 px-4"><div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" /></td>}
                        {visibleColumns.email && <td className="py-4 px-4"><div className="w-36 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" /></td>}
                        {visibleColumns.status && <td className="py-4 px-4"><div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full" /></td>}
                        {visibleColumns.role && <td className="py-4 px-4"><div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" /></td>}
                        {visibleColumns.userAlias && <td className="py-4 px-4"><div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" /></td>}
                        {visibleColumns.spendUsd && <td className="py-4 px-4"><div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" /></td>}
                        {visibleColumns.budgetUsd && <td className="py-4 px-4"><div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" /></td>}
                        {visibleColumns.ssoId && <td className="py-4 px-4"><div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" /></td>}
                        {visibleColumns.virtualKeysCount && <td className="py-4 px-4"><div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full" /></td>}
                        {visibleColumns.createdAt && <td className="py-4 px-4"><div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" /></td>}
                        {visibleColumns.updatedAt && <td className="py-4 px-4"><div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" /></td>}
                        <td className="py-4 px-4 text-right"><div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-800 rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => {
                      const isSelected = selectedUserIds.has(user.id);
                      const isActionOpen = openActionMenuId === user.id;

                      return (
                        <tr
                          key={user.id}
                          className={`hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors ${
                            isSelected ? "bg-primary-50/40 dark:bg-primary-950/20" : ""
                          }`}
                        >
                          {isMultiSelectActive && (
                            <td className="py-3.5 px-4 text-center sticky left-0 bg-white dark:bg-neutral-900">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectUser(user.id)}
                                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                              />
                            </td>
                          )}

                          {visibleColumns.id && (
                            <td className="py-3.5 px-4 font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">
                              <button type="button" onClick={() => handleViewDetails(user)} className="hover:underline text-left focus:outline-none">
                                {user.id}
                              </button>
                            </td>
                          )}

                          {visibleColumns.email && (
                            <td className="py-3.5 px-4 font-medium text-neutral-900 dark:text-white">
                              <button type="button" onClick={() => handleViewDetails(user)} className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline text-left focus:outline-none flex items-center gap-1.5">
                                <span>{user.email}</span>
                              </button>
                            </td>
                          )}

                          {visibleColumns.status && (
                            <td className="py-3.5 px-4">
                              {user.status === 'active' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" /> Inactive
                                </span>
                              )}
                            </td>
                          )}

                          {visibleColumns.role && (
                            <td className="py-3.5 px-4">
                              <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700">
                                {user.role}
                              </span>
                            </td>
                          )}

                          {visibleColumns.userAlias && (
                            <td className="py-3.5 px-4 font-medium text-neutral-800 dark:text-neutral-200">
                              {user.userAlias}
                            </td>
                          )}

                          {visibleColumns.spendUsd && (
                            <td className="py-3.5 px-4 font-mono font-semibold text-neutral-900 dark:text-white">
                              ${user.spendUsd.toFixed(2)}
                            </td>
                          )}

                          {visibleColumns.budgetUsd && (
                            <td className="py-3.5 px-4 font-mono">
                              {user.budgetUsd === null ? (
                                <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[11px] font-semibold">
                                  Unlimited
                                </span>
                              ) : (
                                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                  ${user.budgetUsd.toFixed(2)}
                                </span>
                              )}
                            </td>
                          )}

                          {visibleColumns.ssoId && (
                            <td className="py-3.5 px-4 font-mono text-neutral-500 dark:text-neutral-400 text-xs">
                              {user.ssoId}
                            </td>
                          )}

                          {visibleColumns.virtualKeysCount && (
                            <td className="py-3.5 px-4">
                              {user.virtualKeysCount === 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                                  No Keys
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                                  <Key className="w-3 h-3 text-primary-500" />
                                  {user.virtualKeysCount} {user.virtualKeysCount === 1 ? 'Key' : 'Keys'}
                                </span>
                              )}
                            </td>
                          )}

                          {visibleColumns.createdAt && (
                            <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400">
                              {user.createdAt}
                            </td>
                          )}

                          {visibleColumns.updatedAt && (
                            <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400">
                              {user.updatedAt}
                            </td>
                          )}

                          <td className="py-3.5 px-4 text-right pr-6 relative user-action-menu-container">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(isActionOpen ? null : user.id);
                              }}
                              className="w-8 h-8 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center justify-center transition-colors"
                              title="More Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isActionOpen && (
                              <div className="absolute right-6 top-full mt-1 z-50 w-44 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 space-y-0.5 text-left animate-fadeIn">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    handleEditUser(user);
                                  }}
                                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors"
                                >
                                  <Edit className="w-3.5 h-3.5 text-neutral-400" />
                                  <span>Edit User</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    handleResetPassword(user);
                                  }}
                                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                                  <span>Reset Password</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    handleCopyUserId(user.id);
                                  }}
                                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors"
                                >
                                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                                  <span>Copy User ID</span>
                                </button>

                                <div className="pt-0.5 border-t border-neutral-100 dark:border-neutral-800">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleDeleteUser(user);
                                    }}
                                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                    <span>Delete User</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={13} className="py-16 text-center">
                        <div className="max-w-xs mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">No Internal Users Found</h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">No user records match your current search query or active filter settings.</p>
                          </div>
                          <PrimaryButton icon={Plus} onClick={handleOpenInviteModal} className="mx-auto">
                            Invite User
                          </PrimaryButton>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 6. PAGINATION FOOTER */}
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div>
                Showing <span className="font-bold text-neutral-900 dark:text-white">{sortedUsers.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-bold text-neutral-900 dark:text-white">{Math.min(currentPage * rowsPerPage, sortedUsers.length)}</span> of <span className="font-bold text-neutral-900 dark:text-white">{sortedUsers.length}</span> entries
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="h-8 px-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-semibold"
                  >
                    Previous
                  </button>
                  <div className="px-3 py-1.5 text-xs font-bold text-neutral-900 dark:text-white">
                    {currentPage} / {totalPages}
                  </div>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: DEFAULT USER SETTINGS */}
      {activeTab === 'default-settings' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  Default User Settings
                  {isSettingsEditing && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                      Inline Edit Mode
                    </span>
                  )}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Configure the default values automatically assigned when new internal users are created.
                </p>
              </div>
            </div>

            {!isSettingsEditing && (
              <SecondaryButton
                icon={Edit}
                onClick={handleStartEditDefaultSettings}
              >
                Edit Settings
              </SecondaryButton>
            )}
          </div>

          {!isSettingsEditing ? (
            <div className="space-y-4 text-xs">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span className="font-bold text-sm text-neutral-900 dark:text-white">Default User Role</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {savedDefaultRoleOption ? savedDefaultRoleOption.name : <span className="text-neutral-400 italic">Not Set</span>}
                  </div>
                  {savedDefaultRoleOption && (
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {savedDefaultRoleOption.description}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-sm text-neutral-900 dark:text-white">Maximum Budget</span>
                </div>
                <div>
                  {savedDefaultUnlimitedBudget ? (
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Unlimited
                    </span>
                  ) : savedDefaultMaxBudget ? (
                    <span className="text-sm font-mono font-bold text-neutral-900 dark:text-white">
                      ${savedDefaultMaxBudget}.00
                    </span>
                  ) : (
                    <span className="text-neutral-400 italic">Not Set</span>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-sm text-neutral-900 dark:text-white">Budget Reset Duration</span>
                </div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {savedDefaultBudgetReset || <span className="text-neutral-400 italic">Not Set</span>}
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-bold text-sm text-neutral-900 dark:text-white">Default Personal Models</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {savedDefaultModels.length === 0 ? (
                    <span className="text-neutral-400 italic">Not Set</span>
                  ) : (
                    savedDefaultModels.map((m) => (
                      <span
                        key={m}
                        className="px-3 py-1 rounded-lg border text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300"
                      >
                        {m}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-bold text-sm text-neutral-900 dark:text-white">Default Assigned Teams</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {savedDefaultTeams.length === 0 ? (
                    <span className="text-neutral-400 italic">Not Set</span>
                  ) : (
                    savedDefaultTeams.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-lg border text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                      >
                        {t}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-lg p-6 space-y-6 animate-fadeIn text-xs">
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Default Role</h4>
                </div>

                <div className="space-y-1 relative edit-role-select-dropdown">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Default User Role <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEditRoleDropdown(!showEditRoleDropdown)}
                    className="w-full min-h-[40px] px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-left text-neutral-900 dark:text-white flex items-center justify-between hover:border-neutral-400 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">{editDefaultRoleOption.name}</div>
                      <div className="text-[10px] text-neutral-400">{editDefaultRoleOption.description}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />
                  </button>

                  {showEditRoleDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 space-y-1 animate-fadeIn max-h-56 overflow-y-auto">
                      {AVAILABLE_ROLES_OPTIONS.map((opt) => (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => {
                            setEditDefaultRoleOption(opt);
                            setShowEditRoleDropdown(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start justify-between ${
                            editDefaultRoleOption.name === opt.name
                              ? "bg-primary-50 dark:bg-primary-950/50 border border-primary-200/60 dark:border-primary-800/60"
                              : "hover:bg-neutral-50 dark:hover:bg-neutral-900"
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white">{opt.name}</div>
                            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{opt.description}</div>
                          </div>
                          {editDefaultRoleOption.name === opt.name && <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Budget Configuration</h4>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    <input
                      type="checkbox"
                      checked={editDefaultUnlimitedBudget}
                      onChange={(e) => setEditDefaultUnlimitedBudget(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>Unlimited Budget</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Max Budget ($ USD) {!editDefaultUnlimitedBudget && <span className="text-rose-500">*</span>}
                    </label>
                    <input
                      type="number"
                      disabled={editDefaultUnlimitedBudget}
                      value={editDefaultUnlimitedBudget ? '' : editDefaultMaxBudget}
                      onChange={(e) => setEditDefaultMaxBudget(e.target.value)}
                      placeholder={editDefaultUnlimitedBudget ? "Unlimited" : "500"}
                      className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono font-semibold text-neutral-900 dark:text-white disabled:opacity-50 disabled:bg-neutral-100 dark:disabled:bg-neutral-900 ${
                        editSettingsTouched && !isEditSettingsBudgetValid
                          ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    />
                    {editSettingsTouched && !isEditSettingsBudgetValid && (
                      <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        Max budget is required when Unlimited Budget is disabled.
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Budget Reset Duration
                    </label>
                    <select
                      value={editDefaultBudgetReset}
                      onChange={(e) => setEditDefaultBudgetReset(e.target.value)}
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Never">Never (One-Time Cap)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Default Personal Models</h4>
                  </div>

                  <div className="flex bg-neutral-200 dark:bg-neutral-800 p-0.5 rounded-lg text-[11px]">
                    {(['Configured Models', 'All Proxy Models', 'No Default Models'] as const).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setEditDefaultModelPreset(preset);
                          if (preset === 'All Proxy Models') setEditDefaultModels([...AVAILABLE_MODELS_LIST]);
                          else if (preset === 'No Default Models') setEditDefaultModels([]);
                          else setEditDefaultModels(['gpt-4o', 'claude-3-5-sonnet']);
                        }}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                          editDefaultModelPreset === preset
                            ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                            : "text-neutral-600 dark:text-neutral-400"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_MODELS_LIST.map((m) => {
                      const isSelected = editDefaultModels.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setEditDefaultModelPreset('Configured Models');
                            if (isSelected) {
                              setEditDefaultModels(editDefaultModels.filter((item) => item !== m));
                            } else {
                              setEditDefaultModels([...editDefaultModels, m]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? "bg-primary-50 dark:bg-primary-950/60 border-primary-400 text-primary-700 dark:text-primary-300 font-semibold"
                              : "bg-white dark:bg-neutral-950 border-neutral-200 text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          <span>{m}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-primary-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Default Assigned Teams</h4>
                </div>

                <div className="space-y-1 relative edit-team-select-dropdown">
                  <button
                    type="button"
                    onClick={() => setShowEditTeamDropdown(!showEditTeamDropdown)}
                    className="w-full min-h-[40px] px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium flex items-center justify-between hover:border-neutral-400 transition-colors"
                  >
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {editDefaultTeams.length === 0 ? (
                        <span className="text-neutral-400 italic">Select teams...</span>
                      ) : (
                        editDefaultTeams.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold text-[11px] flex items-center gap-1"
                          >
                            {t}
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditDefaultTeams(editDefaultTeams.filter((item) => item !== t));
                              }}
                              className="hover:text-rose-500 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </span>
                          </span>
                        ))
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />
                  </button>

                  {showEditTeamDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 space-y-0.5 animate-fadeIn max-h-48 overflow-y-auto">
                      {AVAILABLE_TEAMS_LIST.map((teamName) => {
                        const isSelected = editDefaultTeams.includes(teamName);
                        return (
                          <button
                            key={teamName}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setEditDefaultTeams(editDefaultTeams.filter((item) => item !== teamName));
                              } else {
                                setEditDefaultTeams([...editDefaultTeams, teamName]);
                              }
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold"
                                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                            }`}
                          >
                            <span>{teamName}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 z-10 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900 py-3">
                <SecondaryButton onClick={handleCancelDefaultSettings}>
                  Cancel
                </SecondaryButton>

                <PrimaryButton
                  disabled={!isEditSettingsFormValid || editSettingsIsSaving}
                  onClick={handleSaveDefaultSettings}
                >
                  {editSettingsIsSaving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------- MODAL 1: INVITE USER MODAL -------------------- */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    Invite User
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                      User Invitation
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Invite a new internal user and configure their default access before sending the invitation.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mx-6 mt-4 p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-blue-950 dark:text-blue-100">Email Invitations</span>
                <span className="text-blue-700 dark:text-blue-300">
                  New users receive an invitation email after configuration is completed.
                </span>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                    <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Basic Information</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                        User Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="e.g. name@company.com"
                        className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                          inviteTouched && !isInviteEmailValid
                            ? "border-rose-500 focus:ring-rose-500/20"
                            : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20"
                        }`}
                      />
                      {inviteTouched && !isInviteEmailValid && (
                        <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          Please enter a valid email address.
                        </p>
                      )}
                    </div>

                    <div className="space-y-1 relative role-select-dropdown">
                      <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                        Role <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                        className="w-full min-h-[40px] px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-left text-neutral-900 dark:text-white flex items-center justify-between hover:border-neutral-400 transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white">{inviteRoleOption.name}</div>
                          <div className="text-[10px] text-neutral-400">{inviteRoleOption.description}</div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />
                      </button>

                      {showRoleDropdown && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 space-y-1 animate-fadeIn max-h-56 overflow-y-auto custom-scrollbar">
                          {AVAILABLE_ROLES_OPTIONS.map((opt) => (
                            <button
                              key={opt.name}
                              type="button"
                              onClick={() => {
                                setInviteRoleOption(opt);
                                setShowRoleDropdown(false);
                              }}
                              className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start justify-between ${
                                inviteRoleOption.name === opt.name
                                  ? "bg-primary-50 dark:bg-primary-950/50 border border-primary-200/60 dark:border-primary-800/60"
                                  : "hover:bg-neutral-50 dark:hover:bg-neutral-900"
                              }`}
                            >
                              <div>
                                <div className="font-semibold text-neutral-900 dark:text-white">{opt.name}</div>
                                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{opt.description}</div>
                              </div>
                              {inviteRoleOption.name === opt.name && <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                    <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Organization & Teams</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1 relative org-select-dropdown">
                      <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                        Organization <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                        className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white flex items-center justify-between hover:border-neutral-400 transition-colors"
                      >
                        <span>{inviteOrg}</span>
                        <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                      </button>

                      {showOrgDropdown && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 space-y-0.5 animate-fadeIn">
                          {AVAILABLE_ORGANIZATIONS.map((org) => (
                            <button
                              key={org}
                              type="button"
                              onClick={() => {
                                setInviteOrg(org);
                                setShowOrgDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                inviteOrg === org
                                  ? "bg-primary-50 dark:bg-primary-950/50 text-primary-600 font-semibold"
                                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                              }`}
                            >
                              <span>{org}</span>
                              {inviteOrg === org && <Check className="w-3.5 h-3.5 text-primary-600" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 relative team-select-dropdown">
                      <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                        Assigned Teams
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                        className="w-full min-h-[40px] px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium flex items-center justify-between hover:border-neutral-400 transition-colors"
                      >
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {inviteTeams.length === 0 ? (
                            <span className="text-neutral-400 italic">Select teams...</span>
                          ) : (
                            inviteTeams.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold text-[11px] flex items-center gap-1"
                              >
                                {t}
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInviteTeams(inviteTeams.filter((item) => item !== t));
                                  }}
                                  className="hover:text-rose-500 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </span>
                              </span>
                            ))
                          )}
                        </div>
                        <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />
                      </button>

                      {showTeamDropdown && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 space-y-0.5 animate-fadeIn max-h-48 overflow-y-auto">
                          {AVAILABLE_TEAMS_LIST.map((teamName) => {
                            const isSelected = inviteTeams.includes(teamName);
                            return (
                              <button
                                key={teamName}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setInviteTeams(inviteTeams.filter((item) => item !== teamName));
                                  } else {
                                    setInviteTeams([...inviteTeams, teamName]);
                                  }
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                  isSelected
                                    ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold"
                                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                                }`}
                              >
                                <span>{teamName}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Personal Models Access</h4>
                  </div>

                  <div className="flex bg-neutral-200 dark:bg-neutral-800 p-0.5 rounded-lg text-[11px]">
                    {(['Configured Models', 'All Proxy Models', 'No Default Models'] as const).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setInviteModelPreset(preset);
                          if (preset === 'All Proxy Models') setInviteModels([...AVAILABLE_MODELS_LIST]);
                          else if (preset === 'No Default Models') setInviteModels([]);
                          else setInviteModels(['gpt-4o', 'claude-3-5-sonnet']);
                        }}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                          inviteModelPreset === preset
                            ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                            : "text-neutral-600 dark:text-neutral-400"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_MODELS_LIST.map((m) => {
                      const isSelected = inviteModels.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setInviteModelPreset('Configured Models');
                            if (isSelected) {
                              setInviteModels(inviteModels.filter((item) => item !== m));
                            } else {
                              setInviteModels([...inviteModels, m]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? "bg-primary-50 dark:bg-primary-950/60 border-primary-400 text-primary-700 dark:text-primary-300 font-semibold"
                              : "bg-white dark:bg-neutral-950 border-neutral-200 text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          <span>{m}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-primary-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Budget Configuration</h4>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    <input
                      type="checkbox"
                      checked={inviteUnlimitedBudget}
                      onChange={(e) => setInviteUnlimitedBudget(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>Unlimited Budget</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Max Budget ($ USD)
                    </label>
                    <input
                      type="number"
                      disabled={inviteUnlimitedBudget}
                      value={inviteUnlimitedBudget ? '' : inviteMaxBudget}
                      onChange={(e) => setInviteMaxBudget(e.target.value)}
                      placeholder={inviteUnlimitedBudget ? "Unlimited" : "500"}
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-mono font-semibold text-neutral-900 dark:text-white disabled:opacity-50 disabled:bg-neutral-100 dark:disabled:bg-neutral-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      Budget Reset Duration
                    </label>
                    <select
                      value={inviteBudgetReset}
                      onChange={(e) => setInviteBudgetReset(e.target.value)}
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Never">Never (One-Time Cap)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Metadata Payload (Optional JSON)</h4>
                </div>

                <div className="space-y-1">
                  <textarea
                    rows={3}
                    value={inviteMetadata}
                    onChange={(e) => setInviteMetadata(e.target.value)}
                    placeholder='{ "department": "AI R&D", "cost_center": "CC-904" }'
                    className={`w-full p-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono text-neutral-900 dark:text-white focus:outline-none ${
                      !isInviteMetadataValid ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20" : "border-neutral-300 dark:border-neutral-700"
                    }`}
                  />
                  {!isInviteMetadataValid && (
                    <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Invalid JSON payload syntax.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <SecondaryButton onClick={() => setShowInviteModal(false)}>
                Cancel
              </SecondaryButton>

              <PrimaryButton
                disabled={!isInviteFormValid || inviteIsSubmitting}
                onClick={handleSubmitInviteUser}
              >
                {inviteIsSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending Invitation...
                  </span>
                ) : (
                  "Invite User"
                )}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODAL 2: BULK INVITE USERS MODAL -------------------- */}
      {showBulkInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh] overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    Bulk Invite Users
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                      CSV Import
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Invite multiple users using a CSV template.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkInviteModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                      <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 font-bold flex items-center justify-center text-xs">
                        1
                      </div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Step 1 — Download Template</h4>
                    </div>

                    <p className="text-neutral-600 dark:text-neutral-400">
                      Follow these steps to format your file correctly:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-neutral-700 dark:text-neutral-300 font-medium pl-1">
                      <li>Download CSV template</li>
                      <li>Fill required columns</li>
                      <li>Save CSV</li>
                      <li>Upload completed CSV</li>
                    </ol>

                    <div className="p-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-1.5">
                      <div className="text-[11px] font-bold text-neutral-500">Required CSV Columns:</div>
                      <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">user_email *</span>
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">user_role *</span>
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">teams</span>
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">budget</span>
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">budget_duration</span>
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">models</span>
                      </div>
                    </div>
                  </div>

                  <PrimaryButton
                    icon={Download}
                    onClick={handleDownloadCsvTemplate}
                    className="w-full justify-center mt-2"
                  >
                    Download CSV Template
                  </PrimaryButton>
                </div>

                <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                      <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 font-bold flex items-center justify-center text-xs">
                        2
                      </div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Step 2 — Upload CSV</h4>
                    </div>

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleProcessBulkFile(e.dataTransfer.files[0]);
                        }
                      }}
                      className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-6 text-center hover:border-purple-500 transition-colors bg-white dark:bg-neutral-950 cursor-pointer space-y-2 relative group"
                    >
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleProcessBulkFile(e.target.files[0]);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white block">Drag & Drop CSV File Here</span>
                        <span className="text-[11px] text-neutral-400">or click to browse from computer (.csv files only)</span>
                      </div>
                    </div>

                    {bulkValidationError && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-center gap-2 animate-fadeIn">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>{bulkValidationError}</span>
                      </div>
                    )}

                    {bulkIsUploading && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <div className="flex justify-between text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                          <span>Validating CSV structure...</span>
                          <span>{bulkUploadProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 transition-all duration-300"
                            style={{ width: `${bulkUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {bulkUploadResult && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 animate-fadeIn">
                        <div className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>CSV Validation Passed!</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                          <div className="bg-white dark:bg-neutral-900 p-1.5 rounded border border-emerald-100 dark:border-emerald-900/40">
                            <div className="text-neutral-400">Rows</div>
                            <div className="font-bold text-neutral-900 dark:text-white">{bulkUploadResult.totalRows}</div>
                          </div>
                          <div className="bg-white dark:bg-neutral-900 p-1.5 rounded border border-emerald-100 dark:border-emerald-900/40">
                            <div className="text-emerald-600 font-medium">Valid</div>
                            <div className="font-bold text-emerald-700 dark:text-emerald-300">{bulkUploadResult.successful}</div>
                          </div>
                          <div className="bg-white dark:bg-neutral-900 p-1.5 rounded border border-emerald-100 dark:border-emerald-900/40">
                            <div className="text-rose-500 font-medium">Failed</div>
                            <div className="font-bold text-rose-600">{bulkUploadResult.failed}</div>
                          </div>
                          <div className="bg-white dark:bg-neutral-900 p-1.5 rounded border border-emerald-100 dark:border-emerald-900/40">
                            <div className="text-amber-500 font-medium">Warnings</div>
                            <div className="font-bold text-amber-600">{bulkUploadResult.warnings}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <SecondaryButton onClick={() => setShowBulkInviteModal(false)}>
                Cancel
              </SecondaryButton>

              <PrimaryButton
                disabled={!bulkUploadResult || bulkUploadResult.successful === 0 || bulkIsImporting}
                onClick={handleExecuteBulkImport}
              >
                {bulkIsImporting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Importing Users...
                  </span>
                ) : (
                  "Import Users"
                )}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODAL 3: BULK EDIT USERS MODAL -------------------- */}
      {showBulkEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh] overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    Bulk Edit Users
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                      {selectedUserIds.size} Users Selected
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Update common settings for all selected users.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkEditModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mx-6 mt-4 p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-blue-950 dark:text-blue-100">Selective Update Notice</span>
                <span className="text-blue-700 dark:text-blue-300">
                  Only the fields you explicitly check and modify below will be applied to all selected users. Unchanged fields will remain as they are.
                </span>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs custom-scrollbar">
              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-neutral-900 dark:text-white">
                    <input
                      type="checkbox"
                      checked={enableBulkRole}
                      onChange={(e) => setEnableBulkRole(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>Update Role</span>
                  </label>
                </div>

                {enableBulkRole && (
                  <div className="space-y-1 relative bulk-role-select-dropdown animate-fadeIn">
                    <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                      New User Role
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowBulkRoleDropdown(!showBulkRoleDropdown)}
                      className="w-full min-h-[40px] px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-left text-neutral-900 dark:text-white flex items-center justify-between hover:border-neutral-400 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-white">{bulkRoleOption.name}</div>
                        <div className="text-[10px] text-neutral-400">{bulkRoleOption.description}</div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />
                    </button>

                    {showBulkRoleDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 space-y-1 animate-fadeIn max-h-48 overflow-y-auto">
                        {AVAILABLE_ROLES_OPTIONS.map((opt) => (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => {
                              setBulkRoleOption(opt);
                              setShowBulkRoleDropdown(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start justify-between ${
                              bulkRoleOption.name === opt.name
                                ? "bg-primary-50 dark:bg-primary-950/50 border border-primary-200/60 dark:border-primary-800/60"
                                : "hover:bg-neutral-50 dark:hover:bg-neutral-900"
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-neutral-900 dark:text-white">{opt.name}</div>
                              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{opt.description}</div>
                            </div>
                            {bulkRoleOption.name === opt.name && <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-neutral-900 dark:text-white">
                    <input
                      type="checkbox"
                      checked={enableBulkTeams}
                      onChange={(e) => setEnableBulkTeams(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>Update Assigned Teams</span>
                  </label>
                </div>

                {enableBulkTeams && (
                  <div className="space-y-1 relative bulk-team-select-dropdown animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => setShowBulkTeamDropdown(!showBulkTeamDropdown)}
                      className="w-full min-h-[40px] px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium flex items-center justify-between hover:border-neutral-400 transition-colors"
                    >
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {bulkTeams.length === 0 ? (
                          <span className="text-neutral-400 italic">Select teams...</span>
                        ) : (
                          bulkTeams.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold text-[11px] flex items-center gap-1"
                            >
                              {t}
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBulkTeams(bulkTeams.filter((item) => item !== t));
                                }}
                                className="hover:text-rose-500 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </span>
                            </span>
                          ))
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />
                    </button>

                    {showBulkTeamDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 space-y-0.5 animate-fadeIn max-h-48 overflow-y-auto">
                        {AVAILABLE_TEAMS_LIST.map((teamName) => {
                          const isSelected = bulkTeams.includes(teamName);
                          return (
                            <button
                              key={teamName}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setBulkTeams(bulkTeams.filter((item) => item !== teamName));
                                } else {
                                  setBulkTeams([...bulkTeams, teamName]);
                                }
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                isSelected
                                  ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold"
                                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                              }`}
                            >
                              <span>{teamName}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-neutral-900 dark:text-white">
                    <input
                      type="checkbox"
                      checked={enableBulkModels}
                      onChange={(e) => setEnableBulkModels(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>Update Personal Models Access</span>
                  </label>

                  {enableBulkModels && (
                    <div className="flex bg-neutral-200 dark:bg-neutral-800 p-0.5 rounded-lg text-[11px]">
                      {(['Configured Models', 'All Proxy Models', 'No Default Models'] as const).map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setBulkModelPreset(preset);
                            if (preset === 'All Proxy Models') setBulkModels([...AVAILABLE_MODELS_LIST]);
                            else if (preset === 'No Default Models') setBulkModels([]);
                            else setBulkModels(['gpt-4o', 'claude-3-5-sonnet']);
                          }}
                          className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                            bulkModelPreset === preset
                              ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                              : "text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {enableBulkModels && (
                  <div className="flex flex-wrap gap-2 animate-fadeIn">
                    {AVAILABLE_MODELS_LIST.map((m) => {
                      const isSelected = bulkModels.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setBulkModelPreset('Configured Models');
                            if (isSelected) {
                              setBulkModels(bulkModels.filter((item) => item !== m));
                            } else {
                              setBulkModels([...bulkModels, m]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? "bg-primary-50 dark:bg-primary-950/60 border-primary-400 text-primary-700 dark:text-primary-300 font-semibold"
                              : "bg-white dark:bg-neutral-950 border-neutral-200 text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          <span>{m}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-primary-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-neutral-900 dark:text-white">
                    <input
                      type="checkbox"
                      checked={enableBulkBudget}
                      onChange={(e) => setEnableBulkBudget(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>Update Budget Configuration</span>
                  </label>

                  {enableBulkBudget && (
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      <input
                        type="checkbox"
                        checked={bulkUnlimitedBudget}
                        onChange={(e) => setBulkUnlimitedBudget(e.target.checked)}
                        className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span>Unlimited Budget</span>
                    </label>
                  )}
                </div>

                {enableBulkBudget && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                        Max Budget ($ USD) {!bulkUnlimitedBudget && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type="number"
                        disabled={bulkUnlimitedBudget}
                        value={bulkUnlimitedBudget ? '' : bulkMaxBudget}
                        onChange={(e) => setBulkMaxBudget(e.target.value)}
                        placeholder={bulkUnlimitedBudget ? "Unlimited" : "500"}
                        className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono font-semibold text-neutral-900 dark:text-white disabled:opacity-50 disabled:bg-neutral-100 dark:disabled:bg-neutral-900 ${
                          !isBulkBudgetValid ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20" : "border-neutral-300 dark:border-neutral-700"
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                        Budget Reset Duration
                      </label>
                      <select
                        value={bulkBudgetReset}
                        onChange={(e) => setBulkBudgetReset(e.target.value)}
                        className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white"
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="Never">Never (One-Time Cap)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-neutral-900 dark:text-white">
                    <input
                      type="checkbox"
                      checked={enableBulkMetadata}
                      onChange={(e) => setEnableBulkMetadata(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>Update Metadata Payload</span>
                  </label>
                </div>

                {enableBulkMetadata && (
                  <div className="space-y-1 animate-fadeIn">
                    <textarea
                      rows={3}
                      value={bulkMetadata}
                      onChange={(e) => setBulkMetadata(e.target.value)}
                      placeholder='{ "department": "AI R&D", "cost_center": "CC-904" }'
                      className={`w-full p-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono text-neutral-900 dark:text-white focus:outline-none ${
                        !isBulkMetadataValid ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20" : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    />
                    {!isBulkMetadataValid && (
                      <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        Invalid JSON metadata format.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <SecondaryButton onClick={() => setShowBulkEditModal(false)}>
                Cancel
              </SecondaryButton>

              <PrimaryButton
                disabled={!isBulkEditFormValid}
                onClick={() => setShowBulkConfirmDialog(true)}
              >
                Apply Changes
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- CONFIRMATION DIALOG FOR BULK EDIT -------------------- */}
      {showBulkConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 my-auto text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Apply Bulk Changes</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  The selected changes will be applied to all <span className="font-bold text-neutral-900 dark:text-white">{selectedUserIds.size}</span> selected users.
                </p>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-1 text-neutral-700 dark:text-neutral-300">
              <div className="font-bold">Modified Sections:</div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-600 dark:text-neutral-400">
                {enableBulkRole && <li>Role: {bulkRoleOption.name}</li>}
                {enableBulkTeams && <li>Teams: {bulkTeams.join(', ')}</li>}
                {enableBulkModels && <li>Models: {bulkModels.join(', ')}</li>}
                {enableBulkBudget && <li>Budget: {bulkUnlimitedBudget ? "Unlimited" : `$${bulkMaxBudget}`} ({bulkBudgetReset})</li>}
                {enableBulkMetadata && <li>Metadata: JSON Payload</li>}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={() => setShowBulkConfirmDialog(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                disabled={bulkEditIsSubmitting}
                onClick={handleConfirmBulkChangesSubmit}
              >
                {bulkEditIsSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Applying Changes...
                  </span>
                ) : (
                  "Apply"
                )}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- ROW ACTION MODAL: RESET PASSWORD -------------------- */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 my-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Reset Password Link</h3>
                  <p className="text-[11px] text-neutral-500">Generate and copy a password reset link for this user.</p>
                </div>
              </div>
              <button
                onClick={() => setResetPasswordUser(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300">User Email & ID</label>
                <div className="p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                  {resetPasswordUser.email} ({resetPasswordUser.id})
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300">Generated Reset Link</label>
                <input
                  type="text"
                  readOnly
                  value={`https://gateway.company.com/auth/reset-password?token=rst_${resetPasswordUser.id.replace('usr-lite-', '')}_${Math.random().toString(36).substring(2, 10)}`}
                  className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-[11px] text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={() => setResetPasswordUser(null)}>
                Close
              </SecondaryButton>
              <PrimaryButton
                icon={Copy}
                onClick={() => {
                  navigator.clipboard.writeText(`https://gateway.company.com/auth/reset-password?token=rst_${resetPasswordUser.id.replace('usr-lite-', '')}_${Math.random().toString(36).substring(2, 10)}`);
                  toast.success(`Password reset link copied for ${resetPasswordUser.email}`);
                  setResetPasswordUser(null);
                }}
              >
                Copy Reset Password Link
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- ROW ACTION MODAL: DELETE USER CONFIRMATION -------------------- */}
      {deleteUserTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 my-auto text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Delete User</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Are you sure you want to delete <span className="font-bold text-neutral-900 dark:text-white">{deleteUserTarget.userAlias}</span> ({deleteUserTarget.id})?
                </p>
              </div>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 rounded-xl">
              This action cannot be undone. All active virtual keys, access routes, and session contexts for this user will be revoked immediately.
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={() => setDeleteUserTarget(null)}>
                Cancel
              </SecondaryButton>
              <button
                type="button"
                onClick={handleConfirmDeleteUserRow}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-2xs"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
