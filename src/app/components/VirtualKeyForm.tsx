import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Building2,
  Users,
  User as UserIcon,
  Sparkles,
  BarChart3,
  Check,
  ChevronDown,
  X,
  Info,
  Search,
  Loader2,
  Activity,
  Key
} from "lucide-react";
import { toast } from "sonner";

// Multi-cloud provider definitions matching Add Virtual Key.dc.html
export interface ProviderInfo {
  id: string;
  name: string;
  count: number;
  color: string;
}

export const VK_PROVIDERS_LIST: ProviderInfo[] = [
  { id: "openai", name: "OpenAI", count: 12, color: "#2563eb" },
  { id: "anthropic", name: "Anthropic", count: 35, color: "#7c3aed" },
  { id: "gemini", name: "Google Gemini", count: 55, color: "#0891b2" },
  { id: "azure", name: "Azure OpenAI", count: 50, color: "#059669" },
  { id: "bedrock", name: "AWS Bedrock", count: 80, color: "#d97706" },
  { id: "mistral", name: "Mistral AI", count: 40, color: "#db2777" },
  { id: "cohere", name: "Cohere", count: 25, color: "#2563eb" },
  { id: "groq", name: "Groq", count: 18, color: "#7c3aed" },
  { id: "perplexity", name: "Perplexity", count: 12, color: "#0891b2" },
  { id: "deepseek", name: "DeepSeek", count: 20, color: "#059669" },
  { id: "xai", name: "xAI", count: 10, color: "#d97706" },
  { id: "metaLlama", name: "Meta Llama", count: 30, color: "#db2777" },
  { id: "watsonx", name: "IBM watsonx", count: 22, color: "#2563eb" },
  { id: "ai21", name: "AI21 Labs", count: 15, color: "#7c3aed" },
  { id: "voyage", name: "Voyage AI", count: 13, color: "#0891b2" },
  { id: "huggingface", name: "HuggingFace", count: 380, color: "#d97706" },
  { id: "openrouter", name: "OpenRouter", count: 220, color: "#059669" },
  { id: "together", name: "Together AI", count: 150, color: "#db2777" },
  { id: "fireworks", name: "Fireworks AI", count: 120, color: "#2563eb" },
  { id: "replicate", name: "Replicate", count: 90, color: "#7c3aed" },
];

const buildVkFullCatalog = (): Record<string, string[]> => {
  const curated: Record<string, string[]> = {
    openai: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini", "o3", "o3-mini", "o4-mini", "chatgpt-image-latest", "sora-2-pro", "tts-1", "whisper-1", "text-embedding-3-large"],
    anthropic: ["claude-4-opus-20250514", "claude-haiku-4-52", "claude-opus-4-51", "claude-4-sonnet-20250514", "claude-3-5-sonnet-20241022"],
    gemini: ["gemini/gemini-2.5-flash", "gemini/gemini-2.5-pro", "gemini-pro-latest", "gemini-flash-latest", "gemini-embedding-001"],
    azure: ["azure/gpt-4o", "azure/gpt-4o-mini", "azure/gpt-4.1", "azure/o3-mini", "azure/text-embedding-3-large"],
    bedrock: ["amazon.titan-text-express-v1", "anthropic.claude-3-sonnet-20240229-v1:0", "meta.llama3-70b-instruct-v1:0", "mistral.mixtral-8x7b-instruct-v0:1"],
    mistral: ["mistral-large-latest", "mistral-small-latest", "codestral-latest", "mistral-embed"],
    cohere: ["command-r-plus", "command-r", "embed-english-v3.0"],
    groq: ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"],
    perplexity: ["sonar-pro", "sonar", "sonar-reasoning"],
    deepseek: ["deepseek-chat", "deepseek-reasoner"],
    xai: ["grok-3", "grok-3-mini", "grok-2-vision"],
    metaLlama: ["llama-3.3-70b", "llama-3.1-405b"],
    watsonx: ["granite-13b-chat-v2", "llama-3-70b-instruct"],
    ai21: ["jamba-1.5-large", "jamba-1.5-mini"],
    voyage: ["voyage-3", "voyage-code-3"],
  };

  const ORGS = ["meta-llama", "mistralai", "Qwen", "google", "microsoft", "tiiuae", "deepseek-ai", "bigcode"];
  const FAMILIES = ["llama-3", "mistral-7b", "mixtral-8x7b", "qwen2.5-72b", "gemma-2-9b", "phi-3-medium"];
  const SIZES = ["1.3", "7", "13", "34", "70"];
  const VARIANTS = ["instruct", "chat", "it", "base"];

  const hub: Record<string, string[]> = {};
  VK_PROVIDERS_LIST.forEach((p) => {
    if (curated[p.id]) return;
    hub[p.id] = Array.from({ length: p.count }, (_, i) => {
      const org = ORGS[i % ORGS.length];
      const fam = FAMILIES[(i * 3) % FAMILIES.length].split("-")[0];
      const size = SIZES[(i * 7) % SIZES.length];
      const variant = VARIANTS[(i * 11) % VARIANTS.length];
      return `${org}/${fam}-${size}b-${variant}`;
    });
  });

  return { ...curated, ...hub };
};

export const VK_FULL_CATALOG = buildVkFullCatalog();

const hashStr = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const fmtContext = (n: number): string => {
  if (n >= 1000000) return `${n / 1000000}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
};

const getVkModelInfoText = (name: string): string => {
  const h = hashStr(name);
  const CTX = [4096, 8192, 16384, 32768, 65536, 131072, 200000, 1000000];
  const contextWindow = CTX[h % CTX.length];
  const maxOutput = [1024, 2048, 4096, 8192, 16384][h % 5];
  const inputPrice = Math.round((((h * 17) % 300) / 100) * 100) / 100;
  const outputPrice = Math.round(inputPrice * (2 + (h % 3)) * 100) / 100;
  return `Context: ${fmtContext(contextWindow)} · Max Output: ${fmtContext(maxOutput)} · Input: $${inputPrice.toFixed(2)}/1M · Output: $${outputPrice.toFixed(2)}/1M`;
};

export interface VirtualKeyFormProps {
  mode: "create" | "edit";
  initialKey?: any;
  availableUsers?: { id: string; label: string }[];
  availableTeams?: { id: string; label: string }[];
  onBack: () => void;
  onSave: (keyData: any, generatedSecret?: string) => void;
}

export function VirtualKeyForm({
  mode,
  initialKey,
  availableUsers = [
    { id: "u1", label: "atindra.ojha+user@hiddenbrains.in" },
    { id: "u2", label: "priya.shah@hiddenbrains.in" },
    { id: "u3", label: "devon.reyes@hiddenbrains.in" },
    { id: "u4", label: "hbadmin@yopmail.com" },
  ],
  availableTeams = [
    { id: "t1", label: "AI Research" },
    { id: "t2", label: "Core Engineering & AI Lab" },
    { id: "t3", label: "DevOps Core" },
    { id: "t4", label: "QA Testing" },
  ],
  onBack,
  onSave,
}: VirtualKeyFormProps) {
  // Stepper State (Exactly 2 Steps: 0: Basic Information, 1: Model Access)
  const [stepIndex, setStepIndex] = useState(0);

  // Step 1: Basic Information
  const [keyName, setKeyName] = useState(initialKey?.alias || "");
  const [description, setDescription] = useState(initialKey?.description || "");
  const [ownerType, setOwnerType] = useState<"user" | "team">(
    initialKey?.team && !initialKey?.owner ? "team" : "user"
  );
  const [assignedUserId, setAssignedUserId] = useState<string>(
    availableUsers.find((u) => u.label === initialKey?.owner || u.id === initialKey?.ownerId)?.id || availableUsers[0]?.id || "u1"
  );
  const [assignedTeamId, setAssignedTeamId] = useState<string>(
    availableTeams.find((t) => t.label === initialKey?.team || t.id === initialKey?.teamId)?.id || availableTeams[0]?.id || "t1"
  );
  const [expiration, setExpiration] = useState<string>(
    initialKey?.expiryDuration === "30 Days" ? "30d" : initialKey?.expiryDuration === "90 Days" ? "90d" : initialKey?.expiryDuration === "1 Year" ? "1y" : "never"
  );

  // Step 2: Model Access
  const [accessMode, setAccessMode] = useState<"all" | "selected">(
    initialKey?.models?.includes("All Models") ? "all" : "selected"
  );
  const [selectedByProvider, setSelectedByProvider] = useState<Record<string, Record<string, boolean>>>(
    initialKey?.selectedByProvider || {
      openai: { "gpt-4o": true, "gpt-4o-mini": true },
      anthropic: { "claude-3-5-sonnet": true }
    }
  );
  const [globalSearch, setGlobalSearch] = useState("");
  const [providerSearch, setProviderSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [activeProviderId, setActiveProviderId] = useState("openai");
  const [infoOpenKey, setInfoOpenKey] = useState<string | null>(null);
  const [expandedSummaryProviderId, setExpandedSummaryProviderId] = useState<string | null>(null);

  // Step 2: Budget Configuration
  const initialMaxBudget = initialKey?.maxBudget !== undefined ? initialKey.maxBudget : 500;
  const [unlimitedBudget, setUnlimitedBudget] = useState(initialMaxBudget === 0 || initialMaxBudget === null);
  const [maxBudget, setMaxBudget] = useState<string>(initialMaxBudget !== 0 && initialMaxBudget !== null ? String(initialMaxBudget) : "500");
  const [softBudget, setSoftBudget] = useState<string>("400");
  const [resetDuration, setResetDuration] = useState<string>("Monthly");
  const [emailChipsList, setEmailChipsList] = useState<string[]>(["john@company.com"]);
  const [emailDraft, setEmailDraft] = useState("");

  // Step 2: Rate Limits
  const initialTpm = initialKey?.tpmLimit !== undefined ? initialKey.tpmLimit : 100000;
  const initialRpm = initialKey?.rpmLimit !== undefined ? initialKey.rpmLimit : 1000;
  const [unlimitedRateLimits, setUnlimitedRateLimits] = useState(initialTpm === 0 && initialRpm === 0);
  const [tpmLimit, setTpmLimit] = useState<string>(initialTpm !== 0 ? String(initialTpm) : "100000");
  const [rpmLimit, setRpmLimit] = useState<string>(initialRpm !== 0 ? String(initialRpm) : "1000");

  // Interaction & Touch states
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation Rules
  const isKeyNameValid = useMemo(() => keyName.trim() !== "", [keyName]);
  const isOwnerValid = useMemo(() => (ownerType === "user" ? !!assignedUserId : !!assignedTeamId), [ownerType, assignedUserId, assignedTeamId]);

  const isStep0Valid = useMemo(() => isKeyNameValid && isOwnerValid, [isKeyNameValid, isOwnerValid]);

  const isStep1Valid = useMemo(() => {
    if (accessMode === "all") return true;
    const count = Object.values(selectedByProvider).reduce(
      (acc, p) => acc + Object.values(p).filter(Boolean).length,
      0
    );
    return count > 0;
  }, [accessMode, selectedByProvider]);

  const handleSaveSubmit = () => {
    setTouched(true);
    if (!isStep0Valid) {
      setStepIndex(0);
      toast.error("Please enter a Virtual Key Name and select Ownership.");
      return;
    }
    if (!isStep1Valid) {
      setStepIndex(1);
      toast.error("Please select at least one model.");
      return;
    }

    setIsSubmitting(true);

    const assignedUserObj = availableUsers.find((u) => u.id === assignedUserId);
    const assignedTeamObj = availableTeams.find((t) => t.id === assignedTeamId);

    const assignedProvidersList = Object.entries(selectedByProvider)
      .map(([pId, modelsMap]) => {
        const selectedMs = Object.keys(modelsMap).filter((m) => modelsMap[m]);
        const pObj = VK_PROVIDERS_LIST.find((x) => x.id === pId);
        return {
          provider: pObj ? pObj.name : pId,
          selectedModels: selectedMs,
        };
      })
      .filter((p) => p.selectedModels.length > 0);

    const allowedModelsList = accessMode === "all"
      ? ["All Models"]
      : assignedProvidersList.flatMap((p) => p.selectedModels);

    let expiryLabel = "Never";
    let expiryDateStr = "Never";
    if (expiration === "30d") {
      expiryLabel = "30 Days";
      const d = new Date(); d.setDate(d.getDate() + 30);
      expiryDateStr = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    } else if (expiration === "90d") {
      expiryLabel = "90 Days";
      const d = new Date(); d.setDate(d.getDate() + 90);
      expiryDateStr = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    } else if (expiration === "1y") {
      expiryLabel = "1 Year";
      const d = new Date(); d.setDate(d.getDate() + 365);
      expiryDateStr = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    }

    const generatedSecret = `sk-litellm-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}904`;
    const maskedSecret = `sk-litellm-${generatedSecret.substring(11, 23)}••••••••••••••••••••••••`;

    const finalKeyData = {
      ...(initialKey || {}),
      id: initialKey?.id || `vk-${Date.now()}`,
      keyId: initialKey?.keyId || `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
      alias: keyName.trim(),
      description: description.trim(),
      owner: ownerType === "user" ? (assignedUserObj?.label || "atindra.ojha+user@hiddenbrains.in") : (assignedTeamObj?.label || "AI Research"),
      ownerId: ownerType === "user" ? assignedUserId : assignedTeamId,
      ownerType: ownerType === "user" ? "You" : "Another User",
      organization: "HB Enterprise",
      orgId: "org-57c860ac",
      team: ownerType === "team" ? (assignedTeamObj?.label || "AI Research") : (initialKey?.team || "AI Research"),
      keyType: initialKey?.keyType || "AI APIs",
      models: allowedModelsList,
      maxBudget: unlimitedBudget ? 0 : Number(maxBudget) || 500,
      currentSpend: initialKey?.currentSpend || 0,
      status: initialKey?.status || "Active",
      tpmLimit: unlimitedRateLimits ? 0 : Number(tpmLimit) || 100000,
      rpmLimit: unlimitedRateLimits ? 0 : Number(rpmLimit) || 1000,
      expiryDuration: expiryLabel,
      expiryDate: expiryDateStr,
      gracePeriod: initialKey?.gracePeriod || "7 Days",
      policies: initialKey?.policies || ["Rate Limiting"],
      guardrails: initialKey?.guardrails || ["PII Masking"],
      loggingIntegration: initialKey?.loggingIntegration || "Splunk Enterprise",
      autoRotation: initialKey?.autoRotation !== undefined ? initialKey.autoRotation : true,
      lastUsed: initialKey?.lastUsed || "Just now",
      createdDate: initialKey?.createdDate || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      createdBy: initialKey?.createdBy || "atindra.ojha@hiddenbrains.in",
      secretKeyMasked: initialKey?.secretKeyMasked || maskedSecret,
      selectedByProvider: selectedByProvider,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSave(finalKeyData, generatedSecret);
    }, 300);
  };

  return (
    <div className="max-w-[1100px] mx-auto w-full space-y-5 animate-fadeIn text-xs pb-16">
      {/* Back Navigation Button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Virtual Keys</span>
      </button>

      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
          {mode === "edit" ? "Edit Virtual Key" : "Add Virtual Key"}
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Create a routing key and scope its model access.
        </p>
      </div>

      {/* Stepper Bar (Exactly 2 Steps matching Add Virtual Key.dc.html) */}
      <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs">
        {[
          { id: 0, label: "Basic Information" },
          { id: 1, label: "Model Access" },
        ].map((step, idx, arr) => {
          const isDone = stepIndex > idx;
          const isCurrent = stepIndex === idx;

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => {
                  if (idx === 0 || isStep0Valid) {
                    setStepIndex(idx);
                  } else {
                    toast.error("Please enter Virtual Key Name and select Ownership first.");
                  }
                }}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? "bg-teal-600 text-white"
                      : isCurrent
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 ring-2 ring-neutral-900/10 dark:ring-white/10"
                      : "bg-white dark:bg-neutral-950 text-neutral-400 border border-neutral-300 dark:border-neutral-700"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-semibold whitespace-nowrap ${
                    isCurrent
                      ? "text-neutral-900 dark:text-white"
                      : isDone
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-4 ${
                    isDone ? "bg-teal-600" : "bg-neutral-200 dark:bg-neutral-800"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 1: BASIC INFORMATION */}
      {stepIndex === 0 && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <Building2 className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Basic Information</h3>
          </div>

          <div className="space-y-4">
            {/* Virtual Key Name */}
            <div className="space-y-1">
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                Virtual Key Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={100}
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="Enter Virtual Key Name (e.g. prod-ai-completions)"
                className={`w-full h-10 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-all ${
                  touched && !isKeyNameValid ? "border-rose-500" : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500"
                }`}
              />
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
                <span>Must be unique across your organization.</span>
                <span>{keyName.length}/100</span>
              </div>
            </div>

            {/* Description (Optional) */}
            <div className="space-y-1">
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                maxLength={300}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose, application scope, or target service for this key..."
                className="w-full p-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 resize-y"
              />
              <div className="flex items-center justify-end text-[11px] text-neutral-400 mt-1">
                <span>{description.length}/300</span>
              </div>
            </div>

            {/* Key Ownership Selection Cards */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Key Ownership <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-neutral-400">Assign key to an individual User or Team</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* User Card */}
                <div
                  onClick={() => setOwnerType("user")}
                  className={`p-3.5 border rounded-xl cursor-pointer flex items-start gap-3 transition-all ${
                    ownerType === "user"
                      ? "border-neutral-900 dark:border-white bg-neutral-50/80 dark:bg-neutral-800/40"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                  }`}
                >
                  <div className="mt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        ownerType === "user" ? "border-neutral-900 dark:border-white" : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    >
                      {ownerType === "user" && <div className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                      <span>User</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Individual user ownership</p>
                  </div>
                </div>

                {/* Team Card */}
                <div
                  onClick={() => setOwnerType("team")}
                  className={`p-3.5 border rounded-xl cursor-pointer flex items-start gap-3 transition-all ${
                    ownerType === "team"
                      ? "border-neutral-900 dark:border-white bg-neutral-50/80 dark:bg-neutral-800/40"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                  }`}
                >
                  <div className="mt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        ownerType === "team" ? "border-neutral-900 dark:border-white" : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    >
                      {ownerType === "team" && <div className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                      <span>Team</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Shared team ownership</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned User / Assigned Team Selection */}
            {ownerType === "user" ? (
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Assigned User <span className="text-rose-500">*</span>
                </label>
                <select
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Assigned Team <span className="text-rose-500">*</span>
                </label>
                <select
                  value={assignedTeamId}
                  onChange={(e) => setAssignedTeamId(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {availableTeams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Expiration Duration */}
            <div className="space-y-1">
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                Expiration Duration
              </label>
              <select
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="never">Never (No expiration)</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
                <option value="1y">1 Year</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: MODEL ACCESS */}
      {stepIndex === 1 && (
        <div className="space-y-5">
          {/* Card 1: Model Access Assignment */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <span>Model Access</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {accessMode === "all"
                  ? `All models already assigned to the selected ${ownerType} across ${VK_PROVIDERS_LIST.length} providers will be routable.`
                  : `${Object.values(selectedByProvider).reduce((acc, p) => acc + Object.values(p).filter(Boolean).length, 0)} model(s) selected across ${VK_PROVIDERS_LIST.filter((p) => Object.values(selectedByProvider[p.id] || {}).filter(Boolean).length > 0).length} of ${VK_PROVIDERS_LIST.length} providers`}
              </p>
            </div>

            {/* Mode Selection Radios */}
            <div className="flex items-center gap-6 py-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                <input
                  type="radio"
                  name="vkAccessMode"
                  checked={accessMode === "all"}
                  onChange={() => setAccessMode("all")}
                  className="w-4 h-4 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                />
                <span>All Available Models</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                <input
                  type="radio"
                  name="vkAccessMode"
                  checked={accessMode === "selected"}
                  onChange={() => setAccessMode("selected")}
                  className="w-4 h-4 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                />
                <span>Selected Models</span>
              </label>
            </div>

            {/* All Available Models Banner */}
            {accessMode === "all" && (
              <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                This key can route to every model already assigned to the selected {ownerType} across all {VK_PROVIDERS_LIST.length} provider(s) — it will also pick up any new models granted to them later. Browse the assigned list below — it's read-only in this mode.
              </div>
            )}

            {/* Selected Models Summary Chips */}
            {accessMode === "selected" && (
              <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300 text-xs">
                    Selected Models ({Object.values(selectedByProvider).reduce((acc, p) => acc + Object.values(p).filter(Boolean).length, 0)}):
                  </span>

                  {VK_PROVIDERS_LIST.filter((p) => Object.values(selectedByProvider[p.id] || {}).filter(Boolean).length > 0).map((p) => {
                    const count = Object.values(selectedByProvider[p.id] || {}).filter(Boolean).length;
                    const isExpanded = expandedSummaryProviderId === p.id;
                    return (
                      <div
                        key={p.id}
                        className="px-2.5 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs"
                      >
                        <span
                          onClick={() => setExpandedSummaryProviderId(isExpanded ? null : p.id)}
                          className="cursor-pointer flex items-center gap-1.5"
                        >
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                          <span>{p.name} ({count})</span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </span>
                        <span
                          onClick={() => setSelectedByProvider((prev) => ({ ...prev, [p.id]: {} }))}
                          className="text-neutral-400 hover:text-rose-600 cursor-pointer font-bold"
                        >
                          ×
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Expanded Provider Models */}
                {expandedSummaryProviderId && (
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-1.5">
                    {Object.keys(selectedByProvider[expandedSummaryProviderId] || {})
                      .filter((mName) => selectedByProvider[expandedSummaryProviderId][mName])
                      .map((mName) => (
                        <span
                          key={mName}
                          className="px-2 py-0.5 bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded text-[11px] font-mono font-semibold flex items-center gap-1.5"
                        >
                          <span>{mName}</span>
                          <span
                            onClick={() =>
                              setSelectedByProvider((prev) => ({
                                ...prev,
                                [expandedSummaryProviderId]: {
                                  ...prev[expandedSummaryProviderId],
                                  [mName]: false,
                                },
                              }))
                            }
                            className="cursor-pointer text-teal-400 hover:text-teal-800 font-bold"
                          >
                            ×
                          </span>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Global Model Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder={`Search this ${ownerType}'s assigned models...`}
                className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Global Search Results Panel */}
            {globalSearch.trim() ? (
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl h-96 flex flex-col overflow-hidden bg-white dark:bg-neutral-950">
                <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
                  Search results across assigned models
                </div>
                <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scrollbar align-content-start">
                  {VK_PROVIDERS_LIST.flatMap((p) => {
                    const list = VK_FULL_CATALOG[p.id] || [];
                    const query = globalSearch.trim().toLowerCase();
                    return list
                      .filter((mName) => mName.toLowerCase().includes(query))
                      .map((mName) => ({ provider: p, name: mName }));
                  }).map((item) => {
                    const isChecked = accessMode === "all" || !!(selectedByProvider[item.provider.id] || {})[item.name];
                    const infoKey = `global-${item.provider.id}-${item.name}`;
                    const isInfoOpen = infoOpenKey === infoKey;

                    return (
                      <div
                        key={infoKey}
                        onClick={() => {
                          if (accessMode === "all") return;
                          setSelectedByProvider((prev) => ({
                            ...prev,
                            [item.provider.id]: {
                              ...(prev[item.provider.id] || {}),
                              [item.name]: !isChecked,
                            },
                          }));
                        }}
                        className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-teal-50/60 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800"
                            : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            disabled={accessMode === "all"}
                            className="w-4 h-4 text-teal-600 rounded cursor-pointer shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-mono text-xs font-semibold block text-neutral-900 dark:text-white truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-bold block" style={{ color: item.provider.color }}>
                              {item.provider.name}
                            </span>
                          </div>
                        </div>

                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInfoOpenKey(isInfoOpen ? null : infoKey);
                            }}
                            className="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                          >
                            i
                          </button>
                          {isInfoOpen && (
                            <div className="absolute right-0 top-6 w-56 p-2.5 bg-neutral-900 text-white rounded-lg text-[11px] shadow-2xl z-50 animate-fadeIn font-sans">
                              {getVkModelInfoText(item.name)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Provider Browsing Panel (Sidebar + Active Grid) */
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl h-96 flex overflow-hidden bg-white dark:bg-neutral-950">
                {/* Left Provider Navigation Sidebar */}
                <div className="w-56 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex flex-col shrink-0">
                  <div className="p-2 border-b border-neutral-200 dark:border-neutral-800">
                    <input
                      type="text"
                      value={providerSearch}
                      onChange={(e) => setProviderSearch(e.target.value)}
                      placeholder={`Search ${VK_PROVIDERS_LIST.length} providers...`}
                      className="w-full h-8 px-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs outline-none"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {VK_PROVIDERS_LIST.filter((p) =>
                      p.name.toLowerCase().includes(providerSearch.toLowerCase())
                    ).map((p) => {
                      const isSelected = activeProviderId === p.id;
                      const selCount = Object.values(selectedByProvider[p.id] || {}).filter(Boolean).length;

                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setActiveProviderId(p.id);
                            setModelSearch("");
                          }}
                          className={`p-2.5 flex items-center justify-between cursor-pointer border-l-3 transition-colors ${
                            isSelected
                              ? "bg-white dark:bg-neutral-900 border-l-teal-600 font-bold"
                              : "border-l-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-4 h-4 rounded flex items-center justify-center text-white font-bold text-[9px] shrink-0"
                              style={{ backgroundColor: p.color }}
                            >
                              {p.name[0]}
                            </div>
                            <span className="text-xs text-neutral-800 dark:text-neutral-200 truncate">
                              {p.name}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              selCount > 0
                                ? "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                                : "text-neutral-400 bg-neutral-100 dark:bg-neutral-800"
                            }`}
                          >
                            {selCount > 0 ? selCount : p.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Active Provider Models Grid */}
                <div className="flex-1 flex flex-col min-w-0">
                  {(() => {
                    const activeProv = VK_PROVIDERS_LIST.find((x) => x.id === activeProviderId);
                    const catalogList = activeProv ? VK_FULL_CATALOG[activeProv.id] || [] : [];
                    const filteredList = catalogList.filter((m) =>
                      m.toLowerCase().includes(modelSearch.toLowerCase())
                    );
                    const activeSelectedMap = selectedByProvider[activeProviderId] || {};

                    return (
                      <>
                        <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 bg-neutral-50/50 dark:bg-neutral-900/30">
                          <div className="font-bold text-xs text-neutral-900 dark:text-white">
                            {activeProv?.name} ·{" "}
                            <span className="font-normal text-neutral-400">
                              {catalogList.length} models in catalog
                            </span>
                          </div>

                          {accessMode === "selected" && activeProv && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const allMap: Record<string, boolean> = { ...activeSelectedMap };
                                  filteredList.forEach((mName) => (allMap[mName] = true));
                                  setSelectedByProvider((prev) => ({
                                    ...prev,
                                    [activeProv.id]: allMap,
                                  }));
                                }}
                                className="px-2.5 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs font-semibold hover:bg-neutral-100 cursor-pointer"
                              >
                                Select all
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedByProvider((prev) => ({
                                    ...prev,
                                    [activeProv.id]: {},
                                  }));
                                }}
                                className="px-2.5 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs font-semibold hover:bg-neutral-100 cursor-pointer text-rose-600"
                              >
                                Clear
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="p-2 border-b border-neutral-200 dark:border-neutral-800">
                          <input
                            type="text"
                            value={modelSearch}
                            onChange={(e) => setModelSearch(e.target.value)}
                            placeholder={`Search ${activeProv?.name} models by name...`}
                            className="w-full h-8 px-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs outline-none"
                          />
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scrollbar align-content-start">
                          {filteredList.map((mName) => {
                            const isChecked = accessMode === "all" || !!activeSelectedMap[mName];
                            const infoKey = `active-${mName}`;
                            const isInfoOpen = infoOpenKey === infoKey;

                            return (
                              <div
                                key={mName}
                                onClick={() => {
                                  if (accessMode === "all" || !activeProv) return;
                                  setSelectedByProvider((prev) => ({
                                    ...prev,
                                    [activeProv.id]: {
                                      ...(prev[activeProv.id] || {}),
                                      [mName]: !isChecked,
                                    },
                                  }));
                                }}
                                className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                                  isChecked
                                    ? "bg-teal-50/60 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800"
                                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                    disabled={accessMode === "all"}
                                    className="w-4 h-4 text-teal-600 rounded cursor-pointer shrink-0"
                                  />
                                  <span className="font-mono text-xs font-semibold truncate text-neutral-900 dark:text-white">
                                    {mName}
                                  </span>
                                </div>

                                <div className="relative shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setInfoOpenKey(isInfoOpen ? null : infoKey);
                                    }}
                                    className="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                                  >
                                    i
                                  </button>
                                  {isInfoOpen && (
                                    <div className="absolute right-0 top-6 w-56 p-2.5 bg-neutral-900 text-white rounded-lg text-[11px] shadow-2xl z-50 animate-fadeIn font-sans">
                                      {getVkModelInfoText(mName)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Budget Configuration */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Budget Configuration</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                <input
                  type="checkbox"
                  checked={unlimitedBudget}
                  onChange={() => setUnlimitedBudget(!unlimitedBudget)}
                  className="w-4 h-4 text-neutral-900 rounded cursor-pointer"
                />
                <span>Unlimited Budget</span>
              </label>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-3 transition-opacity ${
                unlimitedBudget ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Max Budget ($ USD) {!unlimitedBudget && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type="number"
                  disabled={unlimitedBudget}
                  value={unlimitedBudget ? "" : maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  placeholder="500"
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Soft Budget ($ USD)
                </label>
                <input
                  type="number"
                  disabled={unlimitedBudget}
                  value={unlimitedBudget ? "" : softBudget}
                  onChange={(e) => setSoftBudget(e.target.value)}
                  placeholder="400"
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  Budget Reset Duration
                </label>
                <select
                  disabled={unlimitedBudget}
                  value={resetDuration}
                  onChange={(e) => setResetDuration(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="Lifetime">Lifetime</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Daily">Daily</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                Budget Notification Email
              </label>
              <div className="p-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 rounded-lg flex flex-wrap items-center gap-1.5 min-h-[40px]">
                {emailChipsList.map((emailItem) => (
                  <span
                    key={emailItem}
                    className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium text-xs flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-700"
                  >
                    {emailItem}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-rose-600"
                      onClick={() => setEmailChipsList(emailChipsList.filter((e) => e !== emailItem))}
                    />
                  </span>
                ))}
                <input
                  type="email"
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = emailDraft.trim();
                      if (val && !emailChipsList.includes(val)) {
                        setEmailChipsList([...emailChipsList, val]);
                        setEmailDraft("");
                      }
                    }
                  }}
                  placeholder={emailChipsList.length === 0 ? "Add email and press Enter..." : "Add email..."}
                  className="flex-1 min-w-[140px] bg-transparent text-xs text-neutral-900 dark:text-white outline-none py-0.5"
                />
              </div>
              <span className="text-[11px] text-neutral-400 block">
                Recipients receive email notifications when Soft Budget or Maximum Budget is reached. Press Enter to add.
              </span>
            </div>
          </div>

          {/* Card 3: Rate Limits */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
                <Activity className="w-4 h-4 text-purple-600" />
                <span>Rate Limits</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                <input
                  type="checkbox"
                  checked={unlimitedRateLimits}
                  onChange={() => setUnlimitedRateLimits(!unlimitedRateLimits)}
                  className="w-4 h-4 text-neutral-900 rounded cursor-pointer"
                />
                <span>Unlimited Rate Limits</span>
              </label>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity ${
                unlimitedRateLimits ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  TPM Limit (Tokens Per Minute)
                </label>
                <input
                  type="number"
                  disabled={unlimitedRateLimits}
                  value={unlimitedRateLimits ? "" : tpmLimit}
                  onChange={(e) => setTpmLimit(e.target.value)}
                  placeholder="100000"
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                  RPM Limit (Requests Per Minute)
                </label>
                <input
                  type="number"
                  disabled={unlimitedRateLimits}
                  value={unlimitedRateLimits ? "" : rpmLimit}
                  onChange={(e) => setRpmLimit(e.target.value)}
                  placeholder="1000"
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stepper Navigation Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex(0)}
            className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold disabled:opacity-40 cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {stepIndex === 0 ? (
          <button
            type="button"
            onClick={() => {
              if (!isStep0Valid) {
                setTouched(true);
                toast.error("Please enter Virtual Key Name and select Ownership.");
                return;
              }
              setStepIndex(1);
            }}
            className="h-10 px-5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-2xs cursor-pointer"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSaveSubmit}
            className="h-10 px-5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{mode === "edit" ? "Save Changes" : "Save Virtual Key"}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default VirtualKeyForm;
