// Types and mock dataset for Organization Admin Overview Dashboard

export type TimePeriodOption = 
  | 'Today' 
  | 'Last 7 Days' 
  | 'This Week' 
  | 'This Month' 
  | 'Last 1 Month' 
  | 'Last 3 Months' 
  | 'Last 6 Months' 
  | 'Last 1 Year' 
  | 'Custom Date Range';

export type GranularityOption = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly';

export type DashboardTabType = 'Overview' | 'Spend & Budget' | 'Requests' | 'Tokens' | 'Reliability' | 'Capacity';

export type ViewByOption = 'Teams' | 'Users' | 'Virtual Keys' | 'Models' | 'Providers';

export interface DashboardFilterState {
  team: string;
  user: string;
  virtualKey: string;
  provider: string;
  model: string;
  outcome: 'All Outcomes' | 'Success Only' | 'Failed Only';
  timePeriod: TimePeriodOption;
  customDateRange?: { start: string; end: string };
  comparison: string;
  granularity: GranularityOption;
}

export interface ResourceAllocationItem {
  id: string;
  rank: number;
  name: string;
  contextOwner: string;
  spend: number;
  totalSharePercent: number;
  totalRequests: number;
}

export interface AuditTraceRecord {
  id: string;
  timestamp: string;
  teamAndUser: string;
  virtualKey: string;
  modelAndProvider: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  status: 'SUCCESS' | 'FAILED';
  errorCode?: string;
}

// Initial default filter options
export const FILTER_OPTIONS = {
  teams: ['All Teams', 'Support', 'Clinical Operations', 'Research', 'Marketing', 'Product'],
  users: ['All Users', 'Sarah Connor', 'John Doe', 'Alex Dev', 'Michael Scott', 'Emily Watson', 'David Miller'],
  virtualKeys: ['All Virtual Keys', 'support-prod-key', 'clinical-ops-key', 'research-ai-key', 'mktg-genai-key', 'product-dev-key'],
  providers: ['All Providers', 'OpenAI', 'Anthropic', 'Azure AI', 'DeepSeek', 'Google Gemini', 'Mistral'],
  models: ['All Models', 'Claude 3.5 Sonnet', 'GPT-4o', 'GPT-4o Mini', 'DeepSeek R1', 'Gemini 1.5 Pro', 'Claude 3.5 Haiku'],
  outcomes: ['All Outcomes', 'Success Only', 'Failed Only']
};

// Overview Financial KPI Card Metrics
export interface FinancialKpis {
  periodSpend: { value: number; trend: number; avgCostPerReq: number };
  budgetUtilization: { percent: number; spend: number; totalBudget: number; trajectory: string };
  remainingBudget: { remainingAmount: number; remainingPercent: number; daysLeft: number; budgetCeiling: number };
  forecastedSpend: { forecastedAmount: number; overBudgetAmount: number };
}

export const mockFinancialKpis: FinancialKpis = {
  periodSpend: { value: 7800.00, trend: 11.4, avgCostPerReq: 0.042 },
  budgetUtilization: { percent: 78, spend: 7800.00, totalBudget: 10000.00, trajectory: 'On Track' },
  remainingBudget: { remainingAmount: 2200.00, remainingPercent: 22, daysLeft: 12, budgetCeiling: 10000.00 },
  forecastedSpend: { forecastedAmount: 10218.00, overBudgetAmount: 218.00 }
};

// Overview Operational KPI Card Metrics
export interface OperationalKpis {
  totalRequests: { value: number; trend: number; peakRateHour: number };
  successRate: { percent: number; trend: number; targetPercent: number };
  failedRequests: { value: number; trend: number; topFailureModel: string; failureSharePercent: number; incidentWindow: string };
  totalTokens: { formatted: string; rawInput: string; rawOutput: string; avgTokensPerReq: number };
}

export const mockOperationalKpis: OperationalKpis = {
  totalRequests: { value: 182640, trend: 18.3, peakRateHour: 8302 },
  successRate: { percent: 96.2, trend: 1.8, targetPercent: 98.0 },
  failedRequests: { value: 6941, trend: -65.0, topFailureModel: 'Claude 3.5 Sonnet', failureSharePercent: 72, incidentWindow: 'Aug 4, 2:00 PM - 3:30 PM' },
  totalTokens: { formatted: '16.4B', rawInput: '10.8B Input', rawOutput: '5.6B Output', avgTokensPerReq: 89800 }
};

// Budget Burn & Forecast Area Chart Data Points
export interface BudgetBurnPoint {
  date: string;
  actualSpend: number;
  expectedBudgetPace: number;
  forecastPace: number;
}

export const mockBudgetBurnChartData: BudgetBurnPoint[] = [
  { date: 'Aug 1', actualSpend: 320, expectedBudgetPace: 333, forecastPace: 320 },
  { date: 'Aug 2', actualSpend: 680, expectedBudgetPace: 666, forecastPace: 670 },
  { date: 'Aug 3', actualSpend: 1050, expectedBudgetPace: 1000, forecastPace: 1020 },
  { date: 'Aug 4', actualSpend: 1540, expectedBudgetPace: 1333, forecastPace: 1480 },
  { date: 'Aug 5', actualSpend: 1980, expectedBudgetPace: 1666, forecastPace: 1900 },
  { date: 'Aug 6', actualSpend: 2420, expectedBudgetPace: 2000, forecastPace: 2350 },
  { date: 'Aug 7', actualSpend: 2890, expectedBudgetPace: 2333, forecastPace: 2800 },
  { date: 'Aug 8', actualSpend: 3350, expectedBudgetPace: 2666, forecastPace: 3250 },
  { date: 'Aug 9', actualSpend: 3820, expectedBudgetPace: 3000, forecastPace: 3700 },
  { date: 'Aug 10', actualSpend: 4300, expectedBudgetPace: 3333, forecastPace: 4180 },
  { date: 'Aug 12', actualSpend: 5120, expectedBudgetPace: 4000, forecastPace: 4980 },
  { date: 'Aug 14', actualSpend: 5950, expectedBudgetPace: 4666, forecastPace: 5800 },
  { date: 'Aug 16', actualSpend: 6780, expectedBudgetPace: 5333, forecastPace: 6620 },
  { date: 'Aug 18', actualSpend: 7550, expectedBudgetPace: 6000, forecastPace: 7410 },
  { date: 'Aug 20', actualSpend: 7800, expectedBudgetPace: 6666, forecastPace: 7650 },
  { date: 'Aug 22', actualSpend: 7800, expectedBudgetPace: 7333, forecastPace: 7900 },
  { date: 'Aug 25', actualSpend: 7800, expectedBudgetPace: 8333, forecastPace: 8250 },
  { date: 'Aug 28', actualSpend: 7800, expectedBudgetPace: 9333, forecastPace: 8520 },
  { date: 'Aug 30', actualSpend: 7800, expectedBudgetPace: 10000, forecastPace: 8694 },
];

// Resource Allocation Table Data per ViewBy option
export const mockResourceAllocationData: Record<ViewByOption, ResourceAllocationItem[]> = {
  Teams: [
    { id: 't-1', rank: 1, name: 'Support', contextOwner: '14 Users · 8 Keys', spend: 2450.00, totalSharePercent: 31.4, totalRequests: 54200 },
    { id: 't-2', rank: 2, name: 'Clinical Operations', contextOwner: '10 Users · 5 Keys', spend: 1920.00, totalSharePercent: 24.6, totalRequests: 42309 },
    { id: 't-3', rank: 3, name: 'Research', contextOwner: '8 Users · 5 Keys', spend: 1850.00, totalSharePercent: 23.7, totalRequests: 38640 },
    { id: 't-4', rank: 4, name: 'Marketing', contextOwner: '6 Users · 4 Keys', spend: 1290.00, totalSharePercent: 16.5, totalRequests: 29409 },
    { id: 't-5', rank: 5, name: 'Product', contextOwner: '5 Users · 4 Keys', spend: 290.00, totalSharePercent: 3.7, totalRequests: 18082 },
  ],
  Users: [
    { id: 'u-1', rank: 1, name: 'Sarah Connor', contextOwner: 'Support · Lead Dev', spend: 1420.00, totalSharePercent: 18.2, totalRequests: 31200 },
    { id: 'u-2', rank: 2, name: 'John Doe', contextOwner: 'Clinical Operations · Sr. Admin', spend: 1180.00, totalSharePercent: 15.1, totalRequests: 26400 },
    { id: 'u-3', rank: 3, name: 'Alex Dev', contextOwner: 'Research · AI Engineer', spend: 950.00, totalSharePercent: 12.2, totalRequests: 21100 },
    { id: 'u-4', rank: 4, name: 'Michael Scott', contextOwner: 'Marketing · Product Mgr', spend: 840.00, totalSharePercent: 10.8, totalRequests: 18900 },
    { id: 'u-5', rank: 5, name: 'Emily Watson', contextOwner: 'Product · UX Specialist', spend: 710.00, totalSharePercent: 9.1, totalRequests: 15400 },
  ],
  'Virtual Keys': [
    { id: 'vk-1', rank: 1, name: 'support-prod-key', contextOwner: 'Support Team · Primary Gateway', spend: 2150.00, totalSharePercent: 27.5, totalRequests: 48900 },
    { id: 'vk-2', rank: 2, name: 'clinical-ops-key', contextOwner: 'Clinical Ops · Healthcare Pipeline', spend: 1820.00, totalSharePercent: 23.3, totalRequests: 39500 },
    { id: 'vk-3', rank: 3, name: 'research-ai-key', contextOwner: 'Research · Deep Analytics', spend: 1650.00, totalSharePercent: 21.1, totalRequests: 34100 },
    { id: 'vk-4', rank: 4, name: 'mktg-genai-key', contextOwner: 'Marketing · Content Engine', spend: 1190.00, totalSharePercent: 15.2, totalRequests: 26800 },
    { id: 'vk-5', rank: 5, name: 'product-dev-key', contextOwner: 'Product · Staging Environment', spend: 990.00, totalSharePercent: 12.7, totalRequests: 21240 },
  ],
  Models: [
    { id: 'm-1', rank: 1, name: 'Claude 3.5 Sonnet', contextOwner: 'Anthropic · Multi-modal', spend: 3450.00, totalSharePercent: 44.2, totalRequests: 78400 },
    { id: 'm-2', rank: 2, name: 'GPT-4o', contextOwner: 'OpenAI · Flagship Engine', spend: 2180.00, totalSharePercent: 27.9, totalRequests: 49100 },
    { id: 'm-3', rank: 3, name: 'GPT-4o Mini', contextOwner: 'OpenAI · Lightweight', spend: 1120.00, totalSharePercent: 14.3, totalRequests: 34200 },
    { id: 'm-4', rank: 4, name: 'DeepSeek R1', contextOwner: 'DeepSeek · Reasoner', spend: 640.00, totalSharePercent: 8.2, totalRequests: 12900 },
    { id: 'm-5', rank: 5, name: 'Gemini 1.5 Pro', contextOwner: 'Google Gemini · Enterprise', spend: 410.00, totalSharePercent: 5.3, totalRequests: 8040 },
  ],
  Providers: [
    { id: 'p-1', rank: 1, name: 'Anthropic', contextOwner: '2 Active Models · SLA 99.8%', spend: 3680.00, totalSharePercent: 47.2, totalRequests: 84200 },
    { id: 'p-2', rank: 2, name: 'OpenAI', contextOwner: '3 Active Models · SLA 99.9%', spend: 3300.00, totalSharePercent: 42.3, totalRequests: 83300 },
    { id: 'p-3', rank: 3, name: 'DeepSeek', contextOwner: '1 Active Model · SLA 98.4%', spend: 640.00, totalSharePercent: 8.2, totalRequests: 12900 },
    { id: 'p-4', rank: 4, name: 'Google Gemini', contextOwner: '1 Active Model · SLA 99.5%', spend: 180.00, totalSharePercent: 2.3, totalRequests: 2240 },
  ]
};

// Audit Trace Inspector Mock Log Data
export const mockAuditTraceLogs: Record<string, AuditTraceRecord[]> = {
  Support: [
    { id: 'req-893A01', timestamp: 'Aug 8, 2026 14:42:15', teamAndUser: 'Support · Sarah Connor', virtualKey: 'support-prod-key', modelAndProvider: 'Claude 3.5 Sonnet (Anthropic)', tokensIn: 4120, tokensOut: 850, latencyMs: 342, status: 'SUCCESS' },
    { id: 'req-893A02', timestamp: 'Aug 8, 2026 14:41:02', teamAndUser: 'Support · John Doe', virtualKey: 'support-prod-key', modelAndProvider: 'Claude 3.5 Sonnet (Anthropic)', tokensIn: 12050, tokensOut: 0, latencyMs: 5012, status: 'FAILED', errorCode: '503_PROVIDER_DOWN' },
    { id: 'req-893A03', timestamp: 'Aug 8, 2026 14:38:44', teamAndUser: 'Support · Emily Watson', virtualKey: 'support-prod-key', modelAndProvider: 'GPT-4o Mini (OpenAI)', tokensIn: 1840, tokensOut: 420, latencyMs: 180, status: 'SUCCESS' },
    { id: 'req-893A04', timestamp: 'Aug 8, 2026 14:35:10', teamAndUser: 'Support · Sarah Connor', virtualKey: 'support-prod-key', modelAndProvider: 'GPT-4o (OpenAI)', tokensIn: 6400, tokensOut: 1210, latencyMs: 410, status: 'SUCCESS' },
  ],
  Default: [
    { id: 'req-771B99', timestamp: 'Aug 8, 2026 14:30:00', teamAndUser: 'Clinical Operations · David Miller', virtualKey: 'clinical-ops-key', modelAndProvider: 'GPT-4o (OpenAI)', tokensIn: 8400, tokensOut: 1520, latencyMs: 290, status: 'SUCCESS' },
    { id: 'req-771B98', timestamp: 'Aug 8, 2026 14:28:11', teamAndUser: 'Research · Alex Dev', virtualKey: 'research-ai-key', modelAndProvider: 'Claude 3.5 Sonnet (Anthropic)', tokensIn: 15400, tokensOut: 0, latencyMs: 4200, status: 'FAILED', errorCode: '429_RATE_LIMIT_EXCEEDED' },
  ]
};

// Hourly Heatmap 7x24 Matrix Data Generator
export interface HeatmapCell {
  day: string;
  hour: number;
  spend: number;
  requests: number;
  tokensFormatted: string;
  intensity: 'none' | 'low' | 'medium' | 'high' | 'very-high';
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const generateHeatmapData = (): HeatmapCell[][] => {
  return DAYS.map((day, dIdx) => {
    return Array.from({ length: 24 }).map((_, h) => {
      let baseSpend = 5 + Math.sin((h - 6) / 3) * 15;
      if (h < 6) baseSpend = Math.max(0.5, Math.random() * 4);
      if (h >= 9 && h <= 17) baseSpend += 30 + Math.random() * 40;
      if ((h === 14 || h === 15) && (dIdx === 2 || dIdx === 3)) baseSpend = 142.50; // Peak hours

      const spend = Number(Math.max(0.2, baseSpend).toFixed(2));
      const requests = Math.round(spend * 24.5);
      const tokensFormatted = `${(spend * 2.1).toFixed(2)}M`;

      let intensity: HeatmapCell['intensity'] = 'none';
      if (spend > 100) intensity = 'very-high';
      else if (spend > 50) intensity = 'high';
      else if (spend > 20) intensity = 'medium';
      else if (spend > 5) intensity = 'low';

      return { day, hour: h, spend, requests, tokensFormatted, intensity };
    });
  });
};

// Lower Analytical Insight Cards Datasets
export const mockRequestVolumeData = [
  { time: '00:00', requests: 1200 },
  { time: '04:00', requests: 800 },
  { time: '08:00', requests: 4200 },
  { time: '12:00', requests: 7800 },
  { time: '16:00', requests: 8302 },
  { time: '20:00', requests: 4900 },
  { time: '23:59', requests: 2100 },
];

export const mockTokenConsumptionData = [
  { day: 'Mon', inputTokens: 1.4, outputTokens: 0.7 },
  { day: 'Tue', inputTokens: 1.8, outputTokens: 0.9 },
  { day: 'Wed', inputTokens: 2.1, outputTokens: 1.1 },
  { day: 'Thu', inputTokens: 2.4, outputTokens: 1.2 },
  { day: 'Fri', inputTokens: 1.9, outputTokens: 1.0 },
  { day: 'Sat', inputTokens: 0.8, outputTokens: 0.4 },
  { day: 'Sun', inputTokens: 0.4, outputTokens: 0.3 },
];
