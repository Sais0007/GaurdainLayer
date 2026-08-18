import React, { useState, useMemo, useEffect } from 'react';
import { 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Download, 
  ChevronRight, 
  Info, 
  FileSpreadsheet, 
  FileImage, 
  FileText,
  AlertTriangle, 
  Inbox,
  ArrowUp,
  TrendingUp
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import { toast } from 'sonner';

export interface SunburstNode {
  name: string;
  value?: number;
  color?: string;
  children?: SunburstNode[];
}

interface SunburstChartCardProps {
  title?: string;
  description?: string;
  data: SunburstNode;
  state?: 'normal' | 'loading' | 'empty' | 'error';
  onRefresh?: () => void;
  className?: string;
}

interface RenderArcData {
  node: SunburstNode;
  path: string;
  depth: number;
  startAngle: number;
  endAngle: number;
  color: string;
}

// Polar coordinate to Cartesian coordinate helper
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

// Generate SVG Path for annular sector (arc)
function describeArc(x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
  let diff = endAngle - startAngle;
  if (diff >= 360) {
    endAngle = startAngle + 359.99;
  }
  
  const start = polarToCartesian(x, y, outerRadius, endAngle);
  const end = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, startAngle);
  const endInner = polarToCartesian(x, y, innerRadius, endAngle);
  
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    "M", start.x, start.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
    "L", startInner.x, startInner.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, endInner.x, endInner.y,
    "Z"
  ].join(" ");
}

// Helper to calculate HSL derivatives for nested segments
function getDerivativeColor(parentHex: string, index: number, total: number) {
  // Simple hex to RGB
  let r = parseInt(parentHex.substring(1, 3), 16);
  let g = parseInt(parentHex.substring(3, 5), 16);
  let b = parseInt(parentHex.substring(5, 7), 16);

  // Shift colors dynamically for children
  const factor = (index / (total || 1)) * 30 - 15; // Shift color slightly
  r = Math.max(10, Math.min(245, r + factor));
  g = Math.max(10, Math.min(245, g + factor));
  b = Math.max(10, Math.min(245, b + factor));

  const rHex = Math.round(r).toString(16).padStart(2, '0');
  const gHex = Math.round(g).toString(16).padStart(2, '0');
  const bHex = Math.round(b).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

export function SunburstChartCard({
  title = "Hierarchical Distribution",
  description = "Interactive hierarchical slice drill-down analysis.",
  data,
  state = 'normal',
  onRefresh,
  className
}: SunburstChartCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<{ node: SunburstNode; percent: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Deep clone data to calculate values recursively
  const processedData = useMemo(() => {
    const clone = JSON.parse(JSON.stringify(data)) as SunburstNode;
    
    function computeValues(node: SunburstNode): number {
      if (node.children && node.children.length > 0) {
        node.value = node.children.reduce((sum, child) => sum + computeValues(child), 0);
      }
      return node.value || 0;
    }
    
    computeValues(clone);
    return clone;
  }, [data]);

  // Drilldown history stack
  const [history, setHistory] = useState<SunburstNode[]>([]);
  
  useEffect(() => {
    setHistory([processedData]);
  }, [processedData]);

  const currentRoot = history[history.length - 1] || processedData;
  const totalVal = currentRoot.value || 1;

  // Curated color palette
  const basePalette = [
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f43f5e', // Rose
    '#14b8a6', // Teal
  ];

  // Resolve direct child colors
  const childrenWithColors = useMemo(() => {
    if (!currentRoot.children) return [];
    return currentRoot.children.map((child, index) => {
      const color = child.color || basePalette[index % basePalette.length];
      return { ...child, color };
    });
  }, [currentRoot, basePalette]);

  // Compute all visible SVG arcs dynamically
  const arcs = useMemo(() => {
    const result: RenderArcData[] = [];
    const centerX = 200;
    const centerY = 200;
    const innerRadius = 60;
    const ringWidth = 55;

    function buildArcs(
      node: SunburstNode,
      depth: number,
      startAngle: number,
      endAngle: number,
      parentColor: string
    ) {
      if (depth > 2 || !node.children || node.children.length === 0) return;

      const nodeTotal = node.value || 1;
      let currentStart = startAngle;

      node.children.forEach((child, index) => {
        const percent = (child.value || 0) / nodeTotal;
        const angleSpan = (endAngle - startAngle) * percent;
        const childEnd = currentStart + angleSpan;

        // Visual arc coordinates
        const rInner = innerRadius + (depth - 1) * ringWidth;
        const rOuter = rInner + ringWidth - 4; // slight gap between rings

        const childColor = child.color || getDerivativeColor(parentColor, index, node.children!.length);

        const path = describeArc(centerX, centerY, rInner, rOuter, currentStart, childEnd);

        result.push({
          node: child,
          path,
          depth,
          startAngle: currentStart,
          endAngle: childEnd,
          color: childColor
        });

        // Recurse to next ring
        buildArcs(child, depth + 1, currentStart, childEnd, childColor);

        currentStart = childEnd;
      });
    }

    // Level 1 Arcs
    let start = 0;
    childrenWithColors.forEach((child) => {
      const percent = (child.value || 0) / totalVal;
      const span = 360 * percent;
      const end = start + span;
      
      const rInner = innerRadius;
      const rOuter = rInner + ringWidth - 4;
      const path = describeArc(centerX, centerY, rInner, rOuter, start, end);

      result.push({
        node: child,
        path,
        depth: 1,
        startAngle: start,
        endAngle: end,
        color: child.color!
      });

      // Level 2 Grandchildren Arcs
      buildArcs(child, 2, start, end, child.color!);

      start = end;
    });

    return result;
  }, [childrenWithColors, totalVal]);

  const handleDrillDown = (node: SunburstNode) => {
    if (node.children && node.children.length > 0) {
      setHistory(prev => [...prev, node]);
      setHoveredNode(null);
      toast.success(`Drilled down to: ${node.name}`);
    } else {
      toast.info(`Leaf node "${node.name}" has no sub-categories to drill into.`);
    }
  };

  const handleDrillUp = (index: number) => {
    setHistory(prev => prev.slice(0, index + 1));
    setHoveredNode(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 12,
      y: e.clientY - rect.top + 12
    });
  };

  const handleExport = (type: 'png' | 'csv' | 'svg') => {
    setShowExportMenu(false);
    toast.success(`Exporting hierarchy dataset as ${type.toUpperCase()}...`);
  };

  // Render States
  if (state === 'loading') {
    return (
      <Card className={cn("flex flex-col h-[520px] shadow-sm", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center gap-6">
          <Skeleton className="h-64 w-64 rounded-full" />
          <div className="w-full max-w-sm space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state === 'empty') {
    return (
      <Card className={cn("flex flex-col h-[520px] items-center justify-center text-center p-6 border-dashed border-neutral-300 dark:border-neutral-800", className)}>
        <Inbox className="w-12 h-12 text-neutral-400 mb-4 stroke-[1.2]" />
        <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">No Hierarchical Data</h4>
        <p className="text-xs text-neutral-500 mt-1 max-w-[280px]">There is no segmented data structures to map.</p>
      </Card>
    );
  }

  if (state === 'error') {
    return (
      <Card className={cn("flex flex-col h-[520px] items-center justify-center text-center p-6 border-error-100 bg-error-50/10", className)}>
        <AlertTriangle className="w-12 h-12 text-error-500 mb-4 stroke-[1.2]" />
        <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Chart Loading Failure</h4>
        <p className="text-xs text-neutral-500 mt-1 max-w-[280px] mb-4">Could not parse hierarchical data structures.</p>
        <Button size="sm" variant="outline" className="border-error-200 text-error-600 hover:bg-error-50" onClick={onRefresh}>
          Retry Render
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn(
        "flex flex-col h-[520px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm relative transition-all duration-300",
        isFullscreen ? "fixed inset-4 z-50 h-auto" : "",
        className
      )}>
        {/* Card Header */}
        <CardHeader className="flex flex-row items-start justify-between pb-1 shrink-0">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              {title}
              <Badge variant="outline" className="text-[10px] font-normal border-neutral-200 dark:border-neutral-700 py-0 px-1.5 rounded-full capitalize">
                Level {history.length}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-neutral-500">{description}</CardDescription>
          </div>

          <div className="flex items-center gap-1">
            {/* Export Action */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download className="w-4 h-4" />
              </Button>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-20 overflow-hidden py-1">
                    <button onClick={() => handleExport('svg')} className="w-full px-3 py-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2">
                      <FileImage className="w-3.5 h-3.5 text-neutral-400" />
                      Export as SVG
                    </button>
                    <button onClick={() => handleExport('png')} className="w-full px-3 py-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2">
                      <FileImage className="w-3.5 h-3.5 text-neutral-400" />
                      Export as PNG
                    </button>
                    <button onClick={() => handleExport('csv')} className="w-full px-3 py-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-neutral-400" />
                      Export CSV Data
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Refresh Action */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
              onClick={onRefresh}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>

            {/* Fullscreen Action */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>

        {/* Dynamic Breadcrumbs Bar */}
        <div className="px-6 py-2 border-b border-neutral-100 dark:border-neutral-800 shrink-0 flex items-center gap-1.5 flex-wrap">
          {history.map((node, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600 shrink-0" />}
              <button
                onClick={() => handleDrillUp(index)}
                disabled={index === history.length - 1}
                className={cn(
                  "text-xs font-semibold rounded px-1.5 py-0.5 transition-colors cursor-pointer",
                  index === history.length - 1
                    ? "text-neutral-900 dark:text-white font-bold bg-neutral-100 dark:bg-neutral-800/80 cursor-default"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                )}
              >
                {node.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Content Body */}
        <CardContent 
          className="flex-1 overflow-hidden p-6 flex flex-col lg:flex-row items-center gap-6 relative"
          onMouseMove={handleMouseMove}
        >
          {/* SVG Sunburst Ring Area */}
          <div className="flex-1 flex items-center justify-center w-full max-w-[340px] aspect-square relative select-none">
            <svg 
              viewBox="0 0 400 400" 
              className="w-full h-full transform transition-transform duration-500"
            >
              {/* Outer arcs */}
              {arcs.map((arc, index) => {
                const isHovered = hoveredNode?.node.name === arc.node.name;
                return (
                  <path
                    key={`${arc.node.name}-${index}`}
                    d={arc.path}
                    fill={arc.color}
                    className="transition-all duration-300 cursor-pointer stroke-white dark:stroke-neutral-900"
                    strokeWidth="1.8"
                    opacity={hoveredNode ? (isHovered ? 1 : 0.45) : 0.85}
                    onClick={() => handleDrillDown(arc.node)}
                    onMouseEnter={() => {
                      const percent = ((arc.node.value || 0) / totalVal) * 100;
                      setHoveredNode({ node: arc.node, percent });
                    }}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                );
              })}

              {/* Center Circle (Root Drill-up Button) */}
              <circle
                cx="200"
                cy="200"
                r="56"
                className={cn(
                  "fill-white dark:fill-neutral-900 stroke-neutral-200 dark:stroke-neutral-800 transition-colors",
                  history.length > 1 ? "cursor-pointer hover:fill-neutral-50 dark:hover:fill-neutral-800/80" : ""
                )}
                strokeWidth="2"
                onClick={() => history.length > 1 && handleDrillUp(history.length - 2)}
                onMouseEnter={() => {
                  if (history.length > 1) {
                    const parentNode = history[history.length - 2];
                    setHoveredNode({ node: parentNode, percent: 100 });
                  }
                }}
                onMouseLeave={() => setHoveredNode(null)}
              />
            </svg>

            {/* Inner Center Label Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-3 select-none">
              <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 dark:text-neutral-500">
                {history.length > 1 ? "Click to Drill Up" : "Total Value"}
              </span>
              <span className="text-base font-bold text-neutral-800 dark:text-white mt-0.5 truncate max-w-[90px]">
                {currentRoot.name}
              </span>
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
                ${(currentRoot.value || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Interactive Legend Side Panel */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center gap-3 overflow-y-auto max-h-[280px] lg:max-h-[300px] border-t lg:border-t-0 lg:border-l border-neutral-100 dark:border-neutral-800 pt-4 lg:pt-0 lg:pl-6">
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5 shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-primary-500" />
              Slices under {currentRoot.name}
            </h4>
            
            <div className="space-y-1.5 pr-2">
              {childrenWithColors.map((child, index) => {
                const percent = ((child.value || 0) / totalVal) * 100;
                const isHovered = hoveredNode?.node.name === child.name;

                return (
                  <div
                    key={child.name}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg transition-all duration-200 border border-transparent select-none cursor-pointer",
                      isHovered 
                        ? "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 shadow-sm"
                        : "hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20"
                    )}
                    onClick={() => handleDrillDown(child)}
                    onMouseEnter={() => setHoveredNode({ node: child, percent })}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <div className="flex items-center gap-2 max-w-[65%]">
                      <div 
                        className="w-3 h-3 rounded-full shrink-0 border border-white dark:border-neutral-900" 
                        style={{ backgroundColor: child.color }}
                      />
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">
                        {child.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        ${(child.value || 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 min-w-[36px] text-right">
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mouse Hover Tooltip Overlay */}
          {hoveredNode && (
            <div 
              className="absolute bg-neutral-900/95 dark:bg-black/95 border border-neutral-800 rounded-lg p-2.5 shadow-xl text-white pointer-events-none select-none z-30 transition-opacity duration-150 max-w-[200px]"
              style={{ 
                left: `${tooltipPos.x}px`, 
                top: `${tooltipPos.y}px`
              }}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hoveredNode.node.color || '#3b82f6' }} />
                Hierarchy Segment
              </div>
              <h5 className="text-xs font-bold mt-1 text-white truncate">{hoveredNode.node.name}</h5>
              <div className="mt-1.5 pt-1.5 border-t border-neutral-800 flex flex-col gap-0.5">
                <div className="flex items-center justify-between text-[11px] gap-4">
                  <span className="text-neutral-400">Value:</span>
                  <span className="font-bold text-primary-400">${(hoveredNode.node.value || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] gap-4">
                  <span className="text-neutral-400">Share:</span>
                  <span className="font-bold text-white">{hoveredNode.percent.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
