import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Calendar as CalendarIcon, 
  Download, 
  MoreVertical, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Settings, 
  Plus, 
  Activity, 
  Cpu, 
  Database, 
  HardDrive, 
  Clock, 
  ChevronDown, 
  Check, 
  Info,
  Layers,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Inbox,
  Filter
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { cn } from "./ui/utils";
import { PageHeader } from "./hb/listing/PageHeader";
import { SunburstChartCard, SunburstNode } from "./SunburstChartCard";

// ==========================================
// 1. TYPES & MOCK DATA DEFINITIONS
// ==========================================

export type DashboardState = 'normal' | 'loading' | 'empty' | 'error';

// KPI Metrics Mock Data
const kpis = [
  { id: 'revenue', title: 'Total Revenue', value: '$148,290', change: '+14.2%', trend: 'up', sparkline: [12000, 14000, 11000, 15000, 16000, 14500, 18000], desc: 'vs last month' },
  { id: 'subs', title: 'Active Subscriptions', value: '12,490', change: '+8.4%', trend: 'up', sparkline: [10000, 10500, 11200, 11500, 11900, 12200, 12490], desc: 'vs last week' },
  { id: 'cac', title: 'Customer Acquisition Cost', value: '$42.50', change: '-4.1%', trend: 'down', sparkline: [46, 45, 43, 44, 42.5, 42, 42.5], desc: 'vs last quarter' },
  { id: 'uptime', title: 'Platform Uptime', value: '99.98%', change: '+0.02%', trend: 'up', sparkline: [99.95, 99.96, 99.97, 99.96, 99.99, 99.98, 99.98], desc: '30-day average' },
  { id: 'load', title: 'System Load (CPU)', value: '38.4%', change: '+2.1%', trend: 'up', sparkline: [32, 34, 39, 41, 35, 36, 38.4], desc: 'Average load' },
  { id: 'api_vol', title: 'API Request Volume', value: '8.4M', change: '+18.6%', trend: 'up', sparkline: [6.2, 6.8, 7.1, 7.5, 7.9, 8.1, 8.4], desc: 'Requests daily' },
  { id: 'resp_time', title: 'Average Response Time', value: '124 ms', change: '-12ms', trend: 'down', sparkline: [142, 138, 135, 130, 126, 125, 124], desc: 'Server latency' },
  { id: 'tickets', title: 'Active Support Tickets', value: '142', change: '-8.2%', trend: 'down', sparkline: [175, 168, 160, 155, 150, 145, 142], desc: 'Open tickets' },
];

// Recharts Datasets
const monthlyTrend = [
  { name: 'Jan', revenue: 4000, users: 2400, budget: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398, budget: 2210 },
  { name: 'Mar', revenue: 9800, users: 9800, budget: 2290 },
  { name: 'Apr', revenue: 3908, users: 3908, budget: 2000 },
  { name: 'May', revenue: 4800, users: 4800, budget: 2181 },
  { name: 'Jun', revenue: 3800, users: 3800, budget: 2500 },
  { name: 'Jul', revenue: 4300, users: 4300, budget: 2100 },
  { name: 'Aug', revenue: 8200, users: 5100, budget: 2200 },
  { name: 'Sep', revenue: 9100, users: 6200, budget: 2400 },
  { name: 'Oct', revenue: 10400, users: 7800, budget: 2600 },
  { name: 'Nov', revenue: 12200, users: 8900, budget: 2800 },
  { name: 'Dec', revenue: 14800, users: 12490, budget: 3200 },
];

const regionalSales = [
  { region: 'North America', sales: 64000, target: 70000 },
  { region: 'Europe', sales: 42000, target: 50000 },
  { region: 'Asia Pacific', sales: 28000, target: 30000 },
  { region: 'Latin America', sales: 12000, target: 15000 },
  { region: 'Middle East', sales: 8000, target: 10000 },
];

const trafficSources = [
  { name: 'Direct Traffic', value: 45, color: '#3b82f6' },
  { name: 'Search Engines', value: 30, color: '#10b981' },
  { name: 'Social Networks', value: 15, color: '#f59e0b' },
  { name: 'Email Campaigns', value: 10, color: '#ef4444' },
];

const deviceBreakdown = [
  { name: 'Mobile Users', value: 65, color: '#8b5cf6' },
  { name: 'Desktop Web', value: 28, color: '#3b82f6' },
  { name: 'Tablet Web', value: 7, color: '#ec4899' },
];

const systemPerformance = [
  { time: '00:00', cpu: 22, ram: 48, diskIo: 12 },
  { time: '02:00', cpu: 18, ram: 47, diskIo: 8 },
  { time: '04:00', cpu: 15, ram: 47, diskIo: 5 },
  { time: '06:00', cpu: 25, ram: 50, diskIo: 15 },
  { time: '08:00', cpu: 48, ram: 56, diskIo: 32 },
  { time: '10:00', cpu: 65, ram: 62, diskIo: 45 },
  { time: '12:00', cpu: 74, ram: 65, diskIo: 58 },
  { time: '14:00', cpu: 58, ram: 60, diskIo: 38 },
  { time: '16:00', cpu: 60, ram: 61, diskIo: 40 },
  { time: '18:00', cpu: 52, ram: 59, diskIo: 28 },
  { time: '20:00', cpu: 44, ram: 55, diskIo: 22 },
  { time: '22:00', cpu: 30, ram: 52, diskIo: 14 },
];

// Data Table Mock Rows
const tableRows = [
  { id: 'TXN-9021', customer: 'Phoenix Digital', product: 'Enterprise License', amount: '$4,200', date: '2026-07-08', status: 'completed' },
  { id: 'TXN-9022', customer: 'Aura Studio', product: 'Cloud Plan Annual', amount: '$890', date: '2026-07-08', status: 'completed' },
  { id: 'TXN-9023', customer: 'Apex Corp', product: 'Custom Service SLA', amount: '$12,500', date: '2026-07-07', status: 'pending' },
  { id: 'TXN-9024', customer: 'Vortex Global', product: 'API Pack 10M', amount: '$450', date: '2026-07-07', status: 'completed' },
  { id: 'TXN-9025', customer: 'Nova Labs', product: 'Developer Support Tier', amount: '$150', date: '2026-07-06', status: 'failed' },
  { id: 'TXN-9026', customer: 'Quasar Inc', product: 'Team Seat Upgrade', amount: '$320', date: '2026-07-06', status: 'completed' },
  { id: 'TXN-9027', customer: 'Starlight Retail', product: 'Enterprise License', amount: '$4,200', date: '2026-07-05', status: 'pending' },
];

// Activity Timeline Items
const timelineEvents = [
  { id: 1, title: 'Database Backup Completed', time: '12 minutes ago', type: 'success', detail: 'Automated incremental backup successfully verified on S3 cloud store.' },
  { id: 2, title: 'High Traffic Alert', time: '1 hour ago', type: 'warning', detail: 'API threshold exceeded 8.5K requests/sec on primary load balancing server.' },
  { id: 3, title: 'SSL Certificate Renewal Failure', time: '4 hours ago', type: 'error', detail: 'Domain auth failed for secure.gateway.admin. Please check DNS tokens.' },
  { id: 4, title: 'System Deploy Successful', time: '1 day ago', type: 'info', detail: 'Version v1.14.0 pushed to production cloud node clusters.' },
];

// Hierarchical Budget Data for Sunburst Chart Card
const budgetHierarchyData: SunburstNode = {
  name: "Corporate Spend",
  children: [
    {
      name: "Engineering",
      color: "#3b82f6",
      children: [
        {
          name: "Infrastructure",
          children: [
            { name: "AWS Cloud", value: 150000 },
            { name: "Sentry Core", value: 30000 },
            { name: "Datadog Logs", value: 70000 }
          ]
        },
        {
          name: "Personnel",
          children: [
            { name: "Frontend Devs", value: 100000 },
            { name: "Backend Devs", value: 120000 }
          ]
        },
        {
          name: "Tooling licenses",
          children: [
            { name: "JetBrains Suite", value: 30000 },
            { name: "GitHub Enterprise", value: 50000 }
          ]
        }
      ]
    },
    {
      name: "Marketing",
      color: "#8b5cf6",
      children: [
        {
          name: "Paid Ads",
          children: [
            { name: "Google Search", value: 100000 },
            { name: "LinkedIn Ads", value: 80000 }
          ]
        },
        {
          name: "Sponsorships",
          children: [
            { name: "AWS Re:Invent", value: 60000 },
            { name: "JSConf Global", value: 40000 }
          ]
        },
        {
          name: "Agency & Content",
          children: [
            { name: "SEO Agency", value: 40000 },
            { name: "Copywriting", value: 30000 }
          ]
        }
      ]
    },
    {
      name: "Operations",
      color: "#10b981",
      children: [
        {
          name: "Rentals",
          children: [
            { name: "SF HQ rent", value: 80000 },
            { name: "NY Office rent", value: 40000 }
          ]
        },
        {
          name: "Hardware",
          children: [
            { name: "MacBook Pro M3s", value: 50000 },
            { name: "Internet Grid", value: 30000 }
          ]
        }
      ]
    },
    {
      name: "Sales & Support",
      color: "#f59e0b",
      children: [
        {
          name: "Commissions",
          children: [
            { name: "Enterprise Deals", value: 60000 }
          ]
        },
        {
          name: "Customer Desk",
          children: [
            { name: "Zendesk seats", value: 25000 },
            { name: "AI Bot training", value: 15000 }
          ]
        }
      ]
    }
  ]
};

// ==========================================
// 2. HELPER COMPONENTS & SKELETON LOADERS
// ==========================================

// Lightweight custom Sparkline renderer using inline SVG
function Sparkline({ data, trend }: { data: number[]; trend: string }) {
  const width = 120;
  const height = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min === 0 ? 1 : max - min;
  
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = trend === 'up' 
    ? 'stroke-success-500 dark:stroke-success-400' 
    : 'stroke-error-500 dark:stroke-error-400';

  return (
    <div className="h-9 w-24">
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          className={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
}

// Global Wrapper to support Normal, Loading, Empty, and Error States
interface StateWrapperProps {
  state: DashboardState;
  loadingView?: React.ReactNode;
  emptyView?: React.ReactNode;
  errorView?: React.ReactNode;
  onRetry?: () => void;
  children: React.ReactNode;
}

function StateWrapper({
  state,
  loadingView,
  emptyView,
  errorView,
  onRetry,
  children
}: StateWrapperProps) {
  if (state === 'loading') {
    return <>{loadingView}</>;
  }
  if (state === 'empty') {
    return (
      <>{emptyView || (
        <Card className="min-h-[220px] flex flex-col items-center justify-center text-center p-6 border-dashed border-neutral-300 dark:border-neutral-800">
          <Inbox className="w-10 h-10 text-neutral-400 mb-3 stroke-[1.2]" />
          <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">No Data Available</h4>
          <p className="text-xs text-neutral-500 mt-1 max-w-[260px]">There is no analytics matching this period.</p>
        </Card>
      )}</>
    );
  }
  if (state === 'error') {
    return (
      <>{errorView || (
        <Card className="min-h-[220px] flex flex-col items-center justify-center text-center p-6 border-error-100 dark:border-error-950/20 bg-error-50/10">
          <AlertTriangle className="w-10 h-10 text-error-500 mb-3 stroke-[1.2]" />
          <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Execution Error</h4>
          <p className="text-xs text-neutral-500 mt-1 max-w-[260px] mb-4">Could not load dashboard data logs.</p>
          <Button size="sm" onClick={onRetry} variant="outline" className="border-error-200 text-error-600 hover:bg-error-50 dark:hover:bg-error-950/30">
            Retry Connection
          </Button>
        </Card>
      )}</>
    );
  }
  return <>{children}</>;
}

// Skeleton loaders for KPIs, Charts, Tables
const KpiSkeleton = () => (
  <Card className="p-5 flex flex-col gap-3">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-6 w-6 rounded-md" />
    </div>
    <div className="flex items-end justify-between mt-2">
      <div className="space-y-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-9 w-20" />
    </div>
  </Card>
);

const ChartSkeleton = () => (
  <Card className="p-6 flex flex-col gap-4">
    <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
      <div className="space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
    <div className="h-[280px] w-full flex items-end justify-between gap-3 px-2 pt-6">
      <Skeleton className="h-[40%] w-[8%] rounded-sm" />
      <Skeleton className="h-[65%] w-[8%] rounded-sm" />
      <Skeleton className="h-[30%] w-[8%] rounded-sm" />
      <Skeleton className="h-[85%] w-[8%] rounded-sm" />
      <Skeleton className="h-[50%] w-[8%] rounded-sm" />
      <Skeleton className="h-[75%] w-[8%] rounded-sm" />
      <Skeleton className="h-[60%] w-[8%] rounded-sm" />
      <Skeleton className="h-[90%] w-[8%] rounded-sm" />
    </div>
  </Card>
);

const TableSkeleton = () => (
  <Card className="p-6 flex flex-col gap-4">
    <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-4">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-9 w-48" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  </Card>
);

// ==========================================
// 3. MAIN DASHBOARD PAGE
// ==========================================

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>('normal');
  const [dateRange, setDateRange] = useState('30-days');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Sorting Handler
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Process and Filter Table Rows
  const processedTableData = useMemo(() => {
    let result = [...tableRows];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(row => 
        row.customer.toLowerCase().includes(q) || 
        row.product.toLowerCase().includes(q) || 
        row.id.toLowerCase().includes(q)
      );
    }
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key as keyof typeof a];
        const valB = b[sortConfig.key as keyof typeof b];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [searchQuery, sortConfig]);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => {
      setState('normal');
    }, 1200);
  };

  return (
    <div className="p-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-[100%] mx-auto space-y-6">

        {/* ================= HEADER ACTIONS & STATE MANAGER ================= */}
        <PageHeader
          pageId="dashboard"
          action="list"
          subtitle="Universal analytics component library reference and responsive state demonstration."
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Realtime State Toggler */}
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 px-2">State:</span>
              {(['normal', 'loading', 'empty', 'error'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setState(s)}
                  className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-md transition-all capitalize",
                    state === s
                      ? "bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Date Selectors */}
            <div className="flex items-center gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium rounded-lg px-3 py-2 text-neutral-700 dark:text-neutral-300 outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
              >
                <option value="today">Today</option>
                <option value="7-days">Last 7 Days</option>
                <option value="30-days">Last 30 Days</option>
                <option value="90-days">Last 90 Days</option>
              </select>

              <Button variant="outline" size="sm" className="h-9 text-xs border-neutral-200 dark:border-neutral-800">
                <Download className="w-3.5 h-3.5 mr-2" />
                Export
              </Button>

              <Button size="sm" className="h-9 text-xs bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-500 dark:hover:bg-primary-600" onClick={handleRetry}>
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Sync
              </Button>
            </div>
          </div>
        </PageHeader>

        {/* ================= 8 KPI CARDS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <StateWrapper
              key={kpi.id}
              state={state}
              loadingView={<KpiSkeleton />}
              emptyView={
                <Card className="p-5 flex flex-col justify-center min-h-[116px] border-dashed border-neutral-200 dark:border-neutral-800">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{kpi.title}</div>
                  <div className="text-xs text-neutral-400 mt-2">No tracking records</div>
                </Card>
              }
              errorView={
                <Card className="p-5 flex flex-col justify-center min-h-[116px] border-error-100 bg-error-50/5">
                  <div className="text-[11px] font-bold text-error-500 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Load Error
                  </div>
                  <div className="text-xs text-neutral-500 mt-2">Metric payload failed</div>
                </Card>
              }
            >
              <Card className="p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    {kpi.title}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:scale-105 transition-transform">
                    {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4 text-success-600" /> : <TrendingUp className="w-4 h-4 text-error-500 rotate-90" />}
                  </div>
                </div>

                <div className="flex items-end justify-between mt-4">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                      {kpi.value}
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className={cn(
                        "font-semibold flex items-center",
                        kpi.trend === 'up' ? "text-success-600 dark:text-success-400" : "text-error-600 dark:text-error-400"
                      )}>
                        {kpi.change}
                      </span>
                      <span className="text-neutral-400 font-medium">
                        {kpi.desc}
                      </span>
                    </div>
                  </div>
                  <Sparkline data={kpi.sparkline} trend={kpi.trend} />
                </div>
              </Card>
            </StateWrapper>
          ))}
        </div>

        {/* ================= PRIMARY CHARTS GRID (AREA & LINE) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Area Chart: Monthly Revenue */}
          <StateWrapper state={state} loadingView={<ChartSkeleton />}>
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6 flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">Revenue Distribution</CardTitle>
                  <CardDescription className="text-xs text-neutral-500">Monthly gross billing and cloud software billing metrics.</CardDescription>
                </div>
                <CardAction>
                  <IconButton icon={MoreVertical} size="sm" borderless />
                </CardAction>
              </CardHeader>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e4e4e7' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </StateWrapper>

          {/* Line Chart: Active Subscriptions Trend */}
          <StateWrapper state={state} loadingView={<ChartSkeleton />}>
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6 flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">Active Subscriber Growth</CardTitle>
                  <CardDescription className="text-xs text-neutral-500">Cumulative active subscriptions tracked across cloud hubs.</CardDescription>
                </div>
                <CardAction>
                  <IconButton icon={MoreVertical} size="sm" borderless />
                </CardAction>
              </CardHeader>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e4e4e7' }} />
                    <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </StateWrapper>

        </div>

        {/* ================= SECONDARY CHARTS GRID (BARS & STACKED BARS) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Bar Chart: Sales by Region */}
          <StateWrapper state={state} loadingView={<ChartSkeleton />}>
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6 flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">Sales by Region</CardTitle>
                  <CardDescription className="text-xs text-neutral-500">Regional sales volume against predefined quarterly targets.</CardDescription>
                </div>
              </CardHeader>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalSales} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
                    <XAxis dataKey="region" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e4e4e7' }} />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                    <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </StateWrapper>

          {/* Stacked Bar Chart: Marketing Conversions */}
          <StateWrapper state={state} loadingView={<ChartSkeleton />}>
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6 flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">Marketing Conversions</CardTitle>
                  <CardDescription className="text-xs text-neutral-500">Split marketing performance analytics across core funnels.</CardDescription>
                </div>
              </CardHeader>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend.slice(6)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e4e4e7' }} />
                    <Bar dataKey="revenue" name="Organic" stackId="a" fill="#10b981" barSize={32} />
                    <Bar dataKey="users" name="Referral" stackId="a" fill="#3b82f6" barSize={32} />
                    <Bar dataKey="budget" name="Social" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </StateWrapper>

          {/* Donut Chart: Device Breakdown */}
          <StateWrapper state={state} loadingView={<ChartSkeleton />}>
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
                <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">Device Allocations</CardTitle>
                <CardDescription className="text-xs text-neutral-500">Distribution of browser connections across platform nodes.</CardDescription>
              </CardHeader>
              <div className="h-[180px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {deviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center border-t border-neutral-100 dark:border-neutral-800 pt-4">
                {deviceBreakdown.map((item) => (
                  <div key={item.name} className="space-y-0.5">
                    <div className="text-[10px] text-neutral-400 font-bold uppercase truncate">{item.name}</div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      {item.value}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </StateWrapper>

        </div>

        {/* ================= DETAILED GRAPH GRID (PIE, HORIZONTAL BAR, SYSTEM PERFORMANCE) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Horizontal Bar Chart: Traffic Sources */}
          <StateWrapper state={state} loadingView={<ChartSkeleton />}>
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
                <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">Top Traffic Channels</CardTitle>
                <CardDescription className="text-xs text-neutral-500">Percentage distribution of user acquisition channels.</CardDescription>
              </CardHeader>
              <div className="space-y-4 h-[240px] overflow-y-auto pr-1">
                {trafficSources.map((source) => (
                  <div key={source.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      <span>{source.name}</span>
                      <span>{source.value}%</span>
                    </div>
                    <Progress value={source.value} className="h-2 bg-neutral-100 dark:bg-neutral-800" indicatorClassName="bg-primary-600 dark:bg-primary-500" />
                  </div>
                ))}
              </div>
            </Card>
          </StateWrapper>

          {/* System Performance Multi-line Chart */}
          <StateWrapper state={state} loadingView={<ChartSkeleton />}>
            <Card className="p-6 lg:col-span-2">
              <CardHeader className="px-0 pt-0 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6 flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">Cluster Health Metrics</CardTitle>
                  <CardDescription className="text-xs text-neutral-500">24-hour server load performance tracking nodes.</CardDescription>
                </div>
              </CardHeader>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={systemPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
                    <XAxis dataKey="time" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e4e4e7' }} />
                    <Line type="monotone" dataKey="cpu" name="CPU Load" stroke="#ef4444" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="ram" name="RAM Usage" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="diskIo" name="Disk I/O" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </StateWrapper>

        </div>

        {/* ================= SUNBURST HIERARCHICAL ANALYTICS CARD ================= */}
        <SunburstChartCard
          title="Hierarchical Spend Distribution"
          description="Interactive enterprise budget allocations drill-down and segment share analysis."
          data={budgetHierarchyData}
          state={state}
          onRefresh={handleRetry}
        />

        {/* ================= DATA TABLE WITH SEARCH & SORT ================= */}
        <StateWrapper state={state} loadingView={<TableSkeleton />}>
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6 flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">Audit Transactions Ledger</CardTitle>
                <CardDescription className="text-xs text-neutral-500">Real-time status tracking ledger of platform licensing fees.</CardDescription>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transactions..."
                    className="w-full pl-9 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary-500 text-neutral-800 dark:text-neutral-200"
                  />
                </div>
                <Button variant="outline" size="sm" className="h-9 text-xs border-neutral-200 dark:border-neutral-800">
                  <Filter className="w-3.5 h-3.5 mr-2 text-neutral-400" />
                  Filters
                </Button>
              </div>
            </CardHeader>

            <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold select-none">
                    <th className="px-4 py-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" onClick={() => handleSort('id')}>
                      ID {sortConfig?.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" onClick={() => handleSort('customer')}>
                      Client {sortConfig?.key === 'customer' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" onClick={() => handleSort('product')}>
                      Product {sortConfig?.key === 'product' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" onClick={() => handleSort('amount')}>
                      Amount {sortConfig?.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" onClick={() => handleSort('date')}>
                      Date {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" onClick={() => handleSort('status')}>
                      Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900">
                  {processedTableData.length > 0 ? (
                    processedTableData.map((row) => (
                      <tr key={row.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-neutral-600 dark:text-neutral-400">{row.id}</td>
                        <td className="px-4 py-3 font-semibold">{row.customer}</td>
                        <td className="px-4 py-3 text-neutral-500">{row.product}</td>
                        <td className="px-4 py-3 font-bold">{row.amount}</td>
                        <td className="px-4 py-3 text-neutral-500">{row.date}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase",
                            row.status === 'completed' 
                              ? 'bg-success-50/55 border-success-200 text-success-700 dark:bg-success-950/20 dark:border-success-800 dark:text-success-400'
                              : row.status === 'pending'
                              ? 'bg-warning-50/55 border-warning-200 text-warning-700 dark:bg-warning-950/20 dark:border-warning-800 dark:text-warning-400'
                              : 'bg-error-50/55 border-error-200 text-error-700 dark:bg-error-950/20 dark:border-error-800 dark:text-error-400'
                          )}>
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              row.status === 'completed' ? 'bg-success-500' : row.status === 'pending' ? 'bg-warning-500' : 'bg-error-500'
                            )}></span>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                        No transactions match your search filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </StateWrapper>

        {/* ================= SYSTEM TIMELINES, NOTIFICATIONS, & WIDGETS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Activity Timeline */}
          <StateWrapper state={state} loadingView={<ChartSkeleton />}>
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
                <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">Audit Security Timeline</CardTitle>
                <CardDescription className="text-xs text-neutral-500">Vertical operational audit events cluster ledger.</CardDescription>
              </CardHeader>
              <div className="relative pl-6 border-l-2 border-neutral-200 dark:border-neutral-800 space-y-6 max-h-[300px] overflow-y-auto pr-1">
                {timelineEvents.map((event) => (
                  <div key={event.id} className="relative group">
                    {/* Node Dot */}
                    <div className={cn(
                      "absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white dark:border-neutral-950 transition-transform group-hover:scale-110",
                      event.type === 'success' ? 'bg-success-500' :
                      event.type === 'warning' ? 'bg-warning-500' :
                      event.type === 'error' ? 'bg-error-500' : 'bg-primary-500'
                    )}></div>
                    {/* Event Description */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{event.title}</span>
                        <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed font-light">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </StateWrapper>

          {/* Quick Actions Panel */}
          <StateWrapper state={state} loadingView={<ChartSkeleton />}>
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
                <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">Quick Infrastructure Actions</CardTitle>
                <CardDescription className="text-xs text-neutral-500">Launch standard database and networking tasks.</CardDescription>
              </CardHeader>
              <div className="grid grid-cols-2 gap-3 h-[200px]">
                <button className="flex flex-col items-center justify-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-primary-400 dark:hover:border-primary-600 transition-all text-neutral-700 dark:text-neutral-300 gap-2">
                  <Database className="w-6 h-6 text-primary-500" />
                  <span className="text-xs font-semibold">Backup Database</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-primary-400 dark:hover:border-primary-600 transition-all text-neutral-700 dark:text-neutral-300 gap-2">
                  <Cpu className="w-6 h-6 text-success-500" />
                  <span className="text-xs font-semibold">Optimise CPU</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-primary-400 dark:hover:border-primary-600 transition-all text-neutral-700 dark:text-neutral-300 gap-2">
                  <Settings className="w-6 h-6 text-warning-500" />
                  <span className="text-xs font-semibold">Verify SSL SLA</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-primary-400 dark:hover:border-primary-600 transition-all text-neutral-700 dark:text-neutral-300 gap-2">
                  <Plus className="w-6 h-6 text-error-500" />
                  <span className="text-xs font-semibold">Deploy Cluster</span>
                </button>
              </div>
              <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg flex items-start gap-2.5 border border-neutral-100 dark:border-neutral-850">
                <Info className="w-4 h-4 text-neutral-450 mt-0.5" />
                <span className="text-[11px] text-neutral-500 leading-normal">Operational triggers automatically document audit statements to S3 logs.</span>
              </div>
            </Card>
          </StateWrapper>

          {/* System Health Monitoring Card */}
          <StateWrapper state={state} loadingView={<ChartSkeleton />}>
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
                <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">Active System Health</CardTitle>
                <CardDescription className="text-xs text-neutral-500">Live operational resource allocation meters.</CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                      <Cpu className="w-3.5 h-3.5 text-neutral-400" /> Primary CPU Load
                    </span>
                    <span className="font-bold">42%</span>
                  </div>
                  <Progress value={42} className="h-1.5 bg-neutral-150 dark:bg-neutral-800" indicatorClassName="bg-success-500" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                      <HardDrive className="w-3.5 h-3.5 text-neutral-400" /> Memory Buffer
                    </span>
                    <span className="font-bold">68%</span>
                  </div>
                  <Progress value={68} className="h-1.5 bg-neutral-150 dark:bg-neutral-800" indicatorClassName="bg-warning-500" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                      <Database className="w-3.5 h-3.5 text-neutral-400" /> SSD Database Allocation
                    </span>
                    <span className="font-bold">89%</span>
                  </div>
                  <Progress value={89} className="h-1.5 bg-neutral-150 dark:bg-neutral-800" indicatorClassName="bg-error-500" />
                </div>
              </div>
              <div className="mt-6 border-t border-neutral-150 dark:border-neutral-800 pt-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-success-500 animate-pulse"></div>
                  <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">All services operational</span>
                </div>
                <Badge className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 border-none font-bold text-[9px] uppercase px-2 py-0.5">SLA verified</Badge>
              </div>
            </Card>
          </StateWrapper>

        </div>

      </div>
    </div>
  );
}

// ==========================================
// 4. MICRO INTERNAL COMPONENTS
// ==========================================

function IconButton({ 
  icon: Icon, 
  title, 
  onClick, 
  borderless = false,
  size = "md"
}: { 
  icon: any; 
  title?: string; 
  onClick?: () => void; 
  borderless?: boolean;
  size?: "sm" | "md"
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex items-center justify-center rounded-lg transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800",
        size === "sm" ? "w-7 h-7" : "w-9 h-9",
        borderless ? "" : "border border-neutral-200 dark:border-neutral-800"
      )}
    >
      <Icon className={size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5"} />
    </button>
  );
}
