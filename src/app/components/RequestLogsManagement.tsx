import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  RefreshCw,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Calendar,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Activity,
  Zap,
  User as UserIcon,
  Globe,
  Code,
  FileJson,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Hash,
  Check,
  ChevronRight,
  ChevronDown,
  Copy,
  ChevronLeft,
  X,
  Play,
  Square,
  DollarSign,
  Cpu,
  Layers,
  Terminal,
  FileText,
  SlidersHorizontal,
  Info,
  Building2,
  ShieldAlert,
  Server,
  Database
} from "lucide-react";
import { toast } from "sonner";
import {
  PageHeader,
  SearchBar,
  IconButton,
  Pagination,
  PrimaryButton,
  SecondaryButton,
  type ColumnConfig
} from "./hb/listing";
import {
  mockRequestLogs,
  mockAuditLogs,
  mockDeletedKeys,
  mockDeletedTeams,
  RequestLogItem,
  AuditLogItem,
  DeletedKeyItem,
  DeletedTeamItem
} from "../../mockAPI/requestLogsData";

export type RequestLogsTab = "request" | "audit";

const TIME_RANGES = [
  "Last Minute",
  "Last 15 Minutes",
  "Last Hour",
  "Last 4 Hours",
  "Last 24 Hours",
  "Last 7 Days"
];

const MODEL_OPTIONS_BY_PROVIDER = [
  { provider: "OpenAI", models: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"] },
  { provider: "Anthropic", models: ["claude-3-5-sonnet", "claude-3-haiku", "claude-sonnet-4"] },
  { provider: "Google", models: ["gemini-2.5-flash", "gemini-1.5-pro", "gemini/gemini-2.5-flash"] },
  { provider: "Meta", models: ["llama-3-70b", "llama-3-8b"] }
];

function JSONCodeBlock({
  data,
  label,
  emptyText = "N/A"
}: {
  data: Record<string, any> | null;
  label: string;
  emptyText?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success(`${label} JSON copied to clipboard!`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden flex flex-col h-full shadow-2xs">
      <div className="px-4 py-2.5 bg-neutral-50/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{label}</span>
        {data && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            title={`Copy ${label} JSON`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      <div className="p-4 overflow-x-auto flex-1 font-mono text-[11px] leading-relaxed min-h-[140px]">
        {data ? (
          <pre className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap break-words">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 text-xs gap-1 py-8">
            <span className="font-medium">{emptyText}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RequestLogsManagement({ initialTab = "request" }: { initialTab?: RequestLogsTab }) {
  // Main Tab State
  const [activeTab, setActiveTab] = useState<RequestLogsTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Search & Toolbar State
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [liveTail, setLiveTail] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Sorting State
  const [sortField, setSortField] = useState<keyof RequestLogItem>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Advanced Filter Drawer State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filterTeam, setFilterTeam] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterKeyAlias, setFilterKeyAlias] = useState("All");
  const [filterEndUser, setFilterEndUser] = useState("All");
  const [filterErrorCode, setFilterErrorCode] = useState("All");
  const [filterErrorMessage, setFilterErrorMessage] = useState("");
  const [filterKeyHash, setFilterKeyHash] = useState("");
  const [filterSessionId, setFilterSessionId] = useState("");
  const [filterModel, setFilterModel] = useState("All");
  const [filterPublicModel, setFilterPublicModel] = useState("");
  const [filterProvider, setFilterProvider] = useState("All");
  const [filterOrg, setFilterOrg] = useState("All");
  const [filterMinDuration, setFilterMinDuration] = useState("");
  const [filterMaxDuration, setFilterMaxDuration] = useState("");
  const [filterMinCost, setFilterMinCost] = useState("");
  const [filterMaxCost, setFilterMaxCost] = useState("");
  const [filterMinTokens, setFilterMinTokens] = useState("");
  const [filterMaxTokens, setFilterMaxTokens] = useState("");
  const [filterRequestType, setFilterRequestType] = useState("All");
  const [filterEnvironment, setFilterEnvironment] = useState("All");

  // Selected Log Item for Request Details Drawer
  const [selectedLog, setSelectedLog] = useState<RequestLogItem | null>(null);
  const [detailsDrawerExpanded, setDetailsDrawerExpanded] = useState(false);
  const [payloadTab, setPayloadTab] = useState<"pretty" | "json">("pretty");
  const [metadataSearch, setMetadataSearch] = useState("");

  // Accordion Open States inside Request Details Drawer
  const [openCostBreakdown, setOpenCostBreakdown] = useState(true);
  const [openPayload, setOpenPayload] = useState(true);
  const [openMetadata, setOpenMetadata] = useState(true);
  const [openError, setOpenError] = useState(true);
  const [openTimeline, setOpenTimeline] = useState(true);

  // --- Audit Logs State & Handlers ---
  const [auditSearchQuery, setAuditSearchQuery] = useState("");
  const [auditTimeRange, setAuditTimeRange] = useState("Last 7 Days");
  const [showAuditTimeDropdown, setShowAuditTimeDropdown] = useState(false);
  const [showAuditFilterDrawer, setShowAuditFilterDrawer] = useState(false);

  const [auditFilterActions, setAuditFilterActions] = useState<string[]>([]);
  const [auditFilterTables, setAuditFilterTables] = useState<string[]>([]);
  const [auditFilterChangedBy, setAuditFilterChangedBy] = useState("");
  const [auditFilterKeyHash, setAuditFilterKeyHash] = useState("");
  const [auditFilterObjectId, setAuditFilterObjectId] = useState("");

  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogItem | null>(null);
  const [auditSortField, setAuditSortField] = useState<keyof AuditLogItem>("timestamp");
  const [auditSortDirection, setAuditSortDirection] = useState<"asc" | "desc">("desc");

  const [auditCurrentPage, setAuditCurrentPage] = useState(1);
  const [auditPageSize, setAuditPageSize] = useState(50);

  // Live Tail Auto-refresh simulation
  useEffect(() => {
    if (!liveTail || activeTab !== "request") return;
    const interval = setInterval(() => {
      // Simulate live log arrival status update
    }, 15000);
    return () => clearInterval(interval);
  }, [liveTail, activeTab]);

  // Handle Fetch Button
  const handleFetch = () => {
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      toast.success(`Fetched latest logs for ${timeRange}`);
    }, 600);
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setTimeRange("Last 7 Days");
    setFilterTeam("All");
    setFilterStatus("All");
    setFilterKeyAlias("All");
    setFilterEndUser("All");
    setFilterErrorCode("All");
    setFilterErrorMessage("");
    setFilterKeyHash("");
    setFilterSessionId("");
    setFilterModel("All");
    setFilterPublicModel("");
    setFilterProvider("All");
    setFilterOrg("All");
    setFilterMinDuration("");
    setFilterMaxDuration("");
    setFilterMinCost("");
    setFilterMaxCost("");
    setFilterMinTokens("");
    setFilterMaxTokens("");
    setFilterRequestType("All");
    setFilterEnvironment("All");
    toast.info("Filters reset to default.");
  };

  // Active Filter Count Calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterTeam !== "All") count++;
    if (filterStatus !== "All") count++;
    if (filterKeyAlias !== "All") count++;
    if (filterEndUser !== "All") count++;
    if (filterErrorCode !== "All") count++;
    if (filterErrorMessage) count++;
    if (filterKeyHash) count++;
    if (filterSessionId) count++;
    if (filterModel !== "All") count++;
    if (filterPublicModel) count++;
    if (filterProvider !== "All") count++;
    if (filterOrg !== "All") count++;
    if (filterMinDuration || filterMaxDuration) count++;
    if (filterMinCost || filterMaxCost) count++;
    if (filterMinTokens || filterMaxTokens) count++;
    if (filterRequestType !== "All") count++;
    if (filterEnvironment !== "All") count++;
    return count;
  }, [
    filterTeam, filterStatus, filterKeyAlias, filterEndUser, filterErrorCode,
    filterErrorMessage, filterKeyHash, filterSessionId, filterModel, filterPublicModel,
    filterProvider, filterOrg, filterMinDuration, filterMaxDuration, filterMinCost,
    filterMaxCost, filterMinTokens, filterMaxTokens, filterRequestType, filterEnvironment
  ]);

  // Filtered Request Logs
  const filteredLogs = useMemo(() => {
    return mockRequestLogs.filter((log) => {
      // Free-text Search by Request ID, Session ID, or Key Alias
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesQuery =
          log.id.toLowerCase().includes(q) ||
          log.sessionId.toLowerCase().includes(q) ||
          log.keyAlias.toLowerCase().includes(q) ||
          log.model.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Drawer Filter Conditions
      if (filterTeam !== "All" && !log.teamName.toLowerCase().includes(filterTeam.toLowerCase())) return false;
      if (filterStatus !== "All" && log.status !== filterStatus) return false;
      if (filterKeyAlias !== "All" && log.keyAlias !== filterKeyAlias) return false;
      if (filterEndUser !== "All" && log.endUser !== filterEndUser) return false;
      if (filterErrorCode !== "All" && String(log.error?.code) !== filterErrorCode) return false;
      if (filterErrorMessage && (!log.error?.message || !log.error.message.toLowerCase().includes(filterErrorMessage.toLowerCase()))) return false;
      if (filterKeyHash && !log.keyHash.toLowerCase().includes(filterKeyHash.toLowerCase())) return false;
      if (filterSessionId && !log.sessionId.toLowerCase().includes(filterSessionId.toLowerCase())) return false;
      if (filterModel !== "All" && log.model !== filterModel) return false;
      if (filterPublicModel && !log.model.toLowerCase().includes(filterPublicModel.toLowerCase())) return false;
      if (filterProvider !== "All" && log.provider.toLowerCase() !== filterProvider.toLowerCase()) return false;
      if (filterOrg !== "All" && log.organization !== filterOrg) return false;

      if (filterMinDuration && log.duration < parseFloat(filterMinDuration)) return false;
      if (filterMaxDuration && log.duration > parseFloat(filterMaxDuration)) return false;
      if (filterMinCost && log.cost < parseFloat(filterMinCost)) return false;
      if (filterMaxCost && log.cost > parseFloat(filterMaxCost)) return false;
      if (filterMinTokens && log.metrics.totalTokens < parseInt(filterMinTokens)) return false;
      if (filterMaxTokens && log.metrics.totalTokens > parseInt(filterMaxTokens)) return false;

      if (filterRequestType !== "All" && log.type !== filterRequestType) return false;
      if (filterEnvironment !== "All" && log.environment !== filterEnvironment) return false;

      return true;
    });
  }, [
    searchQuery, filterTeam, filterStatus, filterKeyAlias, filterEndUser, filterErrorCode,
    filterErrorMessage, filterKeyHash, filterSessionId, filterModel, filterPublicModel,
    filterProvider, filterOrg, filterMinDuration, filterMaxDuration, filterMinCost,
    filterMaxCost, filterMinTokens, filterMaxTokens, filterRequestType, filterEnvironment
  ]);

  // Sorted Request Logs
  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "metrics") {
        aVal = a.metrics.totalTokens;
        bVal = b.metrics.totalTokens;
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal || "").toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredLogs, sortField, sortDirection]);

  // Paginated Request Logs
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedLogs.slice(start, start + pageSize);
  }, [sortedLogs, currentPage, pageSize]);

  // Sort Handler
  const handleSort = (field: keyof RequestLogItem) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort Indicator Render
  const renderSortIndicator = (field: keyof RequestLogItem) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-primary-600 dark:text-primary-400 font-bold" />
    ) : (
      <ArrowDown className="w-3 h-3 text-primary-600 dark:text-primary-400 font-bold" />
    );
  };

  // --- Audit Logs Logic & Handlers ---
  const auditActiveFilterCount = useMemo(() => {
    let count = 0;
    if (auditFilterActions.length > 0) count++;
    if (auditFilterTables.length > 0) count++;
    if (auditFilterChangedBy) count++;
    if (auditFilterKeyHash) count++;
    if (auditFilterObjectId) count++;
    return count;
  }, [auditFilterActions, auditFilterTables, auditFilterChangedBy, auditFilterKeyHash, auditFilterObjectId]);

  const handleResetAuditFilters = () => {
    setAuditSearchQuery("");
    setAuditTimeRange("Last 7 Days");
    setAuditFilterActions([]);
    setAuditFilterTables([]);
    setAuditFilterChangedBy("");
    setAuditFilterKeyHash("");
    setAuditFilterObjectId("");
    toast.info("Audit log filters reset.");
  };

  const filteredAuditLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const q = auditSearchQuery.toLowerCase().trim();
      if (q) {
        const matchesQuery =
          log.objectId.toLowerCase().includes(q) ||
          (log.apiKeyHash && log.apiKeyHash.toLowerCase().includes(q)) ||
          log.changedBy.toLowerCase().includes(q) ||
          log.table.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (auditFilterActions.length > 0 && !auditFilterActions.includes(log.action)) return false;
      if (auditFilterTables.length > 0 && !auditFilterTables.includes(log.table)) return false;
      if (auditFilterChangedBy && !log.changedBy.toLowerCase().includes(auditFilterChangedBy.toLowerCase())) return false;
      if (auditFilterKeyHash && (!log.apiKeyHash || !log.apiKeyHash.toLowerCase().includes(auditFilterKeyHash.toLowerCase()))) return false;
      if (auditFilterObjectId && !log.objectId.toLowerCase().includes(auditFilterObjectId.toLowerCase())) return false;

      return true;
    });
  }, [auditSearchQuery, auditFilterActions, auditFilterTables, auditFilterChangedBy, auditFilterKeyHash, auditFilterObjectId]);

  const sortedAuditLogs = useMemo(() => {
    return [...filteredAuditLogs].sort((a, b) => {
      let aVal: any = a[auditSortField];
      let bVal: any = b[auditSortField];
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal || "").toLowerCase();
      }
      if (aVal < bVal) return auditSortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return auditSortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredAuditLogs, auditSortField, auditSortDirection]);

  const totalAuditItems = sortedAuditLogs.length;
  const totalAuditPages = Math.ceil(totalAuditItems / auditPageSize) || 1;
  const paginatedAuditLogs = useMemo(() => {
    const start = (auditCurrentPage - 1) * auditPageSize;
    return sortedAuditLogs.slice(start, start + auditPageSize);
  }, [sortedAuditLogs, auditCurrentPage, auditPageSize]);

  const handleAuditSort = (field: keyof AuditLogItem) => {
    if (auditSortField === field) {
      setAuditSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setAuditSortField(field);
      setAuditSortDirection("asc");
    }
  };

  const renderAuditSortIndicator = (field: keyof AuditLogItem) => {
    if (auditSortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />;
    }
    return auditSortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-primary-600 dark:text-primary-400 font-bold" />
    ) : (
      <ArrowDown className="w-3 h-3 text-primary-600 dark:text-primary-400 font-bold" />
    );
  };

  // Copy Text Helper
  const handleCopyText = (text: string, label: string = "Copied to clipboard!") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  // Drawer Next / Prev Navigation
  const handlePrevLog = () => {
    if (!selectedLog) return;
    const currentIndex = sortedLogs.findIndex((item) => item.id === selectedLog.id);
    if (currentIndex > 0) {
      setSelectedLog(sortedLogs[currentIndex - 1]);
    } else {
      toast.info("First request log reached.");
    }
  };

  const handleNextLog = () => {
    if (!selectedLog) return;
    const currentIndex = sortedLogs.findIndex((item) => item.id === selectedLog.id);
    if (currentIndex < sortedLogs.length - 1) {
      setSelectedLog(sortedLogs[currentIndex + 1]);
    } else {
      toast.info("Last request log reached.");
    }
  };

  return (
    <div className="p-6 max-w-[1700px] mx-auto space-y-5">
      {/* -------------------- 1. PAGE HEADER & BREADCRUMB -------------------- */}
      <PageHeader
        title={activeTab === "audit" ? "Audit Logs" : "Request Logs"}
        subtitle={
          activeTab === "audit"
            ? "Track every Create, Update and Delete action performed across Organizations, Teams, Users, Models, Keys and Platform configuration."
            : "Real-time observability, gateway tracing, cost analytics, and failure diagnostics across AI models."
        }
        breadcrumbs={[
          { label: "Logs", href: "#" },
          { label: activeTab === "audit" ? "Audit Log" : "Request Log", current: true }
        ]}
      />

      {/* ========================================================================= */}
      {/* TAB 1: REQUEST LOGS                                                       */}
      {/* ========================================================================= */}
      {activeTab === "request" && (
        <div className="space-y-4 animate-fadeIn">
          {/* -------------------- FILTER TOOLBAR -------------------- */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 shadow-2xs space-y-3">
            {/* Top Action Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilterDrawer(true)}
                  className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold flex items-center gap-2 transition-colors relative"
                >
                  <Filter className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Reset Filters</span>
                </button>
              </div>

              {/* Summary Counter & Pagination Controls */}
              <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                <div>
                  Showing <span className="font-semibold text-neutral-900 dark:text-white">1 - {paginatedLogs.length}</span> of{" "}
                  <span className="font-semibold text-neutral-900 dark:text-white">{filteredLogs.length.toLocaleString()}</span> results
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Page {currentPage} of {Math.ceil(filteredLogs.length / pageSize) || 1}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors text-xs font-semibold"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={currentPage >= Math.ceil(filteredLogs.length / pageSize)}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-2.5 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors text-xs font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Second Row: Search, Time Dropdown, Live Tail, Fetch */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* Search by Request ID */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Request ID, Session ID, Key..."
                    className="w-full h-9 pl-9 pr-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Quick Time Range Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                    className="h-9 px-3.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center gap-2 hover:bg-neutral-50 transition-colors shadow-2xs"
                  >
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{timeRange}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  {showTimeDropdown && (
                    <div className="absolute left-0 top-10 z-40 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1 text-xs animate-fadeIn">
                      {TIME_RANGES.map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => {
                            setTimeRange(range);
                            setShowTimeDropdown(false);
                            toast.info(`Time range set to ${range}`);
                          }}
                          className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between ${
                            timeRange === range
                              ? "bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          }`}
                        >
                          <span>{range}</span>
                          {timeRange === range && <Check className="w-3.5 h-3.5 text-primary-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Live Tail Toggle Switch */}
                <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Live Tail</span>
                  <button
                    type="button"
                    onClick={() => setLiveTail(!liveTail)}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                      liveTail ? "bg-primary-600" : "bg-neutral-300 dark:bg-neutral-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        liveTail ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Fetch Button */}
                <button
                  type="button"
                  onClick={handleFetch}
                  disabled={isFetching}
                  className="h-9 px-3.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-50 transition-colors shadow-2xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-neutral-500 ${isFetching ? "animate-spin" : ""}`} />
                  <span>Fetch</span>
                </button>
              </div>
            </div>
          </div>

          {/* -------------------- 3. LIVE TAIL GREEN STATUS BANNER -------------------- */}
          {liveTail && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 animate-fadeIn">
              <div className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Auto-refreshing every 15 seconds</span>
              </div>
              <button
                type="button"
                onClick={() => setLiveTail(false)}
                className="font-bold hover:underline text-emerald-700 dark:text-emerald-400"
              >
                Stop
              </button>
            </div>
          )}

          {/* -------------------- 4. REQUEST LOG TABLE -------------------- */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50/90 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold">
                    <th
                      onClick={() => handleSort("timestamp")}
                      className="py-3 px-3.5 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors sticky left-0 z-10 bg-neutral-50 dark:bg-neutral-900 shadow-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Time</span>
                        {renderSortIndicator("timestamp")}
                      </div>
                    </th>
                    <th className="py-3 px-3.5">Type</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5">Session ID</th>
                    <th className="py-3 px-3.5">Request ID</th>
                    <th onClick={() => handleSort("cost")} className="py-3 px-3.5 cursor-pointer hover:bg-neutral-100 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span>Cost</span>
                        {renderSortIndicator("cost")}
                      </div>
                    </th>
                    <th onClick={() => handleSort("duration")} className="py-3 px-3.5 cursor-pointer hover:bg-neutral-100 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span>Duration (s)</span>
                        {renderSortIndicator("duration")}
                      </div>
                    </th>
                    <th className="py-3 px-3.5">TTFT (s)</th>
                    <th className="py-3 px-3.5">Team Name</th>
                    <th className="py-3 px-3.5">Key Hash</th>
                    <th className="py-3 px-3.5">Key Alias</th>
                    <th onClick={() => handleSort("model")} className="py-3 px-3.5 cursor-pointer hover:bg-neutral-100 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span>Model</span>
                        {renderSortIndicator("model")}
                      </div>
                    </th>
                    <th className="py-3 px-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-12 text-center text-neutral-500">
                        <div className="max-w-sm mx-auto space-y-3">
                          <Activity className="w-10 h-10 mx-auto text-neutral-300" />
                          <div className="font-bold text-neutral-900 dark:text-white text-sm">
                            No request logs found
                          </div>
                          <p className="text-xs text-neutral-400">
                            Adjust your search query or filter parameters to find matching logs.
                          </p>
                          <SecondaryButton onClick={handleResetFilters}>
                            Reset Filters
                          </SecondaryButton>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log) => (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                      >
                        {/* Time (Sticky) */}
                        <td className="py-3 px-3.5 font-mono text-[11px] text-neutral-700 dark:text-neutral-300 whitespace-nowrap sticky left-0 bg-white dark:bg-neutral-900 group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800/80 shadow-xs">
                          {new Date(log.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })},{" "}
                          {new Date(log.timestamp).toLocaleTimeString("en-US", { hour12: false })}
                        </td>

                        {/* Type Pill */}
                        <td className="py-3 px-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300">
                            <Cpu className="w-3 h-3" />
                            {log.type}
                          </span>
                        </td>

                        {/* Status Pill */}
                        <td className="py-3 px-3.5">
                          {log.status === "Success" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300">
                              <XCircle className="w-3 h-3" />
                              Failure
                            </span>
                          )}
                        </td>

                        {/* Session ID */}
                        <td className="py-3 px-3.5 font-mono text-[11px] text-primary-600 dark:text-primary-400 hover:underline max-w-[130px] truncate">
                          {log.sessionId}
                        </td>

                        {/* Request ID */}
                        <td className="py-3 px-3.5 font-mono text-[11px] text-primary-600 dark:text-primary-400 hover:underline max-w-[140px] truncate">
                          {log.id}
                        </td>

                        {/* Cost */}
                        <td className="py-3 px-3.5 font-mono text-[11px] text-neutral-800 dark:text-neutral-200">
                          {log.cost > 0 ? `$${log.cost.toFixed(6)}` : "-"}
                        </td>

                        {/* Duration */}
                        <td className="py-3 px-3.5 font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                          {log.duration > 0 ? log.duration.toFixed(2) : "0.00"}
                        </td>

                        {/* TTFT */}
                        <td className="py-3 px-3.5 font-mono text-[11px] text-neutral-500">
                          {log.ttft ? log.ttft.toFixed(2) : "-"}
                        </td>

                        {/* Team Name */}
                        <td className="py-3 px-3.5 text-neutral-700 dark:text-neutral-300 max-w-[140px] truncate">
                          {log.teamName}
                        </td>

                        {/* Key Hash */}
                        <td className="py-3 px-3.5 font-mono text-[11px] text-neutral-500 max-w-[130px] truncate">
                          {log.keyHash}
                        </td>

                        {/* Key Alias */}
                        <td className="py-3 px-3.5 text-neutral-700 dark:text-neutral-300 max-w-[120px] truncate">
                          {log.keyAlias}
                        </td>

                        {/* Model */}
                        <td className="py-3 px-3.5 font-mono text-[11px] text-neutral-900 dark:text-white font-semibold max-w-[140px] truncate">
                          {log.model}
                        </td>

                        {/* Action Menu */}
                        <td className="py-3 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(log);
                            }}
                            className="p-1 rounded-md text-neutral-400 hover:text-primary-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredLogs.length}
              itemsPerPage={pageSize}
              onPageChange={(p) => setCurrentPage(p)}
              onItemsPerPageChange={(s) => {
                setPageSize(s);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2, 3, 4: OTHER OBSERVABILITY TABS                                    */}
      {/* ========================================================================= */}
      {/* TAB 2: AUDIT LOGS                                                         */}
      {/* ========================================================================= */}
      {activeTab === "audit" && (
        <div className="space-y-4 animate-fadeIn">
          {/* -------------------- FILTER TOOLBAR -------------------- */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 shadow-2xs space-y-3">
            {/* Top Action Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuditFilterDrawer(true)}
                  className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold flex items-center gap-2 transition-colors relative"
                >
                  <Filter className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                  <span>Filters</span>
                  {auditActiveFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {auditActiveFilterCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetAuditFilters}
                  className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Reset Filters</span>
                </button>
              </div>

              {/* Summary Counter & Pagination Controls */}
              <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                <span>
                  Showing <strong className="text-neutral-900 dark:text-white font-bold">{paginatedAuditLogs.length > 0 ? (auditCurrentPage - 1) * auditPageSize + 1 : 0} - {Math.min(auditCurrentPage * auditPageSize, totalAuditItems)}</strong> of <strong className="text-neutral-900 dark:text-white font-bold">{totalAuditItems}</strong> results
                </span>

                <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200 dark:border-neutral-800">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Page {auditCurrentPage} of {totalAuditPages}
                  </span>
                  <button
                    type="button"
                    disabled={auditCurrentPage === 1}
                    onClick={() => setAuditCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={auditCurrentPage === totalAuditPages}
                    onClick={() => setAuditCurrentPage((p) => Math.min(totalAuditPages, p + 1))}
                    className="px-2 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Search + Time Range + Refresh */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  placeholder="Search by Request ID, Session ID, Key Hash, User, Table, Action..."
                  className="w-full h-9 pl-9 pr-8 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
                {auditSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setAuditSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {/* Time Range Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAuditTimeDropdown(!showAuditTimeDropdown)}
                    className="h-9 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{auditTimeRange}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  {showAuditTimeDropdown && (
                    <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl py-1 z-30 animate-fadeIn">
                      {TIME_RANGES.map((tr) => (
                        <button
                          key={tr}
                          type="button"
                          onClick={() => {
                            setAuditTimeRange(tr);
                            setShowAuditTimeDropdown(false);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs font-medium transition-colors ${
                            auditTimeRange === tr
                              ? "bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          }`}
                        >
                          {tr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fetch Button */}
                <button
                  type="button"
                  onClick={handleFetch}
                  disabled={isFetching}
                  className="h-9 px-3.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-primary-600" : "text-neutral-500"}`} />
                  <span>Fetch</span>
                </button>
              </div>
            </div>
          </div>

          {/* -------------------- AUDIT LOGS TABLE -------------------- */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-neutral-50/80 dark:bg-neutral-950/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold select-none">
                    <th
                      onClick={() => handleAuditSort("timestamp")}
                      className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Timestamp</span>
                        {renderAuditSortIndicator("timestamp")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleAuditSort("action")}
                      className="py-3 px-3.5 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Action</span>
                        {renderAuditSortIndicator("action")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleAuditSort("table")}
                      className="py-3 px-3.5 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Table</span>
                        {renderAuditSortIndicator("table")}
                      </div>
                    </th>
                    <th className="py-3 px-3.5">Object ID</th>
                    <th
                      onClick={() => handleAuditSort("changedBy")}
                      className="py-3 px-3.5 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Changed By</span>
                        {renderAuditSortIndicator("changedBy")}
                      </div>
                    </th>
                    <th className="py-3 px-3.5">API Key (Hash)</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                  {paginatedAuditLogs.length > 0 ? (
                    paginatedAuditLogs.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedAuditLog(item)}
                        className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors group"
                      >
                        {/* Timestamp */}
                        <td className="py-3 px-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                          {item.timestamp}
                        </td>

                        {/* Action Badge */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          {item.action === "Created" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                              Created
                            </span>
                          )}
                          {item.action === "Updated" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800">
                              Updated
                            </span>
                          )}
                          {item.action === "Deleted" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
                              Deleted
                            </span>
                          )}
                        </td>

                        {/* Table */}
                        <td className="py-3 px-3.5 text-neutral-900 dark:text-white font-medium whitespace-nowrap">
                          {item.table}
                        </td>

                        {/* Object ID */}
                        <td className="py-3 px-3.5 font-mono text-[11px] text-neutral-800 dark:text-neutral-200 max-w-[200px]">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="truncate">{item.objectId}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyText(item.objectId, "Object ID copied!");
                              }}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-400 hover:text-primary-600 transition-opacity"
                              title="Copy Object ID"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Changed By */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                            {item.changedBy}
                          </span>
                        </td>

                        {/* API Key Hash */}
                        <td className="py-3 px-3.5 font-mono text-[11px] text-neutral-500 max-w-[180px]">
                          {item.apiKeyHash && item.apiKeyHash !== "-" ? (
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="truncate">{item.apiKeyHash}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyText(item.apiKeyHash!, "API Key Hash copied!");
                                }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-opacity"
                                title="Copy API Key Hash"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-neutral-400 font-mono">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-neutral-500 dark:text-neutral-400">
                        <div className="max-w-xs mx-auto space-y-2">
                          <FileText className="w-8 h-8 text-neutral-400 mx-auto" />
                          <div className="font-semibold text-neutral-900 dark:text-white">No Audit Logs Found</div>
                          <p className="text-xs text-neutral-500">No audit activities match your selected search or filters.</p>
                          <button
                            type="button"
                            onClick={handleResetAuditFilters}
                            className="mt-2 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  value={auditPageSize}
                  onChange={(e) => {
                    setAuditPageSize(Number(e.target.value));
                    setAuditCurrentPage(1);
                  }}
                  className="h-8 px-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md font-semibold text-neutral-800 dark:text-white focus:outline-none"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span>
                  Showing {paginatedAuditLogs.length > 0 ? (auditCurrentPage - 1) * auditPageSize + 1 : 0} - {Math.min(auditCurrentPage * auditPageSize, totalAuditItems)} of {totalAuditItems}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={auditCurrentPage === 1}
                    onClick={() => setAuditCurrentPage(1)}
                    className="p-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="First Page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={auditCurrentPage === 1}
                    onClick={() => setAuditCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-semibold text-neutral-800 dark:text-white">
                    {auditCurrentPage} / {totalAuditPages}
                  </span>
                  <button
                    type="button"
                    disabled={auditCurrentPage === totalAuditPages}
                    onClick={() => setAuditCurrentPage((p) => Math.min(totalAuditPages, p + 1))}
                    className="p-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={auditCurrentPage === totalAuditPages}
                    onClick={() => setAuditCurrentPage(totalAuditPages)}
                    className="p-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Last Page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "deleted-keys" && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs animate-fadeIn space-y-4">
          <div className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
            <Hash className="w-5 h-5 text-rose-500" />
            <span>Deleted Virtual Keys History</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                <th className="py-2.5">Key Alias</th>
                <th className="py-2.5">Key Hash</th>
                <th className="py-2.5">Deleted By</th>
                <th className="py-2.5">Deleted At</th>
                <th className="py-2.5">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {mockDeletedKeys.map((item) => (
                <tr key={item.id} className="py-2.5">
                  <td className="py-2.5 font-semibold text-neutral-900 dark:text-white">{item.keyAlias}</td>
                  <td className="py-2.5 font-mono text-neutral-500">{item.keyHash}</td>
                  <td className="py-2.5 text-neutral-700 dark:text-neutral-300">{item.deletedBy}</td>
                  <td className="py-2.5 text-neutral-500">{item.deletedAt}</td>
                  <td className="py-2.5 text-rose-600 dark:text-rose-400 font-medium">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "deleted-teams" && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs animate-fadeIn space-y-4">
          <div className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-500" />
            <span>Deleted Teams History</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                <th className="py-2.5">Team Name</th>
                <th className="py-2.5">Team ID</th>
                <th className="py-2.5">Deleted By</th>
                <th className="py-2.5">Deleted At</th>
                <th className="py-2.5">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {mockDeletedTeams.map((item) => (
                <tr key={item.id} className="py-2.5">
                  <td className="py-2.5 font-semibold text-neutral-900 dark:text-white">{item.teamName}</td>
                  <td className="py-2.5 font-mono text-neutral-500">{item.teamId}</td>
                  <td className="py-2.5 text-neutral-700 dark:text-neutral-300">{item.deletedBy}</td>
                  <td className="py-2.5 text-neutral-500">{item.deletedAt}</td>
                  <td className="py-2.5 text-neutral-600 dark:text-neutral-400">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ADVANCED FILTER DRAWER (RIGHT SLIDE-OVER)                              */}
      {/* ========================================================================= */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 w-full max-w-lg h-full flex flex-col shadow-2xl animate-slideLeft">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Advanced Log Filters
                </h3>
              </div>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body (17 Search & Filter Fields) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs custom-scrollbar">
              {/* Team */}
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Team</label>
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                >
                  <option value="All">All Teams</option>
                  <option value="Sales Team">Sales Team</option>
                  <option value="litellm-internal">litellm-internal</option>
                  <option value="Engineering">Engineering</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                >
                  <option value="All">All Statuses</option>
                  <option value="Success">Success</option>
                  <option value="Failure">Failure</option>
                  <option value="Timeout">Timeout</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Key Alias */}
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Key Alias</label>
                <select
                  value={filterKeyAlias}
                  onChange={(e) => setFilterKeyAlias(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                >
                  <option value="All">All Key Aliases</option>
                  <option value="CRM KEY">CRM KEY</option>
                  <option value="Ravi key">Ravi key</option>
                  <option value="Testing-AT">Testing-AT</option>
                  <option value="Test Key">Test Key</option>
                </select>
              </div>

              {/* End User */}
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">End User</label>
                <select
                  value={filterEndUser}
                  onChange={(e) => setFilterEndUser(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                >
                  <option value="All">All End Users</option>
                  <option value="john.doe@company.com">john.doe@company.com</option>
                  <option value="sarah.connor@hb.com">sarah.connor@hb.com</option>
                  <option value="alex.dev@hb.com">alex.dev@hb.com</option>
                </select>
              </div>

              {/* Error Code & Message */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Error Code</label>
                  <select
                    value={filterErrorCode}
                    onChange={(e) => setFilterErrorCode(e.target.value)}
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  >
                    <option value="All">All Error Codes</option>
                    <option value="401">401 (Unauthorized / Expired)</option>
                    <option value="429">429 (Rate Limit Exceeded)</option>
                    <option value="500">500 (Internal Error)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Error Message</label>
                  <input
                    type="text"
                    value={filterErrorMessage}
                    onChange={(e) => setFilterErrorMessage(e.target.value)}
                    placeholder="Enter Error Message..."
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  />
                </div>
              </div>

              {/* Key Hash & Session ID */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Key Hash</label>
                  <input
                    type="text"
                    value={filterKeyHash}
                    onChange={(e) => setFilterKeyHash(e.target.value)}
                    placeholder="Enter Key Hash..."
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Session ID</label>
                  <input
                    type="text"
                    value={filterSessionId}
                    onChange={(e) => setFilterSessionId(e.target.value)}
                    placeholder="Enter Session ID..."
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Model (Grouped by Provider) */}
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Model</label>
                <select
                  value={filterModel}
                  onChange={(e) => setFilterModel(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                >
                  <option value="All">All Models</option>
                  {MODEL_OPTIONS_BY_PROVIDER.map((grp) => (
                    <optgroup key={grp.provider} label={grp.provider}>
                      {grp.models.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Public Model / Search Tool */}
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Public Model / Search Tool</label>
                <input
                  type="text"
                  value={filterPublicModel}
                  onChange={(e) => setFilterPublicModel(e.target.value)}
                  placeholder="Enter Public Model or Search Tool..."
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                />
              </div>

              {/* Provider & Organization */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Provider</label>
                  <select
                    value={filterProvider}
                    onChange={(e) => setFilterProvider(e.target.value)}
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  >
                    <option value="All">All Providers</option>
                    <option value="OpenAI">OpenAI</option>
                    <option value="Anthropic">Anthropic</option>
                    <option value="Google">Google / Gemini</option>
                    <option value="Meta">Meta</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Organization</label>
                  <select
                    value={filterOrg}
                    onChange={(e) => setFilterOrg(e.target.value)}
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  >
                    <option value="All">All Organizations</option>
                    <option value="HB Enterprise">HB Enterprise</option>
                    <option value="CyberShield Ltd">CyberShield Ltd</option>
                  </select>
                </div>
              </div>

              {/* Duration Range (Min, Max) */}
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Duration Range (Seconds)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={filterMinDuration}
                    onChange={(e) => setFilterMinDuration(e.target.value)}
                    placeholder="Min Duration (s)"
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  />
                  <input
                    type="number"
                    value={filterMaxDuration}
                    onChange={(e) => setFilterMaxDuration(e.target.value)}
                    placeholder="Max Duration (s)"
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  />
                </div>
              </div>

              {/* Cost Range (Min, Max) */}
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Cost Range ($ USD)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="0.000001"
                    value={filterMinCost}
                    onChange={(e) => setFilterMinCost(e.target.value)}
                    placeholder="Min Cost ($)"
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  />
                  <input
                    type="number"
                    step="0.000001"
                    value={filterMaxCost}
                    onChange={(e) => setFilterMaxCost(e.target.value)}
                    placeholder="Max Cost ($)"
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  />
                </div>
              </div>

              {/* Tokens Range (Min, Max) */}
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Total Tokens Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={filterMinTokens}
                    onChange={(e) => setFilterMinTokens(e.target.value)}
                    placeholder="Min Tokens"
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  />
                  <input
                    type="number"
                    value={filterMaxTokens}
                    onChange={(e) => setFilterMaxTokens(e.target.value)}
                    placeholder="Max Tokens"
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  />
                </div>
              </div>

              {/* Request Type & Environment */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Request Type</label>
                  <select
                    value={filterRequestType}
                    onChange={(e) => setFilterRequestType(e.target.value)}
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  >
                    <option value="All">All Types</option>
                    <option value="LLM">LLM</option>
                    <option value="Embedding">Embedding</option>
                    <option value="Image">Image</option>
                    <option value="Audio">Audio</option>
                    <option value="Search Tool">Search Tool</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Environment</label>
                  <select
                    value={filterEnvironment}
                    onChange={(e) => setFilterEnvironment(e.target.value)}
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  >
                    <option value="All">All Environments</option>
                    <option value="default">Default</option>
                    <option value="production">Production</option>
                    <option value="development">Development</option>
                    <option value="testing">Testing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sticky Drawer Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900">
              <SecondaryButton onClick={handleResetFilters}>
                Reset Filters
              </SecondaryButton>

              <PrimaryButton
                onClick={() => {
                  setShowFilterDrawer(false);
                  toast.success(`Applied ${activeFilterCount} active filters`);
                }}
              >
                Apply Filters
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. REQUEST DETAILS RIGHT DRAWER (60-70% OVERLAY)                         */}
      {/* ========================================================================= */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className={`bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 h-full flex flex-col shadow-2xl transition-all duration-300 animate-slideLeft ${
              detailsDrawerExpanded ? "w-full" : "w-full md:w-[65%] lg:w-[60%]"
            }`}
          >
            {/* Drawer Top Header & Navigation */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 bg-neutral-50/70 dark:bg-neutral-950 flex-shrink-0">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-primary-600" />
                    {selectedLog.id}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopyText(selectedLog.id, "Copied Request ID!")}
                    className="text-neutral-400 hover:text-primary-600 transition-colors p-1"
                    title="Copy Request ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Status Badge */}
                  {selectedLog.status === "Success" ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                      Success
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200">
                      Failure
                    </span>
                  )}

                  {/* Environment Badge */}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    Env: {selectedLog.environment}
                  </span>
                </div>

                <div className="text-xs text-neutral-500 font-mono flex items-center gap-2">
                  <span>{new Date(selectedLog.timestamp).toLocaleString()}</span>
                  <span>•</span>
                  <span>{selectedLog.provider}/{selectedLog.model}</span>
                </div>
              </div>

              {/* Prev / Next & Drawer Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevLog}
                  className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors"
                  title="Previous Request"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNextLog}
                  className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors"
                  title="Next Request"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setDetailsDrawerExpanded(!detailsDrawerExpanded)}
                  className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors hidden sm:block"
                  title={detailsDrawerExpanded ? "Collapse Width" : "Expand Width"}
                >
                  <Layers className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors"
                  title="Close Drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body (Collapsible Accordion Cards) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs custom-scrollbar">
              {/* 1. FAILURE ALERT CARD (IF FAILED) */}
              {selectedLog.status === "Failure" && selectedLog.error && (
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-4 space-y-2 text-rose-900 dark:text-rose-200 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-sm text-rose-700 dark:text-rose-400">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span>Request Failed</span>
                  </div>
                  <div className="font-mono text-xs font-semibold">
                    Error Code: {selectedLog.error.code}
                  </div>
                  <p className="text-xs leading-relaxed font-mono bg-white/60 dark:bg-black/30 p-2.5 rounded-lg border border-rose-200/60 dark:border-rose-900/60">
                    Message: {selectedLog.error.message}
                  </p>
                </div>
              )}

              {/* 2. TAGS CHIP LIST */}
              <div className="bg-neutral-50/70 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-2">
                <div className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">
                  Tags & User Context
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedLog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-neutral-700 dark:text-neutral-300 shadow-2xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. REQUEST DETAILS KEY-VALUE GRID */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3 shadow-2xs">
                <div className="font-bold text-sm text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary-600" />
                  <span>Request Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400 font-medium">Model:</span>{" "}
                    <span className="font-bold text-neutral-900 dark:text-white font-mono">{selectedLog.model}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium">Provider:</span>{" "}
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedLog.provider}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium">Call Type:</span>{" "}
                    <span className="font-mono text-neutral-700 dark:text-neutral-300">{selectedLog.callType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-neutral-400 font-medium">Model ID:</span>{" "}
                    <span className="font-mono text-neutral-700 truncate max-w-[140px]">{selectedLog.modelId}</span>
                    <button onClick={() => handleCopyText(selectedLog.modelId)} className="text-neutral-400 hover:text-primary-600">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 sm:col-span-2">
                    <span className="text-neutral-400 font-medium">API Base:</span>{" "}
                    <span className="font-mono text-neutral-700 truncate max-w-[280px]">{selectedLog.apiBaseUrl}</span>
                    <button onClick={() => handleCopyText(selectedLog.apiBaseUrl)} className="text-neutral-400 hover:text-primary-600">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium">IP Address:</span>{" "}
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{selectedLog.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium">Organization:</span>{" "}
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedLog.organization}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium">Team:</span>{" "}
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedLog.teamName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium">Virtual Key:</span>{" "}
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedLog.keyAlias}</span>
                  </div>
                </div>
              </div>

              {/* 4. METRICS GRID */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3 shadow-2xs">
                <div className="font-bold text-sm text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Metrics & Performance</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-neutral-400 font-sans">Tokens:</span>{" "}
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {selectedLog.metrics.totalTokens} ({selectedLog.metrics.promptTokens} prompt + {selectedLog.metrics.completionTokens} completion)
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-sans">Cost:</span>{" "}
                    <span className="font-bold text-emerald-600">${selectedLog.cost.toFixed(8)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-sans">Duration:</span>{" "}
                    <span>{selectedLog.duration.toFixed(3)} s</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-sans">Time to First Token:</span>{" "}
                    <span>{selectedLog.ttft ? `${selectedLog.ttft.toFixed(3)} s` : "-"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-sans">Response Cache:</span>{" "}
                    <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-bold">
                      {selectedLog.metrics.cacheStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-sans">Retries:</span>{" "}
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                      {selectedLog.metrics.retries === 0 ? "None" : selectedLog.metrics.retries}
                    </span>
                  </div>
                  <div className="sm:col-span-2 text-[11px] text-neutral-500">
                    Start: {selectedLog.metrics.startTime} | End: {selectedLog.metrics.endTime}
                  </div>
                </div>
              </div>

              {/* 5. COST BREAKDOWN (COLLAPSIBLE ACCORDION) */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setOpenCostBreakdown(!openCostBreakdown)}
                  className="w-full p-4 flex items-center justify-between font-bold text-sm text-neutral-900 dark:text-white hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    <span>Cost Breakdown</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-emerald-600">
                      Total: ${selectedLog.costBreakdown.totalCost.toFixed(8)}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openCostBreakdown ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {openCostBreakdown && (
                  <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs font-mono bg-neutral-50/50 dark:bg-neutral-950/40 animate-fadeIn">
                    <div className="flex justify-between py-1 border-b border-neutral-200/50">
                      <span className="text-neutral-500">Input Cost</span>
                      <span>${selectedLog.costBreakdown.inputCost.toFixed(8)} ({selectedLog.metrics.promptTokens} prompt tokens)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-200/50">
                      <span className="text-neutral-500">Output Cost</span>
                      <span>${selectedLog.costBreakdown.outputCost.toFixed(8)} ({selectedLog.metrics.completionTokens} completion tokens)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-200/50">
                      <span className="text-neutral-500">Original LLM Cost</span>
                      <span>${selectedLog.costBreakdown.originalLLMCost.toFixed(8)}</span>
                    </div>
                    <div className="flex justify-between py-1 font-bold text-neutral-900 dark:text-white">
                      <span>Final Calculated Cost</span>
                      <span className="text-emerald-600">${selectedLog.costBreakdown.finalCost.toFixed(8)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. REQUEST & RESPONSE ACCORDION (PRETTY / JSON TABS) */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xs">
                <div className="p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
                    <Code className="w-4 h-4 text-sky-600" />
                    <span>Request & Response Payload</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Pretty | JSON Switcher */}
                    <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setPayloadTab("pretty")}
                        className={`px-3 py-1 rounded-md transition-all ${
                          payloadTab === "pretty"
                            ? "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white shadow-2xs"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        Pretty
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayloadTab("json")}
                        className={`px-3 py-1 rounded-md transition-all ${
                          payloadTab === "json"
                            ? "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white shadow-2xs"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        JSON
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyText(JSON.stringify(selectedLog.responsePayload || selectedLog.requestPayload, null, 2), "Copied Payload!")}
                      className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 hover:text-neutral-900"
                      title="Copy Payload"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950 text-neutral-100 font-mono text-xs overflow-x-auto max-h-80 custom-scrollbar">
                  {payloadTab === "pretty" ? (
                    <div className="space-y-3">
                      <div className="text-emerald-400 font-bold border-b border-neutral-800 pb-1">
                        ➜ Output | Tokens: {selectedLog.metrics.completionTokens} | Cost: ${selectedLog.cost.toFixed(6)}
                      </div>
                      <pre className="whitespace-pre-wrap leading-relaxed text-neutral-300">
                        {selectedLog.responsePayload
                          ? JSON.stringify(selectedLog.responsePayload, null, 2)
                          : "No response data available (Request failed or timed out)"}
                      </pre>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap leading-relaxed text-sky-300">
                      {JSON.stringify(
                        { request: selectedLog.requestPayload, response: selectedLog.responsePayload },
                        null,
                        2
                      )}
                    </pre>
                  )}
                </div>
              </div>

              {/* 7. METADATA JSON VIEWER */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setOpenMetadata(!openMetadata)}
                  className="w-full p-4 flex items-center justify-between font-bold text-sm text-neutral-900 dark:text-white hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-purple-600" />
                    <span>Metadata & Gateway Properties</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openMetadata ? "rotate-180" : ""}`} />
                </button>

                {openMetadata && (
                  <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 space-y-3 bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto max-h-72 custom-scrollbar animate-fadeIn">
                    <pre className="whitespace-pre-wrap text-purple-300 leading-relaxed">
                      {JSON.stringify(selectedLog.metadataPayload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* 8. ERROR INFORMATION (FOR FAILURES) */}
              {selectedLog.status === "Failure" && selectedLog.error && (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setOpenError(!openError)}
                    className="w-full p-4 flex items-center justify-between font-bold text-sm text-rose-700 dark:text-rose-400 hover:bg-rose-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Failure Diagnostic & Traceback</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openError ? "rotate-180" : ""}`} />
                  </button>

                  {openError && (
                    <div className="p-4 border-t border-rose-100 dark:border-neutral-800 space-y-3 bg-neutral-950 text-rose-300 font-mono text-xs overflow-x-auto max-h-60 custom-scrollbar animate-fadeIn">
                      <div className="text-neutral-400 font-sans">
                        Error Type: <span className="text-rose-400 font-mono font-bold">{selectedLog.error.type}</span>
                      </div>
                      <pre className="whitespace-pre-wrap text-rose-200 leading-relaxed bg-black/50 p-3 rounded-lg border border-rose-900/50">
                        {selectedLog.error.traceback || selectedLog.error.message}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* 9. TIMELINE EVENT TRACKER */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4 shadow-2xs">
                <div className="font-bold text-sm text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span>Execution Timeline</span>
                </div>

                <div className="space-y-3 text-xs pl-2">
                  {selectedLog.timeline.map((evt) => (
                    <div key={evt.id} className="flex items-start gap-3 relative">
                      <div className="mt-0.5">
                        {evt.status === "completed" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                          <span>{evt.step}</span>
                          <span className="font-mono text-[10px] text-neutral-400 font-normal">
                            (+{evt.offsetSeconds.toFixed(3)}s)
                          </span>
                        </div>
                        {evt.detail && (
                          <div className="text-[11px] font-mono text-rose-600 dark:text-rose-400 mt-0.5">
                            {evt.detail}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* AUDIT LOGS FILTER DRAWER (RIGHT SLIDE-OVER)                               */}
      {/* ========================================================================= */}
      {showAuditFilterDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 w-full max-w-lg h-full flex flex-col shadow-2xl animate-slideLeft">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Filter Audit Logs
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditFilterDrawer(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs custom-scrollbar">
              {/* Date Range */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Today", "Yesterday", "Last 7 Days", "Last 30 Days"].map((dr) => (
                    <button
                      key={dr}
                      type="button"
                      onClick={() => setAuditTimeRange(dr)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors text-left ${
                        auditTimeRange === dr
                          ? "bg-primary-50 dark:bg-primary-950/60 border-primary-500 text-primary-600 dark:text-primary-400"
                          : "bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
                      }`}
                    >
                      {dr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Multi-select */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Action</label>
                <div className="flex flex-wrap gap-2">
                  {["Created", "Updated", "Deleted"].map((act) => {
                    const isChecked = auditFilterActions.includes(act);
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setAuditFilterActions(auditFilterActions.filter((a) => a !== act));
                          } else {
                            setAuditFilterActions([...auditFilterActions, act]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                          isChecked
                            ? "bg-primary-600 border-primary-600 text-white"
                            : "bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
                        }`}
                      >
                        {act}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table Multi-select */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Table / Resource</label>
                <div className="flex flex-wrap gap-2">
                  {["Users", "Teams", "Organizations", "Models", "Keys", "Policies", "UI Settings"].map((tbl) => {
                    const isChecked = auditFilterTables.includes(tbl);
                    return (
                      <button
                        key={tbl}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setAuditFilterTables(auditFilterTables.filter((t) => t !== tbl));
                          } else {
                            setAuditFilterTables([...auditFilterTables, tbl]);
                          }
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          isChecked
                            ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 border-neutral-800 font-semibold"
                            : "bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
                        }`}
                      >
                        {tbl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Changed By */}
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Changed By</label>
                <input
                  type="text"
                  value={auditFilterChangedBy}
                  onChange={(e) => setAuditFilterChangedBy(e.target.value)}
                  placeholder="Filter by user or admin e.g. Default Proxy Admin"
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                />
              </div>

              {/* API Key Hash */}
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">API Key Hash</label>
                <input
                  type="text"
                  value={auditFilterKeyHash}
                  onChange={(e) => setAuditFilterKeyHash(e.target.value)}
                  placeholder="Filter by API Key Hash e.g. b9042ff8a38e..."
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-neutral-900 dark:text-white"
                />
              </div>

              {/* Object ID */}
              <div className="space-y-1">
                <label className="block font-semibold text-neutral-800 dark:text-neutral-200">Object ID</label>
                <input
                  type="text"
                  value={auditFilterObjectId}
                  onChange={(e) => setAuditFilterObjectId(e.target.value)}
                  placeholder="Filter by Object ID e.g. default_user_id"
                  className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3 bg-neutral-50 dark:bg-neutral-900/60">
              <button
                type="button"
                onClick={handleResetAuditFilters}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 text-xs font-semibold transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAuditFilterDrawer(false);
                  toast.success("Applied audit log filters.");
                }}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUDIT LOG DETAILS DRAWER (RIGHT SLIDE-OVER)                               */}
      {/* ========================================================================= */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 w-full max-w-2xl sm:max-w-3xl h-full flex flex-col shadow-2xl animate-slideLeft">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                {selectedAuditLog.action === "Created" && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                    Created
                  </span>
                )}
                {selectedAuditLog.action === "Updated" && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800">
                    Updated
                  </span>
                )}
                {selectedAuditLog.action === "Deleted" && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
                    Deleted
                  </span>
                )}
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 font-mono">
                  {selectedAuditLog.timestamp}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAuditLog(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              {/* DETAILS Card */}
              <div className="bg-neutral-50/70 dark:bg-neutral-900/60 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">DETAILS</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs">
                  <div>
                    <span className="block text-neutral-400 font-medium mb-0.5">Table</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">{selectedAuditLog.table}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-400 font-medium mb-0.5">Object ID</span>
                    <div className="flex items-center gap-1.5 font-mono text-primary-600 dark:text-primary-400 font-semibold">
                      <span className="truncate">{selectedAuditLog.objectId}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(selectedAuditLog.objectId, "Object ID copied!")}
                        className="p-0.5 text-neutral-400 hover:text-primary-600 transition-colors"
                        title="Copy Object ID"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="block text-neutral-400 font-medium mb-0.5">Changed By</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                      {selectedAuditLog.changedBy}
                    </span>
                  </div>
                  <div>
                    <span className="block text-neutral-400 font-medium mb-0.5">API Key (Hash)</span>
                    {selectedAuditLog.apiKeyHash && selectedAuditLog.apiKeyHash !== "-" ? (
                      <div className="flex items-center gap-1.5 font-mono text-neutral-700 dark:text-neutral-300">
                        <span className="truncate">{selectedAuditLog.apiKeyHash}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(selectedAuditLog.apiKeyHash!, "API Key Hash copied!")}
                          className="p-0.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                          title="Copy API Key Hash"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-neutral-400 font-mono">-</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Before / After JSON Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <JSONCodeBlock
                  data={selectedAuditLog.action === "Created" ? null : selectedAuditLog.beforeState || null}
                  label="Before"
                  emptyText={selectedAuditLog.action === "Created" ? "This record was newly created." : "N/A"}
                />
                <JSONCodeBlock
                  data={selectedAuditLog.action === "Deleted" ? null : selectedAuditLog.afterState || null}
                  label="After"
                  emptyText={selectedAuditLog.action === "Deleted" ? "Record no longer exists." : "N/A"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
