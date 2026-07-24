import React, { useState } from "react";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  ShieldCheck, 
  KeyRound, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Shield,
  Building2
} from "lucide-react";
import { toast } from "sonner";

interface LoginProps {
  onLoginSuccess?: (username: string) => void;
  onNavigateToDashboard?: () => void;
  initialState?: "normal" | "session-expired" | "network-error" | "auth-failed";
}

export default function Login({
  onLoginSuccess,
  onNavigateToDashboard,
  initialState = "normal"
}: LoginProps) {
  // Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Form Validation & Feedback State
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [activeBannerState, setActiveBannerState] = useState<"none" | "session-expired" | "network-error" | "auth-failed">(
    initialState === "normal" ? "none" : initialState
  );

  // UI Interactive States
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Modals State
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showSSOModal, setShowSSOModal] = useState(false);

  // Forgot Password Form State
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailSent, setForgotEmailSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Clear inline field errors on change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (usernameError) setUsernameError("");
    if (serverError) setServerError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
    if (serverError) setServerError("");
  };

  // Perform Login Logic
  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Reset error states
    setUsernameError("");
    setPasswordError("");
    setServerError("");

    let hasError = false;

    if (!username.trim()) {
      setUsernameError("Username is required");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      hasError = true;
    }

    if (hasError) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    // Simulate Network Error toggle
    if (activeBannerState === "network-error") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setServerError("Network failure: Unable to reach Guardian Layer authentication servers. Please check your internet connection.");
        toast.error("Network Connection Error");
      }, 1200);
      return;
    }

    // Simulate Auth Failure state if custom credentials entered or toggled
    if (activeBannerState === "auth-failed" || (username !== "demo.admin" && username !== "admin")) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setServerError("Invalid username or password. Please verify your credentials or use Demo Credentials.");
        toast.error("Authentication Failed");
      }, 1000);
      return;
    }

    // Successful Auth Simulation
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Welcome back, ${username}! Redirecting to Guardian Layer Portal...`);
      if (onLoginSuccess) onLoginSuccess(username);
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      }
    }, 1200);
  };

  // "Use Demo Login" One-Click Autofill & Login
  const handleUseDemoCredentials = () => {
    setUsername("demo.admin");
    setPassword("Demo@123");
    setUsernameError("");
    setPasswordError("");
    setServerError("");
    setActiveBannerState("none");

    setIsDemoLoading(true);
    toast.info("Populating demo credentials and authenticating...");

    setTimeout(() => {
      setIsDemoLoading(false);
      toast.success("Authenticated as demo.admin!");
      if (onLoginSuccess) onLoginSuccess("demo.admin");
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      }
    }, 1100);
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotEmailSent(true);
      toast.success("Password reset link sent to your email!");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-neutral-950 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans transition-colors duration-200">
      
      {/* Main Centered Authentication Container - 560px Width for Premium Spacing */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="w-full max-w-[560px] bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800/80 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-black/70 p-6 sm:p-8 md:p-9 transition-all">
          
          {/* Header Branding - Refined Spacing & Visual Hierarchy */}
          <div className="text-center mb-5 space-y-1">
            {/* Parent Company Branding */}
            <div className="text-[11px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase flex items-center justify-center gap-1.5">
              <span>HIDDENBRAINS</span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span>ENTERPRISE PLATFORM</span>
            </div>

            {/* Guardian Layer Product Title (Primary Visual Element) */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              <span className="bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent">
                Guardian Layer
              </span>
            </h1>

            {/* Product Subtitle */}
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Secure Enterprise Administration Portal
            </p>
          </div>

          {/* Login Section Heading - Clean & Compact */}
          <div className="text-center mb-5 border-t border-neutral-100 dark:border-neutral-800/60 pt-4">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Login
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Sign in to continue to Guardian Layer Administration.
            </p>
          </div>

          {/* Banner Notifications for Custom States */}
          {activeBannerState === "session-expired" && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-amber-800 dark:text-amber-300 text-xs leading-relaxed animate-fadeIn">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Session Expired:</span> Your previous session timed out due to inactivity. Please log in again to continue.
              </div>
            </div>
          )}

          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-red-800 dark:text-red-300 text-xs leading-relaxed animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{serverError}</div>
            </div>
          )}

          {/* Redesigned Compact Demo Credentials Card */}
          <div className="mb-5 p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-sky-900 dark:text-sky-200 font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Demo Credentials</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-neutral-700 dark:text-neutral-300">
                <span>
                  <strong className="font-sans font-medium text-neutral-500 dark:text-neutral-400">Username:</strong> demo.admin
                </span>
                <span className="text-neutral-300 dark:text-neutral-700 sm:inline hidden">•</span>
                <span>
                  <strong className="font-sans font-medium text-neutral-500 dark:text-neutral-400">Password:</strong> Demo@123
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUseDemoCredentials}
              disabled={isLoading || isDemoLoading}
              className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs flex-shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isDemoLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Use Demo Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Login Form - Primary Focus */}
          <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
            
            {/* Username Input */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter your username"
                  className={`w-full h-11 pl-10 pr-4 text-sm bg-white dark:bg-neutral-900 border ${
                    usernameError 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500 dark:focus:border-primary-400"
                  } rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all`}
                  required
                />
              </div>
              {usernameError && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {usernameError}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className={`w-full h-11 pl-10 pr-10 text-sm bg-white dark:bg-neutral-900 border ${
                    passwordError 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500 dark:focus:border-primary-400"
                  } rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900"
                />
                <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                  Remember Me for 30 days
                </span>
              </label>
            </div>

            {/* Strongest CTA: Full-width Primary Login Button */}
            <button
              type="submit"
              disabled={isLoading || isDemoLoading}
              className="w-full h-11 mt-1 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold text-sm rounded-lg shadow-md shadow-primary-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>

            {/* OR Divider */}
            <div className="relative py-1.5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
              </div>
              <div className="relative bg-white dark:bg-neutral-900 px-3 text-[11px] font-semibold uppercase text-neutral-400 dark:text-neutral-500">
                OR
              </div>
            </div>

            {/* Tertiary Action: Outlined Login with SSO Button */}
            <button
              type="button"
              onClick={() => setShowSSOModal(true)}
              disabled={isLoading || isDemoLoading}
              className="w-full h-10 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-neutral-500" />
              <span>Login with SSO</span>
            </button>
          </form>

          {/* Footer Security Badge - Compact & Subtle */}
          <div className="mt-6 pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 text-center text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit Encrypted TLS Enterprise Security</span>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="text-center py-2 text-xs text-neutral-400 dark:text-neutral-600">
        © {new Date().getFullYear()} HiddenBrains InfoTech. All rights reserved. Guardian Layer v2.4.0
      </footer>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
              Reset Your Password
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Enter your enterprise email address and we will send you instructions to reset your Guardian Layer credentials.
            </p>

            {forgotEmailSent ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  Instructions Sent!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  We've sent a password reset link to <strong>{forgotEmail}</strong>. Please check your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPasswordModal(false);
                    setForgotEmailSent(false);
                    setForgotEmail("");
                  }}
                  className="mt-3 px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Enterprise Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@company.com"
                    required
                    className="w-full h-10 px-3 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail}
                    className="px-4 py-2 text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SSO Authentication Modal */}
      {showSSOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary-600" />
                  Enterprise Single Sign-On (SSO)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Select your identity provider to proceed.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowSSOModal(false);
                  handleUseDemoCredentials();
                }}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-950/30 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    MS
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600">
                      Microsoft Entra ID (Azure AD)
                    </div>
                    <div className="text-[10px] text-neutral-500">Corporate OAuth2 / SAML 2.0</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSSOModal(false);
                  handleUseDemoCredentials();
                }}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-950/30 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                    OK
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600">
                      Okta Identity Cloud
                    </div>
                    <div className="text-[10px] text-neutral-500">Universal Directory</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSSOModal(false);
                  handleUseDemoCredentials();
                }}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-950/30 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                    GW
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600">
                      Google Workspace Enterprise
                    </div>
                    <div className="text-[10px] text-neutral-500">Google OpenID Connect</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600" />
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSSOModal(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
