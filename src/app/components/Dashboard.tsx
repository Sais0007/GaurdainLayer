import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  RefreshCw, 
  Search, 
  Calendar, 
  Building2, 
  Users, 
  Key, 
  Box, 
  Filter, 
  MoreVertical, 
  Inbox, 
  Table, 
  BarChart2, 
  PieChart as PieChartIcon,
  ArrowUpDown,
  Sparkles,
  Globe,
  ChevronDown,
  ChevronUp,
  Layers
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
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
import { cn } from "./ui/utils";
import { PageHeader } from "./hb/listing/PageHeader";
import { DashboardGlobalHeader } from "./dashboard/DashboardGlobalHeader";
import { DashboardControlBar } from "./dashboard/DashboardControlBar";
import { DashboardTabsBar } from "./dashboard/DashboardTabsBar";
import { DashboardFilterBar } from "./dashboard/DashboardFilterBar";
import { FinancialHealthOverview } from "./dashboard/FinancialHealthOverview";
import { OperationalHealthOverview } from "./dashboard/OperationalHealthOverview";
import { BudgetBurnForecastChart } from "./dashboard/BudgetBurnForecastChart";
import { SpendBreakdownTable } from "./dashboard/SpendBreakdownTable";
import { HourlySpendGridHeatmap } from "./dashboard/HourlySpendGridHeatmap";
import { InsightCardsGrid } from "./dashboard/InsightCardsGrid";
import { DashboardSkeleton } from "./dashboard/DashboardSkeleton";
import { DashboardEmptyState } from "./dashboard/DashboardEmptyState";
import { DashboardErrorState } from "./dashboard/DashboardErrorState";
import { SpendBudgetDashboard } from "./dashboard/spend-budget/SpendBudgetDashboard";
import { TokensDashboard } from "./dashboard/tokens/TokensDashboard";
import { RequestsDashboard } from "./dashboard/requests/RequestsDashboard";
import { ReliabilityDashboard } from "./dashboard/reliability/ReliabilityDashboard";
import { CapacityDashboard } from "./dashboard/capacity/CapacityDashboard";
import { 
  DashboardFilterState, 
  DashboardTabType, 
  mockFinancialKpis, 
  mockOperationalKpis 
} from "./dashboard/dashboardData";

// ==========================================
// 1. TYPES & DATA DEFINITIONS
// ==========================================

export type DashboardState = 'normal' | 'loading' | 'empty' | 'error';
export type DashboardTab = 'dashboard' | 'model-activity' | 'virtual-key-activity';
export type ViewMode = 'table' | 'chart';

// KPI Cards Data (Cost Analytics Tab)
const kpiData = [
  {
    id: 'total_spend',
    title: 'Total Spend (USD)',
    value: '$1,248.50',
    change: '+14.2%',
    trend: 'up' as const,
    comparison: 'vs prev period',
    sparkline: [120, 140, 180, 210, 310, 280, 350, 420, 480],
    icon: DollarSign,
    color: 'text-primary-600 dark:text-primary-400',
    bg: 'bg-primary-50 dark:bg-primary-950/50 border-primary-100 dark:border-primary-900/30',
    helperText: 'Total organization API cost accrued'
  },
  {
    id: 'total_requests',
    title: 'Total Requests',
    value: '842,190',
    change: '+8.4%',
    trend: 'up' as const,
    comparison: 'vs prev period',
    sparkline: [62000, 68000, 71000, 75000, 79000, 81000, 84000, 89000, 95000],
    icon: Activity,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-100 dark:border-indigo-900/30',
    helperText: 'Total API gateway call volume'
  },
  {
    id: 'successful_requests',
    title: 'Successful Requests',
    value: '834,102',
    change: '+8.5%',
    trend: 'up' as const,
    comparison: 'vs prev period',
    sparkline: [61000, 67000, 70000, 74000, 78000, 80000, 83000, 88000, 94000],
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-100 dark:border-emerald-900/30',
    helperText: '99.04% completion rate'
  },
  {
    id: 'failed_requests',
    title: 'Failed Requests',
    value: '8,088',
    change: '-14.1%',
    trend: 'down' as const,
    comparison: 'vs prev period',
    sparkline: [1200, 1100, 1000, 950, 900, 850, 820, 790, 750],
    icon: AlertTriangle,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-100 dark:border-rose-900/30',
    helperText: '0.96% failure rate (4xx/5xx)'
  },
  {
    id: 'total_tokens',
    title: 'Total Tokens',
    value: '142.8M',
    change: '+19.3%',
    trend: 'up' as const,
    comparison: 'vs prev period',
    sparkline: [10, 12, 11, 14, 16, 15, 18, 20, 22],
    icon: Cpu,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/50 border-violet-100 dark:border-violet-900/30',
    helperText: 'Prompt & completion token total'
  }
];

// MODEL & VIRTUAL KEY ACTIVITY - Overall KPI Cards (4 Cards)
const modelOverallKpis = [
  {
    id: 'ma_total_requests',
    title: 'Total Requests',
    value: '842,190',
    change: '+8.4%',
    trend: 'up' as const,
    comparison: 'vs prev period',
    sparkline: [62000, 68000, 71000, 75000, 79000, 81000, 84000, 89000, 95000],
    icon: Activity,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-100 dark:border-indigo-900/30',
    helperText: 'Total API gateway calls'
  },
  {
    id: 'ma_successful_requests',
    title: 'Total Successful Requests',
    value: '834,102',
    change: '99.04%',
    trend: 'up' as const,
    comparison: 'success rate',
    sparkline: [61000, 67000, 70000, 74000, 78000, 80000, 83000, 88000, 94000],
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-100 dark:border-emerald-900/30',
    helperText: 'Successfully resolved API executions'
  },
  {
    id: 'ma_total_tokens',
    title: 'Total Tokens',
    value: '142.8M',
    change: '169 avg',
    trend: 'up' as const,
    comparison: 'tokens / request',
    sparkline: [10, 12, 11, 14, 16, 15, 18, 20, 22],
    icon: Cpu,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/50 border-violet-100 dark:border-violet-900/30',
    helperText: 'Prompt & completion token total'
  },
  {
    id: 'ma_total_spend',
    title: 'Total Spend (USD)',
    value: '$1,248.50',
    change: '$0.0015 avg',
    trend: 'up' as const,
    comparison: 'spend / request',
    sparkline: [120, 140, 180, 210, 310, 280, 350, 420, 480],
    icon: DollarSign,
    color: 'text-primary-600 dark:text-primary-400',
    bg: 'bg-primary-50 dark:bg-primary-950/50 border-primary-100 dark:border-primary-900/30',
    helperText: 'Total organization AI expenditure'
  }
];

// MODEL & VIRTUAL KEY ACTIVITY - Overview Chart Data: Tokens Over Time (Input, Output, Total)
const modelOverviewTokensData = [
  { date: 'Jul 27', inputTokens: 1.8, outputTokens: 2.3, totalTokens: 4.1 },
  { date: 'Jul 28', inputTokens: 2.2, outputTokens: 3.0, totalTokens: 5.2 },
  { date: 'Jul 29', inputTokens: 2.0, outputTokens: 2.8, totalTokens: 4.8 },
  { date: 'Jul 30', inputTokens: 3.1, outputTokens: 3.8, totalTokens: 6.9 },
  { date: 'Jul 31', inputTokens: 3.5, outputTokens: 4.3, totalTokens: 7.8 },
  { date: 'Aug 01', inputTokens: 2.6, outputTokens: 3.5, totalTokens: 6.1 },
  { date: 'Aug 02', inputTokens: 3.9, outputTokens: 5.0, totalTokens: 8.9 },
  { date: 'Aug 03', inputTokens: 4.6, outputTokens: 5.8, totalTokens: 10.4 },
];

// MODEL & VIRTUAL KEY ACTIVITY - Overview Chart Data: Requests Over Time (Successful, Failed)
const modelOverviewRequestsData = [
  { date: 'Jul 27', successful: 24200, failed: 300, total: 24500 },
  { date: 'Jul 28', successful: 29500, failed: 300, total: 29800 },
  { date: 'Jul 29', successful: 27100, failed: 300, total: 27400 },
  { date: 'Jul 30', successful: 38500, failed: 400, total: 38900 },
  { date: 'Jul 31', successful: 41600, failed: 500, total: 42100 },
  { date: 'Aug 01', successful: 33900, failed: 300, total: 34200 },
  { date: 'Aug 02', successful: 49200, failed: 600, total: 49800 },
  { date: 'Aug 03', successful: 57600, failed: 600, total: 58200 },
];

// DEPLOYED MODELS LIST (Model Activity Tab)
const deployedModels = [
  {
    id: 'gpt-4o-mini',
    name: 'gpt-4o-mini',
    provider: 'OpenAI',
    providerColor: '#00A67E',
    spend: 112.80,
    requests: 145000,
    successfulRequests: 143200,
    failedRequests: 1800,
    tokens: '18.9M',
    avgTokensPerSuccess: 132,
    avgSpendPerSuccess: 0.00078,
    virtualKeys: [
      { alias: 'CRM Automations Key', requests: 75000, tokens: '9.8M', spend: 58.40 },
      { alias: 'Support Desk Bot Key', requests: 41190, tokens: '5.2M', spend: 32.10 },
      { alias: 'Production API Gateway', requests: 28810, tokens: '3.9M', spend: 22.30 },
    ],
    spendPerDay: [
      { date: 'Jul 27', spend: 11.20, requests: 14200, tokens: 1.8 },
      { date: 'Jul 28', spend: 13.80, requests: 17800, tokens: 2.3 },
      { date: 'Jul 29', spend: 12.40, requests: 15900, tokens: 2.1 },
      { date: 'Jul 30', spend: 16.50, requests: 21100, tokens: 2.8 },
      { date: 'Jul 31', spend: 18.20, requests: 23400, tokens: 3.1 },
      { date: 'Aug 01', spend: 14.10, requests: 18200, tokens: 2.4 },
      { date: 'Aug 02', spend: 21.30, requests: 27400, tokens: 3.6 },
      { date: 'Aug 03', spend: 25.30, requests: 32600, tokens: 4.2 },
    ]
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'claude-3-5-sonnet',
    provider: 'Anthropic',
    providerColor: '#D97706',
    spend: 384.50,
    requests: 280000,
    successfulRequests: 277900,
    failedRequests: 2100,
    tokens: '44.2M',
    avgTokensPerSuccess: 159,
    avgSpendPerSuccess: 0.00138,
    virtualKeys: [
      { alias: 'Production API Gateway', requests: 180000, tokens: '28.4M', spend: 247.20 },
      { alias: 'Staging Integration Key', requests: 65000, tokens: '10.2M', spend: 89.30 },
      { alias: 'R&D Sandbox Key', requests: 35000, tokens: '5.6M', spend: 48.00 },
    ],
    spendPerDay: [
      { date: 'Jul 27', spend: 38.40, requests: 28000, tokens: 4.4 },
      { date: 'Jul 28', spend: 44.20, requests: 32100, tokens: 5.1 },
      { date: 'Jul 29', spend: 41.00, requests: 29800, tokens: 4.7 },
      { date: 'Jul 30', spend: 52.80, requests: 38400, tokens: 6.1 },
      { date: 'Jul 31', spend: 58.10, requests: 42300, tokens: 6.7 },
      { date: 'Aug 01', spend: 46.50, requests: 33900, tokens: 5.3 },
      { date: 'Aug 02', spend: 64.20, requests: 46800, tokens: 7.4 },
      { date: 'Aug 03', spend: 79.30, requests: 57700, tokens: 9.1 },
    ]
  },
  {
    id: 'gemini-1-5-pro',
    name: 'gemini-1.5-pro',
    provider: 'Google Gemini',
    providerColor: '#4285F4',
    spend: 76.40,
    requests: 52000,
    successfulRequests: 51320,
    failedRequests: 680,
    tokens: '8.1M',
    avgTokensPerSuccess: 157,
    avgSpendPerSuccess: 0.00148,
    virtualKeys: [
      { alias: 'Staging Integration Key', requests: 32000, tokens: '5.0M', spend: 46.80 },
      { alias: 'R&D Sandbox Key', requests: 20000, tokens: '3.1M', spend: 29.60 },
    ],
    spendPerDay: [
      { date: 'Jul 27', spend: 7.20, requests: 4900, tokens: 0.8 },
      { date: 'Jul 28', spend: 8.90, requests: 6100, tokens: 1.0 },
      { date: 'Jul 29', spend: 8.10, requests: 5500, tokens: 0.9 },
      { date: 'Jul 30', spend: 10.40, requests: 7100, tokens: 1.1 },
      { date: 'Jul 31', spend: 11.80, requests: 8000, tokens: 1.3 },
      { date: 'Aug 01', spend: 9.30, requests: 6300, tokens: 1.0 },
      { date: 'Aug 02', spend: 12.60, requests: 8600, tokens: 1.4 },
      { date: 'Aug 03', spend: 15.10, requests: 10300, tokens: 1.6 },
    ]
  }
];

// VIRTUAL KEYS LIST (Virtual Key Activity Tab)
const virtualKeysList = [
  {
    id: 'vk-prod-gateway',
    hash: 'key-hash-85eff432eaad218390b14',
    alias: 'Production API Gateway',
    teamId: 'team_id: Core Engineering',
    spend: 512.60,
    requests: 380000,
    successfulRequests: 376200,
    failedRequests: 3800,
    tokens: '61.2M',
    avgTokensPerSuccess: 161,
    avgSpendPerSuccess: 0.00136,
    modelsUsage: [
      { model: 'gpt-4o', provider: 'OpenAI', spend: 312.40, requests: 210000, successfulRequests: 208100, failedRequests: 1900, tokens: '36.8M' },
      { model: 'claude-3-5-sonnet', provider: 'Anthropic', spend: 142.80, requests: 110000, successfulRequests: 108900, failedRequests: 1100, tokens: '18.4M' },
      { model: 'gpt-4o-mini', provider: 'OpenAI', spend: 57.40, requests: 60000, successfulRequests: 59200, failedRequests: 800, tokens: '6.0M' }
    ],
    spendPerDay: [
      { date: 'Jul 27', spend: 51.20, requests: 38000, tokens: 6.1, success: 37600, failed: 400 },
      { date: 'Jul 28', spend: 58.90, requests: 43600, tokens: 7.0, success: 43100, failed: 500 },
      { date: 'Jul 29', spend: 54.80, requests: 40600, tokens: 6.5, success: 40200, failed: 400 },
      { date: 'Jul 30', spend: 71.40, requests: 52900, tokens: 8.5, success: 52300, failed: 600 },
      { date: 'Jul 31', spend: 78.60, requests: 58200, tokens: 9.3, success: 57600, failed: 600 },
      { date: 'Aug 01', spend: 62.30, requests: 46100, tokens: 7.4, success: 45600, failed: 500 },
      { date: 'Aug 02', spend: 86.10, requests: 63800, tokens: 10.2, success: 63100, failed: 700 },
      { date: 'Aug 03', spend: 106.50, requests: 78800, tokens: 12.6, success: 77900, failed: 900 }
    ]
  },
  {
    id: 'vk-staging-key',
    hash: 'key-hash-48102bcf921a88310c812',
    alias: 'Staging Integration Key',
    teamId: 'team_id: Product AI & Design',
    spend: 284.10,
    requests: 195000,
    successfulRequests: 193100,
    failedRequests: 1900,
    tokens: '32.4M',
    avgTokensPerSuccess: 166,
    avgSpendPerSuccess: 0.00147,
    modelsUsage: [
      { model: 'claude-3-5-sonnet', provider: 'Anthropic', spend: 184.50, requests: 125000, successfulRequests: 123800, failedRequests: 1200, tokens: '20.8M' },
      { model: 'gemini-1.5-pro', provider: 'Google Gemini', spend: 62.80, requests: 42000, successfulRequests: 41500, failedRequests: 500, tokens: '7.1M' },
      { model: 'gpt-4o-mini', provider: 'OpenAI', spend: 36.80, requests: 28000, successfulRequests: 27800, failedRequests: 200, tokens: '4.5M' }
    ],
    spendPerDay: [
      { date: 'Jul 27', spend: 28.40, requests: 19500, tokens: 3.2, success: 19300, failed: 200 },
      { date: 'Jul 28', spend: 32.60, requests: 22400, tokens: 3.7, success: 22200, failed: 200 },
      { date: 'Jul 29', spend: 30.10, requests: 20700, tokens: 3.4, success: 20500, failed: 200 },
      { date: 'Jul 30', spend: 39.50, requests: 27100, tokens: 4.5, success: 26800, failed: 300 },
      { date: 'Jul 31', spend: 43.80, requests: 30100, tokens: 5.0, success: 29800, failed: 300 },
      { date: 'Aug 01', spend: 34.60, requests: 23700, tokens: 3.9, success: 23500, failed: 200 },
      { date: 'Aug 02', spend: 47.90, requests: 32900, tokens: 5.4, success: 32500, failed: 400 },
      { date: 'Aug 03', spend: 59.10, requests: 40600, tokens: 6.7, success: 40100, failed: 500 }
    ]
  },
  {
    id: 'vk-crm-automations',
    hash: 'key-hash-77291aeb0391482099d42',
    alias: 'CRM Automations Key',
    teamId: 'team_id: Customer Success Bot',
    spend: 198.40,
    requests: 142000,
    successfulRequests: 140600,
    failedRequests: 1400,
    tokens: '22.8M',
    avgTokensPerSuccess: 161,
    avgSpendPerSuccess: 0.00141,
    modelsUsage: [
      { model: 'gpt-4o-mini', provider: 'OpenAI', spend: 112.80, requests: 85000, successfulRequests: 84200, failedRequests: 800, tokens: '13.2M' },
      { model: 'text-embedding-3-small', provider: 'OpenAI', spend: 85.60, requests: 57000, successfulRequests: 56400, failedRequests: 600, tokens: '9.6M' }
    ],
    spendPerDay: [
      { date: 'Jul 27', spend: 19.80, requests: 14200, tokens: 2.3, success: 14000, failed: 200 },
      { date: 'Jul 28', spend: 22.80, requests: 16300, tokens: 2.6, success: 16100, failed: 200 },
      { date: 'Jul 29', spend: 21.00, requests: 15000, tokens: 2.4, success: 14800, failed: 200 },
      { date: 'Jul 30', spend: 27.60, requests: 19800, tokens: 3.2, success: 19600, failed: 200 },
      { date: 'Jul 31', spend: 30.50, requests: 21900, tokens: 3.5, success: 21700, failed: 200 },
      { date: 'Aug 01', spend: 24.10, requests: 17300, tokens: 2.8, success: 17100, failed: 200 },
      { date: 'Aug 02', spend: 33.40, requests: 23900, tokens: 3.8, success: 23600, failed: 300 },
      { date: 'Aug 03', spend: 41.20, requests: 29500, tokens: 4.7, success: 29100, failed: 400 }
    ]
  }
];

// Daily Spend Trend Data (Cost Analytics Tab)
const spendTrendData = [
  { date: 'Jul 27', spend: 32.40, requests: 24500, tokens: 4.1, success: 24200, failed: 300 },
  { date: 'Jul 28', spend: 41.80, requests: 29800, tokens: 5.2, success: 29500, failed: 300 },
  { date: 'Jul 29', spend: 38.20, requests: 27400, tokens: 4.8, success: 27100, failed: 300 },
  { date: 'Jul 30', spend: 55.60, requests: 38900, tokens: 6.9, success: 38500, failed: 400 },
  { date: 'Jul 31', spend: 62.10, requests: 42100, tokens: 7.8, success: 41600, failed: 500 },
  { date: 'Aug 01', spend: 48.90, requests: 34200, tokens: 6.1, success: 33900, failed: 300 },
  { date: 'Aug 02', spend: 71.30, requests: 49800, tokens: 8.9, success: 49200, failed: 600 },
  { date: 'Aug 03', spend: 84.50, requests: 58200, tokens: 10.4, success: 57600, failed: 600 },
];

// Top Teams Data
const teamsData = [
  { id: 1, name: 'Core Engineering', spend: 482.40, requests: 312000, failedRequests: 2100, tokens: '54.2M' },
  { id: 2, name: 'Product AI & Design', spend: 318.90, requests: 214000, failedRequests: 1800, tokens: '38.6M' },
  { id: 3, name: 'Customer Success Bot', spend: 215.10, requests: 185000, failedRequests: 2400, tokens: '26.1M' },
  { id: 4, name: 'Data Science R&D', spend: 142.80, requests: 84000, failedRequests: 1200, tokens: '15.4M' },
  { id: 5, name: 'Marketing Automation', spend: 89.30, requests: 47190, failedRequests: 588, tokens: '8.5M' },
];

// Top Members Data
const membersData = [
  { id: 1, name: 'Alex Rivera', team: 'Core Engineering', spend: 184.20, requests: 124000, tokens: '21.4M', successRate: '99.4%' },
  { id: 2, name: 'Sophia Chen', team: 'Product AI & Design', spend: 156.80, requests: 98000, tokens: '18.1M', successRate: '99.1%' },
  { id: 3, name: 'Marcus Vance', team: 'Data Science R&D', spend: 128.40, requests: 76000, tokens: '14.8M', successRate: '98.8%' },
  { id: 4, name: 'Emily Watson', team: 'Customer Success', spend: 94.10, requests: 68000, tokens: '11.2M', successRate: '99.6%' },
  { id: 5, name: 'David Kim', team: 'Core Engineering', spend: 78.50, requests: 52000, tokens: '9.4M', successRate: '99.2%' },
];

// Top Virtual Keys Data
const virtualKeysData = [
  { id: 1, alias: 'Production API Gateway', keyId: 'vk_live_94821', spend: 512.60, requests: 380000, tokens: '61.2M' },
  { id: 2, alias: 'Staging Integration Key', keyId: 'vk_stg_48102', spend: 284.10, requests: 195000, tokens: '32.4M' },
  { id: 3, alias: 'CRM Automations Key', keyId: 'vk_crm_77291', spend: 198.40, requests: 142000, tokens: '22.8M' },
  { id: 4, alias: 'R&D Sandbox Key', keyId: 'vk_dev_11093', spend: 142.30, requests: 84000, tokens: '16.5M' },
  { id: 5, alias: 'Support Desk Bot Key', keyId: 'vk_bot_33918', spend: 111.10, requests: 41190, tokens: '9.9M' },
];

// Top Models Data
const modelsData = [
  { id: 1, model: 'gpt-4o', provider: 'OpenAI', spend: 642.10, requests: 340000, failedRequests: 3200, tokens: '68.4M' },
  { id: 2, model: 'claude-3-5-sonnet', provider: 'Anthropic', spend: 384.50, requests: 280000, failedRequests: 2100, tokens: '44.2M' },
  { id: 3, model: 'gpt-4o-mini', provider: 'OpenAI', spend: 112.80, requests: 145000, failedRequests: 1800, tokens: '18.9M' },
  { id: 4, model: 'gemini-1.5-pro', provider: 'Google Gemini', spend: 76.40, requests: 52000, failedRequests: 680, tokens: '8.1M' },
  { id: 5, model: 'text-embedding-3-small', provider: 'OpenAI', spend: 32.70, requests: 25190, failedRequests: 308, tokens: '3.2M' },
];

// Provider Usage Data
const providerUsageData = [
  { name: 'OpenAI', spend: 787.60, tokens: '90.5M', requests: 510190, color: '#00A67E', percent: 63.1 },
  { name: 'Anthropic', spend: 384.50, tokens: '44.2M', requests: 280000, color: '#D97706', percent: 30.8 },
  { name: 'Google Gemini', spend: 76.40, tokens: '8.1M', requests: 52000, color: '#4285F4', percent: 6.1 },
];

// ==========================================
// 2. HELPER COMPONENTS
// ==========================================

// Refined SVG Sparkline renderer
function Sparkline({ data, trend }: { data: number[]; trend: 'up' | 'down' }) {
  const width = 90;
  const height = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min === 0 ? 1 : max - min;
  
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = trend === 'up' ? '#10b981' : '#f43f5e';

  return (
    <div className="h-7 w-20 flex-shrink-0">
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
}

// Custom Spend Trend Tooltip
function SpendTrendTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 shadow-xl text-xs space-y-2 min-w-[200px]">
        <div className="font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-1.5 flex justify-between items-center">
          <span>{data.date}</span>
          <Badge variant="outline" className="text-[10px] font-medium border-primary-200 text-primary-700 dark:text-primary-400">
            Cost Breakdown
          </Badge>
        </div>
        <div className="space-y-1 pt-0.5">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-medium">Total Spend:</span>
            <span className="font-bold text-neutral-900 dark:text-white text-sm">${data.spend.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Total Requests:</span>
            <span className="font-medium text-neutral-800 dark:text-neutral-200">{data.requests.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center font-medium text-emerald-600">
            <span>Successful:</span>
            <span>{data.success ? data.success.toLocaleString() : (data.requests * 0.99).toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center font-medium text-rose-600">
            <span>Failed:</span>
            <span>{data.failed ? data.failed.toLocaleString() : (data.requests * 0.01).toFixed(0)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// Custom Widget Section Component with Table / Chart view switcher in Card Header Top Right
interface AnalyticsWidgetProps {
  title: string;
  subtitle?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  children: React.ReactNode;
  chartView: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  hasSearch?: boolean;
  state: DashboardState;
}

function AnalyticsWidget({
  title,
  subtitle,
  viewMode,
  onViewModeChange,
  children,
  chartView,
  searchQuery = '',
  onSearchChange,
  hasSearch = false,
  state
}: AnalyticsWidgetProps) {
  return (
    <Card className="border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
        <div>
          <CardTitle className="text-sm font-bold text-neutral-900 dark:text-white">
            {title}
          </CardTitle>
          {subtitle && (
            <CardDescription className="text-xs text-neutral-500 mt-0.5">
              {subtitle}
            </CardDescription>
          )}
        </div>

        {/* Action Controls placed strictly in Top Right via CardAction */}
        <CardAction className="flex items-center gap-2">
          {hasSearch && onSearchChange && viewMode === 'table' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-primary-500 w-28 sm:w-36"
              />
            </div>
          )}

          {/* Table / Chart Toggle Button Group */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => onViewModeChange('table')}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                viewMode === 'table'
                  ? "bg-white dark:bg-neutral-900 shadow-xs text-primary-600 dark:text-primary-400"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
              )}
            >
              <Table className="w-3.5 h-3.5" />
              Table View
            </button>
            <button
              onClick={() => onViewModeChange('chart')}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                viewMode === 'chart'
                  ? "bg-white dark:bg-neutral-900 shadow-xs text-primary-600 dark:text-primary-400"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
              )}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Chart View
            </button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-4">
        {state === 'loading' ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : state === 'empty' ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <Inbox className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mb-2 stroke-[1.5]" />
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">No spend data available</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Adjust filters or wait for new API execution events.</p>
          </div>
        ) : viewMode === 'table' ? (
          children
        ) : (
          chartView
        )}
      </CardContent>
    </Card>
  );
}

// Skeleton Loader Component for KPI Cards
function KpiSkeleton() {
  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
      <div className="flex items-end justify-between mt-2">
        <div className="space-y-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-7 w-16" />
      </div>
    </Card>
  );
}

// Model Accordion Component inside Model Activity tab
function ModelAccordionCard({ model, isExpanded, onToggle, state }: { model: typeof deployedModels[0]; isExpanded: boolean; onToggle: () => void; state: DashboardState }) {
  const [virtualKeysView, setVirtualKeysView] = useState<ViewMode>('table');
  const [vkSearch, setVkSearch] = useState('');
  const [vkSort, setVkSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'spend', dir: 'desc' });

  const filteredVk = useMemo(() => {
    let res = model.virtualKeys.filter(vk => vk.alias.toLowerCase().includes(vkSearch.toLowerCase()));
    res.sort((a: any, b: any) => {
      const valA = a[vkSort.key];
      const valB = b[vkSort.key];
      if (valA < valB) return vkSort.dir === 'asc' ? -1 : 1;
      if (valA > valB) return vkSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return res;
  }, [model.virtualKeys, vkSearch, vkSort]);

  return (
    <Card className="border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-all duration-200">
      {/* Accordion Header */}
      <div 
        onClick={onToggle}
        className="p-4 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer flex items-center justify-between transition-colors border-b border-neutral-100 dark:border-neutral-800/60"
      >
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white">{model.name}</span>
            <Badge variant="outline" className="text-[10px] font-semibold py-0 px-2 border-neutral-200 dark:border-neutral-700" style={{ color: model.providerColor }}>
              {model.provider}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="text-right">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-semibold block">Total Spend</span>
            <span className="font-extrabold text-neutral-900 dark:text-white text-sm">${model.spend.toFixed(2)}</span>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-semibold block">Total Requests</span>
            <span className="font-bold text-neutral-800 dark:text-neutral-200">{model.requests.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Accordion Body (Expanded Content) */}
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-6">
          
          {/* SECTION 4: MODEL COMPACT KPI CARDS (4 CARDS - Title Case Title Labels) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Total Requests</span>
              <div className="text-xl font-extrabold text-neutral-900 dark:text-white mt-1.5">{model.requests.toLocaleString()}</div>
              <div className="text-[11px] text-neutral-500 mt-1 font-medium">{model.successfulRequests.toLocaleString()} successful</div>
            </Card>

            <Card className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Total Successful Requests</span>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5">{model.successfulRequests.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                {((model.successfulRequests / model.requests) * 100).toFixed(1)}% success rate
              </div>
            </Card>

            <Card className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Total Tokens</span>
              <div className="text-xl font-extrabold text-violet-600 dark:text-violet-400 mt-1.5">{model.tokens}</div>
              <div className="text-[11px] text-neutral-500 mt-1 font-medium">{model.avgTokensPerSuccess} avg per successful request</div>
            </Card>

            <Card className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Total Spend</span>
              <div className="text-xl font-extrabold text-primary-600 dark:text-primary-400 mt-1.5">${model.spend.toFixed(2)}</div>
              <div className="text-[11px] text-neutral-500 mt-1 font-medium">${model.avgSpendPerSuccess} per successful request</div>
            </Card>
          </div>

          {/* SECTION 5: TOP VIRTUAL KEYS BY SPEND FOR THIS MODEL */}
          <AnalyticsWidget
            title="Top Virtual Keys by Spend"
            subtitle={`Virtual key cost allocation for ${model.name}`}
            viewMode={virtualKeysView}
            onViewModeChange={setVirtualKeysView}
            hasSearch={true}
            searchQuery={vkSearch}
            onSearchChange={setVkSearch}
            state={state}
            chartView={
              <div className="h-[220px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredVk} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128,128,128,0.12)" />
                    <XAxis type="number" stroke="#888888" fontSize={11} tickFormatter={(v) => `$${v}`} />
                    <YAxis dataKey="alias" type="category" stroke="#888888" fontSize={10} width={130} tickLine={false} />
                    <Tooltip formatter={(value: any) => [`$${value}`, 'Spend']} />
                    <Bar dataKey="spend" fill="#0284c7" radius={[0, 6, 6, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-neutral-700 dark:text-neutral-300">
                <thead className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100/70 dark:bg-neutral-900/70 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3">Virtual Key Alias</th>
                    <th className="py-2.5 px-3">Total Requests</th>
                    <th className="py-2.5 px-3">Total Tokens</th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white" onClick={() => setVkSort({ key: 'spend', dir: vkSort.dir === 'asc' ? 'desc' : 'asc' })}>
                      <div className="flex items-center gap-1">
                        Total Spend <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {filteredVk.map((vk, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-white">{vk.alias}</td>
                      <td className="py-2.5 px-3 font-medium">{vk.requests.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-medium text-violet-600 dark:text-violet-400">{vk.tokens}</td>
                      <td className="py-2.5 px-3 font-bold text-primary-600 dark:text-primary-400">${vk.spend.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnalyticsWidget>

          {/* SECTION 6: SPEND PER DAY */}
          <Card className="border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
            <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
              <CardTitle className="text-sm font-bold text-neutral-900 dark:text-white">
                Spend Per Day
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500">
                Daily USD cost trajectory for {model.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={model.spendPerDay} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`spdGradient-${model.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
                    <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip content={<SpendTrendTooltip />} />
                    <Area type="monotone" dataKey="spend" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill={`url(#spdGradient-${model.id})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 7, 8, 9: CHARTS ROW (TOTAL TOKENS, REQUESTS PER DAY, SUCCESS VS FAILED) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* SECTION 7: TOTAL TOKENS */}
            <Card className="border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
              <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
                <CardTitle className="text-xs font-bold text-neutral-900 dark:text-white">
                  Total Tokens
                </CardTitle>
                <CardDescription className="text-[11px] text-neutral-500">
                  Input vs Output Token distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={modelOverviewTokensData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
                      <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}M`} />
                      <Tooltip />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                      <Area type="monotone" dataKey="inputTokens" name="Input Tokens" stroke="#0284c7" fill="#0284c7" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="outputTokens" name="Output Tokens" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="totalTokens" name="Total Tokens" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 8: REQUESTS PER DAY */}
            <Card className="border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
              <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
                <CardTitle className="text-xs font-bold text-neutral-900 dark:text-white">
                  Requests Per Day
                </CardTitle>
                <CardDescription className="text-[11px] text-neutral-500">
                  Daily API call count
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={model.spendPerDay} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
                      <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(val: any) => [val.toLocaleString(), 'Requests']} />
                      <Area type="monotone" dataKey="requests" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 9: SUCCESS VS FAILED REQUESTS */}
            <Card className="border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
              <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
                <CardTitle className="text-xs font-bold text-neutral-900 dark:text-white">
                  Success vs Failed Requests
                </CardTitle>
                <CardDescription className="text-[11px] text-neutral-500">
                  Execution status ratio (HB Green / Red)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={modelOverviewRequestsData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
                      <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                      <Area type="monotone" dataKey="successful" name="Successful" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="failed" name="Failed" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      )}
    </Card>
  );
}

// Virtual Key Accordion Component inside Virtual Key Activity tab
function VirtualKeyAccordionCard({ vk, isExpanded, onToggle, state }: { vk: typeof virtualKeysList[0]; isExpanded: boolean; onToggle: () => void; state: DashboardState }) {
  const [modelsViewMode, setModelsViewMode] = useState<ViewMode>('table');
  const [modelSearch, setModelSearch] = useState('');
  const [modelSort, setModelSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'spend', dir: 'desc' });

  const filteredModelsUsage = useMemo(() => {
    let res = vk.modelsUsage.filter(m => m.model.toLowerCase().includes(modelSearch.toLowerCase()) || m.provider.toLowerCase().includes(modelSearch.toLowerCase()));
    res.sort((a: any, b: any) => {
      const valA = a[modelSort.key];
      const valB = b[modelSort.key];
      if (valA < valB) return modelSort.dir === 'asc' ? -1 : 1;
      if (valA > valB) return modelSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return res;
  }, [vk.modelsUsage, modelSearch, modelSort]);

  return (
    <Card className="border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-all duration-200">
      {/* Accordion Header */}
      <div 
        onClick={onToggle}
        className="p-4 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer flex items-center justify-between transition-colors border-b border-neutral-100 dark:border-neutral-800/60"
      >
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white">{vk.hash}</span>
              <Badge variant="outline" className="text-[10px] font-semibold border-primary-200 text-primary-700 dark:text-primary-400">
                {vk.alias}
              </Badge>
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5 font-medium">{vk.teamId}</div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="text-right">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-semibold block">Total Spend</span>
            <span className="font-extrabold text-neutral-900 dark:text-white text-sm">${vk.spend.toFixed(2)}</span>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-semibold block">Total Requests</span>
            <span className="font-bold text-neutral-800 dark:text-neutral-200">{vk.requests.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Accordion Body (Expanded Content) */}
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-6">
          
          {/* SECTION 4: VIRTUAL KEY COMPACT KPI CARDS (4 CARDS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Total Requests</span>
              <div className="text-xl font-extrabold text-neutral-900 dark:text-white mt-1.5">{vk.requests.toLocaleString()}</div>
              <div className="text-[11px] text-neutral-500 mt-1 font-medium">{vk.successfulRequests.toLocaleString()} successful</div>
            </Card>

            <Card className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Total Successful Requests</span>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5">{vk.successfulRequests.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                {((vk.successfulRequests / vk.requests) * 100).toFixed(1)}% success rate
              </div>
            </Card>

            <Card className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Total Tokens</span>
              <div className="text-xl font-extrabold text-violet-600 dark:text-violet-400 mt-1.5">{vk.tokens}</div>
              <div className="text-[11px] text-neutral-500 mt-1 font-medium">{vk.avgTokensPerSuccess} avg per successful request</div>
            </Card>

            <Card className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Total Spend</span>
              <div className="text-xl font-extrabold text-primary-600 dark:text-primary-400 mt-1.5">${vk.spend.toFixed(2)}</div>
              <div className="text-[11px] text-neutral-500 mt-1 font-medium">${vk.avgSpendPerSuccess} per successful request</div>
            </Card>
          </div>

          {/* SECTION 5: MODEL USAGE UNDER THIS VIRTUAL KEY */}
          <AnalyticsWidget
            title="Model Usage"
            subtitle={`AI model consumption for ${vk.alias}`}
            viewMode={modelsViewMode}
            onViewModeChange={setModelsViewMode}
            hasSearch={true}
            searchQuery={modelSearch}
            onSearchChange={setModelSearch}
            state={state}
            chartView={
              <div className="h-[220px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredModelsUsage} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128,128,128,0.12)" />
                    <XAxis type="number" stroke="#888888" fontSize={11} tickFormatter={(v) => `$${v}`} />
                    <YAxis dataKey="model" type="category" stroke="#888888" fontSize={10} width={130} tickLine={false} />
                    <Tooltip formatter={(value: any) => [`$${value}`, 'Spend']} />
                    <Bar dataKey="spend" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-neutral-700 dark:text-neutral-300">
                <thead className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100/70 dark:bg-neutral-900/70 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3">Model</th>
                    <th className="py-2.5 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white" onClick={() => setModelSort({ key: 'spend', dir: modelSort.dir === 'asc' ? 'desc' : 'asc' })}>
                      <div className="flex items-center gap-1">
                        Spend (USD) <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3">Successful Req.</th>
                    <th className="py-2.5 px-3">Failed Req.</th>
                    <th className="py-2.5 px-3">Tokens</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {filteredModelsUsage.map((m, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-white">
                        <div className="font-mono">{m.model}</div>
                        <div className="text-[10px] text-neutral-400">{m.provider}</div>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-primary-600 dark:text-primary-400">${m.spend.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-medium">{m.successfulRequests.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-rose-500 font-medium">{m.failedRequests.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-medium text-violet-600 dark:text-violet-400">{m.tokens}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnalyticsWidget>

          {/* SECTION 6: SPEND PER DAY */}
          <Card className="border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
            <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
              <CardTitle className="text-sm font-bold text-neutral-900 dark:text-white">
                Spend Per Day
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500">
                Daily USD cost trajectory for {vk.alias}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vk.spendPerDay} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`vkSpdGradient-${vk.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
                    <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip content={<SpendTrendTooltip />} />
                    <Area type="monotone" dataKey="spend" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill={`url(#vkSpdGradient-${vk.id})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* LOWER ANALYTICS ROW (3 CARDS: TOTAL TOKENS, REQUESTS PER DAY, SUCCESS VS FAILED) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* TOTAL TOKENS */}
            <Card className="border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
              <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
                <CardTitle className="text-xs font-bold text-neutral-900 dark:text-white">
                  Total Tokens
                </CardTitle>
                <CardDescription className="text-[11px] text-neutral-500">
                  Input vs Output Token distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={modelOverviewTokensData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
                      <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}M`} />
                      <Tooltip />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                      <Area type="monotone" dataKey="inputTokens" name="Input Tokens" stroke="#0284c7" fill="#0284c7" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="outputTokens" name="Output Tokens" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="totalTokens" name="Total Tokens" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* REQUESTS PER DAY */}
            <Card className="border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
              <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
                <CardTitle className="text-xs font-bold text-neutral-900 dark:text-white">
                  Requests Per Day
                </CardTitle>
                <CardDescription className="text-[11px] text-neutral-500">
                  Daily API call count
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={vk.spendPerDay} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
                      <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(val: any) => [val.toLocaleString(), 'Requests']} />
                      <Area type="monotone" dataKey="requests" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* SUCCESS VS FAILED REQUESTS */}
            <Card className="border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
              <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
                <CardTitle className="text-xs font-bold text-neutral-900 dark:text-white">
                  Success vs Failed Requests
                </CardTitle>
                <CardDescription className="text-[11px] text-neutral-500">
                  Execution status ratio (HB Green / Red)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={vk.spendPerDay} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
                      <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                      <Area type="monotone" dataKey="success" name="Successful" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="failed" name="Failed" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      )}
    </Card>
  );
}

// ==========================================
// 3. MAIN COST ANALYTICS & MODEL / VK DASHBOARD
// ==========================================

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [state, setState] = useState<DashboardState>('normal');
  const [timeRange, setTimeRange] = useState('30-days');

  // Accordion State for Model Activity
  const [expandedModelId, setExpandedModelId] = useState<string>('gpt-4o-mini');

  // Accordion State for Virtual Key Activity
  const [expandedVkId, setExpandedVkId] = useState<string>('vk-prod-gateway');

  // Viewing Modes for Section 3, 4, 5, 6 (Cost Analytics Tab)
  const [teamsView, setTeamsView] = useState<ViewMode>('table');
  const [membersView, setMembersView] = useState<ViewMode>('table');
  const [virtualKeysView, setVirtualKeysView] = useState<ViewMode>('table');
  const [modelsView, setModelsView] = useState<ViewMode>('table');

  // Search Queries for Virtual Keys & Models
  const [virtualKeysSearch, setVirtualKeysSearch] = useState('');
  const [modelsSearch, setModelsSearch] = useState('');

  // Sort Configs
  const [teamsSort, setTeamsSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'spend', dir: 'desc' });
  const [membersSort, setMembersSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'spend', dir: 'desc' });
  const [virtualKeysSort, setVirtualKeysSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'spend', dir: 'desc' });
  const [modelsSort, setModelsSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'spend', dir: 'desc' });

  // Filtered Teams Data
  const filteredTeams = useMemo(() => {
    let res = [...teamsData];
    res.sort((a: any, b: any) => {
      const valA = a[teamsSort.key];
      const valB = b[teamsSort.key];
      if (valA < valB) return teamsSort.dir === 'asc' ? -1 : 1;
      if (valA > valB) return teamsSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return res;
  }, [teamsSort]);

  // Filtered Members Data
  const filteredMembers = useMemo(() => {
    let res = [...membersData];
    res.sort((a: any, b: any) => {
      const valA = a[membersSort.key];
      const valB = b[membersSort.key];
      if (valA < valB) return membersSort.dir === 'asc' ? -1 : 1;
      if (valA > valB) return membersSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return res;
  }, [membersSort]);

  // Filtered Virtual Keys Data
  const filteredVirtualKeys = useMemo(() => {
    let res = virtualKeysData.filter(vk => vk.alias.toLowerCase().includes(virtualKeysSearch.toLowerCase()) || vk.keyId.toLowerCase().includes(virtualKeysSearch.toLowerCase()));
    res.sort((a: any, b: any) => {
      const valA = a[virtualKeysSort.key];
      const valB = b[virtualKeysSort.key];
      if (valA < valB) return virtualKeysSort.dir === 'asc' ? -1 : 1;
      if (valA > valB) return virtualKeysSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return res;
  }, [virtualKeysSearch, virtualKeysSort]);

  // Filtered Models Data
  const filteredModels = useMemo(() => {
    let res = modelsData.filter(md => md.model.toLowerCase().includes(modelsSearch.toLowerCase()) || md.provider.toLowerCase().includes(modelsSearch.toLowerCase()));
    res.sort((a: any, b: any) => {
      const valA = a[modelsSort.key];
      const valB = b[modelsSort.key];
      if (valA < valB) return modelsSort.dir === 'asc' ? -1 : 1;
      if (valA > valB) return modelsSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return res;
  }, [modelsSearch, modelsSort]);

  // Redesigned Organization Admin Dashboard State
  const [activeOverviewTab, setActiveOverviewTab] = useState<DashboardTabType>("Overview");
  const [dashboardFilterState, setDashboardFilterState] = useState<DashboardFilterState>({
    team: "All Teams",
    user: "All Users",
    virtualKey: "All Virtual Keys",
    provider: "All Providers",
    model: "All Models",
    outcome: "All Outcomes",
    timePeriod: "This Month",
    comparison: "vs Aug 3, 2026",
    granularity: "Daily",
  });
  const [isRefreshingDashboard, setIsRefreshingDashboard] = useState(false);

  const handleFilterUpdate = (updates: Partial<DashboardFilterState>) => {
    setDashboardFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetDashboardFilters = () => {
    setDashboardFilterState({
      team: "All Teams",
      user: "All Users",
      virtualKey: "All Virtual Keys",
      provider: "All Providers",
      model: "All Models",
      outcome: "All Outcomes",
      timePeriod: "This Month",
      comparison: "vs Aug 3, 2026",
      granularity: "Daily",
    });
  };

  const handleRefresh = () => {
    setIsRefreshingDashboard(true);
    setState('loading');
    setTimeout(() => {
      setState('normal');
      setIsRefreshingDashboard(false);
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen space-y-5">
      <div className="max-w-[100%] mx-auto space-y-5">
        {/* 1. Global Dashboard Header */}
        <DashboardGlobalHeader
          orgName="Acme Health"
          isRefreshing={isRefreshingDashboard}
          onRefresh={handleRefresh}
        />

        {/* Dev State Switcher (preserves testing flexibility) */}
        <div className="flex items-center justify-between p-2 bg-neutral-100/70 dark:bg-neutral-900/60 rounded-lg border border-neutral-200/80 dark:border-neutral-800 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Dev Test State:</span>
            {(['normal', 'loading', 'empty', 'error'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setState(s)}
                className={cn(
                  "px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition-all capitalize cursor-pointer",
                  state === s
                    ? "bg-white dark:bg-neutral-800 shadow-2xs text-primary-600 dark:text-primary-400 font-bold"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-neutral-400 font-medium">
            Guardian Layer Enterprise Dashboard v2.0
          </div>
        </div>

        {/* 2. Dashboard Control Bar */}
        <DashboardControlBar
          filterState={dashboardFilterState}
          onFilterChange={handleFilterUpdate}
        />

        {/* 3. Dashboard Tabs */}
        <DashboardTabsBar
          activeTab={activeOverviewTab}
          onTabChange={(tab) => setActiveOverviewTab(tab)}
        />

        {/* 4. Tab Content Body */}
        {activeOverviewTab === "Overview" ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Bar */}
            <DashboardFilterBar
              filterState={dashboardFilterState}
              onFilterChange={handleFilterUpdate}
              onResetFilters={handleResetDashboardFilters}
            />

            {/* Dynamic View States */}
            {state === "loading" ? (
              <DashboardSkeleton />
            ) : state === "error" ? (
              <DashboardErrorState onRetry={handleRefresh} />
            ) : state === "empty" ? (
              <DashboardEmptyState onResetFilters={handleResetDashboardFilters} />
            ) : (
              <div className="space-y-6">
                {/* SECTION 1: Financial Health & Budget Overview */}
                <FinancialHealthOverview data={mockFinancialKpis} />

                {/* SECTION 2: Operational Health & Gateway Volume */}
                <OperationalHealthOverview data={mockOperationalKpis} />

                {/* SECTION 3: Budget Burn & Forecast Pace */}
                <BudgetBurnForecastChart />

                {/* SECTION 4: Spend Breakdown & Resource Allocation */}
                <SpendBreakdownTable />

                {/* SECTION 5: Hourly Spend Grid & Contribution Graph */}
                <HourlySpendGridHeatmap />

                {/* SECTION 6: Lower Analytical Insight Cards (3-column) */}
                <InsightCardsGrid onNavigateTab={(tab) => setActiveOverviewTab(tab)} />
              </div>
            )}
          </div>
        ) : activeOverviewTab === "Spend & Budget" ? (
          <SpendBudgetDashboard state={state} onRetry={handleRefresh} />
        ) : activeOverviewTab === "Requests" ? (
          <RequestsDashboard state={state} onRetry={handleRefresh} />
        ) : activeOverviewTab === "Tokens" ? (
          <TokensDashboard state={state} onRetry={handleRefresh} />
        ) : activeOverviewTab === "Reliability" ? (
          <ReliabilityDashboard state={state} onRetry={handleRefresh} />
        ) : activeOverviewTab === "Capacity" ? (
          <CapacityDashboard state={state} onRetry={handleRefresh} />
        ) : (
          /* Placeholder container for the other tabs */
          <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-4 shadow-2xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {activeOverviewTab} Module
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Detailed analytics and dedicated controls for {activeOverviewTab}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveOverviewTab("Overview")}
                className="h-8 text-xs"
              >
                ← Back to Overview
              </Button>
            </div>

            <div className="p-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg text-center space-y-2">
              <p className="text-xs text-neutral-500 font-medium">
                You are currently viewing the <strong className="text-neutral-800 dark:text-neutral-200">{activeOverviewTab}</strong> tab.
              </p>
              <p className="text-[11px] text-neutral-400">
                The Overview dashboard tab is fully active and loaded with operational metrics.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
