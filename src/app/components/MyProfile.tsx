import React, { useState, useRef } from "react";
import {
  User,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Briefcase,
  Globe,
  Camera,
  Trash2,
  Check,
  X,
  Lock,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  Key,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
  Upload,
  Bell
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, PrimaryButton, SecondaryButton, IconButton } from "./hb/listing";

export interface MyProfileProps {
  onNavigate?: (pageId: string) => void;
}

export default function MyProfile({ onNavigate }: MyProfileProps) {
  // Navigation Active Tab
  const [activeTab, setActiveTab] = useState<"personal" | "security">("personal");

  // Profile Information State
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@company.com");
  const [phone, setPhone] = useState("+1 (555) 019-2834");
  const [jobTitle, setJobTitle] = useState("Chief Organization Admin");
  const [department, setDepartment] = useState("Platform Operations & Governance");
  const [timezone, setTimezone] = useState("(UTC-05:00) Eastern Time (US & Canada)");

  // Read-only profile metadata
  const userId = "usr-7731f-org";
  const orgName = "HB Enterprise";
  const orgId = "org-57c860ac";
  const role = "Organization Admin";
  const joinedDate = "Jul 15, 2026";
  const orgStatus = "Active";
  const subscriptionPlan = "Enterprise Gateway Plan";

  // Avatar / Profile Photo State
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Interactions
  const [isSaving, setIsSaving] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // Notification Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);

  // Password Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // --- Photo Upload Handlers ---
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format
    const validFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!validFormats.includes(file.type)) {
      toast.error("Unsupported file format. Please upload JPG, PNG, or WEBP.");
      return;
    }

    // Validate size (Max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Oversized image file. Maximum size allowed is 5 MB.");
      return;
    }

    // Simulate Upload with Progress Indicator
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result as string);
            setShowPhotoModal(true);
          };
          reader.readAsDataURL(file);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  const handleSavePhoto = () => {
    if (previewImage) {
      setProfileImage(previewImage);
      toast.success("Profile photo updated successfully!");
    }
    setShowPhotoModal(false);
    setPreviewImage(null);
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
    setPreviewImage(null);
    setShowPhotoModal(false);
    toast.success("Profile photo removed. Reverted to initials avatar.");
  };

  // --- Form Handlers ---
  const handleRefresh = () => {
    setFullName("John Doe");
    setEmail("john.doe@company.com");
    setPhone("+1 (555) 019-2834");
    setJobTitle("Chief Organization Admin");
    setDepartment("Platform Operations & Governance");
    setTimezone("(UTC-05:00) Eastern Time (US & Canada)");
    setFormTouched(false);
    toast.info("Refreshed profile data.");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);

    if (!fullName.trim()) {
      toast.error("Full Name is required.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("A valid Email Address is required.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile information saved successfully!");
    }, 600);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordTouched(true);

    if (!currentPassword) {
      toast.error("Current password is required.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordTouched(false);
      toast.success("Security credentials & password updated successfully!");
    }, 700);
  };

  // Helper Initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase() || "JD";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header with Breadcrumbs */}
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal account information, security credentials, and organization profile."
        breadcrumbs={[
          { label: "My Profile", current: true }
        ]}
      />

      {/* -------------------- 1. HEADER CARD (SUPER ADMIN MATCH) -------------------- */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs transition-shadow">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Avatar & User Core Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar Box with Photo Overlay */}
            <div className="relative group">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={fullName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-amber-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-md tracking-wider">
                  {getInitials(fullName)}
                </div>
              )}

              {/* Camera Icon Overlay */}
              <button
                type="button"
                onClick={handlePhotoClick}
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg cursor-pointer transition-transform hover:scale-110 flex items-center justify-center border-2 border-white dark:border-neutral-900"
                title="Upload Profile Photo"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Title, Role Badge, Email, Org */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {fullName}
                </h2>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  {role}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  {email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  {orgName}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side Stats / Security Score */}
          <div className="flex items-center gap-3 self-center md:self-start">
            <div className="px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 text-center">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Account Status
              </div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {orgStatus}
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 text-center">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Security Score
              </div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                98% (High)
              </div>
            </div>
          </div>
        </div>

        {/* Upload Progress Bar if Uploading */}
        {isUploading && (
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1 animate-fadeIn">
            <div className="flex justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              <span>Uploading Profile Photo...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* -------------------- 2. NAVIGATION TABS (SUPER ADMIN MATCH) -------------------- */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("personal")}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 transition-all relative ${
            activeTab === "personal"
              ? "text-amber-600 dark:text-amber-400 border-b-2 border-amber-500"
              : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 transition-all relative ${
            activeTab === "security"
              ? "text-amber-600 dark:text-amber-400 border-b-2 border-amber-500"
              : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Security & Credentials</span>
        </button>
      </div>

      {/* -------------------- TAB 1: PERSONAL INFORMATION -------------------- */}
      {activeTab === "personal" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Profile & Contact Information Form Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  Profile & Contact Information
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Update your personal account details and communication preferences.
                </p>
              </div>

              <IconButton
                icon={RefreshCw}
                label="Refresh"
                onClick={handleRefresh}
                title="Refresh Profile Data"
              />
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Editable Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg font-semibold text-neutral-900 dark:text-white focus:outline-none transition-all ${
                      formTouched && !fullName.trim()
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-neutral-300 dark:border-neutral-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    }`}
                  />
                  {formTouched && !fullName.trim() && (
                    <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Full Name is required.
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@company.com"
                    className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg font-semibold text-neutral-900 dark:text-white focus:outline-none transition-all ${
                      formTouched && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-neutral-300 dark:border-neutral-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    }`}
                  />
                  {formTouched && !email.trim() && (
                    <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Email Address is required.
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                {/* Job Title */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Chief Organization Admin"
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Platform Operations & Governance"
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                {/* Timezone */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  >
                    <option value="(UTC-05:00) Eastern Time (US & Canada)">(UTC-05:00) Eastern Time (US & Canada)</option>
                    <option value="(UTC+00:00) UTC (Greenwich Mean Time)">(UTC+00:00) UTC (Greenwich Mean Time)</option>
                    <option value="(UTC+05:30) India Standard Time (IST)">(UTC+05:30) India Standard Time (IST)</option>
                    <option value="(UTC+08:00) Singapore Standard Time">(UTC+08:00) Singapore Standard Time</option>
                  </select>
                </div>
              </div>

              {/* Read-Only System Identifiers Section */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-3 flex items-center justify-between">
                  <span>System Identifiers & Role</span>
                  <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Read-only
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 rounded-xl text-xs">
                  <div>
                    <div className="text-neutral-400 font-medium text-[11px]">User ID</div>
                    <div className="font-mono font-semibold text-neutral-900 dark:text-white mt-0.5">{userId}</div>
                  </div>
                  <div>
                    <div className="text-neutral-400 font-medium text-[11px]">Organization Name</div>
                    <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">{orgName}</div>
                  </div>
                  <div>
                    <div className="text-neutral-400 font-medium text-[11px]">Role</div>
                    <div className="font-semibold text-amber-600 dark:text-amber-400 mt-0.5">{role}</div>
                  </div>
                  <div>
                    <div className="text-neutral-400 font-medium text-[11px]">Joined Date</div>
                    <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">{joinedDate}</div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer Bar */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <SecondaryButton onClick={handleRefresh}>
                  Cancel
                </SecondaryButton>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>

          {/* -------------------- READ-ONLY ORGANIZATION INFORMATION CARD -------------------- */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Organization Information</h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Managed by Super Admin
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
              <div className="space-y-1 p-3 bg-neutral-50/60 dark:bg-neutral-950 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                <div className="text-neutral-400 font-medium">Organization Name</div>
                <div className="font-bold text-neutral-900 dark:text-white">{orgName}</div>
              </div>

              <div className="space-y-1 p-3 bg-neutral-50/60 dark:bg-neutral-950 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                <div className="text-neutral-400 font-medium">Organization ID</div>
                <div className="font-mono font-bold text-neutral-900 dark:text-white">{orgId}</div>
              </div>

              <div className="space-y-1 p-3 bg-neutral-50/60 dark:bg-neutral-950 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                <div className="text-neutral-400 font-medium">Organization Status</div>
                <div className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> {orgStatus}
                </div>
              </div>

              <div className="space-y-1 p-3 bg-neutral-50/60 dark:bg-neutral-950 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                <div className="text-neutral-400 font-medium">Created Date</div>
                <div className="font-semibold text-neutral-900 dark:text-white">{joinedDate}</div>
              </div>

              <div className="space-y-1 p-3 bg-neutral-50/60 dark:bg-neutral-950 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                <div className="text-neutral-400 font-medium">Subscription Plan</div>
                <div className="font-semibold text-amber-600 dark:text-amber-400">{subscriptionPlan}</div>
              </div>
            </div>
          </div>

          {/* -------------------- NOTIFICATION PREFERENCES CARD (OPTIONAL) -------------------- */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <Bell className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Notification Preferences</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">Email Notifications</div>
                  <div className="text-neutral-400 text-[11px]">Receive general summary & account digests</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">Budget Alerts</div>
                  <div className="text-neutral-400 text-[11px]">Notifications when soft/max budget is reached</div>
                </div>
                <input
                  type="checkbox"
                  checked={budgetAlerts}
                  onChange={(e) => setBudgetAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">Security Alerts</div>
                  <div className="text-neutral-400 text-[11px]">Instant alert on new login or credential change</div>
                </div>
                <input
                  type="checkbox"
                  checked={securityAlerts}
                  onChange={(e) => setSecurityAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">System Updates</div>
                  <div className="text-neutral-400 text-[11px]">Maintenance & feature update announcements</div>
                </div>
                <input
                  type="checkbox"
                  checked={systemUpdates}
                  onChange={(e) => setSystemUpdates(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 2: SECURITY & CREDENTIALS (SUPER ADMIN MATCH) -------------------- */}
      {activeTab === "security" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <Key className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  Change Password
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Ensure your account is using a long, strong, and unique password.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              {/* 3-Column Password Fields matching Screenshot 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full h-10 pl-3 pr-10 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full h-10 pl-3 pr-10 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-medium mt-1">
                    At least 8 characters long
                  </p>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                    Confirm New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full h-10 pl-3 pr-10 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Action Button */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingPassword ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Key className="w-4 h-4" />
                  )}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- PHOTO PREVIEW & MODAL -------------------- */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-500" />
                <span>Preview Profile Photo</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 py-2">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-36 h-36 rounded-2xl object-cover border-4 border-amber-400 shadow-lg"
                />
              )}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                Review your uploaded profile image before saving. Max size: 5 MB (JPG, PNG, WEBP).
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Photo</span>
              </button>

              <div className="flex items-center gap-2">
                <SecondaryButton onClick={() => setShowPhotoModal(false)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton onClick={handleSavePhoto}>
                  Save Photo
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
