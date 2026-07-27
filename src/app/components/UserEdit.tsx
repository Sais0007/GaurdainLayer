import { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Users,
  Building2,
  Sparkles,
  BarChart3,
  RotateCcw,
  Check,
  ChevronDown,
  X,
  AlertCircle,
  FileText,
  Loader2,
  Lock,
  Mail,
  Shield,
  User as UserIcon,
  Calendar
} from 'lucide-react';
import { PageHeader, SecondaryButton, PrimaryButton } from './hb/listing';
import { toast } from 'sonner';

export interface UserEditProps {
  user: any;
  onBack: () => void;
}

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

export default function UserEdit({ user, onBack }: UserEditProps) {
  // Read-Only Initial Data
  const userId = user?.id || "usr-lite-8f9a2b";
  const userEmail = user?.email || "hbadmin@yopmail.com";
  const createdDate = user?.createdDate || user?.createdAt || "2024-01-15";
  const organization = user?.organization || "HB Enterprise";
  const userStatus = user?.status || "active";

  // Editable Form State
  const initialRoleName = user?.role || "Admin";
  const matchedRole = AVAILABLE_ROLES_OPTIONS.find((r) => r.value === initialRoleName || r.name === initialRoleName) || AVAILABLE_ROLES_OPTIONS[3];

  const [userAlias, setUserAlias] = useState(user?.name || user?.userAlias || "HB Admin");
  const [roleOption, setRoleOption] = useState(matchedRole);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Organization & Teams
  const [selectedTeams, setSelectedTeams] = useState<string[]>(
    user?.team ? [user.team] : ["AI Research", "DevOps Core"]
  );
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  // Personal Models
  const [selectedModels, setSelectedModels] = useState<string[]>(
    user?.models || ["gpt-4o", "claude-3-5-sonnet"]
  );
  const [modelPreset, setModelPreset] = useState<'Configured Models' | 'All Proxy Models' | 'No Default Models'>('Configured Models');

  // Budget Configuration
  const initialBudgetUsd = user?.budgetUsd !== undefined ? user.budgetUsd : 500;
  const [unlimitedBudget, setUnlimitedBudget] = useState(initialBudgetUsd === null);
  const [maxBudget, setMaxBudget] = useState(initialBudgetUsd !== null ? String(initialBudgetUsd) : "500");
  const [budgetResetDuration, setBudgetResetDuration] = useState(user?.budgetDuration || "Monthly");

  // Metadata
  const [metadataText, setMetadataText] = useState(
    user?.metadata ? JSON.stringify(user.metadata, null, 2) : '{\n  "department": "AI R&D",\n  "cost_center": "CC-904"\n}'
  );

  // Form Interactions
  const [touched, setTouched] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.role-select-dropdown')) {
        setShowRoleDropdown(false);
      }
      if (!target.closest('.team-select-dropdown')) {
        setShowTeamDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Validation Rules
  const isAliasValid = useMemo(() => userAlias.trim() !== '', [userAlias]);
  const isBudgetValid = useMemo(() => {
    if (unlimitedBudget) return true;
    return maxBudget.trim() !== '' && !isNaN(Number(maxBudget)) && Number(maxBudget) >= 0;
  }, [unlimitedBudget, maxBudget]);

  const isMetadataValid = useMemo(() => {
    if (!metadataText.trim()) return true;
    try {
      JSON.parse(metadataText);
      return true;
    } catch {
      return false;
    }
  }, [metadataText]);

  const isFormValid = useMemo(() => {
    return isAliasValid && roleOption !== null && isBudgetValid && isMetadataValid;
  }, [isAliasValid, roleOption, isBudgetValid, isMetadataValid]);

  // Submit Handler
  const handleSave = () => {
    setTouched(true);
    if (!isFormValid) return;

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`Successfully updated user settings for ${userAlias}`);
      onBack();
    }, 500);
  };

  return (
    <div className="p-6 bg-transparent dark:bg-neutral-950 space-y-6">
      {/* 1. HB PAGE HEADER & BREADCRUMB */}
      <PageHeader
        pageId="internal-users"
        action="edit"
        itemName={userAlias}
      >
        <div className="flex items-center gap-2">
          <SecondaryButton icon={ArrowLeft} onClick={onBack}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            icon={Save}
            disabled={!isFormValid || isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </PrimaryButton>
        </div>
      </PageHeader>

      {/* 2. USER HEADER CARD */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
            {userAlias.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {userAlias}
              </h2>
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
            </div>
            <div className="text-xs text-neutral-500 font-mono mt-0.5">
              User ID: {userId}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SecondaryButton onClick={onBack}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            icon={Save}
            disabled={!isFormValid || isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </PrimaryButton>
        </div>
      </div>

      {/* 3. RESPONSIVE TWO-COLUMN FORM LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* SECTION 1 — USER INFORMATION */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <UserIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">User Information</h3>
          </div>

          <div className="space-y-4">
            {/* Read-Only: Email */}
            <div className="space-y-1">
              <label className="block font-semibold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Read-only
                </span>
              </label>
              <input
                type="text"
                disabled
                value={userEmail}
                className="w-full h-10 px-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-medium text-neutral-600 dark:text-neutral-400 cursor-not-allowed"
              />
            </div>

            {/* Read-Only: User ID */}
            <div className="space-y-1">
              <label className="block font-semibold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                <span>User ID</span>
                <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Read-only
                </span>
              </label>
              <input
                type="text"
                disabled
                value={userId}
                className="w-full h-10 px-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-mono text-neutral-600 dark:text-neutral-400 cursor-not-allowed"
              />
            </div>

            {/* Read-Only: Created Date */}
            <div className="space-y-1">
              <label className="block font-semibold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                <span>Created Date</span>
                <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Read-only
                </span>
              </label>
              <input
                type="text"
                disabled
                value={createdDate}
                className="w-full h-10 px-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-medium text-neutral-600 dark:text-neutral-400 cursor-not-allowed"
              />
            </div>

            {/* Editable: User Alias */}
            <div className="space-y-1">
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                User Alias <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={userAlias}
                onChange={(e) => setUserAlias(e.target.value)}
                placeholder="e.g. HB Admin"
                className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-all ${
                  touched && !isAliasValid
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500"
                }`}
              />
              {touched && !isAliasValid && (
                <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  User Alias is required.
                </p>
              )}
            </div>

            {/* Editable: Role (Searchable Dropdown with Descriptions) */}
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
                  <div className="font-semibold text-neutral-900 dark:text-white">{roleOption.name}</div>
                  <div className="text-[10px] text-neutral-400">{roleOption.description}</div>
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
                        setRoleOption(opt);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start justify-between ${
                        roleOption.name === opt.name
                          ? "bg-primary-50 dark:bg-primary-950/50 border border-primary-200/60 dark:border-primary-800/60"
                          : "hover:bg-neutral-50 dark:hover:bg-neutral-900"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-white">{opt.name}</div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{opt.description}</div>
                      </div>
                      {roleOption.name === opt.name && <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2 — ORGANIZATION & TEAMS */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Organization & Teams</h3>
          </div>

          <div className="space-y-4">
            {/* Read-Only: Organization */}
            <div className="space-y-1">
              <label className="block font-semibold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                <span>Organization</span>
                <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Read-only
                </span>
              </label>
              <input
                type="text"
                disabled
                value={organization}
                className="w-full h-10 px-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-semibold text-neutral-600 dark:text-neutral-400 cursor-not-allowed"
              />
            </div>

            {/* Searchable Teams Multi-Select */}
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
                  {selectedTeams.length === 0 ? (
                    <span className="text-neutral-400 italic">Select teams...</span>
                  ) : (
                    selectedTeams.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold text-[11px] flex items-center gap-1"
                      >
                        {t}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTeams(selectedTeams.filter((item) => item !== t));
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
                    const isSelected = selectedTeams.includes(teamName);
                    return (
                      <button
                        key={teamName}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedTeams(selectedTeams.filter((item) => item !== teamName));
                          } else {
                            setSelectedTeams([...selectedTeams, teamName]);
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

        {/* SECTION 3 — PERSONAL MODELS */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Personal Models Access</h3>
            </div>

            <div className="flex bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-[11px]">
              {(['Configured Models', 'All Proxy Models', 'No Default Models'] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setModelPreset(preset);
                    if (preset === 'All Proxy Models') setSelectedModels([...AVAILABLE_MODELS_LIST]);
                    else if (preset === 'No Default Models') setSelectedModels([]);
                    else setSelectedModels(['gpt-4o', 'claude-3-5-sonnet']);
                  }}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    modelPreset === preset
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
                const isSelected = selectedModels.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setModelPreset('Configured Models');
                      if (isSelected) {
                        setSelectedModels(selectedModels.filter((item) => item !== m));
                      } else {
                        setSelectedModels([...selectedModels, m]);
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

        {/* SECTION 4 — BUDGET CONFIGURATION */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Budget Configuration</h3>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <input
                type="checkbox"
                checked={unlimitedBudget}
                onChange={(e) => setUnlimitedBudget(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
              />
              <span>Unlimited Budget</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                Max Budget ($ USD) {!unlimitedBudget && <span className="text-rose-500">*</span>}
              </label>
              <input
                type="number"
                disabled={unlimitedBudget}
                value={unlimitedBudget ? '' : maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder={unlimitedBudget ? "Unlimited" : "500"}
                className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono font-semibold text-neutral-900 dark:text-white disabled:opacity-50 disabled:bg-neutral-100 dark:disabled:bg-neutral-900 ${
                  touched && !isBudgetValid
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-neutral-300 dark:border-neutral-700"
                }`}
              />
              {touched && !isBudgetValid && (
                <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Budget Amount is required when Unlimited Budget is disabled.
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                Budget Reset Duration
              </label>
              <select
                value={budgetResetDuration}
                onChange={(e) => setBudgetResetDuration(e.target.value)}
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

        {/* SECTION 5 — METADATA */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Metadata Payload (Optional JSON)</h3>
          </div>

          <div className="space-y-1">
            <textarea
              rows={4}
              value={metadataText}
              onChange={(e) => setMetadataText(e.target.value)}
              placeholder='{\n  "department": "AI R&D",\n  "cost_center": "CC-904"\n}'
              className={`w-full p-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono text-neutral-900 dark:text-white focus:outline-none ${
                !isMetadataValid ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20" : "border-neutral-300 dark:border-neutral-700"
              }`}
            />
            {!isMetadataValid && (
              <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Invalid JSON format syntax.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 4. STICKY FOOTER ACTION BAR */}
      <div className="sticky bottom-0 z-10 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-lg">
        <SecondaryButton onClick={onBack}>
          Cancel
        </SecondaryButton>

        <PrimaryButton
          icon={Save}
          disabled={!isFormValid || isSaving}
          onClick={handleSave}
        >
          {isSaving ? "Saving Changes..." : "Save Changes"}
        </PrimaryButton>
      </div>
    </div>
  );
}
