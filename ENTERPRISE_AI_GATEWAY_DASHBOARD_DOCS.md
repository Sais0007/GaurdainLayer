# Enterprise AI Gateway Analytics Dashboard — Architecture & Specification Guide

> **Production Specification & Reusability Manual**  
> Complete documentation for the **HiddenBrains Enterprise AI Gateway Dashboard System**. Use this blueprint to integrate, customize, or replicate the multi-tenant AI Observability & Financial Intelligence platform in any React, Next.js, or Vite application.

---

## 📌 Executive Summary

The **Enterprise AI Gateway Dashboard** is a multi-tab financial, operational, and reliability observability console designed for enterprise LLM API management. It delivers real-time monitoring across multi-provider LLM infrastructure (*Anthropic*, *OpenAI*, *Google*, *Meta*, *DeepSeek*), enabling Organization Admins to enforce budget caps, diagnose SLA breaches, optimize prompt payload efficiency, and manage capacity rate limits.

---

## 🛠️ Technology Stack & Dependencies

| Layer | Component | Version / Library |
| :--- | :--- | :--- |
| **Framework** | React + TypeScript | React 18+ / TS 5+ |
| **Build Tool** | Vite | Vite v6+ |
| **Styling** | Vanilla TailwindCSS | Tailwind CSS v3 / v4 |
| **Charts & Data Viz** | Recharts | `recharts` |
| **Icons** | Lucide React | `lucide-react` |
| **UI Components** | Radix UI / Shadcn Skeletons | Custom Accessible Elements |
| **Stacking Portal** | React Portals | `ReactDOM.createPortal` for fixed overlay tooltips |

---

## 📁 Component Directory Structure

```text
src/app/components/
├── Dashboard.tsx                           # Master Router & Navigation Header
├── DashboardSkeleton.tsx                   # Unified Loading Skeleton State
├── DashboardEmptyState.tsx                 # Zero Data / Filter Reset State
├── DashboardErrorState.tsx                 # Incident Recovery & Retry State
├── AuditTraceInspectorModal.tsx            # Global Incident Log Inspector Modal
│
├── dashboard/
│   ├── dashboardData.ts                    # Global Type Definitions & Mock Data Generators
│   ├── FinancialHealthOverview.tsx         # Overview Tab: Financial KPI Cards
│   ├── OperationalHealthOverview.tsx       # Overview Tab: Operational KPI Cards
│   ├── BudgetBurnForecastChart.tsx         # Overview Tab: Trajectory Chart
│   ├── SpendBreakdownTable.tsx             # Overview Tab: Resource Allocation Table
│   ├── HourlySpendGridHeatmap.tsx          # Overview Tab: 24h Contribution Matrix
│   ├── InsightCardsGrid.tsx                # Overview Tab: 6-Card Intelligence Grid
│   │
│   ├── spend-budget/                       # Tab 2: Spend & Budget Module
│   │   ├── SpendBudgetDashboard.tsx        # Container
│   │   ├── SpendBudgetFilters.tsx          # Diagnostic Filter Bar
│   │   ├── SpendKPICards.tsx               # 4 Strategic Spend KPI Cards
│   │   ├── BudgetBurnTrajectory.tsx        # Hero Analytics Chart (460-520px)
│   │   ├── TeamBudgetUtilization.tsx       # Team Utilization Card (50% Row)
│   │   ├── VirtualKeyBudgetUtilization.tsx # Virtual Key Utilization Card (50% Row)
│   │   ├── SpendDistributionCard.tsx       # Spend Distribution Donut Chart
│   │   ├── TopConsumersCard.tsx            # Ranked Top Consumers Card
│   │   ├── BudgetAlertsCard.tsx            # Active SLA & Budget Alerts Card
│   │   └── CostOptimizationCard.tsx        # AI Cost Savings Recommendations Card
│   │
│   ├── requests/                           # Tab 3: Request Analytics Module
│   │   ├── RequestsDashboard.tsx           # Container
│   │   ├── RequestsFilters.tsx             # Filter Card
│   │   ├── RequestsKPICards.tsx            # 10 KPI Cards (5×2 Grid)
│   │   ├── RequestVolumeTrend.tsx          # Request Volume Trajectory Chart
│   │   ├── RequestVolumeBreakdown.tsx      # Multi-Dimension Progress Breakdown
│   │   └── LoadDistributionHeatmap.tsx     # Peak Failure & Load Grid
│   │
│   ├── tokens/                             # Tab 4: Token Analytics Module
│   │   ├── TokensDashboard.tsx             # Container
│   │   ├── TokensFilters.tsx               # Filter Card with Token Type Selector
│   │   ├── TokensKPICards.tsx              # 10 KPI Cards (5×2 Grid)
│   │   ├── TokensTrendChart.tsx            # Stacked Vertical Bar Consumption Trend
│   │   └── TokensBreakdownTable.tsx        # Dual Input/Output Progress Breakdown
│   │
│   ├── reliability/                        # Tab 5: Reliability & SLA Module
│   │   ├── ReliabilityDashboard.tsx        # Container
│   │   ├── ReliabilityFilters.tsx          # Diagnostics Filter Bar & Trace Button
│   │   ├── ReliabilityKPICards.tsx         # 10 SLA KPI Cards (2 Rows)
│   │   ├── SuccessFailureTimeline.tsx      # Stacked Vertical Bar Timeline (Blue/Red)
│   │   ├── OperationalMatrixTable.tsx      # Provider & Model Unit Economics Matrix
│   │   └── FailureCauseDistribution.tsx    # 2-Column Root Cause Progress Distribution
│   │
│   └── capacity/                           # Tab 6: Capacity & Throughput Module
│       ├── CapacityDashboard.tsx           # Container
│       ├── CapacityFilters.tsx             # Limit Type (RPM/TPM) Filter Bar
│       ├── CapacityKPICards.tsx            # 10 Throttle KPI Cards (2 Rows)
│       ├── RpmThroughputChart.tsx          # RPM Peak vs 500 RPM Threshold Line Chart
│       ├── TpmThroughputChart.tsx          # TPM Burst vs 2.0M TPM Threshold Line Chart
│       └── VirtualKeysCapacityList.tsx     # 5 Key Risk Rows with Dual Progress Bars
```

---

## 🎨 Design System & Visual Guidelines

### 1. Color Palette Tokens

```css
/* Core Surfaces */
--bg-card-light: #FFFFFF;
--bg-card-dark: #171717; /* neutral-900 */
--border-light: #E5E5E5;  /* neutral-200 */
--border-dark: #262626;   /* neutral-800 */

/* Status & Metric Accents */
--color-success: #10B981; /* emerald-500 (Healthy / SLA Met / Output Tokens) */
--color-info:    #3B82F6; /* sky-500 / blue-500 (Input Tokens / Requests / Gateway Limit) */
--color-warning: #F59E0B; /* amber-500 (Near Limit / Warning / Degraded) */
--color-danger:  #EF4444; /* rose-500 / red-500 (Errors / Failures / Throttle Risk) */
--color-purple:  #8B5CF6; /* violet-500 (Tokens / Model Accents) */

/* Tooltip Overlay Surface */
--bg-tooltip: #1C1F2E;   /* Opaque Solid Dark Card with Border */
--z-index-tooltip: 99999;
```

### 2. Interaction Physics & Micro-Animations
- **Hover Lift**: `hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer`
- **Active State**: Smooth background tinting (`bg-neutral-100/70 dark:bg-neutral-800/60`).
- **Progress Bars**: Dual-layer stacked progress tracks with `group-hover:brightness-110` transition.
- **Portals**: Dynamic React Portals (`createPortal(<Tooltip />, document.body)`) to prevent `overflow: hidden` clipping in nested scroll containers.

---

## 📊 Dashboard Modules Detailed Breakdown

### Module 1: Overview Tab (`Overview`)
Provides executive-level summary of financial health, gateway traffic, SLA baselines, and resource consumption.

- **Financial Health KPI Row**: Period Spend (`$8,050.00`), Budget Utilization (`78.0%`), Remaining Budget (`$2,271.00`), Forecasted End Spend (`$8,694.00`).
- **Operational Health KPI Row**: Total Requests (`182,640`), Success Rate (`96.2%`), Failed Requests (`6,941`), Total Tokens (`16.4B`).
- **Budget Burn & Forecast Pace**: Interactive dual-area linear forecast vs actual cumulative spend chart with baseline threshold line.
- **Spend Breakdown Table**: Dynamic 5-mode dimension switcher (`Teams`, `Users`, `Virtual Keys`, `Models`, `Providers`) with rank progress bars and direct drill-down into `Audit Trace Inspector`.
- **Hourly Spend Grid Heatmap**: 24-hour contribution matrix highlighting peak business hour traffic windows.

---

### Module 2: Spend & Budget Tab (`Spend & Budget`)
Enterprise financial control console for budget tracking, team allocations, virtual key caps, and proactive cost optimization.

- **Hero Analytics Chart**: 480px `Budget Burn Rate Trajectory` with actual cumulative spend, expected linear pace, budget ceiling (`$10,000`), and month-end forecast (`$8,694`).
- **Team Budget Utilization Card**: 5-team comparison widget featuring spent vs allocated progress bars, threshold status chips, and hover analytics cards.
- **Virtual Key Budget Utilization Card**: Key-level real-time ceiling tracker with remaining budget warnings and hover breakdown.
- **Spend Intelligence Grid (2×2)**:
  1. *Spend Distribution*: Donut split by provider (*Anthropic*, *OpenAI*, *Google*, *Meta*).
  2. *Top Budget Consumers*: Ranked top 5 drivers list with cost contribution percentages.
  3. *Budget Alerts*: Real-time SLA breach & threshold alerts.
  4. *Cost Optimization*: AI-generated actionable prompt compression & model routing rules.

---

### Module 3: Requests Tab (`Requests`)
Request volume trajectory, failure spike detection, and load distribution analysis.

- **Filter Bar**: `Team`, `User`, `Virtual Key`, `Provider`, `Model`, `Outcome` (`All`, `Successful`, `4xx Client Error`, `5xx Server Error`).
- **10 KPI Cards (5×2 Grid)**: Total Requests (`182,640`), Successful (`175,699`), Failed (`6,941`), Avg Reqs/Day (`6,088`), Peak Request Hour (`8,420`), Top Team (`Support`), Top User (`Dr. Sarah Chen`), Top Key (`support-prod-key`), Top Model (`Claude Sonnet`), Top Provider (`OpenAI`).
- **Request Volume Trend**: Area chart with `Total Volume`, `Successful`, and `Failed` toggles.
- **Request Volume Breakdown**: Segmented progress list across Teams, Users, Virtual Keys, Models, and Providers.
- **Load Distribution Heatmap**: 24h × 7-Day matrix highlighting traffic spikes and error clusters.

---

### Module 4: Tokens Tab (`Tokens`)
Token payload distribution and prompt vs completion efficiency.

- **Filter Bar**: Includes **TOKEN TYPE** (`All Tokens`, `Input Tokens`, `Output Tokens`, `Cached Tokens`).
- **10 KPI Cards (5×2 Grid)**:
  - Total Tokens (`16.4B`), Input Tokens (`10.8B`), Output Tokens (`5.6B`), Avg Tokens/Req (`89,800`), In/Out Ratio (`1.93 : 1`), Avg Input/Req (`59,100`), Avg Output/Req (`30,700`), Top Team (`Research`), Top Key (`research-analysis-key`), Top Model (`Claude Sonnet`).
- **Input vs Output Token Trend**: **Stacked Vertical Bar Chart** (Blue = Input Tokens, Green = Output Tokens).
- **Token Consumption Breakdown**: Multi-dimension progress list with stacked Blue (Input) and Green (Output) utilization bars.

---

### Module 5: Reliability Tab (`Reliability`)
SLA diagnostics, error code categorization, and provider operational matrix.

- **Filter Bar**: Includes `ERROR CATEGORY` selector and red `Inspect Incident Trace Logs` primary danger button.
- **10 KPI Cards (2 Rows)**:
  - Success Rate (`96.2%`), Failure Rate (`3.8%`), Successful (`175,699`), Failed Requests (`6,941`), Elevated Periods (`1 Event`).
  - Affected Keys (`3 Keys`), Affected Teams (`3 Teams / 8 Users`), Most Failed Model (`Claude Sonnet - 7.3%`), Most Failed Provider (`Anthropic - 7.3%`), Primary Error (`503 Provider Down - 49.3%`).
- **Success & Failure Timeline**: Stacked Vertical Bar Chart (Blue = Successful Requests, Red = Failed Requests) with `Target Baseline: 98.0% SLA` badge.
- **Model and Provider Operational Matrix**: Responsive table with sticky header, status chips (`DEGRADED`, `HEALTHY`), cost per 1K tokens, and failure rates.
- **Normalized Failure Cause Distribution**: 2-column grid featuring red progress bars for root cause error codes (*503 Provider Down*, *504 Timeout*, *429 RPM Limit*, *429 TPM Limit*, *402 Budget*, *401 Auth*).

---

### Module 6: Capacity Tab (`Capacity`)
Throughput limits, rate-limit breach prevention, and key-level capacity ceilings.

- **Filter Bar**: Includes `LIMIT TYPE` selector (*All Limits*, *RPM Only*, *TPM Only*).
- **10 KPI Cards (2 Rows)**:
  - Peak RPM (`420 RPM`), Gateway RPM Limit (`500 RPM`), Peak TPM (`1.85M TPM`), Gateway TPM Limit (`2.0M TPM`), Throttle Breaches (`820 Events`).
  - Keys Near Capacity (`2 Keys`), Highest RPM Key (`marketing-prod-key`), Highest TPM Key (`research-analysis-key`), Top Throttle Team (`Marketing`), Top Throttle Model (`Claude Sonnet`).
- **RPM Throughput Chart**: Smooth orange line chart with dashed threshold line at `500 RPM`.
- **TPM Burst Throughput Chart**: Smooth pink line chart with dashed threshold line at `2.0M TPM`.
- **Virtual Keys Capacity & Throttle Risk**: 5 Virtual Key rows with dual horizontal progress bars (Orange for RPM, Pink for TPM) and color-coded `UTILIZATION BADGES` (`92.5% Red`, `89.6% Orange`, `83.5% Orange`, `75% Yellow`, `36.3% Green`).

---

## 🚀 Step-by-Step Porting & Reusability Guide

To reuse this dashboard in another project:

### Step 1: Copy Components Directory
Copy `src/app/components/dashboard/` and `src/app/components/Dashboard.tsx` into your target repository.

### Step 2: Install Required Dependencies
Run the following command in your target project:

```bash
npm install recharts lucide-react clsx tailwind-merge
```

### Step 3: Configure Tailwind Glass/Border Utilities
Ensure your `tailwind.config.js` or global CSS includes helper utilities for smooth transitions and dark mode:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
    },
  },
  plugins: [],
}
```

### Step 4: Import and Mount in Page Container

```tsx
import React, { useState } from "react";
import { Dashboard } from "./components/Dashboard";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Dashboard />
    </div>
  );
}
```

---

## 📝 Verification & Compliance Checklist

- [x] **Zero Dependencies on External Backend**: Includes mock data generators for instant standalone demoing.
- [x] **Dark Mode Native**: Full support for Tailwind dark mode classes across all cards and tooltips.
- [x] **Z-Index Portal Safety**: Tooltips use fixed overlay portals to eliminate container clipping.
- [x] **Responsive Layouts**: Full-screen grid scaling from mobile (1 column) to ultra-wide desktop displays.
- [x] **Clean Production Build Verified**: Compiles with zero TypeScript or Vite bundle errors.

---
*Documentation maintained by Antigravity AI Coding Assistant.*
