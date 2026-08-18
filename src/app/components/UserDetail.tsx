import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Copy,
  Users,
  Building2,
  Sparkles,
  BarChart3,
  RotateCcw,
  Trash2,
  Plus,
  X,
  Check,
  ChevronDown,
  Info,
  Shield,
  ShieldCheck,
  Key,
  Clock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  AlertTriangle,
  Code2,
  ExternalLink,
  Edit
} from 'lucide-react';
import { PageHeader, SecondaryButton, PrimaryButton } from './hb/listing';
import { toast } from 'sonner';

export interface UserDetailProps {
  user: any;
  onBack: () => void;
  onEdit?: () => void;
  onToggleStatus?: (user: any) => void;
}

interface UserTeamItem {
  id: string;
  name: string;
  role: 'User' | 'Admin';
}

const AVAILABLE_TEAMS_FOR_ADD = [
  { name: "AI Research", description: "Core LLM research & experimental model routing" },
  { name: "DevOps Core", description: "Infrastructure automation & deployment proxies" },
  { name: "QA Testing", description: "Automated regression testing & synthetic loads" },
  { name: "Infrastructure", description: "Gateway routing, latency monitoring & edge clusters" }
];

export default function UserDetail({ user, onBack, onEdit }: UserDetailProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  // User details state (mock defaults derived from user prop)
  const userId = String(user?.id || "usr-lite-8f9a2b");
  const userName = String(user?.userAlias || user?.name || "HB Admin").trim();
  const userEmail = String(user?.email || "hbadmin@yopmail.com");
  const userStatus = user?.status || "active";
  const userRole = user?.role || "Admin";

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "U";
    const parts = nameStr.split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    return parts.map((n) => n[0]).join("").toUpperCase();
  };

  // Spend & Budget
  const spendUsd = typeof user?.spendUsd === 'number' ? user.spendUsd : 142.50;
  const budgetUsd = user?.budgetUsd !== undefined ? user.budgetUsd : 500.00; // null = Unlimited
  const softBudgetUsd = user?.softBudgetUsd !== undefined ? user.softBudgetUsd : 400.00;
  const notificationEmails: string[] = user?.notificationEmails || [userEmail, "finance@company.com"];
  const budgetDuration = user?.budgetDuration || "Monthly";

  // Teams list
  const [userTeams, setUserTeams] = useState<UserTeamItem[]>([
    { id: "team-1", name: user?.team || "AI Research", role: "Admin" },
    { id: "team-2", name: "DevOps Core", role: "User" }
  ]);

  // Personal Models
  const [userModels] = useState<string[]>(
    user?.models || ["gpt-4o", "claude-3-5-sonnet", "gemini-1-5-pro"]
  );

  // Metadata
  const userMetadata = user?.metadata || {
    department: "AI R&D",
    cost_center: "CC-904",
    provisioned_by: "sso-okta-8f9a"
  };

  /* -------------------- MODAL POPUP STATES -------------------- */
  // Add Team Modal
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [addTeamName, setAddTeamName] = useState(AVAILABLE_TEAMS_FOR_ADD[0].name);
  const [showAddTeamDropdown, setShowAddTeamDropdown] = useState(false);
  const [addTeamRole, setAddTeamRole] = useState<'User' | 'Admin'>('User');

  // Reset Password Modal
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const resetPasswordLink = `https://gateway.company.com/auth/reset-password?token=rst_${userId.replace('usr-lite-', '')}_${Math.random().toString(36).substring(2, 10)}`;

  // Delete User Confirmation Modal
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

  // Copy User ID handler
  const handleCopyUserId = () => {
    navigator.clipboard.writeText(userId);
    toast.success(`Copied User ID: ${userId}`);
  };

  // Add User to Team submit handler
  const handleAddTeamSubmit = () => {
    if (userTeams.some((t) => t.name === addTeamName)) {
      toast.error(`User is already a member of team "${addTeamName}".`);
      return;
    }

    const newTeamItem: UserTeamItem = {
      id: `team-${Math.random().toString(36).substring(2, 6)}`,
      name: addTeamName,
      role: addTeamRole
    };

    setUserTeams([...userTeams, newTeamItem]);
    setShowAddTeamModal(false);
    toast.success(`Added user to team "${addTeamName}" as ${addTeamRole}`);
  };

  // Remove Team handler
  const handleRemoveTeam = (teamId: string, teamName: string) => {
    setUserTeams(userTeams.filter((t) => t.id !== teamId));
    toast.info(`Removed user from team "${teamName}"`);
  };

  // Copy Reset Password Link handler
  const handleCopyResetLink = () => {
    navigator.clipboard.writeText(resetPasswordLink);
    toast.success("Password reset link copied successfully.");
    setShowResetPasswordModal(false);
  };

  // Confirm Delete User handler
  const handleConfirmDeleteUser = () => {
    setShowDeleteUserModal(false);
    toast.success(`User "${userName}" (${userId}) deleted successfully.`);
    onBack();
  };

  // Spend percentage calculation
  const spendPercentage = useMemo(() => {
    if (budgetUsd === null || budgetUsd === 0) return 0;
    return Math.min(100, Math.round((spendUsd / budgetUsd) * 100));
  }, [spendUsd, budgetUsd]);

  return (
    <div className="p-6 bg-transparent dark:bg-neutral-950 space-y-6">
      {/* 1. HB PAGE HEADER */}
      <PageHeader pageId="internal-users" action="view" itemName={userName}>
        <div className="flex items-center gap-2">
          {/* Top-Left Action: Back to Users */}
          <SecondaryButton icon={ArrowLeft} onClick={onBack}>
            Back to Users
          </SecondaryButton>
          {onEdit && (
            <PrimaryButton icon={Edit} onClick={onEdit}>
              Edit User
            </PrimaryButton>
          )}
        </div>
      </PageHeader>

      {/* 2. USER INFORMATION HEADER CARD */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl">
            {getInitials(userName)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {userName}
              </h2>

              {/* Status Badge */}
              {userStatus === 'active' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  Inactive
                </span>
              )}

              {/* Role Badge */}
              <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700">
                {userRole}
              </span>
            </div>

            {/* Email & ID Row */}
            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 flex-wrap">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {userEmail}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-mono">
                <span>ID: {userId}</span>
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-0.5"
                  title="Copy User ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top-Right Header Actions: Edit User, Reset Password & Delete User */}
        <div className="flex items-center gap-2.5">
          {onEdit && (
            <PrimaryButton icon={Edit} onClick={onEdit}>
              Edit User
            </PrimaryButton>
          )}

          <SecondaryButton
            icon={RotateCcw}
            onClick={() => setShowResetPasswordModal(true)}
          >
            Reset Password
          </SecondaryButton>

          <button
            type="button"
            onClick={() => setShowDeleteUserModal(true)}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Delete User
          </button>
        </div>
      </div>

      {/* 3. NAVIGATION TABS (Overview & Details) */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <nav className="-mb-px flex gap-6 text-sm font-semibold" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-2.5 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Details
          </button>
        </nav>
      </div>

      {/* 4. TAB 1: OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CARD 1 — SPEND SUMMARY */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Spend Summary</h3>
                </div>
                <span className="text-[11px] font-medium text-neutral-400">{budgetDuration} Reset</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-[11px] text-neutral-400">Current Spend</div>
                    <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                      ${spendUsd.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-neutral-400">Budget Cap</div>
                    {budgetUsd === null ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        Unlimited
                      </span>
                    ) : (
                      <div className="text-base font-bold font-mono text-neutral-700 dark:text-neutral-300">
                        ${budgetUsd.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {budgetUsd !== null && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] font-semibold text-neutral-500">
                      <span>Usage Progress</span>
                      <span>{spendPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          spendPercentage > 85 ? "bg-rose-500" : spendPercentage > 60 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${spendPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
                {budgetUsd === null && (
                  <div className="p-2.5 bg-neutral-50 dark:bg-neutral-900/60 rounded-lg text-[11px] text-neutral-500 italic border border-neutral-200/60 dark:border-neutral-800">
                    No explicit spend limit imposed for this user account.
                  </div>
                )}
              </div>
            </div>

            {/* CARD 2 — TEAMS MANAGEMENT */}
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Assigned Teams</h3>
                </div>

                {/* Top-Right Add Team Action */}
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-100 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Team
                </button>
              </div>

              {/* HB Table of Teams */}
              {userTeams.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-50/60 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                        <th className="py-2.5 px-3">Team Name</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {userTeams.map((team) => (
                        <tr key={team.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40">
                          <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{team.name}</span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveTeam(team.id, team.name)}
                              className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors inline-flex items-center justify-center"
                              title="Remove from Team"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Empty State */
                <div className="py-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-xs text-neutral-800 dark:text-neutral-200">No Teams Assigned</div>
                  <p className="text-[11px] text-neutral-400">This user is not currently assigned to any team.</p>
                </div>
              )}
            </div>
          </div>

          {/* CARD 3 — PERSONAL MODELS */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Personal Models Access</h3>
              </div>
              <span className="text-[11px] font-medium text-neutral-400">{userModels.length} Models Configured</span>
            </div>

            {userModels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userModels.map((m) => (
                  <span
                    key={m}
                    className="px-3 py-1.5 rounded-lg border text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                    {m}
                  </span>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-neutral-800 dark:text-neutral-200">No Personal Models Assigned</div>
                <p className="text-[11px] text-neutral-400">No default personal proxy models are assigned to this user.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TAB 2: DETAILS TAB (READ-ONLY) */}
      {activeTab === 'details' && (
        <div className="space-y-6 animate-fadeIn text-xs">
          {/* SECTION 1 — USER INFORMATION */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <UserIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">User Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-neutral-400 font-medium">User ID</div>
                <div className="font-mono font-bold text-neutral-900 dark:text-white">{userId}</div>
              </div>

              <div className="space-y-1">
                <div className="text-neutral-400 font-medium">Email Address</div>
                <div className="font-semibold text-neutral-900 dark:text-white">{userEmail}</div>
              </div>

              <div className="space-y-1">
                <div className="text-neutral-400 font-medium">Full Name</div>
                <div className="font-semibold text-neutral-900 dark:text-white">{userName}</div>
              </div>

              <div className="space-y-1">
                <div className="text-neutral-400 font-medium">Assigned Role</div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700">
                    {userRole}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 — PERSONAL MODELS */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Personal Models</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {userModels.length === 0 ? (
                <span className="text-neutral-400 italic">Not Set</span>
              ) : (
                userModels.map((m) => (
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

          {/* SECTION 3 — BUDGET */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Budget Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-neutral-400 font-medium">Maximum Budget</div>
                <div>
                  {budgetUsd === null ? (
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Unlimited
                    </span>
                  ) : (
                    <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">
                      ${budgetUsd.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-neutral-400 font-medium">Soft Budget ($)</div>
                <div>
                  {budgetUsd === null ? (
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Unlimited
                    </span>
                  ) : (
                    <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">
                      ${softBudgetUsd.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-neutral-400 font-medium">Budget Reset Duration</div>
                <div className="font-semibold text-neutral-900 dark:text-white">{budgetDuration}</div>
              </div>
            </div>

            {/* Notification Emails */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <div className="text-neutral-400 font-medium">Notification Emails</div>
              <div className="flex flex-wrap gap-2">
                {notificationEmails.map((email: string) => (
                  <span
                    key={email}
                    className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold text-xs flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-purple-500" />
                    {email}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 2: DETAILS TAB (READ-ONLY) END */}

      {/* -------------------- MODAL 1: ADD USER TO TEAM MODAL -------------------- */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Add User to Team</h3>
                  <p className="text-[11px] text-neutral-500">Assign user to an active team.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Team Dropdown */}
              <div className="space-y-1 relative">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Team <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddTeamDropdown(!showAddTeamDropdown)}
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white flex items-center justify-between"
                >
                  <span>{addTeamName}</span>
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                </button>

                {showAddTeamDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 space-y-1 animate-fadeIn">
                    {AVAILABLE_TEAMS_FOR_ADD.map((t) => (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => {
                          setAddTeamName(t.name);
                          setShowAddTeamDropdown(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg transition-colors flex items-start justify-between ${
                          addTeamName === t.name
                            ? "bg-primary-50 dark:bg-primary-950/50 text-primary-600 font-semibold"
                            : "hover:bg-neutral-50 dark:hover:bg-neutral-900"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white">{t.name}</div>
                          <div className="text-[10px] text-neutral-400">{t.description}</div>
                        </div>
                        {addTeamName === t.name && <Check className="w-4 h-4 text-primary-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={() => setShowAddTeamModal(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleAddTeamSubmit}>
                Add To Team
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODAL 2: RESET PASSWORD LINK MODAL -------------------- */}
      {showResetPasswordModal && (
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
                onClick={() => setShowResetPasswordModal(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300">User ID</label>
                <div className="p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                  {userId}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300">Generated Reset Link</label>
                <input
                  type="text"
                  readOnly
                  value={resetPasswordLink}
                  className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-[11px] text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={() => setShowResetPasswordModal(false)}>
                Close
              </SecondaryButton>
              <PrimaryButton icon={Copy} onClick={handleCopyResetLink}>
                Copy Reset Password Link
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODAL 3: DELETE USER CONFIRMATION DIALOG -------------------- */}
      {showDeleteUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 my-auto text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Delete User</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Are you sure you want to delete <span className="font-bold text-neutral-900 dark:text-white">{userName}</span> ({userId})?
                </p>
              </div>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 rounded-xl">
              This action cannot be undone. All active virtual keys, access routes, and session contexts for this user will be revoked immediately.
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={() => setShowDeleteUserModal(false)}>
                Cancel
              </SecondaryButton>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
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
